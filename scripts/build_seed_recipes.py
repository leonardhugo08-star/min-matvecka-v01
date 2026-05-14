#!/usr/bin/env python3
"""Build Min Matvecka seed recipes and image prompts.
Original, template-generated Swedish recipe copy — no copied recipe text.
"""
from __future__ import annotations

import csv
import json
import re
import unicodedata
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "seed-recipes"
IMG_DIR = OUT / "images"
STYLE = (
    "realistic appetizing home-cooked Swedish family dinner, beautifully plated on a simple ceramic plate, "
    "fresh modern Scandinavian kitchen table setting, natural daylight, soft shadows, clean beige and warm wood tones, "
    "realistic food texture, inviting everyday meal, little premium but still weekday dinner, not luxury restaurant, "
    "not fine dining, not overstyled, not cartoon, not illustration, not glossy stock photo, no text, no hands, no people, no logos"
)

CATEGORIES = ["vardag", "helg", "barnfavorit", "vegetariskt", "fisk", "kyckling", "kött", "pasta", "soppa", "budget"]

def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text.lower())
    text = "".join(ch for ch in text if not unicodedata.combining(ch))
    text = text.replace("å", "a").replace("ä", "a").replace("ö", "o")
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text

# Popular Swedish-family dinner ideas, intentionally broad and ordinary.
# Each item: title, category, tags, minutes, difficulty, ingredients, english image subject, description lead.
BASE_DISHES = [
    # Swedish classics / meat
    ("Köttbullar med potatismos och lingon", "kött", ["husman", "barnvänligt", "klassiker"], 35, "easy", [("köttbullar", "500 g"), ("potatis", "900 g"), ("mjölk", "1 dl"), ("lingon", "1 dl"), ("gurka", "1 st")], "Swedish meatballs with mashed potatoes, creamy gravy, lingonberry jam and cucumber", "En trygg svensk klassiker med mjukt mos, saftiga köttbullar och fräsch gurka."),
    ("Köttbullar med kokt potatis och gräddsås", "kött", ["husman", "vardag", "klassiker"], 35, "easy", [("köttbullar", "500 g"), ("potatis", "900 g"), ("gräddsås", "3 dl"), ("lingon", "1 dl"), ("pressgurka", "1 dl")], "Swedish meatballs with boiled potatoes, creamy gravy, lingonberry jam and pickled cucumber", "Klassisk husmanskost som passar både vardag och söndag."),
    ("Korvstroganoff med ris", "barnfavorit", ["snabbt", "barnvänligt", "budget"], 25, "easy", [("falukorv", "500 g"), ("ris", "3 dl"), ("krossade tomater", "1 burk"), ("matlagningsgrädde", "2 dl"), ("lök", "1 st")], "creamy Swedish sausage stroganoff with rice", "Krämig, mild och snabb vardagsfavorit med ris."),
    ("Falukorv i ugn med potatismos", "barnfavorit", ["barnvänligt", "budget", "husman"], 40, "easy", [("falukorv", "600 g"), ("potatis", "900 g"), ("ost", "2 dl"), ("tomat", "2 st"), ("senap", "2 msk")], "oven baked Swedish falukorv sausage with mashed potatoes, tomato and melted cheese", "En enkel ugnsrätt som känns hemtrevlig och mättande."),
    ("Pytt i panna med stekt ägg", "budget", ["snabbt", "rester", "husman"], 25, "easy", [("potatis", "700 g"), ("kött eller korv", "400 g"), ("ägg", "4 st"), ("rödbetor", "2 dl"), ("lök", "1 st")], "Swedish pytt i panna hash with fried egg and pickled beetroot", "Smart restmat som blir en riktig vardagsmiddag."),
    ("Biffar med potatis och brunsås", "kött", ["husman", "mättande"], 40, "medium", [("blandfärs", "500 g"), ("potatis", "900 g"), ("grädde", "2 dl"), ("lök", "1 st"), ("morötter", "3 st")], "pan fried Swedish beef patties with boiled potatoes, brown sauce and carrots", "Saftiga biffar med klassiska tillbehör och mild sås."),
    ("Pannbiff med lök och potatis", "kött", ["husman", "klassiker"], 45, "medium", [("nötfärs", "500 g"), ("potatis", "900 g"), ("gul lök", "3 st"), ("grädde", "2 dl"), ("lingon", "1 dl")], "Swedish pannbiff beef patties with fried onions, potatoes and lingonberries", "En rejäl husmansrätt med sötstekt lök och potatis."),
    ("Kålpudding med potatis och lingon", "helg", ["husman", "klassiker"], 60, "medium", [("blandfärs", "500 g"), ("vitkål", "700 g"), ("potatis", "900 g"), ("sirap", "1 msk"), ("lingon", "1 dl")], "Swedish cabbage pudding with boiled potatoes and lingonberries", "Mild och mustig klassiker som sköter sig i ugnen."),
    ("Köttfärslimpa med gräddsås", "kött", ["husman", "familj"], 55, "medium", [("blandfärs", "600 g"), ("potatis", "900 g"), ("grädde", "2 dl"), ("morötter", "3 st"), ("lingon", "1 dl")], "Swedish meatloaf with cream sauce, potatoes, carrots and lingonberries", "En familjevänlig ugnsrätt med klassiska smaker."),
    ("Raggmunk med fläsk och lingon", "helg", ["husman", "klassiker"], 45, "medium", [("potatis", "900 g"), ("ägg", "2 st"), ("mjöl", "2 dl"), ("rimmat fläsk", "400 g"), ("lingon", "1 dl")], "Swedish potato pancakes raggmunk with crispy pork and lingonberries", "Frasig husmansfavorit med sälta och lingon."),
    ("Kroppkakor med lingon och smör", "helg", ["husman", "mättande"], 60, "medium", [("kroppkakor", "8 st"), ("smör", "50 g"), ("lingon", "1 dl"), ("vitkålssallad", "1 skål")], "Swedish potato dumplings kroppkakor with lingonberries and melted butter", "Mättande svensk klassiker med enkla fräscha tillbehör."),
    ("Rotmos med fläskkorv", "budget", ["husman", "budget"], 45, "easy", [("kålrot", "600 g"), ("potatis", "500 g"), ("morötter", "3 st"), ("fläskkorv", "500 g"), ("senap", "2 msk")], "Swedish root vegetable mash rotmos with pork sausage and mustard", "Värmande, billig och klassisk vardagsmat."),
    ("Kalops med potatis och rödbetor", "helg", ["gryta", "husman"], 90, "medium", [("högrev", "700 g"), ("potatis", "900 g"), ("morötter", "4 st"), ("lök", "2 st"), ("rödbetor", "2 dl")], "Swedish beef stew kalops with potatoes, carrots and pickled beetroot", "Mustig gryta med mild kryddning och klassiska tillbehör."),
    ("Fläskpannkaka med lingon", "barnfavorit", ["barnvänligt", "budget", "ugn"], 35, "easy", [("ägg", "4 st"), ("mjöl", "3 dl"), ("mjölk", "7 dl"), ("bacon", "280 g"), ("lingon", "1 dl")], "Swedish oven pancake with bacon and lingonberry jam", "En enkel ugnsfavorit som räcker till många."),
    ("Pannkakor med bär och keso", "barnfavorit", ["barnvänligt", "vegetariskt"], 30, "easy", [("pannkakor", "12 st"), ("bär", "3 dl"), ("keso", "250 g"), ("sylt", "1 dl"), ("morötter", "3 st")], "thin Swedish pancakes with berries, cottage cheese and carrot sticks", "Barnvänlig middag med lite mer mättnad från keso."),
    ("Ärtsoppa med pannkakor", "soppa", ["husman", "budget"], 35, "easy", [("ärtsoppa", "1 liter"), ("timjan", "1 tsk"), ("pannkakor", "8 st"), ("sylt", "1 dl")], "Swedish yellow pea soup with thin pancakes and jam", "Torsdagsklassiker som är billig, mättande och enkel."),
    ("Isterband med dillstuvad potatis", "helg", ["husman", "klassiker"], 45, "medium", [("isterband", "4 st"), ("potatis", "900 g"), ("mjölk", "4 dl"), ("dill", "1 kruka"), ("rödbetor", "2 dl")], "Swedish isterband sausage with dill stewed potatoes and beetroot", "Syrlig korv med krämig dillpotatis och rödbetor."),
    ("Stekt falukorv med makaroner", "budget", ["snabbt", "barnvänligt", "budget"], 20, "easy", [("falukorv", "500 g"), ("makaroner", "5 dl"), ("ketchup", "1 dl"), ("morötter", "3 st")], "fried Swedish falukorv sausage with macaroni and carrots", "Supersnabb vardagsmat när det ska vara enkelt."),
    ("Makaronipudding med skinka", "budget", ["ugn", "barnvänligt", "budget"], 45, "easy", [("makaroner", "5 dl"), ("skinka", "300 g"), ("ägg", "3 st"), ("mjölk", "5 dl"), ("ost", "2 dl")], "Swedish macaroni pudding with ham and melted cheese", "Krämig ugnsrätt som fungerar fint som matlåda."),
    ("Kasslergratäng med ris", "vardag", ["ugn", "familj"], 40, "easy", [("kassler", "500 g"), ("ris", "3 dl"), ("ananas", "1 liten burk"), ("crème fraiche", "2 dl"), ("ost", "2 dl")], "Swedish kassler ham gratin with rice, pineapple and cheese", "Mild gratäng med sötma, sälta och ris som bas."),
]

