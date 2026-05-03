# Roadmap To Prototype 1

## Prototype Target

Build a first working prototype for one garment type:

**Sleeveless A-line woven dress/tunic from front/back sketch to printable pattern package.**

The first prototype should prove the full pipeline at small scale:

```text
sketch -> landmarks -> design parameters -> pattern graph -> SVG/PDF pattern -> simple 3D preview -> validation report
```

Prototype 1 output lane:

- Human-readable pattern docs for a person to print, cut, review, and sew.
- Instructions should live in or alongside the pattern package.
- Industry-standard / machine-readable cutter/CAD files are a later industrial export lane, not a prototype 1 priority.

## Current Status

Project seed created. Research references collected. No production implementation has started.

The implementation scaffold now separates reusable product engine folders from garment-specific folders:

- `app/`: browser workbench shell.
- `packages/`: reusable app/kernel packages.
- `garments/a-line-dress-tunic/`: first garment program, fixtures, references, and outputs.

## Product Pillars

Full brief: [Product Pillars](PRODUCT-PILLARS.md)

Pattern Lab is not another mouse-and-keyboard CAD/3D editor. It is a human-centered, natural-language-led sketch-to-pattern workbench that gets as close to art -> garment as the craft allows.

The product pillars are:

1. **Natural Intent, Not CAD Operation**
   The primary interaction should be garment language and semantic handles. Direct manipulation exists for correction, not as the whole product.

2. **PatternGraph Is The Craft Contract**
   Sketches, traces, generated images, and 3D views are inputs or feedback. `PatternGraph` is the trusted sewing-aware manufacturing object.

3. **Trace And Layers Are A Bridge**
   Vector/layer tooling is needed soon, but only as an interpretation bridge from image/art to garment semantics and parameters.

4. **Validation Before Beauty**
   SVG/PDF export and 3D preview must be backed by validation. Photoreal output is not proof.

5. **3D As Feedback, Not Authorship**
   The first 3D loop is a sanity preview and warning surface. It must not silently rewrite pattern geometry.

6. **Narrow Services, Broad Future**
   Grading, fabric simulation, marker planning, tech packs, and interop come later as narrow validated services, not as full editor parity with Optitex/CLO/Illustrator.

## Product Pipeline Areas

These areas are the working product pipeline. Each has a reusable app/package owner and, where needed, a first-garment owner.

| Area | Purpose | Owner folder | First-garment folder |
| --- | --- | --- | --- |
| Natural intent interface | Natural-language edits, assumption review, ambiguity questions. | `packages/assistant-core/` | `garments/a-line-dress-tunic/fixtures/` |
| Source input and trace bridge | Generated sketches, human uploads, croquis guides, editable traces, semantic callouts. | `packages/sketch-intent/` | `garments/a-line-dress-tunic/fixtures/sketches/` |
| Pattern truth | `PatternGraph`, candidates, panels, seams, labels, measurements, parameters. | `packages/pattern-core/` | `garments/a-line-dress-tunic/fixtures/patterns/` |
| Geometry kernel | Curves, lengths, offsets, intersections, triangulation handoff. | `packages/geometry-core/` | garment-specific drafting calls into it |
| Validation gate | Sewing-aware errors, warnings, limitations, candidate promotion, export gate. | `packages/validation-core/` | `garments/a-line-dress-tunic/fixtures/validation/` |
| Human-readable export | SVG/PDF package, cut sheet, assembly, source JSON, validation report. | `packages/export-core/` | `garments/a-line-dress-tunic/outputs/` |
| 3D feedback | Simple avatar/proxy, panel orientation, seam visualization, rough fit/ease warnings. | `packages/preview-3d/` | garment-specific preview config |
| Product shell | Workbench UI orchestration across input, intent, pattern, validation, preview, export. | `app/` | consumes first-garment program |

## Prototype Build Order

Full build order: [Prototype Build Order](PROTOTYPE-BUILD-ORDER.md)

The real build order is:

