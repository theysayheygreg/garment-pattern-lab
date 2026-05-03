# Product Knowledge Graph

This is the durable concept graph for Garment Pattern Lab. It turns papers, product decisions, and prototype learnings into nodes and edges that future implementation work can use.

## Core Thesis

```text
SketchIntent
  -> GarmentSemantics
  -> PatternGrammar
  -> PatternGraph
  -> ManufacturingPackage

PatternGraph
  -> 3DAssemblyPreview
  -> ValidationReport
  -> PatternGraphRevision
```

The system should infer visual intent, but constrain output through sewing-aware structures.

## Primary Nodes

### SketchIntent

Represents what the user drew or uploaded.

Properties:

- garment class
- front/back silhouette
- neckline
- armhole/sleeve hints
- seam hints
- closure hints
- length
- ease impression
- figure/body reference
- confidence scores

Edges:

- `SketchIntent -> LandmarkSet`
- `SketchIntent -> GarmentParameters`
- `SketchIntent -> AmbiguityReport`

### LandmarkSet

A set of marked or detected 2D points/curves on the sketch.

Properties:

- center front/back
- shoulders
- neckline curve
- armhole curve
- bust/waist/hip/hem levels
- side silhouette
- seam sketch curves

Edges:

- `LandmarkSet -> GarmentParameters`
- `LandmarkSet -> ManualCorrection`

### GarmentParameters

User-editable design variables produced from sketch and measurements.

Properties:

- length
- neck depth/shape
- armhole depth
- bust/waist/hip ease
- hem sweep
- closure mode
- dart mode
- finishing mode
- seam allowance
- hem allowance

Edges:

- `GarmentParameters -> PatternGrammar`
- `GarmentParameters -> PatternGraph`

### MeasurementSet

Target body measurements.

Properties:

- height
- bust
- high bust
- waist
- hip
- shoulder width
- shoulder slope approximation
- front waist length
- back waist length
- armhole depth
- garment length

Edges:

- `MeasurementSet -> Avatar`
- `MeasurementSet -> PatternGraph`
- `MeasurementSet -> FitValidation`

### PatternGrammar

Rules that convert body measurements and garment parameters into sewing topology.

Properties:

- allowed garment classes
- required panels
- legal seam relationships
- dart rules
- grainline rules
- finishing templates
- construction-order templates

Edges:

- `PatternGrammar -> PatternGraph`
- `PatternGrammar -> ValidationRuleSet`

### PatternGraph

The machine-readable sewing pattern.

Properties:

- panels
- seam lines
- cut lines
- edge graph
- seam pairs
- darts
- grainlines
- notches
- labels
- cut counts
- seam allowance rules
- hem allowance rules
- construction steps

Edges:

- `PatternGraph -> SVGExport`
- `PatternGraph -> PDFExport`
- `PatternGraph -> 3DAssemblyPreview`
- `PatternGraph -> ValidationReport`

### Panel

A fabric piece.

Properties:

- panel id
- purpose
- seam-line boundary
- cut-line boundary
- grain axis
- fold line
- cut count
- corner count
- dart membership
- notches

Edges:

- `Panel -> SeamEdge`
- `Panel -> Dart`
- `Panel -> GrainAxis`
- `Panel -> TextileDeformationBudget`

### SeamEdge

A semantic edge intended to join another edge or remain finished/open.

Properties:

- edge id
- parent panel
- curve geometry
- length
- seam allowance
- finishing role
- paired edge
- reflection symmetry score

Edges:

- `SeamEdge -> SeamPair`
- `SeamEdge -> ValidationReport`

### SeamPair

A relationship between two sew-together edges.

Properties:

- edge A
- edge B
- target equal length
- allowed easing/gathering
- reflection symmetry expectation
- notch alignment

Edges:

- `SeamPair -> SeamLengthValidation`
- `SeamPair -> ReflectionSymmetryValidation`

### Dart

A wedge-like shaping operation inside a panel.

Properties:

- dart legs
- dart tip
- opening angle
- dart length
- symmetry axis
- body target

Edges:

- `Dart -> DartSymmetryValidation`
- `Dart -> FitValidation`

### GrainAxis

Fabric warp/weft direction for a panel or panel region.

Properties:

- warp direction
- weft direction
- target body/world direction
- bias override

Edges:

