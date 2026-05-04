import fs from "node:fs";
import crypto from "node:crypto";

const DEFAULT_PRIOR_PATH = "docs/data-corpus/garment-family-landmark-priors.json";
const FAMILY_ID = "sleeveless-a-line-woven-tunic";
const VIEW_SLOT_CONFIG = {
  front: {
    required: [
      "hem_front",
      "neckline_front",
      "shoulder_left",
      "shoulder_right",
      "armhole_left",
      "armhole_right",
      "side_seam_left",
      "side_seam_right",
      "center_front",
    ],
    optional: ["bust_dart_left", "bust_dart_right"],
  },
  back: {
    required: [
      "hem_back",
      "neckline_back",
      "shoulder_left",
      "shoulder_right",
      "armhole_left",
      "armhole_right",
      "side_seam_left",
      "side_seam_right",
      "center_back",
    ],
    optional: ["waist_dart_back_left", "waist_dart_back_right"],
  },
};

export function loadLandmarkPrior(priorPath = DEFAULT_PRIOR_PATH, familyId = FAMILY_ID) {
  const priorBytes = fs.readFileSync(priorPath);
  const corpus = JSON.parse(priorBytes.toString("utf8"));
  const family = corpus.families.find((candidate) => candidate.id === familyId);
  if (!family) throw new Error(`Unknown garment landmark prior family: ${familyId}`);
  return {
    corpusVersion: corpus.$schema_version,
    corpusHash: crypto.createHash("sha256").update(priorBytes).digest("hex"),
    generated: corpus.generated,
    knownImplementabilityGaps: corpus.known_implementability_gaps,
    family,
    labelingOrder: [
      "silhouette",
      "vertical_center_axis",
      "hem_front",
      "neckline_front",
      "center_front",
      "shoulder_left",
      "shoulder_right",
      "armhole_left",
      "armhole_right",
      "side_seam_left",
      "side_seam_right",
      "bust_dart_left",
      "bust_dart_right",
    ],
  };
}

export function interpretSketchTrace(trace, options = {}) {
  const prior = options.prior ?? loadLandmarkPrior(options.priorPath, options.familyId ?? FAMILY_ID);
  const candidates = buildCurveCandidates(trace);
  const panelContexts = buildPanelContexts(candidates, options.view);
  const interpretedPanels = panelContexts.map((context) => interpretPanelContext(context));
  const primaryPanel = interpretedPanels[0] ?? null;
  const slots = primaryPanel?.slots ?? {};
  const ambiguityReport = buildAmbiguityReport(interpretedPanels, trace, prior);
  const landmarks = interpretedPanels.flatMap((panel) => panel.landmarks);
  return {
    schemaVersion: "0.1-phase-c",
    kind: "sketch-interpretation",
    inputRef: {
      traceLayerId: trace.provenance?.originalHash ?? null,
      sourceHash: trace.provenance?.originalHash ?? null,
      recipe: trace.provenance?.recipe,
      engine: trace.engine,
      readiness: trace.readiness?.status,
    },
    garmentFamily: {
      id: prior.family.id,
      label: prior.family.label,
      priorVersion: prior.corpusVersion,
      priorHash: prior.corpusHash,
    },
    coordinateProfile: {
      sourceSpace: "trace",
      origin: "svg-viewBox-top-left",
      xAxis: "right",
      yAxis: "down",
      sourceUnits: "svg-user-unit",
      physicalScaleKnown: false,
      normalization: {
        transformsFlattened: false,
        note: "Phase B preserves source coordinates; Phase D owns physical scale calibration.",
      },
    },
    views: interpretedPanels.map((panel) => panel.viewAssignment),
    landmarks,
    sketchIntent: buildSketchIntent(interpretedPanels, prior.family.id),
    view: primaryPanel?.view ?? options.view ?? "front",
    sourceTrace: {
      schemaVersion: trace.schemaVersion,
      format: trace.provenance?.format,
      recipe: trace.provenance?.recipe,
      hash: trace.provenance?.originalHash,
      engine: trace.engine,
      readiness: trace.readiness?.status,
    },
    interpretationEngine: {
      name: "heuristic-a-line-v0.1",
      priorCorpusVersion: prior.corpusVersion,
      priorHash: prior.corpusHash,
      labelingOrder: prior.labelingOrder,
      unitPolicy: "unitless-bbox-ratios-until-phase-d-scale-calibration",
    },
    axis: primaryPanel?.axis ?? null,
    landmarkSet: {
      schemaVersion: "0.1-phase-c-landmark-set",
      familyId: prior.family.id,
      unitProfile: { unit: "svg-user-unit", scaleStatus: "unscaled" },
      view: primaryPanel?.view ?? options.view ?? "front",
      panels: interpretedPanels.map((panel) => ({
        panelId: panel.panelId,
        view: panel.view,
        bbox: panel.silhouette?.bbox ?? null,
        verticalCenterAxis: panel.axis,
        landmarkIds: panel.landmarks.map((landmark) => landmark.id),
        slots: panel.slots,
      })),
      slots,
      slotsByView: Object.fromEntries(interpretedPanels.map((panel) => [panel.view, panel.slots])),
    },
    ambiguityReport,
  };
}

