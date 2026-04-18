import { buildCatalog } from "@civilisation/content";

export const dynamic = "force-static";

const PageFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-[72rem] px-[var(--layout-gutter)]">{children}</div>
);

export default async function CatalogPage() {
  const catalog = await buildCatalog();

  const works = catalog.filter((e) => e.type === "work");
  const authors = catalog.filter((e) => e.type === "author");
  const collections = catalog.filter((e) => e.type === "collection");

  return (
    <main>
      <PageFrame>
        <div className="py-12">
          <h1 className="text-[clamp(2rem,4vw,3rem)] mb-8">Catalog</h1>
          
          <section className="mb-12">
            <h2 className="text-lg font-medium mb-4 border-b border-[var(--color-line)] pb-2">Works</h2>
            <ul className="space-y-2">
              {works.map((work) => (
                <li key={work.id}>
                  <a href={work.href} className="text-[var(--color-accent)]">{work.title}</a>
                </li>
              ))}
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-lg font-medium mb-4 border-b border-[var(--color-line)] pb-2">Authors</h2>
            <ul className="space-y-2">
              {authors.map((author) => (
                <li key={author.id}>
                  <a href={author.href} className="text-[var(--color-accent)]">{author.title}</a>
                </li>
              ))}
            </ul>
          </section>
          
          <section>
            <h2 className="text-lg font-medium mb-4 border-b border-[var(--color-line)] pb-2">Collections</h2>
            <ul className="space-y-2">
              {collections.map((col) => (
                <li key={col.id}>
                  <a href={col.href} className="text-[var(--color-accent)]">{col.title}</a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </PageFrame>
    </main>
  );
}