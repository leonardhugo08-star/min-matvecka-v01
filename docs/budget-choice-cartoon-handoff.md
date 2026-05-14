# Budget + choice/cartoon handoff

## What changed

- Added v0 Swedish grocery ca-price data and budget calculation for generated shopping lists.
- Added budget summary in the app: total week estimate, kr/portion, Budget/Normal/Dyrare label, ca-price note, and visible unpriced items.
- Added simple rawvara taxonomy/scoring: rawvara yes/no choices influence recipe selection without becoming a manual recipe builder.
- Added `Färdiga rätter` / `Råvaror` toggle in “Välj maträtter tillsammans”.
- Canonicalized existing cartoon/category assets into `public/seed-recipes/choice-categories/` and wired choice fallback: recipe `choiceImage` → category cartoon → gradient.
- Added prompt/log/failure/report files for all 300 cartoon choice images.
- Generated a 3-image pilot cartoon batch.

## Files changed/created

- `src/planner.ts` — budget calculation, rawvara tags/scoring, choice image fallback.
- `src/App.tsx` — rawvara toggle and budget summary UI.
- `src/App.css` — toggle and budget styling.
- `src/budget-choice.test.ts` — new budget/rawvara/image fallback tests.
- `src/App.test.tsx` — UI regression coverage for rawvara toggle and budget summary.
- `public/prices/ingredient-prices.json` — 75 ingredient ca-price records.
- `public/seed-recipes/recipes.json` — augmented with `rawvaror` and `choiceImage` fields.
- `public/seed-recipes/choice-category-assets.json` — fallback asset mapping.
- `public/seed-recipes/choice-categories/` — 19 canonical fallback assets.
- `public/seed-recipes/choice-image-prompts.json` — 300 cartoon prompts.
- `public/seed-recipes/choice-image-generation-log.jsonl` — resumable generation log.
- `public/seed-recipes/choice-failed-items.json` — remaining generation queue.
- `public/seed-recipes/choice-generation-report.md` — generation status + runbook.
- `public/seed-recipes/choice-images/` — 3 generated pilot images.

## Asset status

- Realistic images present: 113
- Cartoon recipe choice images present: 3
- Canonical category fallback assets present: 19
- Remaining cartoon recipe images: 297

## Pilot cartoon images generated

- `/seed-recipes/choice-images/kottbullar-med-potatismos-och-lingon.png`
- `/seed-recipes/choice-images/korvstroganoff-med-ris.png`
- `/seed-recipes/choice-images/tomatsoppa-med-ostsmorgas.png`

## Verification

- `npm test` ✅ 13 tests passed.
- `npm run build` ✅ production build passed.
- Browser smoke test on local Vite dev server ✅ planner rendered, choice toggle appeared, rawvara mode switched, generated matsedel showed budget summary (`Ca 1059 kr för veckan` in smoke run), no console JS errors observed.

## Remaining work

- Generate the remaining 297 cartoon recipe images using `choice-image-prompts.json`.
- Replace low-confidence ingredient ca-prices over time with a manually maintained Mathem/Willys/ICA source pass if needed.
- Later: use the full 300 seed recipe library in live planner selection rather than the smaller in-code MVP template list.

## Next recommended step

Batch 25–50 cartoon choice images at a time, QA as contact sheets, then keep the 8/category fallback for anything still missing. Budget is good enough for MVP now; do not block on live grocery scraping.