# Extend via structured popular variants.
PROTEIN_VARIANTS = {
    "kyckling": [
        ("Kycklinggryta med ris", "creamy chicken stew with rice, carrots and peas"),
        ("Kyckling i currysås med ris", "mild chicken curry sauce with rice and vegetables"),
        ("Ugnskyckling med potatis och tzatziki", "oven baked chicken with potatoes and tzatziki"),
        ("Kycklingwok med nudlar", "chicken noodle stir fry with vegetables"),
        ("Kycklingfajitas med grönsaker", "chicken fajitas with peppers, tortillas and sour cream"),
        ("Kycklingsallad med pasta", "chicken pasta salad with cucumber, tomato and creamy dressing"),
        ("Citronkyckling med bulgur", "lemon chicken with bulgur and green salad"),
        ("Kycklinglasagne", "chicken lasagna with creamy tomato sauce"),
        ("Kycklingklubbor med ris och kall sås", "roasted chicken drumsticks with rice and cold yogurt sauce"),
        ("Kycklingbiffar med potatis", "chicken patties with potatoes and cucumber salad"),
        ("Krämig kycklingpasta", "creamy chicken pasta with spinach and parmesan"),
        ("Kycklingenchiladas", "chicken enchiladas with cheese, salsa and salad"),
    ],
    "fisk": [
        ("Lax med potatis och kall dillsås", "oven baked salmon with boiled potatoes and cold dill sauce"),
        ("Panerad fisk med potatis och remoulad", "breaded white fish with potatoes, peas and remoulade sauce"),
        ("Fiskgratäng med potatismos", "Swedish fish gratin with mashed potatoes and dill"),
        ("Torsk i tomatsås med ris", "cod in tomato sauce with rice and vegetables"),
        ("Laxpasta med citron och dill", "creamy salmon pasta with lemon, dill and peas"),
        ("Fisktacos med vitlökssås", "fish tacos with cabbage, cucumber and garlic sauce"),
        ("Lax teriyaki med ris", "salmon teriyaki with rice and broccoli"),
        ("Tonfiskpasta med tomat", "tuna tomato pasta with herbs"),
        ("Räkwok med nudlar", "shrimp noodle stir fry with vegetables"),
        ("Laxburgare med potatis", "salmon burger with roasted potatoes and salad"),
        ("Ugnstorsk med äggsås", "oven baked cod with egg sauce and potatoes"),
        ("Krämig fiskgryta med potatis", "creamy fish stew with potatoes, carrots and dill"),
    ],
    "vegetariskt": [
        ("Halloumibowl med ris", "halloumi rice bowl with cucumber, tomato, corn and yogurt sauce"),
        ("Vegetarisk tacogratäng", "vegetarian taco gratin with beans, corn, cheese and salsa"),
        ("Krämig halloumipasta", "creamy halloumi pasta with tomato and spinach"),
        ("Linsgryta med ris", "red lentil stew with rice and carrots"),
        ("Vegetarisk lasagne", "vegetarian lasagna with spinach, tomato and cheese"),
        ("Falafel med couscous och vitlökssås", "falafel with couscous, salad and garlic sauce"),
        ("Bönchili med ris", "bean chili with rice, corn and sour cream"),
        ("Omelett med potatis och sallad", "potato omelette with salad and cheese"),
        ("Kikärtsgryta med kokosmjölk", "chickpea coconut stew with rice and vegetables"),
        ("Vegetariska biffar med potatis", "vegetarian patties with potatoes and cold herb sauce"),
        ("Pasta pesto med mozzarella", "pesto pasta with mozzarella and cherry tomatoes"),
        ("Ugnsrostad rotfruktsbowl", "roasted root vegetable bowl with grains and yogurt sauce"),
    ],
    "pasta": [
        ("Spaghetti med köttfärssås", "spaghetti bolognese Swedish family style with grated cheese"),
        ("Pasta carbonara med ärtor", "creamy pasta carbonara with peas and parmesan"),
        ("Lasagne med köttfärs", "classic beef lasagna with green salad"),
        ("Pasta med skinksås", "pasta with creamy ham sauce and peas"),
        ("Krämig tomatpasta", "creamy tomato pasta with basil and cheese"),
        ("Pasta med kyckling och pesto", "chicken pesto pasta with tomatoes"),
        ("Pasta med bacon och broccoli", "pasta with bacon, broccoli and creamy sauce"),
        ("Pastagratäng med köttfärs", "pasta gratin with beef mince, tomato and melted cheese"),
        ("Pasta med korv och tomatsås", "pasta with Swedish sausage and tomato sauce"),
        ("Tortellini med ostsås", "cheese tortellini with creamy sauce and salad"),
        ("Pasta med räkor och citron", "shrimp lemon pasta with dill"),
        ("Makaroner med ost- och skinksås", "macaroni with cheese and ham sauce"),
    ],
    "soppa": [
        ("Tomatsoppa med ostsmörgås", "tomato soup with grilled cheese sandwich"),
        ("Potatis- och purjolökssoppa", "potato leek soup with bread"),
        ("Kycklingsoppa med nudlar", "chicken noodle soup with vegetables"),
        ("Morotssoppa med ingefära", "carrot ginger soup with yogurt and bread"),
        ("Blomkålssoppa med bacon", "creamy cauliflower soup with crispy bacon"),
        ("Köttfärssoppa med potatis", "minced beef soup with potatoes and vegetables"),
        ("Fisksoppa med saffranston", "creamy fish soup with potatoes and dill"),
        ("Linssoppa med bröd", "red lentil soup with bread and herbs"),
        ("Broccolisoppa med ägghalva", "broccoli soup with boiled egg and bread"),
        ("Gulaschsoppa med gräddfil", "goulash soup with sour cream and bread"),
    ],
    "tacos": [
        ("Milda tacos med köttfärs", "mild beef tacos with tortillas, lettuce, tomato salsa, cucumber, corn and sour cream"),
        ("Tacobowl med ris", "taco rice bowl with beef mince, corn, cucumber, tomato and sour cream"),
        ("Kycklingtacos", "chicken tacos with soft tortillas, lettuce, tomato salsa, cucumber, corn and sour cream"),
        ("Tacopaj med sallad", "Swedish taco pie with salad and sour cream"),
        ("Taconachos med köttfärs", "loaded taco nachos with beef mince, cheese, salsa and sour cream"),
        ("Vegetariska tacos med bönor", "vegetarian bean tacos with corn, salsa, avocado and sour cream"),
        ("Tacoquesadillas", "taco quesadillas with cheese, beef mince and salad"),
        ("Tacosallad med ris", "taco salad bowl with rice, beef mince, vegetables and dressing"),
    ],
    "budget": [
        ("Chili con carne med ris", "chili con carne with rice, beans and sour cream"),
        ("Kebabgryta med ris", "creamy kebab stew with rice, cucumber and tomato"),
        ("Köttfärsgratäng med potatis", "minced beef and potato gratin with cheese"),
        ("Risotto med kyckling och ärtor", "simple chicken risotto with peas and parmesan"),
        ("Nudelwok med ägg", "egg noodle stir fry with vegetables"),
        ("Potatisbullar med bacon och lingon", "potato cakes with bacon and lingonberries"),
        ("Bakad potatis med skinkröra", "baked potato with creamy ham filling and salad"),
        ("Grillkorv med potatismos", "grilled sausage with mashed potatoes and cucumber"),
        ("Risgrynsgröt med smörgås", "rice porridge with cinnamon and sandwich"),
        ("Ugnspannkaka med äpple", "oven pancake with apple slices and berries"),
    ],
}

