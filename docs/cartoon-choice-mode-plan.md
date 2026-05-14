# Cartoon dish images for “välj tillsammans”

## Direction

Use the realistic food photos for the final output: matsedel, recipe cards, print/PDF and share views.

Use separate cartoon-style dish cards for the together-choice flow. This should feel safer, more playful and less “this is exactly what dinner must look like”.

## UX model

1. User taps **Välj maträtter tillsammans**.
2. App shows one large illustrated card at a time:
   - cartoon dish image
   - dish title
   - short friendly description
   - simple tags
   - big buttons: **Nej** / **Ja**
3. Optional Potatis mascot appears as guide/commentator, not on every card if it becomes noisy.
4. After enough YES choices, app creates the week.
5. Final week switches back to realistic food photos.

## Asset split

- `image`: realistic final-output photo, e.g. `/seed-recipes/images/...png`
- `choiceImage`: cartoon choice-mode illustration, e.g. `/seed-recipes/cartoon-choice/...png`

Fallback order in app:

1. In choice mode: `choiceImage`
2. If missing: category illustration by `imageTone`
3. If missing: current gradient fallback

Final output fallback:

1. `image`
2. category illustration by `imageTone`
3. current gradient fallback

## Style brief for cartoon assets

- Swedish home-food, friendly and clear.
- Warm hand-drawn children’s-book / sticker style.
- Soft outlines, appetizing shapes, simple table setting.
- No text in the image.
- No faces on the food unless intentionally used for mascot/character cards.
- Not luxury restaurant, not hyperrealistic, not anime, not generic flat icon.
- Should work as a big swipe/choice card on mobile.

## Batch plan

Phase 1: create 8 category fallback illustrations:

- tacos
- pasta
- kyckling
- fisk/lax
- köttbullar/kött
- soppa
- vegetariskt
- pannkakor

Phase 2: generate cartoon images for the 17 current in-app demo meals.

Phase 3: extend to all 300 seed recipes, same resumable pattern as realistic images.

## Implementation tasks

1. Add optional `choiceImage?: string` to `MealTemplate`.
2. Update choice panel to render a large illustrated dish card.
3. Keep `image` for final matsedel card.
4. Add CSS for choice-card image treatment: friendly frame, big tactile card, large JA/NEJ buttons.
5. Add JSONL logging and `generation-report.md` section for cartoon-choice assets.
6. Validate on mobile: choice mode must feel like a simple yes/no game, not a form.
