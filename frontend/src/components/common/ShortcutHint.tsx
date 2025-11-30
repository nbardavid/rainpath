interface ShortcutHintProps {
  combo: string
  className?: string
}

export function ShortcutHint({ combo, className = '' }: ShortcutHintProps) {
  return (
    <span
      className={`pointer-events-none rounded border border-[var(--border)] px-2 py-0.5 text-xs uppercase tracking-wide text-[var(--muted-foreground)] ${className}`}
    >
      {combo}
    </span>
  )
}
