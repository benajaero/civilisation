import { Metadata } from "next";
import { buildSearchIndex } from "@civilisation/content";
import { SiteFrame } from "../../components/site-frame";
import { SearchClient } from "../../components/search-client";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Library of Civilisation catalog.",
  openGraph: {
    title: "Search | The Library of Civilisation",
    description: "Search the Library of Civilisation catalog.",
  },
};

export default async function SearchPage() {
  const index = await buildSearchIndex();

  return (
    <main>
      <SiteFrame>
        <SearchClient initialIndex={index} />
      </SiteFrame>
    </main>
  );
}