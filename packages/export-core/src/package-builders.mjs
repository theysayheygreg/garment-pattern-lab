import { panelWidth, round } from "../../pattern-core/src/measurements.mjs";
import { buildStaticAssemblySceneData } from "../../preview-3d/src/static-assembly-scene.mjs";

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
  <text x="0" y="-12" class="info">${patternDoc.title} | imperial-first package | seam allowance: ${formatIn(params.allowances.seam)} (${formatMm(params.allowances.seam)}) | hem allowance: ${formatIn(params.allowances.hem)} (${formatMm(params.allowances.hem)}) | ${readinessDoc.overallState}</text>
  <rect x="0" y="${height - 45}" width="25.4" height="25.4" class="scale" />
  <text x="0" y="${height - 51}" class="caption">1 in scale square (25.4mm)</text>
  ${svgPanel(front, params, 0, "front panel")}
  ${svgPanel(back, params, backOffset, "back panel")}
</svg>
`;
}

export function buildOverviewBoard(patternDoc, readinessDoc, markerPlan = patternDoc.markerPlan, options = {}) {
  const body = patternDoc.bodyMeasurementSet?.measurements ?? {};
  const params = patternDoc.garmentParameters;
  const sourceSketchHref = options.sourceSketchHref ?? "source-sketch.svg";
  const hasSourceSketch = Boolean(options.sourceSketchHref);
  const front = patternDoc.panels[0];
  const back = patternDoc.panels[1];
  const miniFront = transformPanelPath(front.seamLine, { x: 560, y: 825, scale: 0.14 });
  const miniBack = transformPanelPath(back.seamLine, { x: 690, y: 825, scale: 0.14 });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <title>${escapeXml(patternDoc.title)} overview board</title>
  <desc>Kiko-style pattern overview board: source sketch, interpreted garment on croquis, measurement grid, pattern notes, and generated pattern pieces.</desc>
  <style>
    .page { fill: #faf8f2; }
    .rail { fill: rgba(255,255,255,0.84); stroke: #d8d6cf; }
    .paper { fill: #fffefa; filter: url(#paper-shadow); }
    .grid-minor { fill: none; stroke: #dde1e4; stroke-width: 1; }
    .grid-major { fill: none; stroke: #cbd2d8; stroke-width: 1.4; }
    .body { fill: #d9dcde; opacity: 0.72; }
    .body-line { fill: none; stroke: #b9bec3; stroke-width: 2; }
    .garment { fill: rgba(255,255,255,0.18); stroke: #111827; stroke-width: 2.3; }
    .garment-detail { fill: none; stroke: #111827; stroke-width: 1.1; opacity: 0.72; }
    .measure { stroke: #ee9bc6; stroke-width: 1.2; opacity: 0.78; }
    .callout { stroke: #111827; stroke-width: 1.2; fill: none; marker-end: url(#callout-arrow); }
    .cut-piece { fill: #fffdf7; stroke: #111827; stroke-width: 1.8; }
    .cut-piece-back { fill: #ecfdf5; stroke: #111827; stroke-width: 1.8; }
    .piece-fold { stroke: #dc2626; stroke-width: 1.1; stroke-dasharray: 3 5; }
    .grain { stroke: #047857; stroke-width: 1.4; marker-end: url(#grain-arrow); }
    .source-card { fill: #ffffff; stroke: #c9ced3; }
    .thumb-active { fill: none; stroke: #1f2937; stroke-width: 5; }
    .thumb { fill: #ffffff; stroke: #d6d9dd; }
    .label { font-family: Helvetica, Arial, sans-serif; font-size: 14px; fill: #111827; font-weight: 700; letter-spacing: 0; }
    .small { font-family: Helvetica, Arial, sans-serif; font-size: 12px; fill: #374151; letter-spacing: 0; }
    .tiny { font-family: Helvetica, Arial, sans-serif; font-size: 10px; fill: #4b5563; letter-spacing: 0; }
    .title { font-family: Georgia, 'Times New Roman', serif; font-size: 48px; fill: #1f2937; letter-spacing: 0; }
    .sheet-title { font-family: Helvetica, Arial, sans-serif; font-size: 15px; fill: #111827; font-weight: 700; letter-spacing: 0; }
    .badge-text { font-family: Helvetica, Arial, sans-serif; font-size: 18px; fill: #6b7280; font-weight: 700; letter-spacing: 5px; }
    .swatch-label { font-family: Helvetica, Arial, sans-serif; font-size: 11px; fill: #111827; letter-spacing: 0; }
  </style>
  <defs>
    <pattern id="board-grid" width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M 28 0 L 0 0 0 28" class="grid-minor" />
    </pattern>
    <pattern id="board-grid-major" width="140" height="140" patternUnits="userSpaceOnUse">
      <rect width="140" height="140" fill="url(#board-grid)" />
      <path d="M 140 0 L 0 0 0 140" class="grid-major" />
    </pattern>
    <filter id="paper-shadow" x="-8%" y="-8%" width="116%" height="116%">
      <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#111827" flood-opacity="0.12" />
    </filter>
    <marker id="callout-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#111827" />
    </marker>
    <marker id="grain-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#047857" />
    </marker>
  </defs>

  <rect width="1600" height="1000" class="page" />
  <text x="22" y="58" class="title">Projects</text>
  <rect x="0" y="82" width="1600" height="918" fill="url(#board-grid-major)" />
  <rect x="0" y="82" width="430" height="918" class="rail" />

  <g id="left-thumbnails">
    ${thumbnailSheet({ x: 42, y: 118, width: 338, height: 300, sourceSketchHref, hasSourceSketch, active: false, title: "INPUT" })}
    ${thumbnailOverview({ x: 42, y: 450, width: 338, height: 430, active: true })}
    <g transform="translate(70 136)">
      <rect x="0" y="28" width="174" height="56" rx="28" fill="#ffffff" stroke="#d1d5db" stroke-width="2" filter="url(#paper-shadow)" />
      <text x="28" y="64" class="badge-text">CROQUIS</text>
    </g>
  </g>

  <g id="source-reference">
    <rect x="515" y="125" width="300" height="360" rx="8" class="source-card" />
    ${
      hasSourceSketch
        ? `<image href="${escapeAttr(sourceSketchHref)}" x="540" y="150" width="250" height="300" preserveAspectRatio="xMidYMid meet" />`
        : `<text x="560" y="300" class="small">No source sketch in this run</text>`
    }
    <text x="535" y="518" class="label">SOURCE SKETCH</text>
    <text x="535" y="540" class="small">Input reference retained beside output</text>
  </g>

  <g id="nav-dots">
    <circle cx="890" cy="500" r="34" fill="#ffffff" opacity="0.88" filter="url(#paper-shadow)" />
    <path d="M 880 480 L 900 500 L 880 520" fill="none" stroke="#4b5563" stroke-width="4" />
    <circle cx="470" cy="500" r="34" fill="#ffffff" opacity="0.88" filter="url(#paper-shadow)" />
    <path d="M 480 480 L 460 500 L 480 520" fill="none" stroke="#4b5563" stroke-width="4" />
  </g>

  <g id="main-overview-sheet">
    <rect x="980" y="125" width="480" height="765" class="paper" />
    <rect x="1018" y="160" width="365" height="690" fill="none" stroke="#ef9bc5" stroke-width="1.6" />
    <line x1="1199" y1="145" x2="1199" y2="875" class="measure" />
    <line x1="1040" y1="285" x2="1428" y2="285" class="measure" />
    <line x1="1040" y1="365" x2="1428" y2="365" class="measure" />
    <line x1="1040" y1="475" x2="1428" y2="475" class="measure" />
    <line x1="1040" y1="590" x2="1428" y2="590" class="measure" />
    <line x1="1040" y1="805" x2="1428" y2="805" class="measure" />
    <line x1="1008" y1="168" x2="1008" y2="804" class="measure" />
    <line x1="1438" y1="174" x2="1438" y2="804" class="measure" />

    ${bodyReference()}
    ${aLineGarmentOnBody()}
    ${pleatLines()}
    ${callout(1300, 212, 1198, 194, "HEAD REFERENCE")}
    ${callout(1306, 272, 1212, 286, "FRONT NECK POINT")}
    ${callout(1290, 344, 1254, 345, "ARMHOLE DEPTH")}
    ${callout(1320, 430, 1232, 415, `BUST ${formatIn(body.bust)}`)}
    ${callout(1325, 528, 1228, 526, "A-LINE SIDE SEAM")}
    ${callout(1325, 642, 1245, 642, `HEM SWEEP ${formatIn(patternDoc.patternMeasurements.fullHemSweep)}`)}
    ${callout(1090, 760, 1166, 736, `LENGTH ${formatIn(patternDoc.patternMeasurements.finishedLength)}`)}
    ${callout(1080, 388, 1134, 365, "CENTER FRONT / FOLD")}

    <text x="1000" y="190" class="tiny" transform="rotate(-90 1000 190)">SHOULDER</text>
    <text x="1000" y="344" class="tiny" transform="rotate(-90 1000 344)">CHEST TO WAIST</text>
    <text x="1000" y="494" class="tiny" transform="rotate(-90 1000 494)">WAIST TO HIP</text>
    <text x="1422" y="625" class="tiny" transform="rotate(90 1422 625)">TOTAL HEIGHT / BODY REFERENCE GRID</text>

    <g id="status-and-swatches">
      <rect x="1000" y="858" width="12" height="12" fill="#ef9bc5" />
      <text x="1018" y="868" class="swatch-label">MEASUREMENT GRID</text>
      <rect x="1120" y="858" width="12" height="12" fill="#111827" />
      <text x="1138" y="868" class="swatch-label">INTERPRETED GARMENT</text>
      <rect x="1266" y="858" width="12" height="12" fill="#2563eb" />
      <text x="1284" y="868" class="swatch-label">SEAM LINE</text>
    </g>
  </g>

  <g id="notes">
    <text x="515" y="645" class="label">${escapeXml(patternDoc.title)}</text>
    <text x="515" y="670" class="small">Readiness: ${escapeXml(readinessDoc.overallState)}</text>
    <text x="515" y="696" class="small">Seam allowance: ${formatIn(params.allowances.seam)} | Hem allowance: ${formatIn(params.allowances.hem)}</text>
    <text x="515" y="722" class="small">Marker: ${markerPlan ? `${markerPlan.fabricWidthIn} in fabric / ${markerPlan.totalFabricLengthIn} in length` : "not generated"}</text>
    <text x="515" y="758" class="small">This overview is for design and pattern review. Open marker.svg for actual fabric layout.</text>
  </g>

  <g id="generated-pattern-card">
    <rect x="515" y="778" width="300" height="200" rx="8" class="source-card" />
    <text x="535" y="805" class="label">GENERATED PIECES</text>
    <path d="${miniFront}" class="cut-piece" />
    <path d="${miniBack}" class="cut-piece-back" />
    <line x1="560" y1="827" x2="560" y2="928" class="piece-fold" />
    <line x1="690" y1="827" x2="690" y2="928" class="piece-fold" />
    <line x1="590" y1="850" x2="590" y2="912" class="grain" />
    <line x1="720" y1="850" x2="720" y2="912" class="grain" />
    <text x="535" y="960" class="tiny">FRONT/BACK: CUT 1 EACH ON FOLD</text>
  </g>
</svg>
`;
}

