# Input Lanes

Date: 2026-05-03

The project has two distinct sketch-input lanes. They should converge into the same downstream objects, but they should not be designed as the same product surface.

```text
InputAsset
  -> preprocessing / interpretation
  -> TraceLayer or ReferenceSheet
  -> LandmarkSet
  -> SketchIntent
  -> GarmentParameters
  -> PatternGraphCandidate
```

The shared contract is:

- `SketchIntent`: garment-family and design semantics.
- `LandmarkSet`: visible garment/body points and curves.
- `InputProvenance`: where the image came from, what rights apply, and how it was transformed.
- `AmbiguityReport`: what the system could not infer safely.

Lane A is generated and controlled. Lane B is human-authored and interpreted.

## Lane A: GPT Image 2 Generated Sketch Fixtures

Primary purpose: create original, repeatable, project-owned sketch inputs for development and evaluation.

This lane is about prompt design. The product should treat the prompt recipe as the design surface and the generated image as a fixture candidate, not as truth.

Useful outputs:

- clean front/back technical flats
- croquis/on-body fashion sketches
- hand-sketch-like raster drawings
- controlled construction variants
- bad-input and ambiguity examples
- image-edit variants that preserve a base design while changing one feature

### Prompt Recipe

Each generated sketch should store the prompt as structured metadata:

```text
garment_family:
view:
body_or_pose:
silhouette:
neckline:
shoulder_opening:
armhole_or_sleeve:
closure:
darts:
style_lines:
length:
hem_sweep:
fabric_behavior:
rendering_style:
technical_constraints:
negative_constraints:
```

For the first garment, the default prompt target is a sleeveless A-line woven tunic/dress. The prompt should deliberately constrain the drawing:

- front and back views when possible
- white or transparent background
- clean black line art
- visible neckline, armhole, side seams, hem, and center line
- simple pose if on-body
- no dramatic folds
- no pockets, collars, sleeves, plackets, or trims unless requested
- no decorative fabric texture unless the test is about robustness

Example base prompt:

```text
Create a clean black-and-white fashion technical flat reference sheet for a sleeveless A-line woven tunic dress. Include front and back views side by side. Use simple vector-like line art on a white background. The design has a scoop neckline, shoulder straps wide enough to cover undergarment straps, no sleeves, modest armhole depth, simple side seams, slight A-line flare, knee length, no pockets, no collar, no buttons, no visible print, no dramatic folds, and no posed figure. Make construction details legible for sewing-pattern interpretation.
```

Example controlled edit prompt:

```text
Using the same front/back sleeveless A-line woven tunic dress, change only the neckline to a square neckline. Preserve shoulder width, armhole shape, side seam position, hem length, and hem sweep. Keep the drawing as clean black technical-flat line art.
```

### Quality Gates

A generated sketch is not accepted into the corpus until it passes review:

- front/back views describe the same garment
- neckline and armhole are unambiguous
- hem length and sweep are readable
- closure/dart/seam clues do not contradict the prompt
- landmarks can be placed without guessing too much
- the image did not invent incompatible features
- prompt, model, generation date, and review notes are stored

The first useful metric is consistency: can a prompt recipe generate 5-10 variations where only the requested feature changes?

### Storage Shape

Planned local development shape:

```text
prototype/corpus/generated-sketches/
  recipes/
  images/
  reviews/
  input-index.jsonl
```

Each index row should include:

- `id`
- `lane: "gpt-image-generated"`
- `prompt_recipe_id`
- `model`
- `generated_at`
- `source_rights: "project-generated"`
- `garment_family`
- `view_type`
- `review_status`
- `linked_reference_family`
- `derived_sketch_intent_id`

## Lane B: Human Drawing / Vector / Uploaded Input

Primary purpose: accept the way a designer actually works: pencil sketches, Procreate exports, scanned drawings, photos of sketchbook pages, SVGs, PDFs, Illustrator-like flats, or eventually browser-authored vectors.

This lane is about ingestion and interpretation. The product surface is not prompt tuning; it is upload, cleanup, trace, landmark, review, and correction.

Current prototype path:

```text
prototype/corpus/human-inputs/
  originals/
  working/
  traces/
  reviews/
  input-index.jsonl
```

Future web path:

```text
upload
  -> immutable source record
  -> working derivative
  -> crop / rotate / deskew
  -> background cleanup
  -> front/back view assignment
  -> optional scale calibration
  -> vector trace or manual trace
  -> landmark annotation
  -> semantic review
  -> SketchIntent + LandmarkSet + AmbiguityReport
```

Accepted input targets:

- raster: PNG, JPG, WebP, TIFF, scanned PDF page
- vector: SVG, PDF vector art, later AI/Graphite-style imports if supported
- layered/design-app exports: treat as future research unless exported to raster/vector first

### Interpretation Requirements

Human-authored inputs need a stronger review layer than generated fixtures:

- preserve the original upload unchanged
- store privacy/consent/license state
- create derived working images separately
- record whether the asset is a private user input, reusable project fixture, or reference-only artifact
- distinguish model-inferred traces from user-authored traces
- keep all landmark corrections as explicit revisions

The product should expect ambiguity. A designer sketch may imply style intent without showing every construction detail. The system should ask for missing information instead of hallucinating it into the pattern.

Common questions:

- Is there a front view, back view, or both?
- Is the garment drawn on a posed figure or as a flat?
- Where is center front/back?
- Is the garment symmetric?
- Is this a pullover, zipper, button, or open-back construction?
- Is the waist shaped by darts, side seams, elastic, or not shaped?
- Is the hem straight, curved, high-low, or asymmetric?

### Quality Gates

A human input can proceed only when the required information is either visible or explicitly supplied:

- garment/body separation is good enough for review
- at least one usable view is present
- front/back relationship is known, or the missing side is acknowledged
- minimum resolution is sufficient for tracing
- perspective distortion is acceptable or corrected
- landmarks are reviewed
- scale state is known: unscaled sketch, calibrated reference, or measurement-linked design

For v1, scale can come from body measurements and garment parameters rather than from the sketch image itself. Before printable pattern export, the pattern must still prove scale in millimeters.

## Shared Output Contract

Both lanes should produce the same normalized payload:

```json
{
  "input_id": "input-0001",
  "input_lane": "gpt-image-generated | human-authored",
  "provenance": {},
  "source_assets": [],
  "trace_layers": [],
  "landmark_set_id": "landmarks-0001",
  "sketch_intent_id": "intent-0001",
  "ambiguity_report_id": "ambiguity-0001",
  "review_status": "needs-review | semantic-reviewed | rejected"
}
```

That payload is allowed to be imperfect. It is not allowed to be silent about uncertainty.

## Product Position

Use the generated lane to manufacture controlled examples and tune system behavior.

Use the human lane to build the actual designer-facing product.

The first prototype can rely on local folders and manual review. The first product-shaped milestone should add a browser upload workspace with crop, trace, landmark, and semantic-confirmation tools.

## Research Questions

- What prompt grammar produces the most consistent front/back technical flats for a garment family?
- Can GPT Image 2 reliably perform single-feature edits without changing pattern-relevant construction?
- Which human sketch defects are most common: missing back view, ambiguous closure, perspective pose, noisy linework, or hidden seams?
- Which vectorization stack gives editable curves without destroying garment semantics?
- How much of landmarking should be automatic before the UI becomes slower than manual correction?
- What privacy and corpus-consent model is needed before user uploads can become reusable examples?
- Should front/back generation be one combined image, two linked images, or a generated reference sheet with metadata?
- What minimum review fields are required before `SketchIntent` can draft a first-garment candidate?
