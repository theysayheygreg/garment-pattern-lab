import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const distDir = path.join(repoRoot, "app", "dev-artifacts");
const packagesToShow = [
  { id: "v0.1", label: "Base v0.1", path: "garments/a-line-dress-tunic/outputs/v0.1" },
  {
    id: "v0.1-length-plus-100",
    label: "Hem +100mm",
    path: "garments/a-line-dress-tunic/outputs/v0.1-length-plus-100",
  },
];

const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), "utf8"));
const readMaybe = (relativePath) => {
  const fullPath = path.join(repoRoot, relativePath);
  return fs.existsSync(fullPath) ? fs.readFileSync(fullPath, "utf8") : null;
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const packageModels = packagesToShow.map((item) => {
  const pattern = readJson(path.join(item.path, "dev-artifacts", "pattern-graph.json"));
  const readiness = readJson(path.join(item.path, "dev-artifacts", "readiness.json"));
  const edit = readMaybe(path.join(item.path, "dev-artifacts", "edit-intent.json"));
  return { ...item, pattern, readiness, edit: edit ? JSON.parse(edit) : null };
});

const metricRows = (model) => [
  ["Finished length", `${model.pattern.patternMeasurements.finishedLength}mm`],
  ["Hem sweep", `${model.pattern.patternMeasurements.fullHemSweep}mm`],
  ["Front side seam", `${model.pattern.patternMeasurements.front.side}mm`],
  ["Back side seam", `${model.pattern.patternMeasurements.back.side}mm`],
  ["State", model.readiness.overallState],
];

const packagePanel = (model) => {
  const svgPath = `../../${model.path}/package/pattern.svg`;
  const previewPath = `../../${model.path}/package/preview.html`;
  const editSummaryPath = `../../${model.path}/dev-artifacts/edit-summary.md`;
  return `<section class="package" data-package="${model.id}">
    <div class="package-head">
      <div>
        <h2>${escapeHtml(model.label)}</h2>
        <p>${escapeHtml(model.pattern.title)}</p>
      </div>
      <span class="state">${escapeHtml(model.readiness.overallState)}</span>
    </div>
    <div class="svg-frame">
      <object data="${svgPath}" type="image/svg+xml" aria-label="${escapeHtml(model.label)} pattern SVG"></object>
    </div>
    <dl class="metrics">
      ${metricRows(model)
        .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
        .join("")}
    </dl>
    <div class="actions">
      <a href="${svgPath}">Pattern SVG</a>
      <a href="${previewPath}">Static Preview</a>
      ${model.edit ? `<a href="${editSummaryPath}">Edit Summary</a>` : ""}
    </div>
    ${
      model.edit
        ? `<div class="edit">
            <strong>${escapeHtml(model.edit.summary)}</strong>
            <span>${escapeHtml(model.edit.operations.map((op) => `${op.path.join(".")}: ${op.before} -> ${op.after}${op.units ?? ""}`).join(", "))}</span>
          </div>`
        : `<div class="edit muted">No task-led edit applied.</div>`
    }
  </section>`;
};

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Garment Pattern Lab Dev Comparison</title>
  <style>
    :root {
      --bg: #f6f4ef;
      --ink: #171717;
      --muted: #62615d;
      --line: #d8d2c8;
      --paper: #fffdf8;
      --accent: #0f766e;
      --accent-soft: #d8eee9;
      --blue: #1d4ed8;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    header {
      padding: 28px 32px 20px;
      border-bottom: 1px solid var(--line);
      display: flex;
      justify-content: space-between;
      gap: 24px;
      align-items: end;
    }
    h1, h2, p { margin: 0; }
    h1 { font-size: 28px; line-height: 1.05; font-weight: 720; }
    header p { color: var(--muted); max-width: 760px; line-height: 1.45; margin-top: 8px; }
    .command {
      min-width: max-content;
      border: 1px solid var(--line);
      background: var(--paper);
      padding: 10px 12px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
    }
    main {
      padding: 24px 32px 32px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 24px;
    }
    .package {
      background: var(--paper);
      border: 1px solid var(--line);
      min-width: 0;
    }
    .package-head {
      padding: 18px;
      border-bottom: 1px solid var(--line);
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 16px;
    }
    h2 { font-size: 17px; line-height: 1.15; font-weight: 700; }
    .package-head p { color: var(--muted); font-size: 13px; line-height: 1.35; margin-top: 5px; }
    .state {
      color: var(--accent);
      background: var(--accent-soft);
      border: 1px solid #b8ddd5;
      padding: 6px 8px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0;
      white-space: nowrap;
    }
    .svg-frame {
      height: 460px;
      border-bottom: 1px solid var(--line);
      background:
        linear-gradient(90deg, rgba(23, 23, 23, 0.04) 1px, transparent 1px),
        linear-gradient(rgba(23, 23, 23, 0.04) 1px, transparent 1px),
        #ffffff;
      background-size: 24px 24px;
    }
    object { width: 100%; height: 100%; display: block; }
    .metrics {
      margin: 0;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      border-bottom: 1px solid var(--line);
    }
    .metrics div {
      padding: 12px 14px;
      border-right: 1px solid var(--line);
      min-width: 0;
    }
    .metrics div:last-child { border-right: 0; }
    dt { color: var(--muted); font-size: 11px; margin-bottom: 4px; }
    dd { margin: 0; font-size: 13px; font-weight: 700; overflow-wrap: anywhere; }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 14px;
      border-bottom: 1px solid var(--line);
    }
    a { color: var(--blue); text-decoration: none; font-size: 13px; font-weight: 700; }
    a:hover { text-decoration: underline; }
    .edit {
      padding: 14px;
      min-height: 70px;
      display: grid;
      gap: 6px;
      font-size: 13px;
      line-height: 1.35;
    }
    .edit span, .muted { color: var(--muted); }
    @media (max-width: 980px) {
      header { display: block; }
      .command { margin-top: 16px; display: inline-block; min-width: 0; max-width: 100%; white-space: normal; }
      main { grid-template-columns: 1fr; padding: 18px; }
      .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .metrics div { border-bottom: 1px solid var(--line); }
      .svg-frame { height: 380px; }
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Garment Pattern Lab Dev Comparison</h1>
      <p>Internal inspection surface for the v0.1 A-line dress/tunic package. It compares the base pattern against the first task-led edit so the pipeline is visible without opening each file manually.</p>
    </div>
    <div class="command">npm run dev:edit:lengthen-hem</div>
  </header>
  <main>
    ${packageModels.map(packagePanel).join("\n")}
  </main>
</body>
</html>
`;

fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, "dev-comparison.html"), html.replace(/[ \t]+$/gm, ""));
console.log("Built app/dev-artifacts/dev-comparison.html");
