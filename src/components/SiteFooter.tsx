import { ArrowUpRight } from 'lucide-react'
import { notEstablished } from '../types/research'

export default function SiteFooter({ snapshotDate }: { snapshotDate: string | null }) {
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-main">
        <div className="footer-identity">
          <span className="wordmark-seal" aria-hidden="true">M</span>
          <div>
            <strong>MTP Administrative Atlas</strong>
            <span>A Digital Humanities research project</span>
          </div>
        </div>
        <p className="footer-caution">An evolving research collection. Registered sources and extracted records are not, by themselves, verified evidence or claims about administrative performance.</p>
        <div className="footer-links">
          <a href="#method">Method <ArrowUpRight size={13} aria-hidden="true" /></a>
          <span>Citation and contact details <small>Not yet established</small></span>
        </div>
      </div>
      <div className="section-wrap footer-bottom">
        <span>Administrative Landscape</span>
        <span>Research snapshot · {snapshotDate ?? notEstablished}</span>
      </div>
    </footer>
  )
}
