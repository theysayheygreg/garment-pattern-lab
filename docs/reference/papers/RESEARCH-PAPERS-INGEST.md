# Research Papers Ingest

This file ingests the research references beyond `Computational Pattern Making from 3D Garment Models`. It maps each source into product knowledge graph impact.

## GarmentCode: Programming Parametric Sewing Patterns

Source: https://arxiv.org/abs/2306.03642

### One-Line Read

GarmentCode is the strongest representation reference for pattern-grammar-first product architecture: it treats garments as modular, hierarchical, parameterized sewing-pattern programs.

### Key Ideas

- Domain-specific language for garment modeling.
- Sewing patterns are built from components.
- Basic component is a `Panel`.
- Higher components combine panels and expose semantic interfaces.
- Stitches can connect high-level interfaces rather than only raw edge pairs.
- Supports continuous, categorical, and dependent parameters.
- Maintains valid sewing pattern topology through component abstraction.
- Supports design exploration by swapping/interchanging compatible components.
- Handles garments through explicit pattern geometry rather than only visual 3D mesh.

### Product Graph Impact

Add or strengthen:

- `PatternProgram`
- `Component`
- `SemanticInterface`
- `AbstractStitch`
- `DependentParameter`
- `ComponentLibrary`
- `ComponentSwap`

Edges:

```text
PatternProgram -> Component
Component -> Panel
Component -> SemanticInterface
SemanticInterface -> AbstractStitch
GarmentParameters -> DependentParameter
ComponentLibrary -> PatternGrammar
ComponentSwap -> PatternGraphRevision
```

### Prototype Impact

Prototype 1 should not overbuild a DSL, but its schema should leave room for component interfaces:

- front body component
- back body component
- neckline finish component
- armhole finish component

### Roadmap Impact

Add a schema rule:

- Raw edge pairs are necessary, but semantic interfaces are the scalable level for sleeves/collars/closures later.

### Open Research

- Inspect GarmentCode source and license.
- Determine whether a first-garment program can be adapted or should be rewritten project-native.

## GarmentCodeData

Source: https://arxiv.org/abs/2405.17609  
Project page: https://igl.ethz.ch/projects/GarmentCodeData/

### One-Line Read

GarmentCodeData is the strongest data reference: a large synthetic dataset pairing made-to-measure 3D garments with sewing patterns, generated from body sampling, pattern sampling, and draping.

### Key Ideas

- 115,000 design samples.
- Common garment categories: tops, shirts, dresses, jumpsuits, skirts, pants, etc.
- Each sample fits a randomly sampled body shape.
- Provides ground-truth sewing patterns and 3D draped meshes.
- Includes segmentation labels and UV maps corresponding to initial panel shapes.
- Uses automatic tailor's measurements on sampled body shapes.
- Uses GarmentCode-derived patterns.
- Adds open-source draping pipeline based on XPBD simulation.
- Filters bad generated samples: self-intersections, empty patterns, full-body garments, poor drapes.
- Improves pattern quality with professional fashion-designer input.

### Product Graph Impact

Add or strengthen:

- `SyntheticDataset`
- `BodyShapeSample`
- `AutomaticMeasurementExtraction`
- `PatternSampling`
- `DrapePipeline`
- `DatasetFilter`
- `GroundTruthPattern`
- `DrapedMesh`

Edges:

```text
BodyShapeSample -> AutomaticMeasurementExtraction
AutomaticMeasurementExtraction -> MeasurementSet
PatternSampling -> PatternGraph
PatternGraph -> DrapePipeline
DrapePipeline -> DrapedMesh
DrapedMesh -> DatasetFilter
SyntheticDataset -> TrainingCorpus
GroundTruthPattern -> EvaluationBenchmark
```

### Prototype Impact

Do not wait for dataset ML. Use this as:

- schema reference
- dataset candidate for later sketch/image training
- validation inspiration for drape filtering
- possible source of tunic/dress examples

### Roadmap Impact

Add dataset audit:

- availability
- license
- category coverage
- measurement schema
- pattern JSON compatibility
- whether dresses/tunics map to prototype 1

### Limitations For Product

- Synthetic data carries generator bias.
- Body-shape sampling may encode demographic bias.
- GarmentCode limitations propagate into the dataset.
- Drape filters do not guarantee real-world sewability.

## Sketch2Cloth

Source: https://arxiv.org/abs/2303.00167

### One-Line Read

Sketch2Cloth validates sketch as a useful input surface for 3D garment ideation, but it generates 3D garment meshes, not sewing patterns.

### Key Ideas

