# Data Corpus

This directory holds structured comparison/reference data produced by research subagents. Each `*.json` file is a self-describing dataset with a `schema_version`, `generated_at`, `purpose`, and a top-level array of records. Companion narrative documents live in `docs/research/`.

Conventions:

- One file per topic. Filename should be a stable, lowercase, hyphen-separated noun phrase.
- Every file declares `schema_version` (semver) and `generated_at` (ISO date).
- Every file declares `purpose` (one paragraph) and links to its companion `docs/research/*.md`.
- Records use `id` as a stable string key.
- Files are additive: schema bumps require a `schema_version` change.

## Files

(Add new sections in alphabetical order. Keep entries short — link to the companion research doc for narrative.)

## Future Files (Placeholders)

### `fabric-properties.json` (planned)

Record per fabric / fabric-class with attributes used downstream by validation, drape advice, and (eventually) the cloth-simulation preview. Expected fields include `id`, `display_name`, `fabric_class` (woven / knit / non-woven), `weight_gsm`, `hand` (one of crisp / soft / stiff / fluid), `drape_behavior` (one of structured / draped / fluid / boardy), `stretch_warp_pct`, `stretch_weft_pct`, `bias_stretch_pct`, `transparency`, `bend_stiffness`, `friction`, `notes`.

`drape_behavior` here is the **garment-industry sense** of *drape* — the way the fabric falls under its own weight. Not to be confused with "drape" as a patternmaking process (see persona-1-example-flows.md "Vocabulary Note") or "drape" as cloth simulation in the games / 3D industry. v0.1 does not consume this file; it's named here so when fabric-class warnings land in v0.5+ the schema is ready.

### `bespoke-model-candidates.json`

Candidate small/fast model architectures, RL training approaches, browser inference runtimes, and domain-adjacent prior art considered for the two bespoke-model roles in the DAG spine: (V-Model) raster-to-tagged-vector vectorization+semantic interpretation, and (R-Model) iterative pattern refinement against the validation gate. Each record carries a `family`, `role_applicability`, `size_class`, `license`, `browser_deployable`, `inference_speed_class`, `rl_ready`, `applicability_score`, `staging`, and a known-gaps register at file scope.

Companion: `docs/research/bespoke-model-opportunities-2026-05-03.md`.

Top-level keys:

| Key | Type | Notes |
| --- | --- | --- |
| `$schema_version` | string | Semver. |
| `generated` | string | ISO date. |
| `purpose` | string | One paragraph. |
| `source_doc` | string | Path to the companion narrative. |
| `field_definitions` | object | Per-field documentation for `candidates[]`. |
| `candidates` | object[] | One record per architecture / runtime / RL method / dataset method / prior-art system. |
| `summary_recommendation` | object | Opinionated v0.2 / v0.5 / v1 / v1.5 staging recommendation with V-Model, R-Model, and infrastructure splits. |
| `known_gaps` | string[] | Honest list of items where the recommendation is not yet implementable as documented. Mirrored in section 8 of the companion doc. |

Per-candidate schema:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable kebab-case identifier. |
| `name` | string | Display name. |
| `family` | string | One of: `vision-encoder`, `vision-decoder`, `set-transformer`, `sketch-gnn`, `structured-vector-decoder`, `tiny-lm`, `ssm`, `distillation-method`, `quantization-method`, `lora-method`, `runtime`, `rl-algorithm`, `search-policy`, `verifier-pattern`, `dataset-method`, `prior-art-system`. |
| `url` | string | Primary reference URL. |
| `role_applicability` | string | `vectorization` \| `refinement` \| `both` \| `infrastructure` \| `training-only`. |
| `size_class` | string | `tiny<100M` \| `small<1B` \| `medium<10B` \| `large` \| `not-applicable`. |
| `license` | string\|null | SPDX-style or descriptive. |
| `training_data_requirements` | string | Note on labeled / paired / verifier data. |
| `browser_deployable` | string | `yes` \| `no` \| `partial` \| `via-distillation` \| `via-port`. |
| `inference_speed_class` | string | `instant<10ms` \| `fast<50ms` \| `medium<200ms` \| `slow<1s` \| `very-slow>1s` \| `not-applicable` (M-series Mac with WebGPU, coarse). |
| `rl_ready` | string | `yes` \| `no` \| `partial` \| `n/a`. |
| `applicability_score` | number | 1-5; 5 = directly recommended for v0.2 or v0.5. |
| `applicability_rationale` | string | One paragraph tied to Pattern Lab constraints. |
| `staging` | string | `v0.2` \| `v0.5` \| `v1` \| `v1.5` \| `research-only` \| `excluded`. |
| `notes` | string | Free-form caveats. |

