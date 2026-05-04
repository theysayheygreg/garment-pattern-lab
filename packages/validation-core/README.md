# validation-core

Sewing-aware validation and export gates.

Owns:

- seam length checks
- panel closedness
- self-intersection checks
- grainline/fold-line requirements
- seam allowance/cut-line checks
- label/cut-count checks
- warning/error/limitation reports
- candidate promotion rules

The 3D preview must not make invalid patterns look trustworthy. Validation gates export.

Current v0.1 code:

- `src/readiness.mjs`: backend readiness instrumentation for units, panel closedness, grainlines, labels, seam-pair lengths, and known limitations.
- `src/readiness.test.mjs`: dependency-free smoke test proving the valid v0.1 package passes while bad units and mismatched side seams block readiness.
