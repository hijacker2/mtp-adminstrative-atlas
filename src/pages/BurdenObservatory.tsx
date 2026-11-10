import { useEffect, useMemo } from 'react'
import { ArrowDown, BookOpenText, FileQuestion, Layers3, Search, ShieldAlert } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import ComparativeSourceExplorer from '../components/observatory/ComparativeSourceExplorer'
import ComparativeStateExplorer from '../components/observatory/ComparativeStateExplorer'
import OpacityEvidence from '../components/observatory/OpacityEvidence'
import ResearchQuestionExplorer from '../components/observatory/ResearchQuestionExplorer'
import type { ResearchOutletContext } from '../App'
import { notEstablished } from '../types/research'

const learningQuestions = [
  'Can applicants identify the correct issuing authority?',
  'Are eligibility requirements clearly explained?',
  'Are different certificate variants distinguished?',
  'Are acceptable supporting documents clearly listed?',
  'Can applicants understand the next procedural step?',
]

const complianceTopics = [
  'Documentary requirements',
  'Declarations and affidavits',
  'Application channels',
  'Fees and service charges',
  'Physical verification',
  'Repeat submissions',
  'Administrative visits',
]

const psychologicalDimensions = [
  { title: 'Stigma', description: 'Potential social exposure associated with seeking or documenting public support.' },
  { title: 'Stress and anxiety', description: 'Emotional effects of navigating administrative encounters.' },
  { title: 'Loss of autonomy', description: 'Whether people feel able to understand and influence the process.' },
  { title: 'Other emotional effects', description: 'Consequences that can only be described through people’s own accounts.' },
]

function display(value: number | null) {
  return value === null ? notEstablished : value.toLocaleString('en-IN')
}

