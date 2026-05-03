# Fundamentals Ingest

Sources:

- `Pattern Drafting and Grading for Basic Patterns`
- `Design your own clothes: flat pattern method`
- `Principles of Flat Pattern Design`
- `The principles of pattern making`
- `Patternmaking for Fashion Design`

This ingest is intentionally conservative. Some references are commercial/copyrighted, so the project should treat them as bibliographic signposts unless a lawful copy is available. The operational knowledge below is expressed as project-level concepts, not copied textbook content.

## Core Product Lesson

Patternmaking is a body-measurement, construction, and fabrication discipline. It is not merely contour drawing.

For Garment Pattern Lab, that means the output must preserve:

- body landmarks
- garment landmarks
- seam lines
- cut lines
- darts
- ease
- grainline
- notches
- labels
- cut counts
- seam allowances
- hem allowances
- construction order
- grading or made-to-measure regeneration logic

## Patternmaking Modes

### Drafting

Drafting creates pattern geometry from measurements, formulas, and drafting rules.

Knowledge graph impact:

- `MeasurementSet -> DraftingRuleSet -> PatternGraph`
- `DraftingRuleSet` must be versioned and garment-specific.

Prototype impact:

- Prototype 1 should start with explicit drafting rules for the sleeveless A-line tunic rather than general mesh or image generation.

### Flat Pattern Manipulation

Flat manipulation starts from a block/sloper and transforms it into a design through darts, style lines, slash/spread, added fullness, yokes, collars, sleeves, facings, and other construction changes.

Knowledge graph impact:

- Add `BlockPattern`.
- Add `PatternTransformation`.
- Add `DartManipulation`.

Prototype impact:

- The first garment can be framed as a transformation from a simple bodice/dress block into a loose A-line tunic.

### Draping

Draping shapes fabric on a dress form or body and transfers the resulting fabric shape to a pattern.

Knowledge graph impact:

- `DrapeObservation -> PatternGraphRevision`

Prototype impact:

- Future physical muslin review should be treated as a data source, not just a subjective comment.

## Foundational Entities

### Body Landmarks

Body landmarks anchor measurements and drafting decisions.

Examples:

- neck point
- shoulder point
- bust point
- waist
- hip
- center front/back
- armhole depth

Knowledge graph impact:

- `BodyLandmark` should be separate from `SketchLandmark`.
- `MeasurementSet` should identify which body landmarks each measurement depends on.

### Block / Sloper

A block is a fitted base pattern. It can be custom or standard-size.

Knowledge graph impact:

- `BlockPattern` becomes an optional source for `PatternGrammar`.
- Blocks should store intended ease: a close-fitting block is not a finished garment.

Prototype impact:

- We should not overfit prototype 1 to one ad hoc formula. The generated tunic should be traceable to a base block or simplified block logic.

### Ease

Ease is the difference between body measurement and garment measurement. It has two roles:

- wearing ease
- design ease

Knowledge graph impact:

- Add `EaseProfile`.
- Store ease by body zone: bust, waist, hip, armhole, hem sweep.

Prototype impact:

- User controls should expose ease as design language, not hidden math.

### Dart

Darts shape flat cloth around 3D body curvature.

Knowledge graph impact:

- `Dart` already exists in the graph; fundamentals reinforce that darts must carry target region and construction semantics.

Prototype impact:

- Prototype 1 can start with dartless loose fit, but the schema must support bust darts before fitted woven garments are credible.

### Grainline

Grainline determines fabric behavior, stability, hang, and symmetry.

Knowledge graph impact:

- `GrainAxis` must be required on panels.
- Bias is an explicit override, not missing data.

Prototype impact:

- Every exported piece needs grainline or foldline.

### Seam Allowance / Hem Allowance

Seam line and cut line are different. Hem allowance can differ from seam allowance.

Knowledge graph impact:

- `Panel.seamLineBoundary`
- `Panel.cutLineBoundary`
- `SeamAllowanceRule`
- `HemAllowanceRule`

Prototype impact:

- SVG must distinguish seam lines from cut lines.

### Notches / Balance Marks

Notches align pieces during sewing and reduce construction ambiguity.

Knowledge graph impact:

- `Notch` belongs on `SeamEdge` or `Panel`.
- Notch pairs should validate across seam pairs.

Prototype impact:

- Add waist/hip/shoulder/side-seam alignment notches even for simple garments.

### Grading

Grading changes pattern size across a size range. Made-to-measure regeneration is related but not identical.

Knowledge graph impact:

- `GradeRule` should be separate from `MeasurementDrivenRegeneration`.

Prototype impact:

- Defer grading. Use made-to-measure regeneration first.

## Product Requirements From Fundamentals

### Required Output Fields

Every exported pattern piece should include:

- piece name
- garment name/version
- size/measurement set
- cut count
- fabric/fold instruction
- grainline/foldline
- seam line
- cut line
- seam allowance value
- notches
- construction role

### Validation Checklist

Fundamental validation should check:

- seam pairs are named
- seam pairs have compatible length
- notches are paired
- grainlines exist
- cut lines exist
- seam allowances exist
- labels exist
- fold pieces are marked
- instructions mention finishing/closure assumptions

## Product Graph Additions

```text
MeasurementSet -> BodyLandmark
BodyLandmark -> DraftingRuleSet
DraftingRuleSet -> BlockPattern
BlockPattern -> PatternTransformation
PatternTransformation -> PatternGraph
EaseProfile -> PatternGraph
Notch -> SeamPair
GradeRule -> SizeRun
```

## Open Research

- Select a lawful patternmaking source for first-garment drafting formulas.
- Decide whether prototype 1 uses a simplified dress block or a direct tunic draft.
- Define default ease values for loose woven pullover tunic.
- Define closure threshold: when does pullover become impossible without zipper/placket?

