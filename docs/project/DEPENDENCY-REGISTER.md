# Dependency Register

This register tracks dependencies and prior art by whether Garment Pattern Lab should reuse, inspect, or build its own equivalent.

## Legend

- `candidate`: worth installing or prototyping.
- `reference`: useful prior art, not likely core dependency.
- `build`: product-specific system we should own.
- `unknown`: needs more research.

## Pattern Drafting And Parametric Generation

| Item | Status | Role | Notes |
| --- | --- | --- | --- |
| FreeSewing core | candidate | Parametric pattern generation reference and possible JS dependency. | MIT package on npm; made-to-measure pattern library. |
| FreeSewing Studio/dev docs | candidate | Developer workflow reference. | Good model for browser-accessible pattern generation. |
| OpenPattern | reference/candidate | Formula drafting reference. | Python library for full-scale bespoke patterns; useful for examples and drafting operations. |
| GarmentCode | reference/candidate | Pattern-program representation. | Strong conceptual model; evaluate fit with `PatternGraph`. |
| Garment Pattern Generator template spec | reference | Schema prior art. | Useful for panels, directed edges, stitches, 3D placement, and length equality constraints. |
| JBlockCreator | reference | Automated made-to-measure block generation. | Prior art for extensible drafting and ASTM/AAMA-DXF export. |
| Seamly2D / Valentina | reference | Formula/measurement CAD workflow. | Likely not core, but useful for parametric document concepts and interop. |
| First-garment formulas | build | Prototype generation rules. | Must own exact tunic/dress draft and assumptions. |

## Geometry Kernel

| Item | Status | Role | Notes |
| --- | --- | --- | --- |
| Paper.js | candidate | Browser vector paths, intersections, booleans, curve lengths. | Good for v1 editor/prototype, but must test robustness. |
| `@flatten-js/core` | candidate | First TypeScript geometry backend. | MIT; points, segments, arcs, intersections, transforms, polygons, SVG output. |
| `polygon-clipping` | candidate | Polygon boolean operations after curve flattening. | MIT; good for seam allowance cleanup and overlap checks. |
| `martinez-polygon-clipping` | candidate | Alternative polygon boolean backend. | MIT; compare against `polygon-clipping`. |
| `earcut` | candidate | Triangulate panels for preview. | ISC; fast render triangulation, not validation proof. |
| `svg-pathdata` / `svgson` | candidate | SVG path/SVG AST parse and stringify for round trips. | Useful fixture tooling; keep `PatternGraph` as truth. |
| Clipper2 | candidate | Polygon offsetting, clipping, triangulation. | Strong candidate for seam allowance/cut-line offsets after curve flattening. |
| Clipper2-WASM | candidate | Browser/WASM path to Clipper2. | Needs license and maintenance audit. |
| `kurbo` | later candidate | Rust curve math and path operations. | Future WASM kernel candidate. |
| `lyon` | later candidate | Rust tessellation/path pipeline. | Useful if preview geometry moves to WASM. |
| `usvg` / `resvg` | later candidate | SVG normalization and rendering verification. | Good external verifier for SVG import/export sanity. |
| Graphite crates | unknown | Vector editor architecture and possible Rust geometry. | Needs source audit before relying on it. |
| Custom `GeometryKernel` API | build | Stable boundary around geometry operations. | Must exist before swapping implementation libraries. |

## Sketch Vectorization

