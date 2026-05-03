# Pattern Standards And Conventions

Date: 2026-05-03

There does not appear to be one universal ASME-like standard for human-readable sewing pattern sheets.

Instead, the standards landscape has three layers:

1. Common sewing-pattern notation conventions.
2. Formal textile/apparel standards for sizing, body measurements, stitches, seams, and data exchange.
3. Proprietary or semi-standard commercial CAD conventions, especially DXF/AAMA/ASTM-style exchange.

For Garment Pattern Lab, the product-facing v1 should follow sewing-pattern conventions, not engineering-drawing conventions. Formal standards should inform the internal schema and later interoperability.

## Target User Reality

The target user is a fashion designer, indie studio, small clothing shop, sample maker, or sewing-literate maker. Many of these users may never interact directly with ASTM, ISO, AAMA, or commercial CAD exchange standards.

Even a very capable sample room may work mostly from house patterns, blocks, tech sketches, printed pattern pieces, sample notes, and the patternmaker's own notation habits. The product should meet that world first.

So the rule is:

```text
User-facing output: sewing pattern conventions.
Internal architecture: standards-aware where useful.
Later interoperability: ASTM/AAMA/DXF/ISO profiles.
```

ASTM and ISO references should be treated as backstage material. They can help us avoid painting ourselves into a corner, but they should not make the v1 package feel like a factory compliance document.

## Human-Readable Pattern Conventions

These conventions are widely used across commercial and indie sewing patterns, even when individual publishers draw them differently:

- cut line
- seam line / stitch line
- seam allowance value
- hem allowance value
- grainline arrow
- cut-on-fold line or bracket
- piece name
- garment/style name
- piece number
- size or measurement set
- cut quantity
- fabric/interfacing/lining instruction
- notches / balance marks
- darts, dart legs, and dart apex
- circles/dots/squares for match points
- button and buttonhole marks
- pleat and tuck fold arrows
- lengthen/shorten lines
- pocket/trim/placement lines
- construction notes when a non-obvious operation is required

These are conventions, not one enforced global standard. For v1, this means `SewingPatternSheetProfile` should define our house style clearly while staying recognizable to people who use sewing patterns.

## Formal Standards Worth Tracking

### ASTM D6673: Sewn Products Pattern Data Interchange

Closest formal standard for 2D sewn-pattern piece data exchange.

Role for this product:

- backstage later DXF/ASTM profile
- layer semantics for piece boundary, notches, grainline, mirror/fold line, internal lines, drill holes, sew lines, annotations, grade references, stripe/plaid references, and validation curves
- useful evidence that pattern exchange needs semantic layers, not just geometry

Important limitation:

- This is not a human-readable pattern sheet standard.
- It is likely too manufacturing/CAD-oriented for the prototype user to read directly.
- It does not define piece-to-piece sewing relationships or 2D/3D correspondence.
- Public secondary references report ASTM D6673-10 as withdrawn in 2019, while ASTM still lists D6673 pages; verify exact current status before treating it as active.

### AAMA / DXF-AAMA

Older apparel DXF exchange convention used by commercial systems.

Role for this product:

- backstage import/export compatibility research
- useful comparison target for CLO, Browzwear, Optitex, Gerber/Accumark, Lectra, and other apparel CAD workflows

Important limitation:

- Implementations vary.
- It is not a user-facing pattern notation standard.

### ISO 8559

Size designation of clothes and anthropometric/body-measurement definitions.

Role for this product:

- backstage measurement vocabulary
- body measurement schema
- avatar/measurement-set consistency
- future size chart and fit-mannequin work

Important limitation:

- It concerns body measurements and size designation, not pattern-piece markings.

### ASTM D5219

Terminology relating to body dimensions for apparel sizing.

Role for this product:

- backstage measurement terminology
- body-measurement schema naming
- future US-oriented measurement profile

Important limitation:

- It is measurement terminology, not pattern sheet notation.

### ASTM D5585 And Related ASTM Size Tables

Body measurement tables for specific figure types and ranges.

Role for this product:

- backstage optional baseline size tables
- future standard-size fixtures

Important limitation:

