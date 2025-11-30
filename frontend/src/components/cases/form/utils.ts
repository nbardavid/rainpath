import type { CreateCasePayload } from '../../../types/cases'
import type {
  FormBlock,
  FormSlide,
  FormSpecimen,
  FormValues,
} from './types'

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

export const createEmptySlide = (): FormSlide => ({
  uid: createId(),
  staining: '',
})

export const createEmptyBlock = (): FormBlock => ({
  uid: createId(),
  slides: [createEmptySlide()],
})

export const createEmptySpecimen = (): FormSpecimen => ({
  uid: createId(),
  blocks: [createEmptyBlock()],
})

export const createInitialValues = (): FormValues => ({
  identifier: '',
  specimens: [createEmptySpecimen()],
})

export const summarizeSpecimens = (specimens: FormSpecimen[]) => {
  let blockCount = 0
  let slideCount = 0

  specimens.forEach((specimen) => {
    blockCount += specimen.blocks.length
    specimen.blocks.forEach((block) => {
      slideCount += block.slides.length
    })
  })

  return {
    specimenCount: specimens.length,
    blockCount,
    slideCount,
  }
}

export const toPayload = (values: FormValues): CreateCasePayload => ({
  identifier: values.identifier.trim(),
  specimens: values.specimens.map((specimen) => ({
    blocks: specimen.blocks.map((block) => ({
      slides: block.slides.map((slide) => ({
        staining: slide.staining.trim(),
      })),
    })),
  })),
})

const STORAGE_KEY = 'rainpath.case-creation'

export const draftStorage = {
  read(): FormValues | null {
    if (typeof window === 'undefined') {
      return null
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as FormValues) : null
    } catch (error) {
      console.warn('Impossible de recharger le brouillon du dossier', error)
      return null
    }
  },
  save(values: FormValues) {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values))
    } catch (error) {
      console.warn('Impossible de sauvegarder le brouillon du dossier', error)
    }
  },
  clear() {
    if (typeof window === 'undefined') {
      return
    }
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Impossible de supprimer le brouillon du dossier', error)
    }
  },
}

type SlideListPath = `specimens[${number}].blocks[${number}].slides`
type SlideFieldPath = `${SlideListPath}[${number}].${string}`

export const getSlideListPath = (specimenIndex: number, blockIndex: number): SlideListPath =>
  `specimens[${specimenIndex}].blocks[${blockIndex}].slides` as SlideListPath

export const getSlideFieldPath = (
  specimenIndex: number,
  blockIndex: number,
  slideIndex: number,
  field: string,
): SlideFieldPath =>
  `${getSlideListPath(specimenIndex, blockIndex)}[${slideIndex}].${field}` as SlideFieldPath
