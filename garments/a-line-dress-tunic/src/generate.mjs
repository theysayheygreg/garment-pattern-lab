#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyParameterEdit, buildEditSummary, interpretCommand } from "../../../packages/assistant-core/src/commands.mjs";
import { buildAssembly, buildCutSheet, buildPreview, buildReadinessMd, buildSvg } from "../../../packages/export-core/src/package-builders.mjs";
import { buildMarkerPlan, buildMarkerSvg } from "../../../packages/export-core/src/marker-layout/layout.mjs";
import { measureNamedEdges, round } from "../../../packages/pattern-core/src/measurements.mjs";
import { buildDraftingRequest, projectLegacyGeneratorInputs } from "../../../packages/sketch-intent/src/drafting-adapter/drafting-request.mjs";
import { ingestSketch } from "../../../packages/sketch-intent/src/raster-to-vector/bridge.mjs";
import { calibrateScale } from "../../../packages/sketch-intent/src/scale-calibration/calibrator.mjs";
import { interpretSketchTrace } from "../../../packages/sketch-intent/src/semantic-interpreter/interpreter.mjs";
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

if (sourceSketch) {
  const trace = ingestSketch(path.resolve(process.cwd(), sourceSketch));
  const interpretation = interpretSketchTrace(trace);
  const calibratedInterpretation = calibrateScale({
    trace,
    interpretation,
    canonicalBody,
    override: scaleOverride
      ? {
          inchesPerSourceUnit: Number(scaleOverride),
          reason: "--scale-inches-per-source-unit",
        }
      : undefined,
  });
  const draftingRequest = buildDraftingRequest({
    calibratedInterpretation,
    bodyMeasurementSet: body,
    baseParameters: params,
  });
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

  const seamLine = [
    { id: "center-neck", x: 0, y: neckDepth },
    { id: "neck-shoulder", x: neckWidth, y: 0 },
    { id: "shoulder-point", x: shoulderOuter, y: params.shoulder.drop },
    { id: "armhole-bottom", x: sideAtBust, y: armholeY },
    { id: "bust-side", x: sideAtBust, y: bustY },
    { id: "hip-side", x: sideAtHip, y: hipY },
    { id: "hem-side", x: sideAtHem, y: hemY },
    { id: "center-hem", x: 0, y: hemY },
  ];

  const seamAllowance = params.allowances.seam;
  const hemAllowance = params.allowances.hem;
  const cutLine = [
    { x: 0, y: neckDepth },
    { x: Math.max(0, neckWidth - seamAllowance), y: -seamAllowance },
    { x: shoulderOuter + seamAllowance, y: params.shoulder.drop - seamAllowance },
    { x: sideAtBust + seamAllowance, y: armholeY },
    { x: sideAtBust + seamAllowance, y: bustY },
    { x: sideAtHip + seamAllowance, y: hipY },
    { x: sideAtHem + seamAllowance, y: hemY + hemAllowance },
    { x: 0, y: hemY + hemAllowance },
  ];

  const edges = [
    { id: `${kind}.fold`, type: "fold", from: "center-hem", to: "center-neck" },
    { id: `${kind}.neckline`, type: "finished", from: "center-neck", to: "neck-shoulder" },
    { id: `${kind}.shoulder`, type: "seam", from: "neck-shoulder", to: "shoulder-point" },
    { id: `${kind}.armhole`, type: "finished", from: "shoulder-point", to: "armhole-bottom" },
    { id: `${kind}.side`, type: "seam", from: "armhole-bottom", to: "hem-side" },
    { id: `${kind}.hem`, type: "finished", from: "hem-side", to: "center-hem" },
  ];

  const edgePoints = {
    [`${kind}.shoulder`]: [seamLine[1], seamLine[2]],
    [`${kind}.side`]: [seamLine[3], seamLine[4], seamLine[5], seamLine[6]],
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

if (!checkOnly) {
  fs.mkdirSync(packageDir, { recursive: true });
  fs.mkdirSync(devArtifactsDir, { recursive: true });
  if (outputName === "v0.1") {
    fs.writeFileSync(path.join(garmentRoot, "fixtures", "patterns", "v0.1-candidate.pattern.json"), `${JSON.stringify(pattern, null, 2)}\n`);
    fs.writeFileSync(path.join(garmentRoot, "fixtures", "validation", "v0.1-readiness.json"), `${JSON.stringify(readiness, null, 2)}\n`);
  }
  fs.writeFileSync(path.join(packageDir, "pattern.svg"), buildSvg(pattern, readiness, params).replace(/[ \t]+$/gm, ""));
  fs.writeFileSync(path.join(packageDir, "cut-sheet.md"), buildCutSheet(pattern, params, markerPlan));
  fs.writeFileSync(path.join(packageDir, "assembly.md"), buildAssembly(pattern));
  fs.writeFileSync(path.join(packageDir, "preview.html"), buildPreview(pattern, readiness));
  fs.writeFileSync(path.join(packageDir, "marker.svg"), buildMarkerSvg(pattern, markerPlan));
  fs.writeFileSync(path.join(devArtifactsDir, "pattern-graph.json"), `${JSON.stringify(pattern, null, 2)}\n`);
  fs.writeFileSync(path.join(devArtifactsDir, "marker-plan.json"), `${JSON.stringify(markerPlan, null, 2)}\n`);
  fs.writeFileSync(path.join(devArtifactsDir, "readiness.json"), `${JSON.stringify(readiness, null, 2)}\n`);
  fs.writeFileSync(path.join(devArtifactsDir, "readiness.md"), buildReadinessMd(readiness));
  if (sketchPipeline) {
    fs.writeFileSync(path.join(devArtifactsDir, "editable-trace-layer.json"), `${JSON.stringify(sketchPipeline.trace, null, 2)}\n`);
    fs.writeFileSync(path.join(devArtifactsDir, "sketch-interpretation.json"), `${JSON.stringify(sketchPipeline.interpretation, null, 2)}\n`);
    fs.writeFileSync(path.join(devArtifactsDir, "scale-calibration.json"), `${JSON.stringify(sketchPipeline.calibratedInterpretation.scaleCalibration, null, 2)}\n`);
    fs.writeFileSync(path.join(devArtifactsDir, "drafting-request.json"), `${JSON.stringify(sketchPipeline.draftingRequest, null, 2)}\n`);
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
