import type { ReactNode } from 'react'
import { cn } from '../../../lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'muted' | 'card'
  className?: string
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  muted: 'bg-[var(--muted)] text-[var(--muted-foreground)]',
  card: 'bg-[var(--card)] text-[var(--muted-foreground)]',
}

export function GraphBadge({ children, variant = 'muted', className = '' }: BadgeProps) {
  return (
    <span className={cn('rounded-full px-3 py-1 text-sm font-medium', variantClasses[variant], className)}>
      {children}
    </span>
  )
}
