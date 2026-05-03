# Research Roadmap Execution Pass

Date: 2026-05-03

This pass starts turning the thirteen roadmap lanes into dependency decisions, prior-art leads, and example/data collection needs.

## Current Read

The project should not start with arbitrary sketch-to-pattern automation. The fastest honest prototype path is:

```text
first-garment drafting rules
  -> PatternGraph schema
  -> validation fixtures
  -> SVG semantic export
  -> simple 3D preview
  -> designer edit loop for a few garment parameters
```

AI sketch generation, image-to-3D, full vector editing, material/PBR layers, marker optimization, and commercial CAD interop remain important, but they should feed this spine.

## Cross-Lane Decision

The first six roadmap items should be treated as one build spine:

```text
RR1 drafting formulas
  -> RR2 PatternGraph schema
  -> RR3 validation gate
  -> RR4 GeometryKernel
  -> RR5 SVG round trip
  -> RR6 marker planner
```

The strongest architecture decision from this pass is to **build the garment truth layer ourselves and reuse engines around it**. Existing systems are valuable, but none should become the source of truth:

- FreeSewing is a strong JS/browser parametric-pattern reference.
- GarmentCode and GarmentCodeData are strong representation and dataset references.
- OpenPattern is a strong formula-driven drafting reference.
- Paper.js, `@flatten-js/core`, Clipper2, `polygon-clipping`, and `earcut` can sit behind `GeometryKernel`.
- Three.js can own the live model preview.
- Blender, Graphite, Substance, CLO, Seamly2D, and DXF/AAMA/ASTM are prior art and interop targets.

## Dependency Classes

### Reuse Candidates

These are likely worth installing, reading, or prototyping against:

- FreeSewing core and developer docs for made-to-measure parametric pattern generation in JavaScript.
- OpenPattern for formula-driven pattern drafting concepts and reference output.
- GarmentCode / GarmentCodeData for pattern-program representation, synthetic paired patterns, and 3D drape examples.
- `@flatten-js/core` for first TypeScript geometry primitives and intersections.
- `polygon-clipping` or `martinez-polygon-clipping` for polygon booleans after curve flattening.
- `earcut` for fast preview triangulation.
- Paper.js for early browser vector-path operations and interactive curve editing reference.
- Clipper2 or Clipper2-WASM for robust polygon offsetting, clipping, and triangulation if JS geometry breaks.
- libnest2d and Deepnest/SVGnest lineage for marker/nesting inspiration.
- Three.js for live model preview and eventually material preview.
- Blender Python as a headless preview/render/projection benchmark, not the primary product runtime.
- `usvg`/`resvg` for later SVG parsing/normalization/verifier experiments.
- `ezdxf` for later DXF fixtures and inspection scripts.
- TripoSR as the legally clean image-to-3D baseline.
- SPAR3D as the first quality image-to-3D candidate.
- Hunyuan3D-2 as an isolated comparison worker because of license restrictions.

### Reference-Only Prior Art

These should shape requirements but probably not become core dependencies:

- CLO, Marvelous Designer, Optitex, Browzwear, Lectra, and Gerber for commercial workflow expectations.
- Substance 3D Painter for layer/mask/projection/PBR mental model.
- Blender Texture Paint for the old UV/3D paint split and reprojection limitations.
- Seamly2D/Valentina for parametric CAD file concepts and measurement/formula workflow.
- Illustrator/Inkscape for SVG editability expectations.
- Graphite for nondestructive vector/layer/node UX and possible future Rust crate audit.
- Met Open Access and Smithsonian Open Access for lawful visual-only garment references.
- CoPA for taxonomy/metadata research, not reusable image ingestion.

### Build Ourselves

The product likely needs to own these directly:

- `PatternGraph` schema.
- candidate-to-export gate.
- validation report taxonomy.
- SVG semantic profile.
- visual corpus truth/licensing schema.
- designer edit classification.
- v1 sketch-edit-to-parameter map.
- first-garment drafting formulas.
- simple marker planner before optimized nesting.
- golden `PatternGraph` fixtures.
- deliberately bad validation fixtures.
- semantic export round-trip fixtures.

## Highest-Risk Knowledge Gaps

1. Exact drafting formulas for the first sleeveless A-line woven tunic.
2. Real pattern examples with lawful geometry/reference use.
3. Robust offset/curve operations in a browser stack.
4. Reliable SVG semantic round trip after editing in external tools.
5. Clear distinction between visual style edits and pattern-affecting edits.
6. Commercial DXF/AAMA/ASTM semantic mapping.
7. Whether image-to-3D outputs are useful enough for seam hints or only previews.
8. License constraints around museum images, commercial pattern PDFs, generated pattern outputs, and model outputs.
9. Head-entry/pullover closure rules for a sleeveless tunic.
10. Patternmaker-approved tolerances for seam-walk mismatch, notch placement, and intentional ease.

