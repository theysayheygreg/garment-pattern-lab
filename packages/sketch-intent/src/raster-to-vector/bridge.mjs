import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { vectorizeSync, ColorMode, Hierarchical, PathSimplifyMode } from "@neplex/vectorizer";
import { recipeForInput } from "./recipes.mjs";

const VECTOR_FORMATS = new Set(["svg", "vector-pdf", "ai"]);
const RASTER_FORMATS = new Set(["png", "jpg", "webp"]);

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
    return traceVectorDocumentToEditableLayer(filePath, provenance, recipe);
  }

  if (RASTER_FORMATS.has(format)) {
    return traceRasterToEditableLayer(bytes, provenance, recipe);
  }

  return unsupportedTraceLayer(provenance, recipe.preferredEngine, `Unsupported sketch input format: ${format}.`);
}

function vectorPassthroughSvg(svg, provenance, recipe) {
  return editableTraceLayerFromSvg(svg, provenance, recipe, "user-svg-passthrough");
}

function traceRasterToEditableLayer(bytes, provenance, recipe) {
  const svg = vectorizeSync(bytes, vectorizerConfigForRecipe(recipe));
  return editableTraceLayerFromSvg(svg, provenance, recipe, "vtracer-neplex-vectorizer");
}

function traceVectorDocumentToEditableLayer(filePath, provenance, recipe) {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "gpl-vector-doc-"));
  const outSvg = path.join(workDir, "converted.svg");
  try {
    execFileSync("pdftocairo", ["-svg", filePath, outSvg], { stdio: "pipe" });
    return editableTraceLayerFromSvg(fs.readFileSync(outSvg, "utf8"), provenance, recipe, "poppler-pdftocairo-svg");
  } catch (error) {
    return unsupportedTraceLayer(
      provenance,
      "poppler-pdftocairo-svg",
      `${provenance.format} conversion failed. Phase B supports PDF-compatible vector files when Poppler/pdftocairo can convert them to SVG. ${error.message}`,
    );
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

function editableTraceLayerFromSvg(svg, provenance, recipe, engine) {
  const paths = extractTracePaths(svg).map((tracePath, index) => {
    const attrs = tracePath.sourceAttributes;
    return {
      id: attrs.id ?? `path-${index + 1}`,
      element: tracePath.element,
      d: tracePath.d,
      sourceAttributes: attrs,
      bbox: roughPathBounds(tracePath.d),
      closed: /\bZ\b/i.test(tracePath.d),
    };
  });
  const layers = classifyPaths(paths);

  const trace = {
    schemaVersion: "0.1-phase-b",
    kind: "editable-trace-layer",
    provenance,
    engine,
    recipe: recipe.id,
    traceStats: {
      pathCount: paths.length,
      layerCounts: Object.fromEntries(Object.entries(layers).map(([layer, layerPaths]) => [layer, layerPaths.length])),
    },
    layers,
  };
  return { ...trace, readiness: assessTraceLayer(trace) };
}

function unsupportedTraceLayer(provenance, engine, reason) {
  const trace = {
    schemaVersion: "0.1-phase-b",
    kind: "editable-trace-layer",
    provenance,
    engine,
    layers: { silhouette: [], interior: [], annotation: [], unclassified: [] },
    unsupported: { reason },
  };
  return { ...trace, readiness: assessTraceLayer(trace) };
}

export function assessTraceLayer(trace) {
  const checks = [];
  if (trace.unsupported) {
    checks.push({ id: "input-supported", status: "blocked", message: trace.unsupported.reason });
  } else {
    checks.push({ id: "input-supported", status: "ready", message: "Input produced an editable trace layer." });
  }

  const pathCount = trace.traceStats?.pathCount ?? 0;
  checks.push(
    pathCount > 0
      ? { id: "paths-found", status: "ready", message: `${pathCount} trace path(s) found.` }
      : { id: "paths-found", status: "blocked", message: "No trace paths were found." },
  );

  const silhouetteCount = trace.layers?.silhouette?.length ?? 0;
  checks.push(
    silhouetteCount === 1
      ? { id: "silhouette-found", status: "ready", message: "One candidate silhouette found." }
      : {
          id: "silhouette-found",
          status: "review-needed",
          message: `${silhouetteCount} candidate silhouettes found; Phase B expects one main garment outline.`,
        },
  );

  const unclassifiedCount = trace.layers?.unclassified?.length ?? 0;
  checks.push(
    unclassifiedCount === 0
      ? { id: "unclassified-paths", status: "ready", message: "No unclassified closed paths remain." }
      : {
          id: "unclassified-paths",
          status: "review-needed",
          message: `${unclassifiedCount} closed path(s) need review before semantic interpretation.`,
        },
  );

  const status = checks.some((check) => check.status === "blocked")
    ? "blocked"
    : checks.some((check) => check.status === "review-needed")
      ? "review-needed"
      : "ready";

  return { status, checks };
}

function vectorizerConfigForRecipe(recipe) {
  const shared = {
    hierarchical: Hierarchical.Stacked,
    mode: PathSimplifyMode.Spline,
    cornerThreshold: 60,
    lengthThreshold: 4,
    maxIterations: 6,
    spliceThreshold: 45,
    pathPrecision: 2,
  };

  if (recipe.id === "colored-illustration") {
    return {
      ...shared,
      colorMode: ColorMode.Color,
      filterSpeckle: 8,
      colorPrecision: 6,
      layerDifference: 12,
    };
  }

  return {
    ...shared,
    colorMode: ColorMode.Binary,
    filterSpeckle: recipe.id === "pencil-sketch" ? 4 : 0,
    colorPrecision: 6,
    layerDifference: 5,
  };
}

function parseAttributes(source) {
  return Object.fromEntries(
    [...source.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((match) => [
      match[1],
      match[2] ?? match[3] ?? "",
    ]),
  );
}

function extractTracePaths(svg) {
  const paths = [];
  for (const match of svg.matchAll(/<(path|polygon|polyline|line|rect)\b([^>]*)>/gi)) {
    const element = match[1].toLowerCase();
    const attrs = parseAttributes(match[2]);
    const d = pathDataForElement(element, attrs);
    if (!d) continue;
    paths.push({ element, d, sourceAttributes: attrs });
  }
  return paths;
}

function pathDataForElement(element, attrs) {
  if (element === "path") return attrs.d ?? "";
  if (element === "polygon" || element === "polyline") return pointListToPath(attrs.points ?? "", element === "polygon");
  if (element === "line") return lineToPath(attrs);
  if (element === "rect") return rectToPath(attrs);
  return "";
}

function pointListToPath(pointsSource, closed) {
  const points = [...pointsSource.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => Number(match[0]));
  if (points.length < 4) return "";
  const commands = [`M ${points[0]} ${points[1]}`];
  for (let i = 2; i < points.length - 1; i += 2) {
    commands.push(`L ${points[i]} ${points[i + 1]}`);
  }
  if (closed) commands.push("Z");
  return commands.join(" ");
}

function lineToPath(attrs) {
  const x1 = numberAttr(attrs, "x1");
  const y1 = numberAttr(attrs, "y1");
  const x2 = numberAttr(attrs, "x2");
  const y2 = numberAttr(attrs, "y2");
  if ([x1, y1, x2, y2].some((value) => value === null)) return "";
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

function rectToPath(attrs) {
  const x = numberAttr(attrs, "x") ?? 0;
  const y = numberAttr(attrs, "y") ?? 0;
  const width = numberAttr(attrs, "width");
  const height = numberAttr(attrs, "height");
  if (width === null || height === null || width <= 0 || height <= 0) return "";
  return `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`;
}

function numberAttr(attrs, key) {
  if (attrs[key] === undefined) return null;
  const value = Number(attrs[key]);
  return Number.isFinite(value) ? value : null;
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
