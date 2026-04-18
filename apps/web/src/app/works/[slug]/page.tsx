import { loadWork, loadChapters, workHasText } from "@civilisation/content";
import { SiteFrame } from "../../../components/site-frame";

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
      <SiteFrame>
        <article className="work">
          <header className="work__header">
            <p className="work__kicker cv-meta">
              {work.countries.join(", ")} · {work.civilisations.join(", ")}
            </p>
            <h1 className="work__title">{work.title}</h1>
            <div className="work__status-row">
              <p className="work__availability">
                Available in: {work.available_languages.join(", ")}
              </p>
              {hasText && firstChapter ? (
                <a
                  href={`/works/${slug}/text/${firstChapter.chapterSlug}`}
                  className="work__begin"
                >
                  Begin reading &rarr;
                </a>
              ) : (
                <span className="work__unavailable">Text not yet accessioned.</span>
              )}
            </div>
          </header>

          {hasText && firstChapter ? (
            <section className="work__section work__section--text">
              <h2 className="work__section-title">Text</h2>
              <ol className="work__chapter-list">
                {chapters.map((ch) => (
                  <li key={ch.chapterSlug}>
                    <a
                      href={`/works/${slug}/text/${ch.chapterSlug}`}
                      className="work__chapter-link"
                    >
                      {ch.title}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          ) : (
            <section className="work__section work__section--text">
              <h2 className="work__section-title">Text</h2>
              <p className="work__empty">
                Catalogued only. The text is waiting for review and accession.
              </p>
            </section>
          )}

          <section className="work__section">
            <h2 className="work__section-title">Related Works</h2>
            <ul className="work__list">
              {work.links.related_works.map((id) => (
                <li key={id}>
                  <a href={`/works/${id.replace("work.", "")}`} className="work__link">
                    {id}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="work__section">
            <h2 className="work__section-title">Collections</h2>
            <ul className="work__list">
              {work.links.collections.map((id) => (
                <li key={id}>
                  <a href={`/collections/${id.replace("collection.", "")}`} className="work__link">
                    {id}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </SiteFrame>
    </main>
  );
}
