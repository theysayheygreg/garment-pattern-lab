# Patternmaking Fundamentals

Initial notes. This needs a deeper ingestion pass from a lawful/public source before implementation.

## Three Patternmaking Modes

### Drafting

Creating pattern pieces from body measurements, formulas, and construction rules.

### Draping

Pinning fabric on a form/body, marking shape and fit, then transferring to pattern.

### Flat Pattern Manipulation

Starting from a fitted block/sloper and transforming it into a design through darts, slash/spread, style lines, fullness, yokes, collars, sleeves, and other changes.

## Core Concepts

### Block / Sloper

A foundational fitted pattern for a body. Often used as the starting point for designs.

### Ease

Extra room beyond body measurement. Includes wearing ease and design ease.

Prototype implication:

- The system must represent ease explicitly, not just scale a silhouette.

### Dart

A wedge that removes fabric to shape flat cloth around a curved body.

Prototype implication:

- Dartless loose garments are simpler, but fitted woven garments need darts or other shaping.

### Grainline

Direction of fabric relative to the pattern piece. Critical for drape and stability.

Prototype implication:

- Every panel needs a grainline.

### Seam Allowance

Extra material outside seam line for sewing.

Prototype implication:

- Store seam line and cut line separately.

### Notches / Balance Marks

Marks that align pieces during sewing.

Prototype implication:

- Add notches at waist, hip, shoulder/armhole, and seam relationships.

### Grading

Changing pattern size across a size range.

Prototype implication:

- Defer full grading. Regenerate made-to-measure first.

### Seam Walking / Trueing

Checking related seam lengths and smoothing intersections.

Prototype implication:

- Validation must compare paired seams and flag mismatches.

## First Garment Needs

The sleeveless A-line tunic needs:

- Front and back body blocks or simplified dress block.
- Neckline shaping.
- Armhole shaping.
- Side seam shaping from bust through hip to hem.
- Shoulder seam.
- Ease at bust/waist/hip.
- Hem allowance.
- Neck/armhole finishing.
- Grainline and fold/cut labels.

## Implementation Rule

Do not hide patternmaking in a black box. The generated pattern should expose measurements, ease, and design parameters so a human can diagnose the result.

