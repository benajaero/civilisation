import { SiteFrame } from "./site-frame";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-line)] mt-24" role="contentinfo">
      <SiteFrame>
        <div className="py-10 text-sm text-[var(--color-muted-ink)]">
          Public archive foundation under editorial care.
        </div>
      </SiteFrame>
    </footer>
  );
}