function interpretPanelContext(context) {
  const derived = deriveBoundaryCandidates(context.silhouette, context.axis, context.view);
  const mirrored = mirrorSingleSideCandidates(context.candidates, context.silhouette, context.axis, context.view);
  const candidateSet = [...context.candidates, ...derived, ...mirrored];
  const slotConfig = VIEW_SLOT_CONFIG[context.view] ?? VIEW_SLOT_CONFIG.front;
  const slots = {};
  for (const slotId of slotConfig.required) {
    slots[slotId] = assignRequiredSlot(slotId, candidateSet, context.silhouette, context.axis);
  }
  for (const slotId of slotConfig.optional) {
    slots[slotId] = assignOptionalSlot(slotId, candidateSet, context.silhouette, context.axis);
  }
  const landmarks = buildLandmarkList(slots, context.view);
  return {
    ...context,
    landmarks,
    slots,
    viewAssignment: {
      id: `view.${context.view}`,
      role: context.view,
      panelCandidateId: context.panelId,
      confidence: context.viewAssignmentConfidence,
      assignmentSource: context.viewAssignmentSource,
    },
  };
}

function buildCurveCandidates(trace) {
  return Object.entries(trace.layers ?? {}).flatMap(([layer, paths]) =>
    paths.map((path) => enrichCandidate(path, layer, "trace")),
  );
}

function buildPanelContexts(candidates, requestedView) {
  const silhouettes = candidates
    .filter((candidate) => candidate.layer === "silhouette")
    .sort((a, b) => midX(a.bbox) - midX(b.bbox));
  if (silhouettes.length === 0) {
    const axis = detectAxis(candidates, null);
    return [
      {
        panelId: `panel.${requestedView ?? "front"}.0`,
        view: requestedView ?? "front",
        viewAssignmentConfidence: requestedView ? 0.9 : 0.35,
        viewAssignmentSource: requestedView ? "caller" : "fallback-no-silhouette",
        silhouette: null,
        axis,
        candidates,
      },
    ];
  }

  return silhouettes
    .map((silhouette, index) => {
      const view = viewForSilhouette(silhouette, index, silhouettes.length, requestedView);
      const panelCandidates = candidates.filter(
        (candidate) =>
          candidate.id === silhouette.id ||
          candidate.sourceAttributes?.["data-gpl-view"] === view ||
          (candidate.layer !== "silhouette" &&
            candidate.bbox &&
            silhouette.bbox &&
            inside(candidate.bbox, silhouette.bbox) &&
            !candidate.sourceAttributes?.["data-gpl-view"]),
      );
      const axis = detectAxis(panelCandidates, silhouette);
      return {
        panelId: `panel.${view}.${index}`,
        view,
        viewAssignmentConfidence: silhouette.sourceAttributes?.["data-gpl-view"] ? 0.96 : requestedView ? 0.9 : silhouettes.length === 1 ? 0.72 : 0.62,
        viewAssignmentSource: silhouette.sourceAttributes?.["data-gpl-view"]
          ? "source-metadata"
          : requestedView
            ? "caller"
            : silhouettes.length === 1
              ? "v0.1-default"
              : "left-to-right-front-back-default",
        silhouette,
        axis,
        candidates: panelCandidates,
      };
    })
    .filter((context) => !requestedView || context.view === requestedView);
}

function viewForSilhouette(silhouette, index, count, requestedView) {
  const explicit = silhouette.sourceAttributes?.["data-gpl-view"];
  if (explicit === "front" || explicit === "back") return explicit;
  if (requestedView && count === 1) return requestedView;
  if (count === 1) return "front";
  return index === 0 ? "front" : "back";
}