Downstream usage: ML implementation team uses this as the shortlist for staging V-Model and R-Model work behind the existing operation DAG / validation gate. Operations Architect uses `runtime` records to budget bundle size and latency. Data lead uses `dataset-method` records to prioritize synthetic / distilled / corpus data acquisition. Knowledge graph maintainer uses the recommended additions in section 9 of the companion doc.

### `craft-conventions.json`

Notch types, line types, label conventions, regional sizing (US/EU/UK/JP), and block/sloper conventions. Complements `docs/reference/PATTERN-STANDARDS-AND-CONVENTIONS.md` rather than duplicating it.

Companion: `docs/research/garment-craft-prior-art-2026-05-03.md`.

Top-level keys (each is its own sub-record array or object):

| Key | Type | Notes |
| --- | --- | --- |
| `notch_types` | object[] | `id`, `label`, `drawing`, `convention`, `use`, `machine_inputs_consumed`, `machine_outputs`. |
| `line_types` | object[] | `id`, `label`, `drawing`, `role`, `geometry_role`. |
| `label_conventions` | object | `cut_count_phrasing` (objects with `phrase`, `meaning`), `fabric_role_terms`, `piece_label_required_fields`, `annotation_phrasing_recommendations`. |
| `regional_sizing` | object | Per-region (`us`, `eu`, `uk`, `jp`) with `system`, `basis`, reference-size measurements, notes; plus `rough_conversion_notes`. |
| `block_sloper_conventions` | object | `definition`, `common_blocks` (per-block panel/ease/landmark spec), `regional_block_conventions` (Aldrich, Joseph-Armstrong, Italian, Bunka). |

Downstream usage: SVG renderer reads `notch_types` and `line_types`; pattern-package label generator reads `label_conventions`; `MeasurementProfile` and size-code surfaces read `regional_sizing`; block-derivation logic reads `block_sloper_conventions`.

### `drafting-formulas-a-line-tunic.json`

Drafting math for the v0.1 first garment: sleeveless A-line woven dress/tunic. Hybridizes FreeSewing Bella factors, Aldrich-style ease values, and conventional A-line flare practice. Each step is specific enough that a future patternmaker reviewer can audit it.

Companion: `docs/research/garment-craft-prior-art-2026-05-03.md`.

Top-level keys:

| Key | Type | Notes |
| --- | --- | --- |
| `garment_id` | string | `dress.a_line`. |
| `variant` | string | Free text variant id. |
| `units` | string | `centimeters`. |
| `coordinate_system` | object | `origin`, `x_axis`, `y_axis`, `panel_left_edge`. |
| `measurement_inputs.required` | object[] | `id`, `label`, `iso_8559_ref?`, `typical_range_cm` or `typical_range_deg`. |
| `measurement_inputs.derived_or_optional` | object[] | `id`, `label`, `default_formula?` or `default?`, `source?`. |
| `design_parameters` | object | `ease_woven_default_cm`, `shoulder_width_factor`, `hem_sweep_added_cm`, `bust_dart_threshold_cm`, `neck_shape_options`, `armhole_finish_options`, `closure_options`. |
| `back_panel_construction.step_order` | object[] | Ordered `Step` records (point construction, curve construction, or conditional). Each `Step` has `step` id and either `point` + `formula` or `curve_type` + `endpoints` + `control_points` (or `via`). |
| `front_panel_construction.step_order` | object[] | Same `Step` shape. |
| `validation_rules_for_v0_1` | object[] | `id`, `rule`, `fix_suggestions`. |
| `default_seam_allowance_profile_cm` | object | Per-edge allowance defaults. |
| `notch_placement_for_v0_1` | object[] | `location`, `type`, `purpose`. |
| `factor_provenance` | object[] | `factor`, `source`. Cites every borrowed numeric factor. |
| `audit_notes_for_patternmaker_review` | string[] | Caveats for the patternmaker checkpoint. |

