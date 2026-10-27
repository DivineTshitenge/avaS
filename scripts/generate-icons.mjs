import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

function crc32(buffer) {
  let crc = ~0;
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const name = Buffer.from(type);
  const body = Buffer.concat([name, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function rounded(nx, ny) {
  const radius = 0.22;
  const dx = Math.max(Math.abs(nx - 0.5) - (0.5 - radius), 0);
  const dy = Math.max(Math.abs(ny - 0.5) - (0.5 - radius), 0);
  return dx * dx + dy * dy <= radius * radius;
}

function png(size) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const row = y * (size * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < size; x += 1) {
      const nx = (x + 0.5) / size;
      const ny = (y + 0.5) / size;
      const cx = nx - 0.5;
      const cy = ny - 0.5;
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      if (rounded(nx, ny)) {
        r = 161;
        g = 66;
        b = 161;
        a = 255;
        if (cx * cx + cy * cy < 0.145 * 0.145) {
          r = 255;
          g = 192;
          b = 14;
        }
        const bar = Math.abs(cy - 0.02) < 0.018 && Math.abs(cx) < 0.075;
        const left = Math.abs(cx + 0.045) < 0.016 && cy > -0.02 && cy < 0.09;
        const right = Math.abs(cx - 0.045) < 0.016 && cy > -0.02 && cy < 0.09;
        const hook = Math.abs(cx) < 0.012 && cy > -0.09 && cy < -0.01;
        if (bar || left || right || hook) {
          r = 60;
          g = 16;
          b = 63;
        }
      }
      const offset = row + 1 + x * 4;
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

writeFileSync("public/icon-192.png", png(192));
writeFileSync("public/icon-512.png", png(512));
writeFileSync("src/app/icon.png", png(512));
console.log("icons written");
