# Output Surfaces

Date: 2026-05-04

This document anchors the human-facing output model for Garment Pattern Lab.

Kiko's project-canvas reference is the right mental model for the main review surface: source reference, body/croquis context, interpreted garment sketch, measurements, landmark lines, and callouts visible together. The output should feel like a fashion design and pattern board, not like a file dump.

## Core Decision

Pattern Lab has two distinct human-facing visual outputs:

1. **Pattern overview sheet** — the designer-facing explanation and review board.
2. **Marker sheet** — the fabric layout sheet.

These are not the same artifact.

## Pattern Overview Sheet

The overview sheet is what the designer opens first. It should answer: "What did the system think my garment is, what pattern did it create, and what should I review before cutting?"

It should combine:

- source sketch or reference image
- interpreted technical sketch / flat
- body or croquis measurement grid where available
- generated pattern pieces
- cut labels and cut counts
- grainlines, fold lines, notches, seam allowance, and hem allowance
- important finished measurements on the pattern surface
- assumptions and confidence notes as callouts
- simple reference to the 3D preview when available

The overview sheet can be SVG/PDF/HTML, but the interaction model should stay human: visual first, annotated, printable, and legible without opening developer artifacts.

For v0.1, `human-output/.../guide.md` is still the single text companion, and `pattern.svg` is the visual pattern surface. The next packaging step is to compose these into a first real overview sheet inspired by Kiko's board layout.

## Marker Sheet

The marker sheet answers a different question: "How do these cut pieces fit on the fabric width?"

It should include:

- fabric width
- fabric length estimate
- grain direction
- fold / single-layer assumptions
- piece placements
- spacing / gutter assumptions
- nap, print direction, shrinkage, and fabric defect limitations when not modeled

The marker should not be treated as the main garment overview. For simple two-piece garments, it can feel redundant; for shirts, facings, sleeves, collars, plackets, and multi-piece garments, it becomes important again because fabric layout and consumption become real review concerns.

## Human Output Package Shape

A v1 human package should prefer this shape:

```text
human-output/<version>/<garment-run>/
  README.md or guide.md       # one text companion
  overview.svg/pdf/html       # source -> interpretation -> pattern review board
  pattern.svg/pdf             # printable tiled pattern pieces, if separate from overview
  marker.svg/pdf              # fabric layout sheet
  preview.html                # simple 3D/static assembly preview
  source-sketch.svg/png       # input image or generated sketch
  manifest.json               # package inventory and provenance
```

The text document should be short and complete. Measurements should appear on the visual sheet whenever they are needed for review, not only in Markdown tables.

## Product Rule

If a user is trying to understand the garment, open the overview sheet.

If a user is trying to understand fabric consumption and layout, open the marker sheet.

If a developer is debugging the pipeline, open `dev-artifacts/`.
