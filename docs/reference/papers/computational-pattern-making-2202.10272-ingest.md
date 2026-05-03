# Paper Ingest: Computational Pattern Making From 3D Garment Models

Paper: `Computational Pattern Making from 3D Garment Models`  
Authors: Nico Pietroni, Corentin Dumery, Raphael Guenot-Falque, Mark Liu, Teresa Vidal-Calleja, Olga Sorkine-Hornung  
arXiv: https://arxiv.org/abs/2202.10272  
Local PDF: `docs/reference/papers/computational-pattern-making-from-3d-garment-models-2202.10272.pdf`  
PDF metadata: 13 pages, arXiv v1, 2022-02-21

## One-Line Read

This paper is the best current reference for turning an existing 3D garment mesh into sewable 2D pattern panels because it explicitly adds tailoring constraints to mesh segmentation and flattening.

## Why It Matters To Garment Pattern Lab

The paper validates the project's central warning: generic UV unwrapping is not enough. It shows that a 3D-to-2D flattening method becomes patternmaking only when it accounts for garment-specific constraints:

- seam equality
- seam reflection symmetry
- darts
- grain alignment
- bounded fabric strain
- panel complexity
- human seam hints
- multi-pose deformation

This is a strong technical reference for the future `3DGarmentMesh -> PatternGraphCandidate` branch, and an immediate source of validation rules for the pattern-first prototype.

## Input And Output

Input:

- A triangle mesh representing a target 3D garment.
- Optional additional target poses of the same mesh with shared connectivity.
- Optional user sketches on the 3D surface indicating desired seams and grain alignment.
- Optional symmetry plane.

Output:

- A 2D sewing pattern made of flattened garment panels.
- Panel boundaries that can be cut and sewn.
- Darts where partial cuts are merged.
- Packed pattern pieces.

The paper does not start from a 2D fashion sketch. It assumes the 3D garment already exists.

## Pipeline

### 1. Symmetrization

If the garment is symmetric, the method can split it along the symmetry plane, process one side, then reflect the result. It can later remove unwanted seams along the symmetry plane when safe.

Product implication:

- Symmetry should be a first-class garment property.
- Center-front and center-back fold/seam decisions should be explicit in the pattern graph.

### 2. Cross-Field Construction

The method computes a smooth 4-rotational-symmetric tangent field over the mesh. The field aligns with principal curvature directions, boundaries, and user-defined seam constraints. Cuts follow this field.

Product implication:

- For a future mesh-based branch, seam generation should be guided by curvature, boundaries, and user seam hints.
- For prototype 1, we can simplify this into explicit seam rules, but keep the concept of "seam hints" in the schema.

### 3. Field-Aligned Path Tracing

The method traces:

- loops
- border-to-border paths

These paths partition the garment surface into patches. It inserts paths until patches meet the goals, then removes redundant path segments.

Product implication:

- Patch layout is not just "make islands." It is an optimization over manufacturable panels.
- The product should expose panel complexity in the validation report.

### 4. Dart Creation

After path removal, adjacent patches may be partially glued while keeping distortion below threshold. These partial cuts become darts.

Product implication:

- Darts belong in the computational representation, not just instruction text.
- A dart has geometry, symmetry, target body region, and validation.

### 5. Anisotropic Textile Parameterization

The paper models woven fabric as warp/weft yarn directions. It separates stretch along the fabric axes from shear, because woven fabric behaves differently along grain versus diagonal.

Product implication:

- Generic ARAP/LSCM/UV distortion is not enough for fabric.
- Add `TextileDeformationBudget` to the knowledge graph and eventual schema.
- Even prototype 1 should name fabric assumptions and grain direction.

### 6. Seam And Dart Reflection Symmetry

The paper adds energy terms that make paired seam curves and dart legs reflection-symmetric in 2D. This matters because fabric pieces are often sewn by placing one piece on top of the other and stitching along a matching planar curve.

