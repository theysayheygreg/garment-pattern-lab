import { panelWidth, round } from "../../pattern-core/src/measurements.mjs";

const asPath = (points) =>
  points
    .map((point, i) => `${i === 0 ? "M" : "L"} ${round(point.x)} ${round(point.y)}`)
    .join(" ");

const panelPath = (points) => `${asPath(points)} Z`;

function svgPanel(panel, params, xOffset, title) {
  const seam = panelPath(panel.seamLine.map((point) => ({ x: point.x + xOffset, y: point.y })));
  const cut = panelPath(panel.cutLine.map((point) => ({ x: point.x + xOffset, y: point.y })));
  const label = panel.labels[0];
  const notches = panel.seamLine
    .filter((point) => point.id === "shoulder-point" || point.id === "armhole-bottom")
    .map(
      (point) =>
        `<path d="M ${round(point.x + xOffset - 5)} ${round(point.y)} L ${round(point.x + xOffset + 5)} ${round(point.y)}" class="notch" />`,
    )
    .join("\n    ");
  return `
  <g id="${panel.id}">
    <path d="${cut}" class="cut" />
    <path d="${seam}" class="seam" />
    <line x1="${xOffset}" y1="${panel.seamLine[0].y}" x2="${xOffset}" y2="${panel.seamLine.at(-1).y}" class="fold" />
    <line x1="${xOffset + panel.grainline.x}" y1="${panel.grainline.y1}" x2="${xOffset + panel.grainline.x}" y2="${panel.grainline.y2}" class="grain" />
    ${notches}
    <text x="${xOffset + label.x}" y="${label.y}" class="label">${label.text}</text>
    <text x="${xOffset + 18}" y="${params.length + params.allowances.hem + 42}" class="caption">${title}</text>
  </g>`;
}

