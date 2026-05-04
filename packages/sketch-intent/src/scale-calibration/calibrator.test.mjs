import assert from "node:assert/strict";
import fs from "node:fs";
import { ingestSketch } from "../raster-to-vector/bridge.mjs";
import { interpretSketchTrace, loadLandmarkPrior } from "../semantic-interpreter/interpreter.mjs";
import { calibrateScale } from "./calibrator.mjs";

const prior = loadLandmarkPrior();
const canonicalBody = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/fixtures/measurements/canonical-misses-8.json", "utf8"));

const frontBackTrace = ingestSketch("packages/sketch-intent/fixtures/a-line-tunic-front-back-semantic-flat.svg");
const frontBackInterpretation = interpretSketchTrace(frontBackTrace, { prior });
const overrideCalibrated = calibrateScale({
  trace: frontBackTrace,
  interpretation: frontBackInterpretation,
  canonicalBody,
  override: { inchesPerSourceUnit: 0.1, reason: "test override" },
});
assert.equal(overrideCalibrated.scaleCalibration.unitProfile.scaleStatus, "override");
assert.equal(overrideCalibrated.scaleCalibration.unitProfile.mmPerSourceUnit, 2.54);
assert.equal(overrideCalibrated.coordinateProfile.physicalScaleKnown, true);
assert.equal(overrideCalibrated.landmarkSet.scaledPanels.length, 2);

const figurelessCalibrated = calibrateScale({
  trace: frontBackTrace,
  interpretation: frontBackInterpretation,
  canonicalBody,
});
assert.equal(figurelessCalibrated.scaleCalibration.unitProfile.scaleStatus, "default-fallback");
assert.equal(figurelessCalibrated.coordinateProfile.physicalScaleKnown, false);
assert.ok(figurelessCalibrated.scaleCalibration.warnings[0].includes("No figure"));

const referenceTrace = ingestSketch("packages/sketch-intent/fixtures/a-line-tunic-scale-reference-semantic-flat.svg");
const referenceInterpretation = interpretSketchTrace(referenceTrace, { prior });
const referenceCalibrated = calibrateScale({ trace: referenceTrace, interpretation: referenceInterpretation, canonicalBody });
assert.equal(referenceCalibrated.scaleCalibration.unitProfile.scaleStatus, "calibrated");
assert.equal(referenceCalibrated.scaleCalibration.evidence.sourceRef, "figure-height-reference");
assert.ok(Math.abs(referenceCalibrated.scaleCalibration.unitProfile.inchesPerSourceUnit - 0.11) < 0.001);
assert.ok(Math.abs(referenceCalibrated.scaleCalibration.unitProfile.mmPerSourceUnit - 2.794) < 0.001);

console.log("sketch-intent scale calibration smoke tests passed");
