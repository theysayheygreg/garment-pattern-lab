import assert from "node:assert/strict";
import fs from "node:fs";
import { buildDebugOverlayHtml } from "./package-builders.mjs";
import { ingestSketch } from "../../sketch-intent/src/raster-to-vector/bridge.mjs";
import { buildDraftingRequest } from "../../sketch-intent/src/drafting-adapter/drafting-request.mjs";
import { calibrateScale } from "../../sketch-intent/src/scale-calibration/calibrator.mjs";
import { interpretSketchTrace, loadLandmarkPrior } from "../../sketch-intent/src/semantic-interpreter/interpreter.mjs";

const prior = loadLandmarkPrior();
const bodyMeasurementSet = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/fixtures/measurements/v0.1-body.json", "utf8"));
const canonicalBody = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/fixtures/measurements/canonical-misses-8.json", "utf8"));
const baseParameters = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/fixtures/parameters/v0.1-parameters.json", "utf8"));
const trace = ingestSketch("packages/sketch-intent/fixtures/a-line-tunic-single-side-semantic-flat.svg");
const interpretation = interpretSketchTrace(trace, { prior });
const calibratedInterpretation = calibrateScale({
  trace,
  interpretation,
  canonicalBody,
  override: { inchesPerSourceUnit: 0.1, reason: "debug overlay test" },
});
const draftingRequest = buildDraftingRequest({ calibratedInterpretation, bodyMeasurementSet, baseParameters });
const html = buildDebugOverlayHtml({
  trace,
  interpretation,
  calibratedInterpretation,
  draftingRequest,
  readiness: { overallState: "test-ready" },
});

assert.match(html, /Sketch Debug Overlay/);
assert.match(html, /armhole_right/);
assert.match(html, /assumed/);
assert.match(html, /front-right-armhole/);
assert.match(html, /Scale/);
assert.match(html, /override/);
assert.match(html, /draftable-with-warnings/);

console.log("export-core debug overlay smoke tests passed");
