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
