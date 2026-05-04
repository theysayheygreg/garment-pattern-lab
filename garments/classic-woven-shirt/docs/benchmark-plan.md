# Classic Woven Shirt Benchmark Plan

This benchmark should test whether Pattern Lab can interpret a garment that has more structure than the A-line smoke-test garment.

## Input

`fixtures/sketches/source-sketch.svg`

## Expected Pattern Complexity

- front left/right
- back
- sleeve
- collar
- collar stand
- cuff
- pocket
- front placket

## Pipeline Questions

- Can the pipeline identify and preserve sleeve cap?
- Can the pipeline identify and preserve collar + stand?
- Can the pipeline identify and preserve placket?
- Can the pipeline identify and preserve pocket placement?
- Can the pipeline identify and preserve many labels and notches?

## Acceptance

- Source sketch is visible beside outputs in `human-output/v0.1-benchmarks/classic-woven-shirt/`.
- One human guide describes what the benchmark is meant to test.
- Future generated package includes only one human-facing Markdown guide plus visual artifacts.