- `GrainAxis -> DrapeBehavior`
- `GrainAxis -> TextileDeformationBudget`

### TextileDeformationBudget

A material/fit constraint informed by the paper's anisotropic textile model.

Properties:

- max warp stretch
- max weft stretch
- max shear
- rigidity weight
- seam symmetry weight
- dart symmetry weight

Edges:

- `TextileDeformationBudget -> FlatteningValidation`
- `TextileDeformationBudget -> PanelSplitDecision`

### 3DGarmentMesh

An optional generated or imported 3D target garment.

Properties:

- triangle mesh
- rest pose
- optional target poses
- symmetry plane
- user seam sketches
- mesh cleanliness

Edges:

- `3DGarmentMesh -> ComputationalPatternMakingPipeline`
- `3DGarmentMesh -> 3DAssemblyPreview`

### ComputationalPatternMakingPipeline

The paper-derived 3D-to-pattern route.

Properties:

- cross-field
- field-aligned path tracing
- patch layout
- dart creation
- anisotropic textile parameterization
- seam/dart reflection symmetry
- grain alignment
- multi-pose integration

Edges:

- `ComputationalPatternMakingPipeline -> PatchLayout`
- `ComputationalPatternMakingPipeline -> PatternGraphCandidate`
- `ComputationalPatternMakingPipeline -> ValidationReport`

### PatchLayout

A segmentation of a 3D garment surface into sewable panels.

Properties:

- patch count
- max corners per patch
- path network
- loops
- border-to-border paths
- T-junctions
- darts
- distortion threshold

Edges:

- `PatchLayout -> Panel`
- `PatchLayout -> PanelComplexityValidation`

### ValidationReport

Machine-readable and human-readable check results.

Properties:

- seam length mismatches
- reflection symmetry scores
- dart validity
- grain alignment status
- panel corner count
- self-intersection status
- fit/ease checks
- collision/clearance checks
- known limitations

Edges:

- `ValidationReport -> PatternGraphRevision`
- `ValidationReport -> HumanReview`

## Paper-Ingested Concepts

From `Computational Pattern Making from 3D Garment Models`, the graph gains these durable concepts:

- Pattern pieces should preferably be few, large, smooth, and low-corner.
- Practical patches often target roughly 6-8 corners, with mostly orthogonal angles.
- Matching seams must be equal length, and ideally reflection-symmetric in 2D.
- Darts are not decorative metadata; they are a computational way to merge partial cuts while preserving acceptable distortion.
- Grain alignment is a validation constraint, not an afterthought.
- Woven fabric flattening should model warp/weft stretch and shear separately, because fabric is anisotropic.
- User-sketched seam hints on a 3D garment can steer automatic patch layout.
- Multiple garment poses can reveal high-deformation regions and improve seam placement.
- The main user-facing layout controls in the paper are maximum corners per patch and maximum allowed stretch.
- Seam allowance was explicitly future work in the paper, which means Garment Pattern Lab must own seam allowance separately from any borrowed flattening method.

## Product Architecture Implications

### Mainline For Prototype 1

Prototype 1 stays pattern-grammar-first:

```text
Measurements + annotated sketch
  -> GarmentParameters
  -> PatternGraph
  -> SVG/PDF
  -> 3DAssemblyPreview
```

The paper informs validation rules and schema shape immediately.

### Research Branch For Later

The paper creates a credible second route:

```text
Sketch
  -> 3DGarmentMesh
  -> ComputationalPatternMakingPipeline
  -> PatternGraphCandidate
  -> PatternmakerReview
```

This is not the first prototype route, but it should be preserved as a research lane.

## Required Schema Additions

The pattern schema should include:

- seam-line geometry and cut-line geometry as separate entities
- seam pair length validation
- seam pair reflection-symmetry validation
- dart legs, tip, angle, length, and symmetry validation
- panel grain axis
- panel corner count
- material deformation budget
- optional 3D source mesh and target poses
- optional user seam hints
- validation report linked to each panel/seam/dart

## Required Roadmap Additions

- Add validation checks before 3D preview is considered credible.
- Add textile deformation budgets before claiming any mesh flattening path is sewable.
- Add manual seam-hint support to future 3D workflows.
- Add panel-complexity controls: maximum corners per panel and maximum allowed stretch.
- Add seam allowance as Garment Pattern Lab's responsibility, not borrowed paper functionality.

