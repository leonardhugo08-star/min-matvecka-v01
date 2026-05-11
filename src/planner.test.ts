import { describe, expect, it } from 'vitest'
import { createShoppingList, generateWeek, replaceMeal, type PlannerProfile } from './planner'

const lssProfile: PlannerProfile = {
  mode: 'lss',
  name: 'Solrosen',
  people: 4,
  liked: ['tacos'],
  disliked: ['fish'],
  restrictions: 'laktosfri',
  days: 5,
}

const familyProfile: PlannerProfile = {
  mode: 'family',
  name: 'Familjen Myrenblom',
  people: 3,
  liked: ['pasta', 'tacos'],
  disliked: [],
  restrictions: '',
  days: 7,
}

describe('dual-mode meal planner engine', () => {
  it('generates 5-day LSS and 7-day family plans from one engine', () => {
    expect(generateWeek(lssProfile)).toHaveLength(5)
    expect(generateWeek(familyProfile)).toHaveLength(7)
  })

  it('excludes disliked and obvious restriction conflicts', () => {
    const plan = generateWeek(lssProfile)
    const text = plan.map((meal) => `${meal.mainFoodId} ${meal.ingredients.join(' ')} ${meal.restrictions.join(' ')}`).join(' ')
    expect(text).not.toMatch(/fish|fisk|lax|mjölk|laktos|grädde|ost|yoghurt/i)
  })

  it('filters laktos, gluten, fisk, ägg and nötter terms without unsafe obvious ingredients', () => {
    const plan = generateWeek({ ...familyProfile, restrictions: 'laktosfri, glutenfri, tål inte fisk, äggallergi, nötter' })
    const text = plan.map((meal) => `${meal.title} ${meal.ingredients.join(' ')} ${meal.restrictions.join(' ')}`).join(' ')

    expect(plan).toHaveLength(7)
    expect(text).not.toMatch(/mjölk|laktos|grädde|gräddfil|ost|yoghurt|gluten|vete|pasta|bröd|tortillabröd|fisk|lax|ägg|nöt/i)
  })

  it('keeps restrictions even when preferences are too narrow', () => {
    const plan = generateWeek({
      ...lssProfile,
      liked: ['fish'],
      disliked: ['tacos', 'chicken', 'meatballs', 'soup', 'vegetarian', 'pasta'],
      restrictions: 'fisk, laktos, gluten, ägg, nötter',
    })
    const text = plan.map((meal) => `${meal.title} ${meal.ingredients.join(' ')} ${meal.restrictions.join(' ')}`).join(' ')

    expect(plan).toHaveLength(5)
    expect(text).not.toMatch(/fisk|lax|mjölk|laktos|grädde|gräddfil|ost|yoghurt|gluten|vete|pasta|bröd|tortillabröd|ägg|nöt/i)
  })

  it('replaces only one selected day', () => {
    const plan = generateWeek(familyProfile)
    const next = replaceMeal(plan, 2, familyProfile)
    expect(next).toHaveLength(plan.length)
    expect(next[2].id).not.toEqual(plan[2].id)
    expect(next.filter((meal, index) => meal.id !== plan[index].id)).toHaveLength(1)
  })

  it('creates scaled shopping list and adds taco essentials', () => {
    const plan = generateWeek({ ...familyProfile, liked: ['tacos'], days: 5 })
    const list = createShoppingList(plan, 3)
    const text = list.map((item) => `${item.category} ${item.label} ${item.amount}`).join(' ')
    expect(text).toMatch(/koriander/i)
    expect(text).toMatch(/gräddfil/i)
    expect(text).toMatch(/lime/i)
    expect(list.some((item) => Number(item.amount) >= 3)).toBe(true)
  })
})