Downstream usage: when `garment_family.id == "dress.a_line"`, the v0.1 generator walks `back_panel_construction.step_order` and `front_panel_construction.step_order` against a `MeasurementSet` and `EaseProfile`, emitting `Panel` entities. The `validation_rules_for_v0_1` array seeds the validation harness; `fix_suggestions` populate the `FixSuggestion` field named in the Orrery design review.

### `garment-families.json`

Catalog of ~22 common garment families: dresses, tops, skirts, pants, jackets, plus menswear and unisex variants. Per-family: required panels, anatomical landmarks, common closures, common dart placements, default ease ranges (woven and knit), construction order, common variants, and complications.

Companion: `docs/research/garment-craft-prior-art-2026-05-03.md`.

Top-level keys:

| Key | Type | Notes |
| --- | --- | --- |
| `units` | string | `centimeters`. |
| `ease_convention` | object | Definitions of `wearing_ease` vs. `design_ease` and how the per-family ease ranges are interpreted. |
| `fit_tiers` | string[] | Ordered fit-tier identifiers (`very_close` → `oversized`). |
| `families` | object[] | Per-record schema below. |

Per-record schema (one entry per family):

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable dotted key, e.g. `dress.a_line`. |
| `label` | string | Human-readable. |
| `fabric_default` | string | `woven`, `knit`, `woven_or_knit`, `bias_woven_or_knit`, `woven_with_interfacing`, `woven_denim`, `knit_stretch`, `woven_or_technical`. |
| `fits_typical` | string[] | Subset of `fit_tiers`. |
| `panels_required` | string[] | Minimum panel set for the family. |
| `panels_optional` | string[] | Variant-driven panels. |
| `anatomical_landmarks` | string[] | Body/garment landmarks the family depends on. |
| `closures_common` | string[] | Closure options. |
| `darts_common` | string[] | Dart placements typical for this family. |
| `ease_woven_cm` | object | Per-zone `[min, max]` ease range when woven. |
| `ease_knit_cm` | object | Per-zone `[min, max]` ease range when knit. |
| `construction_order` | string[] | Ordered build steps. |
| `variants` | string[] | Common sub-variants. |
| `complications` | string[] | Known fitting/construction snags. |
| `primary_fitting_challenge` | string | Single most likely failure mode. |

Downstream usage: a sketch-intent classifier picks `id`; the generator uses `panels_required` to seed the panel set, `ease_*` to seed the `EaseProfile`, `darts_common` and `closures_common` to seed options, and `construction_order` to seed `GuideSheet` steps.

### `garment-family-landmark-priors.json`

Garment-family-keyed declarative priors used by the heuristic semantic curve interpreter (`SemanticCurveInterpreter`). Each family declares the expected landmark slots, anatomical references, expected curve geometry, and discriminating heuristics a rule-based labeler can apply to a vector sketch. Distinct from `garment-families.json` (which is the *construction* prior — ease, panels, closures, darts); the two share landmark vocabulary deliberately. v0.1 covers `sleeveless-a-line-woven-tunic` only.

Companion: `docs/research/semantic-curve-interpretation-soa-2026-05-03.md`.

Top-level keys:

| Key | Type | Notes |
| --- | --- | --- |
| `$schema_version` | string | Semver. |
| `generated` | string | ISO date. |
| `purpose` | string | One paragraph. |
| `design_notes` | string[] | Why the file exists; separation from `garment-families.json`. |
| `primitive_glossary` | object | Names of geometric primitives the heuristic engine implements: `panel_bbox`, `vertical_center_axis`, `tangent_class`, `boundary_cycle_position`, `endpoint_adjacency`, `crosses_axis`, `view_assignment`. |
| `view_disambiguation_rules` | object[] | Rules that pick front vs back when ambiguous. |
| `families` | object[] | One per garment family. |
| `future_families_placeholder` | object[] | Placeholders for families not yet authored (button-down shirt, A-line skirt, fitted bodice). |

