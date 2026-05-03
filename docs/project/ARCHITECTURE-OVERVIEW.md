# Architecture Overview

Garment Pattern Lab turns visual garment intent into a validated, human-readable sewing-pattern package.

The architecture is built around one constraint:

**`PatternGraph` is the manufacturing source of truth.**

Sketches, meshes, UVs, AI outputs, vector edits, and 3D previews are useful inputs or views. They are not trusted as the sewing pattern until they pass through candidate normalization, validation, correction, and export proof.

## Maintenance Policy

This document is the current architecture, not the full research archive.

As the product direction narrows, update this overview to reflect the working product shape. Preserve older explored approaches, deferred lanes, and rejected options in [Things Tried / Architecture History](../journal/THINGS-TRIED.md). Record durable product choices in [Decision Log](../journal/DECISION-LOG.md).

## System Pipeline

```text
sketch / visual intent
  -> semantic garment intent
  -> measurements + garment parameters
  -> PatternGraphCandidate
  -> validation / correction / proof
  -> PatternGraph
  -> human-readable pattern package
  -> optional 3D preview / later industrial outputs
```

Prototype 1 narrows that to:

```text
front/back sketch
  -> manual or assisted landmarks
  -> GarmentParameters
  -> first-garment drafting formulas
  -> PatternGraphCandidate
  -> validation
  -> PatternGraph
  -> SVG/PDF/cut instructions
  -> simple Three.js preview
```

## Prototype Target

The first garment is a sleeveless A-line woven dress/tunic.

That target is intentionally constrained. It avoids sleeve caps, collars, plackets, knit stretch, linings, and grading, while still exercising the important pattern concepts: measurements, ease, shoulders, armholes, neckline, side seams, hem sweep, grainline, notches, seam allowance, cut labels, and construction instructions.

## Output Lanes

### V1: Human-Readable Pattern Package

This is the prototype output priority.

The package should let a person print, cut, review, and sew:

- SVG pattern sheets
- tiled PDF or print-ready package
- cut sheet
- assembly instructions
- validation report
- source `PatternGraph` JSON
- simple 3D preview image/view

### Later: Machine-Readable Industrial Output

Machine-readable cutter and CAD files are a later lane:

- DXF/AAMA/ASTM
- cutter-ready marker files
- industrial CAD round trip
- factory production metadata
- tech pack integration

The later lane should build on the same `PatternGraph`, but it should not define prototype 1 success.

## Core Data Flow

### 1. Sketch And Intent

Inputs can be raster sketches, vector sketches, generated technical flats, or traced front/back drawings.

Early automation can be weak because manual correction is allowed. The important output is not perfect computer vision; it is usable semantic intent:

- garment family
- neckline
- shoulder opening
- armhole
- side silhouette
- hem length
- hem sweep
- center front/back
- closure hints
- dart or dartless preference

### 2. Measurements And Parameters

`MeasurementSet` records the target body. `GarmentParameters` records the editable design choices inferred from the sketch or changed by the user.

Examples:

- bust/waist/hip measurements
- shoulder width/slope approximation
- armhole depth
- garment length
- bust/waist/hip ease
- neckline depth/width
- hem sweep
- seam allowance
- finish mode

### 3. PatternGraphCandidate

Any generated, imported, AI-derived, mesh-derived, or user-edited output enters as `PatternGraphCandidate`.

Candidates are allowed to be incomplete or untrusted. They must not export directly.

Candidate sources include:

- first-garment drafting formulas
- imported SVG/DXF/pattern diagrams
- GarmentCode-style pattern programs
- mesh-to-pattern research output
- user-edited browser flats
- AI-generated sketch/pattern candidates

### 4. Validation And Promotion

The validation gate promotes a candidate into a trusted `PatternGraph`.

Checks include:

- canonical units in millimeters
- scale proof
- closed panels
- non-self-intersecting cut lines
- seam-line and cut-line separation
- seam allowance presence
- paired seam length checks
- notch and label checks
- grainline and fold-line checks
- cut counts
- head-entry / closure warnings
- SVG export conformance
- round-trip checks
- explicit human-review warnings

This is the boundary that keeps the project from producing plausible-looking but useless sewing shapes.

### 5. PatternGraph

`PatternGraph` is the trusted sewing pattern.

It includes:

- panels
- seam lines
- cut lines
- ordered edges
- seam pairs
- darts, pleats, or tucks
- grainlines
- fold lines
- notches
- labels
- cut counts
- allowances
- construction steps
- validation reports
- export provenance

