import type { CaseRecord } from '../../types/cases'
import { CaseHeader } from './graph/CaseHeader'
import { SpecimenCard } from './graph/SpecimenCard'
import { countBlocks, countSlides } from './graph/utils'

interface CaseGraphProps {
  caseData?: CaseRecord
  isLoading?: boolean
  onDeleteCase?: (caseRecord: CaseRecord) => Promise<void>
}

export function CaseGraph({ caseData, isLoading, onDeleteCase }: CaseGraphProps) {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/80 p-6 text-[var(--foreground)] backdrop-blur">
        <p className="text-center text-base font-medium text-[var(--muted-foreground)]">
          Chargement de la hiérarchie du dossier…
        </p>
      </section>
    )
  }

  if (!caseData) {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted)] p-8 text-center text-[var(--foreground)]">
        <p className="text-lg font-semibold text-[var(--muted-foreground)]">
          Sélectionnez un dossier pour afficher sa hiérarchie.
        </p>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Les dossiers listent les prélèvements, blocs et lames avec leurs colorations.
        </p>
      </section>
    )
  }

  const totalBlocks = countBlocks(caseData.specimens)
  const totalSlides = countSlides(caseData.specimens)

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)]">
      <CaseHeader
        caseRecord={caseData}
        totalBlocks={totalBlocks}
        totalSlides={totalSlides}
        onDeleteCase={onDeleteCase}
      />

      <div className="space-y-8">
        {caseData.specimens.map((specimen, specimenIndex) => (
          <SpecimenCard
            key={specimen.id}
            specimen={specimen}
            specimenIndex={specimenIndex}
          />
        ))}
      </div>
    </section>
  )
}
