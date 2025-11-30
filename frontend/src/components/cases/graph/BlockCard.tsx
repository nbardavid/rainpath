import type { Block } from '../../../types/cases'
import { SlideItem } from './SlideItem'
import { formatBlockLabel } from '@/lib/caseLabels'

interface BlockCardProps {
  block: Block
  blockIndex: number
}

export function BlockCard({ block, blockIndex }: BlockCardProps) {
  return (
    <section className="rounded-xl border-l-4 border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-semibold text-[var(--foreground)]">
            {formatBlockLabel(blockIndex)}
          </h4>
        </div>
      </div>

      <ol className="mt-4">
        {block.slides.map((slide, index) => (
          <SlideItem key={slide.id} slide={slide} index={index} />
        ))}
      </ol>
    </section>
  )
}
