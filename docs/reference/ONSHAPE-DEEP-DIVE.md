# Onshape Deep Dive: Cloud Collaboration, PDM, PLM, MBD, And Rendering

Date: 2026-05-03

Purpose: capture Onshape as a reference architecture for future Pattern Lab collaboration, product records, lifecycle workflows, model-based manufacturing information, and high-end rendering. This is reference-lane material only. It should not change prototype 1, which remains one-garment, validation-first, human-readable pattern output.

## Product Read

Onshape is a cloud-native CAD and product-development platform whose differentiator is not only browser CAD. The deeper move is that CAD, collaboration, history, versions, release management, and product data management live in one shared system instead of being file handoffs between desktop CAD and a separate PDM vault.

For Pattern Lab, the useful analogy is:

```text
Onshape document / workspace / version / release
  -> shared product design object
  -> PDM record
  -> PLM connection
  -> MBD/PMI downstream manufacturing information
  -> render/communication views

Pattern Lab project / PatternGraph / package revision
  -> shared garment design object
  -> pattern data record
  -> future PLM/tech-pack connection
  -> sewing/manufacturing information
  -> preview/render/communication views
```

The warning is equally important: Onshape is still a professional CAD system. It proves infrastructure and lifecycle ideas, not the interaction model we want for v1.

## What Onshape Does Well

### 1. Multi-User Product Canvas

Onshape documents can be shared with users, teams, companies, or public/private access. Collaborators can work in the same document at the same time; edits appear in real time. The collaboration layer includes comments, replies, notification options, permissions, and Follow Mode, where one collaborator can follow another user's actions.

Pattern Lab implication:

- Future design projects should become shared live workspaces, not exported file folders.
- Comments should attach to semantic objects: sketch landmarks, garment parameters, seam pairs, validation warnings, pattern pieces, and package revisions.
- Follow/review mode is valuable for designer + patternmaker sessions.
- Permissions and ownership matter once projects involve designers, sample makers, contractors, and factories.

V1 status:

- Out of scope. Keep local single-user project folders, but preserve provenance and revision IDs so collaboration can land later.

### 2. Part Studio As Shared Parametric Context

Onshape's Part Studio is a design environment for creating parts, surfaces, and sketches. It can contain multiple related parts when they need shared references, but Onshape explicitly recommends not putting an entire assembly in one Part Studio for performance and maintainability. Assemblies then organize part and subassembly instances.

Onshape also supports in-context design: a part can be edited from assembly context with surrounding parts ghosted as references, and the relationship can be updated deliberately rather than every surrounding edit rewriting everything automatically.

Pattern Lab implication:

- The garment equivalent is not “one huge canvas.” It is a structured garment project with shared reference geometry and separate semantic objects.
- For one garment family, the `GarmentProgram` can act like a Part Studio: shared measurements, landmarks, parameters, panels, seam relationships, and package outputs.
- Larger collections need assembly-like relationships: garment, trim, hardware, fabric swatches, size range, tech-pack items, render assets, and launch assets.
- In-context editing maps well to garment edits: edit neckline while seeing body/avatar, sketch, pattern panels, and seam warnings in context, without letting any view silently own the pattern truth.

V1 status:

- Useful mental model for future architecture. Current scaffold already separates reusable packages from `garments/a-line-dress-tunic/`.

### 3. PDM Is Built In, Not A Separate Vault

Onshape's PDM capabilities are fully integrated into the cloud CAD platform; the official docs describe no separate PDM module. Onshape captures document history, versions, releases, and workflows inside the same environment as modeling.

Important mechanics:

- document management
- versions and history
- release management
- workflows
- where-used queries
- custom properties and metadata
- revision history and obsoletion

Pattern Lab implication:

