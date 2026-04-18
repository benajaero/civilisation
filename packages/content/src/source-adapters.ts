export type SourceKind = "gutenberg" | "ctext" | "poetryintranslation";

export type SourceRightsStatus =
  | "review_required"
  | "permission_required";

export interface SourceRightsAssessment {
  status: SourceRightsStatus;
  basis: string;
  sourceTermsUrl: string;
  checkedAt: string;
  conditions: string[];
}

export interface NormalizedSource {
  kind: SourceKind;
  sourceId: string;
  title: string;
  canonicalUrl: string;
  retrievalUrl?: string;
  rights: SourceRightsAssessment;
}

export type GutenbergCopyrightStatus =
  | "not_restricted_us"
  | "copyrighted_permission_only";

export interface GutenbergSourceInput {
  ebookId: string;
  title: string;
  language?: string;
  copyrightStatus: GutenbergCopyrightStatus;
}

export interface CtextSourceInput {
  urn: string;
  title: string;
  includesTranslation: boolean;
}

export interface PoetryInTranslationSourceInput {
  path: string;
  title: string;
  author: string;
}

const RIGHTS_CHECKED_AT = "2026-04-18";

const gutenbergTermsUrl = "https://www.gutenberg.org/policy/license";
const gutenbergRobotUrl = "https://www.gutenberg.org/policy/robot_access.html";
const ctextApiTermsUrl = "https://ctext.org/tools/api";
const poetryInTranslationTermsUrl = "https://www.poetryintranslation.com/";

function encodeParams(params: Record<string, string>): string {
  return new URLSearchParams(params).toString();
}

function gutenbergHarvestQuery(language?: string): string {
  const params = ["filetypes[]=txt"];
  if (language) {
    params.push(`langs[]=${encodeURIComponent(language)}`);
  }
  return params.join("&");
}

export function createGutenbergAdapter() {
  return {
    kind: "gutenberg" as const,
    createSource(input: GutenbergSourceInput): NormalizedSource {
      const conditions = [
        "Use Project Gutenberg robot harvest endpoints or mirrors rather than scraping human pages.",
        "Preserve required Project Gutenberg license/trademark terms, or strip Project Gutenberg trademark/license matter before republication.",
      ];

      if (input.copyrightStatus === "not_restricted_us") {
        conditions.unshift(
          "Confirm the ebook license says it is not restricted by U.S. copyright law.",
        );
      } else {
        conditions.unshift(
          "Do not republish without permission from the copyright holder.",
        );
      }

      return {
        kind: "gutenberg",
        sourceId: input.ebookId,
        title: input.title,
        canonicalUrl: `https://www.gutenberg.org/ebooks/${input.ebookId}`,
        retrievalUrl: `https://www.gutenberg.org/robot/harvest?${gutenbergHarvestQuery(input.language)}`,
        rights: {
          status:
            input.copyrightStatus === "not_restricted_us"
              ? "review_required"
              : "permission_required",
          basis:
            input.copyrightStatus === "not_restricted_us"
              ? "Project Gutenberg works not restricted under U.S. copyright may be reused after license/trademark review."
              : "Project Gutenberg permissioned copyrighted works do not automatically grant republication rights.",
          sourceTermsUrl:
            input.copyrightStatus === "not_restricted_us"
              ? gutenbergTermsUrl
              : gutenbergTermsUrl,
          checkedAt: RIGHTS_CHECKED_AT,
          conditions,
        },
      };
    },
  };
}

export function createCtextAdapter() {
  return {
    kind: "ctext" as const,
    createSource(input: CtextSourceInput): NormalizedSource {
      const encodedUrn = encodeURIComponent(input.urn);
      const conditions = [
        "Use the CTP JSON API for reasonable amounts of textual data; do not scrape site pages.",
        "Respect CTP request limits and authentication requirements.",
        "Link citations back to the corresponding CTP page.",
      ];

      if (input.includesTranslation) {
        conditions.unshift(
          "Translations on CTP remain under their authors' copyright; do not copy without permission.",
        );
      }

      return {
        kind: "ctext",
        sourceId: input.urn,
        title: input.title,
        canonicalUrl: `https://api.ctext.org/getlink?urn=${encodedUrn}&redirect=1`,
        retrievalUrl: `https://api.ctext.org/gettext?urn=${encodedUrn}`,
        rights: {
          status: input.includesTranslation
            ? "permission_required"
            : "review_required",
          basis: input.includesTranslation
            ? "CTP site content is copyrighted and translations require separate permission."
            : "CTP API allows offline use of reasonable textual data, but publication still needs editorial rights review.",
          sourceTermsUrl: ctextApiTermsUrl,
          checkedAt: RIGHTS_CHECKED_AT,
          conditions,
        },
      };
    },
  };
}

export function createPoetryInTranslationAdapter() {
  return {
    kind: "poetryintranslation" as const,
    createSource(input: PoetryInTranslationSourceInput): NormalizedSource {
      const url = `https://www.poetryintranslation.com/${input.path}`;
      const conditions = [
        "Non-commercial reuse is freely permitted with attribution.",
        "All texts are human-authored or translated; verify each work's specific copyright terms.",
        "Contact the publisher for any commercial applications.",
      ];

      return {
        kind: "poetryintranslation",
        sourceId: input.path,
        title: input.title,
        canonicalUrl: url,
        retrievalUrl: url,
        rights: {
          status: "review_required",
          basis: "Poetry in Translation permits non-commercial reuse with attribution. Ideal for non-profit digital libraries.",
          sourceTermsUrl: poetryInTranslationTermsUrl,
          checkedAt: RIGHTS_CHECKED_AT,
          conditions,
        },
      };
    },
  };
}

export const sourceAdapters = {
  gutenberg: createGutenbergAdapter(),
  ctext: createCtextAdapter(),
  poetryintranslation: createPoetryInTranslationAdapter(),
} as const;

export { gutenbergRobotUrl };
