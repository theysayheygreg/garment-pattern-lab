import assert from "node:assert/strict";
import fs from "node:fs";
import { buildPackageManifest } from "./package-builders.mjs";
import { buildMarkerPlan } from "./marker-layout/layout.mjs";

const pattern = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/outputs/v0.1/dev-artifacts/pattern-graph.json", "utf8"));
const readiness = JSON.parse(fs.readFileSync("garments/a-line-dress-tunic/outputs/v0.1/dev-artifacts/readiness.json", "utf8"));
const markerPlan = buildMarkerPlan(pattern);
const manifest = buildPackageManifest(pattern, readiness, markerPlan);

assert.equal(manifest.schemaVersion, "0.1-package-manifest");
assert.equal(manifest.readiness, "ready-for-human-sanity-check");
assert.ok(manifest.packageFiles.some((file) => file.path === "package/pattern.svg"));
assert.ok(manifest.packageFiles.some((file) => file.path === "package/marker.svg"));
assert.equal(manifest.devFiles.some((file) => file.path === "dev-artifacts/debug-overlay.html"), false);
assert.equal(manifest.devFiles.some((file) => file.path === "dev-artifacts/interpretation-trace.json"), false);
assert.equal(manifest.marker.fabricWidthIn, 45);
assert.ok(manifest.knownMissing.includes("pattern.pdf tiled home-print export"));

const sketchManifest = buildPackageManifest(pattern, readiness, markerPlan, { hasSketchPipeline: true });
assert.ok(sketchManifest.devFiles.some((file) => file.path === "dev-artifacts/debug-overlay.html"));
assert.ok(sketchManifest.devFiles.some((file) => file.path === "dev-artifacts/interpretation-trace.json"));

console.log("export-core package manifest smoke tests passed");
