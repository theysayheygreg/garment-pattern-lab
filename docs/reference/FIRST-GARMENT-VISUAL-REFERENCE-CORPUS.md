# First Garment Visual Reference Corpus

Date: 2026-05-03

Scope: first garment visual lane for a sleeveless A-line woven dress/tunic.

No images were downloaded for this pass. The goal is to identify license-safe or license-reviewable sources, record candidate metadata, and define what each source can teach the prototype. The v1 user is a fashion designer, indie studio, small clothing shop, sample maker, or sewing-literate maker; this corpus should therefore emphasize readable garment intent, technical flats, croquis/on-body sketches, and sewing-pattern references without drifting into factory CAD language.

## Corpus Policy

Every candidate item should be indexed before any asset is copied locally.

Required metadata:

- `source_url`
- `source_name`
- `source_item_id`
- `license_or_rights`
- `allowed_use_assumption`
- `garment_family`
- `view_type`
- `truth_level`
- `review_status`
- `features_to_extract`
- `do_not_download_until`

Truth levels for this lane:

- `visual-only`: useful for silhouette, mood, sketch parsing, or designer-facing UI examples; not proof of pattern geometry.
- `semantic-reviewed`: a human has reviewed the item and recorded garment semantics such as neckline, armhole, closure, darts, hem sweep, length, and finishing clues.
- `pattern-reference`: shows real pattern pieces, construction diagrams, cutting layout, or instructions, but may not be suitable as direct geometry truth.
- `pattern-truth`: licensed or project-created pattern geometry that can be measured, compared, and used as a correctness fixture.

## Sketches / Designs Lane

This lane should populate visual references for what the designer means by "sleeveless A-line woven dress/tunic." It should avoid copyrighted fashion flats from stock sites unless they are used only as off-repo inspiration notes.

| Candidate source | URL | Suggested corpus items | License/use notes | Truth level | Key visual features to extract |
|---|---|---|---|---|---|
| Smithsonian Open Access | https://www.si.edu/OpenAccess | Search/API records for sleeveless dresses, especially NMAAHC garment records with front/back media and rich object descriptions. | Smithsonian Open Access assets marked CC0 can be reused without permission; still store item-level rights because some search results report restrictions possible. | `visual-only`, upgraded to `semantic-reviewed` after human review | Full garment silhouette, neckline type, armhole shape, side seam, closure clues, darts, waist seam, hem length, fabric behavior, front/back differences. |
| Smithsonian: Turquoise sleeveless dress with floral print | https://nmaahc.si.edu/object/nmaahc_2007.3.959 | Candidate visual item because the API exposes CC0 media and unusually detailed construction-like description. | API result showed media usage `CC0` and `No Known Copyright Restrictions`; verify live item page before asset download. | `semantic-reviewed` candidate | Boat neckline, small shoulder seam, vertical shaping darts, side zipper, side slits, back waist seam/gathering, lining/slip, hem finish. |
| Smithsonian: Turquoise sleeveless dress with flower embroidery | https://nmaahc.si.edu/object/nmaahc_2007.3.633 | Candidate visual item with front/back media and detailed garment description. | API result showed media usage `CC0` and `No Known Copyright Restrictions`; verify live item page before asset download. | `semantic-reviewed` candidate | Wide rounded neckline, thin straps, bust and waist darts, center-back zipper, facing/lining, hem finishing, pressed-open side/back seams. |
| Smithsonian: A-line sleeveless dress with lace cap sleeves by Gene Bailey | https://nmaahc.si.edu/object/nmaahc_A2018.88.1.10 | Candidate metadata-only item because title matches the target silhouette closely. | API result had metadata usage `CC0`, but online media rights were `Unknown - Restrictions Possible`; do not download media until rights are checked. | `visual-only` metadata lead | A-line silhouette vocabulary, sleeveless/cap-sleeve boundary, designer collection context. |
| Europeana open search | https://www.europeana.eu/ | Search `sleeveless dress` with `reusability=open`; API returned many candidates including CC0 and CC BY-SA records. | Use only item-level open rights. Prefer CC0 first; CC BY-SA is allowed only if attribution/share-alike obligations are acceptable for downstream assets. | `visual-only` | Silhouette variety, on-body museum display, garment title vocabulary across collections. |
| Europeana CC0 sleeveless dress record | https://www.europeana.eu/item/2064105/Museu_ProvidedCHO_Livrustkammaren_48715 | Candidate CC0 visual item from search result title "Sleeveless dress." | API result reported `http://creativecommons.org/publicdomain/zero/1.0/`; verify item page before download. | `visual-only`, possible `semantic-reviewed` | Front silhouette, neckline/strap treatment, length, skirt flare, body relationship. |
| The Met Open Access | https://www.metmuseum.org/about-the-met/policies-and-documents/open-access | Broad fashion/costume visual references, especially public-domain historical garments. | The Met Open Access program provides public-domain images/data under CC0, but first-pass API hits for exact "sleeveless dress" were not public-domain images. Use only records with OA/public-domain indication. | `visual-only` | Historical silhouettes, neckline/armhole vocabulary, drape, proportion, designer-facing inspiration. |
| Wikimedia Commons neckline SVG | https://commons.wikimedia.org/wiki/File:Necklines.svg | Use as a feature taxonomy reference, not a garment example. | CC BY-SA 4.0; usable with attribution/share-alike. Better to recreate our own internal neckline taxonomy drawings to avoid license coupling. | `visual-only` taxonomy reference | Crew, scoop, V, square and related neckline labels for `SketchIntent.neckline_shape`. |
| Fashion design education references | https://www.psscive.ac.in/storage/uploads/textbooks/pdf/english/assistant-fashion-designer-english-class-11.pdf | Reference for what educational material calls fashion flats and front/back technical drawings. | Treat as bibliography/reference only unless reuse rights are clear. | `visual-only` process reference | Fashion flat conventions: front/back views, clean black line, design details, placement of seams/closures/trims. |
| GPT Image 2 project-created sketches | Internal generation plan, no external source URL yet. | Generate front/back technical flats, loose croquis sketches, and hand-sketch-like variants from explicit prompts. | Project-created outputs with prompt/model provenance; still require human semantic review before use as fixtures. | `visual-only` until reviewed, then `semantic-reviewed` | Controlled variation for neckline, shoulder width, armhole depth, hem sweep, tunic vs dress length, dart/zipper/finish indications. |

