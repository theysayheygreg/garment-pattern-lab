# Project Board

## Active

### M0: Project Grounding

Owner: planning/research agent

Status: In progress.

Next actions:

- Ingest a public/free patternmaking source into concise project notes.
- Choose first draft method for sleeveless A-line tunic.
- Write first-garment formulas.
- Write sewing-aware validation checklist from the paper ingest.
- Choose prototype tech stack.

## Ready Next

### M1: First Garment Rulebook

Scope:

- Measurement set.
- Ease defaults.
- Drafting formulas.
- Pattern pieces.
- Seam allowance, notches, labels.
- Construction order.

Risk:

- Requires actual patternmaking judgment, not just software architecture.

### M2: Pattern Schema

Scope:

- Machine-readable pattern document.
- SVG export target.
- Seam relationships and validation.

Risk:

- Too much schema too early. Keep it just rich enough for the first garment.

### M2.5: Sewing-Aware Validation

Scope:

- Seam length validation.
- Seam reflection-symmetry scoring.
- Dart symmetry checks.
- Grainline checks.
- Panel complexity warnings.
- Self-intersection checks.

Risk:

- Reflection symmetry can become math-heavy. Start approximate and make the report honest.

## Blocked / Needs Research

### R1: Lawful Reference Ingestion

Need:

- Confirm which patternmaking PDFs/texts are public, open, or otherwise safe to ingest.

### R2: GarmentCode / FreeSewing Reuse

Need:

- Inspect installability, licenses, APIs, and whether either should be core or only reference.

### R3: 3D Preview Runtime

Need:

- Decide browser Three.js vs Blender automation vs deferred preview.

### R4: Mesh-To-Pattern Paper Implementation

Need:

- Find whether the paper's released implementation is accessible and usable.
- Decide whether it is a future branch or reference-only.

## Backlog

See `BACKLOG.md`.
