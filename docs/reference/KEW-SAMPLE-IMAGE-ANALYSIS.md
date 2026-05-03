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

## What This Teaches Pattern Lab

The strongest overlap is the bridge from art to technical structure.

Pattern Lab should learn from:

- body-reference guides as a trust layer
- measurement landmarks made visible beside the sketch
- callouts that translate design features into garment semantics
- reference photo plus technical sketch in the same workspace
- thumbnail/project navigation for multiple views or iterations
- explicit detail labeling: pleats, hardware, neckline, armhole, levels

The image reinforces our product differentiator:

**The user should not have to become a CAD operator. The system should help the designer move from art/reference to garment semantics in as few steps as possible.**

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

## Natural Language Interaction Examples

A Pattern Lab experience inspired by this should let the designer say:

- "Use this photo as inspiration, but make the pattern from the technical sketch."
- "The gold hardware is decorative, not a closure."
- "Keep the accordion pleats, but simplify this into a dress."
- "Set the finished length to ankle level."
- "Show me what you are assuming about the back."
- "Mark which details are pattern-affecting versus visual-only."
- "This is not a jumpsuit; remove the crotch-depth assumption."

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

Useful edge:

```text
ReferenceMoodImage
  -> TechnicalSketchCallout
  -> SketchIntent
  -> AmbiguityQuestion
  -> GarmentParameters
```

This captures the observed Kew strength without pulling Pattern Lab into a broad workspace clone.
