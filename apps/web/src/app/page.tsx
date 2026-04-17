import { SiteFrame } from "../components/site-frame";

export default function HomePage() {
  return (
    <main>
      <SiteFrame>
        <section className="py-20">
          <p className="font-[var(--font-meta)] uppercase tracking-[0.08em] text-[0.8rem] text-[var(--color-muted-ink)]">
            Launch foundation
          </p>
          <h1 className="max-w-[12ch] text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.92]">
            The Library of Civilisation
          </h1>
          <p className="max-w-[42rem] text-xl text-[var(--color-muted-ink)]">
            A repository of the works that built the world.
          </p>
        </section>

        <section className="grid gap-8 border-t border-[var(--color-line)] py-10 md:grid-cols-[2fr_1fr]">
          <div className="max-w-[42rem]">
            <p>
              The launch shell establishes the archive&apos;s visual and editorial posture before the
              wider catalog, reading surfaces, and content systems are introduced.
            </p>
            <a className="inline-block mt-6" href="/">
              Enter the archive
            </a>
          </div>
          <div className="text-sm text-[var(--color-muted-ink)]">
            <p>Editorial foundation first.</p>
            <p>Brand system in `packages/brand`.</p>
            <p>Catalog and work pages follow in later plans.</p>
          </div>
        </section>
      </SiteFrame>
    </main>
  );
}
