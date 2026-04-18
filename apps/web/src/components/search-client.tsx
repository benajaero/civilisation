"use client";

import { useState, useMemo } from "react";
import type { SearchIndexEntry } from "@civilisation/content";

interface SearchClientProps {
  initialIndex: SearchIndexEntry[];
}

export function SearchClient({ initialIndex }: SearchClientProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return initialIndex;
    const q = query.toLowerCase();
    return initialIndex.filter(
      (entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.type.toLowerCase().includes(q)
    );
  }, [query, initialIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="search">
      <header className="search__header">
        <h1 className="search__title">Search</h1>
        <p className="search__blurb">
          Browse the catalog by title, author, or collection.
        </p>
      </header>

      <form className="search__input-wrap" onSubmit={handleSubmit}>
        <input
          type="search"
          id="search-input"
          className="search__input"
          placeholder="Search the library..."
          aria-label="Search the library"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>

      <div className="search__results" aria-live="polite">
        {results.length > 0 ? (
          <>
            <p className="search__count cv-meta">
              {results.length} {results.length === 1 ? "result" : "results"}
              {query && ` for "${query}"`}
            </p>
            <ul className="search__list">
              {results.map((entry) => (
                <li key={entry.id} className="search__item">
                  <a href={entry.href} className="search__link">
                    <span className="search__link-type cv-meta">{entry.type}</span>
                    <span className="search__link-title">{entry.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="search__empty">
            {query ? `No results for "${query}".` : "No entries in the index."}
          </p>
        )}
      </div>
    </section>
  );
}