import { SiteFrame } from "./site-frame";

export function SiteFooter() {
  return (
    <footer id="colophon" className="site-footer" role="contentinfo">
      <SiteFrame>
        <hr className="cv-rule-double" />
        <div className="site-footer__grid">
          <div>
            <p className="cv-meta cv-meta-ink">Colophon</p>
            <p className="site-footer__copy">
              Set in Fraunces, Source Serif 4, and IBM Plex Sans. Static-first,
              held in public trust. Typography carries the hierarchy; the surface
              stays quiet.
            </p>
          </div>
          <div>
            <p className="cv-meta cv-meta-ink">Editorial</p>
            <ul className="site-footer__list">
              <li>Public archive foundation under editorial care.</li>
              <li>Every text carries verified provenance.</li>
              <li>No publication without review.</li>
            </ul>
          </div>
          <div>
            <p className="cv-meta cv-meta-ink">Index</p>
            <ul className="site-footer__list">
              <li><a href="#index">The Archive</a></li>
              <li><a href="#epochs">Epochs</a></li>
              <li><a href="#principles">Principles</a></li>
              <li><a href="#manifesto">Editorial statement</a></li>
            </ul>
          </div>
        </div>
        <hr className="cv-rule" />
        <div className="site-footer__base">
          <span className="cv-meta">© MMXXVI · Library of Civilisation</span>
          <span className="cv-meta">Ninth Heaven</span>
          <span className="cv-meta cv-mono">EDITIO·I</span>
        </div>
      </SiteFrame>
    </footer>
  );
}
