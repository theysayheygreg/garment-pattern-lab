# Codex Response To Orrery Design Review

Date: 2026-05-03

Purpose: give Claude or any future agent a direct, opinionated response to `docs/research/orrery-design-review-2026-05-03.md`.

Short version: Orrery's review is valuable because it pushes against beautiful architecture before contact with reality. I would adopt its sequencing corrections and schema/validation warnings immediately, but I would not let it expand v1 into collaboration, canvas ownership, full natural language, permissions, IP policy, or lifecycle tooling. The next move should be one ugly garment through the whole pipeline.

## Overall Assessment

Orrery is right that the project is currently stronger as a product/research thesis than as a first build plan. The docs are coherent, but the build plan still risks creating clean layers before the first garment proves what the layers need to be.

My capital-O opinion:

**Do not build a cathedral of abstractions before one ugly garment goes from parameters to pattern package to preview.**

The second important correction:

**If natural language is the differentiator, it cannot arrive at the end as a chatbot skin. Even if v1 does not do open-ended natural language, schema fields, interpretation summaries, package readiness, and user-facing choices should all speak in designer-facing garment language from fixture one.**

## Point-By-Point Opinion

### 1. Natural language is the differentiator and least-designed thing

Agree strongly, with one translation: call it `semantic intent` before calling it natural language.

V1 does not need magic chat. It does need every schema field, validation state, interpretation note, and edit operation to map cleanly to human garment language.

Product consequence:

- `assistant-core` can arrive later as UI, but designer-facing labels and intent semantics must constrain B1 from the beginning.

### 2. There is no patternmaker named

Hard agree. This is the most practical risk in the whole review.

A patternmaker checkpoint early is worth more than five more papers. Kiko may be enough if she is patternmaking-literate for this garment family; otherwise use a sewing-literate/pattern-literate consultant or a known-good open-source pattern as a comparison target.

Product consequence:

- Add a human sanity check immediately after the v0.1 spike.

### 3. First-principles designer flow and validation-before-beauty can pull apart

Agree. The split is not “validation versus speed.” Validation should be internal instrumentation; the designer should experience interpretation, readiness, and occasional garment choices.

Product consequence:

- Do not ship diagnostic-console language.
- Do not make export the first moment the system explains uncertainty.

### 4. The canvas question is unresolved

Agree, and I would choose the narrow branch:

**V1 accepts upstream input plus minimal annotation. V1 does not own a broad canvas.**

Pattern Lab needs a small workbench surface for one sketch, landmarks, parameters, pattern output, and preview. It should not become Kew, Figma, Illustrator, or Graphite.

Product consequence:

- Keep `LayeredSourceDocument`, but only for source/reference/landmark/semantic trace data needed by the pipeline.

### 5. AI-fashion competitor lane is missing

Agree. We need an explicit reference lane for black-box AI pattern/startup competitors.

Pattern Lab's stance against that lane:

- not black-box generation
- not visual plausibility as proof
- visible assumptions
- designer correction
- manufacturability-oriented PatternGraph
- package readiness and human-readable output

Product consequence:

- Add a competitor note before public positioning, but it should not block v0.1.

### 6. Candidate-to-pattern promotion gate is a state machine

Strong agree. This is a real architecture decision.

Internal states should include hard block, normalizable issue, designer choice, assumption, warning/provenance, and limitation. User-facing language should avoid error-console semantics.

Product consequence:

- `validation-core` should output machine state for the engine, but the product shell should translate only the few meaningful design choices.

### 7. Schema decisions deferred today become philosophy tomorrow

Strong agree. The first fixture is not sample data; it is the constitutional convention.

Product consequence:

- B1 must include an ADR-style schema note for darts, facings, foldlines, notches, body measurements, pattern measurements, and seam/cut-line separation.

### 8. Geometry-kernel boundary is probably premature

Mostly agree.

I would keep package boundaries but not pretend we know the right geometry abstraction yet. Build the first generator with direct/simple geometry and extract `geometry-core` from the operations that survive the ugly spike.

