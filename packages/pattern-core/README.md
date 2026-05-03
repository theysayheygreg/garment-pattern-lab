# pattern-core

Garment-agnostic pattern data model and transformations.

Owns:

- `PatternGraph`
- `PatternGraphCandidate`
- `MeasurementSet`
- `GarmentParameters`
- panels, edges, seams, darts, notches, grainlines, labels, allowances
- version/provenance fields

Garment programs generate candidates here; validation decides whether they can become trusted graphs.
