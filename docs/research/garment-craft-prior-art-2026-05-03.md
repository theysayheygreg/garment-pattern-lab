# Garment Craft Prior Art

Date: 2026-05-03
Author: research subagent
Purpose: Build a usable corpus of garment design craft knowledge that complements the existing ingest in this repo. Three deliverables: a garment family taxonomy, gap-fill craft conventions (notches, line types, labels, regional sizing, blocks), and drafting formulas for the v0.1 sleeveless A-line woven tunic.

This file is the prose narrative. The structured (model-readable) artifacts live in `docs/data-corpus/` and are the actual runtime inputs for the prototype.

Companion files:

- `docs/data-corpus/garment-families.json`
- `docs/data-corpus/craft-conventions.json`
- `docs/data-corpus/drafting-formulas-a-line-tunic.json`
- `docs/data-corpus/README.md` (schema notes for all three)

## Existing Coverage And What This Adds

The repo already covers, scattered across several reference docs, the standards layer (`docs/reference/PATTERN-STANDARDS-AND-CONVENTIONS.md`), the patternmaking modes and core concepts (`docs/reference/PATTERNMAKING-FUNDAMENTALS.md`), the bibliographic ingest of textbooks (`docs/reference/FUNDAMENTALS-INGEST.md`), the corpus of real-world reference patterns and their license posture (`docs/reference/PATTERN-REFERENCE-CORPUS.md`), and the commercial and open-tools landscape (`docs/reference/COMMERCIAL-SOFTWARE-INGEST.md`, `docs/reference/OPEN-TOOLS-INGEST.md`). The product knowledge graph (`docs/project/KNOWLEDGE-GRAPH.md`) names the schema-shaped entities those references map onto.

What is *not* yet in the repo, and is the focus of this research pass:

1. A working catalog of garment families that the prototype can use to look up panel sets, ease ranges, and construction order. The reference corpus names a handful of garments (mostly A-line/shift relatives) but not a structured family table.
2. The gap content under "conventions" — notch type vocabulary, line type vocabulary, label phrasing, regional sizing translations, and block conventions per garment family. `PATTERN-STANDARDS-AND-CONVENTIONS.md` deliberately stops at a list of marks; it does not specify what a single notch vs. a double notch *means*, what a T-notch encodes, or how to translate sizes between US/EU/JP.
3. The actual math that turns a measurement set into panel geometry for the v0.1 garment. `PATTERNMAKING-FUNDAMENTALS.md` lists the concepts (ease, dart, grainline, seam allowance) but explicitly defers the formulas to a later ingest pass: "Open Research: Select a lawful patternmaking source for first-garment drafting formulas."

This research pass closes those three gaps without revisiting territory the existing docs already cover.

## Methodology

Sources used:

- **FreeSewing source code**, particularly the Bella bodice block (`designs/bella/src/back.mjs` and `designs/bella/src/front-side-dart.mjs` on the `develop` branch). FreeSewing is MIT-licensed and explicitly permits commercial use; its parametric construction is the cleanest source of borrowable factors for v0.1.
- **Winifred Aldrich, Metric Pattern Cutting for Women's Wear** (currently 6th edition; the canonical British metric drafting reference). Used via summary articles at Dress Pattern Making, The Shapes of Fabric, and Cotton Noodle, plus the publisher overview, because the book itself is copyright-restricted and we do not redistribute its formulas verbatim.
- **Helen Joseph-Armstrong, Patternmaking for Fashion Design** (the standard American textbook; covers torso foundation, basic block set, and a wide design vocabulary).
- **SewGuide A-line dress drafting tutorial** for conventional A-line flare math.
- **The Shapes of Fabric** ("How to Draft the Basic Bodice Pattern") for a step-by-step metric bodice block draft.
- **In the Folds**, **Textile Learner**, **The Cutting Class**, **Fabrics-Store blog** for notch-type conventions.
- **ISO 8559-1:2017** for body measurement vocabulary; **JIS L 4005** size-code structure as documented in PLAZA HOMES and Wikipedia "Clothing sizes" for Japanese sizing; ASTM D5585 for US misses figure types as referenced in the existing `PATTERN-STANDARDS-AND-CONVENTIONS.md`.

