import fs from "node:fs";
import crypto from "node:crypto";

const DEFAULT_PRIOR_PATH = "docs/data-corpus/garment-family-landmark-priors.json";
const FAMILY_ID = "sleeveless-a-line-woven-tunic";
const REQUIRED_FRONT_SLOTS = [
  "hem_front",
  "neckline_front",
  "shoulder_left",
  "shoulder_right",
  "armhole_left",
  "armhole_right",
  "side_seam_left",
  "side_seam_right",
  "center_front",
];
const OPTIONAL_FRONT_SLOTS = ["bust_dart_left", "bust_dart_right"];

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
  const view = options.view ?? "front";
  const candidates = buildCurveCandidates(trace);
  const silhouette = candidates.find((candidate) => candidate.layer === "silhouette");
  const axis = detectAxis(candidates, silhouette);
  const derived = deriveBoundaryCandidates(silhouette, axis);
  const candidateSet = [...candidates, ...derived];

  const slots = {};
  for (const slotId of REQUIRED_FRONT_SLOTS) {
    slots[slotId] = assignRequiredSlot(slotId, candidateSet, silhouette, axis);
  }
  for (const slotId of OPTIONAL_FRONT_SLOTS) {
    slots[slotId] = assignOptionalSlot(slotId, candidateSet, silhouette, axis);
  }

  const ambiguityReport = buildAmbiguityReport(slots, trace, prior);
  const landmarks = buildLandmarkList(slots, view);
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
    views: [
      {
        id: `view.${view}`,
        role: view,
        panelCandidateId: "panel.front.0",
        confidence: view === "front" ? 0.9 : 0.5,
        assignmentSource: options.view ? "caller" : "v0.1-default",
      },
    ],
    landmarks,
    sketchIntent: buildSketchIntent(slots, prior.family.id),
    view,
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
    axis,
    landmarkSet: {
      schemaVersion: "0.1-phase-c-landmark-set",
      familyId: prior.family.id,
      unitProfile: { unit: "svg-user-unit", scaleStatus: "unscaled" },
      view,
      panels: [
        {
          panelId: "panel.front.0",
          view,
          bbox: silhouette?.bbox ?? null,
          verticalCenterAxis: axis,
          landmarkIds: landmarks.map((landmark) => landmark.id),
        },
      ],
      slots,
    },
    ambiguityReport,
  };
}

function buildCurveCandidates(trace) {
  return Object.entries(trace.layers ?? {}).flatMap(([layer, paths]) =>
    paths.map((path) => enrichCandidate(path, layer, "trace")),
  );
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

function deriveBoundaryCandidates(silhouette, axis) {
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
    lineCandidate("derived-hem-front", [bottomLeft, bottomRight], "hem", silhouette),
    lineCandidate("derived-armhole-left", [topLeft, leftArmholeBottom], "armhole", silhouette),
    lineCandidate("derived-armhole-right", [topRight, rightArmholeBottom], "armhole", silhouette),
    lineCandidate("derived-side-seam-left", [leftArmholeBottom, bottomLeft], "side_seam", silhouette),
    lineCandidate("derived-side-seam-right", [rightArmholeBottom, bottomRight], "side_seam", silhouette),
    lineCandidate("derived-center-front-axis", [{ x: centerX, y: topLeft.y }, { x: centerX, y: bottomLeft.y }], "center", silhouette),
  ];
}

