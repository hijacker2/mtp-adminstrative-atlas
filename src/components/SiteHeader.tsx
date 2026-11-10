import { Moon, Sun } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTheme } from './ThemeProvider'

export default function SiteHeader() {
  const { mode, resolvedTheme, setMode } = useTheme()
  const location = useLocation()
  const isObservatory = location.pathname === '/observatory'

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="MTP Administrative Atlas home">
        <span className="wordmark-seal" aria-hidden="true">M</span>
        <span className="wordmark-copy">
          <strong>MTP</strong>
          <span>Administrative Atlas</span>
        </span>
      </Link>
      <nav className="primary-nav" aria-label="Main navigation">
        <NavLink className={({ isActive }) => isActive && !isObservatory ? 'nav-current' : ''} to="/" end>Atlas</NavLink>
        <a href={`${import.meta.env.BASE_URL}#states`}>States</a>
        <a href={`${import.meta.env.BASE_URL}#sources`}>Sources</a>
        <a href={`${import.meta.env.BASE_URL}#method`}>Method</a>
        <NavLink className={({ isActive }) => isActive ? 'nav-current' : ''} to="/observatory">Burden Observatory</NavLink>
      </nav>
      <label className="theme-control">
        {resolvedTheme === 'dark' ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
        <span className="visually-hidden">Color theme</span>
        <select
          className="theme-toggle"
          value={mode}
          onChange={(event) => setMode(event.target.value as 'light' | 'dark' | 'system')}
          aria-label="Color theme"
          title={`Theme: ${mode}.`}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </label>
      <details className="future-menu">
        <summary>More <span className="forthcoming-label">Forthcoming</span></summary>
        <div className="future-menu-panel">
          <p>Future sections</p>
          <span>Visualisations</span>
          <span>Field notes</span>
          <span>Comparative essays</span>
          <small>Not part of this release</small>
        </div>
      </details>
    </header>
  )
}
