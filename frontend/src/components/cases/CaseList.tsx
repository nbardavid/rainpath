import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { RefreshCcw } from 'lucide-react'

import type { CaseRecord } from '../../types/cases'
import { useGlobalShortcut } from '../../lib/useGlobalShortcut'
import { ShortcutHint } from '../common/ShortcutHint'

interface CaseListProps {
  cases: CaseRecord[]
  selectedId: number | null
  onSelect: (caseId: number) => void
  onRefresh: () => void
  isLoading: boolean
}

const Placeholder = ({ children }: { children: ReactNode }) => (
  <p className="rounded-xl border border-dashed border-[var(--border)] px-3 py-2 text-sm text-[var(--muted-foreground)]">
    {children}
  </p>
)

export function CaseList({ cases, selectedId, onSelect, onRefresh, isLoading }: CaseListProps) {
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useGlobalShortcut(['ctrl+k', 'meta+k'], () => {
    requestAnimationFrame(() => {
      searchInputRef.current?.focus()
      searchInputRef.current?.select()
    })
  })

  const filteredCases = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return cases
    return cases.filter((caseRecord) => {
      const haystack = [caseRecord.identifier, caseRecord.id.toString()]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }, [cases, searchValue])

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-[var(--foreground)]">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
            Dossiers
          </p>
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">
            Dossiers disponibles
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Sélectionnez un dossier pour examiner sa hiérarchie.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="rounded-full border border-[var(--border)] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex items-center gap-2">
            <RefreshCcw size={14} />
            Actualiser
          </span>
        </button>
      </header>

      <div className="mt-4 space-y-3">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="chercher un dossier"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 pr-16 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none"
          />
          <ShortcutHint
            combo="Ctrl + K"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />
        </div>

        {isLoading && cases.length === 0 && (
          <p className="text-sm text-[var(--muted-foreground)]">Chargement des dossiers…</p>
        )}

        {!isLoading && cases.length === 0 && (
          <Placeholder>Aucun dossier pour le moment.</Placeholder>
        )}

        {filteredCases.length === 0 && cases.length > 0 && !isLoading && (
          <Placeholder>Aucun dossier ne correspond à votre recherche.</Placeholder>
        )}

        <div className="space-y-3 overflow-y-auto pr-1" style={{ maxHeight: 'calc(5 * 7rem)' }}>
          {filteredCases.map((caseRecord) => {
            const isActive = caseRecord.id === selectedId

            const createdAt = caseRecord.createdAt
              ? new Date(caseRecord.createdAt).toLocaleDateString()
              : '—'

            return (
              <button
                key={caseRecord.id}
                onClick={() => onSelect(caseRecord.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                    : 'border-[var(--border)] bg-[var(--muted)] hover:bg-[var(--card)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide opacity-80">Dossier n°{caseRecord.id}</p>
                    <p className="text-lg font-semibold">{caseRecord.identifier}</p>
                  </div>
                  <div
                    className={`text-right text-xs font-semibold uppercase tracking-wide ${
                      isActive ? 'text-[var(--primary-foreground)]' : 'text-[var(--muted-foreground)]'
                    }`}
                  >
                    {createdAt}
                  </div>
                </div>

                <div
                  className={`mt-3 flex flex-wrap gap-3 text-xs font-medium ${
                    isActive
                      ? 'text-[var(--primary-foreground)] opacity-90'
                      : 'text-[var(--muted-foreground)]'
                  }`}
                >
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
