import { Metadata } from "next";
import { buildCatalog } from "@civilisation/content";
import { SiteFrame } from "../../components/site-frame";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse all works, authors, and collections in the Library of Civilisation.",
  openGraph: {
    title: "Catalog | The Library of Civilisation",
    description: "Browse all works, authors, and collections in the Library of Civilisation.",
  },
};

export default async function CatalogPage() {
  const catalog = await buildCatalog();

  const works = catalog.filter((e) => e.type === "work");
  const authors = catalog.filter((e) => e.type === "author");
  const collections = catalog.filter((e) => e.type === "collection");

  return (
    <main>
      <SiteFrame>
        <section className="catalog">
          <header className="catalog__header">
            <h1 className="catalog__title">Catalog</h1>
            <p className="catalog__blurb">
              Browse all works, authors, and collections in the library.
            </p>
          </header>

          {works.length > 0 && (
            <section className="catalog__section">
              <h2 className="catalog__section-title">Works</h2>
              <ul className="catalog__list">
                {works.map((work) => (
                  <li key={work.id}>
                    <a href={work.href} className="catalog__link">
                      {work.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {authors.length > 0 && (
            <section className="catalog__section">
              <h2 className="catalog__section-title">Authors</h2>
              <ul className="catalog__list">
                {authors.map((author) => (
                  <li key={author.id}>
                    <a href={author.href} className="catalog__link">
                      {author.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {collections.length > 0 && (
            <section className="catalog__section">
              <h2 className="catalog__section-title">Collections</h2>
              <ul className="catalog__list">
                {collections.map((col) => (
                  <li key={col.id}>
                    <a href={col.href} className="catalog__link">
                      {col.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </SiteFrame>
    </main>
  );
}