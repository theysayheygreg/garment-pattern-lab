# Sleeveless Top With Facing Benchmark Plan

This benchmark should test whether Pattern Lab can interpret a garment that has more structure than the A-line smoke-test garment.

## Input

`fixtures/sketches/source-sketch.svg`

## Expected Pattern Complexity

- front
- back
- front facing
- back facing

## Pipeline Questions

- Can the pipeline identify and preserve shorter hem?
- Can the pipeline identify and preserve facing geometry?
- Can the pipeline identify and preserve neck/armhole relationship?
- Can the pipeline identify and preserve side seam shaping?

## Acceptance

- Source sketch is visible beside outputs in `human-output/v0.1-benchmarks/sleeveless-top-with-facing/`.
- One human guide describes what the benchmark is meant to test.
- Future generated package includes only one human-facing Markdown guide plus visual artifacts.
