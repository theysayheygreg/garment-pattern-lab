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

Phase B code:

- `src/raster-to-vector/recipes.mjs`: recipe definitions for clean flats, colored illustrations, pencil sketches, and scanned pattern pieces.
- `src/raster-to-vector/bridge.mjs`: ingest/provenance contract, SVG passthrough, best-effort vector PDF / PDF-compatible `.ai` conversion via Poppler `pdftocairo`, raster PDF fallback via Poppler PNG rendering, VTracer-backed PNG/JPG/WEBP vectorization via `@neplex/vectorizer`, and deterministic layer buckets (`silhouette`, `interior`, `annotation`, `unclassified`).
- `src/raster-to-vector/fixture-report.mjs`: local fixture report CLI for checking readiness, path counts, and layer counts across selected sketch inputs.
- `src/raster-to-vector/bridge.test.mjs`: smoke tests using SVG fixtures, generated PNG/JPG/WEBP fixtures, generated raster/vector PDF fixtures, generated PDF-compatible `.ai`, malformed raster input, and unsupported input.
- `fixtures/primitive-export-technical-flat.svg`: SVG export hardening fixture using common vector primitives (`polygon`, `polyline`, `line`, `rect`) rather than only `<path>`.
- `fixtures/hardware-detail-technical-flat.svg`: SVG fixture for circles/ellipses used as hardware, buttons, rings, rivets, or similar garment details.
- `fixtures/a-line-tunic-semantic-flat.svg`: Phase C fixture with separate semantic paths for the front neckline, shoulders, armholes, side seams, hem, and center axis.
- `fixtures/a-line-tunic-front-back-semantic-flat.svg`: Phase C fixture with paired front/back panels and explicit view metadata.
- `fixtures/a-line-tunic-single-side-semantic-flat.svg`: Phase C fixture for one-sided symmetric inputs where the interpreter mirrors missing side landmarks across the detected center axis.
- `src/semantic-interpreter/interpreter.mjs`: heuristic A-line v0.1 interpreter that converts Phase B trace layers into a `sketch-interpretation` package with semantic landmark IDs, source curve evidence, coordinate profile, assumptions, and ambiguity report.
- `src/semantic-interpreter/interpreter.test.mjs`: smoke tests for complete front, paired front/back, back-only, single-side mirrored, sparse blocked, and dart-side fixtures.

Local tool assumptions:

- `pdftocairo` from Poppler for PDF / PDF-compatible `.ai` conversion.
- `sips` and `cwebp` for generated JPG/WEBP smoke fixtures.

Useful commands:

- `npm run check:sketch`
- `npm run check:semantic`
- `npm run sketch:report`
