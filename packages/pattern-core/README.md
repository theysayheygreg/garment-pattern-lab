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

Current v0.1 code:

- `src/measurements.mjs`: shared numeric helpers for point distance, path length, named edge measurements, and panel width.
