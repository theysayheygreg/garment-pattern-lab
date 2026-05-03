# Roadmap To Prototype 1

## Prototype Target

Build a first working prototype for one garment type:

**Sleeveless A-line woven dress/tunic from front/back sketch to printable pattern package.**

The first prototype should prove the full pipeline at small scale:

```text
sketch -> landmarks -> design parameters -> pattern graph -> SVG/PDF pattern -> simple 3D preview -> validation report
```

## Current Status

Project seed created. Research references collected. No implementation has started.

## Guiding Constraints

- One garment type only.
- Manual controls are allowed wherever automation is uncertain.
- Pattern grammar is the source of truth.
- 3D preview validates and communicates; it does not own the pattern.
- SVG/PDF export matters more than photorealistic drape.
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

Not parallelizable:

- Pattern generator depends on drafting rules and schema.
- Automated sketch parsing should wait until manual landmark mapping works.
- Fit automation depends on generated pattern and preview validation.

## Phase 0: Project Grounding

Goal: turn the idea into an implementation-ready spec.

Tasks:

- [x] Create project folder and LBH-style docs structure.
- [x] Capture initial references.
- [x] Define first prototype garment.
- [x] Write product plan.
- [x] Write dependency map.
- [x] Write research queue.
- [ ] Ingest one public/free patternmaking reference into concise notes.
- [ ] Draft first-garment formula sheet.
- [ ] Decide prototype tech stack.

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
- Define export metadata.
- Create a hand-authored JSON example for the first garment.

Deliverables:

- `docs/project/PATTERN-SCHEMA.md`
- `prototype/examples/a-line-tunic.pattern.json`

Acceptance criteria:

- Schema can represent the first garment without hidden assumptions.
- Schema distinguishes seam line from cut line.
- Schema can be exported to SVG.
- Schema can be checked for seam-length compatibility.

## Phase 3: Minimal Pattern Generator

Goal: generate the first garment from measurements and parameters with no sketch input yet.

Tasks:

- Create prototype project skeleton.
- Implement measurement entry or fixture JSON.
- Implement garment parameter fixture.
- Generate front/back panels as vector geometry.
- Generate seam lines.
- Add seam allowance/cut lines.
- Add grainline.
- Add notches.
- Add labels and cut counts.
- Add simple construction order.
- Implement seam-walk validation.
- Export SVG.

Deliverables:

- Working script/app that generates an SVG pattern for the first garment.
- Example output in `docs/artifacts/` or `prototype/outputs/`.
- Validation report.

Acceptance criteria:

- Front and back panels are closed.
- Side seams match within tolerance.
- Shoulder seams match within tolerance.
- Neckline and armhole finishing instructions are present.
- SVG opens in Inkscape/Illustrator/browser.
- Pattern includes measurement and parameter provenance.

## Phase 4: Manual Sketch Landmark Mapping

Goal: connect sketch input to pattern parameters without betting on full AI automation yet.

Tasks:

- Define front/back sketch input requirements.
- Create landmark schema.
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

- Create simple avatar from measurements or use a parametric placeholder.
- Triangulate generated panels.
- Place front/back panels around avatar.
- Stitch side/shoulder seams in preview.
- Show basic draped/relaxed form or static assembled shell.
- Report collisions/clearance roughly.
- Show visual comparison against intended silhouette if feasible.

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

- Export clean SVG.
- Add tiled print/PDF path.
- Add cut sheet.
- Add assembly instructions.
- Add validation report.
- Add source sketch and parameter summary.
- Add versioned JSON pattern graph.

Deliverables:

- `prototype/outputs/a-line-tunic-v0/`
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
- Prototype is either accepted as a viable base or scoped to a repair pass.

## Phase 8: Automation Upgrade

Goal: replace manual landmarking with assisted sketch parsing.

Tasks:

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

