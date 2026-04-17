import { shellClasses } from "@civilisation/brand";
import { SiteFrame } from "./site-frame";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--color-line)]" role="banner">
      <SiteFrame>
        <div className="flex items-center justify-between py-6">
          <div>
            <div className={shellClasses.metaRow}>Ninth Heaven Library</div>
            <div className="font-[var(--font-display)] text-2xl">Library of Civilisation</div>
          </div>
          <nav aria-label="Primary">
            <ul className="flex gap-6 list-none m-0 p-0 font-[var(--font-meta)] uppercase tracking-[0.08em] text-[0.8rem]">
              <li><a href="/">Archive</a></li>
              <li><a href="/">Texts</a></li>
              <li><a href="/">About</a></li>
            </ul>
          </nav>
        </div>
      </SiteFrame>
    </header>
  );
}
