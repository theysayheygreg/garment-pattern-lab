# Garment Pattern Lab

An automated garment-pattern research and prototype project.

The idea: take a 2D garment sketch on a figure, infer a 3D garment fitted to a target body, and produce real 2D sewing-pattern panels with cut and assembly instructions.

The practical thesis is sharper than "UV unwrap a mesh." UV unwrapping is useful geometry, but a garment pattern is semantic manufacturing data: panels, seam relationships, ease, darts, grainline, notches, seam allowance, labels, fabric assumptions, grading rules, and sewing order. The pattern should be the source of truth, with 3D simulation used to prove and refine it.

## Product Direction

**Sketch + body measurements/avatar -> semantic garment topology -> parametric 2D pattern -> 3D drape validation -> exportable sewing package.**

The first prototype targets one garment type:

**Sleeveless A-line dress/tunic for woven fabric**, front/back sketch input, one target body measurement set, SVG/PDF pattern export, and a simple 3D preview.

Why this garment:

- It avoids sleeve-cap/armscye complexity in the first pass.
- It still exercises important real pattern concepts: bodice fit, waist/hip ease, shoulder slope, side seams, darts or dartless shaping, hem sweep, grainline, notches, seam allowance.
- It can be validated by both pattern logic and a visible 3D drape.
- It is familiar enough that bad output is obvious.

## Current State

This is a project seed, not an implementation repo yet.

The initial docs contain:

- Product plan and MVP boundary.
- Roadmap to first prototype.
- Dependency map.
- Research queue.
- Reference bibliography.
- Notes on why UV unwrapping is not enough by itself.
- Initial decisions and open questions.

## Project Structure

```text
docs/
  project/       Roadmap, product plan, dependencies, research queue, backlog
  reference/     Bibliography and technical landscape notes
  design/        Product/design specs for garment and workflow
  journal/       Decision log, devlog, changelog
  research/      Future ingestion notes and experimental reports
  artifacts/     Generated images, diagrams, screenshots, exported patterns
prototype/       Future prototype code and experiments
handoffs/        Agent handoff notes
```

## Working Docs

- [Product Plan](docs/project/PRODUCT-PLAN.md)
- [Build Plan](docs/project/BUILD-PLAN.md)
- [Project Board](docs/project/PROJECT-BOARD.md)
- [Product Knowledge Graph](docs/project/KNOWLEDGE-GRAPH.md)
- [Roadmap](docs/project/ROADMAP.md)
- [Dependencies](docs/project/DEPENDENCIES.md)
- [Research Queue](docs/project/RESEARCH-QUEUE.md)
- [Reference Index](docs/reference/REFERENCES.md)
- [UV to Pattern Notes](docs/reference/UV-UNWRAP-TO-PATTERN.md)
- [Computational Pattern Making Paper Ingest](docs/reference/papers/computational-pattern-making-2202.10272-ingest.md)
- [Fundamentals Ingest](docs/reference/FUNDAMENTALS-INGEST.md)
- [Commercial Software Ingest](docs/reference/COMMERCIAL-SOFTWARE-INGEST.md)
- [Open Tools Ingest](docs/reference/OPEN-TOOLS-INGEST.md)
- [UV Geometry Ingest](docs/reference/UV-GEOMETRY-INGEST.md)
- [Research Papers Ingest](docs/reference/papers/RESEARCH-PAPERS-INGEST.md)
- [First Garment Spec](docs/design/FIRST-GARMENT.md)

## Prototype Definition

The first prototype is successful when it can:

1. Accept a simple front/back sketch or traced vector of a sleeveless A-line dress/tunic.
2. Infer core design parameters: neckline, shoulder width, armhole depth, waist/hip/hem silhouette, length, dart preference, and seam placement.
3. Generate editable 2D pattern panels from a measurement set.
4. Add seam allowance, grainline, notches, labels, and cut counts.
5. Produce a basic 3D assembled preview on an avatar.
6. Export SVG/PDF with a cut sheet and assembly order.
7. Preserve a machine-readable pattern representation for later grading and simulation.

## Non-Goals For Prototype 1

- Any-garment generation.
- Production-grade grading across a full size range.
- Knit fabric simulation.
- Sleeves, collars, plackets, pockets, linings, facings beyond simple neckline/armhole binding notes.
- Fully automatic physical fit guarantee.
- Factory-ready tech pack.
- Commercial CAD interoperability beyond SVG/PDF exploration.

## Core Principle

Constrain the output through a pattern grammar first. Let AI infer design intent, but do not let an unconstrained mesh become the sewing pattern.
