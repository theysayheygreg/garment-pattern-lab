# Orrery Design Review — 2026-05-03

Reviewer: Orrery (architecture/structure orb in the Orb Army; Claude Code, Opus 4.7).

Scope: high-level product direction, lower-level design, and roadmap of Garment Pattern Lab as of 2026-05-03, before any implementation has started.

Lens: the six product pillars (natural intent, PatternGraph as craft contract, trace as bridge, validation before beauty, 3D as feedback, narrow services), plus a deliberate hunt for structural risks the existing docs do not yet name.

Source material: `README.md`, `CLAUDE.md`, `AGENTS.md`, and the working docs under `docs/project/`, `docs/journal/`, `docs/design/`, `docs/reference/`. No code yet exists; scaffold under `app/`, `packages/*`, and `garments/a-line-dress-tunic/` is README-only.

These are findings, not decisions. They surface ambiguities, missing constraints, premature commitments, and pillar-pillar tensions that should be resolved before B1 turns into committed schema. Two items are already aligned with Greg in conversation and are marked **[aligned]**.

---

## Product Direction

### 1. The natural-language pillar is the differentiator and the least-designed thing in the project

Pillar 1 names natural intent over CAD operation as the product's core stance. The build order puts the assistant loop at B8, after schema, validation, geometry, generator, export, and 3D preview have all been shaped. By the time B8 begins, every earlier layer will have silently committed to parameter names, error message formats, gate behaviors, and validation language that may not survive contact with conversational gestures.

If "make the hem longer" is supposed to be a real input, then the schema, the validation harness, and the candidate-promotion gate need to be designed *with conversational surface in mind* from the first fixture. Otherwise B8 becomes a translation layer over a system that doesn't speak the language.

**Decision needed:** Is the natural-language interface a real v1 surface, or aspirational/v2? If real, B8 becomes a *constraint on B1–B7*, not a separate slice. If aspirational, the differentiator should be re-stated to match what v1 actually delivers (probably: explicit semantic handles + transparent assumptions, not free-form NL).

### 2. There is no patternmaker named in the project

Kiko is a designer. The system replaces a junior patternmaker. Those are different crafts. Designers can judge whether a sketch is the garment they meant; patternmakers judge whether the resulting pattern actually walks, eases, drapes, and assembles. The drafting formulas, dart logic, ease defaults, finishing notes, and notch placement encode patternmaking judgment that needs human review by someone who has drafted or sewn many garments.

The build order's only human review checkpoint is B10, after everything is built. That's a single expensive review at the end, on top of patternmaking assumptions encoded throughout B1–B9.

**Decision needed:** Who validates the rulebook? Options: Kiko if she's patternmaking-literate enough; a paid sewing-literate consultant for one or two early reviews; an open-source pattern-truth fixture from FreeSewing or similar audited by someone qualified, used as a ground-truth target instead of writing rules from scratch.

### 3. "First principles for the designer" and "validation before beauty" pull in opposite directions

A designer wanting to see her pattern fast is the goal. A system that demands seventeen confirmations before generating is the failure mode. The docs name this softly with "assumed," "needs review," "confirmed" — but B2 (validation) is being shaped as a machine-readable report, while B8 (assistant loop) is where conversational tone arrives. Two voices for one concept.

**Decision needed:** Validation should always run internally, but the user only ever hears it in design language. "I assumed a 1cm seam allowance — change?" not `seam_allowance_undeclared`. Commit to that voice before B2, otherwise the validation harness will be retrofit-translated later.

### 4. The canvas question is unresolved

Kiko's working surface is a canvas — layers, croquis, callouts, references on a grid. Pattern Lab's stated stance is "not Illustrator." But the architecture names `LayeredSourceDocument`, `SemanticVectorLayer`, `EditableTraceLayer`, `TechnicalSketchCallout` — canvas-shaped primitives. Either v1 has its own canvas (and the project is building 30% of Illustrator whether it intended to or not), or upstream tools own the canvas and Pattern Lab plugs into a confirmed-intent payload (Kew, Figma, Procreate exports, etc.).

**Decision needed:** Does v1 own the canvas, or accept upstream input? This is a fork. Pick a branch.

### 5. The AI-fashion competitor lane is not addressed

