# Package Overview

Pattern: Sleeveless A-line Woven Dress/Tunic v0.1

Readiness: ready-for-human-sanity-check

Source: measurement + parameter fixture

This is the one-file front door for the v0.1 package. It gathers the garment shape, measurements, preview, cutting notes, and review path so the package does not feel scattered across artifacts.

## Open First

- `preview.html` — static 3D assembly preview, not cloth simulation.
- `pattern.svg` — source pattern flats with a 1 in scale square.
- `cut-sheet.md` — cutting quantities, body fixture, finished draft measurements, marker summary.
- `assembly.md` — sewing order and muslin notes.
- `human-sanity-check.md` — review checklist before cutting anything beyond muslin.

## Garment Snapshot

| Field | Value |
| --- | --- |
| Garment | Sleeveless A-line woven dress/tunic |
| Fit | Loose pullover, dartless v0.1 draft |
| Closure | None modeled; head entry must be checked |
| Front/back pieces | Cut 1 each on fold |
| Fabric marker | 45 in wide, 77.53 in estimated length |

## Key Measurements

| Measurement | Value |
| --- | ---: |
| Body bust | 36.22 in (920mm) |
| Body hip | 38.58 in (980mm) |
| Finished length | 35.43 in (900mm) |
| Full hem sweep | 59.06 in (1500mm) |
| Seam allowance | 0.39 in (10mm) |
| Hem allowance | 1.18 in (30mm) |

## Shape Fidelity Note

v0.1 now samples neckline, armhole, and side-seam curves instead of drawing a few chunky polygon anchors. It is still a rough generated draft, not a production pattern or fit-proven garment.

## Review Gate

Do not treat this package as fashion-fabric-ready. Print or inspect at scale, review the curve quality and head entry, then record the result in `human-sanity-check.md`.
