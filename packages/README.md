# Packages

Reusable product libraries.

These packages should be garment-family agnostic. They form the Pattern Lab engine that individual garment programs call into.

Planned packages:

- `sketch-intent`: source images, traces, landmarks, callouts, ambiguity questions.
- `pattern-core`: `PatternGraph`, measurements, garment parameters, seams, panels, labels.
- `geometry-core`: curves, offsets, intersections, lengths, transforms, triangulation boundaries.
- `validation-core`: sewing-aware candidate validation and export gates.
- `export-core`: SVG/PDF/package composition.
- `preview-3d`: simple 3D sanity preview.
- `assistant-core`: natural-language commands, assumption review, and task-led workflow glue.
