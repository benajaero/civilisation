interface ReaderLayoutProps {
  title: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export function ReaderLayout({ title, children, sidebar }: ReaderLayoutProps) {
  return (
    <article className="reader-layout">
      <section className="reader-layout__main">
        <h1 className="reader-layout__title">{title}</h1>
        <div className="reader-layout__body">{children}</div>
      </section>
      {sidebar && (
        <aside className="reader-layout__sidebar">{sidebar}</aside>
      )}
    </article>
  );
}
