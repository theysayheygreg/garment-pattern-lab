# Shift Dress With Darts Benchmark Plan

This benchmark should test whether Pattern Lab can interpret a garment that has more structure than the A-line smoke-test garment.

## Input

`fixtures/sketches/source-sketch.svg`

## Expected Pattern Complexity

- front
- back
- front facing
- back facing

## Pipeline Questions

- Can the pipeline identify and preserve bust darts?
- Can the pipeline identify and preserve waist shaping?
- Can the pipeline identify and preserve dress length?
- Can the pipeline identify and preserve neckline/armhole curves?
- Can the pipeline identify and preserve dart transfer validation?

## Acceptance

- Source sketch is visible beside outputs in `human-output/v0.1-benchmarks/shift-dress-with-darts/`.
- One human guide describes what the benchmark is meant to test.
- Future generated package includes only one human-facing Markdown guide plus visual artifacts.
