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
  <rect x="0" y="${height - 70}" width="50.8" height="50.8" class="scale" />
  <text x="0" y="${height - 76}" class="caption">2 in scale square (50.8mm)</text>
  ${svgPanel(front, params, 0, "front panel")}
  ${svgPanel(back, params, backOffset, "back panel")}
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
- Measure the 2 in scale square on \`pattern.svg\` before cutting.
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
- Cut-line offsets are rough for v0.1.
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

- [ ] Open \`pattern.svg\` and confirm the 2 in scale square measures 2 in after printing.
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

export function buildPackageOverview(patternDoc, readinessDoc, markerPlan = patternDoc.markerPlan) {
  const sourceSketch = patternDoc.source?.sourceSketch ?? "measurement + parameter fixture";
  return `# Package Overview

Pattern: ${patternDoc.title}

Readiness: ${readinessDoc.overallState}

Source: ${sourceSketch}

This is the one-file front door for the v0.1 package. It gathers the garment shape, measurements, preview, cutting notes, and review path so the package does not feel scattered across artifacts.

## Open First

- \`preview.html\` — static 3D assembly preview, not cloth simulation.
- \`pattern.svg\` — source pattern flats with a 2 in scale square.
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
    { path: "package/pattern.svg", role: "printable-pattern-source", format: "svg" },
    { path: "package/marker.svg", role: "fabric-marker-layout", format: "svg" },
    { path: "package/cut-sheet.md", role: "human-cut-instructions", format: "markdown" },
    { path: "package/assembly.md", role: "human-sewing-instructions", format: "markdown" },
    { path: "package/human-sanity-check.md", role: "human-review-checklist", format: "markdown" },
    { path: "package/preview.html", role: "static-layout-preview", format: "html" },
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
