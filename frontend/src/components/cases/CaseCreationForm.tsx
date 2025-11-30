import { useEffect, useRef, useState } from 'react'
import { useForm, useStore } from '@tanstack/react-form'

import type { CreateCasePayload } from '../../types/cases'
import { FormInput } from './form/FormInput'
import { SpecimenSection } from './form/SpecimenSection'
import { getFieldError, type FormSpecimen, type FormValues } from './form/types'
import {
  draftStorage,
  createEmptyBlock,
  createEmptySlide,
  createEmptySpecimen,
  createInitialValues,
  getSlideListPath,
  summarizeSpecimens,
  toPayload,
} from './form/utils'
import { formatBlockLabel, formatSpecimenLabel } from '../../lib/caseLabels'
import { buildRequiredValidators } from './form/validators'

interface CaseCreationFormProps {
  onSubmit: (payload: CreateCasePayload) => Promise<void>
  isSubmitting: boolean
  showContainer?: boolean
  showHeader?: boolean
  onSuccess?: () => void
}

const statsLabelClasses = 'text-xs uppercase tracking-wide text-[var(--muted-foreground)]'

export function CaseCreationForm({
  onSubmit,
  isSubmitting,
  showContainer = true,
  showHeader = true,
  onSuccess,
}: CaseCreationFormProps) {
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [initialValues] = useState<FormValues>(() => draftStorage.read() ?? createInitialValues())
  const skipStorageRef = useRef(false)

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value, formApi }) => {
      setSubmissionError(null)
      try {
        await onSubmit(toPayload(value))
        skipStorageRef.current = true
        formApi.reset()
        draftStorage.clear()
        onSuccess?.()
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Impossible d’enregistrer le dossier. Veuillez réessayer.'
        setSubmissionError(message)
        throw error
      }
    },
  })

  const values = useStore(form.store, (state) => state.values as FormValues)

  useEffect(() => {
    if (!values) {
      return
    }
    if (skipStorageRef.current) {
      skipStorageRef.current = false
      return
    }
    draftStorage.save(values)
  }, [values])

  const addSpecimen = () => {
    form.pushFieldValue('specimens', createEmptySpecimen())
  }

  const removeSpecimen = async (index: number, total: number) => {
    if (total <= 1) {
      return
    }
    await form.removeFieldValue('specimens', index)
  }

  const addBlock = (specimenIndex: number) => {
    form.pushFieldValue(`specimens[${specimenIndex}].blocks`, createEmptyBlock())
  }

  const removeBlock = async (
    specimenIndex: number,
    blockIndex: number,
    blockCount: number,
  ) => {
    if (blockCount <= 1) {
      return
    }
    await form.removeFieldValue(`specimens[${specimenIndex}].blocks`, blockIndex)
  }

  const addSlide = (specimenIndex: number, blockIndex: number) => {
    form.pushFieldValue(getSlideListPath(specimenIndex, blockIndex), createEmptySlide())
  }

  const removeSlide = async (
    specimenIndex: number,
    blockIndex: number,
    slideIndex: number,
    slideCount: number,
  ) => {
    if (slideCount <= 1) {
      return
    }
    await form.removeFieldValue(getSlideListPath(specimenIndex, blockIndex), slideIndex)
  }

  const content = (
    <div className="space-y-6">
      {showHeader && (
        <header className="border-b pb-4">
          <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
            Création
          </p>
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            Nouveau dossier
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Renseignez la hiérarchie prélèvement → bloc → lame et envoyez-la à l’API du
            laboratoire.
          </p>
        </header>
      )}

      {form.Subscribe({
        selector: (state) => ({
          values: state.values,
          isFormSubmitting: state.isSubmitting,
          canSubmit: state.canSubmit,
        }),
        children: ({ values, isFormSubmitting, canSubmit }) => {
          const specimens = (values.specimens as FormSpecimen[]) ?? []
          const totals = summarizeSpecimens(specimens)

          return (
            <form
              className="mt-4 space-y-6"
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                void form.handleSubmit()
              }}
            >
              <form.Field
                name="identifier"
                validators={buildRequiredValidators('Identifiant du dossier')}
              >
                {(field) => (
                  <FormInput
                    id="case-identifier"
                    label="Identifiant du dossier"
                    placeholder="ex. DOS-2025-0042"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                    onBlur={field.handleBlur}
                    error={getFieldError(field)}
                  />
                )}
              </form.Field>

              <div className="rounded-2xl bg-[var(--muted)] p-4">
                <dl className="grid grid-cols-3 gap-4 text-center text-sm text-[var(--muted-foreground)]">
                  {[
                    { label: 'Prélèvements', value: totals.specimenCount },
                    { label: 'Blocs', value: totals.blockCount },
                    { label: 'Lames', value: totals.slideCount },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <dt className={statsLabelClasses}>{stat.label}</dt>
                      <dd className="text-xl font-semibold text-[var(--foreground)]">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="space-y-6">
                {specimens.map((specimen, specimenIndex) => (
                  <SpecimenSection
                    key={specimen.uid}
                    Field={form.Field as never}
                    specimenIndex={specimenIndex}
                    specimen={specimen}
                    specimenIdentifier={formatSpecimenLabel(specimenIndex)}
                    getFieldError={getFieldError}
                    onAddBlock={() => addBlock(specimenIndex)}
                    onRemoveSpecimen={() =>
                      void removeSpecimen(specimenIndex, specimens.length)
                    }
                    onRemoveBlock={(blockIndex, blockCount) =>
                      void removeBlock(specimenIndex, blockIndex, blockCount)
                    }
                    onAddSlide={(blockIndex) => addSlide(specimenIndex, blockIndex)}
                    onRemoveSlide={(blockIndex, slideIndex, slideCount) =>
                      void removeSlide(specimenIndex, blockIndex, slideIndex, slideCount)
                    }
                    canRemoveSpecimen={specimens.length > 1}
                    getBlockIdentifier={(blockIndex) => formatBlockLabel(blockIndex)}
                    getSlideIdentifier={(slideIndex) => `${slideIndex + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={addSpecimen}
                className="w-full rounded-xl border-2 border-dashed border-[var(--border)] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:text-[var(--foreground)]"
              >
                + Ajouter un prélèvement
              </button>

              {submissionError && (
                <p className="rounded-xl bg-[color-mix(in oklch,var(--destructive) 10%,var(--background))] px-3 py-2 text-sm text-[var(--destructive)]">
                  {submissionError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isFormSubmitting || !canSubmit}
                className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting || isFormSubmitting ? 'Enregistrement…' : 'Enregistrer le dossier'}
              </button>
            </form>
          )
        },
      })}
    </div>
  )

  if (!showContainer) {
    return content
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)]">
      {content}
    </section>
  )
}