1. **B0: Repo Scaffold And Contracts**
   Lock folder boundaries, package ownership, first-garment ownership, and fixture locations.

2. **B1: PatternGraph Seed**
   Hand-author a valid first-garment candidate plus invalid examples before writing generation code.

3. **B2: Validation Harness First**
   Implement validation against known-good and known-bad fixtures before 3D or UI can make weak output look credible.

4. **B3: Geometry Kernel V1**
   Add the smallest geometry needed for curve lengths, offsets, intersections, closedness, self-intersection, and preview triangulation.

5. **B4: First Garment Generator**
   Generate A-line dress/tunic panels from measurements and parameters.

6. **B5: Human-Readable Export**
   Export semantic SVG, source JSON, cut sheet, assembly notes, and validation report.

7. **B6: Simple 3D Preview**
   Add a coarse Three.js preview for orientation, seam pairing, silhouette, and obvious fit/ease issues.

8. **B7: Sketch Input And Landmark Bridge**
   Add uploaded/local image input, manual landmarks, semantic callout review, and conversion to garment parameters.

9. **B8: Natural-Language Assistant Loop**
   Add commands like "make the hem longer," "show assumptions," "show unmatched seams," and "make this printable."

10. **B9: Semantic Trace Layers**
    Add editable traced curves and semantic vector layers without becoming a full vector editor.

11. **B10: Prototype Package And Review Gate**
    Generate a complete package, run print/scale checks, capture 3D screenshot, and collect sewing-literate review.

## Implementation Folder Plan

```text
app/
  README.md
packages/
  assistant-core/
  export-core/
  geometry-core/
  pattern-core/
  preview-3d/
  sketch-intent/
  validation-core/
garments/
  a-line-dress-tunic/
    docs/
    fixtures/
    references/
    outputs/
```

Folder rule:

- Put reusable product logic in `app/` or `packages/`.
- Put first-garment drafting, fixtures, references, and generated packages in `garments/a-line-dress-tunic/`.
- If a future garment should reuse it, it does not belong inside the A-line folder.

## Research Roadmap To Prototype 1

These are the research tracks that still need closure before or alongside the first working prototype. The order matters: the first six create the manufacturing spine; the later tracks open the AI, 3D, designer-editing, and interoperability lanes without letting them own pattern truth too early.

### RR1: First-Garment Drafting Formulas

Goal: make the sleeveless A-line woven tunic draftable without inventing patternmaking logic in code.

Deliverables:

- `docs/project/FIRST-GARMENT-DRAFTING.md`
- required measurement list
- ease defaults
- neckline, armhole, shoulder, side seam, hem, and closure rules
- seam allowance, hem allowance, notches, labels, cut counts, and construction order

Exit criteria:

- A developer can generate the front/back panels from measurements and parameters.
- The draft states where human patternmaker judgment is still required.

### RR2: PatternGraph Schema

Goal: define the JSON representation that becomes manufacturing truth.

Deliverables:

- `docs/project/PATTERN-SCHEMA.md`
- `garments/a-line-dress-tunic/fixtures/patterns/valid-seed.pattern.json`
- schema examples for panels, seam lines, cut lines, seam pairs, darts, grainlines, labels, validation, export metadata, and provenance

Exit criteria:

- The first garment can be represented without hidden assumptions.
- Schema separates seam geometry from cut geometry.

### RR3: Sewing-Aware Validation Checklist

Goal: define what makes a candidate pattern fail before export.

Deliverables:

- `docs/project/PATTERN-VALIDATION-CHECKLIST.md`
- invalid fixture set with intentional seam, grainline, scale, self-intersection, label, and allowance failures
- validation report shape for errors, warnings, and known limitations

Exit criteria:

- Bad candidates cannot become exportable `PatternGraph` objects.
- Every failure points to a specific panel, seam, dart, grainline, unit profile, or export field.

### RR4: Geometry Kernel Decision

Goal: decide the smallest robust geometry stack for prototype 1.

Deliverables:

