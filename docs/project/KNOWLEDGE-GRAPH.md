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

PatternGraph
  -> PatternDrawingModel
  -> PatternSheetComposer
  -> HumanReadablePatternPackage
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
- `PatternGraph -> PatternDrawingModel`
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

### Candidate-To-Export Interop

`PatternGraphCandidate` is an incomplete or untrusted pattern output from mesh flattening, AI generation, imported files, or early drafting code.

`CandidateProvenance` records source model, source file, source mesh, prompt, paper pipeline, user edit, license, and transformation history.

`CandidateNormalizerReport` records unit normalization, panel extraction, source-layer mapping, missing fields, and ambiguity.

`MeasurementReport` stores geometric measurements before and after correction.

`CorrectionOperation` records automatic, assisted, or manual edits that change a candidate.

`ExportGateReport` determines whether the candidate can be promoted to `PatternGraph` and exported.

`ExportConformanceReport` checks whether SVG/PDF/DXF output preserved required semantics and file-format expectations.

`RoundTripReport` compares exported and reimported geometry/metadata.

`InteropFormatProfile` defines the target semantics for SVG, PDF, DXF/AAMA/ASTM, or another format.

`ToleranceProfile` defines accepted measurement differences for seam length, notch placement, closure gaps, scale, and grainline angle.

`UnitProfile` defines canonical units, source units, conversion factors, and scale evidence.

`FabricRollProfile` defines usable fabric width, selvage allowance, fold mode, nap direction, print repeat, and shrinkage assumptions.

`MarkerPolicy` defines allowed rotation/mirroring, grainline tolerance, piece spacing, fold requirements, and whether seam allowance/cut lines are included.

`MarkerPlan` is the optimized or reviewable arrangement of cut pieces within a fabric-width strip.

`MarkerPlacement` records a panel's position, rotation, mirror state, grainline error, and cut-count identity within a marker.

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

## Source Coverage

This graph now folds in the first broad reference pass:

| Source family | Ingest doc | Product role |
| --- | --- | --- |
| Patternmaking fundamentals | `docs/reference/FUNDAMENTALS-INGEST.md` | Defines drafting, blocks, ease, darts, grainlines, allowances, notches, grading, and construction metadata. |
| Commercial garment software | `docs/reference/COMMERCIAL-SOFTWARE-INGEST.md` | Defines the expected industrial surface: 2D/3D sync, avatars, fabric properties, tension, markers, tech packs, guide sheets, and approval gates. |
| Open/free pattern tools | `docs/reference/OPEN-TOOLS-INGEST.md` | Defines reusable software idioms: parametric designs, measurement tables, formula-driven drafting, repositories, SVG/PDF export, and visual editing. |
| UV/modeling/game workflows | `docs/reference/UV-GEOMETRY-INGEST.md` | Defines UV as a geometry helper, with strict separation between texture islands and sewable pattern panels. |
| Research papers after 2202.10272 | `docs/reference/papers/RESEARCH-PAPERS-INGEST.md` | Defines pattern programs, synthetic datasets, sketch-to-mesh, multimodal generation, raster pattern encodings, and 3D garment benchmarks. |

## Secondary Ingest Nodes

### Fundamentals Layer

`BodyLandmark` is a body-derived or sketch-derived anchor point such as bust level, waist level, hip level, shoulder point, or armhole depth.

`DraftingRuleSet` is the explicit math and construction sequence that converts measurements plus design choices into a block or final pattern.

`BlockPattern` is a reusable base pattern such as a bodice block, skirt block, sleeve block, or torso sloper.

`PatternTransformation` is a controlled flat-pattern operation such as slash-and-spread, dart rotation, flare, lengthening, shortening, neckline change, or armhole change.

`EaseProfile` describes wearing ease and design ease by body zone and garment type.

`Notch` is alignment metadata attached to sewable edges, not just a drawing mark.

`GradeRule` describes how points and curves move across a size run.

`SizeRun` is a family of related sizes for graded production.

### Industrialization Layer

`IndustrializationMetadata` covers labels, cut counts, fold lines, fabric direction, material notes, size, variant, and revision state.

`StyleSheet` is a commercial-system style record that binds a garment style to patterns, materials, measurements, construction choices, and sample context.

`FabricPropertySet` captures material inputs for simulation and validation: weight, stretch, shear, bend, thickness, friction, and preset identity.

`TensionMap` is simulation output that can reveal fit stress, drag lines, and questionable ease.