- Sketch-based 3D garment generation.
- Uses unsigned distance fields to represent non-watertight garment meshes.
- Generates a UDF from a sketch, extracts mesh with Marching Cubes.
- Includes model editing UI.
- Uses Multi-Garment and DeepFashion3D datasets.
- Focuses on common users without 3D modeling skills.

### Product Graph Impact

Add or strengthen:

- `SketchInput`
- `SketchEncoder`
- `ImplicitGarmentField`
- `UnsignedDistanceField`
- `MeshExtraction`
- `Generated3DGarment`
- `MeshEdit`

Edges:

```text
SketchInput -> SketchEncoder
SketchEncoder -> ImplicitGarmentField
ImplicitGarmentField -> Generated3DGarment
Generated3DGarment -> MeshEdit
Generated3DGarment -> 3DGarmentMesh
```

### Prototype Impact

Sketch2Cloth supports the product premise that sketch is an ergonomic input. It does not solve manufacturing output.

Prototype 1 should therefore:

- use sketch landmarks to produce pattern parameters
- avoid generating a decorative mesh that cannot be sewn

### Later Research Branch

Sketch2Cloth-like models could create a `3DGarmentMesh`, which then flows into a mesh-to-pattern pipeline.

## GarmentDiffusion

Source: https://arxiv.org/abs/2504.21476

### One-Line Read

GarmentDiffusion is a reference for multimodal, vectorized sewing-pattern generation from text, sketch/image, and incomplete pattern input, using compact edge tokens and diffusion transformers.

### Key Ideas

- Multimodal inputs: text, image/sketch, incomplete pattern.
- Outputs centimeter-precise vectorized 3D sewing patterns.
- Encodes edge-related parameters into compact edge tokens.
- Represents endpoint/control/arc/stitch/free-edge information.
- Processes edge tokens in parallel with a diffusion transformer.
- Faster than autoregressive SewingGPT-style generation.
- Evaluated on DressCodeData, SewFactory, and GarmentCodeData.
- Provides annotation pipelines for brief/detailed text and garment sketches.

### Product Graph Impact

Add or strengthen:

- `MultimodalPatternGenerator`
- `EdgeToken`
- `PanelToken`
- `PatternCompletion`
- `TextPrompt`
- `ImagePrompt`
- `IncompletePattern`
- `ConditioningSignal`

Edges:

```text
TextPrompt -> ConditioningSignal
ImagePrompt -> ConditioningSignal
IncompletePattern -> ConditioningSignal
ConditioningSignal -> MultimodalPatternGenerator
MultimodalPatternGenerator -> PatternGraphCandidate
PatternGraphCandidate -> ValidationReport
```

### Prototype Impact

Do not build this first. But it tells us the eventual model target should be vectorized sewing pattern structure, not just pixels or meshes.

### Roadmap Impact

Add later ML lane:

- gather prompt/sketch/pattern triples
- encode pattern graph into edge-token or raster form
- generate candidates
- validate before export

### Product Constraint

Generative model output is a candidate, not authority. It must pass graph validation and human review.

## GarmentImage

Source: https://arxiv.org/abs/2505.02592

### One-Line Read

GarmentImage argues that vector sewing-pattern representations are awkward for ML across diverse topologies, and proposes raster multi-channel grids that encode geometry, topology, stitching, placement, and local deformation.

### Key Ideas

- Vector patterns have discontinuous latent spaces when topology changes.
- Variable panel counts and topologies reduce generalization.
- GarmentImage encodes patterns into multi-channel grids.
- Grid cells include inside/outside occupancy.
- Edge types encode stitching/connectivity.
- Local deformation matrices capture geometry.
- Panel placement around body is implicitly represented by grid location.
- Raster representation enables CNN/VAE/image-model approaches.
- Decoding reconstructs vector panels.

### Product Graph Impact

Add or strengthen:

- `RasterPatternEncoding`
- `PatternLatentSpace`
- `TopologyInterpolation`
- `OccupancyGrid`
- `EdgeTypeGrid`
- `LocalDeformationMatrix`
- `VectorDecode`

Edges:

```text
PatternGraph -> RasterPatternEncoding
RasterPatternEncoding -> PatternLatentSpace
PatternLatentSpace -> PatternGraphCandidate
RasterPatternEncoding -> VectorDecode
VectorDecode -> PatternGraphCandidate
```

### Prototype Impact

Keep vector graph as source of truth for export. Add raster encoding later as ML auxiliary representation.

### Roadmap Impact

Add representation research:

- compare vector graph vs edge-token vs raster pattern encoding
- choose model representation only after prototype graph is stable

### Limitations To Track