Sketch/design lane recommendation:

Start with 8 metadata-only entries: 3 Smithsonian candidates, 2 Europeana CC0 candidates, 1 Met OA historical garment candidate, 1 internal technical-flat generated fixture, and 1 internal croquis generated fixture. Do not pull stock-vector assets from Freepik, CartoonDealer, or similar sites into the corpus; those are search vocabulary and style inspiration at most.

## Real Patterns Lane

This lane should teach pattern anatomy and construction expectations for the first garment. The highest-value items are not necessarily exact A-line tunics; they are references that show how sleeveless woven garments resolve front/back panels, facings or bias binding, darts, closures, notches, grainlines, and cut instructions.

| Candidate source | URL | Suggested corpus items | License/use notes | Truth level | Key pattern features to extract |
|---|---|---|---|---|---|
| LACMA Pattern Project | https://www.lacma.org/patternproject | Use as a pattern-reference source for scaled pattern PDFs, object photos, observations, and construction instructions. | LACMA says each printable PDF includes scaled pattern, object description/images, and construction instructions. Photos on the page show copyright notices; treat as per-item rights review before local asset use. | `pattern-reference` | Scaled pattern layout, construction notes, historical reverse-engineering method, relationship between object photo and flat pattern. |
| LACMA: Boy's Frock / Woman's Redingote / Woman's Lounging Pajamas leads | https://www.lacma.org/patternproject | Not exact v1 garment, but useful for dress/tunic panel families and construction package structure. | Per-item rights review. Store URL and notes first; do not copy PDFs/images until license is checked. | `pattern-reference` | Panel naming, seam relationships, construction sequencing, pattern package organization. |
| Adelica pattern 1571 sleeveless top-tunic | https://adelicapatterns.com/adelica-pattern-1571-plus-size-summer-tunic-sewing-pattern-pdf-for-free | Strong first-garment shape lead: sleeveless top/tunic, woven option, beginner, home-print PDF, shoulder and bust darts, side invisible zipper for woven model. | Listed as free/$0, but not automatically open-licensed. Use metadata and feature notes only until terms permit fixture use. | `pattern-reference` metadata lead | Shoulder darts, bust darts, side zip, woven vs knit variant split, seam allowance not included, page count, suggested fabrics. |
| Lekala sleeveless dress #2776 | https://www.lekala.co/catalog/free%2Bpatterns/women/pattern/2776 | Candidate real-pattern lead for a sleeveless dress. | Site uses "made to measure" and "royalty free" language, but page footer says all rights reserved and live page showed no result content in fetched text. Treat as metadata/reference only until terms are reviewed. | `pattern-reference` metadata lead | Pattern feature taxonomy from site filters: no sleeves, neckline, A-line skirt, darts, zipper, length, technical drawing vs photo categories. |
| FreeSewing designs | https://freesewing.org/designs/ | Use generated OSS patterns adjacent to the first garment: Sophie Slip Dress, Jane shift/tunica, Bella/Bibi/Breanna body blocks, Sandy/Sarah/Sunny skirt blocks. | FreeSewing is open-source and drafts made-to-measure patterns in the browser; verify package/design license before committing generated SVG/PDF fixtures. | `pattern-truth` candidate if generated in-project under compatible license | Parametric measurements, design options, PDF/SVG export, pattern labels, seam allowance handling, block-to-style transformation. |
| FreeSewing about patterns vs designs | https://v4.freesewing.org/docs/about/ | Process reference for "design" vs generated "pattern" distinction. | Documentation/reference. | `semantic-reviewed` process reference | Made-to-measure drafting, real-time browser generation, tweakable design options, export formats. |
| OpenPattern Python library | https://openpattern.readthedocs.io/ | Formula-drafting reference for full-scale bespoke patterns; not exact first garment by default. | Documentation says it drafts 1:1 bespoke sewing patterns and exports PDF/matplotlib-compatible output; check repo license before using code or generated outputs. | `pattern-truth` candidate after license/code review | Points, curves, darts, fold lines, grainlines, labels, home-printer tiling, bodice/skirt transformation logic. |
| PatternSoft | https://patternsoft.drytrix.com/ | UX/reference lead for local pattern repository, visual grading, FreeSewing integration, PDF/SVG export. | Site states MIT license; verify GitHub repo before reuse. | `semantic-reviewed` process reference | Designer-friendly repository, visual drawing/grading surface, export expectations. |
| Science History Institute: Ladies' and Misses' Slip-Over Waist | https://digital.sciencehistory.org/works/torh4pp | Public-domain historical tunic/pattern-envelope visual reference. | Page marks item Public Domain and offers downloadable images/PDF, but this appears to be envelope/periodical material rather than full usable pattern geometry. | `visual-only`, possible `pattern-reference` if PDF contains diagrams | Historical tunic terminology, envelope art, garment description, public-domain provenance pattern for metadata. |
| Atacac Sharewear | https://shop.atacac.com/ | Modern pattern/file source to keep in the backlog; not exact first garment in this pass. | Earlier project notes flag CC BY-SA/share-alike caveat; verify item-level license before use. | `pattern-reference` candidate | Modern pattern file package shape, 2D/3D relationship, shareable maker-facing output. |

