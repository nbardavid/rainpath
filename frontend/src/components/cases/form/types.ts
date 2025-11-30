import type { ReactNode } from 'react'
import type {
  CreateBlockInput,
  CreateSlideInput,
  CreateSpecimenInput,
} from '../../../types/cases'

export type FormSlide = CreateSlideInput & { uid: string }
export type FormBlock = CreateBlockInput & { uid: string; slides: FormSlide[] }
export type FormSpecimen = CreateSpecimenInput & { uid: string; blocks: FormBlock[] }

export type FormValues = {
  identifier: string
  specimens: FormSpecimen[]
}

export type FieldComponent = (props: {
  name: string
  validators?: Record<string, unknown>
  children: (field: any) => ReactNode
}) => ReactNode

export const getFieldError = (field: {
  state: { meta: { isTouched: boolean; errors: unknown[] } }
}): string | null => {
  if (!field.state.meta.isTouched || field.state.meta.errors.length === 0) {
    return null
  }
  const [firstError] = field.state.meta.errors
  return typeof firstError === 'string' ? firstError : null
}

export type FieldErrorGetter = typeof getFieldError