function enrichCandidate(path, layer, source) {
  const points = pointsFromPathData(path.d);
  const endpointA = points[0] ?? null;
  const endpointB = points.at(-1) ?? null;
  return {
    id: path.id,
    layer,
    source,
    element: path.element ?? "path",
    d: path.d,
    points,
    endpointA,
    endpointB,
    bbox: path.bbox ?? bboxFromPoints(points),
    closed: Boolean(path.closed),
    roleHint: roleHint(path.id),
    shape: shapeMetrics(points, path.bbox),
    sourceAttributes: path.sourceAttributes ?? {},
  };
}

function deriveBoundaryCandidates(silhouette, axis, view = "front") {
  if (!silhouette?.closed || silhouette.points.length < 4 || !silhouette.bbox) return [];
  const ordered = uniqueClosingPoint(silhouette.points);
  if (ordered.length < 4) return [];
  const top = [...ordered].sort((a, b) => a.y - b.y).slice(0, 2).sort((a, b) => a.x - b.x);
  const bottom = [...ordered].sort((a, b) => b.y - a.y).slice(0, 2).sort((a, b) => a.x - b.x);
  if (top.length < 2 || bottom.length < 2) return [];

  const [topLeft, topRight] = top;
  const [bottomLeft, bottomRight] = bottom;
  const leftArmholeBottom = lerpPoint(topLeft, bottomLeft, 0.22);
  const rightArmholeBottom = lerpPoint(topRight, bottomRight, 0.22);
  const centerX = axis.x;

  return [
    lineCandidate(`derived-${view}-hem`, [bottomLeft, bottomRight], "hem", silhouette, view),
    lineCandidate(`derived-${view}-armhole-left`, [topLeft, leftArmholeBottom], "armhole", silhouette, view),
    lineCandidate(`derived-${view}-armhole-right`, [topRight, rightArmholeBottom], "armhole", silhouette, view),
    lineCandidate(`derived-${view}-side-seam-left`, [leftArmholeBottom, bottomLeft], "side_seam", silhouette, view),
    lineCandidate(`derived-${view}-side-seam-right`, [rightArmholeBottom, bottomRight], "side_seam", silhouette, view),
    lineCandidate(`derived-${view}-center-axis`, [{ x: centerX, y: topLeft.y }, { x: centerX, y: bottomLeft.y }], "center", silhouette, view),
  ];
}

function lineCandidate(id, points, role, sourceSilhouette, view) {
  return enrichCandidate(
    {
      id,
      element: "derived-line",
      d: `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`,
      bbox: bboxFromPoints(points),
      closed: false,
      sourceAttributes: { derivedFrom: sourceSilhouette.id, role, "data-gpl-view": view },
    },
    "derived",
    "derived-from-silhouette",
  );
}

function mirrorSingleSideCandidates(candidates, silhouette, axis, view) {
  if (!silhouette?.bbox || !axis?.present) return [];
  const roles = [
    { key: "shoulder", slotRole: "shoulder" },
    { key: "armhole", slotRole: "armhole" },
    { key: "side-seam", slotRole: "side_seam", aliases: ["side"] },
  ];
  const mirrored = [];

  for (const role of roles) {
    const matching = candidates.filter((candidate) => candidate.bbox && candidateRoleMatches(candidate, role));
    const leftCandidates = matching.filter((candidate) => candidateSide(candidate, axis) === "left");
    const rightCandidates = matching.filter((candidate) => candidateSide(candidate, axis) === "right");
    if (leftCandidates.length > 0 && rightCandidates.length === 0) {
      mirrored.push(...leftCandidates.map((candidate) => mirrorCandidate(candidate, axis, "left", "right", role.slotRole, view)));
    }
    if (rightCandidates.length > 0 && leftCandidates.length === 0) {
      mirrored.push(...rightCandidates.map((candidate) => mirrorCandidate(candidate, axis, "right", "left", role.slotRole, view)));
    }
  }

  return mirrored;
}

function candidateRoleMatches(candidate, role) {
  const id = candidate.id.toLowerCase();
  const normalizedRole = String(candidate.sourceAttributes?.role ?? "").replaceAll("_", "-");
  return [role.key, ...(role.aliases ?? [])].some((alias) => id.includes(alias) || normalizedRole.includes(alias));
}

function candidateSide(candidate, axis) {
  if (candidate.bbox.maxX <= axis.x) return "left";
  if (candidate.bbox.minX >= axis.x) return "right";
  return "center";
}