`MarkerPlan` and `NestingPlan` arrange cut pieces for material use; they are related to UV packing, but driven by fabric, grain, folds, sizes, and cutting constraints.

`TechPack` is the handoff package for production: pattern references, bill of materials, measurements, construction notes, grading, and review status.

`GuideSheet` is the maker-facing cut and sew instruction surface.

`PatternDrawingModel` is the semantic drawing package derived from `PatternGraph`; it stores views, dimensions, annotation anchors, labels, title-block metadata, scale proof, page/tile metadata, and validation callouts before SVG/PDF rendering.

`PatternSheetComposer` lays out pattern-piece views, detail views, dimensions, notes, title blocks, scale markers, warnings, and optional 3D reference views onto printable pages.

`PatternSheetProfile` is the garment equivalent of a lightweight drawing standard: line styles, required labels, page sizes, units, title-block fields, scale-proof rules, and annotation conventions.

`HumanReadablePatternPackage` is the v1 output bundle for a sewer or sample room: pattern sheets, tiled PDF, cut sheet, construction guide, validation report, source `PatternGraph`, and optional 3D reference view.

### Parametric Tooling Layer

`ParametricDesign` is a reusable pattern generator whose output is determined by measurements and options.

`MeasurementTable` is the editable source of body or avatar measurements.

`DraftingFormula` is the individual expression-level rule used by CAD tools such as Seamly2D/Valentina-style systems.

`PatternCADDocument` is an editable pattern file with construction geometry, final pattern geometry, labels, and export state.

`PatternRepository` and `PatternVersion` store reusable designs and historical revisions.

`VisualPatternEditor` is the human correction surface for curves, labels, points, seams, notches, and options.

### Pattern Program Layer

`PatternProgram` is a code-like representation of a garment pattern, inspired most strongly by GarmentCode.

`Component` is a reusable garment subsystem such as bodice, skirt, waistband, sleeve, collar, or closure.

`SemanticInterface` names how components connect before final panel geometry is resolved.

`AbstractStitch` is a high-level stitch relation between component interfaces.

`DependentParameter` is a derived variable that keeps garment proportions consistent when measurements or options change.

`ComponentLibrary` is the catalog of reusable garment components.

### UV And Geometry Layer

`GeometrySeam` is a cut path on a mesh for parameterization. It can become a seam hint, but it is not automatically a sewing seam.

`UVIsland` is a flattened mesh region used for texture or geometry layout. It can suggest a panel candidate, but cannot be trusted as a garment pattern without semantic checks.

`ParameterizationMethod` names flattening methods such as ABF, LSCM, or paper-specific anisotropic textile parameterization.

`UVChannel` is an engine/modeling channel for texture or lightmap coordinates.

`NonOverlapConstraint` is required for lightmaps and useful for packing, but still different from marker making.

### Dataset And ML Layer

`SyntheticDataset` is a generated corpus of paired measurements, patterns, 3D drapes, renders, and metadata.

`TrainingCorpus` is any collection used to train or evaluate sketch parsing, pattern generation, drape prediction, or reconstruction.

`GroundTruthPattern` is a known-valid sewing pattern used as supervision or evaluation target.

`DrapePipeline` turns a pattern into a simulated garment and produces mesh plus fit diagnostics.

`DatasetFilter` removes invalid garments, failed simulations, impossible sewing relationships, or out-of-bounds measurements.

`RasterPatternEncoding` represents sewing patterns as image-like tensors for ML.

`PatternLatentSpace` is the learned space where pattern topology and geometry can be interpolated or generated.

`MultimodalPatternGenerator` maps text, sketch/image, or incomplete-pattern conditioning into candidate sewing patterns.

`ConditioningSignal` is the normalized input to that generator.

`EdgeToken` and `PanelToken` are compact vectorized representations of pattern structure.

`FeatureLine` is a visible garment geometry cue in 3D reconstruction datasets.

`ImageToMeshReconstruction` maps garment images to 3D mesh estimates.

`SketchToPatternModel`, `DualGraphRepresentation`, `PatternParser`, `2D3DCorrespondence`, and `FeatureHumanModel` are later research nodes, not prototype commitments.

### AI Sketch And Visual Corpus Layer

`GeneratedSketch` is a model-created sketch or technical flat with known prompt metadata.

`PromptRecipe` is a reusable prompt template for generating controlled garment views.

`VisualCorpusItem` is an indexed image, sketch, render, pattern reference, or 3D candidate with license, source, and review metadata.

