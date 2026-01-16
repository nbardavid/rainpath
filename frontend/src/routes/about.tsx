import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

/**
 * Render the About page describing Rainpath's motivation, architecture, and feature highlights.
 *
 * Includes an introductory card, a responsive grid of feature cards, an architecture overview,
 * a dialog-based easter-egg trigger, and a navigation link back to the root page.
 *
 * @returns The About page React element.
 */
function AboutPage() {
  return (
    <main className="bg-[color-mix(in oklch,var(--background) 90%,var(--foreground))]">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] px-8 py-10 shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted-foreground)]">
            À propos
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--foreground)]">Pourquoi Rainpath existe</h1>
          <p className="mt-4 text-lg leading-relaxed text-[var(--muted-foreground)]">
            Rainpath est né d’un besoin très concret&nbsp;: permettre à une équipe d’anapath de suivre sans
            douleur la chaîne prélèvement → bloc → lame. Le frontend React (Vite, Tailwind, TanStack
            Router, XYFlow) offre une vue d’ensemble immédiate, tandis que l’API Nest&nbsp;+&nbsp;Prisma qui vit
            dans <code className="rounded bg-[var(--muted)] px-2 py-0.5 text-sm">backend/</code> garantit que les
            dossiers, prélèvements et lames restent cohérents dans Postgres.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: 'Réunir les données terrain',
              body:
                'La boîte de dialogue de création de dossier synchronise le travail des techniciens : ' +
                'tout est saisi en une seule fois et enregistré via la route POST /cases.',
            },
            {
              title: 'Comprendre la hiérarchie en un coup d’œil',
              body:
                'La vue graphique (React Flow) traduit toutes les relations specimens → blocs → lames ' +
                'en un graphe lisible, sans déplacer les nœuds.',
            },
            {
              title: 'Réduire les frictions côté dev',
              body:
                'Le monorepo Turbo + pnpm évite les allers-retours répétitifs : un seul `pnpm dev` et l’UI ' +
                'parle immédiatement à l’API conteneurisée.',
            },
            {
              title: 'Rester transparent',
              body:
                'Chaque action est toastée, les raccourcis clavier documentés et un mode "NotFound" ' +
                'personnalisé rappelle que rien n’est laissé au hasard.',
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-3xl border border-[var(--border)] bg-[var(--card)] px-6 py-6 text-[var(--foreground)] shadow-sm"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">{card.body}</p>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--muted)] px-8 py-8 text-[var(--foreground)]">
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted-foreground)]">Architecture en bref</p>
              <h2 className="mt-2 text-2xl font-semibold">Ce que chaque dossier active sous le capot</h2>
            </div>
            <dl className="grid gap-6 md:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  Frontend
                </dt>
                <dd className="mt-1 text-base text-[var(--foreground)]">
                  Vite, React 19, TanStack Router, Tailwind&nbsp;4, XYFlow pour le graphe, Sonner pour les toasts.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  Backend
                </dt>
                <dd className="mt-1 text-base text-[var(--foreground)]">
                  NestJS 11, Prisma 6.19 branché sur Postgres via Docker Compose, exposant les routes /cases.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  Monorepo
                </dt>
                <dd className="mt-1 text-base text-[var(--foreground)]">
                  Turbo coordonne les builds, pnpm verrouille les versions, Biome garde le style de code.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  Objectif
                </dt>
                <dd className="mt-1 text-base text-[var(--foreground)]">
                  Offrir une source de vérité unique sur la vie d’un dossier, du prélèvement initial jusqu’à la lame validée.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/30">
                Déclencher la pluie
                <span className="text-xs text-[var(--muted-foreground)]/70">(easter egg)</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-lg text-left">
              <DialogHeader>
                <DialogTitle>Il pleut des speculoos</DialogTitle>
                <DialogDescription>
                  Tu as trouvé la petite porte cachée de Rainpath&nbsp;! Ici, on remercie les humains qui prennent soin
                  des données : on t’offre un raccourci secret. Tape <kbd>Ctrl + L</kbd> depuis la page principale et
                  le formulaire de dossier surgira comme par magie. Ce clin d’œil existe pour rappeler que derrière
                  chaque graphe il y a une équipe curieuse — toi y compris.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--primary-foreground)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
          >
            Retour aux dossiers
          </Link>
        </div>
      </div>
    </main>
  )
}