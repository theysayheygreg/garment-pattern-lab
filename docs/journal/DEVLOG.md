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
