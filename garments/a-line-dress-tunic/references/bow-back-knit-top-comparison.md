# Bow Back Knit Top Reference Comparison

Date: 2026-05-04

Reference:

- Blog/tutorial: https://www.scatteredthoughtsofacraftymom.com/bow-back-knit-top-free-pattern/
- Local PDF reviewed: `/Users/theysayheygreg/Downloads/Bow-Back-Top-pattern-3-16-final.pdf`

Use status: `pattern-reference` only. The PDF and tutorial are copyrighted by the pattern author. Use this comparison to extract product conventions and validation expectations. Do not copy geometry, images, page layouts, or instructions into fixtures.

## Why This Reference Matters

The Bow Back Knit Top is close enough to the A-line tunic smoke test to be useful, while being more real than our current two-piece draft.

Shared shape:

- loose top/tunic silhouette
- front and back body panels
- fold-based body cutting
- simple beginner-friendly construction target
- curved or shaped side/hem area
- human-printable PDF pattern package

Important differences:

- The reference is a knit top, not a woven tunic.
- It includes sleeves, with multiple sleeve-length cut lines.
- It includes front and back facing pieces.
- It has a back keyhole opening and bow/ribbon closure.
- It supports a size range with layered/color-coded lines.
- Its sewing tutorial lives mostly on the web page, while the PDF is mainly tiled pattern pieces plus print/copyright notes.

## Blog-Level Garment Facts

From the public tutorial page:

- The garment is described as a simple T-shirt-style top with a small back keyhole and ribbon tie.
- The garment is intended for knit fabric.
- Size range is girls' 3 to 16.
- Features include long and short sleeve options, a curved bottom hem, a keyhole back, ribbon bow tie, and neckline facing rather than binding.
- Stated skill level is beginner/intermediate.
- Materials include 60 inch stretch knit fabric, optional interfacing, ribbon/trim for the bow, and stretch/ballpoint sewing setup.
- The tutorial separates fabric layout, printing, cutting, facing, neckline/bow insertion, sleeves, side seams, and hem finishing.
- Seam allowance is stated as 1/4 inch unless otherwise specified.
- Measurements are stated in inches.

## PDF-Level Pattern Facts

From the local PDF inspection:

- 11 pages, landscape letter-ish pages.
- Created in Adobe Illustrator.
- Includes a 1 inch scale test square.
- Pages are numbered and tiled for assembly.
- Assembly uses gray page boxes and colored alignment circles.
- Multi-size linework is color-coded for sizes 3, 4, 5, 6, 7, 8, 10, 12, 14, and 16.
- Body piece label: bodice front and back, cut 1 of each, fold.
- Sleeve piece: cut 2, fold, direction of stretch.
- Front facing: cut 2, direction of stretch.
- Back facing: direction of stretch.
- Sleeve page includes short-sleeve and quarter-sleeve cut lines.
- The pattern includes a 1/4 inch seam allowance and a 1/2 inch hem allowance.
- PDF points the user back to the website for layout, sewing instructions, and fit guide.

## Comparison To Current A-Line Output

| Area | Current A-line v0.1 | Bow Back Knit Top reference | Model implication |
| --- | --- | --- | --- |
| Fabric | Woven; grainline shown. | Knit; direction of stretch shown. | Add fabric behavior to the model: woven grainline vs knit stretch direction. |
| Scale proof | Was 2 inch square; now should be 1 inch. | 1 inch test square. | Use 1 inch scale proof for imperial home-print packages. |
| Pieces | Front and back half panels only. | Body, sleeves, front facing, back facing, tie/ribbon notion. | Add piece roles beyond body panels: sleeve, facing, trim/notion. |
| Cut labels | Basic cut-on-fold labels. | Piece labels include cut count, fold, stretch direction, size range. | Pattern labels need role, cut count, fold, fabric direction, and size/variant context. |
| Sizes | One synthetic size. | Size range with layered/color-coded lines. | Grading/layers are not v0.1, but output schema should not block them. |
| Closure | None modeled; head-entry note. | Back keyhole with ribbon bow tie. | Closure should be a first-class design feature, not just an assumption. |
| Neck finish | Binding-or-facing note only. | Facing pieces plus optional interfacing and understitching guidance. | Facing geometry should become generated pieces for facing-based finishes. |
| Sleeves | None. | Short/quarter/long sleeve options. | Optional component variants need cut-line and output conventions. |
| Hem | Simple straight-ish A-line hem. | Curved hem. | Hem curve quality is a real benchmark for top/tunic outputs. |
| Instructions | Markdown guide plus assembly note. | PDF pattern plus web tutorial with photo-heavy steps. | Keep one package guide, but support tutorial links or richer step cards later. |
| Marker/layout | Developer marker exists; human marker currently deemphasized. | Blog has a fabric layout guide; PDF pattern pieces are tiled pages, not a marker. | Distinguish tiled print pattern, overview board, and fabric layout/marker. |

## Output Package Gaps

Our package is now closer visually because `overview.svg` gives a Kiko-style board. Against a real PDF pattern, the biggest gaps are:

1. Home-print tiling with page numbers and alignment marks.
2. A 1 inch scale square.
3. Size/layer conventions, even if v0.1 stays one size.
4. Piece-role completeness: body, facing, sleeve, trim/notion.
5. Fabric-direction labels: grainline for woven, stretch direction for knits.
6. Fold labels large enough to read on the printed piece.
7. Cut labels on every piece with cut count and fabric/interface role.
8. Seam and hem allowance stated on the visual sheet and in the guide.
9. Optional component/variant cut lines, such as sleeve length options.
10. A web/tutorial companion model, or richer guide sections, for construction steps.

## Model Update

Add or preserve these fields in the product model:

```text
GarmentParameters.fabric.type = woven | knit | unknown
GarmentParameters.fabric.primaryDirection = grainline | stretch-direction
GarmentParameters.fabric.widthIn
GarmentParameters.closure.mode = none | back-keyhole-tie | zipper | button-placket | hook-eye | other
GarmentParameters.finish.neckline = binding | facing | band | raw | other
PatternGraph.panel.role = body | sleeve | facing | binding | trim | interfacing | lining
PatternGraph.panel.cut.count
PatternGraph.panel.cut.onFold
PatternGraph.panel.fabricRole = main | facing | interfacing | lining | trim
PatternGraph.panel.variantLines[] = short-sleeve | quarter-sleeve | long-sleeve | cropped | etc.
PatternPackage.print.scaleSquareIn = 1
PatternPackage.print.tilePages[] = page number, alignment marks, match points
```

## A-Line-Specific Takeaways

For the current A-line woven tunic, do not turn it into the Bow Back Knit Top. Instead:

- Keep woven/fold/grainline as the primary fabric model.
- Use the reference to harden output conventions.
- Add a real facing-piece variant before adding sleeves.
- Add a curved-hem variant before chasing complex closures.
- Treat back-keyhole/bow as a future closure module that belongs in the sleeveless-top-with-facing or knit-top benchmark lane.

## Next Prototype Actions

1. Switch pattern scale proof to a 1 inch square.
2. Add fabric metadata to the A-line `GarmentParameters`.
3. Add an output checklist for tiled print pages: page number, alignment marks, match points, scale square.
4. Add facing pieces as the next A-line geometry extension.
5. Add a bow-back knit top benchmark profile, but keep it reference-only.
