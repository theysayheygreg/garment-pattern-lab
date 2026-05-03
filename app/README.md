# App

Reusable product application shell.

This folder is for the browser workbench: upload/import, natural-language intent review, sketch/trace surfaces, garment controls, pattern preview, 3D preview, validation display, and export flow.

It should not contain first-garment drafting logic directly. Garment-specific programs live under `garments/`.

Planned subfolders:

- `src/`: app UI and state orchestration.
- `public/`: static app assets.
- `tests/`: browser/app smoke tests.
