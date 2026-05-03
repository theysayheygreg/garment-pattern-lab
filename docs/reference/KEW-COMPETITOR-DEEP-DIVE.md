# Kew Competitor Deep Dive

Date: 2026-05-03

Scope: deeper ingest of every item in [Kew Competitor And Inspiration Shortlist](KEW-COMPETITOR-SHORTLIST.md), with implications for Garment Pattern Lab.

Research stance:

- Vendor pages are useful for category claims and feature maps, not proof of product quality.
- The goal is not to clone Kew or any competitor.
- Garment Pattern Lab stays narrower than Kew: sketch-to-pattern workbench first, broader apparel platform later only if the product earns it.
- Optitex is the strongest eventual-capability reference in this set, but its interaction model is still expert CAD/editor driven. That is the opening.

## Executive Read

The shortlist clusters into five capability worlds:

1. AI concept-to-tech-pack and imagery: Lifecycle PLM, Photoroom.
2. Creative vector trust layer: Illustrator Image Trace, Pen/Pencil/Curvature tools, Optitex 3D for Illustrator.
3. Pattern/3D/production systems: Optitex, CLO, Browzwear, Lectra Modaris, Gerber AccuMark/AccuNest.
4. Workspace and permission shells: Notion, Salesforce, Airtable.
5. Commerce and launch bridges: Shopify productSet and product-photo systems.

For Garment Pattern Lab, the key conclusion is:

**Do not rebuild a full 2D editor plus full 3D editor. Build pattern-intelligence services that make the hard apparel pillars accessible through narrow, reviewable tasks.**

The pillars that matter are sketch/vector cleanup, pattern topology, grading logic, fabric/simulation approximations, 3D preview and fit checks, marker/fabric usage, tech-pack/package output, permissions/provenance, and downstream product records.

Existing tools mostly assume skilled mouse-and-keyboard operation in 2D/3D workspaces. Garment Pattern Lab should use structured prompts, landmarks, generated fixtures, task-specific controls, visible assumptions, and validation gates so the designer does not have to become a CAD operator to get a useful first draft.

## Product Direction From The Pass

Borrow:

- Optitex: 2D pattern plus 3D validation, grading, marker making, fabric management, tension maps, avatar simulation, Illustrator bridge.
- CLO/Browzwear: 3D preview, fabric/material libraries, avatar workflows, photoreal and fit review expectations.
- Lectra/Gerber: industrial pattern semantics, grading, notches, seam values, axes, production info, marker/cutting handoff.
- Lifecycle PLM: AI concept -> technical sketch -> tech pack as a visible category direction.
- Illustrator: trace/edit trust layer and the burden of anchor/curve cleanup.
- Airtable/Salesforce/Notion: role-specific views, record ownership, and collaboration shells.
- Shopify/Photoroom: downstream launch and product-imagery pipelines as future context.

Avoid:

- full general-purpose vector editor in v1
- full general-purpose 3D garment editor in v1
- factory CAD as the first product surface
- hiding pattern decisions behind image generation
- treating photoreal renders as validation
- making users hand-edit hundreds of anchors before the product is useful

Working thesis:

Optitex and peers prove the eventual capability map. They do not prove that the interaction model is inevitable.

Garment Pattern Lab can implement many of the same pillars incrementally if each pillar is framed as a validated service: grading as parameterized size-rule propagation, fabric simulation as warning/preview/classification first, marker layout as fabric-width-aware planning, vector cleanup as semantic trace/landmark review, and 3D as sanity-check preview.

## Core Category References

### Lifecycle PLM AI Studio

Source: https://www.lifecycleplm.com/platform/fashion-ai-studio

Claims: text-to-image fashion concepts, image-to-technical-sketch, sketch-to-realistic-render, AI photoshoots, video, virtual try-on, AI tech-pack creation, and measurement autofill.

Why it matters: Lifecycle validates the category direction that AI-generated apparel imagery can feed a technical-product workflow. The most relevant idea is the conversion from flatlay/concept image into a technical sketch that can enter tech-pack work.

Implication: Generated sketches can be a real input lane, but they must pass semantic review before becoming pattern intent. We should not stop at "technical sketch"; the differentiator is `SketchIntent -> PatternGraphCandidate -> validation -> human-readable pattern package`.

