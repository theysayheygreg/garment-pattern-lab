# Persona 1: Example Usage Flows

Date: 2026-05-03

Eight grounded scenarios showing how Persona 1 (Individual Fashion Designer — `persona-1-individual-designer.md`) actually uses Garment Pattern Lab. Each flow is anchored to a real garment family from `docs/data-corpus/garment-families.json` and a real input mode. These are scope-defining: if a feature isn't exercised by one of these flows or a close sibling, it's not v0.1 / v0.5 scope.

Names are placeholders for clarity. The flows are real product expectations.

---

## Flow 1 — Reece's longer A-line summer dress

**Garment:** `dress.a_line` (A-line dress)
**Input mode:** reference image (raster) saved from Instagram
**Persona shape:** indie designer launching a small spring/summer drop

Reece sees a sleeveless A-line summer dress on a friend's Instagram and wants to make a similar shape, but knee-length instead of mini. She uploads the screenshot, confirms the system's landmark interpretation (front view only — back is auto-mirrored as a v0.1 simplification), enters her own measurements, and asks the assistant to "lengthen the hem to just below the knee, around 50cm from the waist." The pattern regenerates. The 3D preview shows a plausible silhouette. She prints the pattern tiled across A4 sheets at home, tapes them together, and cuts a muslin from cotton lawn that afternoon. *Exercises: image ingest, landmark confirmation, parameter-edit verb (length), tiled-PDF export. Stays out of: variants, grading, dependency propagation.*

## Flow 2 — Maya's draped Renaissance bodice

**Garment:** `dress.sheath` adapted (closer to a fitted bodice)
**Input mode:** drape photo (raster, requires vectorization)
**Persona shape:** costume designer for a community theater production

Maya pins muslin on a dress form to drape a high-waisted Renaissance bodice, photographs it on her phone, and uploads the image. The system runs raster→vector tracing, asks her to confirm which curves are the silhouette versus interior style lines, and asks an ambiguity question about closure ("center back lacing or invisible zipper?"). Maya answers "center back lacing — I'll add the eyelets manually." The system produces a fitted-bodice pattern with a center-back seam (no closure mechanism in v0.1; the assembly notes mention "back closure to be finished by sewer"). She prints, cuts, and refines on the form. *Exercises: drape-photo ingest, vectorization, semantic-interpretation correction surface, assistant ambiguity question, manual override of unsupported feature. Stays out of: closure mechanism modeling, lacing eyelet placement.*

## Flow 3 — Jules's vintage tee replica

**Garment:** `top.tee` (T-shirt)
**Input mode:** vector trace of a physical garment laid flat
**Persona shape:** home sewer who wants to replicate a beloved worn-out tee

Jules lays their favorite worn-out T-shirt flat on butcher paper, traces around it with a marker, photographs the trace, and uploads it. The system vectorizes, identifies it as a tee silhouette (`top.tee`), and asks Jules to confirm key landmarks (sleeve cap, side seam, hem line). Jules enters their own measurements; the system warns that the original tee was likely a knit fabric and asks if Jules wants the woven-friendly fit (more ease) or the original close fit. Jules picks the close fit. The pattern regenerates. *Exercises: physical-garment-trace ingest (which is just raster + vectorization with no special lane), garment-family auto-recognition, fabric-class confirmation, ease-mode assistant verb. Stays out of: knit-specific stretch math (warning surfaced, not modeled).*

## Flow 4 — Sam's Procreate shift dress

**Garment:** `dress.shift` (Shift dress)
**Input mode:** vector export from Procreate
**Persona shape:** indie designer with iPad-led workflow

Sam sketches a sleeveless shift dress in Procreate using its vector brush, exports as SVG, and uploads. The vector ingest skips the rasterization step entirely (this is the highest-trust input path per the vectorization research). The system tags curves to landmarks based on the heuristic priors. Sam adjusts the bust ease through the assistant ("I want this looser, more like a shift than a sheath — add 3cm bust ease") and previews. The 3D preview shows the shift's straight silhouette. Sam exports the pattern PDF and emails it to a local sample sewer. *Exercises: vector ingest passthrough, heuristic interpretation, ease-edit verb, PDF export, downstream handoff to a non-Pattern-Lab user (the sample sewer doesn't need the system).*

