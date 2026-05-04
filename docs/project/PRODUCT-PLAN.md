# Product Plan

## Product Thesis

Garment Pattern Lab turns a visual clothing idea into an editable, manufacturable sewing-pattern package.

The product statement is:

**A sketch-to-pattern workbench for fashion designers.**

Longer version: Garment Pattern Lab turns fashion sketches into reviewable first-draft sewing patterns, keeping AI and 3D preview behind a sewing-aware pattern graph that designers can inspect, correct, print, and sample.

The product does not try to replace patternmakers in the first version. It gives designers, makers, and small studios a fast first draft that obeys the shape of real patternmaking: body measurements, ease, seam topology, grainline, cut pieces, seam allowance, notches, and assembly instructions.

The key product bet:

**Users should sketch garments, but the system should output pattern grammar, not arbitrary meshes.**

See [Product Design Brief](PRODUCT-DESIGN.md) for the user promise, trust model, and v1 experience shape.

## User

Three canonical personas anchor user-facing scope. Persona definitions are at `docs/design/personas/`; the version-target mapping is the load-bearing scope tool.

- **[Persona 1 — Individual Fashion Designer](../design/personas/persona-1-individual-designer.md)** — v0.1 primary user. Indie designer / advanced home sewer / costume designer wanting reference → pattern → sewable sample.
- **[Persona 2 — Production-Focused Garment Designer](../design/personas/persona-2-production-designer.md)** — v0.5+ primary user. Studio / brand designer wanting semantic propagation, variants, grading, tech-pack-adjacent output.
- **[Persona 3 — Manufacturing-Focused Designer](../design/personas/persona-3-manufacturing-designer.md)** — v1+ primary user. Factory liaison / sample-room manager wanting industrial export, marker compliance, multilingual factory instructions.

Adjacent users (costume designers, game/film clothing modelers, made-to-measure brands, patternmaking education) sit alongside these three but don't yet drive scope. They typically map onto Persona 1 or Persona 2 with slight adjustments.

## Problem

Existing garment tools usually start from one of three places:

1. Expert-authored 2D patterns, then simulate in 3D.
2. Parametric templates driven by measurements.
3. 3D visual garments that are not automatically reliable physical patterns.

The missing workflow is:

**rough sketch -> inferred style intent -> valid pattern topology -> printable/editable pattern -> 3D preview -> iteration.**

## Product Shape

### Input

- Raster sketch, vector sketch, or traceable front/back drawing.
- Figure/body reference in the sketch, or a separate measurement set.
- Optional body model/avatar preset.
- Optional garment settings: fabric class, fit amount, intended length, seam preference.

### Internal Representation

The internal representation should be a structured pattern document:

- Garment type.
- Body measurement set.
- Fabric assumptions.
- Pattern panels.
- Panel boundaries as lines/curves.
- Seam relationships between panel edges.
- Dart/pleat/tuck definitions.
- Grainline.
- Notches and balance marks.
- Seam allowance rules.
- Hem allowance rules.
- Cut counts.
- Construction order.
- 3D placement around avatar for simulation.
- Panel complexity and corner count.
- Seam-pair length and reflection-symmetry validation.
- Dart geometry and dart symmetry validation.
- Grain-axis alignment.
- Material deformation budget for future mesh-derived patterns.

This can later map to SVG, PDF, DXF/AAMA/ASTM, GarmentCode-style code, or a custom JSON schema.

### Output Strategy

There are two output lanes, and prototype 1 only needs the first.

**V1: human-readable pattern package**

This is the priority: pattern docs that a person can print, cut, review, and sew from. The package should be readable even if no cutting machine or CAD system is involved.

- Editable SVG pattern.
- Printable tiled PDF.
- Cut sheet.
- Assembly steps.
- JSON pattern graph.
- Basic 3D preview render.
- Validation report: seam lengths, edge matches, missing notches, impossible closures, body clearance/ease checks.

**V2/later: industry-standard / machine-readable production files**

This is not a near-term priority. Industry-standard and machine-readable cutter/CAD output can build on the same `PatternGraph`, but only after human-readable pattern packages are credible.

- DXF/AAMA/ASTM export.
- Machine cutter-ready nesting/marker files.
- Industrial CAD round-trip.
- Factory-oriented cutting metadata.
- Tech pack and production integration.

## First Prototype

The first prototype targets a sleeveless A-line woven dress/tunic.

### Why This First

