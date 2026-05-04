# Tank With Facing Benchmark Plan

This benchmark should test whether Pattern Lab can interpret a garment that has more structure than the A-line smoke-test garment.

## Input

`fixtures/sketches/source-sketch.svg`

## Expected Pattern Complexity

- front
- back
- front facing
- back facing

## Pipeline Questions

- Can the pipeline identify and preserve armhole curve?
- Can the pipeline identify and preserve neckline curve?
- Can the pipeline identify and preserve separate facing pieces?
- Can the pipeline identify and preserve clean finish instructions?

## Acceptance

- Source sketch is visible beside outputs in `human-output/v0.1-benchmarks/tank-with-facing/`.
- One human guide describes what the benchmark is meant to test.
- Future generated package includes only one human-facing Markdown guide plus visual artifacts.