- `docs/project/TECH-STACK-DECISION.md`
- `docs/research/geometry-kernel-spike.md`
- operation matrix for TypeScript, Rust/WASM, C++/Emscripten, WebGPU, Graphite crates, and candidate libraries

Exit criteria:

- `PatternKernel` and `GeometryKernel` interfaces are specified.
- First implementation path is chosen for curve length, offsets, intersections, triangulation, and marker placement.

### RR5: SVG Semantic Profile And Round Trip

Goal: make SVG a trustworthy first export format.

Deliverables:

- `docs/project/SVG-SEMANTIC-PROFILE.md`
- `docs/research/svg-roundtrip-spike.md`
- SVG layer/metadata map for cut lines, seam lines, internal lines, notches, grain/fold lines, labels, units, and provenance

Exit criteria:

- Exported SVG can be reimported and checked against the source `PatternGraph`.
- Unit scale and semantic layer preservation are measured, not eyeballed.

### RR6: Marker Planner Spike

Goal: create a first honest fabric-width layout before optimized nesting.

Deliverables:

- `docs/project/MARKER-PLANNER.md`
- `garments/a-line-dress-tunic/fixtures/marker/marker-plan.example.json`
- comparison notes for deterministic strip placement vs libnest2d/Deepnest-style optimization

Exit criteria:

- The system can place cut pieces inside a usable fabric width with grain, spacing, cut count, fold, and fabric-length reporting.
- The report distinguishes valid-but-wasteful from invalid placement.

### RR7: Graphite And Blender Audits

Goal: decide what the pulled tools actually contribute to the pipeline.

Deliverables:

- `docs/research/graphite-vector-audit.md`
- `docs/research/blender-headless-preview-spike.md`
- notes on semantic SVG survival through Graphite/editors and minimal Blender Python preview fields

Exit criteria:

- Graphite is classified as vector editor, geometry source, both, or reference only.
- Blender preview can be accepted, deferred, or replaced by browser Three.js with evidence.

### RR8: Visual Corpus Schema

Goal: make image references usable without confusing inspiration with truth.

Deliverables:

- `docs/project/VISUAL-CORPUS-SCHEMA.md`
- `TruthLevel` and `LicenseProfile` definitions
- sample entries for generated sketch, technical flat, real pattern reference, pattern-truth fixture, and round-trip fixture

Exit criteria:

- Every visual item records source, allowed use, garment family, construction features, review status, and truth level.

### RR9: Pattern Reference Corpus

Goal: collect real construction examples for correctness checks.

Deliverables:

- `docs/reference/PATTERN-REFERENCE-CORPUS.md`
- first reference set for sleeveless A-line tunic/dress, A-line skirt, bodice shell, simple woven top, and simple pants block
- notes for LACMA, OpenPattern, FreeSewing, GarmentCodeData, and CoPA usefulness/limits

Exit criteria:

- Each garment family has expected panel roles, seam pairs, grainline rules, finishing pieces, and suspicious omissions.

### RR10: GPT Image 2 Sketch Corpus Spike

Goal: test whether generated sketches and flats can become controlled fixtures.

Deliverables:

- `docs/research/gpt-image-2-sketch-corpus-spike.md`
- prompt recipes for front/back flats, croquis sketches, and reference sheets
- 20-item reviewed mini-corpus plan

Exit criteria:

- Generated images are reviewed into `SketchIntent` records or rejected with reasons.
- Prompt recipes preserve enough construction semantics to be useful.

### RR11: Image-To-3D Comparison

Goal: evaluate mesh candidates without mistaking them for patterns.

Deliverables:

- `docs/research/image-to-3d-candidate-spike.md`
- SPAR3D vs Hunyuan3D-2 comparison on the same small input set
- tracking notes for TRELLIS, TRELLIS.2, and TripoSR

Exit criteria:

- Outputs are scored with `MeshQualityReport`.
- The project knows whether image-to-3D is useful for preview, seam hints, mesh-to-pattern research, or only inspiration.

### RR12: Commercial Interoperability Matrix