- Automatic encoding has failure modes.
- Raster encoding can be ambiguous or inconsistent for the same panel.
- Experiments used simplified/unrealistic datasets in places.

## Deep Fashion3D

Source: https://arxiv.org/abs/2003.12753

### One-Line Read

Deep Fashion3D is useful as a 3D garment geometry and image benchmark, especially for reconstruction and feature-line detection, but it does not provide sewing patterns.

### Key Ideas

- 2,078 reconstructed 3D garment models.
- 563 garment instances.
- 10 garment categories.
- Multi-view real images.
- 3D body pose annotations.
- 3D feature lines: neckline, cuff contours, hemlines, prominent garment features.
- Random poses add deformation variety.
- Single-image garment reconstruction benchmark.
- Uses adaptable template plus implicit detail transfer.

### Product Graph Impact

Add or strengthen:

- `3DGarmentDataset`
- `FeatureLine`
- `ImageToMeshReconstruction`
- `GarmentCategory`
- `MultiViewImageSet`
- `BodyPose`

Edges:

```text
MultiViewImageSet -> ImageToMeshReconstruction
ImageToMeshReconstruction -> 3DGarmentMesh
FeatureLine -> GarmentLandmark
3DGarmentDataset -> TrainingCorpus
```

### Prototype Impact

Deep Fashion3D can help future sketch/image-to-3D work and feature-line vocabulary, but it cannot directly train sketch-to-pattern because pattern labels are absent.

### Product Constraint

Datasets without sewing patterns are not enough for the core product. They are auxiliary for garment perception and mesh generation.

## SketchTailor

Source: https://www.sciencedirect.com/science/article/abs/pii/S0097849325001864

### One-Line Read

SketchTailor is closest to the original dream: sketch-driven generation of high-fidelity 3D garment sewing patterns, emphasizing efficient deployment and sketch control.

### Key Ideas From Abstract

- Sketch-to-pattern dataset.
- Generates precise 3D garment patterns.
- Uses vision prompt-tuned Vision Mamba encoder.
- Uses deformable Transformer decoder.
- Converts sketch features into detailed 3D garment patterns.
- Preserves topological structures and geometric details.
- Claims high-fidelity output and faster inference.
- Outputs patterns that can integrate into CG pipelines for simulation and animation.

### Product Graph Impact

Add or strengthen:

- `SketchToPatternModel`
- `SketchPatternDataset`
- `TopologyPreservation`
- `ShapeControl`

Edges:

```text
SketchInput -> SketchToPatternModel
SketchToPatternModel -> PatternGraphCandidate
SketchPatternDataset -> TrainingCorpus
PatternGraphCandidate -> SimulationAssembly
```

### Product Impact

This validates the automated sketch-to-pattern direction, but the implementation/data may not be public or product-ready. Treat it as frontier evidence and a competitive/technical benchmark.

## GenPattern

Source: https://www.sciencedirect.com/science/article/pii/S0278612525002663

### One-Line Read

GenPattern frames sewing-pattern generation as multimodal intent-to-manufacturing, using graph structure and multimodal language models.

### Key Ideas From Abstract

- Sewing pattern generation is expert-dependent and skill-intensive.
- Multimodal inputs include text and images.
- Dual-graph approach models geometry and semantics.
- SVG-style tokenizer supports structured pattern encoding.
- Reports stitch accuracy and panel vertex error metrics.
- Connects generated patterns to human-robot collaborative fabrication.

### Product Graph Impact

Add or strengthen:

- `DualGraphRepresentation`
- `GeometryGraph`
- `SemanticGraph`
- `SVGPatternTokenizer`
- `FabricationMetric`
- `RobotFabricationWorkflow`

Edges:

```text
PatternGraph -> GeometryGraph
PatternGraph -> SemanticGraph
SemanticGraph -> ConstructionOrder
GeometryGraph -> SVGPatternTokenizer
PatternGraphCandidate -> FabricationMetric
```

### Product Impact

This supports splitting pattern structure into geometry and semantics. Garment Pattern Lab should do the same: the SVG is not enough; construction meaning must remain attached.

## Adobe: Parsing Sewing Patterns Into 3D Garments

Source: https://research.adobe.com/publication/parsing-sewing-patterns-into-3d-garments/

### One-Line Read

This paper is an inverse bridge: it starts from existing 2D sewing patterns and turns them into editable/simulated 3D garments, showing that pattern parsing and 2D/3D correspondence are product-critical.

### Key Ideas

- Parse sewing patterns into 3D garments.
- Preserve style under 3D edits.
- Help designers modify 3D shape without manual low-level 2D pattern edits.
- Use physical draping simulation to connect target geometry and patterns.