Optitex/CLO/Browzwear/Lectra have been studied as expert-CAD competitors. Kew/Onshape have been studied as collaboration/PDM/PLM analogs. The *near* competitor — text-to-pattern generators, AI sample-room services, mesh-flatten-as-pattern startups — is not named anywhere in the docs. Pattern Lab's whole answer to that lane is implicit (validation, transparency, designer correction, manufacturability proof), but it should be explicit because that is the noisier market the product will be compared to.

**Decision needed:** Add a competitor-lane note for AI-fashion startups, name what Pattern Lab is *not* (a black-box generator) and what the differentiator is *against that lane* (visible reasoning, validated craft contract, designer correction).

---

## Lower-level Design

### 6. The candidate-to-pattern promotion gate is a state machine, not a checklist **[aligned]**

Validation has at least four real states the docs blur into one: hard error (block), soft error (auto-correct or ask), warning (proceed with note), and assumption (proceed with provenance). Different garments and different export targets will want different policies. The current docs treat the gate as a flat checklist; that won't survive the second garment family.

**Move:** Design the gate as a small state machine before the validation harness goes deep. Each check declares a severity tier; promotion logic is policy over those tiers. Greg has aligned on this regardless of the other open decisions.

### 7. The schema decisions deferred today become philosophy tomorrow

Where do darts live — as panel properties, or as first-class graph nodes? Are facings panels-of-panels or sibling panels with parent references? Is a foldline a constraint on a panel boundary or its own edge type? Is a notch attached to an edge, a panel, or a seam pair? Each choice encodes patternmaking opinion. Defer them and the first garment's incidental shape becomes the schema.

**Move:** When B1 hand-authors the seed fixture, *also* make these schema choices explicitly and write them as a short ADR-style note inside the schema doc. The first fixture is the schema.

### 8. The geometry-kernel boundary is probably premature

The build order has B3 (Geometry Kernel V1) before B4 (First Garment Generator). The architecture overview commits to defining `GeometryKernel` and `PatternKernel` interfaces before implementation. That's the standard "interfaces before code" instinct, and it's the wrong shape for a project this early — interfaces designed in advance of code tend to be the wrong interfaces.

**Move:** Reverse B3 and B4. Write the first garment generator with whatever inline geometry it needs (`@flatten-js/core` directly, ad hoc helpers, copy-paste). Once the operations stabilize across the first valid generator, *extract* the kernel boundary from the operations the generator actually used. That gives a kernel constrained by real use, not by speculation.

### 9. There is no revision or branching model, and Onshape was studied as if there will be one

Every parameter adjustment forces a decision: mutate the current `PatternGraph`, branch a new one, or append an operation. The knowledge graph names `PatternGraphRevision`, `WorkingDraft`, `ImmutableVersion`, `ReleasedPatternPackage` — but no actual model exists. Defer this past B4 and retrofitting under pressure is painful.

**Move:** Commit to a Graphite-style operation DAG: the user's edit history is the source of truth, the current `PatternGraph` is its evaluation result, immutability comes for free. Decide before B4. This also gives natural-language edits a clean home (each NL command becomes one operation in the DAG with the user's words attached as the edit's provenance).

### 10. The 3D preview has no place to put what the user does in it

B6 produces a static 3D assembly preview. The moment a user looks at it and says "this seam looks wrong" — there's no representation for that thought. Either the 3D view is read-only (worth saying out loud and matching the UI), or annotations from the 3D view are pattern-affecting and need to round-trip into validation (worth designing).

**Move:** For v1, declare the 3D preview read-only. Add a `validation-flag-from-3d` follow-on to the backlog so that when it becomes interactive, the schema is ready.

### 11. The schema does not separate body measurements from pattern measurements

`MeasurementSet` is the input — the wearer's body. But the pattern itself has measurements: bust line position on the front panel, dart depth, distance from shoulder point to armhole bottom. Right now both live under one umbrella. Blurring them costs nothing today and a refactor when grading shows up.

**Move:** Two named entities — `BodyMeasurementSet` (input) and `PatternMeasurements` (derived geometry properties on the `PatternGraph`). Add to the schema with B1.

### 12. Fabric realizability is not in v1 validation

A pattern that doesn't fit on a 60cm bolt isn't a pattern. The docs put marker planning in "later services." That's defensible if v1 explicitly states it. The risk: the prototype's success criterion ("would a sewer make a muslin from it") quietly assumes infinite fabric width.

**Move:** Add a `KnownLimitations` block to the v1 validation report that names what isn't checked yet — fabric layout, grading, drape behavior, etc. Make the absence visible to the reviewer instead of pretending it isn't there.