Real-pattern lane recommendation:

For the first usable corpus, prefer project-created pattern-truth over external pattern downloads:

1. Generate one internal sleeveless A-line tunic `PatternGraph` fixture.
2. Generate one FreeSewing-adjacent block/slip/skirt reference if license review passes.
3. Add Adelica 1571 and LACMA as metadata-only `pattern-reference` examples.
4. Add Smithsonian/Europeana visual references as `semantic-reviewed` after human markup.

## Suggested First 20 Corpus Items

The visual lane should mirror the real-pattern lane: choose one clean primary exemplar for the end-to-end prototype, then maintain 5-10 same-family visual variations to test whether sketch parsing and parameter extraction understand the range of designer intent.

Visual variations should cover neckline shape/depth, shoulder width, armhole depth, tunic vs dress length, hem sweep, dart/closure hints, and binding/facing clues.

| Slot | Item | Source | Download now? | Truth level target |
|---|---|---|---|---|
| 1 | Front/back clean technical flat, loose pullover A-line tunic | Project-generated | Yes, after generation | `semantic-reviewed` |
| 2 | Front/back clean technical flat, center-back zipper dress length | Project-generated | Yes, after generation | `semantic-reviewed` |
| 3 | Croquis/on-body sketch, loose sleeveless tunic | Project-generated | Yes, after generation | `semantic-reviewed` |
| 4 | Croquis/on-body sketch, knee-length A-line dress | Project-generated | Yes, after generation | `semantic-reviewed` |
| 5 | Hand-sketch-like rough front/back concept | Project-generated | Yes, after generation | `semantic-reviewed` |
| 6 | Smithsonian turquoise sleeveless floral dress | Smithsonian NMAAHC 2007.3.959 | Yes only after item-page rights check | `semantic-reviewed` |
| 7 | Smithsonian turquoise sleeveless embroidered dress | Smithsonian NMAAHC 2007.3.633 | Yes only after item-page rights check | `semantic-reviewed` |
| 8 | Smithsonian Gene Bailey A-line sleeveless dress | Smithsonian NMAAHC A2018.88.1.10 | No; metadata-only for now | `visual-only` |
| 9 | Europeana CC0 sleeveless dress | Europeana / Livrustkammaren 48715 | Yes only after item-page rights check | `visual-only` to `semantic-reviewed` |
| 10 | Europeana CC0 "Armlos klanning" | Europeana / Livrustkammaren 68773 | Yes only after item-page rights check | `visual-only` |
| 11 | Met OA historical dress with A-line-like silhouette | Met Open Access search | Only if OA/public-domain flag is present | `visual-only` |
| 12 | Neckline taxonomy drawing | Recreate internally; Wikimedia only as reference | Create our own | `semantic-reviewed` taxonomy |
| 13 | Armhole/shoulder taxonomy drawing | Project-created | Yes | `semantic-reviewed` taxonomy |
| 14 | Hem sweep / tunic-vs-dress length taxonomy drawing | Project-created | Yes | `semantic-reviewed` taxonomy |
| 15 | Internal PatternGraph fixture: loose pullover tunic | Project-created | Yes | `pattern-truth` |
| 16 | Internal PatternGraph fixture: back-zip woven dress variant | Project-created | Yes | `pattern-truth` |
| 17 | Adelica 1571 sleeveless tunic metadata | Adelica | No; metadata-only unless terms permit | `pattern-reference` |
| 18 | LACMA pattern package example | LACMA Pattern Project | No; metadata-only until item rights review | `pattern-reference` |
| 19 | FreeSewing adjacent generated block/slip/skirt | FreeSewing | After license/design review | `pattern-truth` candidate |
| 20 | Science History public-domain tunic envelope | Science History Institute | Yes if public-domain item page is verified | `visual-only` |

