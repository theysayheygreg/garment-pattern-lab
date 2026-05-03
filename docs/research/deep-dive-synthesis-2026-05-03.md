# Deep Dive Synthesis: Pattern Candidate Proof, Browser Geometry, Markers, And Visual Corpus

Date: 2026-05-03

This pass deepens the open research lanes that matter most before prototype code starts. The main result is a stronger product boundary: generated or imported geometry can be useful, but the product should only trust a promoted `PatternGraph` that has unit proof, sewing semantics, validation, export conformance, and marker/cut planning.

## Executive Decisions

1. The browser-native prototype should use TypeScript and Three.js for the product surface, with WebGPU treated as a renderer/compute acceleration option rather than a dependency for prototype 1.
2. Deterministic geometry should be isolated behind a `GeometryKernel` API early, even if the first implementation is TypeScript. Offset, intersection, curve length, triangulation, and nesting are the likely WASM migration points.
3. Marker planning is not generic UV packing. It is constrained irregular nesting with fabric roll width, grain tolerance, fold mode, nap/print direction, cut counts, spacing, shrinkage, and scale proof.
4. Image-to-3D systems are useful as visual and mesh-candidate generators, not as direct pattern generators. Every mesh-derived result must enter as a `PatternGraphCandidate`.
5. Pattern reference images need truth levels. Some sources show envelope art or catalog metadata; others include scaled panels and instructions. Only the latter should become correctness fixtures.
6. GPT Image 2 belongs in a controlled sketch-corpus lane, with prompts, seed/input references, human semantic review, and generated outputs linked back to measurable pattern expectations.

## Lane A: Candidate-To-Export Proof Layer

The interop layer should become a hard gate between any candidate source and user-facing exports.

Candidate sources:

- pattern-grammar generation
- mesh-to-pattern flattening from `Computational Pattern Making from 3D Garment Models`
- imported SVG/DXF/AAMA/ASTM files
- AI-generated pattern candidates
- manual edits from a vector editor

Required candidate proof sequence:

```text
PatternGraphCandidate
  -> CandidateProvenance
  -> UnitProfile
  -> CandidateNormalizerReport
  -> MeasurementReport
  -> CorrectionOperation
  -> ValidationReport
  -> ExportGateReport
  -> PatternGraph
  -> ExportConformanceReport
  -> RoundTripReport
```

The key insight from DXF/ASTM references is that export formats carry garment semantics through structure and layers, not just curves. Patro's ASTM DXF notes show pattern pieces grouped as DXF blocks, with layers for cuts, internal lines, notches, grading, labels, drill holes, and mirrors/folds. That makes `InteropFormatProfile` a first-class graph node instead of a late exporter setting.

Prototype implication:

- SVG export can ship first, but it must mimic industrial semantics with stable layer IDs and element metadata.
- DXF/AAMA/ASTM export should wait until `PatternGraph` can express notches, internal lines, grain, folds, labels, cut counts, grade anchors, and units without guessing.
- Round-trip tests must compare geometry and semantic layer meaning, not just file parse success.

## Lane B: Browser-Native Geometry Kernel

The browser product should stay ownable, but not naive. The best first cut is a clear kernel boundary:

```text
PatternGraph
  -> PatternKernel
  -> GeometryKernel
  -> WebWorkerGeometryRuntime
  -> WasmGeometryRuntime
```

Kernel responsibilities:

- curve flattening and length measurement
- seam-line to cut-line offset with joins
- curve splitting and point projection
- self-intersection checks
- polygon winding and containment
- triangulation for 3D preview panels
- no-fit-polygon or other placement support for marker plans

Three.js is a good product viewport choice because its WebGPU renderer can use WebGPU when available and fall back to WebGL 2. MDN's WebGPU documentation confirms compute shaders are available for general parallel computation, but it also flags WebGPU as limited availability rather than universal. That suggests a tiered runtime:

- Tier 1: TypeScript geometry in web workers plus Three.js WebGL/WebGPU viewport.
- Tier 2: WASM geometry kernels for deterministic heavy operations.
- Tier 3: WebGPU compute for expensive preview/simulation or bulk evaluation after the CPU/WASM path is correct.

