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