Goal: understand what real pattern tools can consume and preserve, while keeping industry-standard / machine-readable cutting/CAD output as a later export lane.

Deliverables:

- `docs/project/EXPORT-COMPATIBILITY-MATRIX.md`
- notes for CLO, Seamly2D, Illustrator/Inkscape, SVG, DXF/AAMA/ASTM, PDF, and future CAD formats

Exit criteria:

- The prototype has a credible human-readable export target and a known later path toward industrial exchange formats.
- Import/export failures are classified as geometry, unit, semantic layer, or tool-support issues.

### RR13: Designer Sketch-To-Model Editing Loop

Goal: let a clothing designer edit the sketch or vector interpretation and see the change represented on the garment model in real time.

V1 should be a sketch-parameter editing loop, not a full creative suite. A designer should be able to change concrete garment features such as shoulder opening, armhole shape, neckline, side silhouette, hem length, or hem sweep, then see the sketch, pattern flats, validation, and model preview update. The later version can grow toward a Graphite/Substance-style editor with layers for fabrics, stitches, trims, prints, decals, masks, and material/PBR channels.

Deliverables:

- `docs/project/DESIGNER-SKETCH-3D-EDITING.md`
- `docs/research/designer-sketch-projection-spike.md`
- UI model for raster sketch, vector sketch layer, surface projection layer, material/PBR preview layer, and garment-model preview
- v1 edit map for shoulder opening, armhole, neckline, hem length, hem sweep, and side silhouette
- decision on whether edits apply to `SketchIntent`, `GarmentParameters`, `PatternGraphCandidate`, texture/material preview only, or final `PatternGraph`
- interaction requirements for brush/vector editing, layer stack, masks, symmetry/mirror, projection gizmo, undo/revision history, and manual correction

Exit criteria:

- A designer can change a sketch feature such as shoulder opening or hem length and see corresponding model/pattern feedback.
- The system records the underlying parameter change instead of only storing a moved curve.
- Every edit is classified as visual-only, semantic intent, pattern-affecting, or material-affecting.
- The preview can show PBR-ish material/color/decal intent without confusing it with sewable pattern geometry.
- Pattern-affecting edits still pass through `PatternGraphCandidate` validation before export.

## Guiding Constraints

- One garment type only.
- Manual controls are allowed wherever automation is uncertain.
- Pattern grammar is the source of truth.
- 3D preview validates and communicates; it does not own the pattern.
- Human-readable SVG/PDF/print export matters more than photorealistic drape.
- Industry-standard / machine-readable cutter/CAD output is later than prototype 1.
- A human patternmaker review is a required milestone before claiming "sewable."

## Dependency Graph

```text
Pattern fundamentals ──┐
                       ├── Pattern grammar/schema ── Pattern generator ── Export
Measurements/avatar ───┘                                  │
                                                          ├── Validation report
Sketch landmarks ─────── Design parameter extraction ─────┘
                                                          │
2D panels + seams ────────────────────────────────────────┴── 3D preview
```

Parallelizable:

- Reference ingestion and first-garment drafting rules.
- Sketch landmark schema and annotation UI.
- Export format experiments.
- 3D preview spike.
- Browser-native Three.js/WASM/WebGPU architecture spike.

Not parallelizable:

- Pattern generator depends on drafting rules and schema.
- Automated sketch parsing should wait until manual landmark mapping works.
- Fit automation depends on generated pattern and preview validation.
- Export depends on candidate-to-export interop: normalize, measure, correct, validate, and round-trip.

## Phase 0: Project Grounding

Goal: turn the idea into an implementation-ready spec.

Tasks:

- [x] Create project folder and LBH-style docs structure.
- [x] Capture initial references.
- [x] Define first prototype garment.
- [x] Write product plan.
- [x] Write product pillars.
- [x] Write prototype build order.
- [x] Scaffold separate app/package/garment folders.
- [x] Write dependency map.
- [x] Write research queue.
- [ ] Ingest one public/free patternmaking reference into concise notes.
- [x] Ingest `Computational Pattern Making from 3D Garment Models` into product knowledge graph.
- [ ] Draft first-garment formula sheet.
- [ ] Decide prototype tech stack.
- [x] Draft browser-native Three.js/WebGPU/WASM pipeline lane.
- [x] Define candidate-to-export interop layer.

