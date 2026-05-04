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
