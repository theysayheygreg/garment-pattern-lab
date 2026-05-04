import fs from "node:fs";
import { ingestSketch } from "../raster-to-vector/bridge.mjs";
import { interpretSketchTrace } from "../semantic-interpreter/interpreter.mjs";
import { calibrateScale } from "./calibrator.mjs";

const DEFAULT_FIXTURES = [
  "packages/sketch-intent/fixtures/a-line-tunic-front-back-semantic-flat.svg",
  "packages/sketch-intent/fixtures/a-line-tunic-scale-reference-semantic-flat.svg",
];
const DEFAULT_CANONICAL_BODY = "garments/a-line-dress-tunic/fixtures/measurements/canonical-misses-8.json";

const files = process.argv.slice(2);
const canonicalBody = JSON.parse(fs.readFileSync(DEFAULT_CANONICAL_BODY, "utf8"));
const report = (files.length > 0 ? files : DEFAULT_FIXTURES).map((filePath) => {
  const trace = ingestSketch(filePath);
  const interpretation = interpretSketchTrace(trace);
  const calibrated = calibrateScale({ trace, interpretation, canonicalBody });
  return {
    sourcePath: filePath,
    traceReadiness: trace.readiness.status,
    interpretationStatus: interpretation.ambiguityReport.status,
    scaleStatus: calibrated.scaleCalibration.unitProfile.scaleStatus,
    confidence: calibrated.scaleCalibration.unitProfile.confidence,
    inchesPerSourceUnit: calibrated.scaleCalibration.unitProfile.inchesPerSourceUnit,
    mmPerSourceUnit: calibrated.scaleCalibration.unitProfile.mmPerSourceUnit,
    evidence: calibrated.scaleCalibration.evidence,
    warnings: calibrated.scaleCalibration.warnings,
    scaledPanels: calibrated.landmarkSet.scaledPanels,
  };
});

console.log(JSON.stringify({ schemaVersion: "0.1-phase-d-scale-report", generatedAt: new Date().toISOString(), report }, null, 2));
