# Semantic Curve Interpretation — State Of The Art Survey

Date: 2026-05-03
Author: Orrery (architecture/structure orb)
Audience: Garment Pattern Lab implementation team and knowledge graph maintainer

## Frame

After raster-to-vector preprocessing (`RasterToVectorBridge`) the system holds a
bag of bezier curves and polylines that draw a garment. This is geometry without
meaning: nothing in the file says "this curve is the hem." Pattern generation
needs the opposite — every curve labeled with its garment role (hem, neckline,
armhole, side seam, shoulder, dart, center fold, style line) and its
front/back/inside/outside identity. That step is **semantic curve
interpretation**, distinct from image-to-mesh reconstruction and distinct from
freeform vector authoring. Greg's framing: image-to-mesh "makes an orange from a
photo, it doesn't annotate it with the plant facts about oranges."

The narrow product job is therefore:

```
VectorSketchLayer (typed bezier curves, no semantics)
  -> LandmarkSet (anatomical anchor points)
  -> SketchIntent (per-curve garment role, front/back assignment, dart presence)
  -> GarmentParameters (numeric design variables)
```

This survey covers four lanes — sketch parsing ML, garment-specific semantic
models, heuristic/hybrid approaches, and manual fallback UX — and ends with an
opinionated v0.1 recommendation. It deliberately does not duplicate detail from
[`RESEARCH-PAPERS-INGEST.md`](../reference/papers/RESEARCH-PAPERS-INGEST.md);
where a method is already ingested there, this doc links and extends rather than
repeating.

---

## Lane 1 — Sketch Parsing And Sketch Understanding (General)

These are general-purpose sketch ML methods. They are the backbone of any
"deep" interpretation later, but none of them produce per-curve garment labels
out of the box.

### Sketch-RNN (Ha & Eck, 2017)

URL: https://arxiv.org/abs/1704.03477. Dataset: QuickDraw.
A sequence-to-sequence VAE over stroke sequences. Trained per-class (cat, fan,
yoga, etc.). Output is **whole-sketch class** plus generative continuation of
strokes, not per-stroke role labels. Useful as historical ancestor; not useful
to label which curve is a hem.

Applicability to Pattern Lab: low. Wrong granularity (whole-sketch class), wrong
input (raster strokes, not bezier curves), no garment-aware vocabulary.

### Sketch-A-Net (Yu et al., 2015)

URL: https://arxiv.org/abs/1501.07873.
CNN classifier over rasterized sketches. **Sketch classification** only. Useful
as a garment-family detector (`is this an A-line tunic vs a button-down?`),
which is one piece of the pipeline (it sets which prior to use), but it does
not label curves. Modern image classifiers (CLIP, DINOv2, SigLIP) subsume this.

Applicability: low for curve labels. Useful as a coarse garment-family classifier
upstream of any per-curve interpretation.

### SketchGNN, SketchSeg, sketch graph methods

URL: https://arxiv.org/abs/2003.00678 (SketchSeg-Net).
URL: https://arxiv.org/abs/2103.00139 (SketchGNN).
A graph network where each stroke is a node, edges encode spatial/temporal
adjacency, and the model emits per-stroke semantic labels (e.g. for a face:
eye, nose, mouth, ear). This is **the right structural shape** for our problem
— per-stroke labels with garment vocabulary.

Limitations:

- Trained on QuickDraw + SPG (Sketch Perceptual Grouping) labels. No garment
  taxonomy exists.
- Stroke-temporal information is unavailable for vectorized sketches (we do not
  know stroke order). Curve adjacency only.
- Requires labeled data: a corpus of sketches with each curve annotated as
  hem/armhole/etc. We do not have that, and producing it is the bulk of the
  work.

Applicability: high in principle, blocked by data. Best long-term ML target
once we own a labeled corpus from the heuristic+manual loop described below.

### Polyvec / structured vector outputs (PolyFit, BezierSketch, DeepSVG)

- BezierSketch: https://arxiv.org/abs/2007.02190. Generates bezier strokes from
  raster sketches, optimizing for clean parametric curves.
- DeepSVG: https://arxiv.org/abs/2007.11301. Hierarchical generative model over
  SVG path commands.
