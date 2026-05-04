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

Kew sample image analysis:

- Added `KEW-SAMPLE-IMAGE-ANALYSIS.md` for Kiko's screenshot showing reference photo, croquis grid, body landmarks, technical sketch, and design callouts in one project canvas.
- Captured the useful Pattern Lab lesson: learn from the information architecture and semantic callouts, but do not turn v1 into a broad freeform board product.
- Added the follow-on nuance: the screenshot lacks a 3D render, and vector-editable/layered source tooling is useful soon as an interpretation bridge, not as a full Illustrator clone.

Next design phase:

- Added `PRODUCT-PILLARS.md` with six high-level product pillars: natural intent, PatternGraph as craft contract, trace/layers as bridge, validation before beauty, 3D as feedback, and narrow validated services.
- Added `PROTOTYPE-BUILD-ORDER.md` with a concrete B0-B10 build sequence from scaffold and seed fixtures through validation, generation, export, 3D preview, sketch landmarks, assistant edits, semantic trace layers, and human review.
- Scaffolded the product-engine folder split: `app/`, reusable `packages/`, and first-garment `garments/a-line-dress-tunic/`.
- Expanded the roadmap with package ownership, first-garment fixture paths, pipeline areas, and a more granular validation-first build order.

Onshape reference pass:

- Added `ONSHAPE-DEEP-DIVE.md` as a CAD/PDM/PLM/collaboration analog, not a v1 prototype requirement.
- Captured Onshape lessons around simultaneous editing, comments, Follow Mode, integrated PDM, versions/branches/releases, Arena PLM connection, MBD/PMI, and Render Studio.
- Product implication: Pattern Lab should eventually make the structured garment/pattern object the live source of truth for collaboration, lifecycle records, manufacturing annotations, and previews. V1 still only needs revision/provenance hooks.

Product design tightening:

- Added the ideal outcome: being a good clothing designer should not mean you have to be an expert at CAD.

Orrery design review:

- Added `docs/research/orrery-design-review-2026-05-03.md` as a structural review artifact before implementation.
- Captured two aligned decisions in the decision log: candidate promotion should be a validation state machine, and implementation should begin with an ugly end-to-end v0.1 spike before hardening layers.
- Left the rest of the review as reference guidance rather than immediate action, per Greg's note.

Validation interaction refinement:

- Clarified that validation should mostly be backend instrumentation for interpolation quality and package readiness, not a traditional IDE/game-engine/3D-tool console of errors and warnings.
- Replaced repair-framed product language with refinement, readiness, interpretation, safe normalization, and designer-facing choices when intent is ambiguous.

Orrery response and v0.1 setup:

- Added `docs/research/codex-orrery-response-2026-05-03.md` with Codex's opinionated response to all 18 Orrery review findings.
- Added `docs/project/V0.1-SPIKE-PLAN.md` as the immediate build plan: one garment, one measurement set, one ugly generator, one SVG package, one static preview, one readiness report, one human sanity check.
- Updated roadmap/build plan/prototype build order so the dirty spike comes before polishing the clean B0-B10 architecture.

V0.1 dirty spike:

- Added a dependency-free Node generator at `garments/a-line-dress-tunic/src/generate.mjs`.
- Added synthetic body and garment-parameter fixtures for one sleeveless A-line woven dress/tunic.
- Generated the first rough `PatternGraphCandidate`, readiness JSON/MD, SVG pattern sheet, cut sheet, assembly notes, source pattern JSON, and static preview HTML under `garments/a-line-dress-tunic/outputs/v0.1/`.
- Added `docs/research/v0.1-human-sanity-check.md` as the next human review checkpoint.

Reusable engine extraction:

- Moved measurement helpers into `packages/pattern-core/src/measurements.mjs`.
- Moved readiness instrumentation into `packages/validation-core/src/readiness.mjs`.
- Moved SVG/Markdown/preview builders into `packages/export-core/src/package-builders.mjs`.
- Added `packages/validation-core/src/readiness.test.mjs` and expanded `npm run check` so the dirty spike now has a small package-level guardrail.

Task-led edit spike:

- Added `packages/assistant-core/src/commands.mjs` for narrow natural-language-to-parameter edits.
- Added `npm run dev:edit:lengthen-hem`, which runs `lengthen hem 100mm` and writes a second generated package to `garments/a-line-dress-tunic/outputs/v0.1-length-plus-100/`.
- The edited output includes `dev-artifacts/edit-intent.json` and `dev-artifacts/edit-summary.md` so the command interpretation is visible and reviewable.
- Expanded `npm run check` to verify both the base package and the task-led edit path.
- Reclassified this as a dev/v0.5 seed after the v0.1 design lock; the v0.1 acceptance path is one-shot and has no editing surface.

Static app workbench:

- Added `app/src/build-workbench.mjs`.
- Added `npm run app:build`, which writes `app/dev-artifacts/dev-comparison.html`.
- The workbench compares the base v0.1 pattern with the lengthened-hem variant, embeds both SVG pattern sheets, shows measured length/seam/readiness fields, and links to the generated previews and edit summary.
- Smoke checked via local `python3 -m http.server 8787` on `[::1]`; the workbench HTML and both linked pattern SVGs returned successfully.

Phase A foundation cleanup:

- Split generated output directories into `package/` for sewing-facing artifacts and `dev-artifacts/` for readiness, source graph, and edit provenance.
- Removed the old root-level generated files from `outputs/v0.1/` and `outputs/v0.1-length-plus-100/`.
- Moved the internal comparison page from `app/dist/workbench.html` to `app/dev-artifacts/dev-comparison.html`.

Phase B vector ingest start:

- Added `packages/sketch-intent/src/raster-to-vector/recipes.mjs` for recipe definitions.
- Added `packages/sketch-intent/src/raster-to-vector/bridge.mjs` with SVG passthrough, provenance hashing, recipe selection, and deterministic trace-layer buckets.
- Added `packages/sketch-intent/fixtures/clean-technical-flat.svg` and `bridge.test.mjs`.
- Wired `npm run check:sketch` into `npm run check`.

Phase B raster smoke path:

- Installed `@neplex/vectorizer` as the first runnable VTracer-backed raster-to-SVG bridge.
- Updated `RasterToVectorBridge` so `.png`, `.jpg`, and `.webp` inputs produce the same editable trace layer contract as SVG passthrough.
- Added a generated synthetic PNG smoke fixture to prove raster tracing yields structured path layers.
- Kept Potrace as research/possible isolated comparison because of GPLv2; the default prototype path is MIT VTracer-backed.
