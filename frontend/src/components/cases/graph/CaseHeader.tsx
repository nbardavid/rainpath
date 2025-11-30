import { Link } from '@tanstack/react-router'
import type { CaseRecord } from '../../../types/cases'
import { GraphBadge } from './Badge'
import { DeleteCaseDialog } from './DeleteCaseDialog'
import { useGlobalShortcut } from '../../../lib/useGlobalShortcut'
import { ShortcutHint } from '../../common/ShortcutHint'
import { useRouter } from '@tanstack/react-router'

interface CaseHeaderProps {
  caseRecord: CaseRecord
  totalBlocks: number
  totalSlides: number
  onDeleteCase?: (caseRecord: CaseRecord) => Promise<void>
}

export function CaseHeader({ caseRecord, totalBlocks, totalSlides, onDeleteCase }: CaseHeaderProps) {
  const router = useRouter()

  useGlobalShortcut('ctrl+o', () =>
    router.navigate({
      to: '/cases/$caseId/graph',
      params: { caseId: caseRecord.id.toString() },
    }),
  )

  return (
    <header className="mb-6 border-b pb-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-[var(--muted-foreground)]">
            Identifiant du dossier
          </p>
          <h2 className="text-3xl font-semibold text-[var(--foreground)]">
            {caseRecord.identifier}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/cases/$caseId/graph"
            params={{ caseId: caseRecord.id.toString() }}
            className="relative inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 pr-20 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--foreground)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/30"
          >
            vue graphique
            <ShortcutHint
              combo="Ctrl + O"
              className="absolute right-3 top-1/2 -translate-y-1/2 border-[var(--muted-foreground)]/40 text-[0.65rem] text-[var(--muted-foreground)]/80"
            />
          </Link>
          {onDeleteCase && <DeleteCaseDialog caseRecord={caseRecord} onConfirm={onDeleteCase} />}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
        {[
          { label: 'Prélèvements', value: caseRecord.specimens.length },
          { label: 'Blocs', value: totalBlocks },
          { label: 'Lames', value: totalSlides },
        ].map((stat) => (
          <GraphBadge key={stat.label}>
            {stat.label} : {stat.value}
          </GraphBadge>
        ))}
      </div>
    </header>
  )
}
