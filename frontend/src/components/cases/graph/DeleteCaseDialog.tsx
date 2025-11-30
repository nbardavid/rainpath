import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import type { CaseRecord } from "../../../types/cases";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../../ui/dialog";

interface DeleteCaseDialogProps {
	caseRecord: CaseRecord;
	onConfirm: (caseRecord: CaseRecord) => Promise<void>;
}

export function DeleteCaseDialog({
	caseRecord,
	onConfirm,
}: DeleteCaseDialogProps) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		setOpen(false);
		setIsDeleting(false);
	}, [caseRecord.id]);

	const handleConfirm = async () => {
		setIsDeleting(true);
		try {
			await onConfirm(caseRecord);
			setOpen(false);
		} catch {
			// les toasts globaux affichent déjà l’erreur
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:border-[var(--destructive)] hover:text-[var(--destructive)]"
			>
				<Trash2 size={14} aria-hidden="true" />
				Supprimer le dossier
			</button>

			<Dialog
				open={open}
				onOpenChange={(nextOpen) => !isDeleting && setOpen(nextOpen)}
			>
				<DialogContent className="max-w-md" showCloseButton={!isDeleting}>
					<DialogHeader>
						<DialogTitle>Supprimer le dossier</DialogTitle>
						<DialogDescription>
							{`Confirmez la suppression définitive du dossier « ${caseRecord.identifier} » .`}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<button
							type="button"
							onClick={() => setOpen(false)}
							disabled={isDeleting}
							className="rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-50"
						>
							Annuler
						</button>
						<button
							type="button"
							onClick={handleConfirm}
							disabled={isDeleting}
							className="rounded-full bg-[var(--destructive)] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[var(--destructive-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isDeleting ? "Suppression…" : "Supprimer"}
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
