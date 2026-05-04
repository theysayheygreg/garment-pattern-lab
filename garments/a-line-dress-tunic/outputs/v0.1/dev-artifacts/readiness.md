# Readiness Notes

This draft is ready for a human sanity check as a rough first package.

This is internal readiness instrumentation summarized for package review. It is not a designer-facing error console.

## Checks

| Check | State | Summary |
| --- | --- | --- |
| units.mm | ready | Pattern uses canonical millimeters. |
| front-half.closed | ready | Front half panel has closed seam and cut line point sets. |
| front-half.grainline | ready | Front half panel includes a grainline parallel to the fold. |
| front-half.label | ready | Front half panel includes cut label information. |
| back-half.closed | ready | Back half panel has closed seam and cut line point sets. |
| back-half.grainline | ready | Back half panel includes a grainline parallel to the fold. |
| back-half.label | ready | Back half panel includes cut label information. |
| shoulder-seams.length | ready | shoulder-seams match within 5mm. |
| side-seams.length | ready | side-seams match within 5mm. |
| known-limitations.fabric-layout | limitation | Fabric layout, bolt width, nap, print direction, and marker efficiency are not checked in v0.1. |
| known-limitations.fit | limitation | True fit, drape, head entry, and muslin behavior require human review. |
| known-limitations.geometry | limitation | Cut lines use rough expansion rather than a robust offset kernel. |
| marker.plan | ready | Marker layout uses 45 inch width and estimates 77.53 inches of fabric. |
