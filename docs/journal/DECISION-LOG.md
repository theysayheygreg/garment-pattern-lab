# Decision Log

> What we considered, what we chose, what remains open.

## 2026-05-03: Prototype starts with one garment type

**Question:** Should the first prototype attempt arbitrary garment generation or one constrained garment?

**Options considered:**

- Any sketch to any garment.
- Start with a simple skirt.
- Start with a T-shirt.
- Start with a sleeveless A-line woven dress/tunic.

**Where it landed:** Start with a sleeveless A-line woven dress/tunic.

**Why:** It proves the meaningful pipeline while avoiding the worst first-pass complexity: sleeves, collars, plackets, multi-layer construction, and knit stretch. It still exercises pattern fundamentals: body measurements, ease, shoulder/side seams, armholes, neckline, hem sweep, grainline, notches, and cut instructions.

**Door status:** Closed for prototype 1. Open after prototype review.

## 2026-05-03: Pattern grammar is the source of truth

**Question:** Should the system generate a 3D mesh first and UV unwrap it into pattern pieces?

**Options considered:**

- Generate 3D mesh first, then flatten/UV unwrap.
- Generate 2D pattern first, then simulate.
- Hybrid: infer semantic topology, generate pattern, use 3D preview to validate and refine.

**Where it landed:** Hybrid, with pattern grammar as the source of truth.

**Why:** UV unwrap produces 2D islands, not necessarily sewable panels. Sewing patterns need semantic seams, ease, darts, grainline, notches, seam allowance, cut labels, and construction logic. 3D validation matters, but it should test the pattern rather than invent the pattern alone.

**Door status:** Closed as architecture principle. Open for which exact representation to use.

## 2026-05-03: Manual landmarking is acceptable before automation

**Question:** Does prototype 1 need fully automatic sketch parsing?

**Options considered:**

- Full auto sketch-to-pattern immediately.
- Manual measurement-only pattern generator.
- Semi-automatic sketch workflow with manual landmark fallback.

**Where it landed:** Semi-automatic path, with manual landmarking acceptable in the first prototype.

**Why:** The project must prove the output grammar before betting on ambiguous visual inference. Manual landmarking still tests the sketch-to-parameter bridge and gives useful training/evaluation data for later automation.

**Door status:** Open. Replace pieces with automation only after the generated pattern is credible.

## 2026-05-03: Paper ingest adds validation requirements, not a new prototype route

**Question:** Should `Computational Pattern Making from 3D Garment Models` change prototype 1 from pattern-grammar-first to 3D-mesh-first?

**Options considered:**

- Switch prototype 1 to mesh-first and attempt sewing-aware flattening.
- Keep prototype 1 pattern-grammar-first and use the paper as validation/schema guidance.
- Split immediately into two prototype branches.

**Where it landed:** Keep prototype 1 pattern-grammar-first. Use the paper to deepen the schema, validation model, and future mesh-to-pattern research branch.

**Why:** The paper assumes a 3D garment mesh already exists. Greg's original product idea starts from a sketch and needs a first credible export path. The paper is extremely valuable, but mostly because it names the sewing-aware constraints that normal UV workflows miss: seam reflection symmetry, darts, grain alignment, anisotropic textile deformation, patch complexity, and multi-pose seam placement.

**Door status:** Closed for prototype 1. Open as a future research branch after the pattern graph and validation/export stack exist.

## 2026-05-03: Browser geometry gets a kernel boundary before stack commitment

**Question:** Should the ownable browser lane immediately commit to TypeScript, Rust/WASM, C++/Emscripten, or WebGPU for geometry?

**Options considered:**

- Write all geometry directly in TypeScript.
- Start with Rust/WASM or C++/Emscripten from day one.
- Depend on WebGPU compute for hard geometry and simulation tasks.
- Define a `GeometryKernel` contract first and allow implementation tiers.

**Where it landed:** Define `PatternKernel` and `GeometryKernel` contracts first. Start with TypeScript/web-worker implementations where possible, and move offset/intersection/triangulation/nesting kernels to WASM only when the interface and fixtures prove what is needed.

**Why:** The prototype needs deterministic pattern output more than it needs clever runtime technology. Three.js can cover the viewport, WebGPU can accelerate later, and mature native geometry libraries can still be pulled through WASM behind the same API.

**Door status:** Closed as architecture principle. Open for exact kernel implementation.

