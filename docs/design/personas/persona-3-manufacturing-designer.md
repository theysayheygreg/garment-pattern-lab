# Persona 3: Manufacturing-Focused Designer

Date: 2026-05-03

**Version target: v1+ — primary user when industrial export and factory-facing tooling land.**

The user the export interop layer (DXF/AAMA/ASTM, marker compliance, multilingual factory instructions, tech-pack composition) ultimately serves. v0.1 and v0.5 do not try to serve them.

## Identity

Technical designer, production manager, factory liaison, sample-room manager, or industrial patternmaker. The person responsible for making sure design intent survives the factory translation. Has deep production knowledge: fabric behavior under specific machines, hardware feasibility, marker layout, cutting tolerances, industry-standard exchange formats, factory-specific constraints. Often the person caught between brand expectations and factory reality.

## Context

Works closely with one or more factories, often across countries and languages. Tools today: Gerber AccuMark or Optitex for production CAD; Excel and proprietary spec sheets for tolerance specs; email, WeChat, factory portals for communication; CLO 3D for fit verification; sometimes Adobe Illustrator for tech sketches inherited from Persona 2.

The pain they currently feel:

- Design-intent drift through too many translations: brand sketch → tech sketch → pattern → graded set → marker → factory CAD → CNC cut → sample. Each translation can lose information.
- File-format incompatibility between brand tools and factory tools. AccuMark dialect differences, layer number conventions, missing tolerance specs at export.
- Tolerance specs that don't survive export (notch tolerance, seam allowance consistency, grade rule integrity).
- Manual marker validation: does this pattern fit on a 60-inch fabric roll with reasonable utilization? Is the grain correct? Are pieces nested without overlap?
- Multilingual factory communication where construction notes lose meaning in translation, or where translated text isn't a first-class artifact (it's a side document or a verbal handoff).
- Sample QA disputes that can't be traced back to design intent — "why does this seam pucker?" without a provenance trail.

## Quality Bar

**"The factory accepts this pattern without rework, the marker meets fabric utilization targets, the tech pack matches the manufactured sample."**

Success here is measured in factory-rework rate, fabric utilization, sample-pass-on-first-attempt rate, and dispute traceability.

## Relationship To The Product

**What they see** (the user surface — production and manufacturing language):

- A review and approve interface over patterns released by Persona 2.
- Export controls: DXF / AAMA-292 / ASTM-D6673 / Optitex round-trip / AccuMark output, with factory-specific profiles.
- Marker layout tools: fabric-roll-aware nesting, grain alignment, fold-mode, nap direction, utilization metrics.
- Tech-pack composition: BOM, construction notes, fabric specs, size run, hardware, finishing — assembled and exportable.
- Multilingual factory-facing instructions: pattern piece labels, construction notes, callouts, with translated text under English.
- Approval gates: draft → reviewed → released → in-production → archived, with provenance maintained across stages.
- Tolerance compliance verification: notch tolerance, seam allowance, grade rule integrity, format conformance.

**What they do not see** (same as the other personas — engine internals are invisible).

**What they bring:**

- Factory profiles (machine capabilities, fabric roll widths, allowed deviations, format dialect requirements).
- Tolerance specs from the brand or QA standards.
- Translation glossaries for multilingual instructions.
- Sample feedback to feed back into pattern revisions.

**What they take away:**

- Industrial-compliant export files for the factory's specific CAD/CAM stack.
- Marker plans matching factory fabric and machine constraints.
- Tech packs assembled from the pattern's structured data, multilingual where needed.
- Audit trail from brand intent through manufactured sample.

## Version Target

**v1+. Explicitly deferred from v0.1 and v0.5.**

What v1+ adds for them: industrial export dialects, marker-making integration (libnest2d / Deepnest / commercial nesting), tech-pack composition, multilingual instruction support, factory-profile management, approval gate workflow with provenance, tolerance compliance validation as a per-target gate threshold.

