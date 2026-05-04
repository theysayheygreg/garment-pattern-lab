# Vectorization For Garment Ingestion — 2026-05-03

Author: Orrery (architecture/structure orb).

Scope: state-of-the-art survey of raster-to-vector techniques *as they apply to Garment Pattern Lab's `RasterToVectorBridge`*. Focus is recognizability of garment structure in the output, not vectorization-as-art.

Reads grounded in:

- `README.md`, `CLAUDE.md`
- `docs/project/KNOWLEDGE-GRAPH.md` (AI Sketch / Visual Corpus Layer; Browser Kernel Layer)
- `docs/project/INPUT-LANES.md` (Lane B human-authored ingest)
- `docs/project/BROWSER-NATIVE-PIPELINE.md`
- `docs/reference/UV-GEOMETRY-INGEST.md`
- `docs/reference/OPEN-TOOLS-INGEST.md`
- `docs/reference/KEW-COMPETITOR-DEEP-DIVE.md` (Adobe Image Trace section)
- `docs/research/orrery-design-review-2026-05-03.md` (finding 4: canvas question; finding 13: validation in design language)

Companion data: `docs/data-corpus/vectorization-approaches.json`.

This is not a vector-graphics-editor review. The product question is narrower: which raster-to-vector approach produces output that the `SemanticInterpretationSurface` can address as garment structure with the smallest cleanup tax.

---

## 1. The Recognizability Problem

A vectorizer that returns 47 disconnected paths from a clean front-view technical flat is technically correct and useless to us. The next layer (`LandmarkSet`, `SketchIntent`, `VectorSketchLayer` with garment tags) needs paths it can *address*: this is the silhouette, this is the neckline curve, this is a dart, this is a callout.

Concretely, the bridge needs output with these properties:

- **Closed silhouette where appropriate.** A front-view bodice should produce one closed outer path, not eight open polylines that visually meet at vertices.
- **Layer separation between silhouette, internal construction, and annotation.** Internal seams, darts, pleats, hardware, and callouts must end up in distinguishable groups so semantic tagging can address them without re-segmenting.
- **Centerline interpretation, not double-edge interpretation, for stroke-based art.** A pencil stroke is one curve to the human eye and to the patternmaker. If the vectorizer returns the two edges of the stroke, downstream code has to re-collapse them — we lose information at the worst place.
- **Per-curve addressability.** Each curve carries an id we can attach `SemanticTag`, `LandmarkRole`, and `AmbiguityFlag` to. SVG `<path>` elements with stable ids work; a single fused `<path>` with `M…L…Z` for the whole drawing does not.
- **Cubic Bezier or polyline-with-tangents canonical form.** The downstream `CurveKernel` already wants one of these. Hairy 1px-stair polylines force a resample/refit pass that has to make decisions vectorization should already have made.
- **Color/region handling that does not invent garment features.** A photo of a drape on a form should not yield posterized "panels" that were really shadows. Better to return a clean monochrome trace and let the interpretation layer infer separation.

The recognizability problem has two failure modes that come from opposite directions:

- **Over-segmentation.** Color/posterize tracers (Image Trace, VTracer in stack mode) shred a single conceptual stroke into many small filled regions. Useful for logos. Disastrous for technical flats.
- **Over-fusion.** Single-pass binarized centerline tracers can drop interior detail or merge a dart into the silhouette boundary. Silhouette-clean but feature-poor.

The right approach for our domain is some flavor of **strict-mode trace + structured layering**, not a single magic call.

---

## 2. Technology Survey

The full normalized comparison lives in `docs/data-corpus/vectorization-approaches.json`. This section is the opinionated commentary.

### 2.1 Classical / production-grade raster tracers

