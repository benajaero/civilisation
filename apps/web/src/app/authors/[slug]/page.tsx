import { loadAuthor } from "@civilisation/content";

const PageFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-[72rem] px-[var(--layout-gutter)]">{children}</div>
);

export async function generateStaticParams() {
  return [{ slug: "homer" }];
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await loadAuthor(slug);

  return (
    <main>
      <PageFrame>
        <article className="py-12">
          <header className="mb-8">
            <p className="font-[var(--font-meta)] uppercase tracking-[0.08em] text-[0.8rem] text-[var(--color-muted-ink)] mb-2">
              {author.countries.join(", ")} · {author.civilisations.join(", ")}
            </p>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.1]">{author.name}</h1>
            {author.dates?.floruit && (
              <p className="mt-4 text-[var(--color-muted-ink)]">
                Floruit: {author.dates.floruit}
              </p>
            )}
          </header>
          
          <section className="border-t border-[var(--color-line)] pt-8 mt-8">
            <h2 className="text-lg font-medium mb-4">Languages</h2>
            <p>{author.languages.join(", ")}</p>
          </section>
        </article>
      </PageFrame>
    </main>
  );
}