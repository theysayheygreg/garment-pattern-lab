# Things Tried / Architecture History

This is the project memory shelf for explored approaches that should not clutter the current architecture overview.

Use this file when an option is useful as prior art, a future branch, or a lesson learned, but is no longer the active product direction. Durable product choices still belong in [Decision Log](DECISION-LOG.md). The current working architecture belongs in [Architecture Overview](../project/ARCHITECTURE-OVERVIEW.md).

## 2026-05-03: Mesh-First UV Unwrap To Pattern

**Explored:** Start from a generated 3D garment mesh, UV unwrap it, then interpret the UV islands as sewing pattern pieces.

**Current status:** Rejected for prototype 1.

**Why it moved here:** UV islands are not automatically sewable panels. A real garment pattern needs seam semantics, paired seam relationships, grainline, darts, notches, seam allowance, cut labels, fabric assumptions, and construction order. Mesh flattening remains useful research, but the prototype should generate and validate `PatternGraph` first.

**Useful later:** Mesh-to-pattern research, 3D candidate validation, distortion analysis, seam placement experiments, and comparison against `Computational Pattern Making from 3D Garment Models`.

## 2026-05-03: Any-Garment Generation

**Explored:** Accept any garment sketch and attempt to produce a complete pattern package for arbitrary garment families.

**Current status:** Deferred.

**Why it moved here:** The first prototype needs a measurable success target. Arbitrary garment generation hides too many unknowns at once: sleeves, collars, plackets, closures, linings, pockets, stretch fabrics, grading, and fabric-specific construction.

**Useful later:** Expansion after the sleeveless A-line woven dress/tunic proves the pipeline.

## 2026-05-03: Fully Automatic Sketch Parsing

**Explored:** Make the first workflow fully automatic from raster/vector sketch to garment parameters.

**Current status:** Deferred in favor of manual or assisted landmarks.

**Why it moved here:** The project needs credible pattern output before visual inference can be trusted. Manual landmarking still exercises the sketch-to-parameter bridge and creates reviewed data for future automation.

**Useful later:** GPT Image 2 sketch generation, labeled `SketchIntent` fixtures, segmentation/landmark models, and visual-corpus evaluation.

## 2026-05-03: Directly Adopting Existing Pattern Generators As The Product Core

**Explored:** Build the product directly on FreeSewing, OpenPattern, GarmentCode, or similar pattern-program systems.

**Current status:** Rejected as the source of truth, retained as reference and fixture material.

**Why it moved here:** These projects are valuable, but the product needs its own explicit `PatternGraph`, validation gate, corpus metadata, and export proof model. Existing tools should inform drafting formulas, schema, fixture generation, and UI expectations rather than define the manufacturing representation.

**Useful later:** Formula references, generated fixtures, comparison outputs, and prior-art implementation patterns.

## 2026-05-03: Full Graphite-Like Layered Vector Editor

**Explored:** Build a large vector/layer/node editor for garments, with layers for fabrics, stitches, trims, prints, applique, annotations, masks, and material regions.

**Current status:** Deferred.

**Why it moved here:** A full creative editor is a large product by itself. Prototype 1 should support parameter-backed direct manipulation of garment features such as shoulder opening, armhole, neckline, side silhouette, hem length, and hem sweep.

**Useful later:** Designer workbench, material/layer authoring, print placement, PBR preview, and Graphite-inspired editing workflows.

## 2026-05-03: Machine-Readable Cutter And Industrial CAD Output

**Explored:** Treat DXF/AAMA/ASTM, cutter-ready marker files, and industrial CAD round trips as first prototype outputs.

**Current status:** Deferred.

**Why it moved here:** The first useful proof is a human-readable pattern package that a person can print, cut, review, and sew. Industrial files need stricter exchange semantics, hardware assumptions, cutting clearances, production metadata, and CAD round-trip validation.

**Useful later:** DXF/AAMA/ASTM export, cutter marker planning, tech-pack integration, and factory workflow research.

## 2026-05-03: WebGPU/WASM-First Geometry

**Explored:** Start with WebGPU compute, Rust/WASM, or C++/Emscripten as the first geometry implementation.

**Current status:** Deferred behind `GeometryKernel` and `PatternKernel` interfaces.

**Why it moved here:** Correct deterministic pattern output matters more than early runtime cleverness. The prototype can begin with TypeScript geometry libraries and move hard offset/intersection/triangulation/nesting work to WASM once fixtures prove the need.

**Useful later:** Clipper2-WASM, Rust geometry kernels, WebGPU acceleration, and performance-critical marker planning.

## 2026-05-03: Generic Nesting As Marker Truth

**Explored:** Use generic SVG nesting tools or bin-packers as the authoritative marker-layout system.

**Current status:** Deferred and narrowed.

**Why it moved here:** Marker planning for garments must respect fabric roll width, grainline, fold placement, nap/directional prints, pair mirroring, seam allowance, spacing, and human-readability. Generic nesting can help propose layouts, but the product needs garment-aware marker policy.

**Useful later:** Deepnest/libnest2d/SVGnest-style comparisons, fabric-utilization metrics, and optional marker optimization.

## 2026-05-03: Image-To-3D As Pattern Truth

**Explored:** Use modern image-to-3D systems such as TripoSR-style models as the bridge from sketch to garment pattern.

**Current status:** Rejected as manufacturing truth, retained as candidate/preview research.

**Why it moved here:** Image-to-3D can produce plausible geometry without sewing semantics. It may help create preview meshes, infer silhouette, or compare model outputs, but it must not bypass `PatternGraphCandidate` normalization and validation.

**Useful later:** Candidate mesh generation, 3D preview experiments, silhouette checks, and visual-feedback research.