## 2026-05-03: Visual references require truth and license levels

**Question:** Can generated sketches, pattern reference images, and dataset examples all go into one loose corpus?

**Options considered:**

- Store every useful image together with informal notes.
- Split generated sketches from real pattern images only.
- Give every corpus item a `TruthLevel` and `LicenseProfile`.

**Where it landed:** Every visual corpus item needs `TruthLevel` and `LicenseProfile`.

**Why:** A fashion sketch, a catalog envelope, a scaled pattern PDF, and a round-tripped `PatternGraph` fixture are not equally true. The product needs to know which references can inform prompts, which can validate construction, which can train models, and which can be displayed.

**Door status:** Closed for corpus schema. Open for exact licensing review per source.

## 2026-05-03: Prototype output is human-readable first

**Question:** Should prototype 1 target human-readable sewing-pattern packages or industry-standard / machine-readable cutter/CAD output?

**Options considered:**

- Treat SVG/PDF/DXF/cutter outputs as one export surface.
- Prioritize industry-standard / machine-readable production files early.
- Split outputs into human-readable v1 and industry-standard / machine-readable exports later.

**Where it landed:** Split the lanes. V1 is a human-readable pattern package a person can print, cut, review, and sew from. Industry-standard / machine-readable cutter/CAD files are later output options.

**Why:** The first product proof is whether a human can understand and evaluate the generated pattern. Industrial cutter files need stricter format semantics, hardware assumptions, cutting clearances, and CAD round-trip proof. That is valuable, but it should not distract from making the first human-readable pattern credible.

**Door status:** Closed for prototype 1. Open for later industrial output roadmap.

## 2026-05-03: Architecture overview tracks current direction

**Question:** How should the project preserve older architectural alternatives while narrowing into a real product direction?

**Options considered:**

- Keep appending every explored branch to the architecture overview.
- Overwrite old material and lose research history.
- Keep the architecture overview current, move old/deferred options into an architecture history, and record durable choices in the decision log.

**Where it landed:** Keep [Architecture Overview](../project/ARCHITECTURE-OVERVIEW.md) as the current product-facing design. Preserve explored, rejected, or deferred paths in [Things Tried / Architecture History](THINGS-TRIED.md). Use this decision log for durable narrowed choices.

**Why:** The README and architecture overview need to stay readable for future builders and remote visitors. The research trail still matters because deferred lanes can become later product branches, fixtures, or validation checks.

**Door status:** Closed as documentation practice. Open to splitting the history file if the archive grows large.

## 2026-05-03: Human-readable output needs a sewing-pattern package layer

**Question:** Should prototype 1 treat SVG/PDF export as raw pattern geometry, a CAD-like technical drawing, or a sewing-native pattern package?

**Options considered:**

- Export panel paths directly and rely on users to interpret them.
- Generate a full industrial CAD package immediately.
- Add a lightweight `PatternPackageModel` and `PatternPackageComposer` between `PatternGraph` and human-readable SVG/PDF, with CAD drawing systems kept as reference inspiration only.

**Where it landed:** Add `PatternPackageModel`, `PatternPackageComposer`, and `SewingPatternSheetProfile` downstream of `PatternGraph`.

**Why:** The fashion-designer and sewer-facing output needs pattern sheets, useful measurements, labels, line styles, pattern information, scale proof, tiling, validation notes, and readable page layout. CAD-to-technical-drawing workflows are a helpful analog for document generation, but the product should not feel like mechanical CAD.

**Door status:** Closed as v1 architecture direction. Open for exact sheet schema and visual conventions.

## 2026-05-03: First prototype uses one exemplar plus a variation set

**Question:** Should the first garment pipeline validate against one real pattern reference or many same-family examples?

**Options considered:**

- Validate against one chosen reference only.
- Collect many examples before building anything.
- Run one primary exemplar end to end, then compare against a 5-10 item same-family variation set.

**Where it landed:** Use one primary exemplar for the first full pipeline, plus a variation set of roughly 5-10 sleeveless A-line woven dress/tunic references.

**Why:** One exemplar keeps the prototype concrete. The variation set keeps validation from overfitting one designer's construction choices. Every design is slightly different, so family-level checks should learn ranges and variants: closure, darts, length, hem sweep, armhole shape, finishing, fold/split construction, and seam allowance conventions.

**Door status:** Closed for prototype methodology. Open for which exact exemplar becomes the first run.

