# Designer Sketch-To-Model Editing

## Thesis

The product needs a designer-facing editing loop between sketch interpretation and pattern generation:

```text
raster sketch
  -> vector sketch layer
  -> semantic/style/material layers
  -> live garment model preview
  -> edit classification
  -> PatternGraphCandidate or visual/material preview
```

This should feel closer to a lightweight garment-aware Substance Painter than an old UV editor. A designer should be able to edit a sketch, style line, color region, trim mark, print, or material zone and see the result represented on the garment model. But the manufacturing boundary remains firm: projected visuals and material previews do not become sewable pattern geometry until they are promoted through candidate validation.

## Product Role

This lane serves four user needs:

- Clean up and reinterpret a pencil, Procreate, or generated garment sketch.
- Edit garment intent as vector curves and regions instead of only text parameters.
- See sketch/style/material edits on a live 3D garment model.
- Decide which edits affect pattern structure versus only visual presentation.

## Editing Layers

`RasterSketchLayer`:

- source image
- cleanup edits
- opacity/visibility
- crop/scale/rotation
- source provenance

`VectorSketchLayer`:

- silhouette curves
- neckline/armhole/hem curves
- seam/style-line hints
- closure, pocket, trim, strap, belt, or print marks
- semantic tags and confidence

`SurfaceProjectionLayer`:

- projection mode: UV, panel-local, view projection, decal, or surface anchor
- target surface: avatar, garment preview mesh, pattern panel, or generated 3D mesh
- distortion/occlusion warnings
- seam-crossing warnings

`MaterialPreviewLayer`:

- base color
- fabric texture
- roughness
- normal/bump
- opacity
- trim/decal/stitch masks

`PatternImpactLayer`:

- pattern-affecting style line
- seam candidate
- panel split candidate
- dart/pleat/closure candidate
- validation status

## Edit Classification

Every edit should be classified before it can affect output:

- `visual-only`: useful for presentation or ideation only.
- `semantic-intent`: updates `SketchIntent` or `GarmentParameters`.
- `material-preview`: updates PBR/material preview, texture, color, print, or trim.
- `pattern-candidate`: creates or modifies a `PatternGraphCandidate`.
- `pattern-revision`: updates a validated `PatternGraph`.

This prevents a projected line from silently becoming a seam, and prevents a color/material zone from being mistaken for a cut panel.

## View Model

The minimum useful workbench has four linked panes:

- source sketch or generated reference
- vector/semantic sketch editor
- live garment model preview
- validation/projection feedback

The model preview can start as a static assembled shell. It does not need full cloth simulation to be valuable. It only needs to answer: "When I move this line or region, where does the design intent land on the garment?"

## PBR-Style Preview Scope

Prototype 1 should not implement a full material authoring suite. It should borrow the core interaction ideas:

- layer stack
- masks
- decals/projections
- texture/material channels
- live viewport feedback
- reprojection warnings when geometry changes

Minimum useful channels:

- base color
- fabric texture image
- roughness preset
- normal/bump placeholder
- opacity/mask
- decal/trim/stitch mask

## Validation And Feedback

`ProjectionFeedbackReport` should include:

- projection mode
- target layer
- target panel or surface
- distortion estimate
- seam crossing status
- hidden/backface ambiguity
- UV stretch or missing UV warning
- edit classification
- whether validation is required before export

Pattern-affecting edits must become `PatternGraphCandidate` changes and pass the same export gate as generated/imported candidates.

## Prototype Spike

The first spike should be deliberately small:

1. Load a simple front/back sketch.
2. Trace or import three vector curves: silhouette, neckline, and a style/decal line.
3. Show those curves on a simple 3D tunic preview by panel-local projection.
4. Let the user move one curve in 2D.
5. Update the model preview.
6. Classify the edit as visual-only, semantic intent, material preview, or pattern candidate.
7. Emit a `ProjectionFeedbackReport`.

## Open Questions

- Should this editor be built inside the browser prototype or prototyped first in Blender?
- Can Graphite's vector model help here, or is it only a reference?
- Should panel-local projection come before UV projection?
- How much of the PBR preview can be represented with Three.js materials before needing a deeper texture pipeline?
- How do we represent stitching, trim, appliques, and prints differently from cut/seam geometry?

## References

- Blender Texture Paint documents the old but still useful split between editing an image/UV texture and painting directly in the 3D viewport through UVs: https://docs.blender.org/manual/en/4.1/sculpt_paint/texture_paint/introduction.html
- Adobe Substance 3D Painter documents modern painting/projection workflows for 3D meshes: https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/painting/painting
- Substance 3D Painter UV Reprojection highlights why projection/mask workflows need robustness when meshes or texture resolution change: https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/features/uv-reprojection
