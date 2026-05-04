#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { applyParameterEdit, buildEditSummary, interpretCommand } from "../../../packages/assistant-core/src/commands.mjs";
import { buildAssembly, buildCutSheet, buildDebugOverlayHtml, buildHumanSanityCheck, buildPackageManifest, buildPackageOverview, buildPreview, buildReadinessMd, buildSvg } from "../../../packages/export-core/src/package-builders.mjs";
import { buildMarkerPlan, buildMarkerSvg } from "../../../packages/export-core/src/marker-layout/layout.mjs";
import { measureNamedEdges, round } from "../../../packages/pattern-core/src/measurements.mjs";
import { buildDraftingRequest, projectLegacyGeneratorInputs } from "../../../packages/sketch-intent/src/drafting-adapter/drafting-request.mjs";
import { ingestSketch } from "../../../packages/sketch-intent/src/raster-to-vector/bridge.mjs";
import { calibrateScale } from "../../../packages/sketch-intent/src/scale-calibration/calibrator.mjs";
import { buildInterpretationTraceArtifact, interpretSketchTrace } from "../../../packages/sketch-intent/src/semantic-interpreter/interpreter.mjs";
import { buildReadiness } from "../../../packages/validation-core/src/readiness.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const garmentRoot = path.resolve(__dirname, "..");
const checkOnly = process.argv.includes("--check");
const argValue = (name) => {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1];
};
const outputName = argValue("--output") ?? "v0.1";
const sourceCommand = argValue("--command");
const sourceSketch = argValue("--source-sketch");
const scaleOverride = argValue("--scale-inches-per-source-unit");
const outputDir = path.join(garmentRoot, "outputs", outputName);
const packageDir = path.join(outputDir, "package");
const devArtifactsDir = path.join(outputDir, "dev-artifacts");

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(garmentRoot, relativePath), "utf8"));

const body = readJson("fixtures/measurements/v0.1-body.json");
const canonicalBody = readJson("fixtures/measurements/canonical-misses-8.json");
let params = readJson("fixtures/parameters/v0.1-parameters.json");
let editIntent = null;
let sketchPipeline = null;
const stageTimings = [];
const stableTimings = process.env.GPL_STABLE_TIMINGS === "1";

const timeStage = (id, run) => {
  const startedAt = performance.now();
  const result = run();
  const durationMs = stableTimings ? 0 : Math.round((performance.now() - startedAt) * 100) / 100;
  stageTimings.push({ id, durationMs });
  return result;
};

if (sourceSketch) {
  const trace = timeStage("sketch.ingest", () => ingestSketch(path.resolve(process.cwd(), sourceSketch)));
  const interpretation = timeStage("sketch.interpret", () => interpretSketchTrace(trace));
  const calibratedInterpretation = timeStage("sketch.scale-calibrate", () => calibrateScale({
    trace,
    interpretation,
    canonicalBody,
    override: scaleOverride
      ? {
          inchesPerSourceUnit: Number(scaleOverride),
          reason: "--scale-inches-per-source-unit",
        }
      : undefined,
  }));
  const draftingRequest = timeStage("sketch.drafting-request", () => buildDraftingRequest({
    calibratedInterpretation,
    bodyMeasurementSet: body,
    baseParameters: params,
  }));
  if (draftingRequest.promotion.state === "refused") {
    console.error(`Drafting request refused: ${draftingRequest.promotion.blockers.join(", ")}`);
    process.exit(1);
  }
  params = projectLegacyGeneratorInputs(draftingRequest).garmentParameters;
  sketchPipeline = { trace, interpretation, calibratedInterpretation, draftingRequest };
}

if (sourceCommand) {
  const applied = applyParameterEdit(params, interpretCommand(sourceCommand));
  params = applied.params;
  editIntent = applied.intent;
}

