import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const runGenerator = (args) =>
  spawnSync(process.execPath, ["garments/a-line-dress-tunic/src/generate.mjs", ...args], {
    encoding: "utf8",
  });

const accepted = runGenerator([
  "--check",
  "--output",
  "v0.1-from-sketch",
  "--source-sketch",
  "packages/sketch-intent/fixtures/a-line-tunic-scale-reference-semantic-flat.svg",
]);
assert.equal(accepted.status, 0, accepted.stderr || accepted.stdout);
assert.match(accepted.stdout, /ready-for-human-sanity-check/);

const refused = runGenerator([
  "--check",
  "--output",
  "v0.1-refused-sketch",
  "--source-sketch",
  "packages/sketch-intent/fixtures/clean-technical-flat.svg",
  "--scale-inches-per-source-unit",
  "0.1",
]);
assert.equal(refused.status, 1);
assert.match(refused.stderr, /Drafting request refused/);
assert.match(refused.stderr, /shoulder_left/);
assert.match(refused.stderr, /shoulder_right/);

console.log("a-line dress/tunic sketch pipeline smoke tests passed");