Follow-up: Verify what Lifecycle exports from AI Studio into Tech Pack Studio: image only, editable vector, measurement table, POMs, or structured garment data.

### Lifecycle Tech Pack Studio

Source: https://www.lifecycleplm.com/platform/techpack-studio

Claims: reusable measurement and BOM templates, Illustrator and Shopify connections, tech pack/product data workflow, and syncing designs/product details downstream.

Why it matters: It frames tech packs as connected product records, not static PDFs. It also reinforces that Illustrator remains a common creative surface in apparel workflows.

Implication: V1 pattern package should be human-readable, but the model should leave room for `TechPackModel` later. Shopify is a later export target, not a reason to widen v1.

Follow-up: Identify minimal tech-pack fields that overlap with a sewing-pattern package: style name, measurement set, POM table, material notes, construction notes, BOM placeholders.

### SeamScape Comparison / Software

Sources: https://seamscape.com/software/comparison and https://seamscape.com/software

Claims: browser/cloud patternmaking, 2D drafting, parametric workflow, marker/layout, beta 3D, collaboration, PatternStudio, SeamScape 3D, CuttingRoom, NaaS, BodyDouble.

Why it matters: SeamScape is the closest "modern browser patternmaking" signal in the shortlist. It positions browser collaboration, parametric drafting, lightweight 3D checks, and nesting/production API workflows as a coherent alternative to desktop CAD.

Implication: Browser-first is credible. SeamScape appears pattern-tool-first, while our strongest position is sketch/intent-to-pattern-first.

Follow-up: Test PatternStudio hands-on and record whether its core object model resembles `PatternGraph`, SVG editor, parametric script, or CAD document.

### Adobe Illustrator Image Trace

Source: https://helpx.adobe.com/illustrator/desktop/manage-objects/traces-mockups-symbols/image-trace-panel-options.html

Claims: converts raster images into editable vector artwork with presets, color modes, thresholding, path fitting, corners, noise suppression, fills/strokes, shape detection, snap-to-line, transparency handling, auto grouping, and expand-to-path.

Why it matters: Image Trace is the baseline trust layer for raster-to-vector workflows. It exposes the central tension: automatic tracing is powerful, but quality depends on settings and cleanup.

Implication: We need a trace layer, but not a generic Image Trace clone. The trace should become semantically tagged garment curves: neckline, armhole, side seam, hem, center line, seam hint, style line, print boundary.

Follow-up: Compare Potrace, OpenCV contour extraction, SVG centerline tracing, and ML segmentation for garment sketch cleanup.

### Adobe Illustrator Pen / Pencil / Curvature Tools

Source: https://helpx.adobe.com/illustrator/desktop/draw-shapes-and-paths/draw-shapes/draw-line-segments-with-the-pen-tool.html

Claims: direct vector path creation and editing with anchor points, curves, smooth/corner points, path simplification, and smooth/refine tools.

Why it matters: Illustrator sets the professional expectation for editable vector curves, but it also shows the burden: skilled users manipulate anchors and handles, not garment semantics.

Implication: Borrow curve editing as an escape hatch. The main interaction should be garment controls and semantic handles: "raise neckline", "widen shoulder", "smooth armhole", "increase hem sweep", "mark back opening."

Follow-up: Prototype semantic handles on top of vector curves before building full path-editing UI.

## Pattern / CAD / 3D Systems

### CLO

Source: https://www.clo3d.com/explore/features

Claims: 2D/3D garment design and simulation, 3D pen workflow that draws silhouettes around avatars and converts them into 2D patterns, fabric digitization with CLOFAB/zFab, DXF/mesh/simulation/material/avatar ecosystem.

Why it matters: CLO is the strongest cultural reference for modern 3D garment work. It proves that designers expect 2D patterns and 3D simulation to stay linked.

Implication: 3D preview matters, but v1 should not become a 3D authoring app. CLO's 3D pen and flattening direction is adjacent to the original sketch -> 3D -> pattern dream, but pattern semantics and fit expertise still matter.

Follow-up: Compare CLO DXF/SVG export behavior later, after semantic SVG works.

### Browzwear VStitcher