- Im2Vec: https://arxiv.org/abs/2102.02798. Differentiable rasterizer training
  raster→vector models.

These solve **vectorization quality**, not semantic labeling. They sit in
`RasterToVectorBridge`, before our lane begins. Important to track because the
quality of curve segmentation determines what semantic interpretation is
possible — a hem split into seven micro-arcs is much harder to label than one
clean bezier.

### CLIPasso / CLIP-stroke methods

URL: https://arxiv.org/abs/2202.05822.
Use CLIP image-text alignment to drive stroke generation. Could in theory be
used in reverse: caption a curve region with CLIP. In practice the spatial
resolution is poor and CLIP has no garment-anatomy vocabulary. Not
recommended.

### LLM-as-vision-parser (GPT-4V / Claude / Gemini multimodal)

Not a published "method" — an emerging practice. Send the SVG plus a rasterized
preview to a multimodal LLM with a prompt: "label each path id with its garment
role from this list." Tractable today. Quality varies. Useful as a **bootstrap
labeler** to seed a corpus that smaller, faster models can later be trained on.
Costs and privacy are real (uploads, IP).

Applicability: medium. Best framed as one of several heuristic/assist signals
fused with rule-based interpretation, not as the system of record.

---

## Lane 2 — Garment-Specific Semantic Models

The garment-aware research lane is much closer to the problem, but most of it
operates on photographs or 3D meshes, not vector sketches.

### Fashion image segmentation (DeepFashion, FashionPedia, ATR, LIP)

- DeepFashion: https://mmlab.ie.cuhk.edu.hk/projects/DeepFashion.html
- FashionPedia: https://fashionpedia.github.io/home/
- ATR (Active Template Regression): https://arxiv.org/abs/1503.02391
- LIP (Look Into Person): http://sysu-hcp.net/lip/

These predict pixel masks for garment regions ("dress", "skirt", "sleeve",
"collar") on photographs of people. Mask R-CNN trained on FashionPedia gives
clean instance masks per garment part.

Relevance: useful upstream of vectorization (e.g. if a designer uploads a *photo*
of a draped garment and we want to isolate it from the body), and useful as a
spatial prior — a "neckline" mask region tells the curve labeler that the
topmost arc inside that mask is the neckline. But these models segment *pixel
regions*, not bezier curves, and they do not distinguish front from back from a
single sketch.

Applicability: medium as a regional prior fused with curve geometry, low as a
direct curve labeler.

### Fashion landmark detection (FashionAI Keypoints, DeepFashion2, FLD)

- FashionAI Keypoints: https://tianchi.aliyun.com/competition/entrance/231648
- DeepFashion2: https://github.com/switchablenorms/DeepFashion2
- Fashion Landmark Detection: https://arxiv.org/abs/1608.03049

These predict keypoints on photos of garments — neckline_left,
neckline_right, hem_left, hem_right, sleeve_cuff, etc. **This is the closest
existing model family to the landmark vocabulary we need.** DeepFashion2's
landmark schema covers 13 categories with 23–294 keypoints depending on
garment.

Relevance to vectorized sketches: high *as supervision design*. The vocabulary
is directly transferable. But the models themselves are trained on
photographs; transferring to clean line drawings is a domain shift that has
not been broadly studied. Two reasonable strategies:

1. Render the vector sketch as a clean line image and feed it through a
   landmark model fine-tuned on synthetic line renders of the same garments
   (GarmentCodeData can produce these).
2. Use the keypoint vocabulary as the schema for our heuristic landmark
   detector and later as the supervision target for a sketch-native model.

We pick (2) for v0.1 and keep (1) as a research lane.

### Pose-conditioned garment landmark methods

Methods that join human-pose estimation (OpenPose, MediaPipe, RTMPose) with
garment landmarks. Useful when a sketch is on a posed figure: pose gives you
shoulder, hip, knee anchors which constrain where neckline/hem can be. For
on-body croquis sketches in Lane B human-authored input this is a strong
heuristic: shoulder keypoint → expect neckline curve passing nearby; hip
keypoint → expect waist or side-seam crossing.

Applicability: high for on-body sketches; nil for technical flats off-body.

