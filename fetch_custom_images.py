"""
Fetches representative images for custom panel artists/works via the
Wikipedia REST API (page summary), which reliably returns the lead image
(movie poster, cover art, portrait) for each article.
"""
import json
import sys
import time
import requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
HEADERS = {"User-Agent": "ArtDataFetcher/1.0 (art data research project)"}

# Maps local panel IDs → Wikipedia article titles
WIKI_TITLES = {
    # ── American Animation ───────────────────────────────────────────
    "chuck-jones":          "Chuck_Jones",
    "cj-1":                 "Bugs_Bunny",
    "cj-2":                 "Wile_E._Coyote_and_the_Road_Runner",
    "cj-3":                 "How_the_Grinch_Stole_Christmas!_(TV_special)",

    "don-bluth":            "Don_Bluth",
    "db-1":                 "An_American_Tail",
    "db-2":                 "The_Land_Before_Time",
    "db-3":                 "Anastasia_(1997_film)",

    "glen-keane":           "Glen_Keane",
    "gk-1":                 "The_Little_Mermaid_(1989_film)",
    "gk-2":                 "Beauty_and_the_Beast_(1991_film)",
    "gk-3":                 "Tangled",

    "eric-goldberg":        "Eric_Goldberg_(animator)",
    "eg-1":                 "Aladdin_(1992_film)",
    "eg-2":                 "Hercules_(1997_film)",
    "eg-3":                 "Fantasia_2000",

    "brad-bird":            "Brad_Bird",
    "bb-1":                 "The_Iron_Giant",
    "bb-2":                 "The_Incredibles",
    "bb-3":                 "Ratatouille_(film)",

    "pete-docter":          "Pete_Docter",
    "pd-1":                 "Monsters,_Inc.",
    "pd-2":                 "Up_(2009_film)",
    "pd-3":                 "Inside_Out_(2015_film)",
    "pd-4":                 "Soul_(2020_film)",

    "genndy-tartakovsky":   "Genndy_Tartakovsky",
    "gt-1":                 "Dexter's_Laboratory",
    "gt-2":                 "Samurai_Jack",
    "gt-3":                 "Star_Wars:_Clone_Wars_(2003_TV_series)",

    "rebecca-sugar":        "Rebecca_Sugar",
    "rs-1":                 "Steven_Universe",
    "rs-2":                 "Steven_Universe:_The_Movie",

    "lauren-faust":         "Lauren_Faust",
    "lf-1":                 "The_Powerpuff_Girls",
    "lf-2":                 "My_Little_Pony:_Friendship_Is_Magic",

    "john-kricfalusi":      "John_Kricfalusi",
    "jk-1":                 "The_Ren_%26_Stimpy_Show",

    # ── Japanese Anime ───────────────────────────────────────────────
    "osamu-tezuka":         "Osamu_Tezuka",
    "ot-1":                 "Astro_Boy",
    "ot-2":                 "Black_Jack_(manga)",
    "ot-3":                 "Phoenix_(manga)",

    "akira-toriyama":       "Akira_Toriyama",
    "at-1":                 "Dragon_Ball",
    "at-2":                 "Dr._Slump",
    "at-3":                 "Final_Fantasy_IX",

    "katsuhiro-otomo":      "Katsuhiro_Otomo",
    "ko-1":                 "Akira_(manga)",
    "ko-2":                 "Metropolis_(2001_film)",

    "hayao-miyazaki":       "Hayao_Miyazaki",
    "hm-1":                 "Nausicaä_of_the_Valley_of_the_Wind_(film)",
    "hm-2":                 "Castle_in_the_Sky",
    "hm-3":                 "My_Neighbor_Totoro",
    "hm-4":                 "Spirited_Away",
    "hm-5":                 "Howl's_Moving_Castle_(film)",

    "yoshitaka-amano":      "Yoshitaka_Amano",
    "ya-1":                 "Final_Fantasy_(video_game)",
    "ya-2":                 "Vampire_Hunter_D",

    "mamoru-oshii":         "Mamoru_Oshii",
    "mo-1":                 "Ghost_in_the_Shell_(1995_film)",
    "mo-2":                 "Ghost_in_the_Shell_2:_Innocence",
    "mo-3":                 "Patlabor:_The_Movie",

    "hideaki-anno":         "Hideaki_Anno",
    "ha-1":                 "Neon_Genesis_Evangelion",
    "ha-2":                 "Evangelion:_2.0_You_Can_(Not)_Advance",

    "satoshi-kon":          "Satoshi_Kon",
    "sk-1":                 "Perfect_Blue",
    "sk-2":                 "Millennium_Actress",
    "sk-3":                 "Tokyo_Godfathers",
    "sk-4":                 "Paprika_(2006_film)",

    "makoto-shinkai":       "Makoto_Shinkai",
    "ms-1":                 "5_Centimeters_per_Second",
    "ms-2":                 "The_Garden_of_Words",
    "ms-3":                 "Your_Name",
    "ms-4":                 "Weathering_with_You",
    "ms-5":                 "Suzume_(film)",

    "kentaro-miura":        "Kentaro_Miura",
    "km-1":                 "Berserk_(manga)",

    "naoki-urasawa":        "Naoki_Urasawa",
    "nu-1":                 "Monster_(manga)",
    "nu-2":                 "20th_Century_Boys",
    "nu-3":                 "Pluto_(manga)",

    "tatsuki-fujimoto":     "Tatsuki_Fujimoto",
    "tf-1":                 "Chainsaw_Man",
    "tf-2":                 "Goodbye,_Eri",
    "tf-3":                 "Look_Back_(manga)",
}


def fetch_thumb(local_id, title):
    url = WIKI_API.format(title=title)
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code == 404:
            print(f"  ✗  {local_id:35s} 404: {title}")
            return None
        if r.status_code == 429:
            print(f"  Rate limited. Sleeping 10s...")
            time.sleep(10)
            return fetch_thumb(local_id, title)
        r.raise_for_status()
        data = r.json()
        thumb = data.get("thumbnail", {}).get("source") or \
                data.get("originalimage", {}).get("source")
        if thumb:
            print(f"  ✓  {local_id:35s} → {thumb[:70]}")
        else:
            print(f"  -  {local_id:35s} no image in article")
        return thumb
    except Exception as e:
        print(f"  ✗  {local_id:35s} error: {e}")
        return None


def main():
    print(f"Fetching {len(WIKI_TITLES)} Wikipedia thumbnails...\n")
    result = {}
    for i, (local_id, title) in enumerate(WIKI_TITLES.items()):
        img = fetch_thumb(local_id, title)
        if img:
            result[local_id] = img
        # Be polite — 3 requests/second max
        if i % 3 == 2:
            time.sleep(1)

    print(f"\nGot images for {len(result)} / {len(WIKI_TITLES)} items.")

    with open("custom_images.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("Saved to custom_images.json")


if __name__ == "__main__":
    main()