The numeric factors borrowed from FreeSewing Bella are public open-source code; the ease values from Aldrich are widely-discussed public summaries (we do not copy text verbatim). Where the data corpus blends sources, the `factor_provenance` array in the drafting formulas file records which factor came from where.

## Deliverable 1: Garment Family Taxonomy

The taxonomy lives in full in `docs/data-corpus/garment-families.json` (22 families). The narrative below explains the design choices and the structural decisions that aren't visible from the JSON alone.

### Family Selection

Twenty-two families covering the brief: six dress variants (A-line, sheath, shift, wrap, fit-and-flare, slip), five tops (tee, button-up, blouse, tank, crop), four skirts (A-line, pencil, circle, gathered), three pants (trouser, jean, legging), three jackets (blazer, anorak, denim), one menswear-specific (dress shirt), and one unisex (tee). The list is biased toward families that exercise different pattern-shape primitives — dartless rectangles (Atacac-style tunics), darted bodices, gathered/seamed waistlines, princess seams, two-piece sleeves, yoked construction, fly closures, crotch curves, knit/negative-ease — so that the taxonomy is generalizable rather than only A-line-shaped.

### Per-Family Fields And Why They Matter

For each family the corpus stores:

- `panels_required` and `panels_optional` — these directly seed `PatternGraphCandidate.panels`. Required ones must be present; optional ones gate variants.
- `anatomical_landmarks` — the body/garment landmarks the family depends on. These are the points the sketch-intent stage must locate (or ask the user to locate) before drafting can begin. They are also the reference points the validation harness uses for fit checks.
- `closures_common` — for the v0.1 prototype, closures are deferred behind ease (a loose pullover doesn't need a closure), but they govern the back-neck-too-small-for-pullover decision and the side-seam vs. center-back zip choice. The ease threshold for "pullover possible" is a real constraint (see drafting formulas validation).
- `darts_common` — darts are how flat cloth wraps a curved torso. Whether a family needs a dart, and where it goes, defines whether the front and back panels have matching side-seam length naively or only after dart-intake subtraction.
- `ease_woven_cm` and `ease_knit_cm` — per-zone ease ranges as `[min, max]` pairs. Total ease, not wearing ease alone — the pattern is a girth value, the body is a girth value, and the difference is what the cell stores. This is what `EaseProfile` consumes in the knowledge graph. Knit families default to negative ease where applicable (legging, fitted tee).
- `construction_order` — a concrete ordered list of build steps. This is what `GuideSheet` consumes for the human-readable pattern package's assembly section. The orders are conventional and not all permutations are equivalent; for example, in a button-up shirt the yoke must attach before the shoulder seams because the yoke *is* the shoulder seam. The corpus encodes that.
- `complications` and `primary_fitting_challenge` — explicit warnings the validation harness can surface as "the most likely thing to be wrong with this kind of garment." A pencil skirt's primary challenge is walking room; a sleeveless A-line's is armhole gap; a wrap dress is front gape at the bust. Naming these is the difference between validation that finds defects and validation that anticipates them.

### Notable Structural Decisions

- **Fabric is a default, not a fixed property.** A blouse can be silk or cotton voile; a tank can be cotton jersey or silk crepe. The corpus stores a `fabric_default` and provides both `ease_woven_cm` and `ease_knit_cm` ranges where both apply. Downstream the `FabricPropertySet` and the design parameters can override.
- **Ease is total ease.** Wearing ease and design ease are not separated at this level because the *design ease + wearing ease* sum is what determines panel girths. Per-zone breakdowns (Aldrich-style: wearing 4 cm at bust, design 2 cm at bust, total 6 cm) belong in the drafting layer, not the family taxonomy.
- **Construction order is a flat list.** Not a graph yet. Some families have parallel branches (build the lining and the shell concurrently in a blazer), but for v0.1 a flat list is sufficient and matches the assembly-instructions output the prototype renders. Promote to graph when a family demands it.
- **`primary_fitting_challenge` is opinionated by design.** The Orrery design review (finding 13) called for `FixSuggestion` content; the family-level "primary challenge" is the seed for what to suggest first.

## Deliverable 2: Craft Conventions (Gap-Fill)

The conventions live in full in `docs/data-corpus/craft-conventions.json`. The existing `docs/reference/PATTERN-STANDARDS-AND-CONVENTIONS.md` lists the *marks*; this layer specifies what each mark *means*.

### Notch Types

Six notch types are catalogued: `single`, `double`, `triple`, `t_notch`, `balance_mark`, `drill_hole`. Each has a `convention` field that codifies sewing-industry practice:

- A **single notch** identifies front pattern pieces and front-side seams. The exception: a back panel's side seam carries a single notch where it meets a front side seam, because the seam-pair must agree.
- A **double notch** identifies back panel pieces and back-side seams. This is how a sample sewer can pick up two near-mirror panels and immediately know which is which without reading labels.
- A **triple notch** is rare; used to disambiguate near-rotational symmetry (continuous waistband CB, sleeve underarm).
- A **T-notch** is the dual-purpose mark used when notches are punched mechanically rather than cut. The cap of the T sits at the seam line and the stem at the cut line, so the same physical mark records both the cut edge alignment and the seam line position. Industrial patterns prefer T-notches.
- A **balance mark** is a single notch placed at a fit-critical alignment point — the sleeve cap front/back balance, the princess seam balance at bust apex, the gathered skirt/bodice balance at center and quarter points. Notch-shape-wise it's the same as a single notch, but it's emitted under different rules.
- A **drill hole** (or circle, or dot) marks an interior point: dart apex, pocket placement, button placement, end of slits. Drill holes are not edge marks.

For each type, the corpus records `machine_inputs_consumed` (what coordinate or dimension a generator must supply) and `machine_outputs` (what alignment or constraint the notch produces in the validation harness). This is the bridge between drawing notches in SVG and validating that paired panels' notches actually correspond.

Sources: In the Folds, "Notes on: Notching patterns"; The Cutting Class, "Fundamentals of Pattern Making: Pattern Notches"; Textile Learner, "Notches in Pattern Making"; Fabrics-Store, "Sewing Essentials: A Simple Guide to Notches."

### Line Types

Nine line types: cut line, seam line / stitch line, fold line, grainline, dart leg, dart apex, balance line (bust/waist/hip horizontal), lengthen/shorten line, internal feature line, buttonhole line. The repo's `PATTERN-STANDARDS-AND-CONVENTIONS.md` already lists most of these; this corpus adds the `geometry_role` field, which tells the geometry kernel how to interpret the curve:

- A `cut_line`'s geometry role is "outer polygon of panel."
- A `seam_line`'s role is "inset polygon by seam allowance" (which means it's derivable from the cut line plus seam allowance, not stored independently).
- A `fold_line`'s role is "edge classified as fold-axis," used by SVG layout (fold edge sits on the fabric fold during cutting) and by mirror-validation (the panel must be symmetric across this edge).
- A `grainline`'s role is "vector orientation of panel" — a directional property of the panel, not a geometric feature inside it.