function mirrorCandidate(candidate, axis, fromSide, toSide, role, view) {
  const points = candidate.points.map((point) => ({ x: round(axis.x * 2 - point.x), y: point.y }));
  const id = candidate.id.includes(fromSide)
    ? candidate.id.replaceAll(fromSide, toSide)
    : `mirrored-${toSide}-${candidate.id}`;
  return enrichCandidate(
    {
      id,
      element: "mirrored-line",
      d: pathDataFromPoints(points),
      bbox: bboxFromPoints(points),
      closed: candidate.closed,
      sourceAttributes: {
        derivedFrom: candidate.id,
        role,
        "data-gpl-view": view,
        "data-gpl-mirror-from": fromSide,
        "data-gpl-mirror-to": toSide,
      },
    },
    "mirrored-from-axis",
    "mirrored-from-axis",
  );
}

function detectAxis(candidates, silhouette) {
  const bbox = silhouette?.bbox ?? unionBbox(candidates.map((candidate) => candidate.bbox).filter(Boolean));
  const fallbackX = bbox ? (bbox.minX + bbox.maxX) / 2 : 0;
  const verticals = candidates
    .filter((candidate) => candidate.shape.orientation === "vertical")
    .filter((candidate) => candidate.bbox && bbox && Math.abs(midX(candidate.bbox) - fallbackX) <= width(bbox) * 0.08)
    .sort((a, b) => height(b.bbox) - height(a.bbox));

  if (verticals[0]) {
    return {
      present: true,
      x: round(midX(verticals[0].bbox)),
      source: "explicit-curve",
      curveId: verticals[0].id,
      confidence: 0.93,
      mode: "explicit-center-line",
    };
  }

  return {
    present: Boolean(bbox),
    x: round(fallbackX),
    source: "bbox-midline",
    curveId: null,
    confidence: bbox ? 0.72 : 0,
    mode: "assumed-symmetry-axis",
    assumption: "No explicit center line was found; using the silhouette midpoint as the center-front axis.",
  };
}

function assignRequiredSlot(slotId, candidates, silhouette, axis) {
  const scored = scoreSlot(slotId, candidatePoolForSlot(slotId, candidates, axis), silhouette, axis).sort((a, b) => compareScoredCandidates(a, b));
  const best = scored[0];
  const hardFloor = 0.3;
  const baseSlot = baseSlotId(slotId);
  const threshold = baseSlot === "center" ? 0.7 : baseSlot === "hem" ? 0.55 : 0.6;
  if (!best || best.score < hardFloor) {
    return missingSlot(slotId, true, `No plausible ${slotId.replaceAll("_", " ")} curve was found.`);
  }
  const status = best.candidate.source === "mirrored-from-axis" || best.score < threshold ? "assumed" : "assigned";
  return slotAssignment(slotId, best.candidate, {
    required: true,
    status,
    confidence: best.score,
    ruleScores: best.ruleScores,
    assumption:
      best.candidate.source === "mirrored-from-axis"
        ? `${slotId.replaceAll("_", " ")} was mirrored across the detected center axis from ${best.candidate.sourceAttributes.derivedFrom}.`
        : status === "assumed"
          ? `${slotId.replaceAll("_", " ")} is below the ambiguity threshold.`
          : undefined,
  });
}

function assignOptionalSlot(slotId, candidates, silhouette, axis) {
  const scored = scoreSlot(slotId, candidatePoolForSlot(slotId, candidates, axis), silhouette, axis).sort((a, b) => compareScoredCandidates(a, b));
  const best = scored[0];
  if (!best || best.score < 0.45) {
    return {
      slotId,
      required: false,
      status: "not-present",
      confidence: 0.82,
      assumption: "No dart-like feature was detected in the v0.1 trace.",
    };
  }
  return slotAssignment(slotId, best.candidate, {
    required: false,
    status: "needs-confirmation",
    confidence: best.score,
    ruleScores: best.ruleScores,
    assumption: "Darts change the cut; v0.1 requires human confirmation even when detection is plausible.",
  });
}

function scoreSlot(slotId, candidates, silhouette, axis) {
  return candidates.map((candidate) => {
    const ruleScores = ruleScoresForSlot(slotId, candidate, silhouette, axis);
    const totalWeight = ruleScores.reduce((sum, rule) => sum + rule.weight, 0);
    const score = totalWeight === 0 ? 0 : ruleScores.reduce((sum, rule) => sum + rule.score * rule.weight, 0) / totalWeight;
    return { candidate, score: round(score), ruleScores };
  });
}

