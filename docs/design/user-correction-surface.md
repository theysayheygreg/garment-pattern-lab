# User Correction Surface — Design Sketch

Date: 2026-05-04
Status: v0.5 design exploration; not v0.1 scope
Companion to: [`docs/project/V0.1-DESIGN.md`](../project/V0.1-DESIGN.md), the persona docs at [`docs/design/personas/`](personas/), and the bespoke-model research at [`docs/research/bespoke-model-opportunities-2026-05-03.md`](../research/bespoke-model-opportunities-2026-05-03.md).

The v0.1 spec explicitly defers a manual landmark correction surface to v0.5. This doc sketches what it should look like when it lands. It is not a build spec; it's a shape commitment so future implementation work has a real target.

## Why This Surface Matters

In v0.1, the pipeline is one-shot. When semantic interpretation is low-confidence, the system best-guesses and surfaces assumptions; when it can't even produce a best-guess, it hard-refuses. The developer iterates by changing the input or tweaking heuristics.

That model is workable for the first prototype because the operator is Greg. But for Persona 1 (Individual Fashion Designer) to actually use the product directly, refusal can't be a dead end and assumptions can't be silent. The user needs a way to say "this curve isn't the hem, this one is."

The user correction surface is what closes that loop. It turns most v0.1 hard-refuse cases into "soft pause for user input" instead of "halt and bother the developer."

## The Asymptote — Why This Feature Gets Used Less Over Time

This surface is the most-used in early versions and the least-used in late versions. Three forces drive that:

1. **The V-Model trains on corrections.** Per the bespoke-model research, every user correction is a labeled training signal: the system thought X, the user said Y, here is the input. Aggregated, these become DPO / GRPO training data for the V-Model. As the model's accuracy improves, fewer landmarks need correction.
2. **The heuristic priors evolve.** The `garment-family-landmark-priors.json` rule weights and thresholds get tuned based on observed correction patterns. Common errors get rules added; brittle rules get refined.
3. **The garment-family vocabulary grows.** When new garment families are added, their priors land already-good (informed by what we learned tuning the A-line tunic).

The product target is **a system that asks for fewer corrections each release, until correction is something users do only at the edges of the design space (drape photos, unusual silhouettes, asymmetric inputs)**. Early-version users do real interpretation labor; late-version users mostly confirm.

This is why the surface needs to be designed well from the start. Early users are doing labor that pays forward to all later users.

## The Five Operations

Every correction maps to one of these operation types in the DAG:

| Operation | What the user does | When |
|---|---|---|
| **landmark_correct(curve_id, new_label)** | Change a curve's assigned label | System tagged this curve as the hem; user says it's a styling line |
| **landmark_remove(curve_id)** | Mark a curve as not a pattern feature | Decorative trim, surface-design line, watermark |
| **landmark_add(geometry, label)** | Add a missing landmark the system didn't see | System didn't tag a back neckline at all; user clicks where it is |
| **landmark_confirm(slot_id)** | Accept the system's assumption | "Yes, the bust dart placement looks right" |
| **landmark_adjust(slot_id, new_geometry)** | Fine-tune the position of a landmark | Shoulder endpoint should be slightly inward |

Operations 1–4 are *bounded* — the user picks from the garment-family vocabulary (the 14 landmark slots for an A-line tunic, more for other families). They can't invent arbitrary tags.

Operation 5 (geometry adjust) is fiddlier and tiers:

- **Tier 1: snap-only.** Drag the landmark to nearest existing geometry. Cheapest, most predictable.
- **Tier 2: bounded movement.** Drag within a small radius of the system's guess. Allows refinement without unconstrained editing.
- **Tier 3: free movement.** Drag anywhere. Edge of scope — verges on vector authoring; should remain optional.

For v0.5's first cut, ship Tier 1 of operation 5 plus all of operations 1–4. Add Tier 2 in v0.5.x if user feedback wants finer control. Keep Tier 3 hidden behind an explicit "advanced" flag.

## Mental Model

The user opens the correction surface and sees:

- Their input image as the background.
- The system's vectorized interpretation overlaid: each curve colored by its assigned landmark slot (red = hem, blue = neckline, green = armhole, gray = unlabeled).
- A legend showing the landmark vocabulary for the active garment family.
- Per-slot status badges: ✓ confident, ? assumed, ! missing.
- A confidence indication on each colored curve (transparency, dashed outline, or a small number).

Interactions:

- **Click a colored curve** → see the assigned label → option to change to another label or remove.
- **Click a gray curve** → assign a label.
- **Click an "Add" button on a missing slot** → click in the input to mark where the missing landmark is.
- **Click an "assumed" badge** → see what the system guessed and why; confirm or correct.
- **Drag a landmark point** → fine-tune position (Tier 1: snap to existing geometry).

This is essentially **garment-aware image annotation**. Same UX family as LabelStudio, CVAT, Roboflow — but the label vocabulary is fixed by the active garment family's prior. The user is constrained to garment language, which prevents arbitrary tag invention and keeps the corpus consistent for training.

Everything spoken to the user is in design language, not engineer language. "I'm not sure about the back neckline — please mark it." Not "landmark_neckline_back: confidence 0.18 below threshold 0.6."

## Architecture: Each Correction Is A DAG Operation

Per the operation surface decision (Q3 in the design queue), every user-driven change is an operation node in the workspace DAG with provenance:

```
{
  "operation": "landmark_correct",
  "input": {"curve_id": "trace-path-04", "old_label": "hem_front"},
  "output": {"new_label": "styling_line"},
  "provenance": {
    "source": "user",
    "timestamp": "2026-06-15T14:23:11Z",
    "user_id": "kiko",
    "system_prior_label": "hem_front",
    "system_prior_confidence": 0.42
  }
}
```

This shape matters for two reasons:

