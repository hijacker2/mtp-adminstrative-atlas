import { ExternalLink, Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { notEstablished, type SourceRecord, type StateProfile } from '../../types/research'

interface ComparativeSourceExplorerProps {
  profiles: StateProfile[]
  sources: SourceRecord[]
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

function sourceStatus(value: string | null) {
  if (!value) return { text: notEstablished, downloaded: false }
  const downloaded = value.startsWith('downloaded_')
  return {
    text: downloaded ? `Downloaded · ${value.slice('downloaded_'.length).toUpperCase()}` : 'Pending',
    downloaded,
  }
}

export default function ComparativeSourceExplorer({ profiles, sources }: ComparativeSourceExplorerProps) {
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('all')
  const [formatFilter, setFormatFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [officialStatusFilter, setOfficialStatusFilter] = useState('all')

  const formats = useMemo(() => Array.from(new Set(sources.map((source) => source.source_format).filter((value): value is string => Boolean(value)))).sort(), [sources])
  const statuses = useMemo(() => Array.from(new Set(sources.map((source) => source.collection_status).filter((value): value is string => Boolean(value)))).sort(), [sources])
  const stages = useMemo(() => Array.from(new Set(sources.map((source) => source.process_stage).filter((value): value is string => Boolean(value)))).sort(), [sources])
  const roles = useMemo(() => Array.from(new Set(sources.map((source) => source.evidence_role).filter((value): value is string => Boolean(value)))).sort(), [sources])
  const officialStatuses = useMemo(() => Array.from(new Set(sources.map((source) => source.official_status).filter((value): value is string => Boolean(value)))).sort(), [sources])
  const filteredSources = useMemo(() => sources.filter((source) =>
    (stateFilter === 'all' || source.state_code === stateFilter)
    && (formatFilter === 'all' || source.source_format === formatFilter)
    && (statusFilter === 'all' || source.collection_status === statusFilter)
    && (stageFilter === 'all' || source.process_stage === stageFilter)
    && (roleFilter === 'all' || source.evidence_role === roleFilter)
    && (officialStatusFilter === 'all' || source.official_status === officialStatusFilter)
    && (!query.trim() || [
      source.title,
      source.issuing_authority,
      source.process_stage,
      source.evidence_role,
      source.official_status,
      source.url,
    ].some((value) => value?.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))),
  ), [formatFilter, officialStatusFilter, query, roleFilter, sources, stageFilter, stateFilter, statusFilter])

  return (
    <section className="observatory-section observatory-source-section" id="evidence-explorer" aria-labelledby="source-explorer-title">
      <div className="observatory-section-heading">
        <div>
          <p className="eyebrow"><Filter size={15} aria-hidden="true" /> Section F · Comparative evidence explorer</p>
          <h2 id="source-explorer-title">Browse the <em>register</em></h2>
        </div>
        <p>Filter registered source records by their metadata. Registration and download status do not indicate that a source is current or that its claims are verified.</p>
      </div>

      <div className="observatory-filters" aria-label="Filter the source register">
        <label className="source-search-label"><span>Search source records</span>
          <span className="source-search-control"><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Title, authority, stage…" /></span>
        </label>
        <label>State
          <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
            <option value="all">All states</option>
            {profiles.map((profile) => <option key={profile.state_code} value={profile.state_code}>{profile.state_name}</option>)}
          </select>
        </label>
        <label>Source format
          <select value={formatFilter} onChange={(event) => setFormatFilter(event.target.value)}>
            <option value="all">All formats</option>
            {formats.map((format) => <option key={format} value={format}>{format}</option>)}
          </select>
        </label>
        <label>Collection status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">All statuses</option>
            {statuses.map((status) => <option key={status} value={status}>{sourceStatus(status).text}</option>)}
          </select>
        </label>
        <label>Process stage
          <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
            <option value="all">All process stages</option>
            {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
          </select>
        </label>
        <label>Evidence role
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="all">All evidence roles</option>
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </label>
        <label>Official status
          <select value={officialStatusFilter} onChange={(event) => setOfficialStatusFilter(event.target.value)}>
            <option value="all">All official statuses</option>
            {officialStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </label>
      </div>

      <p className="observatory-results-count" aria-live="polite">
        Showing {filteredSources.length} of {sources.length} registered source records
      </p>
      <div className="observatory-source-list">
        {filteredSources.map((source) => {
          const profile = profiles.find((item) => item.state_code === source.state_code)
          const link = externalHref(source.url)
          const status = sourceStatus(source.collection_status)
          return (
            <article className="observatory-source" key={source.source_id}>
              <div className="observatory-source-meta">
                <span>Source {source.source_id}</span>
                <span>{profile?.state_name ?? notEstablished}</span>
                <span className={status.downloaded ? 'source-status is-downloaded' : 'source-status is-pending'}>
                  {status.text}
                </span>
              </div>
              <h3>
                {link
                  ? <a href={link} target="_blank" rel="noopener noreferrer">{source.title ?? notEstablished}<ExternalLink size={14} aria-label="Opens in a new tab" /></a>
                  : source.title ?? notEstablished}
              </h3>
              <dl className="observatory-source-details">
                <div><dt>Issuing authority</dt><dd>{source.issuing_authority ?? notEstablished}</dd></div>
                <div><dt>Source date</dt><dd>{source.source_date ?? notEstablished}</dd></div>
                <div><dt>Source format</dt><dd>{source.source_format ?? notEstablished}</dd></div>
                <div><dt>Process stage</dt><dd>{source.process_stage ?? notEstablished}</dd></div>
                <div><dt>Evidence role</dt><dd>{source.evidence_role ?? notEstablished}</dd></div>
                <div><dt>Official status</dt><dd>{source.official_status ?? notEstablished}</dd></div>
                <div><dt>Collection status</dt><dd>{source.collection_status ? status.text : notEstablished}</dd></div>
                <div className="observatory-source-url"><dt>Source URL</dt><dd>
                  {link
                    ? <a href={link} target="_blank" rel="noopener noreferrer">{link}<ExternalLink size={13} aria-label="Opens in a new tab" /></a>
                    : notEstablished}
                </dd></div>
              </dl>
              <p className="observatory-source-caution">
                {status.downloaded
                  ? 'Downloaded source; individual claims have not thereby been verified.'
                  : 'Pending source; availability and current content are not established.'}
              </p>
            </article>
          )
        })}
        {filteredSources.length === 0 && <p className="observatory-no-results">No source records match the selected filters.</p>}
      </div>
    </section>
  )
}
