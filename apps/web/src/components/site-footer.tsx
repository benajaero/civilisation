import { SiteFrame } from "./site-frame";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] mt-24" role="contentinfo">
      <SiteFrame>
        <div className="py-10 text-sm text-[var(--color-muted-ink)]">
          <p className="mb-2">Public archive foundation under editorial care.</p>
          <p className="text-xs mt-4">
            Site infrastructure by Ninth Heaven Group Pty Ltd.
            Operated and curated by the Ninth Heaven Library Archives Association (NHLAA).
          </p>
        </div>
      </SiteFrame>
    </footer>
  );
}