Acceptance criteria:

- Docs answer what we are building, why, and what is intentionally out of scope.
- A future agent can start a prototype without re-opening the entire research question.

## Phase 1: Patternmaking Rulebook

Goal: produce the drafting logic for the first garment.

Tasks:

- Select base drafting method for sleeveless A-line tunic.
- Define required measurements and derived measurements.
- Define ease defaults:
  - bust ease
  - waist ease
  - hip ease
  - hem sweep
  - armhole clearance
- Define neckline and armhole curve construction.
- Decide initial closure:
  - start loose pullover
  - backlog center-back seam/zipper
- Decide dart mode:
  - start dartless or simple bust dart
  - document tradeoff
- Define pattern pieces and labels.
- Define seam allowance and hem allowance defaults.
- Define notches and balance marks.
- Define construction order.

Deliverables:

- `docs/reference/PATTERNMAKING-FUNDAMENTALS.md`
- `docs/project/FIRST-GARMENT-DRAFTING.md`
- `docs/project/PATTERN-VALIDATION-CHECKLIST.md`

Acceptance criteria:

- A developer can implement pattern generation without inventing pattern rules in code.
- Every generated panel has named construction purpose.
- Every seam has a match or an explicit reason it does not.

## Phase 2: Pattern Schema

Goal: define the internal data model before drawing output.

Tasks:

- Define `PatternDocument`.
- Define `MeasurementSet`.
- Define `GarmentParameters`.
- Define `Panel`.
- Define `Edge`.
- Define curve representation.
- Define stitch relationships.
- Define darts.
- Define notches.
- Define grainlines.
- Define seam allowance and hem allowance rules.
- Define seam-pair reflection symmetry scoring.
- Define dart symmetry scoring.
- Define panel corner-count and complexity warnings.
- Define material/fabric deformation budget fields for future mesh-derived pattern candidates.
- Define optional 3D source mesh, user seam hints, and target-pose references.
- Define export metadata.
- Create a hand-authored JSON example for the first garment.

Deliverables:

- `docs/project/PATTERN-SCHEMA.md`
- `garments/a-line-dress-tunic/fixtures/patterns/valid-seed.pattern.json`

Acceptance criteria:

- Schema can represent the first garment without hidden assumptions.
- Schema distinguishes seam line from cut line.
- Schema can be exported to SVG.
- Schema can be checked for seam-length compatibility.
- Schema can attach validation results to panels, seam pairs, darts, and grain axes.

## Phase 2.5: Sewing-Aware Validation Harness

Goal: implement validation before the 3D preview makes the output look more trustworthy than it is.

Tasks:

- Implement seam length validation.
- Implement rough seam reflection-symmetry validation for paired curves.
- Implement panel closedness and self-intersection checks.
- Implement panel corner-count warnings.
- Implement dart-leg and dart-symmetry checks.
- Implement grainline-required checks.
- Implement seam allowance / cut-line presence checks.
- Implement candidate normalization and measurement report shape.
- Implement export gate semantics.
- Implement SVG round-trip test requirements.
- Produce internal `validation.json`, a smooth user-facing readiness/interpretation summary, and a human-readable `validation.md` for package provenance.
- Add `ContinuationAction` / `InterpretationQuestion` records for safe normalization, designer choices, and deferred limitations.

Deliverables:

- `docs/project/PATTERN-VALIDATION-CHECKLIST.md`
- Validation output fixture for first garment.

Acceptance criteria:

- Bad seam pairs are caught before export and handled as internal package-readiness state, not a last-minute error console.
- Missing grainlines or seam allowances are normalized where safe, or turned into a clear design question.
- The report distinguishes errors from warnings.
- The user-facing output batches validation into readiness and interpretation language instead of raw diagnostic noise.
- The report cites known limitations when checks are approximate.
- Candidates cannot be promoted to exportable `PatternGraph` unless the export gate passes.

