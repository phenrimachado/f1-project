"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <h2 className="mb-2 text-lg font-semibold">Algo deu errado</h2>
      <p className="mb-4 text-sm text-foreground-secondary">
        Não foi possível carregar os dados da API.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
      >
        Tentar novamente
      </button>
    </main>
  );
}
