#!/usr/bin/env python3
"""Robust overnight image pipeline for Min Matvecka.
Runs Hermes in small chunks so a stuck image/request cannot block the whole night.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

ROOT = Path("/Users/leo/leo-os/experiments/min-matvecka-scratch-dual-mode-pwa")
OUT = ROOT / "public" / "seed-recipes"
IMAGES = OUT / "images"
PROMPTS = OUT / "image-prompts.json"
LOG = OUT / "night-image-pipeline-v2.log"
CHUNK_DIR = OUT / "chunk-prompts-v2"
CHUNK_SIZE = int(os.environ.get("MIN_MATVECKA_CHUNK_SIZE", "5"))
CHUNK_TIMEOUT = int(os.environ.get("MIN_MATVECKA_CHUNK_TIMEOUT", "1800"))
SLEEP_SECONDS = int(os.environ.get("MIN_MATVECKA_CHUNK_SLEEP", "15"))
MAX_IMAGES = int(os.environ.get("MIN_MATVECKA_MAX_IMAGES", "300"))


def log(msg: str) -> None:
    line = f"{datetime.now().astimezone().isoformat(timespec='seconds')} {msg}"
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(line + "\n")
    print(line, flush=True)


def image_ok(item: dict) -> bool:
    target = ROOT / "public" / item["image"].lstrip("/")
    return target.exists() and target.stat().st_size > 10_000


def write_final_report() -> None:
    recipes = json.loads((OUT / "recipes.json").read_text(encoding="utf-8"))
    missing = []
    for r in recipes:
        p = ROOT / "public" / r["image"].lstrip("/")
        if not p.exists() or p.stat().st_size < 10_000:
            missing.append({"id": r["id"], "title": r["title"], "image": r["image"], "prompt": r["image_prompt"]})
    failed = {"failed": missing, "validation_errors": []}
    (OUT / "failed-items.json").write_text(json.dumps(failed, ensure_ascii=False, indent=2), encoding="utf-8")
    cat_counts = {}
    for r in recipes:
        cat_counts[r["category"]] = cat_counts.get(r["category"], 0) + 1
    img_count = len(recipes) - len(missing)
    report = [
        "# Min Matvecka seed recipe generation report",
        "",
        f"Recipes: {len(recipes)}",
        f"Images generated/found: {img_count}",
        f"Missing/failed images: {len(missing)}",
        "",
        "## Category distribution",
    ]
    report += [f"- {k}: {v}" for k, v in sorted(cat_counts.items())]
    report += ["", "## Example recipes"]
    report += [f"- {r['title']} ({r['id']})" for r in recipes[:10]]
    report += ["", "## Files", "- recipes.json", "- recipes.csv", "- image-prompts.json", "- images/", "- failed-items.json", "- image-generation-log.jsonl", "- night-image-pipeline-v2.log"]
    if missing:
        report += ["", "## First missing images"] + [f"- {m['title']} ({m['id']})" for m in missing[:40]]
    report += ["", "## App integration suggestion", "Load public/seed-recipes/recipes.json as the default recipe library. Image fields are already public paths."]
    (OUT / "generation-report.md").write_text("\n".join(report) + "\n", encoding="utf-8")
    log(f"REPORT recipes={len(recipes)} images={img_count} missing={len(missing)}")


def make_prompt(chunk: list[dict], indices: list[int]) -> str:
    compact = [
        {"index": idx, "id": item["id"], "title": item["title"], "target": str(ROOT / "public" / item["image"].lstrip("/")), "prompt": item["prompt"]}
        for idx, item in zip(indices, chunk)
    ]
    return f"""You are executing a small, bounded Min Matvecka image-generation chunk.

Project root: {ROOT}
Output dir: {IMAGES}
Append log lines to: {OUT / 'image-generation-log.jsonl'}

Items to process, as JSON:
{json.dumps(compact, ensure_ascii=False, indent=2)}

For each item:
1. If target exists and is >10 KB, append a JSONL record with status='skipped' and continue.
2. Otherwise call image_generate exactly once with aspect_ratio='landscape' and the item's exact prompt.
3. Copy the generated image path returned by image_generate to the target path.
4. Append a JSON object to image-generation-log.jsonl with fields: id, title, status ('generated'|'skipped'|'failed'), target, source, error.
5. Continue after individual failures.

Rules:
- Do not ask questions.
- Do not modify recipe data.
- Use the prompt exactly as stored.
- Final response must be one short line: generated=N skipped=N failed=N.
"""


def main() -> int:
    os.chdir(ROOT)
    IMAGES.mkdir(parents=True, exist_ok=True)
    CHUNK_DIR.mkdir(parents=True, exist_ok=True)
    items = json.loads(PROMPTS.read_text(encoding="utf-8"))
    log(f"START v2 chunk_size={CHUNK_SIZE} timeout={CHUNK_TIMEOUT}s max_images={MAX_IMAGES}")

    while True:
        items = json.loads(PROMPTS.read_text(encoding="utf-8"))
        done = sum(1 for it in items if image_ok(it))
        missing_pairs = [(i, it) for i, it in enumerate(items) if not image_ok(it)]
        log(f"STATUS done={done} missing={len(missing_pairs)}")
        write_final_report()
        if not missing_pairs or done >= MAX_IMAGES:
            log("DONE target reached")
            return 0

        selected = missing_pairs[:CHUNK_SIZE]
        indices = [i for i, _ in selected]
        chunk = [it for _, it in selected]
        prompt = make_prompt(chunk, indices)
        prompt_file = CHUNK_DIR / f"chunk_{indices[0]}_{indices[-1]}_{int(time.time())}.txt"
        prompt_file.write_text(prompt, encoding="utf-8")
        log(f"RUN chunk indices={indices} ids={[it['id'] for it in chunk]}")

        env = os.environ.copy()
        env.setdefault("OPENAI_IMAGE_MODEL", "gpt-image-2-low")
        cmd = ["hermes", "-z", prompt, "-t", "file,terminal,image_gen"]
        try:
            result = subprocess.run(cmd, cwd=str(ROOT), env=env, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=CHUNK_TIMEOUT)
            with LOG.open("a", encoding="utf-8") as f:
                f.write(result.stdout or "")
                f.write("\n")
            log(f"CHUNK exit={result.returncode} indices={indices}")
        except subprocess.TimeoutExpired as exc:
            with LOG.open("a", encoding="utf-8") as f:
                if exc.stdout:
                    f.write(str(exc.stdout))
                f.write("\nTIMEOUT\n")
            log(f"CHUNK TIMEOUT indices={indices}; continuing")
        except Exception as exc:
            log(f"CHUNK ERROR indices={indices}: {exc!r}; continuing")

        time.sleep(SLEEP_SECONDS)


if __name__ == "__main__":
    raise SystemExit(main())
