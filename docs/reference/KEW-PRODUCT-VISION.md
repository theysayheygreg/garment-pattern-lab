# Kew Product Vision

Date: 2026-05-03

Source context: Kiko authored a "Kew Product Vision" founder north-star document for Steve and future collaborators. Greg shared the full text for ingest into Garment Pattern Lab's knowledge graph alongside the other Kew artifacts.

This document is Kiko's voice. Garment Pattern Lab is currently execution-oriented and narrower than Kew's full vision. The two projects overlap heavily in product direction; this note captures the overlap, the differences, and the implications for Garment Pattern Lab.

Companion docs:

- [Kew Competitor And Inspiration Shortlist](KEW-COMPETITOR-SHORTLIST.md)
- [Kew Competitor Deep Dive](KEW-COMPETITOR-DEEP-DIVE.md)
- [Kew Sample Image Analysis](KEW-SAMPLE-IMAGE-ANALYSIS.md)

## North Star

Kew is positioned as one connected fashion product-development ecosystem that carries a garment from creative idea to finished product. Not a sketch tool. Not a pattern tool. Not a PLM. A single source of truth for the garment as a *living product object*, with all downstream views (creative sketch, technical sketch, specs, pattern pieces, fit, factory documentation, merchandising) growing from it.

The framing is a *translation problem*, not a drawing problem. A garment begins as creative intent and has to become technical sketch, measurements, construction logic, pattern pieces, fit decisions, factory instructions, sales imagery, and production records. Today those translations are spread across too many tools, files, people, and conversations. Kew should keep the garment itself at the center.

## Capability Map

Kew is described as one product underneath which several connected layers live:

- **Creative canvas** — references, moodboards, image and text composition, playful drag-and-drop ideation.
- **Drawing and design layer** — technical sketches, vector editing, refined garment shapes (Illustrator-level control when needed).
- **Surface and asset layer** — fabric, print, graphics, trims, reusable visual assets.
- **Pattern and development layer** — specs, slopers, pattern pieces, grading, fit logic, construction logic, technical packages.
- **Production and merchandising layer** — factory communication, printable outputs, sales imagery, market-ready presentation.

These can later be expressed internally as named product families inside the Kew umbrella:

- **Kew Canvas** — idea-to-sketch, image and text composition, early creative exploration.
- **Kew CAD** — print design, surface design, vector editing, pattern-design work.
- **Kew PD** — pattern development, measurements, grading, marker-making foundations, 3D fit.
- **Kew Lifecycle** — merchandising, planning, product records, collaboration, sourcing, downstream business workflow.
- **Kew Studio** — AI-generated photography, line-plan imagery, ecommerce outputs, market-facing presentation.

Garment Pattern Lab maps cleanly into the **Kew PD** slice — pattern development, measurements, fit, 3D sanity preview. Pattern Lab also owns its own narrow semantic interpretation/correction surface for incoming art (vectorizing raster, tagging landmarks, classifying curves, accepting or correcting the trace), which is *not* the same as Kew CAD's freeform vector-authoring surface. Kew Lifecycle's revision and collaboration hooks influence Pattern Lab's schema design but are not a v1 surface.

## The Drape-To-Pattern Workflow

Kiko names a workflow that is not currently designed in Garment Pattern Lab:

```
photo of physical drape / pinned form
  -> technical sketch
  -> measurement analysis
  -> pattern development
```

Many independent designers do not begin with a clean technical sketch — they drape physical fabric on a form or body, photograph the result, and want to translate that into structured intent. Kew explicitly names this as one of the most magical workflows the platform should support.

Implication for Garment Pattern Lab: a drape photo is the same shape as any other raster upload (PNG/JPG/scan/PDF page) — it lives inside the existing human-authored input lane, with a raster-to-vector preprocessing step before semantic interpretation begins. The two-lane model in `INPUT-LANES.md` (generated, human-authored) does not need a third lane to support drape-to-pattern; it needs the vectorization bridge and the interpretation surface to handle photos as well as scanned sketches and uploaded vectors. Worth naming as a supported workflow in `INPUT-LANES.md` because it matches a real designer pattern Kiko cares about.

## Real-World Compatibility Targets

Kew names these systems in its vision document. Their role for Pattern Lab is split, not unified:

