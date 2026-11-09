import { ExternalLink, FileText } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { notEstablished, stateAppearance, type SourceRecord, type StateProfile } from '../types/research'

interface SourceCoverageProps {
  profiles: StateProfile[]
  sources: SourceRecord[]
  sourceCounts: Map<string, number>
}

function validExternalUrl(value: string | null): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

function valueOrPlaceholder(value: string | number | null): string | number {
  return value ?? notEstablished
}

function SourceEntry({ source, stateName, accent }: { source: SourceRecord; stateName: string; accent: string }) {
  const href = validExternalUrl(source.url)
  return (
    <article className="source-entry" style={{ '--state-accent': accent } as CSSProperties}>
      <div className="source-entry-heading">
        <span className="source-id">Source {source.source_id}</span>
        <span className="source-state">{stateName}</span>
      </div>
      <h3>{href
        ? <a href={href} target="_blank" rel="noopener noreferrer">
            {source.title ?? notEstablished}<ExternalLink size={13} aria-label="Opens in a new tab" />
          </a>
        : source.title ?? notEstablished}
      </h3>
      <p className="source-authority">{valueOrPlaceholder(source.issuing_authority)}</p>
      <div className="source-metadata">
        <div><span>Format</span><strong>{valueOrPlaceholder(source.source_format)}</strong></div>
        <div><span>Source date</span><strong>{valueOrPlaceholder(source.source_date)}</strong></div>
        <div><span>Collection status</span><strong>{valueOrPlaceholder(source.collection_status)}</strong></div>
        <div><span>Evidence role</span><strong>{valueOrPlaceholder(source.evidence_role)}</strong></div>
      </div>
      <p className="source-process"><span>Process stage</span>{valueOrPlaceholder(source.process_stage)}</p>
      <p className="source-integrity">{valueOrPlaceholder(source.official_status)} · Registration does not imply current status or verified evidence.</p>
    </article>
  )
}

export default function SourceCoverage({ profiles, sources, sourceCounts }: SourceCoverageProps) {
  const [filterCode, setFilterCode] = useState('all')
  const filteredSources = useMemo(
    () => filterCode === 'all' ? sources : sources.filter((source) => source.state_code === filterCode),
    [filterCode, sources],
  )

  return (
    <section className="sources-section section-wrap" id="sources" aria-labelledby="sources-title">
      <div className="sources-heading">
        <div>
          <p className="eyebrow"><FileText size={13} aria-hidden="true" /> Source register</p>
          <h2 id="sources-title">Coverage in <em>progress</em></h2>
        </div>
        <p className="sources-total"><strong>{sources.length}</strong><span>registered source records</span></p>
      </div>
      <div className="coverage-layout">
        <div className="coverage-list">
          {profiles.map((profile, index) => {
            const count = sourceCounts.get(profile.state_code) ?? 0
            const accent = stateAppearance[profile.state_code]?.accent ?? '#77766f'
            const profileCountDiffers = profile.registered_sources !== null && profile.registered_sources !== count
            return (
              <div className="coverage-row" key={profile.state_code} style={{ '--state-accent': accent } as CSSProperties}>
                <span className="coverage-index">0{index + 1}</span>
                <span className="coverage-name">{profile.state_name}</span>
                <span className="coverage-ticks" aria-label={`${count} registered source records`}>
                  {Array.from({ length: count }, (_, tick) => <i key={tick} />)}
                </span>
                <span className="coverage-count">{count}</span>
                {profileCountDiffers && <span className="coverage-mismatch">Profile reports {profile.registered_sources}</span>}
              </div>
            )
          })}
          <p className="coverage-legend"><span /> One mark represents one registered source record</p>
        </div>
        <aside className="coverage-note">
          <span className="note-rule" />
          <h3>What this count means</h3>
          <p>These entries come from the source register. Registered sources are not counts of unique documents, extracted records, or verified claims.</p>
          <p>Some source dates and checking details are not yet established. A registered URL does not establish that its content is current or independently verified.</p>
          <label className="source-filter-label" htmlFor="source-state-filter">Filter sources by state</label>
          <select
            id="source-state-filter"
            className="source-filter"
            value={filterCode}
            onChange={(event) => setFilterCode(event.target.value)}
          >
            <option value="all">All states ({sources.length})</option>
            {profiles.map((profile) => (
              <option key={profile.state_code} value={profile.state_code}>
                {profile.state_name} ({sourceCounts.get(profile.state_code) ?? 0})
              </option>
            ))}
          </select>
        </aside>
      </div>
      <div className="source-results" aria-live="polite">
        <p className="source-results-count">{filteredSources.length} registered {filteredSources.length === 1 ? 'record' : 'records'}</p>
        <div className="source-entry-list">
          {filteredSources.map((source) => {
            const profile = profiles.find((item) => item.state_code === source.state_code)
            return (
              <SourceEntry
                key={source.source_id}
                source={source}
                stateName={profile?.state_name ?? notEstablished}
                accent={stateAppearance[source.state_code]?.accent ?? '#77766f'}
              />
            )
          })}
        </div>
      </div>
      <p className="source-evidence-note">
        Extracted content and unverified evidence candidates are separate collection categories. Candidate passages are not published here and are not findings.
      </p>
    </section>
  )
}
