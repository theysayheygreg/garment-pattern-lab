# Personas

Three canonical user personas anchor every design decision in Garment Pattern Lab. They are not marketing avatars; they are scope-defining tools. When a feature is debated, the first question is "which persona does this serve, and at which version?"

The three:

- [Persona 1 — Individual Fashion Designer](persona-1-individual-designer.md) — indie / advanced home sewer / costume designer. v0.1 target.
- [Persona 2 — Production-Focused Garment Designer](persona-2-production-designer.md) — small studio / brand designer / technical designer. v0.5+ target.
- [Persona 3 — Manufacturing-Focused Designer](persona-3-manufacturing-designer.md) — factory liaison / sample-room manager / technical manufacturer. v1+ target.

## How To Use Them

- **For scope decisions:** ask which persona owns the feature and which version it lands in. If the feature serves no persona at v0.1's version, defer it.
- **For language decisions:** match the user-surface voice (workbench UI, assistant collaborator, pattern package output) to the persona's vocabulary. Persona 1 speaks home-sewing language; Persona 2 speaks studio/production language; Persona 3 speaks factory language. The garment-language commitment binds for all three but the dialect varies.
- **For schema decisions:** internal data model is invisible to all three personas. The graph topology serves Persona 2's semantic-propagation needs and Persona 3's export needs; v0.1 just instantiates a slice of it for Persona 1.
- **For design reviews:** when reviewing existing work, audit which persona it serves and whether it accidentally serves no one or the wrong one.

## What These Personas Are Not

- Not marketing personas. We are not optimizing acquisition funnels.
- Not user-research deliverables. They are scope-defining product decisions made by Greg.
- Not exhaustive of every possible user. They define the canonical priority lanes; edge cases get triaged against them.
- Not version-locked. A user can grow from Persona 1 to Persona 2 over time; the product accommodates that progression.

## Source Of Truth

The persona definitions in these files are canonical. Other docs (PRODUCT-DESIGN, PRODUCT-PILLARS, PRODUCT-PLAN, ROADMAP) reference them rather than restating user attributes.

When personas evolve, update the files here and add a decision-log entry. Other docs should automatically reflect the change because they reference rather than copy.