| Item | Status | Role | Notes |
| --- | --- | --- | --- |
| `@neplex/vectorizer` | candidate/build | First runnable raster-to-SVG bridge. | MIT; VTracer-backed Node package with direct Buffer input. Installed for Phase B smoke tests behind `RasterToVectorBridge`. |
| VTracer / `vtracer-wasm` | candidate | Browser/WASM raster-to-vector implementation. | MIT; likely browser runtime target once the ingest contract stabilizes. |
| `esm-potrace-wasm` | reference/isolated candidate | Black-line tracing comparison. | GPLv2; useful prior art and possible isolated experiment, but not default commercial-path dependency. |
| Poppler `pdftocairo` | build/tooling candidate | Best-effort vector PDF / PDF-compatible `.ai` conversion to SVG; raster PDF fallback to PNG. | Present locally via Homebrew; useful for Phase B smoke path. Product runtime still needs a portable browser/server story. |
| macOS `sips` + `cwebp` | tooling | Generated JPG/WEBP smoke fixtures. | Local test fixture generation only; not product runtime dependencies. |
| SVG passthrough | build | Highest-trust sketch input lane. | Implemented for `.svg`; vector PDF and `.ai` currently convert through Poppler to SVG. |

## Export And Interop

| Item | Status | Role | Notes |
| --- | --- | --- | --- |
| Human-readable SVG | build/candidate | First editable/printable pattern export. | Need semantic profile, labels, instructions, and round-trip fixtures. |
| PDF/tiled output | build | Printable human package. | Can use browser print/HTML or SVG-to-PDF tooling later. |
| Cut sheet and assembly instructions | build | Human-readable making package. | V1 priority; a person should understand what to cut and sew. |
| DXF/AAMA/ASTM | reference/later | Industrial exchange and machine-readable production. | Not v1 priority; needs semantic mapping after human-readable package works. |
| Machine cutter-ready files | later | Fabric cutting machine lane. | Explicitly out of prototype 1 scope. |
| ASTM D6673 | reference | Industrial apparel DXF layer semantics. | Use as layer/block target for later DXF profile. |
| Patro ASTM DXF notes | reference | Practical ASTM layer map. | Useful for piece boundary, notches, grain, internal lines, sew lines, annotations. |
| CLO DXF import/export | reference | Commercial import/export behavior. | CLO supports AAMA/ASTM DXF workflows; test after semantic SVG works. |
| Inkscape/Illustrator | reference | External edit compatibility. | Need round-trip tests for layer/metadata preservation. |
| Seamly2D export/import | reference/later | Pattern CAD interop. | Needs file compatibility matrix. |
| `ezdxf` | later candidate | DXF verifier/helper scripts. | MIT; good for inspection even if product is browser-first. |

## Marker And Fabric Layout

| Item | Status | Role | Notes |
| --- | --- | --- | --- |
| Simple deterministic marker planner | build | Prototype fabric layout. | Place pieces by width, grain, spacing, fold, and cut counts. |
| libnest2d | candidate/reference | Optimized irregular nesting. | C++ library; useful behind future WASM/native worker. |
| Deepnest/SVGnest lineage | reference | SVG/DXF nesting workflow. | Good inspiration; not garment-aware by default. |

## 3D Preview And Editing

| Item | Status | Role | Notes |
| --- | --- | --- | --- |
| Three.js | candidate | Browser live model preview. | Primary runtime candidate. |
| Blender Python | reference/candidate | Headless preview/projection benchmark. | Useful for experiments, not ideal product runtime. |
| Substance 3D Painter | reference | Designer layer/projection/material mental model. | Proprietary; use as UX prior art only. |
| Fabric.js | possible candidate | Canvas/SVG annotation and editing surface. | Compare with SVG-native or Paper.js direct manipulation. |
| Graphite | reference/later candidate | Nondestructive vector/layer/node editor. | Study architecture; do not fork before first PatternGraph fixture. |
| Designer edit classification | build | Boundary between visual, semantic, material, and pattern edits. | Required for RR13. |

## Competitor Capability Pillars