## 2026-05-03: Copyrighted public patterns are reference-only

**Question:** How should the project use publicly available sewing patterns that are almost certainly copyrighted by their designers?

**Options considered:**

- Avoid copyrighted public patterns entirely.
- Treat them as reusable pattern geometry.
- Use them as reference-only evaluation material while keeping pipeline inputs and fixtures project-owned or explicitly licensed.

**Where it landed:** Public/copyrighted patterns can be used as `pattern-reference` for manual review, validation expectations, and output comparison. They must not be copied into fixtures, traced as geometry, redistributed, or used as training data without explicit permission.

**Why:** The product needs to know what real patterns look like, but the original examples should come from project-owned GPT Image 2 sketches, project-authored `PatternGraph` fixtures, or explicitly licensed/generated pattern sources. Reference patterns judge correctness after the fact.

**Door status:** Closed as corpus policy. Open for explicit per-source permissions later.

## 2026-05-03: Sketch input splits into generated and human-authored lanes

**Question:** Should generated GPT Image 2 sketches and human designer drawings use one input lane or two?

**Options considered:**

- Treat all images as generic sketch inputs.
- Split generated and human-authored inputs into separate upstream lanes that normalize into the same downstream contract.
- Focus only on generated examples until the pattern pipeline works.

**Where it landed:** Split the upstream lanes. GPT Image 2 generated sketches are controlled project-owned fixtures driven by prompt recipes and review metadata. Human-authored drawings, vectors, scans, and uploads are product-shaped inputs driven by preprocessing, tracing, landmarking, privacy/consent state, and ambiguity review.

**Why:** The generated lane is how the project makes repeatable examples and tunes design-language consistency. The human lane is the actual designer workflow and needs better ingestion UX, error handling, and review surfaces. Both should still converge into `InputProvenance`, `LandmarkSet`, `SketchIntent`, and `AmbiguityReport` before drafting.

**Door status:** Closed as architecture direction. Open for exact folder schema, upload UX, and prompt-recipe schema.

## 2026-05-03: Product is a sketch-to-pattern workbench

**Question:** What is the product statement beyond "a cool AI pipeline"?

**Options considered:**

- AI garment-pattern generator.
- Sketch-to-3D-to-pattern automation pipeline.
- Sketch-to-pattern workbench for fashion designers.

**Where it landed:** Position Garment Pattern Lab as a sketch-to-pattern workbench for fashion designers.

**Why:** The value is not the pipeline itself. The value is helping designers turn a sketch into a reviewable first-draft sewing pattern with visible assumptions, editable parameters, validation, and human-readable output. This keeps AI, 3D preview, and geometry kernels in service of the craft instead of becoming the product identity.

**Door status:** Closed as north-star positioning. Open for naming/brand language later.

## 2026-05-03: Do not become another CAD editor

**Question:** What is the real differentiator after the Kew/Optitex competitor pass?

**Options considered:**

- Build another expert 2D/3D apparel CAD editor.
- Clone an Illustrator/Substance-style mouse-and-keyboard editing surface for apparel.
- Make apparel CAD pillars task-led, narrow, validated, and conversational/assistive.

**Where it landed:** Garment Pattern Lab should be human-centered and natural-language-led, as close to art -> garment as the craft allows. Existing systems prove the capability pillars, but the interaction model should be different.

**Why:** Optitex, CLO, Browzwear, Lectra, Gerber, Illustrator, and Substance-style tools ask users to become expert operators in dense 2D/3D editors. The product opportunity is to preserve the craft while reducing the operation burden: let users state intent, confirm semantics, review warnings, and export validated pattern packages without hand-authoring every CAD object.

**Door status:** Closed as product differentiator. Open for exact interaction design and prototype UI.

## 2026-05-03: Product engine and garment programs are separate

**Question:** Should first-garment work live inside the app/prototype folders, or should the reusable product engine be separated from garment-specific programs?

**Options considered:**

- Keep everything under one prototype folder until code exists.
- Put all garment rules inside app code.
- Separate reusable app/packages from garment programs, fixtures, references, and outputs.

**Where it landed:** Use `app/` for the product shell, `packages/` for reusable core modules, and `garments/a-line-dress-tunic/` for the first garment program and evidence.

**Why:** The A-line tunic is the first proof garment, not the product architecture. If drafting formulas, fixtures, and generated packages are isolated by garment, future garments can reuse `PatternGraph`, geometry, validation, export, preview, and assistant services without inheriting first-garment assumptions.