export function buildCutSheet(patternDoc, params, markerPlan = patternDoc.markerPlan) {
  const body = patternDoc.bodyMeasurementSet?.measurements ?? {};
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

Units: imperial-first. Metric is retained as the internal engine unit and secondary reference.

## Print Scale

- Print at 100% scale; do not fit to page.
- Measure the 1 in scale square on \`pattern.svg\` before cutting.
- This v0.1 package is SVG-first; tiled home-print PDF is still missing.

## Body Fixture

| Measurement | Value |
| --- | ---: |
| Bust | ${formatInWithMetric(body.bust)} |
| Waist | ${formatInWithMetric(body.waist)} |
| Hip | ${formatInWithMetric(body.hip)} |
| Shoulder width | ${formatInWithMetric(body.shoulderWidth)} |
| Armhole depth | ${formatInWithMetric(body.armholeDepth)} |

## Finished Draft Measurements

| Measurement | Value |
| --- | ---: |
| Finished length | ${formatInWithMetric(patternDoc.patternMeasurements.finishedLength)} |
| Full hem sweep | ${formatInWithMetric(patternDoc.patternMeasurements.fullHemSweep)} |
| Front shoulder seam | ${formatInWithMetric(patternDoc.patternMeasurements.front.shoulder)} |
| Back shoulder seam | ${formatInWithMetric(patternDoc.patternMeasurements.back.shoulder)} |
| Front side seam | ${formatInWithMetric(patternDoc.patternMeasurements.front.side)} |
| Back side seam | ${formatInWithMetric(patternDoc.patternMeasurements.back.side)} |

## Pieces

| Piece | Cut | Notes |
| --- | --- | --- |
| Front half panel | 1 on fold | Place center front on fabric fold; do not add extra seam allowance at fold. |
| Back half panel | 1 on fold | Place center back on fabric fold; do not add extra seam allowance at fold. |

## Allowances

- Seam allowance: ${formatInWithMetric(params.allowances.seam)}
- Hem allowance: ${formatInWithMetric(params.allowances.hem)}
- Neckline finish: ${params.finishing.neckline}
- Armhole finish: ${params.finishing.armhole}
${markerSection}

## Known Limits

- Marker layout is non-optimized; nap, print direction, shrinkage, and fabric defects are not checked.
- True fit and drape are not checked.
- Head entry is not proven.
- Seam allowance uses a v0.1 boundary-normal offset; review corner cleanup before sewing beyond muslin.
`;
}

