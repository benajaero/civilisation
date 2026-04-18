import { Metadata } from "next";
import { loadCollection } from "@civilisation/content";
import { SiteFrame } from "../../../components/site-frame";

export async function generateStaticParams() {
  return [{ slug: "greek-epics" }];
}

export const metadata: Metadata = {
  title: "Collection",
  description: "Collection details in the Library of Civilisation.",
};

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
        <article className="collection">
          <header className="collection__header">
            <p className="collection__kicker cv-meta">
              {collection.countries.join(", ")} · {collection.civilisations.join(", ")}
            </p>
            <h1 className="collection__title">{collection.title}</h1>
            {collection.description && (
              <p className="collection__description">{collection.description}</p>
            )}
          </header>
        </article>
      </SiteFrame>
    </main>
  );
}