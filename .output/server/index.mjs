globalThis.__nitro_main__ = import.meta.url;
import { N as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { d as defineHandler, H as HTTPError, t as toEventHandler, a as defineLazyEventHandler, b as H3Core, c as toRequest } from "./_libs/h3.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled;
  const status = error.status || 500;
  const url = event.url || new URL(event.req.url);
  if (status === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.req.method}] ${url}
`, error);
  }
  const headers2 = {
    "content-type": "application/json",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "no-referrer",
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  if (status === 404 || !event.res.headers.has("cache-control")) {
    headers2["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    status,
    statusText: error.statusText,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status,
    statusText: error.statusText,
    headers: headers2,
    body
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
const headers = ((m) => function headersRouteRule(event) {
  for (const [key2, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key2, value);
  }
});
const assets = {
  "/example-guitar-flowers.jpg": {
    "type": "image/jpeg",
    "etag": '"2da70-wpcqcBlVm7oI5Bql6TZxNLL+Vtw"',
    "mtime": "2026-02-10T10:57:34.032Z",
    "size": 186992,
    "path": "../public/example-guitar-flowers.jpg"
  },
  "/example-guitar-steamer-trunk.jpg": {
    "type": "image/jpeg",
    "etag": '"2109e-bexG0vrNhGKp4IiGGgeFX/GYNRQ"',
    "mtime": "2026-02-10T10:57:34.034Z",
    "size": 135326,
    "path": "../public/example-guitar-steamer-trunk.jpg"
  },
  "/example-guitar-motherboard.jpg": {
    "type": "image/jpeg",
    "etag": '"4498d-0K1H27dvCg1VAGvT7uWRS4GLN54"',
    "mtime": "2026-02-10T10:57:34.033Z",
    "size": 280973,
    "path": "../public/example-guitar-motherboard.jpg"
  },
  "/example-guitar-video-games.jpg": {
    "type": "image/jpeg",
    "etag": '"178ed-QRo0MkJcTUj+kVNH3RBF0TVVGdg"',
    "mtime": "2026-02-10T10:57:34.040Z",
    "size": 96493,
    "path": "../public/example-guitar-video-games.jpg"
  },
  "/example-guitar-traveling.jpg": {
    "type": "image/jpeg",
    "etag": '"29008-6yPndSxwXMCmtcmjDg4eGqM4/Gs"',
    "mtime": "2026-02-10T10:57:34.038Z",
    "size": 167944,
    "path": "../public/example-guitar-traveling.jpg"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": '"f1e-ESBTjHetHyiokkO0tT/irBbMO8Y"',
    "mtime": "2026-02-10T10:57:34.042Z",
    "size": 3870,
    "path": "../public/favicon.ico"
  },
  "/logo512.png": {
    "type": "image/png",
    "etag": '"25c0-RpFfnQJpTtSb/HqVNJR2hBA9w/4"',
    "mtime": "2026-02-10T10:57:34.043Z",
    "size": 9664,
    "path": "../public/logo512.png"
  },
  "/logo192.png": {
    "type": "image/png",
    "etag": '"14e3-f08taHgqf6/O2oRVTsq5tImHdQA"',
    "mtime": "2026-02-10T10:57:34.042Z",
    "size": 5347,
    "path": "../public/logo192.png"
  },
  "/manifest.json": {
    "type": "application/json",
    "etag": '"1f2-Oqn/x1R1hBTtEjA8nFhpBeFJJNg"',
    "mtime": "2026-02-10T10:57:34.043Z",
    "size": 498,
    "path": "../public/manifest.json"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": '"43-BEzmj4PuhUNHX+oW9uOnPSihxtU"',
    "mtime": "2026-02-10T10:57:34.043Z",
    "size": 67,
    "path": "../public/robots.txt"
  },
  "/example-guitar-racing.jpg": {
    "type": "image/jpeg",
    "etag": '"1d307-VU8fTlrbBDTfXTJMji6gzIBhmWw"',
    "mtime": "2026-02-10T10:57:34.034Z",
    "size": 119559,
    "path": "../public/example-guitar-racing.jpg"
  },
  "/assets/CompositeItem-yDgGKS7w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3033-8xcJK+VeYlC63IlG6wGkfsCgfe4"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 12339,
    "path": "../public/assets/CompositeItem-yDgGKS7w.js"
  },
  "/assets/CompositeList-BX-CoGc7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1da5-FP0UOq3Jn0Rw7moXNsaqTdry0y8"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 7589,
    "path": "../public/assets/CompositeList-BX-CoGc7.js"
  },
  "/assets/DialogTitle-DQILMd8w.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1e9e-M5XXMX0Wl1AmwPvV7CdaZdW7/WQ"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 7838,
    "path": "../public/assets/DialogTitle-DQILMd8w.js"
  },
  "/example-guitar-superhero.jpg": {
    "type": "image/jpeg",
    "etag": '"2122a-Sxhh7srVq/VSjpF1//x2egJ+JIE"',
    "mtime": "2026-02-10T10:57:34.036Z",
    "size": 135722,
    "path": "../public/example-guitar-superhero.jpg"
  },
  "/assets/arrow-left-CGHMbIKH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a0-L1xPoggLbZUMx8eBRWyKhBqu984"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 160,
    "path": "../public/assets/arrow-left-CGHMbIKH.js"
  },
  "/assets/avatar-DiS-ijcY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ba5-ZalVYnbOgKzlNIPShVwmcllcYR0"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 2981,
    "path": "../public/assets/avatar-DiS-ijcY.js"
  },
  "/assets/_authenticated-Cd4eWfTD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"afea-uhbCJzSEe3fsYkmvKzMcselaur8"',
    "mtime": "2026-02-10T10:57:34.945Z",
    "size": 45034,
    "path": "../public/assets/_authenticated-Cd4eWfTD.js"
  },
  "/assets/book-open-DBZ59QVI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"117-PQWeS468t+58s6aSN6i8Ud+U4CI"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 279,
    "path": "../public/assets/book-open-DBZ59QVI.js"
  },
  "/assets/button-BHG2OhSC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"307b-XK6l+d8Ti0EzTh+fKqVrO5Xly4w"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 12411,
    "path": "../public/assets/button-BHG2OhSC.js"
  },
  "/assets/building-BiOiAHg5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"233-rkOeYla/ehBaghSNGvUn1IGB/6w"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 563,
    "path": "../public/assets/building-BiOiAHg5.js"
  },
  "/assets/bell-C41JURX1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"11d-x5LT0VH0KQ7M/jGCheTji1IcWWg"',
    "mtime": "2026-02-10T10:57:34.946Z",
    "size": 285,
    "path": "../public/assets/bell-C41JURX1.js"
  },
  "/tanstack-word-logo-white.svg": {
    "type": "image/svg+xml",
    "etag": '"3a9a-9TQFm/pN8AZe1ZK0G1KyCEojnYg"',
    "mtime": "2026-02-10T10:57:34.045Z",
    "size": 15002,
    "path": "../public/tanstack-word-logo-white.svg"
  },
  "/tanstack-circle-logo.png": {
    "type": "image/png",
    "etag": '"40cab-HZ1KcYPs7tRjLe4Sd4g6CwKW+W8"',
    "mtime": "2026-02-10T10:57:34.044Z",
    "size": 265387,
    "path": "../public/tanstack-circle-logo.png"
  },
  "/example-ukelele-tanstack.jpg": {
    "type": "image/jpeg",
    "etag": '"3b270-fZPwoZlMB682Kfg5jeU2CPWd44I"',
    "mtime": "2026-02-10T10:57:34.042Z",
    "size": 242288,
    "path": "../public/example-ukelele-tanstack.jpg"
  },
  "/assets/calendar-D6czeycA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fc-4+MSjLnMEeZJdCTSn63sw/Byeoc"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 252,
    "path": "../public/assets/calendar-D6czeycA.js"
  },
  "/assets/chevron-left-BTB1G1E0.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7d-GlipZiQjao49zb3Adcq+f16d5RA"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 125,
    "path": "../public/assets/chevron-left-BTB1G1E0.js"
  },
  "/assets/chevron-right-7E97xD8r.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"82-SCp8MG7Jp/yBTymEq0/GPQxXJDU"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 130,
    "path": "../public/assets/chevron-right-7E97xD8r.js"
  },
  "/assets/chevrons-up-down-B5t4FiU_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ae-hC6WiuGlb7KFdVC2iFbSYsi5F84"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 174,
    "path": "../public/assets/chevrons-up-down-B5t4FiU_.js"
  },
  "/assets/church-81id59Vj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1b6-Cxy0gP1Akii1ljRrO7QMuFpNWUQ"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 438,
    "path": "../public/assets/church-81id59Vj.js"
  },
  "/assets/church-status-badge-CL6rjjUy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3b3-jKAXqT8vUWzahrR9nPNCRvKkUYs"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 947,
    "path": "../public/assets/church-status-badge-CL6rjjUy.js"
  },
  "/assets/circle-check-big-x_UPIDXf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c2-muQwP/RDXI0xCNz12Z87++zKV/w"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 194,
    "path": "../public/assets/circle-check-big-x_UPIDXf.js"
  },
  "/assets/circle-x-CetzA6LN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"cf-bwvWEwLi9ZGwffrlZwM897sx8FE"',
    "mtime": "2026-02-10T10:57:34.948Z",
    "size": 207,
    "path": "../public/assets/circle-x-CetzA6LN.js"
  },
  "/assets/clock-H9smdNoi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a9-Rcx7k1GswbTDQO/8OCD6rqaPcfM"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 169,
    "path": "../public/assets/clock-H9smdNoi.js"
  },
  "/assets/circle-alert-BtTJcqbp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f5-Mit+AR05KRi1MRJR0pajxTbWF10"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 245,
    "path": "../public/assets/circle-alert-BtTJcqbp.js"
  },
  "/assets/content-type-badge-Cpei_anj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"912-enPxq+bajXoUPT2vsbzUw2JpXsQ"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 2322,
    "path": "../public/assets/content-type-badge-Cpei_anj.js"
  },
  "/assets/createBaseUIEventDetails-DZkIUnSu.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"47a-VVaZtf/2GAkcI37st0BiA39Mz5s"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 1146,
    "path": "../public/assets/createBaseUIEventDetails-DZkIUnSu.js"
  },
  "/assets/credit-card-ByYOalMw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ca-HcZInqy+I89bUs+cc1T08T6svik"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 202,
    "path": "../public/assets/credit-card-ByYOalMw.js"
  },
  "/assets/dollar-sign-B5sTajGp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d6-bGc61ky2HGmfYGWboZN3t9mwJVU"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 214,
    "path": "../public/assets/dollar-sign-B5sTajGp.js"
  },
  "/assets/dialog-DVXoQ1Y_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e75-xcF1yTjZJMA0870FaBYuVk3OzU0"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 3701,
    "path": "../public/assets/dialog-DVXoQ1Y_.js"
  },
  "/assets/dropdown-menu-BKg05o6Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6c2c-5CiN2juMQ+7xOu+8gfO9dsCTxeo"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 27692,
    "path": "../public/assets/dropdown-menu-BKg05o6Q.js"
  },
  "/assets/event-status-badge-Rxrf0hGt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"482-hYNT0gYX+6bBO/Jp8jsRoqVK75M"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 1154,
    "path": "../public/assets/event-status-badge-Rxrf0hGt.js"
  },
  "/assets/eye-uABj9HoH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"100-sgEdv1twYxURUvgiYQB0gC35yzk"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 256,
    "path": "../public/assets/eye-uABj9HoH.js"
  },
  "/assets/file-text-DoWJZnk-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"17c-JR7qoTcdhq3NArc7EOCEKnfzhc8"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 380,
    "path": "../public/assets/file-text-DoWJZnk-.js"
  },
  "/assets/funnel-CoYB6fOy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"fb-9nJiKG+cJAcJRlizWpHvktKqsXk"',
    "mtime": "2026-02-10T10:57:34.948Z",
    "size": 251,
    "path": "../public/assets/funnel-CoYB6fOy.js"
  },
  "/assets/globe-BxAY8qBo.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ed-z7B7ciJTCTEUEguiEeikDE2bjNg"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 237,
    "path": "../public/assets/globe-BxAY8qBo.js"
  },
  "/assets/getPseudoElementBounds-Dt3bew_I.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"90ab-YmyCLgUNRM8GAfOc19eiWlTO0gg"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 37035,
    "path": "../public/assets/getPseudoElementBounds-Dt3bew_I.js"
  },
  "/assets/heart-DGJe3sAB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"102-HkFVKhKs2PKc/pFaDRcJIVCt4L8"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 258,
    "path": "../public/assets/heart-DGJe3sAB.js"
  },
  "/assets/index-07Phnt9J.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"49d-gaNj5L2Pw/V4bc5HbDO4j83PNKE"',
    "mtime": "2026-02-10T10:57:34.948Z",
    "size": 1181,
    "path": "../public/assets/index-07Phnt9J.js"
  },
  "/assets/index-7MtOzSlD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"442-PNm8XJWuwr/dJddcvn6tU4uqR9k"',
    "mtime": "2026-02-10T10:57:34.946Z",
    "size": 1090,
    "path": "../public/assets/index-7MtOzSlD.js"
  },
  "/assets/index-AFrYd2FL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"41f-wWYSeMoSc4z9Yj1yLHlrxwdgtDU"',
    "mtime": "2026-02-10T10:57:34.948Z",
    "size": 1055,
    "path": "../public/assets/index-AFrYd2FL.js"
  },
  "/assets/index-8VdfLx24.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6592-f5+aximrPY5W+D5/g1Jj6bNPqqY"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 26002,
    "path": "../public/assets/index-8VdfLx24.js"
  },
  "/assets/index-B-32ZD26.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"42e-CVrCCNCqcASLOPakWM57oaUdnRA"',
    "mtime": "2026-02-10T10:57:34.947Z",
    "size": 1070,
    "path": "../public/assets/index-B-32ZD26.js"
  },
  "/assets/index-BW6NTiZK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"445-EEa+sJB9p0XGu+CZtMbGZZtjGzw"',
    "mtime": "2026-02-10T10:57:34.947Z",
    "size": 1093,
    "path": "../public/assets/index-BW6NTiZK.js"
  },
  "/assets/index-BddJ0shi.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5b1-t/b6+3oWlzrfTMAayHAgQSI8jrM"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 1457,
    "path": "../public/assets/index-BddJ0shi.js"
  },
  "/assets/index-BZrcK1BK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"32fa-qoo1S+NM4WbROBMxPTcR5WT4rmc"',
    "mtime": "2026-02-10T10:57:34.947Z",
    "size": 13050,
    "path": "../public/assets/index-BZrcK1BK.js"
  },
  "/assets/index-BHfXg1hS.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"447d7-vs0WAMU5GeQtsRZXr6AjsIHGT4k"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 280535,
    "path": "../public/assets/index-BHfXg1hS.js"
  },
  "/assets/index-BMk7J3TZ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"362bf-au5DgEEVGIZ9gOBcizCKgeGfiTw"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 221887,
    "path": "../public/assets/index-BMk7J3TZ.js"
  },
  "/assets/index-CMAjIfdM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"444-jvzrtndqOzyKG2Zw7rucn2yCTGE"',
    "mtime": "2026-02-10T10:57:34.947Z",
    "size": 1092,
    "path": "../public/assets/index-CMAjIfdM.js"
  },
  "/assets/index-Bn_hxI3d.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3112-xsUaxHi2kWWt6jsojGWVFPqYyYU"',
    "mtime": "2026-02-10T10:57:34.948Z",
    "size": 12562,
    "path": "../public/assets/index-Bn_hxI3d.js"
  },
  "/assets/index-CSwboYSQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"443-vPKfUNibCHEIB3rCEZGSWszZrLU"',
    "mtime": "2026-02-10T10:57:34.947Z",
    "size": 1091,
    "path": "../public/assets/index-CSwboYSQ.js"
  },
  "/assets/index-CVMiFr0Y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"429-sZIFKMc09JaZ09kvr5YdP0mUadU"',
    "mtime": "2026-02-10T10:57:34.946Z",
    "size": 1065,
    "path": "../public/assets/index-CVMiFr0Y.js"
  },
  "/assets/index-CGywV5Vp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1d76-2aeknT1y1fjYFueAwEYfBytcUyY"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 7542,
    "path": "../public/assets/index-CGywV5Vp.js"
  },
  "/assets/index-BzbAb6iR.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"22b8-6njzMKbPuLRUS/0Ex8QyTq/bKXQ"',
    "mtime": "2026-02-10T10:57:34.945Z",
    "size": 8888,
    "path": "../public/assets/index-BzbAb6iR.js"
  },
  "/assets/index-BrQhrLZ9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5d7-EyIknY9s+t/37DqHvgxkE3uYeb0"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 1495,
    "path": "../public/assets/index-BrQhrLZ9.js"
  },
  "/assets/index-CWjjbqPe.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ab-1RNqVMUp90pDTB3nhAS5ZsuMbn8"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 171,
    "path": "../public/assets/index-CWjjbqPe.js"
  },
  "/assets/index-C_Vm_8le.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"28b9-6lHM2H3/jSDJDGI4u4a3C94T1PY"',
    "mtime": "2026-02-10T10:57:34.946Z",
    "size": 10425,
    "path": "../public/assets/index-C_Vm_8le.js"
  },
  "/assets/index-CtgX2cPG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2a61-EJNaJRbaa9VGnA/rzaz2IPYSYRY"',
    "mtime": "2026-02-10T10:57:34.946Z",
    "size": 10849,
    "path": "../public/assets/index-CtgX2cPG.js"
  },
  "/assets/index-CrOYxFpX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5e57-AzmXMEqc9H9IIur2jZieQHL0k2Q"',
    "mtime": "2026-02-10T10:57:34.946Z",
    "size": 24151,
    "path": "../public/assets/index-CrOYxFpX.js"
  },
  "/assets/index-DDvWKnmb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5b4-+MddUE0TRaRFksnLgYqSYQjyjQA"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 1460,
    "path": "../public/assets/index-DDvWKnmb.js"
  },
  "/assets/index-DHriFFaX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5b31-6+5Xn7jqkhKaza8R7s46j/lzmJo"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 23345,
    "path": "../public/assets/index-DHriFFaX.js"
  },
  "/assets/index-BFgxzQGh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"441-R++Fj+aY0j8T03k29CVnnziGkNg"',
    "mtime": "2026-02-10T10:57:34.946Z",
    "size": 1089,
    "path": "../public/assets/index-BFgxzQGh.js"
  },
  "/assets/index-DBpsoWXq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"686-n5j5T0AiwPg6zDtknP0jBCktTeM"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 1670,
    "path": "../public/assets/index-DBpsoWXq.js"
  },
  "/assets/index-CyzDnTcD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7e80a-/W4HqcEsYxkOiWDZFFmarBQnfdQ"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 518154,
    "path": "../public/assets/index-CyzDnTcD.js"
  },
  "/assets/index-DOOsqIPV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"757-s4nTIyO346eXPesjynW4K3+t/0c"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 1879,
    "path": "../public/assets/index-DOOsqIPV.js"
  },
  "/assets/index-Dl0WPN9X.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"429-BlcYDYWpPBmjRNXlUiNYaludxIc"',
    "mtime": "2026-02-10T10:57:34.946Z",
    "size": 1065,
    "path": "../public/assets/index-Dl0WPN9X.js"
  },
  "/assets/index-Dc_pnFA6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1bdc-1FlGYE1YEjtCA7jv3DhJfhzJkjg"',
    "mtime": "2026-02-10T10:57:34.948Z",
    "size": 7132,
    "path": "../public/assets/index-Dc_pnFA6.js"
  },
  "/assets/index-DTPRg_42.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"2dff-hhyZJnGsOr3+X/81PIix2GrG4K0"',
    "mtime": "2026-02-10T10:57:34.947Z",
    "size": 11775,
    "path": "../public/assets/index-DTPRg_42.js"
  },
  "/assets/index-DtqBFgK5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"29-crG9x4dYeQi7xsfEfaRvCOejUcg"',
    "mtime": "2026-02-10T10:57:34.945Z",
    "size": 41,
    "path": "../public/assets/index-DtqBFgK5.js"
  },
  "/assets/index-DnamYqLp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3dcc-d59kxvhqUAcnSpdsIR/vBe+1E00"',
    "mtime": "2026-02-10T10:57:34.948Z",
    "size": 15820,
    "path": "../public/assets/index-DnamYqLp.js"
  },
  "/assets/index-DnI-32n-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1d10-qAwdG4imxzfpWSPTTfUqvoe8MA8"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 7440,
    "path": "../public/assets/index-DnI-32n-.js"
  },
  "/assets/index-LSmC_NKz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3706-0JQ2Ahl6eDjR3fM0lm76ujW5lEo"',
    "mtime": "2026-02-10T10:57:34.946Z",
    "size": 14086,
    "path": "../public/assets/index-LSmC_NKz.js"
  },
  "/assets/index-DzspDiss.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"680-C/fvNe8YijQLrK9Zj6c4bfOPccg"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 1664,
    "path": "../public/assets/index-DzspDiss.js"
  },
  "/assets/index-UKEVjpga.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"7d1-fCC7iktFIl2zKgLhiuUyvJEZHhQ"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 2001,
    "path": "../public/assets/index-UKEVjpga.js"
  },
  "/assets/index-RsX7ySOU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3f90-XTEQbbyvbbOZ4svYM0hqPsEkFFg"',
    "mtime": "2026-02-10T10:57:34.946Z",
    "size": 16272,
    "path": "../public/assets/index-RsX7ySOU.js"
  },
  "/assets/index-YUF1n3UN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"32a5-aoXm4r9zL8mGkVdVjoxX/Mk3+Lc"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 12965,
    "path": "../public/assets/index-YUF1n3UN.js"
  },
  "/assets/index-dCKO-H-p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"700-fHVF6lixW2BkaCUhaUCK7prUJ9U"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 1792,
    "path": "../public/assets/index-dCKO-H-p.js"
  },
  "/assets/index-ihq9pkG6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5b8-fkvHOcnZZ0ocZ1zsQc/yT3auJjg"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 1464,
    "path": "../public/assets/index-ihq9pkG6.js"
  },
  "/assets/index-p0R01vq7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"46c-OZUN5wYWbDPRU4P9Dl25FIZUVHo"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 1132,
    "path": "../public/assets/index-p0R01vq7.js"
  },
  "/assets/input-CpzCFDUM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"990-WogGI3kb2SWig3nd/YV3oIE2+Ws"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 2448,
    "path": "../public/assets/input-CpzCFDUM.js"
  },
  "/assets/label-Dxc7L3gt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"22a-vxAxzMR+KzwrFNGsLLcMdTqRDX0"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 554,
    "path": "../public/assets/label-Dxc7L3gt.js"
  },
  "/assets/locale-store-B7-CXBVt.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1da8-rYASFkrfahr98QS+Or/Vv+P+aQ0"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 7592,
    "path": "../public/assets/locale-store-B7-CXBVt.js"
  },
  "/assets/login-Cpm4DwaL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e8d-eoGu8hHgk3xPg2qqkQtRWQ+BwSQ"',
    "mtime": "2026-02-10T10:57:34.945Z",
    "size": 3725,
    "path": "../public/assets/login-Cpm4DwaL.js"
  },
  "/assets/index-gxH6rxJw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3ec6-huNM+i1xK1NM7Md/YAce4H3f704"',
    "mtime": "2026-02-10T10:57:34.947Z",
    "size": 16070,
    "path": "../public/assets/index-gxH6rxJw.js"
  },
  "/assets/message-square-DyREG7ZW.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e4-ZJI6tsbZYOwpJLXFQkPrVqF+8qM"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 228,
    "path": "../public/assets/message-square-DyREG7ZW.js"
  },
  "/assets/map-pin-CG0vM4pM.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"103-LeXAvXxyCETpEvzNQf4e/jWapeY"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 259,
    "path": "../public/assets/map-pin-CG0vM4pM.js"
  },
  "/assets/pause-CYWFn1F4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ce-6bmNJHM8t2jSUtnv/Oz0BGJbmuQ"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 206,
    "path": "../public/assets/pause-CYWFn1F4.js"
  },
  "/assets/mail-Ds_6P5GI.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d0-aw0SwQmA+YMX5UoiptYWmKsOkkU"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 208,
    "path": "../public/assets/mail-Ds_6P5GI.js"
  },
  "/assets/pencil-DArAg8w1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"114-tQO+/SexgLCIFaWP36OXvjCCqyw"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 276,
    "path": "../public/assets/pencil-DArAg8w1.js"
  },
  "/assets/main-DceGpGwO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6fead-vy9rizzQscHJKh05PZ6sihNmx0w"',
    "mtime": "2026-02-10T10:57:34.945Z",
    "size": 458413,
    "path": "../public/assets/main-DceGpGwO.js"
  },
  "/assets/plugin-W3ivlmy3.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ff7-LuV3bfQK9j17+VI+p/zXegbwLJA"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 4087,
    "path": "../public/assets/plugin-W3ivlmy3.js"
  },
  "/assets/phone-BmZ1J9RL.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"142-4yq+Eyy5QgYdQL8XtxI7FHR67E8"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 322,
    "path": "../public/assets/phone-BmZ1J9RL.js"
  },
  "/assets/roles-BxusQDRQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"65-skRGBHd0R4/8nkhV5bgoQF/6BQg"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 101,
    "path": "../public/assets/roles-BxusQDRQ.js"
  },
  "/assets/rotate-ccw-D1382t7t.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c3-5+drDodi5yveRUwH8Ipo5QRCCyI"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 195,
    "path": "../public/assets/rotate-ccw-D1382t7t.js"
  },
  "/assets/save-CJbBaplQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"147-wLWe6w1qvLLCckc4h+qojlh0tjY"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 327,
    "path": "../public/assets/save-CJbBaplQ.js"
  },
  "/assets/plus-DQcJe8Ot.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"94-quMFSrC6xSzURDAujiZed3Sqb6s"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 148,
    "path": "../public/assets/plus-DQcJe8Ot.js"
  },
  "/assets/rich-text-editor-Ql0OP3yX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6c3a0-YYwarTdBqU0A43CU9HFpp9cNXXY"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 443296,
    "path": "../public/assets/rich-text-editor-Ql0OP3yX.js"
  },
  "/assets/search-DiNF_osN.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"ae-iXEJo/X8VIg67oHvNN5MBldQ+KE"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 174,
    "path": "../public/assets/search-DiNF_osN.js"
  },
  "/assets/schemas-DgsRFTRk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"18cbe-2NmiIarY6sVZohUnjIjYzDTBYzw"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 101566,
    "path": "../public/assets/schemas-DgsRFTRk.js"
  },
  "/assets/shield-Be1R6ZYF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"10b-/Rcatlr0rLvR8bF742udhozEzaA"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 267,
    "path": "../public/assets/shield-Be1R6ZYF.js"
  },
  "/assets/styles-GgvS93Dv.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"2348b-baJGblMR5JfUyJPxqf5wlcVMCrI"',
    "mtime": "2026-02-10T10:57:34.941Z",
    "size": 144523,
    "path": "../public/assets/styles-GgvS93Dv.css"
  },
  "/assets/select-Cs5v_HVJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"8028-Q2nAGa6NiYt+sr5bbYnpXJHJ8ZI"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 32808,
    "path": "../public/assets/select-Cs5v_HVJ.js"
  },
  "/assets/switch-DkN2TSXG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1207-SMXy14KPdJd+HBaixY9j0oAtw4Y"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 4615,
    "path": "../public/assets/switch-DkN2TSXG.js"
  },
  "/assets/tags-DgzrRFlc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a0-5/s14U16lJOlHGgA/IYODNhxbNg"',
    "mtime": "2026-02-10T10:57:34.948Z",
    "size": 416,
    "path": "../public/assets/tags-DgzrRFlc.js"
  },
  "/assets/tabs-D4WqO67b.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3456-DAeHTdN8bTBCQ5KxRfst8Km8G7M"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 13398,
    "path": "../public/assets/tabs-D4WqO67b.js"
  },
  "/assets/textarea-B4n0Klki.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"35a-TF3OtvPWgQcAMNFz93u4ZBjv8x0"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 858,
    "path": "../public/assets/textarea-B4n0Klki.js"
  },
  "/assets/target-BvKUpk-5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"e2-nB/ftbqLc63jM1KYiGmYG8P9GjA"',
    "mtime": "2026-02-10T10:57:34.948Z",
    "size": 226,
    "path": "../public/assets/target-BvKUpk-5.js"
  },
  "/assets/trash-2-D-pc85fq.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"148-1FHWqFqB7QW8FzrM2cfUFrpIqWA"',
    "mtime": "2026-02-10T10:57:34.951Z",
    "size": 328,
    "path": "../public/assets/trash-2-D-pc85fq.js"
  },
  "/assets/tooltip-DwKgX5MA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"38ec-+2cFZwT7toemeyU77SiOgwC7OY4"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 14572,
    "path": "../public/assets/tooltip-DwKgX5MA.js"
  },
  "/assets/trending-up-Dd2P4Rxg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"aa-4Y173oCoHFAHF5JtjF6NpBcM45k"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 170,
    "path": "../public/assets/trending-up-Dd2P4Rxg.js"
  },
  "/assets/useCompositeItem--a0qhkcj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"21a-bMla28GSpJQCVBCKs2DUoF8W1tE"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 538,
    "path": "../public/assets/useCompositeItem--a0qhkcj.js"
  },
  "/assets/useDebouncer-DXOkU-n8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"950-8Mg67C97DcN5xNmdSsBrECM5zsc"',
    "mtime": "2026-02-10T10:57:34.948Z",
    "size": 2384,
    "path": "../public/assets/useDebouncer-DXOkU-n8.js"
  },
  "/assets/useField-BAEOusgc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a3a-L9vWZAZRosTjwxeRnchSEbzxMOU"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 2618,
    "path": "../public/assets/useField-BAEOusgc.js"
  },
  "/assets/useOpenInteractionType-57V_whEH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"c15a-5F3ZyN12SvfTZobCG52WbrbujqA"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 49498,
    "path": "../public/assets/useOpenInteractionType-57V_whEH.js"
  },
  "/assets/useRole-BGM6ddMg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5c5-Y61yhcS36TH7IC46NosRJ19lAAU"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 1477,
    "path": "../public/assets/useRole-BGM6ddMg.js"
  },
  "/assets/useSuspenseQuery-DKXLqyTc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"22c4-KEgt6MzZaLUfjjDQfln5XX96fp0"',
    "mtime": "2026-02-10T10:57:34.947Z",
    "size": 8900,
    "path": "../public/assets/useSuspenseQuery-DKXLqyTc.js"
  },
  "/assets/useValueChanged-DZJ1QgWJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"d1-Pzrgik6cirkIXRUBT4/etTtqw7c"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 209,
    "path": "../public/assets/useValueChanged-DZJ1QgWJ.js"
  },
  "/assets/user-CUHKimUD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"bf-sv0bs2vShBZ9YLgzl6L9awvk/9U"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 191,
    "path": "../public/assets/user-CUHKimUD.js"
  },
  "/assets/users-x8qJnTcV.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"12d-QLky4WyVoFBqDe6PUYXuGBM9VnA"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 301,
    "path": "../public/assets/users-x8qJnTcV.js"
  },
  "/assets/video-DT5zOMka.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f3-/OxxArD0kpYlG399xU6tu6kaJBs"',
    "mtime": "2026-02-10T10:57:34.949Z",
    "size": 243,
    "path": "../public/assets/video-DT5zOMka.js"
  },
  "/assets/useSyncedFloatingRootContext-DdOu4aU5.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"de2-D1HEZekEqtbHDah9Xcm6mWon4m8"',
    "mtime": "2026-02-10T10:57:34.950Z",
    "size": 3554,
    "path": "../public/assets/useSyncedFloatingRootContext-DdOu4aU5.js"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br"
};
const _JEBc6T = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/");
    s.length - 1;
    if (s[1] === "assets") {
      r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
    }
    return r;
  };
})();
const _lazy_xVC8oL = defineLazyEventHandler(() => Promise.resolve().then(function() {
  return ssrRenderer$1;
}));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_xVC8oL };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_JEBc6T)
].filter(Boolean);
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function createNitroApp() {
  const hooks = void 0;
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({
          error,
          context: errorCtx
        });
      }
    }
  };
  const h3App = createH3App({ onError(error, event) {
    return errorHandler(error, event);
  } });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  const app = {
    fetch: appHandler,
    h3: h3App,
    hooks,
    captureError
  };
  return app;
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~middleware"].push(...globalMiddleware);
  {
    h3App["~getMiddleware"] = (event, route) => {
      const pathname = event.url.pathname;
      const method = event.req.method;
      const middleware = [];
      {
        const routeRules = getRouteRules(method, pathname);
        event.context.routeRules = routeRules?.routeRules;
        if (routeRules?.routeRuleMiddleware.length) {
          middleware.push(...routeRules.routeRuleMiddleware);
        }
      }
      middleware.push(...h3App["~middleware"]);
      if (route?.data?.middleware?.length) {
        middleware.push(...route.data.middleware);
      }
      return middleware;
    };
  }
  return h3App;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  for (const rule of Object.values(routeRules)) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const port = Number.parseInt(process.env.NITRO_PORT || process.env.PORT || "") || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch
});
trapUnhandledErrors();
const nodeServer = {};
function fetchViteEnv(viteEnvName, input, init) {
  const envs = globalThis.__nitro_vite_envs__ || {};
  const viteEnv = envs[viteEnvName];
  if (!viteEnv) {
    throw HTTPError.status(404);
  }
  return Promise.resolve(viteEnv.fetch(toRequest(input, init)));
}
function ssrRenderer({ req }) {
  return fetchViteEnv("ssr", req);
}
const ssrRenderer$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  default: ssrRenderer
});
export {
  nodeServer as default
};