SIDES = [
    ("med ris", [("ris", "3 dl")], "with rice"),
    ("med potatis", [("potatis", "900 g")], "with boiled potatoes"),
    ("med rostad potatis", [("potatis", "900 g")], "with roasted potatoes"),
    ("med pasta", [("pasta", "400 g")], "with pasta"),
    ("med bulgur", [("bulgur", "3 dl")], "with bulgur"),
    ("med nudlar", [("nudlar", "300 g")], "with noodles"),
]
SAUCES = [
    ("kall örtsås", [("yoghurt", "2 dl"), ("örter", "1 kruka")], "cold herb sauce"),
    ("vitlökssås", [("crème fraiche", "2 dl"), ("vitlök", "1 klyfta")], "garlic sauce"),
    ("tomatsalsa", [("tomat", "3 st"), ("lime", "1 st")], "tomato salsa"),
    ("gräddsås", [("grädde", "2 dl"), ("buljong", "1 tärning")], "cream sauce"),
    ("citronsås", [("citron", "1 st"), ("yoghurt", "2 dl")], "lemon yogurt sauce"),
]
PROTEINS = [
    ("Kycklingbiffar", "kyckling", [("kycklingfärs", "500 g")], "chicken patties"),
    ("Köttfärsbiffar", "kött", [("nötfärs", "500 g")], "beef patties"),
    ("Laxfilé", "fisk", [("laxfilé", "600 g")], "salmon fillet"),
    ("Torskfilé", "fisk", [("torskfilé", "600 g")], "cod fillet"),
    ("Halloumi", "vegetariskt", [("halloumi", "400 g")], "halloumi"),
    ("Falafel", "vegetariskt", [("falafel", "500 g")], "falafel"),
    ("Kebabkött", "kött", [("kebabkött", "500 g")], "kebab meat"),
    ("Falukorv", "budget", [("falukorv", "500 g")], "Swedish falukorv sausage"),
]
VEG_SETS = [
    ([("gurka", "1 st"), ("tomat", "3 st"), ("majs", "2 dl")], "cucumber, tomato and corn"),
    ([("broccoli", "250 g"), ("morötter", "3 st")], "broccoli and carrots"),
    ([("paprika", "2 st"), ("rödlök", "1 st"), ("sallad", "1 påse")], "peppers, red onion and salad"),
    ([("ärtor", "250 g"), ("citron", "1 st")], "peas and lemon"),
    ([("vitkål", "300 g"), ("morötter", "3 st")], "cabbage and carrots"),
]

