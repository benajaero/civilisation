import { buildSearchIndex } from "@civilisation/content";

export const dynamic = "force-static";

const PageFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-[72rem] px-[var(--layout-gutter)]">{children}</div>
);

export default async function SearchPage() {
  const index = await buildSearchIndex();

  return (
    <main>
      <PageFrame>
        <div className="py-12">
          <h1 className="text-[clamp(2rem,4vw,3rem)] mb-8">Search</h1>
          
          <div className="mb-8">
            <input 
              type="search" 
              placeholder="Search the catalog..." 
              className="w-full max-w-md px-4 py-2 border border-[var(--color-line)] rounded bg-[var(--color-canvas)] text-[var(--color-ink)]"
            />
          </div>
          
          <section>
            <h2 className="text-lg font-medium mb-4">Available Records</h2>
            <ul className="space-y-2">
              {index.map((entry) => (
                <li key={entry.id} className="flex items-center gap-2">
                  <span className="text-xs uppercase text-[var(--color-muted-ink)]">{entry.type}</span>
                  <a href={entry.href} className="text-[var(--color-accent)]">{entry.title}</a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </PageFrame>
    </main>
  );
}