function formatMm(value) {
  return `${round(value)}mm`;
}

function formatIn(value) {
  return `${round((value ?? 0) / 25.4)} in`;
}

function formatInWithMetric(value) {
  return `${formatIn(value)} (${formatMm(value)})`;
}

function transformPanelPath(points, { x, y, scale }) {
  if (!points?.length) return "";
  const minX = Math.min(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  return `${points
    .map((point, index) => {
      const tx = round(x + (point.x - minX) * scale);
      const ty = round(y + (point.y - minY) * scale);
      return `${index === 0 ? "M" : "L"} ${tx} ${ty}`;
    })
    .join(" ")} Z`;
}

function bodyReference() {
  return `
    <path class="body" d="M 1198 175 C 1242 175 1276 210 1272 252 C 1268 282 1242 306 1210 312 L 1210 338 C 1272 348 1308 394 1302 466 C 1294 558 1270 640 1250 738 C 1243 780 1233 840 1218 868 L 1180 868 C 1167 840 1158 780 1150 738 C 1130 640 1108 558 1100 466 C 1093 394 1128 348 1188 338 L 1188 312 C 1158 306 1132 282 1128 252 C 1122 210 1156 175 1198 175 Z" />
    <path class="body-line" d="M 1172 222 C 1184 214 1212 214 1224 222 M 1174 247 C 1188 260 1208 260 1222 247 M 1198 312 L 1198 838 M 1132 364 C 1170 380 1228 380 1266 364 M 1120 475 C 1172 492 1226 492 1280 475 M 1110 590 C 1168 610 1232 610 1290 590" />
  `;
}

function aLineGarmentOnBody() {
  return `
    <path class="garment" d="M 1148 318 C 1162 296 1235 296 1250 318 L 1272 372 C 1288 470 1310 600 1330 790 L 1068 790 C 1088 600 1110 470 1126 372 Z" />
    <path class="garment-detail" d="M 1162 318 C 1173 352 1226 352 1238 318" />
    <path class="garment-detail" d="M 1198 322 L 1198 790" stroke-dasharray="8 8" />
    <path class="garment-detail" d="M 1126 372 C 1118 418 1112 462 1110 506" />
    <path class="garment-detail" d="M 1272 372 C 1280 418 1286 462 1288 506" />
  `;
}

function pleatLines() {
  const lines = [];
  for (let x = 1092; x <= 1308; x += 16) {
    lines.push(`<path d="M ${x} 342 C ${x - 8} 500 ${x - 14} 645 ${x - 20} 790" stroke="#111827" stroke-width="0.7" opacity="0.42" fill="none" />`);
  }
  return lines.join("\n    ");
}

function callout(textX, textY, targetX, targetY, text) {
  return `
    <path d="M ${textX - 12} ${textY + 3} L ${targetX} ${targetY}" class="callout" />
    <text x="${textX}" y="${textY}" class="tiny">${escapeXml(text)}</text>`;
}

function thumbnailSheet({ x, y, width, height, sourceSketchHref, hasSourceSketch, active, title }) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${width}" height="${height}" class="thumb" />
      <rect x="18" y="18" width="${width - 36}" height="${height - 36}" fill="#fffefa" stroke="#ef9bc5" />
      ${
        hasSourceSketch
          ? `<image href="${escapeAttr(sourceSketchHref)}" x="40" y="40" width="${width - 80}" height="${height - 96}" preserveAspectRatio="xMidYMid meet" opacity="0.82" />`
          : `<path d="M ${width * 0.4} 60 C ${width * 0.62} 95 ${width * 0.62} ${height - 55} ${width * 0.4} ${height - 35}" class="body" />`
      }
      <text x="24" y="${height - 20}" class="tiny">${escapeXml(title)}</text>
      ${active ? `<rect width="${width}" height="${height}" class="thumb-active" />` : ""}
    </g>`;
}

function thumbnailOverview({ x, y, width, height, active }) {
  return `
    <g transform="translate(${x} ${y})">
      <rect width="${width}" height="${height}" class="thumb" />
      <rect x="18" y="18" width="${width - 36}" height="${height - 36}" fill="#fffefa" stroke="#ef9bc5" />
      <path d="M 164 54 C 206 54 236 86 230 130 C 225 162 200 180 184 190 L 214 372 L 112 372 L 144 190 C 124 176 104 154 100 130 C 94 86 124 54 164 54 Z" class="body" />
      <path d="M 118 128 C 142 106 188 106 210 128 L 228 184 C 240 250 250 306 264 390 L 72 390 C 88 306 98 250 110 184 Z" class="garment" />
      <line x1="164" y1="78" x2="164" y2="388" class="measure" />
      <line x1="54" y1="178" x2="286" y2="178" class="measure" />
      <line x1="54" y1="268" x2="286" y2="268" class="measure" />
      <text x="24" y="${height - 20}" class="tiny">OVERVIEW / PATTERN</text>
      ${active ? `<rect width="${width}" height="${height}" class="thumb-active" />` : ""}
    </g>`;
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function buildAssembly(patternDoc) {
  return `# Assembly Notes

${patternDoc.construction.map((step, i) => `${i + 1}. ${step}`).join("\n")}

## Muslin Notes

- Make this first in inexpensive woven muslin or comparable test fabric.
- Do not cut fashion fabric from this v0.1 package without a human pattern review.
- Use bias binding or a facing for neckline and armholes; v0.1 does not choose that construction detail for you.
- Check head entry before finishing the neckline because no closure is modeled.

## Assumptions

${patternDoc.assumptions.map((assumption) => `- ${assumption}`).join("\n")}
`;
}

export function buildHumanSanityCheck(patternDoc, readinessDoc, markerPlan = patternDoc.markerPlan) {
  const sourceSketch = patternDoc.source?.sourceSketch ?? "none; generated from measurement and parameter fixtures";
  return `# Human Sanity Check

Pattern: ${patternDoc.title}

Readiness: ${readinessDoc.overallState}

Source sketch: ${sourceSketch}

This is the package-local review sheet for the dirty v0.1 spike. It is meant for a sewing-literate human before cutting anything beyond muslin.

## Print And Scale

- [ ] Open \`pattern.svg\` and confirm the 1 in scale square measures 1 in after printing.
- [ ] Confirm the front and back panels print at the same scale.
- [ ] Confirm labels, grainlines, fold lines, seam lines, cut lines, and notches are visible.

## Pattern Shape

- [ ] Confirm the front and back look like a sleeveless A-line woven dress/tunic.
- [ ] Confirm the neckline and armholes look plausible for the design.
- [ ] Confirm side seams and shoulders appear matchable.
- [ ] Confirm hem sweep and finished length match the intended silhouette.

## Sewing Review

- [ ] Confirm seam allowance (${formatInWithMetric(patternDoc.garmentParameters.allowances.seam)}) and hem allowance (${formatInWithMetric(patternDoc.garmentParameters.allowances.hem)}) are acceptable for the muslin.
- [ ] Decide binding vs facing for neckline and armholes.
- [ ] Check head entry before finishing the neckline; no closure is modeled.
- [ ] Record any required patternmaker changes before a second draft.

## Marker

- Fabric width: ${markerPlan?.fabricWidthIn ?? "unknown"} in
- Estimated fabric length: ${markerPlan?.totalFabricLengthIn ?? "unknown"} in
- Marker status: non-optimized v0.1 reference layout, not production nesting.

## Assumptions To Review

${patternDoc.assumptions.map((assumption) => `- ${assumption}`).join("\n")}

## Result

- [ ] Pass for paper/muslin sanity check
- [ ] Needs another generated draft before printing
- [ ] Needs patternmaker intervention

Reviewer notes:

`;
}