`PatternReferenceImage` is an actual pattern-piece, cutting-layout, construction-diagram, or pattern-envelope reference image.

`PatternReferenceFamily` groups examples by garment family and construction variant, such as sleeveless A-line dress, button-up shirt, A-line skirt, pants, jacket, or knit tee.

`ConstructionFeature` is a pattern-level feature such as yoke, dart, pleat, placket, collar stand, waistband, facing, lining, pocket bag, two-piece sleeve, or cut-on-fold panel.

`CorrectnessRule` is a garment-family expectation derived from references, such as required panel roles, expected seam pairs, expected finishing, and suspicious omissions.

`SketchStyle` describes whether the artifact is a croquis sketch, technical flat, isolated garment drawing, rendered concept, or construction-focused line drawing.

`ReferenceSheet` groups related views such as front/back technical flats or sketch/render/pattern triplets.

`ImageTo3DModelCandidate` is a mesh/GLB/OBJ generated from a sketch, photo, or render by systems such as SPAR3D, Hunyuan3D, TRELLIS, or TripoSR.

`MeshCandidateReport` scores a generated 3D output for silhouette preservation, mesh cleanliness, garment-body separation, and usefulness for mesh-to-pattern research.

`CorpusTruthLevel` separates visual-only artifacts from semantically reviewed artifacts, pattern-truth fixtures, and pattern-reference-family examples.

`SemanticReview` is human or model-assisted review of whether a sketch's garment semantics are clear enough to drive `SketchIntent`.

`PatternTruthLink` connects an image or 3D output to an actual `PatternGraph`, measurement set, and validation report.

### Designer Sketch-To-Model Editing Layer

`DesignerSketchEditor` is the user-facing surface where a clothing designer can edit raster sketches, vectorized sketches, semantic garment lines, material/color regions, and preview projections.

`RasterSketchLayer` is an editable bitmap source layer, such as a pencil sketch, Procreate drawing, scanned fashion sketch, or generated image.

`VectorSketchLayer` is a structured curve/shape interpretation of the sketch that can carry semantic tags for silhouette, seam hint, style line, trim, pocket, closure, print, or material boundary.

`SketchRevision` records an edit history item with author, timestamp, source layer, operation, target classification, and before/after references.

`SurfaceProjectionLayer` maps a 2D sketch/vector/texture element onto a 3D garment surface through UV coordinates, view projection, panel-local coordinates, decals, or generated surface anchors.

`SurfaceAnchor` binds a visual mark to a panel, body/garment landmark, UV coordinate, barycentric mesh coordinate, seam edge, or garment region.

`MaterialPreviewLayer` records material and color intent for model preview without claiming manufacturing validity.

`PBRMaterialChannel` records preview channels such as base color, roughness, normal/bump, opacity, fabric weave texture, trim mask, decal mask, and stitching/embroidery hint.

`ProjectionFeedbackReport` records distortion, seam crossing, hidden-surface ambiguity, UV stretch, projection misses, and whether an edit is visual-only, semantic, material-affecting, or pattern-affecting.

`DesignerEditClassification` separates edits into `visual-only`, `semantic-intent`, `material-preview`, `pattern-candidate`, and `pattern-revision` categories.

`LiveModelPreview` is an interactive garment model view that updates from sketch edits, material layers, surface projections, and pattern changes.

`PBRPreviewProfile` defines the level of material preview fidelity needed by the product, from flat colors to fabric texture, roughness, normal detail, decals, and lighting presets.

## Secondary Ingest Edges

```text
MeasurementSet
  -> BodyLandmark
  -> DraftingRuleSet
  -> BlockPattern
  -> PatternTransformation
  -> PatternGraph

GarmentParameters
  -> EaseProfile
  -> PatternGraph

PatternGraph
  -> IndustrializationMetadata
  -> TechPack
  -> ManufacturingPackage

PatternGraph
  -> GuideSheet

PatternGraph
  -> PatternDrawingModel
  -> PatternSheetComposer
  -> HumanReadablePatternPackage

PatternGraph
  -> GradeRule
  -> SizeRun

PatternGraph
  -> MarkerPlan
  -> NestingPlan
  -> CuttingPlan

PatternGraph
  -> PatternCADDocument
  -> SVGExport

PatternGraph
  -> PatternCADDocument
  -> PDFExport

PatternRepository
  -> PatternVersion
  -> PatternGraphRevision

VisualPatternEditor
  -> PatternGraphRevision

ParametricDesign
  -> MeasurementTable
  -> MeasurementSet

ParametricDesign
  -> DraftingFormula
  -> DraftingRuleSet
```