1. **Undo / redo / inspect.** Every correction is reversible. Greg or Kiko can scrub back through corrections, see what was changed and why, revert.
2. **Learning loop closure.** The provenance fields (`system_prior_label`, `system_prior_confidence`, the user's correction) are exactly what the V-Model needs as training data. Aggregated across users (with appropriate IP/consent — see Orrery review finding 18), these become the DPO / GRPO corpus.

The DAG isn't user-visible at first — it's internal machinery. v0.5 ships the correction surface; the visible-DAG / revision history work is later (probably v0.5.x or v0.6 when production designers start needing it).

## How Correction Interacts With Hard Refuse

In v0.1, hard refuse halts the pipeline. With a correction surface, hard refuse softens:

- **v0.1 behavior:** confidence below 0.3 floor → pipeline stops, no pattern produced, dev iterates.
- **v0.5+ behavior:** confidence below threshold → pipeline pauses at Stage 3, displays the correction surface with the system's best guesses, the user resolves ambiguity, pipeline continues.

True hard refuse drops to literal pipeline failure: file unreadable, tracer crashed, geometry impossible. Those are rare. Most v0.1 refuse cases become correctable interactions.

## Two Distinct Editing Concepts

Worth being explicit because it's easy to conflate:

| Concept | Persona | Version | Surface |
|---|---|---|---|
| **Interpretation correction** | Persona 1 | v0.5 | Click curves, assign labels, fix what the system thought it saw |
| **Parameter editing** | Persona 2 | v0.5+ | Change garment design choices on a confirmed pattern (hem length, neckline depth, dart placement) |

These are different mental models with different surfaces. Interpretation correction operates on the *input interpretation*; parameter editing operates on the *output design*. They share the DAG but don't share the UI.

Interpretation correction probably ships first because it unblocks more cases (every refusal becomes correctable) and is simpler scope (no operation propagation, no grading interactions, no parameter dependency graph).

## Anti-Patterns To Avoid

- **Don't let correction become freeform vector authoring.** No drawing new bezier curves from scratch. Bounded label vocabulary, bounded geometry adjustments. Freeform vector work belongs upstream in Kew CAD or in tools like Illustrator the designer already uses.
- **Don't auto-correct silently from learned patterns.** As the V-Model trains, it'll get better at first-pass interpretation — but every assumption it makes still surfaces as a confirmable item. The user sees what the system did. The user can accept fast, but the system never hides corrections from the user.
- **Don't share UI between correction (user surface) and the debug overlay (dev surface).** They have different audiences and different language. The correction page speaks garment language; the dev overlay speaks engineer language. Two pages, not one.
- **Don't make the correction surface gated behind low confidence.** It's available *always*, even when the system is confident. A user who disagrees with a confident interpretation should be able to override without the system's confidence blocking them.
- **Don't degrade gracefully into a dialog wizard.** Correction is a workspace, not a flow with required steps. The user picks what to fix in the order that makes sense to them.

## Where It Sits In The Roadmap

- **v0.1:** explicitly out of scope. The dev iterates from instrumentation when the pipeline refuses; users don't see the surface.
- **v0.5:** first-cut user correction surface. Operations 1–4 plus Tier 1 of operation 5. Bounded vocabulary keyed to the active garment family. Per-correction provenance for the learning loop.
- **v0.5.x:** Tier 2 of operation 5 (bounded geometry refinement) if real user feedback wants it.
- **v0.6+:** undo / redo / revision-history surfaces become user-visible (currently they're internal DAG machinery).
- **v1+:** progressively-better V-Model means correction is rarely needed; surface remains for edge cases (drape photos, unusual silhouettes, garment families with novel features).

## Learning Loop Specifics

Per the bespoke-model research, the V-Model trains in three stages:

1. **v0.2:** supervised on synthetic-from-FreeSewing labels distilled from a multimodal-LLM teacher. No real user data.
2. **v0.5:** DPO over the existing correction corpus once it accumulates. Real user corrections become preference signals: the system's first guess was rejected, the user's correction was accepted.
3. **v1:** GRPO on the validation gate as reward, plus the DPO corpus as a base.

The correction surface is what generates the v0.5 → v1 corpus. Without it, the model stays at v0.2's synthetic-only training and never improves on real garment data.

This is the load-bearing reason to ship correction in v0.5 and not delay it: every release without correction is a release that doesn't generate training data.

## Open Questions

- **Confidence visualization.** Transparency, dashed outlines, numeric labels, or some combination? Probably visual cues only (no numbers in the user surface) per the garment-language commitment, but the specific affordance is open.
- **Multi-user correction provenance.** When v0.5 ships with multiple users (each Persona 1 working independently), do their corrections train one shared model or per-user models? Probably one shared, with privacy / IP gating per Orrery review finding 18.
- **Correction granularity for geometry.** Tier 1 (snap-only) vs Tier 2 (bounded movement) vs Tier 3 (free movement) — which tiers ship in v0.5 vs v0.5.x? Probably Tier 1 in v0.5; Tier 2 if feedback wants it.
- **Active-learning loop.** Should the system *ask* the user to correct uncertain landmarks even when it produced a best-guess that passed the threshold? That's an explicit "training mode" toggle — opt-in active learning. Worth considering for v0.6+.
- **Correction history for re-training.** When the user re-runs the pipeline with the same input, do their previous corrections persist? Probably yes — corrections are sticky to the input fingerprint. Worth designing properly during v0.5 implementation.

## References

- [V0.1-DESIGN.md](../project/V0.1-DESIGN.md) — explicitly defers this surface; Stage 3 produces the AmbiguityReport this surface consumes
- [Bespoke-model research](../research/bespoke-model-opportunities-2026-05-03.md) — V-Model staged training depends on correction corpus
- [Persona 1 doc](personas/persona-1-individual-designer.md) — primary user
- [Persona 1 example flows](personas/persona-1-example-flows.md) — Maya's bodice flow, Asha's pajamas flow, etc. all assume some correction surface to be usable
- [Semantic curve interpretation SOA](../research/semantic-curve-interpretation-soa-2026-05-03.md) — heuristic-first interpreter with manual fallback (this surface is the manual fallback)
- [Garment family landmark priors](../data-corpus/garment-family-landmark-priors.json) — defines the bounded vocabulary the user picks from
- [Decision log](../journal/DECISION-LOG.md) — graph topology, operation surface, validation as instrumentation, garment-language voice all underpin this design