## Phase 3: Minimal Pattern Generator

Goal: generate the first garment from measurements and parameters with no sketch input yet.

Tasks:

- Create product package skeleton under `packages/`.
- Create first-garment program skeleton under `garments/a-line-dress-tunic/`.
- Add measurement fixture JSON under `garments/a-line-dress-tunic/fixtures/measurements/`.
- Add garment parameter fixture JSON under `garments/a-line-dress-tunic/fixtures/parameters/`.
- Add one hand-authored candidate fixture under `garments/a-line-dress-tunic/fixtures/patterns/`.
- Implement `pattern-core` types for `PatternGraphCandidate` and `PatternGraph`.
- Implement `geometry-core` primitives needed by the first draft.
- Implement first-garment generator in the garment folder using reusable packages.
- Generate front/back panels as vector geometry.
- Generate seam lines.
- Add seam allowance/cut lines.
- Add grainline.
- Add notches.
- Add labels and cut counts.
- Add simple construction order.
- Implement seam-walk validation in `validation-core`.
- Run the sewing-aware validation harness.
- Export SVG through `export-core`.

Deliverables:

- Working script/app that generates an SVG pattern for the first garment.
- Example output in `garments/a-line-dress-tunic/outputs/`.
- Validation report.

Acceptance criteria:

- Front and back panels are closed.
- Side seams match within tolerance.
- Shoulder seams match within tolerance.
- Reflection-symmetry warnings are reported for paired seams.
- Panel complexity warnings are reported.
- Neckline and armhole finishing instructions are present.
- SVG opens in Inkscape/Illustrator/browser.
- Pattern includes measurement and parameter provenance.

## Phase 4: Manual Sketch Landmark Mapping

Goal: connect sketch input to pattern parameters without betting on full AI automation yet.

Tasks:

- Define front/back sketch input requirements.
- Create landmark schema.
- Create `sketch-intent` source asset and trace-layer model.
- Create `LayeredSourceDocument` shape:
  - reference image layer
  - croquis/guide layer
  - editable trace layer
  - semantic vector layer
  - callout layer
  - pattern-affecting annotation layer
  - visual-only annotation layer
- Build or script a simple annotation flow:
  - load sketch
  - mark center front/back
  - mark shoulders
  - mark neckline
  - mark armhole
  - mark waist/hip/hem
  - mark side silhouette
- Convert landmarks to garment parameters.
- Compare generated pattern silhouette to sketch silhouette.
- Produce ambiguity questions before generation.
- Keep all inferred parameters editable.

Deliverables:

- `docs/project/SKETCH-LANDMARK-SCHEMA.md`
- Annotated sample sketch JSON.
- Pattern generated from annotated sketch.

Acceptance criteria:

- User can manually annotate a sketch and generate a pattern.
- Parameters are inspectable and editable.
- Bad/ambiguous landmarks produce clear validation messages.

## Phase 5: First 3D Preview

Goal: assemble the generated pattern into a coarse 3D garment preview.

Tasks:

- Implement `preview-3d` package boundary.
- Create simple avatar from measurements or use a parametric placeholder.
- Triangulate generated panels.
- Place front/back panels around avatar.
- Stitch side/shoulder seams in preview.
- Show basic draped/relaxed form or static assembled shell.
- Report collisions/clearance roughly.
- Preserve the pattern graph as source of truth; preview must not silently rewrite pattern geometry.
- Show visual comparison against intended silhouette if feasible.
- Link preview warnings to validation report IDs where possible.

Deliverables:

- Browser or Blender-based preview.
- Screenshot artifact.
- Validation report including rough fit/ease checks.

Acceptance criteria:

- Generated panels appear in 3D around an avatar.
- Front/back/side orientation is correct.
- Seams are visibly paired.
- Preview failure does not block SVG export.

## Phase 6: Export Package

