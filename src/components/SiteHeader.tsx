export default function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="MTP Administrative Atlas home">
        <span className="wordmark-seal" aria-hidden="true">M</span>
        <span className="wordmark-copy">
          <strong>MTP</strong>
          <span>Administrative Atlas</span>
        </span>
      </a>
      <nav className="primary-nav" aria-label="Main navigation">
        <a className="nav-current" href="#atlas" aria-current="page">Atlas</a>
        <a href="#states">States</a>
        <a href="#sources">Sources</a>
        <a href="#method">Method</a>
      </nav>
      <details className="future-menu">
        <summary>More <span className="forthcoming-label">Forthcoming</span></summary>
        <div className="future-menu-panel">
          <p>Future sections</p>
          <span>Visualisations</span>
          <span>Field notes</span>
          <span>Comparative essays</span>
          <small>Not part of this release</small>
        </div>
      </details>
    </header>
  )
}