- Brand sizing and pattern sizing vary widely.
- Prototype 1 should be made-to-measure first rather than depend on a universal size chart.

### ISO 4915 / ISO 4916 And ASTM D6193

Stitch and seam terminology/classification.

Role for this product:

- backstage construction steps
- seam type metadata
- tech-pack and production notes later

Important limitation:

- These standards describe stitch/seam types, not pattern-piece sheet notation.

## Recommended V1 House Standard

Define `SewingPatternSheetProfile` as our own small, explicit house standard:

```text
SewingPatternSheetProfile
  -> line styles
  -> label requirements
  -> mark/symbol vocabulary
  -> page/tile requirements
  -> scale-proof requirements
  -> pattern information block
  -> validation callout style
```

Minimum v1 profile:

- solid outer cut line
- distinct seam/stitch line when shown
- dashed fold line or bracket with `cut on fold`
- double-ended grainline arrow
- named notches, paired across seam pairs
- dart legs and apex mark if darts exist
- piece label: garment, piece name, piece id, size/measurement set, cut quantity, fabric category
- seam allowance note per piece or global package
- scale square on every printable sheet or tile group
- page/tile coordinates for tiled PDF
- validation status and known limitations
- construction-note link from pattern piece to assembly step

## Product Implication

The product should distinguish four related but different standards profiles:

| Profile | Purpose | Prototype priority |
| --- | --- | --- |
| `SewingPatternSheetProfile` | Human-readable pattern sheets for designers, indie shops, sample makers, and sewers. | V1 |
| `MeasurementProfile` | Body measurement names, units, landmarks, and source. | V1 backstage |
| `ConstructionProfile` | Stitch/seam terminology and assembly metadata. | Later backstage |
| `DXFProfile` / `ASTMProfile` | Industrial pattern CAD exchange. | Later backstage |

This keeps the output familiar to fashion designers while preserving a path to commercial interchange later.

## Product Voice Rule

Avoid exposing formal standards names in the primary v1 UI unless the user explicitly opens an advanced/export/interop area.

Prefer:

- "grainline"
- "cut on fold"
- "cut 2 main fabric"
- "seam allowance included"
- "print this square at 100 mm"
- "front panel"
- "side seam notches"
- "construction note"

Avoid in the normal designer flow:

- "ASTM D6673 layer 7"
- "ISO 4916 seam class"
- "DXF/AAMA block"
- "grade reference line"
- "interop format profile"

Those concepts can still exist internally and in later export settings.

## Current Knowledge Base Coverage

Already covered, but scattered:

- `docs/reference/FUNDAMENTALS-INGEST.md` names required pattern fields: grainline, notches, seam/cut lines, seam allowance, cut counts, labels, and construction role.
- `docs/project/CANDIDATE-TO-EXPORT-INTEROP.md` defines SVG/PDF/DXF conformance checks and `SewingPatternSheetProfile`.
- `docs/project/DEPENDENCY-REGISTER.md` tracks ASTM D6673 and Patro ASTM DXF notes as later interop references.
- `docs/project/KNOWLEDGE-GRAPH.md` has `SewingPatternSheetProfile`, `DXFProfile`, `UnitProfile`, `MeasurementSet`, `ConstructionFeature`, and validation nodes.

This file should now be the hub for standards and conventions.

## References

- ASTM D6673: https://store.astm.org/d6673-04.html
- Patro ASTM DXF notes: https://fabricesalvaire.github.io/Patro/resources/file-format/dxf-astm.html
- ASTM D6193 stitches and seams: https://store.astm.org/Standards/D6193.htm
- ISO 8559-1 body measurement definitions: https://www.iso.org/standard/61686.html
- ISO 4915 stitch types: https://www.iso.org/standard/10932.html
- ASTM D5219 body dimensions terminology: https://store.astm.org/d5219-09e01.html
- ASTM D5585 body measurement tables: https://store.astm.org/d5585-21.html
- FreeSewing notation guide: https://freesewing.eu/docs/about/notation/
- Sewing & Craft Alliance pattern markings guide: https://www.sewing.org/files/guidelines/3_110_pattern_markings_part1.pdf
