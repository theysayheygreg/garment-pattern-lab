# Product Pillars

Date: 2026-05-03

Lens: Pattern Lab is not another mouse-and-keyboard CAD/3D editor. It is a human-centered, natural-language-led sketch-to-pattern workbench that gets as close to art -> garment as the craft allows.

Ideal outcome: being a good clothing designer should not mean you have to be an expert at CAD.

## 1. Natural Intent, Not CAD Operation

The primary interaction should be garment language:

- "make the hem longer"
- "change this to a square neckline"
- "keep the pleats but simplify the back"
- "show me what you assumed"
- "make this printable"

Direct vector or 3D manipulation is allowed as correction, but not as the whole product.

Product implication:

- build an intent review and command layer early
- expose assumptions and ambiguity questions
- map language and semantic handles into structured parameters

## 2. PatternGraph Is The Craft Contract

The product can use AI, sketches, vector layers, and 3D previews, but the trusted object is the sewing-aware `PatternGraph`.

Product implication:

- every generated or edited candidate passes through `PatternGraphCandidate`
- validation promotes candidates to trusted graph state
- no export without units, scale, labels, cut counts, seam relationships, allowances, and provenance

## 3. Trace And Layers Are A Bridge

Kew's screenshot points at an important need: reference images, croquis guides, technical callouts, vector traces, and layers are useful. But they are not the destination.

Product implication:

- support semantic vector layers and editable traces
- keep source/reference/guide/callout/pattern-affecting layers separate
- treat vector editing as an interpretation bridge between art and pattern
- avoid building a full Illustrator clone

## 4. Validation Before Beauty

3D preview and generated imagery can make weak output look convincing. Pattern Lab should make correctness visible before it makes the garment pretty.

Product implication:

- validation gates export
- warnings and limitations are first-class
- 3D preview is tied to validation messages
- photoreal imagery is downstream, not proof

## 5. 3D As Feedback, Not Authorship

Kew's visible canvas is missing the 3D feedback loop. Pattern Lab's addition is turning confirmed intent into pattern geometry and showing a simple 3D sanity preview.

Product implication:

- first preview can be coarse
- preview must not rewrite pattern truth silently
- display seam pairing, orientation, rough ease/clearance, and obvious failures

## 6. Narrow Services, Broad Future

Optitex/CLO/Browzwear/Lectra prove the capability map: grading, fabric simulation, marker planning, tech packs, interop. Pattern Lab should not clone those editors. It should expose those pillars as narrow services when the core pattern loop is ready.

Product implication:

- grading after the base pattern is valid
- fabric simulation starts as fabric-class warnings
- marker planning starts as human-readable fabric-width layout
- tech-pack/industrial export stays later

## Pillar-To-Prototype Mapping

| Pillar | Prototype expression |
| --- | --- |
| Natural Intent | assumption review, natural-language edit commands, ambiguity questions |
| PatternGraph Contract | schema, candidate promotion, source JSON |
| Trace Bridge | uploaded sketch, editable landmarks/traces, semantic callouts |
| Validation Before Beauty | validation harness, report, export gate |
| 3D Feedback | Three.js sanity preview after pattern generation |
| Narrow Services | fabric layout report, later grading/fabric/tech-pack lanes |