**Potrace** (Peter Selinger, 2001-present, GPLv2). The reference algorithm for monochrome edge tracing. Produces remarkably clean Bezier paths from binarized input. Output is a single `<path>` of fills — no built-in centerline mode. Browser-runnable via `esm-potrace-wasm` (a maintained 2024 ESM build) or via `potrace` (Node-only port). For black-line technical flats it is the obvious starting point: license is permissive enough for prototype use, output quality is high, behavior is deterministic, no GPU dependency. Limitations: monochrome only, edge-of-stroke not centerline (so a pencil stroke comes back as a closed thin loop), needs explicit posterization preprocessing for color input. ([Potrace](https://potrace.sourceforge.net/), [esm-potrace-wasm](https://github.com/tomayac/esm-potrace-wasm))

**VTracer** (visioncortex, MIT, Rust+WASM). Modern descendant of Potrace's lineage that targets color images and high-resolution scans. O(n) instead of O(n²). Two important modes: `stacked` (color regions as stacked filled paths) and `binary` (monochrome). Browser-runnable via the official WASM build and via community wrappers (`vectortracer`, `@neplex/vectorizer`). For the drape-photo and scanned-sketch cases, this is the strongest open option I'm aware of. The `stacked` mode has a useful side effect: each color cluster becomes its own SVG group, which is a free first pass at *layer separation* if the source has any color discipline. ([VTracer](https://github.com/visioncortex/vtracer), [vectortracer WASM bindings](https://github.com/AlansCodeLog/vectortracer))

**Adobe Image Trace.** Closed source, desktop-only, not relevant as a runtime — but worth naming as the baseline behavior designers expect. Image Trace ships with presets (sketch, technical drawing, line art) and exposes path-fitting / corners / noise / minimum-area / threshold. Our interpretation layer should expose a comparable preset surface. Treat it as the UX target, not the engine. ([Adobe Image Trace docs](https://helpx.adobe.com/illustrator/desktop/manage-objects/traces-mockups-symbols/image-trace-panel-options.html))

**Inkscape Trace Bitmap / Autotrace.** Open-source desktop tooling. Inkscape since 1.0 bundles `autotrace -centerline`, which is the only mainstream classical tracer that produces *centerlines* of strokes rather than edges of strokes. That matters for hand-drawn garment sketches. Not directly browser-callable; would have to ship `autotrace` to WASM ourselves or use the algorithm as inspiration. ([fablabnbg/inkscape-centerline-trace](https://github.com/fablabnbg/inkscape-centerline-trace))

**imagetracerjs / image-tracer-ts.** Pure-JS/TS port of imagetracer.js. No WASM required; runs in any browser tab and in workers. Output quality is below Potrace and VTracer (visibly stair-stepped on curves at default settings; tuning `ltres`/`qtres` improves it). Useful as a no-build-step fallback or for tooling that must work without WASM. ([imagetracerjs](https://www.npmjs.com/package/imagetracerjs), [image-tracer-ts](https://www.npmjs.com/package/@image-tracer-ts/core))

### 2.2 Vector-graphics editor traces

**Graphite** (GraphiteEditor, Apache-2.0/MIT, Rust+WASM, browser PWA). Notable because Graphite *is* the brand of editor we already cite as a future upgrade path (`OPEN-TOOLS-INGEST.md`, `BROWSER-NATIVE-PIPELINE.md`). Their node-graph engine `Graphene` runs in-browser; vector tooling is maturing through 2025-26. Today their raster trace node is not a separate library you can pull in — it's coupled to the editor. Long-term: if Pattern Lab ever integrates with Graphite (handoff, embed, or shared types), aligning on their internal `vector-types` is the cheapest interop. Short-term: not a v0.1 dependency. ([Graphite](https://graphite.art/), [GitHub](https://github.com/GraphiteEditor/Graphite))

**Vectornator/Linearity, Affinity, Procreate Vectorize.** Closed-source desktop/mobile. Not runtimes for us. Worth tracking only because designer-uploaded `.svg` files often originate from these tools, so our `VectorIngestProfile` needs to handle their idiomatic SVG output (transform stacks, clipping paths, image-fill markers). That's a parsing problem, not a vectorization problem.

### 2.3 Differentiable and ML-based vectorization

**DiffVG** (Li et al. 2020, MIT/Apache mix). Differentiable rasterizer for vector graphics — the substrate every learning-based method since has built on. Not a vectorizer by itself; pair with an optimizer that fits a small set of Bezier paths to minimize image-loss. Python/PyTorch/CUDA. Not browser-runnable. Useful as a research substrate, not as a v0.1 engine. ([DiffVG paper page](https://people.csail.mit.edu/tzumao/diffvg/), [GitHub](https://github.com/BachiLi/diffvg))

**LIVE** (Layer-wise Image Vectorization, CVPR 2022). Builds on DiffVG. Produces stacked filled paths layer-by-layer. Output is naturally layered (every path has a z-order). Slow, GPU-bound, Python. The *concept* is more useful to us than the implementation: layer-by-layer extraction matches our ingest contract better than single-pass tracing.

**Im2Vec** (Reddy et al. CVPR 2021). Generates vector graphics from raster without paired vector supervision. Topology-flexible. Research-grade, not a deployable library. Mentioned for completeness; not on our path.

**Bezier Splatting** (2025). Reframes differentiable VG using 2D Gaussians along curves. 30×–150× faster than DiffVG. Still GPU-bound research code, not a browser runtime. Watch for 2026-27 if learning-based vectorization becomes part of v2. ([Bezier Splatting paper](https://arxiv.org/html/2503.16424v3))

**Deep Vectorization of Technical Drawings** (Egiazarian et al. ECCV 2020). Three-stage: deep cleaning → transformer-based primitive estimation → optimization. Targets architectural/CAD line art. Closer to our content domain than most ML papers. Not browser-deployable. Useful as a target architecture for v2 if we want garment-aware ML vectorization. ([arXiv](https://arxiv.org/pdf/2003.05471))

**Single-Line Drawing Vectorization** (Magne et al., Pacific Graphics 2025). Fits a single Bezier spline to a single-stroke drawing, handling self-intersections. Strong fit for hand-sketched single-line garment silhouettes. Research code, not deployed. ([CGF article](https://onlinelibrary.wiley.com/doi/10.1111/cgf.70228), [PDF](https://igl.ethz.ch/projects/sld-vectorization/single-line-drawing-vectorization-pacific-graphics-2025-magne-et-al.pdf))

**Deep Sketch Vectorization via Implicit Surface Extraction** (Yan et al., SIGGRAPH 2024). Encodes sketches into a latent space then decodes Bezier primitives. Promising for hand-drawn input. Research code. ([SIGGRAPH paper](https://cragl.cs.gmu.edu/sketchvector/Deep%20Sketch%20Vectorization%20via%20Implicit%20Surface%20Extraction%20%28Chuan%20Yan%2C%20Yong%20Li%2C%20Deepali%20Aneja%2C%20Matthew%20Fisher%2C%20Edgar%20Simo-Serra%2C%20Yotam%20Gingold%202024%20SIGGRAPH%29.pdf))

**Vectorization of Line Drawings via PolyVector Fields** (Bessmeltsev & Solomon, ACM TOG 2018/19). Cross-field-based topology recovery for clean line drawings. Same family as the cross-field approach in `Computational Pattern Making from 3D Garment Models` (already in our paper ingest). Notable: this is the academic line that produces *topologically clean* output, with junctions and curve crossings preserved. Research code, MATLAB/C++. Concept-relevant; not a v0.1 runtime. ([ACM TOG](https://dl.acm.org/doi/fullHtml/10.1145/3202661))

**Less is More: Adaptive Parameterization** (CVPR 2025). Produces compact vector output by adaptively choosing curve count. ([CVPR PDF](https://openaccess.thecvf.com/content/CVPR2025/papers/Zhao_Less_is_More_Efficient_Image_Vectorization_with_Adaptive_Parameterization_CVPR_2025_paper.pdf))

**Recraft Vectorize / Vectorizer.AI** (commercial APIs). High-quality output, hosted only, license terms vary, opaque algorithm. Useful as a "plan B if our local pipeline isn't good enough" benchmark. Not appropriate as a *required* component because the product position is browser-native, designer-private, and offline-capable for core ingest. ([Recraft AI Vectorizer](https://www.recraft.ai/ai-image-vectorizer), [Vectorizer.AI](https://vectorizer.ai/))

### 2.4 Curve fitting and post-processing

These are not vectorizers, they are the cleanup pass *after* vectorization. They matter as much as the tracer choice.

- **svg-path-simplify** — reduces curve count while preserving visual shape. Useful for trimming Potrace/VTracer output before downstream display. ([GitHub](https://github.com/herrstrietzel/svg-path-simplify))
- **paper.js / paperjs path simplify** — Catmull-Rom smoothing, control-point fitting. Browser-friendly, mature.
- **kurbo** (Rust) — Bezier math library, the upgrade path the project already names. Will run in our planned WASM kernel.
- **lyon** (Rust) — tessellation/path tooling. Same upgrade path.
- **Schneider's curve fit** (1990, classical algorithm) — fits cubic Beziers to sample points. Implemented in many libraries; the canonical "polyline → Bezier" pass.

The pipeline shape is `raster → trace → simplify → fit → semantic-tag`, not `raster → magic`.

---

## 3. Recognizability Analysis

Mapping techniques to the recognizability properties from Section 1:

| Property | Potrace | VTracer | imagetracerjs | DiffVG/LIVE | Centerline (autotrace) | ML 2024-25 |
| --- | --- | --- | --- | --- | --- | --- |
| Closed silhouette on clean flats | strong | strong | medium | strong (but slow) | weak (returns open polylines) | varies |
| Color/region layer separation | none (mono only) | strong (stacked mode) | medium | strong | none | varies |
| Centerline (one curve per stroke) | weak (edge of stroke) | weak | weak | possible with custom loss | strong | promising |
| Per-curve addressability | moderate (one path per region) | strong (one group per color) | moderate | strong (each path is a tensor) | strong | strong |
| Bezier output canonical | yes | yes | yes (configurable) | yes | yes | yes |
| Browser/WASM runnable today | yes | yes | yes (pure JS) | no (CUDA) | no (would need port) | no |
| License clean for product | GPLv2 (caveat) | MIT | Apache | mixed | GPL/proprietary mix | varies |
| Garment-feature preservation | medium | medium-high | low-medium | high (with custom losses) | medium-high | high (research only) |

The honest read:

- **No single open-source vectorizer produces garment-aware output today.** None of them know what a dart, a princess seam, or a shoulder slope is.
- **The closest "free win" today is mode-switching:** Potrace for clean black-on-white flats, VTracer-stacked for any color/photo input, with a simplify pass after.
- **Layer separation is mostly the *user's* job at ingest time today.** When a designer uploads `.svg` from Illustrator, the layers already exist — we honor them. When they upload a raster scan, we accept that v0.1 yields one silhouette layer plus one "interior detail" layer plus an annotation layer detected by very simple heuristics (closed vs open paths, area thresholds, position relative to silhouette).
- **The ML-based research line is real but not deployable.** v2 candidate, not v0.1.

### 3.1 What downstream actually needs

The contract the next layer wants from `RasterToVectorBridge` is:

```text
RasterToVectorBridge
  -> EditableTraceLayer {
       outer_silhouette: Path[]      // typically 1 closed path per view
       interior_curves: Path[]        // open or closed; seam hints, darts, hardware
       annotations: Path[]            // arrows, leader lines, text-shaped paths
       confidence_per_path: number[]  // for AmbiguityReport
       provenance: VectorizerProvenance
     }
  -> SemanticInterpretationSurface
```

Note: this is layered enough that the designer-facing UI can present "is this the silhouette? is this a seam? is this a callout?" instead of one giant pile of paths. That mapping is *post-vectorization classification*, not vectorization itself. The vectorizer's job is making per-path tagging *possible*.

### 3.2 The pre-processing tax

Every classical tracer's output quality depends more on the preprocessing than on the engine. For our domain:

1. **Background isolation.** Drape photos and scans need garment/background separation before tracing. Use a light segmentation pass (`u2net`/`rembg` family in WASM, or a luminance threshold for clean studio scans).
2. **Deskew + perspective correction.** Already a step in `PreprocessReport`.
3. **Threshold tuning.** Potrace/VTracer wants a chosen threshold; the UI should expose this and live-preview the trace.
4. **Stroke binarization for sketches.** A pencil sketch on white paper trades hugely on the threshold + dilate decisions. Default values should be informed by the input class, not global.

The bridge should be configured by an `IngestRecipe`, picked from a small set:

- `clean-technical-flat` — black line on white background (Potrace, low threshold, simplify hard).
- `colored-illustration` — flat-colored fashion illustration (VTracer stacked).
- `pencil-sketch` — graphite or pen on textured paper (background subtract + Potrace, light simplify).
- `drape-photo` — photo of a physical drape on a form (segment + edge-detect + Potrace, treat as silhouette-only).
- `scanned-pattern-piece` — actual pattern paper, edges visible (Potrace, very tight simplify, treat as candidate panel boundary).

The recipe is part of `InputProvenance` and stored on every run so the trace is reproducible.

---

## 4. Recommendation For The Prototype

**For v0.1+: combine Potrace (via `esm-potrace-wasm`) and VTracer (via WASM), behind a recipe-driven `RasterToVectorBridge`. Add a TypeScript simplify/fit pass after the tracer. Treat layer separation as a post-trace heuristic now, not a tracer responsibility.**

The trade-offs this recommendation accepts:

- We will not have ML-quality stroke-level understanding in v0.1. A pencil sketch will come back as edge-of-stroke, not centerline. We accept this and let the user clean it in `SemanticInterpretationSurface`.
- We will not have one-shot color-photo-to-clean-vector for drape photos in v0.1. We do segmentation + monochrome trace. We accept this and ship recipe presets.
- We will not align with Graphite's editor stack in v0.1. We preserve the *option* by putting the bridge behind a clean interface and using cubic Bezier as canonical curve form. v2 can swap the engine.

Why this combination:

- Potrace is the most mature, deterministic, and predictable tracer for monochrome line art, which is the *majority* of expected v0.1 inputs (clean technical flats, scanned sketches).
- VTracer covers the cases Potrace cannot: color illustrations, photographic input, drape photos. Its `stacked` mode gives us a built-in first pass at layer separation.
- Both are MIT/permissive and both run in a Web Worker via WASM. No GPU dependency.
- License: VTracer is MIT. Potrace is GPLv2 — we should treat this as an ingest-time tool whose *output* we own, not as code we statically link into a redistributed product. For the browser prototype, the GPL boundary is the WASM artifact's origin server; we should call this out in `DEPENDENCY-REGISTER.md` and revisit if/when we ship a closed product. (This is a known thing the open-source community navigates routinely; not a blocker, but it should be a noted constraint.)

Upgrade path:

1. **v0.1**: Potrace WASM + VTracer WASM behind `RasterToVectorBridge`, TypeScript simplify pass, recipe presets, manual layer assignment in UI.
2. **v0.2**: Add a centerline mode by porting (or wrapping) `autotrace -centerline`. Add automatic recipe detection.
3. **v0.3**: Replace simplify pass with `kurbo`/`lyon` in our WASM kernel (already planned).
4. **v1+**: Evaluate ML-based vectorization (Deep Sketch Vectorization, Single-Line Drawing Vectorization, Bezier Splatting derivatives) once they have shippable inference runtimes. ONNX/WebGPU inference in 2026-27 is plausible for this.
5. **Long-term**: If Graphite's vector pipeline matures into a reusable WASM library, swap to it for unified raster+vector editing. The `RasterToVectorBridge` interface is the swap point.

---

## 5. Integration With INPUT-LANES.md

The lane-B contract from `docs/project/INPUT-LANES.md` already names the steps; this is how the bridge plugs in.

```text
HumanSketchInput (raster)
  -> UploadSession
  -> InputProvenance { source_rights, original_hash }
  -> PreprocessReport { crop, deskew, background, calibration }
  -> RasterToVectorBridge {
       recipe: IngestRecipe,
       engine: Potrace | VTracer | manual,
       params: RecipeParams,
       output: EditableTraceLayer
     }
  -> EditableTraceLayer {
       layers: { silhouette, interior, annotation },
       paths: Path[] with stable ids,
       confidence_per_path,
       provenance: VectorizerProvenance
     }
  -> SemanticInterpretationSurface
       (user reviews, retags, corrects, accepts)
  -> VectorSketchLayer (semantic-tagged curves)
  -> LandmarkSet
  -> SketchIntent
  -> AmbiguityReport
```

For vector inputs (`.ai`, `.svg`, vector PDF), the bridge is bypassed: the parsed SVG paths *are* the `EditableTraceLayer`, with whatever group/layer structure the source already provides. Only the post-trace simplify and layer-classification heuristics still apply (and those should be *optional* for vector inputs because the user's existing layer structure is more trustworthy than our heuristics).

The bridge produces a `VectorizerProvenance` block stored per-asset:

```ts
type VectorizerProvenance = {
  engine: "potrace-wasm" | "vtracer-wasm" | "user-svg-passthrough" | ...;
  engine_version: string;
  recipe: IngestRecipeId;
  params: Record<string, unknown>;
  preprocess_report_id: string;
  ran_at: string;
  reproducible: boolean;
};
```

This satisfies the project's reproducibility rule: any traced layer can be re-derived from the original asset + recipe + params.

### 5.1 Recipe presets as the user-facing surface

This is the key UX move and ties to finding 13 of the Orrery design review (validation in design language): users should pick a recipe by *what kind of art they uploaded*, not by tracer parameters.

Recipes (initial set):

- "Clean technical flat" → Potrace, threshold 128, despeckle 4, smooth corners.
- "Colored fashion illustration" → VTracer stacked, low color count.
- "Pencil sketch on paper" → background subtract + Potrace, threshold auto, despeckle 8.
- "Photo of a draped form" → segment + edge + Potrace, silhouette-only.
- "Scanned pattern piece" → Potrace, threshold 96, despeckle 16, no smoothing.

Each recipe is editable (advanced controls revealed on demand) but defaults are pre-tuned per garment-art class. This is the same pattern Adobe Image Trace established and the same one the project already implies in `KEW-COMPETITOR-DEEP-DIVE.md`.

### 5.2 Layer classification heuristics (post-trace)

Because no current tracer gives us garment-aware layers, the bridge applies a small heuristic pass after tracing:

1. The **outer silhouette** is the closed path with the largest enclosed area.
2. **Interior curves** are paths whose bounding box lies fully inside the silhouette.
3. **Annotations** are paths that are open AND whose endpoints are outside the silhouette OR that match leader-line/arrow-shape templates.
4. Anything that fails all three goes to a `needs-review` bucket the user resolves.

This is dumb but useful. It puts ~80% of paths into the right bucket on a clean technical flat. The remaining 20% get manual re-tagging in the UI, which the `IntelligenceLearningLoop` captures as future training signal.

---

## 6. Open Questions

1. **Centerline tracing in v0.1: yes or no?** Pencil sketches are common in lane B. Edge-of-stroke output gives us a "double line" interpretation that the user has to manually fix. Porting `autotrace -centerline` to WASM is a bounded but non-trivial engineering investment (a few weeks). Defer to v0.2 unless v0.1 corpus testing shows we lose too much.

2. **GPLv2 boundary for Potrace.** Re-examine before any closed/commercial distribution. Mitigation: keep VTracer as a fallback engine that can fully replace Potrace if license becomes a problem. Output ownership is unaffected either way.

3. **Recipe auto-detection.** v0.1 uses user-picked recipe. v0.2+ might auto-detect based on input image stats (color count, edge density, contrast histogram). Not blocking.

4. **Vector PDF ingest.** Vector PDFs are listed as accepted input. Parsing them in-browser requires `pdfjs` extraction of vector ops, which is fiddly. May not make v0.1; rasterize-then-trace is an acceptable v0.1 fallback for `.pdf` if vector parsing isn't ready.

5. **Trace evaluation fixtures.** We need a small evaluation corpus (5-10 reference inputs per recipe) where we lock the expected output. This is `EvalFixture` work — coordinate with whatever sibling research is happening on the corpus.

6. **Calibration interaction with vectorization.** Image scale calibration (`PreprocessReport`) happens before tracing in our flow. Does the user want to calibrate against a traced reference (e.g., a known 10cm ruler in the photo), or against the raw image? Probably both. Not blocking for v0.1.

7. **Should the bridge run synchronously or as a Web Worker job?** Tracing a 4000x4000 sketch can take several seconds. Worker by default. This aligns with the Browser Kernel Layer plan.

---

## 7. Knowledge Graph Additions

Proposed nodes (do not edit `docs/project/KNOWLEDGE-GRAPH.md`; flag for the maintainer):

- **`VectorizationEngine`** — a specific vectorizer implementation (Potrace, VTracer, user-svg-passthrough, future ML engines). Properties: id, family (classical-mono, classical-color, ml, passthrough), license, runtime (wasm/js/server), browser-ready, output-curve-family, deterministic.
- **`IngestRecipe`** — a named preset that binds an engine + params + preprocessing chain to a class of input art. Properties: id, label, applicable-input-classes, engine, default-params, exposed-controls.
- **`VectorizerProvenance`** — per-asset record of which engine/recipe/params produced an `EditableTraceLayer`. Properties: engine, engine-version, recipe, params, preprocess-report-id, ran-at, reproducible.
- **`LayerClassificationHeuristic`** — the post-trace pass that assigns paths to silhouette/interior/annotation buckets. Properties: id, rule-set, confidence-model.
- **`TraceEvaluationFixture`** — a locked input/output pair for verifying vectorization quality. Subtype of `EvalFixture`.
- **`CenterlineTraceMode`** — a future engine capability; presence depends on engine. Properties: supported-by-engine, output-shape.

Proposed edges:

```text
RasterToVectorBridge
  -> VectorizationEngine
  -> IngestRecipe
  -> VectorizerProvenance
  -> EditableTraceLayer

EditableTraceLayer
  -> LayerClassificationHeuristic
  -> SemanticInterpretationSurface
  -> VectorSketchLayer

VectorIngestProfile
  -> VectorizationEngine (via "user-svg-passthrough")
  -> EditableTraceLayer

TraceEvaluationFixture
  -> VectorizationEngine
  -> IngestRecipe
  -> EditableTraceLayer
```

Proposed boundary rules to add to "Representation Boundary Rules":

- A `RasterToVectorBridge` output is an `EditableTraceLayer`, not a `VectorSketchLayer`. Semantic tagging requires a separate user/model pass on the trace before curves carry garment meaning.
- `VectorizerProvenance` must be reproducible: original asset + recipe + params should regenerate the same `EditableTraceLayer` modulo non-determinism explicitly recorded.
- Tracer choice is a recipe decision, not a global setting. The same project may use Potrace for a clean flat and VTracer for a draped photo on the same day.
- License obligations of the chosen `VectorizationEngine` (notably Potrace's GPLv2) attach to the engine binary, not to the user's traced output. Track in `DEPENDENCY-REGISTER.md`.

---

## Sources

- [Potrace](https://potrace.sourceforge.net/)
- [esm-potrace-wasm](https://github.com/tomayac/esm-potrace-wasm)
- [potrace npm](https://www.npmjs.com/package/potrace)
- [VTracer GitHub](https://github.com/visioncortex/vtracer)
- [vectortracer WASM bindings](https://github.com/AlansCodeLog/vectortracer)
- [imagetracerjs](https://www.npmjs.com/package/imagetracerjs)
- [@image-tracer-ts/core](https://www.npmjs.com/package/@image-tracer-ts/core)
- [Adobe Image Trace docs](https://helpx.adobe.com/illustrator/desktop/manage-objects/traces-mockups-symbols/image-trace-panel-options.html)
- [inkscape-centerline-trace](https://github.com/fablabnbg/inkscape-centerline-trace)
- [DiffVG (Li et al.)](https://people.csail.mit.edu/tzumao/diffvg/)
- [DiffVG GitHub](https://github.com/BachiLi/diffvg)
- [PyTorch-SVGRender](https://github.com/ximinng/PyTorch-SVGRender)
- [Im2Vec (CVPR 2021)](https://openaccess.thecvf.com/content/CVPR2021/papers/Reddy_Im2Vec_Synthesizing_Vector_Graphics_Without_Vector_Supervision_CVPR_2021_paper.pdf)
- [Bezier Splatting (2025)](https://arxiv.org/html/2503.16424v3)
- [Deep Vectorization of Technical Drawings (ECCV 2020)](https://arxiv.org/pdf/2003.05471)
- [Single-Line Drawing Vectorization (Pacific Graphics 2025)](https://onlinelibrary.wiley.com/doi/10.1111/cgf.70228)
- [Deep Sketch Vectorization via Implicit Surface Extraction (SIGGRAPH 2024)](https://cragl.cs.gmu.edu/sketchvector/Deep%20Sketch%20Vectorization%20via%20Implicit%20Surface%20Extraction%20%28Chuan%20Yan%2C%20Yong%20Li%2C%20Deepali%20Aneja%2C%20Matthew%20Fisher%2C%20Edgar%20Simo-Serra%2C%20Yotam%20Gingold%202024%20SIGGRAPH%29.pdf)
- [Vectorization of Line Drawings via PolyVector Fields (ACM TOG 2018)](https://dl.acm.org/doi/fullHtml/10.1145/3202661)
- [Less Is More: Adaptive Parameterization (CVPR 2025)](https://openaccess.thecvf.com/content/CVPR2025/papers/Zhao_Less_is_More_Efficient_Image_Vectorization_with_Adaptive_Parameterization_CVPR_2025_paper.pdf)
- [Image Vectorization Review (2024)](https://link.springer.com/article/10.1007/s10958-024-07422-4)
- [Recraft AI Vectorizer](https://www.recraft.ai/ai-image-vectorizer)
- [Vectorizer.AI](https://vectorizer.ai/)
- [Graphite](https://graphite.art/)
- [Graphite GitHub](https://github.com/GraphiteEditor/Graphite)
- [svg-path-simplify](https://github.com/herrstrietzel/svg-path-simplify)
- [Automatic extraction of flat sketch design element from clothing images (Lee et al. 2024)](https://journals.sagepub.com/doi/10.1177/15589250241228266)
