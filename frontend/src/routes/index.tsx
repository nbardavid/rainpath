import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CaseCreationDialog } from '../components/cases/CaseCreationDialog'
import { CaseGraph } from '../components/cases/CaseGraph'
import { CaseList } from '../components/cases/CaseList'
import { createCase, deleteCase, fetchCases } from '../lib/api'
import type { CaseRecord, CreateCasePayload } from '../types/cases'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [cases, setCases] = useState<CaseRecord[]>([])
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null)
  const [isLoadingCases, setIsLoadingCases] = useState(true)
  const [isSubmittingCase, setIsSubmittingCase] = useState(false)

  const applyCases = useCallback((fetchedCases: CaseRecord[]) => {
    setCases(fetchedCases)
    setSelectedCaseId((current) => {
      if (fetchedCases.length === 0) {
        return null
      }
      if (current && fetchedCases.some((caseItem) => caseItem.id === current)) {
        return current
      }
      return fetchedCases[0].id
    })
  }, [])

  useEffect(() => {
    let active = true
    setIsLoadingCases(true)

    fetchCases()
      .then((fetchedCases) => {
        if (!active) return
        applyCases(fetchedCases)
      })
      .catch((error) => {
        if (!active) return
        const message =
          error instanceof Error
            ? error.message
            : 'Impossible de récupérer les dossiers depuis l’API.'
        toast.error(message)
      })
      .finally(() => {
        if (!active) return
        setIsLoadingCases(false)
      })

    return () => {
      active = false
    }
  }, [applyCases])

  const refreshCases = useCallback(async () => {
    setIsLoadingCases(true)
    try {
      const fetched = await fetchCases()
      applyCases(fetched)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Impossible d’actualiser les dossiers depuis l’API.'
      toast.error(message)
      throw error
    } finally {
      setIsLoadingCases(false)
    }
  }, [applyCases])

  const handleCreateCase = useCallback(
    async (payload: CreateCasePayload) => {
      setIsSubmittingCase(true)
      try {
        const created = await createCase(payload)
        setCases((previous) => [created, ...previous])
        setSelectedCaseId(created.id)
        toast.success(`Le dossier « ${created.identifier} » a été créé avec succès.`)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'La création du dossier a échoué. Veuillez réessayer.'
        toast.error(message)
        throw error
      } finally {
        setIsSubmittingCase(false)
      }
    },
    [],
  )

  const handleDeleteCase = useCallback(async (caseRecord: CaseRecord) => {
    try {
      await deleteCase(caseRecord.id)
      let fallbackCaseId: number | null = null
      setCases((previous) => {
        const updated = previous.filter((item) => item.id !== caseRecord.id)
        fallbackCaseId = updated[0]?.id ?? null
        return updated
      })
      setSelectedCaseId((current) => {
        if (current && current !== caseRecord.id) {
          return current
        }
        return fallbackCaseId
      })
      toast.success(`Le dossier « ${caseRecord.identifier} » a été supprimé.`)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'La suppression du dossier a échoué. Veuillez réessayer.'
      toast.error(message)
      throw error
    }
  }, [])

  const selectedCase = useMemo(
    () => cases.find((caseRecord) => caseRecord.id === selectedCaseId),
    [cases, selectedCaseId],
  )

  return (
    <main className="bg-[color-mix(in oklch,var(--background) 90%,var(--foreground))]">
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 xl:grid-cols-[1fr_1.4fr]">
          <div className="space-y-8">
            <div className="flex justify-end">
              <CaseCreationDialog
                onSubmit={async (payload) => {
                  await handleCreateCase(payload)
                }}
                isSubmitting={isSubmittingCase}
              />
            </div>
            <CaseList
              cases={cases}
              selectedId={selectedCaseId}
              onSelect={setSelectedCaseId}
              onRefresh={() => {
                refreshCases().catch(() => {
                  // toast already affiche l’erreur
                })
              }}
              isLoading={isLoadingCases}
            />
          </div>

          <CaseGraph
            caseData={selectedCase}
            isLoading={isLoadingCases}
            onDeleteCase={handleDeleteCase}
          />
        </div>
      </div>
    </main>
  )
}
