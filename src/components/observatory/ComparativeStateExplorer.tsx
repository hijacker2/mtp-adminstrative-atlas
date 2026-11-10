import { ExternalLink, MapPin } from 'lucide-react'
import { useState } from 'react'
import { notEstablished, type SourceRecord, type StateProfile } from '../../types/research'

interface ComparativeStateExplorerProps {
  profiles: StateProfile[]
  sources: SourceRecord[]
}

function display(value: number | string | null) {
  return value ?? notEstablished
}

function externalHref(value: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

function caseLabel(profile: StateProfile) {
  const role = profile.case_role?.toLowerCase() ?? ''
  if (role.includes('focal')) return 'Focal case'
  if (role.includes('contrasting')) return 'Contrasting case'
  if (role.includes('comparative')) return 'Comparative case'
  return profile.case_role ?? notEstablished
}

export default function ComparativeStateExplorer({ profiles, sources }: ComparativeStateExplorerProps) {
  const [selectedCode, setSelectedCode] = useState(profiles[0]?.state_code ?? '')
  const selectedProfile = profiles.find((profile) => profile.state_code === selectedCode) ?? profiles[0]
  if (!selectedProfile) return null

  const stateSources = sources.filter((source) => source.state_code === selectedProfile.state_code)

  return (
    <section className="observatory-section comparative-state-section" id="state-comparison" aria-labelledby="comparative-states-title">
      <div className="section-wrap">
        <div className="observatory-section-heading">
          <div>
            <p className="eyebrow"><MapPin size={15} aria-hidden="true" /> Section E · Comparative state explorer</p>
            <h2 id="comparative-states-title">Cases in <em>comparison</em></h2>
          </div>
          <p>Source and extraction counts describe collection coverage, not burden or state performance. Case roles follow the supplied state profiles.</p>
        </div>
        <div className="comparative-state-tabs" role="group" aria-label="Select a state case">
          {profiles.map((profile) => (
            <button
              type="button"
              key={profile.state_code}
              className={`comparative-state-tab${profile.state_code === selectedProfile.state_code ? ' is-selected' : ''}`}
              aria-pressed={profile.state_code === selectedProfile.state_code}
              onClick={() => setSelectedCode(profile.state_code)}
            >
              <span>{profile.state_name}</span>
              <small>{caseLabel(profile)}</small>
            </button>
          ))}
        </div>
        <article className="comparative-state-detail" aria-live="polite">
          <div className="comparative-state-heading">
            <div>
              <span className="case-role-label">{caseLabel(selectedProfile)}</span>
              <h3>{selectedProfile.state_name}</h3>
              <p className="case-role-source">{selectedProfile.case_role ?? notEstablished}</p>
            </div>
            <span className="comparison-status">{display(selectedProfile.comparison_status)}</span>
          </div>
          <dl className="comparative-coverage">
            <div><dt>Registered sources</dt><dd>{display(selectedProfile.registered_sources)}</dd><small>{stateSources.length} source-register entries</small></div>
            <div><dt>Extracted records</dt><dd>{display(selectedProfile.extracted_records)}</dd><small>State-profile count</small></div>
            <div><dt>Verified evidence entries</dt><dd>{display(selectedProfile.verified_evidence_entries)}</dd><small>Not a burden measure</small></div>
          </dl>
          <div className="comparative-source-records">
            <h4>Registered sources for {selectedProfile.state_name}</h4>
            <ul>
              {stateSources.map((source) => {
                const url = externalHref(source.url)
                return (
                  <li key={source.source_id}>
                    <span>{source.title ?? notEstablished}</span>
                    <small>{source.process_stage ?? notEstablished} · {source.collection_status ?? notEstablished}</small>
                    {url && <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${source.title ?? 'source'} in a new tab`}><ExternalLink size={14} aria-hidden="true" /></a>}
                  </li>
                )
              })}
              {stateSources.length === 0 && <li>{notEstablished}</li>}
            </ul>
          </div>
        </article>
        <p className="comparative-state-caveat">More extracted records indicate more extraction in the current research corpus; they do not imply greater administrative burden.</p>
      </div>
    </section>
  )
}
