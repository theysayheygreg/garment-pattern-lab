import assert from "node:assert/strict";
import fs from "node:fs";
import { buildPreview } from "./package-builders.mjs";

const pattern = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/outputs/v0.1/dev-artifacts/pattern-graph.json", "utf8"));
const readiness = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/outputs/v0.1/dev-artifacts/readiness.json", "utf8"));
const html = buildPreview(pattern, readiness);

assert.match(html, /THREE/);
assert.match(html, /<canvas id="static-assembly-preview"/);
assert.match(html, /front-half/);
assert.match(html, /back-half/);
assert.match(html, /side-seams/);
assert.match(html, /shoulder-seams/);
assert.match(html, /ready-for-human-sanity-check/);

console.log("export-core preview HTML smoke tests passed");
