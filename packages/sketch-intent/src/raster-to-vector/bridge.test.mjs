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

const tmpDir = path.join("tmp", "sketch-intent");
fs.mkdirSync(tmpDir, { recursive: true });

for (const recipe of ["clean-technical-flat", "colored-illustration", "pencil-sketch", "scanned-pattern-piece"]) {
  const rasterFixturePath = path.join(tmpDir, `${recipe}.png`);
  fs.writeFileSync(rasterFixturePath, makeSyntheticDressPng({ colored: recipe === "colored-illustration" }));

  const rasterTrace = ingestSketch(rasterFixturePath, { recipe });
  assert.equal(rasterTrace.kind, "editable-trace-layer");
  assert.equal(rasterTrace.engine, "vtracer-neplex-vectorizer");
  assert.equal(rasterTrace.provenance.format, "png");
  assert.equal(rasterTrace.provenance.recipe, recipe);
  assert.ok(rasterTrace.traceStats.pathCount > 0);
  assert.ok(totalPathCount(rasterTrace.layers) > 0);
  assert.equal(rasterTrace.unsupported, undefined);
}

for (const extension of ["pdf", "ai"]) {
  const vectorFixturePath = path.join(tmpDir, `technical-flat.${extension}`);
  fs.writeFileSync(vectorFixturePath, makeSyntheticVectorPdf());

  const vectorTrace = ingestSketch(vectorFixturePath);
  assert.equal(vectorTrace.kind, "editable-trace-layer");
  assert.equal(vectorTrace.engine, "poppler-pdftocairo-svg");
  assert.equal(vectorTrace.provenance.format, extension === "pdf" ? "vector-pdf" : "ai");
  assert.equal(vectorTrace.provenance.recipe, "clean-technical-flat");
  assert.ok(vectorTrace.traceStats.pathCount > 0);
  assert.equal(vectorTrace.layers.silhouette.length, 1);
  assert.equal(vectorTrace.unsupported, undefined);
}

console.log("sketch-intent raster-to-vector bridge smoke tests passed");

function totalPathCount(layers) {
  return Object.values(layers).reduce((sum, paths) => sum + paths.length, 0);
}

function makeSyntheticDressPng({ colored = false } = {}) {
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

  if (colored) {
    for (let y = 20; y < 44; y += 1) {
      for (let x = 28; x < 36; x += 1) {
        setPixel(pixels, width, x, y, 210, 70, 130, 255);
      }
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

function makeSyntheticVectorPdf() {
  const stream = "0 0 0 RG 1 w 20 20 m 44 20 l 52 58 l 12 58 l h S\n";
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 64 64] /Contents 4 0 R >>\nendobj\n",
    `4 0 obj\n<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += object;
  }

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return pdf;
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
