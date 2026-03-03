import json
import sys
import time
from datetime import datetime, timezone

import requests

# Force UTF-8 output on Windows consoles (cp950 can't encode all CJK characters)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"
HEADERS = {
    "User-Agent": "ArtDataFetcher/1.0 (art data research project)",
    "Accept": "application/sparql-results+json",
}

MOVEMENTS_QUERY = """
SELECT ?movement ?movementLabel (COUNT(?painting) AS ?paintingCount) WHERE {
  ?painting wdt:P31 wd:Q3305213.
  ?painting wdt:P135 ?movement.
  ?movement wdt:P31/wdt:P279* wd:Q968159.
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "zh-hant,zh,en".
  }
}
GROUP BY ?movement ?movementLabel
ORDER BY DESC(?paintingCount)
LIMIT 20
"""

ARTISTS_PAINTINGS_QUERY_TEMPLATE = """
SELECT ?artist ?artistLabel ?painting ?paintingLabel ?image WHERE {{
  VALUES ?movement {{ wd:{movement_id} }}
  ?painting wdt:P31 wd:Q3305213.
  ?painting wdt:P135 ?movement.
  ?painting wdt:P170 ?artist.
  OPTIONAL {{ ?painting wdt:P18 ?image. }}
  SERVICE wikibase:label {{
    bd:serviceParam wikibase:language "zh-hant,zh,en".
  }}
}}
LIMIT 200
"""


def sparql_query(query: str) -> list[dict]:
    max_retries = 3
    wait = 5
    for attempt in range(max_retries):
        try:
            response = requests.get(
                SPARQL_ENDPOINT,
                params={"query": query, "format": "json"},
                headers=HEADERS,
                timeout=60,
            )
            if response.status_code == 429:
                retry_after = int(response.headers.get("Retry-After", wait))
                print(f"  Rate limited. Waiting {retry_after}s before retry {attempt + 1}/{max_retries}...")
                time.sleep(retry_after)
                wait *= 2
                continue
            response.raise_for_status()
            data = response.json()
            return data.get("results", {}).get("bindings", [])
        except requests.exceptions.RequestException as e:
            if attempt < max_retries - 1:
                print(f"  Request failed: {e}. Retrying in {wait}s...")
                time.sleep(wait)
                wait *= 2
            else:
                print(f"  Request failed after {max_retries} attempts: {e}")
                return []
    return []


def extract_qid(uri: str) -> str:
    return uri.rsplit("/", 1)[-1]


def extract_value(binding: dict, key: str) -> str:
    return binding.get(key, {}).get("value", "")


def fetch_movements(limit: int = 20) -> list[dict]:
    print("Fetching top art movements...")
    rows = sparql_query(MOVEMENTS_QUERY)
    movements = []
    for row in rows:
        uri = extract_value(row, "movement")
        label = extract_value(row, "movementLabel")
        count = extract_value(row, "paintingCount")
        if not uri:
            continue
        qid = extract_qid(uri)
        movements.append({
            "id": qid,
            "label": label,
            "painting_count": int(count) if count.isdigit() else 0,
        })
    print(f"  Found {len(movements)} movements.")
    return movements


def fetch_artists_and_paintings(movement_id: str) -> list[dict]:
    query = ARTISTS_PAINTINGS_QUERY_TEMPLATE.format(movement_id=movement_id)
    rows = sparql_query(query)
    results = []
    for row in rows:
        artist_uri = extract_value(row, "artist")
        painting_uri = extract_value(row, "painting")
        if not artist_uri or not painting_uri:
            continue
        results.append({
            "artist_id": extract_qid(artist_uri),
            "artist_label": extract_value(row, "artistLabel"),
            "painting_id": extract_qid(painting_uri),
            "painting_label": extract_value(row, "paintingLabel"),
            "image_url": extract_value(row, "image"),
        })
    return results


def is_chinese(text: str) -> bool:
    return any("\u4e00" <= ch <= "\u9fff" for ch in text)


def split_label(label: str) -> tuple[str, str]:
    """Return (name_zh, name_en) from a label string.

    Wikidata returns a single label per the preferred language chain.
    If the label contains CJK characters it is Chinese → name_zh, and
    name_en gets the same value as a fallback (and vice versa).
    """
    if is_chinese(label):
        return label, label   # zh primary, en fallback
    return label, label       # en primary, zh fallback


def build_output(movements: list[dict], per_movement_data: dict) -> dict:
    result_movements = []

    for movement in movements:
        mid = movement["id"]
        raw_label = movement["label"]
        mzh, men = split_label(raw_label)

        # Group flat rows by artist
        artists_map: dict[str, dict] = {}
        for row in per_movement_data.get(mid, []):
            aid = row["artist_id"]
            if aid not in artists_map:
                azh, aen = split_label(row["artist_label"])
                print(f"    Artist: {azh or aen} ({aid})")
                artists_map[aid] = {
                    "id": aid,
                    "name_en": aen,
                    "name_zh": azh,
                    "paintings": [],
                }
            artist = artists_map[aid]
            if len(artist["paintings"]) < 5:
                pid = row["painting_id"]
                plabel = row["painting_label"]
                # Skip paintings whose label is just their Q-ID (no human-readable name)
                if plabel == pid or not plabel:
                    continue
                pzh, pen = split_label(plabel)
                painting = {
                    "id": pid,
                    "name_en": pen,
                    "name_zh": pzh,
                }
                if row["image_url"]:
                    painting["image_url"] = row["image_url"]
                # Deduplicate paintings within the same artist
                if not any(p["id"] == pid for p in artist["paintings"]):
                    artist["paintings"].append(painting)

        result_movements.append({
            "id": mid,
            "name_en": men,
            "name_zh": mzh,
            "painting_count": movement["painting_count"],
            "artists": list(artists_map.values()),
        })

    return {
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "art_movements": result_movements,
    }


def main():
    movements = fetch_movements()
    if not movements:
        print("No movements found. Exiting.")
        return

    per_movement_data: dict[str, list[dict]] = {}
    for i, movement in enumerate(movements, 1):
        mid = movement["id"]
        label = movement["label"]
        print(f"[{i}/{len(movements)}] Fetching artists & paintings for: {label} ({mid})...")
        rows = fetch_artists_and_paintings(mid)
        per_movement_data[mid] = rows
        print(f"  Got {len(rows)} rows.")
        if i < len(movements):
            time.sleep(1)

    output = build_output(movements, per_movement_data)

    output_path = "art_data.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    total_artists = sum(len(m["artists"]) for m in output["art_movements"])
    total_paintings = sum(
        len(a["paintings"])
        for m in output["art_movements"]
        for a in m["artists"]
    )
    print(f"\nDone! Saved to {output_path}")
    print(f"  Movements : {len(output['art_movements'])}")
    print(f"  Artists   : {total_artists}")
    print(f"  Paintings : {total_paintings}")


if __name__ == "__main__":
    main()
