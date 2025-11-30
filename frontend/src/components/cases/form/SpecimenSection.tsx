import { RemoveButton } from './RemoveButton'
import { BlockSection } from './BlockSection'
import type {
  FieldComponent,
  FieldErrorGetter,
  FormBlock,
  FormSpecimen,
} from './types'

interface SpecimenSectionProps {
  Field: FieldComponent
  specimenIndex: number
  specimen: FormSpecimen
  specimenIdentifier: string
  getFieldError: FieldErrorGetter
  onAddBlock: () => void
  onRemoveSpecimen: () => void
  onRemoveBlock: (blockIndex: number, blockCount: number) => void
  onAddSlide: (blockIndex: number) => void
  onRemoveSlide: (blockIndex: number, slideIndex: number, slideCount: number) => void
  canRemoveSpecimen: boolean
  getBlockIdentifier: (blockIndex: number) => string
  getSlideIdentifier: (slideIndex: number) => string
}

export function SpecimenSection({
  Field,
  specimenIndex,
  specimen,
  specimenIdentifier,
  getFieldError,
  onAddBlock,
  onRemoveSpecimen,
  onRemoveBlock,
  onAddSlide,
  onRemoveSlide,
  canRemoveSpecimen,
  getBlockIdentifier,
  getSlideIdentifier,
}: SpecimenSectionProps) {
  const blocks = specimen.blocks as FormBlock[]

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-[var(--foreground)]">
          {specimenIdentifier}
        </p>
      </div>

      <div className="mt-4 space-y-4">
        {blocks.map((block, blockIndex) => (
          <BlockSection
            key={block.uid}
            Field={Field}
            specimenIndex={specimenIndex}
            blockIndex={blockIndex}
            block={block}
            blockIdentifier={getBlockIdentifier(blockIndex)}
            getFieldError={getFieldError}
            onAddSlide={() => onAddSlide(blockIndex)}
            onRemoveSlide={(slideIndex, slideCount) =>
              onRemoveSlide(blockIndex, slideIndex, slideCount)
            }
            onRemoveBlock={() => onRemoveBlock(blockIndex, blocks.length)}
            canRemoveBlock={blocks.length > 1}
            getSlideIdentifier={getSlideIdentifier}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddBlock}
        className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
      >
        + Ajouter un bloc
      </button>

      {canRemoveSpecimen && (
        <RemoveButton onClick={onRemoveSpecimen} className="mt-4 ml-auto">
          Supprimer le prélèvement
        </RemoveButton>
      )}
    </div>
  )
}
