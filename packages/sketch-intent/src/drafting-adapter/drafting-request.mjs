export function buildDraftingRequest({ calibratedInterpretation, bodyMeasurementSet, baseParameters } = {}) {
  if (!calibratedInterpretation) throw new Error("buildDraftingRequest requires a calibrated interpretation.");
  if (!bodyMeasurementSet) throw new Error("buildDraftingRequest requires a body measurement set.");
  if (!baseParameters) throw new Error("buildDraftingRequest requires base garment parameters.");

  const blockers = [];
  const warnings = [];
  const scaleProfile = scaleProfileFrom(calibratedInterpretation);
  const ambiguityItems = calibratedInterpretation.ambiguityReport?.items ?? [];

  if (!scaleProfile) blockers.push("scaleProfile.missing");
  else if (scaleProfile.scaleStatus === "default-fallback") warnings.push("scaleProfile.defaultFallback");

  for (const item of ambiguityItems) {
    if (item.severity === "blocker") blockers.push(`landmark.${item.view}.${item.slotId}.missing`);
    else warnings.push(`landmark.${item.view}.${item.slotId}.${item.currentStatus}`);
  }

  const promotionState = blockers.length > 0 ? "refused" : warnings.length > 0 ? "draftable-with-warnings" : "draftable";
  const designParameters = projectDesignParameters(calibratedInterpretation, baseParameters);

  return {
    schemaVersion: "0.1-phase-e-drafting-request",
    garmentFamily: calibratedInterpretation.garmentFamily?.id ?? baseParameters.garmentType,
    units: "mm",
    source: {
      traceHash: calibratedInterpretation.inputRef?.sourceHash ?? null,
      priorHash: calibratedInterpretation.garmentFamily?.priorHash ?? null,
      scaleProfileId: calibratedInterpretation.scaleCalibration?.evidence?.sourceRef ?? null,
    },
    scaleProfile,
    bodyMeasurementSet,
    designParameters,
    evidence: {
      landmarksUsed: landmarkEvidence(calibratedInterpretation),
      assumptions: collectAssumptions(calibratedInterpretation),
      ambiguityItems,
    },
    promotion: {
      state: promotionState,
      blockers,
      warnings,
    },
  };
}

export function projectLegacyGeneratorInputs(draftingRequest) {
  return {
    bodyMeasurementSet: draftingRequest.bodyMeasurementSet,
    garmentParameters: draftingRequest.designParameters,
  };
}

function scaleProfileFrom(calibratedInterpretation) {
  const unitProfile = calibratedInterpretation.scaleCalibration?.unitProfile ?? calibratedInterpretation.landmarkSet?.unitProfile;
  if (!unitProfile?.mmPerSourceUnit) return null;
  return {
    canonicalUnit: "mm",
    sourceUnit: unitProfile.sourceUnits ?? "svg-user-unit",
    sourceToMm: unitProfile.mmPerSourceUnit,
    confidence: unitProfile.confidence,
    evidenceType: calibratedInterpretation.scaleCalibration?.evidence?.source ?? unitProfile.scaleStatus,
    scaleStatus: unitProfile.scaleStatus,
  };
}

function projectDesignParameters(calibratedInterpretation, baseParameters) {
  const front = calibratedInterpretation.landmarkSet?.slotsByView?.front ?? calibratedInterpretation.landmarkSet?.slots ?? {};
  const back = calibratedInterpretation.landmarkSet?.slotsByView?.back ?? {};
  return {
    ...structuredClone(baseParameters),
    sourceDesignEvidence: {
      neckline: {
        front: slotRef(front.neckline_front),
        back: slotRef(back.neckline_back),
      },
      hem: {
        front: slotRef(front.hem_front),
        back: slotRef(back.hem_back),
      },
      mirroredAssumptions: Object.values(front)
        .filter((slot) => slot?.source === "mirrored-from-axis")
        .map((slot) => slot.slotId),
    },
  };
}

function landmarkEvidence(calibratedInterpretation) {
  return (calibratedInterpretation.landmarks ?? []).map((landmark) => ({
    slot: landmark.slot,
    view: landmark.viewId?.replace("view.", "") ?? "unknown",
    status: landmark.status,
    confidence: landmark.confidence,
    sourceCurveIds: landmark.geometryRef?.sourceCurveIds ?? [],
  }));
}

function collectAssumptions(calibratedInterpretation) {
  return (calibratedInterpretation.landmarks ?? []).flatMap((landmark) =>
    (landmark.assumptions ?? []).map((assumption) => ({
      landmarkId: landmark.id,
      slot: landmark.slot,
      view: landmark.viewId?.replace("view.", "") ?? "unknown",
      ...assumption,
    })),
  );
}

function slotRef(slot) {
  if (!slot) return null;
  return {
    slotId: slot.slotId,
    status: slot.status,
    confidence: slot.confidence,
    source: slot.source,
    curveId: slot.curveId ?? null,
  };
}
