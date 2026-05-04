import assert from "node:assert/strict";
import fs from "node:fs";
import { ingestSketch } from "../raster-to-vector/bridge.mjs";
import { interpretSketchTrace, loadLandmarkPrior } from "../semantic-interpreter/interpreter.mjs";
import { calibrateScale } from "../scale-calibration/calibrator.mjs";
import { buildDraftingRequest, projectLegacyGeneratorInputs } from "./drafting-request.mjs";

const prior = loadLandmarkPrior();
const bodyMeasurementSet = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/fixtures/measurements/v0.1-body.json", "utf8"));
const canonicalBody = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/fixtures/measurements/canonical-misses-8.json", "utf8"));
const baseParameters = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/fixtures/parameters/v0.1-parameters.json", "utf8"));

const referenceTrace = ingestSketch("packages/sketch-intent/fixtures/a-line-tunic-scale-reference-semantic-flat.svg");
const referenceInterpretation = interpretSketchTrace(referenceTrace, { prior });
const referenceCalibrated = calibrateScale({ trace: referenceTrace, interpretation: referenceInterpretation, canonicalBody });
const draftable = buildDraftingRequest({ calibratedInterpretation: referenceCalibrated, bodyMeasurementSet, baseParameters });
assert.equal(draftable.promotion.state, "draftable");
assert.equal(draftable.units, "mm");
assert.equal(draftable.scaleProfile.sourceToMm, 2.794);
assert.equal(draftable.designParameters.sourceDesignEvidence.neckline.front.curveId, "front-neckline");

const unscaledRefused = buildDraftingRequest({ calibratedInterpretation: referenceInterpretation, bodyMeasurementSet, baseParameters });
assert.equal(unscaledRefused.promotion.state, "refused");
assert.ok(unscaledRefused.promotion.blockers.includes("scaleProfile.missing"));

const blockedTrace = ingestSketch("packages/sketch-intent/fixtures/clean-technical-flat.svg");
const blockedInterpretation = interpretSketchTrace(blockedTrace, { prior });
const blockedCalibrated = calibrateScale({ trace: blockedTrace, interpretation: blockedInterpretation, canonicalBody, override: { inchesPerSourceUnit: 0.1 } });
const blockedRequest = buildDraftingRequest({ calibratedInterpretation: blockedCalibrated, bodyMeasurementSet, baseParameters });
assert.equal(blockedRequest.promotion.state, "refused");
assert.ok(blockedRequest.promotion.blockers.includes("landmark.front.shoulder_left.missing"));
assert.ok(blockedRequest.promotion.blockers.includes("landmark.front.shoulder_right.missing"));

const mirroredTrace = ingestSketch("packages/sketch-intent/fixtures/a-line-tunic-single-side-semantic-flat.svg");
const mirroredInterpretation = interpretSketchTrace(mirroredTrace, { prior });
const mirroredCalibrated = calibrateScale({ trace: mirroredTrace, interpretation: mirroredInterpretation, canonicalBody, override: { inchesPerSourceUnit: 0.1 } });
const mirroredRequest = buildDraftingRequest({ calibratedInterpretation: mirroredCalibrated, bodyMeasurementSet, baseParameters });
assert.equal(mirroredRequest.promotion.state, "draftable-with-warnings");
assert.ok(mirroredRequest.evidence.assumptions.some((assumption) => assumption.slot === "armhole_right"));
assert.ok(mirroredRequest.designParameters.sourceDesignEvidence.mirroredAssumptions.includes("armhole_right"));

const legacyInputs = projectLegacyGeneratorInputs(draftable);
assert.equal(legacyInputs.bodyMeasurementSet.id, "synthetic-body-v0.1");
assert.equal(legacyInputs.garmentParameters.units, "mm");

console.log("sketch-intent drafting request adapter smoke tests passed");
