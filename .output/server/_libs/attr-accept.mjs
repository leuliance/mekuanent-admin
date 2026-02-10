import { g as getDefaultExportFromCjs } from "../_chunks/_libs/react.mjs";
var es = {};
var hasRequiredEs;
function requireEs() {
  if (hasRequiredEs) return es;
  hasRequiredEs = 1;
  es.__esModule = true;
  es.default = function(file, acceptedFiles) {
    if (file && acceptedFiles) {
      var acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(",");
      if (acceptedFilesArray.length === 0) {
        return true;
      }
      var fileName = file.name || "";
      var mimeType = (file.type || "").toLowerCase();
      var baseMimeType = mimeType.replace(/\/.*$/, "");
      return acceptedFilesArray.some(function(type) {
        var validType = type.trim().toLowerCase();
        if (validType.charAt(0) === ".") {
          return fileName.toLowerCase().endsWith(validType);
        } else if (validType.endsWith("/*")) {
          return baseMimeType === validType.replace(/\/.*$/, "");
        }
        return mimeType === validType;
      });
    }
    return true;
  };
  return es;
}
var esExports = /* @__PURE__ */ requireEs();
const _accepts = /* @__PURE__ */ getDefaultExportFromCjs(esExports);
export {
  _accepts as _
};
