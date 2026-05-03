# Product Design Brief

Date: 2026-05-03

Garment Pattern Lab should not be described as "an AI pipeline for garments." The product is a sketch-to-pattern workbench for fashion designers and sewing-literate makers.

## Product Statement

Garment Pattern Lab turns a designer's garment sketch into a reviewable first-draft sewing pattern: pattern pieces, labels, seam logic, cut instructions, validation notes, and a simple 3D preview.

The system is allowed to use AI, computer vision, geometry kernels, generated sketches, 3D previews, and patternmaking formulas. The user-facing promise is simpler:

**Start with the garment idea. End with a pattern draft a person can inspect, adjust, print, and sew as a sample.**

## Product Differentiator

**Garment Pattern Lab is not another mouse-and-keyboard CAD/3D editor.**

The product should be human-centered, natural-language-led, and as close to art -> garment as the craft allows.

Existing systems such as Optitex, CLO, Browzwear, Lectra, Gerber, Illustrator, and Substance-style editors prove many of the eventual capability pillars. They also ask users to become expert operators inside dense 2D/3D editing environments.

Our opportunity is different:

- make the same pillars task-led
- keep each task narrow enough to review
- validate before export
- expose assumptions in plain language
- let natural language and semantic handles drive the first interaction
- keep direct manipulation as correction, not the whole product

The first successful version should feel less like opening CAD and more like collaborating with a patient pattern assistant: "make the hem longer," "turn this into a square neckline," "show me the seams that do not match," "use a looser woven fit," "make this printable."

## The Real Product

The product is a translation surface between three ways designers think:

- visual idea: sketch, silhouette, proportion, detail, fabric attitude
- pattern logic: panels, seams, darts, grain, allowances, notches, cut counts
- sample reality: can this be cut, assembled, reviewed, and adjusted?

The important experience is not "watch AI generate a dress." It is the feeling that the system can hold a sketch and make it tangible without hiding the craft decisions.

## Primary User

Primary v1 user:

- fashion designer, indie studio, costume designer, advanced home sewer, or sample-room-adjacent maker
- comfortable judging a pattern draft
- not necessarily comfortable drafting every block from scratch
- wants speed from concept to testable sample

They do not want factory CAD first. They want something closer to a patient junior pattern assistant: quick, explicit, editable, and honest about uncertainty.

## Job To Be Done

When I have a garment idea, I want to turn my sketch into a credible first pattern draft, so I can review, adjust, print, and test the design without starting from a blank drafting table.

## V1 Product Promise

For one garment family, the product should:

1. Accept a generated or human-authored front/back sketch.
2. Help the user confirm the important design features.
3. Convert those features into editable garment parameters.
4. Generate a sewing-aware first-draft pattern.
5. Show warnings where the system is unsure.
6. Provide a simple 3D preview for visual sanity checking.
7. Export a human-readable pattern package.

The first useful version can be manual in places. It can ask the user to place landmarks, confirm the neckline, choose dart behavior, or pick a closure assumption. Manual correction is not a failure. Silent guessing is the failure.

## Not The Product

This is not:

- a black-box "generate me clothes" toy
- another mouse-and-keyboard CAD package
- a full Illustrator/Substance-style editor clone
- a 3D mesh flattener with sewing labels added afterward
- commercial factory CAD in v1
- a machine-cutter workflow in v1
- a replacement for patternmaking expertise
- a universal any-garment generator
- a portfolio-fashion image generator

AI-generated sketches are useful fixtures and ideation aids. The product earns trust only when the pattern package explains itself.

## Experience Shape

The v1 screen should feel like a workbench, not a wizard.

Suggested top-level surfaces:

- sketch workspace: upload, generated fixture, trace, landmarks, and semantic confirmation
- garment controls: neckline, armhole, shoulder width, length, hem sweep, ease, dart/closure assumptions
- pattern preview: panels, seam labels, grainlines, notches, cut counts, validation callouts
- model preview: simple 3D sanity check, not photoreal promise
- export package: SVG/PDF, cut sheet, assembly steps, validation report, source JSON

The interface should keep the craft visible. It should show what it inferred, what it knows, what it guessed, and what still needs human judgment.

