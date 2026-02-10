const e = /* @__PURE__ */ Symbol(), t = /* @__PURE__ */ Symbol(), r = "a", n = "w";
let o = (e2, t2) => new Proxy(e2, t2);
const s = Object.getPrototypeOf, c = /* @__PURE__ */ new WeakMap(), l = (e2) => e2 && (c.has(e2) ? c.get(e2) : s(e2) === Object.prototype || s(e2) === Array.prototype), f = (e2) => "object" == typeof e2 && null !== e2, i = (e2) => {
  if (Array.isArray(e2)) return Array.from(e2);
  const t2 = Object.getOwnPropertyDescriptors(e2);
  return Object.values(t2).forEach((e3) => {
    e3.configurable = true;
  }), Object.create(s(e2), t2);
}, u = (e2) => e2[t] || e2, a = (s2, c2, f2, p2) => {
  if (!l(s2)) return s2;
  let g = p2 && p2.get(s2);
  if (!g) {
    const e2 = u(s2);
    g = ((e3) => Object.values(Object.getOwnPropertyDescriptors(e3)).some((e4) => !e4.configurable && !e4.writable))(e2) ? [e2, i(e2)] : [e2], null == p2 || p2.set(s2, g);
  }
  const [y, h] = g;
  let w = f2 && f2.get(y);
  return w && w[1].f === !!h || (w = ((o2, s3) => {
    const c3 = { f: s3 };
    let l2 = false;
    const f3 = (e2, t2) => {
      if (!l2) {
        let s4 = c3[r].get(o2);
        if (s4 || (s4 = {}, c3[r].set(o2, s4)), e2 === n) s4[n] = true;
        else {
          let r2 = s4[e2];
          r2 || (r2 = /* @__PURE__ */ new Set(), s4[e2] = r2), r2.add(t2);
        }
      }
    }, i2 = { get: (e2, n2) => n2 === t ? o2 : (f3("k", n2), a(Reflect.get(e2, n2), c3[r], c3.c, c3.t)), has: (t2, n2) => n2 === e ? (l2 = true, c3[r].delete(o2), true) : (f3("h", n2), Reflect.has(t2, n2)), getOwnPropertyDescriptor: (e2, t2) => (f3("o", t2), Reflect.getOwnPropertyDescriptor(e2, t2)), ownKeys: (e2) => (f3(n), Reflect.ownKeys(e2)) };
    return s3 && (i2.set = i2.deleteProperty = () => false), [i2, c3];
  })(y, !!h), w[1].p = o(h || y, w[0]), f2 && f2.set(y, w)), w[1][r] = c2, w[1].c = f2, w[1].t = p2, w[1].p;
}, p = (e2, t2, r2, o2, s2 = Object.is) => {
  if (s2(e2, t2)) return false;
  if (!f(e2) || !f(t2)) return true;
  const c2 = r2.get(u(e2));
  if (!c2) return true;
  if (o2) {
    const r3 = o2.get(e2);
    if (r3 && r3.n === t2) return r3.g;
    o2.set(e2, { n: t2, g: false });
  }
  let l2 = null;
  try {
    for (const r3 of c2.h || []) if (l2 = Reflect.has(e2, r3) !== Reflect.has(t2, r3), l2) return l2;
    if (true === c2[n]) {
      if (l2 = ((e3, t3) => {
        const r3 = Reflect.ownKeys(e3), n2 = Reflect.ownKeys(t3);
        return r3.length !== n2.length || r3.some((e4, t4) => e4 !== n2[t4]);
      })(e2, t2), l2) return l2;
    } else for (const r3 of c2.o || []) if (l2 = !!Reflect.getOwnPropertyDescriptor(e2, r3) != !!Reflect.getOwnPropertyDescriptor(t2, r3), l2) return l2;
    for (const n2 of c2.k || []) if (l2 = p(e2[n2], t2[n2], r2, o2, s2), l2) return l2;
    return null === l2 && (l2 = true), l2;
  } finally {
    o2 && o2.set(e2, { n: t2, g: l2 });
  }
};
export {
  a,
  p
};
