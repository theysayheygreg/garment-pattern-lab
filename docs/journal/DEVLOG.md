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

Phase B vector document smoke path:

- Added best-effort vector PDF and PDF-compatible `.ai` ingest through Poppler `pdftocairo`, converting documents to SVG before using the same trace-layer classifier.
- Expanded `bridge.test.mjs` to generate synthetic fixtures for every raster recipe plus vector PDF and `.ai`.
- Remaining Phase B hardening is real-world fixture behavior, not contract wiring.

Phase B fixture hardening:

- Added `primitive-export-technical-flat.svg` to cover common SVG export primitives (`polygon`, `polyline`, `line`, `rect`) instead of only hand-authored `<path>` data.
- Updated the bridge to normalize those primitives into path-like trace records before layer classification.
- Added backend readiness assessment (`ready`, `review-needed`, `blocked`) for fixture work, including input support, path count, silhouette count, and unclassified-path checks.
- Added `npm run sketch:report` for local fixture summaries without turning backend readiness into a designer-facing error console.
- Added `hardware-detail-technical-flat.svg` and circle/ellipse normalization for rings, rivets, buttons, and similar garment details.

Phase B complete:

- Added JPG and WEBP smoke coverage by generating fixtures from the synthetic raster input with `sips` and `cwebp`.
- Added raster PDF fallback: when Poppler SVG conversion yields no vector paths, render the page to PNG and run the VTracer-backed raster bridge.
- Added malformed raster coverage so bad image files return a blocked trace-layer payload rather than throwing raw vectorizer errors.
- Marked Phase B complete in `V0.1-DESIGN.md`, `BUILD-PLAN.md`, and `PROJECT-STATE.json`; next implementation lane is Phase C semantic interpretation.

Phase C semantic interpretation start:

- Added `packages/sketch-intent/src/semantic-interpreter/interpreter.mjs`.
- Added `a-line-tunic-semantic-flat.svg`, a richer front-view fixture exposing neckline, shoulders, armholes, side seams, hem, center-front axis, and optional construction/detail guides.
- Added a heuristic A-line v0.1 interpreter over Phase B trace layers. It emits a `sketch-interpretation` package with stable semantic landmark IDs, source curve evidence, trace-space coordinate profile, confidence, assumptions, and ambiguity report.
- Kept Phase C honest about scale: physical scale is unknown and unit-bearing priors stay disabled until Phase D.
- Added `npm run check:semantic` and wired it into `npm run check`.

Phase C front/back hardening:

- Added `a-line-tunic-front-back-semantic-flat.svg`, a paired front/back fixture with explicit `data-gpl-view` metadata.
- Updated Phase B trace classification so one front panel or paired front/back panel silhouettes are trace-ready.
- Updated the interpreter so multi-panel traces produce separate `view.front` and `view.back` panel contexts, and back-only calls emit `hem_back`, `neckline_back`, and `center_back` instead of front slots.
- Added regression checks for paired panels, explicit back interpretation, and side-specific dart review.

Phase C symmetric-input hardening:

- Added `a-line-tunic-single-side-semantic-flat.svg`, a one-sided symmetric front fixture.
- Added axis-reflected candidate generation for shoulder, armhole, and side-seam curves. Reflected landmarks stay `assumed` and appear in the ambiguity report, preserving the product rule that mirrored intent is useful but not silently confirmed.
- Updated `SketchIntent` so paired-view interpretations carry per-view slot status and front/back neckline evidence rather than collapsing intent to the primary panel.

Phase D scale calibration start:

- Added `packages/sketch-intent/src/scale-calibration/calibrator.mjs`.
- Added `calibrateScale({ trace, interpretation, canonicalBody, override })`, which returns a wrapper around the Phase C interpretation with `scaleCalibration`, updated `coordinateProfile`, `landmarkSet.unitProfile`, and scaled panel bounds.
- Supported three v0.1 evidence modes: developer override, explicit trace reference, and low-confidence canonical fallback.
- Added `a-line-tunic-scale-reference-semantic-flat.svg`, `canonical-misses-8.json`, `npm run check:scale`, and `npm run scale:report`.

Phase E drafting adapter start:

- Added `packages/sketch-intent/src/drafting-adapter/drafting-request.mjs`.
- Added `buildDraftingRequest()`, which promotes calibrated interpretation into a scale-proven drafting request and refuses before generator handoff when scale or required semantic landmarks are missing.
- Preserved uncertainty: mirrored landmarks and low-confidence/default scale become request warnings and evidence assumptions, not silent drafting facts.

Sketch-driven v0.1 pipeline wiring:

- Added `--source-sketch` support to `garments/a-line-dress-tunic/src/generate.mjs`.
- The generator now runs sketch ingest, semantic interpretation, scale calibration, and drafting-request promotion before reusing the existing ugly pattern generator.
- Added dev artifacts for sketch-driven runs: `editable-trace-layer.json`, `sketch-interpretation.json`, `scale-calibration.json`, and `drafting-request.json`.
- Added `garments/a-line-dress-tunic/src/pipeline.test.mjs`, which proves an accepted sketch fixture drafts and a blocked semantic fixture refuses before output.

Phase G marker layout start:

- Added `packages/export-core/src/marker-layout/layout.mjs`.
- Added deterministic non-optimized 45 inch marker layout with sequential front/back panel placement, fixed gutter/margins, total fabric length metrics, and assumptions.
- Generator now writes `package/marker.svg` and `dev-artifacts/marker-plan.json`.
- Cut sheet now surfaces marker width/length and replaces the old "fabric layout not checked" note with a more precise non-optimized marker limitation.

Debug overlay start:

- Added `buildDebugOverlayHtml()` in `packages/export-core/src/package-builders.mjs`.
- Sketch-driven generator runs now write `dev-artifacts/debug-overlay.html`.
- The overlay renders trace curves with status styling and a side panel for trace readiness, interpretation status, drafting state, scale evidence, landmark confidence, curve IDs, and assumptions.
- Added `npm run check:debug-overlay` using the single-side mirrored fixture to keep assumed landmark visibility covered.

Package manifest start:

- Added `buildPackageManifest()` in `packages/export-core/src/package-builders.mjs`.
- Generator now writes `package/manifest.json`, listing user-facing package files, dev artifacts, marker summary, source provenance, assumptions, and explicitly missing v0.1 export items such as tiled PDF.
- Added `npm run check:package-manifest`.

Phase I static preview start:

- Added `packages/preview-3d/src/static-assembly-scene.mjs`.
- Replaced the previous hard-coded SVG preview body with a generated Three.js static assembly page sourced from PatternGraph scene data.
- Preview renders front/back panel meshes, a muted body proxy, and shoulder/side seam-pair guide lines. It remains explicitly non-simulated and read-only.
- Added `npm run check:preview-3d`.

Interpretation trace start:

- Added Phase J `interpretationTrace` score tables to the semantic interpreter output.
- Each slot now records selected candidate, selected source, status, confidence, scored candidates, rule scores, and filtered candidates.
- Sketch-driven generator runs write `dev-artifacts/interpretation-trace.json`; the package manifest lists it for sketch-pipeline outputs.

Readiness instrumentation extension:

- Extended `validation-core` readiness output with backend marker metrics: fabric width, estimated fabric length, marker warnings, and a marker readiness check.
- Added sketch-pipeline readiness instrumentation for sketch-driven runs, including drafting request state and scale status. This is intentionally engine-facing; it supports generator improvement without becoming a designer-facing error console.
- Added assumption count instrumentation so readiness reports summarize how much inferred design intent the package is carrying.
- Added per-stage timing for sketch-driven runs: ingest, interpretation, scale calibration, and drafting-request promotion. Timings are attached only to sketch-driven readiness instrumentation so the baseline generated fixture does not churn on every run.

Sketch-sourced demo package start:

- Added a deterministic `npm run v0.1:generate:sketch` command that emits `outputs/v0.1-from-sketch/` from the canonical A-line tunic semantic-flat fixture.
- Added `package/human-sanity-check.md` to generated packages so the review prompt travels beside the pattern, marker, assembly notes, preview, and manifest.
- Added `npm run check:package-completeness`, which checks the baseline package and sketch-sourced package for the reviewable human files and sketch dev artifacts.

Human cut package tightening:

- Expanded `cut-sheet.md` with print-scale instructions, body fixture measurements, finished draft measurements, fold handling, and finish choices for neckline/armholes.
- Kept the warning blunt: v0.1 is SVG-first, tiled home-print PDF is still missing, and the first make should be muslin.

Three.js preview browser smoke:

- Served the repo locally on port 8788 and opened `outputs/v0.1-from-sketch/package/preview.html` in the in-app browser.
- Verified the preview loaded with one Three.js canvas, embedded scene data, the expected heading, and no browser console errors.
- Captured a screenshot and checked it was nonblank: 1280x720, 75,018 non-background pixels, 49,924 colored pixels.

Imperial-first package and curve fidelity pass:

- Switched human package copy to imperial-first measurements while preserving metric values as secondary/internal references.
- Added `package/overview.md` as the package front door so preview, pattern SVG, measurements, cut notes, assembly notes, and sanity check are no longer scattered without an entry point.
- Replaced the blocky v0.1 panel outline anchors with sampled neckline, armhole, and side-seam curves so generated pattern flats and the Three.js preview read less like low-resolution polygon placeholders.
