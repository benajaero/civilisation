/**
 * JSON-LD structured data for rich search results
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://civilisation-web.vercel.app";

/** Organization structured data */
export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ninth Heaven Literature & Arts Association (NHLAA)",
  url: SITE_URL,
  description:
    "A nonprofit dedicated to preserving and providing access to the foundational texts of human civilisation.",
  sameAs: [
    "https://github.com/benajaero/civilisation",
  ],
};

/** Library/Archive structured data */
export const LIBRARY_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Library",
  name: "The Library of Civilisation",
  url: SITE_URL,
  description:
    "Every civilisation's foundational texts, indexed in one place, held in public trust.",
  foundingOrganization: {
    "@type": "Organization",
    name: "Ninth Heaven Literature & Arts Association",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "US",
  },
};

/** WebSite structured data */
export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "The Library of Civilisation",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

/**
 * Generates the JSON-LD script element
 */
export function generateJsonLd(...schemas: object[]) {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}