```text
PatternProgram
  -> Component
  -> Panel

Component
  -> SemanticInterface
  -> AbstractStitch
  -> SeamPair

GarmentParameters
  -> DependentParameter
  -> PatternProgram

ComponentLibrary
  -> PatternGrammar

ComponentSwap
  -> PatternGraphRevision
```

```text
3DGarmentMesh
  -> GeometrySeam
  -> UVIsland
  -> PatternGraphCandidate
  -> ValidationReport

ParameterizationMethod
  -> UVIsland

UVChannel
  -> PreviewTexture

IslandPacking
  -> SVGExport

AutoSeamCandidate
  -> SeamHint
  -> ComputationalPatternMakingPipeline
```

```text
BodyShapeSample
  -> AutomaticMeasurementExtraction
  -> MeasurementSet

PatternSampling
  -> PatternGraph
  -> DrapePipeline
  -> DrapedMesh
  -> DatasetFilter

SyntheticDataset
  -> TrainingCorpus

GroundTruthPattern
  -> EvaluationBenchmark
```

```text
SketchInput
  -> SketchEncoder
  -> ImplicitGarmentField
  -> Generated3DGarment
  -> 3DGarmentMesh

TextPrompt
  -> ConditioningSignal
  -> MultimodalPatternGenerator
  -> PatternGraphCandidate

ImagePrompt
  -> ConditioningSignal

IncompletePattern
  -> ConditioningSignal

PatternGraph
  -> RasterPatternEncoding
  -> PatternLatentSpace
  -> PatternGraphCandidate

RasterPatternEncoding
  -> VectorDecode
  -> PatternGraphCandidate

MultiViewImageSet
  -> ImageToMeshReconstruction
  -> 3DGarmentMesh

FeatureLine
  -> GarmentLandmark
```

```text
PromptRecipe
  -> GeneratedSketch
  -> VisualCorpusItem
  -> SemanticReview
  -> SketchIntent

VisualCorpusItem
  -> CorpusTruthLevel

PatternReferenceImage
  -> VisualCorpusItem
  -> PatternReferenceFamily
  -> ConstructionFeature
  -> CorrectnessRule

GeneratedSketch
  -> ReferenceSheet
  -> LandmarkSet

GeneratedSketch
  -> ImageTo3DModelCandidate
  -> MeshCandidateReport
  -> 3DGarmentMesh

PatternGraph
  -> PatternTruthLink
  -> VisualCorpusItem

PatternGraph
  -> CorrectnessRule
  -> ValidationReport
```

```text
RasterSketchLayer
  -> VectorSketchLayer
  -> DesignerSketchEditor
  -> SketchRevision
```

```text
VectorSketchLayer
  -> DesignerEditClassification
  -> SketchIntent
```

```text
VectorSketchLayer
  -> SurfaceProjectionLayer
  -> SurfaceAnchor
  -> LiveModelPreview
  -> ProjectionFeedbackReport
```

```text
MaterialPreviewLayer
  -> PBRMaterialChannel
  -> PBRPreviewProfile
  -> LiveModelPreview
```

```text
DesignerEditClassification
  -> PatternGraphCandidate
  -> ValidationReport
  -> PatternGraphRevision
```

```text
PatternGraphCandidate
  -> CandidateProvenance
  -> CandidateNormalizerReport
  -> MeasurementReport
  -> CorrectionOperation
  -> PatternGraphRevision
  -> ValidationReport
  -> ExportGateReport
  -> PatternGraph

PatternGraph
  -> InteropFormatProfile
  -> SVGExport
  -> ExportConformanceReport
  -> RoundTripReport

PatternGraph
  -> InteropFormatProfile
  -> DXFExport
  -> ExportConformanceReport
  -> RoundTripReport

ToleranceProfile
  -> MeasurementReport
  -> ValidationReport
  -> ExportGateReport

UnitProfile
  -> CandidateNormalizerReport
  -> MeasurementReport
  -> ExportConformanceReport
  -> RoundTripReport

FabricRollProfile
  -> MarkerPolicy
  -> MarkerPlan
  -> MarkerPlacement
  -> CuttingPlan

PatternGraph
  -> MarkerPolicy
  -> MarkerPlan
  -> ValidationReport
```

## Deep Dive Research Additions

Source synthesis: `docs/research/deep-dive-synthesis-2026-05-03.md`.

### Browser Kernel Layer

