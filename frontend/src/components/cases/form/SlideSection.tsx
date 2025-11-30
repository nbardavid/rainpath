import { FormInput } from './FormInput'
import { RemoveButton } from './RemoveButton'
import { buildRequiredValidators } from './validators'
import { getSlideFieldPath } from './utils'
import type { FieldComponent, FieldErrorGetter } from './types'

interface SlideSectionProps {
  Field: FieldComponent
  specimenIndex: number
  blockIndex: number
  slideIndex: number
  canRemove: boolean
  getFieldError: FieldErrorGetter
  onRemove: () => void
  slideIdentifier: string
}

export function SlideSection({
  Field,
  specimenIndex,
  blockIndex,
  slideIndex,
  canRemove,
  getFieldError,
  onRemove,
  slideIdentifier,
}: SlideSectionProps) {
  const stainingName = getSlideFieldPath(specimenIndex, blockIndex, slideIndex, 'staining')
  return (
    <div className="flex items-start gap-3">
      <p className="text-sm pt-8">Lame {slideIdentifier} :</p>
      <div className="min-h-[5.5rem]">
        <Field
          name={stainingName}
          validators={buildRequiredValidators('Coloration')}
        >
          {(field: any) => (
            <FormInput
              id={`${stainingName}-input`}
              label="Coloration"
              placeholder="HES, PAS"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={getFieldError(field)}
              className="max-w-xs" 
            />
          )}
        </Field>
      </div>
      {canRemove && (
        <RemoveButton onClick={onRemove} className="mt-9"></RemoveButton>
      )}
    </div>
  )
}
