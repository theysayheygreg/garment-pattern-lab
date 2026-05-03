# Prototype Build Order

Date: 2026-05-03

This is the working build path from product pillars to a first usable prototype.

## Folder Boundary

Reusable product engine:

- `app/`
- `packages/sketch-intent/`
- `packages/pattern-core/`
- `packages/geometry-core/`
- `packages/validation-core/`
- `packages/export-core/`
- `packages/preview-3d/`
- `packages/assistant-core/`

Garment-specific program:

- `garments/a-line-dress-tunic/`

Rule: if code or data only makes sense for the sleeveless A-line dress/tunic, it belongs in the garment folder. If it should work for future garments, it belongs in app/packages.

## Build Slices

### B0: Repo Scaffold And Contracts

Goal: make implementation boundaries obvious.

Tasks:

- keep app shell separate from reusable packages
- keep first garment program separate from reusable engine
- add readmes and fixture folders
- define first TypeScript package plan before writing app UI

Exit:

- a developer knows where new files belong

### B1: PatternGraph Seed

Goal: hand-author one valid first-garment candidate.

Tasks:

- define measurement fixture
- define garment parameter fixture
- define a hand-authored `PatternGraphCandidate`
- define expected `PatternGraph` after validation
- create invalid fixture examples

Exit:

- validation can be built against known-good and known-bad fixtures

### B2: Validation Harness First

Goal: prevent pretty invalid output.

Tasks:

- implement units/scale checks
- closed panel checks
- seam length checks
- grainline/fold/label/cut-count checks
- seam allowance/cut-line checks
- warning/error/limitation report

Exit:

- no candidate can export without a validation report

### B3: Geometry Kernel V1

Goal: provide just enough geometry for the first garment.

Tasks:

- points, lines, cubic/quadratic path support
- length and sampling
- offset approximation for seam allowance
- intersection/self-intersection checks
- triangulation handoff

Exit:

- first pattern can generate and validate without manual SVG drawing

### B4: First Garment Generator

Goal: generate the A-line dress/tunic from measurements and parameters.

Tasks:

- implement first-garment drafting formulas
- generate front/back panels
- add neckline, armhole, side seam, shoulder, hem
- add seam/cut lines, labels, notches, grainlines
- validate generated candidate

Exit:

- measurement + parameters produce a valid `PatternGraph`

### B5: Human-Readable Export

Goal: make the pattern useful outside the app.

Tasks:

- semantic SVG export
- cut sheet
- assembly notes
- validation report
- source JSON
- basic print/PDF path

Exit:

- a person can inspect what to cut and sew

### B6: Simple 3D Preview

Goal: add feedback without making 3D the source of truth.

Tasks:

- triangulate panels
- create simple body proxy/avatar
- orient front/back panels
- visualize seam pairs
- show rough fit/ease/clearance warnings

Exit:

- 3D preview reveals obvious orientation/silhouette problems

### B7: Sketch Input And Landmark Bridge

Goal: connect art to parameters manually first.

Tasks:

- source image upload/local load
- landmark schema
- manual landmark annotation
- semantic callout confirmation
- convert landmarks into garment parameters
- show assumption/ambiguity summary

Exit:

- a human sketch can drive the first garment generator

### B8: Natural-Language Assistant Loop

Goal: make the product feel unlike CAD.

Tasks:

- commands for hem length, neckline, armhole, shoulder width, ease, hem sweep
- "show assumptions" summary
- "show errors/warnings" summary
- parameter update log
- undo/revision record

Exit:

- user can make meaningful edits without direct CAD operations

### B9: Semantic Trace Layers

Goal: add the useful part of vector editability.

Tasks:

- source/reference layer
- guide/croquis layer
- editable trace layer
- semantic vector layer
- callout layer
- pattern-affecting vs visual-only classification

Exit:

- user can correct traced features without entering full vector-editor mode

### B10: Prototype Package And Review Gate

Goal: close the loop with a real review artifact.

Tasks:

- generate full output package
- save screenshot of 3D preview
- save validation report
- run print/scale check
- collect sewing-literate review
- record defects and next decision

Exit:

- prototype is accepted as mockup-worthy or scoped to repair

## Implementation Bias

- Build validation before 3D beauty.
- Build manual landmarking before automatic sketch parsing.
- Build semantic vector correction before generic vector editing.
- Build one garment well before adding garment families.
- Keep every assumption visible.