`PatternKernel` is the product-facing API that turns measurements, garment parameters, and `PatternGraph` revisions into derived geometry, previews, validation reports, and exports.

`GeometryKernel` owns deterministic 2D/3D geometric operations: curve flattening, length measurement, offsets, intersections, winding, containment, triangulation, and placement helpers.

`CurveKernel` owns curve-specific operations such as Bezier length, projection, split, resampling, smoothing, and seam-length comparison.

`OffsetKernel` owns seam-line to cut-line generation and must record joins, corners, allowance changes, and failure cases.

`TriangulationKernel` turns panel geometry into preview meshes while preserving panel, edge, seam, grain, and notch metadata.

`WebWorkerGeometryRuntime` runs heavier TypeScript geometry operations off the UI thread.

`WasmGeometryRuntime` is the future deterministic geometry runtime for libraries or custom kernels compiled from Rust or C++.

`WebGPUAccelerationProfile` records which optional rendering, compute, simulation, or batch-evaluation operations can use WebGPU and what fallback exists.

`StaticAssemblyPreview` is the first useful 3D view: panels positioned around a body or simple avatar without claiming physical drape.

`ClothRelaxationPreview` is a later preview mode using simulation or relaxation to reveal tension, collisions, and likely fit problems.

### Marker And Nesting Layer

`MarkerOptimizer` chooses and configures a marker-placement engine for garment constraints.

`NestingAlgorithm` names the placement strategy, such as deterministic strip placement, no-fit-polygon placement, genetic search, local optimization, or hybrid search.

`NoFitPolygon` represents the collision-free translation boundary between two irregular pieces.

`PlacementSearch` records candidate placements, search strategy, objective score, and stopping reason.

`FabricConstraintSet` combines roll width, usable width, selvage margin, fold mode, nap direction, print repeat, shrinkage, cut count, piece spacing, and allowed rotations/mirroring.

`ConsumptionReport` reports total fabric length, area utilization, waste estimate, unplaced pieces, and comparison against previous marker plans.

`MarkerQualityMetric` records utilization, grain error, fold compliance, placement spacing, cut-count completion, and review status.

### Reference Corpus And Correctness Layer

`ReferenceCorpus` is the curated set of sketches, generated images, pattern references, scaled patterns, renders, meshes, and evaluation fixtures.

`PatternReferenceItem` is a single reference with source URL/path, license, garment family, view type, construction metadata, and truth level.

`LicenseProfile` records whether an item can be used for product display, training, evaluation, internal research, or not at all.

`TruthLevel` separates visual-only references from semantic-reviewed references, pattern-reference examples, pattern-truth fixtures, and round-trip fixtures.

`EvalFixture` is a locked input/output pair for checking sketch parsing, pattern generation, validation, export, marker layout, or image-to-3D behavior.

`CorrectnessRuleSet` is a group of garment-family expectations derived from reference patterns: required panel roles, seam pairs, grain directions, notches, finishing pieces, closures, suspicious omissions, and acceptable variants.

### Image-To-3D Candidate Layer

`ImageTo3DFramework` records the framework, version, model checkpoint, hardware/runtime, license, and output formats for systems such as SPAR3D, Hunyuan3D-2, TRELLIS, TRELLIS.2, or TripoSR.

`ReconstructionProfile` records input image assumptions, preprocessing, conditioning mode, inference settings, runtime, and generated asset types.

`MeshNormalization` records scale, orientation, origin, material/texture handling, simplification, and conversion to project units.

`MeshQualityReport` scores silhouette preservation, garment/body separation, topology cleanliness, UV presence, island count, watertightness, triangle count, and usefulness for pattern inference.

`GarmentSegmentation` separates garment regions, body/figure regions, construction feature lines, and candidate seam hints.

### Interop Export Fixtures

`InteropRoundTripFixture` locks a source `PatternGraph`, export format, exported file, reimport result, tolerance profile, and pass/fail report.

`FormatSemanticMap` maps internal pattern semantics to SVG layers, PDF annotations, DXF/AAMA/ASTM blocks/layers, or future CAD targets.

`DXFProfile` records DXF dialect, units, layers, blocks, labels, notches, internal lines, grain/fold lines, grade references, and importer/exporter compatibility notes.

`SVGSemanticProfile` records SVG layer IDs, element metadata, transform policy, units, viewBox scale, path precision, and reimport expectations.

## Deep Dive Edges

```text
PatternGraph
  -> PatternKernel
  -> GeometryKernel
  -> ValidationReport
  -> ExportGateReport
```