- A future Pattern Lab project should not treat pattern files, renders, cut sheets, and comments as loose exported artifacts.
- `PatternGraph`, sketch sources, generated images, measurements, validation reports, export packages, and review comments should share a project record.
- “Latest” and “released” should be distinct. A designer can keep iterating while a specific pattern package revision is what a sample maker cut from.
- Where-used matters later: which product, style, size range, tech pack, order, or sample used this pattern revision?

V1 status:

- Keep a simple revision/provenance model in exported PatternGraph JSON. Do not build PDM yet.

### 4. Branching, Versions, History, And Release Discipline

Onshape captures the state of every tab whenever an edit is completed, across users and sessions. Versions are immutable snapshots. Documents can contain branches, one workspace per branch, many versions, and many releases. Onshape describes workspaces as sandboxes and supports compare/history workflows.

Pattern Lab implication:

- Pattern iteration wants this. Designers need to branch: “try deeper armhole,” “square neckline,” “size M only repair,” “sample-room correction,” “factory comments.”
- Validation reports should be revision-bound. A pass/fail result only applies to the exact PatternGraph revision it was generated from.
- Exported pattern packages should be immutable release objects, while the workbench can keep editing the next revision.
- Branch/merge for patterns is harder than text merge: we will need semantic merge for parameters, panels, seam relationships, annotations, and instructions.

V1 status:

- Use explicit revision IDs and immutable output folders. Branch/merge is later.

### 5. PLM Connection Through Arena

Onshape connects to Arena PLM in cloud-native workflows. The Onshape-Arena Connection syncs design data, BOMs, part numbers, metadata, neutral CAD files, PDFs, and change/release information. It connects Onshape release workflows to Arena change workflows so engineering and operations can reference the same revision.

Pattern Lab implication:

- Later product direction should include a bridge from pattern/package truth into apparel PLM or tech-pack systems.
- Garment equivalents to BOM need attention: fabric, trims, labels, hardware, thread, interfacing, optional notions, size range, colorways, supplier notes.
- The release package should know what downstream product record it belongs to.
- External collaborators should be able to review specific released artifacts without editing live working drafts.

V1 status:

- Out of scope. Preserve structured metadata that could later become tech-pack/PLM fields.

### 6. Model-Based Definition And PMI

Onshape's MBD feature embeds dimension and annotation metadata directly in the Part Studio model. Their docs frame MBD as capturing and extending product manufacturing information and model-based enterprise information for downstream use. MBD works with an Inspection table, supports tolerance-related workflows, can export MBD data to STEP for parts, and automatically attempts to validate associated MBD data when annotations or model changes invalidate references.

This is a very strong parallel for Pattern Lab.

Garment equivalent:

```text
MBD / PMI
  -> dimensions, tolerances, inspection data, annotations embedded in model

Pattern Lab sewing PMI
  -> seam allowance, grainline, notches, cut count, fold line, fabric width,
     size/measurement profile, ease assumptions, construction notes,
     validation status, scale proof, export limitations
```

Pattern Lab implication:

- `PatternGraph` should carry manufacturing information directly, not as decorative labels placed later in SVG.
- Human-readable sheets are views of the manufacturing graph.
- Validation should understand references: if a seam changes, associated labels, notches, dimensions, cut sheet entries, and assembly steps must either update or become invalid.
- A future “pattern MBD” layer could be one of Pattern Lab's defensible product concepts: garment manufacturing information embedded in the pattern object, not trapped in tech-pack PDFs.

V1 status:

- Very relevant to schema and validation. Do this in lightweight form now: manufacturing metadata lives in `PatternGraph`; SVG/PDF is a view/export.

### 7. High-End Renderer As Communication Layer

Onshape Render Studio creates photorealistic renderings from Part Studios or Assemblies. Render scenes are version-based snapshots: a version is required before importing document assets into a Render Studio scene. Onshape docs note server-side progressive rendering, and Onshape's blog describes Render Studio as cloud-native, NVIDIA Iray-powered, physically based rendering with material/lens/camera controls and no local high-end GPU requirement.

