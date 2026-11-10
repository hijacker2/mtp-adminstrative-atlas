import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  mode: ThemeMode
  resolvedTheme: ResolvedTheme
  setMode: (mode: ThemeMode) => void
}

const storageKey = 'mtp-atlas-theme'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system'
}

function readStoredMode(): ThemeMode {
  try {
    const storedMode = window.localStorage.getItem(storageKey)
    return isThemeMode(storedMode) ? storedMode : 'system'
  } catch {
    return 'system'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(readStoredMode)
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateSystemTheme = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches)
    setSystemPrefersDark(mediaQuery.matches)
    mediaQuery.addEventListener('change', updateSystemTheme)
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  const resolvedTheme: ResolvedTheme = mode === 'system'
    ? systemPrefersDark ? 'dark' : 'light'
    : mode

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
    document.documentElement.style.colorScheme = resolvedTheme
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      resolvedTheme === 'dark' ? '#222321' : '#f5f2e9',
    )
    try {
      window.localStorage.setItem(storageKey, mode)
    } catch {
      // Theme still works for the current page when browser storage is unavailable.
    }
  }, [mode, resolvedTheme])

  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    resolvedTheme,
    setMode,
  }), [mode, resolvedTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used within a ThemeProvider.')
  return value
}

export const themeStorageKey = storageKey
