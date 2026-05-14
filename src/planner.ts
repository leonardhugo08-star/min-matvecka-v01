import prices from '../public/prices/ingredient-prices.json'
import choiceCategoryAssets from '../public/seed-recipes/choice-category-assets.json'

export type PlannerMode = 'lss' | 'family'

export type PlannerProfile = {
  mode: PlannerMode
  name: string
  people: number
  liked: string[]
  disliked: string[]
  restrictions: string
  days: 5 | 7
}

export type MealTemplate = {
  id: string
  title: string
  mainFoodId: string
  ingredients: string[]
  steps: string[]
  restrictions: string[]
  tags: string[]
  audience: PlannerMode[]
  imageTone: 'taco' | 'pasta' | 'chicken' | 'fish' | 'meatballs' | 'soup' | 'vegetarian' | 'pancakes' | 'salmon' | 'sausage'
  image?: string
  choiceImage?: string
  rawvaror?: string[]
  restaurantDescription: string
}

export type PlannedMeal = MealTemplate & { day: string }
export type ShoppingItem = { category: string; label: string; amount: number | string; unit: string }

const dayNames = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag']

export const allergyChips = [
  'Laktosfri',
  'Glutenfri',
  'Mjölkproteinfri',
  'Äggfri',
  'Fiskfri',
  'Skaldjursfri',
  'Nötfri',
  'Vegetariskt',
  'Mild mat',
  'Mjuk mat',
  'Lättlagat',
  'Snabb vardag',
  'Inga starka kryddor',
]

export const preferenceFoods = [
  { id: 'tacos', label: 'Tacos', image: 'foods/cards/tacos.png' },
  { id: 'pasta', label: 'Pasta', image: 'foods/cards/pasta.png' },
  { id: 'chicken', label: 'Kyckling', image: 'foods/cards/chicken-drumstick.png' },
  { id: 'fish', label: 'Fisk', image: 'foods/cards/fish.png' },
  { id: 'meatballs', label: 'Köttbullar', image: 'foods/cards/meatballs.png' },
  { id: 'soup', label: 'Soppa', image: 'foods/cards/soup.png' },
  { id: 'vegetarian', label: 'Vegetariskt', image: 'foods/cards/vegetarian.png' },
  { id: 'pancakes', label: 'Pannkakor', image: 'foods/cards/pancakes.png' },
]

export const rawvaraOptions = [
  { id: 'potatis', label: 'Potatis' },
  { id: 'ris', label: 'Ris' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'nudlar', label: 'Nudlar' },
  { id: 'kyckling', label: 'Kyckling' },
  { id: 'köttfärs', label: 'Köttfärs' },
  { id: 'köttbullar', label: 'Köttbullar' },
  { id: 'falukorv', label: 'Falukorv' },
  { id: 'fisk', label: 'Fisk' },
  { id: 'lax', label: 'Lax' },
  { id: 'ägg', label: 'Ägg' },
  { id: 'bönor', label: 'Bönor' },
  { id: 'linser', label: 'Linser' },
  { id: 'halloumi', label: 'Halloumi' },
  { id: 'pannkakor', label: 'Pannkakor' },
  { id: 'soppa', label: 'Soppa' },
]

const rawvaraAliases: Record<string, string[]> = {
  potatis: ['potatis', 'potatismos', 'mos'],
  ris: ['ris', 'risotto'],
  pasta: ['pasta', 'spaghetti', 'lasagne', 'tortellini'],
  nudlar: ['nudlar', 'nudel'],
  kyckling: ['kyckling'],
  köttfärs: ['köttfärs', 'färs'],
  köttbullar: ['köttbullar'],
  falukorv: ['falukorv', 'korvstroganoff', 'grillkorv'],
  fisk: ['fisk', 'torsk', 'panerad fisk'],
  lax: ['lax'],
  ägg: ['ägg', 'omelett'],
  bönor: ['bönor', 'bön'],
  linser: ['linser', 'lins'],
  halloumi: ['halloumi'],
  pannkakor: ['pannkakor', 'pannkaka'],
  soppa: ['soppa'],
}

