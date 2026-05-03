# Commercial Software Ingest

Sources:

- Lectra Modaris
- Optitex 2D/3D CAD Pattern Design Software
- Optitex 3D Overview
- Browzwear / VStitcher
- CLO Simulation docs
- Gerber AccuMark 2D/3D overview
- Wild Ginger Software

## Core Product Lesson

Commercial apparel CAD treats production pattern data as the serious asset. 3D preview is powerful, but the production workflow still revolves around patterns, grading, markers, materials, avatars, fit validation, and collaboration.

Garment Pattern Lab should therefore avoid becoming only a pretty sketch-to-3D demo. Its wedge is automated first-draft pattern intelligence with transparent validation.

## Source-Level Ingest

### Lectra Modaris

Observed product posture:

- Patternmaking, grading, and industrialization.
- 3D prototype verification.
- Pattern quality and production readiness.
- 2D/3D synchronization in Modaris 3D.
- Pattern conversion and supplier interoperability.

Knowledge graph impact:

- `IndustrializationMetadata`
- `GradeRule`
- `PatternQualityGate`
- `2D3DSyncState`

Product implication:

- The future product should treat grading, seam values, axes, notches, and production annotations as first-class, even if prototype 1 defers them.

### Optitex

Observed product posture:

- Integrated 2D pattern design and 3D visualization.
- Changes made to 3D samples can affect 2D patterns.
- Tension maps, avatar editor, fabric management, grading, marker making.
- 3D creation begins from flat patterns plus style/design sheet, materials, model measurements, and sample size.

Knowledge graph impact:

- `Avatar`
- `FabricPropertySet`
- `TensionMap`
- `StyleSheet`
- `SampleSize`
- `MarkerPlan`

Product implication:

- The first prototype should create a minimal `StyleSheet` equivalent: garment assumptions, fabric class, measurements, finish mode, closure mode, validation summary.
- Tension-map-like feedback can become an advanced validation view later.

### Browzwear / VStitcher

Observed product posture:

- True-to-life virtual twins.
- Physics-based 3D simulation with real fabric data.
- Fit validation and collaboration.
- End-to-end workflow from design to factory-floor digital assets.

Knowledge graph impact:

- `VirtualTwin`
- `FabricMeasurement`
- `ApprovalState`
- `TechPack`

Product implication:

- Physical fabric data matters, but prototype 1 can begin with named fabric assumptions and clear limitations.

### CLO

Observed product posture:

- Simulation applies gravity and drapes 3D garments.
- Seamlines between garment patterns are sewn during simulation.
- Simulation quality depends on settings and fabric behavior.

Knowledge graph impact:

- `SimulationAssembly`
- `StitchConstraint`
- `SimulationSetting`

Product implication:

- The preview should assemble pattern pieces from seam relationships. It should not be a decorative mesh unrelated to the exported pattern.

### Gerber AccuMark

Observed product posture:

- 2D/3D CAD connected to production and cutting workflows.
- Fit assessment and partner communication are business-critical.
- Nesting/cutting software connects pattern work to material waste and cost.

Knowledge graph impact:

- `CuttingPlan`
- `NestingPlan`
- `ProductionWorkflow`

Product implication:

- Marker/nesting is later, but the pattern graph should not block it. Cut counts, grainlines, and piece dimensions should be machine-readable.

### Wild Ginger

Observed product posture:

- Measurement-driven custom-size pattern drafting.
- Design and fit preferences are stored.
- Printable summaries and sewing guides matter.

Knowledge graph impact:

- `DesignPreferenceSet`
- `FitPreferenceSet`
- `GuideSheet`

Product implication:

- The product should export not only panels, but a readable guide sheet with measurements, design choices, and sewing instructions.

## Product Graph Additions

```text
PatternGraph -> IndustrializationMetadata
PatternGraph -> GradeRule
PatternGraph -> MarkerPlan
PatternGraph -> GuideSheet
PatternGraph -> TechPack
PatternGraph -> CuttingPlan

Avatar -> FitValidation
FabricPropertySet -> SimulationAssembly
SimulationAssembly -> TensionMap
SimulationAssembly -> ValidationReport

StyleSheet -> PatternGraph
StyleSheet -> ManufacturingPackage
```

## Roadmap Impact

Prototype 1 should add a minimal guide sheet:

- garment name
- measurement set
- fabric assumption
- design parameters
- cut list
- finish assumptions
- construction order
- validation report

Later roadmap additions:

- DXF/AAMA/ASTM export investigation.
- Marker/nesting preview.
- Tech pack generation.
- Fabric property presets.
- Size grading or regeneration.

## Product Boundary

Commercial products are powerful because they assume an expert operator. Garment Pattern Lab's product wedge should be:

**Make the first pattern draft and validation readable enough that a non-expert can start, while preserving enough structure for expert correction.**

