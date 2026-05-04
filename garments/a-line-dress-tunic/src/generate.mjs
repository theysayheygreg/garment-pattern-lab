#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const garmentRoot = path.resolve(__dirname, "..");
const outputDir = path.join(garmentRoot, "outputs", "v0.1");
const checkOnly = process.argv.includes("--check");

const readJson = (relativePath) =>
  JSON.parse(fs.readFileSync(path.join(garmentRoot, relativePath), "utf8"));

const body = readJson("fixtures/measurements/v0.1-body.json");
const params = readJson("fixtures/parameters/v0.1-parameters.json");

const round = (n) => Math.round(n * 100) / 100;
const dist = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);
const pathLength = (points) =>
  points.slice(1).reduce((sum, point, i) => sum + dist(points[i], point), 0);

const asPath = (points) =>
  points
    .map((point, i) => `${i === 0 ? "M" : "L"} ${round(point.x)} ${round(point.y)}`)
    .join(" ");

const panelPath = (points) => `${asPath(points)} Z`;

const makePanel = (kind) => {
  const bustQuarter = (body.measurements.bust + params.ease.bust) / 4;
  const hipQuarter = (body.measurements.hip + params.ease.hip) / 4;
  const hemQuarter = params.silhouette.hemSweep / 4;
  const shoulderOuter = body.measurements.shoulderWidth / 2 - params.shoulder.neckToShoulderInset;
  const neckWidth = params.neckline.width;
  const neckDepth = kind === "front" ? params.neckline.frontDepth : params.neckline.backDepth;
  const armholeY = params.armhole.depth;
  const bustY = armholeY + 35;
  const hipY = body.measurements.hipDepth;
  const hemY = params.length;
  const sideAtHem = hemQuarter;
  const sideAtHip = hipQuarter;
  const sideAtBust = bustQuarter;

  const seamLine = [
    { id: "center-neck", x: 0, y: neckDepth },
    { id: "neck-shoulder", x: neckWidth, y: 0 },
    { id: "shoulder-point", x: shoulderOuter, y: params.shoulder.drop },
    { id: "armhole-bottom", x: sideAtBust, y: armholeY },
    { id: "bust-side", x: sideAtBust, y: bustY },
    { id: "hip-side", x: sideAtHip, y: hipY },
    { id: "hem-side", x: sideAtHem, y: hemY },
    { id: "center-hem", x: 0, y: hemY },
  ];

  const seamAllowance = params.allowances.seam;
  const hemAllowance = params.allowances.hem;
  const cutLine = [
    { x: 0, y: neckDepth },
    { x: Math.max(0, neckWidth - seamAllowance), y: -seamAllowance },
    { x: shoulderOuter + seamAllowance, y: params.shoulder.drop - seamAllowance },
    { x: sideAtBust + seamAllowance, y: armholeY },
    { x: sideAtBust + seamAllowance, y: bustY },
    { x: sideAtHip + seamAllowance, y: hipY },
    { x: sideAtHem + seamAllowance, y: hemY + hemAllowance },
    { x: 0, y: hemY + hemAllowance },
  ];

  const edges = [
    { id: `${kind}.fold`, type: "fold", from: "center-hem", to: "center-neck" },
    { id: `${kind}.neckline`, type: "finished", from: "center-neck", to: "neck-shoulder" },
    { id: `${kind}.shoulder`, type: "seam", from: "neck-shoulder", to: "shoulder-point" },
    { id: `${kind}.armhole`, type: "finished", from: "shoulder-point", to: "armhole-bottom" },
    { id: `${kind}.side`, type: "seam", from: "armhole-bottom", to: "hem-side" },
    { id: `${kind}.hem`, type: "finished", from: "hem-side", to: "center-hem" },
  ];

  const edgePoints = {
    [`${kind}.shoulder`]: [seamLine[1], seamLine[2]],
    [`${kind}.side`]: [seamLine[3], seamLine[4], seamLine[5], seamLine[6]],
  };

  return {
    id: `${kind}-half`,
    name: `${kind === "front" ? "Front" : "Back"} half panel`,
    role: kind,
    cut: { count: 1, onFold: true },
    seamLine,
    cutLine,
    edges,
    edgeMeasurements: {
      shoulder: round(pathLength(edgePoints[`${kind}.shoulder`])),
      side: round(pathLength(edgePoints[`${kind}.side`])),
    },
    grainline: {
      id: `${kind}.grainline`,
      x: round(Math.min(90, sideAtBust * 0.35)),
      y1: 120,
      y2: hemY - 120,
      direction: "parallel-to-center-fold",
    },
    labels: [
      {
        text: `${kind === "front" ? "FRONT" : "BACK"} - CUT 1 ON FOLD`,
        x: round(Math.min(110, sideAtBust * 0.45)),
        y: round(hemY * 0.48),
      },
    ],
  };
};

const panels = [makePanel("front"), makePanel("back")];

