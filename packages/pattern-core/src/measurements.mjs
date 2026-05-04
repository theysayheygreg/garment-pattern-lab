export const round = (n) => Math.round(n * 100) / 100;

export const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

export const pathLength = (points) =>
  points.slice(1).reduce((sum, point, i) => sum + distance(points[i], point), 0);

export const measureNamedEdges = (edgePointMap) =>
  Object.fromEntries(
    Object.entries(edgePointMap).map(([edgeName, points]) => [edgeName, round(pathLength(points))]),
  );

export const panelWidth = (panel, lineName = "cutLine") =>
  Math.max(...panel[lineName].map((point) => point.x));
