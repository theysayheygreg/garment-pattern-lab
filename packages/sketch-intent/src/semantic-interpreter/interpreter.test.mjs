import assert from "node:assert/strict";
import { ingestSketch } from "../raster-to-vector/bridge.mjs";
import { interpretSketchTrace, loadLandmarkPrior } from "./interpreter.mjs";

const prior = loadLandmarkPrior();
assert.equal(prior.family.id, "sleeveless-a-line-woven-tunic");
assert.ok(prior.knownImplementabilityGaps.length >= 5);

const semanticTrace = ingestSketch("packages/sketch-intent/fixtures/a-line-tunic-semantic-flat.svg");
const semanticInterpretation = interpretSketchTrace(semanticTrace, { prior });

assert.equal(semanticInterpretation.kind, "sketch-interpretation");
assert.equal(semanticInterpretation.garmentFamily.id, "sleeveless-a-line-woven-tunic");
assert.equal(semanticInterpretation.coordinateProfile.physicalScaleKnown, false);
assert.equal(semanticInterpretation.coordinateProfile.yAxis, "down");
assert.equal(semanticInterpretation.views[0].id, "view.front");
assert.equal(semanticInterpretation.ambiguityReport.status, "ready");
assert.equal(semanticInterpretation.landmarkSet.unitProfile.scaleStatus, "unscaled");

for (const slotId of [
  "hem_front",
  "neckline_front",
  "shoulder_left",
  "shoulder_right",
  "armhole_left",
  "armhole_right",
  "side_seam_left",
  "side_seam_right",
  "center_front",
]) {
  assert.equal(semanticInterpretation.landmarkSet.slots[slotId].status, "assigned", slotId);
  assert.ok(semanticInterpretation.landmarkSet.slots[slotId].confidence >= 0.6, slotId);
}

assert.equal(semanticInterpretation.landmarkSet.slots.neckline_front.curveId, "front-neckline");
assert.equal(semanticInterpretation.landmarkSet.slots.armhole_left.curveId, "left-armhole");
assert.equal(semanticInterpretation.landmarkSet.slots.armhole_right.curveId, "right-armhole");
assert.equal(semanticInterpretation.landmarkSet.slots.bust_dart_left.status, "not-present");
assert.ok(semanticInterpretation.landmarks.some((landmark) => landmark.id === "lm.front.neckline"));

const sparseTrace = ingestSketch("packages/sketch-intent/fixtures/clean-technical-flat.svg");
const sparseInterpretation = interpretSketchTrace(sparseTrace, { prior });
assert.equal(sparseInterpretation.kind, "sketch-interpretation");
assert.equal(sparseInterpretation.ambiguityReport.status, "blocked");
assert.equal(sparseInterpretation.landmarkSet.slots.shoulder_left.status, "missing");
assert.equal(sparseInterpretation.landmarkSet.slots.armhole_left.source, "derived-from-silhouette");
assert.ok(sparseInterpretation.ambiguityReport.items.some((item) => item.slotId === "shoulder_left"));

console.log("sketch-intent semantic interpreter smoke tests passed");
