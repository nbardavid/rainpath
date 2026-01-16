import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Toaster } from "@/components/ui/sonner"
import { TanStackDevtools } from '@tanstack/react-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="sticky top-0 z-40 bg-[var(--card)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <img
            src="/rainpath-logo.svg"
            alt="Rainpath"
            className="h-14 w-auto"
          />
        </div>
      </header>
      <Toaster />
      <Outlet />
      <footer className="border-t border-[var(--border)] bg-[color-mix(in oklch,var(--background) 94%,var(--foreground))] py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 text-sm text-[var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            Rainpath orchestre vos dossiers de prélèvement avec React, NestJS et Prisma.
          </p>
          <Link
            to="/about"
            className="font-semibold text-[var(--foreground)] underline decoration-dotted underline-offset-4 transition hover:decoration-solid"
          >
            Découvrir pourquoi ce projet existe
          </Link>
        </div>
      </footer>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
})
