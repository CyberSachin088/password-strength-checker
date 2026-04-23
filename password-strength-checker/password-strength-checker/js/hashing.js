// ==========================================
// hashing.js — MD5, SHA-1, SHA-256
// ==========================================

/**
 * SHA-256 using the browser's built-in Web Crypto API.
 * Returns a hex string. Async.
 */
async function sha256(msg) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(msg)
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * SHA-1 — pure JavaScript implementation.
 * NOTE: SHA-1 is cryptographically broken. Shown for educational purposes only.
 */
function sha1(s) {
  function R(n, c) { return (n << c) | (n >>> (32 - c)); }

  let H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
  let msg = unescape(encodeURIComponent(s));
  let bits = msg.length * 8;
  msg += '\x80';
  while (msg.length % 64 !== 56) msg += '\x00';

  let data = [];
  for (let i = 0; i < msg.length; i++) data.push(msg.charCodeAt(i));
  for (let i = 24; i >= 0; i -= 8) data.push((bits >>> (56 - i * (8 - 0))) & 0xff);
  for (let i = 0; i < 3; i++) data.push(0);
  data.push(bits & 0xff);

  let words = [];
  for (let i = 0; i < data.length; i += 4)
    words.push((data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3]);

  for (let i = 0; i < words.length; i += 16) {
    let W = words.slice(i, i + 16);
    for (let j = 16; j < 80; j++)
      W.push(R(W[j - 3] ^ W[j - 8] ^ W[j - 14] ^ W[j - 16], 1));

    let [a, b, c, d, e] = H;

    for (let j = 0; j < 80; j++) {
      let f, k;
      if (j < 20)      { f = (b & c) | (~b & d); k = 0x5A827999; }
      else if (j < 40) { f = b ^ c ^ d;           k = 0x6ED9EBA1; }
      else if (j < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
      else             { f = b ^ c ^ d;           k = 0xCA62C1D6; }

      let t = ((R(a, 5) + f + e + k + W[j]) >>> 0);
      e = d; d = c; c = R(b, 30); b = a; a = t;
    }

    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
  }

  return H.map(v => v.toString(16).padStart(8, '0')).join('');
}

/**
 * MD5 — pure JavaScript implementation.
 * NOTE: MD5 is cryptographically broken. Shown for educational purposes only.
 */
function md5(s) {
  function safe(x, n) {
    return ((x % (n = Math.pow(2, 32))) >= Math.pow(2, 31))
      ? (x % n) - Math.pow(2, 32)
      : x % n;
  }
  function A(x, n) { return safe(x + n); }
  function R(x, n) { return x << n | x >>> (32 - n); }
  function C(q, a, b, x, s, t) { return A(R(A(A(a, q), A(x, t)), s), b); }
  function F(a, b, c, d, x, s, t) { return C(b & c | ~b & d, a, b, x, s, t); }
  function G(a, b, c, d, x, s, t) { return C(b & d | c & ~d, a, b, x, s, t); }
  function H(a, b, c, d, x, s, t) { return C(b ^ c ^ d, a, b, x, s, t); }
  function I(a, b, c, d, x, s, t) { return C(c ^ (b | ~d), a, b, x, s, t); }

  s = unescape(encodeURI(s));
  let n = s.length, st = [], i = -1;
  for (; i < n - 1;) st[i >> 2] |= (s.charCodeAt(++i)) << ((i % 4) << 3);
  st[i >> 2] |= 128 << ((i % 4) << 3);
  st[(n + 8 >> 4 << 4) >> 2] = n << 3;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878, ol;

  for (i = 0; i < st.length; i += 16) {
    ol = [a, b, c, d];
    a=F(a,b,c,d,st[i+0],7,-680876936);  d=F(d,a,b,c,st[i+1],12,-389564586);
    c=F(c,d,a,b,st[i+2],17,606105819);  b=F(b,c,d,a,st[i+3],22,-1044525330);
    a=F(a,b,c,d,st[i+4],7,-176418897);  d=F(d,a,b,c,st[i+5],12,1200080426);
    c=F(c,d,a,b,st[i+6],17,-1473231341);b=F(b,c,d,a,st[i+7],22,-45705983);
    a=F(a,b,c,d,st[i+8],7,1770035416);  d=F(d,a,b,c,st[i+9],12,-1958414417);
    c=F(c,d,a,b,st[i+10],17,-42063);    b=F(b,c,d,a,st[i+11],22,-1990404162);
    a=F(a,b,c,d,st[i+12],7,1804603682); d=F(d,a,b,c,st[i+13],12,-40341101);
    c=F(c,d,a,b,st[i+14],17,-1502002290);b=F(b,c,d,a,st[i+15],22,1236535329);
    a=G(a,b,c,d,st[i+1],5,-165796510);  d=G(d,a,b,c,st[i+6],9,-1069501632);
    c=G(c,d,a,b,st[i+11],14,643717713); b=G(b,c,d,a,st[i+0],20,-373897302);
    a=G(a,b,c,d,st[i+5],5,-701558691);  d=G(d,a,b,c,st[i+10],9,38016083);
    c=G(c,d,a,b,st[i+15],14,-660478335);b=G(b,c,d,a,st[i+4],20,-405537848);
    a=G(a,b,c,d,st[i+9],5,568446438);   d=G(d,a,b,c,st[i+14],9,-1019803690);
    c=G(c,d,a,b,st[i+3],14,-187363961); b=G(b,c,d,a,st[i+8],20,1163531501);
    a=G(a,b,c,d,st[i+13],5,-1444681467);d=G(d,a,b,c,st[i+2],9,-51403784);
    c=G(c,d,a,b,st[i+7],14,1735328473); b=G(b,c,d,a,st[i+12],20,-1926607734);
    a=H(a,b,c,d,st[i+5],4,-378558);     d=H(d,a,b,c,st[i+8],11,-2022574463);
    c=H(c,d,a,b,st[i+11],16,1839030562);b=H(b,c,d,a,st[i+14],23,-35309556);
    a=H(a,b,c,d,st[i+1],4,-1530992060); d=H(d,a,b,c,st[i+4],11,1272893353);
    c=H(c,d,a,b,st[i+7],16,-155497632); b=H(b,c,d,a,st[i+10],23,-1094730640);
    a=H(a,b,c,d,st[i+13],4,681279174);  d=H(d,a,b,c,st[i+0],11,-358537222);
    c=H(c,d,a,b,st[i+3],16,-722521979); b=H(b,c,d,a,st[i+6],23,76029189);
    a=H(a,b,c,d,st[i+9],4,-640364487);  d=H(d,a,b,c,st[i+12],11,-421815835);
    c=H(c,d,a,b,st[i+15],16,530742520); b=H(b,c,d,a,st[i+2],23,-995338651);
    a=I(a,b,c,d,st[i+0],6,-198630844);  d=I(d,a,b,c,st[i+7],10,1126891415);
    c=I(c,d,a,b,st[i+14],15,-1416354905);b=I(b,c,d,a,st[i+5],21,-57434055);
    a=I(a,b,c,d,st[i+12],6,1700485571); d=I(d,a,b,c,st[i+3],10,-1894986606);
    c=I(c,d,a,b,st[i+10],15,-1051523);  b=I(b,c,d,a,st[i+1],21,-2054922799);
    a=I(a,b,c,d,st[i+8],6,1873313359);  d=I(d,a,b,c,st[i+15],10,-30611744);
    c=I(c,d,a,b,st[i+6],15,-1560198380);b=I(b,c,d,a,st[i+13],21,1309151649);
    a=I(a,b,c,d,st[i+4],6,-145523070);  d=I(d,a,b,c,st[i+11],10,-1120210379);
    c=I(c,d,a,b,st[i+2],15,718787259);  b=I(b,c,d,a,st[i+9],21,-343485551);
    a=A(a,ol[0]); b=A(b,ol[1]); c=A(c,ol[2]); d=A(d,ol[3]);
  }

  return [a, b, c, d].map(v => {
    v = v < 0 ? v + 4294967296 : v;
    let r = '';
    for (let j = 0; j < 4; j++) r += (v >> j * 8 & 255).toString(16).padStart(2, '0');
    return r;
  }).join('');
}
