export default function ErrorPageText(error: string) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <h1 className="text-2xl font-bold">Oups, une erreur est survenue !</h1>
      <p className="text-center text-gray-600">{error}</p>
    </div>
  );
}