Separating `role` (what it means to a sewer) from `geometry_role` (what it means to the kernel) lets the prototype render a single line in different ways depending on context (visible in print, hidden in DXF export, used internally for validation).

### Label Conventions

Cut-count phrasing is standardized:

- `Cut 1 on fold` — single panel cut with one edge on the fabric fold (resulting fabric piece is symmetric across the fold edge).
- `Cut 1` — one piece, intentionally asymmetric (wrap front, single placket).
- `Cut 2 mirrored` — two pieces produced by either folding fabric right-sides together or flipping the pattern (left/right pair).
- `Cut 2 same` — two identical pieces (cuffs, pockets).
- `Cut 4` — common for collars and cuffs where outer + inner + interfacing pairs are needed.
- `Cut 1 main + 1 lining`, `Cut 1 + interface` — explicit combination.

The fabric-role vocabulary is small but standardized: `main`, `fashion_fabric`, `shell`, `lining`, `interfacing`, `fusing`, `interlining`, `binding`, `facing`, `trim`, `contrast`. The required label fields list (garment name, piece name, piece id, size, cut count, fabric role, cut mode, seam allowance state, grainline/foldline presence, version) is what `SewingPatternSheetProfile` needs to stamp on every sheet. The recommendations include avoiding acronyms (CB, CF, HPS) in user-facing labels unless paired with a key, because the Orrery design review's "validation in design language" finding (3) extends to label language too.

