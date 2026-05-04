# Bespoke Model Opportunities: Vectorization And Pattern Refinement

Date: 2026-05-03
Author: Orrery (architecture/structure orb)
Audience: Garment Pattern Lab implementation team and ML research lane
Companion data: [`docs/data-corpus/bespoke-model-candidates.json`](../data-corpus/bespoke-model-candidates.json)

## 1. Framing

The project is committing to a DAG spine: every operation produces a candidate,
the validation gate promotes candidate → `PatternGraph`, the operation surface
produces the next candidate. Two roles in that spine are unusually well shaped
for small, fast, bespoke models, because the validation gate is *already* a
deterministic verifier and the domain vocabulary is finite (~50 landmark types,
~12 commands, ~10 garment families for a long while).

The headline question this doc answers:

> How do we set up a separate dedicated model that can iterate over the
> validation state machine super fast, until it is sure the output is a usable
> human pattern?

Two roles, two models:

**Role A — Vectorization + Semantic Interpretation Model (V-Model).**
Today's recommendation is classical tracers (Potrace, VTracer) plus heuristic
landmark interpretation. The opportunity is a single small model that takes a
raster sketch (and a garment-family hint) and emits *garment-tagged vector
geometry* directly: a small set of cubic-Bezier curves with role labels
(`hem-front`, `armhole-left`, `dart-bust`, etc). Inner loop reward = the gate's
"is this a coherent `LandmarkSet` for this family?" check.

**Role B — Pattern Refinement Model (R-Model).**
Today's recommendation is deterministic drafting formulas with FreeSewing
factors. The opportunity is a model that proposes pattern adjustments
(parameter edits, curve nudges, dart placement, seam balancing) and iterates
until the gate's promotion threshold is met. Inner loop reward = the gate's
seam-length / symmetry / armhole-perimeter / fit checks. Shape: AlphaFold-style
iterative refinement, AlphaZero-style self-improvement, verifier-guided
generation.

Neither model replaces the heuristic baseline. Both *layer over* it: the
heuristic is the floor (always available, always fast, fully transparent), and
the bespoke model is a faster, often better proposer that the gate adjudicates.
The architectural lesson from
[`semantic-curve-interpretation-soa-2026-05-03.md`](semantic-curve-interpretation-soa-2026-05-03.md)
is reused directly: heuristic and ML must produce the same operation shape so
the implementation is swappable without rewriting downstream code.

The DAG spine integration is concrete and the same for both:

```
Operation { id, kind: "vectorize" | "refine", producer, params, output }
  -> Candidate { PatternGraphCandidate or LandmarkSet candidate }
  -> ValidationGate
       pass  -> promote, append to operation log
       fail  -> reject, return diagnostics, optionally re-call producer
```

Provenance fields each operation carries:

- `producer` — `"heuristic-v0.1"`, `"v-model-v0.2-onnx"`, `"r-model-v0.5-mlc"`,
  `"manual"`, etc.
- `producer_version` — model checkpoint hash or rule-library version stamp.
- `prior_used` — garment-family-landmark-prior id.
- `latency_ms` — wallclock for telemetry/budget enforcement.
- `gate_pass` — boolean from the validation gate.
- `gate_diagnostics` — verifier output (used as RL reward signal too).

Because the gate runs on the same shape regardless of who produced the
candidate, the model is *additive*: shipping it does not require redesigning
the gate, the schema, or the export layer. That is the architectural
prerequisite that makes bespoke models cheap to try.

## 2. State Of The Art Across The Four Lanes

This section is opinionated commentary; the structured table lives in
[`bespoke-model-candidates.json`](../data-corpus/bespoke-model-candidates.json).
Where prior research docs already cover ground I link rather than repeat.

### 2.1 Small/Fast Model Architectures

**Tiny vision backbones.** The class of "compact vision encoder" is mature and
browser-deployable today.

