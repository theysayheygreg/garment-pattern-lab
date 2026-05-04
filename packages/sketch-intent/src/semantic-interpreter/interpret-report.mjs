import { ingestSketch } from "../raster-to-vector/bridge.mjs";
import { interpretSketchTrace } from "./interpreter.mjs";

const DEFAULT_FIXTURES = [
  "packages/sketch-intent/fixtures/a-line-tunic-semantic-flat.svg",
  "packages/sketch-intent/fixtures/a-line-tunic-front-back-semantic-flat.svg",
  "packages/sketch-intent/fixtures/clean-technical-flat.svg",
];

const files = process.argv.slice(2);
const report = (files.length > 0 ? files : DEFAULT_FIXTURES).map((filePath) => {
  const trace = ingestSketch(filePath);
  const interpretation = interpretSketchTrace(trace);
  return {
    sourcePath: filePath,
    traceReadiness: trace.readiness.status,
    interpretationStatus: interpretation.ambiguityReport.status,
    garmentFamily: interpretation.garmentFamily.id,
    physicalScaleKnown: interpretation.coordinateProfile.physicalScaleKnown,
    landmarks: interpretation.landmarks.map((landmark) => ({
      id: landmark.id,
      slot: landmark.slot,
      status: landmark.status,
      confidence: landmark.confidence,
      sourceCurveIds: landmark.geometryRef.sourceCurveIds,
    })),
    ambiguityItems: interpretation.ambiguityReport.items,
  };
});

console.log(JSON.stringify({ schemaVersion: "0.1-phase-c-interpret-report", generatedAt: new Date().toISOString(), report }, null, 2));