Per-family schema:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Matches `garment-families.json` family ids where possible. |
| `label` | string | Human-readable. |
| `construction_prior_ref` | string | Pointer into `garment-families.json` for construction priors. |
| `expected_views` | string[] | `front`, `back`, etc. |
| `expected_panels_per_view` | number | Usually 1. |
| `panel_topology` | object | Boundary-cycle ordering and optional interior-curve set. |
| `landmark_slots` | object[] | One record per named landmark; see below. |
| `global_consistency_checks` | object[] | Cross-slot validation rules with severities. |
| `version_stamp_fields` | string[] | What gets recorded on the produced `SketchIntent` for reproducibility. |

Per-landmark-slot schema:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable key, e.g. `hem_front`, `armhole_left`. |
| `applies_to_view` | string | `front`, `back`, or `any`. |
| `anatomical_reference` | string | Plain-language description. |
| `required` | boolean | Whether the slot must be filled before `SketchIntent` can be `confirmed`. |
| `expected_curve_count` | number\|string | Most slots are 1; darts are 2; center axis is `0_or_1`. |
| `expected_curve_type` | string | Tangent/curvature character expected. |
| `expected_curve_role` | string | Semantic role (`cut_and_finished_edge`, `seam_edge`, `interior_dart_legs`, `fold_or_seam_edge`, etc). |
| `expected_paired_with` | string | If the curve sews to another (seam pair). |
| `heuristics` | object[] | Named rules with weights. |
| `ambiguity_threshold` | number | Combined-score threshold below which the slot escalates to `AmbiguityReport`. |
| `confidence_policy_if_below_threshold` | string | What the interpreter does on low confidence. |
| `common_failure_modes` | string[] | Documented edge cases the heuristic gets wrong. |

Per-heuristic schema: `id` (string), `rule` (plain-language rule referencing `primitive_glossary`), `weight` (number contributing to slot confidence).

Downstream usage: the heuristic interpreter loads one family file at a time, walks the landmark slots, applies each heuristic to candidate curves to produce a confidence score per slot, and emits `CurveRoleAssignment` records. Below `ambiguity_threshold` the slot escalates to `AmbiguityReport` for manual confirmation. Every manual correction is logged into the `IntelligenceLearningLoop` corpus.

### `semantic-interpretation-methods.json`

Comparison table of methods, libraries, papers, and tools relevant to semantic interpretation of vector curves into garment landmarks (the step *after* vectorization). Covers four lanes: sketch-parsing ML (Sketch-RNN, SketchGNN, etc.), garment-specific semantic models (DeepFashion2, Fashionpedia, GarmentDiffusion), parametric/heuristic tooling (FreeSewing, Seamly2D, FreeCAD Sketcher), and manual-correction UX (Label Studio, COCO Annotator, Roboflow). Each record carries maturity, applicability, license, data requirement, and runtime fields.

Companion: `docs/research/semantic-curve-interpretation-soa-2026-05-03.md`.

Top-level keys:

| Key | Type | Notes |
| --- | --- | --- |
| `$schema_version` | string | Semver. |
| `generated` | string | ISO date. |
| `purpose` | string | One paragraph. |
| `field_definitions` | object | Per-field documentation for `methods[]`. |
| `methods` | object[] | One record per method/library/paper. |
| `summary_recommendation` | object | Opinionated v0.1 / v0.2 / v0.3 / v1 staging recommendation. |

Per-method schema:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable key. |
| `name` | string | Display name. |
| `category` | string | One of `sketch-parsing`, `garment-segmentation`, `garment-landmark`, `vectorization`, `multimodal-llm`, `parametric-cad`, `pattern-library`, `annotation-tool`, `dataset`, `generative-pattern`. |
| `url` | string | Primary reference URL. |
| `input_type` | string | What the method consumes. |
| `output_type` | string | What the method emits. |
| `granularity` | string | `whole-sketch` / `per-region` / `per-stroke` / `per-curve` / `per-keypoint` / `per-vertex`. |
| `garment_aware` | string | `yes` / `partial` / `no` / `yes-via-prompt`. |
| `data_requirement` | string | Labeled-data prerequisites. |
| `license` | string\|null | Headline license. |
| `maturity` | string | `research-only` / `code-available` / `productized` / `reference-only` / `tooling`. |
| `runtime_class` | string | `fits-in-browser` / `server-cpu` / `server-gpu` / `cloud-api` / `not-applicable`. |
| `applicability_to_pattern_lab` | number | 1-5; 5 = directly usable today. |
| `role_in_v0_1` | string | What, if any, role this plays in the v0.1 prototype. |
| `notes` | string | Free-form caveats and Pattern Lab implications. |

