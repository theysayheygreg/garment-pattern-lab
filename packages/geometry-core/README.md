# geometry-core

Reusable geometry boundary.

Owns the `GeometryKernel` interface before the project commits to a specific implementation.

Planned operations:

- curve length
- curve sampling
- offsets for seam/cut lines
- intersections
- closedness/self-intersection checks
- polygon booleans after curve flattening
- triangulation support for preview

Initial implementation can use TypeScript libraries. WASM/WebGPU are upgrade paths, not v1 assumptions.
