# Pattern Reference Corpus

Last updated: 2026-05-03

This report covers the first-garment real-pattern lane: actual sewing patterns,
pattern diagrams, and construction references for a sleeveless A-line woven
dress/tunic or close relatives.

The target user is a fashion designer, small clothing shop, sample maker, or
sewing-literate maker. Industry standards remain later export options. The v1
reference corpus should teach the product common sewing-pattern conventions:
panel roles, grainlines, fold lines, notches, seam allowance, finishing choices,
closures, cut quantities, and construction order.

## Truth And Use Rules

| Truth level | Meaning in this lane | Allowed use now |
| --- | --- | --- |
| `pattern-reference` | A real pattern, pattern diagram, construction tutorial, or catalog page that shows how a similar garment is made but is not license-clean enough for direct geometry reuse. | Extract high-level facts, feature checklists, construction variants, and validation rules. Do not copy pattern geometry or instructions into public fixtures. |
| `pattern-truth` | A scaled pattern or generated pattern whose license/provenance allows use as a project fixture. | Use for internal correctness fixtures, PatternGraph conversion tests, and validation comparisons, preserving attribution/license metadata. |
| `metadata-only` | Useful taxonomy or inspiration where the actual pattern geometry/instructions are unavailable or rights are unclear. | Record garment family, visible features, and missing-data questions only. |

Default posture: treat free commercial/blog patterns as `pattern-reference`,
not `pattern-truth`, unless the source gives explicit permission to reuse,
modify, and redistribute the pattern file or generated derivative pattern data.

## Best Candidate Corpus Items