function candidatePoolForSlot(slotId, candidates, axis) {
  const role = roleForSlot(slotId);
  const side = sideForSlot(slotId);
  if (!role || !side) return candidates;
  const hasMirrored = candidates.some(
    (candidate) => candidate.source === "mirrored-from-axis" && candidate.sourceAttributes?.role === role && candidateSide(candidate, axis) === side,
  );
  if (!hasMirrored) return candidates;
  return candidates.filter(
    (candidate) => candidate.source !== "derived-from-silhouette" && (candidate.source !== "mirrored-from-axis" || candidate.sourceAttributes?.role === role),
  );
}

function roleForSlot(slotId) {
  if (slotId.startsWith("shoulder_")) return "shoulder";
  if (slotId.startsWith("armhole_")) return "armhole";
  if (slotId.startsWith("side_seam_")) return "side_seam";
  return null;
}

function sideForSlot(slotId) {
  if (slotId.endsWith("_left")) return "left";
  if (slotId.endsWith("_right")) return "right";
  return null;
}

function compareScoredCandidates(a, b) {
  const scoreDelta = b.score - a.score;
  if (Math.abs(scoreDelta) > 0.18) return scoreDelta;
  return sourceRank(b.candidate.source) - sourceRank(a.candidate.source) || scoreDelta;
}

function sourceRank(source) {
  if (source === "trace") return 3;
  if (source === "mirrored-from-axis") return 2;
  if (source === "derived-from-silhouette") return 1;
  return 0;
}

function ruleScoresForSlot(slotId, candidate, silhouette, axis) {
  const rules = [];
  const id = candidate.id.toLowerCase();
  const baseSlot = baseSlotId(slotId);
  const bbox = candidate.bbox;
  const panel = silhouette?.bbox;
  const left = panel && bbox ? midX(bbox) < axis.x : false;
  const right = panel && bbox ? midX(bbox) > axis.x : false;

  const add = (id, weight, score, reason) => rules.push({ id, weight, score: clamp01(score), reason });
  const hintScore = (text) => (id.includes(text) ? 1 : 0);
  const derivedScore = (role) => (candidate.sourceAttributes?.role === role ? 0.9 : 0);
  const mirroredScore = (role) => (candidate.source === "mirrored-from-axis" && candidate.sourceAttributes?.role === role ? 0.82 : 0);
  const mirroredSideScore = (role, onSide) => (onSide ? mirroredScore(role) : 0);

  if (baseSlot === "hem") {
    add("id-or-derived-hem", 0.7, Math.max(hintScore("hem"), derivedScore("hem")), "Prefer explicit or derived hem candidates.");
    add("lowest-horizontal-spanning-curve", 0.7, horizontalBottomScore(candidate, panel), "Hem should be low, wide, and horizontal.");
  } else if (baseSlot === "neckline") {
    add("id-neckline", 0.75, hintScore("neckline"), "Prefer explicit neckline labels.");
    add("top-center-open-curve", 0.65, topCenterOpenScore(candidate, panel, axis), "Neckline should sit near the top and cross the center axis.");
  } else if (baseSlot === "center") {
    add("id-or-derived-center", 0.95, Math.max(hintScore("center"), derivedScore("center")), "Prefer explicit or derived center axis.");
    add("vertical-on-axis", 0.9, verticalAxisScore(candidate, panel, axis), "Center front should be vertical and near the symmetry axis.");
  } else if (slotId === "shoulder_left") {
    add("id-shoulder-left", 0.85, id.includes("shoulder") && id.includes("left") ? 1 : 0, "Prefer explicit left shoulder labels.");
    add("top-left-short-edge", 0.65, shoulderScore(candidate, panel, axis, "left"), "Left shoulder should be short and high.");
  } else if (slotId === "shoulder_right") {
    add("id-shoulder-right", 0.85, id.includes("shoulder") && id.includes("right") ? 1 : 0, "Prefer explicit right shoulder labels.");
    add("top-right-short-edge", 0.65, shoulderScore(candidate, panel, axis, "right"), "Right shoulder should be short and high.");
  } else if (slotId === "armhole_left") {
    add("id-or-derived-armhole-left", 0.8, (candidate.source === "trace" && id.includes("armhole") && left ? 1 : 0) || mirroredSideScore("armhole", left) || (derivedScore("armhole") && left ? 0.62 : 0), "Prefer left armhole labels or derived upper-side segment.");
    add("upper-left-lateral-edge", 0.65, upperSideScore(candidate, panel, axis, "left"), "Armhole should live high on the left side.");
  } else if (slotId === "armhole_right") {
    add("id-or-derived-armhole-right", 0.8, (candidate.source === "trace" && id.includes("armhole") && right ? 1 : 0) || mirroredSideScore("armhole", right) || (derivedScore("armhole") && right ? 0.62 : 0), "Prefer right armhole labels or derived upper-side segment.");
    add("upper-right-lateral-edge", 0.65, upperSideScore(candidate, panel, axis, "right"), "Armhole should live high on the right side.");
  } else if (slotId === "side_seam_left") {
    add("id-or-derived-side-left", 0.8, (id.includes("side") && left ? 1 : 0) || mirroredSideScore("side_seam", left) || (derivedScore("side_seam") && left ? 0.9 : 0), "Prefer left side seam labels or derived lower-side segment.");
    add("left-long-vertical-edge", 0.75, sideSeamScore(candidate, panel, axis, "left"), "Left side seam should be long and lateral.");
  } else if (slotId === "side_seam_right") {
    add("id-or-derived-side-right", 0.8, (id.includes("side") && right ? 1 : 0) || mirroredSideScore("side_seam", right) || (derivedScore("side_seam") && right ? 0.9 : 0), "Prefer right side seam labels or derived lower-side segment.");
    add("right-long-vertical-edge", 0.75, sideSeamScore(candidate, panel, axis, "right"), "Right side seam should be long and lateral.");
  } else if (baseSlot.startsWith("dart")) {
    const side = baseSlot.endsWith("left") ? "left" : baseSlot.endsWith("right") ? "right" : null;
    const onSide = side === "left" ? left : side === "right" ? right : true;
    add("id-dart-side", 0.8, hintScore("dart") && onSide ? 0.7 : 0, "Prefer explicit dart labels on the matching side.");
    add("short-interior-line", 0.4, candidate.layer === "interior" && onSide && candidate.shape.length < height(panel) * 0.18 ? 0.35 : 0, "Dart candidates are short interior marks.");
  }

  return rules;
}

