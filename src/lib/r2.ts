import { S3Client } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 access (S3-compatible API). All values are server-only secrets —
 * never expose the access keys to the client. Reads come back through the public
 * base URL (`R2_PUBLIC_BASE_URL`); writes go through short-lived presigned URLs.
 */

function requireEnv(name: string): string {
	const value = process.env[name] ?? import.meta.env?.[name];
	if (!value) {
		throw new Error(
			`Missing ${name}. Set it in your environment / Worker secrets for R2 storage.`,
		);
	}
	return value;
}

export const R2_PUBLIC_BUCKET = () =>
	process.env.R2_PUBLIC_BUCKET ?? "mekuannent-media";
export const R2_PRIVATE_BUCKET = () =>
	process.env.R2_PRIVATE_BUCKET ?? "mekuannent-private";
export const R2_PUBLIC_BASE_URL = () => requireEnv("R2_PUBLIC_BASE_URL");

let cachedClient: S3Client | null = null;

export function getR2Client(): S3Client {
	if (cachedClient) return cachedClient;
	const accountId = requireEnv("R2_ACCOUNT_ID");
	cachedClient = new S3Client({
		region: "auto",
		endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
			secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
		},
	});
	return cachedClient;
}

/** Public URL for an object stored in the public bucket. */
export function r2PublicUrl(key: string): string {
	const base = R2_PUBLIC_BASE_URL().replace(/\/$/, "");
	return `${base}/${key.replace(/^\//, "")}`;
}

/** Normalize an object key: trim leading slashes, collapse spaces. */
export function normalizeKey(path: string): string {
	return path
		.replace(/^\/+/, "")
		.replace(/\s+/g, "-")
		.replace(/[^a-zA-Z0-9._/-]/g, "");
}
