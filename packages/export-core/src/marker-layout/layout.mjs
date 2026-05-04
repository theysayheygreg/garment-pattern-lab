import { panelWidth, round } from "../../../pattern-core/src/measurements.mjs";

const DEFAULT_FABRIC_WIDTH_MM = 1143;
const DEFAULT_GUTTER_MM = 25.4;
const DEFAULT_EDGE_MARGIN_MM = 25.4;

export function buildMarkerPlan(patternDoc, options = {}) {
  const fabricWidthMm = options.fabricWidthMm ?? DEFAULT_FABRIC_WIDTH_MM;
  const gutterMm = options.gutterMm ?? DEFAULT_GUTTER_MM;
  const edgeMarginMm = options.edgeMarginMm ?? DEFAULT_EDGE_MARGIN_MM;
  let cursorY = edgeMarginMm;
  const placements = patternDoc.panels.map((panel) => {
    const bbox = bboxForPoints(panel.cutLine);
    const widthMm = round(panelWidth(panel, "cutLine"));
    const heightMm = round(bbox.maxY - bbox.minY);
    const placement = {
      panelId: panel.id,
      role: panel.role,
      x: edgeMarginMm,
      y: round(cursorY),
      widthMm,
      heightMm,
      rotation: 0,
      onFold: Boolean(panel.cut?.onFold),
      foldEdge: "left",
    };
    cursorY += heightMm + gutterMm;
    return placement;
  });

  const totalFabricLengthMm = round(cursorY - gutterMm + edgeMarginMm);
  const warnings = placements
    .filter((placement) => placement.x + placement.widthMm > fabricWidthMm - edgeMarginMm)
    .map((placement) => `${placement.panelId} exceeds available 45 inch fabric width.`);

  return {
    schemaVersion: "0.1-marker-plan",
    fabricWidthMm,
    fabricWidthIn: round(fabricWidthMm / 25.4),
    totalFabricLengthMm,
    totalFabricLengthIn: round(totalFabricLengthMm / 25.4),
    gutterMm,
    edgeMarginMm,
    placements,
    warnings,
    assumptions: [
      "Non-optimized sequential marker layout.",
      "No nap, print direction, shrinkage, or fabric defect handling.",
      "Panels are not rotated or nested in v0.1.",
    ],
  };
}

export function buildMarkerSvg(patternDoc, markerPlan) {
  const width = markerPlan.fabricWidthMm;
  const height = markerPlan.totalFabricLengthMm;
  const panelGroups = markerPlan.placements
    .map((placement) => {
      const panel = patternDoc.panels.find((candidate) => candidate.id === placement.panelId);
      const path = panelPath(panel.cutLine, placement.x, placement.y);
      const labelX = placement.x + Math.min(120, placement.widthMm * 0.35);
      const labelY = placement.y + Math.min(220, placement.heightMm * 0.45);
      return `
  <g id="marker-${placement.panelId}">
    <path d="${path}" class="panel" />
    <line x1="${placement.x}" y1="${placement.y}" x2="${placement.x}" y2="${placement.y + placement.heightMm}" class="fold" />
    <text x="${round(labelX)}" y="${round(labelY)}" class="label">${panel.name}</text>
    <text x="${round(labelX)}" y="${round(labelY + 16)}" class="caption">${placement.onFold ? "cut on fold" : "cut flat"}</text>
  </g>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${round(width)}mm" height="${round(height)}mm" viewBox="0 0 ${round(width)} ${round(height)}">
  <title>${patternDoc.title} marker layout</title>
  <style>
    .fabric { fill: #fffdf7; stroke: #111827; stroke-width: 1.2; }
    .panel { fill: rgba(191, 219, 254, 0.45); stroke: #1d4ed8; stroke-width: 1; }
    .fold { stroke: #dc2626; stroke-width: 0.9; stroke-dasharray: 4 4; }
    .label { font-family: Helvetica, Arial, sans-serif; font-size: 13px; letter-spacing: 0; fill: #111827; }
    .caption, .info { font-family: Helvetica, Arial, sans-serif; font-size: 10px; letter-spacing: 0; fill: #374151; }
  </style>
  <rect x="0" y="0" width="${round(width)}" height="${round(height)}" class="fabric" />
  <text x="24" y="28" class="info">45 in fabric width | total length ${markerPlan.totalFabricLengthIn} in | non-optimized marker</text>
${panelGroups}
</svg>
`;
}

function panelPath(points, xOffset, yOffset) {
  return `${points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${round(point.x + xOffset)} ${round(point.y + yOffset)}`)
    .join(" ")} Z`;
}

function bboxForPoints(points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}
