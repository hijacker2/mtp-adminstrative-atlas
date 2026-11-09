import { Archive, CalendarDays } from 'lucide-react'
import { notEstablished, type AtlasOverview } from '../types/research'

interface CollectionOverviewProps {
  overview: AtlasOverview
  profileExtractedTotal: number | null
}

function formattedDate(value: string | null): string {
  if (!value) return notEstablished
  const parts = value.split('-')
  if (parts.length !== 3) return value
  const date = new Date(Date.UTC(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])))
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export default function CollectionOverview({ overview, profileExtractedTotal }: CollectionOverviewProps) {
  const statistics = [
    { value: overview.state_cases, label: 'State case profiles', detail: 'Cases in the overview' },
    { value: overview.registered_sources, label: 'Registered source records', detail: 'Not unique documents' },
    { value: overview.extracted_content_records, label: 'Extracted content records', detail: 'Research collection records' },
    { value: overview.unverified_evidence_candidates, label: 'Unverified evidence candidates', detail: 'Not verified findings' },
    { value: overview.verified_evidence_entries, label: 'Verified evidence entries', detail: 'Verified records only' },
  ]
  const profileTotalsDiffer = overview.extracted_content_records !== null
    && profileExtractedTotal !== null
    && profileExtractedTotal !== overview.extracted_content_records

  return (
    <section className="collection-section" aria-labelledby="collection-title">
      <div className="section-wrap">
        <div className="collection-heading">
          <div>
            <p className="eyebrow"><Archive size={13} aria-hidden="true" /> Research collection</p>
            <h2 id="collection-title">A working <em>record</em></h2>
          </div>
          <p className="snapshot"><CalendarDays size={14} aria-hidden="true" /> Snapshot · {formattedDate(overview.snapshot_date)}</p>
        </div>
        <div className="statistics-grid">
          {statistics.map((statistic, index) => (
            <div className="statistic" key={statistic.label}>
              <span className="statistic-index">0{index + 1}</span>
              <strong>{statistic.value ?? notEstablished}</strong>
              <span className="statistic-label">{statistic.label}</span>
              <small>{statistic.detail}</small>
            </div>
          ))}
        </div>
        <p className="collection-caveat">
          {overview.methodological_note ?? notEstablished}
        </p>
        {profileTotalsDiffer && (
          <p className="data-reconciliation-note" role="note">
            Data reconciliation note: the state-profile extracted-record values sum to {profileExtractedTotal},
            while the overview reports {overview.extracted_content_records}. The difference has not been reconciled.
          </p>
        )}
      </div>
    </section>
  )
}