```text
GeometryKernel
  -> CurveKernel
  -> OffsetKernel
  -> TriangulationKernel
```

```text
GeometryKernel
  -> WebWorkerGeometryRuntime
  -> WasmGeometryRuntime
  -> WebGPUAccelerationProfile
```

```text
PatternGraph
  -> StaticAssemblyPreview
  -> ClothRelaxationPreview
  -> FitValidation
```

```text
PatternGraph
  -> FabricConstraintSet
  -> MarkerOptimizer
  -> NestingAlgorithm
  -> MarkerPlan
  -> ConsumptionReport
  -> MarkerQualityMetric
```

```text
NestingAlgorithm
  -> NoFitPolygon
  -> PlacementSearch
  -> MarkerPlacement
```

```text
ReferenceCorpus
  -> PatternReferenceItem
  -> LicenseProfile
  -> TruthLevel
  -> EvalFixture
```

```text
PatternReferenceFamily
  -> CorrectnessRuleSet
  -> ValidationReport
```

```text
ImagePrompt
  -> ImageTo3DFramework
  -> ReconstructionProfile
  -> MeshNormalization
  -> MeshQualityReport
  -> 3DGarmentMesh
```

```text
3DGarmentMesh
  -> GarmentSegmentation
  -> SeamHint
  -> PatternGraphCandidate
```

```text
PatternGraph
  -> FormatSemanticMap
  -> SVGSemanticProfile
  -> InteropRoundTripFixture
```

```text
PatternGraph
  -> FormatSemanticMap
  -> DXFProfile
  -> InteropRoundTripFixture
```

## Representation Boundary Rules

- `PatternGraph` is the manufacturing source of truth.
- `PatternProgram` is a promising authoring and generation representation.
- `RasterPatternEncoding` is an ML convenience representation, not an export format.
- `3DGarmentMesh` is preview, supervision, or a future source for mesh-to-pattern. It is not the pattern.
- `UVIsland` is a flattened geometry region. It becomes useful only after seam semantics, grainline, allowances, labels, and construction metadata are added.
- `MarkerPlan` can reuse packing algorithms, but must respect grain, folds, fabric width, size runs, and cutting constraints that ordinary UV packing ignores.
- `ValidationReport` is the guardrail between generated candidates and user-facing pattern output.
- `PatternGraphCandidate` must never export directly. It must pass candidate-to-export interop and be promoted to `PatternGraph`.
- Canonical internal units are millimeters. Source units must be recorded, converted, and round-trip tested.
- Marker layout is a constrained garment problem, not generic UV packing: fabric width, grainline, folds, nap, print direction, and cut counts matter.
- The browser app should define `GeometryKernel` contracts before committing to TypeScript, Rust/WASM, C++/Emscripten, or WebGPU implementation details.
- WebGPU is an optional acceleration tier, not a prototype dependency.
- Reference images must carry `TruthLevel` and `LicenseProfile` before they can influence training, evaluation, or product display.
- Image-to-3D outputs become `ImageTo3DModelCandidate` / `3DGarmentMesh` evidence, not pattern truth.
- Export compatibility is semantic: a file that preserves curves but loses units, layer meaning, grainlines, notches, labels, or cut counts fails conformance.
- Designer sketch/model edits must be classified before they affect output. A projected decal, color zone, print, or PBR material preview is not a pattern change unless it becomes a validated `PatternGraphCandidate` or `PatternGraphRevision`.
- Live 3D preview is feedback for design intent; it must not silently rewrite sewable pattern geometry.

## Deep Dive Product Decisions

- Keep the first prototype browser-first: `PatternGraph` JSON, SVG/PDF export, Three.js preview, TypeScript geometry, and an explicit `GeometryKernel` boundary.
- Build a simple deterministic marker planner before integrating libnest2d or Deepnest-style optimized placement.
- Treat DXF/AAMA/ASTM as a semantic-export milestone after SVG round-trip fixtures work.
- Build the first visual corpus as a reviewed evaluation set, not as a training set.
- Compare SPAR3D and Hunyuan3D-2 first for image-to-3D candidate generation; keep TRELLIS, TRELLIS.2, and TripoSR as comparison/frontier references.
- Use GPT Image 2 for controlled sketch and technical-flat corpus generation with prompt provenance and semantic review.
- Add a designer-facing edit loop where raster/vector sketch edits, material/PBR preview layers, and surface projections update a live model while preserving `PatternGraph` as manufacturing truth.

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
