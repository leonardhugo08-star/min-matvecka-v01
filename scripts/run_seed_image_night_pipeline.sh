#!/usr/bin/env bash
set -euo pipefail

ROOT="/Users/leo/leo-os/experiments/min-matvecka-scratch-dual-mode-pwa"
OUT="$ROOT/public/seed-recipes"
PROMPTS="$OUT/image-prompts.json"
LOG="$OUT/night-image-pipeline.log"
CHUNK_DIR="$OUT/chunk-prompts"
mkdir -p "$OUT/images" "$CHUNK_DIR"
cd "$ROOT"

: > "$LOG"
echo "$(date -Iseconds) Starting Min Matvecka image night pipeline" | tee -a "$LOG"

# Prefer low tier for a 300-image overnight content run; enough for in-app seed images and faster/cheaper.
export OPENAI_IMAGE_MODEL="gpt-image-2-low"

for START in $(seq 0 20 280); do
  END=$((START + 19))
  PROMPT_FILE="$CHUNK_DIR/chunk_${START}_${END}.txt"
  cat > "$PROMPT_FILE" <<EOF
You are executing one chunk of the Min Matvecka seed-content image pipeline.

Project root: $ROOT
Input file: $PROMPTS
Output image dir: $OUT/images
Chunk: zero-based recipe indices $START through $END inclusive.

Task:
1. Read image-prompts.json.
2. For each item in this chunk, if /Users/leo/leo-os/experiments/min-matvecka-scratch-dual-mode-pwa/public/seed-recipes/images/<id>.png already exists and is larger than 10 KB, skip it.
3. Otherwise call the image_generate tool with:
   - aspect_ratio: landscape
   - prompt: the item's exact prompt
4. Copy the generated image file returned by image_generate to:
   /Users/leo/leo-os/experiments/min-matvecka-scratch-dual-mode-pwa/public/seed-recipes/images/<id>.png
5. Do not ask questions. Continue after individual failures.
6. Append one JSON object per attempted item to:
   /Users/leo/leo-os/experiments/min-matvecka-scratch-dual-mode-pwa/public/seed-recipes/image-generation-log.jsonl
   with fields: id, title, status, target, source, error.
7. Final response: one short line with generated/skipped/failed counts for this chunk.

Important style:
Use the prompt exactly as stored. Images should be realistic fresh home-kitchen/table meal photos, not cartoon or luxury restaurant.
EOF

  echo "$(date -Iseconds) Running chunk $START-$END" | tee -a "$LOG"
  if hermes -z "$(cat "$PROMPT_FILE")" -t "file,terminal,image_gen" >> "$LOG" 2>&1; then
    echo "$(date -Iseconds) Chunk $START-$END complete" | tee -a "$LOG"
  else
    echo "$(date -Iseconds) Chunk $START-$END FAILED; continuing" | tee -a "$LOG"
  fi
  # small pause to reduce API/rate pressure
  sleep 10
done

python3 - <<'PY' | tee -a "$LOG"
import json
from pathlib import Path
root = Path('/Users/leo/leo-os/experiments/min-matvecka-scratch-dual-mode-pwa')
out = root / 'public' / 'seed-recipes'
recipes = json.loads((out/'recipes.json').read_text(encoding='utf-8'))
missing=[]
for r in recipes:
    p = root / 'public' / r['image'].lstrip('/')
    if not p.exists() or p.stat().st_size < 10_000:
        missing.append({'id': r['id'], 'title': r['title'], 'image': r['image'], 'prompt': r['image_prompt']})
failed = {'failed': missing, 'validation_errors': []}
(out/'failed-items.json').write_text(json.dumps(failed, ensure_ascii=False, indent=2), encoding='utf-8')
cat_counts = {}
for r in recipes:
    cat_counts[r['category']] = cat_counts.get(r['category'],0)+1
img_count = len(recipes) - len(missing)
report = ['# Min Matvecka seed recipe generation report','',f'Recipes: {len(recipes)}',f'Images generated/found: {img_count}',f'Missing/failed images: {len(missing)}','', '## Category distribution']
report += [f'- {k}: {v}' for k,v in sorted(cat_counts.items())]
report += ['', '## Example recipes']
report += [f"- {r['title']} ({r['id']})" for r in recipes[:10]]
report += ['', '## Files', '- recipes.json', '- recipes.csv', '- image-prompts.json', '- images/', '- failed-items.json', '- image-generation-log.jsonl']
if missing:
    report += ['', '## First missing images'] + [f"- {m['title']} ({m['id']})" for m in missing[:30]]
report += ['', '## App integration suggestion', 'Load public/seed-recipes/recipes.json as the default recipe library. Image fields are already public paths.']
(out/'generation-report.md').write_text('\n'.join(report)+'\n', encoding='utf-8')
print(json.dumps({'recipes': len(recipes), 'images': img_count, 'missing': len(missing), 'out': str(out)}, ensure_ascii=False))
PY

echo "$(date -Iseconds) Pipeline finished" | tee -a "$LOG"
