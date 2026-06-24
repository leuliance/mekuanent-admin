import { useCallback, useEffect, useMemo, useState } from "react";
import {
	type FileError,
	type FileRejection,
	useDropzone,
} from "react-dropzone";
import { createUploadUrl } from "@/api/storage";

interface FileWithPreview extends File {
	preview?: string;
	errors: readonly FileError[];
}

type UseR2UploadOptions = {
	/** Folder prefix within the bucket, e.g. `churches/<id>/images`. */
	path?: string;
	allowedMimeTypes?: string[];
	maxFileSize?: number;
	maxFiles?: number;
	/** Upload to the private bucket (signed reads) instead of the public one. */
	isPrivate?: boolean;
};

type UseR2UploadReturn = ReturnType<typeof useR2Upload>;

const useR2Upload = (options: UseR2UploadOptions) => {
	const {
		path,
		allowedMimeTypes = [],
		maxFileSize = Number.POSITIVE_INFINITY,
		maxFiles = 1,
		isPrivate = false,
	} = options;

	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [errors, setErrors] = useState<{ name: string; message: string }[]>([]);
	const [successes, setSuccesses] = useState<string[]>([]);
	/** filename -> public URL (public bucket) or object key (private bucket). */
	const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({});

	const isSuccess = useMemo(() => {
		if (errors.length === 0 && successes.length === 0) return false;
		if (errors.length === 0 && successes.length === files.length) return true;
		return false;
	}, [errors.length, successes.length, files.length]);

	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: FileRejection[]) => {
			const validFiles = acceptedFiles
				.filter((file) => !files.find((x) => x.name === file.name))
				.map((file) => {
					(file as FileWithPreview).preview = URL.createObjectURL(file);
					(file as FileWithPreview).errors = [];
					return file as FileWithPreview;
				});

			const invalidFiles = fileRejections.map(({ file, errors }) => {
				(file as FileWithPreview).preview = URL.createObjectURL(file);
				(file as FileWithPreview).errors = errors;
				return file as FileWithPreview;
			});

			setFiles([...files, ...validFiles, ...invalidFiles]);
		},
		[files],
	);

	const dropzoneProps = useDropzone({
		onDrop,
		noClick: true,
		accept: Object.fromEntries(
			allowedMimeTypes.map((type) => [type, [] as string[]]),
		),
		maxSize: maxFileSize,
		maxFiles,
		multiple: maxFiles !== 1,
	});

	const onUpload = useCallback(async () => {
		setLoading(true);

		const filesWithErrors = errors.map((x) => x.name);
		const filesToUpload =
			filesWithErrors.length > 0
				? [
						...files.filter((f) => filesWithErrors.includes(f.name)),
						...files.filter((f) => !successes.includes(f.name)),
					]
				: files;

		const newUrls: Record<string, string> = {};
		const responses = await Promise.all(
			filesToUpload.map(async (file) => {
				try {
					const contentType = file.type || "application/octet-stream";
					const { uploadUrl, publicUrl, key } = await createUploadUrl({
						data: {
							path: path ? `${path}/${file.name}` : file.name,
							contentType,
							isPrivate,
						},
					});

					const putRes = await fetch(uploadUrl, {
						method: "PUT",
						body: file,
						headers: { "Content-Type": contentType },
					});

					if (!putRes.ok) {
						return {
							name: file.name,
							message: `Upload failed (${putRes.status})`,
						};
					}

					newUrls[file.name] = publicUrl ?? key;
					return { name: file.name, message: undefined };
				} catch (err) {
					return {
						name: file.name,
						message: err instanceof Error ? err.message : "Upload failed",
					};
				}
			}),
		);

		const responseErrors = responses.filter((x) => x.message !== undefined) as {
			name: string;
			message: string;
		}[];
		setErrors(responseErrors);

		const responseSuccesses = responses.filter((x) => x.message === undefined);
		const newSuccesses = Array.from(
			new Set([...successes, ...responseSuccesses.map((x) => x.name)]),
		);
		setSuccesses(newSuccesses);
		setUploadedUrls((prev) => ({ ...prev, ...newUrls }));

		setLoading(false);
	}, [files, path, isPrivate, errors, successes]);

	useEffect(() => {
		if (files.length === 0) {
			setErrors([]);
		}
		if (files.length <= maxFiles) {
			let changed = false;
			const newFiles = files.map((file) => {
				if (file.errors.some((e) => e.code === "too-many-files")) {
					file.errors = file.errors.filter((e) => e.code !== "too-many-files");
					changed = true;
				}
				return file;
			});
			if (changed) setFiles(newFiles);
		}
	}, [files, maxFiles]);

	return {
		files,
		setFiles,
		successes,
		uploadedUrls,
		isSuccess,
		loading,
		errors,
		setErrors,
		onUpload,
		maxFileSize,
		maxFiles,
		allowedMimeTypes,
		...dropzoneProps,
	};
};

export { useR2Upload, type UseR2UploadOptions, type UseR2UploadReturn };