## Feature Extraction Checklist

For sketches, flats, and on-body references:

- front/back view availability
- tunic vs dress length
- neckline shape and depth
- shoulder width and strap/shoulder coverage
- armhole depth and curve
- side seam shape
- hem sweep and hem curve
- dart indications
- closure indications
- seam/style-line indications
- fabric behavior: crisp woven, soft drape, sheer/lining, bias/facing clues
- body relationship: loose, semi-fitted, fitted

For real pattern references:

- panel roles: front, back, facing, binding, optional lining
- fold vs seam center front/back
- side seam and shoulder seam pairing
- dart placement and dart intake
- closure position
- grainline/fold lines
- notches and alignment marks
- seam allowance included or excluded
- hem allowance
- cut count and fabric recommendations
- construction order
- print/tile/page format

## Gaps

- Exact license-safe, modern, sleeveless A-line woven tunic pattern geometry is still scarce. The safest first `pattern-truth` fixture should be authored by us.
- Most public museum garment images are excellent visual references but rarely include flat technical views or pattern geometry.
- Many "free pattern" sites are free-of-price, not open-licensed. Treat them as metadata leads until terms are explicit.
- Stock-vector technical flats are plentiful, but most are premium/licensed and should not enter the repo corpus.
- Croquis/on-body fashion sketches with permissive licenses are less reliable than project-created generated sketches with human review.
- The first corpus needs a reviewer pass by someone sewing-literate to promote items from `visual-only` to `semantic-reviewed`.

## Next Actions

1. Create `docs/reference/FIRST-GARMENT-CORPUS-INDEX.example.json` with the metadata fields above.
2. Add 8 metadata-only entries without downloading images.
3. Generate 5 controlled project-owned sketch/flat fixtures with prompt provenance.
4. Draft the first internal PatternGraph tunic fixture so the real-pattern lane has at least one `pattern-truth` item.
5. Run item-level rights review before committing any external image or PDF asset.