## Flow 5 — Kiko's iterative slip dress

**Garment:** `dress.slip` (Slip dress)
**Input mode:** technical-flat sketch (the canvas-style reference Kiko already produces in Kew)
**Persona shape:** the namesake — indie fashion designer iterating on a single design across a session

Kiko uploads her front-and-back technical flat for a bias-cut slip dress with thin straps and a draped neckline. The system asks an ambiguity question about cut: "this looks bias — confirm cut on bias?" Kiko confirms. The system warns that bias-cut woven patterns require fabric-grain handling that v0.1 simplifies. Kiko iterates: "shorter — knee length," then "narrower straps, 1cm," then "lower the back neckline by 4cm." Each edit regenerates the pattern; the assistant surfaces "I'm assuming the straps stay straight without curve — change?" Kiko exports the final pattern. *Exercises: technical-flat ingest, multiple parameter-edit verbs in one session, surfaced assumptions, fabric-grain warning. Stays out of: real bias-grain math, knit alternatives.*

## Flow 6 — Asha's drawstring pajama pants

**Garment:** `pants.trouser` (specifically a relaxed elastic-waist trouser)
**Input mode:** rough napkin sketch photographed on phone
**Persona shape:** home sewer making PJs from scrap fabric

Asha sketches loose drawstring pants on a napkin, photographs it, and uploads. The system runs the noisier raster→vector trace and acknowledges low confidence on landmark detection ("I'm not very sure where the inseam ends and the side seam begins — please confirm"). Asha drags the landmarks to correct them, picks "elastic waist with drawstring" from the closure list, and skips the pocket option. The pattern produces front and back leg pieces with a seam allowance and a casing for the drawstring. Asha prints at home and cuts. *Exercises: low-quality-input handling, manual landmark correction, closure-mode picker, simple multi-piece pattern. Stays out of: pocket modeling, fly construction, anything jean-shaped.*

## Flow 7 — Lin's gathered midi skirt

**Garment:** `skirt.gathered` (Gathered / dirndl skirt)
**Input mode:** Pinterest photo of a finished garment
**Persona shape:** indie maker building a small handmade collection

Lin pins a gathered midi skirt to her Pinterest board and uploads the photo. The system identifies it as `skirt.gathered`, asks her to confirm the hem length, and asks "approximate gather ratio — typical is 1.5x to 3x waist circumference, more gather means more volume." Lin says "2x." The system generates a rectangular skirt panel and a waistband with the appropriate gathering math. The cut sheet says "Cut 2 panels 60cm × 90cm; gather top edge to 45cm." Lin prints the pattern, but the rectangles are simple enough she just cuts directly with a measuring tape. *Exercises: garment-family recognition from a finished-garment photo, gather-ratio assistant verb, simple-rectangle pattern. Stays out of: complex hem treatments, pleated alternatives.*

## Flow 8 — Devon's wrap dress for community theater

**Garment:** `dress.wrap` (Wrap dress)
**Input mode:** combined — a sketch plus a reference image
**Persona shape:** costume designer producing 6 of the same garment in different sizes for an ensemble

Devon sketches a wrap dress with a tie closure and uploads it alongside a reference photo of a similar dress for context. The system asks an ambiguity question: "real wrap with tie or faux-wrap with hidden zipper?" Devon picks real wrap. The system surfaces a warning: "wrap closures require careful overlap math; I'm using a default 15cm overlap — confirm?" Devon adjusts to 18cm. The pattern regenerates; the cut sheet specifies the overlap region. Devon notes that he'll need 6 copies in different measurements but accepts that v0.1 only does one size at a time — he generates each separately, one per actor. *Exercises: combined sketch + reference input, real-vs-faux closure ambiguity, parameter override, accepting that grading is deferred to v0.5+ and working around the limit. Stays out of: actual grading (Persona 2 v0.5+ feature), batch generation.*

