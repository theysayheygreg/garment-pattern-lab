# Build Plan

This is the short operating plan. The full roadmap lives in `ROADMAP.md`.

## Current Milestone

**M0: Project Grounding**

Goal: make the idea implementation-ready without starting from an under-specified dream.

Status:

- [x] Project scaffold.
- [x] Product plan.
- [x] Roadmap.
- [x] Dependencies.
- [x] Research queue.
- [x] Reference index.
- [ ] Public-source patternmaking ingestion.
- [ ] First-garment drafting formulas.
- [ ] Pattern schema.
- [ ] Tech stack decision.

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