The graph can later drive SVG/PDF, 3D preview, marker planning, DXF/AAMA/ASTM, grading, simulation, or machine cutting.

## Pattern Drawing Package

The v1 human-readable package should borrow from CAD-to-technical-drawing workflows. A useful craft document is more than exported geometry: it has views, dimensions, callouts, scale proof, title-block metadata, page/tile layout, notes, and readable line styles.

Add this downstream architecture component:

```text
PatternGraph
  -> PatternDrawingModel
  -> PatternSheetComposer
  -> HumanReadablePatternPackage
```

`PatternDrawingModel` should attach dimensions and annotations to stable `PatternGraph` ids such as panels, seams, darts, grainlines, fold lines, and notches. `PatternSheetComposer` should own page layout, tiling, title blocks, scale markers, validation callouts, and SVG/PDF export.

## Designer Editing Lane

The designer editing lane has two scopes.

### V1: Parameter-Backed Direct Manipulation

The first editor should let a designer change concrete garment features in the sketch or vector interpretation:

- shoulder opening
- armhole shape
- neckline
- side silhouette
- hem length
- hem sweep

Every gesture maps to explicit `GarmentParameters`, regenerates `PatternGraphCandidate`, updates the pattern/model preview, and runs validation.

### Later: Full Layered Creative Editor

The larger editor can borrow from Graphite and Substance-style workflows:

- vector layers
- masks
- material regions
- fabrics
- stitches
- trims
- decals
- prints
- appliques
- PBR channels
- projection tools
- node/layer history

Those edits may inspire pattern changes, but they do not become manufacturing truth until promoted into `PatternGraph` and validated.

## Validation Philosophy

Validation is product-critical. The user-facing 3D view can make weak output look convincing, so validation must be upstream of trust.

The system should distinguish:

- hard errors that block export
- warnings that need human review
- limitations that explain what the prototype does not know
- later-machine-output failures that do not block v1 human-readable output

## Browser And Geometry Stack

The current recommended prototype stack is browser-first:

- TypeScript app runtime
- Three.js for 3D preview
- SVG/Canvas overlay for sketch annotation
- `@flatten-js/core` for first geometry primitives
- `polygon-clipping` or `martinez-polygon-clipping` for polygon booleans
- `earcut` for preview triangulation
- `svg-pathdata` / `svgson` for SVG fixture tooling

Upgrade path:

- Clipper2 / Clipper2-WASM for more robust offsets and polygon operations
- Rust/WASM with `kurbo`, `lyon`, `usvg`, or `resvg`
- WebGPU for acceleration after correctness is proven

The product should define `GeometryKernel` and `PatternKernel` interfaces before committing deeply to any one library.

## Tool And Prior-Art Roles

### Reuse Or Prototype Against

- FreeSewing: JavaScript parametric pattern generation reference.
- OpenPattern: formula-driven drafting reference.
- GarmentCode: pattern-program representation reference.
- GarmentCodeData: paired synthetic pattern/3D data.
- Three.js: live browser preview.
- `@flatten-js/core`, `polygon-clipping`, `earcut`: first geometry candidates.

### Reference, Not Source Of Truth

- Seamly2D / Valentina: parametric CAD workflow and file semantics.
- Graphite: future vector/layer/node editor inspiration.
- Blender: headless preview, UV/projection, and render experiments.
- Substance 3D Painter: layer/projection/PBR editing mental model.
- CLO / Marvelous / Optitex / Browzwear / Lectra: commercial workflow expectations.
- DXF/AAMA/ASTM: later industrial exchange target.

## Corpus And Example Strategy

Every visual or pattern item needs a truth level and license profile.

Truth levels:

- `visual-only`
- `semantic-reviewed`
- `pattern-reference`
- `pattern-truth`
- `round-trip-fixture`

Good source leads:

- FreeSewing/OpenPattern generated fixtures
- GarmentCodeData
- 2021 Zenodo garment-pattern dataset
- LACMA Pattern Project with per-item rights review
- Met and Smithsonian open access for visual-only references
- GPT Image 2 for generated technical flats and croquis sketches
- TripoSR/SPAR3D/Hunyuan/TRELLIS for image-to-3D comparison

## Near-Term Roadmap

The next milestone is to close RR1-RR3 as one package:

1. First-garment drafting formulas.
2. `PatternGraph` schema.
3. Sewing-aware validation checklist and fixtures.

Once those exist, implementation can start without guessing what a pattern is.
