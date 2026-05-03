# Research Queue

## Highest Priority

### R1: Patternmaking Fundamentals

Goal: build a concise internal rulebook for the first garment.

Questions:

- What exact drafting method should drive the sleeveless A-line tunic?
- How much bust/waist/hip ease is reasonable for a loose woven pullover?
- When can the center back be cut on fold vs require closure?
- What are acceptable armhole and neckline finishing choices?
- Which measurements are truly required?
- Which landmarks are mandatory vs optional?

Outputs:

- `docs/reference/PATTERNMAKING-FUNDAMENTALS.md`
- First-garment drafting formulas.
- Human review checklist.

### R2: Pattern Representation Schema

Goal: define the machine-readable pattern graph.

Questions:

- Is GarmentCode suitable as the core representation or only a reference?
- Should the prototype use JSON + SVG paths first?
- How are stitch relationships represented?
- How are darts represented?
- How are seam allowance and cut lines derived from seam lines?

Outputs:

- `docs/project/PATTERN-SCHEMA.md`
- JSON example for first garment.

New source-driven decision:

- Compare a direct `PatternGraph` JSON schema against a GarmentCode-style `PatternProgram` layer.
- Decide whether `RasterPatternEncoding` belongs only in future ML experiments or should exist as a debug/export artifact.
- Preserve `PatternGraph` as the manufacturing truth even if pattern programs, edge tokens, or raster encodings are used upstream.

### R2b: Sewing-Aware Validation Rules

Goal: turn the paper's manufacturability criteria into prototype checks.

Questions:

- How should reflection symmetry between two seam curves be approximated in 2D?
- What corner-count threshold should be warning vs error?
- How should dart symmetry be represented for the first garment?
- What minimum grainline checks are enough for prototype 1?
- What geometry library should own self-intersection and offset-curve checks?

Outputs:

- `docs/project/PATTERN-VALIDATION-CHECKLIST.md`
- Validation fixture with intentional failures.

### R2c: Candidate-To-Export Interop Layer

Goal: define the bridge between `PatternGraphCandidate` outputs and exportable pattern files.

Questions:

- What is the minimum viable `PatternGraphCandidate` schema?
- Which measurements must run before correction?
- Which correction operations can be automatic, assisted, or manual?
- Which hard errors block SVG/PDF/DXF export?
- What round-trip tests prove an export preserved geometry and semantics?
- How should mesh-derived candidates from the 2202.10272 pipeline become pattern candidates?
- What canonical unit profile is required for every candidate and export format?
- How should fabric roll width, fold mode, grainline, nap, print direction, and cut count be represented?
- Which marker/nesting algorithm should be used first for optimized fabric layout?

Outputs:

- `docs/project/CANDIDATE-TO-EXPORT-INTEROP.md`
- `docs/project/PATTERN-SCHEMA.md`
- `docs/project/PATTERN-VALIDATION-CHECKLIST.md`
- `prototype/browser/fixtures/invalid-candidate.pattern.json`
- `prototype/browser/fixtures/marker-plan.example.json`

Deep-dive update:

- Add `FormatSemanticMap`, `SVGSemanticProfile`, `DXFProfile`, and `InteropRoundTripFixture` so export compatibility is measured as semantic preservation, not just file creation.
- SVG should ship first with stable layer IDs, metadata, unit proof, and reimport checks.
- DXF/AAMA/ASTM should wait until notches, internal lines, grain/fold lines, labels, cut counts, units, and grade anchors can be expressed without guessing.

### R3: First Prototype Tech Stack

Goal: choose the smallest stack that can generate, preview, and export.

Questions:

- Browser-first app or Python-first notebook/tool?
- Three.js preview now or defer 3D until pattern export works?
- Which geometry library handles offset curves robustly?
- Can FreeSewing/GarmentCode be reused directly?

Outputs:

- `docs/project/TECH-STACK-DECISION.md`
- Prototype setup instructions.

### R3b: Graphite And Blender Pipeline Spikes

Goal: decide exactly how Graphite-style vector editing and Blender automation should support the prototype without replacing the pattern graph.

Questions:

- Can Graphite's vector crates handle the curve length, split, offset, and intersection operations needed for sewing panels?
- What semantic SVG layer conventions survive Graphite editing and Blender import?
- What minimal `PatternGraph` fields are needed for a Blender Python preview?
- Can Blender render useful validation views from panels and seam pairs without a full cloth solve?

Outputs:

- `docs/research/graphite-vector-audit.md`
- `docs/research/blender-headless-preview-spike.md`
- `docs/research/svg-roundtrip-spike.md`

### R3c: Browser-Native Three.js / WebGPU / WASM Lane

Goal: design and prototype the ownable web runtime for 2D reference image -> 3D model -> flats -> pattern.

Questions:

- What can ship in TypeScript and Three.js before WASM is required?
- Which geometry kernels must be deterministic and should move into Rust/WASM?
- What should use WebGPU compute, and what should stay in CPU workers?
- How does the browser app preserve `PatternGraph` as source of truth while showing both 2D flats and 3D assembly?
- What is the smallest useful 3D preview before cloth simulation?

Outputs:

- `docs/project/BROWSER-NATIVE-PIPELINE.md`
- `docs/project/TECH-STACK-DECISION.md`
- `prototype/browser` skeleton
- `prototype/browser/fixtures/a-line-tunic.pattern.json`

Deep-dive update:

- Define `PatternKernel` and `GeometryKernel` contracts before choosing TypeScript, Rust/WASM, C++/Emscripten, or WebGPU implementations.
- Start with TypeScript geometry in web workers; migrate offset/intersection/triangulation/nesting kernels to WASM only when needed.
- Treat WebGPU as optional acceleration because browser support is not universal; Three.js `WebGPURenderer` is attractive because it can fall back to WebGL 2.

### R3d: AI Sketch And Image-To-3D Exploration

Goal: evaluate GPT Image 2 sketch generation, modern image-to-3D frameworks, and a pattern-reference corpus for the 2D reference -> 3D model -> flats -> pattern loop.

Questions:

- Can GPT Image 2 produce controlled technical flats and garment-on-body sketches with stable construction semantics?
- Which prompt recipes preserve front/back consistency, seam visibility, darts, and silhouette?
- Which current image-to-3D model is most useful for garment candidate geometry: SPAR3D, Hunyuan3D-2, TRELLIS, TRELLIS.2, or TripoSR?
- How do we label generated sketches so they become useful corpus items instead of vibes?
- What actual pattern-piece examples should define correctness for garment families A/B/C/D/etc.?
- Which sources can legally seed a reference corpus of garment-type construction examples?
- What visual truth levels are needed before a generated image can train or evaluate pattern generation?

Outputs:

- `docs/project/AI-SKETCH-3D-EXPLORATION.md`
- `docs/project/VISUAL-CORPUS-SCHEMA.md`
- `docs/reference/PATTERN-REFERENCE-CORPUS.md`
- `docs/research/gpt-image-2-sketch-corpus-spike.md`
- `docs/research/image-to-3d-candidate-spike.md`

Deep-dive update:

- Add `TruthLevel` and `LicenseProfile` to every visual corpus item before it can influence training, evaluation, or display.
- First visual corpus should be small and strict: sleeveless A-line dress/tunic, A-line skirt, basic bodice shell, simple woven top, and simple pants block.
- Compare SPAR3D and Hunyuan3D-2 first for local/server image-to-3D candidate spikes; track TRELLIS, TRELLIS.2, and TripoSR as comparison/frontier references.
- Every image-to-3D output must become `ImageTo3DModelCandidate` plus `MeshQualityReport`; it cannot become pattern truth directly.

### R4: 2D Sketch Parsing

Goal: decide how much automation belongs in v0.

Questions:

- Is manual landmark placement enough for the prototype?
- Which landmarks can be detected reliably from a clean sketch?
- How should raster and vector inputs differ?
- How should the figure/body be separated from the garment?

Outputs:

- Landmark schema.
- Test sketch set.
- Manual annotation UI requirements.

### R4b: Designer Sketch-To-Model Editing Loop

Goal: define the clothing-designer editing surface between sketch/vector intent and live 3D garment preview.

Questions:

- Should the editor start from raster sketch cleanup, vector interpretation, or both?
- Which edits are visual-only, semantic-intent edits, material/PBR preview edits, or pattern-affecting edits?
- How does a 2D line or region project onto the garment model: UV map, surface projection, decal layer, panel-local coordinates, or view-dependent projection?
- What should the designer see side by side: original sketch, vector sketch, UV/surface projection, model preview, pattern flats, or validation warnings?
- Which PBR/material concepts matter for garments at prototype scale: base color, roughness, normal/bump, opacity, fabric texture, decal, stitching/trim mask?
- How should layer stacks, masks, symmetry/mirroring, undo, revision history, and manual correction work?
- How does the edit loop preserve the boundary that `PatternGraph` remains manufacturing truth?

