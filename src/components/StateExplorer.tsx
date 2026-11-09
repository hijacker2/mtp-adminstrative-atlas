import { ArrowUpRight, Landmark } from 'lucide-react'
import type { CSSProperties } from 'react'
import { notEstablished, stateAppearance, type StateProfile } from '../types/research'
import IndiaStateMap from './IndiaStateMap'

interface StateExplorerProps {
  states: StateProfile[]
  selectedStateId: string
  onSelectState: (stateId: string) => void
}

function display(value: string | number | null): string | number {
  return value ?? notEstablished
}

export default function StateExplorer({ states, selectedStateId, onSelectState }: StateExplorerProps) {
  const selectedState = states.find((state) => state.state_code === selectedStateId) ?? states[0]
  if (!selectedState) return null

  const appearance = stateAppearance[selectedState.state_code]
  const style = {
    '--state-accent': appearance?.accent ?? '#77766f',
    '--state-soft': appearance?.accentSoft ?? '#ece8de',
  } as CSSProperties

  return (
    <section className="state-section section-wrap" id="states" aria-labelledby="states-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">01 — Administrative landscape</p>
          <h2 id="states-title">Four cases, <em>in context</em></h2>
        </div>
        <p className="section-intro">
          Select a state to view its profile from the research data. These cases are not ranked,
          and source coverage is uneven and still developing.
        </p>
      </div>
      <div className="state-explorer-grid">
        <div className="state-list-column">
          <IndiaStateMap states={states} selectedStateId={selectedStateId} onSelectState={onSelectState} />
          <div className="state-index-list" aria-label="State case source records">
            {states.map((state, index) => (
              <button
                type="button"
                className={`state-index-row${selectedStateId === state.state_code ? ' is-selected' : ''}`}
                style={{ '--state-accent': stateAppearance[state.state_code]?.accent ?? '#77766f' } as CSSProperties}
                onClick={() => onSelectState(state.state_code)}
                key={state.state_code}
                aria-pressed={selectedStateId === state.state_code}
              >
                <span className="state-row-index">0{index + 1}</span>
                <span className="state-row-name">{state.state_name}</span>
                <span className="state-row-count">{display(state.registered_sources)} <small>sources</small></span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>
            ))}
            <p className="state-list-footnote">Source records are not counts of unique documents or verified claims.</p>
          </div>
        </div>
        <article className="state-profile" style={style} aria-live="polite">
          <div className="profile-header">
            <span className="profile-kicker"><Landmark size={14} aria-hidden="true" /> State case · {selectedState.state_code}</span>
            <span className="profile-records">{display(selectedState.comparison_status)}</span>
          </div>
          <h3>{selectedState.state_name}</h3>
          <p className="profile-role">{display(selectedState.case_role)}</p>
          <div className="profile-data-grid">
            <div>
              <span className="profile-label">Administrative model</span>
              <p>{display(selectedState.administrative_model)}</p>
            </div>
            <div>
              <span className="profile-label">Digital delivery model</span>
              <p>{display(selectedState.digital_delivery_model)}</p>
            </div>
            <div className="profile-rationale">
              <span className="profile-label">Selection rationale</span>
              <p>{display(selectedState.selection_rationale)}</p>
            </div>
          </div>
          <div className="profile-divider" />
          <p className="profile-label">Research collection · this state</p>
          <dl className="profile-counts">
            <div><dt>Registered sources</dt><dd>{display(selectedState.registered_sources)}</dd></div>
            <div><dt>Extracted records</dt><dd>{display(selectedState.extracted_records)}</dd></div>
            <div><dt>Unverified candidates</dt><dd>{notEstablished}</dd></div>
            <div><dt>Verified evidence entries</dt><dd>{display(selectedState.verified_evidence_entries)}</dd></div>
          </dl>
          <p className="profile-foot">Counts describe collection records, not administrative performance.</p>
        </article>
      </div>
      <div className="state-color-key" aria-hidden="true">
        {states.map((state) => <span key={state.state_code} style={{ '--state-accent': stateAppearance[state.state_code]?.accent ?? '#77766f' } as CSSProperties}>{state.state_name}</span>)}
      </div>
    </section>
  )
}