function baseSlotId(slotId) {
  if (slotId === "hem_front" || slotId === "hem_back") return "hem";
  if (slotId === "neckline_front" || slotId === "neckline_back") return "neckline";
  if (slotId === "center_front" || slotId === "center_back") return "center";
  if (slotId.startsWith("bust_dart")) return slotId.replace("bust_dart_", "dart_");
  if (slotId.startsWith("waist_dart_back")) return slotId.replace("waist_dart_back_", "dart_");
  return slotId;
}

function slotAssignment(slotId, candidate, options) {
  return {
    slotId,
    required: options.required,
    status: options.status,
    curveId: candidate.id,
    source: candidate.source,
    element: candidate.element,
    confidence: options.confidence,
    bbox: candidate.bbox,
    endpoints: { start: candidate.endpointA, end: candidate.endpointB },
    geometry: { d: candidate.d },
    ruleScores: options.ruleScores,
    assumption: options.assumption,
  };
}

function missingSlot(slotId, required, message) {
  return {
    slotId,
    required,
    status: "missing",
    confidence: 0,
    assumption: message,
  };
}

function buildAmbiguityReport(interpretedPanels, trace, prior) {
  const questions = interpretedPanels.flatMap((panel) =>
    Object.values(panel.slots)
      .filter((slot) => ["missing", "assumed", "needs-confirmation"].includes(slot.status))
      .map((slot) => ({
        slotId: slot.slotId,
        view: panel.view,
        severity: slot.required && slot.status === "missing" ? "blocker" : "review",
        prompt: promptForSlot(slot),
        currentStatus: slot.status,
        confidence: slot.confidence,
      })),
  );
  if (trace.readiness?.status === "review-needed" && interpretedPanels.length <= 1) {
    questions.push({
      slotId: "trace-readiness",
      view: interpretedPanels[0]?.view ?? "unknown",
      severity: "review",
      prompt: "The trace layer needs review before semantic interpretation is trusted.",
      currentStatus: trace.readiness.status,
      confidence: 0.5,
    });
  }
  const hasBlocker = questions.some((question) => question.severity === "blocker");
  return {
    schemaVersion: "0.1-phase-c-ambiguity-report",
    hardRefusal: hasBlocker,
    hardFloor: 0.3,
    status: hasBlocker ? "blocked" : questions.length > 0 ? "review-needed" : "ready",
    traceReadiness: trace.readiness?.status,
    priorKnownGapsAcknowledged: prior.knownImplementabilityGaps.map((gap) => gap.id),
    items: questions,
    questions,
  };
}