Pattern Lab implication:

- Rendering can become a review and communication surface for collections, not proof of pattern correctness.
- Version-bound renders are the key idea: a render should point to the exact PatternGraph/body/material revision that produced it.
- Material and appearance libraries matter later: fabrics, opacity, sheen, pleats, prints, trim, hardware, stitching, and decals.
- Onshape's renderer suggests a future split: fast Three.js preview for workbench feedback, high-end cloud/offline renderer for stakeholder communication.

V1 status:

- Keep Three.js preview simple. Defer high-end rendering.

## Pattern Lab Translation

### Near-Term Concepts To Borrow

- Immutable output package revisions.
- Semantic comments attached to pattern objects.
- Project-level provenance for sketches, parameters, measurements, generated images, PatternGraph, validation, export, and preview.
- Validation-linked annotations that become stale when source geometry changes.
- Version-bound previews/renders.
- Distinction between working draft, validated graph, and released pattern package.

### Later Product Systems To Build

- Multi-user project workspaces.
- Comment/review mode for designers, patternmakers, sample makers, and factories.
- PDM-like project records: revisions, releases, where-used, metadata, obsoletion.
- PLM/tech-pack bridges: materials, trims, BOM, size range, colorways, cost/supplier fields, change orders.
- Pattern MBD/PMI: sewing manufacturing information embedded in PatternGraph and surfaced in sheets, instructions, validation reports, and future machine-readable exports.
- High-end render lane for line reviews, merchandising, e-commerce mockups, and collection communication.

### What Not To Borrow For V1

- Full PDM/PLM workflows.
- Enterprise permissions.
- Formal change-order workflows.
- Multi-user real-time editing.
- High-end renderer.
- CAD-like expert UI.
- Drawing-replacement philosophy that hides human-readable instructions.

## Product Decision

Onshape reinforces the Pattern Lab direction:

**The product should make the structured garment object the live source of truth, then generate views, packages, previews, comments, and lifecycle records from that object.**

But the sequencing stays strict:

1. Build one valid `PatternGraph`.
2. Validate it.
3. Export a human-readable pattern package.
4. Add sketch/manual/natural-language control.
5. Add 3D preview as feedback.
6. Later, add project collaboration, PDM/PLM records, MBD-style manufacturing metadata, and high-end rendering.

## Source Links

- Onshape Product Data Management: https://cad.onshape.com/help/Content/Home/product_data_management.htm
- Onshape PDM feature overview: https://www.onshape.com/en/features/product-data-management
- Sharing and Collaboration: https://cad.onshape.com/help/Content/Collaboration/sharing_and_collaboration.htm
- Versions, Branching, and Merging: https://cad.onshape.com/help/Content/Primer/versions.htm
- Document Management: https://cad.onshape.com/help/Content/docmanagement.htm
- Release Management settings: https://cad.onshape.com/help/Content/Plans/enterprise_settings_release_management.htm
- Revision History and Obsoleting Parts: https://cad.onshape.com/help/Content/Release/viewing_revision_history_and_obsoleting_parts.htm
- Onshape-Arena Connection: https://www.onshape.com/en/features/onshape-arena-connection
- Connecting CAD, PDM, and PLM: https://www.onshape.com/en/blog/connecting-cad-pdm-plm
- Part Studios: https://cad.onshape.com/help/Content/PartStudio/part_studios.htm
- Modeling In Context: https://cad.onshape.com/help/Content/Assembly/modeling_in_context.htm
- Model-Based Definition: https://cad.onshape.com/help/Content/PartStudio/model_based_definition.htm
- Render Studio Basics: https://cad.onshape.com/help/Content/RenderStudio/render_studio_basics.htm
- Render Studio feature page: https://www.onshape.com/en/features/render-studio
- Render Studio / NVIDIA Iray blog: https://www.onshape.com/en/blog/announcing-render-studio-beta
