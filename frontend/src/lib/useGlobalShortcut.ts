import { useEffect } from 'react'

type Shortcut = string | string[]

const normalizeShortcut = (shortcut: string) => {
  const parts = shortcut.toLowerCase().split('+').map((part) => part.trim())
  const key = parts.pop() ?? ''

  return {
    key,
    ctrl: parts.includes('ctrl'),
    meta: parts.includes('meta'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
  }
}

const matchesShortcut = (event: KeyboardEvent, shortcut: ReturnType<typeof normalizeShortcut>) =>
  event.key.toLowerCase() === shortcut.key &&
  (!shortcut.ctrl || event.ctrlKey) &&
  (!shortcut.meta || event.metaKey) &&
  (!shortcut.shift || event.shiftKey) &&
  (!shortcut.alt || event.altKey)

export function useGlobalShortcut(shortcut: Shortcut, handler: (event: KeyboardEvent) => void) {
  useEffect(() => {
    const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut]
    const normalized = shortcuts.map(normalizeShortcut)

    const listener = (event: KeyboardEvent) => {
      if (normalized.some((item) => matchesShortcut(event, item))) {
        event.preventDefault()
        handler(event)
      }
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [handler, shortcut])
}