Emscripten Embind remains viable if the kernel borrows C++ libraries such as libnest2d, Clipper, or other mature geometry code. Rust/WASM remains attractive if the project wants a cleaner browser-native package boundary. The graph should not commit too early; it should define `GeometryKernel` contracts first.

## Lane C: Marker Layout And Fabric Economics

Marker planning should be treated as a production feature, not a cosmetic layout.

Inputs:

- `PatternGraph`
- `FabricRollProfile`
- `MarkerPolicy`
- usable width in millimeters
- selvage allowance
- piece spacing
- shrinkage allowance
- grainline tolerance
- fold mode
- nap/print direction
- cut counts and size run

Outputs:

- `MarkerPlan`
- `MarkerPlacement`
- `ConsumptionReport`
- `MarkerQualityMetric`
- warnings for unplaced panels, illegal rotation, grainline error, fold violations, and scale mismatch

Open-source nesting references are useful but incomplete for garments. libnest2d gives a C++ irregular bin-packing framework using no-fit-polygon placement, selection strategies, Clipper, NLopt, and Boost Geometry. Deepnest/SVGnest-style tools are useful references for SVG/DXF nesting, but they do not know garment rules by default. The product should treat those algorithms as candidate engines under a garment-aware `MarkerOptimizer`.

Prototype algorithm posture:

1. Start with deterministic shelf/strip placement by panel role and grain direction.
2. Add rotation only within `MarkerPolicy` tolerance.
3. Compute waste and fabric length.
4. Add optional NFP/libnest2d engine behind the same API.
5. Compare the simple and optimized markers with identical `ConsumptionReport` metrics.

## Lane D: Pattern Reference Corpus And Correctness Fixtures

The visual corpus should distinguish "pretty useful" from "truth useful."

Proposed truth levels:

- `visual-only`: sketch, fashion drawing, generated image, catalog art, or render with no construction proof.
- `semantic-reviewed`: front/back shape and construction hints have been reviewed into `SketchIntent`.
- `pattern-reference`: real pattern diagram, cutting layout, or instruction image tied to a source and garment family.
- `pattern-truth`: scaled panel geometry plus construction instructions and known provenance.
- `round-trip-fixture`: source pattern has been converted to `PatternGraph`, exported, reimported, and checked.

Candidate sources:

- LACMA Pattern Project: strongest pattern-truth source found in this pass because each PDF includes a scaled pattern, object context, images, and construction instructions for historic garments.
- CoPA: strong metadata/catalog reference for commercial patterns, but not automatically full pattern truth. It is useful for garment taxonomy, envelope imagery, and historical pattern families.
- OpenPattern: useful as a programmable pattern-reference source because it drafts full-scale bespoke sewing patterns from formulas and exposes operations for points, curves, darts, fold lines, grainlines, offsets, and export.
- FreeSewing: strong browser/parametric reference. Its design/pattern split, made-to-measure drafting, browser editor, measurement sets, and PDF export are directly relevant to our own product architecture.
- GarmentCodeData: strongest paired synthetic dataset lane because it links made-to-measure 3D garments and sewing patterns, with dataset/code links from ETH.

The first corpus should be small and strict:

- sleeveless A-line dress/tunic
- A-line skirt
- basic bodice shell
- simple woven top
- simple pants block

Each family should have expected panel roles, seam pairs, grainline expectations, notches, finishing choices, and suspicious omissions. This becomes the basis for `CorrectnessRuleSet`.

## Lane E: GPT Image 2 Sketch Corpus

GPT Image 2 is now the right model to test for generated sketch/reference sheets because OpenAI documents it as a high-quality image generation/editing model with text and image input plus image output. The project should not depend on perfect latent consistency. Instead, it should use generated sketches as controlled fixtures.

Prompt recipe dimensions:

- garment family
- front/back view requirement
- figure/croquis vs isolated technical flat
- construction marks allowed or forbidden
- seam/dart/notch visibility
- fabric behavior hints
- neutral body proportions
- no brand/copyrighted pattern references

Every generated item should record:

- model and snapshot, when available
- prompt
- input reference images, if any
- generated image path
- semantic review notes
- extracted `SketchIntent`
- linked expected `PatternReferenceFamily`
- whether it may be used for training, evaluation, or demonstration only

## Lane F: Image-To-3D Candidate Frameworks