### Text-to-pattern systems and their parsers (GarmentDiffusion, GenPattern,
SewingGPT, SketchTailor)

Already ingested in
[`RESEARCH-PAPERS-INGEST.md`](../reference/papers/RESEARCH-PAPERS-INGEST.md).
Two relevant observations for *our* lane:

- GarmentDiffusion's **edge tokens** are exactly the structured vocabulary the
  output of semantic interpretation should converge toward (endpoint, control,
  arc, stitch role, free-edge role). Its tokenizer is a target representation
  for our `SketchIntent`.
- GenPattern's **dual-graph** (geometry graph + semantic graph) is the right
  separation: vector geometry is one graph, semantic role assignments are a
  parallel graph keyed by the same curve ids. Pattern Lab's interpretation
  output should produce both, not only labeled curves.

These are model targets, not present-tense tools. None are public, productized,
or ready to be called as a service.

### GarmentCode-derived sketch parsers

GarmentCode (https://igl.ethz.ch/projects/GarmentCode/) ships a parametric
authoring DSL, not a sketch parser. Some follow-up work (SewFormer, SewingLDM)
goes from images/3D to GarmentCode programs, not from vector sketches to
labels. Useful as a **target representation**: if our interpretation produces a
labeled curve graph that maps cleanly into a GarmentCode component description,
we get free downstream interop.

### SewFormer

URL: https://arxiv.org/abs/2311.04498. NeRF-of-sewing-patterns from a single
image. Outputs a full pattern. Closer to "magic black box" than labeling.
Trained on SewFactory. Not a per-curve labeler.

### Summary of Lane 2

There is no off-the-shelf model that takes a vector sketch and emits per-curve
garment labels. The closest existing supervision (FashionAI / DeepFashion2
keypoints) is on photographs and uses a vocabulary we should adopt. The 2D-3D
generative systems are useful as eventual targets and as evidence that
structured per-curve labels are the right output shape, but they are not
present-day labelers we can call.

---

## Lane 3 — Heuristic / Hybrid Approaches

This is where the prototype actually lives.

### The argument for heuristics first

The v0.1 garment is exactly one family — sleeveless A-line woven tunic, front
and back views. It has a small, well-defined landmark set: neckline, two
shoulders, two armholes, two side seams, hem, optional bust darts, optional
center-back seam. The geometric rules that distinguish them are not subtle:

- **Hem**: longest roughly-horizontal curve at the bottom of the front (or back)
  panel.
- **Neckline**: closed curve at the top, smaller than the figure's shoulder
  span, intersecting the vertical center line.
- **Armhole**: pair of curves opening laterally at the top, between shoulder
  endpoint and side seam start.
- **Shoulder**: short, near-horizontal segment between neckline endpoint and
  armhole top.
- **Side seam**: vertically-dominant curve between armhole bottom and hem end.
- **Center front/back**: vertical axis of symmetry; curves crossing it are
  full-width, curves not crossing it are half-width and the panel is
  cut-on-fold.

A small rule-based interpreter that consumes a clean vector sketch with
front/back assignment can label this set with high reliability. Where it
struggles (occluded curves, ambiguous darts, asymmetric design choices) the
manual correction surface picks up. This is the v0.1 plan.

### Constraint solvers and parametric CAD landmark systems

Comparable patterns elsewhere:

- **FreeCAD Sketcher** and **Onshape** use geometric constraint solvers
  (horizontal/vertical/coincident/tangent/symmetric/equal-length) to fix
  sketch elements once labels are assigned. Their *initial* label assignment
  is a mix of user clicks and the inference rule "this newly drawn line that
  is nearly horizontal — make it horizontal."
- **Solvespace** does the same with a smaller solver.
- **FreeSewing** (https://freesewing.org) generates patterns parametrically
  rather than parsing them, but its part definitions are an excellent
  reference for **what the labeled output should contain**: each part declares
  its points, curves, paths, and snippets with names like `neck`, `armhole`,
  `hem`, `cf` (center front).
- **Seamly2D / Valentina** (https://seamly.net) has a similar named-point and
  named-curve discipline.

The transferable lesson: garment-domain libraries already speak in named
landmarks ('necklineLeft', 'armhole_back', 'hem_center'). Our labels should
reuse this vocabulary so we read like patternmaking software, not like a
generic sketch tagger. This vocabulary is captured in the structured corpus
file `garment-family-landmark-priors.json`.

### Geometric heuristics (the rule library)

A practical heuristic interpreter combines a handful of geometric primitives:

1. **Bounding analysis**: panel bbox, vertical center line, top/bottom y bands.
2. **Curve classification by tangent statistics**: predominantly-horizontal vs
   predominantly-vertical vs predominantly-curved vs short-and-straight.
3. **Endpoint adjacency graph**: which curves share endpoints, building a
   panel boundary cycle.
4. **Symmetry detection**: does the curve set reflect across a vertical axis?
   If so, the axis is `center-front` (front view) or `center-back` (back view),
   and curves not crossing it are half-width fold pieces.
5. **Topological position**: assign labels by walking the boundary cycle
   starting at the highest-vertical-center point (neckline center) and going
   clockwise: neckline → shoulder → armhole → side seam → hem → side seam →
   armhole → shoulder → back to neckline.
6. **Closed-vs-open curves inside the boundary**: short closed curves inside
   the panel near bust height = darts. Diagonal lines from boundary to
   interior = dart legs.
7. **Front-vs-back disambiguation**: if both views are present,
   neckline-depth-front > neckline-depth-back is a near-universal rule for
   non-backless designs; if depth is inverted, front/back is mirrored.

These are not novel. They are the rules a skilled human reader applies in two
seconds. The contribution is encoding them as named, testable, *failable* rules
with confidence scores and explicit fallbacks.

### Hybrid: priors plus a small ML enrichment

Once a small labeled corpus exists, a logistic / gradient-boosted classifier
over per-curve features (length, mean tangent angle, variance of curvature,
endpoint position relative to panel bbox, curve role of neighbors) is enough
to reach 90%+ on a constrained garment family. This is the right next step
after v0.1 ships, not before.

A heavier transformer-over-curves model (GraphSAGE, point-cloud-style
attention over endpoints) is the GarmentDiffusion-shaped target. Don't reach
for it until the corpus has thousands of labeled examples.

### Risk of heuristics-only

- **Garment-family lock-in**: a rule library tuned for sleeveless A-line will
  not generalize to a button-down shirt without rewriting half the rules.
  Mitigation: keep the rule library factored by garment family from day one
  (`priors/sleeveless-a-line.json`, future `priors/button-down-shirt.json`).
- **Brittleness on hand-drawn sketches**: a rough Procreate sketch with the
  hem split into 14 little arcs breaks "longest horizontal curve at bottom".
  Mitigation: a curve-coalescing preprocessing step (merge near-collinear
  adjacent beziers below a length threshold) runs before semantic labeling.
- **Ambiguity is not handled**: rules either fire or do not. A real
  interpreter must say "I am 60% sure this is a side seam, possibly a style
  line." Mitigation: each rule emits a confidence score, and any landmark
  with confidence below threshold goes into `AmbiguityReport` for human
  confirmation rather than into `SketchIntent` silently.

---

## Lane 4 — Manual Fallback UX Patterns

The first prototype is allowed — actually expected — to ask the user. The
question is what shape that asking takes.

### Image segmentation labelers

- **Label Studio** (https://labelstud.io): generic labeling with a polygon /
  keypoint / brush UI. Their schema is JSON-configurable. Our flavor would be:
  "click a curve, choose a label from this fixed taxonomy." Useful as a
  **layout reference** for the panel-side correction view.
- **CVAT** (https://www.cvat.ai/): similar, more video-oriented. Same takeaway.
- **Roboflow** (https://roboflow.com): cloud annotation; their key insight is
  "show the model's prediction, let the user *confirm or correct*, never let
  them start from blank." This is the right interaction model.
- **Labelbox** (https://labelbox.com): same shape, enterprise polish.

The pattern: **predict, present, accept-or-correct, never start blank**. The
v0.1 prototype's correction UX should always show the heuristic's best guess
first, with an "accept" / "change" affordance per curve.

### Pose annotation tools

OpenPose's annotation tool, COCO Annotator, Coco-Annotator-style keypoint
tools all share one good pattern: the user clicks once per **slot** in a fixed
schema, not once per shape they want to draw. Slots are named ('left
shoulder', 'right shoulder'). The system maintains the schema; the user fills
it. This maps directly to garment landmarks: there are 14 named slots in a
sleeveless A-line panel, and the user is filling them, not inventing them.

### CAD constraint solver UX (Onshape, Fusion 360, FreeCAD)

These tools let the user "tell" the system about a curve after it is drawn:
"this segment is horizontal," "these two are equal length," "this is a
construction line." The right Pattern Lab analog: the user can right-click a
curve and pick its garment role from a constrained menu. The menu is the
schema. The system has already pre-filled the menu with its best guess.

### 3D modeling tools (Blender, Maya)

Blender's vertex/edge/face groups + naming, Maya's deformer landmark sets.
Useful pattern: **named groups are first-class, persisted, addressable
elsewhere**. Once a curve is labeled `hem-front`, downstream pattern code can
reference it by name rather than by id, and edits to the sketch keep the
label attached even if the underlying curve is re-traced. Pattern Lab's
schema should keep label-by-name (`role: 'hem-front'`) as the primary
addressing mode.

### What the v0.1 manual fallback looks like

A single screen:

- left: the vectorized sketch with curves color-coded by predicted role.
- right: a fixed list of expected landmark slots for this garment family with
  the predicted curve filled in, an "accept" / "reassign" / "missing"
  affordance per slot.
- bottom: an `AmbiguityReport` showing low-confidence predictions and
  suggested clarifications.

The user confirms or corrects until all required slots are filled and high-risk
ambiguities are resolved. Then `SketchIntentPromotionState` advances:
`interpreted` → `user-corrected` → `confirmed`.

Every correction is logged as a labeled training example for the future ML
enrichment lane (the `IntelligenceLearningLoop` in the knowledge graph). This
is the data flywheel: heuristic predicts, user corrects, correction becomes
training data, ML enrichment displaces heuristics over time.

---

## Recommendation For The Prototype

**Build the heuristic interpreter, ship the manual correction surface, log
every correction as training data, defer ML enrichment until the corpus is
real.**

Concretely, v0.1 of the semantic interpretation surface is:

1. **Garment-family classifier (1 line of code today)**: hardcode
   `garment_family = 'sleeveless-a-line-woven-tunic'`. The user already told
   us by uploading into that program. Future: a light multimodal classifier
   when we add a second family.

2. **Curve preprocessing**: coalesce adjacent near-collinear beziers, snap
   shared endpoints, detect symmetry axis, build the panel boundary cycle.
   Reuses the same `CurveKernel` operations the geometry kernel needs anyway.

3. **Heuristic rule library**: per-garment-family JSON describing each
   expected landmark with anatomical reference, expected curve geometry, and
   the discriminating rule. This is the new corpus file
   `garment-family-landmark-priors.json`. The interpreter is a generic engine
   that loads a prior file and applies it.

4. **Confidence policy**: each rule emits a `[0, 1]` confidence. Below 0.6
   the landmark goes into `AmbiguityReport` and is shown as "unclear"
   in the correction UI. Above 0.6 it appears as a soft prediction the user
   can accept or override.

5. **Manual correction surface**: predict-present-accept-or-correct, with the
   landmark slot list as the fixed schema.

6. **Correction log**: every accept/override is appended as a labeled training
   record `(curve_features, predicted_label, user_label,
   garment_family_id, sketch_id)`.

This is **explicitly progressive**:

- v0.1: heuristic + manual.
- v0.2: light classifier (gradient boosting) trained on the correction log,
  surfaced as a second opinion alongside the heuristic, fused by simple
  weighted vote. Heuristic remains the floor.
- v0.3: per-curve graph network (SketchGNN-shaped) trained on a bigger corpus
  that includes synthetic sketches rendered from GarmentCodeData panels.
- v1.0: GarmentDiffusion-shaped multimodal interpreter that reads the sketch
  *and* the user's natural-language description of the garment and produces
  full `SketchIntent` directly, with the rule-based interpreter retained as a
  validator.

The architecture lesson: the heuristic interpreter and the ML interpreter
**must produce the same shape of output**. If the heuristic emits typed
labeled curves with confidences, the ML enrichment can replace it
function-by-function. If the heuristic emits a bespoke ad-hoc data structure,
the ML lane requires a rewrite. Define the output schema once (a `SketchIntent`
JSON shape and a per-curve `roleAssignment` record), and treat both heuristic
and ML as *implementations* of the same interface.

---

## Integration Sketch

```
HumanSketchInput / GeneratedSketchInput
  -> RasterToVectorBridge  (existing lane, not this surface)
  -> VectorSketchLayer     (typed curves, no semantics)
  -> SemanticInterpretationSurface  (this lane)
       1. CurvePreprocessor       — coalesce, snap, symmetry detect
       2. PanelBoundaryBuilder    — cycle detection, front/back split
       3. HeuristicLabeler        — applies prior file for garment family
       4. ConfidencePolicy        — split into confident vs ambiguous
       5. ManualCorrectionPanel   — predict/present/accept/correct UI
       6. CorrectionLogger        — appends to learning corpus
  -> SketchIntent (confirmed)
  -> GarmentParameters
  -> PatternGraphCandidate -> PatternGraph
```

The new package boundary fits inside `packages/sketch-intent/`. The `priors/`
subdirectory hosts garment-family JSON files. The `interpreter/` subdirectory
hosts the generic engine. The correction UI lives in `app/` since it is
product-shell, not engine.

---

## Open Questions

- **Curve coalescing thresholds**: how aggressively do we merge
  near-collinear adjacent beziers without destroying intentional segmentation
  (e.g. dart legs that touch the boundary)? Needs experiment with real
  vectorized human sketches.
- **Confidence calibration**: is 0.6 the right ambiguity threshold, or should
  it be per-landmark (high-stakes ones like hem need higher threshold)?
- **Front/back disambiguation when only one view is present**: do we ask, or
  guess from neckline depth alone, or require explicit upload metadata?
- **Symmetry tolerance**: most hand-drawn sketches are asymmetric by
  millimetres. What axis-detection tolerance produces stable
  center-front/center-back identification without hallucinating a fold where
  there isn't one?
- **Dart detection**: dart legs are short and easy to confuse with style
  lines. Can we require that the user always confirms darts manually for v0.1
  even when the heuristic is sure?
- **Multimodal LLM as a secondary signal**: is the cost/latency/privacy
  acceptable to call an LLM as a second-opinion labeler on each upload, or
  should LLM use be reserved for failure-mode review only?
- **Data flywheel governance**: corrections become training data. What is the
  consent model for using a designer's corrections to train a future model
  (`InputProvenance`, `IntelligenceLearningLoop`)? Not blocking for v0.1
  internal use; blocking for any external user upload.

---

## Knowledge Graph Additions

These nodes and edges are proposed for `KNOWLEDGE-GRAPH.md`. Do not edit that
file directly — promote through whatever process the maintainer uses.

**New nodes:**

- `SemanticCurveInterpreter` — engine that consumes `VectorSketchLayer` plus a
  garment-family prior and produces per-curve role assignments with
  confidences.
- `GarmentFamilyLandmarkPrior` — declarative description of a garment
  family's expected landmark set, anatomical references, expected curve
  geometry, discriminating heuristics, and confidence policies. Stored as
  JSON, one file per family.
- `LandmarkSlot` — a named position in a garment family's expected landmark
  schema (e.g. `hem-front`, `armhole-front-left`).
- `CurveRoleAssignment` — the output record: `(curve_id, predicted_role,
  confidence, evidence_rules)`.
- `CurvePreprocessor` — coalesces, snaps, and detects symmetry on raw vector
  curves before semantic interpretation.
- `ConfidencePolicy` — per-rule and per-landmark thresholds determining
  whether a prediction is silent, soft (user can override), or escalated to
  `AmbiguityReport`.
- `CorrectionLogRecord` — labeled training example produced by every manual
  correction: `(curve_features, predicted_label, user_label,
  garment_family_id, sketch_id, timestamp)`.
- `SemanticInterpretationVersionStamp` — records which heuristic ruleset
  version, prior file hash, and (eventually) ML model version produced a
  given `SketchIntent`. Needed for reproducibility and for diffing
  interpretation behavior across versions.
- `LandmarkVocabulary` — the canonical naming registry shared across all
  garment families, a sibling of `MeasurementProfile`. Allows
  `MultilingualFactoryInstruction` to inherit string keys instead of English
  hardcodes.

**New edges:**

```
VectorSketchLayer
  -> CurvePreprocessor
  -> SemanticCurveInterpreter
  -> CurveRoleAssignment
  -> SketchIntent

GarmentFamilyLandmarkPrior
  -> LandmarkSlot
  -> SemanticCurveInterpreter

SemanticCurveInterpreter
  -> ConfidencePolicy
  -> AmbiguityReport
  -> ManualCorrection
  -> CorrectionLogRecord
  -> IntelligenceLearningLoop

LandmarkVocabulary
  -> GarmentFamilyLandmarkPrior
  -> Notch
  -> SeamPair

SemanticCurveInterpreter
  -> SemanticInterpretationVersionStamp
  -> SketchIntent
```

**Proposed boundary rules** (for the `Representation Boundary Rules` section):

- A `VectorSketchLayer` carries geometry only. A `CurveRoleAssignment` is the
  separate semantic record. Geometry edits do not silently rewrite role
  assignments, and role edits do not rewrite geometry.
- The heuristic interpreter and any future ML interpreter must produce the
  same `CurveRoleAssignment` shape so that implementations are swappable.
- `SketchIntent` only advances to `confirmed` when every required
  `LandmarkSlot` for the garment family is filled with a `CurveRoleAssignment`
  whose confidence is above threshold *or* whose user confirmation is
  recorded.
- `LandmarkVocabulary` strings are keys, not display labels;
  `MultilingualFactoryInstruction` resolves keys to localized text downstream.

---

## References

Sketch parsing:

- Sketch-RNN: https://arxiv.org/abs/1704.03477
- Sketch-A-Net: https://arxiv.org/abs/1501.07873
- SketchSeg-Net: https://arxiv.org/abs/2003.00678
- SketchGNN: https://arxiv.org/abs/2103.00139
- BezierSketch: https://arxiv.org/abs/2007.02190
- DeepSVG: https://arxiv.org/abs/2007.11301
- Im2Vec: https://arxiv.org/abs/2102.02798
- CLIPasso: https://arxiv.org/abs/2202.05822

Garment-specific:

- DeepFashion: https://mmlab.ie.cuhk.edu.hk/projects/DeepFashion.html
- DeepFashion2: https://github.com/switchablenorms/DeepFashion2
- FashionPedia: https://fashionpedia.github.io/home/
- Fashion Landmark Detection: https://arxiv.org/abs/1608.03049
- FashionAI Keypoints: https://tianchi.aliyun.com/competition/entrance/231648
- ATR: https://arxiv.org/abs/1503.02391
- LIP: http://sysu-hcp.net/lip/
- GarmentCode: https://igl.ethz.ch/projects/GarmentCode/
- GarmentDiffusion: https://arxiv.org/abs/2504.21476
- GenPattern: https://www.sciencedirect.com/science/article/pii/S0278612525002663
- SketchTailor: https://www.sciencedirect.com/science/article/abs/pii/S0097849325001864
- SewFormer: https://arxiv.org/abs/2311.04498

Heuristic / parametric tooling:

- FreeSewing: https://freesewing.org
- Seamly2D / Valentina: https://seamly.net
- FreeCAD Sketcher: https://wiki.freecad.org/Sketcher_Workbench
- Onshape Sketch: https://www.onshape.com
- Solvespace: https://solvespace.com

Manual fallback / annotation UX:

- Label Studio: https://labelstud.io
- CVAT: https://www.cvat.ai/
- Roboflow: https://roboflow.com
- Labelbox: https://labelbox.com
- COCO Annotator: https://github.com/jsbroks/coco-annotator
- OpenPose: https://github.com/CMU-Perceptual-Computing-Lab/openpose
- MediaPipe Pose: https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