Outputs:

- `docs/project/DESIGNER-SKETCH-3D-EDITING.md`
- `docs/research/designer-sketch-projection-spike.md`
- editing state schema for vector sketch layers, projection layers, material preview layers, and model feedback
- first interaction prototype requirements

Source-driven notes:

- Blender texture paint validates the basic split: paint/edit UV textures in 2D or paint directly in the 3D viewport through UVs.
- Substance Painter-style workflows suggest a higher-quality authoring target: layer stacks, masks, projection modes, texture sets, PBR channels, material previews, and reprojection concerns.
- For this product, projection edits must be classified before they can affect pattern output: visual-only, semantic intent, material-affecting, pattern-candidate-affecting, or final pattern revision.

## Medium Priority

### R5: 3D Assembly And Drape

Goal: prove that generated panels can be assembled into a coarse 3D preview.

Questions:

- Can panels be triangulated and arranged around a simple avatar?
- What cloth simulation is sufficient for validation?
- Is Blender automation faster than browser simulation?
- What fit/tension metrics are worth showing?

Outputs:

- Preview architecture note.
- Drape validation report format.

### R5b: Mesh-To-Pattern Pipeline Feasibility

Goal: evaluate whether the `Computational Pattern Making from 3D Garment Models` approach can become a later product lane.

Questions:

- Did the authors release usable implementation code, and under what license?
- Can the method run on modern macOS with reasonable setup?
- Can output patches be converted into our pattern graph?
- Can it handle a simple sleeveless tunic mesh without expert mesh cleanup?
- How stable is the greedy patch layout under small input changes?
- How should seam allowance be added after flattening?

Outputs:

- `docs/research/mesh-to-pattern-spike.md`
- Recommendation: adopt, adapt, or keep as reference only.

Deep-dive update:

- Add `GarmentSegmentation`, `MeshNormalization`, and `MeshQualityReport` before attempting any mesh-to-pattern conversion.
- A future mesh-derived pattern must still enter the same `PatternGraphCandidate` proof lane as generated/imported 2D candidates.

### R6: Commercial Tool Interoperability

Goal: understand what files can move into/out of existing tools.

Questions:

- What does CLO import/export cleanly?
- What does Seamly2D import/export?
- What DXF dialect matters first?
- Can generated SVG be edited by patternmakers in Illustrator/Inkscape?

Outputs:

- Export compatibility matrix.

### R7: Dataset Feasibility

Goal: identify train/eval data for later automation.

Questions:

- Can GarmentCodeData be accessed and used under acceptable terms?
- Which research datasets include both patterns and 3D garments?
- Are sketch-to-pattern datasets public or only described in papers?
- Can we synthesize our own sketches from generated patterns?

Outputs:

- Dataset inventory.
- Licensing notes.

New source-driven tasks:

- Audit GarmentCodeData access, license, schema, and drape pipeline setup.
- Check whether Deep Fashion3D is useful for garment-landmark or mesh-reconstruction pretraining despite lacking pattern labels.
- Identify which SketchTailor/GenPattern-style datasets are public, request-only, or paper-only.
- Determine whether first-prototype patterns can synthesize enough sketch/pattern pairs for local evaluation.

Deep-dive update:

- Treat LACMA Pattern Project as the strongest first `pattern-truth` public reference candidate because it includes scaled patterns and construction instructions.
- Treat CoPA primarily as taxonomy/catalog/reference metadata unless full pattern geometry is separately available.
- Treat OpenPattern and FreeSewing as executable/reference drafting systems for formulas, browser flow, measurements, and generated bespoke outputs.
- Treat GarmentCodeData as the strongest synthetic paired dataset lane for future ML/drape evaluation.

## Later

### R8: Grading

Goal: support size runs after one made-to-measure garment works.

Questions:

- Grade rules vs regenerate from measurements?
- How do commercial systems represent grade points?
- How does grading interact with AI-inferred style?

### R9: Physical Fabric Modeling

Goal: move from visual preview to better fit/drape prediction.

Questions:

- What fabric properties are necessary for woven prototype garments?
- Can simple material presets be good enough?
- How do CLO/Optitex/Browzwear represent fabric?

### R10: Instruction Generation

Goal: produce useful sewing instructions, not just cut pieces.

Questions:

- What construction steps are templated per garment type?
- Which steps change based on closure/finishing/darts?
- How much should be generated by rules vs LLM?
