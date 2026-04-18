import { SiteFrame } from "./site-frame";

export function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <SiteFrame>
        <div className="site-footer__inner">
          <p>Public archive foundation under editorial care.</p>
          <p className="site-footer__small">
            Site infrastructure by Ninth Heaven Group Pty Ltd. Operated and
            curated by Ninth Heaven Literature & Arts Association (NHLAA).
          </p>
        </div>
      </SiteFrame>
    </footer>
  );
}
