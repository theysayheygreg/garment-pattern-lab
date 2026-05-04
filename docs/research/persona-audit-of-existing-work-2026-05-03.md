# Persona Audit Of Existing Work

Date: 2026-05-03

A review of every artifact landed in the project so far, lensed through the three canonical personas (`docs/design/personas/`). For each artifact, the audit asks: which persona does it serve, at which version, and is it well-targeted or accidentally serving the wrong one?

This audit is internal scoping work. Its purpose is to surface where existing work aligns with v0.1's Persona 1 commitment, where it accidentally drifts toward Persona 2 / 3 territory, and where genuine gaps exist before the v0.1 product promise is met.

## Persona 1 (Individual Designer, v0.1) — Existing Coverage

The whole v0.1 dirty end-to-end pipeline is targeted at this user. Coverage by artifact:

**Pattern package outputs** (`garments/a-line-dress-tunic/outputs/v0.1/`):

- `cut-sheet.md` — language is sewing-shaped: "Front half panel," "1 on fold," "bias binding or facing," "shoulder seams." Good Persona 1 voice. The `Known Limits` section is direct and honest. **Aligned.**
- `assembly.md` — terse but in sewing-literate language: "Turn hem allowance and stitch," "Finish neckline and armholes with bias binding or facing." **Aligned.**
- `pattern.svg` — geometry, no language. **Aligned.**
- `preview.html` — static 3D-ish placement preview. **Aligned at concept; needs visual polish for a real Persona 1 demo.**
- `readiness.md` and `readiness.json` — explicitly self-tagged as internal: "This is internal readiness instrumentation summarized for package review. It is not a designer-facing error console." **Aligned with the dev/user-surface decision.** But: these files ship inside the user package directory, which means a Persona 1 user receiving the whole zip would see them. **Gap: the user-package and the dev-package may want to be distinct artifacts.**

**Engine modules** (`packages/`):

- `pattern-core`, `validation-core`, `export-core` — internal; Persona 1 doesn't see them. **Aligned.**
- `assistant-core` with the `lengthen hem 100mm` verb — this is the seed of Persona 1's user-surface conversational lane. **Aligned at seed; needs more verbs to feel real.** Persona 1 user stories 3 and 5 want at least: hem length, neckline depth/shape, armhole depth, ease, length, and "show me what you assumed." One verb doesn't carry the demo.

**Workbench** (`app/dist/workbench.html`):

- Shape: a comparison page linking two output variants (base v0.1 + lengthen-hem-100). **Drift toward Persona 2.** Side-by-side variant comparison is a Persona 2 feature. Persona 1 needs a single-pattern view with edit affordances and an export button, not a developer comparison page. **Gap: no Persona 1-shaped workbench exists yet.**

**Sketch input lane** (`packages/sketch-intent/`):

- Empty placeholder. v0.1 used synthetic measurements, not a sketch. **Gap: Persona 1's user story 1 ("upload a sketch") and user story 7 ("photo of a drape") are not yet delivered.** This is the V-Model lane and the vectorization SOA's recommended Potrace+VTracer baseline.

**3D preview**:

- A static HTML placement preview. **Aligned at concept; needs implementation depth.** Persona 1's user story 4 (sanity-check silhouette before cutting muslin) is partially covered.

**Print-to-scale**:

- The package has SVG output. **Gap: no tiled PDF for home-printer output yet.** Persona 1's user story 2 (print on home printer) is not yet delivered.

**Voice in the corpus**:

- `garment-families.json`, `craft-conventions.json`, `drafting-formulas-a-line-tunic.json`, `garment-family-landmark-priors.json` — engine instrumentation, not user-facing. **Aligned with the corrected user-surface voice decision.** The `fix_suggestions` field in the drafting-formulas file is engine instrumentation that informs the assistant; not the assistant's user-facing string itself. **Aligned, given the correction.**

## Persona 2 (Production Designer, v0.5+) — Anticipatory Coverage

Designed-in but not built. Coverage by concept:

