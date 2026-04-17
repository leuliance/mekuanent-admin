// import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
// import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
// import type { Database } from "@/types/database.types";

// // Server-side Supabase client with cookie handling
// export const getSupabaseServerClient = () => {
//   const request = getRequest();
//   const headers = request?.headers;

//   return createServerClient<Database>(
//     process.env.VITE_SUPABASE_URL!,
//     process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
//     {
//       cookies: {
//         getAll() {
//           const cookieHeader = headers?.get("cookie") ?? "";
//           const parsed = parseCookieHeader(cookieHeader);
//           // Ensure value is always a string (required by Supabase SSR types)
//           return parsed.map(cookie => ({
//             name: cookie.name,
//             value: cookie.value ?? "",
//           }));
//         },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) => {
//             setResponseHeader(
//               "Set-Cookie",
//               serializeCookieHeader(name, value, options)
//             );
//           });
//         },
//       },
//     }
//   );
// };


import { getCookies, setCookie } from '@tanstack/react-start/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from "@/types/database.types";

export function getSupabaseServerClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY (check .env / .env.local)",
    );
  }
  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value,
          }))
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            setCookie(cookie.name, cookie.value)
          })
        },
      },
    },
  )
}