| Priority | Source | URL | Fit to first garment | License/use note | Truth level | Suggested corpus item |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Atacac Sharewear: Flat rectangle tunic | https://shop.atacac.com/collections/sharewear/products/flat-rectangle-tunic | Tunic relative; not A-line, but strong for head opening, shoulder hang, rectangular construction, printable PDF, DXF, and CLO/ZPrj bundle. | Explicit CC BY-SA. Good for fixtures if share-alike obligations are acceptable and attribution is retained. | `pattern-truth` with share-alike caveat | `atacac-flat-rectangle-tunic` |
| 2 | Atacac Sharewear: Rectangle shoulder tunic | https://shop.atacac.com/collections/sharewear/products/rectangle-shoulder-tunic | Tunic relative with front/back balance and underarm volume from rectangle placement. | Explicit CC BY-SA. Strong open reference for fabric/body relationship, but not a conventional A-line dress. | `pattern-truth` with share-alike caveat | `atacac-rectangle-shoulder-tunic` |
| 3 | Atacac Sharewear: Shaped shoulders and arms tunic | https://shop.atacac.com/collections/sharewear/products/shaped-shoulders-and-arms-tunic | Tunic relative; useful for shoulder shaping and grain direction across body. | Explicit CC BY-SA. Useful for grain/body placement experiments, not first-product tone. | `pattern-truth` with share-alike caveat | `atacac-shaped-shoulders-arms-tunic` |
| 4 | FreeSewing Bella body block | https://freesewing.eu/docs/designs/bella/ | Not a dress, but a womenswear bodice block with front on fold, back pieces, darts, measurements, and made-to-measure generation. | FreeSewing is open-source and explicitly permits commercial use. Generated output is suitable as a controlled fixture after local generation. | `pattern-truth` for bodice/block rules | `freesewing-bella-bodice-block` |
| 5 | Peppermint / Sewanista Shift Style | https://peppermintmag.com/wp-content/uploads/2016/06/Shift-Style.pdf | Very close: sleeveless shift/dress, woven-friendly, bias binding, back opening with hook and eye, darts, 1 cm seam allowance, 10 cm grid. | Free PDF but copyrighted. Use as pattern-reference and do not redistribute copied geometry/instructions. | `pattern-reference` | `peppermint-shift-style` |
| 6 | Fabrics-Store Hayden sleeveless blazer dress | https://fabrics-store.com/uploads/sew-pattern-pdf/Fabrics-store-Hayden_%E2%80%94_Sleeveless_Blazer_Dress_Pattern-1.pdf | Sleeveless woven dress relative with facings, darts, grainlines, cut-on-fold, mirrored cuts, seam allowances, closure details. More blazer/vest than tunic. | Free PDF; rights are not open-source. Use as pattern-reference only unless permission is secured. | `pattern-reference` | `fabrics-store-hayden-sleeveless-blazer-dress` |
| 7 | Fabrics-Store Hayden tutorial | https://blog.fabrics-store.com/2018/10/02/hayden-sleeveless-blazer-dress-tutorial/ | Construction-order companion to the PDF: seam allowance, finishing, facings, collar/lapel, snaps. | Blog tutorial is copyrighted; extract facts, not text/images. | `pattern-reference` | pair with Hayden PDF item |
| 8 | Mood Mendocino A-Line Dress | https://blog.moodfabrics.com/mendocino-a-line-dress-free-sewing-pattern/ | A-line dress, lightweight woven, fit/ease chart, placket, neckline/collar, sleeve/armhole complexity. Not sleeveless/simple. | Free pattern via email; Mood content is copyrighted. Use as pattern-reference and quality-check source, not geometry fixture. | `pattern-reference` | `mood-mendocino-a-line-dress` |
| 9 | Mood Sylvan Tank Dress | https://blog.moodfabrics.com/the-sylvan-tank-dress-free-sewing-pattern/ and direct pattern PDF https://www.moodfabrics.com/blog/wp-content/uploads/MoodFabrics.com-MDF257-Sylvan-Pattern-1.pdf | Sleeveless dress/tank relative, good for armhole/neck binding and simple front/back construction. Knit/stretch, so not first-garment truth. | Free direct PDF but copyrighted. Use as `pattern-reference` for binding semantics only. | `pattern-reference` | `mood-sylvan-tank-dress-binding-reference` |
| 10 | Adelica Pattern 1571 sleeveless top-tunic | https://adelicapatterns.com/adelica-pattern-1571-summer-tunic-sewing-pattern-pdf-for-free | Close tunic: sleeveless, woven option, shoulder and bust darts, side invisible zip, seam allowances not included. | Listed as $0/free but license is unclear and download likely requires cart/account. Use metadata and purchased/downloaded private review only. | `pattern-reference` | `adelica-1571-sleeveless-top-tunic` |
| 11 | LACMA Pattern Project | https://www.lacma.org/patternproject | Historic scaled patterns with photos and construction notes; not exact first garment but strong reverse-engineered pattern-package example. | LACMA publishes free downloadable PDFs, but rights are per item/site terms. Treat as reference until per-item rights review. | `pattern-reference`; possible private `pattern-truth` after rights review | `lacma-pattern-project-near-relatives` |
| 12 | Oliver + S Popover Sundress | https://oliverands.com/free-patterns/popover-sundress/ | Child A-line sundress with loose fit and yoke/bias ties; useful for simple panel family and beginner construction, but child sizing and shoulder-tie yoke differ. | Free PDF, rights not open-source. Use as construction reference only. | `pattern-reference` | `oliver-s-popover-sundress` |
| 13 | Sew Different Flippy A-line Dress | https://sewdifferent.co.uk/flippy-line-dress-free-sewing-pattern-2/ | Adult A-line dress reference with darts, facing, sections, no fastening, and bias/grain discussion. | Free PDF, not open-source; minimal instructions. Use as pattern-reference. | `pattern-reference` | `sew-different-flippy-a-line-dress` |
| 14 | SewGuide A-line dress drafting tutorial | https://sewguide.com/a-line-dress-pattern/ | Self-drafting reference for converting body measures/basic bodice ideas into A-line dress shape and finishing options. | Blog tutorial is copyrighted. Use as conceptual drafting reference, not copied instructions. | `pattern-reference` | `sewguide-a-line-dress-drafting-reference` |
| 15 | Lekala Sleeveless Dress 5518 instructions | https://www.lekala.co/files/models/782/782_instruction_pdf_8795.pdf | Sleeveless dress with zipper, lining, fusing, seam allowance defaults, and concise industrial-ish construction order. | Instruction preview is public; pattern geometry is commercial/made-to-measure. Use as construction reference only. | `pattern-reference` | `lekala-5518-sleeveless-dress-instructions` |

