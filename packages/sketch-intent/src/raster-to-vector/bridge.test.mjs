import assert from "node:assert/strict";
import { ingestSketch } from "./bridge.mjs";

const trace = ingestSketch("packages/sketch-intent/fixtures/clean-technical-flat.svg");

assert.equal(trace.kind, "editable-trace-layer");
assert.equal(trace.engine, "user-svg-passthrough");
assert.equal(trace.provenance.format, "svg");
assert.equal(trace.provenance.recipe, "clean-technical-flat");
assert.equal(trace.layers.silhouette.length, 1);
assert.equal(trace.layers.silhouette[0].id, "outer-silhouette");
assert.equal(trace.layers.interior.length, 2);
assert.equal(trace.layers.annotation.length, 1);

console.log("sketch-intent raster-to-vector bridge smoke tests passed");
