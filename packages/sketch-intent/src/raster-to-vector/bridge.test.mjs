import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { ingestSketch } from "./bridge.mjs";

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

const trace = ingestSketch("packages/sketch-intent/fixtures/clean-technical-flat.svg");

assert.equal(trace.kind, "editable-trace-layer");
assert.equal(trace.engine, "user-svg-passthrough");
assert.equal(trace.provenance.format, "svg");
assert.equal(trace.provenance.recipe, "clean-technical-flat");
assert.equal(trace.layers.silhouette.length, 1);
assert.equal(trace.layers.silhouette[0].id, "outer-silhouette");
assert.equal(trace.layers.interior.length, 2);
assert.equal(trace.layers.annotation.length, 1);

const rasterFixturePath = path.join("tmp", "sketch-intent-smoke.png");
fs.mkdirSync(path.dirname(rasterFixturePath), { recursive: true });
fs.writeFileSync(rasterFixturePath, makeSyntheticDressPng());

const rasterTrace = ingestSketch(rasterFixturePath, { recipe: "pencil-sketch" });
assert.equal(rasterTrace.kind, "editable-trace-layer");
assert.equal(rasterTrace.engine, "vtracer-neplex-vectorizer");
assert.equal(rasterTrace.provenance.format, "png");
assert.equal(rasterTrace.provenance.recipe, "pencil-sketch");
assert.ok(rasterTrace.traceStats.pathCount > 0);
assert.ok(totalPathCount(rasterTrace.layers) > 0);
assert.equal(rasterTrace.unsupported, undefined);

console.log("sketch-intent raster-to-vector bridge smoke tests passed");

function totalPathCount(layers) {
  return Object.values(layers).reduce((sum, paths) => sum + paths.length, 0);
}

function makeSyntheticDressPng() {
  const width = 64;
  const height = 64;
  const pixels = Buffer.alloc(width * height * 4, 255);

  for (let y = 8; y < 58; y += 1) {
    const progress = (y - 8) / 50;
    const halfWidth = 8 + progress * 16;
    const center = 32;
    for (let x = Math.floor(center - halfWidth); x <= Math.ceil(center + halfWidth); x += 1) {
      setPixel(pixels, width, x, y, 20, 20, 20, 255);
    }
  }

  const scanlines = [];
  for (let y = 0; y < height; y += 1) {
    scanlines.push(Buffer.from([0]));
    scanlines.push(pixels.subarray(y * width * 4, (y + 1) * width * 4));
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", Buffer.concat([u32(width), u32(height), Buffer.from([8, 6, 0, 0, 0])])),
    pngChunk("IDAT", zlib.deflateSync(Buffer.concat(scanlines))),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function setPixel(pixels, width, x, y, r, g, b, a) {
  const offset = (y * width + x) * 4;
  pixels[offset] = r;
  pixels[offset + 1] = g;
  pixels[offset + 2] = b;
  pixels[offset + 3] = a;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  return Buffer.concat([u32(data.length), typeBytes, data, u32(crc32(Buffer.concat([typeBytes, data])))]);
}

function u32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(value >>> 0);
  return buffer;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
