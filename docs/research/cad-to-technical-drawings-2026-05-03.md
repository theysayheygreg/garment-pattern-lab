# CAD To Technical Drawings Reference Pass

Date: 2026-05-03

This note captures a useful adjacent discipline: CAD systems routinely turn model geometry into printable technical drawing packages for machinists, fabricators, inspectors, and craftspeople.

The parallel for Garment Pattern Lab is strong. A validated pattern is not enough by itself. The product also needs a sheet-composition layer that turns `PatternGraph` into a readable, inspectable, printable craft document.

## Core Analogy

```text
CAD model
  -> drawing views
  -> dimensions / tolerances / annotations
  -> sheets / title block / notes
  -> printable technical drawing package
  -> craftsperson or machine shop
```

Garment analog:

```text
PatternGraph
  -> pattern views / panel sheets / optional 3D reference view
  -> dimensions / notches / grainlines / seam allowance / labels
  -> tiled sheets / title block / cutting notes / assembly notes
  -> human-readable pattern package
  -> sewer, patternmaker, or sample room
```

The key lesson: the printable package is a semantic product surface, not just a file export.

## Relevant CAD Concepts

### Drawing Views

CAD drawings usually organize information into multiple views:

- orthographic front/top/side views
- projected views
- section views
- detail views
- isometric reference views
- exploded or assembly views

For garments, the equivalent views are:

- full panel views
- detail views for neckline, armhole, dart, closure, pocket, or facing
- marker/fabric layout view
- tiled print-page view
- 3D reference view on avatar
- optional construction sequence views

### Hidden-Line Removal And Projection

CAD drawing generation depends on reliable projection from 3D to 2D. Open CASCADE's hidden-line removal component is a good example: it computes visible and hidden characteristic lines for a chosen projection, with exact and polygonal algorithms.

Garment relevance:

- 3D preview views should not be screenshots only; they can produce clean line-art references.
- Pattern output needs a similar distinction between visible view geometry and manufacturing geometry.
- Section/detail views may be useful for closures, folded edges, bindings, and layered construction.

### Dimensions And Annotations

Technical drawings are not complete until dimensions, tolerances, callouts, and notes are placed legibly.

Garment analog:

- seam lengths
- finished garment measurements
- hem allowance
- seam allowance
- dart intake and dart leg lengths
- notch positions
- cut count
- fold-line callouts
- grainline direction
- fabric width and consumption estimate
- warning notes from validation

The important product lesson is that annotation layout should be generated from semantic entities. A dimension should attach to an edge, seam, dart, or panel role, not just to arbitrary SVG coordinates.

### Page Templates And Title Blocks

CAD drawing sheets usually include sheet size, scale, revision, material, projection standard, drawing number, title, author, date, and notes.

Garment analog:

- pattern name
- garment type and variant
- body measurement set or size
- fabric type assumptions
- seam allowance profile
- print scale proof
- revision id
- validation status
- page number and tile coordinates
- license/source provenance if generated from references
- known limitations

### Standards Profiles

Mechanical drawing uses standards such as ASME Y14 and ISO technical drawing standards to make drawings interoperable and readable. We do not need to implement mechanical GD&T, but the concept of a standards/profile layer is directly useful.

Garment analog:

- `PatternSheetProfile`
- line styles for cut, seam, fold, grain, dart, notch, construction, and annotation lines
- required labels and scale markers
- allowed units and page sizes
- validation checklist for print readiness
- source metadata and revision fields

## Open Source And Commercial Prior Art

### FreeCAD TechDraw

FreeCAD's TechDraw Workbench turns 3D model geometry into technical drawing pages with views, projection groups, dimensions, templates, and exportable sheets.

Useful parallels:

- drawing pages as first-class document objects
- views generated from model geometry
- projection groups for related views
- dimensions linked to source geometry
- SVG templates/title blocks
- scripting/API surface for automated drawing generation

Risk:

- dimension references can be fragile when source geometry changes.
- imported meshes are weaker inputs than proper CAD solids.

Garment implication:

`PatternSheetComposer` should attach dimensions and labels to stable `PatternGraph` ids, not anonymous projected geometry.

