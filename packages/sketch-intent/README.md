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
- `src/raster-to-vector/bridge.mjs`: ingest/provenance contract plus SVG passthrough and deterministic layer buckets (`silhouette`, `interior`, `annotation`, `unclassified`).
- `src/raster-to-vector/bridge.test.mjs`: dependency-free smoke test using `fixtures/clean-technical-flat.svg`.