Goal: package the pattern as something a human can review and potentially mock up.

Tasks:

- Implement `export-core` package boundary.
- Export clean SVG.
- Add tiled print/PDF path.
- Add cut sheet.
- Add assembly instructions.
- Add validation report.
- Add source sketch and parameter summary.
- Add versioned JSON pattern graph.
- Leave machine-cutter output out of scope except for preserving structured data that could support it later.

Deliverables:

- `garments/a-line-dress-tunic/outputs/a-line-dress-tunic-v0/`
  - `pattern.svg`
  - `pattern.pdf` or print-ready HTML/PDF notes
  - `pattern.json`
  - `cut-sheet.md`
  - `assembly.md`
  - `validation.md`

Acceptance criteria:

- A human can open the package and understand what to cut.
- Pattern pieces are labeled.
- Instructions identify fabric assumptions and finishing method.
- Validation report states known limitations.

## Phase 7: Human Review And Muslin Gate

Goal: find out whether the output is merely pretty or actually useful.

Tasks:

- Patternmaker review.
- Sewer/maker review.
- Fix obvious drafting errors.
- Print and tile test.
- Optional muslin mockup.
- Record defects and next steps.

Deliverables:

- `docs/research/prototype-1-review.md`
- Updated backlog.
- Decision: continue A-line tunic, add zipper/darts, or move to second garment.

Acceptance criteria:

- Review identifies concrete pattern issues.
- Roadmap updates from evidence, not vibes.
- Prototype is either accepted as a viable base or scoped to a refinement pass.

## Phase 8: Automation Upgrade

Goal: replace manual landmarking with assisted sketch parsing.

Tasks:

- Preserve manual correction as the primary fallback.
- Add assistant-facing summaries before adding autonomous parsing.
- Build clean sketch dataset.
- Try contour extraction.
- Try garment/person segmentation.
- Try VLM parameter extraction.
- Compare automated landmarks against manual annotations.
- Add confidence scores.
- Keep manual correction in the UI.

Deliverables:

- Automated sketch parser spike.
- Accuracy report.
- Human correction flow.

Acceptance criteria:

- Auto parser improves speed without hiding uncertainty.
- User can override every inferred landmark.
- Failed detections degrade gracefully.

## Phase 8.5: 3D Mesh To Pattern Research Branch

Goal: evaluate the paper-derived route after the pattern graph/export/validation stack exists.

Tasks:

- Create or import a simple 3D sleeveless tunic mesh.
- Identify or prototype a patch-layout workflow with user seam hints.
- Evaluate whether an anisotropic textile flattening library exists or must be built.
- Convert generated patches into `PatternGraphCandidate`.
- Run the same validation harness as the pattern-first route.
- Compare output against grammar-generated pattern.

Deliverables:

- `docs/research/mesh-to-pattern-spike.md`
- Candidate pattern output and validation report.

Acceptance criteria:

- Mesh-derived output can be represented in the same pattern graph.
- Validation catches seam, dart, grain, and panel-complexity problems.
- The branch is either promoted, backlogged, or rejected with evidence.

## Phase 9: Second Garment Decision

Goal: decide the next expansion based on what prototype 1 proved.

Candidates:

- T-shirt: simpler construction but knit/stretch questions.
- Sleeved woven top: adds sleeve cap and armscye, very valuable.
- Simple skirt: easier, but less representative after tunic.
- Hoodie: commercially interesting but too complex until sleeves/hood/knit are understood.

Recommendation:

Add a sleeved woven top next if prototype 1 succeeds. It forces the system to learn sleeve/armscye relationships, one of the key cliffs in real garment drafting.

## Prototype 1 Completion Definition

Prototype 1 is done when:

- The system generates a first-garment pattern from measurements.
- The system generates the same pattern from manually annotated sketch landmarks.
- The exported package includes SVG/PDF path, JSON, cut sheet, assembly instructions, and validation report.
- A simple 3D preview exists.
- A human review has produced concrete pass/fail notes.
- The next prototype decision is recorded in the decision log.
