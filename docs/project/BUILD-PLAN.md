# Build Plan

This is the short operating plan. The full roadmap lives in `ROADMAP.md`.

## Current Milestone

**M0: Project Grounding And Product Scaffold**

Goal: make the idea implementation-ready without starting from an under-specified dream.

Status:

- [x] Project scaffold.
- [x] Product pillars.
- [x] App/package/garment folder boundary.
- [x] Product plan.
- [x] Roadmap.
- [x] Dependencies.
- [x] Research queue.
- [x] Reference index.
- [x] Computational Pattern Making paper ingest.
- [ ] Public-source patternmaking ingestion.
- [ ] First-garment drafting formulas.
- [ ] Pattern schema.
- [ ] Sewing-aware validation checklist.
- [ ] Tech stack decision.

## Product Build Order

The implementation order is intentionally validation-first. The prototype should earn trust by producing measurable pattern documents before it spends too much energy on beautiful 3D or broad editor tooling.

After Orrery's design review and Codex's response, the first implementation move is not the clean B0-B10 sequence. It is the v0.1 dirty end-to-end spike:

```text
one garment
one measurement set
one ugly generator
one SVG package
one static preview
one validation/readiness report
one human sanity check
```

Canonical next-step plan: [V0.1 Dirty End-To-End Spike Plan](V0.1-SPIKE-PLAN.md)

Current v0.1 status:

- [x] One synthetic measurement fixture.
- [x] One garment parameter fixture.
- [x] One ugly dependency-free generator.
- [x] One generated `PatternGraphCandidate`.
- [x] One SVG package.
- [x] One static preview.
- [x] One internal readiness report.
- [x] First reusable `pattern-core`, `validation-core`, and `export-core` modules extracted from the spike.
- [x] Readiness smoke test for bad units and mismatched seam lengths.
- [x] First task-led edit package: `lengthen hem 100mm` regenerates `outputs/v0.1-length-plus-100/`.
- [ ] One human sanity check.

### B0: Repo Scaffold And Contracts

Status: in progress.

Deliverables:

- `app/`
- `packages/`
- `garments/a-line-dress-tunic/`
- `docs/project/PRODUCT-PILLARS.md`
- `docs/project/PROTOTYPE-BUILD-ORDER.md`

Exit criteria:

- Reusable product logic has a home outside garment folders.
- First-garment drafting, fixtures, references, and outputs have a home outside core packages.

### B1: PatternGraph Seed

Deliverables:

- `docs/project/PATTERN-SCHEMA.md`
- `garments/a-line-dress-tunic/fixtures/patterns/valid-seed.pattern.json`
- Invalid fixtures for seam, grainline, scale, self-intersection, and allowance errors.

Exit criteria:

- A valid first-garment pattern can be represented without generation code.
- Known-bad fixtures express the validation failures we care about.

### B2: Validation Harness First

Deliverables:

- `packages/validation-core/`
- `docs/project/PATTERN-VALIDATION-CHECKLIST.md`
- Machine-readable and human-readable validation reports.

Exit criteria:

- Bad candidates cannot export.
- Every error points to a panel, seam, dart, grainline, unit profile, or export field.

### B3: Geometry Kernel V1

Deliverables:

- `packages/geometry-core/`
- Operation fixtures for curve length, offset, intersection, closedness, self-intersection, and triangulation.
- `docs/project/TECH-STACK-DECISION.md`

Exit criteria:

- Prototype geometry operations are deterministic enough for pattern validation and SVG export.

### B4: First Garment Generator

Deliverables:

- `garments/a-line-dress-tunic/docs/drafting.md`
- Measurement and parameter fixtures.
- Generator that creates front/back panels from measurements and garment parameters.

Exit criteria:

- Side and shoulder seams validate within tolerance.
- Panel labels, notches, grainlines, allowances, and cut counts exist.

### B5: Human-Readable Export

Deliverables:

- `packages/export-core/`
- Semantic SVG export.
- Cut sheet, assembly notes, source JSON, and validation report.

Exit criteria:

- A sewing-literate human can understand what to cut and what assumptions were made.

### B6: Simple 3D Preview

Deliverables:

- `packages/preview-3d/`
- Coarse Three.js preview.
- Screenshot artifact.

Exit criteria:

- Front/back orientation, seam pairing, and rough silhouette are visible.
- Preview warnings link back to validation where possible.

### B7: Sketch Input And Landmark Bridge

Deliverables:

- `packages/sketch-intent/`
- `LayeredSourceDocument`
- Manual landmark fixtures.

Exit criteria:

- A human-authored or generated sketch can become editable garment parameters.

### B8: Natural-Language Assistant Loop

Deliverables:

- `packages/assistant-core/`
- Intent command map for hem, neckline, assumptions, seam warnings, and export readiness.

Exit criteria:

- The user can make at least one natural-language pattern-affecting edit and see the regenerated output pass validation.

### B9: Semantic Trace Layers

Deliverables:

- Editable traced curves for first-garment landmarks and silhouette features.
- Layer classification for visual-only, semantic intent, pattern-affecting, and material-affecting edits.

Exit criteria:

- The trace layer helps designers correct interpretation without turning v1 into a full vector editor.

### B10: Prototype Package And Review Gate

Deliverables:

- Complete `garments/a-line-dress-tunic/outputs/a-line-dress-tunic-v0/` package.
- Human review note.
- Decision-log entry for next garment or refinement pass.

Exit criteria:

- The package is ready for sewing-literate critique and the next product decision is evidence-based.

## Milestone M1: First Garment Rulebook

Deliverables:

- `docs/project/FIRST-GARMENT-DRAFTING.md`
- `docs/project/PATTERN-VALIDATION-CHECKLIST.md`
- Updated `docs/reference/PATTERNMAKING-FUNDAMENTALS.md`

Exit criteria:

- The sleeveless A-line tunic can be drafted from measurements on paper.
- Required measurements and default ease values are known.
- Pattern pieces, notches, seam allowance, labels, and construction order are specified.

## Milestone M2: Pattern Schema

Deliverables:

- `docs/project/PATTERN-SCHEMA.md`
- Example JSON pattern document.

Exit criteria:

- Schema represents panels, curves, seams, darts, grainlines, notches, labels, and export metadata.
- Schema distinguishes seam line from cut line.
- Schema supports seam/dart symmetry validation and grain-axis validation.

## Milestone M2.5: Sewing-Aware Validation

Deliverables:

- `docs/project/PATTERN-VALIDATION-CHECKLIST.md`
- Validation fixtures.
- `docs/project/CANDIDATE-TO-EXPORT-INTEROP.md`

Exit criteria:

- Seam length, seam reflection, dart symmetry, grainline, panel complexity, and self-intersection checks are specified.
- The prototype cannot export a pattern without a validation report.
- Candidate outputs cannot export directly; they must be normalized, measured, corrected, validated, and round-trip tested.

## Milestone M3: Measurement-To-Pattern Generator

Deliverables:

- Prototype script/app.
- Generated SVG pattern.
- Validation report.

Exit criteria:

- Pattern is generated from measurement fixture and parameter fixture.
- SVG opens in browser/Inkscape.
- Side and shoulder seams validate.

## Milestone M4: Sketch-To-Parameter Bridge

Deliverables:

- Landmark schema.
- Manual annotation flow.
- Generated pattern from annotated sketch.

Exit criteria:

- A user can mark a sketch and generate a pattern.
- Parameters are inspectable and editable.

## Milestone M5: Preview And Export Package

Deliverables:

- Simple 3D preview.
- SVG/PDF or print-ready package.
- Cut sheet.
- Assembly instructions.
- Pattern JSON.

Exit criteria:

- Human can review the pattern package without reading code.
- Validation report states known limits.

## Milestone M6: Human Review Gate

Deliverables:

- `docs/research/prototype-1-review.md`
- Updated backlog.
- Decision-log entry.

Exit criteria:

- A pattern/sewing-literate reviewer has judged whether the output is mockup-worthy.
- Next move is selected from evidence.
