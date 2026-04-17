import { loadCollection } from "@civilisation/content";
import { SiteFrame } from "../../../components/site-frame";

export async function generateStaticParams() {
  return [{ slug: "greek-epics" }];
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await loadCollection(slug);

  return (
    <main>
      <SiteFrame>
        <article className="py-12">
          <header className="mb-8">
            <p className="font-[var(--font-meta)] uppercase tracking-[0.08em] text-[0.8rem] text-[var(--color-muted-ink)] mb-2">
              {collection.countries.join(", ")} · {collection.civilisations.join(", ")}
            </p>
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] leading-[1.1]">{collection.title}</h1>
            {collection.description && (
              <p className="mt-4 text-[var(--color-muted-ink)]">{collection.description}</p>
            )}
          </header>
        </article>
      </SiteFrame>
    </main>
  );
}