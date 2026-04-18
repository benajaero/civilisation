import { Metadata } from "next";
import { loadAuthor } from "@civilisation/content";
import { SiteFrame } from "../../../components/site-frame";

export async function generateStaticParams() {
  return [{ slug: "homer" }];
}

export const metadata: Metadata = {
  title: "Author",
  description: "Author details in the Library of Civilisation.",
};

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await loadAuthor(slug);

  return (
    <main>
      <SiteFrame>
        <article className="author">
          <header className="author__header">
            <p className="author__kicker cv-meta">
              {author.countries.join(", ")} · {author.civilisations.join(", ")}
            </p>
            <h1 className="author__name">{author.name}</h1>
            {author.dates?.floruit && (
              <p className="author__dates">Floruit: {author.dates.floruit}</p>
            )}
          </header>

          <section className="author__section">
            <h2 className="author__section-title">Languages</h2>
            <p className="author__detail">{author.languages.join(", ")}</p>
          </section>
        </article>
      </SiteFrame>
    </main>
  );
}