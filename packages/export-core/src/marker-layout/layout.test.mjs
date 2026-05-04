import assert from "node:assert/strict";
import fs from "node:fs";
import { buildMarkerPlan, buildMarkerSvg } from "./layout.mjs";

const pattern = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/outputs/v0.1/dev-artifacts/pattern-graph.json", "utf8"));
const markerPlan = buildMarkerPlan(pattern);
const markerSvg = buildMarkerSvg(pattern, markerPlan);

assert.equal(markerPlan.schemaVersion, "0.1-marker-plan");
assert.equal(markerPlan.fabricWidthMm, 1143);
assert.equal(markerPlan.fabricWidthIn, 45);
assert.equal(markerPlan.placements.length, 2);
assert.deepEqual(
  markerPlan.placements.map((placement) => placement.panelId),
  ["front-half", "back-half"],
);
for (const placement of markerPlan.placements) {
  assert.ok(placement.x + placement.widthMm <= markerPlan.fabricWidthMm, `${placement.panelId} should fit fabric width`);
}
assert.ok(markerPlan.totalFabricLengthMm > markerPlan.placements[0].heightMm);
assert.ok(markerPlan.totalFabricLengthMm > markerPlan.placements[0].heightMm + markerPlan.placements[1].heightMm);
assert.match(markerSvg, /45 in fabric width/);
assert.match(markerSvg, /front-half/);
assert.match(markerSvg, /back-half/);
assert.match(markerSvg, /total length/);

console.log("export-core marker layout smoke tests passed");
