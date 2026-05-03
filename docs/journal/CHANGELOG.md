# Changelog

## 2026-05-03

- Created initial LBH-style project structure.
- Added README and agent notes.
- Added product plan.
- Added first-garment spec.
- Added roadmap to first prototype.
- Added build plan, project board, and project state file.
- Added dependency map and research queue.
- Added reference bibliography.
- Added UV-to-pattern architecture note.
- Added software landscape and fundamentals notes.
- Added initial decision log and devlog.
- Added local full PDF copy of `Computational Pattern Making from 3D Garment Models` from arXiv.
- Added deep paper ingest note for `Computational Pattern Making from 3D Garment Models`.
- Added `docs/project/KNOWLEDGE-GRAPH.md`.
- Updated product plan, roadmap, dependencies, research queue, build plan, project board, backlog, UV notes, fundamentals, decision log, and devlog with sewing-aware validation concepts from the paper.
- Added deep ingest notes for patternmaking fundamentals, commercial software, open/free tools, UV geometry workflows, and remaining research papers.
- Expanded the product knowledge graph with secondary-ingest nodes and edges for pattern programs, parametric tools, industrialization metadata, UV boundaries, datasets, multimodal generation, and ML representations.
- Added local Graphite and Blender setup notes plus a pipeline plan for 2D sketch, 3D preview/render, and pattern flats.
- Added browser-native Three.js/WebGPU/WASM pipeline plan for an ownable 2D reference -> 3D model -> flats -> pattern product lane.
- Added AI sketch and 3D exploration lanes for GPT Image 2 sketch corpus generation, modern image-to-3D candidate frameworks, and visual-corpus evaluation.
- Refined the third AI exploration lane into a garment-type pattern-reference corpus for construction correctness examples.
- Added candidate-to-export interop layer for measuring, correcting, validating, and round-tripping pattern candidates before SVG/PDF/DXF export.
- Expanded interop with canonical millimeter units, scale proof, and marker/fabric-roll layout planning.
- Added a consolidated deep-dive synthesis for candidate proof, browser geometry kernels, marker optimization, visual corpus truth levels, GPT Image 2 sketch generation, and image-to-3D candidate frameworks.
- Expanded the product knowledge graph with `PatternKernel`, `GeometryKernel`, WASM/WebGPU runtime nodes, marker optimizer metrics, visual corpus truth/licensing nodes, image-to-3D mesh quality nodes, and SVG/DXF semantic round-trip fixtures.
- Updated the research queue and project state with the next concrete spikes: pattern kernel contracts, visual corpus schema, marker optimizer interface, SVG semantic profile, and SPAR3D/Hunyuan comparison.
- Promoted the twelve remaining research areas into a formal research roadmap inside `docs/project/ROADMAP.md`.
- Added a thirteenth research lane for designer sketch-to-model editing, including raster/vector sketch layers, surface projections, PBR-style material preview layers, edit classification, and live model feedback.
- Refined the designer editing lane into a smaller v1: edit concrete sketch features such as shoulder opening, armhole, neckline, side silhouette, hem length, and hem sweep, then map those edits to garment parameters before regenerating pattern/model feedback.
- Started executing the research roadmap with a dependency/prior-art pass across drafting, schema, validation, geometry, SVG, marker planning, visual corpus, image-to-3D, commercial interop, and designer editing.
- Added `DEPENDENCY-REGISTER.md`, `EXAMPLE-NEEDS.md`, and `roadmap-research-pass-2026-05-03.md`.
- Expanded references with FreeSewing core/dev docs, GarmentCode repo/specs, browser geometry libraries, marker/nesting libraries, visual corpus sources, image-to-3D frameworks, and designer/PBR prior art.
