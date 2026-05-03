# First Garment Spec

## Target

Sleeveless A-line dress/tunic for woven fabric.

The same pattern family can support two lengths:

- Tunic: upper/mid thigh.
- Simple dress: knee or above-knee.

Prototype 1 should start with tunic length because it reduces hem sweep and walking-stride constraints.

## Construction Assumptions

- Woven, non-stretch fabric.
- Pullover or back closure TBD.
- No sleeves.
- No collar.
- No pockets.
- No lining.
- Neckline and armholes finished with simple bias binding or facing.
- Center front can be cut on fold.
- Center back can be cut on fold only if the neckline/fit permits pullover entry; otherwise back seam with closure.

## Panels

Minimum:

- Front body panel.
- Back body panel.

Likely additions:

- Front neckline facing or bias strip.
- Back neckline facing or bias strip.
- Armhole binding strips.

Optional:

- Bust darts for woven fit.
- Back waist darts only if pursuing closer fit.

## Required Measurements

Minimum measurements:

- Height.
- Bust circumference.
- High bust circumference.
- Waist circumference.
- Hip circumference.
- Shoulder width.
- Shoulder slope or approximation.
- Back waist length.
- Front waist length.
- Bust point height.
- Bust point separation.
- Armhole depth.
- Desired garment length.

Derived or optional:

- Neck circumference.
- Across back width.
- Across chest width.
- Waist-to-hip distance.
- Ease preference.

## Sketch Landmarks

Front sketch:

- Center front.
- Shoulder endpoints.
- Neckline center/depth.
- Neckline shoulder points.
- Armhole curve.
- Bust/waist/hip line estimates.
- Side seam silhouette.
- Hem line.

Back sketch:

- Center back.
- Shoulder endpoints.
- Back neckline.
- Armhole curve.
- Side seam silhouette.
- Hem line.
- Closure indication if present.

## Pattern Parameters

- `neckline_shape`: crew, scoop, v, square, custom curve.
- `neck_depth_front`.
- `neck_depth_back`.
- `shoulder_width`.
- `armhole_depth`.
- `bust_ease`.
- `waist_ease`.
- `hip_ease`.
- `hem_sweep`.
- `length`.
- `dart_mode`: none, bust dart, waist dart, combined/simple.
- `closure_mode`: pullover, center-back seam, center-back zipper.
- `finish_mode`: bias binding, facing.
- `seam_allowance`.
- `hem_allowance`.

## Acceptance Criteria

- Front/back panels are generated as closed vector outlines.
- Seam lines and cut lines are distinguishable.
- Side seam lengths match or report the mismatch.
- Shoulder seam lengths match or report the mismatch.
- Neckline/armhole finishing pieces are present or instruction explicitly says bias binding by measured length.
- Grainline is shown.
- Cut labels are present.
- Cut counts are present.
- Notches exist at waist, hip, and key seam alignment points.
- The output includes a construction order.
- A simple 3D preview can assemble the panels around an avatar without inverted seams.

## Open Design Question

Closure mode is the first real fork.

Pullover is simpler, but requires enough neckline/armhole/opening ease to get over the body. Center-back zipper is more realistic for a fitted woven dress but adds construction complexity. Prototype 1 should begin with a loose pullover tunic, then add back seam/zipper as the first realism upgrade.