### Regional Sizing

Four systems, all referenced against ISO 8559's measurement vocabulary as the internal source of truth:

- **US**: numeric (0, 2, 4, ...) or letter (XS/S/M/L/XL); no single legal standard; ASTM D5585 publishes optional misses figure tables. A reference US size 8 is approximately bust 88 cm, waist 70 cm, hip 94 cm. Pattern brands typically run 1-2 sizes smaller than RTW.
- **EU**: numeric (32, 34, 36, ...). The number ≈ bust circumference in cm minus 76 for women, aligned with EN 13402 / ISO 8559. Reference size 38 is bust 88 cm, waist 72 cm, hip 96 cm.
- **UK**: numeric (8, 10, 12, ...). UK = US + 4 conventionally (UK 12 ≈ US 8 ≈ EU 38).
- **JP**: numeric (5, 7, 9, 11, 13) modified by figure letter (Y/A/AB/B for hip drop) and height letter (PP/P/R/T). A "9-A-R" is bust 83 cm, hip 91 cm, height 158 cm. JP encodes three-axis fit (size, drop, stature) directly into the size code, which is more information than US/EU/UK encode.

The `rough_conversion_notes` array gives the practical thumbnail rules (EU = US + 30, UK = US + 4, JP ≈ US + 5 for numeric mapping). These are starting points only; the corpus emphasizes that for a made-to-measure system, ISO 8559 measurement vocabulary should be the internal canon and the regional size code is a presentation choice.

Sources: ISO 8559-1:2017 standard pages; PLAZA HOMES "Japanese vs. Western Clothing Sizes"; Wikipedia "Clothing sizes"; The ANSI Blog on ISO 8559-1.

### Block / Sloper Conventions

A block is a fitted base pattern with wearing ease only — no design ease, no seam allowance, no closure detail. It's the ground truth from which designs are flat-pattern manipulated. The corpus defines seven block archetypes:

- **Women's fitted bodice block** — front + back; ease 4-8 cm at bust, 2-4 cm at waist; bust dart + waist darts standard. The FreeSewing equivalent is Bella.
- **Sleeveless bodice block** — derived from the fitted bodice by raising the armhole ~1 cm, narrowing the shoulder ~1.3 cm, scooping the armhole inward to remove armhole gap. Aldrich's sleeveless block ends up with about 2.36 cm ease across bust and 5.86 cm ease across the upper bust/underarm.
- **Skirt block** — front + back; ease 1-2 cm at waist, 2-4 cm at hip; one or two waist darts per quarter panel.
- **Trouser block** — front leg + back leg; ease 1-3 cm at waist, 4-8 cm at hip, 4-10 cm at thigh; the defining feature is the front and back crotch curves, with back rise typically 3-5 cm taller than front.
- **Fitted (one-piece) sleeve block** — sleeve only; sleeve cap height + circumference must match the corresponding armhole within an ease ratio (typically 8-15% ease for woven set-in sleeves).
- **Torso block / sloper** — combined bodice + skirt to hip, used as base for sheath dresses and many one-piece garments without a waist seam.
- **Knit block** — front + back + sleeve, drafted with negative ease to account for fabric stretch; sleeve cap ease is minimal (1-2% or zero).

The corpus also catalogues four regional traditions: British (Aldrich) is metric, explicit per-zone ease, darted bodice as default; American (Joseph-Armstrong) is imperial-common, torso-foundation-first, five-piece basic set; Italian is proportional from bust + height; Japanese (Bunka) is proportional from bust, well-documented in JP industry, with shorter torso blocks tuned to JP body proportions. This matters at the drafting layer because choosing a tradition determines which formulas to use; v0.1 hybridizes Italian (Bella's parametric core) and British (Aldrich's ease values).