## First Garment Product Boundary

First garment:

**Sleeveless A-line woven dress/tunic.**

The product can feel real with a narrow garment if the controls are meaningful:

- neckline depth and shape
- shoulder coverage
- armhole depth and curve
- body ease
- tunic/dress length
- hem sweep
- dartless loose body vs bust-dart version
- pullover vs simple back opening assumption
- binding/facing note

The goal is not many garments. The goal is one garment that proves the product grammar.

## Input Product Design

There are two input lanes, but the user should not experience them as technical jargon.

Generated lane:

- user asks for a starter flat or variation
- product stores prompt provenance
- user reviews the generated sketch before it becomes pattern intent
- best for controlled examples and design-space exploration

Human lane:

- user uploads or imports their own sketch/vector
- product helps crop, clean, trace, and mark it
- user confirms the garment details
- best for real designer workflow

Both lanes should converge into the same review moment: "Here is what I think this garment is. Please confirm or correct it."

## Trust Design

Trust comes from visible reasoning, not magic.

The product should always expose:

- source image or generated prompt
- detected landmarks
- inferred garment parameters
- pattern panels
- seam pairs
- cut labels
- validation warnings
- scale proof
- export limitations

The product should use language like:

- "needs review"
- "assumed"
- "confirmed"
- "blocking issue"
- "safe to export"

Avoid language like:

- "perfect fit"
- "production ready"
- "automatically sewable"
- "guaranteed"

## Designer Delight

The delightful moment is not a cinematic render. It is when a loose sketch becomes a pattern sheet with sensible labels and the designer can say, "Oh, I can work with this."

Good v1 delight:

- dragging a hem in the sketch and seeing pattern pieces update
- changing a neckline and seeing the front/back pattern respond
- getting a cut sheet that reads like a real sewing pattern
- seeing seam-length warnings before printing
- comparing the sketch silhouette with a simple 3D preview
- exporting a package that a sewing-literate person can critique

## Product Metric

The core metric is pattern usefulness, not model autonomy.

Prototype success questions:

- Can a human reviewer understand what to cut?
- Are the panel labels and cut counts clear?
- Do paired seams match within tolerance?
- Are assumptions visible?
- Can the user make one meaningful design edit and regenerate?
- Would a sewing-literate reviewer be willing to make a muslin from it?

## Positioning Line

Short version:

**A sketch-to-pattern workbench for fashion designers.**

Long version:

**Garment Pattern Lab turns fashion sketches into reviewable first-draft sewing patterns, keeping AI and 3D preview behind a sewing-aware pattern graph that designers can inspect, correct, print, and sample.**

Internal north-star:

**Do not automate the craft out of sight. Make the craft faster, clearer, and more editable.**

## Adjacent Product Context

Kiko's Kew exploration is adjacent but broader. Kew appears to be investigating a connected apparel and product-development platform across creative vector tools, pattern CAD/3D systems, PLM/tech-pack systems, collaboration, factory communication, launch output, and AI imagery.

Garment Pattern Lab should not copy that scope in v1. The useful shared problem is narrower and important: messy creative input must become editable technical structure without losing designer intent.

Keep [Kew Competitor And Inspiration Shortlist](../reference/KEW-COMPETITOR-SHORTLIST.md) beside this product brief as market and interoperability context. Treat it as possible future unification context, not a current product requirement.

The deeper pass is [Kew Competitor Deep Dive](../reference/KEW-COMPETITOR-DEEP-DIVE.md). Its main product lesson is that Optitex and peer systems prove the eventual capability map, but not the interaction model. Garment Pattern Lab should borrow pillars like grading, fabric checks, marker planning, 3D preview, and tech-pack bridges as narrow validated services rather than rebuilding a full Illustrator/Substance/CAD-style editor stack.

Kiko's sample Kew screenshot is analyzed in [Kew Sample Image Analysis](../reference/KEW-SAMPLE-IMAGE-ANALYSIS.md). It shows a valuable hybrid surface: reference image, croquis grid, body landmarks, technical sketch, and callouts in one project canvas. Pattern Lab should learn from the information architecture, but not copy the whole board UI in v1.