const makePanel = (kind) => {
  const bustQuarter = (body.measurements.bust + params.ease.bust) / 4;
  const hipQuarter = (body.measurements.hip + params.ease.hip) / 4;
  const hemQuarter = params.silhouette.hemSweep / 4;
  const shoulderOuter = body.measurements.shoulderWidth / 2 - params.shoulder.neckToShoulderInset;
  const neckWidth = params.neckline.width;
  const neckDepth = kind === "front" ? params.neckline.frontDepth : params.neckline.backDepth;
  const armholeY = params.armhole.depth;
  const bustY = armholeY + 35;
  const hipY = body.measurements.hipDepth;
  const hemY = params.length;
  const sideAtHem = hemQuarter;
  const sideAtHip = hipQuarter;
  const sideAtBust = bustQuarter;

  const centerNeck = { id: "center-neck", x: 0, y: neckDepth };
  const neckShoulder = { id: "neck-shoulder", x: neckWidth, y: 0 };
  const shoulderPoint = { id: "shoulder-point", x: shoulderOuter, y: params.shoulder.drop };
  const armholeBottom = { id: "armhole-bottom", x: sideAtBust, y: armholeY };
  const bustSide = { id: "bust-side", x: sideAtBust, y: bustY };
  const hipSide = { id: "hip-side", x: sideAtHip, y: hipY };
  const hemSide = { id: "hem-side", x: sideAtHem, y: hemY };
  const centerHem = { id: "center-hem", x: 0, y: hemY };

  const seamLine = [
    centerNeck,
    ...sampleQuadratic(centerNeck, { x: neckWidth * 0.18, y: neckDepth * 0.2 }, neckShoulder, 8),
    shoulderPoint,
    ...sampleCubic(
      shoulderPoint,
      { x: shoulderOuter + 22, y: params.shoulder.drop + 58 },
      { x: sideAtBust - 22, y: armholeY - 62 },
      armholeBottom,
      14,
    ),
    bustSide,
    ...sampleCubic(
      bustSide,
      { x: sideAtBust + 10, y: bustY + 120 },
      { x: sideAtHip - 18, y: hipY - 120 },
      hipSide,
      10,
    ),
    ...sampleQuadratic(hipSide, { x: (sideAtHip + sideAtHem) / 2 + 26, y: (hipY + hemY) / 2 }, hemSide, 12),
    centerHem,
  ];

  const seamAllowance = params.allowances.seam;
  const hemAllowance = params.allowances.hem;
  const cutLine = buildApproximateCutLine(seamLine, seamAllowance, hemAllowance);

  const edges = [
    { id: `${kind}.fold`, type: "fold", from: "center-hem", to: "center-neck" },
    { id: `${kind}.neckline`, type: "finished", from: "center-neck", to: "neck-shoulder" },
    { id: `${kind}.shoulder`, type: "seam", from: "neck-shoulder", to: "shoulder-point" },
    { id: `${kind}.armhole`, type: "finished", from: "shoulder-point", to: "armhole-bottom" },
    { id: `${kind}.side`, type: "seam", from: "armhole-bottom", to: "hem-side" },
    { id: `${kind}.hem`, type: "finished", from: "hem-side", to: "center-hem" },
  ];

  const edgePoints = {
    [`${kind}.shoulder`]: [neckShoulder, shoulderPoint],
    [`${kind}.side`]: seamLine.slice(
      seamLine.findIndex((point) => point.id === "armhole-bottom"),
      seamLine.findIndex((point) => point.id === "hem-side") + 1,
    ),
  };

  return {
    id: `${kind}-half`,
    name: `${kind === "front" ? "Front" : "Back"} half panel`,
    role: kind,
    cut: { count: 1, onFold: true },
    seamLine,
    cutLine,
    edges,
    edgeMeasurements: measureNamedEdges({
      shoulder: edgePoints[`${kind}.shoulder`],
      side: edgePoints[`${kind}.side`],
    }),
    grainline: {
      id: `${kind}.grainline`,
      x: round(Math.min(90, sideAtBust * 0.35)),
      y1: 120,
      y2: hemY - 120,
      direction: "parallel-to-center-fold",
    },
    labels: [
      {
        text: `${kind === "front" ? "FRONT" : "BACK"} - CUT 1 ON FOLD`,
        x: round(Math.min(110, sideAtBust * 0.45)),
        y: round(hemY * 0.48),
      },
    ],
  };
};

