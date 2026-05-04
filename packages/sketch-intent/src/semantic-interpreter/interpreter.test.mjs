import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
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

const pairedTrace = ingestSketch("packages/sketch-intent/fixtures/a-line-tunic-front-back-semantic-flat.svg");
assert.equal(pairedTrace.readiness.status, "ready");
assert.equal(pairedTrace.traceStats.layerCounts.silhouette, 2);

const pairedInterpretation = interpretSketchTrace(pairedTrace, { prior });
assert.equal(pairedInterpretation.ambiguityReport.status, "ready");
assert.equal(pairedInterpretation.views.length, 2);
assert.deepEqual(
  pairedInterpretation.views.map((view) => view.role),
  ["front", "back"],
);
assert.equal(pairedInterpretation.landmarkSet.panels.length, 2);
assert.equal(pairedInterpretation.landmarkSet.slotsByView.front.neckline_front.curveId, "front-neckline");
assert.equal(pairedInterpretation.landmarkSet.slotsByView.back.neckline_back.curveId, "back-neckline");
assert.equal(pairedInterpretation.landmarkSet.slotsByView.back.center_back.curveId, "back-center-axis");
assert.equal(pairedInterpretation.sketchIntent.views.length, 2);
assert.equal(pairedInterpretation.sketchIntent.views[1].view, "back");
assert.deepEqual(pairedInterpretation.sketchIntent.neckline.from, ["lm.front.neckline", "lm.back.neckline"]);

const backOnly = interpretSketchTrace(pairedTrace, { prior, view: "back" });
assert.equal(backOnly.views.length, 1);
assert.equal(backOnly.views[0].role, "back");
assert.ok(Object.hasOwn(backOnly.landmarkSet.slots, "hem_back"));
assert.ok(Object.hasOwn(backOnly.landmarkSet.slots, "neckline_back"));
assert.ok(Object.hasOwn(backOnly.landmarkSet.slots, "center_back"));
assert.equal(Object.hasOwn(backOnly.landmarkSet.slots, "neckline_front"), false);
assert.equal(backOnly.landmarks.every((landmark) => landmark.id.startsWith("lm.back.")), true);

const singleSideTrace = ingestSketch("packages/sketch-intent/fixtures/a-line-tunic-single-side-semantic-flat.svg");
assert.equal(singleSideTrace.readiness.status, "ready");
const singleSideInterpretation = interpretSketchTrace(singleSideTrace, { prior });
assert.equal(singleSideInterpretation.ambiguityReport.status, "review-needed");
assert.equal(singleSideInterpretation.landmarkSet.slots.shoulder_left.status, "assigned");
assert.equal(singleSideInterpretation.landmarkSet.slots.shoulder_right.status, "assumed");
assert.equal(singleSideInterpretation.landmarkSet.slots.shoulder_right.source, "mirrored-from-axis");
assert.equal(singleSideInterpretation.landmarkSet.slots.armhole_right.source, "mirrored-from-axis");
assert.equal(singleSideInterpretation.landmarkSet.slots.side_seam_right.source, "mirrored-from-axis");
assert.ok(singleSideInterpretation.ambiguityReport.items.some((item) => item.slotId === "shoulder_right"));
const shoulderRightTrace = singleSideInterpretation.interpretationTrace.panels[0].scoreTables.find((table) => table.slotId === "shoulder_right");
assert.equal(shoulderRightTrace.selectedCandidateId, "front-right-shoulder");
assert.equal(shoulderRightTrace.selectedSource, "mirrored-from-axis");
assert.ok(shoulderRightTrace.candidates.some((candidate) => candidate.candidateId === "front-left-shoulder" && candidate.source === "trace"));
assert.ok(shoulderRightTrace.candidates.some((candidate) => candidate.consideration === "filtered"));

const tmpDir = path.join("tmp", "semantic-interpreter");
fs.mkdirSync(tmpDir, { recursive: true });
const strayDartPath = path.join(tmpDir, "stray-dart.svg");
fs.writeFileSync(
  strayDartPath,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500">
    <path id="body-silhouette" data-gpl-role="silhouette" d="M 100 50 L 200 50 L 250 450 L 50 450 Z" fill="none" stroke="#111" />
    <path id="neckline" d="M 115 55 C 130 95 170 95 185 55" fill="none" stroke="#111" />
    <path id="left-shoulder" d="M 100 50 L 115 55" fill="none" stroke="#111" />
    <path id="right-shoulder" d="M 185 55 L 200 50" fill="none" stroke="#111" />
    <path id="left-armhole" d="M 100 50 C 90 90 84 130 84 170" fill="none" stroke="#111" />
    <path id="right-armhole" d="M 200 50 C 210 90 216 130 216 170" fill="none" stroke="#111" />
    <path id="left-side-seam" d="M 84 170 C 76 280 62 370 50 450" fill="none" stroke="#111" />
    <path id="right-side-seam" d="M 216 170 C 224 280 238 370 250 450" fill="none" stroke="#111" />
    <line id="hem" x1="50" y1="450" x2="250" y2="450" stroke="#111" />
    <line id="center-front" x1="150" y1="75" x2="150" y2="450" stroke="#111" />
    <line id="left-dart-stray" x1="95" y1="210" x2="130" y2="225" stroke="#111" />
  </svg>`,
);
const strayDartInterpretation = interpretSketchTrace(ingestSketch(strayDartPath), { prior });
assert.equal(strayDartInterpretation.landmarkSet.slots.bust_dart_left.status, "needs-confirmation");
assert.equal(strayDartInterpretation.landmarkSet.slots.bust_dart_right.status, "not-present");

console.log("sketch-intent semantic interpreter smoke tests passed");