Sources: https://browzwear.com/products/v-stitcher and https://help.browzwear.com/hc/en-us/articles/4921531465753-What-is-VStitcher

Claims: AI-powered 3D workspace, fabric/pattern/avatar libraries, 2D drafting and 3D draping, customizable avatars, grading across sizes, graphics, fabrics, trims, colorways, styling, photoreal rendering, and tech packs.

Why it matters: VStitcher represents enterprise-grade virtual sampling and fit validation.

Implication: Libraries matter: fabrics, trims, blocks, avatars, and pattern families reduce blank-canvas burden. Our early library can be tiny: one garment family, one measurement set, one fabric class, one validation profile.

Follow-up: Define a minimal v1 "library": measurement presets, fabric-class presets, neckline options, finish options, validation tolerances.

### Lectra Fashion

Sources: https://www.lectra.com/en/fashion and https://www.lectra.com/en/discover-lectra

Claims: broad fashion-industry platform across creation, product development, manufacturing, market workflows, software, cloud, cutting equipment, data, and services.

Why it matters: Lectra is the enterprise breadth reference. It shows why Kew's broader platform idea has real market precedent.

Implication: Do not compete with Lectra's breadth. Use it as a reminder that `PatternGraph` should preserve enough structured data for later handoff.

Follow-up: Map `PatternGraph` fields to later `IndustrializationMetadata`, `TechPack`, and `ManufacturingPackage` nodes.

### Lectra Modaris

Source: https://www.lectra.com/en/fashion/products/modaris

Claims: create/modify patterns from blocks and variants, grade and industrialize pattern pieces, add notches, seam values, axes, production information, create 3D samples, sync 2D production patterns with 3D prototypes, and convert Gerber AccuMark/DXF AAMA/DXF ASTM files.

Why it matters: Modaris reminds us that a real pattern system is not just panel geometry. It includes grading, industrialization, production metadata, interop, and 2D/3D sync.

Implication: `PatternGraph` needs notches, seam values, axes/grainlines, cut counts, labels, and production notes from the beginning. Grading can be a later `GradeRule` layer, not a full grading editor.

Follow-up: Define a tiny `GradeRule` schema after the first garment pattern is stable.

### Gerber AccuMark / AccuNest

Sources: https://www.lectra.com/en/products/gerber-accumark-accunest-fashion and https://www.gerbertechnology.com/pdf/AccuMark_E.pdf

Claims: pattern design, grading, marker making, production planning, quality control, communication, labor/material cost reduction, notch placement, and data flow from design to production.

Why it matters: AccuMark/AccuNest are factory-facing references for production handoff, especially grading and marker/nesting.

Implication: Machine-readable cutter/CAD files stay later. Marker planning can start as human-readable fabric usage and layout, not full AccuNest competition.

Follow-up: Build a v1 fabric-width layout report before optimized nesting.

### Optitex 2D/3D CAD

Source: https://optitex.com/products/2d-and-3d-cad-software/

Claims: integrated 2D pattern design and 3D visualization; edits made to 3D can affect the 2D pattern; compatibility with major CAD formats; 2D dart/pleat operations, grading, verification, tech pack essentials, marker making, automatic nesting; 3D fabric simulation, photoreal rendering, colorways, print placement, tension map, multi-stitch tool, avatar editor, and fabric management.

Why it matters: Optitex is doing a lot of the eventual capability map: pattern drafting, grading, 3D validation, fabric simulation, print placement, marker making, and tech-pack assembly.

What it does not solve for us: it remains an expert editor stack. The user still operates complex 2D and 3D workspaces with mouse-and-keyboard manipulation. That is powerful, but not the interaction model we want to bet on.

Implication: Optitex is a pillar map, not a UI map. We can sequence its pillars as services: validated pattern, 3D preview, simple grading, fabric-class checks, marker planning.

Follow-up: Create an Optitex capability decomposition roadmap: which pillars can be implemented as narrow services without full editor parity?

### Optitex 3D for Illustrator

Source: https://optitex.com/products/3d-design-for-illustrator/

Claims: validate and customize 3D garments in Adobe Illustrator; use Illustrator to customize fabric, texture, print patterns, and graphic placement; export GLTF/GLB with material information; share virtual samples across the supply chain.

