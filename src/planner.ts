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
}

export type PlannedMeal = MealTemplate & { day: string }
export type ShoppingItem = { category: string; label: string; amount: number | string; unit: string }

const dayNames = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag']

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
  },
  {
    id: 'fish-potatoes',
    title: 'Fisk med potatis',
    mainFoodId: 'fish',
    ingredients: ['vit fisk', 'potatis', 'ärtor', 'citron'],
    steps: ['Koka potatis.', 'Tillaga fisk.', 'Servera med ärtor och citron.'],
    restrictions: ['fisk'],
    tags: ['klassiker'],
    audience: ['lss'],
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
  },
]

const restrictionAliases: Record<string, string[]> = {
  laktos: ['laktos', 'mjölk', 'grädde', 'gräddfil', 'ost', 'yoghurt'],
  gluten: ['gluten', 'vete', 'pasta', 'bröd', 'tortillabröd', 'pannkakor'],
  fisk: ['fisk', 'vit fisk', 'lax'],
  ägg: ['ägg', 'pannkakor'],
  nötter: ['nötter', 'nöt'],
  nöt: ['nötter', 'nöt'],
}

function normalized(text: string) {
  return text.toLowerCase()
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
  if (profile.liked.includes(meal.mainFoodId)) score += 100
  if (meal.audience.includes(profile.mode)) score += 20
  if (profile.mode === 'family' && meal.tags.some((tag) => ['snabb', 'barnfavorit', 'plockmat'].includes(tag))) score += 10
  if (profile.mode === 'lss' && meal.tags.some((tag) => ['trygg', 'mild', 'mjuk'].includes(tag))) score += 10
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
}

function optionsFor(profile: PlannerProfile) {
  const terms = blockedTerms(profile)
  const eligible = mealTemplates
    .filter((meal) => meal.audience.includes(profile.mode))
    .filter((meal) => !profile.disliked.includes(meal.mainFoodId))
    .filter((meal) => !conflictsWithRestrictions(meal, terms))
    .sort((a, b) => mealScore(b, profile) - mealScore(a, profile) || a.title.localeCompare(b.title, 'sv'))

  return eligible.length ? eligible : [customSafeMeal]
}

export function generateWeek(profile: PlannerProfile): PlannedMeal[] {
  const options = optionsFor(profile)
  return dayNames.slice(0, profile.days).map((day, index) => ({ ...options[index % options.length], day }))
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
  gräddfil: 'Mejeri',
  pannkakor: 'Färdigt/snabbt',
  'krossade tomater': 'Konserver',
  tomatsoppa: 'Konserver',
  lingon: 'Övrigt',
  sylt: 'Övrigt',
}

const units: Record<string, string> = {
  köttfärs: 'g',
  kyckling: 'g',
  'vit fisk': 'g',
  köttbullar: 'st',
  potatis: 'st',
  ris: 'dl',
  pasta: 'g',
  tortillabröd: 'st',
  lime: 'st',
  koriander: 'kruka',
  gräddfil: 'dl',
  gurka: 'st',
  tomat: 'st',
  paprika: 'st',
  citron: 'st',
  morot: 'st',
  majs: 'g',
}

const baseAmounts: Record<string, number> = {
  köttfärs: 150,
  kyckling: 150,
  'vit fisk': 150,
  köttbullar: 5,
  potatis: 2.5,
  ris: 0.8,
  pasta: 90,
  tortillabröd: 2,
  lime: 0.25,
  koriander: 0.12,
  gräddfil: 0.5,
  gurka: 0.2,
  tomat: 0.5,
  paprika: 0.25,
  citron: 0.15,
  morot: 0.5,
  majs: 60,
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
