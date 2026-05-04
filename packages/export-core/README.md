# export-core

Human-readable pattern package output.

Owns:

- semantic SVG export
- print/PDF package path
- cut sheet
- assembly instructions
- validation report packaging
- source `PatternGraph` JSON packaging
- later interop profiles for DXF/AAMA/ASTM

V1 prioritizes a package a person can print, cut, review, and sew from.

Current v0.1 code:

- `src/package-builders.mjs`: SVG, cut sheet, assembly notes, readiness Markdown, and static preview builders.
