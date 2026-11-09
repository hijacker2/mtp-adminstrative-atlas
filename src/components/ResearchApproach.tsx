import { BookOpenText } from 'lucide-react'
import { notEstablished, type AtlasOverview } from '../types/research'

export default function ResearchApproach({ overview }: { overview: AtlasOverview }) {
  return (
    <section className="method-section" id="method" aria-labelledby="method-title">
      <div className="section-wrap method-layout">
        <div className="method-title-block">
          <p className="eyebrow"><BookOpenText size={13} aria-hidden="true" /> Research approach</p>
          <h2 id="method-title">Following the <em>record</em></h2>
        </div>
        <div className="method-copy">
          <p className="method-lead">
            The Atlas studies documents, administrative institutions, digital infrastructures
            and the production of income certificates.
          </p>
          <p>
            It brings together a developing collection of source records and extracted content
            across four state cases. Counts on this page describe that research collection only;
            they do not measure service performance or state outcomes.
          </p>
          <p className="research-status">Research status · {overview.research_status ?? notEstablished}</p>
          <div className="historical-note">
            <span className="note-marker" aria-hidden="true" />
            <div>
              <strong>Historical sources & unresolved evidence</strong>
              <p>{overview.methodological_note ?? notEstablished} Some materials are historical. Where information is not established it should be read as unresolved—not assumed.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
