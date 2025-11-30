import { Link } from '@tanstack/react-router'

export function NotFoundView() {
  return (
    <main className="bg-[color-mix(in oklch,var(--background) 90%,var(--foreground))]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-4xl flex-col items-center justify-center gap-6 px-4 py-16 text-center text-[var(--foreground)] sm:px-6 lg:px-8">
        <p className="rounded-full border border-[var(--border)] px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted-foreground)]">
          Erreur 404
        </p>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold">Page introuvable</h1>
          <p className="text-base text-[var(--muted-foreground)]">
            La page demandée n’existe plus ou a été déplacée. Vérifiez l’URL ou revenez à la liste
            des dossiers pour poursuivre votre navigation.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/30"
        >
          Retour aux dossiers
        </Link>
      </div>
    </main>
  )
}
