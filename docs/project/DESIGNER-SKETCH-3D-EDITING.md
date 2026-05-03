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

This should start much smaller than a full vector or PBR authoring suite. V1 is a sketch-parameter editing loop: a designer changes the current sketch or vector interpretation in ways that map cleanly to garment parameters, then sees the model and pattern update. Examples: widen or narrow the shoulder opening, deepen the armhole, lengthen the hem, change hem sweep, raise/lower the neckline, adjust side silhouette, or move a style line.

The larger version can grow toward a Graphite/Substance-style editor with layers, masks, materials, stitch/trim/fabric zones, decals, and projection tools. But the manufacturing boundary remains firm: projected visuals and material previews do not become sewable pattern geometry until they are promoted through candidate validation.

## Product Role

This lane serves four user needs:

- Clean up and reinterpret a pencil, Procreate, or generated garment sketch.
- Edit garment intent as curves/handles instead of only text parameters.
- See sketch/style/material edits on a live 3D garment model.
- Decide which edits affect pattern structure versus only visual presentation.

## V1 Editing Scope

V1 should prioritize edits that are easy to explain and can regenerate the first garment pattern:

- shoulder opening width
- shoulder slope/strap width
- neckline depth and width
- armhole depth and shape
- garment length / hem length
- hem sweep / A-line flare
- side seam silhouette
- waist/hip ease impression
- center-front or center-back length balance
- simple style line or trim line as visual/semantic intent

These are `semantic-intent` edits first. They update `SketchIntent` and `GarmentParameters`, then regenerate `PatternGraphCandidate`, model preview, and validation. They should be controlled by direct manipulation on the sketch/vector layer plus numeric readouts where useful.

V1 should avoid pretending to be a full vector editor. It does not need arbitrary bezier layer compositing, boolean shape operations, fabric libraries, stitch brushes, paint blending, or texture baking.

## Later Full Editor Scope

The larger editor can become a garment-specific creative surface:

- layered vector editing similar to Graphite
- separate layers for fabric zones, trims, stitches, prints, appliques, embroidery, and annotations
- masks and layer groups
- symmetry/mirroring
- decal and projection gizmos
- PBR material channels
- texture sets or garment panel material regions
- brush tools and pressure input
- versioned design explorations

That is valuable, but it should come after v1 proves the parameter-edit loop.

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

## Edit-To-Parameter Mapping

The first implementation should map sketch edits through explicit parameter operations:

| Edit | Primary target | Pattern impact |
| --- | --- | --- |
| Move shoulder opening inward/outward | `GarmentParameters.shoulderWidth`, `neckWidth`, `strapWidth` | Regenerate shoulder seam, neckline, armhole. |
| Deepen/raise armhole | `GarmentParameters.armholeDepth`, `armholeShape` | Regenerate armhole curve and finishing length. |
| Lengthen/shorten hem | `GarmentParameters.garmentLength` | Move hem line, update side seam and fabric consumption. |
| Increase/decrease hem sweep | `GarmentParameters.hemSweep`, `flareAmount` | Regenerate side seam angle and hem length. |
| Change neckline | `GarmentParameters.neckDepth`, `neckWidth`, `neckShape` | Regenerate neckline and facing/binding requirement. |
| Adjust side silhouette | `GarmentParameters.bustEase`, `waistEase`, `hipEase`, `sideCurve` | Regenerate side seam and fit validation. |
| Add visual trim/style line | `SketchIntent.styleLines` or `MaterialPreviewLayer` | Visual or semantic until promoted. |

The important behavior: the user moves something visually, but the system records the underlying parameter change and validates the resulting pattern.

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

The first spike should be deliberately small and parameter-led:

1. Load a simple front/back sketch.
2. Trace or import key editable curves: shoulder opening, neckline, armhole, side seam, and hem.
3. Let the user drag one handle, such as shoulder opening or hem length.
4. Convert the gesture into an explicit `GarmentParameters` change.
5. Regenerate `PatternGraphCandidate`.
6. Update the model preview and pattern flats.
7. Run validation and emit both `ProjectionFeedbackReport` and `ValidationReport`.

The second spike can add style/material layers:

1. Add a trim/style line.
2. Project it onto the tunic preview.
3. Classify it as visual-only, semantic-intent, material-preview, or pattern-candidate.
4. Warn if it crosses seams, distorts badly, or implies a panel split.

## Open Questions

- Should this editor be built inside the browser prototype or prototyped first in Blender?
- Can Graphite's vector model help here, or is it only a reference?
- Should panel-local projection come before UV projection?
- Which v1 edit handles should ship first: shoulder opening, armhole, neckline, hem length, hem sweep, or side silhouette?
- How do we keep direct manipulation and numeric garment parameters synchronized?
- How much of the PBR preview can be represented with Three.js materials before needing a deeper texture pipeline?
- How do we represent stitching, trim, appliques, and prints differently from cut/seam geometry?

## References

- Blender Texture Paint documents the old but still useful split between editing an image/UV texture and painting directly in the 3D viewport through UVs: https://docs.blender.org/manual/en/4.1/sculpt_paint/texture_paint/introduction.html
- Adobe Substance 3D Painter documents modern painting/projection workflows for 3D meshes: https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/painting/painting
- Substance 3D Painter UV Reprojection highlights why projection/mask workflows need robustness when meshes or texture resolution change: https://experienceleague.adobe.com/en/docs/substance-3d-painter/using/features/uv-reprojection
