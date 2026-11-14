/**
 * MD5 (UTF-8). Veritabanındaki kelime kimlikleri md5('<ünite>:<kelime>')::uuid ile üretildi;
 * tarayıcı da aynı kimliği hesaplar.
 */
function md5Hex(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const n = (((bytes.length + 8) >>> 6) + 1) * 16;
  const w = new Array<number>(n).fill(0);
  for (let i = 0; i < bytes.length; i++) w[i >> 2] |= bytes[i] << ((i % 4) * 8);
  w[bytes.length >> 2] |= 0x80 << ((bytes.length % 4) * 8);
  w[n - 2] = bytes.length * 8;
  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0);
  let a0 = 0x67452301, b0 = 0xefcdab89 | 0, c0 = 0x98badcfe | 0, d0 = 0x10325476;
  for (let o = 0; o < n; o += 16) {
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      const s = S[(i >> 4) * 4 + (i % 4)];
      const t = (A + F + K[i] + w[o + g]) | 0;
      A = D; D = C; C = B;
      B = (B + ((t << s) | (t >>> (32 - s)))) | 0;
    }
    a0 = (a0 + A) | 0; b0 = (b0 + B) | 0; c0 = (c0 + C) | 0; d0 = (d0 + D) | 0;
  }
  return [a0, b0, c0, d0].map((x) => Array.from({ length: 4 }, (_, i) => ((x >>> (i * 8)) & 0xff).toString(16).padStart(2, "0")).join("")).join("");
}

/** Postgres'teki md5(metin)::uuid ile aynı sonuç */
export function md5Uuid(s: string): string {
  const h = md5Hex(s);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
