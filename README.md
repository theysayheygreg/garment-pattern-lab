# Garment Pattern Lab

An automated garment-pattern research and prototype project.

The idea: take a 2D garment sketch on a figure, infer garment intent against a target body, and produce real 2D sewing-pattern panels with cut and assembly instructions.

Product statement:

**A sketch-to-pattern workbench for fashion designers.**

Longer version: Garment Pattern Lab turns fashion sketches into reviewable first-draft sewing patterns, keeping AI and 3D preview behind a sewing-aware pattern graph that designers can inspect, correct, print, and sample.

The product differentiator:

**Garment Pattern Lab is not another mouse-and-keyboard CAD/3D editor. It should be human-centered, natural-language-led, and as close to art -> garment as the craft allows.**

Existing systems prove many of the necessary pillars: grading, fabric simulation, marker planning, 3D preview, tech-pack bridges, and CAD interop. The opportunity is to make those pillars task-led, narrow, validated, and conversational/assistive instead of asking every designer to become an expert CAD operator.

The practical thesis is sharper than "UV unwrap a mesh." UV unwrapping is useful geometry, but a garment pattern is semantic manufacturing data: panels, seam relationships, ease, darts, grainline, notches, seam allowance, labels, fabric assumptions, grading rules, and sewing order. The pattern should be the source of truth, with 3D simulation used to prove and refine it.

## Architecture At A Glance

```text
generated sketch fixture or human-authored sketch
  -> upload / prompt provenance / preprocessing
  -> semantic garment intent
  -> measurements + garment parameters
  -> PatternGraphCandidate
  -> validation / correction / proof
  -> PatternGraph
  -> human-readable pattern package
  -> optional 3D preview / later industrial outputs
```

The core rule:

**`PatternGraph` is the manufacturing source of truth.**

Sketches, meshes, UVs, AI outputs, vector edits, and 3D previews are useful inputs or views. They are not trusted as the sewing pattern until they pass through candidate normalization, validation, correction, and export proof.

## Product Direction

**Sketch + body measurements/avatar -> semantic garment topology -> parametric 2D pattern -> validation -> human-readable sewing package.**

The first prototype targets one garment type:

**Sleeveless A-line dress/tunic for woven fabric**, front/back sketch input, one target body measurement set, human-readable SVG/PDF pattern package, and a simple 3D preview.

Why this garment:

- It avoids sleeve-cap/armscye complexity in the first pass.
- It still exercises important real pattern concepts: bodice fit, waist/hip ease, shoulder slope, side seams, darts or dartless shaping, hem sweep, grainline, notches, seam allowance.
- It can be validated by both pattern logic and a visible 3D drape.
- It is familiar enough that bad output is obvious.

## V1 Output Lane

Prototype 1 outputs a human-readable pattern package:

- SVG pattern sheets.
- Tiled PDF or print-ready package.
- Cut sheet.
- Assembly instructions.
- Validation report.
- Source `PatternGraph` JSON.
- Simple 3D preview.

Industry-standard and machine-readable outputs are a later export lane: DXF/AAMA/ASTM, cutter-ready marker files, CAD round trips, and factory metadata. They should build on the same `PatternGraph`, but they do not define prototype 1 success.

## Main V1 Pipeline

```text
front/back sketch
  -> manual or assisted landmarks
  -> GarmentParameters
  -> first-garment drafting formulas
  -> PatternGraphCandidate
  -> validation
  -> PatternGraph
  -> SVG/PDF/cut instructions
  -> simple Three.js preview
```

The first prototype can use manual landmarking. The real proof is whether the generated pattern package is understandable and useful to a human reviewer.

## Input Lanes

There are two sketch-input lanes:

- GPT Image 2 generated fixtures, where prompt language, controlled variation, and provenance are the main design surfaces.
- Human-authored drawings and vectors, where upload/local-folder ingestion, cleanup, tracing, landmarking, and ambiguity review are the product surface.

Both lanes converge into `InputProvenance`, `LandmarkSet`, `SketchIntent`, and `AmbiguityReport` before drafting begins. See [docs/project/INPUT-LANES.md](docs/project/INPUT-LANES.md).

## Tooling Direction

Recommended prototype stack:

- TypeScript/browser runtime.
- Three.js for live 3D preview.
- SVG/Canvas overlay for sketch annotation.
- `@flatten-js/core` for first geometry primitives.
- `polygon-clipping` or `martinez-polygon-clipping` for polygon booleans.
- `earcut` for preview triangulation.
- `svg-pathdata` / `svgson` for SVG fixture tooling.

Upgrade path:

