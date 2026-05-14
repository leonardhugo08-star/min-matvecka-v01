import { describe, expect, it } from 'vitest'
import {
  calculateShoppingBudget,
  choiceImageFor,
  createShoppingList,
  generateWeek,
  rawvaraOptions,
  rawvarorForMeal,
  type PlannerProfile,
} from './planner'

const familyProfile: PlannerProfile = {
  mode: 'family',
  name: 'Familjen Budget',
  people: 4,
  liked: [],
  disliked: [],
  restrictions: '',
  days: 5,
}

describe('budget, rawvara and cartoon choice support', () => {
  it('calculates estimated shopping-list total and price per serving', () => {
    const plan = generateWeek({ ...familyProfile, liked: ['tacos'] })
    const list = createShoppingList(plan, familyProfile.people)
    const budget = calculateShoppingBudget(list, plan.length, familyProfile.people)

    expect(budget.totalSek).toBeGreaterThan(100)
    expect(budget.pricePerServingSek).toBeGreaterThan(5)
    expect(['Budget', 'Normal', 'Dyrare']).toContain(budget.label)
    expect(budget.note).toMatch(/ca-priser/i)
  })

  it('keeps unpriced items visible instead of silently dropping them', () => {
    const budget = calculateShoppingBudget(
      [{ category: 'Övrigt', label: 'mystisk råvara', amount: 2, unit: 'st' }],
      1,
      2,
    )

    expect(budget.totalSek).toBe(0)
    expect(budget.unpricedItems).toContain('mystisk råvara')
    expect(budget.confidence).toBe('low')
  })

  it('derives useful rawvara tags and lets rawvaror influence recipe scoring', () => {
    const [meal] = generateWeek({ ...familyProfile, liked: ['rawvara:potatis'], disliked: ['rawvara:pasta'] })

    expect(rawvaraOptions.some((option) => option.id === 'potatis')).toBe(true)
    expect(rawvarorForMeal(meal)).toContain('potatis')
    expect(rawvarorForMeal(meal)).not.toContain('pasta')
  })

  it('selects choice image with recipe path, category cartoon fallback and gradient fallback', () => {
    expect(choiceImageFor({ mainFoodId: 'pasta', imageTone: 'pasta', choiceImage: '/seed-recipes/choice-images/x.png' }).src).toBe('/seed-recipes/choice-images/x.png')
    expect(choiceImageFor({ mainFoodId: 'fish', imageTone: 'fish' }).src).toMatch(/choice-categories\/fish\.png$/)
    expect(choiceImageFor({ mainFoodId: 'unknown', imageTone: 'unknown' as never }).kind).toBe('gradient')
  })
})
