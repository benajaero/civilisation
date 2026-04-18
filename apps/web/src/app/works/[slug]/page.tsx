import { loadWork, loadChapters, workHasText } from "@civilisation/content";

const PageFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-[72rem] px-[var(--layout-gutter)]">{children}</div>
);

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{ slug: "the-iliad" }];
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = await loadWork(slug);
  const hasText = await workHasText(slug);
  const chapters = hasText ? await loadChapters(slug) : [];
  const firstChapter = chapters[0];

  return (
    <main>
      <PageFrame>
        <article className="py-12">
          <header className="mb-8">
            <p className="font-[var(--font-meta)] uppercase tracking-[0.08em] text-[0.8rem] text-[var(--color-muted-ink)] mb-2">
              {work.countries.join(", ")} · {work.civilisations.join(", ")}
            </p>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.1]">{work.title}</h1>
            <p className="mt-4 text-[var(--color-muted-ink)]">
              Available in: {work.available_languages.join(", ")}
            </p>
          </header>

          {hasText && firstChapter ? (
            <section className="border-t border-[var(--color-line)] pt-8 mt-8">
              <a
                href={`/works/${slug}/text/${firstChapter.chapterSlug}`}
                className="inline-block font-[var(--font-meta)] text-[0.78rem] uppercase tracking-[0.18em] border-b border-[var(--color-ink)] pb-1"
              >
                Begin reading &rarr;
              </a>
              <h2 className="text-lg font-medium mt-8 mb-4">Text</h2>
              <ol className="space-y-2 list-decimal pl-6">
                {chapters.map((ch) => (
                  <li key={ch.chapterSlug}>
                    <a
                      href={`/works/${slug}/text/${ch.chapterSlug}`}
                      className="text-[var(--color-accent)]"
                    >
                      {ch.title}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ) : (
            <p className="mt-8 italic text-[var(--color-muted-ink)]">
              Text not yet accessioned.
            </p>
          )}

          <section className="border-t border-[var(--color-line)] pt-8 mt-8">
            <h2 className="text-lg font-medium mb-4">Related Works</h2>
            <ul className="space-y-2">
              {work.links.related_works.map((id) => (
                <li key={id}>
                  <a href={`/works/${id.replace("work.", "")}`} className="text-[var(--color-accent)]">
                    {id}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-[var(--color-line)] pt-8 mt-8">
            <h2 className="text-lg font-medium mb-4">Collections</h2>
            <ul className="space-y-2">
              {work.links.collections.map((id) => (
                <li key={id}>
                  <a href={`/collections/${id.replace("collection.", "")}`} className="text-[var(--color-accent)]">
                    {id}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </PageFrame>
    </main>
  );
}