- Adobe (creative front)
- Gerber / AccuMark (factory-facing CAD, grading, marker making)
- CLO 3D (3D garment workflow, fit visualization)
- Ned Graphics (textile/print)
- Lectra (PLM, production, industrial apparel workflow)
- Browzwear (virtual garment construction, enterprise 3D)
- Optitex (2D/3D bridge, grading, production)

Marker-making is named as a downstream production function Kew should aim toward while staying creator-friendly up front.

Implication for Garment Pattern Lab — these are **not** round-trip export targets:

- **Replacement aim** (long-range): Optitex, Gerber/AccuMark, CLO 3D, Browzwear, Lectra, Ned Graphics. Kew's vision is to *be* the one-stop-shop, subsuming these workflows rather than handing patterns back to them. Pattern Lab is the PD-slice execution proof of that vision.
- **Ingest worth supporting** (because users already work there): Illustrator (`.ai`), `.svg`, vector PDF, raster (PNG/JPG/scan/photo). Designers' existing work already lives in these formats; Pattern Lab needs to accept it. Ingest is one-way.
- **Round-trip export back into these systems is not a goal.** DXF/AAMA/ASTM remains a separate later export lane for industrial cutting machinery, distinct from interop with the systems Kew is replacing.

This split is reinforced in the Tensions And Forks section below.

## Intelligence That Improves With Use

The platform should learn from structured signals: approved/rejected names, sketch cleanup choices, path/curve corrections, measurement overrides, pattern edits, preferred labels. Every guided review moment is a way to check whether the system understood the garment correctly, *and* a labeled training signal for sharpening the system over time.

Implication for Garment Pattern Lab: the operation-DAG revision model proposed in the Orrery design review (finding 9) gives this learning loop a natural home. Each NL command, each parameter override, each ambiguity-resolution becomes an entry in the DAG with provenance. The same DAG that supports undo and branching also supports learning.

## Guided Product Intelligence

Kiko names the kind of in-workflow questions Kew should answer:

- how much ease this fabric may want for a classic fit
- whether a measurement feels too tight or too loose
- what a pattern adjustment may imply
- how a construction choice may affect fit or production

This is a specialized patternmaking guide living inside the platform, useful for both experts and novices. Experts move fast through familiar concepts; novices ask why things matter and learn enough to make better decisions.

Implication for Garment Pattern Lab: this matches and reinforces Orrery design-review finding 13 — validation should suggest fixes in design language, not just report defects. Kiko's vision goes further: the system should answer *why* a finding matters, not just what to do about it. That is a `FixSuggestion` with an `Explanation` field, not just a fix string.

## Beyond-SaaS Framing

Kiko explicitly addresses the AI-native landscape: as everyday people become able to generate simple software with AI, traditional SaaS gets less defensible. Kew's moat should not be screens, dashboards, forms, folders, or project tracking. The moat is *fashion-specific intelligence* — garment intelligence, sketch interpretation, pattern and measurement logic, construction understanding, factory-ready communication, fit and product-development guidance, a living source of truth for the garment.

The SaaS platform is the first home for that engine, but the engine could later power custom brand workspaces, creator tools, factory portals, AI agents inside other workflows, integrations, plugins, APIs, and marketplace/production services.

Implication for Garment Pattern Lab: this matches and reinforces Orrery design-review finding 5 (the AI-fashion competitor lane). Garment Pattern Lab's defense against text-to-pattern generators is the same as Kew's defense against generic AI: explicit craft contract, validated output, transparent reasoning, designer correction. Pattern Lab's `PatternGraph` is the data shape Kew's "garment as living product object" needs underneath. The two projects are aligned at the foundation.

## User Coverage

Kew's eventual user span is broader than Garment Pattern Lab's:

- individual creators
- independent brands
- studios
- enterprise teams
- digital fashion creators
- gamers and avatar-based creators bridging virtual styling to real garments

Garment categories: women's, men's, kids', babies', accessories, footwear. And eventually adjacent product-development domains — accessories, footwear, furniture, industrial design, architectural design, interior design.

Garment Pattern Lab's v1 user is a subset of the first three (designers, indie studios, advanced home sewers). The garment span is one family (sleeveless A-line woven dress/tunic). The cross-domain extension is not a v1 concern but should not be designed *against* — the schema and pattern grammar should not assume "garment" everywhere it could say "panel-based sewable object."

