import assert from "node:assert/strict";
import fs from "node:fs";
import { buildReadiness } from "./readiness.mjs";

const pattern = JSON.parse(
  fs.readFileSync("garments/a-line-dress-tunic/outputs/v0.1/dev-artifacts/pattern-graph.json", "utf8"),
);

const valid = buildReadiness(pattern);
assert.equal(valid.overallState, "ready-for-human-sanity-check");
assert.equal(valid.checks.find((check) => check.id === "units.mm").state, "ready");
assert.equal(valid.checks.find((check) => check.id === "marker.plan").state, "ready");
assert.equal(valid.instrumentation.marker.fabricWidthIn, 45);
assert.equal(valid.instrumentation.assumptionCount, pattern.assumptions.length);

const sketchPattern = structuredClone(pattern);
sketchPattern.source.sourceSketch = "packages/sketch-intent/fixtures/a-line-tunic-scale-reference-semantic-flat.svg";
sketchPattern.source.draftingRequestState = "draftable";
sketchPattern.source.scaleStatus = "calibrated";
const sketchReadiness = buildReadiness(sketchPattern);
assert.equal(sketchReadiness.checks.find((check) => check.id === "pipeline.drafting-request").state, "ready");
assert.equal(sketchReadiness.instrumentation.sketchPipeline.scaleStatus, "calibrated");

const badUnits = structuredClone(pattern);
badUnits.units = "in";
const badUnitsReadiness = buildReadiness(badUnits);
assert.equal(badUnitsReadiness.overallState, "not-ready");
assert.equal(badUnitsReadiness.checks.find((check) => check.id === "units.mm").state, "blocker");

const mismatchedSideSeam = structuredClone(pattern);
mismatchedSideSeam.panels.find((panel) => panel.role === "back").edgeMeasurements.side += 50;
const mismatchedSideReadiness = buildReadiness(mismatchedSideSeam);
assert.equal(mismatchedSideReadiness.overallState, "not-ready");
assert.equal(
  mismatchedSideReadiness.checks.find((check) => check.id === "side-seams.length").state,
  "blocker",
);

console.log("validation-core readiness smoke tests passed");
