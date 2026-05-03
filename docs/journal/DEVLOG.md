# Devlog

## 2026-05-03

Project seed created from Greg's sketch-to-pattern idea.

Initial direction:

- Build toward a single-garment prototype.
- Treat UV unwrapping as a geometry helper, not the product core.
- Use a pattern grammar as the central representation.
- Start with sleeveless A-line woven dress/tunic.
- Preserve references and open research questions in project docs.

Later update:

- Ingested `Computational Pattern Making from 3D Garment Models` into the product knowledge graph.
- Added paper-specific concepts: sewing-aware patch layout, anisotropic textile parameterization, seam/dart reflection symmetry, grain alignment, panel complexity, and future mesh-to-pattern branch.

Reference expansion:

- Ingested the rest of the first bibliography at the same product-graph depth: fundamentals, commercial CAD, open pattern tools, UV workflows, and the remaining research papers.
- The strongest architectural result is now clearer: `PatternGraph` remains manufacturing truth; GarmentCode-style `PatternProgram` is a likely authoring layer; UV islands and 3D meshes are candidate geometry; raster pattern encodings and diffusion/ML models are future generation helpers.

Tooling setup:

- Pulled Graphite and Blender source checkouts under ignored `external/`.
- Installed Rust/Cargo, wasm-pack, cargo-watch, and Blender 5.1.1.
- Added a project note that positions Graphite as the 2D/vector annotation workbench and Blender as the scriptable 3D/render/diagnostic workbench.

Browser-native lane:

- Added the first owned-runtime plan: Three.js for the product 3D viewport, TypeScript for the earliest app loop, WASM for deterministic geometry kernels, and WebGPU as optional acceleration.
- Kept the same architectural boundary: `PatternGraph` remains the source of truth; 3D mesh and flats are views/exports generated from it.

AI exploration lane:

- Added three visual-generation research lanes: GPT Image 2 controlled sketch creation, modern image-to-3D candidate geometry, and a visual-corpus truth/evaluation bridge.
- The practical next step is a small reviewed sketch corpus, not blind automation: generated technical flats should become labeled `SketchIntent` fixtures before being allowed near pattern generation.
- Corrected the third lane to focus on actual pattern-reference images by garment family, so output can be measured against known panel families, construction features, and suspicious omissions.

Interop layer:

- Added the missing bridge between research candidates and export files: `PatternGraphCandidate` must be normalized, measured, corrected, validated, gated, exported, and round-trip checked before it can become a user-facing pattern.
- Added two important production primitives to that bridge: canonical millimeter units with scale proof, and marker planning against usable fabric roll width with grain/fold/nap constraints.

Deep-dive research pass:

- Added `docs/research/deep-dive-synthesis-2026-05-03.md` as the first consolidated deep research synthesis after the initial reference ingest.
- Strengthened the knowledge graph with browser kernel nodes, marker/nesting nodes, visual-corpus truth nodes, image-to-3D candidate nodes, and semantic export fixtures.
- The strongest product decision stayed consistent: generated geometry is welcome, but only a proven `PatternGraph` can be exported as a pattern.
- The next build-facing work is now clearer: write the `PatternGraph` schema, browser `GeometryKernel` contract, SVG semantic profile, simple marker planner, and small visual corpus schema.

Roadmap refinement:

- Promoted the twelve remaining research areas into a formal `Research Roadmap To Prototype 1`.
- The roadmap now explicitly sequences the work: drafting formulas, schema, and validation first; geometry/SVG/marker next; Graphite, Blender, visual corpus, GPT Image 2, image-to-3D, and commercial interop as parallel expansion tracks.

Designer editing lane:

- Added a missing clothing-designer workbench lane: edit the original sketch or vector interpretation and see it represented on the garment model.
- The lane borrows from Blender texture paint and Substance-style projection/material workflows, but keeps a hard classification boundary between visual-only edits, semantic intent, material preview, pattern candidates, and final pattern revisions.
- Refined the first version to avoid a too-large editor build: v1 should support direct garment-feature edits such as shoulder opening, armhole, neckline, hem length, hem sweep, and side silhouette, then map each gesture to explicit `GarmentParameters`.
- The larger Graphite-like layer editor remains valuable later for fabrics, stitches, trims, prints, appliques, annotations, masks, and material regions.

Research roadmap execution:

- Started working through the thirteen research roadmap lanes with a dependency and example-needs pass.
- Added a dependency register that separates reuse candidates, reference-only prior art, build-ourselves components, and risky/deferred dependencies.
- Added an example-needs register that names the starter corpus, validation fixtures, SVG round-trip fixtures, geometry torture fixtures, marker cases, commercial interop samples, and designer-edit examples.
- The strongest implementation path is now: build `PatternGraph` and validation in-house; prototype geometry with TypeScript libraries; use Three.js for preview; use semantic SVG before DXF; keep optimized nesting, image-to-3D, Graphite-like editing, and commercial interop as measured follow-on lanes.