What stays out even at v1+: live multi-party factory portal collaboration, ERP/PLM integration with brand systems, ML-assisted defect detection on samples (those are deeper Kew Lifecycle territory).

## User Stories

1. **As a manufacturing designer,** I want to export pattern files in DXF / AAMA-292 / ASTM-D6673 with my factory's required tolerances and layer conventions, so that the factory's CNC cutter and pattern CAD accept the file without rework.

2. **As a manufacturing designer,** I want the marker layout to respect fabric roll width, grainline tolerance, fold mode, and nap direction, so that fabric consumption matches our cost target and the marker passes factory QA.

3. **As a manufacturing designer,** I want the pattern's tech pack to include construction notes in the factory's primary language alongside English, so that miscommunication doesn't cause rework.

4. **As a manufacturing designer,** I want the system to validate tolerance compliance before export (notch tolerance, seam allowance consistency, grade rule integrity, layer assignment), so that I don't ship a pattern that will fail QA.

5. **As a manufacturing designer,** I want approval gates between draft → released → in-production → archived, so that only validated patterns reach the factory and prior versions stay traceable.

6. **As a manufacturing designer,** I want to compare a measured sample's spec against the pattern's intended spec, so that I can trace fit drift back to its source (cutting? sewing? grading? pattern?).

7. **As a manufacturing designer,** I want to maintain a library of approved factory profiles (machine capabilities, fabric roll widths, allowed deviations, dialect requirements), so that exports are factory-specific rather than generic.

8. **As a manufacturing designer,** I want pattern revisions to maintain provenance back to designer intent, so that QA disputes can be traced to a specific design choice rather than vanishing into "the factory got it wrong."

## Anti-Stories

- I do **not** want to manage the design itself; that's upstream (Persona 1 and Persona 2 territory).
- I do **not** want a creative tool; I want a verification, validation, and export pipeline that respects the work upstream.
- I do **not** want to redo work the production designer already did; my job is translation fidelity, not redesign.
- I do **not** want to learn a new file format my factories don't accept; the system must speak DXF / AAMA / ASTM (and eventually Optitex / AccuMark round-trip), not invent a new exchange format.
- I do **not** want to lose tolerance specs at export; tolerance is content, not formatting.
- I do **not** want to manually translate construction notes per factory.

## Voice

Production and manufacturing language.

**Vocabulary they use:** all of Persona 2's vocabulary, plus DXF, AAMA-292, ASTM-D6673, AccuMark, Modaris, Optitex round-trip, marker, marker utilization, fabric roll width, selvage allowance, nap, grainline tolerance, notch tolerance, grade rule integrity, fold mode, CNC cut, plotter cut, factory profile, machine capability, dialect.

**Tone they expect:** precise, no-nonsense, audit-trail-friendly. The system is a verification partner, not a creative collaborator. They want it to refuse exports that fail tolerance compliance and to be specific about why.

## Open Questions

- Which industrial export dialects come first? Most likely DXF/AAMA-292 (Adobe Illustrator AAMA layer convention is the most widely supported), then DXF/ASTM-D6673, then Optitex round-trip if license/format permits.
- What's the relationship between Pattern Lab's internal `PatternGraph` and existing factory CAD systems? Round-trip fidelity is the goal; what's lost in translation is the open research.
- Multilingual instructions: which languages first? Mandarin, Spanish, Vietnamese, Bengali, Turkish are common factory languages. The Kew vision named this; Pattern Lab inherits it as a v1+ commitment.
- Marker-making: build native (libnest2d via WASM) or integrate with existing (AccuNest, Optitex marker, Deepnest)? Persona 3 wants something that works at their factory; the implementation detail matters less than the output.
- Approval gates and provenance: Onshape-shape feature-tree provenance is the model studied. v1 implementation depth is open.
- Sample-feedback loop: how does measured-sample data flow back into pattern revisions? Probably manual annotation in v1, automated comparison later.
