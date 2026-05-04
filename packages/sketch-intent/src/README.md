# Sketch Intent Source

Future sketch and trace interpretation package.

Owns:

- source-image provenance
- generated-sketch provenance
- layered source documents
- landmarks
- semantic callouts
- ambiguity reports
- conversion to editable garment parameters

This is the bridge from art to pattern intent.

Phase B's `raster-to-vector/` bridge is implemented for the v0.1 spike. It ingests SVG, common SVG primitives, vector PDF, PDF-compatible `.ai`, raster PDF fallback, PNG, JPG, and WEBP into the same editable trace-layer contract with backend readiness for fixture work.

Phase C begins with `semantic-interpreter/`: a heuristic A-line interpreter over the Phase B trace layer. It emits semantic landmark IDs, source-curve evidence, trace-space coordinate profile, assumptions, and an ambiguity report while keeping physical scale unknown until Phase D.
