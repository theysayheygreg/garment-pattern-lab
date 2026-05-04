import assert from "node:assert/strict";
import fs from "node:fs";
import { buildStaticAssemblySceneData } from "./static-assembly-scene.mjs";

const pattern = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/outputs/v0.1/dev-artifacts/pattern-graph.json", "utf8"));
const scene = buildStaticAssemblySceneData(pattern);

assert.equal(scene.schemaVersion, "0.1-static-assembly-scene");
assert.equal(scene.panels.length, 2);
assert.deepEqual(
  scene.panels.map((panel) => panel.id),
  ["front-half", "back-half"],
);
assert.deepEqual(
  scene.panels.map((panel) => panel.side),
  ["front", "back"],
);
assert.ok(scene.panels[0].position.z > 0);
assert.ok(scene.panels[1].position.z < 0);
assert.deepEqual(
  scene.seamPairs.map((pair) => pair.id),
  ["shoulder-seams", "side-seams"],
);
assert.ok(scene.bodyProxy.height > 0.5);
assert.ok(scene.bodyProxy.shoulderWidth > 0.2);

console.log("preview-3d static assembly scene smoke tests passed");