Why it matters: This is the clearest bridge between a creative vector tool and a 3D garment validation surface.

Implication: The creative-surface bridge is real. We should not inherit Illustrator's setup burden. A future version could import/export Illustrator-compatible assets, but v1 should provide semantic garment controls instead of freeform print-placement tooling.

Follow-up: Define what "Illustrator-compatible enough" means for v1: SVG export, layer names, source image, vector traces, labels.

## Workflow / Collaboration References

### Notion Enterprise

Source: https://www.notion.com/help/enterprise-admins

Claims: workspace and organization administration, owner/admin roles, groups, membership management, enterprise security/management framing.

Why it matters: Notion is a workspace shell reference. It can organize context but does not own apparel semantics.

Implication: The product does not need a collaboration shell in v1. If it becomes multi-user, apparel-specific records matter more than generic pages: pattern, measurement set, source sketch, validation report, package version.

Follow-up: Define `PatternProject`, `PatternVersion`, and `ReviewRole` before building collaboration UI.

### Salesforce Record Access

Source: https://help.salesforce.com/s/articleView?id=platform.users_manage_sharing.htm&language=en_US&type=5

Claims: record access can be configured through organization-wide defaults, role hierarchy, public groups, queues, sharing rules, and manual sharing.

Why it matters: Salesforce is the permission seriousness reference. Apparel product data can involve contractors, factories, sample rooms, clients, and private measurements.

Implication: Do not bolt permissions on later if uploads/body measurements become cloud-hosted. Even solo v1 should track asset provenance, owner, privacy, and reuse consent.

Follow-up: Add `AccessPolicy` and `AssetConsent` before any hosted upload prototype.

### Airtable Interface Permissions

Source: https://support.airtable.com/v1/docs/interface-designer-permissions

Claims: role-specific interfaces over shared underlying data, interface-only access on paid plans, field visibility, record visibility, filters, viewer-specific records, and "view as" testing before sharing.

Why it matters: Airtable is a clean model for role-specific views over shared product records.

Implication: Future collaboration can show different views: designer sketch view, patternmaker validation view, sample-room print package view, factory export view. V1 can model these as package/report profiles without adding accounts.

Follow-up: Define `ViewProfile`: designer, pattern reviewer, sewing package, industrial export.

## Launch / Commerce / Imagery

### Shopify productSet API

Source: https://shopify.dev/docs/api/admin-graphql/latest/mutations/productSet

Claims: GraphQL mutation for creating/updating product data, including asynchronous product creation/update flows.

Why it matters: Shopify is not v1, but it is the obvious commerce endpoint if Kew or a later product platform connects design-to-launch.

Implication: Keep product launch metadata out of v1 pattern package unless it directly helps the pattern. Later, a `ProductRecordExport` can map style/color/size/fabric imagery to commerce.

Follow-up: Define downstream product fields only after pattern package and tech-pack model exist.

### Photoroom API Docs

Source: https://docs.photoroom.com/

Claims: image editing API with background removal, shadows, AI backgrounds, relighting, text removal, expand, uncrop, upscale, virtual model, flat lay, and ghost mannequin.

Why it matters: Product imagery is becoming an API pipeline, not just a manual creative task.

Implication: Product photography is not v1. Generated flats, ghost mannequin, and model imagery can become downstream validation/launch context after pattern truth exists.

Follow-up: Track product-imagery exports as a Kew/platform lane, not Garment Pattern Lab v1.

### Photoroom Product Photography

Source: https://www.photoroom.com/ai-product-photography/e-commerce

Claims: AI product photography for ecommerce, image generation/staging for commercial listings, brand/marketplace-oriented output.

Why it matters: This is commercially useful imagery, not patternmaking.

Implication: Do not confuse photoreal product imagery with pattern validation. The pattern package can later provide structured assets that help imagery workflows, but imagery should not drive v1 architecture.

Follow-up: Keep `MarketingImageCandidate` separate from `ValidationRender`.

## Optitex Capability Decomposition