export const mealTemplates: MealTemplate[] = [
  {
    id: 'mild-tacos',
    title: 'Milda tacos med valbara skålar',
    mainFoodId: 'tacos',
    ingredients: ['tortillabröd', 'köttfärs', 'majs', 'gurka', 'tomat', 'koriander', 'gräddfil', 'lime'],
    steps: ['Stek köttfärs milt.', 'Lägg tillbehör i separata skålar.', 'Låt alla välja själva vid bordet.'],
    restrictions: ['gluten', 'vete', 'mjölk', 'laktos'],
    tags: ['populär', 'plockmat', 'mild'],
    audience: ['lss', 'family'],
    imageTone: 'taco',
    image: '/seed-recipes/images/milda-tacos-med-kottfars.png',
    restaurantDescription: 'Färgglada små skålar med mild färs, krispiga grönsaker och lime.',
  },
  {
    id: 'rice-tacos-bowl',
    title: 'Tacobowl med ris',
    mainFoodId: 'tacos',
    ingredients: ['ris', 'köttfärs', 'majs', 'gurka', 'koriander', 'gräddfil', 'lime'],
    steps: ['Koka ris.', 'Stek färs milt.', 'Servera som skålar så barn/boende kan välja mängd.'],
    restrictions: ['mjölk', 'laktos'],
    tags: ['glutenfri bas', 'plockmat'],
    audience: ['lss', 'family'],
    imageTone: 'taco',
    image: '/seed-recipes/images/tacobowl-med-ris.png',
    restaurantDescription: 'En trygg tacobowl med risbas och allt gott samlat i separata delar.',
  },
  {
    id: 'pasta-meat-sauce',
    title: 'Pasta med köttfärssås',
    mainFoodId: 'pasta',
    ingredients: ['pasta', 'köttfärs', 'krossade tomater', 'morot'],
    steps: ['Koka pasta.', 'Stek köttfärs och morot.', 'Låt tomatsåsen puttra lugnt.'],
    restrictions: ['gluten', 'vete'],
    tags: ['vardag', 'trygg'],
    audience: ['lss', 'family'],
    imageTone: 'pasta',
    image: '/seed-recipes/images/spaghetti-med-kottfarssas.png',
    restaurantDescription: 'Klassisk röd pastasås med morotssötma och trygg vardagskänsla.',
  },
  {
    id: 'creamy-tomato-pasta',
    title: 'Krämig tomatpasta',
    mainFoodId: 'pasta',
    ingredients: ['pasta', 'krossade tomater', 'paprika', 'ost'],
    steps: ['Koka pasta.', 'Värm tomatsås med paprika.', 'Rör ner ost eller servera bredvid.'],
    restrictions: ['gluten', 'vete', 'mjölk', 'laktos'],
    tags: ['snabb', 'vardag'],
    audience: ['family'],
    imageTone: 'pasta',
    image: '/seed-recipes/images/kramig-tomatpasta.png',
    restaurantDescription: 'Solgul pasta i mjuk tomatsås, toppad som en liten trattoria-rätt.',
  },
  {
    id: 'chicken-rice',
    title: 'Kyckling med ris och gurka',
    mainFoodId: 'chicken',
    ingredients: ['kyckling', 'ris', 'gurka', 'paprika'],
    steps: ['Tillaga kyckling i ugn.', 'Koka ris.', 'Servera grönsaker bredvid.'],
    restrictions: [],
    tags: ['mild', 'enkel'],
    audience: ['lss', 'family'],
    imageTone: 'chicken',
    image: '/seed-recipes/images/ugnskyckling-med-potatis-och-tzatziki.png',
    restaurantDescription: 'Ugnskyckling med fluffigt ris och fräscha grönsaker vid sidan.',
  },
  {
    id: 'chicken-curry-mild',
    title: 'Mild kycklinggryta med ris',
    mainFoodId: 'chicken',
    ingredients: ['kyckling', 'ris', 'morot', 'paprika', 'matlagningsgrädde'],
    steps: ['Koka ris.', 'Stek kyckling och grönsaker.', 'Låt puttra till en mild gryta.'],
    restrictions: ['mjölk', 'laktos'],
    tags: ['mild', 'gryta'],
    audience: ['lss', 'family'],
    imageTone: 'chicken',
    image: '/seed-recipes/images/kycklinggryta-med-ris.png',
    restaurantDescription: 'Mjuk kycklinggryta med ris, mild doft och varm gul ton.',
  },
  {
    id: 'fish-potatoes',
    title: 'Panerad fisk med potatis',
    mainFoodId: 'fish',
    ingredients: ['panerad fisk', 'potatis', 'ärtor', 'citron'],
    steps: ['Koka potatis.', 'Tillaga panerad fisk i ugn.', 'Servera med ärtor och citron.'],
    restrictions: ['fisk', 'gluten', 'vete'],
    tags: ['klassiker', 'trygg'],
    audience: ['lss', 'family'],
    imageTone: 'fish',
    image: '/seed-recipes/images/panerad-fisk-med-potatis-och-remoulad.png',
    restaurantDescription: 'Frasig panerad fisk med potatis, ärtor och citronklyfta.',
  },
  {
    id: 'salmon-potatoes',
    title: 'Lax med potatis och kall sås',
    mainFoodId: 'fish',
    ingredients: ['lax', 'potatis', 'gurka', 'yoghurt', 'citron'],
    steps: ['Tillaga lax i ugn.', 'Koka potatis.', 'Blanda en enkel kall sås.'],
    restrictions: ['fisk', 'mjölk', 'laktos'],
    tags: ['klassiker', 'mild'],
    audience: ['lss', 'family'],
    imageTone: 'salmon',
    image: '/seed-recipes/images/lax-med-potatis-och-kall-dillsas.png',
    restaurantDescription: 'Rosa ugnslax med potatis och kall citronsås på sidan.',
  },
  {
    id: 'meatballs-mash',
    title: 'Köttbullar med potatismos',
    mainFoodId: 'meatballs',
    ingredients: ['köttbullar', 'potatis', 'lingon', 'gurka'],
    steps: ['Koka potatis och gör mos.', 'Värm köttbullar.', 'Servera med lingon och gurka.'],
    restrictions: ['gluten', 'ägg'],
    tags: ['trygg', 'mjuk'],
    audience: ['lss', 'family'],
    imageTone: 'meatballs',
    image: '/seed-recipes/images/kottbullar-med-potatismos-och-lingon.png',
    restaurantDescription: 'Svensk vardagsklassiker med mos, lingon och krispig gurka.',
  },
  {
    id: 'sausage-rice',
    title: 'Korvstroganoff med ris',
    mainFoodId: 'sausage',
    ingredients: ['falukorv', 'ris', 'krossade tomater', 'matlagningsgrädde'],
    steps: ['Koka ris.', 'Stek korv i bitar.', 'Låt korven puttra i tomatsås.'],
    restrictions: ['mjölk', 'laktos'],
    tags: ['snabb', 'trygg'],
    audience: ['lss', 'family'],
    imageTone: 'sausage',
    image: '/seed-recipes/images/korvstroganoff-med-ris.png',
    restaurantDescription: 'Krämig korvstroganoff med ris, mild och lätt att tycka om.',
  },
  {
    id: 'tomato-soup',
    title: 'Tomatsoppa med smörgås',
    mainFoodId: 'soup',
    ingredients: ['tomatsoppa', 'bröd', 'gurka'],
    steps: ['Värm soppan.', 'Gör smörgåsar.', 'Servera enkelt med gurka vid sidan.'],
    restrictions: ['gluten', 'vete'],
    tags: ['snabb', 'lugn'],
    audience: ['lss', 'family'],
    imageTone: 'soup',
    image: '/seed-recipes/images/tomatsoppa-med-ostsmorgas.png',
    restaurantDescription: 'Len tomatsoppa med varm färg och enkel smörgås vid sidan.',
  },
  {
    id: 'potato-leek-soup',
    title: 'Potatis- och purjolökssoppa',
    mainFoodId: 'soup',
    ingredients: ['potatis', 'purjolök', 'bröd', 'matlagningsgrädde'],
    steps: ['Koka potatis och purjolök.', 'Mixa eller mosa till önskad konsistens.', 'Servera med bröd.'],
    restrictions: ['gluten', 'vete', 'mjölk', 'laktos'],
    tags: ['mjuk', 'lugn'],
    audience: ['lss'],
    imageTone: 'soup',
    image: '/seed-recipes/images/potatis-och-purjolokssoppa.png',
    restaurantDescription: 'Mjuk soppa i varm skål, enkel att anpassa i konsistens.',
  },
  {
    id: 'bean-rice',
    title: 'Mild böngryta med ris',
    mainFoodId: 'vegetarian',
    ingredients: ['bönor', 'ris', 'krossade tomater', 'majs', 'morot'],
    steps: ['Koka ris.', 'Värm bönor med tomat och morot.', 'Servera majs vid sidan.'],
    restrictions: [],
    tags: ['vegetarisk', 'mild'],
    audience: ['lss', 'family'],
    imageTone: 'vegetarian',
    image: '/seed-recipes/images/bonchili-med-ris.png',
    restaurantDescription: 'Mild böngryta med ris, färg från majs och morot.',
  },
  {
    id: 'halloumi-rice-bowl',
    title: 'Halloumibowl med ris',
    mainFoodId: 'vegetarian',
    ingredients: ['halloumi', 'ris', 'gurka', 'tomat', 'majs'],
    steps: ['Koka ris.', 'Stek halloumi.', 'Lägg allt i skålar så alla kan välja.'],
    restrictions: ['mjölk', 'laktos'],
    tags: ['vegetarisk', 'plockmat'],
    audience: ['family'],
    imageTone: 'vegetarian',
    image: '/seed-recipes/images/halloumibowl-med-ris.png',
    restaurantDescription: 'Färgglad bowl med ris, grönsaker och gyllene halloumi.',
  },
  {
    id: 'pancakes-berries',
    title: 'Pannkakor med bär',
    mainFoodId: 'pancakes',
    ingredients: ['pannkakor', 'bär', 'sylt', 'morot'],
    steps: ['Värm pannkakor.', 'Servera bär och sylt bredvid.', 'Lägg till morotsstavar.'],
    restrictions: ['gluten', 'vete', 'mjölk', 'laktos', 'ägg'],
    tags: ['barnfavorit'],
    audience: ['family'],
    imageTone: 'pancakes',
    image: '/seed-recipes/images/pannkakor-med-bar-och-keso.png',
    restaurantDescription: 'Gylla pannkakor med bär, sylt och något krispigt bredvid.',
  },
  {
    id: 'omelette-potatoes',
    title: 'Ugnsomelett med potatis',
    mainFoodId: 'vegetarian',
    ingredients: ['ägg', 'potatis', 'paprika', 'ost'],
    steps: ['Skiva kokt potatis.', 'Vispa ägg och häll i form.', 'Grädda med paprika och ost.'],
    restrictions: ['ägg', 'mjölk', 'laktos'],
    tags: ['mjuk', 'vegetarisk'],
    audience: ['lss', 'family'],
    imageTone: 'vegetarian',
    image: '/seed-recipes/images/omelett-med-potatis-och-sallad.png',
    restaurantDescription: 'Mjuk ugnsomelett med potatis, paprika och lätt gratinerad yta.',
  },
]