## Factory Clarity And Multilingual Support

Kew should support translated factory-facing instructions: pattern piece labels, construction notes, callouts, annotations, technical instructions. Base language English, translated text underneath where needed. Goal is fewer misunderstandings, cleaner communication, better sample outcomes.

Implication for Garment Pattern Lab: not v1 scope. Worth a single line in the schema design — pattern piece labels should be *string keys* into a label registry, not hardcoded English strings on the panel object. That keeps multilingual export possible without retrofitting.

## What Garment Pattern Lab Is Already Aligned With

These items in Kiko's vision are direct overlaps with current Garment Pattern Lab direction:

- Garment as living product object → `PatternGraph` as manufacturing source of truth.
- Translation problem, not drawing problem → the entire candidate-to-pattern pipeline.
- Inference + label + explain + ask user to confirm → `SketchIntent`, `LandmarkSet`, `AmbiguityReport`, ambiguity-question UX.
- Print-to-true-scale, including home printer → v1 output package (SVG/PDF/tiled print).
- Flat pattern generation → v1 core deliverable.
- 3D garment-on-body review → B6 simple 3D preview.
- Should help expert and novice both → Pillar 1 (natural intent over CAD operation).
- AI-native engine, not generic SaaS → product differentiator.
- Intelligence improves with use → naturally hosted by the operation-DAG revision model.
- Guided patternmaking advice → matches Orrery design-review finding 13.

## What Garment Pattern Lab Is Explicitly Not Building (Kew Scope)

- Creative canvas / moodboard / Canva-like ideation layer.
- Freeform vector authoring (Illustrator-clone path tooling).
- Surface / print / graphic design tools.
- Merchandising and Studio (AI photoreal product imagery).
- PLM / Lifecycle (full collaboration, BOM, factory portal, sourcing workflow).
- Multi-language factory communication.
- Footwear, accessories, furniture, interior design.
- Creator marketplace and library remixing.
- Avatar / gaming bridge.
- Open-source learning layer ("Kew should teach as well as solve").

These belong in Kew's broader product family. Garment Pattern Lab should not absorb them. It should remain the focused execution-oriented pattern slice that maps into Kew PD.

Pattern Lab *does* own a narrow interpretation/correction surface for inputs that come in (vector and raster). That is not the same as building Illustrator. Authoring freeform vector art is out of scope; correcting and labeling the interpretation of incoming art is core.

## Tensions And Forks This Surfaces

### The Canvas Question (Orrery review finding 4) gets a more careful answer

Kiko's vision explicitly wants Illustrator-level vector control eventually, inside Kew Canvas / Kew CAD. Garment Pattern Lab's pillar is "not Illustrator." Those two are reconciled by separating two questions that were tangled together in the original review:

1. **Does Pattern Lab let users author freeform vector art from scratch?** No. That is Kew CAD's job, or upstream tools the designer already uses (Illustrator, Procreate, Figma).
2. **Does Pattern Lab let users manipulate the *interpreted* version of an input?** Yes. Tagging a curve as the armhole, nudging a landmark, accepting or rejecting a trace, correcting the front/back assignment — that semantic-correction surface is core to the product even in the prototype. It is what makes the system trustworthy instead of black-box.

The right framing: Pattern Lab owns a narrow canvas, purpose-built for *interpretation and semantic correction* of whatever vector or raster came in. It accepts `.ai`, `.svg`, vector PDF, raster (PNG/JPG/scan/drape photo), and eventually whatever upstream Kew Canvas / Kew CAD produces. It does not try to compete with Illustrator on freeform path authoring.

The earlier draft of this section used the term "ConfirmedIntentPayload" to describe an upstream-produced handoff. That concept does not match the product. The interpretation work happens inside Pattern Lab, on inputs from many upstream sources, and the user can correct it before pattern generation begins.

### The natural-language pillar (Orrery review finding 1) gets reinforcement

Kiko's "expert moves fast, novice asks why" framing is the same product gesture as the natural-language pillar. The schema and validation harness should be designed *to be explainable* from day one. Each error, each assumption, each fix suggestion needs a `why` companion suitable for both modes.