**Door status:** Closed as repo structure. Open for exact package implementation details.

## 2026-05-03: Validation-first build order

**Question:** Should the first prototype build the UI/3D experience first, or build the pattern document and validation spine first?

**Options considered:**

- Build a visual sketch-to-3D demo first.
- Build the app shell first.
- Hand-author `PatternGraph` fixtures, implement validation, then generate/export/preview.

**Where it landed:** Build `PatternGraph` seed fixtures and validation harness before garment generation, 3D preview, and assistant-led editing.

**Why:** A beautiful preview can make weak pattern geometry feel more trustworthy than it is. The prototype should first prove that it can represent, check, and export sewing-aware pattern data. 3D and natural language then become feedback and control layers over a validated craft contract.

**Door status:** Closed for prototype 1 build sequence. Open for exact implementation stack after geometry spikes.

## 2026-05-03: Onshape informs future product records, not v1 scope

**Question:** Should Onshape-style multi-user CAD/PDM/PLM/MBD/rendering change the first prototype?

**Options considered:**

- Expand v1 toward collaborative PDM/PLM immediately.
- Ignore Onshape because it is mechanical CAD, not apparel design.
- Capture Onshape as a future reference architecture while keeping v1 focused on one validated human-readable pattern package.

**Where it landed:** Onshape belongs in the reference lane. It informs future Pattern Lab workspaces, revision history, release packages, review comments, PDM/PLM bridges, sewing-PMI/MBD analogs, and version-bound renders. It does not expand prototype 1.

**Why:** The useful lesson is that the structured product object can be the live source of truth for collaboration, data management, manufacturing information, and communication views. Pattern Lab should eventually do that for garments through `PatternGraph` and pattern/product records, but the first proof still has to generate and validate one credible sewing pattern.

**Door status:** Closed for v1 scope. Open for future collaboration/PDM/PLM roadmap.

## 2026-05-03: Candidate promotion gate is a state machine

**Question:** Should validation be a flat checklist or a promotion state machine?

**Options considered:**

- Treat every validation finding as a checklist item.
- Let each export target decide ad hoc whether a finding blocks export.
- Model candidate promotion as a small state machine with severities and policy.

**Where it landed:** Candidate promotion should be a state machine. Checks produce severities such as hard error, soft error, warning, and assumption. Promotion policy decides whether a `PatternGraphCandidate` can become an exportable `PatternGraph`.

**Why:** Different garments and export targets will have different tolerance policies. A flat checklist will not survive the second garment family. A small state machine keeps validation rigorous while still allowing designer-facing language and assisted correction.

**Door status:** Closed as validation architecture direction. Implementation details remain open.

## 2026-05-03: Prototype starts with a dirty end-to-end spike

**Question:** Should prototype 1 be built layer by layer, or start with a rough full-pipeline spike?

**Options considered:**

- Follow B0-B10 strictly in clean sequential layers.
- Build the app UI first.
- Build an ugly v0.1 path through the whole pipeline, then harden the layers with integration questions visible.

**Where it landed:** Start implementation with a dirty end-to-end spike: hand-authored seed, trivial validator, hand-coded first-garment generator, SVG with hardcoded labels, and static 3D placement.

**Why:** A clean sequential plan can hide integration risk until too late. A rough full path gives the project one verifiable garment and reveals where schema, validation, export, and preview actually rub against each other.

**Door status:** Closed as first implementation move. The formal build plan can be rationalized after v0.1 exists.

## 2026-05-03: Validation should be backend instrumentation, not a designer-facing error console

**Question:** What should validation feel like to the designer?

**Options considered:**

- Traditional diagnostic console with errors and warnings.
- Export-time stop-and-fix checklist.
- Continuous backend instrumentation for interpretation quality, package readiness, and designer-facing refinement only when needed.

**Where it landed:** Validation is primarily a backend developer and engine-quality tool. It should improve interpolation, pattern generation, package readiness, and internal confidence. The fashion designer should usually experience it as smooth continuation, clear interpretation, and occasional design-facing questions rather than as "you broke something; fix these warnings."

**Why:** Traditional CAD, 3D tools, game engines, and IDEs often make users stop at a wall of errors. Even "repair" implies the designer caused damage and the computer is scolding them. That is the wrong product feel. Pattern Lab should behave more like an agentic collaborator: interpret, continue, normalize safe details, and surface only meaningful garment-design choices.