const restrictionAliases: Record<string, string[]> = {
  laktos: ['laktos', 'mjölk', 'grädde', 'gräddfil', 'ost', 'yoghurt', 'matlagningsgrädde', 'halloumi'],
  gluten: ['gluten', 'vete', 'pasta', 'bröd', 'tortillabröd', 'pannkakor', 'panerad fisk'],
  mjölkprotein: ['mjölk', 'ost', 'yoghurt', 'grädde', 'gräddfil', 'matlagningsgrädde', 'halloumi'],
  fisk: ['fisk', 'vit fisk', 'lax', 'panerad fisk'],
  skaldjur: ['skaldjur', 'räkor'],
  ägg: ['ägg', 'pannkakor'],
  nötter: ['nötter', 'nöt'],
  nöt: ['nötter', 'nöt'],
  vegetarisk: ['köttfärs', 'kyckling', 'köttbullar', 'falukorv', 'fisk', 'lax', 'panerad fisk'],
}

function normalized(text: string) {
  return text.toLowerCase()
}

export function rawvarorForMeal(meal: Pick<MealTemplate, 'title' | 'mainFoodId' | 'ingredients' | 'tags'> & { rawvaror?: string[] }) {
  const explicit = meal.rawvaror ?? []
  const haystack = normalized([meal.title, meal.mainFoodId, ...meal.ingredients, ...meal.tags].join(' '))
  const derived = rawvaraOptions
    .map((option) => option.id)
    .filter((id) => rawvaraAliases[id]?.some((term) => haystack.includes(term)))
  return Array.from(new Set([...explicit, ...derived]))
}