- It is expressive enough to feel like a real garment.
- It can be built from relatively simple panels.
- It avoids sleeves, collars, plackets, and knit stretch.
- It lets the system prove: sketch parsing, measurement mapping, pattern generation, export, and 3D validation.

### Prototype User Flow

1. User uploads or draws a front/back sketch.
2. User selects or enters body measurements.
3. System detects garment landmarks:
   - neckline shape
   - shoulder endpoints
   - armhole curve
   - waist location
   - hip sweep
   - hem line
   - center front/back
   - side seams
4. System maps those landmarks into a parametric dress/tunic pattern.
5. System generates 2D panels:
   - front panel
   - back panel
   - optional front/back facing or binding strips
6. System adds:
   - seam allowance
   - hem allowance
   - grainline
   - notches
   - fold/cut labels
   - cut counts
7. System assembles a coarse 3D preview on a measurement-driven avatar.
8. User adjusts a small set of controls:
   - fit/ease
   - length
   - neck depth
   - armhole depth
   - hem sweep
   - dart on/off
9. System re-renders pattern and preview.
10. User exports a human-readable SVG/PDF/print package and instructions.

## MVP Feature Set

### Must Have

- Upload or load a sketch image.
- Manual fallback landmark placement if detection fails.
- Measurement set entry.
- Parametric pattern generation for one garment type.
- SVG export.
- PDF export or at least browser print path.
- Cut instructions.
- Seam-length validation.
- JSON pattern graph saved with the output.

### Should Have

- Simple 3D avatar and assembled garment preview.
- Difference view between sketch silhouette and generated 3D/pattern silhouette.
- Fit/ease validation report.
- Adjustable seam allowance.
- Tiled print layout.

### Could Have

- Automatic raster segmentation.
- Front/back sketch alignment.
- Fabric presets.
- DXF export.
- AI-generated construction notes.
- User annotation on sketch.

### Not Yet

- Full commercial CAD interoperability.
- Grading across size runs.
- Full cloth physics accuracy.
- Any garment category.
- Production/factory tech pack.

## Architecture Recommendation

Use four layers:

1. **Vision layer:** parse sketch into landmarks and style parameters.
2. **Pattern grammar layer:** generate valid 2D sewing topology from parameters and measurements.
3. **Candidate-to-export interop layer:** normalize, measure, correct, validate, and round-trip any candidate before it becomes an exportable pattern.
4. **Simulation/validation layer:** assemble the pattern into 3D and check fit, collision, seam consistency, and visual intent.
5. **Export layer:** produce human-readable pattern assets first; preserve enough structured data for later machine-readable outputs.

The pattern grammar layer must stay central. If the system starts from a generated 3D mesh and simply flattens it, it will produce islands, not necessarily sewable pattern pieces.

The `Computational Pattern Making from 3D Garment Models` paper adds a future branch, but not a replacement for the first prototype:

```text
3D garment mesh -> sewing-aware patch layout -> anisotropic textile flattening -> PatternGraphCandidate
```

That branch is valuable only if its output is converted into the same `PatternGraphCandidate` contract, passed through the candidate-to-export interop layer, and only then promoted to `PatternGraph`.

## Validation Model

Validation is product-critical. A visually plausible pattern is not enough.

Prototype validation should include:

- paired seam length checks
- paired seam reflection-symmetry checks where applicable
- dart leg and dart symmetry checks
- panel corner-count and panel-complexity warnings
- grainline presence and grain alignment notes
- seam allowance/cut-line presence
- self-intersection checks for panels and cut lines
- explicit limitations in the exported package
- export conformance checks
- round-trip import/export checks

## Product Risks

- Sketches are ambiguous. Front-only sketches cannot resolve back construction.
- Mesh flattening can produce geometrically valid but semantically useless panels.
- Fit depends on fabric, posture, ease, and wearer preference.
- Patternmaking expertise is encoded in small details: darts, balance, armhole shape, shoulder slope, seam walking.
- A visually plausible 3D garment can still be a poor sewing pattern.
- Copyright/licensing constraints may affect textbook ingestion and training data.
- Commercial CAD formats may be proprietary or painful.

## Success Criteria

Prototype 1 succeeds if a human with sewing knowledge says:

- The exported pattern is coherent.
- The seams match.
- The cut labels make sense.
- The garment could plausibly be mocked up in muslin.
- The system has a clear path to supporting a second garment type.
