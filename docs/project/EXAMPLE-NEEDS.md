# Example And Corpus Needs

The project needs examples for three different reasons:

1. Pattern correctness.
2. Sketch/model understanding.
3. Export and interop tests.

Keep these separated so the project does not confuse inspiration images with pattern truth.

## Truth Levels Needed

| Truth level | Needed examples | Use |
| --- | --- | --- |
| `visual-only` | fashion sketches, generated sketches, catalog art | Prompting, UI demos, visual parsing tests. |
| `semantic-reviewed` | sketch plus human-reviewed garment intent | Sketch-to-parameter evaluation. |
| `pattern-reference` | pattern diagrams, cutting layouts, construction diagrams | Construction feature checks. |
| `pattern-truth` | scaled pattern pieces with instructions and provenance | Validation fixtures and correctness rules. |
| `round-trip-fixture` | source `PatternGraph` plus exported/reimported file | Export conformance tests. |

## First 20-Item Corpus Target

| Bucket | Count | Purpose |
| --- | ---: | --- |
| Human/reference sketches or flats | 5 | Manual landmark and semantic review tests. |
| GPT Image 2 technical flats | 5 | Controlled prompt recipe tests. |
| GPT Image 2 croquis / garment-on-body sketches | 5 | Figure/garment separation tests. |
| Real pattern-reference or pattern-truth items | 5 | Construction correctness checks. |

Recommended composition:

- Items 1-5: `pattern-truth` or `round-trip-fixture` items from FreeSewing, OpenPattern, GarmentCodeData, or the 2021 Zenodo garment-pattern dataset.
- Items 6-10: `pattern-reference` examples from license-safe sources such as LACMA where rights permit, Atacac Sharewear where share-alike is acceptable, or metadata-only summaries from CoPA.
- Items 11-15: GPT Image 2 front/back technical flats.
- Items 16-20: GPT Image 2 croquis/on-body sketches.

## Prototype Exemplar And Variation Set

The first end-to-end prototype should choose one primary exemplar garment to run through the whole pipeline and verify against a real pattern reference.

That exemplar should be a simple, adult, sleeveless A-line woven tunic/dress with the least ambiguous construction path:

- front and back body panels
- loose pullover or simple back opening
- neckline and armholes finished by binding or simple facing
- explicit grain/fold lines
- explicit seam allowance state
- visible cut labels and cut counts

Do not overfit the system to that one exemplar. Each garment family should also have a variation set of roughly 5-10 same-family references so validation can measure the expected range rather than one pattern's quirks.

For the sleeveless A-line woven dress/tunic, the variation set should cover:

- pullover vs back opening / zipper
- dartless loose body vs bust-dart body
- tunic length vs dress length
- binding finish vs facing finish
- center-front/back cut on fold vs split-back construction
- narrower shoulder/armhole vs broader shoulder coverage
- modest hem sweep vs wider A-line flare

Use the variation set to define warnings and acceptable ranges: expected panel roles, seam-pair behavior, finishing expectations, head-entry/closure logic, grain/fold handling, notch placement, and seam allowance/hem allowance conventions.

## Garment Families To Cover First

1. Sleeveless A-line dress/tunic.
2. A-line skirt.
3. Basic bodice shell.
4. Simple woven top.
5. Simple pants block.

## Required Examples For Prototype 1

### First-Garment Drafting

- At least two sleeveless A-line woven dress/tunic references with visible construction choices.
- One loose pullover example.
- One example with center-back closure or loop closure.
- One example with binding finish.
- One example with facing finish.
- Measurements/ease examples for bust, waist, hip, armhole, neckline, and hem sweep.
- One head-entry/pullover validation example: neckline/opening circumference and when a back closure becomes mandatory.
- One patternmaker tolerance example: acceptable seam-walk mismatch by seam type.
- One muslin/fit feedback example for a loose woven dartless or simple bust-dart sleeveless tunic.

### PatternGraph Schema

- One hand-authored valid `a-line-tunic.pattern.json`.
- One imported or converted GarmentCode-style fixture.
- One FreeSewing-generated SVG/PDF fixture mapped into `PatternGraph`.
- One `.val` or Seamly2D sample mapped at least partially into `PatternGraph`.
- One invalid missing-grainline fixture.
- One invalid mismatched-seams fixture.
- One invalid self-intersecting panel fixture.
- One invalid export-units fixture.

### SVG Round Trip

