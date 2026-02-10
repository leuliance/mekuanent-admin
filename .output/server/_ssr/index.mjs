import { c as createMemoryHistory } from "../_chunks/_libs/@tanstack/history.mjs";
import { p as parseRedirect, o as mergeHeaders, b as isRedirect, q as getNormalizedURL, u as getOrigin, v as attachRouterServerSsrUtils, w as createSerializationAdapter, x as createRawStreamRPCPlugin, i as isNotFound, y as isResolvedRedirect, z as executeRewriteInput, A as defaultSerovalPlugins, C as makeSerovalPlugin, a as rootRouteId, D as defineHandlerCallback } from "../_chunks/_libs/@tanstack/router-core.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { p as parseCookies, s as setCookie$1, H as H3Event, t as toResponse } from "../_libs/h3-v2.mjs";
import { i as invariant } from "../_libs/tiny-invariant.mjs";
import { a as au, I as Iu, o as ou } from "../_libs/seroval.mjs";
import { j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { r as renderRouterToStream, R as RouterProvider } from "../_chunks/_libs/@tanstack/react-router.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function StartServer(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(RouterProvider, { router: props.router });
}
const defaultStreamHandler = defineHandlerCallback(
  ({ request, router, responseHeaders }) => renderRouterToStream({
    request,
    router,
    responseHeaders,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(StartServer, { router })
  })
);
const TSS_FORMDATA_CONTEXT = "__TSS_CONTEXT";
const TSS_SERVER_FUNCTION = /* @__PURE__ */ Symbol.for("TSS_SERVER_FUNCTION");
const TSS_SERVER_FUNCTION_FACTORY = /* @__PURE__ */ Symbol.for(
  "TSS_SERVER_FUNCTION_FACTORY"
);
const X_TSS_SERIALIZED = "x-tss-serialized";
const X_TSS_RAW_RESPONSE = "x-tss-raw";
const TSS_CONTENT_TYPE_FRAMED = "application/x-tss-framed";
const FrameType = {
  /** Seroval JSON chunk (NDJSON line) */
  JSON: 0,
  /** Raw stream data chunk */
  CHUNK: 1,
  /** Raw stream end (EOF) */
  END: 2,
  /** Raw stream error */
  ERROR: 3
};
const FRAME_HEADER_SIZE = 9;
const TSS_FRAMED_PROTOCOL_VERSION = 1;
const TSS_CONTENT_TYPE_FRAMED_VERSIONED = `${TSS_CONTENT_TYPE_FRAMED}; v=${TSS_FRAMED_PROTOCOL_VERSION}`;
const GLOBAL_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:start-storage-context");
const globalObj$1 = globalThis;
if (!globalObj$1[GLOBAL_STORAGE_KEY]) {
  globalObj$1[GLOBAL_STORAGE_KEY] = new AsyncLocalStorage();
}
const startStorage = globalObj$1[GLOBAL_STORAGE_KEY];
async function runWithStartContext(context, fn) {
  return startStorage.run(context, fn);
}
function getStartContext(opts) {
  const context = startStorage.getStore();
  if (!context && opts?.throwIfNotFound !== false) {
    throw new Error(
      `No Start context found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return context;
}
const getStartOptions = () => getStartContext().startOptions;
const getStartContextServerOnly = getStartContext;
function isSafeKey(key) {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
function safeObjectMerge(target, source) {
  const result = /* @__PURE__ */ Object.create(null);
  if (target) {
    for (const key of Object.keys(target)) {
      if (isSafeKey(key)) result[key] = target[key];
    }
  }
  if (source && typeof source === "object") {
    for (const key of Object.keys(source)) {
      if (isSafeKey(key)) result[key] = source[key];
    }
  }
  return result;
}
function createNullProtoObject(source) {
  if (!source) return /* @__PURE__ */ Object.create(null);
  const obj = /* @__PURE__ */ Object.create(null);
  for (const key of Object.keys(source)) {
    if (isSafeKey(key)) obj[key] = source[key];
  }
  return obj;
}
const createServerFn = (options, __opts) => {
  const resolvedOptions = __opts || options || {};
  if (typeof resolvedOptions.method === "undefined") {
    resolvedOptions.method = "GET";
  }
  const res = {
    options: resolvedOptions,
    middleware: (middleware) => {
      const newMiddleware = [...resolvedOptions.middleware || []];
      middleware.map((m) => {
        if (TSS_SERVER_FUNCTION_FACTORY in m) {
          if (m.options.middleware) {
            newMiddleware.push(...m.options.middleware);
          }
        } else {
          newMiddleware.push(m);
        }
      });
      const newOptions = {
        ...resolvedOptions,
        middleware: newMiddleware
      };
      const res2 = createServerFn(void 0, newOptions);
      res2[TSS_SERVER_FUNCTION_FACTORY] = true;
      return res2;
    },
    inputValidator: (inputValidator) => {
      const newOptions = { ...resolvedOptions, inputValidator };
      return createServerFn(void 0, newOptions);
    },
    handler: (...args) => {
      const [extractedFn, serverFn] = args;
      const newOptions = { ...resolvedOptions, extractedFn, serverFn };
      const resolvedMiddleware = [
        ...newOptions.middleware || [],
        serverFnBaseToMiddleware(newOptions)
      ];
      return Object.assign(
        async (opts) => {
          const result = await executeMiddleware$1(resolvedMiddleware, "client", {
            ...extractedFn,
            ...newOptions,
            data: opts?.data,
            headers: opts?.headers,
            signal: opts?.signal,
            fetch: opts?.fetch,
            context: createNullProtoObject()
          });
          const redirect = parseRedirect(result.error);
          if (redirect) {
            throw redirect;
          }
          if (result.error) throw result.error;
          return result.result;
        },
        {
          // This copies over the URL, function ID
          ...extractedFn,
          // The extracted function on the server-side calls
          // this function
          __executeServer: async (opts, signal) => {
            const startContext = getStartContextServerOnly();
            const serverContextAfterGlobalMiddlewares = startContext.contextAfterGlobalMiddlewares;
            const ctx = {
              ...extractedFn,
              ...opts,
              // Ensure we use the full serverFnMeta from the provider file's extractedFn
              // (which has id, name, filename) rather than the partial one from SSR/client
              // callers (which only has id)
              serverFnMeta: extractedFn.serverFnMeta,
              // Use safeObjectMerge for opts.context which comes from client
              context: safeObjectMerge(
                serverContextAfterGlobalMiddlewares,
                opts.context
              ),
              signal,
              request: startContext.request
            };
            const result = await executeMiddleware$1(
              resolvedMiddleware,
              "server",
              ctx
            ).then((d) => ({
              // Only send the result and sendContext back to the client
              result: d.result,
              error: d.error,
              context: d.sendContext
            }));
            return result;
          }
        }
      );
    }
  };
  const fun = (options2) => {
    const newOptions = {
      ...resolvedOptions,
      ...options2
    };
    return createServerFn(void 0, newOptions);
  };
  return Object.assign(fun, res);
};
async function executeMiddleware$1(middlewares, env, opts) {
  const globalMiddlewares = getStartOptions()?.functionMiddleware || [];
  let flattenedMiddlewares = flattenMiddlewares([
    ...globalMiddlewares,
    ...middlewares
  ]);
  if (env === "server") {
    const startContext = getStartContextServerOnly({ throwIfNotFound: false });
    if (startContext?.executedRequestMiddlewares) {
      flattenedMiddlewares = flattenedMiddlewares.filter(
        (m) => !startContext.executedRequestMiddlewares.has(m)
      );
    }
  }
  const callNextMiddleware = async (ctx) => {
    const nextMiddleware = flattenedMiddlewares.shift();
    if (!nextMiddleware) {
      return ctx;
    }
    try {
      if ("inputValidator" in nextMiddleware.options && nextMiddleware.options.inputValidator && env === "server") {
        ctx.data = await execValidator(
          nextMiddleware.options.inputValidator,
          ctx.data
        );
      }
      let middlewareFn = void 0;
      if (env === "client") {
        if ("client" in nextMiddleware.options) {
          middlewareFn = nextMiddleware.options.client;
        }
      } else if ("server" in nextMiddleware.options) {
        middlewareFn = nextMiddleware.options.server;
      }
      if (middlewareFn) {
        const userNext = async (userCtx = {}) => {
          const nextCtx = {
            ...ctx,
            ...userCtx,
            context: safeObjectMerge(ctx.context, userCtx.context),
            sendContext: safeObjectMerge(ctx.sendContext, userCtx.sendContext),
            headers: mergeHeaders(ctx.headers, userCtx.headers),
            _callSiteFetch: ctx._callSiteFetch,
            fetch: ctx._callSiteFetch ?? userCtx.fetch ?? ctx.fetch,
            result: userCtx.result !== void 0 ? userCtx.result : userCtx instanceof Response ? userCtx : ctx.result,
            error: userCtx.error ?? ctx.error
          };
          const result2 = await callNextMiddleware(nextCtx);
          if (result2.error) {
            throw result2.error;
          }
          return result2;
        };
        const result = await middlewareFn({
          ...ctx,
          next: userNext
        });
        if (isRedirect(result)) {
          return {
            ...ctx,
            error: result
          };
        }
        if (result instanceof Response) {
          return {
            ...ctx,
            result
          };
        }
        if (!result) {
          throw new Error(
            "User middleware returned undefined. You must call next() or return a result in your middlewares."
          );
        }
        return result;
      }
      return callNextMiddleware(ctx);
    } catch (error) {
      return {
        ...ctx,
        error
      };
    }
  };
  return callNextMiddleware({
    ...opts,
    headers: opts.headers || {},
    sendContext: opts.sendContext || {},
    context: opts.context || createNullProtoObject(),
    _callSiteFetch: opts.fetch
  });
}
function flattenMiddlewares(middlewares, maxDepth = 100) {
  const seen = /* @__PURE__ */ new Set();
  const flattened = [];
  const recurse = (middleware, depth) => {
    if (depth > maxDepth) {
      throw new Error(
        `Middleware nesting depth exceeded maximum of ${maxDepth}. Check for circular references.`
      );
    }
    middleware.forEach((m) => {
      if (m.options.middleware) {
        recurse(m.options.middleware, depth + 1);
      }
      if (!seen.has(m)) {
        seen.add(m);
        flattened.push(m);
      }
    });
  };
  recurse(middlewares, 0);
  return flattened;
}
async function execValidator(validator, input) {
  if (validator == null) return {};
  if ("~standard" in validator) {
    const result = await validator["~standard"].validate(input);
    if (result.issues)
      throw new Error(JSON.stringify(result.issues, void 0, 2));
    return result.value;
  }
  if ("parse" in validator) {
    return validator.parse(input);
  }
  if (typeof validator === "function") {
    return validator(input);
  }
  throw new Error("Invalid validator type!");
}
function serverFnBaseToMiddleware(options) {
  return {
    "~types": void 0,
    options: {
      inputValidator: options.inputValidator,
      client: async ({ next, sendContext, fetch: fetch2, ...ctx }) => {
        const payload = {
          ...ctx,
          // switch the sendContext over to context
          context: sendContext,
          fetch: fetch2
        };
        const res = await options.extractedFn?.(payload);
        return next(res);
      },
      server: async ({ next, ...ctx }) => {
        const result = await options.serverFn?.(ctx);
        return next({
          ...ctx,
          result
        });
      }
    }
  };
}
function getDefaultSerovalPlugins() {
  const start = getStartOptions();
  const adapters = start?.serializationAdapters;
  return [
    ...adapters?.map(makeSerovalPlugin) ?? [],
    ...defaultSerovalPlugins
  ];
}
const GLOBAL_EVENT_STORAGE_KEY = /* @__PURE__ */ Symbol.for("tanstack-start:event-storage");
const globalObj = globalThis;
if (!globalObj[GLOBAL_EVENT_STORAGE_KEY]) {
  globalObj[GLOBAL_EVENT_STORAGE_KEY] = new AsyncLocalStorage();
}
const eventStorage = globalObj[GLOBAL_EVENT_STORAGE_KEY];
function isPromiseLike(value) {
  return typeof value.then === "function";
}
function getSetCookieValues(headers) {
  const headersWithSetCookie = headers;
  if (typeof headersWithSetCookie.getSetCookie === "function") {
    return headersWithSetCookie.getSetCookie();
  }
  const value = headers.get("set-cookie");
  return value ? [value] : [];
}
function mergeEventResponseHeaders(response, event) {
  if (response.ok) {
    return;
  }
  const eventSetCookies = getSetCookieValues(event.res.headers);
  if (eventSetCookies.length === 0) {
    return;
  }
  const responseSetCookies = getSetCookieValues(response.headers);
  response.headers.delete("set-cookie");
  for (const cookie of responseSetCookies) {
    response.headers.append("set-cookie", cookie);
  }
  for (const cookie of eventSetCookies) {
    response.headers.append("set-cookie", cookie);
  }
}
function attachResponseHeaders(value, event) {
  if (isPromiseLike(value)) {
    return value.then((resolved) => {
      if (resolved instanceof Response) {
        mergeEventResponseHeaders(resolved, event);
      }
      return resolved;
    });
  }
  if (value instanceof Response) {
    mergeEventResponseHeaders(value, event);
  }
  return value;
}
function requestHandler(handler) {
  return (request, requestOpts) => {
    const h3Event = new H3Event(request);
    const response = eventStorage.run(
      { h3Event },
      () => handler(request, requestOpts)
    );
    return toResponse(attachResponseHeaders(response, h3Event), h3Event);
  };
}
function getH3Event() {
  const event = eventStorage.getStore();
  if (!event) {
    throw new Error(
      `No StartEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.`
    );
  }
  return event.h3Event;
}
function getCookies() {
  const event = getH3Event();
  return parseCookies(event);
}
function setCookie(name, value, options) {
  const event = getH3Event();
  setCookie$1(event, name, value, options);
}
function getResponse() {
  const event = getH3Event();
  return event.res;
}
async function getStartManifest(matchedRoutes) {
  const { tsrStartManifest } = await import("./_tanstack-start-manifest_v-D_ga6Ka_.mjs");
  const startManifest = tsrStartManifest();
  const rootRoute = startManifest.routes[rootRouteId] = startManifest.routes[rootRouteId] || {};
  rootRoute.assets = rootRoute.assets || [];
  let script = `import('${startManifest.clientEntry}')`;
  rootRoute.assets.push({
    tag: "script",
    attrs: {
      type: "module",
      async: true
    },
    children: script
  });
  const manifest2 = {
    routes: Object.fromEntries(
      Object.entries(startManifest.routes).flatMap(([k, v]) => {
        const result = {};
        let hasData = false;
        if (v.preloads && v.preloads.length > 0) {
          result["preloads"] = v.preloads;
          hasData = true;
        }
        if (v.assets && v.assets.length > 0) {
          result["assets"] = v.assets;
          hasData = true;
        }
        if (!hasData) {
          return [];
        }
        return [[k, result]];
      })
    )
  };
  return manifest2;
}
const textEncoder$1 = new TextEncoder();
const EMPTY_PAYLOAD = new Uint8Array(0);
function encodeFrame(type, streamId, payload) {
  const frame = new Uint8Array(FRAME_HEADER_SIZE + payload.length);
  frame[0] = type;
  frame[1] = streamId >>> 24 & 255;
  frame[2] = streamId >>> 16 & 255;
  frame[3] = streamId >>> 8 & 255;
  frame[4] = streamId & 255;
  frame[5] = payload.length >>> 24 & 255;
  frame[6] = payload.length >>> 16 & 255;
  frame[7] = payload.length >>> 8 & 255;
  frame[8] = payload.length & 255;
  frame.set(payload, FRAME_HEADER_SIZE);
  return frame;
}
function encodeJSONFrame(json) {
  return encodeFrame(FrameType.JSON, 0, textEncoder$1.encode(json));
}
function encodeChunkFrame(streamId, chunk) {
  return encodeFrame(FrameType.CHUNK, streamId, chunk);
}
function encodeEndFrame(streamId) {
  return encodeFrame(FrameType.END, streamId, EMPTY_PAYLOAD);
}
function encodeErrorFrame(streamId, error) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return encodeFrame(FrameType.ERROR, streamId, textEncoder$1.encode(message));
}
function createMultiplexedStream(jsonStream, rawStreams) {
  let activePumps = 1 + rawStreams.size;
  let controllerRef = null;
  let cancelled = false;
  const cancelReaders = [];
  const safeEnqueue = (chunk) => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.enqueue(chunk);
    } catch {
    }
  };
  const safeError = (err) => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.error(err);
    } catch {
    }
  };
  const safeClose = () => {
    if (cancelled || !controllerRef) return;
    try {
      controllerRef.close();
    } catch {
    }
  };
  const checkComplete = () => {
    activePumps--;
    if (activePumps === 0) {
      safeClose();
    }
  };
  return new ReadableStream({
    start(controller) {
      controllerRef = controller;
      cancelReaders.length = 0;
      const pumpJSON = async () => {
        const reader = jsonStream.getReader();
        cancelReaders.push(() => {
          reader.cancel().catch(() => {
          });
        });
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (cancelled) break;
            if (done) break;
            safeEnqueue(encodeJSONFrame(value));
          }
        } catch (error) {
          safeError(error);
        } finally {
          reader.releaseLock();
          checkComplete();
        }
      };
      const pumpRawStream = async (streamId, stream) => {
        const reader = stream.getReader();
        cancelReaders.push(() => {
          reader.cancel().catch(() => {
          });
        });
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (cancelled) break;
            if (done) {
              safeEnqueue(encodeEndFrame(streamId));
              break;
            }
            safeEnqueue(encodeChunkFrame(streamId, value));
          }
        } catch (error) {
          safeEnqueue(encodeErrorFrame(streamId, error));
        } finally {
          reader.releaseLock();
          checkComplete();
        }
      };
      pumpJSON();
      for (const [streamId, stream] of rawStreams) {
        pumpRawStream(streamId, stream);
      }
    },
    cancel() {
      cancelled = true;
      controllerRef = null;
      for (const cancelReader of cancelReaders) {
        cancelReader();
      }
      cancelReaders.length = 0;
    }
  });
}
const manifest = { "1dc60576230e5b3f3ae1e63f06a1ef85f0255b45b98a675f3dc802641b3397f9": {
  functionName: "getAdminUser_createServerFn_handler",
  importer: () => import("./__root-BWS1tF6h.mjs")
}, "5909636ce7d90039623b5f81fb83e3c99d4b48e120873e19a0a0926f321e6c78": {
  functionName: "loginAdmin_createServerFn_handler",
  importer: () => import("./login-Djs-Qg9Z.mjs")
}, "007a21bb7589e150891997b50aac3dd707bc489310036957f976351564b60607": {
  functionName: "getDashboardStats_createServerFn_handler",
  importer: () => import("./dashboard-CqELCdMe.mjs")
}, "504bf72cda5df332f8a2a841b2798be3bc4c47891ababacd361bdf5bfbabb23f": {
  functionName: "getRecentActivities_createServerFn_handler",
  importer: () => import("./dashboard-CqELCdMe.mjs")
}, "5cd8ef9e2af59efd9e64c5a5791c9e2115d7036e53e9996a1a86f034523fc64b": {
  functionName: "getFeatureFlags_createServerFn_handler",
  importer: () => import("./settings-D41nR629.mjs")
}, "aa05a7d234f5890a0b5ec2cc5ddd5fe87c5e362581fa5abc42f146c5d6772ad0": {
  functionName: "updateFeatureFlag_createServerFn_handler",
  importer: () => import("./settings-D41nR629.mjs")
}, "51c9c5ea9f760e728623d5a691f8c485732b334922f83b840cc70435708aefa0": {
  functionName: "createFeatureFlag_createServerFn_handler",
  importer: () => import("./settings-D41nR629.mjs")
}, "b534ce809bf5c4b82fa425f81c3fe5f5534926ff0fd2eaa7e77b196273b1de37": {
  functionName: "deleteFeatureFlag_createServerFn_handler",
  importer: () => import("./settings-D41nR629.mjs")
}, "ec939cbd3e160bdf7aec76103177d8737a89799090351166e5aaa2072caf7159": {
  functionName: "getPaymentGateways_createServerFn_handler",
  importer: () => import("./settings-D41nR629.mjs")
}, "fa3fb6a3349c85c4cacc5dbeb4d6d1bbb83f217b7d9f7e62cd3f942aae3f4384": {
  functionName: "updatePaymentGateway_createServerFn_handler",
  importer: () => import("./settings-D41nR629.mjs")
}, "8356125b7a64d1a2d7f23de7aac4fd57785ffb2de4b02d4489c1120a34e468c4": {
  functionName: "createPaymentGateway_createServerFn_handler",
  importer: () => import("./settings-D41nR629.mjs")
}, "b8ce51d5ed4746ab6a759ad845c4300ce9c2b9418989b238a5915354ea5a7f88": {
  functionName: "deletePaymentGateway_createServerFn_handler",
  importer: () => import("./settings-D41nR629.mjs")
}, "7a89bab8f14fb6d097ad0cc189d5873f872e2494cf0845e4361c2c9c3cb5d18a": {
  functionName: "getAppOverviewStats_createServerFn_handler",
  importer: () => import("./settings-D41nR629.mjs")
}, "596094f5439992d50f4193961481bc9e7def6ccb0e992bd4640854896f0f1bde": {
  functionName: "getProfile_createServerFn_handler",
  importer: () => import("./profile-0PkkN5gk.mjs")
}, "8ba5aafb7d36e01beda344c72a9b902260ffcf2de00c58697e537d663ca5e3bb": {
  functionName: "updateProfile_createServerFn_handler",
  importer: () => import("./profile-0PkkN5gk.mjs")
}, "cf9385d1cf921b35f39a11ebe470cc0ef2e4fa92cbea0b38db20a0421631023d": {
  functionName: "changePassword_createServerFn_handler",
  importer: () => import("./profile-0PkkN5gk.mjs")
}, "b50907fadc152289c50b1e0f194a4b2990ed09d09b402d8a1435cd6f50fe392e": {
  functionName: "getNotifications_createServerFn_handler",
  importer: () => import("./notifications-Dj1SxTei.mjs")
}, "67b57209bafbfb9e7cace316e5dd2691ee5e7d4f86b8a9c112884482022a7c02": {
  functionName: "sendNotification_createServerFn_handler",
  importer: () => import("./notifications-Dj1SxTei.mjs")
}, "3da8679799672c76a0eead857d967f8d412f1b0c4b7635bdf9b047ac9de6f60c": {
  functionName: "searchUsersForNotification_createServerFn_handler",
  importer: () => import("./notifications-Dj1SxTei.mjs")
}, "a19c724e2042280bfea76308cfd0b69677ec14876cd3fcdd59260f3bc77cff26": {
  functionName: "deleteNotification_createServerFn_handler",
  importer: () => import("./notifications-Dj1SxTei.mjs")
}, "153b734f98cdf66f05757b2393e89cb114a74c06da6c22027bcf4bbbb9b1309a": {
  functionName: "getNotificationStats_createServerFn_handler",
  importer: () => import("./notifications-Dj1SxTei.mjs")
}, "d3f3988455893cc809e64179ae268b2848bddd8201cd2f60e989940142f4afb8": {
  functionName: "getContentItems_createServerFn_handler",
  importer: () => import("./content-BgceWwn-.mjs")
}, "09fd6c9e9fd0455b5604a1f9028e1f22ce76509dc659537e35a14d69f5c059aa": {
  functionName: "getContentItem_createServerFn_handler",
  importer: () => import("./content-BgceWwn-.mjs")
}, "63d408531ec0c9b0119edeb3718367cffe049676e212ef8498bd435cf16a84e6": {
  functionName: "approveContent_createServerFn_handler",
  importer: () => import("./content-BgceWwn-.mjs")
}, "0315e9011fae06aa7045db409ea92b6701bd49f1d5e9d7156f294afab48cc004": {
  functionName: "rejectContent_createServerFn_handler",
  importer: () => import("./content-BgceWwn-.mjs")
}, "0eee45c60c19d69dd15877f0f08c988dce08e5321e40e1a3a5081e4bffd6fde9": {
  functionName: "createContentItem_createServerFn_handler",
  importer: () => import("./content-BgceWwn-.mjs")
}, "5794aa598a4af5e3e7e948e7ee5e4c4454cd27e276b4f0f1035d6a36f3047d57": {
  functionName: "deleteContentItem_createServerFn_handler",
  importer: () => import("./content-BgceWwn-.mjs")
}, "d1da1e744e2aeb49a0d3fc8c8416c5be6709c2dcdd05d45dfcc2e51b4cd2bc51": {
  functionName: "updateContentStatus_createServerFn_handler",
  importer: () => import("./content-BgceWwn-.mjs")
}, "2f08f0eb4a334da2169abd45d94f19503a2ab8b6681eea564f06b67ac5e21725": {
  functionName: "getContentStats_createServerFn_handler",
  importer: () => import("./content-BgceWwn-.mjs")
}, "9f0fa00ed9c962a8a7689ffd8089f801453e3343dd40bdb8cb06d5aa4151cf43": {
  functionName: "getPayments_createServerFn_handler",
  importer: () => import("./payments-CD5rpw6O.mjs")
}, "05fdee696d535b20c2aac7cbf621ef7f3481efecd91a09553f3924c8de0523a0": {
  functionName: "getPaymentStats_createServerFn_handler",
  importer: () => import("./payments-CD5rpw6O.mjs")
}, "3a1692bea565954feff4245e4fbb84a80a972be31b2b0a2bc6be860e6db5aa00": {
  functionName: "getUsers_createServerFn_handler",
  importer: () => import("./users-D5B169lo.mjs")
}, "0ad622c84a88f4110451a2b7dfc786d1dbc78244d8854a27d923e800f4440579": {
  functionName: "getUser_createServerFn_handler",
  importer: () => import("./users-D5B169lo.mjs")
}, "cdccb35a387e2259c74eeb509397a96ca1d0ded037d5c2571889cfe74fd31439": {
  functionName: "assignUserRole_createServerFn_handler",
  importer: () => import("./users-D5B169lo.mjs")
}, "b01dd809b803a14f4618f0ec43822986aca0825acdfe46f68a1511817907d0a4": {
  functionName: "removeUserRole_createServerFn_handler",
  importer: () => import("./users-D5B169lo.mjs")
}, "11b7c8172a60af17a88c77f4d7a180ccc723cace74aa30f0cd2bb2406e9fac6d": {
  functionName: "updateUserStatus_createServerFn_handler",
  importer: () => import("./users-D5B169lo.mjs")
}, "34bdd4ffa68af3eb1f9633399fd568aa5aa8f0e21e376a1042493aae0170cd4d": {
  functionName: "getUserStats_createServerFn_handler",
  importer: () => import("./users-D5B169lo.mjs")
}, "1218da09bf96ef013b9b404ef15793fe1b54861a584beea5c944aa940955e237": {
  functionName: "getEventCategories_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "b43020ea87f034acea57dcd95974f7ef2a023b24c734b61b4c70e31b78c7a0fe": {
  functionName: "createEventCategory_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "ba4910ed0a0570ffcaecdef31bd82390a62a86fb7c3bbdebd3a38cc97d132aac": {
  functionName: "updateEventCategory_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "e71d97cfec0109a22decce286915dc7d39af1e9df9a373eff86f5b87c5b9148d": {
  functionName: "deleteEventCategory_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "eae2b2298318ef09914a943281f133663f24d6e6cd0185c13b9eba3262b98de1": {
  functionName: "getRegionCategories_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "295117c54582021d54cee981a0fd3ba09b206fca8c96d7b2f67754ee07300732": {
  functionName: "createRegionCategory_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "f7b709e58bccd5dcd737f91016a76c69a9164443d8ef5ade574b13d16a3a7c64": {
  functionName: "updateRegionCategory_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "02e85b2bac4aa206af5c7bfc7c519b1287486f0d9630219870da0fbc21c199a9": {
  functionName: "deleteRegionCategory_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "309002e200ea3912d224afd6d9532f9c994b85a84a98c6b97c72722574a4de08": {
  functionName: "getDonationCategories_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "944a802e2f2822698ab7e618f7899e6b4b01cf0d312f97a574ce6f99570656ea": {
  functionName: "createDonationCategory_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "45d4484b7fbc3da996274d4b6c9dfe3736bd54e0340cb8da77a0281ef27f73f8": {
  functionName: "updateDonationCategory_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "72881f6f5d0a9c7765f12128225791fdbc2df958a4fb0f017ac4b856c8fe8231": {
  functionName: "deleteDonationCategory_createServerFn_handler",
  importer: () => import("./categories-BosJO1lG.mjs")
}, "446166fbb6961e1ab2e3307bb5687d2629c9df32a877a85a55d99250353dbea6": {
  functionName: "getEvents_createServerFn_handler",
  importer: () => import("./events-DhOWShOd.mjs")
}, "9632a6df8fe7dce8ae00c4478b2da58ec0fb89d496dfd13df0f7fb6fec2a6dc6": {
  functionName: "getEvent_createServerFn_handler",
  importer: () => import("./events-DhOWShOd.mjs")
}, "d764e313fd68cc1f8e1a008b3613f68592bd7ab30caecc2f490444be21881b6f": {
  functionName: "getEventDonations_createServerFn_handler",
  importer: () => import("./events-DhOWShOd.mjs")
}, "620d348b9cbf59fddb4a9438b77aef2729d964f130ea46244a7c4c95158d2c9c": {
  functionName: "updateEventStatus_createServerFn_handler",
  importer: () => import("./events-DhOWShOd.mjs")
}, "92ab24991e9a6cf511b86c729727bde091ad2d4a6f316592c88a04ef6883feb8": {
  functionName: "updateEvent_createServerFn_handler",
  importer: () => import("./events-DhOWShOd.mjs")
}, "a8641be271b447d958bc3a0309843dde257d35d85704450d710e0896871a796b": {
  functionName: "deleteEvent_createServerFn_handler",
  importer: () => import("./events-DhOWShOd.mjs")
}, "b4beec82a5024d3a9c4af7dcf99789c2bced8bfd1c9a8b41811e11d8d21690c0": {
  functionName: "getEventStats_createServerFn_handler",
  importer: () => import("./events-DhOWShOd.mjs")
}, "2f915e502125867cde0494a0237ad49b5bd6a74d851434cec58f91318c04741e": {
  functionName: "getDonations_createServerFn_handler",
  importer: () => import("./donations-UnZsSc3W.mjs")
}, "2f997a5a50f5eeb22c8aedcebcd6a88c5bcc883cdb1f47159024c6109233dbdb": {
  functionName: "getCampaigns_createServerFn_handler",
  importer: () => import("./donations-UnZsSc3W.mjs")
}, "d5c924b58a83f199282592e469566ecbe5552322b98dff1f7cf795a3ee337bff": {
  functionName: "getCampaign_createServerFn_handler",
  importer: () => import("./donations-UnZsSc3W.mjs")
}, "51c5f708e402389192fdbe9429196f31868870e2fa780e68c1a90cbbb74f811f": {
  functionName: "updateCampaignStatus_createServerFn_handler",
  importer: () => import("./donations-UnZsSc3W.mjs")
}, "966cea9471ea756acda5c64736fdfef68a151d0e6852ec2bdbb5facecfba9297": {
  functionName: "deleteCampaign_createServerFn_handler",
  importer: () => import("./donations-UnZsSc3W.mjs")
}, "22abfeb3a75d1e1803b693950008e6b357db403235545ccc562bd113f67b791c": {
  functionName: "getCampaignGoalChanges_createServerFn_handler",
  importer: () => import("./donations-UnZsSc3W.mjs")
}, "8a16b3a841c85ce3c8d57997a9317c391343367a2ced1546538f5e2466bcbcae": {
  functionName: "getCampaignPaymentMethods_createServerFn_handler",
  importer: () => import("./donations-UnZsSc3W.mjs")
}, "c9d66b61319a199b0e87c9fe133f8d5dfcc08b7ed3d118fc7f66e6d3d7619448": {
  functionName: "getDonationStats_createServerFn_handler",
  importer: () => import("./donations-UnZsSc3W.mjs")
}, "4576afe9e3a9b0e8d641bc4f425074ac2384138714167d6bde1c6e84772ef98b": {
  functionName: "getChurches_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "9fabc4b30983169a50258a3f3fae1d56bf0b2b006ba33733b4231b5699a4e718": {
  functionName: "getChurch_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "d86e30fc01892b4cbe00858b1efd7e4802cff0cca775bf709d4b6981c2541c83": {
  functionName: "updateChurchStatus_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "b07882c0ec867177e82e875b6f8f533bef1d5a610264da26f6cf785593e71f79": {
  functionName: "createChurch_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "a41e722e40caeff835b61245173e16db89f35b6b96262ebb69e79ec479c64be4": {
  functionName: "updateChurch_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "6431f569bde83eee2bfd651a0ad8707af2581d5e5eb69544e719554fac62e06b": {
  functionName: "deleteChurch_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "09434b04ddfb9bc8dd23161238256bb177429fc231fd294daabd236ba5d50114": {
  functionName: "createBankAccount_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "1d5f890ab567f7d0d2f26001dfa8b95e52d74262d8de4843bf0d0c41059d7ee9": {
  functionName: "updateBankAccount_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "afca037115020fd75c128bf4041f5001640d37537871b19b247698d378ad74df": {
  functionName: "deleteBankAccount_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "94898f40caf014eba8f736b12ed372a4862e3d2a93696a4a5b02e955602a0591": {
  functionName: "addChurchImage_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "2225cde09b6b52d7024254faa62bb3d62cad989cff370751df0e12185d165473": {
  functionName: "deleteChurchImage_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "023a581d4cf1baa3062630c1cee168c1db8bf75eef9b60a28f196d64349f3bb2": {
  functionName: "getChurchStats_createServerFn_handler",
  importer: () => import("./churches-S_rqU8xF.mjs")
}, "b0aa7fbaf530a409d7707ef6ca6b59e97ee0003602d48c38ccab1993d5bca973": {
  functionName: "getBibleBooks_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "23a130f5adddd1257fbe38399a86ea80f4dcaa4b3dd12e1e3a4a294aee17a8b2": {
  functionName: "getBibleBook_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "974a6a4b367fa851d6760c17586be5b9a49729e42abf7dffb26bf35ff2d9dd1f": {
  functionName: "getBibleBookStats_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "e0a7307af09d107bd4e5a898c7b073494285a865ce5c85107204b9910ea9a871": {
  functionName: "createBibleBook_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "19515615719aaaf084e52fa2f76449e88767ceff7f1f5c7dab0e7470a2d226fd": {
  functionName: "updateBibleBook_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "7a134dde487c2e7cada1db962b7b4217665085c37a422d19654e00500f2e10f1": {
  functionName: "deleteBibleBook_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "763ca99bd77de63dd50c0fc7a604c505b9ffb923cac46e621e5e714cbdbd13e1": {
  functionName: "getBibleChapters_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "90bd3f566c97b140e100dd015f7a8c8e1804513a7ddfabf319e33ad7973d7c5d": {
  functionName: "getBibleChapter_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "b23c4e8fc3655ad01a169be32e6f6f275887781469e7ea47d664dd813048f45b": {
  functionName: "createBibleChapter_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "f81828e97e8e357e43a737f580def7599b1ff26c94aac433c5ba932bce9413f3": {
  functionName: "updateBibleChapter_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "8a390080d94832cd6203a07fc65ac930672f111324848664f96421f956b26b29": {
  functionName: "deleteBibleChapter_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "78d78cdbf65e538d15ee23a5a21131c5f2aa632873269f020dd68a5147a0563a": {
  functionName: "getBibleVerses_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "055dfaf82fcd4e3f4f4a05537d864521e33d64a5c723d45725d968e856c2bed1": {
  functionName: "getBibleVerse_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "66e151e83e191105c0c1936257b4a2419d311b93c8bc25a86b851755e9b68a41": {
  functionName: "createBibleVerse_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "4f3186460542b4a27f94d56d2c85044b2d055d54a616e7facb807f20be081a44": {
  functionName: "updateBibleVerse_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "3f0ce2ceb1949445c50d7f4c5853a31755a802a2a0f7adbe2275058686cc41ef": {
  functionName: "deleteBibleVerse_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "4fe7827292a4ddcf42118c15344866a3d97417929dae5d93e853ee453e8437b2": {
  functionName: "searchBibleVerses_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "7ab45f46e0ab1f4341be54309229612317db068ed0d753e7d9c2f6fe057e6ed2": {
  functionName: "getBibleFootnotes_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "580bf606fac1f180eed10d63431459ff38e2e41425150bd36bfbb088cba38051": {
  functionName: "createBibleFootnote_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "f023346eec6915a8a6a84df84be0563a56bac74bd13d5078b3b9c9a18ee72e7e": {
  functionName: "updateBibleFootnote_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "fa14e5b0dc217bb167771e92a6121b5466f00a850355960bc479b7c5a1ce00b0": {
  functionName: "deleteBibleFootnote_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "6e7f2054dd1923c142a6474e619110c49a1b5a27c8ea5712b5397b53156cd913": {
  functionName: "getBibleCrossReferences_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "97f0e070724bc420208f1f670c9b40c868d4c4ed1d8747121f2844552a2124f6": {
  functionName: "createBibleCrossReference_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "d92ea202c6d10a5e673359889c393f5974daec463d97b6fc3481d504f7bfb950": {
  functionName: "deleteBibleCrossReference_createServerFn_handler",
  importer: () => import("./bible-1eCIpxdJ.mjs")
}, "a22835464017e84bbc79f0ddf69d6f8b2b781ca158c0781a6ff7a205d55e5c7d": {
  functionName: "loginAdmin_createServerFn_handler",
  importer: () => import("./auth-CSpocGNn.mjs")
}, "4eb0c01dba3360c4fb5fd4f9944fc0e51c41e541a851f7619eeb8d9eaf05c49e": {
  functionName: "getSession_createServerFn_handler",
  importer: () => import("./auth-CSpocGNn.mjs")
}, "09ce32683f41a7f1c6b569399c6bd0f1e9aeafb53cd69b043bd4aac5b7d62831": {
  functionName: "logout_createServerFn_handler",
  importer: () => import("./auth-CSpocGNn.mjs")
} };
async function getServerFnById(id) {
  const serverFnInfo = manifest[id];
  if (!serverFnInfo) {
    throw new Error("Server function info not found for " + id);
  }
  const fnModule = await serverFnInfo.importer();
  if (!fnModule) {
    console.info("serverFnInfo", serverFnInfo);
    throw new Error("Server function module not resolved for " + id);
  }
  const action = fnModule[serverFnInfo.functionName];
  if (!action) {
    console.info("serverFnInfo", serverFnInfo);
    console.info("fnModule", fnModule);
    throw new Error(
      `Server function module export not resolved for serverFn ID: ${id}`
    );
  }
  return action;
}
let serovalPlugins = void 0;
const textEncoder = new TextEncoder();
const FORM_DATA_CONTENT_TYPES = [
  "multipart/form-data",
  "application/x-www-form-urlencoded"
];
const MAX_PAYLOAD_SIZE = 1e6;
const handleServerAction = async ({
  request,
  context,
  serverFnId
}) => {
  const controller = new AbortController();
  const signal = controller.signal;
  const abort = () => controller.abort();
  request.signal.addEventListener("abort", abort);
  const method = request.method;
  const methodUpper = method.toUpperCase();
  const methodLower = method.toLowerCase();
  const url = new URL(request.url);
  const action = await getServerFnById(serverFnId);
  const isServerFn = request.headers.get("x-tsr-serverFn") === "true";
  if (!serovalPlugins) {
    serovalPlugins = getDefaultSerovalPlugins();
  }
  const contentType = request.headers.get("Content-Type");
  function parsePayload(payload) {
    const parsedPayload = Iu(payload, { plugins: serovalPlugins });
    return parsedPayload;
  }
  const response = await (async () => {
    try {
      let serializeResult = function(res2) {
        let nonStreamingBody = void 0;
        const alsResponse = getResponse();
        if (res2 !== void 0) {
          const rawStreams = /* @__PURE__ */ new Map();
          const rawStreamPlugin = createRawStreamRPCPlugin(
            (id, stream2) => {
              rawStreams.set(id, stream2);
            }
          );
          const plugins = [rawStreamPlugin, ...serovalPlugins || []];
          let done = false;
          const callbacks = {
            onParse: (value) => {
              nonStreamingBody = value;
            },
            onDone: () => {
              done = true;
            },
            onError: (error) => {
              throw error;
            }
          };
          au(res2, {
            refs: /* @__PURE__ */ new Map(),
            plugins,
            onParse(value) {
              callbacks.onParse(value);
            },
            onDone() {
              callbacks.onDone();
            },
            onError: (error) => {
              callbacks.onError(error);
            }
          });
          if (done && rawStreams.size === 0) {
            return new Response(
              nonStreamingBody ? JSON.stringify(nonStreamingBody) : void 0,
              {
                status: alsResponse.status,
                statusText: alsResponse.statusText,
                headers: {
                  "Content-Type": "application/json",
                  [X_TSS_SERIALIZED]: "true"
                }
              }
            );
          }
          if (rawStreams.size > 0) {
            const jsonStream = new ReadableStream({
              start(controller2) {
                callbacks.onParse = (value) => {
                  controller2.enqueue(JSON.stringify(value) + "\n");
                };
                callbacks.onDone = () => {
                  try {
                    controller2.close();
                  } catch {
                  }
                };
                callbacks.onError = (error) => controller2.error(error);
                if (nonStreamingBody !== void 0) {
                  callbacks.onParse(nonStreamingBody);
                }
              }
            });
            const multiplexedStream = createMultiplexedStream(
              jsonStream,
              rawStreams
            );
            return new Response(multiplexedStream, {
              status: alsResponse.status,
              statusText: alsResponse.statusText,
              headers: {
                "Content-Type": TSS_CONTENT_TYPE_FRAMED_VERSIONED,
                [X_TSS_SERIALIZED]: "true"
              }
            });
          }
          const stream = new ReadableStream({
            start(controller2) {
              callbacks.onParse = (value) => controller2.enqueue(
                textEncoder.encode(JSON.stringify(value) + "\n")
              );
              callbacks.onDone = () => {
                try {
                  controller2.close();
                } catch (error) {
                  controller2.error(error);
                }
              };
              callbacks.onError = (error) => controller2.error(error);
              if (nonStreamingBody !== void 0) {
                callbacks.onParse(nonStreamingBody);
              }
            }
          });
          return new Response(stream, {
            status: alsResponse.status,
            statusText: alsResponse.statusText,
            headers: {
              "Content-Type": "application/x-ndjson",
              [X_TSS_SERIALIZED]: "true"
            }
          });
        }
        return new Response(void 0, {
          status: alsResponse.status,
          statusText: alsResponse.statusText
        });
      };
      let res = await (async () => {
        if (FORM_DATA_CONTENT_TYPES.some(
          (type) => contentType && contentType.includes(type)
        )) {
          invariant(
            methodLower !== "get",
            "GET requests with FormData payloads are not supported"
          );
          const formData = await request.formData();
          const serializedContext = formData.get(TSS_FORMDATA_CONTEXT);
          formData.delete(TSS_FORMDATA_CONTEXT);
          const params = {
            context,
            data: formData,
            method: methodUpper
          };
          if (typeof serializedContext === "string") {
            try {
              const parsedContext = JSON.parse(serializedContext);
              const deserializedContext = Iu(parsedContext, {
                plugins: serovalPlugins
              });
              if (typeof deserializedContext === "object" && deserializedContext) {
                params.context = safeObjectMerge(
                  context,
                  deserializedContext
                );
              }
            } catch (e) {
              if (false) ;
            }
          }
          return await action(params, signal);
        }
        if (methodLower === "get") {
          const payloadParam = url.searchParams.get("payload");
          if (payloadParam && payloadParam.length > MAX_PAYLOAD_SIZE) {
            throw new Error("Payload too large");
          }
          const payload2 = payloadParam ? parsePayload(JSON.parse(payloadParam)) : {};
          payload2.context = safeObjectMerge(context, payload2.context);
          payload2.method = methodUpper;
          return await action(payload2, signal);
        }
        if (methodLower !== "post") {
          throw new Error("expected POST method");
        }
        let jsonPayload;
        if (contentType?.includes("application/json")) {
          jsonPayload = await request.json();
        }
        const payload = jsonPayload ? parsePayload(jsonPayload) : {};
        payload.context = safeObjectMerge(payload.context, context);
        payload.method = methodUpper;
        return await action(payload, signal);
      })();
      const unwrapped = res.result || res.error;
      if (isNotFound(res)) {
        res = isNotFoundResponse(res);
      }
      if (!isServerFn) {
        return unwrapped;
      }
      if (unwrapped instanceof Response) {
        if (isRedirect(unwrapped)) {
          return unwrapped;
        }
        unwrapped.headers.set(X_TSS_RAW_RESPONSE, "true");
        return unwrapped;
      }
      return serializeResult(res);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      if (isNotFound(error)) {
        return isNotFoundResponse(error);
      }
      console.info();
      console.info("Server Fn Error!");
      console.info();
      console.error(error);
      console.info();
      const serializedError = JSON.stringify(
        await Promise.resolve(
          ou(error, {
            refs: /* @__PURE__ */ new Map(),
            plugins: serovalPlugins
          })
        )
      );
      const response2 = getResponse();
      return new Response(serializedError, {
        status: response2.status ?? 500,
        statusText: response2.statusText,
        headers: {
          "Content-Type": "application/json",
          [X_TSS_SERIALIZED]: "true"
        }
      });
    }
  })();
  request.signal.removeEventListener("abort", abort);
  return response;
};
function isNotFoundResponse(error) {
  const { headers, ...rest } = error;
  return new Response(JSON.stringify(rest), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      ...headers || {}
    }
  });
}
const HEADERS = {
  TSS_SHELL: "X-TSS_SHELL"
};
const ServerFunctionSerializationAdapter = createSerializationAdapter({
  key: "$TSS/serverfn",
  test: (v) => {
    if (typeof v !== "function") return false;
    if (!(TSS_SERVER_FUNCTION in v)) return false;
    return !!v[TSS_SERVER_FUNCTION];
  },
  toSerializable: ({ serverFnMeta }) => ({ functionId: serverFnMeta.id }),
  fromSerializable: ({ functionId }) => {
    const fn = async (opts, signal) => {
      const serverFn = await getServerFnById(functionId);
      const result = await serverFn(opts ?? {}, signal);
      return result.result;
    };
    return fn;
  }
});
function getStartResponseHeaders(opts) {
  const headers = mergeHeaders(
    {
      "Content-Type": "text/html; charset=utf-8"
    },
    ...opts.router.state.matches.map((match) => {
      return match.headers;
    })
  );
  return headers;
}
let entriesPromise;
let manifestPromise;
async function loadEntries() {
  const routerEntry = await import("./router-deJypcsT.mjs").then((n) => n.aF);
  const startEntry = await import("./start-HYkvq4Ni.mjs");
  return { startEntry, routerEntry };
}
function getEntries() {
  if (!entriesPromise) {
    entriesPromise = loadEntries();
  }
  return entriesPromise;
}
function getManifest(matchedRoutes) {
  if (!manifestPromise) {
    manifestPromise = getStartManifest();
  }
  return manifestPromise;
}
const ROUTER_BASEPATH = "/";
const SERVER_FN_BASE = "/_serverFn/";
const IS_PRERENDERING = process.env.TSS_PRERENDERING === "true";
const IS_SHELL_ENV = process.env.TSS_SHELL === "true";
const ERR_NO_RESPONSE = "Internal Server Error";
const ERR_NO_DEFER = "Internal Server Error";
function throwRouteHandlerError() {
  throw new Error(ERR_NO_RESPONSE);
}
function throwIfMayNotDefer() {
  throw new Error(ERR_NO_DEFER);
}
function isSpecialResponse(value) {
  return value instanceof Response || isRedirect(value);
}
function handleCtxResult(result) {
  if (isSpecialResponse(result)) {
    return { response: result };
  }
  return result;
}
function executeMiddleware(middlewares, ctx) {
  let index = -1;
  const next = async (nextCtx) => {
    if (nextCtx) {
      if (nextCtx.context) {
        ctx.context = safeObjectMerge(ctx.context, nextCtx.context);
      }
      for (const key of Object.keys(nextCtx)) {
        if (key !== "context") {
          ctx[key] = nextCtx[key];
        }
      }
    }
    index++;
    const middleware = middlewares[index];
    if (!middleware) return ctx;
    let result;
    try {
      result = await middleware({ ...ctx, next });
    } catch (err) {
      if (isSpecialResponse(err)) {
        ctx.response = err;
        return ctx;
      }
      throw err;
    }
    const normalized = handleCtxResult(result);
    if (normalized) {
      if (normalized.response !== void 0) {
        ctx.response = normalized.response;
      }
      if (normalized.context) {
        ctx.context = safeObjectMerge(ctx.context, normalized.context);
      }
    }
    return ctx;
  };
  return next();
}
function handlerToMiddleware(handler, mayDefer = false) {
  if (mayDefer) {
    return handler;
  }
  return async (ctx) => {
    const response = await handler({ ...ctx, next: throwIfMayNotDefer });
    if (!response) {
      throwRouteHandlerError();
    }
    return response;
  };
}
function createStartHandler(cb) {
  const startRequestResolver = async (request, requestOpts) => {
    let router = null;
    let cbWillCleanup = false;
    try {
      const url = getNormalizedURL(request.url);
      const href = url.pathname + url.search + url.hash;
      const origin = getOrigin(request);
      const entries = await getEntries();
      const startOptions = await entries.startEntry.startInstance?.getOptions() || {};
      const serializationAdapters = [
        ...startOptions.serializationAdapters || [],
        ServerFunctionSerializationAdapter
      ];
      const requestStartOptions = {
        ...startOptions,
        serializationAdapters
      };
      const flattenedRequestMiddlewares = startOptions.requestMiddleware ? flattenMiddlewares(startOptions.requestMiddleware) : [];
      const executedRequestMiddlewares = new Set(
        flattenedRequestMiddlewares
      );
      const getRouter = async () => {
        if (router) return router;
        router = await entries.routerEntry.getRouter();
        let isShell = IS_SHELL_ENV;
        if (IS_PRERENDERING && !isShell) {
          isShell = request.headers.get(HEADERS.TSS_SHELL) === "true";
        }
        const history = createMemoryHistory({
          initialEntries: [href]
        });
        router.update({
          history,
          isShell,
          isPrerendering: IS_PRERENDERING,
          origin: router.options.origin ?? origin,
          ...{
            defaultSsr: requestStartOptions.defaultSsr,
            serializationAdapters: [
              ...requestStartOptions.serializationAdapters,
              ...router.options.serializationAdapters || []
            ]
          },
          basepath: ROUTER_BASEPATH
        });
        return router;
      };
      if (SERVER_FN_BASE && url.pathname.startsWith(SERVER_FN_BASE)) {
        const serverFnId = url.pathname.slice(SERVER_FN_BASE.length).split("/")[0];
        if (!serverFnId) {
          throw new Error("Invalid server action param for serverFnId");
        }
        const serverFnHandler = async ({ context }) => {
          return runWithStartContext(
            {
              getRouter,
              startOptions: requestStartOptions,
              contextAfterGlobalMiddlewares: context,
              request,
              executedRequestMiddlewares
            },
            () => handleServerAction({
              request,
              context: requestOpts?.context,
              serverFnId
            })
          );
        };
        const middlewares2 = flattenedRequestMiddlewares.map(
          (d) => d.options.server
        );
        const ctx2 = await executeMiddleware([...middlewares2, serverFnHandler], {
          request,
          context: createNullProtoObject(requestOpts?.context)
        });
        return handleRedirectResponse(ctx2.response, request, getRouter);
      }
      const executeRouter = async (serverContext, matchedRoutes) => {
        const acceptHeader = request.headers.get("Accept") || "*/*";
        const acceptParts = acceptHeader.split(",");
        const supportedMimeTypes = ["*/*", "text/html"];
        const isSupported = supportedMimeTypes.some(
          (mimeType) => acceptParts.some((part) => part.trim().startsWith(mimeType))
        );
        if (!isSupported) {
          return Response.json(
            { error: "Only HTML requests are supported here" },
            { status: 500 }
          );
        }
        const manifest2 = await getManifest(matchedRoutes);
        const routerInstance = await getRouter();
        attachRouterServerSsrUtils({
          router: routerInstance,
          manifest: manifest2
        });
        routerInstance.update({ additionalContext: { serverContext } });
        await routerInstance.load();
        if (routerInstance.state.redirect) {
          return routerInstance.state.redirect;
        }
        await routerInstance.serverSsr.dehydrate();
        const responseHeaders = getStartResponseHeaders({
          router: routerInstance
        });
        cbWillCleanup = true;
        return cb({
          request,
          router: routerInstance,
          responseHeaders
        });
      };
      const requestHandlerMiddleware = async ({ context }) => {
        return runWithStartContext(
          {
            getRouter,
            startOptions: requestStartOptions,
            contextAfterGlobalMiddlewares: context,
            request,
            executedRequestMiddlewares
          },
          async () => {
            try {
              return await handleServerRoutes({
                getRouter,
                request,
                url,
                executeRouter,
                context,
                executedRequestMiddlewares
              });
            } catch (err) {
              if (err instanceof Response) {
                return err;
              }
              throw err;
            }
          }
        );
      };
      const middlewares = flattenedRequestMiddlewares.map(
        (d) => d.options.server
      );
      const ctx = await executeMiddleware(
        [...middlewares, requestHandlerMiddleware],
        { request, context: createNullProtoObject(requestOpts?.context) }
      );
      return handleRedirectResponse(ctx.response, request, getRouter);
    } finally {
      if (router && !cbWillCleanup) {
        router.serverSsr?.cleanup();
      }
      router = null;
    }
  };
  return requestHandler(startRequestResolver);
}
async function handleRedirectResponse(response, request, getRouter) {
  if (!isRedirect(response)) {
    return response;
  }
  if (isResolvedRedirect(response)) {
    if (request.headers.get("x-tsr-serverFn") === "true") {
      return Response.json(
        { ...response.options, isSerializedRedirect: true },
        { headers: response.headers }
      );
    }
    return response;
  }
  const opts = response.options;
  if (opts.to && typeof opts.to === "string" && !opts.to.startsWith("/")) {
    throw new Error(
      `Server side redirects must use absolute paths via the 'href' or 'to' options. The redirect() method's "to" property accepts an internal path only. Use the "href" property to provide an external URL. Received: ${JSON.stringify(opts)}`
    );
  }
  if (["params", "search", "hash"].some(
    (d) => typeof opts[d] === "function"
  )) {
    throw new Error(
      `Server side redirects must use static search, params, and hash values and do not support functional values. Received functional values for: ${Object.keys(
        opts
      ).filter((d) => typeof opts[d] === "function").map((d) => `"${d}"`).join(", ")}`
    );
  }
  const router = await getRouter();
  const redirect = router.resolveRedirect(response);
  if (request.headers.get("x-tsr-serverFn") === "true") {
    return Response.json(
      { ...response.options, isSerializedRedirect: true },
      { headers: response.headers }
    );
  }
  return redirect;
}
async function handleServerRoutes({
  getRouter,
  request,
  url,
  executeRouter,
  context,
  executedRequestMiddlewares
}) {
  const router = await getRouter();
  const rewrittenUrl = executeRewriteInput(router.rewrite, url);
  const pathname = rewrittenUrl.pathname;
  const { matchedRoutes, foundRoute, routeParams } = router.getMatchedRoutes(pathname);
  const isExactMatch = foundRoute && routeParams["**"] === void 0;
  const routeMiddlewares = [];
  for (const route of matchedRoutes) {
    const serverMiddleware = route.options.server?.middleware;
    if (serverMiddleware) {
      const flattened = flattenMiddlewares(serverMiddleware);
      for (const m of flattened) {
        if (!executedRequestMiddlewares.has(m)) {
          routeMiddlewares.push(m.options.server);
        }
      }
    }
  }
  const server2 = foundRoute?.options.server;
  if (server2?.handlers && isExactMatch) {
    const handlers = typeof server2.handlers === "function" ? server2.handlers({ createHandlers: (d) => d }) : server2.handlers;
    const requestMethod = request.method.toUpperCase();
    const handler = handlers[requestMethod] ?? handlers["ANY"];
    if (handler) {
      const mayDefer = !!foundRoute.options.component;
      if (typeof handler === "function") {
        routeMiddlewares.push(handlerToMiddleware(handler, mayDefer));
      } else {
        if (handler.middleware?.length) {
          const handlerMiddlewares = flattenMiddlewares(handler.middleware);
          for (const m of handlerMiddlewares) {
            routeMiddlewares.push(m.options.server);
          }
        }
        if (handler.handler) {
          routeMiddlewares.push(handlerToMiddleware(handler.handler, mayDefer));
        }
      }
    }
  }
  routeMiddlewares.push(
    (ctx2) => executeRouter(ctx2.context, matchedRoutes)
  );
  const ctx = await executeMiddleware(routeMiddlewares, {
    request,
    context,
    params: routeParams,
    pathname
  });
  return ctx.response;
}
const fetch = createStartHandler(defaultStreamHandler);
function createServerEntry(entry) {
  return {
    async fetch(...args) {
      return await entry.fetch(...args);
    }
  };
}
const server = createServerEntry({ fetch });
export {
  TSS_SERVER_FUNCTION as T,
  getCookies as a,
  createServerFn as c,
  createServerEntry,
  server as default,
  getServerFnById as g,
  setCookie as s
};