function rawvaraLikes(profile: PlannerProfile) {
  return profile.liked.filter((id) => id.startsWith('rawvara:')).map((id) => id.replace('rawvara:', ''))
}

function rawvaraDislikes(profile: PlannerProfile) {
  return profile.disliked.filter((id) => id.startsWith('rawvara:')).map((id) => id.replace('rawvara:', ''))
}

function blockedTerms(profile: PlannerProfile) {
  const text = normalized(profile.restrictions)
  const direct = Object.keys(restrictionAliases).filter((term) => text.includes(term))
  return new Set(direct.flatMap((term) => restrictionAliases[term]).concat(direct))
}

function conflictsWithRestrictions(meal: MealTemplate, terms: Set<string>) {
  const haystack = normalized([meal.title, meal.mainFoodId, ...meal.ingredients, ...meal.restrictions].join(' '))
  return Array.from(terms).some((term) => haystack.includes(term))
}

function mealScore(meal: MealTemplate, profile: PlannerProfile) {
  let score = 0
  const restrictionText = normalized(profile.restrictions)
  if (profile.liked.includes(meal.mainFoodId)) score += 100
  const mealRawvaror = rawvarorForMeal(meal)
  for (const likedRawvara of rawvaraLikes(profile)) {
    if (mealRawvaror.includes(likedRawvara)) score += 65
  }
  for (const dislikedRawvara of rawvaraDislikes(profile)) {
    if (mealRawvaror.includes(dislikedRawvara)) score -= 130
  }
  if (meal.audience.includes(profile.mode)) score += 20
  if (profile.mode === 'family' && meal.tags.some((tag) => ['snabb', 'barnfavorit', 'plockmat'].includes(tag))) score += 10
  if (profile.mode === 'lss' && meal.tags.some((tag) => ['trygg', 'mild', 'mjuk'].includes(tag))) score += 10
  if (restrictionText.includes('mjuk') && meal.tags.includes('mjuk')) score += 25
  if ((restrictionText.includes('lättlagat') || restrictionText.includes('snabb vardag')) && meal.tags.includes('snabb')) score += 20
  if (restrictionText.includes('mild') && meal.tags.includes('mild')) score += 15
  return score
}

