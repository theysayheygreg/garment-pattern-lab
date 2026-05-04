export function buildStaticAssemblySceneData(patternDoc) {
  const panels = patternDoc.panels.map((panel, index) => {
    const bbox = bboxForPoints(panel.seamLine);
    return {
      id: panel.id,
      role: panel.role,
      name: panel.name,
      side: panel.role === "front" ? "front" : "back",
      color: panel.role === "front" ? "#60a5fa" : "#10b981",
      position: {
        x: panel.role === "front" ? -0.18 : 0.18,
        y: 0,
        z: panel.role === "front" ? 0.16 : -0.16,
      },
      rotationY: panel.role === "front" ? 0 : Math.PI,
      seamLine: normalizePoints(panel.seamLine, bbox),
      cutLine: normalizePoints(panel.cutLine, bbox),
      edgeIds: panel.edges.map((edge) => edge.id),
      order: index,
    };
  });

  const maxHeight = Math.max(...patternDoc.panels.map((panel) => height(bboxForPoints(panel.seamLine))));
  const maxWidth = Math.max(...patternDoc.panels.map((panel) => width(bboxForPoints(panel.seamLine))));

  return {
    schemaVersion: "0.1-static-assembly-scene",
    units: patternDoc.units,
    patternId: patternDoc.id,
    panels,
    seamPairs: patternDoc.seamPairs.map((pair) => ({
      id: pair.id,
      edges: pair.edges,
      tolerance: pair.tolerance,
    })),
    bodyProxy: {
      height: round(maxHeight / 1000),
      shoulderWidth: round(maxWidth / 1000),
      depth: 0.28,
      label: "muted body proxy; not a fit simulation",
    },
  };
}

function normalizePoints(points, bbox) {
  const scale = 1 / 1000;
  const centerX = (bbox.minX + bbox.maxX) / 2;
  const centerY = (bbox.minY + bbox.maxY) / 2;
  return points.map((point) => ({
    id: point.id ?? null,
    x: round((point.x - centerX) * scale),
    y: round((centerY - point.y) * scale),
  }));
}

function bboxForPoints(points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

function width(box) {
  return box.maxX - box.minX;
}

function height(box) {
  return box.maxY - box.minY;
}

function round(value) {
  return Math.round(value * 1000000) / 1000000;
}
