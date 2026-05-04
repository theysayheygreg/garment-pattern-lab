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

Garment Pattern Lab maps cleanly into the **Kew PD** slice — pattern development, measurements, fit, 3D sanity preview — with selective overlap into Kew CAD (semantic vector tracing) and Kew Lifecycle (revision history, collaboration hooks).

## The Drape-To-Pattern Workflow

Kiko names a workflow that is not currently designed in Garment Pattern Lab:

```
photo of physical drape / pinned form
  -> technical sketch
  -> measurement analysis
  -> pattern development
```

This is a *third* input lane beyond the two already in `INPUT-LANES.md` (GPT Image 2 generated sketches and human-authored sketches/vectors). Many independent designers do not begin with a clean technical sketch — they drape physical fabric on a form or body, photograph the result, and want to translate that into structured intent. Kew explicitly names this as one of the most magical workflows the platform should support.

Implication for Garment Pattern Lab: the input-lane model should be extended to a third lane (`drape-photo`) even if v1 does not implement it. The shared downstream contract (`InputProvenance`, `LandmarkSet`, `SketchIntent`, `AmbiguityReport`) is already lane-agnostic, so adding the lane is mostly a corpus and ingestion question, not a schema break.

## Real-World Compatibility Targets

Kew names these systems as long-term compatibility targets, not day-one replacements:

- Adobe (creative front)
- Gerber (factory-facing CAD, grading, marker making)
- CLO 3D (3D garment workflow, fit visualization)
- Ned Graphics (textile/print)
- Lectra (PLM, production, industrial apparel workflow)
- Browzwear (virtual garment construction, enterprise 3D)
- Optitex (2D/3D bridge, grading, production)

Marker-making is named as a downstream production function Kew should aim toward while staying creator-friendly up front.

Implication for Garment Pattern Lab: these match the existing competitor analysis (Optitex deep dive, Lectra/Browzwear/CLO references) but they are now also *future export targets* through the candidate-to-export interop layer, not just competitor benchmarks. DXF/AAMA/ASTM remains a later lane; Adobe and CLO interop should be added to the deferred export profile list.

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

- Creative canvas / moodboard / Canva-like layer.
- Surface / print / graphic design tools.
- Merchandising and Studio (AI photoreal product imagery).
- PLM / Lifecycle (full collaboration, BOM, factory portal, sourcing workflow).
- Adobe / Gerber / CLO / Ned Graphics first-party interop.
- Multi-language factory communication.
- Footwear, accessories, furniture, interior design.
- Creator marketplace and library remixing.
- Avatar / gaming bridge.
- Open-source learning layer ("Kew should teach as well as solve").

These belong in Kew's broader product family. Garment Pattern Lab should not absorb them. It should remain the focused execution-oriented pattern slice that maps into Kew PD.

## Tensions And Forks This Surfaces

### The Canvas Question (Orrery review finding 4) gets a clearer answer

Kiko's vision explicitly wants Illustrator-level vector control eventually, inside Kew Canvas / Kew CAD. Garment Pattern Lab's pillar is "not Illustrator." If Garment Pattern Lab is the Kew PD slice, the canvas problem belongs upstream (Kew Canvas + Kew CAD). Garment Pattern Lab plugs into a *confirmed-intent payload* — `SketchIntent`, `LandmarkSet`, `GarmentParameters` — produced upstream. That is a clean answer to the canvas-vs-not-canvas fork: Pattern Lab does not own the canvas. The canvas lives upstream in Kew or in the user's existing tooling (Procreate, Illustrator, Figma, draped photos).

### The natural-language pillar (Orrery review finding 1) gets reinforcement

Kiko's "expert moves fast, novice asks why" framing is the same product gesture as the natural-language pillar. The schema and validation harness should be designed *to be explainable* from day one. Each error, each assumption, each fix suggestion needs a `why` companion suitable for both modes.

### Drape-to-pattern is a missing input lane

Currently Garment Pattern Lab has two input lanes (generated, human-authored sketch). Kew names a third (drape photo). Add it to `INPUT-LANES.md` as a future lane with the same downstream contract, even if v1 does not implement it.

### Kew's compatibility list adds export targets, not just competitor references

Adobe, Gerber, CLO, Ned Graphics, Lectra, Browzwear, Optitex are now also *export targets* through the interop layer, not only studied competitors. The deferred export profile list in `CANDIDATE-TO-EXPORT-INTEROP.md` should grow to include these.

### Cross-domain abstraction (furniture, interiors, etc.)

Kew's eventual extension into adjacent product-development domains is a soft constraint: the pattern grammar should not gratuitously hardcode "garment" or "wearer." `PatternGraph`, `Panel`, `SeamPair`, `Notch`, `GrainAxis` already read as panel-based sewable-object primitives, which is fine. Body-specific concepts (`MeasurementSet`, `Avatar`) should remain garment-specific without leaking into the core.

## Strategic Position For Garment Pattern Lab

Garment Pattern Lab is execution-oriented; Kew is broader product-market exploration. The cleanest framing:

**Garment Pattern Lab is the focused execution slice that proves the engine Kew needs underneath its PD layer.**

If Garment Pattern Lab succeeds, its `PatternGraph` schema, validation harness, and human-readable pattern package become the substrate Kew PD runs on. If Kew succeeds, Garment Pattern Lab's pattern slice has an upstream canvas, a downstream merchandising lane, and a real PLM context to live inside.

The two projects can stay distinct in the near term and unify later. Right now Garment Pattern Lab should:

- treat Kew Product Vision as long-range north star context, not a v1 requirement set
- maintain the execution-oriented stance: one garment, end-to-end, validated
- design the schema and revision model so it could later host Kew's broader workflows without rewrite
- avoid scope creep into Canvas, Studio, or Lifecycle territory

## Open Questions For Future Alignment

- Will Garment Pattern Lab and Kew unify under one codebase, or remain sibling projects with shared substrate?
- If they unify, does Garment Pattern Lab become Kew PD's open-engine layer, or a separate product family inside Kew?
- What is the minimum upstream payload Garment Pattern Lab needs from Kew Canvas / Kew CAD to begin pattern work? (Answering this defines the input-lane contract more sharply.)
- How should Garment Pattern Lab's schema accommodate Kew Lifecycle's collaboration and revision needs without overbuilding for v1?
- What is the IP/consent shape for designs that flow Kew → Pattern Lab → factory? (Touches Orrery review finding 18.)
- When does the drape-photo input lane become a v1.x or v2 priority?
