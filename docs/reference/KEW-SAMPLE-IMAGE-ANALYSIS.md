# Kew Sample Image Analysis

Date: 2026-05-03

Source context: Greg shared a screenshot from Kiko's Kew project. The image appears to show a project canvas with a croquis/spec reference, inspiration photo, and annotated garment drawing.

This is not a reusable visual asset yet. Treat it as an observed product-reference screenshot and design signal.

## What The Image Shows

The screen is titled "Projects" and uses a large grid/canvas workspace.

Visible elements:

- left rail with page/card thumbnails
- Croquis body reference with measurement and level guides
- central inspiration photo of a pink pleated dress/top detail
- large technical drawing over a body reference
- pink construction/measurement grid lines
- annotated callouts for:
  - head reference
  - front neck point reference
  - shoulder to chest
  - armhole circumference
  - armhole depth box
  - full bust circumference reference
  - true waistline
  - hipline level
  - crotch depth reference
  - total height / full body length reference grid
  - gold hardware reference
  - accordion pleats
- color legend with numbered swatches
- carousel-style navigation buttons

Notably missing:

- no visible 3D garment render
- no fit/drape preview
- no pattern-piece output
- no visible validation surface for seams, pleats, cut counts, scale, or construction assumptions

The garment itself appears to be a long pleated dress or jumpsuit-like silhouette with a narrow strap/neck hardware detail, accordion pleats, and a long vertical fall toward ankle level.

## Product Signal

Kew's screenshot is not just "design inspiration." It is a hybrid board:

- mood/reference image
- croquis/spec grid
- technical sketch
- measurement/landmark system
- annotation layer
- project/document management

That combination is important. It shows an apparel designer thinking spatially and technically at the same time. The product surface is less like a single editor and more like a project canvas where visual references and technical interpretation coexist.

The missing 3D render is also important. Kew's screenshot appears to stop at visual/technical annotation. Pattern Lab's useful addition is the next feedback loop: turn the confirmed intent into pattern geometry, show a simple 3D sanity preview, and report what is still uncertain or invalid.

## What This Teaches Pattern Lab

The strongest overlap is the bridge from art to technical structure.

Pattern Lab should learn from:

- body-reference guides as a trust layer
- measurement landmarks made visible beside the sketch
- callouts that translate design features into garment semantics
- reference photo plus technical sketch in the same workspace
- thumbnail/project navigation for multiple views or iterations
- explicit detail labeling: pleats, hardware, neckline, armhole, levels
- vector/layer editability as an intermediate pipeline capability
- the need for 3D preview after technical interpretation

The image reinforces our product differentiator:

**The user should not have to become a CAD operator. The system should help the designer move from art/reference to garment semantics in as few steps as possible.**

Kiko's callout about making this kind of screenshot vector-editable with layers and vector image tools is directionally right as a pipeline need. Pattern Lab will need parts of that soon: editable traced curves, semantic layers, callout layers, body guide overlays, and correction handles. The important boundary is that vector editability should serve interpretation and correction, not become the whole product.

## What Pattern Lab Should Not Copy Blindly

Do not turn v1 into a freeform board/canvas product.

Kew may need a broader apparel project workspace. Pattern Lab needs a narrower pattern workbench:

- input sketch/reference
- semantic confirmation
- garment parameters
- `PatternGraphCandidate`
- validation
- human-readable pattern package

Do not make the user manually place every grid, label, and callout in v1. The screenshot is valuable because it shows the information that matters. Pattern Lab's opportunity is to infer, propose, and ask for confirmation.

Do not make "full vector editor" the milestone. The near-term milestone should be narrower:

```text
raster/reference input
  -> editable semantic trace layers
  -> designer confirms callouts and landmarks
  -> PatternGraphCandidate
  -> 3D sanity preview
  -> validation report
```

This gives us the useful parts of vector tooling without asking the user to operate Illustrator inside Pattern Lab.

## Pattern Lab Interpretation

If this image were a Pattern Lab input, the system should produce something like:

```text
Detected garment intent:
  family: pleated dress / jumpsuit-like long garment candidate
  silhouette: long vertical column with slight flare
  neckline: gathered top edge with hardware/keyhole detail
  straps: narrow shoulder straps
  primary construction feature: accordion pleats
  length: near ankle
  reference body landmarks: neck, shoulder, bust, waist, hip, crotch, knee, ankle
  uncertain:
    - dress vs jumpsuit
    - back construction
    - closure
    - pleat construction and fabric requirements
    - whether hardware is functional closure or decoration
```

For the first Pattern Lab prototype, this is too complex as a target garment. It is still a good future test because it stresses:

- pleat recognition
- hardware callout handling
- reference-photo-to-flat relationship
- body landmark alignment
- ambiguity reporting
- natural-language clarification
- semantic vector/layer correction
- missing-3D-preview handoff

## Natural Language Interaction Examples

A Pattern Lab experience inspired by this should let the designer say:

- "Use this photo as inspiration, but make the pattern from the technical sketch."
- "The gold hardware is decorative, not a closure."
- "Keep the accordion pleats, but simplify this into a dress."
- "Set the finished length to ankle level."
- "Show me what you are assuming about the back."
- "Mark which details are pattern-affecting versus visual-only."
- "This is not a jumpsuit; remove the crotch-depth assumption."
- "Make the pleat lines editable, but keep them linked to the pattern assumptions."
- "Show me this as a simple 3D preview."
- "Which layers are reference-only, and which ones affect the pattern?"

These interactions matter more than recreating the exact canvas UI.

## Knowledge Graph Implications

Add or strengthen these concepts:

- `ReferenceMoodImage`
- `CroquisGuideLayer`
- `MeasurementGuideOverlay`
- `TechnicalSketchCallout`
- `DesignFeatureCallout`
- `PatternAffectingAnnotation`
- `VisualOnlyAnnotation`
- `AmbiguityQuestion`
- `ProjectCanvasReference`
- `SemanticVectorLayer`
- `EditableTraceLayer`
- `LayeredSourceDocument`
- `Missing3DPreviewGap`

Useful edge:

```text
ReferenceMoodImage
  -> TechnicalSketchCallout
  -> SketchIntent
  -> AmbiguityQuestion
  -> GarmentParameters
```

This captures the observed Kew strength without pulling Pattern Lab into a broad workspace clone.

The critical product distinction:

- Kew-style canvas: good for collecting and annotating apparel intent.
- Pattern Lab: should convert that intent into pattern geometry, validation, and 3D feedback.

Vector layers are a bridge, not the destination.
