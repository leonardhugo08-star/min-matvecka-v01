/goal Make Min Matvecka’s budget + choice-mode asset system production-ready in the existing Vite/React project at `/Users/leo/leo-os/experiments/min-matvecka-scratch-dual-mode-pwa`.

Context:
- The app already has a working planner flow in `src/App.tsx` and meal logic in `src/planner.ts`.
- Existing seed data lives under `public/seed-recipes/` with 300 recipes in `recipes.json` and realistic food images under `public/seed-recipes/images/`.
- Realistic `image` assets are for final output: matsedel, recipe cards, print/PDF/share.
- Tecknade/cartoon images are for “Välj tillsammans”. We already have 8 cartoon/category images somewhere in the project/assets; locate them, canonicalize them, and use them as fallback/category assets.
- The user wants all 300 recipes to eventually have matching cartoon `choiceImage` assets.
- Budget is a must-have: without cost estimates, the shopping list feels useless. Use ca-priser/estimates first; do not overbuild live scraping.

Outcome:
Implement and verify these six items:

1. Budgetschema + prisfil
   - Add a stable price file, preferably `public/prices/ingredient-prices.json`.
   - Include `updated_at`, `currency`, `source`, and ingredient item records.
   - Ingredient records should include unit, estimated price, confidence, and optional notes/source.
   - Cover all common ingredients appearing in the 300 seed recipes as well as current in-app planner meals.
   - Use reasonable Swedish grocery ca-priser; exact live prices are not required.

2. Beräkna ca-total i inköpslistan
   - Add parsing/normalization logic for recipe/shopping-list ingredient amounts where practical.
   - Compute estimated total for the generated shopping list.
   - Compute cost per serving/week where possible.
   - Show a clear budget summary in the app: e.g. “Ca 620 kr för veckan”, “Ca 22 kr/portion”, and a confidence/ca-pris note.
   - Add cost labels for meals or week: Budget / Normal / Dyrare.
   - If parsing cannot estimate an item, include it in an “ej prissatt/osäkert” list, not silently ignored.

3. Råvara-taxonomi på recepten
   - Add normalized rawvaror/building-block tags for recipes: e.g. `potatis`, `potatismos`, `ris`, `pasta`, `makaroner`, `nudlar`, `kyckling`, `köttfärs`, `köttbullar`, `falukorv`, `fisk`, `lax`, `ägg`, `bönor`, `linser`, `halloumi`, `pannkakor`, `soppa`.
   - Derive tags automatically from recipe ingredients/title/category where possible, then patch obvious gaps.
   - Save the augmented data in the app’s expected data source without breaking existing fields.
   - Keep this taxonomy simple and useful for filtering; do not create 200 tiny tags.

4. UI-toggle: Färdiga rätter / Råvaror
   - In “Välj maträtter tillsammans”, add a clear toggle/tab:
     - `Färdiga rätter` = complete recipe cards, default.
     - `Råvaror` = building-block choices like potatis, ris, pasta, kyckling, fisk, köttfärs etc.
   - Råvaror mode should collect likes/dislikes or accepted rawvaror and use them to influence/filter recipe selection.
   - Do not let rawvaror mode become a manual recipe builder. It should feel like a simple yes/no game that guides the final week.
   - Keep LSS-friendly, mobile-friendly copy and large tactile buttons.

5. Canonical folder för de 8 befintliga tecknade bilderna
   - Locate the 8 existing cartoon/category images.
   - Move or copy them to a canonical public folder, e.g. `public/seed-recipes/choice-categories/`.
   - Add a mapping file if helpful, e.g. `public/seed-recipes/choice-category-assets.json`.
   - Wire the app fallback logic:
     - choice mode: `choiceImage` → category cartoon asset → current gradient fallback
     - final output: `image` → category fallback/gradient only if realistic image is missing

6. Batcha tecknade bilder för alla 300
   - Create data/prompt files for cartoon choice images:
     - `public/seed-recipes/choice-image-prompts.json`
     - `public/seed-recipes/choice-image-generation-log.jsonl`
     - `public/seed-recipes/choice-failed-items.json`
     - `public/seed-recipes/choice-generation-report.md`
   - Each recipe should target `/seed-recipes/choice-images/<recipe-id>.png`.
   - Add `choiceImage` paths to recipes/data.
   - Use this style base for cartoon prompts:
     “friendly hand-drawn Swedish home-food illustration, warm children’s-book sticker style, soft outlines, appetizing simple shapes, clear dish silhouette, simple Scandinavian table setting, no text, no people, no logos, not realistic, not anime, not flat icon”.
   - If image generation tools are available in this goal session, generate a small verified pilot batch first (3–8 images), copy to final paths, update logs/reports, and leave the batch resumable.
   - If image generation tools are not available, still finish all prompt files, paths, UI wiring, and a clear runbook for the existing image pipeline to continue.

Constraints:
- Preserve the current working app flow.
- Do not remove existing realistic image support.
- Do not introduce paid/external API calls except existing configured image generation if available.
- Do not do grocery checkout, account login, or live store scraping for v0 budget.
- Keep code maintainable and simple enough for MVP.
- Prefer data-driven JSON files over hardcoded giant maps in React components.
- Use Swedish UI copy.

Verification:
- Run `npm test` and fix until green.
- Run `npm run build` and fix until green.
- Verify app renders the planner, choice mode toggle, rawvaror mode, budget summary, and final matsedel without console/type errors.
- Add/update tests for:
  - budget total calculation
  - unpriced item handling
  - rawvara filtering/scoring
  - choice image fallback selection
- Produce a short handoff report at `docs/budget-choice-cartoon-handoff.md` with:
  - what changed
  - files changed/created
  - current number of realistic images present
  - current number of cartoon choice images present
  - remaining generation work
  - test/build status
  - next recommended step

Success criteria:
- The app can show estimated shopping-list cost.
- “Välj tillsammans” supports both Färdiga rätter and Råvaror modes.
- Existing 8 cartoon assets are canonicalized and used as fallbacks.
- All 300 recipes have planned `choiceImage` paths/prompts.
- At least a pilot set of cartoon recipe images is generated if image generation is available.
- Tests and production build pass.