## First Dependency Recommendations

Prototype 1 should start with:

- `@flatten-js/core` as the first TypeScript geometry backend.
- `polygon-clipping` or `martinez-polygon-clipping` for polygon boolean tests.
- `earcut` for preview triangulation.
- `svg-pathdata` and/or `svgson` for SVG round-trip fixture tooling.
- Three.js for live model preview.
- FreeSewing as an architectural/reference dependency, not source of truth.

Do not put these on the critical path yet:

- libnest2d: excellent NFP/nesting prior art, but LGPL/build complexity and missing garment rules make it a later optional engine.
- Seamly2D/Valentina/Patro code: useful reference and interop targets, but GPL/AGPL implications make direct embedding a product decision.
- Hunyuan3D-2: useful quality challenger, but license restrictions argue for isolated evaluation only.
- Graphite fork: too large a product surface before `PatternGraph` exists.

## First Example Recommendations

Create a tiny fixture family instead of collecting random patterns:

- `aline-tunic-m.pattern.json`
- raw generated semantic SVG
- Inkscape-saved semantic SVG
- Graphite/browser-edited semantic SVG
- invalid side-seam mismatch fixture
- invalid missing-grainline fixture
- invalid self-intersecting cutline fixture
- marker valid-on-1420mm-fabric fixture
- marker too-narrow-fabric fixture
- designer edit fixture: shoulder opening, armhole depth, hem length, hem sweep

The first 20-item visual/pattern corpus should be:

- 5 `pattern-truth` or `round-trip-fixture` items across the target garment families.
- 5 `pattern-reference` items with license-safe sources.
- 5 GPT Image 2 technical flats.
- 5 GPT Image 2 croquis/on-body sketches.

## Immediate Next Docs

- `docs/project/FIRST-GARMENT-DRAFTING.md`
- `docs/project/PATTERN-SCHEMA.md`
- `docs/project/PATTERN-VALIDATION-CHECKLIST.md`
- `docs/project/TECH-STACK-DECISION.md`
- `docs/project/SVG-SEMANTIC-PROFILE.md`
- `docs/project/MARKER-PLANNER.md`
- `docs/project/VISUAL-CORPUS-SCHEMA.md`
- `docs/reference/PATTERN-REFERENCE-CORPUS.md`
- `docs/research/geometry-kernel-spike.md`
- `docs/research/designer-sketch-projection-spike.md`

## Source Leads Started

- FreeSewing core: https://www.npmjs.com/package/@freesewing/core
- FreeSewing developer docs: https://freesewing.dev/
- OpenPattern docs: https://openpattern.readthedocs.io/
- GarmentCode repo: https://github.com/maria-korosteleva/GarmentCode
- Garment Pattern Generator template spec: https://raw.githubusercontent.com/maria-korosteleva/Garment-Pattern-Generator/master/docs/template_spec_with_comments.json
- LACMA Pattern Project: https://www.lacma.org/patternproject
- LACMA Terms: https://www.lacma.org/about/contact-us/terms-use
- GarmentCodeData project: https://igl.ethz.ch/projects/GarmentCodeData/
- 2021 3D Garments + Sewing Patterns dataset: https://zenodo.org/records/5267549
- Met Open Access: https://www.metmuseum.org/about-the-met/policies-and-documents/open-access
- Smithsonian Open Access: https://www.si.edu/OpenAccess
- Clipper2 docs: https://angusj.com/clipper2/Docs/Overview.htm
- `@flatten-js/core`: https://github.com/alexbol99/flatten-js
- `polygon-clipping`: https://www.npmjs.com/package/polygon-clipping
- `earcut`: https://github.com/mapbox/earcut
- Paper.js path docs: https://paperjs.org/reference/path/
- libnest2d: https://github.com/tamasmeszaros/libnest2d
- Deepnest Next: https://github.com/deepnest-next/deepnest
- Graphite: https://github.com/GraphiteEditor/Graphite
- CLO DXF import/export: https://support.clo3d.com/hc/en-us/articles/115000493067-2D-Pattern-DXF-Import-Export
- ASTM D6673: https://store.astm.org/d6673-04.html
- Blender Texture Paint: https://docs.blender.org/manual/en/4.1/sculpt_paint/texture_paint/introduction.html
- Substance 3D Painter painting: https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/painting/painting
- Substance UV Reprojection: https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/features/uv-reprojection
- TripoSR: https://github.com/VAST-AI-Research/TripoSR
- SPAR3D: https://github.com/Stability-AI/stable-point-aware-3d
- Hunyuan3D-2: https://github.com/Tencent-Hunyuan/Hunyuan3D-2
- TRELLIS.2: https://github.com/microsoft/TRELLIS.2
