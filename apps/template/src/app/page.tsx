export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="text-2xl font-semibold">Prazan template</h1>
      <p className="max-w-md text-sm text-gray-500">
        Počni graditi stranice u <code>src/app/</code>. Backend (API rute u{" "}
        <code>src/app/api</code>) i HNS data-hookovi (<code>src/lib</code>) su
        već postavljeni.
      </p>
    </main>
  );
}
