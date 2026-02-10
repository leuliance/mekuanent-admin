import { g as getDefaultExportFromCjs } from "../_chunks/_libs/react.mjs";
var direction_1;
var hasRequiredDirection;
function requireDirection() {
  if (hasRequiredDirection) return direction_1;
  hasRequiredDirection = 1;
  direction_1 = direction;
  var RTL = "֑-߿יִ-﷽ﹰ-ﻼ";
  var LTR = "A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿";
  var rtl = new RegExp("^[^" + LTR + "]*[" + RTL + "]");
  var ltr = new RegExp("^[^" + RTL + "]*[" + LTR + "]");
  function direction(value) {
    value = String(value || "");
    if (rtl.test(value)) {
      return "rtl";
    }
    if (ltr.test(value)) {
      return "ltr";
    }
    return "neutral";
  }
  return direction_1;
}
var directionExports = /* @__PURE__ */ requireDirection();
const getDirection = /* @__PURE__ */ getDefaultExportFromCjs(directionExports);
export {
  getDirection as g
};
