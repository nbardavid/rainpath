import { useState } from 'react'
import type { CreateCasePayload } from '../../types/cases'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { CaseCreationForm } from './CaseCreationForm'
import { useGlobalShortcut } from '../../lib/useGlobalShortcut'
import { ShortcutHint } from '../common/ShortcutHint'

interface CaseCreationDialogProps {
  onSubmit: (payload: CreateCasePayload) => Promise<void>
  isSubmitting: boolean
}

export function CaseCreationDialog({ onSubmit, isSubmitting }: CaseCreationDialogProps) {
  const [open, setOpen] = useState(false)

  useGlobalShortcut(['ctrl+l', 'meta+l'], () => setOpen(true))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="relative flex w-full items-center justify-center rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--primary-foreground)] transition hover:opacity-90"
        >
          Ajouter un dossier

          <ShortcutHint
            combo="Ctrl + L"
            className="absolute right-2 top-1/2 -translate-y-1/2 border-[var(--primary-foreground)]/40 text-[var(--primary-foreground)]/80"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[75vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Création d’un nouveau dossier</DialogTitle>
          <DialogDescription>
            Renseignez l’ensemble de la chaîne prélèvement → bloc → lame avant validation.
          </DialogDescription>
        </DialogHeader>
        <CaseCreationForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          showContainer={false}
          showHeader={false}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