const customSafeMeal: MealTemplate = {
  id: 'custom-safe-meal',
  title: 'Anpassad trygg maträtt',
  mainFoodId: 'custom',
  ingredients: ['säker basmat', 'säker grönsak', 'säker proteinkälla'],
  steps: ['Välj en rätt som ansvarig person vet fungerar.', 'Kontrollera specialkost och konsistens.', 'Skriv in egen rätt på utskriften vid behov.'],
  restrictions: [],
  tags: ['kontrollera', 'anpassad'],
  audience: ['lss', 'family'],
  imageTone: 'vegetarian',
  restaurantDescription: 'En lugn specialkost-rätt som ansvarig person kan fylla med säkra val.',
}

export function optionsFor(profile: PlannerProfile) {
  const terms = blockedTerms(profile)
  const eligible = mealTemplates
    .filter((meal) => meal.audience.includes(profile.mode))
    .filter((meal) => !profile.disliked.includes(meal.mainFoodId))
    .filter((meal) => !rawvaraDislikes(profile).some((rawvara) => rawvarorForMeal(meal).includes(rawvara)))
    .filter((meal) => !conflictsWithRestrictions(meal, terms))
    .sort((a, b) => mealScore(b, profile) - mealScore(a, profile) || a.title.localeCompare(b.title, 'sv'))

  return eligible.length ? eligible : [customSafeMeal]
}

export function choiceOptionsFor(profile: PlannerProfile) {
  const options = optionsFor(profile)
  const needed = profile.days * 2
  return Array.from({ length: needed }, (_, index) => options[index % options.length])
}

