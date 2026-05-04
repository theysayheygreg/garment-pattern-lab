export function buildReadiness(patternDoc) {
  const checks = [];
  const add = (id, state, summary, details = {}) => checks.push({ id, state, summary, details });

  add(
    "units.mm",
    patternDoc.units === "mm" ? "ready" : "blocker",
    patternDoc.units === "mm" ? "Pattern uses canonical millimeters." : "Pattern units need review.",
  );

  for (const panel of patternDoc.panels) {
    add(
      `${panel.id}.closed`,
      panel.seamLine.length >= 4 && panel.cutLine.length >= 4 ? "ready" : "blocker",
      `${panel.name} has closed seam and cut line point sets.`,
    );
    add(
      `${panel.id}.grainline`,
      panel.grainline ? "ready" : "designer_choice",
      `${panel.name} includes a grainline parallel to the fold.`,
    );
    add(
      `${panel.id}.label`,
      panel.labels.length > 0 ? "ready" : "normalization",
      `${panel.name} includes cut label information.`,
    );
  }

  for (const pair of patternDoc.seamPairs) {
    const [aPanelName, aEdgeName] = pair.edges[0].split(".");
    const [bPanelName, bEdgeName] = pair.edges[1].split(".");
    const aPanel = patternDoc.panels.find((panel) => panel.role === aPanelName);
    const bPanel = patternDoc.panels.find((panel) => panel.role === bPanelName);
    const aLength = aPanel.edgeMeasurements[aEdgeName];
    const bLength = bPanel.edgeMeasurements[bEdgeName];
    const delta = Math.abs(aLength - bLength);
    add(
      `${pair.id}.length`,
      delta <= pair.tolerance ? "ready" : "blocker",
      delta <= pair.tolerance
        ? `${pair.id} match within ${pair.tolerance}mm.`
        : `${pair.id} need patternmaker review before sampling.`,
      { aLength, bLength, delta: Math.round(delta * 100) / 100, tolerance: pair.tolerance },
    );
  }

  add(
    "known-limitations.fabric-layout",
    "limitation",
    "Fabric layout, bolt width, nap, print direction, and marker efficiency are not checked in v0.1.",
  );
  add(
    "known-limitations.fit",
    "limitation",
    "True fit, drape, head entry, and muslin behavior require human review.",
  );
  add(
    "known-limitations.geometry",
    "limitation",
    "Cut lines use rough expansion rather than a robust offset kernel.",
  );
  if (patternDoc.markerPlan) {
    add(
      "marker.plan",
      patternDoc.markerPlan.warnings?.length ? "designer_choice" : "ready",
      patternDoc.markerPlan.warnings?.length
        ? "Marker layout has warnings for human review."
        : `Marker layout uses ${patternDoc.markerPlan.fabricWidthIn} inch width and estimates ${patternDoc.markerPlan.totalFabricLengthIn} inches of fabric.`,
      {
        fabricWidthIn: patternDoc.markerPlan.fabricWidthIn,
        totalFabricLengthIn: patternDoc.markerPlan.totalFabricLengthIn,
        warnings: patternDoc.markerPlan.warnings ?? [],
      },
    );
  }
  if (patternDoc.source?.sourceSketch) {
    add(
      "pipeline.drafting-request",
      patternDoc.source.draftingRequestState === "draftable" ? "ready" : "designer_choice",
      `Sketch-driven drafting request state: ${patternDoc.source.draftingRequestState}.`,
      {
        sourceSketch: patternDoc.source.sourceSketch,
        scaleStatus: patternDoc.source.scaleStatus,
      },
    );
  }

  const hasBlocker = checks.some((check) => check.state === "blocker");
  return {
    schemaVersion: "0.1-dirty-spike",
    patternId: patternDoc.id,
    generatedAt: new Date().toISOString(),
    overallState: hasBlocker ? "not-ready" : "ready-for-human-sanity-check",
    checks,
    instrumentation: buildInstrumentation(patternDoc),
    designerSummary: hasBlocker
      ? "This draft needs internal refinement before a human sanity check."
      : "This draft is ready for a human sanity check as a rough first package.",
  };
}

function buildInstrumentation(patternDoc) {
  return {
    marker: patternDoc.markerPlan
      ? {
          fabricWidthIn: patternDoc.markerPlan.fabricWidthIn,
          totalFabricLengthIn: patternDoc.markerPlan.totalFabricLengthIn,
          warningCount: patternDoc.markerPlan.warnings?.length ?? 0,
        }
      : null,
    sketchPipeline: patternDoc.source?.sourceSketch
      ? {
          sourceSketch: patternDoc.source.sourceSketch,
          draftingRequestState: patternDoc.source.draftingRequestState,
          scaleStatus: patternDoc.source.scaleStatus,
          stageTimings: patternDoc.source.stageTimings ?? [],
        }
      : null,
    assumptionCount: patternDoc.assumptions?.length ?? 0,
  };
}
