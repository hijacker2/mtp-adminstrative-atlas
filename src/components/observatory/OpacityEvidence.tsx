import { AlertCircle, ExternalLink } from 'lucide-react'
import { notEstablished, type SourceRecord } from '../../types/research'

interface OpacityEvidenceProps {
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

export default function OpacityEvidence({ sources }: OpacityEvidenceProps) {
  const historicalRecords = sources.filter((source) =>
    `${source.title ?? ''} ${source.evidence_role ?? ''}`.toLowerCase().includes('historical'),
  )
  const recordsWithoutSourceDate = sources.filter((source) => !source.source_date)

  return (
    <div className="opacity-evidence">
      <div className="opacity-status" role="note">
        <AlertCircle size={18} aria-hidden="true" />
        <div>
          <strong>Evidence-backed opacity observations · {notEstablished}</strong>
          <p>The published research JSON contains source metadata, not extracted passages or assessments of instruction clarity. Missing, ambiguous, conflicting, or unclear instructions cannot be established from these fields alone.</p>
        </div>
      </div>
      <div className="opacity-metadata-grid">
        <article>
          <span className="opacity-metadata-number">{recordsWithoutSourceDate.length} / {sources.length}</span>
          <h3>Source dates not recorded</h3>
          <p>Source-register metadata gap; this does not establish that the sources or their instructions are outdated.</p>
        </article>
        <article>
          <span className="opacity-metadata-number">{historicalRecords.length}</span>
          <h3>Records labeled historical</h3>
          <p>The register’s evidence-role field identifies the following Rajasthan records as historical. Their source-date fields remain “Not yet established.”</p>
        </article>
      </div>
      {historicalRecords.length > 0 && (
        <ul className="opacity-historical-list">
          {historicalRecords.map((source) => {
            const url = externalHref(source.url)
            return (
              <li key={source.source_id}>
                <span>{url
                  ? <a href={url} target="_blank" rel="noopener noreferrer">{source.title ?? notEstablished}<ExternalLink size={13} aria-label="Opens in a new tab" /></a>
                  : source.title ?? notEstablished}
                </span>
                <small>{source.evidence_role ?? notEstablished} · Source date: {source.source_date ?? notEstablished}</small>
              </li>
            )
          })}
        </ul>
      )}
      <p className="opacity-caveat">These metadata observations are not findings of opacity, deliberate concealment, or applicant experience.</p>
    </div>
  )
}
