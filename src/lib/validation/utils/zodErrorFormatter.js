export function formatZodErrors(errors = []) {
  // Gracefully handle unexpected values (undefined/null/non-array)
  if (!Array.isArray(errors)) return {};

  return errors.reduce((acc, err) => {
    const key =
      Array.isArray(err?.path) && err.path.length > 0
        ? err.path[0]
        : "form";
    acc[key] = err?.message || "Invalid input";
    return acc;
  }, {});
}
