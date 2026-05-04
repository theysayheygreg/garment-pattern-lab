# sketch-intent fixtures

These fixtures exercise Phase B sketch ingest without changing interpreter behavior.

- `clean-technical-flat.svg`: minimal path-only technical flat.
- `primitive-export-technical-flat.svg`: common SVG primitives exported by design tools.
- `hardware-detail-technical-flat.svg`: circles and ellipses used for garment details.
- `a-line-tunic-semantic-flat.svg`: Phase C support fixture for a sleeveless A-line tunic front. It keeps one closed body silhouette for current ingest and adds separate semantic paths/primitives for the neckline, shoulders, armholes, side seams, hem, center-front axis, facing guides, balance line, hem turnback, and pocket placement guides.
- `a-line-tunic-front-back-semantic-flat.svg`: Phase C fixture-only slice for paired front/back handling. It draws separate closed front/back panel silhouettes and stable semantic ids for each view's neckline, left/right shoulders, left/right armholes, left/right side seams, hem, and center axis.
- `a-line-tunic-single-side-semantic-flat.svg`: Phase C fixture for symmetric-garment inputs where only one side is explicitly drawn. The interpreter should mirror shoulder, armhole, and side-seam candidates across the detected center axis and mark the mirrored landmarks as assumptions.
- `a-line-tunic-scale-reference-semantic-flat.svg`: Phase D fixture with a clean front flat plus an external figure-height reference line used by the scale calibrator.