Modern image-to-3D tools are moving fast enough to deserve regular re-checks, but their product role stays narrow.

SPAR3D:

- Good first local spike because it is open-source, fast feed-forward single-image reconstruction, and explicitly produces textured UV-unwrapped mesh assets.
- Useful for "does this sketch imply a sane coarse garment volume?"

Hunyuan3D-2:

- Strong candidate for high-resolution textured assets from images, with shape and texture foundation components and GLB/OBJ output via trimesh.
- Heavier dependency and VRAM profile than a browser prototype, likely a server/local research worker rather than a client feature.

TRELLIS:

- Strong research candidate for image-conditioned 3D generation with official pipelines and model repos.
- Better as a comparative generator than a product dependency.

TRELLIS.2:

- Very current and high-end, but likely too large for the first implementation lane.
- Track as a quality frontier for image-to-3D comparison.

TripoSR:

- Still worth keeping in the comparison because it is fast and mature enough to be a baseline, even if newer tools may outperform it.

Framework outputs should be normalized into:

```text
ImageTo3DModelCandidate
  -> ReconstructionProfile
  -> MeshNormalization
  -> MeshQualityReport
  -> 3DGarmentMesh
  -> PatternGraphCandidate
```

Mesh quality metrics:

- front/back silhouette preservation
- garment/body separation
- watertightness or open-boundary status
- triangle count and topology cleanliness
- UV presence and island count
- scale/proportion sanity
- usefulness for panel-boundary inference

## Immediate Prototype Research Spikes

1. Write `PatternGraph` schema and fixtures for sleeveless A-line woven tunic.
2. Build a browser geometry-kernel interface with TypeScript implementation first.
3. Implement SVG export/reimport round-trip test with unit and layer checks.
4. Implement simple marker plan from cut-line polygons, fabric width, spacing, and grain axis.
5. Create a 20-item visual corpus: 5 human/reference items, 5 GPT Image 2 front/back technical flats, 5 generated croquis sketches, and 5 pattern-reference items.
6. Run SPAR3D and Hunyuan3D-2 on the same 3 sketch/reference images and score them with `MeshCandidateReport`.

## Source Notes

- libnest2d: C++ irregular bin-packing/nesting library, customizable geometry backends, no-fit-polygon placement, Clipper/NLopt/Boost dependencies. https://github.com/tamasmeszaros/libnest2d
- Deepnest Next: maintained community open-source nesting application with SVG/DXF relevance. https://github.com/deepnest-next/deepnest
- Patro ASTM DXF docs: useful layer/block map for apparel DXF semantics. https://fabricesalvaire.github.io/Patro/resources/file-format/dxf-astm.html
- LACMA Pattern Project: downloadable scaled historic garment patterns with construction instructions. https://www.lacma.org/patternproject
- CoPA: commercial pattern metadata/archive for taxonomy and reference imagery. https://copa.apps.uri.edu/
- GarmentCodeData: paired made-to-measure 3D garments and sewing patterns with dataset/code links. https://igl.ethz.ch/projects/GarmentCodeData/
- Three.js WebGPURenderer: WebGPU renderer with WebGL 2 fallback. https://threejs.org/docs/pages/WebGPURenderer.html
- MDN WebGPU API: rendering and compute API, limited availability caveat. https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- Emscripten Embind: C++/JavaScript binding path for WASM kernels. https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html
- OpenPattern: Python drafting library for full-scale bespoke patterns. https://openpattern.readthedocs.io/
- FreeSewing: open-source made-to-measure browser pattern system. https://freesewing.org/docs/about/
- GPT Image 2 official docs: image generation/editing model with text and image input. https://developers.openai.com/api/docs/models/gpt-image-2
- SPAR3D: open-source single-image 3D mesh reconstruction. https://github.com/Stability-AI/stable-point-aware-3d
- Hunyuan3D-2: text/image-to-3D high-resolution asset generation. https://github.com/Tencent-Hunyuan/Hunyuan3D-2
- TRELLIS: Microsoft image-conditioned 3D generation pipeline. https://github.com/microsoft/TRELLIS
- TRELLIS.2: current high-fidelity 4B image-to-3D generation model. https://github.com/microsoft/TRELLIS.2
