import { ingestSketch } from "./bridge.mjs";

const DEFAULT_FIXTURES = [
  "packages/sketch-intent/fixtures/clean-technical-flat.svg",
  "packages/sketch-intent/fixtures/primitive-export-technical-flat.svg",
  "packages/sketch-intent/fixtures/hardware-detail-technical-flat.svg",
];

const files = process.argv.slice(2);
const report = (files.length > 0 ? files : DEFAULT_FIXTURES).map((filePath) => {
  const trace = ingestSketch(filePath);
  return {
    sourcePath: filePath,
    format: trace.provenance.format,
    recipe: trace.provenance.recipe,
    engine: trace.engine,
    readiness: trace.readiness.status,
    pathCount: trace.traceStats?.pathCount ?? 0,
    layerCounts: trace.traceStats?.layerCounts ?? {
      silhouette: trace.layers.silhouette.length,
      interior: trace.layers.interior.length,
      annotation: trace.layers.annotation.length,
      unclassified: trace.layers.unclassified.length,
    },
    checks: trace.readiness.checks,
  };
});

console.log(JSON.stringify({ schemaVersion: "0.1-phase-b-fixture-report", generatedAt: new Date().toISOString(), report }, null, 2));
