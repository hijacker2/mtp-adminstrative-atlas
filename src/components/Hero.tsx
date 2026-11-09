import { ArrowDownRight, MoveUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { stateAppearance, type StateProfile } from '../types/research'

interface HeroProps {
  states: StateProfile[]
}

export default function Hero({ states }: HeroProps) {
  return (
    <section className="hero section-wrap" id="atlas" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-rule" /> A comparative research atlas <span>·</span> 01 / 04</p>
        <h1 id="hero-title">The administrative landscape of <em>income certification</em></h1>
        <p className="hero-deck">
          A Digital Humanities study of the documents, institutions and digital infrastructures
          through which income certificates are produced across four Indian states.
        </p>
        <a className="text-link" href="#states">
          Explore the state cases <ArrowDownRight size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="hero-figure" aria-label="Four-state study, represented schematically and not geographically">
        <div className="figure-heading">
          <span>Study frame</span>
          <span>Four state cases</span>
        </div>
        <div className="study-frame">
          <div className="frame-line frame-line-horizontal" />
          <div className="frame-line frame-line-vertical" />
          {states.map((state, index) => (
            <div className={`frame-state frame-state-${index + 1}`} key={state.state_code} style={{ '--state-accent': stateAppearance[state.state_code]?.accent ?? '#77766f' } as CSSProperties}>
              <span className="frame-dot" />
              <span className="frame-state-name">{state.state_name}</span>
              <span className="frame-state-index">0{index + 1}</span>
            </div>
          ))}
          <div className="frame-center-mark" aria-hidden="true">
            <span>INCOME</span>
            <span>CERTIFICATION</span>
          </div>
          <div className="frame-orbit frame-orbit-one" />
          <div className="frame-orbit frame-orbit-two" />
        </div>
        <div className="figure-caption">
          <span>Four administrative contexts</span>
          <span>Not a geographic map <MoveUpRight size={12} aria-hidden="true" /></span>
        </div>
      </div>
    </section>
  )
}
