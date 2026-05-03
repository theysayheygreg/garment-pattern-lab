# Decision Log

> What we considered, what we chose, what remains open.

## 2026-05-03: Prototype starts with one garment type

**Question:** Should the first prototype attempt arbitrary garment generation or one constrained garment?

**Options considered:**

- Any sketch to any garment.
- Start with a simple skirt.
- Start with a T-shirt.
- Start with a sleeveless A-line woven dress/tunic.

**Where it landed:** Start with a sleeveless A-line woven dress/tunic.

**Why:** It proves the meaningful pipeline while avoiding the worst first-pass complexity: sleeves, collars, plackets, multi-layer construction, and knit stretch. It still exercises pattern fundamentals: body measurements, ease, shoulder/side seams, armholes, neckline, hem sweep, grainline, notches, and cut instructions.

**Door status:** Closed for prototype 1. Open after prototype review.

## 2026-05-03: Pattern grammar is the source of truth

**Question:** Should the system generate a 3D mesh first and UV unwrap it into pattern pieces?

**Options considered:**

- Generate 3D mesh first, then flatten/UV unwrap.
- Generate 2D pattern first, then simulate.
- Hybrid: infer semantic topology, generate pattern, use 3D preview to validate and refine.

**Where it landed:** Hybrid, with pattern grammar as the source of truth.

**Why:** UV unwrap produces 2D islands, not necessarily sewable panels. Sewing patterns need semantic seams, ease, darts, grainline, notches, seam allowance, cut labels, and construction logic. 3D validation matters, but it should test the pattern rather than invent the pattern alone.

**Door status:** Closed as architecture principle. Open for which exact representation to use.

## 2026-05-03: Manual landmarking is acceptable before automation

**Question:** Does prototype 1 need fully automatic sketch parsing?

**Options considered:**

- Full auto sketch-to-pattern immediately.
- Manual measurement-only pattern generator.
- Semi-automatic sketch workflow with manual landmark fallback.

**Where it landed:** Semi-automatic path, with manual landmarking acceptable in the first prototype.

**Why:** The project must prove the output grammar before betting on ambiguous visual inference. Manual landmarking still tests the sketch-to-parameter bridge and gives useful training/evaluation data for later automation.

**Door status:** Open. Replace pieces with automation only after the generated pattern is credible.

## 2026-05-03: Paper ingest adds validation requirements, not a new prototype route

**Question:** Should `Computational Pattern Making from 3D Garment Models` change prototype 1 from pattern-grammar-first to 3D-mesh-first?

**Options considered:**

- Switch prototype 1 to mesh-first and attempt sewing-aware flattening.
- Keep prototype 1 pattern-grammar-first and use the paper as validation/schema guidance.
- Split immediately into two prototype branches.

**Where it landed:** Keep prototype 1 pattern-grammar-first. Use the paper to deepen the schema, validation model, and future mesh-to-pattern research branch.

**Why:** The paper assumes a 3D garment mesh already exists. Greg's original product idea starts from a sketch and needs a first credible export path. The paper is extremely valuable, but mostly because it names the sewing-aware constraints that normal UV workflows miss: seam reflection symmetry, darts, grain alignment, anisotropic textile deformation, patch complexity, and multi-pose seam placement.

**Door status:** Closed for prototype 1. Open as a future research branch after the pattern graph and validation/export stack exist.
