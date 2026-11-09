import { useEffect, useMemo, useState } from 'react'
import CollectionOverview from './components/CollectionOverview'
import Hero from './components/Hero'
import ResearchApproach from './components/ResearchApproach'
import SiteFooter from './components/SiteFooter'
import SiteHeader from './components/SiteHeader'
import SourceCoverage from './components/SourceCoverage'
import StateExplorer from './components/StateExplorer'
import { loadResearchData } from './data/loadResearchData'
import type { ResearchData } from './types/research'

export default function App() {
  const [researchData, setResearchData] = useState<ResearchData | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const [selectedStateId, setSelectedStateId] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    setResearchData(null)
    setLoadError(null)
    loadResearchData(controller.signal)
      .then((data) => {
        setResearchData(data)
        setSelectedStateId((current) => data.profiles.some((profile) => profile.state_code === current)
          ? current
          : data.profiles[0]?.state_code ?? '')
      })
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

  const extractedProfileTotal = researchData?.profiles.every((profile) => profile.extracted_records !== null)
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

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div id="top" />
      <SiteHeader />
      <main id="main-content">
        <Hero states={researchData.profiles} />
        <StateExplorer
          states={researchData.profiles}
          selectedStateId={selectedStateId}
          onSelectState={setSelectedStateId}
        />
        <CollectionOverview
          overview={researchData.overview}
          profileExtractedTotal={extractedProfileTotal}
        />
        <SourceCoverage
          profiles={researchData.profiles}
          sources={researchData.sources}
          sourceCounts={sourceCounts}
        />
        <ResearchApproach overview={researchData.overview} />
      </main>
      <SiteFooter snapshotDate={researchData.overview.snapshot_date} />
    </>
  )
}