**Door status:** Closed as product interaction direction. Implementation details remain open in validation schema and UI.

## 2026-05-03: Garment language is enforced as the user-surface voice

**Question:** Should garment-design language be a stylistic guideline applied case by case, or a hard requirement, and what is its scope of binding?

**Options considered:**

- Treat it as a stylistic guideline; rely on developer taste to keep messages designer-friendly.
- Commit it across both engine instrumentation *and* the user surface (an early framing of this decision attempted that and was rejected — it imported the IDE/error-console mental model into the system, contradicting the prior decision that validation is backend instrumentation, not a designer-facing error console).
- Commit it as a hard requirement on the **user surface only** — the design software the designer actually uses — while leaving engine instrumentation in engineering language because no end user sees it.

**Where it landed:** Garment language is enforced at the user surface only. The user surface is three things:

- **The workbench UI** — labels, controls, callouts, selections, panel naming, every visible string the designer can read.
- **The assistant collaborator** — prompts, confirmations, ambiguity questions ("I'm assuming X — change?"), edit suggestions, undo/redo descriptions.
- **The pattern package output** — panel labels, cut counts, construction notes, scale annotations, validation summary phrasing on the printed or exported artifact.

The garment-language commitment binds in those three surfaces. Inside each, it binds in three architectural ways:

- **Schema for user-surface artifacts** — every workbench string, every assistant prompt template, every pattern-package label has a structured phrasing record. Internal ids are for code; phrasings are for users.
- **Tooling for user-surface artifacts** — linting / tests prevent jargon leaks reaching the user surface. No raw snake_case in workbench labels. No bare error codes in assistant prompts. No `VALIDATION:`-style prefixes in pattern package text. Runs in CI; fails the build.
- **Corpus for user-surface artifacts** — phrasings live in the data corpus as first-class records: workbench-string templates, assistant prompt templates, ambiguity-question templates, package-label templates, command-verb glossary. Grows over time, model-readable, prepares the multilingual factory-instruction story.

The engine instrumentation underneath — validator findings, helper outputs, candidate state, ML helper confidence scores, debug dumps, candidate-promotion gate state, dev panels — is **not in scope** for this commitment. It's the dev surface. Engineer language is fine there. The translation from engine instrumentation to user surface happens at the boundary, and only for the small subset of engine state that's actually relevant to the user.

**Why:** Pillar 1 (natural intent over CAD operation), Orrery design-review finding 13 (validation should suggest fixes in design language), Kiko's Kew-vision expert/novice continuum, and the prior decision that validation is backend instrumentation all converge here. The original framing of this decision tried to bind voice everywhere and accidentally re-imported the IDE/error-console mental model. The correct framing is two distinct surfaces: dev surface in engineer language, user surface in garment language, with translation at the boundary.

**Door status:** Closed as user-surface voice commitment. Open for: the user-surface phrasing-corpus schema, the linting rule shape (scoped to user-surface artifacts only), and the boundary contract between engine instrumentation and user-surface translation. Worth noting as research-future-work that "encode craft language as a first-class voice on the user surface, with engineering language preserved underneath" is an architectural pattern that would generalize to other craft-shaped domains (mechanical CAD parts, game assets, music production, knitting, woodworking) — but Garment Pattern Lab is for garments, and that generalization is a side effect, not a goal.

## 2026-05-03: PatternGraph is a graph, not an Illustrator layer tree

**Question:** How should `PatternGraph` be topologically organized? Tree (panels with darts/notches/allowances as children), layer tree (Illustrator-shape: presentation-ordered layers, z-order, containment as the only relationship), or graph (first-class typed nodes with multiple semantic edge types)?

**Options considered:**

- **Panel-child tree.** Darts, notches, allowances, markers all live as children of a panel node. Simple at first; awkward when modifiers move (dart transfer, dart rotation), when allowances reference cross-panel state, and when seam pairs need to link edges from different panels.
- **Illustrator-style layer tree.** Flat layers organized by visual stacking order with containment as the only relationship between nodes. Familiar to designers but wrong-shaped for manufacturing data — a pattern carries semantic relationships (seam pairs across panels, modifier attachment, allowance dependency, derived-from for facings) that presentation-order trees cannot express without breaking.
- **Graph with first-class typed nodes and semantic edges.** Panels, edges, modifiers (darts, pleats, tucks, notches), allowances, markers (grainlines, fold lines), anchors, and seam pairs are all first-class nodes. Edges between nodes are semantic and typed: `belongs_to`, `attaches_to`, `paired_with`, `derived_from`, `anchors_at`, etc. Cross-panel relationships are first-class edges, not crawls through a tree.