| Optitex-like pillar | Need | Garment Pattern Lab version |
| --- | --- | --- |
| 2D pattern drafting | Now | `PatternGraph` plus first-garment drafting formulas |
| Dart/pleat operations | Scoped | explicit first-garment dart modes, not full CAD operations |
| Verification tools | Now | validation gate: seam length, closed panels, scale, labels, grain, notches |
| 3D visualization | Scoped | Three.js sanity preview, not full 3D authoring |
| Fabric simulation | Later | fabric-class warnings and simple drape checks before high-fidelity cloth |
| Tension map | Later | fit/ease diagnostics from geometry first, simulation heatmaps later |
| Grading | Later but important | parameterized `GradeRule` propagation after base pattern works |
| Marker making | Later but useful | fabric-width-aware layout report before optimized nesting |
| Print placement/colorways | Later | material/print preview layers, not manufacturing truth |
| Avatar editor | Avoid in v1 | measurement set and simple body proxy |
| Tech pack essentials | Later | `PatternPackageModel` -> `TechPackModel` |
| CAD format compatibility | Later | semantic SVG first, DXF/AAMA/ASTM later |

This gives a roadmap that does not require cloning a giant editor.

## Knowledge Graph Additions

Add these concepts to the project knowledge graph:

- `CompetitorCapabilityMap`
- `KewAdjacentPlatform`
- `OptitexCapabilityPillar`
- `InteractionModelRisk`
- `TaskLedPatternService`
- `SemanticTraceWorkbench`
- `GradeRuleService`
- `FabricClassSimulationService`
- `MarkerPlanningService`
- `TechPackBridge`
- `ViewProfile`
- `AccessPolicy`
- `ProductRecordExport`
- `MarketingImageCandidate`

Key edge:

```text
CompetitorCapabilityMap
  -> OptitexCapabilityPillar
  -> TaskLedPatternService
  -> PatternGraph
```

This encodes the product bet: borrow the capability pillars, reject full editor parity as the first interaction model.

## Sources

- Lifecycle PLM AI Studio: https://www.lifecycleplm.com/platform/fashion-ai-studio
- Lifecycle Tech Pack Studio: https://www.lifecycleplm.com/platform/techpack-studio
- SeamScape comparison: https://seamscape.com/software/comparison
- SeamScape software overview: https://seamscape.com/software
- Adobe Illustrator Image Trace: https://helpx.adobe.com/illustrator/desktop/manage-objects/traces-mockups-symbols/image-trace-panel-options.html
- Adobe Illustrator Pen tool docs: https://helpx.adobe.com/illustrator/desktop/draw-shapes-and-paths/draw-shapes/draw-line-segments-with-the-pen-tool.html
- CLO features: https://www.clo3d.com/explore/features
- Browzwear VStitcher: https://browzwear.com/products/v-stitcher
- Browzwear VStitcher help: https://help.browzwear.com/hc/en-us/articles/4921531465753-What-is-VStitcher
- Lectra Fashion: https://www.lectra.com/en/fashion
- Lectra overview: https://www.lectra.com/en/discover-lectra
- Lectra Modaris: https://www.lectra.com/en/fashion/products/modaris
- Gerber AccuMark / AccuNest: https://www.lectra.com/en/products/gerber-accumark-accunest-fashion
- Gerber AccuMark PDF: https://www.gerbertechnology.com/pdf/AccuMark_E.pdf
- Optitex 2D/3D CAD: https://optitex.com/products/2d-and-3d-cad-software/
- Optitex 3D for Illustrator: https://optitex.com/products/3d-design-for-illustrator/
- Optitex 3D overview: https://help.optitex.com/1382687/Content/Optitex_3D/3D_Overview.htm
- Optitex model and simulation wizard: https://help.optitex.com/1382687/Content/Optitex_3D/Model_and_SImulation_Wizard.htm
- Notion Enterprise administration: https://www.notion.com/help/enterprise-admins
- Salesforce record access: https://help.salesforce.com/s/articleView?id=platform.users_manage_sharing.htm&language=en_US&type=5
- Airtable Interface permissions: https://support.airtable.com/v1/docs/interface-designer-permissions
- Shopify productSet API: https://shopify.dev/docs/api/admin-graphql/latest/mutations/productSet
- Photoroom API docs: https://docs.photoroom.com/
- Photoroom product photography: https://www.photoroom.com/ai-product-photography/e-commerce
