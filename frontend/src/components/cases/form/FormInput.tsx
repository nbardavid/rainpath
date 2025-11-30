import type { InputHTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string | null
}

export function FormInput({
  id,
  label,
  error,
  className = '',
  ...inputProps
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label
        className="text-xs font-medium text-[var(--muted-foreground)]"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        className={cn(
          'w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none',
          className,
        )}
        {...inputProps}
      />
      {error && <p className="text-xs text-[var(--destructive)]">{error}</p>}
    </div>
  )
}