- Clipper2 / Clipper2-WASM for robust offsets and polygon operations.
- Rust/WASM with `kurbo`, `lyon`, `usvg`, or `resvg`.
- WebGPU for acceleration after correctness is proven.

Reference and prior-art tools:

- FreeSewing, OpenPattern, GarmentCode, and GarmentCodeData for pattern-generation and data ideas.
- Graphite for future vector/layer/node editing inspiration.
- Blender for headless preview, UV/projection, and render experiments.
- Substance 3D Painter for layer/projection/PBR editing concepts.
- CLO/Marvelous/Optitex/Browzwear/Lectra for commercial workflow expectations.

## Current State

This is a project seed, not an implementation repo yet.

The initial docs contain:

- Product plan and MVP boundary.
- Product pillars and prototype build order.
- Roadmap to first prototype.
- Dependency map.
- Research queue.
- Reference bibliography.
- Notes on why UV unwrapping is not enough by itself.
- Initial decisions and open questions.
- Architecture overview, dependency register, and example/corpus needs.
- Decision log and architecture-history trail for choices that narrow the product direction.

## Project Structure

```text
app/            Product workbench shell; reusable UI/orchestration, not garment-specific
packages/       Reusable product packages and kernel boundaries
  assistant-core/
  export-core/
  geometry-core/
  pattern-core/
  preview-3d/
  sketch-intent/
  validation-core/
garments/       Garment programs, fixtures, references, and generated outputs
  a-line-dress-tunic/
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

- [Architecture Overview](docs/project/ARCHITECTURE-OVERVIEW.md)
- [Product Design Brief](docs/project/PRODUCT-DESIGN.md)
- [Product Pillars](docs/project/PRODUCT-PILLARS.md)
- [Prototype Build Order](docs/project/PROTOTYPE-BUILD-ORDER.md)
- [Kew Competitor And Inspiration Shortlist](docs/reference/KEW-COMPETITOR-SHORTLIST.md)
- [Kew Competitor Deep Dive](docs/reference/KEW-COMPETITOR-DEEP-DIVE.md)
- [Kew Sample Image Analysis](docs/reference/KEW-SAMPLE-IMAGE-ANALYSIS.md)
- [Decision Log](docs/journal/DECISION-LOG.md)
- [Things Tried / Architecture History](docs/journal/THINGS-TRIED.md)
- [Product Plan](docs/project/PRODUCT-PLAN.md)
- [Build Plan](docs/project/BUILD-PLAN.md)
- [Project Board](docs/project/PROJECT-BOARD.md)
- [Product Knowledge Graph](docs/project/KNOWLEDGE-GRAPH.md)
- [Roadmap](docs/project/ROADMAP.md)
- [Dependencies](docs/project/DEPENDENCIES.md)
- [Dependency Register](docs/project/DEPENDENCY-REGISTER.md)
- [Example And Corpus Needs](docs/project/EXAMPLE-NEEDS.md)
- [Research Queue](docs/project/RESEARCH-QUEUE.md)
- [Graphite + Blender Pipeline Notes](docs/project/GRAPHITE-BLENDER-PIPELINE.md)
- [Browser-Native Pipeline](docs/project/BROWSER-NATIVE-PIPELINE.md)
- [AI Sketch And 3D Exploration](docs/project/AI-SKETCH-3D-EXPLORATION.md)
- [Candidate-To-Export Interop Layer](docs/project/CANDIDATE-TO-EXPORT-INTEROP.md)
- [CAD Drawing Reference Analog](docs/research/cad-to-technical-drawings-2026-05-03.md)
- [Reference Index](docs/reference/REFERENCES.md)
- [Pattern Standards And Conventions](docs/reference/PATTERN-STANDARDS-AND-CONVENTIONS.md)
- [First Garment Visual Reference Corpus](docs/reference/FIRST-GARMENT-VISUAL-REFERENCE-CORPUS.md)
- [Pattern Reference Corpus](docs/reference/PATTERN-REFERENCE-CORPUS.md)
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
6. Export human-readable SVG/PDF with a cut sheet and assembly order.
7. Preserve a machine-readable pattern representation for later grading and simulation.

## Non-Goals For Prototype 1

- Any-garment generation.
- Production-grade grading across a full size range.
- Knit fabric simulation.
- Sleeves, collars, plackets, pockets, linings, facings beyond simple neckline/armhole binding notes.
- Fully automatic physical fit guarantee.
- Factory-ready tech pack.
- Industry-standard / machine-readable cutter/CAD output and commercial interoperability beyond SVG/PDF exploration.

## Core Principle

Constrain the output through a pattern grammar first. Let AI infer design intent, but do not let an unconstrained mesh become the sewing pattern.