Product consequence:

- Reverse practical work: generator-first, kernel-extraction later.

### 9. No revision or branching model

Agree conceptually, but I would avoid a full Graphite-style DAG commitment before v0.1.

Minimum now:

- operation log
- source prompt/input provenance
- parameter-change provenance
- immutable output package revision

Richer DAG later.

Product consequence:

- v0.1 should record operations, but not build branch/merge.

### 10. 3D preview has no place to put what the user does in it

Agree. Declare v1 preview read-only.

Product consequence:

- 3D is feedback, screenshot, and orientation/silhouette sanity check only.
- Interactive 3D annotations can go to backlog.

### 11. Schema does not separate body measurements from pattern measurements

Hard agree. This should land in B1.

Product consequence:

- Use `BodyMeasurementSet` for wearer/body inputs.
- Use `PatternMeasurements` for derived pattern geometry facts.

### 12. Fabric realizability is not in v1 validation

Agree. Do not solve marker planning in v0.1, but say what is not checked.

Product consequence:

- Add `KnownLimitations` / readiness limitations to package output.
- Include fabric layout, grading, true drape behavior, and fit guarantee as not checked.

### 13. Validation needs suggestions, but not IDE-style debugging

Agree with a major wording correction from Greg: do not frame this as “fixing” or “repairing” what the designer broke.

Product consequence:

- Internal validation can produce state for developers and engine quality.
- User-facing product should show interpretation, readiness, confidence, and garment-design choices.
- Avoid console words like error, warning, invalid, repair.

### 14. First prototype should be a dirty end-to-end spike

Strongest agreement.

Product consequence:

- The next implementation move is v0.1: one garment, one measurement set, one ugly generator, one SVG package, one static preview, one validation/readiness report, one human sanity check.

### 15. No early human checkpoint with a real patternmaker

Strong agree.

Product consequence:

- Add a review note after v0.1, not after polished B10.
- The question is simple: “Is this insane, or is it worth refining?”

### 16. Three decomposition systems track the same project

Agree. B0-B10 should become canonical after v0.1. Research-roadmap IDs and milestones can become tags/views.

Product consequence:

- Do not spend time reorganizing before the spike.
- Rationalize after v0.1 reveals the real shape.

### 17. M0 dependencies block B1

Agree. Bundle rulebook, schema, validation, fixture, and human checkpoint into one move.

Product consequence:

- Do not write a giant abstract schema first.
- Write one fixture, learn the schema, write rules from the fixture, validate the fixture, compare against a real pattern.

### 18. IP and consent for human uploads is named, not designed

Agree, but not blocking for local v0.1.

Product consequence:

- No real web upload/product use until ownership, consent, derived fixtures, and training-data posture are designed.
- Local generated/project-owned fixtures are fine for prototype work.

## Decisions I Would Adopt Now

- Start with a dirty v0.1 full-pipeline spike.
- Keep v1 canvas minimal: upstream input plus annotation, not a full editor.
- Treat natural language as semantic intent constraints from the beginning.
- Make validation backend instrumentation and readiness/confidence surface, not a user-facing console.
- Use a promotion state machine internally.
- Separate `BodyMeasurementSet` from `PatternMeasurements`.
- Declare 3D preview read-only for v1.
- Add an early human sanity check.
- Keep IP/consent and AI-fashion competitor mapping as important but non-blocking.

## Decisions I Would Not Adopt Yet

- Full Graphite-style operation DAG.
- Full canvas ownership.
- Full natural-language assistant.
- Collaboration/PDM/PLM.
- Web upload workflow.
- Full geometry-kernel abstraction before the generator proves what it needs.
- Marker/fabric-layout optimization.

## Claude Handoff

If Claude is building next, do not start by polishing architecture. Start with `docs/project/V0.1-SPIKE-PLAN.md`.

The target is intentionally crude:

```text
one garment
one measurement set
one ugly generator
one SVG package
one static preview
one validation/readiness report
one human sanity check
```

Make the first garment real enough to criticize. Then the architecture can earn its shape.