## Deliverable 3: Drafting Formulas For The V0.1 First Garment

The full math lives in `docs/data-corpus/drafting-formulas-a-line-tunic.json`. Below is the design rationale and the audit trail.

### Why A Hybrid

The Orrery design review (finding 2) flagged that no patternmaker is named on the project, and that the cost of building B5-B9 on a wrong rulebook is enormous compared to one early checkpoint. The honest move for v0.1 is therefore to build on existing, audited rulebooks rather than to write a new one. Two options were on the table:

1. **Pure FreeSewing Bella**. Bella is open-source MIT, parametrically clean, currently maintained, and outputs a standard bodice block. Its weakness: it's a *block*, not a tunic; it commits to twelve very specific measurements (some of which a casual user is unlikely to take, like `hpsToWaistBack`); and its ease defaults are expressed as percentages of measurements (`chestEase: 0.11`) rather than the absolute centimeters most patternmakers think in.

2. **Pure Aldrich**. Aldrich is the most widely-cited British metric reference. Its formulas are stated in absolute centimeters (e.g. "back width = ½ back width measurement + 1.5 cm ease"), which is the language a sample maker speaks. Its weakness: it's copyrighted, and we don't have full lawful access to the per-step math; secondary summaries cover the ease values but not the curve construction.

The v0.1 corpus blends them. The structure of construction (which points to make, in which order, with which curves) follows Bella's parametric form because that's the form we have lawful access to and can audit. The numeric factors come from Bella for the structural points (neck width factor 0.197, across-back factor 0.925, armhole pitch depth factor 0.30, etc.) and from Aldrich-style absolute centimeters for ease (6 cm at bust, 10 cm at waist, 6 cm at hip — values consistent with a loose woven sleeveless tunic per Aldrich's sleeveless block plus extra design ease for tunic posture). The third source — A-line flare practice via SewGuide — provides the hem-sweep convention (20 cm added sweep total, 10 cm front + 10 cm back, distributed equally as 5 cm per quarter panel from hip to hem).

### Construction Highlights

**Coordinate system**: origin at HPS (high-point shoulder) on the centerline (CF for front, CB for back); x positive toward side seam; y positive downward toward hem. This matches FreeSewing's convention and most published bodice draft tutorials.

**Back panel** (~13 named steps): origin → back neck drop → HPS → shoulder endpoint → armhole bottom → armhole pitch → waist line → hip line → hem line → neckline curve (cubic Bezier) → armhole curve (two-segment Bezier joined smoothly at pitch) → side seam (waist → hip → hem polyline for v0.1, smooth curve for v0.2) → optional waist dart.

**Front panel** (~14 named steps): same skeleton plus a bust apex point and an optional bust dart. Front uses full-bust circumference; back uses high-bust. The difference between front quarter-panel width at bust and back quarter-panel width at bust becomes the bust dart intake when `(bust - high_bust) > 5 cm`. The dart construction follows Bella's rotation-around-bust-apex method: the side seam segment from armhole bottom to bust line is rotated about the bust apex by an angle alpha, with alpha solved iteratively until the rotated side seam at bust line matches the target front bust width.

**Neckline**: four neckline shapes are pre-baked (round, scoop, V, boat), each with its own pair of cubic Bezier control points and front-neck-drop factor. The back neckline is shallow and standardized (drop ≈ 5% of neck circumference, single Bezier).

**Armhole**: cubic Bezier from shoulder to armhole bottom, passing through the armhole pitch reference point. The pitch is a notch location (1/3 down the armhole from shoulder, ~92.5% of the way out from CB to shoulder for the back; ~95% of the way out for the front). Smooth tangent at pitch is enforced by mirroring the control points around the pitch point.

**Side seam**: from armhole bottom through (optionally) bust dart top/bottom, then waist side, then hip side, then hem side. v0.1 ships as a polyline because polyline matching against paired seams is easy to validate; v0.2 should replace with a single smooth curve.

**Hem**: straight horizontal at `garment_length` y-value; hem width = hip width + 5 cm sweep per quarter panel; sweep is added at the side, not at the center, so the panel keeps a vertical CF/CB.

### Validation Rules

The drafting formulas file ships six v0.1 validation rules with named `fix_suggestions`:

1. Side seam length match (front - dart intake == back, within 0.3 cm).
2. Shoulder seam length match (front == back, within 0.2 cm).
3. Armhole perimeter reasonable (sum of front and back armhole perimeters between 45% and 65% of bust).
4. Neck perimeter pullover check (if pullover, neck perimeter > head circumference, where head ≈ 1.65 × neck circumference if not directly measured).
5. Hem sweep balanced (front and back hem widths match within 0.5 cm).
6. Dart apex distance (if dart present, dart apex shall sit 2-3 cm short of the measured bust apex point).

Each rule has an explicit `fix_suggestions` array. This is the seed for the `FixSuggestion` work the Orrery design review (finding 13) called for. v1 of validation has a small library of templates per check; v2 grows the library.

### Default Seam Allowances

Per-edge defaults: 1.0 cm at neckline and armhole (small enough for binding/facing); 1.5 cm at shoulder and side seams (standard); 3.0 cm at hem (allows for blind-hemming or topstitched double-fold); 0 at the fold edge (cut-on-fold).

### Notch Placement

Five notches in the v0.1 garment: side seam at waist (single front, double back), side seam at hip (single, both panels), armhole at pitch (single front, double back), shoulder at midpoint (single, both panels — only required if the shoulder is curved), neckline at HPS (single, both panels, for binding/facing alignment).

### Audit Notes

The corpus includes an `audit_notes_for_patternmaker_review` array that flags every place the hybrid is unverified by a sewn muslin. The most important caveats:

- The `armhole_depth = hps_to_waist_back * 0.42` blend factor is a midpoint between Bella's parametric form and Aldrich's "half back length plus 1.5 cm" formula. Either extreme is defensible; the midpoint is a guess until tested.
- The bust-dart threshold of 5 cm for `(bust - high_bust)` is conventional but should be validated against a small set of real body measurements.
- Bella's rotation-around-apex dart method introduces a kink at the waist when waist ease is small; the v0.1 generator may need to "true" the side seam after the dart rotation.
- v0.1 ships with a polyline side seam; v0.2 should replace with a single smooth Bezier or Catmull-Rom.

These are the patternmaker-checkpoint items per Orrery design review finding 15.

## How The Corpus Plugs Into The Pipeline

```
sketch
  -> sketch-intent classifier
       sets garment_family.id (-> garment-families.json)
  -> family lookup
       seeds panels_required, ease defaults, darts_common, construction_order
  -> measurement set + design parameter selection
       loads drafting-formulas-a-line-tunic.json (when family == dress.a_line)
  -> generator walks step_order
       emits Panel entities with cut/seam lines, grainline, foldline
  -> validation
       applies validation_rules_for_v0_1; failures populate FixSuggestion
  -> renderer
       reads craft-conventions.json (line types, notch types) for SVG style
       reads label_conventions for piece labels
  -> SewingPatternSheetProfile output (SVG/PDF)
```

The corpus is small enough to load into the generator at startup; it is large enough to determine the geometry of v0.1 without writing additional drafting code per garment. When v0.2 adds a second garment family (e.g. shift dress without flare, or a basic skirt), only a second drafting-formulas file is needed; the families and conventions tables already cover the metadata.

## Open Questions And Blockers

Worth surfacing before this corpus is treated as ground truth:

1. **No patternmaker review yet.** The drafting formulas hybrid has not been sewn into a muslin. Aldrich's ease values are summary-derived. Treat the `default` and `range` values in `drafting-formulas-a-line-tunic.json` as starting points pending a 30-minute review with someone who has sewn many A-line tunics.
2. **FreeSewing factors are version-pinned implicitly.** The factors (neckWidthBack=0.197, acrossBackFactor=0.925, etc.) come from FreeSewing develop branch in 2026-05. If the upstream changes, the borrowed factors don't auto-track. Either copy the relevant Bella module into the repo with attribution, or pin a FreeSewing version in `package.json` if FreeSewing becomes a runtime dependency.
3. **Knit-fabric ease ranges are conservative.** They're based on common sewing community defaults rather than measured stretch behavior. Real stretch numbers (e.g. 25% recovery, 50% extension under standard load) are part of a future `FabricPropertySet` ingest, not this pass.
4. **JP sizing detail is thin.** The corpus records the size-code structure (number-figure-height) but doesn't ship a size-code-to-measurement table. JIS L 4005 itself is the right source for that table; we did not have lawful access to its full contents.
5. **Block conventions skip menswear.** The block-sloper section is heavily women's-pattern-biased because the v0.1 garment is a women's sleeveless A-line. A second-pass should add the men's torso block (Aldrich and Joseph-Armstrong both publish them) once the menswear families need their own drafting formulas.
6. **Construction-order graph is flat.** Some garments (blazer, button-up) have parallel construction streams that a real sewer manages via a checklist, not a linear sequence. The corpus encodes a defensible serialization, but a graph would be more honest.

None of these block v0.1 generation. They block confident claims about v0.1 manufacturability — which the project has already explicitly deferred (see `CLAUDE.md` rule: "Do not claim manufacturability without an exported pattern package and human review criteria.").

## Sources

- **FreeSewing** (MIT). Bella bodice block source on GitHub: https://github.com/freesewing/freesewing/tree/develop/designs/bella/src — `back.mjs`, `front-side-dart.mjs`, `index.mjs`. Documentation: https://freesewing.eu/docs/designs/bella and https://freesewing.eu/docs/about/notation/ (already cited in `PATTERN-STANDARDS-AND-CONVENTIONS.md`).
- **Winifred Aldrich, Metric Pattern Cutting for Women's Wear** (Wiley-Blackwell; currently 6th edition). Publisher overview: https://books.google.com/books/about/Metric_Pattern_Cutting_for_Women_s_Wear.html?id=X3ntBgAAQBAJ. Sample download: https://download.e-bookshelf.de/download/0000/5989/88/L-G-0000598988-0002339537.pdf
- **Helen Joseph-Armstrong, Patternmaking for Fashion Design** (Pearson). Internet Archive borrow: https://archive.org/details/patternmakingfor0000jose_q3g3
- **Dresspatternmaking.com**, "Ease in Bodice: Aldrich": https://dresspatternmaking.com/other/analyzing-other-block-making-intro/ease-bodice-aldrich/ ; "Ease in the Bodice: Joseph-Armstrong": https://dresspatternmaking.com/patternmaking-basics/analyzing-other-block-making-intro/ease-in-the-bodice-joseph-armstrong
- **The Shapes of Fabric**, "How to Draft the Basic Bodice Pattern": https://www.theshapesoffabric.com/2019/10/07/how-to-draft-the-basic-bodice-pattern/
- **Cotton Noodle**, "Making a block using Winifred Aldrich's Metric Pattern Cutting": https://www.cottonnoodle.com/blog/making-a-block-using-winifred-aldrichs-metric-pattern-cutting/
- **Steely Seamstress**, sleeveless bodice block walkthrough using Aldrich: https://steelyseamstress.wordpress.com/2019/11/10/makenine2019-making-a-bodice-block-for-a-sleeveless-top-using-metric-pattern-cutting-by-winifred-aldrich-part-1/
- **SewGuide**, "Make An A-line Dress (Free Sewing Pattern & Tutorial)": https://sewguide.com/a-line-dress-pattern/
- **In the Folds**, "Notes on: Notching patterns": https://inthefolds.com/blog/2017/1/9/notes-on-notching-patterns
- **The Cutting Class**, "Fundamentals of Pattern Making: Pattern Notches": https://www.thecuttingclass.com/pattern-notches-alexander-wang/
- **Textile Learner**, "Notches in Pattern Making: Types and Importance": https://textilelearner.net/notches-in-pattern-making-types-and-importance/
- **Fabrics-Store / the thread**, "Sewing Essentials: A Simple Guide to Notches": https://blog.fabrics-store.com/2026/03/01/sewing-essentials-a-simple-guide-to-notches/
- **ISO 8559-1:2017**, Size designation of clothes — anthropometric definitions for body measurement: https://www.iso.org/standard/61686.html ; The ANSI Blog summary: https://blog.ansi.org/ansi/iso-8559-1-2017-size-designation-of-clothes/
- **PLAZA HOMES**, "Japanese vs. Western Clothing Sizes": https://www.realestate-tokyo.com/living-in-tokyo/japan-info/clothing-sizes-in-japan/
- **Wikipedia**, "Clothing sizes": https://en.wikipedia.org/wiki/Clothing_sizes

## Knowledge Graph Additions

These are proposed nodes/edges to add to `docs/project/KNOWLEDGE-GRAPH.md`. Per task instructions, this file does not edit the knowledge graph; the additions are for follow-up integration.

### New Nodes

- `GarmentFamily` — catalog entry from `garment-families.json`. Fields: `id`, `label`, `fabric_default`, `fits_typical`, `panels_required`, `panels_optional`, `landmarks`, `closures_common`, `darts_common`, `ease_woven_cm`, `ease_knit_cm`, `construction_order`, `variants`, `complications`, `primary_fitting_challenge`. Sits as a sibling to `PatternGrammar`; classifies a `SketchIntent` early in the pipeline.
- `NotchType` — entry from `craft-conventions.json` notch_types. Fields: `id`, `convention`, `machine_inputs_consumed`, `machine_outputs`. Distinct from the existing `Notch` instance node: `Notch.type` references a `NotchType`.
- `LineType` — entry from `craft-conventions.json` line_types. Fields: `id`, `role`, `geometry_role`. Used by `SewingPatternSheetProfile` and the renderer.
- `LabelConvention` — phrasing tables and required label fields. Used by the package generator.
- `RegionalSizingProfile` — per-region (`us`, `eu`, `uk`, `jp`) sizing system metadata. Connects `MeasurementProfile` to user-facing size codes.
- `BlockArchetype` — per-block panel/ease/landmark spec. Sub-type of `BlockPattern` already in the graph; archetypes are catalog entries, instances are concrete blocks.
- `BlockTradition` — `Aldrich`, `JosephArmstrong`, `Italian`, `Bunka`. A `DraftingRuleSet` cites a `BlockTradition`.
- `FactorProvenance` — `factor`, `source` records. Allows the validation/ADR layer to trace why a numeric factor has the value it does.
- `FixSuggestion` — concrete suggestion attached to a `ValidationFinding`. Already implied by the Orrery review; this corpus formalizes the field.

### New Edges

```text
SketchIntent -> GarmentFamily
GarmentFamily -> Panel (panels_required)
GarmentFamily -> EaseProfile (default ease)
GarmentFamily -> Dart (darts_common)
GarmentFamily -> ClosureType (closures_common)
GarmentFamily -> ConstructionStep (construction_order)
DraftingRuleSet -> BlockTradition
DraftingRuleSet -> FactorProvenance (one per borrowed factor)
PatternGraph -> ValidationFinding -> FixSuggestion
SewingPatternSheetProfile -> LineType
SewingPatternSheetProfile -> NotchType
Notch.type -> NotchType
PatternPackage -> LabelConvention
MeasurementProfile -> RegionalSizingProfile
BlockPattern -> BlockArchetype
PatternTransformation -> BlockArchetype (operates on)
```

### Required Schema Additions

- `Panel.notch_type_per_notch` → reference to `NotchType.id` so the renderer can switch between single/double/T/balance shapes.
- `ValidationFinding.fix_suggestions` → array of `FixSuggestion` records.
- `DraftingRuleSet.factor_provenance` → array, mirroring the corpus file's array.
- `MeasurementSet.regional_size_code` → optional, keyed by `RegionalSizingProfile.id`.

These additions extend rather than break the existing graph. The Fundamentals Layer, Pattern Program Layer, and Industrialization Layer all stay where they are. The Pattern Family / Catalog layer is new and sits between `SketchIntent` and `PatternGrammar`, replacing some of the implicit "we know it's an A-line" logic with explicit catalog references.
