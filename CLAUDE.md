# Agent Notes

This project follows the durable documentation shape used in Last Black Hole / Last Singularity:

- `docs/project/` for planning, roadmaps, dependencies, scope, and handoff-ready specs.
- `docs/reference/` for research and external-source notes.
- `docs/design/` for product behavior and artifact specs.
- `docs/journal/` for decisions, devlog, and changelog.

## Rules

- Keep research citations in `docs/reference/REFERENCES.md` unless a task needs source-specific notes elsewhere.
- When a product or technical decision is made, append to `docs/journal/DECISION-LOG.md`.
- When a meaningful doc or prototype change lands, update `docs/journal/CHANGELOG.md`.
- Keep prototype 1 scoped to one garment type unless Greg explicitly expands the target.
- Treat "UV unwrap" as a geometry tool, not the product architecture.
- Prefer pattern grammar and explicit sewing topology over unconstrained mesh flattening.
- Do not claim manufacturability without an exported pattern package and human review criteria.

## First Prototype Boundary

Target garment: sleeveless A-line woven dress/tunic.

Primary output: SVG/PDF printable pattern package with panels, seam allowance, grainline, notches, labels, cut counts, and assembly instructions.

Secondary output: simple 3D drape preview for validation.

## Definition Of Done For Planning Tasks

A planning task is not done until it states:

- What is in scope.
- What is out of scope.
- Dependencies.
- Acceptance criteria.
- Unknowns that need research.
- The next concrete implementation step.

