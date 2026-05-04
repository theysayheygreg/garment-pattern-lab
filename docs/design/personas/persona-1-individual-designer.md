# Persona 1: Individual Fashion Designer

Date: 2026-05-03

**Version target: v0.1 — primary user.**

The Kiko-shape user. Garment Pattern Lab's first prototype is built for this persona, end to end. Every other persona is a deliberate deferral.

## Identity

Independent fashion designer, indie brand operator, costume designer, advanced home sewer, or sample-room-adjacent maker. They have design taste and patternmaking literacy enough to judge a draft, but they are not (typically) a credentialed industrial patternmaker. They draft from drape and reference more often than from blocks-and-formulas. They sew their own samples or work with one local sample sewer.

## Context

Works alone or with one or two close collaborators. Has a sewing machine, sometimes a serger, access to a home printer or a local print shop for patterns, sometimes a dress form. Tools today: Procreate or pencil-on-paper for sketching; Illustrator or Affinity if more technically minded; Pinterest and Instagram for reference; fabric stores or online for sourcing; paper drafting on a table or directly on a dress form.

The pain they currently feel:

- Drafting from scratch is slow, especially for variations on a known silhouette.
- Buying a similar commercial pattern and modifying it is fast but compromises design intent.
- AI image generators produce pretty pictures, not sewable garments.
- Existing CAD (Optitex, Seamly2D, FreeSewing) requires becoming a CAD operator first.
- Translating a draped sketch into a production-quality flat pattern is a craft most indies haven't fully mastered.

## Quality Bar

**"I can hold this printed pattern, cut it, and make a muslin from it that looks like the garment I sketched."**

Success is measured by a sewing-literate designer holding the export, holding it next to a real reference, and saying "yes, I could work with this." That bar is binary — the muslin works or it doesn't.

## Relationship To The Product

**What they see** (the user surface — garment language enforced):

- The workbench: sketch input + interpretation review + pattern preview + simple 3D sanity check + export.
- The assistant collaborator speaking design language ("I'm assuming a 1cm seam allowance — change?", "the front armhole and back armhole match within 2mm").
- The pattern package: printable PDF (tiled to home-printer pages), SVG, cut sheet with quantities and fold instructions, construction notes in plain sewing language.

**What they do not see** (engine instrumentation — engineer language fine):

- Validation gate state machine, candidate promotion logic, ML helper confidence scores, debug panels, internal data schema, candidate-to-export interop layer, version stamp internals.

**What they bring:**

- A sketch (raster, vector, or photo of a drape).
- A reference image.
- Body measurements (their own or a target body).
- Design intent expressed in garment language.

**What they take away:**

- A printed pattern they can cut and sew.
- A 3D preview screenshot to share with collaborators or Instagram.
- A confidence that the assumptions the system made are visible and editable.

## Version Target

**v0.1 — primary user.** The whole first prototype is for them.

What this persona does *not* need from v0.1: collaboration features, grading, variant generation, industrial export, factory communication, multi-user permissions, tech-pack output. Those are Persona 2 and Persona 3 concerns.

## User Stories

1. **As an indie designer,** I want to upload a reference image of a garment I've sketched and get a first-draft pattern fit to a target body, so that I can skip drafting from scratch and start at "good enough to muslin."

2. **As an indie designer,** I want to print the pattern at true scale on my home printer (tiled across A4 or letter pages), so that I can cut a muslin without going to a print shop.

3. **As an indie designer,** I want to ask the system "make the hem longer" or "lower the neckline" in plain language and see the pattern update, so that I can iterate without learning CAD operations.

4. **As an indie designer,** I want a simple 3D preview of the pattern on a body proxy, so that I can sanity-check the silhouette before cutting fabric.

5. **As an indie designer,** I want the system to tell me when it's making an assumption (about ease, dart placement, closure type, finishing), so that I can correct it before committing to muslin.

6. **As an indie designer,** I want the cut sheet and construction notes to read like a real sewing pattern (cut counts, fold lines, "ease at sleeve cap," "stay-stitch the neckline"), so that I can follow them without translating engineer-speak.

7. **As an indie designer,** I want to start from a photo of fabric I've draped on a dress form, so that I can capture a design that began physically rather than on paper.

8. **As an indie designer,** I want to send the exported pattern PDF to a local sample sewer, so that they can produce my first sample without me explaining the file format.

9. **As an indie designer,** I want to save and revisit my pattern across sessions, so that I can iterate over days or weeks rather than only one sitting.

10. **As an indie designer,** I want the system to flag obvious problems before I print (front armhole won't match the back, pullover neckline too small for the head, hem won't fit the fabric width), so that I don't waste muslin.

## Anti-Stories

- I do **not** want to learn a CAD program first.
- I do **not** want to write code or scripts.
- I do **not** want to see a debug panel or error console with technical jargon.
- I do **not** want to be the first person to test patternmaking math on muslin without warning — when the system isn't sure, I want it to say so.
- I do **not** want my creative process flattened into a wizard with required steps in fixed order.
- I do **not** want the system to silently change my design while it "fixes" it.

## Voice

Garment language, indie / home-sewing dialect.

**Vocabulary they use:** neckline depth, shoulder slope, ease, hem sweep, armhole curve, muslin, dart, facing, binding, basting, stay-stitch, pullover, scoop neck, A-line, princess seam, seam allowance, on-the-fold, cut on bias, cut on grain.

**Vocabulary they don't use:** AAMA, ASTM, DXF, marker layout, grade rules, tolerance, BOM, factory profile, tech pack, PLM. (If those terms appear in the user surface, the language is wrong-shaped for this persona.)

**Tone they expect:** patient, knowledgeable, slightly wry, never condescending. The system is a junior pattern assistant who knows the craft but works for them.

## Example Flows

Eight grounded usage scenarios anchored to specific garment families from `docs/data-corpus/garment-families.json` are written up at [persona-1-example-flows.md](persona-1-example-flows.md). Each flow walks through a real Persona 1 user (indie designer, costume designer, home sewer) bringing input (sketch / photo / vector / drape / finished-garment trace), interacting with the system, and taking away a printable pattern. The flows are scope-defining: if a feature isn't exercised by one of those eight or a close sibling, it's not v0.1 / v0.5 scope.

## Open Questions

- Do they want to share patterns with other indies (community / library)? Probably yes long-term, no in v0.1.
- Do they want commerce integration (sell the pattern as PDF, sell finished garments)? Out of scope for Pattern Lab; that's Kew Studio territory.
- How much do they want the assistant to teach them when they don't know a term? The Kew vision's expert/novice continuum applies — explain when asked, don't lecture by default.
- Privacy: what happens to their uploaded sketches? IP/consent design (Orrery review finding 18) is open and blocks any human-lane upload UX shipping to real users.