- **Variant generation** — named in the operation taxonomy as deferred. The static workbench's two-variant comparison is a thin proof-of-concept in this direction but not a real variant operation in the DAG. **Correctly deferred.**
- **Grading** — named in `narrow services` as later. Drafting formulas don't yet expose grade rules. **Correctly deferred.**
- **Dependency propagation** — not in v0.1. The current parameter-edit primitive (`lengthen_hem(100mm)`) doesn't propagate to dependent features (it should, in v0.5+, when a hem change affects ease distribution or hem sweep). **Correctly deferred for v0.1 but is the v0.5 headline feature.**
- **Tech-pack output** — not in v0.1. Cut sheet and assembly notes are seeds. **Correctly deferred.**
- **Multi-pattern workspace** — the workbench HTML hints at this. **Correctly seeded; not a real workspace yet.**
- **Brand-block library** — not in v0.1. **Correctly deferred.**
- **Revision history** — DAG isn't real yet. v0.1 produces snapshots in `outputs/v0.1/` and `outputs/v0.1-length-plus-100/` as filesystem directories. **Correctly deferred.**

## Persona 3 (Manufacturing Designer, v1+) — Correctly Absent

Nothing in v0.1 targets Persona 3, and nothing should. Audit:

- **Industrial export (DXF/AAMA/ASTM)** — absent. **Correct.**
- **Marker layout** — absent. **Correct.**
- **Multilingual instructions** — absent (named in Kew vision, deferred). **Correct.**
- **Approval gates** — absent. **Correct.**
- **Factory profile management** — absent. **Correct.**
- **Tolerance verification per factory target** — `validation-core` exists as the seed for this but does not yet have per-target thresholds. **Correct deferral; the gate state-machine decision (Q2) sets up the architecture for it later.**

## Cross-Cutting Findings

### 1. The user-package and the dev-package should be distinct

Currently `outputs/v0.1/` mixes Persona 1 artifacts (`cut-sheet.md`, `assembly.md`, `pattern.svg`, `preview.html`) with internal instrumentation (`readiness.md`, `readiness.json`, `pattern.json`). If a Persona 1 user receives the whole directory, they see internal files marked "not designer-facing" — the very leak the dev/user-surface decision was meant to prevent.

**Recommendation:** split the export into `package/` (Persona 1) and `dev-artifacts/` (engineer instrumentation), or rename the readiness files with a `_dev_` prefix to make their nature visible. Land before any Persona 1 demo.

### 2. The current workbench is a dev artifact, not a user surface — and that's correct for v0.1

`app/dist/workbench.html` compares two pattern variants side-by-side. Earlier framing of this finding called it "wrong-personaed" and proposed building a Persona-1-shaped workbench at v0.1. **Reclassified after Greg pushback:** v0.1 and v0.5 are headless code-harness territory; the user-facing artifact at v0.1 is the printable pattern package, not a UI. The current `workbench.html` is fine *as a dev comparison artifact* — it shouldn't pretend to be a user surface, but a user surface isn't on the v0.1 critical path either.

The visual side-by-side (vector pattern + 3D model preview, possibly with variant comparison) is a **v1 magic moment** — that's the "you can see how the pieces move" experience Pattern Lab is ultimately for, and it requires the operation surface, the workspace, and the 3D preview all working together. v0.5 is somewhere between: the DAG and operation surface are real but the visual workbench is still developer-shaped.

**Recommendation:** stop calling `workbench.html` the workbench. Rename it `dev-comparison.html` or move it under `app/dev-artifacts/` so its nature is honest. v0.1 ships the package; the user-facing workbench is v1.

### 3. The assistant-core has one verb; keep it as a v0.5 seed

`lengthen hem 100mm` is the seed of the future task-led operation surface. After the v0.1 design lock, it is no longer a v0.1 requirement: the v0.1 promise is one-shot input to printable package, with no editing surface. Keep the code as a dev comparison artifact and v0.5 seed, but do not count it toward v0.1 acceptance.

**Recommendation:** when v0.5 begins, expand the assistant verb set to cover the parameters in `drafting-formulas-a-line-tunic.json`. Each verb is a `parameter_edit` operation in the DAG. The vocabulary should match the parameters the drafting formulas actually consume — that gives a coherent set of edits that round-trips cleanly.

