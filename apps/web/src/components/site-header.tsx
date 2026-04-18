import { SiteFrame } from "./site-frame";

const issueDate = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "long",
  year: "numeric"
}).format(new Date());

export function SiteHeader() {
  return (
    <header className="site-masthead" role="banner">
      <SiteFrame>
        <div className="site-masthead__dateline">
          <span className="cv-meta">Vol. I · Issue 01</span>
          <span className="cv-meta">Editio Princeps</span>
          <span className="cv-meta cv-mono">{issueDate}</span>
        </div>
        <hr className="cv-rule" />
        <div className="site-masthead__wordmark">
          <a href="/" className="site-logo-link">
            <img
              src="/logo.jpg"
              alt="Ninth Heaven Literature & Arts Association"
              className="site-logo"
            />
          </a>
          <div className="site-masthead__title-wrap">
            <a href="/" className="site-masthead__title-link">
              <span className="cv-meta">Ninth Heaven Literature & Arts Association</span>
              <p className="site-masthead__title">Library of Civilisation</p>
              <span className="cv-meta">NHLAA archive in public trust</span>
            </a>
          </div>
        </div>
        <hr className="cv-rule-double" />
        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list">
            <li><a href="/#lobby">Rooms</a></li>
            <li><a href="/catalog">Catalog</a></li>
            <li><a href="/search">Search</a></li>
            <li><a href="/#manifesto">Manifesto</a></li>
            <li><a href="/#principles">Principles</a></li>
          </ul>
        </nav>
      </SiteFrame>
    </header>
  );
}