| Item | Status | Role | Notes |
| --- | --- | --- | --- |
| Optitex 2D/3D CAD | reference | Capability map for 2D pattern, 3D validation, grading, marker, fabric simulation, tech-pack essentials. | Do not copy the full expert editor model; decompose into task-led services. |
| Optitex 3D for Illustrator | reference | Creative vector tool plus 3D garment validation bridge. | Strong proof that designers want creative-tool continuity; avoid inheriting Illustrator cleanup burden. |
| CLO | reference | Modern 3D garment simulation and 2D/3D workflow expectation. | Use as 3D preview/validation expectation, not v1 authoring model. |
| Browzwear VStitcher | reference | Enterprise virtual sampling, material/avatar libraries, grading, tech packs. | Library and workflow reference; photoreal rendering is not the moat. |
| Lifecycle PLM AI/Tech Pack Studio | reference | AI concept -> technical sketch -> tech pack category signal. | Good adjacency for generated sketch lane and later tech-pack bridge. |
| Lectra Modaris / Gerber AccuMark | reference/later | Industrial pattern/grading/marker/production semantics. | Later interop and export profiles after human-readable package is credible. |
| Illustrator Image Trace / path tools | reference | Raster-to-vector and manual path cleanup baseline. | Build semantic trace review, not a generic vector editor. |
| Airtable/Salesforce/Notion | reference/later | Role-specific views, permissions, workspace shell. | Future cloud/collab only; track provenance and owner now. |
| Shopify / Photoroom | reference/later | Launch commerce and imagery pipelines. | Kew/platform adjacency; keep out of v1 pattern workbench. |

## AI, Images, And Datasets

| Item | Status | Role | Notes |
| --- | --- | --- | --- |
| GPT Image 2 | candidate | Controlled sketch/technical-flat generation. | Use for corpus fixtures with provenance/review. |
| TripoSR | candidate | Legally clean image-to-3D baseline. | MIT; useful even if quality is not frontier. |
| SPAR3D | candidate | Image-to-3D mesh candidate. | First comparison against Hunyuan3D-2. |
| Hunyuan3D-2 | isolated candidate | Image-to-3D mesh candidate. | Strong but license restrictions make it evaluation-only for now. |
| TRELLIS / TRELLIS.2 | reference/candidate | Image-to-3D frontier comparisons. | MIT; track quality and hardware cost. |
| LACMA Pattern Project | candidate/reference | Pattern-truth examples. | Scaled patterns and instructions; needs license/use review. |
| GarmentCodeData | candidate | Paired synthetic patterns and 3D garments. | Strongest future ML/eval dataset lead. |
| 2021 3D Garments + Sewing Patterns dataset | candidate | Paired synthetic pattern/3D examples. | CC BY 4.0; large but strong eval seed. |
| Met Open Access | candidate | Lawful visual-only garment imagery. | Public-domain OA images/data; not pattern truth. |
| Smithsonian Open Access | candidate | Lawful visual-only garment/object imagery. | CC0 images/data; not pattern truth. |
| Atacac Sharewear | candidate/reference | Real modern files including PDF/DXF/CLO in some examples. | CC BY-SA; useful with share-alike caveat. |
| CoPA | reference | Commercial pattern taxonomy and images. | Not full pattern truth by default. |
| GarmageSet | unknown | Professional garment pattern/drape dataset. | Promising, but license needs verification. |
| SewFormer/SewFactory | reference/candidate | Single-image-to-pattern research baseline. | Verify dataset/model license before reuse. |

## First Prototype Dependency Recommendation

Start with:

- TypeScript/browser runtime.
- Three.js preview.
- `@flatten-js/core` for first geometry backend.
- `polygon-clipping` or `martinez-polygon-clipping` for polygon booleans.
- `earcut` for preview triangulation.
- `svg-pathdata` / `svgson` for SVG fixture tooling.
- FreeSewing, GarmentCode, OpenPattern, and GarmentCodeData as references and fixture sources.

Defer:

- libnest2d until marker fixtures exist.
- Clipper2-WASM until JS offsets fail against fixtures.
- DXF/AAMA/ASTM and machine-cutter output until the human-readable package is credible.
- Graphite fork or deep integration until v1 designer edits exist.
- Hunyuan3D-2 dependency until license isolation is designed.