function buildLandmarkList(slots, view) {
  return Object.values(slots).map((slot) => {
    const semanticId = semanticLandmarkId(slot.slotId, view);
    return {
      id: semanticId,
      slot: slot.slotId,
      viewId: `view.${view}`,
      geometryRef: {
        sourceCurveIds: slot.curveId ? [slot.curveId] : [],
        derivedCurveId: slot.curveId?.startsWith("derived-") ? `curve.${view}.${slot.slotId}` : null,
        kind: slot.geometry ? "curve" : "missing",
      },
      points: {
        leftEndpoint: slot.endpoints?.start ?? null,
        rightEndpoint: slot.endpoints?.end ?? null,
      },
      confidence: slot.confidence,
      status: slot.status,
      evidence: slot.ruleScores ?? [],
      assumptions: slot.assumption
        ? [
            {
              id: `assume.${view}.${slot.slotId}`,
              severity: slot.required && slot.status === "missing" ? "hard" : "soft",
              message: slot.assumption,
              machineReason: slot.status,
            },
          ]
        : [],
    };
  });
}

function buildSketchIntent(interpretedPanels, familyId) {
  const slotsByView = Object.fromEntries(interpretedPanels.map((panel) => [panel.view, panel.slots]));
  const frontSlots = slotsByView.front ?? interpretedPanels[0]?.slots ?? {};
  const backSlots = slotsByView.back ?? {};
  const highConsequenceDartSlots = [
    frontSlots.bust_dart_left,
    frontSlots.bust_dart_right,
    backSlots.waist_dart_back_left,
    backSlots.waist_dart_back_right,
  ].filter(Boolean);
  return {
    promotionState: "interpreted",
    garmentType: familyId,
    views: interpretedPanels.map((panel) => ({
      view: panel.view,
      panelId: panel.panelId,
      assignmentSource: panel.viewAssignmentSource,
      confidence: panel.viewAssignmentConfidence,
      slotStatuses: Object.fromEntries(Object.values(panel.slots).map((slot) => [slot.slotId, slot.status])),
    })),
    silhouette: { type: "a-line", confidence: 0.78 },
    neckline: {
      shape: "scoop-or-curve",
      confidence: frontSlots.neckline_front?.confidence ?? backSlots.neckline_back?.confidence ?? 0,
      from: [
        ...(frontSlots.neckline_front?.curveId ? ["lm.front.neckline"] : []),
        ...(backSlots.neckline_back?.curveId ? ["lm.back.neckline"] : []),
      ],
    },
    closure: { mode: "pullover-assumed", confidence: 0.52 },
    highConsequenceFeatures: {
      darts: {
        status: highConsequenceDartSlots.some((slot) => slot.status === "needs-confirmation") ? "requires-review" : "not-detected",
        byView: {
          front: [frontSlots.bust_dart_left, frontSlots.bust_dart_right].filter(Boolean).map((slot) => ({ slotId: slot.slotId, status: slot.status, confidence: slot.confidence })),
          back: [backSlots.waist_dart_back_left, backSlots.waist_dart_back_right].filter(Boolean).map((slot) => ({ slotId: slot.slotId, status: slot.status, confidence: slot.confidence })),
        },
      },
    },
  };
}

function semanticLandmarkId(slotId, view) {
  const label = slotId.replace(/_(front|back)$/, "").replaceAll("_", "-");
  return `lm.${view}.${label}`;
}

function promptForSlot(slot) {
  if (slot.status === "missing") return `I could not find the ${slot.slotId.replaceAll("_", " ")}.`;
  if (slot.status === "needs-confirmation") return `Please confirm whether this mark is the ${slot.slotId.replaceAll("_", " ")}.`;
  return `I made an assumption for ${slot.slotId.replaceAll("_", " ")}.`;
}

function roleHint(id = "") {
  const lower = id.toLowerCase();
  for (const role of ["hem", "neckline", "center", "armhole", "shoulder", "side", "dart"]) {
    if (lower.includes(role)) return role;
  }
  return "unknown";
}

function pointsFromPathData(d = "") {
  const nums = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  const points = [];
  for (let i = 0; i < nums.length - 1; i += 2) points.push({ x: nums[i], y: nums[i + 1] });
  return points;
}