export function buildSvg(patternDoc, readinessDoc, params) {
  const front = patternDoc.panels[0];
  const back = patternDoc.panels[1];
  const panelGap = 130;
  const backOffset = panelWidth(front) + panelGap;
  const width = backOffset + panelWidth(back) + 80;
  const height = params.length + params.allowances.hem + 120;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${round(width)}mm" height="${round(height)}mm" viewBox="-30 -30 ${round(width)} ${round(height)}">
  <title>${patternDoc.title}</title>
  <style>
    .cut { fill: #fffdf7; stroke: #111827; stroke-width: 1.2; }
    .seam { fill: none; stroke: #2563eb; stroke-width: 0.8; stroke-dasharray: 6 4; }
    .fold { stroke: #dc2626; stroke-width: 0.8; stroke-dasharray: 2 4; }
    .grain { stroke: #047857; stroke-width: 0.9; marker-end: url(#arrow); }
    .notch { stroke: #111827; stroke-width: 1; }
    .label { font-family: Helvetica, Arial, sans-serif; font-size: 11px; letter-spacing: 0; }
    .caption, .info { font-family: Helvetica, Arial, sans-serif; font-size: 9px; letter-spacing: 0; fill: #374151; }
    .scale { fill: none; stroke: #111827; stroke-width: 0.8; }
  </style>
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" fill="#047857" />
    </marker>
  </defs>
  <text x="0" y="-12" class="info">${patternDoc.title} | units: mm | seam allowance: ${params.allowances.seam}mm | hem allowance: ${params.allowances.hem}mm | ${readinessDoc.overallState}</text>
  <rect x="0" y="${height - 70}" width="50" height="50" class="scale" />
  <text x="0" y="${height - 76}" class="caption">50mm scale square</text>
  ${svgPanel(front, params, 0, "front panel")}
  ${svgPanel(back, params, backOffset, "back panel")}
</svg>
`;
}

export function buildCutSheet(patternDoc, params, markerPlan = patternDoc.markerPlan) {
  const markerSection = markerPlan
    ? `
## Marker Layout

- Fabric width: ${markerPlan.fabricWidthIn} in (${markerPlan.fabricWidthMm}mm)
- Estimated fabric length: ${markerPlan.totalFabricLengthIn} in (${markerPlan.totalFabricLengthMm}mm)
- Layout method: non-optimized sequential marker
`
    : "";
  return `# Cut Sheet

Pattern: ${patternDoc.title}

Units: millimeters

## Pieces

| Piece | Cut | Notes |
| --- | --- | --- |
| Front half panel | 1 on fold | Dartless loose woven v0.1 draft |
| Back half panel | 1 on fold | Dartless loose woven v0.1 draft |

## Allowances

- Seam allowance: ${params.allowances.seam}mm
- Hem allowance: ${params.allowances.hem}mm
${markerSection}

## Known Limits

- Marker layout is non-optimized; nap, print direction, shrinkage, and fabric defects are not checked.
- True fit and drape are not checked.
- Head entry is not proven.
- Cut-line offsets are rough for v0.1.
`;
}

export function buildAssembly(patternDoc) {
  return `# Assembly Notes

${patternDoc.construction.map((step, i) => `${i + 1}. ${step}`).join("\n")}

## Assumptions

${patternDoc.assumptions.map((assumption) => `- ${assumption}`).join("\n")}
`;
}

export function buildReadinessMd(readinessDoc) {
  return `# Readiness Notes

${readinessDoc.designerSummary}

This is internal readiness instrumentation summarized for package review. It is not a designer-facing error console.

## Checks

| Check | State | Summary |
| --- | --- | --- |
${readinessDoc.checks.map((check) => `| ${check.id} | ${check.state} | ${check.summary} |`).join("\n")}
`;
}

export function buildPreview(patternDoc, readinessDoc) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${patternDoc.title} Preview</title>
  <style>
    body { margin: 0; font-family: Helvetica, Arial, sans-serif; background: #f8fafc; color: #111827; }
    main { display: grid; grid-template-columns: 1fr 320px; min-height: 100vh; }
    section { display: grid; place-items: center; padding: 32px; }
    aside { border-left: 1px solid #d1d5db; padding: 24px; background: #ffffff; }
    svg { width: min(76vw, 760px); height: auto; }
    .body { fill: #e5e7eb; stroke: #9ca3af; }
    .panel { fill: rgba(96, 165, 250, 0.28); stroke: #1d4ed8; stroke-width: 2; }
    .back { fill: rgba(16, 185, 129, 0.22); stroke: #047857; }
    .seam { stroke: #111827; stroke-width: 1.5; stroke-dasharray: 5 5; }
    h1 { font-size: 18px; margin: 0 0 12px; }
    p, li { font-size: 14px; line-height: 1.45; }
  </style>
</head>
<body>
  <main>
    <section>
      <svg viewBox="0 0 720 720" role="img" aria-label="Static rough garment preview">
        <ellipse cx="360" cy="112" rx="36" ry="46" class="body" />
        <path d="M 320 160 C 300 230 300 380 270 650 L 450 650 C 420 380 420 230 400 160 Z" class="body" />
        <path d="M 302 164 L 418 164 L 468 650 L 252 650 Z" class="panel" />
        <path d="M 318 176 L 402 176 L 444 628 L 276 628 Z" class="panel back" />
        <line x1="302" y1="164" x2="252" y2="650" class="seam" />
        <line x1="418" y1="164" x2="468" y2="650" class="seam" />
      </svg>
    </section>
    <aside>
      <h1>${patternDoc.title}</h1>
      <p><strong>Preview status:</strong> read-only static sanity view.</p>
      <p><strong>Readiness:</strong> ${readinessDoc.overallState}</p>
      <p>This preview shows orientation and rough silhouette only. It does not simulate cloth or prove fit.</p>
      <ul>
        <li>Front/back panels are represented as simple translucent shells.</li>
        <li>Side seams are indicated by dashed lines.</li>
        <li>PatternGraph remains the source of truth.</li>
      </ul>
    </aside>
  </main>
</body>
</html>
`;
}

export function buildDebugOverlayHtml({ trace, interpretation, calibratedInterpretation, draftingRequest, readiness }) {
  const paths = Object.entries(trace.layers ?? {}).flatMap(([layer, layerPaths]) =>
    layerPaths.map((path) => ({ ...path, layer })),
  );
  const bbox = unionBbox(paths.map((path) => path.bbox).filter(Boolean));
  const viewBox = bbox
    ? `${round(bbox.minX - 30)} ${round(bbox.minY - 30)} ${round(bbox.maxX - bbox.minX + 60)} ${round(bbox.maxY - bbox.minY + 60)}`
    : "0 0 1000 1000";
  const landmarkByCurve = new Map();
  for (const landmark of interpretation.landmarks ?? []) {
    for (const curveId of landmark.geometryRef?.sourceCurveIds ?? []) landmarkByCurve.set(curveId, landmark);
  }
  const pathMarkup = paths
    .map((path) => {
      const landmark = landmarkByCurve.get(path.id);
      const status = landmark?.status ?? path.layer;
      const label = landmark ? `${landmark.slot} ${Math.round(landmark.confidence * 100)}%` : `${path.layer}: ${path.id}`;
      return `<path id="overlay-${escapeAttr(path.id)}" d="${escapeAttr(path.d)}" class="curve ${escapeAttr(status)} ${escapeAttr(path.layer)}"><title>${escapeHtml(label)}</title></path>`;
    })
    .join("\n        ");
  const landmarkRows = (interpretation.landmarks ?? [])
    .map(
      (landmark) =>
        `<tr><td>${escapeHtml(landmark.slot)}</td><td>${escapeHtml(landmark.status)}</td><td>${Math.round(landmark.confidence * 100)}%</td><td>${escapeHtml((landmark.geometryRef?.sourceCurveIds ?? []).join(", "))}</td></tr>`,
    )
    .join("\n");
  const assumptionItems = [
    ...(draftingRequest?.evidence?.assumptions ?? []),
    ...(interpretation.ambiguityReport?.items ?? []),
  ]
    .map((item) => `<li>${escapeHtml(item.slot ?? item.slotId ?? "assumption")}: ${escapeHtml(item.message ?? item.prompt ?? item.currentStatus ?? "")}</li>`)
    .join("\n");
  const scale = calibratedInterpretation?.scaleCalibration;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sketch Debug Overlay</title>
  <style>
    body { margin: 0; font-family: Helvetica, Arial, sans-serif; color: #111827; background: #f8fafc; }
    main { display: grid; grid-template-columns: minmax(0, 1fr) 380px; min-height: 100vh; }
    section { padding: 24px; overflow: auto; }
    aside { border-left: 1px solid #d1d5db; background: #fff; padding: 20px; overflow: auto; }
    svg { width: 100%; min-width: 520px; background: #fffdf7; border: 1px solid #d1d5db; }
    .curve { fill: none; stroke-width: 4; opacity: 0.62; }
    .silhouette { stroke: #111827; opacity: 0.8; }
    .assigned { stroke: #2563eb; }
    .assumed, .needs-confirmation { stroke: #d97706; stroke-dasharray: 10 8; }
    .missing { stroke: #dc2626; }
    .not-present { stroke: #9ca3af; opacity: 0.25; }
    .annotation { stroke: #7c3aed; stroke-dasharray: 4 6; }
    h1 { font-size: 18px; margin: 0 0 12px; }
    h2 { font-size: 14px; margin: 24px 0 8px; }
    p, li, td, th { font-size: 12px; line-height: 1.4; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border-bottom: 1px solid #e5e7eb; padding: 6px 4px; text-align: left; vertical-align: top; }
    code { background: #f3f4f6; padding: 1px 4px; border-radius: 3px; }
  </style>
</head>
<body>
  <main>
    <section>
      <svg viewBox="${viewBox}" role="img" aria-label="Labeled sketch curves">
        ${pathMarkup}
      </svg>
    </section>
    <aside>
      <h1>Sketch Debug Overlay</h1>
      <p><strong>Trace:</strong> ${escapeHtml(trace.readiness?.status ?? "unknown")}</p>
      <p><strong>Interpretation:</strong> ${escapeHtml(interpretation.ambiguityReport?.status ?? "unknown")}</p>
      <p><strong>Drafting:</strong> ${escapeHtml(draftingRequest?.promotion?.state ?? "unknown")}</p>
      <p><strong>Readiness:</strong> ${escapeHtml(readiness?.overallState ?? "unknown")}</p>

      <h2>Scale</h2>
      <p><strong>Status:</strong> ${escapeHtml(scale?.unitProfile?.scaleStatus ?? "missing")} (${Math.round((scale?.unitProfile?.confidence ?? 0) * 100)}%)</p>
      <p><strong>Evidence:</strong> ${escapeHtml(scale?.evidence?.source ?? "missing")} <code>${escapeHtml(scale?.evidence?.sourceRef ?? "")}</code></p>

      <h2>Landmarks</h2>
      <table>
        <thead><tr><th>Slot</th><th>Status</th><th>Conf.</th><th>Curve</th></tr></thead>
        <tbody>${landmarkRows}</tbody>
      </table>

      <h2>Assumptions</h2>
      <ul>${assumptionItems || "<li>No assumptions reported.</li>"}</ul>
    </aside>
  </main>
</body>
</html>
`;
}

function unionBbox(boxes) {
  if (!boxes.length) return null;
  return {
    minX: Math.min(...boxes.map((box) => box.minX)),
    minY: Math.min(...boxes.map((box) => box.minY)),
    maxX: Math.max(...boxes.map((box) => box.maxX)),
    maxY: Math.max(...boxes.map((box) => box.maxY)),
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
