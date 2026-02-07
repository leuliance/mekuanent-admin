import { getErrorMessage } from "./helpers";

/** Render the first error for a field, if any. */
export function FieldError({ errors }: { errors: unknown[] }) {
  if (!errors || errors.length === 0) return null;
  const msg = getErrorMessage(errors[0]);
  if (!msg) return null;
  return <p className="text-xs text-destructive">{msg}</p>;
}