export function buildHumanGuide(patternDoc, readinessDoc, markerPlan = patternDoc.markerPlan) {
  const body = patternDoc.bodyMeasurementSet?.measurements ?? {};
  const sourceSketch = patternDoc.source?.sourceSketch ?? "measurement + parameter fixture";
  return `# ${patternDoc.title}

Readiness: ${readinessDoc.overallState}

Source sketch: ${sourceSketch}

This is the human-facing v0.1 review guide. It is intentionally one document: garment snapshot, measurements, cut notes, sewing order, assumptions, and sanity-check prompts are here instead of spread across separate Markdown files.

## Files In This Output

- \`source-sketch.svg\` — input sketch that produced this package, when available.
- \`overview.svg\` — Kiko-style overview board showing input, interpreted garment, measurements, callouts, and generated pieces.
- \`pattern.svg\` — generated pattern flats with a 1 in scale square.
- \`preview.html\` — static 3D assembly preview, not cloth simulation.
- \`guide.md\` — this document.

## Visual Output Model

The next human-facing package should open like a pattern overview board: source sketch, interpreted garment, body/croquis measurement context, generated pattern pieces, measurements, and callouts in one visual sheet.

\`overview.svg\` is the first real v0.1 version of that overview sheet. \`pattern.svg\` remains the cleaner flat pattern source with scale proof, labels, seam allowance, fold lines, grainlines, and key pattern marks.

The marker is a separate sheet: actual fabric layout and consumption on a fabric width. It is kept in developer/package output for this simple two-piece harness, but it becomes a human-facing file again when garments have enough cut components for layout to matter.

## Garment Snapshot

| Field | Value |
| --- | --- |
| Garment | Sleeveless A-line woven dress/tunic |
| Fit | Loose pullover, dartless v0.1 draft |
| Closure | None modeled; head entry must be checked |
| Front/back pieces | Cut 1 each on fold |
| Fabric marker | ${markerPlan ? `${markerPlan.fabricWidthIn} in wide, ${markerPlan.totalFabricLengthIn} in estimated length` : "not generated"} |

## Print Scale

- Print \`pattern.svg\` at 100% scale; do not fit to page.
- Measure the 1 in scale square before cutting.
- This v0.1 package is SVG-first; tiled home-print PDF is still missing.

## Body Fixture

| Measurement | Value |
| --- | ---: |
| Bust | ${formatInWithMetric(body.bust)} |
| Waist | ${formatInWithMetric(body.waist)} |
| Hip | ${formatInWithMetric(body.hip)} |
| Shoulder width | ${formatInWithMetric(body.shoulderWidth)} |
| Armhole depth | ${formatInWithMetric(body.armholeDepth)} |

## Finished Draft Measurements

| Measurement | Value |
| --- | ---: |
| Finished length | ${formatInWithMetric(patternDoc.patternMeasurements.finishedLength)} |
| Full hem sweep | ${formatInWithMetric(patternDoc.patternMeasurements.fullHemSweep)} |
| Front shoulder seam | ${formatInWithMetric(patternDoc.patternMeasurements.front.shoulder)} |
| Back shoulder seam | ${formatInWithMetric(patternDoc.patternMeasurements.back.shoulder)} |
| Front side seam | ${formatInWithMetric(patternDoc.patternMeasurements.front.side)} |
| Back side seam | ${formatInWithMetric(patternDoc.patternMeasurements.back.side)} |

## Pieces

| Piece | Cut | Notes |
| --- | --- | --- |
| Front half panel | 1 on fold | Place center front on fabric fold; do not add extra seam allowance at fold. |
| Back half panel | 1 on fold | Place center back on fabric fold; do not add extra seam allowance at fold. |

## Allowances And Finishes

- Seam allowance: ${formatInWithMetric(patternDoc.garmentParameters.allowances.seam)}
- Hem allowance: ${formatInWithMetric(patternDoc.garmentParameters.allowances.hem)}
- Neckline finish: ${patternDoc.garmentParameters.finishing.neckline}
- Armhole finish: ${patternDoc.garmentParameters.finishing.armhole}

## Assembly

${patternDoc.construction.map((step, index) => `${index + 1}. ${step}`).join("\n")}

## Assumptions

${patternDoc.assumptions.map((assumption) => `- ${assumption}`).join("\n")}

## Review Checklist

- [ ] Confirm the generated pattern visually matches the source sketch.
- [ ] Confirm the 1 in scale square measures correctly.
- [ ] Confirm labels, grainlines, fold lines, seam lines, cut lines, and notches are visible.
- [ ] Confirm neckline and armholes look plausible.
- [ ] Confirm side seams and shoulders appear matchable.
- [ ] Confirm head entry before finishing the neckline; no closure is modeled.
- [ ] Record whether this passes for paper/muslin sanity check, needs another generated draft, or needs patternmaker intervention.

## Known Limits

- True fit and drape are not checked.
- The preview is a static assembly view, not a garment simulation.
- This A-line two-panel garment is now a smoke-test harness, not the main benchmark for product quality.
`;
}

