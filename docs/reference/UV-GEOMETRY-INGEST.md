# UV / Geometry Ingest

Sources:

- Blender UV Tools
- Blender UV docs index
- Maya Auto Seams
- Unreal Engine UV Channels
- Unity ProBuilder UV Editor
- Unity Asset Transformer SDK UV Pipeline

## Core Product Lesson

UV systems are mature at mapping 3D surfaces into 2D spaces, but they optimize for rendering, baking, and texture workflows. Garment Pattern Lab can borrow geometry ideas, but must add sewing semantics.

## Source-Level Ingest

### Blender UV Tools

Relevant concepts:

- Mark seams.
- Unwrap selected mesh faces.
- Angle Based Flattening.
- Least Squares Conformal Mapping.
- Pack islands.
- Export UV layout.

Knowledge graph impact:

- `GeometrySeam`
- `UVIsland`
- `ParameterizationMethod`
- `IslandPacking`

Product implication:

- These concepts are useful for preview/mesh research, but `UVIsland` is not equal to `Panel`.

### Maya Auto Seams

Relevant concepts:

- Automatic seam selection.
- UV shells.
- UV editor/toolkit workflow.

Knowledge graph impact:

- `AutoSeamCandidate`
- `UVShell`

Product implication:

- Auto seam selection can inspire future mesh-derived pattern generation, but seam selection must be constrained by sewing and garment construction rules.

### Unreal UV Channels

Relevant concepts:

- UV channels map mesh vertices to 2D texture space.
- Material UVs may overlap.
- Lightmap UVs require non-overlap and 0-1 bounds.
- Engines can maintain multiple UV channels.

Knowledge graph impact:

- `UVChannel`
- `TextureUV`
- `LightmapUV`
- `NonOverlapConstraint`

Product implication:

- A garment pattern resembles lightmap UVs more than material UVs in the sense that overlaps are usually not acceptable for output layout, but garment patterns need far more semantics.

### Unity ProBuilder UV Editor

Relevant concepts:

- Manual UV editing.
- UV channels.
- Auto texturing vs manual UV.
- Render UV templates.

Knowledge graph impact:

- `ManualUVEdit`
- `UVTemplate`

Product implication:

- Manual correction UI is normal in geometry tools. Garment Pattern Lab should allow manual landmark/seam correction rather than hiding uncertainty.

### Unity Asset Transformer UV Pipeline

Relevant concepts:

- Automatic UV creation.
- Packing.
- Correspondence between texels and mesh.
- UV pipeline functions.

Knowledge graph impact:

- `AutomaticParameterization`
- `PackingConstraint`
- `TexelCorrespondence`

Product implication:

- Parameterization, packing, and correspondence are reusable ideas. Manufacturing metadata remains separate.

## Product Graph Additions

```text
3DGarmentMesh -> GeometrySeam
GeometrySeam -> UVIsland
UVIsland -> PatternGraphCandidate
ParameterizationMethod -> UVIsland
IslandPacking -> SVGExport
AutoSeamCandidate -> SeamHint
UVChannel -> PreviewTexture
```

## Boundary Rules

### UVIsland Is Not Panel

A UV island becomes a panel candidate only after:

- edge boundaries are semantic
- seam pairs are known
- panel has grainline
- seam allowance can be added
- notches and labels are assigned
- construction role is known
- validation passes

### Texture Seam Is Not Sewing Seam

A texture seam can hide visual distortion. A sewing seam changes construction, labor, strength, comfort, and visual design.

### Packing Is Not Marker Making

UV packing optimizes texture space. Marker making optimizes fabric usage under grain direction, cut counts, fabric width, repeats, naps, and production constraints.

## Roadmap Impact

Keep geometry tooling in two roles:

- first prototype: SVG/path geometry, curve offsetting, validation
- later mesh branch: parameterization, seam candidates, island conversion

