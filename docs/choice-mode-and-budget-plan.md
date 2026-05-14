# Min Matvecka: Välj tillsammans + Budget

## Product decision

Use **two choice modes**, not either/or:

1. **Färdiga rätter**
   - Shows complete dishes.
   - Best for fast weekly planning: “Vill vi äta det här?”
   - Uses one cartoon image per recipe: `choiceImage`.
   - Target: all 300 recipes eventually get matching cartoon images.

2. **Råvaror / bygg veckan**
   - Shows base foods and proteins: potatis, potatismos, ris, pasta/makaroner, fisk, lax, kyckling, köttfärs, falukorv, bönor, ägg, soppa etc.
   - Best for LSS/co-planning and picky households: “Vad känns tryggt/gott den här veckan?”
   - App then selects recipes that match the accepted rawvaror.
   - This should feel like choosing building blocks, not creating a recipe manually.

Recommended default UX:

- Primary button: **Välj maträtter tillsammans** → Färdiga rätter
- Secondary tab inside: **Råvaror**
- Let user switch, but do not force a decision before starting.

## Why not rawvaror only?

Rawvaror-only is cognitively lighter, but it weakens the app’s magic. Users still want a finished week. So rawvaror should influence filtering/scoring, while recipe cards remain the main outcome.

## Asset model

Recipe fields:

```ts
image?: string          // realistic final-output food photo
choiceImage?: string    // cartoon recipe card for choice mode
rawvaror?: string[]     // normalized ingredients/building blocks
estimatedCost?: number  // recipe cost for default servings
costBand?: 'budget' | 'standard' | 'premium'
```

Rawvara taxonomy example:

```json
[
  "potatis", "potatismos", "ris", "pasta", "makaroner", "nudlar",
  "kyckling", "köttfärs", "köttbullar", "falukorv", "fisk", "lax",
  "ägg", "bönor", "linser", "halloumi", "pannkakor", "soppa"
]
```

## Cartoon image pipeline

We already have 8 cartoon/category assets. Next:

1. Put existing 8 into a canonical folder, e.g. `public/seed-recipes/choice-categories/`.
2. Add `choiceImage` for all 300 recipes, target path:
   - `/seed-recipes/choice-images/<recipe-id>.png`
3. Generate missing cartoon images with same resumable pattern as realistic images:
   - `choice-image-prompts.json`
   - `choice-image-generation-log.jsonl`
   - `choice-failed-items.json`
   - `choice-generation-report.md`
4. Prompt style:
   - friendly hand-drawn Swedish home-food illustration
   - warm children’s-book/sticker style
   - clear dish silhouette
   - no text, no people, no logos
   - not realistic, not anime, not flat icon

## Budget: must-have

Budget is not optional. Without cost estimates, the shopping list feels fake.

Minimum viable budget model:

1. Normalize every ingredient to a product-ish key:
   - `potatis`, `ris`, `pasta`, `köttfärs`, `kycklingfilé`, `mjölk`, etc.
2. Create `public/prices/ingredient-prices.json`:

```json
{
  "updated_at": "2026-05-12",
  "currency": "SEK",
  "source": "manual_estimate_v1",
  "items": {
    "potatis": { "unit": "kg", "price": 18, "confidence": "medium" },
    "ris": { "unit": "kg", "price": 32, "confidence": "medium" },
    "köttfärs": { "unit": "kg", "price": 115, "confidence": "medium" }
  }
}
```

3. Calculate:
   - recipe cost
   - cost per serving
   - week total
   - shopping list estimated total
4. Show in app:
   - `Ca 620 kr för veckan`
   - `Ca 22 kr/portion`
   - labels: **Budget**, **Normal**, **Dyrare**
5. Refresh price file every two weeks.

## Budget data strategy

Best v0: manual/agent-maintained estimate table.

Do not start with perfect live scraping. It adds store/session/product-matching complexity before the UX is proven.

Patch cadence:

- Every 2 weeks: update common ingredient prices from Mathem/Willys/Hemköp spot checks.
- Keep confidence levels.
- App should display “ca-pris”, not exact checkout total.

Later:

- Store-specific price profiles: Mathem, Willys, ICA/Hemköp.
- Offer-aware weekly planning.
- Budget slider: billigast / balanserad / extra gott.

## Next implementation order

1. Add budget schema + ingredient price table.
2. Compute estimated shopping-list total in app.
3. Add rawvara taxonomy to recipes.
4. Add UI toggle in choice mode: **Färdiga rätter** / **Råvaror**.
5. Canonicalize the 8 existing cartoon category assets.
6. Generate cartoon `choiceImage` assets for all 300 recipes.
