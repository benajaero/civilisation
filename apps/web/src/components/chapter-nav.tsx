interface ChapterNavProps {
  workSlug: string;
  workTitle: string;
  prev?: { chapterSlug: string; title: string };
  next?: { chapterSlug: string; title: string };
}

export function ChapterNav({ workSlug, workTitle, prev, next }: ChapterNavProps) {
  return (
    <nav className="chapter-nav" aria-label="Chapter navigation">
      <div className="chapter-nav__slot">
        {prev ? (
          <a
            href={`/works/${workSlug}/text/${prev.chapterSlug}`}
            className="chapter-nav__link"
          >
            <span className="cv-meta">&larr; Previous</span>
            <span className="chapter-nav__label">{prev.title}</span>
          </a>
        ) : null}
      </div>
      <div className="chapter-nav__slot chapter-nav__slot--center">
        <a href={`/works/${workSlug}`} className="chapter-nav__link">
          <span className="cv-meta">Contents</span>
          <span className="chapter-nav__label">{workTitle}</span>
        </a>
      </div>
      <div className="chapter-nav__slot chapter-nav__slot--end">
        {next ? (
          <a
            href={`/works/${workSlug}/text/${next.chapterSlug}`}
            className="chapter-nav__link"
          >
            <span className="cv-meta">Next &rarr;</span>
            <span className="chapter-nav__label">{next.title}</span>
          </a>
        ) : null}
      </div>
    </nav>
  );
}