def merge_ingredients(*groups):
    seen = {}
    for group in groups:
        for name, amount in group:
            seen.setdefault(name, amount)
    return [{"name": k, "amount": v} for k, v in seen.items()]

def steps_for(title, category):
    if category == "soppa":
        return [
            "Skala och skär grönsakerna i jämna bitar.",
            "Fräs basen i lite olja och häll på vätska eller krossade tomater.",
            "Låt soppan sjuda tills allt är mjukt och smaka av milt.",
            "Servera varm med bröd eller ett enkelt tillbehör."
        ]
    if "taco" in title.lower() or "fajita" in title.lower() or "quesadilla" in title.lower():
        return [
            "Förbered grönsaker och lägg tillbehören i skålar.",
            "Stek protein eller bönor med mild tacokrydda.",
            "Värm bröd, ris eller nachos enligt rättens upplägg.",
            "Servera så att alla kan bygga sin egen tallrik."
        ]
    if "gratäng" in title.lower() or "lasagne" in title.lower() or "ugn" in title.lower() or "paj" in title.lower():
        return [
            "Sätt ugnen på 200 grader och förbered en ugnsform.",
            "Tillaga fyllning eller sås i en panna tills smakerna gått ihop.",
            "Lägg allt i formen, toppa vid behov med ost och grädda tills ytan fått färg.",
            "Låt vila några minuter och servera med en enkel sallad."
        ]
    if category == "pasta":
        return [
            "Koka pastan enligt anvisningarna och spara lite pastavatten.",
            "Tillaga sås och protein i en stor panna.",
            "Vänd ner pastan och späd till krämig konsistens.",
            "Servera direkt med grönsaker eller sallad vid sidan."
        ]
    return [
        "Förbered råvarorna och koka tillbehöret enligt anvisningarna.",
        "Tillaga protein och grönsaker i panna, gryta eller ugn tills allt är genomlagat.",
        "Rör ihop sås eller servera tillbehör separat för enkel anpassning.",
        "Smaka av milt och lägg upp på tallrik med fräscha grönsaker."
    ]

