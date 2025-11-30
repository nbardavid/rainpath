import type { Specimen } from '../../../types/cases'
import { GraphBadge } from './Badge'
import { BlockCard } from './BlockCard'
import { formatSpecimenLabel } from '@/lib/caseLabels'

interface SpecimenCardProps {
  specimen: Specimen
  specimenIndex: number
}

export function SpecimenCard({ specimen, specimenIndex }: SpecimenCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5 text-[var(--foreground)]">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[var(--foreground)]">
            {formatSpecimenLabel(specimenIndex)}
          </h3>
        </div>
        <GraphBadge variant="card" className="text-xs uppercase tracking-wide">
          {specimen.blocks.length} blocs
        </GraphBadge>
      </div>

      <div className="mt-5 space-y-4">
        {specimen.blocks.map((block, blockIndex) => (
          <BlockCard key={block.id} block={block} blockIndex={blockIndex} />
        ))}
      </div>
    </article>
  )
}
