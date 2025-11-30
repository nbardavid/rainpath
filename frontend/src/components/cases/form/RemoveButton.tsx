import type { ButtonHTMLAttributes } from 'react'
import { FaTrash } from 'react-icons/fa'
import { cn } from '../../../lib/utils'

interface RemoveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: string
}

export function RemoveButton({ children, className = '', ...props }: RemoveButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)] transition hover:text-[var(--destructive)]',
        className,
      )}
      {...props}
    >
      <FaTrash size={12} aria-hidden="true" />
      {children}
    </button>
  )
}