export function generateWeek(profile: PlannerProfile, selectedMealIds?: string[]): PlannedMeal[] {
  const options = optionsFor(profile)
  const selected = selectedMealIds?.length
    ? selectedMealIds.map((id) => options.find((meal) => meal.id === id)).filter((meal): meal is MealTemplate => Boolean(meal))
    : []
  const source = selected.length ? selected : options

  return dayNames.slice(0, profile.days).map((day, index) => ({ ...source[index % source.length], day }))
}

export function replaceMeal(plan: PlannedMeal[], dayIndex: number, profile: PlannerProfile): PlannedMeal[] {
  const options = optionsFor(profile)
  const current = plan[dayIndex]
  const currentIndex = options.findIndex((meal) => meal.id === current.id)
  const next = options[(currentIndex + 1 + options.length) % options.length]
  return plan.map((meal, index) => (index === dayIndex ? { ...next, day: meal.day } : meal))
}

const categoryByIngredient: Record<string, string> = {
  tortillabröd: 'Bröd & bas',
  pasta: 'Bröd & bas',
  ris: 'Bröd & bas',
  bröd: 'Bröd & bas',
  potatis: 'Frukt & grönt',
  purjolök: 'Frukt & grönt',
  gurka: 'Frukt & grönt',
  tomat: 'Frukt & grönt',
  majs: 'Frukt & grönt',
  morot: 'Frukt & grönt',
  paprika: 'Frukt & grönt',
  citron: 'Frukt & grönt',
  lime: 'Frukt & grönt',
  koriander: 'Frukt & grönt',
  kyckling: 'Protein',
  köttfärs: 'Protein',
  köttbullar: 'Protein',
  bönor: 'Protein',
  'vit fisk': 'Protein',
  'panerad fisk': 'Protein',
  lax: 'Protein',
  falukorv: 'Protein',
  ägg: 'Protein',
  halloumi: 'Mejeri',
  ost: 'Mejeri',
  yoghurt: 'Mejeri',
  matlagningsgrädde: 'Mejeri',
  gräddfil: 'Mejeri',
  pannkakor: 'Färdigt/snabbt',
  'krossade tomater': 'Konserver',
  tomatsoppa: 'Konserver',
  lingon: 'Övrigt',
  sylt: 'Övrigt',
  bär: 'Frukt & grönt',
}

const units: Record<string, string> = {
  köttfärs: 'g',
  kyckling: 'g',
  'vit fisk': 'g',
  'panerad fisk': 'g',
  lax: 'g',
  falukorv: 'g',
  köttbullar: 'st',
  potatis: 'st',
  ris: 'dl',
  pasta: 'g',
  tortillabröd: 'st',
  lime: 'st',
  koriander: 'kruka',
  gräddfil: 'dl',
  matlagningsgrädde: 'dl',
  yoghurt: 'dl',
  gurka: 'st',
  tomat: 'st',
  paprika: 'st',
  citron: 'st',
  morot: 'st',
  majs: 'g',
  ägg: 'st',
}

const baseAmounts: Record<string, number> = {
  köttfärs: 150,
  kyckling: 150,
  'vit fisk': 150,
  'panerad fisk': 150,
  lax: 150,
  falukorv: 120,
  köttbullar: 5,
  potatis: 2.5,
  ris: 0.8,
  pasta: 90,
  tortillabröd: 2,
  lime: 0.25,
  koriander: 0.12,
  gräddfil: 0.5,
  matlagningsgrädde: 0.6,
  yoghurt: 0.4,
  gurka: 0.2,
  tomat: 0.5,
  paprika: 0.25,
  citron: 0.15,
  morot: 0.5,
  majs: 60,
  ägg: 1.5,
}

function scaleAmount(ingredient: string, people: number) {
  const unit = units[ingredient] ?? 'förp'
  const amount = baseAmounts[ingredient] ?? 1
  const scaled = unit === 'förp' ? amount : amount * people
  if (['st', 'förp', 'kruka'].includes(unit)) return Math.max(1, Math.ceil(scaled))
  if (unit === 'g') return Math.ceil(scaled / 50) * 50
  return Number(scaled.toFixed(1))
}

