const MM_PER_INCH = 25.4;
const DEFAULT_CANONICAL_HEIGHT_IN = 66;

export function calibrateScale({ trace, interpretation, canonicalBody, override } = {}) {
  if (!interpretation) throw new Error("calibrateScale requires a Phase C interpretation.");

  const calibration = override
    ? calibrationFromOverride(override)
    : calibrationFromTraceReference(trace) ?? calibrationFromCanonicalDefault(canonicalBody);

  return applyScaleCalibration(interpretation, calibration);
}

function calibrationFromOverride(override) {
  if (!Number.isFinite(override.inchesPerSourceUnit) || override.inchesPerSourceUnit <= 0) {
    throw new Error("Scale override requires a positive inchesPerSourceUnit value.");
  }
  return buildCalibration({
    scaleStatus: "override",
    confidence: override.confidence ?? 0.98,
    inchesPerSourceUnit: override.inchesPerSourceUnit,
    evidence: {
      source: "dev-override",
      sourceRef: override.reason ?? "manual developer override",
      measuredSourceSpan: override.measuredSourceSpan ?? null,
      assumedPhysicalSpanIn: override.assumedPhysicalSpanIn ?? null,
      notes: ["Developer override is trusted for v0.1 pipeline integration."],
    },
    warnings: [],
  });
}

function calibrationFromTraceReference(trace) {
  const reference = allTracePaths(trace).find((path) => {
    const role = path.sourceAttributes?.["data-gpl-role"];
    return role === "figure-height-reference" || role === "scale-reference" || path.id?.includes("figure-height-reference");
  });
  if (!reference?.bbox) return null;
  const measuredSourceSpan = Math.max(reference.bbox.maxY - reference.bbox.minY, reference.bbox.maxX - reference.bbox.minX);
  const assumedPhysicalSpanIn = Number(reference.sourceAttributes?.["data-gpl-assumed-height-in"] ?? reference.sourceAttributes?.["data-gpl-assumed-length-in"]);
  if (!Number.isFinite(measuredSourceSpan) || measuredSourceSpan <= 0 || !Number.isFinite(assumedPhysicalSpanIn) || assumedPhysicalSpanIn <= 0) return null;

  return buildCalibration({
    scaleStatus: "calibrated",
    confidence: 0.82,
    inchesPerSourceUnit: assumedPhysicalSpanIn / measuredSourceSpan,
    evidence: {
      source: "figure-detected",
      sourceRef: reference.id,
      measuredSourceSpan,
      assumedPhysicalSpanIn,
      notes: ["Explicit source reference found in the trace; no generic croquis detector used yet."],
    },
    warnings: [],
  });
}

function calibrationFromCanonicalDefault(canonicalBody) {
  const heightIn = measurementHeightIn(canonicalBody) ?? DEFAULT_CANONICAL_HEIGHT_IN;
  return buildCalibration({
    scaleStatus: "default-fallback",
    confidence: 0.35,
    inchesPerSourceUnit: 1,
    evidence: {
      source: "canonical-default",
      sourceRef: canonicalBody?.id ?? "canonical-default-height",
      measuredSourceSpan: null,
      assumedPhysicalSpanIn: heightIn,
      notes: ["No scale evidence found; source units remain 1:1 until Phase E chooses a drafting projection."],
    },
    warnings: ["No figure, scale bar, or explicit override was found. Using a low-confidence default scale."],
  });
}

function buildCalibration({ scaleStatus, confidence, inchesPerSourceUnit, evidence, warnings }) {
  return {
    schemaVersion: "0.1-phase-d-scale-calibration",
    kind: "scale-calibration",
    unitProfile: {
      sourceUnits: "svg-user-unit",
      outputUnits: "in",
      inchesPerSourceUnit: round(inchesPerSourceUnit),
      mmPerSourceUnit: round(inchesPerSourceUnit * MM_PER_INCH),
      scaleStatus,
      confidence: round(confidence),
    },
    evidence,
    warnings,
  };
}

function applyScaleCalibration(interpretation, scaleCalibration) {
  const unitProfile = scaleCalibration.unitProfile;
  return {
    ...interpretation,
    coordinateProfile: {
      ...interpretation.coordinateProfile,
      physicalScaleKnown: unitProfile.scaleStatus !== "default-fallback",
      unitProfile,
    },
    landmarkSet: {
      ...interpretation.landmarkSet,
      unitProfile,
      scaledPanels: (interpretation.landmarkSet?.panels ?? []).map((panel) => scalePanel(panel, unitProfile.mmPerSourceUnit)),
    },
    scaleCalibration,
  };
}

function scalePanel(panel, mmPerSourceUnit) {
  return {
    panelId: panel.panelId,
    view: panel.view,
    bboxMm: scaleBbox(panel.bbox, mmPerSourceUnit),
    verticalCenterAxisMm: panel.verticalCenterAxis
      ? {
          ...panel.verticalCenterAxis,
          x: round(panel.verticalCenterAxis.x * mmPerSourceUnit),
        }
      : null,
  };
}

function scaleBbox(bbox, scale) {
  if (!bbox) return null;
  return {
    minX: round(bbox.minX * scale),
    minY: round(bbox.minY * scale),
    maxX: round(bbox.maxX * scale),
    maxY: round(bbox.maxY * scale),
    width: round((bbox.maxX - bbox.minX) * scale),
    height: round((bbox.maxY - bbox.minY) * scale),
  };
}

function allTracePaths(trace) {
  return Object.values(trace?.layers ?? {}).flatMap((paths) => paths);
}

function measurementHeightIn(canonicalBody) {
  const height = canonicalBody?.measurements?.height;
  if (!Number.isFinite(height)) return null;
  if (canonicalBody.units === "mm") return height / MM_PER_INCH;
  if (canonicalBody.units === "in") return height;
  return null;
}

function round(value) {
  return Math.round(value * 1000000) / 1000000;
}