Downstream usage: implementation team uses this as the shortlist for v0.1 (heuristic interpreter + manual correction UX), v0.2 (gradient-boosted classifier on the correction log + GarmentCodeData synthetic renders), v0.3 (SketchGNN-shaped per-curve graph network + spatial priors), and v1 (GarmentDiffusion-shaped multimodal interpreter, with the heuristic retained as a validator). Knowledge graph maintainer uses it to source `KNOWLEDGE-GRAPH.md` additions documented in the companion research doc.

### `vectorization-approaches.json`

Comparison table of raster-to-vector approaches considered for the `RasterToVectorBridge` in lane B human-authored ingest. Each record describes one approach (a library, algorithm, research method, or commercial API).

Companion: `docs/research/vectorization-for-garment-ingestion-2026-05-03.md`.

Per-record schema:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Stable key. Lowercase hyphen. |
| `name` | string | Human-readable. |
| `family` | string | One of: `classical-monochrome`, `classical-color`, `vector-editor-integrated`, `differentiable-research`, `ml-research`, `classical-research`, `commercial-api`, `passthrough`. |
| `vendor` | string | Author/org. |
| `year_first` | number\|null | First public release. |
| `year_latest_release` | number\|null | Most recent release seen. |
| `license` | string | SPDX-style or descriptive. |
| `license_concern` | string | Free-text note, e.g. GPL boundary. |
| `runtime` | string[] | e.g. `native`, `nodejs`, `wasm`, `python-pytorch-cuda`, `browser-pure-js`, `hosted-api`, `desktop-app`. |
| `browser_ready` | boolean\|"indirect"\|"via-API" | Can this run in a user's browser tab today. |
| `browser_path` | string\|null | Specific package or build to use in browser. |
| `wasm_size_kb_approx` | number\|null | Approx WASM bundle size if applicable. |
| `input_modes` | string[] | e.g. `binary`, `stacked-color`, `raster-line-art`, `svg`, `single-line-raster`. |
| `preprocessing_required` | string[] | What the engine expects upstream. |
| `color_support` | string | `monochrome-only`, `indexed-color`, `full-color`, `limited`, etc. |
| `output_curve_family` | string | e.g. `cubic-bezier`, `lines-and-arcs`, `single-bezier-spline`. |
| `output_structure` | string | Description of what the engine returns. |
| `centerline_mode` | boolean\|"configurable"\|"evolving"\|"possible-with-custom-loss"\|"implicit"\|"n/a" | Whether output is centerline of strokes vs edge of strokes. |
| `deterministic` | boolean | Same input → same output without explicit seeds. |
| `speed_class` | string | `instant` / `fast` / `medium` / `slow` / `very-slow` / `fast-relative-to-diffvg`. |
| `complexity_class` | string | Big-O class or descriptive. |
| `maturity` | string | `very-high` / `high` / `medium` / `alpha` / `research`. |
| `garment_suitability_score` | number | 1-10 ranking *for this product*. Not a general quality score. |
| `garment_suitability_rationale` | string | One paragraph, why the score. |
| `recommended_use` | string[] | Tags into the recipe vocabulary, e.g. `clean-technical-flat`, `v02-centerline-port-target`, `research-substrate`. |
| `url` | string\|null | Primary public link. |
| `primary_browser_binding` | string\|null | If different from `url`, the browser-deployment artifact. |

Scoring rule for `garment_suitability_score`: 9-10 means highest-trust ingest path the product can have today (e.g. user-supplied SVG passthrough). 7-8 means deployable today and meaningfully fits a recipe. 5-6 means reference, research, or fallback. Below 5 means included for completeness but not a real candidate.