export function createShoppingList(plan: PlannedMeal[], people: number): ShoppingItem[] {
  const totals = new Map<string, ShoppingItem>()
  const ingredients = plan.flatMap((meal) => meal.ingredients)

  if (plan.some((meal) => meal.mainFoodId === 'tacos')) {
    for (const essential of ['koriander', 'gräddfil', 'lime']) {
      if (!ingredients.includes(essential)) ingredients.push(essential)
    }
  }

  for (const ingredient of ingredients) {
    const unit = units[ingredient] ?? 'förp'
    const category = categoryByIngredient[ingredient] ?? 'Övrigt'
    const amount = scaleAmount(ingredient, people)
    const current = totals.get(ingredient)
    if (!current) {
      totals.set(ingredient, { category, label: ingredient, amount, unit })
    } else if (typeof current.amount === 'number' && typeof amount === 'number') {
      current.amount = unit === 'förp' ? current.amount + amount : Number((current.amount + amount).toFixed(1))
    }
  }

  return Array.from(totals.values()).sort(
    (a, b) => a.category.localeCompare(b.category, 'sv') || a.label.localeCompare(b.label, 'sv'),
  )
}

type PriceItem = { name: string; unit: string; estimated_price: number; confidence: 'high' | 'medium' | 'low'; notes?: string }
const priceItems = (prices.items as PriceItem[])
const priceByName = new Map(priceItems.map((item) => [item.name, item]))

function unitFactor(item: ShoppingItem, priceUnit: string) {
  if (priceUnit === 'kg' && item.unit === 'g' && typeof item.amount === 'number') return item.amount / 1000
  if (priceUnit === 'liter' && item.unit === 'dl' && typeof item.amount === 'number') return item.amount / 10
  if (priceUnit === 'st' && item.unit === 'st' && typeof item.amount === 'number') return item.amount
  if (item.unit === 'förp' && typeof item.amount === 'number') return item.amount
  if (priceUnit === 'kg' && item.unit === 'st' && typeof item.amount === 'number') return item.amount * 0.15
  if (priceUnit === 'liter' && item.unit === 'st' && typeof item.amount === 'number') return item.amount * 0.2
  return null
}

function findPrice(label: string) {
  const normalizedLabel = normalized(label)
  return priceByName.get(normalizedLabel) ?? priceItems.find((item) => normalizedLabel.includes(item.name) || item.name.includes(normalizedLabel))
}

export type ShoppingBudget = {
  totalSek: number
  pricePerServingSek: number
  label: 'Budget' | 'Normal' | 'Dyrare'
  confidence: 'high' | 'medium' | 'low'
  unpricedItems: string[]
  note: string
}

export function calculateShoppingBudget(list: ShoppingItem[], days: number, people: number): ShoppingBudget {
  let total = 0
  let lowConfidence = 0
  const unpricedItems: string[] = []

  for (const item of list) {
    const price = findPrice(item.label)
    const factor = price ? unitFactor(item, price.unit) : null
    if (!price || factor === null) {
      unpricedItems.push(item.label)
      continue
    }
    total += factor * price.estimated_price
    if (price.confidence !== 'high') lowConfidence += 1
  }

  const totalSek = Math.round(total)
  const servings = Math.max(1, days * people)
  const pricePerServingSek = Math.round(totalSek / servings)
  const confidence: ShoppingBudget['confidence'] = unpricedItems.length || lowConfidence > list.length / 2 ? 'low' : lowConfidence ? 'medium' : 'high'
  const label: ShoppingBudget['label'] = pricePerServingSek <= 25 ? 'Budget' : pricePerServingSek <= 45 ? 'Normal' : 'Dyrare'

  return {
    totalSek,
    pricePerServingSek,
    label,
    confidence,
    unpricedItems,
    note: `${prices.source}. Visas som ca-priser; kontrollera alltid butik och lager hemma.`,
  }
}

export function choiceImageFor(meal: Pick<MealTemplate, 'mainFoodId' | 'imageTone' | 'choiceImage'>) {
  if (meal.choiceImage) return { kind: 'recipe' as const, src: meal.choiceImage }
  const assets = choiceCategoryAssets as Record<string, string>
  const src = assets[meal.mainFoodId] ?? assets[meal.imageTone]
  if (src) return { kind: 'category' as const, src }
  return { kind: 'gradient' as const, src: '' }
}