---

## What These Flows Show

**Common patterns across all eight:**

- Persona 1 always brings their own input (sketch, photo, vector, drape, finished garment trace) and their own measurements.
- The system always confirms or asks about ambiguous design choices in design language.
- Edits are conversational ("lengthen the hem," "narrower straps," "more gather") not parametric forms.
- Output is always a printable, sewable pattern package that gets handed to a sewer (themselves or someone else).
- When the system doesn't model something (bias grain, knit stretch, closure hardware, grading), it says so honestly rather than producing a wrong answer.
- 3D preview is feedback for sanity-checking, not authorship.

**Capabilities exercised across the eight:**

- Image ingest (raster, vector, drape photo, vector passthrough)
- Vectorization with garment-aware tagging
- Landmark interpretation with manual correction
- Garment-family recognition
- Ambiguity questions in design language
- Assistant verbs: length, ease, neckline, hem, gather ratio, closure mode, fabric class
- Parameter override
- 3D preview
- Pattern package export (SVG + tiled PDF + cut sheet + assembly notes)

**Capabilities NOT exercised (correctly out of v0.1 scope):**

- Variants / side-by-side comparison
- Grading across a size run (Devon's 6-actor case acknowledges this is deferred)
- Dependency propagation across features
- Industrial CAD export (DXF/AAMA)
- Multi-language factory communication
- Multi-pattern workspace
- Real-time collaboration

**Anti-patterns these flows would surface if they crept in:**

- A wizard with required steps in fixed order — Kiko's iterative session would feel suffocating
- Engineer-language errors — Asha's low-confidence input would feel like failure instead of collaboration
- A blank-canvas vector editor — Sam's Procreate handoff doesn't want re-authoring tooling, just interpretation
- Industrial-format export pressure — none of these eight users wants DXF

## How To Use These Flows

When designing or reviewing a feature, ask: which of these flows does it serve? If none, defer it. If a feature would serve a flow but doesn't yet, prioritize it. When a new garment family or input mode comes up, add a ninth flow rather than abstracting the existing eight.

When v0.5 design starts, write `persona-2-example-flows.md` alongside this file with production-designer scenarios (variants, grading, dependency propagation). When v1 design starts, `persona-3-example-flows.md` for manufacturing scenarios (industrial export, marker compliance, factory communication).

## Vocabulary Note: "Drape"

The word **drape** has three distinct meanings in our domain. Pattern Lab uses precise sub-senses:

- **(a) Drape as fabric property.** How a textile falls under its own weight. Heavy wool drapes with structured volume; chiffon has a fluid drape. This is fabric *behavior*, not a workflow. Lives in the future fabric-properties corpus (`drape_behavior` field on fabric records); not v0.1 scope.
- **(b.1) Patternmaking-by-drape.** Designer pins muslin or paper on a dress form, shapes it into the garment, lays it flat, traces the panels. **This is what "drape photo" means in our docs.** Maya's flow #2 above is the canonical example. v0.5 input lane (deferred from v0.1; clean inputs only for v0.1).
- **(b.2) Tailoring-by-drape.** Tailor or fitter holds cut panels (or in-progress garment) over a *specific person* and marks alterations to fit that body. Adjusts an *existing* pattern to a real human. Classic suit-jacket fitting. **Not v0.1 or v0.5; future Persona 3 sample-review territory.**

These three are sometimes collapsed in conversation but the workflows differ. Sense (a) is data on a fabric record. Sense (b.1) is an input lane. Sense (b.2) is a sample-review feedback loop.

**Note for anyone with a 3D / games background:** "drape" in cloth simulation (NVIDIA PhysX, Unreal Cloth, Blender Cloth modifier, Marvelous Designer / CLO 3D) means *cloth physics simulation*. Pattern Lab does **not** do cloth simulation in v0.1 or v0.5 — the 3D viewer is *static panel placement*, not animated cloth. Cloth simulation is a v1+ research lane, currently named `ClothRelaxationPreview` in the knowledge graph and explicitly deferred.