### 13. Validation needs to suggest fixes, not just report defects

"Front armhole is 2cm longer than back" is a true statement that no designer can act on. "Try moving the shoulder point inward by 1cm" is a fix in design language. That's a separate body of patternmaking knowledge — orthogonal to the drafting formulas, and not currently scoped.

**Move:** Add a `FixSuggestion` field to validation findings. v1 can have a small library of suggestion templates per check; later versions can grow it. Without this, the validation report tells the designer something is wrong and leaves them stranded.

---

## Roadmap

### 14. The first prototype should be a dirty end-to-end spike, not a clean-layer-by-layer build **[aligned]**

B0–B10 as currently written is sequential — perfect the seed, then validation, then geometry, then generator, etc. The prototype isn't testable end-to-end until B10. That's a long time before the integration questions become visible.

**Move (aligned with Greg):** A 3-day "ugliest possible end-to-end" pass: hand-authored seed → trivial validator → hand-coded generator on one measurement set → SVG with hardcoded labels → static 3D placement. v0.1 ships as one verifiable garment running through the whole pipeline. *Then* return to harden each layer with the integration questions visible.

### 15. There is no early human checkpoint with a real patternmaker

Build slice B10 is the only human review gate, after B0–B9. The cost of building B5–B9 on a wrong rulebook is enormous compared to the cost of a 30-minute conversation after B4 (or after the dirty v0.1 spike).

**Move:** Add an explicit checkpoint after the v0.1 dirty spike: print the pattern, hold it next to a known-good A-line tunic pattern, ask Kiko or a sewing-literate friend "is this insane?" Record the outcome in `docs/research/`. Repeat after B6 with the assembly preview.

### 16. Three decomposition systems are tracking the same project

`M0–M6` milestones in the build plan, `B0–B10` build slices in the prototype build order, `RR1–RR12` research lanes in the roadmap. They cross-reference but don't reconcile. When something lands, does it close a research lane, complete a build slice, or finish a milestone? Some answers are obvious; some aren't.

**Move:** Pick one canonical decomposition (B0–B10 is the most concrete). Make M0–M6 and RR1–RR12 either views over B0–B10 or fold them into it. Less bookkeeping, no orphaned items.

### 17. M0's dependencies block B1, but they're tracked as separate items

M0 has unchecked items: drafting formulas (M1), pattern schema (M2), validation checklist (M2.5), tech-stack decision. B1 (hand-author seed) needs the first three to write a valid candidate. So they have to be done together, in one bundled pass. The board reads as a linear list of separate work.

**Move:** Bundle M1 + M2 + M2.5 + B1 + the patternmaker checkpoint into one named move: *write one fixture, learn the schema, write the rules from the fixture, write the validator that proves the fixture, hold it next to a real pattern.* That single move is what produces v0.1's ground truth.

### 18. IP and consent for human uploads is named, not designed

`InputProvenance` records consent state. The product position note says privacy/consent matters. But the actual IP story — what happens when Kiko uploads her sketch, who owns derived fixtures, what's the training-data position, what's the pattern-output ownership — isn't designed.

**Move:** Not blocking for v1 implementation, but blocking for any real designer using the product. Add to backlog with explicit acceptance criteria. Solve it before any human-lane upload UI ships.

---

## Suggested Move Order

1. Step through findings 1, 2, 3, 4 (product-direction decisions) in conversation. These shape everything downstream.
2. Bundle M1 + M2 + M2.5 + B1 into the v0.1 dirty-spike move (finding 14 + 17). Include schema decisions from finding 7, the body-vs-pattern measurement split from finding 11, and the gate-as-state-machine framing from finding 6.
3. Reverse B3/B4 (finding 8). Generator first, kernel later.
4. Commit to operation-DAG revision model (finding 9) before B4.
5. Add the early patternmaker checkpoint (finding 15) and the `KnownLimitations` validation surface (finding 12).
6. Rationalize the three decomposition systems (finding 16) once v0.1 has shipped — the right shape will be more visible by then.

## What the Review Did Not Cover

- Detailed package-by-package design review (deferred until first generator code exists; review at that point will be more useful).
- Specific drafting formula correctness (requires patternmaker, not architecture review).
- License/IP analysis of named reference corpora (requires legal, not architecture review).
- Performance/runtime considerations (premature; no code yet).

This review is intended as a structural sanity check before implementation locks in shapes. Re-review after v0.1 ships.