### Product Graph Impact

Add or strengthen:

- `PatternParser`
- `2D3DCorrespondence`
- `StylePreservation`
- `Direct3DEdit`

Edges:

```text
PatternGraph -> PatternParser
PatternParser -> 3DAssemblyPreview
Direct3DEdit -> PatternGraphRevision
StylePreservation -> ValidationReport
```

### Product Impact

The export pattern should remain editable and parseable back into preview. Round-trip integrity is a future product quality gate.

## GARSKETCH3D

Source: https://research.manchester.ac.uk/en/publications/garsketch3d-a-sketch-based-3d-apparel-product-modelling-platform/

### One-Line Read

GARSKETCH3D is an early version of the dream: draw 2D strokes around a feature human model, construct a 3D garment, cut it into pattern components, and flatten to 2D.

### Key Ideas

- Feature human model from scanner, size table, or photos.
- User draws 2D freeform strokes.
- For tight clothes, strokes can define garment boundaries on the body surface.
- For loose clothes, strokes define profiles of garment templates.
- Supports mesh extrusion and mesh cutting.
- Modified garment can be cut into components and flattened to 2D manufacturing patterns.

### Product Graph Impact

Add or strengthen:

- `FeatureHumanModel`
- `OnBodySketch`
- `GarmentBoundaryStroke`
- `TemplateProfileStroke`
- `MeshCut`
- `MeshExtrusion`

Edges:

```text
FeatureHumanModel -> Avatar
OnBodySketch -> GarmentBoundaryStroke
GarmentBoundaryStroke -> 3DGarmentMesh
TemplateProfileStroke -> 3DGarmentMesh
MeshCut -> PatchLayout
```

### Product Impact

This supports an interactive sketch-on-avatar mode as a future bridge between pure 2D sketch and full 3D garment mesh.

## Parametric 3D Clothing Generation: From Sketch To Dynamic Fit

Source: https://journals.sagepub.com/doi/full/10.1177/15589250261441600

### One-Line Read

This 2026 work supports sketch-plus-body-parameters as a viable path to fitted 3D garment geometry, but appears to bypass explicit manufacturing pattern output.

### Key Ideas From Available Text

- Input: 2D garment sketch and human body shape/pose parameters.
- Uses body encoder and sketch encoder.
- Generates 3D garment mesh.
- Refines mesh in high-curvature regions.
- Includes physical constraint module for collision/penetration.
- Claims end-to-end sketch to fitted 3D garment.

### Product Graph Impact

Add or strengthen:

- `BodyParameterEncoder`
- `SketchStyleEncoder`
- `EaseOffset`
- `AdaptiveMeshSampling`
- `CollisionConstraint`
- `GeneratedFittedMesh`

Edges:

```text
SketchInput -> SketchStyleEncoder
MeasurementSet -> BodyParameterEncoder
SketchStyleEncoder -> GeneratedFittedMesh
BodyParameterEncoder -> GeneratedFittedMesh
GeneratedFittedMesh -> 3DAssemblyPreview
GeneratedFittedMesh -> 3DGarmentMesh
```

### Product Impact

This is a strong future 3D preview route, but not sufficient for the product unless converted into a pattern graph.

## Cross-Paper Synthesis

### Three Representation Families

1. **Vector / graph pattern representation**
   - Best for export, editing, validation, and manufacturing.
   - Sources: fundamentals, GarmentCode, GenPattern.

2. **Raster pattern representation**
   - Best for ML latent spaces and topology generalization.
   - Source: GarmentImage.

3. **3D mesh / implicit garment representation**
   - Best for visual design, preview, and reconstruction.
   - Sources: Sketch2Cloth, Deep Fashion3D, Parametric 3D Clothing.

Garment Pattern Lab should use all three, but not confuse them:

```text
PatternGraph = manufacturing truth
RasterPatternEncoding = ML helper
3DGarmentMesh = preview/source/candidate geometry
```

### Data Strategy

- GarmentCodeData: primary future training/evaluation candidate for pattern labels.
- Deep Fashion3D: auxiliary 3D/image/feature-line perception data.
- SketchTailor/GenPattern/GarmentDiffusion: frontier model references and evaluation targets.
- Project-native prototype outputs: small, high-quality validation set for product-specific behavior.

### Model Strategy

Near term:

- no generative model
- deterministic pattern grammar
- manual sketch landmarks
- validation-first export

Mid term:

- sketch-to-parameter model
- component recommendation
- completion from incomplete pattern

Long term:

- multimodal pattern generation
- raster/vector dual representation
- mesh-to-pattern branch
- human-in-the-loop correction

