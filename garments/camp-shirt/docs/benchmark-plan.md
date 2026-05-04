# Camp Shirt Benchmark Plan

This benchmark should test whether Pattern Lab can interpret a garment that has more structure than the A-line smoke-test garment.

## Input

`fixtures/sketches/source-sketch.svg`

## Expected Pattern Complexity

- front left/right
- back
- short sleeve
- camp collar
- facing
- pocket

## Pipeline Questions

- Can the pipeline identify and preserve open collar?
- Can the pipeline identify and preserve front facing?
- Can the pipeline identify and preserve short sleeve cap?
- Can the pipeline identify and preserve button front?
- Can the pipeline identify and preserve hem shape?

## Acceptance

- Source sketch is visible beside outputs in `human-output/v0.1-benchmarks/camp-shirt/`.
- One human guide describes what the benchmark is meant to test.
- Future generated package includes only one human-facing Markdown guide plus visual artifacts.