- SVG with cut/seam/internal lines.
- SVG with notches and grainlines.
- SVG edited externally and reimported.
- SVG with a deliberate scale mismatch.
- SVG saved from Inkscape.
- SVG edited or exported from Graphite/browser editor.
- SVG with nested transforms.
- SVG with stripped metadata but preserved visible layers.
- SVG with a 100 mm scale square.

### Geometry Torture Fixtures

- Concave armhole offset.
- Curved neckline seam-length check.
- Sharp hem corner offset.
- Dart wedge.
- Self-crossing invalid panel.
- Open panel boundary.
- Tiny notch.
- Mirrored front/back pair.

### Marker Planning

- Two-panel front/back tunic marker.
- Cut-on-fold variant.
- Nap/one-way print variant.
- Narrow fabric width failure.
- Valid-but-wasteful layout.
- Multi-cut duplicate panel.
- Spacing violation.
- Mirroring disallowed example.
- Normal 1420 mm fabric width example.
- Low-utilization warning example.

### Designer Editing

- Shoulder opening edit example.
- Armhole depth edit example.
- Hem length edit example.
- Hem sweep edit example.
- Visual trim/style line example that does not affect the pattern.

### Image-To-3D

- Same 3 source images for SPAR3D and Hunyuan3D-2:
  - clean technical flat
  - croquis garment sketch
  - rendered garment on simple body
- Include TripoSR as the MIT baseline for the same 3 inputs.
- Normalize outputs through `trimesh`, Blender CLI, and Three.js GLB viewer before scoring.

### Commercial Interop

- One ASTM-style DXF layer/block fixture.
- One generic CAD DXF with `LWPOLYLINE`, spline/curve, text, and layers.
- One known-bad unit-scale DXF.
- One CLO-importable DXF-ASTM or DXF-AAMA example if license-safe.
- Screenshots or reports from CLO/Marvelous/Seamly2D/Valentina import attempts.

### Graphite And Blender

- Semantic SVG opened/edited/exported through Graphite, checking group IDs, layer names, and path precision.
- Blender imported semantic SVG.
- Blender coarse assembled tunic preview.
- Blender UV/projection distortion view.
- Blender GLB/OBJ export check.

## Source Leads

- First garment visual reference corpus: sketches/designs lane for sleeveless A-line woven dress/tunic visuals, flats, croquis/on-body references, and license-safe metadata. `docs/reference/FIRST-GARMENT-VISUAL-REFERENCE-CORPUS.md`
- First garment real-pattern reference corpus: actual pattern and construction reference lane, including pattern-reference/pattern-truth candidates, PatternGraph extraction fields, and validation checks. `docs/reference/PATTERN-REFERENCE-CORPUS.md`
- LACMA Pattern Project: scaled historic pattern PDFs with images and construction instructions. https://www.lacma.org/patternproject
- FreeSewing: made-to-measure generated patterns and parametric designs. https://freesewing.org/
- OpenPattern: formula-generated full-scale bespoke patterns. https://openpattern.readthedocs.io/
- GarmentCodeData: synthetic 3D garments with sewing patterns. https://igl.ethz.ch/projects/GarmentCodeData/
- CoPA: commercial pattern archive useful for taxonomy/reference imagery. https://copa.apps.uri.edu/
- Met Open Access: public-domain visual garment/object imagery. https://www.metmuseum.org/about-the-met/policies-and-documents/open-access
- Smithsonian Open Access: CC0 visual garment/object imagery and some 3D assets. https://www.si.edu/OpenAccess
- 2021 3D Garments + Sewing Patterns dataset: CC BY 4.0 paired synthetic examples. https://zenodo.org/records/5267549
- Atacac Sharewear: modern pattern/file examples with share-alike caveat. https://shop.atacac.com/products/1919-2019-shirt

## Collection Rules

- Record source URL/path for every item.
- Record license/use assumptions.
- Do not use commercial pattern files as training or fixtures without explicit permission.
- Prefer public-domain, open, museum-published, or generated-in-project examples.
- Separate examples that can be shown publicly from examples used for private research only.
- Treat CoPA as taxonomy/private-research metadata unless permissions say otherwise.
- Treat LACMA as per-item rights review, not automatic reusable training data.
- Treat GPT Image 2 outputs as generated fixtures with model, snapshot, prompt, and review metadata.
- Treat Hunyuan3D-2 outputs as evaluation-only unless license review says otherwise.
