import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { ResearchOutletContext } from '../App'
import CollectionOverview from '../components/CollectionOverview'
import Hero from '../components/Hero'
import ResearchApproach from '../components/ResearchApproach'
import SourceCoverage from '../components/SourceCoverage'
import StateExplorer from '../components/StateExplorer'

export default function AdministrativeLandscape() {
  const { data, sourceCounts, profileExtractedTotal } = useOutletContext<ResearchOutletContext>()
  const [selectedStateId, setSelectedStateId] = useState(data.profiles[0]?.state_code ?? '')

  return (
    <main id="main-content">
      <Hero states={data.profiles} />
      <StateExplorer
        states={data.profiles}
        selectedStateId={selectedStateId}
        onSelectState={setSelectedStateId}
      />
      <CollectionOverview overview={data.overview} profileExtractedTotal={profileExtractedTotal} />
      <SourceCoverage profiles={data.profiles} sources={data.sources} sourceCounts={sourceCounts} />
      <ResearchApproach overview={data.overview} />
    </main>
  )
}
