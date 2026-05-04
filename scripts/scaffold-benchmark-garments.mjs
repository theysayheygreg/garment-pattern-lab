#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");

const garments = [
  {
    slug: "classic-woven-shirt",
    name: "Classic Woven Shirt",
    pieces: ["front left/right", "back", "sleeve", "collar", "collar stand", "cuff", "pocket", "front placket"],
    stressors: ["sleeve cap", "collar + stand", "placket", "pocket placement", "many labels and notches"],
    svg: shirtSvg("Classic Woven Shirt", true),
  },
  {
    slug: "camp-shirt",
    name: "Camp Shirt",
    pieces: ["front left/right", "back", "short sleeve", "camp collar", "facing", "pocket"],
    stressors: ["open collar", "front facing", "short sleeve cap", "button front", "hem shape"],
    svg: shirtSvg("Camp Shirt", false),
  },
  {
    slug: "tank-with-facing",
    name: "Tank With Facing",
    pieces: ["front", "back", "front facing", "back facing"],
    stressors: ["armhole curve", "neckline curve", "separate facing pieces", "clean finish instructions"],
    svg: tankSvg("Tank With Facing", false),
  },
  {
    slug: "shift-dress-with-darts",
    name: "Shift Dress With Darts",
    pieces: ["front", "back", "front facing", "back facing"],
    stressors: ["bust darts", "waist shaping", "dress length", "neckline/armhole curves", "dart transfer validation"],
    svg: shiftDressSvg(),
  },
  {
    slug: "sleeveless-top-with-facing",
    name: "Sleeveless Top With Facing",
    pieces: ["front", "back", "front facing", "back facing"],
    stressors: ["shorter hem", "facing geometry", "neck/armhole relationship", "side seam shaping"],
    svg: tankSvg("Sleeveless Top With Facing", true),
  },
];

for (const garment of garments) {
  const garmentRoot = path.join(repoRoot, "garments", garment.slug);
  const humanRoot = path.join(repoRoot, "human-output", "v0.1-benchmarks", garment.slug);
  for (const dir of ["docs", "fixtures/sketches", "outputs", "references"]) {
    fs.mkdirSync(path.join(garmentRoot, dir), { recursive: true });
  }
  fs.mkdirSync(humanRoot, { recursive: true });

  const sketchPath = path.join(garmentRoot, "fixtures", "sketches", "source-sketch.svg");
  fs.writeFileSync(sketchPath, garment.svg);
  fs.writeFileSync(path.join(humanRoot, "source-sketch.svg"), garment.svg);
  fs.writeFileSync(path.join(garmentRoot, "README.md"), garmentReadme(garment));
  fs.writeFileSync(path.join(garmentRoot, "docs", "benchmark-plan.md"), benchmarkPlan(garment));
  fs.writeFileSync(path.join(humanRoot, "guide.md"), humanBenchmarkGuide(garment));
  fs.writeFileSync(
    path.join(humanRoot, "manifest.json"),
    `${JSON.stringify({
      schemaVersion: "0.1-benchmark-scaffold",
      garment: garment.slug,
      name: garment.name,
      files: ["guide.md", "source-sketch.svg"],
      status: "benchmark-input-scaffold",
    }, null, 2)}\n`,
  );
}

function garmentReadme(garment) {
  return `# ${garment.name}

Benchmark garment scaffold for Pattern Lab.

This folder is not a finished drafting engine yet. It exists so v0.1.x/v0.2 work can move beyond the two-panel A-line and test richer apparel structure.

## Why It Exists

Stressors:

${garment.stressors.map((item) => `- ${item}`).join("\n")}

Expected pieces:

${garment.pieces.map((item) => `- ${item}`).join("\n")}

## Current Contents

- \`fixtures/sketches/source-sketch.svg\` — simple technical-flat input target.
- \`docs/benchmark-plan.md\` — what the pipeline must eventually prove.
- \`outputs/\` — reserved for generated packages once this garment has a drafting path.
`;
}

function benchmarkPlan(garment) {
  return `# ${garment.name} Benchmark Plan

This benchmark should test whether Pattern Lab can interpret a garment that has more structure than the A-line smoke-test garment.

## Input

\`fixtures/sketches/source-sketch.svg\`

## Expected Pattern Complexity

${garment.pieces.map((item) => `- ${item}`).join("\n")}

## Pipeline Questions

${garment.stressors.map((item) => `- Can the pipeline identify and preserve ${item}?`).join("\n")}

## Acceptance

- Source sketch is visible beside outputs in \`human-output/v0.1-benchmarks/${garment.slug}/\`.
- One human guide describes what the benchmark is meant to test.
- Future generated package includes only one human-facing Markdown guide plus visual artifacts.
`;
}

