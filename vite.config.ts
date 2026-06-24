import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	plugins: [
		devtools(),
		nitro({
			// Target Cloudflare Workers (with static assets) for production builds.
			// Override locally with NITRO_PRESET if you need a different target.
			preset: process.env.NITRO_PRESET || "cloudflare_module",
			cloudflare: {
				wrangler: {
					name: "mekuannent-admin",
					// Serve the admin app from admin.mekuannent.app.
					// The zone for mekuannent.app must exist in the Cloudflare account.
					routes: [{ pattern: "admin.mekuannent.app", custom_domain: true }],
				},
			},
		}),
		// this is the plugin that enables path aliases
		viteTsConfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart(),
		viteReact({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
	],
});

export default config;
