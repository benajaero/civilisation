interface ReaderLayoutProps {
  title: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function ReaderLayout({ title, children, sidebar }: ReaderLayoutProps) {
  return (
    <article className="grid gap-8 px-[var(--layout-gutter)] py-12 lg:grid-cols-[1fr_280px] max-w-[72rem] mx-auto">
      <section className="min-w-0">
        <h1 className="text-[clamp(2rem,4vw,3rem)] leading-[1.1] mb-8">{title}</h1>
        <div className="prose max-w-none text-[var(--color-ink)] leading-relaxed">
          {children}
        </div>
      </section>
      {sidebar && (
        <aside className="border-l border-[var(--color-line)] pl-6 text-sm text-[var(--color-muted-ink)]">
          {sidebar}
        </aside>
      )}
    </article>
  );
}