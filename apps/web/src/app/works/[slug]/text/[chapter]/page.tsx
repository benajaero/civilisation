import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  loadWork,
  loadChapters,
  loadChapter,
  workHasText,
} from "@civilisation/content";
import { SiteFrame } from "../../../../../components/site-frame";
import { ChapterNav } from "../../../../../components/chapter-nav";

export const dynamic = "force-static";

export async function generateStaticParams() {
  const params: { slug: string; chapter: string }[] = [];
  for (const slug of ["the-iliad"]) {
    if (!(await workHasText(slug))) continue;
    const chapters = await loadChapters(slug);
    for (const ch of chapters) {
      params.push({ slug, chapter: ch.chapterSlug });
    }
  }
  return params;
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter } = await params;

  const work = await loadWork(slug).catch(() => null);
  if (!work) notFound();

  const chapters = await loadChapters(slug);
  const index = chapters.findIndex((c) => c.chapterSlug === chapter);
  if (index === -1) notFound();

  const current = chapters[index];
  const loaded = await loadChapter(slug, chapter);
  const prev = index > 0 ? chapters[index - 1] : undefined;
  const next = index < chapters.length - 1 ? chapters[index + 1] : undefined;

  return (
    <main>
      <SiteFrame>
        <section className="reader">
          <p className="reader__meta">
            <a href={`/works/${slug}`}>{work.title}</a>
            <span>&middot;</span>
            <span>{loaded.frontmatter.language}</span>
          </p>
          <h1 className="reader__title">{current.title}</h1>
          <div className="reader__body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {loaded.body}
            </ReactMarkdown>
          </div>
          <ChapterNav
            workSlug={slug}
            workTitle={work.title}
            prev={prev ? { chapterSlug: prev.chapterSlug, title: prev.title } : undefined}
            next={next ? { chapterSlug: next.chapterSlug, title: next.title } : undefined}
          />
        </section>
      </SiteFrame>
    </main>
  );
}
