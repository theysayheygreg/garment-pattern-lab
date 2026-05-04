# Sleeveless A-line Woven Dress/Tunic v0.1-from-sketch

Readiness: ready-for-human-sanity-check

Source sketch: packages/sketch-intent/fixtures/a-line-tunic-scale-reference-semantic-flat.svg

This is the human-facing v0.1 review guide. It is intentionally one document: garment snapshot, measurements, cut notes, sewing order, assumptions, and sanity-check prompts are here instead of spread across separate Markdown files.

## Files In This Output

- `source-sketch.svg` — input sketch that produced this package, when available.
- `pattern.svg` — generated pattern flats with a 2 in scale square.
- `preview.html` — static 3D assembly preview, not cloth simulation.
- `guide.md` — this document.

The marker file is kept in developer/package output for now. It becomes human-facing again when we move to garments with many pieces where marker layout is a real review object.

## Garment Snapshot

| Field | Value |
| --- | --- |
| Garment | Sleeveless A-line woven dress/tunic |
| Fit | Loose pullover, dartless v0.1 draft |
| Closure | None modeled; head entry must be checked |
| Front/back pieces | Cut 1 each on fold |
| Fabric marker | 45 in wide, 77.53 in estimated length |

## Print Scale

- Print `pattern.svg` at 100% scale; do not fit to page.
- Measure the 2 in scale square before cutting.
- This v0.1 package is SVG-first; tiled home-print PDF is still missing.

## Body Fixture

| Measurement | Value |
| --- | ---: |
| Bust | 36.22 in (920mm) |
| Waist | 29.92 in (760mm) |
| Hip | 38.58 in (980mm) |
| Shoulder width | 14.96 in (380mm) |
| Armhole depth | 8.46 in (215mm) |

## Finished Draft Measurements

| Measurement | Value |
| --- | ---: |
| Finished length | 35.43 in (900mm) |
| Full hem sweep | 59.06 in (1500mm) |
| Front shoulder seam | 3.61 in (91.78mm) |
| Back shoulder seam | 3.61 in (91.78mm) |
| Front side seam | 27.62 in (701.47mm) |
| Back side seam | 27.62 in (701.47mm) |

## Pieces

| Piece | Cut | Notes |
| --- | --- | --- |
| Front half panel | 1 on fold | Place center front on fabric fold; do not add extra seam allowance at fold. |
| Back half panel | 1 on fold | Place center back on fabric fold; do not add extra seam allowance at fold. |

## Allowances And Finishes

- Seam allowance: 0.39 in (10mm)
- Hem allowance: 1.18 in (30mm)
- Neckline finish: bias-binding-or-facing
- Armhole finish: bias-binding-or-facing

## Assembly

1. Cut front and back half panels on fold.
2. Finish neckline and armholes with bias binding or facing.
3. Join shoulder seams.
4. Join side seams.
5. Turn hem allowance and stitch.

## Assumptions

- Dartless loose woven fit for v0.1.
- No closure modeled; neckline/opening must be reviewed for head entry.
- Front and back side seams are intentionally matched for the dirty spike.
- Seam allowance is simplified with rough cut-line expansion, not robust geometric offsetting.

## Review Checklist

- [ ] Confirm the generated pattern visually matches the source sketch.
- [ ] Confirm the 2 in scale square measures correctly.
- [ ] Confirm labels, grainlines, fold lines, seam lines, cut lines, and notches are visible.
- [ ] Confirm neckline and armholes look plausible.
- [ ] Confirm side seams and shoulders appear matchable.
- [ ] Confirm head entry before finishing the neckline; no closure is modeled.
- [ ] Record whether this passes for paper/muslin sanity check, needs another generated draft, or needs patternmaker intervention.

## Known Limits

- True fit and drape are not checked.
- The preview is a static assembly view, not a garment simulation.
- This A-line two-panel garment is now a smoke-test harness, not the main benchmark for product quality.