def nutrition(category, tags):
    if category in ["fisk", "kyckling", "kött"]:
        return "Proteinrik vardagsmiddag som blir extra bra med grönsaker vid sidan."
    if category == "vegetariskt":
        return "Vegetarisk rätt med bra mättnad från baljväxter, ost eller ägg."
    if category == "budget":
        return "Budgetsmart rätt som ändå ger ordentlig mättnad."
    if category == "soppa":
        return "Lätt att komplettera med bröd, ägg eller extra protein vid behov."
    return "Balansera gärna med extra grönsaker för en komplett vardagsmiddag."

def recipe(title, category, tags, minutes, difficulty, ingredients, img_subject, desc):
    rid = slugify(title)
    prompt = f"{img_subject}, {STYLE}"
    return {
        "id": rid,
        "title": title,
        "description": desc,
        "servings": 4,
        "time_minutes": minutes,
        "difficulty": difficulty,
        "category": category if category in CATEGORIES else "vardag",
        "tags": tags[:],
        "ingredients": [{"name": n, "amount": a} for n,a in ingredients],
        "steps": steps_for(title, category),
        "nutrition_hint": nutrition(category, tags),
        "image": f"/seed-recipes/images/{rid}.png",
        "image_prompt": prompt,
    }

def build():
    recipes = []
    for item in BASE_DISHES:
        recipes.append(recipe(*item))

    # Direct variants
    for category, items in PROTEIN_VARIANTS.items():
        for title, subj in items:
            tags = ["vardag"]
            if category in ["budget", "tacos"]: tags += ["snabbt", "barnvänligt"]
            if category == "vegetariskt": tags += ["vegetariskt"]
            if category == "fisk": tags += ["nyttigare"]
            if category == "kyckling": tags += ["familj"]
            cat = "barnfavorit" if category == "tacos" else category
            base_ings = [("valfritt protein", "500 g"), ("grönsaker", "1 skål"), ("sås", "2 dl")]
            if category == "vegetariskt": base_ings = [("vegetarisk bas", "500 g"), ("grönsaker", "1 skål"), ("sås", "2 dl")]
            if category == "soppa": base_ings = [("grönsaker", "700 g"), ("buljong", "8 dl"), ("bröd", "4 skivor")]
            if category == "pasta": base_ings = [("pasta", "400 g"), ("såsbas", "3 dl"), ("grönsaker", "1 skål")]
            recipes.append(recipe(title, cat, tags, 30 if category not in ["soppa"] else 35, "easy", base_ings, subj, f"{title} är en vardagsnära rätt med tydliga smaker och enkel servering."))

    # Combination grid for familiar weekday bowls/plates.
    for prot_name, cat, prot_ing, prot_en in PROTEINS:
        for side_sv, side_ing, side_en in SIDES:
            for sauce_sv, sauce_ing, sauce_en in SAUCES:
                veg_ing, veg_en = VEG_SETS[(len(recipes) + len(prot_name)) % len(VEG_SETS)]
                title = f"{prot_name} {side_sv} och {sauce_sv}"
                tags = ["vardag", "familj"]
                if cat == "budget": tags.append("budget")
                if cat == "vegetariskt": tags.append("vegetariskt")
                if cat in ["kyckling", "fisk"]: tags.append("nyttigare")
                ingredients = merge_ingredients(prot_ing, side_ing, sauce_ing, veg_ing)
                img = f"{prot_en} {side_en}, {sauce_en}, {veg_en}"
                desc = f"En tydlig vardagstallrik med {prot_name.lower()}, {side_sv.replace('med ', '')} och {sauce_sv}."
                recipes.append(recipe(title, cat, tags, 30 if side_sv != "med rostad potatis" else 40, "easy", [(i['name'], i['amount']) for i in ingredients], img, desc))
                if len(recipes) >= 320:
                    break
            if len(recipes) >= 320:
                break
        if len(recipes) >= 320:
            break

    # Deduplicate ids and trim to exactly 300.
    unique = []
    seen = set()
    for r in recipes:
        base = r["id"]
        if base in seen:
            continue
        seen.add(base)
        unique.append(r)
        if len(unique) == 300:
            break

    # Ensure distribution: if less than 300 due duplicates, create numbered safe variants.
    idx = 1
    while len(unique) < 300:
        title = f"Veckans enkla kycklinggryta {idx}"
        r = recipe(title, "kyckling", ["vardag", "snabbt"], 30, "easy", [("kyckling", "500 g"), ("ris", "3 dl"), ("grönsaker", "1 skål"), ("matlagningsgrädde", "2 dl")], "creamy chicken stew with rice and vegetables", "En enkel kycklinggryta för stressiga vardagar.")
        if r["id"] not in seen:
            unique.append(r); seen.add(r["id"])
        idx += 1

    return unique