**Where it landed:** Graph, not tree, and explicitly not an Illustrator layer tree.

**Why:** A sewing pattern is a network, not a stack. SeamPair joins two edges on different panels — that relationship is a first-class edge in the graph, not a query over containment. Darts that transfer or rotate are addressable nodes, not panel mutations. Facings derive from their parent panel via a `derived_from` edge, not by being nested inside it. Future operations (grading, variants, comparison, merge) need to reference any node by id without crawling a tree. The Illustrator-layer-tree shape is the explicit anti-pattern: presentation order is not pattern semantics, and bending one to do the other's job produces accidental architecture.

**Door status:** Closed as topological commitment. Open for: the specific node-type catalog (panels, edges, modifiers, markers, allowances, anchors, seam pairs), the specific edge-type catalog (`belongs_to`, `attaches_to`, `paired_with`, `derived_from`, `anchors_at`, etc.), the JSON schema, and the three orthogonal axes that layer onto the graph (state: candidate/promoted; revision: operation-DAG provenance; provenance: source/producer/confidence). The first hand-authored seed fixture should make these choices concrete and live; B1's fixture work (now folded into V0.1-DESIGN.md Phase E) is what closes the open items.

**Reference architectures:**

- **Boundary representation (B-rep) from CAD** is the closest gold-standard analog: Onshape's part topology, SolidWorks, OpenCascade, Fusion 360. Faces / edges / vertices with semantic role and topological adjacency, where topology is *separate from* geometry (a face knows its boundary loop without storing the curve representation; curves live in their own table referenced by id). PatternGraph is a 2D B-rep with garment-specific node types: panels instead of faces, edges instead of edges, anchors instead of vertices, plus modifier / allowance / marker / seam-pair node types layered on. Closest readable code reference: Blender's BMesh / OpenMesh half-edge data structures.
- **Entity-component-systems (ECS)** — Bevy, Flecs — are *adjacent but not the right fit*. ECS leads with composition; PatternGraph wants constrained, typed topology. ECS systems iterate via component query; PatternGraph queries are graph-walk shaped. ECS would work but pulls in execution-model assumptions we don't need.
- **GarmentCode** (https://github.com/maria-korosteleva/Garment-Pattern-Generator, arXiv 2306.03642) is the closest **open garment-first** graph-shaped data model. Its `Component / Panel / Edge / Interface / Stitch` quartet maps almost one-to-one onto our sketch. **The decision is to adopt GarmentCode's vocabulary and graph topology, with four explicit extensions:**
  1. Promote `Allowance` to a first-class node (GarmentCode treats seam allowance as a panel offset operation; we want it queryable per-edge).
  2. Promote `Anchor` to first-class (notch positions, dart apexes, scale references). GarmentCode mostly uses edge endpoints.
  3. Add `Modifier` as a first-class node type for darts / pleats / tucks (GarmentCode handles these via panel-level constructs).
  4. Add explicit ordered `Construction` steps as graph nodes (theirs lives in component composition logic).
- **Commercial formats** (Optitex .pds, Lectra .iba, Gerber AccuMark, Browzwear .vstitcher, CLO .zprj) are proprietary blobs, partially reverse-engineered, *not useful as a data-model reference*. **DXF/AAMA-292/ASTM-D6673** is the industry *interchange* standard — flat polylines on convention-numbered layers with attributes. Useful as a future *export target* (Persona 3 territory), not as our internal model. It's a presentation format, not a topology.

The seed fixture work in V0.1-DESIGN.md Phase E should look like "GarmentCode plus our four extensions, expressed as the v0.1 sleeveless A-line tunic" rather than inventing the schema from first principles.

## 2026-05-03: Three canonical personas anchor scope by version

**Question:** How should user-facing scope decisions be anchored? "Designers" was too broad — production-focused designers, indie designers, and manufacturing-focused designers have meaningfully different requirements and different version expectations.

**Options considered:**

- One blended "designer" persona covering everyone. Rejected — it had been quietly causing scope drift; v0.1 features kept reaching for production and manufacturing concerns.
- Two personas (creative vs production). Considered but conflates production design with manufacturing handoff, which are different jobs.
- Three personas mapped one-to-one to product versions: indie designer (v0.1), production designer (v0.5+), manufacturing designer (v1+).

**Where it landed:** Three personas, each with its own canonical doc under `docs/design/personas/`, each owning a different version target. Persona 1 (Individual Fashion Designer) is the v0.1 primary user; Persona 2 (Production-Focused Garment Designer) is v0.5+; Persona 3 (Manufacturing-Focused Designer) is v1+. Each persona has identity, context, quality bar, what they see and don't see, version target, 8–10 user stories, anti-stories, voice/dialect, and open questions.

**Why:** The three users have meaningfully different requirements (sample-sewable pattern vs semantic-propagation-and-grading vs industrial-export-and-marker-compliance) and meaningfully different mental models (home/indie maker vs studio professional vs factory liaison). Trying to serve all three at v0.1 was producing accidental scope creep. Naming them as canonical scope-defining tools means every feature has a clear owner ("which persona, which version?") and scope discipline becomes a one-question audit.

**Door status:** Closed as scope-defining framework. Open for: persona evolution as the product matures (a user can move between personas over time; Persona 1 may grow into Persona 2 without becoming a different person). Persona docs are canonical; other docs (PRODUCT-DESIGN, PRODUCT-PILLARS, PRODUCT-PLAN, ROADMAP, BUILD-PLAN) reference rather than restate.


## 2026-05-03: v0.1 design locked — one-shot pipeline, thin UI, A-line tunic, imperial, 45" marker

**Question:** What is the canonical scope and shape of the v0.1 prototype that Codex will implement?

**Options considered:**

- A full Persona 1 workbench (sketch upload, interactive editing, parameter sliders, export) — too large for v0.1; importing Persona 2 features.
- A pure headless harness (CLI in, file out, no UI at all) — too thin to demo; misses the 3D-viewer-as-magic-moment.
- A one-shot pipeline with a single thin-UI page for viewing + export — the chosen middle path.

**Where it landed:** v0.1 is a **one-shot pipeline with a single thin-UI page**. Inputs are image / sketch / vector files (clean inputs only — drape photos and noisy raster deferred to v0.5). The pipeline runs vectorization → semantic interpretation → figure-driven imperial scale calibration → drafting → validation → marker layout (simple non-optimized strip-pack on 45" fabric) → tiled PDF export. The user-facing surface is a single Three.js page rendering panels in static placement around a body proxy, with turn/pan controls and an export button. No editing. No assistant verbs. No manual landmark correction. Garment family is locked to the sleeveless A-line woven tunic. Canonical spec: `docs/project/V0.1-DESIGN.md`.

**Why:** Persona 1's quality bar ("I can hold this printed pattern, cut it, and make a muslin from it") is met by a static one-shot pipeline; Persona 2 features (variants, grading, dependency propagation, editing) are real value but for the wrong version. The thin-UI viewer with turn/pan is the seed of the v1 magic moment without committing to a full workbench. Imperial units throughout because Kiko's audience is US-sewer-shaped. The 45" marker layout matches typical home-sewing fabric purchase patterns; optimization is deferred. Failure mode is best-guess + assumptions surfaced in the package, with hard-failure fallback when even the best guess is below confidence floor — no user-facing correction surface, dev instrumentation handles iteration.

**Door status:** Closed as v0.1 implementation spec. Open for: Codex's implementation choices within the phase contracts (Phases A–J in the design doc), specifically resolving the five `known_implementability_gaps` in the landmark prior file during Phase C; resolving `.ai` ingestion fidelity during Phase B; choosing croquis-matching approach during Phase D. v0.5 and v1 scope decisions are explicitly deferred and remain open.

## 2026-05-04: v0.1 canonical body fallback is US Misses 8 (selectable soon)

**Question:** When the input lacks a human figure or croquis for scale calibration, what's the canonical body the system falls back to?

**Options considered:**

- Hardcode a single canonical body permanently. Simpler but assumes one default fits all v0.1 demos.
- Make it user-selectable from the start. More flexible but adds a UI surface to v0.1 (which is supposed to be one-shot, no UI).
- Hardcode a single canonical body for v0.1 with a clear path to making it selectable in v0.1.x or v0.5.

**Where it landed:** v0.1 hardcodes **US Misses 8** as the canonical body fallback. The body table comes from ASTM D5585 (Misses' Standard Body Measurements for Apparel) or comparable industry-standard measurements; Codex selects the authoritative source during Phase D and stores the full table at `garments/a-line-dress-tunic/fixtures/measurements/canonical-misses-8.json`. Selectability becomes a v0.1.x or v0.5 priority — a single hardcoded body works for the dinner demo but is too rigid as a permanent answer.

**Why:** US Misses 8 is the most widely used reference body in commercial pattern drafting for the indie / home-sewer market Persona 1 sits in (Vogue, McCall's, Simplicity all default near it). It matches the FreeSewing/Aldrich measurement context the drafting formulas already assume. Making it selectable in v0.1.x means we don't have to retrofit the schema later.

**Door status:** Closed for v0.1. Open for: the precise measurement table source (ASTM D5585 vs Vogue vs another), and the selectability path (config file in v0.1.x → user-supplied measurement set in v0.5 with assistant prompts).

## 2026-05-04: v0.1 reference inputs come from web-sourced sketches and GPT Image 2 generation

**Question:** Where do the v0.1 reference inputs come from for the smoke test in Phase J? Acceptance criteria depend on real inputs, but Kiko-supplied inputs may be delayed.

**Options considered:**

- Wait for Kiko to deliver reference sketches. Risks Codex blocking.
- Backstop with synthetic-from-FreeSewing fixtures only. Tests the plumbing but doesn't exercise sketch ingestion.
- Pull license-clean reference sketches from the web plus generate fixtures via GPT Image 2 per the existing Lane A (`INPUT-LANES.md`).

**Where it landed:** Pull web-sourced reference sketches (license-clean or generated) and use GPT Image 2 to generate prompt-controlled fixtures matching the eight Persona 1 example flows. This unblocks Codex's smoke test work without waiting for Kiko's deliveries; her real inputs land later as additional fixtures.

**Why:** The GPT Image 2 lane is already designed in `docs/project/INPUT-LANES.md` (Lane A) for exactly this purpose — controlled, repeatable, project-owned sketch fixtures with prompt provenance. The Persona 1 example flows give us eight concrete prompt targets. Web-sourced sketches are a backup when GPT Image 2 doesn't produce something usable, and they exercise the noisier-input handling. Reference patterns from the corpus must remain reference-only per the prior copyright decision.

**Door status:** Closed for v0.1 fixture sourcing. Open for: which specific Persona 1 flows we generate fixtures for first (recommend Reece's longer A-line, Sam's Procreate shift, and Lin's gathered midi as the cleanest cases), and the prompt-recipe library to seed.

## 2026-05-04: v0.1 ingests `.ai` files via a known library, not by punting to "convert to SVG first"

**Question:** How does v0.1 handle Adobe Illustrator (`.ai`) input files? The format is partially proprietary.

**Options considered:**

- Punt entirely: tell users "convert to SVG in Illustrator first." Fastest to ship but breaks the Persona 1 promise that the system accepts what designers already work in.
- Best-effort ad-hoc parsing. Brittle, hard to support.
- Use a known library that handles `.ai` correctly. Most `.ai` files (CS2, 2005 onwards) are PDF-compatible and can be parsed via PDF tooling.

**Where it landed:** Use a known library. The recommended path: `.ai` files saved with PDF compatibility (the default since Illustrator CS2) are parsed via `pdfjs-dist` (Mozilla's PDF.js) to extract path geometry, which then flows through the same vector-passthrough lane as `.svg` and vector PDF inputs. Codex evaluates `pdfjs-dist`, `ai2svg`, and similar npm libraries during Phase B and picks the most reliable one. Pre-CS2 `.ai` files (rare) fall back to a clear "couldn't read this format — try saving as SVG or PDF-compatible AI" message.

**Why:** Illustrator is where many Persona 1 designers already work (Sam's flow #4 in the example flows is explicitly Procreate→Illustrator vector exports). Punting forces an extra manual step and breaks the "what designers already work in" commitment. The PDF-compatible path is robust because `.ai` files have been PDF-shaped for two decades; the library work is small.

**Door status:** Closed for v0.1 ingestion strategy. Open for: the specific library choice (Codex selects during Phase B), and how to handle edge cases like raster-only `.ai` files or files with embedded fonts.