function formatSnapshotDate(value: string | null) {
  if (!value) return notEstablished
  const dateParts = value.split('-')
  if (dateParts.length !== 3) return value
  const date = new Date(Date.UTC(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2])))
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export default function BurdenObservatory() {
  const { data } = useOutletContext<ResearchOutletContext>()
  const { overview, profiles, sources } = data

  useEffect(() => {
    document.title = 'Administrative Burden Observatory — MTP Administrative Atlas'
    return () => { document.title = 'Administrative Landscape — MTP Administrative Atlas' }
  }, [])

  const processStages = useMemo(
    () => Array.from(new Set(sources.map((source) => source.process_stage).filter((stage): stage is string => Boolean(stage)))).sort(),
    [sources],
  )

  const profileExtractedTotal = profiles.every((profile) => profile.extracted_records !== null)
    ? profiles.reduce((sum, profile) => sum + (profile.extracted_records ?? 0), 0)
    : null
  const extractionMismatch = overview.extracted_content_records !== null
    && profileExtractedTotal !== null
    && profileExtractedTotal !== overview.extracted_content_records

  const statistics = [
    { label: 'Registered sources', value: overview.registered_sources, note: 'Source-register entries' },
    { label: 'Extracted content records', value: overview.extracted_content_records, note: 'Not verified evidence' },
    { label: 'Unverified evidence candidates', value: overview.unverified_evidence_candidates, note: 'Not findings' },
    { label: 'Verified evidence entries', value: overview.verified_evidence_entries, note: 'Verification status' },
    { label: 'State cases', value: overview.state_cases, note: 'Comparative cases' },
  ]

  return (
    <main id="main-content" className="observatory-page">
      <header className="observatory-hero section-wrap">
        <p className="eyebrow"><span className="eyebrow-rule" /> MTP Administrative Atlas · Research observatory</p>
        <h1>Administrative Burden <em>Observatory</em></h1>
        <p className="observatory-subtitle">Visualising the procedural demands, information requirements and documentary complexity encountered in accessing public services.</p>
        <p className="observatory-intro">
          The observatory examines administrative burden through documentary and procedural evidence. It distinguishes between what official documents require, what the available evidence reveals, and what remains unknown about citizens’ actual experiences.
        </p>
        <a className="observatory-scroll-link" href="#evidence-landscape">Explore the evidence landscape <ArrowDown size={16} aria-hidden="true" /></a>
        <div className="observatory-snapshot">Collection snapshot · {formatSnapshotDate(overview.snapshot_date)} · {overview.research_status ?? notEstablished}</div>
      </header>

      <section className="observatory-section evidence-section" id="evidence-landscape" aria-labelledby="evidence-landscape-title">
        <div className="section-wrap">
          <div className="observatory-section-heading">
            <div>
              <p className="eyebrow"><Search size={15} aria-hidden="true" /> Section A · Evidence landscape</p>
              <h2 id="evidence-landscape-title">The research <em>record</em></h2>
            </div>
            <p>Collection statistics describe the research corpus. They are not burden scores, state rankings, or measures of administrative performance.</p>
          </div>
          <div className="observatory-statistics">
            {statistics.map((statistic, index) => (
              <article className="observatory-stat" key={statistic.label}>
                <span className="observatory-stat-index">0{index + 1}</span>
                <strong>{display(statistic.value)}</strong>
                <h3>{statistic.label}</h3>
                <p>{statistic.note}</p>
              </article>
            ))}
          </div>
          <div className="evidence-key" aria-label="Research record categories">
            <span><i className="status-registered" /> Registered source</span>
            <span><i className="status-extracted" /> Extracted content</span>
            <span><i className="status-candidate" /> Unverified candidate · not a finding</span>
            <span><i className="status-verified" /> Verified evidence</span>
          </div>
          {extractionMismatch && (
            <p className="observatory-reconciliation" role="note">
              <ShieldAlert size={18} aria-hidden="true" />
              State-level extraction totals are under reconciliation. The four state profiles sum to {display(profileExtractedTotal)}
              {' '}while the overview reports {display(overview.extracted_content_records)}. Neither value has been altered.
            </p>
          )}
          <div className="state-comparison-wrap">
            <table className="state-comparison">
              <caption>State-wise research collection records — not state performance</caption>
              <thead>
                <tr>
                  <th scope="col">State case</th>
                  <th scope="col">Registered sources</th>
                  <th scope="col">Extracted records</th>
                  <th scope="col">Verified evidence entries</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.state_code}>
                    <th scope="row">{profile.state_name}</th>
                    <td>{display(profile.registered_sources)}</td>
                    <td>{display(profile.extracted_records)}</td>
                    <td>{display(profile.verified_evidence_entries)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="observatory-section learning-section" aria-labelledby="learning-title">
        <div className="section-wrap burden-dimension-layout">
          <div className="burden-dimension-heading">
            <p className="eyebrow"><BookOpenText size={15} aria-hidden="true" /> Section B · Learning costs</p>
            <h2 id="learning-title">Finding a way <em>through</em></h2>
            <p>Learning costs concern the effort involved in finding and understanding relevant public services, rules, and requirements.</p>
            <span className="research-progress-label">Documentary assessment in progress</span>
          </div>
          <div className="learning-questions">
            <h3>Research questions—not established findings</h3>
            <ol>
              {learningQuestions.map((question) => <li key={question}>{question}</li>)}
            </ol>
            <p className="learning-data-limit">The available public data supplies source metadata and process-stage labels, but no applicant-facing passages establishing how these instructions are presented.</p>
          </div>
        </div>
      </section>

      <section className="observatory-section compliance-section" aria-labelledby="compliance-title">
        <div className="section-wrap">
          <div className="observatory-section-heading">
            <div>
              <p className="eyebrow"><Layers3 size={15} aria-hidden="true" /> Section C · Compliance costs</p>
              <h2 id="compliance-title">Demands under <em>examination</em></h2>
            </div>
            <p>These are areas the research is examining, not confirmed burdens or requirements in every state.</p>
          </div>
          <div className="compliance-grid">
            <div className="compliance-topics">
              {complianceTopics.map((topic, index) => (
                <div className="compliance-topic" key={topic}>
                  <span>0{index + 1}</span><strong>{topic}</strong><small>Measurement · {notEstablished}</small>
                </div>
              ))}
            </div>
            <aside className="process-stage-note">
              <h3>Process stages in the source register</h3>
              <p>Metadata indicates topics represented in registered records; it does not establish applicant effort or an end-to-end procedure.</p>
              <ul>{processStages.map((stage) => <li key={stage}>{stage}</li>)}</ul>
              <p className="process-stage-footnote">No document counts, visit counts, applicant time, or costs are inferred here.</p>
            </aside>
          </div>
        </div>
      </section>

      <section className="observatory-section psychological-section" aria-labelledby="psychological-title">
        <div className="section-wrap">
          <div className="observatory-section-heading">
            <div>
              <p className="eyebrow"><FileQuestion size={15} aria-hidden="true" /> Section D · Psychological costs</p>
              <h2 id="psychological-title">Experience requires <em>listening</em></h2>
            </div>
            <p>Government documents alone cannot establish how applicants feel or experience administrative processes.</p>
          </div>
          <div className="psychological-grid">
            {psychologicalDimensions.map((dimension, index) => (
              <article key={dimension.title}>
                <span>0{index + 1}</span>
                <h3>{dimension.title}</h3>
                <p>{dimension.description}</p>
                <small>Citizen-level evidence · {notEstablished}</small>
              </article>
            ))}
          </div>
          <p className="fieldwork-note">Psychological costs can include stigma, stress, loss of autonomy and other emotional consequences. These require citizen-level fieldwork, such as interviews or surveys; the current documentary dataset does not establish citizens’ psychological experiences.</p>
        </div>
      </section>

      <section className="observatory-section unknowns-section" aria-labelledby="unknowns-title">
        <div className="section-wrap">
          <div className="observatory-section-heading">
            <div>
              <p className="eyebrow"><FileQuestion size={15} aria-hidden="true" /> Section D · Administrative opacity</p>
              <h2 id="unknowns-title">What remains <em>unknown</em></h2>
            </div>
            <p>Only source-backed observations belong here. The current public files do not establish unclear instructions, conflicting requirements, or applicant-facing opacity.</p>
          </div>
          <OpacityEvidence sources={sources} />
          <h3 className="opacity-questions-title">Open research questions</h3>
          <ResearchQuestionExplorer />
        </div>
      </section>

      <ComparativeStateExplorer profiles={profiles} sources={sources} />
      <ComparativeSourceExplorer profiles={profiles} sources={sources} />

      <section className="observatory-section framework-section" aria-labelledby="framework-title">
        <div className="section-wrap">
          <div className="observatory-section-heading">
            <div>
              <p className="eyebrow"><BookOpenText size={15} aria-hidden="true" /> Section G · Methodological framework</p>
              <h2 id="framework-title">Three layers of <em>inquiry</em></h2>
            </div>
            <p>Following the administrative burden framework of Herd and Moynihan, this observatory organizes research questions; it is not a validated burden measurement instrument.</p>
          </div>
          <div className="framework-layers">
            <article><span>Layer 01</span><h3>Documentary and procedural burden signals</h3><p>What published documents and source-register metadata can indicate. These signals do not measure citizens’ experience.</p></article>
            <article><span>Layer 02</span><h3>Experienced administrative burden</h3><p>What people experience when navigating services. This requires citizen-level fieldwork, not inference from documents alone.</p></article>
            <article><span>Layer 03</span><h3>Researcher-identified opacity and unresolved questions</h3><p>Issues requiring further inquiry, clearly marked as unknowns rather than claims about administrative intent.</p></article>
          </div>
          <h3 className="framework-dimensions-title">Administrative burden dimensions</h3>
          <div className="framework-dimensions">
            <span><strong>Learning costs</strong><small>Finding and understanding rules and services.</small></span>
            <span><strong>Compliance costs</strong><small>Time and effort involved in meeting administrative requirements.</small></span>
            <span><strong>Psychological costs</strong><small>Stigma, stress, and loss of autonomy in administrative encounters.</small></span>
          </div>
          <p className="framework-caveat">
            Documentary requirements are not equivalent to experienced administrative burden. Learning and compliance costs can be investigated in documents with caution; psychological costs require citizen-level research. Unverified candidates are not findings. No state-level burden ranking or composite burden score is justified.
            {' '}{overview.methodological_note ?? notEstablished} This exploratory Observatory is not a validated burden measurement instrument.
          </p>
        </div>
      </section>
    </main>
  )
}
