"""
fetch_missing_images.py
找出 art_data.json 中缺少 image_url 的畫作，向 Wikidata 補抓，回寫 JSON。
用法: python fetch_missing_images.py
"""
import json, time, sys
import requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SPARQL_ENDPOINT = "https://query.wikidata.org/sparql"
HEADERS = {
    "User-Agent": "ArtDataFetcher/1.0 (art education project)",
    "Accept": "application/sparql-results+json",
}
DATA_PATH = "art_data.json"
BATCH = 40  # QIDs per SPARQL query


def sparql_query(query):
    for attempt in range(3):
        try:
            r = requests.get(SPARQL_ENDPOINT, params={"query": query, "format": "json"},
                             headers=HEADERS, timeout=60)
            if r.status_code == 429:
                wait = int(r.headers.get("Retry-After", 10))
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
                continue
            r.raise_for_status()
            return r.json().get("results", {}).get("bindings", [])
        except Exception as e:
            print(f"  Error: {e}, retrying...")
            time.sleep(5 * (attempt + 1))
    return []


def fetch_images_for(qids):
    values = " ".join(f"wd:{q}" for q in qids)
    query = f"""
SELECT ?painting ?image WHERE {{
  VALUES ?painting {{ {values} }}
  ?painting wdt:P18 ?image.
}}
"""
    rows = sparql_query(query)
    result = {}
    for row in rows:
        qid = row["painting"]["value"].rsplit("/", 1)[-1]
        img = row["image"]["value"]
        if qid not in result:  # take first image only
            result[qid] = img
    return result


def main():
    with open(DATA_PATH, encoding="utf-8") as f:
        data = json.load(f)

    # Collect paintings missing image_url
    missing = []  # list of (movement_idx, artist_idx, painting_idx, qid)
    for mi, movement in enumerate(data["art_movements"]):
        for ai, artist in enumerate(movement["artists"]):
            for pi, painting in enumerate(artist["paintings"]):
                if not painting.get("image_url"):
                    missing.append((mi, ai, pi, painting["id"]))

    print(f"Found {len(missing)} paintings without image_url")
    if not missing:
        print("Nothing to do.")
        return

    # Batch query Wikidata
    found = 0
    for i in range(0, len(missing), BATCH):
        batch = missing[i:i + BATCH]
        qids = [m[3] for m in batch]
        print(f"  Querying batch {i//BATCH + 1}/{(len(missing)-1)//BATCH + 1} ({len(qids)} QIDs)...")
        images = fetch_images_for(qids)
        for mi, ai, pi, qid in batch:
            if qid in images:
                data["art_movements"][mi]["artists"][ai]["paintings"][pi]["image_url"] = images[qid]
                found += 1
        time.sleep(2)

    print(f"\nFilled in {found} / {len(missing)} missing images")

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Saved to {DATA_PATH}")
    print("Next: copy to web/public/art_data.json")


if __name__ == "__main__":
    main()
