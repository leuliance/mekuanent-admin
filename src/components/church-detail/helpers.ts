/** Extract a human-readable message from any TanStack Form error value. */
export function getErrorMessage(error: unknown): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error === "object" && error !== null) {
    if ("message" in error) {
      const msg = (error as Record<string, unknown>).message;
      if (typeof msg === "string") return msg;
    }
    if (
      "issues" in error &&
      Array.isArray((error as Record<string, unknown>).issues)
    ) {
      const issues = (error as { issues: Array<{ message: string }> }).issues;
      return issues[0]?.message || "";
    }
  }
  try {
    const str = JSON.stringify(error);
    if (str && str !== "{}") return str;
  } catch {
    /* ignore */
  }
  return "";
}