function sampleQuadratic(start, control, end, steps) {
  return Array.from({ length: steps }, (_, index) => {
    const t = (index + 1) / steps;
    return {
      ...(index === steps - 1 && end.id ? { id: end.id } : {}),
      x: round((1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x),
      y: round((1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y),
    };
  });
}

function sampleCubic(start, controlA, controlB, end, steps) {
  return Array.from({ length: steps }, (_, index) => {
    const t = (index + 1) / steps;
    return {
      ...(index === steps - 1 && end.id ? { id: end.id } : {}),
      x: round(
        (1 - t) ** 3 * start.x
          + 3 * (1 - t) ** 2 * t * controlA.x
          + 3 * (1 - t) * t ** 2 * controlB.x
          + t ** 3 * end.x,
      ),
      y: round(
        (1 - t) ** 3 * start.y
          + 3 * (1 - t) ** 2 * t * controlA.y
          + 3 * (1 - t) * t ** 2 * controlB.y
          + t ** 3 * end.y,
      ),
    };
  });
}

function buildApproximateCutLine(seamLine, seamAllowance, hemAllowance) {
  const direction = signedArea(seamLine) >= 0 ? 1 : -1;
  return seamLine.map((point, index) => {
    const prev = seamLine[(index - 1 + seamLine.length) % seamLine.length];
    const next = seamLine[(index + 1) % seamLine.length];
    const isFold = point.id === "center-neck" || point.id === "center-hem" || point.x === 0;
    const isHem = point.id === "hem-side" || point.id === "center-hem";
    const outward = averagedOutwardNormal(prev, point, next, direction);
    const offset = isFold ? 0 : seamAllowance;
    return {
      ...(point.id ? { id: `${point.id}-cut` } : {}),
      x: round(isFold ? 0 : point.x + outward.x * offset),
      y: round(point.y + outward.y * offset + (isHem ? hemAllowance : 0)),
    };
  });
}

function averagedOutwardNormal(prev, point, next, direction) {
  const incoming = outwardNormal({ x: point.x - prev.x, y: point.y - prev.y }, direction);
  const outgoing = outwardNormal({ x: next.x - point.x, y: next.y - point.y }, direction);
  const x = incoming.x + outgoing.x;
  const y = incoming.y + outgoing.y;
  const length = Math.hypot(x, y);
  if (length < 0.0001) return outgoing;
  return { x: x / length, y: y / length };
}

function outwardNormal(edge, direction) {
  const length = Math.hypot(edge.x, edge.y) || 1;
  return direction >= 0
    ? { x: edge.y / length, y: -edge.x / length }
    : { x: -edge.y / length, y: edge.x / length };
}

function signedArea(points) {
  return points.reduce((area, point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    return area + previous.x * point.y - point.x * previous.y;
  }, 0) / 2;
}

const panels = [makePanel("front"), makePanel("back")];

const seamPairs = [
  {
    id: "shoulder-seams",
    edges: ["front.shoulder", "back.shoulder"],
    tolerance: params.validation.seamLengthTolerance,
  },
  {
    id: "side-seams",
    edges: ["front.side", "back.side"],
    tolerance: params.validation.seamLengthTolerance,
  },
];

const pattern = {
  schemaVersion: "0.1-dirty-spike",
  id: outputName === "v0.1" ? "a-line-dress-tunic-v0.1" : `a-line-dress-tunic-${outputName}`,
  title:
    outputName === "v0.1"
      ? "Sleeveless A-line Woven Dress/Tunic v0.1"
      : `Sleeveless A-line Woven Dress/Tunic ${outputName}`,
  status: "candidate",
  units: "mm",
  source: {
    generator: "garments/a-line-dress-tunic/src/generate.mjs",
    bodyMeasurementSet: "fixtures/measurements/v0.1-body.json",
    garmentParameters: "fixtures/parameters/v0.1-parameters.json",
    ...(sourceSketch
      ? {
          sourceSketch,
          draftingRequestState: sketchPipeline.draftingRequest.promotion.state,
          scaleStatus: sketchPipeline.draftingRequest.scaleProfile?.scaleStatus ?? "missing",
          stageTimings,
        }
      : {}),
    ...(editIntent ? { parameterEdit: editIntent } : {}),
  },
  bodyMeasurementSet: body,
  garmentParameters: params,
  patternMeasurements: {
    front: panels[0].edgeMeasurements,
    back: panels[1].edgeMeasurements,
    fullHemSweep: params.silhouette.hemSweep,
    finishedLength: params.length,
  },
  panels,
  seamPairs,
  construction: [
    "Cut front and back half panels on fold.",
    "Finish neckline and armholes with bias binding or facing.",
    "Join shoulder seams.",
    "Join side seams.",
    "Turn hem allowance and stitch.",
  ],
  assumptions: [
    "Dartless loose woven fit for v0.1.",
    "No closure modeled; neckline/opening must be reviewed for head entry.",
    "Front and back side seams are intentionally matched for the dirty spike.",
    "Seam allowance is simplified with rough cut-line expansion, not robust geometric offsetting.",
    ...(sketchPipeline?.draftingRequest.promotion.warnings ?? []),
  ],
};

const markerPlan = buildMarkerPlan(pattern);
pattern.markerPlan = markerPlan;

const readiness = buildReadiness(pattern);
if (process.env.GPL_GENERATED_AT) readiness.generatedAt = process.env.GPL_GENERATED_AT;

if (!checkOnly) {
  fs.mkdirSync(packageDir, { recursive: true });
  fs.mkdirSync(devArtifactsDir, { recursive: true });
  if (outputName === "v0.1") {
    fs.writeFileSync(path.join(garmentRoot, "fixtures", "patterns", "v0.1-candidate.pattern.json"), `${JSON.stringify(pattern, null, 2)}\n`);
    fs.writeFileSync(path.join(garmentRoot, "fixtures", "validation", "v0.1-readiness.json"), `${JSON.stringify(readiness, null, 2)}\n`);
  }
  fs.writeFileSync(path.join(packageDir, "overview.md"), buildPackageOverview(pattern, readiness, markerPlan));
  fs.writeFileSync(path.join(packageDir, "pattern.svg"), buildSvg(pattern, readiness, params).replace(/[ \t]+$/gm, ""));
  fs.writeFileSync(path.join(packageDir, "cut-sheet.md"), buildCutSheet(pattern, params, markerPlan));
  fs.writeFileSync(path.join(packageDir, "assembly.md"), buildAssembly(pattern));
  fs.writeFileSync(path.join(packageDir, "human-sanity-check.md"), buildHumanSanityCheck(pattern, readiness, markerPlan));
  fs.writeFileSync(path.join(packageDir, "preview.html"), buildPreview(pattern, readiness));
  fs.writeFileSync(path.join(packageDir, "marker.svg"), buildMarkerSvg(pattern, markerPlan));
  fs.writeFileSync(path.join(packageDir, "manifest.json"), `${JSON.stringify(buildPackageManifest(pattern, readiness, markerPlan, { hasSketchPipeline: Boolean(sketchPipeline) }), null, 2)}\n`);
  fs.writeFileSync(path.join(devArtifactsDir, "pattern-graph.json"), `${JSON.stringify(pattern, null, 2)}\n`);
  fs.writeFileSync(path.join(devArtifactsDir, "marker-plan.json"), `${JSON.stringify(markerPlan, null, 2)}\n`);
  fs.writeFileSync(path.join(devArtifactsDir, "readiness.json"), `${JSON.stringify(readiness, null, 2)}\n`);
  fs.writeFileSync(path.join(devArtifactsDir, "readiness.md"), buildReadinessMd(readiness));
  if (sketchPipeline) {
    fs.writeFileSync(path.join(devArtifactsDir, "editable-trace-layer.json"), `${JSON.stringify(sketchPipeline.trace, null, 2)}\n`);
    fs.writeFileSync(path.join(devArtifactsDir, "sketch-interpretation.json"), `${JSON.stringify(sketchPipeline.interpretation, null, 2)}\n`);
    fs.writeFileSync(path.join(devArtifactsDir, "interpretation-trace.json"), `${JSON.stringify(buildInterpretationTraceArtifact(sketchPipeline.interpretation), null, 2)}\n`);
    fs.writeFileSync(path.join(devArtifactsDir, "scale-calibration.json"), `${JSON.stringify(sketchPipeline.calibratedInterpretation.scaleCalibration, null, 2)}\n`);
    fs.writeFileSync(path.join(devArtifactsDir, "drafting-request.json"), `${JSON.stringify(sketchPipeline.draftingRequest, null, 2)}\n`);
    fs.writeFileSync(path.join(devArtifactsDir, "debug-overlay.html"), buildDebugOverlayHtml({ ...sketchPipeline, readiness }));
  }
  if (editIntent) {
    fs.writeFileSync(path.join(devArtifactsDir, "edit-intent.json"), `${JSON.stringify(editIntent, null, 2)}\n`);
    fs.writeFileSync(path.join(devArtifactsDir, "edit-summary.md"), buildEditSummary(editIntent));
  }
}

if (readiness.overallState !== "ready-for-human-sanity-check") {
  console.error(readiness.designerSummary);
  process.exit(1);
}

console.log(`Generated ${pattern.title}: ${readiness.overallState}`);