### 4. The sketch input lane is empty (reconfirms existing direction)

`packages/sketch-intent/` is a placeholder. The v0.1 dirty pipeline uses synthetic measurements, not a sketch. Persona 1's primary user story (#1 — "upload a reference image") is not deliverable.

This is not a fresh audit finding — it's the V-Model lane plus vectorization plus semantic interpretation plus the candidate-to-export interop, all of which are already designed across:

- `docs/research/vectorization-for-garment-ingestion-2026-05-03.md` (Potrace + VTracer recipe-driven bridge)
- `docs/research/semantic-curve-interpretation-soa-2026-05-03.md` (heuristic landmark priors with manual fallback)
- `docs/research/bespoke-model-opportunities-2026-05-03.md` (V-Model staged enrichment)
- `docs/project/CANDIDATE-TO-EXPORT-INTEROP.md` (the interop layer)

**Recommendation:** the implementation order is set; this is execution work, not design work. Codex's lane.

### 5. Print-to-scale tiled PDF missing

Persona 1 user story 2 (home-printer tiled output) requires a PDF tiler. The current export produces SVG only. SVG can be printed but most home-print software handles tiling poorly.

**Recommendation:** add a tiled-PDF export to `export-core` before any Persona 1 demo. PDFKit / pdf-lib in the browser is sufficient.

### 6. The 3D preview needs visual depth or honest framing

The current `preview.html` is a static placement preview. Persona 1 user story 4 (silhouette sanity check) wants enough depth to see whether the front/back assemble plausibly. Two options: build the simple Three.js panel-on-body proxy (B6 of the build order), or label the current preview clearly as "geometric layout, not a fit preview" so it doesn't oversell.

**Recommendation:** build B6 if time allows; otherwise frame the current preview honestly until B6 lands.

### 7. The corpus files contain `fix_suggestions` strings that are now correctly tagged as internal

After the corrected garment-language decision, `fix_suggestions` in `drafting-formulas-a-line-tunic.json` is engine instrumentation, not user-facing copy. The assistant collaborator may translate them into design language at the surface boundary, but the raw strings can stay in their current shape. **No change needed; the audit confirms alignment.**

## Recommended v0.1 Closing Punch List

For v0.1's headless harness to deliver a Persona-1-usable pattern package end-to-end, in priority order:

1. **Split user-package from dev-artifacts at export.** Codex / dev task. Move `readiness.*` out of the user package directory; keep them under a `dev-artifacts/` sibling. Rename `workbench.html` to `dev-comparison.html` or move it under `app/dev-artifacts/` so its nature is honest. **Implemented in Phase A on 2026-05-04.**
2. **Implement the sketch-input lane** via the existing V-Model baseline (Potrace + VTracer + heuristic landmarks per the design docs already landed). Codex's lane.
3. **Add tiled-PDF export.** Codex / dev task. PDFKit / pdf-lib in the export-core module is sufficient.
4. **Honest 3D preview labeling or B6 build.** Either ship B6 (simple Three.js panel-on-body proxy) or label the current static preview as "geometric layout, not a fit preview." Don't oversell what isn't there.
5. **Print and human sanity check.** Run the package through a real print/tape/read review with Kiko or another sewing-literate reviewer.

The v0.1 deliverable is a printable, sewable pattern package and a working sketch → pattern path on one garment family. The user-facing workbench (vector + 3D side-by-side) is **v1 magic-moment territory** — explicitly not v0.1 or v0.5 scope.

These five items close the gap between what exists and what v0.1's product promise actually requires. None reach into Persona 2 or Persona 3 territory.

## What This Audit Did Not Cover

- Detailed code review of the modules (Codex's lane).
- Performance characterization (premature; nothing user-facing runs yet).
- License audit of the dependency tree (separate ongoing pass via `DEPENDENCY-REGISTER.md`).
- The bespoke-model lanes (V-Model and R-Model) — those are research, not yet built; their persona alignment is V-Model→Persona 1 input, R-Model→Persona 2 refinement, which is correct.
