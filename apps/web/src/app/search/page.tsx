import { buildSearchIndex } from "@civilisation/content";
import { SiteFrame } from "../../components/site-frame";
import { SearchClient } from "../../components/search-client";

export const dynamic = "force-static";

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