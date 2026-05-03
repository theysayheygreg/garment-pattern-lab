# Open / Free Tools Ingest

Sources:

- Seamly2D
- Seamly2D GitHub
- FreeSewing
- FreeSewing About
- PatternSoft
- Valentina
- Tau Meta

## Core Product Lesson

The open/free ecosystem already proves that parametric pattern drafting, measurement-driven generation, SVG/PDF export, and local-first pattern editing are feasible. Garment Pattern Lab should reuse or interoperate where possible, but its unique contribution is sketch-to-parameter inference plus validation-backed pattern generation.

## Source-Level Ingest

### FreeSewing

Observed posture:

- Open-source made-to-measure sewing patterns.
- Patterns generated from measurements.
- Parametric designs and documentation are central.
- It is not primarily a fashion-trend/publishing tool; it is a pattern generation stack.

Knowledge graph impact:

- `ParametricDesign`
- `MeasurementSet`
- `DesignOption`
- `PatternDocumentation`

Product implication:

- FreeSewing is a strong candidate for inspiration or direct reuse in the measurement-to-pattern lane.
- The sketch layer could map visual intent to FreeSewing-like design options where garment types overlap.

Research task:

- Inspect FreeSewing developer API and license.
- Determine whether a sleeveless A-line tunic can be modeled directly or via a new design.

### Seamly2D

Observed posture:

- Free/open-source pattern drafting CAD.
- Parametric pattern drafting with measurement support.
- Designer keeps detailed control over pattern construction.

Knowledge graph impact:

- `ParametricDraft`
- `MeasurementTable`
- `DraftingFormula`
- `PatternCADDocument`

Product implication:

- Seamly2D is likely an interoperability/reference target for drafting concepts, not the fastest prototype engine.

Research task:

- Inspect file format and SVG/PDF/DXF capabilities.
- Determine if generated pattern graph can export into a Seamly-compatible structure.

### Valentina

Observed posture:

- Open-source parametric pattern drafting heritage.
- Closely related historically to Seamly2D.

Knowledge graph impact:

- Same as Seamly2D: `ParametricDraft`, `MeasurementTable`, `DraftingFormula`.

Product implication:

- Useful for understanding open CAD pattern document shape and drafting formula conventions.

### PatternSoft

Observed posture:

- Local desktop app.
- Pattern repository.
- Parametric design with FreeSewing.
- Visual drawing and grading.
- SVG/PDF export.

Knowledge graph impact:

- `PatternRepository`
- `VisualPatternEditor`
- `PatternVersion`
- `SVGExport`
- `PDFExport`

Product implication:

- PatternSoft is close to the desired local-first project surface. Garment Pattern Lab can learn from its repository/editor/export posture while focusing on sketch intelligence and validation.

Research task:

- Inspect source structure and whether it can host or import generated pattern graph output.

### Tau Meta

Observed posture:

- Open-source pattern software project.
- SVG/Inkscape extension ideas.
- Formula-to-SVG pattern construction.

Knowledge graph impact:

- `SVGPatternConstruction`
- `BezierCurve`
- `ControlPoint`

Product implication:

- SVG is a credible first export format and a possible editable working surface.

## Product Graph Additions

```text
ParametricDesign -> PatternGraph
MeasurementTable -> MeasurementSet
DraftingFormula -> DraftingRuleSet
PatternGraph -> SVGExport
PatternGraph -> PDFExport
PatternGraph -> PatternRepository
PatternRepository -> PatternVersion
VisualPatternEditor -> PatternGraphRevision
```

## Integration Strategy

### Prototype 1

Use project-native JSON + SVG first.

Reason:

- Need full control over schema/validation.
- Faster than conforming to an existing CAD application's internal model.

### Prototype 1.5

Evaluate direct reuse:

- FreeSewing as parametric engine.
- PatternSoft as local UI/reference.
- Seamly2D/Valentina as export/interoperability target.

### Later

Export adapters:

- SVG/PDF: required.
- DXF/AAMA/ASTM: commercial compatibility.
- Seamly/Valentina format: optional if technically tractable.

## Open Questions

- Which open tool has the cleanest internal pattern representation?
- Can FreeSewing generate a base close enough to a sleeveless A-line tunic?
- Can PatternSoft consume external pattern JSON or SVG cleanly?
- Is Seamly2D/Valentina format stable enough to target?

