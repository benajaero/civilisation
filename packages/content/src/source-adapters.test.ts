import { describe, expect, it } from "vitest";
import {
  createCtextAdapter,
  createGutenbergAdapter,
} from "./source-adapters";

describe("createGutenbergAdapter", () => {
  it("normalizes a Project Gutenberg source and marks unrestricted U.S. works as reviewable", () => {
    const adapter = createGutenbergAdapter();
    const source = adapter.createSource({
      ebookId: "2600",
      title: "War and Peace",
      language: "en",
      copyrightStatus: "not_restricted_us",
    });

    expect(source.kind).toBe("gutenberg");
    expect(source.canonicalUrl).toBe("https://www.gutenberg.org/ebooks/2600");
    expect(source.retrievalUrl).toBe(
      "https://www.gutenberg.org/robot/harvest?filetypes[]=txt&langs[]=en",
    );
    expect(source.rights.status).toBe("review_required");
    expect(source.rights.conditions).toContain(
      "Confirm the ebook license says it is not restricted by U.S. copyright law.",
    );
  });

  it("blocks Gutenberg works distributed by permission from automatic republication", () => {
    const adapter = createGutenbergAdapter();
    const source = adapter.createSource({
      ebookId: "permissioned",
      title: "Permissioned Work",
      copyrightStatus: "copyrighted_permission_only",
    });

    expect(source.rights.status).toBe("permission_required");
    expect(source.rights.conditions).toContain(
      "Do not republish without permission from the copyright holder.",
    );
  });
});

describe("createCtextAdapter", () => {
  it("normalizes a CTP URN and requires rights review before publication", () => {
    const adapter = createCtextAdapter();
    const source = adapter.createSource({
      urn: "ctp:analects/xue-er",
      title: "Analects, Xue Er",
      includesTranslation: false,
    });

    expect(source.kind).toBe("ctext");
    expect(source.canonicalUrl).toBe(
      "https://api.ctext.org/getlink?urn=ctp%3Aanalects%2Fxue-er&redirect=1",
    );
    expect(source.retrievalUrl).toBe(
      "https://api.ctext.org/gettext?urn=ctp%3Aanalects%2Fxue-er",
    );
    expect(source.rights.status).toBe("review_required");
    expect(source.rights.conditions).toContain(
      "Use the CTP JSON API for reasonable amounts of textual data; do not scrape site pages.",
    );
  });

  it("requires permission for CTP translations", () => {
    const adapter = createCtextAdapter();
    const source = adapter.createSource({
      urn: "ctp:analects/xue-er",
      title: "Analects, Xue Er",
      includesTranslation: true,
    });

    expect(source.rights.status).toBe("permission_required");
    expect(source.rights.conditions).toContain(
      "Translations on CTP remain under their authors' copyright; do not copy without permission.",
    );
  });
});