def validate(recipes):
    errors = []
    ids = [r["id"] for r in recipes]
    dupes = [k for k,v in Counter(ids).items() if v > 1]
    if len(recipes) != 300: errors.append(f"Expected 300 recipes, got {len(recipes)}")
    if dupes: errors.append(f"Duplicate ids: {dupes[:10]}")
    for r in recipes:
        for key in ["id", "title", "description", "category", "ingredients", "steps", "image", "image_prompt"]:
            if not r.get(key): errors.append(f"{r.get('id')} missing {key}")
        if r.get("category") not in CATEGORIES: errors.append(f"{r['id']} bad category {r.get('category')}")
    return errors

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    recipes = build()
    errors = validate(recipes)
    prompts = [{"id": r["id"], "title": r["title"], "image": r["image"], "prompt": r["image_prompt"]} for r in recipes]

    (OUT / "recipes.json").write_text(json.dumps(recipes, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "image-prompts.json").write_text(json.dumps(prompts, ensure_ascii=False, indent=2), encoding="utf-8")
    with (OUT / "recipes.csv").open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id","title","description","servings","time_minutes","difficulty","category","tags","image","image_prompt"])
        writer.writeheader()
        for r in recipes:
            row = {k: r[k] for k in writer.fieldnames}
            row["tags"] = ", ".join(row["tags"])
            writer.writerow(row)
    failed = {"failed": [], "validation_errors": errors}
    (OUT / "failed-items.json").write_text(json.dumps(failed, ensure_ascii=False, indent=2), encoding="utf-8")
    cat_counts = Counter(r["category"] for r in recipes)
    report = [
        "# Min Matvecka seed recipe generation report",
        "",
        f"Recipes: {len(recipes)}",
        "Images: 0 generated yet; queued via image-prompts.json",
        f"Validation errors: {len(errors)}",
        "",
        "## Category distribution",
        *[f"- {k}: {v}" for k,v in sorted(cat_counts.items())],
        "",
        "## Example recipes",
        *[f"- {r['title']} ({r['id']})" for r in recipes[:10]],
        "",
        "## Next step",
        "Run image generation chunks and verify image paths exist.",
    ]
    if errors:
        report += ["", "## Validation errors", *[f"- {e}" for e in errors[:50]]]
    (OUT / "generation-report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    print(json.dumps({"recipes": len(recipes), "errors": len(errors), "out": str(OUT)}, ensure_ascii=False))

if __name__ == "__main__":
    main()