### Drape-to-pattern is a content variant of the human-authored lane, not a third lane

A drape photo is the same shape as any other raster upload (PNG/JPG/scan/PDF page) — a raster image that needs vectorization before semantic interpretation. Two lanes remain in `INPUT-LANES.md`: GPT Image 2 generated fixtures, and human-authored uploads. The drape photo is a content variant inside the human-authored lane, paired with a raster-to-vector preprocessing step. The bridge work (`RasterToVectorBridge`, `SemanticInterpretationSurface`) is what unblocks it — not new lane structure.

### Kew's compatibility list is a replacement target, not a round-trip target

Kew's vision (and Pattern Lab's, as the PD slice of it) is to *be* the one-stop-shop, not to round-trip back to the systems it is replacing. The compatibility list above splits three ways:

- **Ingest worth supporting** (because users already work there): `.ai`, `.svg`, vector PDF, raster (PNG/JPG/scan/photo). Illustrator-shaped vector inputs are explicitly worth handling. Ingest is one-way.
- **Replacement targets** (Kew's long-range vision is to subsume these workflows, not interoperate with them): Optitex, Gerber/AccuMark, CLO 3D, Browzwear, Lectra, Ned Graphics. Many versions out.
- **Round-trip interop is not a goal.** DXF/AAMA/ASTM remains a *separate* later export lane for industrial cutting machinery, not for talking back to the replaced systems.

### Cross-domain abstraction (furniture, interiors, etc.)

Kew's eventual extension into adjacent product-development domains is a soft constraint: the pattern grammar should not gratuitously hardcode "garment" or "wearer." `PatternGraph`, `Panel`, `SeamPair`, `Notch`, `GrainAxis` already read as panel-based sewable-object primitives, which is fine. Body-specific concepts (`MeasurementSet`, `Avatar`) should remain garment-specific without leaking into the core.

## Strategic Position For Garment Pattern Lab

Garment Pattern Lab is execution-oriented; Kew is broader product-market exploration. The cleanest framing:

**Garment Pattern Lab is the focused execution slice that proves the engine Kew needs underneath its PD layer.**

If Garment Pattern Lab succeeds, its `PatternGraph` schema, validation harness, and human-readable pattern package become the substrate Kew PD runs on. If Kew succeeds, Garment Pattern Lab's pattern slice has an upstream canvas, a downstream merchandising lane, and a real one-stop-shop context to live inside.

The two projects can stay distinct in the near term and unify later. Right now Garment Pattern Lab should:

- treat Kew Product Vision as long-range north star context, not a v1 requirement set
- maintain the execution-oriented stance: one garment, end-to-end, validated
- design the schema and revision model so it could later host Kew's broader workflows without rewrite
- avoid scope creep into Canvas, Studio, or Lifecycle territory

### Prototype goal, sharpened

The prototype goal is narrower than the v1 product promise and worth stating in plain language:

**Can we produce a pattern from a sketch or image reference that a human like Kiko could actually sew?**

That is the success bar for v0.1 and the first few iterations after it. Everything else — the canvas surface depth, the assistant loop, the multilingual factory communication, the export targets, the cross-domain abstraction — is many versions out. The prototype proves the spine: image/sketch in, sewable pattern out, judged by a real designer holding the printed result next to a real garment.

## Open Questions For Future Alignment

- Will Garment Pattern Lab and Kew unify under one codebase, or remain sibling projects with shared substrate?
- If they unify, does Garment Pattern Lab become Kew PD's open-engine layer, or a separate product family inside Kew?
- What input formats and metadata does Pattern Lab need to accept so that work from Kew Canvas / Kew CAD (or any other upstream creative tool) hands off cleanly into the interpretation surface? Pattern Lab does its own interpretation work; the question is what raw inputs and optional intent hints make that interpretation faster and more accurate.
- How should Garment Pattern Lab's schema accommodate Kew Lifecycle's collaboration and revision needs without overbuilding for v1?
- What is the IP/consent shape for designs that flow Kew → Pattern Lab → factory? (Touches Orrery review finding 18.)
- When does drape-photo ingestion (the raster-to-vector bridge plus interpretation surface) become a v1.x or v2 priority? It rides on the existing human-authored lane, not a new lane.
