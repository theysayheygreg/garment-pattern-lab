# App

Reusable product application shell.

This folder is for the browser workbench: upload/import, natural-language intent review, sketch/trace surfaces, garment controls, pattern preview, 3D preview, validation display, and export flow.

It should not contain first-garment drafting logic directly. Garment-specific programs live under `garments/`.

Planned subfolders:

- `src/`: app UI and state orchestration.
- `public/`: static app assets.
- `tests/`: browser/app smoke tests.

Current v0.1 surface:

- `src/build-workbench.mjs` builds `dev-artifacts/dev-comparison.html`, an internal side-by-side inspection page for the base generated package and the `lengthen hem 100mm` edited package. It is a dev artifact and v0.5 seed, not the v0.1 user surface.
