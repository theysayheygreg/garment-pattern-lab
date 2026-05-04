# sketch-intent

Converts source sketches, generated flats, screenshots, or vector traces into reviewable garment intent.

Owns:

- `InputProvenance`
- source image/vector records
- editable trace layers
- croquis/measurement guide overlays
- landmarks
- technical callouts
- ambiguity questions
- reviewed `SketchIntent`

Does not own pattern generation.

Current Phase B code:

- `src/raster-to-vector/recipes.mjs`: recipe definitions for clean flats, colored illustrations, pencil sketches, and scanned pattern pieces.
- `src/raster-to-vector/bridge.mjs`: ingest/provenance contract, SVG passthrough, best-effort vector PDF / PDF-compatible `.ai` conversion via Poppler `pdftocairo`, VTracer-backed raster vectorization via `@neplex/vectorizer`, and deterministic layer buckets (`silhouette`, `interior`, `annotation`, `unclassified`).
- `src/raster-to-vector/bridge.test.mjs`: smoke tests using `fixtures/clean-technical-flat.svg`, generated synthetic PNG fixtures for every recipe, and generated vector PDF / `.ai` fixtures.