function humanBenchmarkGuide(garment) {
  return `# ${garment.name} Benchmark

Status: input scaffold, not generated pattern.

Open \`source-sketch.svg\` first. This benchmark exists so Pattern Lab can stop overfitting the two-panel A-line smoke test.

## What This Garment Should Teach

${garment.stressors.map((item) => `- ${item}`).join("\n")}

## Expected Cut Components

${garment.pieces.map((item) => `- ${item}`).join("\n")}

## Review Notes

- This is an input/output scaffold only.
- No marker is included yet; marker review becomes useful once generated packages have many cut components.
- Future output should use one \`guide.md\` file plus visual artifacts, not multiple scattered Markdown documents.
`;
}

function shirtSvg(title, longSleeve) {
  const sleeveLabel = longSleeve ? "LONG SLEEVE" : "SHORT SLEEVE";
  return svgShell(title, `
    <path id="front-left" data-gpl-role="panel" d="M 170 160 L 265 145 L 320 220 L 315 520 L 155 520 L 145 220 Z" />
    <path id="front-right" data-gpl-role="panel" d="M 335 145 L 430 160 L 455 220 L 445 520 L 285 520 L 280 220 Z" />
    <path id="back" data-gpl-role="panel" d="M 555 145 L 735 145 L 780 230 L 760 520 L 530 520 L 510 230 Z" />
    <path id="sleeve" data-gpl-role="panel" d="${longSleeve ? "M 165 600 C 235 565 345 565 410 600 L 380 910 L 195 910 Z" : "M 170 610 C 235 575 330 575 395 610 L 365 760 L 205 760 Z"}" />
    <path id="collar" data-gpl-role="detail" d="M 300 90 C 345 65 410 65 455 90 L 430 130 C 390 112 365 112 325 130 Z" />
    <rect id="placket" data-gpl-role="detail" x="307" y="190" width="20" height="330" />
    <rect id="pocket" data-gpl-role="detail" x="365" y="285" width="58" height="66" />
    <text x="178" y="548">FRONT LEFT</text>
    <text x="326" y="548">FRONT RIGHT</text>
    <text x="595" y="548">BACK</text>
    <text x="240" y="${longSleeve ? 940 : 790}">${sleeveLabel}</text>
  `);
}

function tankSvg(title, cropped) {
  const hem = cropped ? 470 : 575;
  return svgShell(title, `
    <path id="front" data-gpl-role="panel" d="M 260 120 C 310 155 390 155 440 120 L 505 210 C 455 270 455 365 480 ${hem} L 220 ${hem} C 245 365 245 270 195 210 Z" />
    <path id="back" data-gpl-role="panel" d="M 610 125 C 670 168 740 168 800 125 L 855 215 C 815 285 820 380 845 ${hem} L 565 ${hem} C 590 380 595 285 555 215 Z" />
    <path id="front-facing" data-gpl-role="facing" d="M 270 135 C 318 175 382 175 430 135 L 462 190 C 410 225 290 225 238 190 Z" />
    <path id="back-facing" data-gpl-role="facing" d="M 622 140 C 678 182 732 182 788 140 L 820 195 C 765 230 645 230 590 195 Z" />
    <text x="305" y="${hem + 30}">FRONT</text>
    <text x="660" y="${hem + 30}">BACK</text>
    <text x="275" y="252">FRONT FACING</text>
    <text x="620" y="252">BACK FACING</text>
  `);
}

function shiftDressSvg() {
  return svgShell("Shift Dress With Darts", `
    <path id="front" data-gpl-role="panel" d="M 245 115 C 300 150 380 150 435 115 L 490 205 C 445 300 458 550 470 770 L 215 770 C 227 550 240 300 195 205 Z" />
    <path id="back" data-gpl-role="panel" d="M 610 120 C 665 150 740 150 795 120 L 845 210 C 812 330 825 565 835 770 L 570 770 C 580 565 592 330 560 210 Z" />
    <path id="front-dart-left" data-gpl-role="dart" d="M 285 360 L 320 250 L 350 360" />
    <path id="front-dart-right" data-gpl-role="dart" d="M 355 360 L 385 250 L 420 360" />
    <path id="front-facing" data-gpl-role="facing" d="M 260 130 C 310 168 370 168 420 130 L 452 190 C 395 225 285 225 228 190 Z" />
    <path id="back-facing" data-gpl-role="facing" d="M 625 135 C 675 168 730 168 780 135 L 810 192 C 755 225 650 225 595 192 Z" />
    <text x="305" y="805">FRONT WITH DARTS</text>
    <text x="660" y="805">BACK</text>
  `);
}

function svgShell(title, body) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="11in" height="8.5in" viewBox="0 0 1000 850">
  <title>${title}</title>
  <style>
    path, rect { fill: #fffdf7; stroke: #111827; stroke-width: 4; }
    [data-gpl-role="detail"], [data-gpl-role="facing"], [data-gpl-role="dart"] { fill: none; stroke: #2563eb; stroke-dasharray: 10 8; }
    text { font-family: Helvetica, Arial, sans-serif; font-size: 24px; letter-spacing: 0; fill: #111827; }
  </style>
  <text x="45" y="55">${title}</text>
${body}
</svg>
`;
}
