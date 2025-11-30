import type { CaseRecord } from '../../../types/cases'

export const countBlocks = (specimens: CaseRecord['specimens']): number =>
  specimens.reduce((total, specimen) => total + specimen.blocks.length, 0)

export const countSlides = (specimens: CaseRecord['specimens']): number =>
  specimens.reduce(
    (total, specimen) =>
      total + specimen.blocks.reduce((blockTotal, block) => blockTotal + block.slides.length, 0),
    0,
  )
