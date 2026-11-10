import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import { ThemeProvider } from './components/ThemeProvider'
import { loadResearchData } from './data/loadResearchData'
import AdministrativeLandscape from './pages/AdministrativeLandscape'
import BurdenObservatory from './pages/BurdenObservatory'
import type { ResearchData } from './types/research'

export interface ResearchOutletContext {
  data: ResearchData
  sourceCounts: Map<string, number>
  profileExtractedTotal: number | null
}

function ResearchLayout() {
  const [researchData, setResearchData] = useState<ResearchData | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setResearchData(null)
    setLoadError(null)
    loadResearchData(controller.signal)
      .then(setResearchData)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setLoadError(error instanceof Error ? error.message : 'Research data could not be loaded.')
      })

    return () => controller.abort()
  }, [retryKey])

  const sourceCounts = useMemo(() => {
    if (!researchData) return new Map<string, number>()
    return new Map(researchData.profiles.map((profile) => [
      profile.state_code,
      researchData.sources.filter((source) => source.state_code === profile.state_code).length,
    ]))
  }, [researchData])

  const profileExtractedTotal = researchData?.profiles.every((profile) => profile.extracted_records !== null)
    ? researchData.profiles.reduce((total, profile) => total + (profile.extracted_records ?? 0), 0)
    : null

  if (loadError) {
    return (
      <>
        <SiteHeader />
        <main className="data-state-page" id="main-content">
          <div className="data-state-card" role="alert">
            <p className="eyebrow">Research collection</p>
            <h1>Research data could not be loaded</h1>
            <p>{loadError}</p>
            <button type="button" className="retry-button" onClick={() => setRetryKey((key) => key + 1)}>Retry loading data</button>
          </div>
        </main>
        <SiteFooter snapshotDate={null} />
      </>
    )
  }

  if (!researchData) {
    return (
      <>
        <SiteHeader />
        <main className="data-state-page" id="main-content">
          <p className="data-loading" role="status">Loading the research collection…</p>
        </main>
      </>
    )
  }

  const context: ResearchOutletContext = {
    data: researchData,
    sourceCounts,
    profileExtractedTotal,
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div id="top" />
      <SiteHeader />
      <Outlet context={context} />
      <SiteFooter snapshotDate={researchData.overview.snapshot_date} />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<ResearchLayout />}>
            <Route index element={<AdministrativeLandscape />} />
            <Route path="observatory" element={<BurdenObservatory />} />
            <Route path="*" element={<AdministrativeLandscape />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