const seamPairs = [
  {
    id: "shoulder-seams",
    edges: ["front.shoulder", "back.shoulder"],
    tolerance: params.validation.seamLengthTolerance,
  },
  {
    id: "side-seams",
    edges: ["front.side", "back.side"],
    tolerance: params.validation.seamLengthTolerance,
  },
];

const pattern = {
  schemaVersion: "0.1-dirty-spike",
  id: "a-line-dress-tunic-v0.1",
  title: "Sleeveless A-line Woven Dress/Tunic v0.1",
  status: "candidate",
  units: "mm",
  source: {
    generator: "garments/a-line-dress-tunic/src/generate.mjs",
    bodyMeasurementSet: "fixtures/measurements/v0.1-body.json",
    garmentParameters: "fixtures/parameters/v0.1-parameters.json",
  },
  bodyMeasurementSet: body,
  garmentParameters: params,
  patternMeasurements: {
    front: panels[0].edgeMeasurements,
    back: panels[1].edgeMeasurements,
    fullHemSweep: params.silhouette.hemSweep,
    finishedLength: params.length,
  },
  panels,
  seamPairs,
  construction: [
    "Cut front and back half panels on fold.",
    "Finish neckline and armholes with bias binding or facing.",
    "Join shoulder seams.",
    "Join side seams.",
    "Turn hem allowance and stitch.",
  ],
  assumptions: [
    "Dartless loose woven fit for v0.1.",
    "No closure modeled; neckline/opening must be reviewed for head entry.",
    "Front and back side seams are intentionally matched for the dirty spike.",
    "Seam allowance is simplified with rough cut-line expansion, not robust geometric offsetting.",
  ],
};

const readiness = buildReadiness(pattern);

function buildReadiness(patternDoc) {
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
      { aLength, bLength, delta: round(delta), tolerance: pair.tolerance },
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

  const hasBlocker = checks.some((check) => check.state === "blocker");
  return {
    schemaVersion: "0.1-dirty-spike",
    patternId: patternDoc.id,
    generatedAt: new Date().toISOString(),
    overallState: hasBlocker ? "not-ready" : "ready-for-human-sanity-check",
    checks,
    designerSummary: hasBlocker
      ? "This draft needs internal refinement before a human sanity check."
      : "This draft is ready for a human sanity check as a rough first package.",
  };
}

function svgPanel(panel, xOffset, title) {
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

function buildSvg(patternDoc, readinessDoc) {
  const front = patternDoc.panels[0];
  const back = patternDoc.panels[1];
  const panelGap = 130;
  const backOffset = Math.max(...front.cutLine.map((point) => point.x)) + panelGap;
  const width = backOffset + Math.max(...back.cutLine.map((point) => point.x)) + 80;
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
  ${svgPanel(front, 0, "front panel")}
  ${svgPanel(back, backOffset, "back panel")}
</svg>
`;
}

function buildCutSheet(patternDoc) {
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

## Known Limits

- Fabric layout and bolt width are not checked.
- True fit and drape are not checked.
- Head entry is not proven.
- Cut-line offsets are rough for v0.1.
`;
}

function buildAssembly(patternDoc) {
  return `# Assembly Notes

${patternDoc.construction.map((step, i) => `${i + 1}. ${step}`).join("\n")}

## Assumptions

${patternDoc.assumptions.map((assumption) => `- ${assumption}`).join("\n")}
`;
}

function buildReadinessMd(readinessDoc) {
  return `# Readiness Notes

${readinessDoc.designerSummary}

This is internal readiness instrumentation summarized for package review. It is not a designer-facing error console.

## Checks

| Check | State | Summary |
| --- | --- | --- |
${readinessDoc.checks.map((check) => `| ${check.id} | ${check.state} | ${check.summary} |`).join("\n")}
`;
}

function buildPreview(patternDoc, readinessDoc) {
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

if (!checkOnly) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(garmentRoot, "fixtures", "patterns", "v0.1-candidate.pattern.json"), `${JSON.stringify(pattern, null, 2)}\n`);
  fs.writeFileSync(path.join(garmentRoot, "fixtures", "validation", "v0.1-readiness.json"), `${JSON.stringify(readiness, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDir, "pattern.json"), `${JSON.stringify(pattern, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDir, "readiness.json"), `${JSON.stringify(readiness, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDir, "pattern.svg"), buildSvg(pattern, readiness).replace(/[ \t]+$/gm, ""));
  fs.writeFileSync(path.join(outputDir, "cut-sheet.md"), buildCutSheet(pattern));
  fs.writeFileSync(path.join(outputDir, "assembly.md"), buildAssembly(pattern));
  fs.writeFileSync(path.join(outputDir, "readiness.md"), buildReadinessMd(readiness));
  fs.writeFileSync(path.join(outputDir, "preview.html"), buildPreview(pattern, readiness));
}

if (readiness.overallState !== "ready-for-human-sanity-check") {
  console.error(readiness.designerSummary);
  process.exit(1);
}

console.log(`Generated ${pattern.title}: ${readiness.overallState}`);
