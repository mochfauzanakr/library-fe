export function formatZodErrors(errors) {
  const out = {};
  errors.forEach((err) => {
    out[err.path[0]] = err.message;
  });
  return out;
}
