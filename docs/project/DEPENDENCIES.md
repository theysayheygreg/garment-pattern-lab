# Dependencies

## Product Dependencies

### Patternmaking Knowledge

- Basic block/sloper drafting.
- Ease rules by garment type and fabric.
- Dart placement and manipulation.
- Seam walking and trueing.
- Grainline placement.
- Notches and balance marks.
- Seam allowance and hem allowance conventions.
- Construction order.

### Body Model / Measurements

Options:

- Manual measurement entry.
- Parametric avatar from measurements.
- SMPL/SMPL-X-style body model.
- MakeHuman-style open human model.
- 3D body scan integration later.

Prototype recommendation:

- Start with manual measurements and a simple parametric avatar.
- Add SMPL-family or MakeHuman only after the pattern generator works.

### Sketch Understanding

Capabilities needed:

- Raster preprocessing.
- Figure/garment segmentation.
- Landmark detection.
- Front/back alignment.
- Style parameter extraction.
- Manual landmark fallback.

Prototype recommendation:

- Use manual/semi-automatic landmark placement first.
- Add model-based auto-detection after there is a valid pattern grammar to target.

### Pattern Representation

Needed:

- Panel graph.
- Curves and edges.
- Edge-to-edge stitch relationships.
- Semantic labels.
- Seam-pair reflection-symmetry metadata.
- Dart geometry and symmetry metadata.
- Grain-axis metadata.
- Panel complexity metadata.
- Validation results attached to graph entities.
- Measurements and parameters.
- Export mapping.

Likely output formats:

- JSON pattern graph.
- SVG for editable vector output.
- PDF for print.
- DXF/AAMA/ASTM later.

Relevant research/software:

- GarmentCode.
- FreeSewing.
- Seamly2D / Valentina formats.
- SVG path tooling.

### Geometry and Simulation

Needed:

- 2D curve operations.
- Seam allowance offsetting.
- Polygon/curve validation.
- Curve reflection/similarity scoring for seam pairs.
- Mesh generation from panels.
- Basic cloth drape or coarse preview.
- Collision with avatar.
- Seam tension and length checks.
- Optional future anisotropic textile parameterization for 3D mesh flattening.

Prototype choices:

- 2D geometry in JavaScript/Python.
- Three.js for preview if browser-based.
- Blender Python for offline mesh/drape experiments if needed.
- Research XPBD cloth approaches for later.

### Export

Needed:

- SVG export.
- Printable PDF/tiled pages.
- Cut sheet.
- Assembly steps.
- Versioned pattern JSON.
- Canonical unit profile and scale proof.
- Marker/fabric layout planning by usable roll width.
- Fabric utilization and consumption estimate.

Later:

- DXF/AAMA/ASTM export.
- CLO/Marvelous/Browzwear import/export experiments.
- Tech pack generation.

## Software Dependencies To Evaluate

### Open Source Pattern Engines

- FreeSewing: parametric made-to-measure pattern generation.
- Seamly2D: open-source pattern drafting CAD.
- Valentina: parametric pattern drafting heritage.
- GarmentCode: programmable parametric sewing patterns.
- PatternSoft: desktop app combining FreeSewing and visual grading.

### 3D / Geometry

- Blender: UV unwrap, mesh tooling, Python automation.
- Graphite: vector/raster editor and nondestructive node-graph reference for sketch cleanup, semantic curve editing, and possible Rust vector geometry reuse.
- Three.js: browser 3D preview, static panel assembly, avatar display, glTF/export experiments, and WebGL fallback.
- WebGPU: optional acceleration for rendering, image preprocessing, cloth/constraint experiments, and heatmaps after the basic app works.
- WebAssembly: deterministic geometry kernels for curves, offsets, triangulation, seam validation, and self-intersection checks.
- Unity/Unreal: useful reference for UV channels, but not likely first prototype runtime.
- trimesh / shapely / numpy / scipy if Python-based geometry experiments are chosen.
- Poppler/pdftotext: local paper ingestion and reference extraction.
- Rust/Cargo, wasm-pack, cargo-watch, Node, and pnpm for Graphite source exploration.
- Blender app/binary for headless Python previews and rendered diagnostics.
- Web workers for responsive browser-side geometry, validation, and future inference tasks.
- Nesting/marker-planning algorithms for irregular pattern-piece placement within fabric-width constraints.
- Future: a robust curve-offset and polygon-boolean library is likely mandatory.

### Vision / AI

- OpenCV for preprocessing and contour extraction.
- Segment Anything or similar for garment silhouette masks.
- Pose/landmark detection for figure reference.
- Multimodal LLM/VLM for design parameter extraction.
- Custom lightweight classifier after data exists.

### Document Export

- SVG path generation.
- PDF generation/tiled printing.
- Optional: Inkscape CLI for SVG to PDF conversion.

## Human Dependencies

- Patternmaker review of first generated pattern.
- Sewer/maker review of instruction clarity.
- Fit model or measurement set.
- Physical muslin test eventually.

## Data Dependencies

- Public-domain or licensed patternmaking references.
- Synthetic pattern datasets with paired 2D/3D labels.
- Example sketches with known intended patterns.
- Measurement sets.
- Garment category taxonomy.

## Risky Dependencies

- Proprietary commercial CAD formats.
- Copyrighted textbook ingestion.
- Training data from commercial patterns.
- Physics simulation treated as proof of real-world fit.
- Fully automatic sketch interpretation before the output grammar is constrained.
- Mesh-derived pattern generation treated as production-ready before sewing-aware validation and human review.