### Open CASCADE

Open CASCADE is relevant for exact geometry, B-rep processing, and hidden-line removal. It is not the likely browser prototype core, but it is a strong reference for projection and drawing extraction.

Useful parallels:

- exact vs polygonal drawing algorithms
- projection as an explicit computation
- hidden/visible line classification
- drawing extraction from model shape

Garment implication:

If Blender or Three.js preview views become part of the package, we should generate view metadata and line-art layers rather than rely on arbitrary screenshots.

### OpenSCAD Projection

OpenSCAD can project 3D geometry into 2D output such as DXF. This is a minimal but useful example of model-to-2D extraction.

Useful parallel:

- projection can be a deliberate export operation, not just a viewport.

Garment implication:

The pattern package can include derived views, but those views must remain downstream of `PatternGraph`.

### CAD Standards

ASME Y14 and ISO 128/related standards are the most important conceptual references, even if they are not garment standards.

Useful parallels:

- drawing practices define communication, not just geometry.
- conventions make drawings readable across tools and shops.
- title blocks, line styles, dimensions, tolerances, and notes are part of the product.

Garment implication:

Garment Pattern Lab should define its own lightweight pattern drawing standard before exporting many file types.

## Proposed Product Addition

Add a new architecture component:

```text
PatternGraph
  -> PatternDrawingModel
  -> PatternSheetComposer
  -> HumanReadablePatternPackage
```

### PatternDrawingModel

A semantic drawing representation derived from `PatternGraph`.

Likely fields:

- sheet views
- panel view placements
- detail views
- annotation anchors
- dimensions
- labels
- construction notes
- title block data
- scale markers
- validation callouts
- print/tile metadata

### PatternSheetComposer

The layout engine that places pattern views, labels, dimensions, notes, title block, scale proof, and optional 3D reference views onto printable sheets.

Responsibilities:

- choose sheet size and scale
- tile oversize panels across pages
- place title block and revision metadata
- place dimensions and callouts without collisions
- draw line types consistently
- include validation warnings and known limitations
- export SVG/PDF
- run print-readiness checks

### PatternSheetProfile

A standards-like style and semantics profile for human-readable pattern output.

Responsibilities:

- line styles
- page sizes
- units
- title-block fields
- required labels
- scale-proof requirements
- annotation rules
- warning/error display rules

## First Prototype Implications

Prototype 1 should not merely export panel SVG paths.

It should produce a small technical pattern package:

1. Cover/title sheet with garment name, measurements, units, scale proof, seam allowance, revision, and validation status.
2. Pattern-piece sheets with labels, grainlines, fold lines, notches, seam allowance, cut counts, and scale square.
3. Optional marker/fabric-width layout sheet.
4. Cut sheet with panel list and fabric assumptions.
5. Simple construction guide with ordered steps.
6. Validation report with hard errors/warnings and reviewed limitations.

## Research Questions Added

- Which garment-specific line-style conventions should be mandatory in `PatternSheetProfile`?
- Which dimensions are useful to a sewer and which clutter the pattern?
- How should annotation collision avoidance work for curved pattern pieces?
- Should the 3D reference view be generated as raster preview, vector line art, or both?
- Can FreeCAD TechDraw's page/template object model inspire our sheet schema?
- Can Open CASCADE HLR concepts inspire a Three.js/Blender line-art export for model previews?
- What fields belong in a garment title block for prototype 1?

## References

- FreeCAD TechDraw Workbench documentation: https://github.com/FreeCAD/FreeCAD-documentation/blob/main/wiki/TechDraw_Workbench.md
- FreeCAD TechDraw API examples: https://reqrefusion.github.io/FreeCAD-Documentation-html/wiki/TechDraw_API.html
- Open CASCADE hidden-line removal documentation: https://dev.opencascade.org/doc/occt-7.6.0/refman/html/_h_l_r_algo_8hxx.html
- OpenSCAD 3D to 2D projection: https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/3D_to_2D_Projection
- ASME Y14 standards overview: https://www.asme.org/codes-standards/y14-standards
- ISO 128 overview: https://en.wikipedia.org/wiki/ISO_128
