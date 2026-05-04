# Persona 2: Production-Focused Garment Designer

Date: 2026-05-03

**Version target: v0.5+ — primary user when production features land.**

The user the model lane (R-Model, variants, grading, dependency propagation) ultimately serves. v0.1 doesn't try to serve them; v0.5 starts to.

## Identity

Designer at a small-to-mid studio or brand. Technical designer, product developer, or design lead. Has formal training (fashion school, apprenticeship, or years at a brand) and probably works in a team. Owns design intent *and* spec for a garment family. Hands work off to a sample room and then to a factory.

## Context

Works with collaborators: other designers, technical designers, sample sewers, factory partners, sourcing. Tools today: Optitex, Gerber AccuMark, or CLO 3D for production patterns; Adobe Illustrator for technical sketches; Excel for size charts and bills of materials; Slack and email for factory communication. Increasingly, CLO and Browzwear for 3D fit preview before sampling.

The pain they currently feel:

- Too many disconnected tools; version control between sketches, tech sketches, patterns, and grading is manual and error-prone.
- Semantic changes don't propagate. Change a neckline depth in the sketch and the pattern still has the old neckline; change a shoulder width and the armhole has to be manually re-walked.
- Grading is done by a separate specialist or by manually tabulating per-size adjustments — both slow.
- Variants (style options for the same silhouette) require duplicating files and editing them in parallel; comparing them is screenshots in Slack.
- Factory miscommunication causes sample rework. The tech pack and the pattern drift.

## Quality Bar

**"I can iterate fast, the system understands when one change implies another, the size run is right, and the factory sees what I intended."**

Success here is measured in iteration speed and design-intent fidelity — how many design rounds per week, how often samples come back wrong because the system lost the intent.

## Relationship To The Product

**What they see** (the user surface — garment language, studio dialect):

- Everything Persona 1 sees, plus:
- Variant grids: "show me three lengths side by side," "compare scoop vs square neckline."
- Grading axes: a base pattern plus its size run, with grade rules visible and editable.
- Dependency propagation visualization: when I change the shoulder width, the system shows me which other features it adjusted automatically.
- Comparison views: two patterns diffed at the seam-pair, dart, and silhouette level.
- A staged release workflow: draft → reviewed → released → in-production.
- Tech-pack-adjacent export: panel labels, cut counts, construction order, fabric assumptions, size run, ready for handoff (not yet industrial-format though — that's Persona 3).

**What they do not see** (same as Persona 1 — engine instrumentation, validation internals, model confidence scores, debug panels).

**What they bring:**

- More structured input than Persona 1: brand specs, body block, fit notes, target size run, fabric assumptions.
- A team to share with.
- Constraints from the brand (silhouette family, fit philosophy, finishing standards).

**What they take away:**

- Pattern with grading.
- Variants for design review.
- Partial tech-pack data ready for the factory.
- Revision history that survives review cycles.

## Version Target

**v0.5+ when production features land. Deferred from v0.1.**

What v0.5+ adds for them: variant generation, grading rules, dependency-propagation operations on the DAG, comparison views, multi-pattern workspace, partial tech-pack composition, light revision/release workflow.

What is still deferred to later versions: full PLM, multi-user real-time collaboration, full industrial export (that's Persona 3 at v1+).

## User Stories

1. **As a production designer,** I want changes to a sleeve or shoulder to propagate automatically to the connected armhole and bodice, so that I don't have to manually re-walk seams every iteration.

2. **As a production designer,** I want to generate a graded size run from a base pattern in one operation, so that I can hand off a complete size set to the factory without waiting on a separate grading pass.

3. **As a production designer,** I want to compare two pattern variants side-by-side (scoop vs square neckline, two hem lengths, with-dart vs without-dart), so that I can choose with my team in a review meeting.

4. **As a production designer,** I want to lock certain measurements (the brand's body block) and vary others (style features), so that brand fit consistency is preserved across designs in a season.

5. **As a production designer,** I want the system to track which patterns are in development versus released, so that I don't accidentally hand off a draft to the factory.

6. **As a production designer,** I want to attach fabric assumptions to a pattern (drape, weight, stretch) and have the system warn me when those assumptions break the design (a stretch fabric removing the need for ease, a heavy fabric requiring stronger seams), so that fabric mismatches don't cause sample failures.

7. **As a production designer,** I want the assistant to surface semantic implications ("this dart transfer would shift the bust apex by X cm — confirm?"), so that I can review craft consequences before committing.

8. **As a production designer,** I want to share a pattern with my sample room with comments and revision history, so that we can iterate without losing context across the handoff.

9. **As a production designer,** I want to export a partial tech pack alongside the pattern (panel labels, cut counts, fabric, size run, construction order), so that the factory has the production context they need.

10. **As a production designer,** I want to bookmark and reuse common construction patterns (preferred seam types, finishing methods, hardware, my signature dart style), so that I don't redo standard work for every design.

## Anti-Stories

- I do **not** want to lose existing patterns; if I move work into the system, I expect migration paths from Optitex / Illustrator / current tools.
- I do **not** want to manage all my work in chat; I want a structured workspace with named artifacts and revisions.
- I do **not** want to lose grading control to the system; the assistant should propose, I should confirm.
- I do **not** want a closed black-box generator; I want to inspect and override every pattern choice.
- I do **not** want my brand's body block to leak across projects; access control is real for me even at v0.5.
- I do **not** want to wait for a separate grading specialist for every revision.

## Voice

Garment language plus production language.

**Vocabulary they use:** all of Persona 1's vocabulary, plus block, sloper, grading, size run, base size, grade rules, tech pack, BOM, marker, fit notes, approval gate, release, factory handoff, sample room, fitting, fit model, tolerance.

**Vocabulary they don't use yet (Persona 3 territory):** DXF, AAMA, ASTM, AccuMark layer numbers, factory machine profile.

**Tone they expect:** competent collaborator, fast, doesn't waste their time. The assistant should propose with confidence and accept overrides without arguing. They are professionals; the system should match their pace.

## Open Questions

- Multiplayer collaboration model: real-time co-editing (Figma-shape) or asynchronous review with revisions (GitHub-shape)? Probably the latter for v0.5; the former is heavier infrastructure.
- IP and access control between projects, brands, and seasons. Touches Orrery review finding 18.
- How much of the existing tools (Illustrator for tech sketches, CLO for 3D, Excel for BOM) do they expect to keep using alongside Pattern Lab? Coexistence vs replacement timeline.
- Brand-block libraries: does the system support proprietary blocks per brand, or expect the user to import per project?
- Handoff format to Persona 3 / sample rooms / factories: tech pack PDF, structured JSON, both?
