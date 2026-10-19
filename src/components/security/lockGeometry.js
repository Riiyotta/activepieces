// Pre-tessellated 3D padlock for the /security cipher-wall (SPEC_MARKETING §4.E).
// Ported verbatim from specs/ref/js/security.G6mAqp3Z.js (module scope, lines "B = 0.72" … "function Pe").
// Minified identifiers are kept on purpose so the port can be diffed against the source.
/* eslint-disable */
const B = 0.72, V = 0.56, pe = 0.36, H = -0.54, U = 0.17, W = 0.16, G = 0.02, K = 0.44, q = 0.125, J = -0.3, Y = 0.14, X = -0.44, Z = 0.34, me = 0.055, Q = 0.1, he = 0.18, ge = 0.38, _e = 0.22, ve = 0.2575, ye = Math.hypot(B, pe), be = 0.8425;
function xe(e2, t2) {
  let n2 = e2 / B, r2 = (t2 - H) / V;
  return pe - W * (n2 * n2 + r2 * r2);
}
function Se(e2, t2) {
  let n2 = 2 * W * e2 / (B * B), r2 = 2 * W * (t2 - H) / (V * V), i2 = Math.hypot(n2, r2, 1);
  return [n2 / i2, r2 / i2, 1 / i2];
}
function Ce(e2, t2) {
  let n2 = Math.abs(e2) - 0.5499999999999999, r2 = Math.abs(t2 - H) - 0.39;
  return Math.hypot(Math.max(n2, 0), Math.max(r2, 0)) + Math.min(Math.max(n2, r2), 0) <= U;
}
function we(e2, t2) {
  if (t2 > X || t2 < -0.78) return false;
  let n2 = (X - t2) / Z;
  return Math.abs(e2) <= me + 0.045000000000000005 * n2;
}
function Te(e2, t2) {
  let n2 = t2 - X;
  return e2 * e2 + n2 * n2 <= Y * Y;
}
function Ee(e2, t2) {
  return Te(e2, t2) || we(e2, t2);
}
function $(e2, t2, n2, r2, i2, a2, o2, s2) {
  let c2 = Math.hypot(n2 - e2, r2 - t2), l2 = Math.max(1, Math.ceil(c2 / o2));
  for (let o3 = 0; o3 <= l2; o3 += 1) {
    let c3 = o3 / l2;
    s2(e2 + (n2 - e2) * c3, t2 + (r2 - t2) * c3, i2, a2);
  }
}
function De(e2, t2, n2, r2, i2, a2, o2) {
  let s2 = Math.max(2, Math.ceil(Math.abs(i2 - r2) * n2 / a2));
  for (let a3 = 0; a3 <= s2; a3 += 1) {
    let c2 = r2 + (i2 - r2) * (a3 / s2), l2 = Math.cos(c2), u2 = Math.sin(c2);
    o2(e2 + l2 * n2, t2 + u2 * n2, l2, u2);
  }
}
function Oe(e2, t2) {
  let n2 = 0.5499999999999999, r2 = 0.020000000000000018, i2 = -1.1;
  $(-0.5499999999999999, r2, n2, r2, 0, 1, e2, t2), $(n2, i2, -0.5499999999999999, i2, 0, -1, e2, t2), $(B, -0.93, B, -0.15000000000000002, 1, 0, e2, t2), $(-0.72, -0.15000000000000002, -0.72, -0.93, -1, 0, e2, t2);
  let a2 = Math.PI / 2;
  De(n2, -0.15000000000000002, U, 0, a2, e2, t2), De(-0.5499999999999999, -0.15000000000000002, U, a2, Math.PI, e2, t2), De(-0.5499999999999999, -0.93, U, Math.PI, Math.PI * 1.5, e2, t2), De(n2, -0.93, U, Math.PI * 1.5, Math.PI * 2, e2, t2);
}
function ke(e2, t2) {
  let n2 = Math.max(12, Math.ceil(Math.PI * 2 * Y / e2));
  for (let e3 = 0; e3 < n2; e3 += 1) {
    let r3 = e3 / n2 * Math.PI * 2, i3 = Math.cos(r3), a3 = Math.sin(r3), o3 = i3 * Y, s2 = X + a3 * Y;
    we(o3, s2) || t2(o3, s2, -i3, -a3);
  }
  let r2 = Math.hypot(0.045000000000000005, Z), i2 = Z / r2, a2 = -0.045000000000000005 / r2, o2 = (e3, n3, r3, i3) => {
    Te(e3, n3) || t2(e3, n3, r3, i3);
  };
  $(-0.055, X, -0.1, -0.78, i2, a2, e2, o2), $(me, X, Q, -0.78, -i2, a2, e2, o2), $(-0.1, -0.78, Q, -0.78, 0, 1, e2, o2);
}
function Ae(e2, t2) {
  Oe(e2, (n2, r2, i2, a2) => {
    let o2 = xe(n2, r2), s2 = Math.max(2, Math.ceil(o2 * 2 / e2));
    for (let e3 = 0; e3 <= s2; e3 += 1) t2(n2, r2, -o2 + o2 * 2 * (e3 / s2), i2, a2, 0, 1);
  });
}
function je(e2, t2) {
  ke(e2, (n2, r2, i2, a2) => {
    let o2 = xe(n2, r2), s2 = Math.max(2, Math.ceil(he / e2));
    for (let e3 = 0; e3 <= s2; e3 += 1) {
      let c2 = o2 - e3 / s2 * he;
      t2(n2, r2, c2, i2, a2, 0, ge), t2(n2, r2, -c2, i2, a2, 0, ge);
    }
  });
  for (let n2 = -0.78; n2 <= -0.3; n2 += e2) for (let r2 = -0.14; r2 <= Y; r2 += e2) {
    if (!Ee(r2, n2)) continue;
    let e3 = xe(r2, n2) - he;
    t2(r2, n2, e3, 0, 0, 1, _e), t2(r2, n2, -e3, 0, 0, -1, _e);
  }
}
function Me(e2, t2) {
  for (let n2 = -1.1; n2 <= 0.020000000000000018; n2 += e2) for (let r2 = -0.72; r2 <= B; r2 += e2) {
    if (!Ce(r2, n2) || Ee(r2, n2)) continue;
    let e3 = xe(r2, n2), [i2, a2, o2] = Se(r2, n2);
    t2(r2, n2, e3, i2, a2, o2, 1), t2(r2, n2, -e3, i2, a2, -o2, 1);
  }
}
function Ne(e2, t2) {
  let n2 = Math.max(8, Math.ceil(Math.PI * 2 * q / e2)), r2 = Math.max(12, Math.ceil(Math.PI * 0.565 / e2));
  for (let e3 = 0; e3 <= r2; e3 += 1) {
    let i3 = e3 / r2 * Math.PI, a3 = Math.cos(i3), o2 = Math.sin(i3);
    for (let e4 = 0; e4 < n2; e4 += 1) {
      let r3 = e4 / n2 * Math.PI * 2, i4 = Math.cos(r3), s2 = Math.sin(r3), c2 = K + q * i4;
      t2(c2 * a3, G + c2 * o2, q * s2, i4 * a3, i4 * o2, s2, 1);
    }
  }
  let i2 = 0.32, a2 = Math.max(2, Math.ceil(i2 / e2));
  for (let e3 = 0; e3 <= a2; e3 += 1) {
    let r3 = J + e3 / a2 * i2;
    for (let e4 = 0; e4 < n2; e4 += 1) {
      let i3 = e4 / n2 * Math.PI * 2, a3 = Math.cos(i3), o2 = Math.sin(i3);
      t2(K + q * a3, r3, q * o2, a3, 0, o2, 1), t2(-(K + q * a3), r3, q * o2, -a3, 0, o2, 1);
    }
  }
}
function Pe(e2) {
  let t2 = Math.max(6e-3, e2), n2 = [], r2 = [], i2 = [], a2 = (e3, t3, a3, o2, s2, c2, l2) => {
    n2.push(e3, t3 + ve, a3), r2.push(o2, s2, c2), i2.push(l2);
  };
  return Me(t2, a2), Ae(t2, a2), je(t2, a2), Ne(t2, a2), { pos: new Float32Array(n2), nrm: new Float32Array(r2), tint: new Float32Array(i2), count: n2.length / 3 };
}

// Exports used by the cipher wall: tessellation, half-extents (ye = radius in x/z, be = half height).
export { Pe as buildLock, ye, be }
