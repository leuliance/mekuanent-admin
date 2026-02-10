(function(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
});
const id = (x) => x;
const Left = (value) => ({
  _tag: "Left",
  value
});
const Right = (value) => ({
  _tag: "Right",
  value
});
const either = (mapLeft, mapRight, e) => e._tag === "Left" ? mapLeft(e.value) : mapRight(e.value);
const profunctorFn = {
  dimap: (f, g, fn) => (x) => g(fn(f(x))),
  first: (f) => ([x, y]) => [f(x), y],
  right: (f) => (e) => e._tag === "Left" ? e : Right(f(e.value)),
  wander: (f) => (xs) => xs.map(f)
};
const monoidFirst = {
  empty: () => void 0,
  foldMap: (f, xs) => {
    for (let i = 0; i < xs.length; i++) {
      const x = f(xs[i]);
      if (x != void 0)
        return x;
    }
    return void 0;
  }
};
const monoidArray = {
  empty: () => [],
  foldMap: (f, xs) => {
    let acc = [];
    xs.forEach((x) => {
      acc = acc.concat(f(x));
    });
    return acc;
  }
};
const profunctorConst = (monoid) => ({
  dimap: (f, _g, toF) => (x) => toF(f(x)),
  first: (toF) => ([x, _y]) => toF(x),
  right: (toF) => (e) => e._tag === "Left" ? monoid.empty() : toF(e.value),
  wander: (toF) => (xs) => monoid.foldMap(toF, xs)
});
const compositionType = {
  Equivalence: {
    Equivalence: "Equivalence",
    Iso: "Iso",
    Lens: "Lens",
    Prism: "Prism",
    Traversal: "Traversal",
    Getter: "Getter",
    AffineFold: "AffineFold",
    Fold: "Fold",
    Setter: "Setter"
  },
  Iso: {
    Equivalence: "Iso",
    Iso: "Iso",
    Lens: "Lens",
    Prism: "Prism",
    Traversal: "Traversal",
    Getter: "Getter",
    AffineFold: "AffineFold",
    Fold: "Fold",
    Setter: "Setter"
  },
  Lens: {
    Equivalence: "Lens",
    Iso: "Lens",
    Lens: "Lens",
    Prism: "Prism",
    Traversal: "Traversal",
    Getter: "Getter",
    AffineFold: "AffineFold",
    Fold: "Fold",
    Setter: "Setter"
  },
  Prism: {
    Equivalence: "Prism",
    Iso: "Prism",
    Lens: "Prism",
    Prism: "Prism",
    Traversal: "Traversal",
    Getter: "AffineFold",
    AffineFold: "AffineFold",
    Fold: "Fold",
    Setter: "Setter"
  },
  Traversal: {
    Equivalence: "Traversal",
    Iso: "Traversal",
    Lens: "Traversal",
    Prism: "Traversal",
    Traversal: "Traversal",
    Getter: "Fold",
    AffineFold: "Fold",
    Fold: "Fold",
    Setter: "Setter"
  },
  Getter: {
    Equivalence: "Getter",
    Iso: "Getter",
    Lens: "Getter",
    Prism: "AffineFold",
    Traversal: "Fold",
    Getter: "Getter",
    AffineFold: "AffineFold",
    Fold: "Fold",
    Setter: void 0
  },
  AffineFold: {
    Equivalence: "AffineFold",
    Iso: "AffineFold",
    Lens: "AffineFold",
    Prism: "AffineFold",
    Traversal: "Fold",
    Getter: "AffineFold",
    AffineFold: "AffineFold",
    Fold: "Fold",
    Setter: void 0
  },
  Fold: {
    Equivalence: "Fold",
    Iso: "Fold",
    Lens: "Fold",
    Prism: "Fold",
    Traversal: "Fold",
    Getter: "Fold",
    AffineFold: "Fold",
    Fold: "Fold",
    Setter: void 0
  },
  Setter: {
    Equivalence: void 0,
    Iso: void 0,
    Lens: void 0,
    Prism: void 0,
    Traversal: void 0,
    Getter: void 0,
    AffineFold: void 0,
    Fold: void 0,
    Setter: void 0
  }
};
const withTag = (tag, optic2) => {
  const result = optic2;
  result._tag = tag;
  return result;
};
const removable = (optic2) => {
  optic2._removable = true;
  return optic2;
};
function compose(optic1, optic2, optic3) {
  switch (arguments.length) {
    case 2: {
      const next = (P, optic4) => optic1(P, optic2(P, optic4));
      next._tag = compositionType[optic1._tag][optic2._tag];
      next._removable = optic2._removable || false;
      return next;
    }
    default: {
      const tag1 = compositionType[optic1._tag][optic2._tag];
      const next = (P, optic4) => optic1(P, optic2(P, optic3(P, optic4)));
      next._tag = compositionType[tag1][optic3._tag];
      next._removable = optic3._removable || false;
      return next;
    }
  }
}
const eq = /* @__PURE__ */ withTag("Equivalence", (_P, optic2) => optic2);
const iso = (there, back) => withTag("Iso", (P, optic2) => P.dimap(there, back, optic2));
const lens = (view, update) => withTag("Lens", (P, optic2) => P.dimap((x) => [view(x), x], update, P.first(optic2)));
const prism = (match, build) => withTag("Prism", (P, optic2) => P.dimap(match, (x) => either(id, build, x), P.right(optic2)));
const elems = /* @__PURE__ */ withTag("Traversal", (P, optic2) => P.dimap(id, id, P.wander(optic2)));
const to = (fn) => withTag("Getter", (P, optic2) => P.dimap(fn, id, optic2));
const modify$1 = (optic2, fn, source) => optic2(profunctorFn, fn)(source);
const set$1 = (optic2, value, source) => optic2(profunctorFn, () => value)(source);
const get$1 = (optic2, source) => optic2(profunctorConst({}), id)(source);
const preview$1 = (optic2, source) => optic2(profunctorConst(monoidFirst), id)(source);
const collect$1 = (optic2, source) => optic2(profunctorConst(monoidArray), (x) => [x])(source);
const indexed = /* @__PURE__ */ iso((value) => value.map((v, k) => [k, v]), (value) => {
  const sorted = [...value].sort((a, b) => a[0] - b[0]);
  const result = [];
  for (let i = 0; i < sorted.length; ++i) {
    if (i === sorted.length - 1 || sorted[i][0] !== sorted[i + 1][0]) {
      result.push(sorted[i][1]);
    }
  }
  return result;
});
const prop = (key) => lens((source) => source[key], ([value, source]) => Object.assign(Object.assign({}, source), { [key]: value }));
const pick = (keys) => lens((source) => {
  const value = {};
  for (const key of keys) {
    value[key] = source[key];
  }
  return value;
}, ([value, source]) => {
  const result = Object.assign({}, source);
  for (const key of keys) {
    delete result[key];
  }
  return Object.assign(result, value);
});
const nth = (n) => lens((value) => value[n], ([value, source]) => {
  const result = source.slice();
  result[n] = value;
  return result;
});
const fst = /* @__PURE__ */ nth(0);
const when = (pred) => prism((x) => pred(x) ? Right(x) : Left(x), id);
const noMatch = /* @__PURE__ */ Symbol("__no_match__");
const mustMatch = /* @__PURE__ */ when((source) => source !== noMatch);
const removeMe = /* @__PURE__ */ Symbol("__remove_me__");
const at = (i) => removable(compose(lens((source) => 0 <= i && i < source.length ? source[i] : noMatch, ([value, source]) => {
  if (value === noMatch) {
    return source;
  }
  if (value === removeMe) {
    if (typeof source === "string") {
      return source.substring(0, i) + source.substring(i + 1);
    } else {
      return [...source.slice(0, i), ...source.slice(i + 1)];
    }
  }
  if (typeof source === "string") {
    if (i === 0) {
      return value + source.substring(1);
    }
    if (i === source.length) {
      return source.substring(0, i - 1) + value;
    }
    return source.substring(0, i) + value + source.substring(i + 1);
  } else {
    const result = source.slice();
    result[i] = value;
    return result;
  }
}), mustMatch));
const optional = /* @__PURE__ */ prism((source) => source === void 0 ? Left(void 0) : Right(source), id);
const guard = (fn) => prism((source) => fn(source) ? Right(source) : Left(source), id);
const find = (predicate) => removable(compose(lens((source) => {
  const index = source.findIndex(predicate);
  if (index === -1) {
    return [noMatch, -1];
  }
  return [source[index], index];
}, ([[value, index], source]) => {
  if (value === noMatch) {
    return source;
  }
  if (value === removeMe) {
    return [...source.slice(0, index), ...source.slice(index + 1)];
  }
  const result = source.slice();
  result[index] = value;
  return result;
}), fst, mustMatch));
const filter = (predicate) => compose(lens((source) => {
  const indexes = source.map((item, index) => predicate(item) ? index : null).filter((index) => index != null);
  return [indexes.map((index) => source[index]), indexes];
}, ([[values, indexes], source]) => {
  const sn = source.length, vn = values.length;
  let si = 0, ii = 0, vi = 0;
  const result = [];
  while (si < sn) {
    if (indexes[ii] === si) {
      ++ii;
      if (vi < vn) {
        result.push(values[vi]);
        ++vi;
      }
    } else {
      result.push(source[si]);
    }
    ++si;
  }
  while (vi < vn) {
    result.push(values[vi++]);
  }
  return result;
}), fst);
const valueOr = (defaultValue) => lens((source) => source === void 0 ? defaultValue : source, ([value, _source]) => value);
const partsOf = (traversal) => compose(lens((source) => {
  const value = collect$1(traversal, source);
  return [value, value.length];
}, ([[value, originalLength], source]) => {
  if (value.length !== originalLength) {
    throw new Error("cannot add/remove elements through partsOf");
  }
  let i = 0;
  return modify$1(traversal, () => value[i++], source);
}), fst);
const reread = (fn) => lens((source) => fn(source), ([value, _]) => value);
const rewrite = (fn) => lens((source) => source, ([value, _]) => fn(value));
const prependTo = /* @__PURE__ */ lens((_source) => void 0, ([value, source]) => {
  if (value === void 0)
    return source;
  return [value, ...source];
});
const appendTo = /* @__PURE__ */ lens((_source) => void 0, ([value, source]) => {
  if (value === void 0)
    return source;
  return [...source, value];
});
const chars = /* @__PURE__ */ compose(iso((s) => s.split(""), (a) => a.join("")), elems);
const words = /* @__PURE__ */ compose(iso((s) => s.split(/\b/), (a) => a.join("")), elems, when((s) => !/\s+/.test(s)));
class Optic {
  constructor(_ref) {
    this._ref = _ref;
  }
  get _tag() {
    return this._ref._tag;
  }
  get _removable() {
    return this._ref._removable;
  }
  compose(other) {
    return new Optic(compose(this._ref, other._ref));
  }
  iso(there, back) {
    return new Optic(compose(this._ref, iso(there, back)));
  }
  lens(view, set2) {
    return new Optic(compose(this._ref, lens(view, ([value, source]) => set2(source, value))));
  }
  indexed() {
    return new Optic(compose(this._ref, indexed));
  }
  prop(key) {
    return new Optic(compose(this._ref, prop(key)));
  }
  path(...keys) {
    if (keys.length === 1) {
      keys = keys[0].split(".");
    }
    return new Optic(keys.reduce((ref, key) => compose(ref, prop(key)), this._ref));
  }
  pick(keys) {
    return new Optic(compose(this._ref, pick(keys)));
  }
  nth(n) {
    return new Optic(compose(this._ref, nth(n)));
  }
  filter(predicate) {
    return new Optic(compose(this._ref, filter(predicate)));
  }
  valueOr(defaultValue) {
    return new Optic(compose(this._ref, valueOr(defaultValue)));
  }
  partsOf(traversalOrFn) {
    const traversal = typeof traversalOrFn === "function" ? traversalOrFn(optic$1) : traversalOrFn;
    return new Optic(compose(this._ref, partsOf(traversal._ref)));
  }
  reread(fn) {
    return new Optic(compose(this._ref, reread(fn)));
  }
  rewrite(fn) {
    return new Optic(compose(this._ref, rewrite(fn)));
  }
  optional() {
    return new Optic(compose(this._ref, optional));
  }
  guard_() {
    return (fn) => this.guard(fn);
  }
  guard(fn) {
    return new Optic(compose(this._ref, guard(fn)));
  }
  at(i) {
    return new Optic(compose(this._ref, at(i)));
  }
  head() {
    return new Optic(compose(this._ref, at(0)));
  }
  index(i) {
    return new Optic(compose(this._ref, at(i)));
  }
  find(predicate) {
    return new Optic(compose(this._ref, find(predicate)));
  }
  elems() {
    return new Optic(compose(this._ref, elems));
  }
  to(fn) {
    return new Optic(compose(this._ref, to(fn)));
  }
  when(predicate) {
    return new Optic(compose(this._ref, when(predicate)));
  }
  chars() {
    return new Optic(compose(this._ref, chars));
  }
  words() {
    return new Optic(compose(this._ref, words));
  }
  prependTo() {
    return new Optic(compose(this._ref, prependTo));
  }
  appendTo() {
    return new Optic(compose(this._ref, appendTo));
  }
}
const optic$1 = /* @__PURE__ */ new Optic(eq);
function optic() {
  return optic$1;
}
function get(optic2) {
  return (source) => get$1(optic2._ref, source);
}
function preview(optic2) {
  return (source) => preview$1(optic2._ref, source);
}
function collect(optic2) {
  return (source) => collect$1(optic2._ref, source);
}
function modify(optic2) {
  return (f) => (source) => modify$1(optic2._ref, f, source);
}
function set(optic2) {
  return (value) => (source) => set$1(optic2._ref, value, source);
}
export {
  collect as c,
  get as g,
  modify as m,
  optic as o,
  preview as p,
  set as s
};
