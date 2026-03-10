"""Fetches Wikipedia thumbnails for additional American cartoon artists."""
import json, sys, time, requests

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary/{title}"
HEADERS = {"User-Agent": "ArtDataFetcher/1.0"}

WIKI_TITLES = {
    "tex-avery":       "Tex_Avery",
    "ta-1":            "Droopy",
    "ta-2":            "Screwball_Squirrel",

    "bill-hanna":      "William_Hanna",
    "joe-barbera":     "Joseph_Barbera",
    "hb-1":            "Tom_and_Jerry",
    "hb-2":            "The_Flintstones",
    "hb-3":            "Scooby-Doo",
    "hb-4":            "Yogi_Bear",

    "ralph-bakshi":    "Ralph_Bakshi",
    "rb-1":            "Fritz_the_Cat_(film)",
    "rb-2":            "Wizards_(film)",
    "rb-3":            "The_Lord_of_the_Rings_(1978_film)",

    "mary-blair":      "Mary_Blair",
    "mb-1":            "Cinderella_(1950_film)",
    "mb-2":            "Alice_in_Wonderland_(1951_film)",
    "mb-3":            "Peter_Pan_(1953_film)",

    "ward-kimball":    "Ward_Kimball",
    "wk-1":            "Fantasia_(1940_film)",
    "wk-2":            "Pinocchio_(1940_film)",
    "wk-3":            "Bambi_(1942_film)",

    "matt-groening":   "Matt_Groening",
    "mg-1":            "The_Simpsons",
    "mg-2":            "Futurama",

    "mike-judge":      "Mike_Judge",
    "mj-1":            "Beavis_and_Butt-Head",
    "mj-2":            "King_of_the_Hill",

    "seth-macfarlane": "Seth_MacFarlane",
    "sm-1":            "Family_Guy",
    "sm-2":            "American_Dad!",

    "pendleton-ward":  "Pendleton_Ward",
    "pw-1":            "Adventure_Time",

    "alex-hirsch":     "Alex_Hirsch",
    "ah-1":            "Gravity_Falls",

    "jg-quintel":      "J._G._Quintel",
    "jq-1":            "Regular_Show",

    "bill-plympton":   "Bill_Plympton",
    "bp-1":            "I_Married_a_Strange_Person!",
    "bp-2":            "Guard_Dog_(film)",
}


def fetch_thumb(local_id, title):
    url = WIKI_API.format(title=title)
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code == 404:
            print(f"  ✗  {local_id:35s} 404: {title}")
            return None
        if r.status_code == 429:
            time.sleep(10)
            return fetch_thumb(local_id, title)
        r.raise_for_status()
        data = r.json()
        thumb = data.get("thumbnail", {}).get("source") or \
                data.get("originalimage", {}).get("source")
        print(f"  {'✓' if thumb else '-'}  {local_id:35s}" + (f" → {thumb[:70]}" if thumb else " no image"))
        return thumb
    except Exception as e:
        print(f"  ✗  {local_id:35s} error: {e}")
        return None


def main():
    print(f"Fetching {len(WIKI_TITLES)} Wikipedia thumbnails...\n")
    result = {}
    for i, (lid, title) in enumerate(WIKI_TITLES.items()):
        img = fetch_thumb(lid, title)
        if img:
            result[lid] = img
        if i % 3 == 2:
            time.sleep(1)

    print(f"\nGot {len(result)} / {len(WIKI_TITLES)} images.")
    with open("more_animation_images.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print("Saved to more_animation_images.json")

if __name__ == "__main__":
    main()
