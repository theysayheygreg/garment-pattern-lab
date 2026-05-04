# sketch-intent fixtures

These fixtures exercise Phase B sketch ingest without changing interpreter behavior.

- `clean-technical-flat.svg`: minimal path-only technical flat.
- `primitive-export-technical-flat.svg`: common SVG primitives exported by design tools.
- `hardware-detail-technical-flat.svg`: circles and ellipses used for garment details.
- `a-line-tunic-semantic-flat.svg`: Phase C support fixture for a sleeveless A-line tunic front. It keeps one closed body silhouette for current ingest and adds separate semantic paths/primitives for the neckline, shoulders, armholes, side seams, hem, center-front axis, facing guides, balance line, hem turnback, and pocket placement guides.
- `a-line-tunic-front-back-semantic-flat.svg`: Phase C fixture-only slice for paired front/back handling. It draws separate closed front/back panel silhouettes and stable semantic ids for each view's neckline, left/right shoulders, left/right armholes, left/right side seams, hem, and center axis.
