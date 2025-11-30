import { RemoveButton } from './RemoveButton'
import { SlideSection } from './SlideSection'
import type { FieldComponent, FieldErrorGetter, FormBlock, FormSlide } from './types'

interface BlockSectionProps {
  Field: FieldComponent
  specimenIndex: number
  blockIndex: number
  block: FormBlock
  blockIdentifier: string
  getFieldError: FieldErrorGetter
  onAddSlide: () => void
  onRemoveSlide: (slideIndex: number, slideCount: number) => void
  onRemoveBlock: () => void
  canRemoveBlock: boolean
  getSlideIdentifier: (slideIndex: number) => string
}

export function BlockSection({
  Field,
  specimenIndex,
  blockIndex,
  block,
  blockIdentifier,
  getFieldError,
  onAddSlide,
  onRemoveSlide,
  onRemoveBlock,
  canRemoveBlock,
  getSlideIdentifier,
}: BlockSectionProps) {
  const slides = block.slides as FormSlide[]

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold text-[var(--foreground)]">{blockIdentifier}</p>
      </div>

      <div className="mt-3">
        {slides.map((slide, slideIndex) => (
          <SlideSection
            key={slide.uid}
            Field={Field}
            specimenIndex={specimenIndex}
            blockIndex={blockIndex}
            slideIndex={slideIndex}
            canRemove={slides.length > 1}
            getFieldError={getFieldError}
            onRemove={() => onRemoveSlide(slideIndex, slides.length)}
            slideIdentifier={getSlideIdentifier(slideIndex)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddSlide}
        className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
      >
        + Ajouter une lame
      </button>

      {canRemoveBlock && (
        <RemoveButton onClick={onRemoveBlock} className="mt-3 ml-auto">
          Supprimer le bloc
        </RemoveButton>
      )}
    </div>
  )
}