function shapeMetrics(points, bbox) {
  const box = bbox ?? bboxFromPoints(points);
  const w = width(box);
  const h = height(box);
  return {
    width: w,
    height: h,
    length: polylineLength(points),
    orientation: w > h * 1.8 ? "horizontal" : h > w * 1.8 ? "vertical" : "diagonal-or-curved",
  };
}

function horizontalBottomScore(candidate, panel) {
  if (!candidate.bbox || !panel) return 0;
  const horizontal = candidate.shape.orientation === "horizontal" ? 1 : 0;
  const low = normalizedY(candidate.bbox, panel);
  const spanning = width(candidate.bbox) / width(panel);
  return horizontal * clamp01((low - 0.7) / 0.25) * clamp01(spanning / 0.75);
}

function topCenterOpenScore(candidate, panel, axis) {
  if (!candidate.bbox || !panel || candidate.closed) return 0;
  const top = 1 - clamp01(normalizedY(candidate.bbox, panel) / 0.25);
  const crosses = candidate.bbox.minX <= axis.x && candidate.bbox.maxX >= axis.x ? 1 : 0;
  return top * crosses;
}

function verticalAxisScore(candidate, panel, axis) {
  if (!candidate.bbox || !panel) return 0;
  const vertical = candidate.shape.orientation === "vertical" ? 1 : 0;
  const nearAxis = 1 - clamp01(Math.abs(midX(candidate.bbox) - axis.x) / (width(panel) * 0.15));
  const tall = clamp01(height(candidate.bbox) / (height(panel) * 0.65));
  return vertical * nearAxis * tall;
}

function shoulderScore(candidate, panel, axis, side) {
  if (!candidate.bbox || !panel) return 0;
  const top = 1 - clamp01((candidate.bbox.minY - panel.minY) / (height(panel) * 0.15));
  const lateral = side === "left" ? candidate.bbox.maxX <= axis.x ? 1 : 0 : candidate.bbox.minX >= axis.x ? 1 : 0;
  const short = 1 - clamp01(candidate.shape.length / (width(panel) * 0.3));
  return top * lateral * short;
}

function upperSideScore(candidate, panel, axis, side) {
  if (!candidate.bbox || !panel) return 0;
  const upper = 1 - clamp01((midY(candidate.bbox) - panel.minY) / (height(panel) * 0.45));
  const lateral = side === "left" ? candidate.bbox.maxX <= axis.x ? 1 : 0 : candidate.bbox.minX >= axis.x ? 1 : 0;
  return upper * lateral;
}

function sideSeamScore(candidate, panel, axis, side) {
  if (!candidate.bbox || !panel) return 0;
  const lower = clamp01((midY(candidate.bbox) - panel.minY) / height(panel));
  const lateral = side === "left" ? candidate.bbox.maxX <= axis.x ? 1 : 0 : candidate.bbox.minX >= axis.x ? 1 : 0;
  const long = clamp01(candidate.shape.length / (height(panel) * 0.45));
  return lower * lateral * long;
}

function uniqueClosingPoint(points) {
  if (points.length > 1 && distance(points[0], points.at(-1)) < 0.001) return points.slice(0, -1);
  return points;
}

function lerpPoint(a, b, t) {
  return { x: round(a.x + (b.x - a.x) * t), y: round(a.y + (b.y - a.y) * t) };
}

function bboxFromPoints(points) {
  if (!points.length) return null;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys), area: (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys)) };
}

function unionBbox(boxes) {
  if (!boxes.length) return null;
  return bboxFromPoints(boxes.flatMap((box) => [{ x: box.minX, y: box.minY }, { x: box.maxX, y: box.maxY }]));
}

function width(box) {
  return box ? box.maxX - box.minX : 0;
}

function height(box) {
  return box ? box.maxY - box.minY : 0;
}

function midX(box) {
  return (box.minX + box.maxX) / 2;
}

function midY(box) {
  return (box.minY + box.maxY) / 2;
}

function normalizedY(box, panel) {
  return (midY(box) - panel.minY) / height(panel);
}

function inside(inner, outer) {
  return inner.minX >= outer.minX && inner.maxX <= outer.maxX && inner.minY >= outer.minY && inner.maxY <= outer.maxY;
}

function polylineLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += distance(points[i - 1], points[i]);
  return total;
}

function pathDataFromPoints(points) {
  if (points.length === 0) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}
