export const INGEST_RECIPES = {
  "clean-technical-flat": {
    id: "clean-technical-flat",
    label: "Clean technical flat",
    preferredEngine: "potrace-wasm",
    inputClasses: ["svg", "vector-pdf", "png", "jpg", "webp"],
    layerStrategy: "largest-closed-path-as-silhouette",
  },
  "colored-illustration": {
    id: "colored-illustration",
    label: "Colored fashion illustration",
    preferredEngine: "vtracer-wasm",
    inputClasses: ["png", "jpg", "webp"],
    layerStrategy: "stacked-color-regions",
  },
  "pencil-sketch": {
    id: "pencil-sketch",
    label: "Pencil sketch on paper",
    preferredEngine: "potrace-wasm",
    inputClasses: ["png", "jpg", "webp"],
    layerStrategy: "thresholded-line-art",
  },
  "scanned-pattern-piece": {
    id: "scanned-pattern-piece",
    label: "Scanned pattern piece",
    preferredEngine: "potrace-wasm",
    inputClasses: ["png", "jpg", "webp", "pdf"],
    layerStrategy: "panel-boundary-first",
  },
};

export function recipeForInput({ format, requestedRecipe }) {
  if (requestedRecipe) {
    const recipe = INGEST_RECIPES[requestedRecipe];
    if (!recipe) throw new Error(`Unknown ingest recipe: ${requestedRecipe}`);
    return recipe;
  }

  if (format === "svg" || format === "vector-pdf" || format === "ai") {
    return INGEST_RECIPES["clean-technical-flat"];
  }

  return INGEST_RECIPES["pencil-sketch"];
}
