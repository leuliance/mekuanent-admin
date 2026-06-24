import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Cloudflare R2 storage server functions. Uploads happen client-side against a
 * short-lived presigned PUT URL minted here; the R2 credentials never leave the
 * server. Public objects are then served from `R2_PUBLIC_BASE_URL`.
 */

const createUploadUrlSchema = z.object({
	/** Destination key within the bucket, e.g. `churches/<id>/images/logo.png`. */
	path: z.string().min(1),
	contentType: z.string().min(1).default("application/octet-stream"),
	/** Store in the private bucket (signed reads) instead of the public one. */
	isPrivate: z.boolean().optional().default(false),
});

export const createUploadUrl = createServerFn({ method: "POST" })
	.validator(createUploadUrlSchema)
	.handler(async ({ data }) => {
		const { PutObjectCommand } = await import("@aws-sdk/client-s3");
		const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
		const {
			getR2Client,
			r2PublicUrl,
			normalizeKey,
			R2_PUBLIC_BUCKET,
			R2_PRIVATE_BUCKET,
		} = await import("@/lib/r2");

		const key = normalizeKey(data.path);
		const bucket = data.isPrivate ? R2_PRIVATE_BUCKET() : R2_PUBLIC_BUCKET();

		const uploadUrl = await getSignedUrl(
			getR2Client(),
			new PutObjectCommand({
				Bucket: bucket,
				Key: key,
				ContentType: data.contentType,
			}),
			{ expiresIn: 600 },
		);

		return {
			key,
			uploadUrl,
			publicUrl: data.isPrivate ? null : r2PublicUrl(key),
		};
	});

const signedDownloadSchema = z.object({
	key: z.string().min(1),
	isPrivate: z.boolean().optional().default(true),
});

/** Short-lived signed GET URL for objects in the private bucket. */
export const createDownloadUrl = createServerFn({ method: "POST" })
	.validator(signedDownloadSchema)
	.handler(async ({ data }) => {
		const { GetObjectCommand } = await import("@aws-sdk/client-s3");
		const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
		const { getR2Client, r2PublicUrl, R2_PRIVATE_BUCKET } = await import(
			"@/lib/r2"
		);

		if (!data.isPrivate) {
			return { url: r2PublicUrl(data.key) };
		}

		const url = await getSignedUrl(
			getR2Client(),
			new GetObjectCommand({ Bucket: R2_PRIVATE_BUCKET(), Key: data.key }),
			{ expiresIn: 3600 },
		);
		return { url };
	});

const deleteObjectSchema = z.object({
	key: z.string().min(1),
	isPrivate: z.boolean().optional().default(false),
});

export const deleteStorageObject = createServerFn({ method: "POST" })
	.validator(deleteObjectSchema)
	.handler(async ({ data }) => {
		const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
		const { getR2Client, R2_PUBLIC_BUCKET, R2_PRIVATE_BUCKET } = await import(
			"@/lib/r2"
		);
		const bucket = data.isPrivate ? R2_PRIVATE_BUCKET() : R2_PUBLIC_BUCKET();
		await getR2Client().send(
			new DeleteObjectCommand({ Bucket: bucket, Key: data.key }),
		);
		return { success: true };
	});
