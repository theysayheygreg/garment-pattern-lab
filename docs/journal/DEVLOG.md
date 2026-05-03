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

Output strategy:

- Split outputs into two lanes. V1 is the human-readable sewing-pattern package: SVG/PDF/print package, cut sheet, assembly instructions, validation report, and PatternGraph JSON.
- Machine-readable cutter/CAD output remains later: DXF/AAMA/ASTM, cutter-ready marker files, industrial CAD round-trip, and factory production metadata.

Architecture overview:

- Added `docs/project/ARCHITECTURE-OVERVIEW.md` as the high-level design document for the current pipeline, tool stack, output lanes, validation philosophy, designer editing lane, and corpus strategy.
- Updated the README so the remote repo front door now explains `PatternGraph` as manufacturing truth, the v1 human-readable package, and the current browser/geometry/preview tool direction.
- Added a maintenance rule: `ARCHITECTURE-OVERVIEW.md` stays current and product-facing, durable narrowed choices go in `DECISION-LOG.md`, and explored/deferred paths go in `THINGS-TRIED.md`.

CAD drawing analogy:

- Added `docs/research/cad-to-technical-drawings-2026-05-03.md` after a reference pass on CAD-to-technical-drawing workflows.
- The useful borrow is a sheet/package-composition layer, not CAM: generated views, useful dimensions, labels, page templates, pattern info blocks, scale proof, style profiles, and print-readiness checks.
- Separated the reference analogy from the product voice. The live architecture now uses sewing-native concepts: `PatternPackageModel`, `PatternPackageComposer`, and `SewingPatternSheetProfile`, downstream of `PatternGraph` and upstream of human-readable SVG/PDF.

Pattern standards pass:

- Added `docs/reference/PATTERN-STANDARDS-AND-CONVENTIONS.md`.
- Current read: there is no single universal ASME-like standard for human-readable sewing pattern sheets.
- Product direction: define our own small `SewingPatternSheetProfile` from common pattern conventions, while tracking formal standards separately for measurements, construction metadata, and later DXF/ASTM exchange.
- Clarified the user reality: most designers, indie studios, small shops, and even capable sample rooms should not need to see ASTM/ISO/AAMA language in v1. Those standards stay backstage unless the user is doing advanced export/interoperability work.
- Reframed industry-standard output as an explicit later export option, parallel to machine-readable cutter/CAD output. It should not shape the v1 designer-facing package.

First garment reference population:

- Added `docs/reference/FIRST-GARMENT-VISUAL-REFERENCE-CORPUS.md` for sketches/designs: technical flats, croquis/on-body references, open museum visuals, and project-generated sketch fixture plans.
- Added `docs/reference/PATTERN-REFERENCE-CORPUS.md` for real patterns: Atacac, FreeSewing, Peppermint, Fabrics-Store, Mood, LACMA, Adelica, Oliver + S, Sew Different, SewGuide, and Lekala leads with license/truth-level caveats.
- Strongest direction: author our own first `PatternGraph` fixture, use FreeSewing and Atacac as license-reviewable pattern-truth candidates, and treat most free commercial/blog PDFs as pattern-reference rather than reusable geometry.
- Added the exemplar-plus-variation-set testing rule: choose one primary reference for the first end-to-end run, then compare against 5-10 same-family references so validation learns the normal range instead of one pattern's quirks.
- Clarified rights policy: public patterns on the web are probably copyrighted and still useful as reference-only evaluation material. GPT Image 2/project-owned sketches should drive original trials; reference patterns verify the output without becoming copied geometry or training fixtures.

Input lane clarification:

- Split sketch inputs into two explicit lanes: GPT Image 2 generated fixtures and human-authored drawings/vectors/uploads.
- Added `INPUT-LANES.md` with prompt-recipe expectations, upload/local-folder ingestion shape, shared output contract, provenance/privacy notes, and quality gates.
- Updated architecture, corpus, examples, and knowledge graph docs so both lanes converge into `InputProvenance`, `LandmarkSet`, `SketchIntent`, and `AmbiguityReport`.

Product design pass:

- Added `PRODUCT-DESIGN.md` to name the product as a sketch-to-pattern workbench for fashion designers rather than an AI pipeline.
- Captured the user promise: start with a garment idea, end with a reviewable first-draft pattern a person can inspect, adjust, print, and sew as a sample.
- Updated the README, product plan, architecture overview, and decision log around that north-star statement.

Kew adjacent reference:

- Added `KEW-COMPETITOR-SHORTLIST.md` from Kiko's related apparel-platform exploration.
- Kept Kew and Garment Pattern Lab distinct: Kew is broader platform/product-market context; Garment Pattern Lab remains the narrower sketch-to-pattern workbench.
- Linked the shortlist beside the product design doc as competitive, interoperability, and possible future-unification context.

Kew competitor deep dive:

- Added `KEW-COMPETITOR-DEEP-DIVE.md`, ingesting every item from the Kew shortlist into capability pillars, interaction-model lessons, and follow-up research.
- Optitex now has explicit treatment as the closest eventual capability map: 2D drafting, 3D validation, grading, fabric simulation, marker making, print placement, tech-pack essentials, and interop.
- Recorded the product stance that Optitex-style pillars should become narrow validated services, not a clone of full Illustrator/Substance/CAD mouse-and-keyboard editing.

Product differentiator hardening:

- Promoted the central differentiator into the README, product design brief, architecture overview, decision log, knowledge graph, and project state.
- The product should not become another mouse-and-keyboard CAD/3D editor. It should be human-centered, natural-language-led, task-led, narrow, validated, and as close to art -> garment as the craft allows.
