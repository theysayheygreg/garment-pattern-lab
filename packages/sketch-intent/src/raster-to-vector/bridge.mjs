import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { recipeForInput } from "./recipes.mjs";

const VECTOR_FORMATS = new Set(["svg", "vector-pdf", "ai"]);

export function detectFormat(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace(".", "");
  if (ext === "svg") return "svg";
  if (ext === "pdf") return "vector-pdf";
  if (ext === "ai") return "ai";
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) return ext === "jpeg" ? "jpg" : ext;
  return "unknown";
}

export function buildInputProvenance(filePath, bytes, recipe) {
  const format = detectFormat(filePath);
  return {
    sourcePath: filePath,
    format,
    recipe: recipe.id,
    originalHash: crypto.createHash("sha256").update(bytes).digest("hex"),
    importedAt: new Date().toISOString(),
  };
}

export function ingestSketch(filePath, options = {}) {
  const bytes = fs.readFileSync(filePath);
  const format = detectFormat(filePath);
  const recipe = recipeForInput({ format, requestedRecipe: options.recipe });
  const provenance = buildInputProvenance(filePath, bytes, recipe);

  if (format === "svg") {
    return vectorPassthroughSvg(bytes.toString("utf8"), provenance, recipe);
  }

  if (VECTOR_FORMATS.has(format)) {
    return {
      schemaVersion: "0.1-phase-b",
      kind: "editable-trace-layer",
      provenance,
      engine: "vector-passthrough",
      layers: { silhouette: [], interior: [], annotation: [], unclassified: [] },
      unsupported: {
        reason: `${format} passthrough is declared in the v0.1 contract but not implemented in the smoke bridge yet.`,
      },
    };
  }

  return {
    schemaVersion: "0.1-phase-b",
    kind: "editable-trace-layer",
    provenance,
    engine: recipe.preferredEngine,
    layers: { silhouette: [], interior: [], annotation: [], unclassified: [] },
    unsupported: {
      reason: "Raster tracing engines are the next Phase B step; current bridge records recipe/provenance only.",
    },
  };
}

function vectorPassthroughSvg(svg, provenance, recipe) {
  const paths = [...svg.matchAll(/<path\b([^>]*)>/gi)].map((match, index) => {
    const attrs = parseAttributes(match[1]);
    return {
      id: attrs.id ?? `path-${index + 1}`,
      d: attrs.d ?? "",
      sourceAttributes: attrs,
      bbox: roughPathBounds(attrs.d ?? ""),
      closed: /\bZ\b/i.test(attrs.d ?? ""),
    };
  });

  return {
    schemaVersion: "0.1-phase-b",
    kind: "editable-trace-layer",
    provenance,
    engine: "user-svg-passthrough",
    recipe: recipe.id,
    layers: classifyPaths(paths),
  };
}

function parseAttributes(source) {
  return Object.fromEntries(
    [...source.matchAll(/([:\w-]+)\s*=\s*"([^"]*)"/g)].map((match) => [match[1], match[2]]),
  );
}

function roughPathBounds(d) {
  const nums = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  const points = [];
  for (let i = 0; i < nums.length - 1; i += 2) {
    points.push({ x: nums[i], y: nums[i + 1] });
  }
  if (points.length === 0) return null;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return {
    minX: Math.min(...xs),
    minY: Math.min(...ys),
    maxX: Math.max(...xs),
    maxY: Math.max(...ys),
    area: (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys)),
  };
}

function classifyPaths(paths) {
  const closed = paths.filter((path) => path.closed && path.bbox);
  const silhouette = closed.sort((a, b) => b.bbox.area - a.bbox.area).slice(0, 1);
  const silhouetteIds = new Set(silhouette.map((path) => path.id));
  const silhouetteBox = silhouette[0]?.bbox;

  const layers = { silhouette, interior: [], annotation: [], unclassified: [] };
  for (const candidate of paths) {
    if (silhouetteIds.has(candidate.id)) continue;
    if (silhouetteBox && candidate.bbox && inside(candidate.bbox, silhouetteBox)) {
      layers.interior.push(candidate);
    } else if (!candidate.closed) {
      layers.annotation.push(candidate);
    } else {
      layers.unclassified.push(candidate);
    }
  }
  return layers;
}

function inside(inner, outer) {
  return inner.minX >= outer.minX && inner.maxX <= outer.maxX && inner.minY >= outer.minY && inner.maxY <= outer.maxY;
}