- **MobileViT v2 / v3** (Apple, ~2–6M params) — hybrid CNN+attention, designed
  for mobile inference, ~5–15ms on commodity hardware, ONNX-exportable, runs in
  `transformers.js` or ONNX Runtime Web with WebGPU. Good encoder choice for
  V-Model. Apache-2.0 weights via `timm`. ([paper](https://arxiv.org/abs/2206.02680))
- **MobileSAM** (Kyung Hee, 9.66M params total, 5.78MB ViT-Tiny image encoder)
  — distillation of SAM's image encoder with the same prompt decoder. Frame
  rate ~12ms/frame on CPU. Apache-2.0. Browser-runnable via ONNX Web.
  ([repo](https://github.com/ChaoningZhang/MobileSAM))
- **FastSAM** (CASIA, 68M params, YOLOv8-seg backbone) — bigger but 50x faster
  inference than vanilla SAM. Worth tracking for v0.5.
  ([paper](https://arxiv.org/abs/2306.12156))
- **EfficientFormer / EfficientNet-Lite** — older but very stable ONNX/WebGL
  paths, good baselines.

For Pattern Lab's V-Model, MobileSAM's image encoder is the most
deployment-ready candidate today as the *vision feature trunk*; we attach a
custom decoder (curve+role) on top.

**State-space models (SSMs).** Mamba, RWKV, S4 are linear-time alternatives to
attention. Of interest because:

- Curve sequences are 1D, ordered, and can be long when a sketch contains many
  primitives. Linear-time scaling matters at the long end.
- Mamba's hardware-aware kernel doesn't yet run cleanly in browsers (CUDA
  selective scan), but RWKV does — RWKV variants run today via `web-rwkv`
  (Rust+WGSL+WebGPU) and `rwkv.cpp` ports.
  ([RWKV](https://github.com/BlinkDL/RWKV-LM),
  [web-rwkv](https://github.com/cryscan/web-rwkv))
- For our problem size (tens of curves, not thousands of tokens), the SSM
  advantage is not load-bearing. A small decoder transformer (4–6 layers,
  128–256 dim) is simpler and fast enough.

Verdict: SSMs are research-curiosity for v0.5+ if curve counts blow up; not on
the v0.2 critical path.

**Tiny LMs.** Phi-3-mini (3.8B), Qwen2.5-0.5B, Gemma-3 270M, SmolLM2 (135M /
360M / 1.7B), OPT-125M. The smallest of these
([SmolLM2-135M](https://huggingface.co/HuggingFaceTB/SmolLM2-135M),
[Qwen2.5-0.5B](https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct),
[Gemma-3 270M](https://huggingface.co/google/gemma-3-270m)) are the right size
class for the R-Model's *action proposer*: emit one structured edit per
inference step, ~50–200ms via WebLLM/MLC or transformers.js, browser-deployable
with INT8/INT4 quantization (50–200MB). Qwen2.5-0.5B distillation into 4-bit
GGUF runs at 30–80 tokens/s on a Mac via `llama.cpp`-WASM today.

Verdict: SmolLM2-135M-instruct or Qwen2.5-0.5B-instruct as the R-Model
proposer base, fine-tuned on synthetic operation traces, is the most plausible
path. Gemma-3-270M is newer (Aug 2025) and explicitly marketed as a fine-tune
target — worth considering once licensing is reviewed.

**Sketch-specialized models.** Already surveyed in
[`semantic-curve-interpretation-soa-2026-05-03.md`](semantic-curve-interpretation-soa-2026-05-03.md).
Adding what that doc didn't go deep on:

- **Sketch-RNN's stroke-VAE** is wrong granularity for our curve labeling but
  the *encoder* (256-d LSTM stroke encoder) was designed for distillation —
  ~2M params. As a teacher for synthetic stroke priors, marginal value;
  obsoleted by transformer encoders.
- **DeepSVG** (Carlier et al. 2020) is a hierarchical
  encoder-decoder over SVG path commands (`MoveTo`, `LineTo`, `CurveTo`,
  `Close`). This is the right *output representation* for the V-Model: emit
  SVG path command tokens directly, with role tokens interleaved. The DeepSVG
  paper trained a 12-layer encoder/12-layer decoder transformer; a 4-layer
  / 4-layer distillation would fit comfortably in the browser-tiny class.
  ([paper](https://arxiv.org/abs/2007.11301),
  [repo](https://github.com/alexandre01/deepsvg))
- **BezierSketch** (Das et al. 2020) generates Bezier strokes from raster.
  Distilling its trained PointNet-style encoder into a smaller residual MLP
  is feasible. ([paper](https://arxiv.org/abs/2007.02190))
- **SketchGNN** (Yang et al. 2021) is the right structural target for
  per-stroke labeling. Original is ~3.8M params (already small). Per-curve
  graph attention with 3–4 heads at 64–128 dim should run under 50ms on a
  hundred curves in a browser.
- **Set Transformers** (Lee et al. 2019) — permutation-invariant attention
  over a *bag* of curves, exactly the right inductive bias for a vector
  sketch where stroke order is unknown. Browser-deployable today via ONNX
  export. This is the best architectural fit I've found for the V-Model's
  curve-label head. ([paper](https://arxiv.org/abs/1810.00825))

**Quantization, distillation, LoRA.**

- **INT8 / INT4 quantization** via ONNX Runtime Web or `llama.cpp`-WASM is the
  default browser deployment story. Quality loss for our small decoder is
  typically <1% on classification, slightly higher on regression; acceptable.
  ([ONNX Runtime quantization](https://onnxruntime.ai/docs/performance/model-optimizations/quantization.html))
- **LoRA / QLoRA** — on a frozen 0.5B–1B base, LoRA adapters at rank 8–16 add
  ~1–4M trainable params. Adapters can be swapped per garment family or per
  task without reloading the base. Critical for our staged plan: train one
  adapter per family on synthetic data, ship them all.
  ([LoRA](https://arxiv.org/abs/2106.09685),
  [QLoRA](https://arxiv.org/abs/2305.14314))
- **Distillation from a larger model** is the most credible v0.5 data play:
  use GPT-4o or Claude with vision to label a sketch corpus, then distill into
  a SmolLM-class student. The teacher need only be accurate enough to seed
  training; the verifier (the gate) catches mistakes.
- **Mixture-of-experts** is over-engineering at our scale.

**Browser deployment paths.**

- **ONNX Runtime Web** (Microsoft, MIT, supports WebGPU/WebGL/WASM-SIMD
  backends) — the most stable cross-architecture browser inference runtime
  today. CNN/ViT/SAM tiny models all work. ~150ms first-token for a 100M
  param model on M-series Macs with WebGPU. ([ort-web](https://onnxruntime.ai/docs/tutorials/web/))
- **transformers.js** (Hugging Face, Apache-2.0) — wraps ORT-Web, ergonomic
  for HF-hosted checkpoints, supports WebGPU. Best ergonomics if base model is
  on HF. ([transformers.js](https://huggingface.co/docs/transformers.js))
- **MLC LLM / WebLLM** (CMU/MLC, Apache-2.0) — TVM-based, WebGPU-only, best
  performance for LLM-style decoder models. WebLLM demos run Qwen2.5-0.5B at
  60+ tokens/s on M2. ([WebLLM](https://webllm.mlc.ai/))
- **Candle WASM** (Hugging Face, Apache-2.0/MIT) — Rust-native ML, WASM build,
  smaller bundle than ORT in some shapes; less mature for our model classes.
  ([candle](https://github.com/huggingface/candle))
- **WebNN** — emerging W3C standard for native NN inference. Chrome behind a
  flag in 2026; Safari following. Not deployable yet; track for v1.
- **wllama / llama.cpp WASM** — for GGUF-quantized small LMs, browser-runnable
  via `wllama`. Practical for 0.5B–1.5B models in 4-bit. ([wllama](https://github.com/ngxson/wllama))

For Pattern Lab v0.2, the recommendation is **ONNX Runtime Web for the V-Model
encoder** (vision trunk + curve decoder, exported to ONNX) and **WebLLM/MLC
for the R-Model proposer** (LLM-shaped, benefits more from WebGPU's
flash-attention-style kernels).

### 2.2 Iterative Refinement Architectures

This is where the R-Model lives. The class of "predict, score, refine, repeat"
has crystallized in the last five years across multiple domains.

**AlphaFold-style iterative refinement.** AlphaFold 2's structure module runs
the same neural block 8 times, each iteration improving the predicted
structure given the previous one's residual error. Crucially: the *iteration
count is a hyperparameter*, not a learned stopping criterion, and each step is
cheap. AlphaFold 3 (2024) generalizes this to any biomolecular complex with a
diffusion module that iterates ~20 steps. The lesson for us: **a small model
called many times beats a big model called once**, when you have a verifier and
a residual you can shrink. ([AlphaFold 2](https://www.nature.com/articles/s41586-021-03819-2),
[AlphaFold 3](https://www.nature.com/articles/s41586-024-07487-w))

For the R-Model, this means: the model's job per step is to propose *one
operation* on the candidate (one parameter edit, one curve adjustment, one
dart placement), the gate scores the new candidate, and the loop continues
until either (a) the gate promotes, (b) the iteration budget is hit, or (c)
the model has not improved gate diagnostics in N steps. Each step is cheap
because the model is small.

**Diffusion / flow-matching as iterative refinement.** Modern diffusion models
(DDPM, score-based, flow-matching) are themselves iterative refiners:
denoising = repeatedly nudging a candidate toward the data distribution. For
us, the candidate is a `PatternGraphCandidate` and the "noise" is the residual
between current geometry and gate-passing geometry.

- **Flow matching** (Lipman et al. 2023) is simpler to train than DDPM and
  reaches comparable quality with fewer steps. ([paper](https://arxiv.org/abs/2210.02747))
- **GarmentDiffusion** (Wang et al. 2025) already proves diffusion over
  garment edge tokens is feasible.
- **Verifier-guided diffusion** — guide the denoising trajectory using a
  classifier or verifier gradient. The gate isn't differentiable, but a
  *learned surrogate* of the gate can be (small MLP trained on
  `(candidate, gate_pass)` pairs). This is the technique behind OpenAI's
  Universal Verifier work and Anthropic's process-reward research.

For Pattern Lab, full diffusion over panel geometry is overkill at v0.2 but
is a credible v1 architecture if we accumulate enough operation traces.

**DreamerV3 / MuZero world models.** Both learn a model of the environment's
dynamics so they can plan in imagination. For us:

- The "environment" is the gate. We have it. Don't need to learn dynamics.
- What we *might* learn is a *reward model* — a fast surrogate for the gate's
  full evaluation, used to rank many candidate operations cheaply before
  spending a real gate evaluation. This is the *value head* in MuZero.
- Action space: discrete (12 operation kinds × parameter values). MuZero-style
  MCTS over this space is practical.

For v1, MuZero-shape (action proposer + value head + tree search) is the
endgame R-Model. For v0.5 it's premature; just propose-and-score with the
real gate.
([MuZero](https://www.nature.com/articles/s41586-020-03051-w),
[DreamerV3](https://arxiv.org/abs/2301.04104))

**Verifier-guided generation.** This is the ChatGPT-era version of "best-of-N
sampling".

- **Best-of-N** — generate N candidate operations, the verifier picks the best.
  Trivial to implement, surprisingly strong. With N=8 and a 100ms model, a
  full refinement step is ~800ms — fits an interactive budget.
- **Process reward models (PRM)** — train a small classifier to score *partial*
  outputs (e.g. "is this curve placement on-track to pass the gate?"). PRMs
  enable beam search / best-of-N at every step instead of only at the end.
  ([Lightman et al. "Let's Verify Step by Step"](https://arxiv.org/abs/2305.20050))
- **Search-augmented decoding** (rStar, Tree-of-Thoughts variants) — beam
  search over reasoning steps with verifier scoring at each branch. The gate
  is our verifier; this works directly. ([rStar](https://arxiv.org/abs/2408.06195))

For v0.2 the simplest of these — **best-of-N at the operation level, scored
by the real gate** — is the right starting point. PRM and tree search become
worthwhile once latency budget admits more search.

**Constraint-satisfaction RL.** The gate is essentially a verifiable
constraint. Two relevant traditions:

- **Formal-verifier-rewarded RL** (Lean theorem proving, FunSearch, AlphaProof)
  treats the verifier as a binary reward and uses it to bootstrap from very
  weak signal. This is exactly our setup if we treat the gate as binary.
- **Constraint-aware decoding** — at each generation step, mask out actions
  that would obviously violate constraints. We can do this for parameter
  edits (no negative seam allowance, etc.) and for curve placements
  (within-bounds, valid-topology).

### 2.3 RL Training Approaches

**PPO / TRPO.** Stable, well-understood, used in everything from RLHF to
StarCraft. Memory-heavy because of the value function; not a problem for a
1B-or-smaller policy. PPO is the default if we go full RL.
([PPO](https://arxiv.org/abs/1707.06347))

**DPO / IPO / KTO.** Pairwise preference optimization. DPO requires
`(preferred, dispreferred)` pairs which we can generate cheaply: pick two
candidate operations, take whichever the gate scores higher (or which passes
when the other fails). DPO is much cheaper to train than PPO and avoids the
reward-hacking pathology. **DPO is the right v0.5 algorithm for the R-Model.**
([DPO](https://arxiv.org/abs/2305.18290))

**GRPO.** DeepSeek's group-relative policy optimization, used in DeepSeek-R1
and Qwen reasoning models. Generate G candidates, normalize rewards within
the group, optimize against the relative advantage. No value function needed,
which matters for small models. **GRPO is the right v0.5+ algorithm if we
want true on-policy RL.** ([GRPO via DeepSeekMath](https://arxiv.org/abs/2402.03300),
[DeepSeek-R1](https://arxiv.org/abs/2501.12948))

**RLAIF / RLAF.** When ground-truth patterns exist (FreeSewing renders,
GarmentCodeData), use them as preferred completions in DPO. When they don't,
use the gate as the AI feedback. Hybrid is fine.

**Self-play / AlphaZero shape.** AlphaZero is a special case of MuZero with a
known forward model. We have a known forward model (the gate plus the
deterministic geometry kernel). Self-play here means: the model generates
problems for itself (random perturbations of valid patterns) and learns to
solve them back to gate-passing form. This is the right v1 training story
once we have a real corpus.

**Reward shaping under sparse signal.** The gate is currently
mostly-binary (`pass/fail`). Dense reward shaping using the *components* of the
gate (seam-length-error, armhole-perimeter-error, dart-symmetry-error,
hem-balance-error) is straightforward — and the existing
[`drafting-formulas-a-line-tunic.json`](../data-corpus/drafting-formulas-a-line-tunic.json)
already names six numeric validation rules. Shape the reward as
`-Σ weight_i * normalized_error_i + bonus_pass`, with weights tuned per
garment family. This is the same pattern AlphaProof uses with
proof-progress signals.

**Curriculum learning.** Start with the easiest garment family (sleeveless
A-line, no darts, no closures) and progressively unlock more. Curriculum
ordering by gate-difficulty is a win shown across RL — Pattern Lab can lift
curriculum directly from `garment-families.json`'s `complications` field.

**Meta-learning across garment families.** MAML / Reptile / pre-train +
few-shot adapter. Pragmatic shape: train one base R-Model on a mixed corpus
across all families, then per-family LoRA adapters fine-tune for 1–2 epochs
each. Cheap, swappable at runtime. ([MAML](https://arxiv.org/abs/1703.03400))

**Verifier-augmented training.** Verifier-as-oracle is cleanest when the
verifier is fast. Our gate is fast (sub-millisecond geometry checks per
panel). This means the inner training loop can do thousands of gate calls per
second on CPU — there's no infrastructure barrier to verifier-rewarded
training, unlike protein folding or Lean proving where the verifier is
seconds-to-minutes per call. **This is our biggest architectural advantage
and the project should lean on it hard.**

### 2.4 Domain-Adjacent Prior Art

**DeepCAD / SketchGen / SketchGraphs.** CAD-specific generation models that
predict structured CAD operation sequences (sketch → extrude → fillet etc.)
from images or text. Output is a *program*, not a mesh. This is the right
*shape* for our R-Model: predict an operation, append to the operation log,
re-evaluate, repeat.

- **DeepCAD** (Wu et al. 2021) — transformer encoder/decoder over CAD command
  sequences. Output vocabulary is small (12 commands). 5–10M params.
  ([paper](https://arxiv.org/abs/2105.09492))
- **SketchGraphs** (Seff et al. 2020) — 15M parametric CAD sketches with
  constraints. The dataset construction methodology is more directly useful
  to us than the model: parametric ground truth + perturbation + retraining.
  ([paper](https://arxiv.org/abs/2007.08506))
- **SketchGen** (Para et al. 2021) — generative sketch-program model.
  ([paper](https://arxiv.org/abs/2106.02711))

The lesson: predict structured operations, not geometry. We've already
committed to operations (DAG spine). Hooking a small DeepCAD-shaped model on
top is straightforward.

**GarmentDiffusion / GarmentCode / DressCode.** Already named in
[`semantic-curve-interpretation-soa-2026-05-03.md`](semantic-curve-interpretation-soa-2026-05-03.md);
extending the angles that doc didn't cover:

- **Distillation angle** — GarmentDiffusion is large (~1B params reported). A
  6-layer student transformer trained on its outputs over our garment family
  set should be browser-runnable. The diffusion teacher need not be in the
  product; it can run server-side once to generate training data.
- **RL angle** — once distilled, the student can be RL-fine-tuned on our gate.
  This is the AlphaProof-shape recipe (large pretrained → small distilled
  student → verifier-RL).

**AlphaTensor / FunSearch.** Both use neural search over a discrete program
space guided by a fast verifier (matrix multiplication correctness for
AlphaTensor, code-execution correctness for FunSearch). Closer to our setup
than RLHF: the model proposes a discrete artifact, the verifier scores it
exactly, and the policy is updated on the verified-good ones. **Pattern Lab's
R-Model can borrow FunSearch's "evolve a population of programs against a
verifier" recipe almost directly.** ([AlphaTensor](https://www.nature.com/articles/s41586-022-05172-4),
[FunSearch](https://www.nature.com/articles/s41586-023-06924-6))

**Protein folding** — already discussed under AlphaFold. The relevant
non-iterative-refinement lesson is *MSA + structure module*: the model
benefits enormously from co-evolutionary context. Our analog is "look at
many sketches in the same garment family for shared structure" — i.e.
retrieval-augmented generation over our reference corpus.

**Code generation with execution feedback.**

- **CodeRL** (Le et al. 2022) — RL on code with unit-test execution as
  reward. Direct analogy: gate evaluation as unit test. ([paper](https://arxiv.org/abs/2207.01780))
- **AlphaCode** (DeepMind 2022) — clustering many candidate solutions, picking
  representatives. Useful for our best-of-N policy.
- **rStar / V-Star** (Microsoft 2024) — small models match larger reasoning
  models when paired with verifier-guided MCTS. Relevant precedent for
  staying small.

**Music structured generation.** MusicLM, MusicGen — long-horizon structured
output. Less relevant; our horizon is short.

**3D shape generation with constraints.** ShapeAssembly, StructureNet — predict
structured part graphs of furniture/cars with hierarchical constraints.
Conceptually closer to pattern panels (panels-with-relationships) than text
generation. Mid-tier relevance; worth tracking but not a v0.2 dependency.

## 3. Headline Recommendations

### 3.1 V-Model — Vectorization + Semantic Interpretation

**Architecture: a Set Transformer over candidate Bezier curves, conditioned on
a MobileSAM-tiny image encoder, emitting per-curve role labels and curve
endpoint refinements.**

Concretely:

```
raster sketch (224x224 or 384x384, garment isolated)
  -> MobileSAM image encoder (5.78MB, ~10ms ONNX-Web/WebGPU)
  -> classical tracer (Potrace/VTracer) producing K candidate curves
  -> Set Transformer (4 layers, 128 dim, 4 heads, ~1.5M params)
       inputs: per-curve features (length, mean tangent, endpoint coords,
               coarse image-feature pooled along curve)
       output per curve: { role_logits[N_roles], endpoint_refinement_dxdy }
  -> ConfidencePolicy (existing; reuses
     garment-family-landmark-priors.json thresholds)
  -> EditableTraceLayer (with role labels)
```

Total params: ~7M. Total inference: ~25–60ms on M-series Macs via WebGPU,
~150–250ms on CPU.

**Why this shape:**

- The classical tracer remains the curve proposer. We are *not* learning
  raster→Bezier from scratch — that's where DiffVG/Im2Vec live and they don't
  fit a browser yet. We are learning *which curves are which*, which is a far
  smaller problem.
- Set Transformer's permutation invariance matches our actual input: curves
  arrive in tracer-defined order, not artist-defined order. SketchGNN would
  also work but adds graph construction overhead; Set Transformer is simpler.
- The vision encoder grounds curves in image context (this curve is in a
  region that "looks like a neckline area"), which is exactly what the
  heuristic interpreter cannot do.
- Output shape (per-curve role + endpoint refinement) drops directly into the
  existing `CurveRoleAssignment` schema. No downstream rewrite.

**RL training plan:**

- v0.2 (no real corpus): pure supervised, distilled from GPT-4o or Claude
  vision-labeled synthetic sketches generated from FreeSewing parameter
  sweeps. ~5–10k synthetic examples per garment family. Train per-family LoRA
  adapters on top of a shared encoder.
- v0.5 (real correction log): switch to gate-rewarded RL. Reward signal:
  `+1.0` if all required `LandmarkSlot`s pass `ambiguity_threshold`,
  `-0.5 * Σ ambiguity_score_i` for unfilled slots. DPO over `(model_output,
  user_corrected_output)` pairs from the existing
  `IntelligenceLearningLoop` corpus is the cheapest first move.
- v1 (large corpus): GRPO. Group size 8. Best-of-N at inference time, N=4.

**Staged enrichment path:**

| Stage | Trigger | Architecture | Training data | Inference |
| --- | --- | --- | --- | --- |
| v0.2 | Heuristic interpreter shipped, correction log started | Set Transformer + frozen MobileSAM trunk, per-family LoRA | 5–10k synthetic + ~100 real corrections per family | ~50ms WebGPU |
| v0.5 | ~1k real corrections accumulated | Same shape, fine-tuned with DPO on correction log | Add ~1k real correction pairs per family | ~50ms WebGPU |
| v1 | ~10k real corrections + GarmentCodeData synthetic | Replace MobileSAM with task-distilled encoder; add GRPO | Mixed real + synthetic; GRPO group=8 | ~30ms WebGPU |

Heuristic interpreter remains the fallback at every stage. If the V-Model's
confidence is below a threshold (model self-rated, calibrated against gate
pass-rate) the heuristic runs and the union of confident outputs is taken.

### 3.2 R-Model — Pattern Refinement

**Architecture: a SmolLM2-135M-instruct (or Qwen2.5-0.5B-instruct) base,
QLoRA-fine-tuned on synthetic operation traces, deployed via WebLLM/MLC,
called inside a best-of-N + gate-scoring outer loop.**

Concretely:

```
PatternGraphCandidate (current state, serialized as a small JSON)
  + ValidationGate diagnostics from the previous step
  -> Prompt: "Garment family: <id>. Current diagnostics: <list>.
              Propose one operation from <op-vocabulary> that improves
              the largest diagnostic. Respond with operation JSON only."
  -> SmolLM2-135M (4-bit GGUF, ~70MB)
       sample N=4 candidate operations at temperature 0.7
  -> apply each operation deterministically (geometry kernel)
  -> score each new candidate via ValidationGate
  -> pick best, append to operation DAG, repeat until pass or budget
```

Total params: 135M base + ~2M LoRA adapter per garment family.
Per-step inference: ~150–250ms for 4-sample best-of-N on M-series Macs via
WebGPU/WebLLM. Outer loop budget: 10 steps / 2.5s for interactive use.

**Why this shape:**

- The R-Model is fundamentally an *action proposer*, not a state predictor.
  An LLM-shape tokenizer is the cleanest match for emitting a JSON operation.
- Model is small enough that 4-sample best-of-N fits an interactive budget.
- The verifier (gate) is fast enough that scoring all 4 candidates takes
  ~5–20ms total. The model is the bottleneck, not the verifier.
- Operations are the existing DAG-spine primitive. The model's output drops
  into the operation log unchanged; the only adapter is "JSON parse →
  Operation".
- Heuristic generator (current FreeSewing/Bella drafter) remains the
  initial-state producer. The R-Model only refines, never generates from
  scratch. This keeps the search problem bounded.

**RL training plan:**

- v0.5 (synthetic-only): generate 50–100k synthetic refinement trajectories.
  Process: take a valid pattern → perturb random params (noise into
  `EaseProfile`, `dart_intake`, `hem_sweep`, etc.) → run heuristic refinement
  to fix it → record `(perturbed_state, valid_operation, gate_diagnostics)`
  triples. Supervised fine-tune SmolLM-135M with QLoRA on this corpus.
- v1 (real corpus + RL): switch to **GRPO with the gate as reward**. Reward
  shaping per Section 2.3 (component diagnostics, weighted, plus a
  pass-bonus). Group size 8. ~50–100 GRPO steps per garment family per epoch.
- Long-term: add MuZero-style value head (small MLP over state-features
  predicting probability the candidate will pass within K steps); use it for
  beam-search at inference.

**Staged enrichment path:**

| Stage | Trigger | Architecture | Training data | Inference |
| --- | --- | --- | --- | --- |
| v0.2 | (skip — heuristic generator is enough) | — | — | — |
| v0.5 | First two garment families generated by heuristic; gate scoring stable | SmolLM2-135M base + per-family QLoRA, supervised | 50–100k synthetic perturbation→fix traces per family | ~200ms/step, 10-step loop, 2s |
| v1 | ~5k real edit traces in corpus; second human-validated garment | Same base, GRPO fine-tuned, best-of-8 sampling | Synthetic + real, GRPO with shaped reward | ~250ms/step, best-of-8, 10 steps, 2.5s |
| v1.5 | Stable v1 R-Model | Add small MuZero-shape value head + beam search | Add value-head training pairs | ~300ms/step, beam-of-4, depth-3 lookahead |

The R-Model is *additive* to the heuristic generator. The heuristic always
runs first to produce an initial candidate; the R-Model only fires when the
initial candidate fails the gate, or when the user asks for "tighten this
fit" / "rebalance the side seams" / similar refinement language.

## 4. Integration With The DAG Spine

Both models slot into the existing operation DAG with no schema change beyond
provenance tagging.

### 4.1 V-Model integration

- **Operation kind**: `vectorize-and-tag`
- **Inputs**: raster image asset id, garment family id, optional user-supplied
  recipe.
- **Outputs**: `EditableTraceLayer` with per-path `CurveRoleAssignment` and
  per-path confidence.
- **Provenance fields**: `producer = "v-model-vX.Y-onnx"`,
  `producer_version = <model checkpoint hash>`, `prior_used = <family id>`,
  `inference_runtime = "ort-web-webgpu"`, `latency_ms`.
- **Gate evaluation**: existing `LandmarkSet` validation + per-curve confidence
  threshold (per-family) + symmetry / boundary-cycle integrity checks.
- **Failure handling**: if gate rejects, the operation is logged but not
  promoted; the system *retries with the heuristic interpreter* (fallback
  producer) and the V-Model receives the gate diagnostics as a training
  signal in the correction log.

### 4.2 R-Model integration

- **Operation kind**: `refine-pattern`
- **Inputs**: current `PatternGraphCandidate`, current `ValidationReport`,
  refinement budget (max steps, max wall-time).
- **Outputs**: a *sequence* of sub-operations, one per inner-loop step. Each
  sub-operation is one of the existing operation kinds (`adjust-parameter`,
  `nudge-curve`, `add-dart`, `change-neckline-shape`, etc).
- **Provenance fields**: `producer = "r-model-vX.Y-mlc"`,
  `producer_version`, `inner_loop_steps`, `gate_calls`, `final_gate_pass`,
  `latency_ms_total`.
- **Gate evaluation**: the same gate, called per inner-loop step. The R-Model
  *cannot* propose an operation that bypasses the gate — every sub-operation
  is validated.
- **Failure handling**: if the loop exhausts its budget without gate pass,
  the candidate is returned with the *best partial improvement* and the
  reason logged. The user surface presents this as "I improved the front
  armhole, but I couldn't fully resolve the back-neck pullover check —
  here's what I'd suggest" (per the design-language commitment).

### 4.3 Schema additions

Two small additions to the operation log shape are needed to support both
models cleanly:

```ts
type Operation = {
  // existing fields
  id: string;
  kind: OperationKind;
  parent_op_id: string | null;
  produced_at: string;
  // new: producer provenance (already partially planned for heuristic-only)
  producer: ProducerId;          // "heuristic-v0.1" | "v-model-v0.5" | "manual" | ...
  producer_version: string;
  inference_latency_ms?: number;
  // new: gate trace
  gate_pass: boolean;
  gate_diagnostics: ValidationReport;
  // new: for compound operations (R-Model loop)
  sub_operation_ids?: string[];
  inner_loop_budget?: { max_steps: number; max_wall_ms: number };
};
```

Because the R-Model emits a *sequence* of sub-operations, the parent-child
relationship in the DAG is enough to express "this whole refinement sequence
was one model call". This keeps the operation DAG flat for analysis and lets
the user replay or branch any sub-step.

## 5. RL Training Data Sketch

Training data scarcity is real. Three sources combine to fix it.

**Source 1 — Synthetic from FreeSewing/GarmentCode parameter sweeps.**

- Pick the parametric drafter (e.g. Bella). Sweep `bustEase`, `waistEase`,
  `chestEase`, `dartIntake`, etc. across realistic ranges, sampled by
  garment-family `ease_woven_cm` distributions in
  [`garment-families.json`](../data-corpus/garment-families.json).
- Render each parameter set to (a) a clean technical-flat raster (front and
  back), (b) the resulting `PatternGraph`, (c) the `ValidationReport`.
- For the V-Model: vary line weight / sketch-style augmentations (pencil
  noise, perspective skew, partial occlusion) before tracing, paired with
  ground-truth role labels from the parametric source.
- For the R-Model: perturb a valid set, run heuristic refinement, record the
  `(perturbed → refined)` operation trajectory.
- Yield: ~50k V-Model examples and ~100k R-Model trajectories per family in a
  single overnight job on a single workstation.

**Source 2 — GarmentCodeData and SewFactory.**

- GarmentCodeData (~1k procedurally-generated patterns with renders) and
  SewFactory (~13k sewing-pattern + 3D drape pairs) are public, reasonably
  licensed, and structurally compatible with our PatternGraph after a
  conversion shim. ([GarmentCodeData](https://igl.ethz.ch/projects/GarmentCode/),
  [SewFactory](https://github.com/maria-korosteleva/Garment-Pattern-Generator))
- Use as out-of-distribution evaluation set first (does our V-Model
  generalize?). Use as a *training* set later, after we own a clean schema
  conversion.

**Source 3 — Distillation from a large multimodal model.**

- Run GPT-4o or Claude (with vision) over a curated batch of project-owned
  sketches (the v0.1 corpus, the GPT-Image-2 fixtures, a small set of human
  uploads with consent). Prompt: "label each path id with the garment role
  from this list."
- The teacher is not the system of record. It is a *cheap labeler*, with
  outputs filtered through the gate (only labels that produce a valid
  `LandmarkSet` are kept). This filters out hallucinations.
- Yield: ~1k high-quality real-image labeled examples per family, sufficient
  for v0.5 fine-tuning.

**Source 4 — `IntelligenceLearningLoop`.**

- Every manual user correction in the existing heuristic interpreter is
  already logged as `(curve_features, predicted_label, user_label,
  garment_family_id, sketch_id)`. This is a free, growing, real-distribution
  training signal.
- Same for the eventual R-Model: every "I edited this pattern manually after
  the model proposed something else" is a DPO pair.

**Data flywheel.** Heuristic + manual → seed corpus → V-Model v0.2 distilled
from teachers + filtered by gate → V-Model v0.5 fine-tuned on real
corrections → V-Model v1 trained with GRPO on the gate. Same shape for
R-Model, one stage delayed.

## 6. Browser Deployment Plan

| Component | Format | Runtime | Bundle size | Inference latency (M2 / WebGPU) |
| --- | --- | --- | --- | --- |
| V-Model image encoder (MobileSAM-tiny) | ONNX (FP16) | ORT-Web | ~6MB | ~10ms |
| V-Model curve decoder (Set Transformer) | ONNX (FP16) | ORT-Web | ~3MB | ~10ms (50 curves) |
| V-Model per-family LoRA adapters | ONNX delta | ORT-Web | ~0.5MB each | swap is free |
| R-Model base (SmolLM2-135M-instruct) | GGUF q4_K_M | WebLLM/MLC | ~70MB | ~150ms first token, ~30 tok/s |
| R-Model per-family QLoRA | LoRA delta | WebLLM | ~5MB each | merged at load |
| Heuristic interpreter (fallback) | TypeScript | main thread | ~50KB | <5ms |
| Validation gate | TypeScript / WASM | Web Worker | ~100KB | <2ms per check |

Deployment pattern:

- V-Model: lazy-loaded on first sketch upload; encoder cached in
  IndexedDB across sessions; per-family LoRA loaded on garment-family
  classification (~5KB swap).
- R-Model: lazy-loaded on first refinement request; cached in IndexedDB.
  Refinement is opt-in ("smooth this pattern" button or assistant command),
  so first-load latency is acceptable.
- Both models gate behind a feature flag and fall back to heuristic on any
  load failure.

Total *added* download for a user who triggers both models: ~85MB. Cached
after first use. This is comparable to a single AAA game's update.

For platforms without WebGPU (older Safari, low-end mobile), the V-Model
falls back to ORT-Web-WASM-SIMD (3–4x slower, still under 200ms total) and
the R-Model falls back to the heuristic generator (no R-Model on those
platforms in v0.5; revisit when WebNN ships).

## 7. Open Questions

1. **Does the V-Model need centerline tracing first?** If centerline
   ([`vectorization-for-garment-ingestion-2026-05-03.md`](vectorization-for-garment-ingestion-2026-05-03.md)
   open question 1) is shipped before the V-Model, the curve set the model
   sees is much cleaner. The V-Model can probably tolerate edge-of-stroke
   input (each stroke is two near-parallel curves; the model can collapse
   them in the role-tagging step), but quality is better with centerline.
   Recommend deciding on centerline before V-Model v0.5.
2. **Where does the gate's reward shape come from?** Section 2.3's
   `-Σ weight_i * normalized_error_i + bonus_pass` recipe needs per-rule
   weights. v0.5 starts with `weight_i = 1` for all rules; v1 should learn
   weights from the human-correction log (which corrections did users
   actually make? those rules matter more).
3. **Runtime memory ceiling.** A 70MB GGUF + 10MB ONNX in a browser tab is
   fine on desktop, painful on mobile. A SmolLM-135M-class model may exceed
   what a budget Android device can hold. v0.5 should profile on a low-end
   target before committing.
4. **Privacy / IP for distillation teachers.** Sending user sketches to
   GPT-4o/Claude for label distillation crosses a consent line that needs
   explicit handling under `InputProvenance`. Synthetic-only training is
   the safe v0.5 default; real-image distillation is gated on consent.
5. **Where does the heuristic-vs-model arbitration live?** The "model
   confidence below threshold → run heuristic" policy needs a calibrated
   threshold per garment family. Calibration requires a held-out set; we
   need a small evaluation harness before either model ships in production.
6. **MuZero-style value head — when?** Tempting to skip straight to it for
   v1. But value-head training requires a corpus of `(state, eventual
   gate-pass distance)` pairs, which we won't have until R-Model v0.5 has
   logged a few thousand refinement trajectories. So v1 best-of-N first,
   v1.5 value-head + beam search.
7. **Failure mode telemetry.** Both models will sometimes fail
   spectacularly (hallucinated dart, neckline labeled as hem). The
   gate catches these for free, but we need to *surface* them to the user
   in design language and to the dev surface for debugging. Naming this as
   a tooling commitment now prevents retrofit later.
8. **Cross-family generalization.** The plan trains per-family LoRA
   adapters. What about a brand-new family (the 13th, 14th)? Do we train a
   new adapter from scratch (takes a day on synthetic), or do we expect the
   base model to generalize zero-shot? Unknown until we try; budget for the
   first few new families to need their own adapters.

## 8. Known Gaps (Honest List)

These are the places this recommendation is not yet implementable as
documented. Calling them out so the next subagent or implementer can plan
around them.

- **No SmolLM2 / Qwen2.5 / Gemma-3 inference benchmarks on Pattern Lab's
  exact prompt shape have been measured.** The 200ms/step number is
  extrapolated from public WebLLM demos with comparable model sizes; the
  exact serialization of `PatternGraphCandidate` into a prompt could push
  it 2–3x. v0.5 needs an early benchmark spike (one afternoon) before
  committing to the SmolLM-135M base size.
- **No per-family LoRA adapter sizing experiment exists.** Rank 8 vs rank
  16 vs rank 32 has different params + training time tradeoffs; the choice
  is workload-dependent and not yet resolved. Default to rank 16 with the
  expectation that v0.5 measurement may move it.
- **The reward-shaping weights for the R-Model are placeholders.** The six
  validation rules in
  [`drafting-formulas-a-line-tunic.json`](../data-corpus/drafting-formulas-a-line-tunic.json)
  give us six numeric error signals but the *correct* relative weighting is
  a patternmaker question, not an ML question. The Orrery design review's
  finding 15 (early patternmaker checkpoint) is a prerequisite for this.
- **The synthetic perturbation distribution has not been audited.** "Perturb
  ease params, run heuristic refinement, record the operation trajectory"
  is a clean recipe but the *distribution of perturbations* matters
  hugely — too small and the model doesn't learn anything, too large and
  the heuristic refiner can't recover and we get garbage trajectories.
  This needs a calibration spike before v0.5 training.
- **The V-Model's "vision feature pooled along the curve" feature is a
  reasonable inductive bias but is not yet specified at the implementation
  level.** Bilinear sample N points along the Bezier, mean-pool ImageEncoder
  features at each, concatenate? Probably yes, but the dimensionality and
  pooling choices need a small experiment before locking the architecture.
- **Browser memory pressure on mobile is unmeasured.** Section 6's "85MB
  added download" is fine on desktop; whether a budget Android Chrome
  session keeps both models hot in memory through a 30-minute design
  session is unknown.
- **The DAG spine itself is partially documented.** The spine is mentioned
  in `DECISION-LOG.md` (candidate promotion as state machine, validation as
  backend instrumentation) but the *operation kinds* enumeration isn't yet
  in the schema. The R-Model's prompt vocabulary depends on that
  enumeration. Both should be specified together.
- **Consent / training-data IP for the `IntelligenceLearningLoop`.** Per
  the Orrery review's finding 18, this is named-not-designed. Real-image
  distillation and DPO training over user corrections both require this
  before they can ship to actual users.

These gaps don't block v0.2 work (heuristic stays the floor), but they are
real and named here rather than papered over.

## 9. Knowledge Graph Additions

These nodes/edges are proposed for `docs/project/KNOWLEDGE-GRAPH.md`. Per the
project rule, this doc does not edit the knowledge graph directly.

**New nodes:**

- `BespokeModelRole` — enum of roles a bespoke model can play in the spine.
  Initial values: `vectorization-and-tag` (V-Model), `pattern-refinement`
  (R-Model). Future-extensible.
- `ProducerProvenance` — the provenance shape attached to every `Operation`.
  Fields: `producer_id`, `producer_kind` (`heuristic` | `bespoke-model` |
  `manual` | `external`), `producer_version`, `inference_runtime_id`,
  `inference_latency_ms`.
- `BespokeModel` — a registered model that can produce operations. Fields:
  `id`, `role` (`BespokeModelRole`), `architecture_family`,
  `params_million`, `runtime_class`, `bundle_size_mb`, `staging_label`
  (`v0.2` | `v0.5` | `v1` | `research-only`), `training_data_corpus_id`,
  `training_recipe_id`.
- `InferenceRuntimeProfile` — runtime descriptor. Fields: `id`
  (`ort-web-webgpu`, `ort-web-wasm-simd`, `webllm-mlc`, `wllama`,
  `transformers-js`), `target_hardware`, `gpu_required`, `wasm_only`,
  `memory_floor_mb`.
- `TrainingRecipe` — RL/SL training plan record. Fields: `id`,
  `algorithm` (`supervised`, `dpo`, `grpo`, `ppo`, `mu-zero`),
  `data_corpus_ids`, `reward_shape`, `loss_components`, `eval_fixtures`.
- `RewardShape` — declarative description of how the gate's diagnostics
  combine into an RL reward. Fields: `id`, `components` (per-rule
  `{rule_id, weight, normalization}`), `pass_bonus`, `step_penalty`.
- `BestOfNPolicy` — inference-time search policy. Fields: `id`, `n_samples`,
  `temperature`, `gate_calls_per_step`, `step_budget`, `wall_budget_ms`.
- `OperationProducerFallbackPolicy` — what to do when a bespoke model fails.
  Fields: `id`, `primary_producer`, `fallback_producer`,
  `failure_threshold_score`, `failure_threshold_check`.
- `ModelCalibrationFixture` — locked input → expected confidence/output for
  calibrating model self-rated confidence against gate pass-rate. Subtype
  of `EvalFixture`.

**New edges:**

```text
Operation
  -> ProducerProvenance
  -> BespokeModel

BespokeModel
  -> BespokeModelRole
  -> InferenceRuntimeProfile
  -> TrainingRecipe
  -> OperationProducerFallbackPolicy

TrainingRecipe
  -> RewardShape
  -> ValidationReport (as reward source)
  -> SyntheticDataset
  -> CorrectionLogRecord
  -> EvalFixture

BespokeModel
  -> BestOfNPolicy
  -> ValidationGate (called by inference loop)

PatternGraphCandidate
  -> ProducerProvenance
  -> ValidationGate
  -> Operation (next refinement step)

IntelligenceLearningLoop
  -> CorrectionLogRecord
  -> TrainingRecipe
  -> BespokeModel
```

**Proposed boundary rules** (to add to `Representation Boundary Rules`):

- A `BespokeModel` is an alternative `Operation` producer, not a replacement
  for the heuristic. Every `BespokeModelRole` has a heuristic floor that
  ships in the same surface.
- A `BespokeModel`'s output goes through the same `ValidationGate` as any
  other operation. A model that bypasses the gate is not a model — it is a
  bug.
- `ProducerProvenance` is required on every `Operation`; the heuristic's
  provenance is `{producer_kind: "heuristic", producer_version: <rule
  library version>}`.
- The `RewardShape` must be expressible as a function of
  `ValidationReport` components. Reward shaping cannot invent new signals
  the gate doesn't already produce.
- `BespokeModel` checkpoints are versioned, content-addressed, and pinned
  per release. Two `Operation`s produced by different model versions are
  not equivalent and the DAG records both.
- Browser inference latency budgets are first-class: `<200ms` for V-Model
  per-call, `<300ms` per inner step for R-Model, `<3s` for a complete
  refinement loop. Models that exceed budget on the target hardware tier
  do not ship to that tier.

---

## References

Vision encoders, small models, runtimes:

- MobileViT: https://arxiv.org/abs/2110.02178
- MobileViT v2: https://arxiv.org/abs/2206.02680
- MobileSAM: https://arxiv.org/abs/2306.14289 (repo: https://github.com/ChaoningZhang/MobileSAM)
- FastSAM: https://arxiv.org/abs/2306.12156
- EfficientFormer: https://arxiv.org/abs/2206.01191
- Set Transformer: https://arxiv.org/abs/1810.00825
- DeepSVG: https://arxiv.org/abs/2007.11301 (repo: https://github.com/alexandre01/deepsvg)
- BezierSketch: https://arxiv.org/abs/2007.02190
- SketchGNN: https://arxiv.org/abs/2103.00139
- SmolLM2: https://huggingface.co/HuggingFaceTB/SmolLM2-135M
- Qwen2.5: https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct
- Gemma 3 270M: https://huggingface.co/google/gemma-3-270m
- Phi-3-mini: https://arxiv.org/abs/2404.14219
- Mamba: https://arxiv.org/abs/2312.00752
- RWKV: https://arxiv.org/abs/2305.13048 (web-rwkv: https://github.com/cryscan/web-rwkv)
- LoRA: https://arxiv.org/abs/2106.09685
- QLoRA: https://arxiv.org/abs/2305.14314

Iterative refinement, verifier-guided:

- AlphaFold 2: https://www.nature.com/articles/s41586-021-03819-2
- AlphaFold 3: https://www.nature.com/articles/s41586-024-07487-w
- Flow Matching: https://arxiv.org/abs/2210.02747
- DDPM: https://arxiv.org/abs/2006.11239
- MuZero: https://www.nature.com/articles/s41586-020-03051-w
- DreamerV3: https://arxiv.org/abs/2301.04104
- "Let's Verify Step by Step" (PRM): https://arxiv.org/abs/2305.20050
- rStar: https://arxiv.org/abs/2408.06195
- Tree of Thoughts: https://arxiv.org/abs/2305.10601

RL training for verifier-rewarded models:

- PPO: https://arxiv.org/abs/1707.06347
- DPO: https://arxiv.org/abs/2305.18290
- GRPO / DeepSeekMath: https://arxiv.org/abs/2402.03300
- DeepSeek-R1: https://arxiv.org/abs/2501.12948
- MAML: https://arxiv.org/abs/1703.03400
- AlphaProof / AlphaGeometry context: https://www.nature.com/articles/s41586-023-06747-5

Domain-adjacent prior art:

- DeepCAD: https://arxiv.org/abs/2105.09492
- SketchGraphs: https://arxiv.org/abs/2007.08506
- SketchGen: https://arxiv.org/abs/2106.02711
- GarmentDiffusion: https://arxiv.org/abs/2504.21476
- GarmentCode: https://igl.ethz.ch/projects/GarmentCode/
- SewFormer: https://arxiv.org/abs/2311.04498
- AlphaTensor: https://www.nature.com/articles/s41586-022-05172-4
- FunSearch: https://www.nature.com/articles/s41586-023-06924-6
- AlphaCode: https://www.science.org/doi/10.1126/science.abq1158
- CodeRL: https://arxiv.org/abs/2207.01780

Browser deployment runtimes:

- ONNX Runtime Web: https://onnxruntime.ai/docs/tutorials/web/
- transformers.js: https://huggingface.co/docs/transformers.js
- WebLLM (MLC): https://webllm.mlc.ai/
- Candle: https://github.com/huggingface/candle
- wllama: https://github.com/ngxson/wllama
- WebNN draft: https://www.w3.org/TR/webnn/