## First Five To Actually Use

Choose one primary exemplar to run end-to-end through the prototype and verify against a real pattern reference. Use the rest as a same-family variation set.

Recommended first exemplar:

`peppermint-shift-style`

Reason: it is closest to the first product shape: sleeveless woven shift/dress, bias binding, back opening with hook and eye, darts, seam allowance stated, and print-scale grid. Because it is copyrighted, it should be used as a `pattern-reference` for validation and feature checks, not copied as reusable geometry. The project-owned `PatternGraph` should be authored independently and checked against this reference's high-level construction expectations.

The first real-pattern mini-corpus should be:

1. `freesewing-bella-bodice-block`
2. `atacac-flat-rectangle-tunic`
3. `atacac-rectangle-shoulder-tunic`
4. `peppermint-shift-style`
5. `fabrics-store-hayden-sleeveless-blazer-dress`

This gives one clean parametric block, two open tunic relatives with real
geometry packages, one very close shift/dress construction reference, and one
rich sleeveless woven dress package with facings, darts, grainlines, cut labels,
and seam allowance annotations.

For stronger statistical coverage, expand this mini-corpus to 5-10 same-family references before trusting family-level validation rules. The goal is to learn the normal range of first-garment construction choices, not average them into one bland pattern.

Variation dimensions to track:

- pullover, back neck slit, back zipper, and side zipper
- dartless, bust dart, and shoulder-dart variants
- binding vs facing neckline/armhole finishes
- tunic length, knee length, and above-knee dress length
- straight shift vs modest A-line vs wider flare
- cut-on-fold front/back vs split-back construction
- seam allowance included, excluded, or mixed by edge

## Features To Extract Into PatternGraph

### Panel Roles

- `front_body`
- `back_body`
- `front_facing`
- `back_facing`
- `neck_binding`
- `armhole_binding`
- `placket`
- `closure_facing`
- `belt` or `tie`, only as optional metadata for non-v1 references
- `collar` or `lapel`, reference-only for Hayden/Mendocino, not first prototype

### Required Piece Metadata

- piece name
- cut quantity
- fabric role: main, facing, interfacing, lining, binding
- cut mode: single, mirrored pair, on fold
- grainline vector
- foldline edge or foldline marker
- seam allowance included/excluded
- seam allowance width by edge
- hem allowance width
- notches and alignment marks
- dart legs, dart point, and dart intake
- closure location and closure type
- finishing method for neckline and armhole

### Validation Rules For The First Garment

- Every body panel has a visible grainline or an explicit cut-on-fold marker.
- Center front is cut on fold for the loose pullover variant.
- Center back is either cut on fold for pullover or split for back opening/zipper/hook-and-eye.
- Side seam sewing lengths match within tolerance after excluding hem allowances.
- Shoulder seam sewing lengths match within tolerance.
- Neckline and armholes have either binding lengths or facing pieces.
- Binding/facing pieces identify fabric and cut quantity.
- Seam allowance state is explicit: included, excluded, or mixed by edge.
- Hem allowance is larger than ordinary seam allowance and marked separately.
- Darts, if present, must have paired legs, point, and intake.
- Closure references must produce construction steps and notches/marks near the opening.
- Pattern package includes a scale proof, preferably 10 cm or 4 in/100 mm.
- Pattern source and license metadata are stored beside any corpus item.

### Construction Variants To Preserve

- Pullover, no closure.
- Back neck slit with hook and eye.
- Center-back zipper.
- Side invisible zipper for a closer woven tunic/top.
- Bias-bound neckline and armholes.
- Separate facings for neckline/armholes.
- Dartless loose body.
- Bust-dart body.
- Front-on-fold/back-split combination.
- Mirrored left/right pieces where center seam or asymmetry is present.