function lineCandidate(id, points, role, sourceSilhouette) {
  return enrichCandidate(
    {
      id,
      element: "derived-line",
      d: `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`,
      bbox: bboxFromPoints(points),
      closed: false,
      sourceAttributes: { derivedFrom: sourceSilhouette.id, role },
    },
    "derived",
    "derived-from-silhouette",
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
  const scored = scoreSlot(slotId, candidates, silhouette, axis).sort((a, b) => b.score - a.score);
  const best = scored[0];
  const hardFloor = 0.3;
  const threshold = slotId === "center_front" ? 0.7 : slotId === "hem_front" ? 0.55 : 0.6;
  if (!best || best.score < hardFloor) {
    return missingSlot(slotId, true, `No plausible ${slotId.replaceAll("_", " ")} curve was found.`);
  }
  const status = best.score >= threshold ? "assigned" : "assumed";
  return slotAssignment(slotId, best.candidate, {
    required: true,
    status,
    confidence: best.score,
    ruleScores: best.ruleScores,
    assumption: status === "assumed" ? `${slotId.replaceAll("_", " ")} is below the ambiguity threshold.` : undefined,
  });
}

function assignOptionalSlot(slotId, candidates, silhouette, axis) {
  const scored = scoreSlot(slotId, candidates, silhouette, axis).sort((a, b) => b.score - a.score);
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

function ruleScoresForSlot(slotId, candidate, silhouette, axis) {
  const rules = [];
  const id = candidate.id.toLowerCase();
  const bbox = candidate.bbox;
  const panel = silhouette?.bbox;
  const left = panel && bbox ? midX(bbox) < axis.x : false;
  const right = panel && bbox ? midX(bbox) > axis.x : false;

  const add = (id, weight, score, reason) => rules.push({ id, weight, score: clamp01(score), reason });
  const hintScore = (text) => (id.includes(text) ? 1 : 0);
  const derivedScore = (role) => (candidate.sourceAttributes?.role === role ? 0.9 : 0);

  if (slotId === "hem_front") {
    add("id-or-derived-hem", 0.7, Math.max(hintScore("hem"), derivedScore("hem")), "Prefer explicit or derived hem candidates.");
    add("lowest-horizontal-spanning-curve", 0.7, horizontalBottomScore(candidate, panel), "Hem should be low, wide, and horizontal.");
  } else if (slotId === "neckline_front") {
    add("id-neckline", 0.75, hintScore("neckline"), "Prefer explicit neckline labels.");
    add("top-center-open-curve", 0.65, topCenterOpenScore(candidate, panel, axis), "Neckline should sit near the top and cross the center axis.");
  } else if (slotId === "center_front") {
    add("id-or-derived-center", 0.95, Math.max(hintScore("center"), derivedScore("center")), "Prefer explicit or derived center axis.");
    add("vertical-on-axis", 0.9, verticalAxisScore(candidate, panel, axis), "Center front should be vertical and near the symmetry axis.");
  } else if (slotId === "shoulder_left") {
    add("id-shoulder-left", 0.85, id.includes("shoulder") && id.includes("left") ? 1 : 0, "Prefer explicit left shoulder labels.");
    add("top-left-short-edge", 0.65, shoulderScore(candidate, panel, axis, "left"), "Left shoulder should be short and high.");
  } else if (slotId === "shoulder_right") {
    add("id-shoulder-right", 0.85, id.includes("shoulder") && id.includes("right") ? 1 : 0, "Prefer explicit right shoulder labels.");
    add("top-right-short-edge", 0.65, shoulderScore(candidate, panel, axis, "right"), "Right shoulder should be short and high.");
  } else if (slotId === "armhole_left") {
    add("id-or-derived-armhole-left", 0.8, (candidate.source === "trace" && id.includes("armhole") && left ? 1 : 0) || (derivedScore("armhole") && left ? 0.62 : 0), "Prefer left armhole labels or derived upper-side segment.");
    add("upper-left-lateral-edge", 0.65, upperSideScore(candidate, panel, axis, "left"), "Armhole should live high on the left side.");
  } else if (slotId === "armhole_right") {
    add("id-or-derived-armhole-right", 0.8, (candidate.source === "trace" && id.includes("armhole") && right ? 1 : 0) || (derivedScore("armhole") && right ? 0.62 : 0), "Prefer right armhole labels or derived upper-side segment.");
    add("upper-right-lateral-edge", 0.65, upperSideScore(candidate, panel, axis, "right"), "Armhole should live high on the right side.");
  } else if (slotId === "side_seam_left") {
    add("id-or-derived-side-left", 0.8, (id.includes("side") && left ? 1 : 0) || (derivedScore("side_seam") && left ? 0.9 : 0), "Prefer left side seam labels or derived lower-side segment.");
    add("left-long-vertical-edge", 0.75, sideSeamScore(candidate, panel, axis, "left"), "Left side seam should be long and lateral.");
  } else if (slotId === "side_seam_right") {
    add("id-or-derived-side-right", 0.8, (id.includes("side") && right ? 1 : 0) || (derivedScore("side_seam") && right ? 0.9 : 0), "Prefer right side seam labels or derived lower-side segment.");
    add("right-long-vertical-edge", 0.75, sideSeamScore(candidate, panel, axis, "right"), "Right side seam should be long and lateral.");
  } else if (slotId === "bust_dart_left" || slotId === "bust_dart_right") {
    add("id-dart", 0.8, hintScore("dart"), "Prefer explicit dart labels.");
    add("short-interior-line", 0.4, candidate.layer === "interior" && candidate.shape.length < height(panel) * 0.25 ? 0.5 : 0, "Dart candidates are short interior marks.");
  }

  return rules;
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

function buildAmbiguityReport(slots, trace, prior) {
  const questions = Object.values(slots)
    .filter((slot) => ["missing", "assumed", "needs-confirmation"].includes(slot.status))
    .map((slot) => ({
      slotId: slot.slotId,
      severity: slot.required && slot.status === "missing" ? "blocker" : "review",
      prompt: promptForSlot(slot),
      currentStatus: slot.status,
      confidence: slot.confidence,
    }));
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

function buildSketchIntent(slots, familyId) {
  return {
    promotionState: "interpreted",
    garmentType: familyId,
    silhouette: { type: "a-line", confidence: 0.78 },
    neckline: {
      shape: "scoop-or-curve",
      confidence: slots.neckline_front?.confidence ?? 0,
      from: slots.neckline_front?.curveId ? ["lm.front.neckline"] : [],
    },
    closure: { mode: "pullover-assumed", confidence: 0.52 },
    highConsequenceFeatures: {
      darts: {
        status:
          slots.bust_dart_left?.status === "needs-confirmation" || slots.bust_dart_right?.status === "needs-confirmation"
            ? "requires-review"
            : "not-detected",
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

function polylineLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += distance(points[i - 1], points[i]);
  return total;
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
