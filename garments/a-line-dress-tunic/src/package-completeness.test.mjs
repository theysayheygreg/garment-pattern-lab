import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const garmentRoot = path.resolve("garments/a-line-dress-tunic");

const requiredPackages = [
  {
    output: "v0.1",
    packageFiles: [
      "overview.md",
      "pattern.svg",
      "marker.svg",
      "cut-sheet.md",
      "assembly.md",
      "human-sanity-check.md",
      "preview.html",
      "manifest.json",
    ],
    devFiles: ["pattern-graph.json", "marker-plan.json", "readiness.json", "readiness.md"],
  },
  {
    output: "v0.1-from-sketch",
    packageFiles: [
      "overview.md",
      "pattern.svg",
      "marker.svg",
      "cut-sheet.md",
      "assembly.md",
      "human-sanity-check.md",
      "preview.html",
      "manifest.json",
    ],
    devFiles: [
      "pattern-graph.json",
      "marker-plan.json",
      "readiness.json",
      "readiness.md",
      "editable-trace-layer.json",
      "sketch-interpretation.json",
      "interpretation-trace.json",
      "scale-calibration.json",
      "drafting-request.json",
      "debug-overlay.html",
    ],
  },
];

const requiredHumanOutputs = [
  {
    output: "a-line-dress-tunic-from-sketch",
    files: ["guide.md", "pattern.svg", "preview.html", "source-sketch.svg", "manifest.json"],
  },
];

for (const spec of requiredPackages) {
  const outputRoot = path.join(garmentRoot, "outputs", spec.output);
  for (const file of spec.packageFiles) {
    assertFile(path.join(outputRoot, "package", file));
  }
  for (const file of spec.devFiles) {
    assertFile(path.join(outputRoot, "dev-artifacts", file));
  }

  const manifest = readJson(path.join(outputRoot, "package", "manifest.json"));
  assert.equal(manifest.readiness, "ready-for-human-sanity-check");
  assert(manifest.packageFiles.some((file) => file.path === "package/overview.md"));
  assert(manifest.packageFiles.some((file) => file.path === "package/human-sanity-check.md"));
  assert(manifest.packageFiles.some((file) => file.path === "package/pattern.svg"));
  assert(manifest.packageFiles.some((file) => file.path === "package/marker.svg"));

  const patternSvg = fs.readFileSync(path.join(outputRoot, "package", "pattern.svg"), "utf8");
  assert.match(patternSvg, /2 in scale square/);
  assert.match(patternSvg, /CUT 1 ON FOLD/);
  assert(patternSvg.split("L ").length > 60, "Expected higher-resolution sampled pattern curves.");

  const sanitySheet = fs.readFileSync(path.join(outputRoot, "package", "human-sanity-check.md"), "utf8");
  assert.match(sanitySheet, /2 in scale square/);
  assert.match(sanitySheet, /Check head entry/);
  assert.match(sanitySheet, /muslin/);

  const cutSheet = fs.readFileSync(path.join(outputRoot, "package", "cut-sheet.md"), "utf8");
  assert.match(cutSheet, /Print at 100% scale/);
  assert.match(cutSheet, /Body Fixture/);
  assert.match(cutSheet, /Finished Draft Measurements/);
  assert.match(cutSheet, /do not add extra seam allowance at fold/);
  assert.match(cutSheet, /tiled home-print PDF is still missing/);
  assert.match(cutSheet, /Units: imperial-first/);
  assert.match(cutSheet, /in \(/);

  const overview = fs.readFileSync(path.join(outputRoot, "package", "overview.md"), "utf8");
  assert.match(overview, /one-file front door/);
  assert.match(overview, /Garment Snapshot/);
  assert.match(overview, /Shape Fidelity Note/);
}

for (const spec of requiredHumanOutputs) {
  const outputRoot = path.resolve("human-output", "v0.1", spec.output);
  for (const file of spec.files) {
    assertFile(path.join(outputRoot, file));
  }
  const guide = fs.readFileSync(path.join(outputRoot, "guide.md"), "utf8");
  assert.match(guide, /This is the human-facing v0.1 review guide/);
  assert.match(guide, /Source sketch:/);
  assert.match(guide, /The marker file is kept in developer\/package output for now/);
  assert.match(guide, /Units|Body Fixture|Finished Draft Measurements/);
  const sourceSketch = fs.readFileSync(path.join(outputRoot, "source-sketch.svg"), "utf8");
  assert.match(sourceSketch, /<svg/);
}

const sketchPattern = readJson(
  path.join(garmentRoot, "outputs", "v0.1-from-sketch", "dev-artifacts", "pattern-graph.json"),
);
for (const panel of sketchPattern.panels) {
  for (const seamPoint of panel.seamLine) {
    assert(
      pointIsInsideOrOnPolygon(seamPoint, panel.cutLine),
      `${panel.id} seam point ${seamPoint.id ?? `${seamPoint.x},${seamPoint.y}`} falls outside cut line`,
    );
  }
}
assert.equal(
  sketchPattern.source.sourceSketch,
  "packages/sketch-intent/fixtures/a-line-tunic-scale-reference-semantic-flat.svg",
);
assert.deepEqual(
  sketchPattern.source.stageTimings.map((stage) => stage.id),
  ["sketch.ingest", "sketch.interpret", "sketch.scale-calibrate", "sketch.drafting-request"],
);

console.log("a-line dress/tunic package completeness smoke tests passed");

function assertFile(filePath) {
  assert(fs.existsSync(filePath), `Missing ${filePath}`);
  assert(fs.statSync(filePath).size > 0, `Empty ${filePath}`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function pointIsInsideOrOnPolygon(point, polygon) {
  if (polygon.some((vertex) => distance(point, vertex) < 0.01)) return true;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    if (distanceToSegment(point, polygon[j], polygon[i]) < 0.01) return true;
  }
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    const crosses = a.y > point.y !== b.y > point.y;
    if (crosses) {
      const xAtY = ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
      if (point.x < xAtY) inside = !inside;
    }
  }
  return inside;
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function distanceToSegment(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return distance(point, a);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared));
  return distance(point, { x: a.x + t * dx, y: a.y + t * dy });
}