export function buildPackageOverview(patternDoc, readinessDoc, markerPlan = patternDoc.markerPlan) {
  const sourceSketch = patternDoc.source?.sourceSketch ?? "measurement + parameter fixture";
  return `# Package Overview

Pattern: ${patternDoc.title}

Readiness: ${readinessDoc.overallState}

Source: ${sourceSketch}

This is the one-file front door for the v0.1 package. It gathers the garment shape, measurements, preview, cutting notes, and review path so the package does not feel scattered across artifacts.

## Open First

- \`preview.html\` — static 3D assembly preview, not cloth simulation.
- \`pattern.svg\` — source pattern flats with a 1 in scale square.
- \`cut-sheet.md\` — cutting quantities, body fixture, finished draft measurements, marker summary.
- \`assembly.md\` — sewing order and muslin notes.
- \`human-sanity-check.md\` — review checklist before cutting anything beyond muslin.

## Garment Snapshot

| Field | Value |
| --- | --- |
| Garment | Sleeveless A-line woven dress/tunic |
| Fit | Loose pullover, dartless v0.1 draft |
| Closure | None modeled; head entry must be checked |
| Front/back pieces | Cut 1 each on fold |
| Fabric marker | ${markerPlan ? `${markerPlan.fabricWidthIn} in wide, ${markerPlan.totalFabricLengthIn} in estimated length` : "not generated"} |

## Key Measurements

| Measurement | Value |
| --- | ---: |
| Body bust | ${formatInWithMetric(patternDoc.bodyMeasurementSet.measurements.bust)} |
| Body hip | ${formatInWithMetric(patternDoc.bodyMeasurementSet.measurements.hip)} |
| Finished length | ${formatInWithMetric(patternDoc.patternMeasurements.finishedLength)} |
| Full hem sweep | ${formatInWithMetric(patternDoc.patternMeasurements.fullHemSweep)} |
| Seam allowance | ${formatInWithMetric(patternDoc.garmentParameters.allowances.seam)} |
| Hem allowance | ${formatInWithMetric(patternDoc.garmentParameters.allowances.hem)} |

## Shape Fidelity Note

v0.1 now samples neckline, armhole, and side-seam curves instead of drawing a few chunky polygon anchors. It is still a rough generated draft, not a production pattern or fit-proven garment.

## Review Gate

Do not treat this package as fashion-fabric-ready. Print or inspect at scale, review the curve quality and head entry, then record the result in \`human-sanity-check.md\`.
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
  const sceneData = buildStaticAssemblySceneData(patternDoc);
  const sceneJson = JSON.stringify(sceneData).replaceAll("</", "<\\/");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${patternDoc.title} Preview</title>
  <style>
    body { margin: 0; font-family: Helvetica, Arial, sans-serif; background: #f8fafc; color: #111827; }
    main { display: grid; grid-template-columns: 1fr 320px; min-height: 100vh; }
    section { position: relative; min-height: 100vh; }
    aside { border-left: 1px solid #d1d5db; padding: 24px; background: #ffffff; }
    canvas { display: block; width: 100%; height: 100vh; }
    h1 { font-size: 18px; margin: 0 0 12px; }
    p, li { font-size: 14px; line-height: 1.45; }
  </style>
</head>
<body>
  <main>
    <section>
      <canvas id="static-assembly-preview" aria-label="Three.js static assembly preview"></canvas>
    </section>
    <aside>
      <h1>${patternDoc.title}</h1>
      <p><strong>Preview status:</strong> read-only Three.js static assembly view.</p>
      <p><strong>Readiness:</strong> ${readinessDoc.overallState}</p>
      <p>This preview shows panel orientation around a muted body proxy. It does not simulate cloth or prove fit.</p>
      <ul>
        <li>Front/back panels are sourced from PatternGraph seam lines.</li>
        <li>Shoulder and side seam pairs are rendered as guide lines.</li>
        <li>PatternGraph remains the source of truth.</li>
      </ul>
    </aside>
  </main>
  <script id="static-assembly-scene-data" type="application/json">${sceneJson}</script>
  <script type="module">
    import * as THREE from "https://unpkg.com/three@0.164.1/build/three.module.js";

    const sceneData = JSON.parse(document.getElementById("static-assembly-scene-data").textContent);
    const canvas = document.getElementById("static-assembly-preview");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
    camera.position.set(0.15, 0.25, 3.1);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd1d5db, 1.8));
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(sceneData.bodyProxy.shoulderWidth * 0.55, sceneData.bodyProxy.height * 0.75, 8, 16),
      new THREE.MeshBasicMaterial({ color: 0xe5e7eb, transparent: true, opacity: 0.42, wireframe: true }),
    );
    scene.add(body);

    const panelMaterial = (color) => new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    for (const panel of sceneData.panels) {
      const shape = new THREE.Shape(panel.seamLine.map((point) => new THREE.Vector2(point.x, point.y)));
      const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), panelMaterial(panel.color));
      mesh.name = panel.id;
      mesh.position.set(panel.position.x, panel.position.y, panel.position.z);
      mesh.rotation.y = panel.rotationY;
      scene.add(mesh);

      const points = panel.seamLine.map((point) => new THREE.Vector3(point.x + panel.position.x, point.y, panel.position.z));
      points.push(points[0].clone());
      const outline = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0x111827, transparent: true, opacity: 0.72 }),
      );
      outline.name = panel.id + "-outline";
      scene.add(outline);
    }

    for (const pair of sceneData.seamPairs) {
      const material = new THREE.LineDashedMaterial({ color: pair.id === "side-seams" ? 0x111827 : 0x7c3aed, dashSize: 0.035, gapSize: 0.025 });
      const y = pair.id === "side-seams" ? -0.06 : 0.42;
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-0.58, y, 0.24),
        new THREE.Vector3(0.58, y, -0.24),
      ]), material);
      line.name = pair.id;
      line.computeLineDistances();
      scene.add(line);
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }

    function animate(time) {
      resize();
      scene.rotation.y = Math.sin(time * 0.00035) * 0.18;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
    window.__GARMENT_PATTERN_LAB_THREE_SCENE__ = { THREE, sceneData, scene };
  </script>
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

export function buildPackageManifest(patternDoc, readinessDoc, markerPlan, options = {}) {
  const packageFiles = [
    { path: "package/overview.md", role: "package-front-door", format: "markdown" },
    { path: "package/overview.svg", role: "designer-pattern-overview-board", format: "svg" },
    { path: "package/pattern.svg", role: "printable-pattern-source", format: "svg" },
    { path: "package/marker.svg", role: "fabric-marker-layout", format: "svg" },
    { path: "package/cut-sheet.md", role: "human-cut-instructions", format: "markdown" },
    { path: "package/assembly.md", role: "human-sewing-instructions", format: "markdown" },
    { path: "package/human-sanity-check.md", role: "human-review-checklist", format: "markdown" },
    { path: "package/preview.html", role: "static-layout-preview", format: "html" },
    ...(options.sourceSketch ? [{ path: "package/source-sketch.svg", role: "source-sketch", format: "svg" }] : []),
  ];
  const devFiles = [
    { path: "dev-artifacts/pattern-graph.json", role: "pattern-graph-candidate", format: "json" },
    { path: "dev-artifacts/readiness.json", role: "readiness-report", format: "json" },
    { path: "dev-artifacts/readiness.md", role: "readiness-summary", format: "markdown" },
    { path: "dev-artifacts/marker-plan.json", role: "marker-plan", format: "json" },
    ...(options.hasSketchPipeline
      ? [
          { path: "dev-artifacts/editable-trace-layer.json", role: "trace-layer", format: "json" },
          { path: "dev-artifacts/sketch-interpretation.json", role: "semantic-interpretation", format: "json" },
          { path: "dev-artifacts/interpretation-trace.json", role: "semantic-score-tables", format: "json" },
          { path: "dev-artifacts/scale-calibration.json", role: "scale-calibration", format: "json" },
          { path: "dev-artifacts/drafting-request.json", role: "drafting-request", format: "json" },
          { path: "dev-artifacts/debug-overlay.html", role: "labeled-curve-debug-overlay", format: "html" },
        ]
      : []),
  ];
  return {
    schemaVersion: "0.1-package-manifest",
    patternId: patternDoc.id,
    title: patternDoc.title,
    generatedAt: readinessDoc.generatedAt,
    readiness: readinessDoc.overallState,
    units: patternDoc.units,
    source: patternDoc.source,
    marker: markerPlan
      ? {
          fabricWidthIn: markerPlan.fabricWidthIn,
          totalFabricLengthIn: markerPlan.totalFabricLengthIn,
          warningCount: markerPlan.warnings.length,
        }
      : null,
    packageFiles,
    devFiles,
    assumptions: patternDoc.assumptions,
    knownMissing: [
      "pattern.pdf tiled home-print export",
      "marker.pdf printable marker export",
      "cloth simulation or fit proof",
    ],
  };
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