Product implication:

- Validation should not only check paired seam lengths.
- It should also score whether paired seams have compatible mirrored curve shape.

### 7. Grain Alignment

The method rotates flattened patches so warp direction aligns with desired 3D directions, such as the vertical direction on the worn garment or along an arm. Bias-cut exceptions are possible.

Product implication:

- Grainline cannot be a decorative arrow added at export time.
- The graph should store grain axis, target alignment, and optional bias override.

### 8. User Controls

The paper's interactive editor mainly exposes:

- maximum number of corners per pattern piece
- maximum allowed stretch

Product implication:

- Future UI should expose these as advanced controls for mesh-derived pattern candidates.
- Prototype 1 can use them as validation targets rather than live controls.

## Requirements The Paper Establishes

### Patch Shape

Good panels are few, large, smooth, and have limited corners. The paper mentions practical pieces often around 6-8 corners and approximately orthogonal angles.

Product requirement:

- Add `panel.cornerCount`.
- Add a panel complexity warning.

### Bounded Fabric Strain

More doubly curved target shapes require more pattern pieces if fabric deformation thresholds are strict.

Product requirement:

- Pattern generation should not pretend one panel can fit every curvature.
- Future mesh path needs a max stretch/shear threshold.

### Seam Sewing Feasibility

Matching seams must have equal length and preferably reflection-symmetric 2D shape.

Product requirement:

- Validate both length and mirrored shape.

### Layout Symmetry

Symmetric garment designs should usually produce symmetric patterns.

Product requirement:

- Store intended garment symmetry.
- Validate symmetric panel pairs.

### Grain Alignment

Pattern pieces should align grain with body/world directions unless bias is intentional.

Product requirement:

- Grain alignment should be stored and validated.

### Efficiency

The method is fast enough for interactive user seam sketching on small meshes.

Product requirement:

- Future mesh-based UX should let users sketch or edit seam hints, not accept black-box output.

## Results And Evidence

The paper demonstrates:

- loose and tight garments
- human and animal body shapes
- use of multiple poses
- fabrication of a wetsuit and leggings

The fabricated examples are important because they connect algorithmic output to physical garments. The wetsuit took substantially longer because its pattern structure was more intricate; the leggings were simpler.

Product implication:

- "Sewability" should eventually be measured through physical mockups, not only simulation.
- Pattern complexity directly affects user effort.

## Limitations

The paper's limitations matter:

- Wrinkles from scans or simulations can introduce noise into the guiding field.
- The layout method is greedy, so small input changes can produce substantially different patterns.
- Distortion during final parameterization may differ from distortion during patch decomposition because seam reflection constraints enter after all patches are computed.
- The method does not include seam allowance constraints; the authors name this as future work.

Product implications:

- Any mesh-derived pattern candidate needs stability checks.
- Seam allowance remains our responsibility.
- For prototype 1, avoid claiming production readiness from 3D flattening alone.

## What To Add To Our Product

Immediate additions:

- `ValidationReport` should include seam length, reflection symmetry, dart validity, panel corner count, grain alignment, and self-intersection status.
- `PatternGraph` should store seam pairs, darts, grain axes, and material assumptions.
- `Product Plan` should keep pattern grammar first but recognize a future mesh-to-pattern lane.
- `Roadmap` should add a validation layer before 3D preview is considered meaningful.

Later additions:

- Mesh-derived pattern branch.
- User-sketched seam hints on 3D garment.
- Maximum panel-corner and maximum-stretch controls.
- Multi-pose validation.
- Fabric-specific deformation budgets.

## Product Decision

This paper does not replace the first prototype plan. It sharpens it.

Prototype 1 should still be:

```text
measurements + annotated sketch -> pattern grammar -> pattern graph -> export -> preview
```

But the validation criteria should now explicitly include sewing-aware constraints from this paper, especially seam reflection symmetry, grain alignment, dart semantics, and panel complexity.

