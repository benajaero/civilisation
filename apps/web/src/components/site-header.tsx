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
          <span className="cv-meta">The</span>
          <p className="site-masthead__title">Library of Civilisation</p>
          <span className="cv-meta">An archive in public trust</span>
        </div>
        <hr className="cv-rule-double" />
        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list">
            <li><a href="#index">Archive</a></li>
            <li><a href="#index">Texts</a></li>
            <li><a href="#epochs">Epochs</a></li>
            <li><a href="#manifesto">Manifesto</a></li>
            <li><a href="#colophon">About</a></li>
          </ul>
        </nav>
      </SiteFrame>
    </header>
  );
}