## Correctness Checks Inspired By Sources

| Check | Why it matters | Sources to inspect |
| --- | --- | --- |
| Binding/facing completeness | Sleeveless woven garments need clean neckline and armhole finishes. | Peppermint Shift Style, Mood Sylvan, Hayden, SewGuide |
| Back opening necessity | A woven dress/tunic may need a zipper, placket, or hook-and-eye if the neckline is too small for pullover entry. | Peppermint Shift Style, Lekala 5518, Adelica 1571 |
| Cut-on-fold vs split-back choice | First prototype can use front-on-fold, but back-on-fold only works for loose pullover designs. | FreeSewing Bella, Peppermint Shift Style, Hayden |
| Seam allowance explicitness | Sources differ: included, not included, or included by edge; the product must never infer silently. | Peppermint, Hayden, Adelica, Lekala |
| Scale proof | Printable patterns need a calibration square/grid before cutting. | Peppermint Shift Style, Mood PDF, common PDF pattern practice |
| Darts optionality | Sleeveless woven garments often need darts or more ease to avoid armhole/chest issues. | FreeSewing Bella, Peppermint, Adelica, Hayden |
| Grain and bias handling | Some references deliberately rotate pieces or shift grain; v1 should keep straight-grain default but be able to record alternatives. | Sew Different, Atacac shaped-shoulder tunic |
| Notch and mark capture | Construction references frequently depend on notches/marks for darts, plackets, facings, and side seams. | Peppermint, Mood Mendocino, Hayden |

## License And Storage Notes

- Do not commit downloaded commercial/free-pattern PDFs from Mood, Peppermint,
  Fabrics-Store, Adelica, Lekala, Oliver + S, or Sew Different unless rights are
  reviewed and the repo has permission to redistribute them.
- Do not copy pattern-piece geometry or instruction text from copyrighted PDFs
  into fixtures.
- It is acceptable to record source metadata, high-level features, and validation
  expectations learned from public descriptions.
- Atacac Sharewear is the cleanest real pattern file lane because it explicitly
  uses CC BY-SA, but derivative PatternGraph fixtures may need to carry the same
  share-alike license.
- FreeSewing is the cleanest generated-fixture lane. Generate a local Bella
  output with a fixed measurement set and store the measurement/profile metadata
  beside the output.
- LACMA is valuable but needs per-item rights review before anything is treated
  as public `pattern-truth`.

## Gaps

- We still need one exact, open-license, adult, sleeveless A-line woven
  dress/tunic pattern with permissive geometry reuse.
- We still need a license-reviewed policy for whether Atacac CC BY-SA fixtures
  can live in the repo or must stay in a separate share-alike sample pack.
- We need a fixed measurement profile for the first generated FreeSewing/OpenPattern
  fixtures.
- We need one muslin/fit-feedback example for a loose sleeveless woven tunic:
  armhole gap, neckline entry, bust ease, hem sweep, and shoulder width.
- We need permission-safe pattern images for public-facing docs. Most commercial
  free-pattern PDFs are useful for research but not safe as display assets.
- We need an extraction template for each corpus item:
  `source_url`, `license_profile`, `truth_level`, `garment_family`,
  `panel_roles`, `piece_metadata`, `construction_steps`, `validation_rules`,
  `display_allowed`, and `geometry_reuse_allowed`.

## Next Collection Pass

1. Generate and store a metadata-only `freesewing-bella-bodice-block` corpus
   entry from a fixed measurement set.
2. Review Atacac CC BY-SA implications and decide whether to store derived
   PatternGraph fixtures in the main repo or a separately marked fixture pack.
3. Create one hand-authored first-garment `PatternGraph` fixture based on
   project-owned drafting rules, using the references only as validation checks.
4. Build a pattern-reference checklist from Peppermint Shift Style and Hayden:
   finishing pieces, closure choice, seam allowance state, grain/fold labels,
   cut quantities, and construction order.
