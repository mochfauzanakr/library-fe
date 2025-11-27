export default function ForbiddenPage() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-red-600">403 - Forbidden</h1>
      <p className="text-gray-700 mt-3">
        You don't have permission to access this page.
      </p>
    </div>
  );
}
