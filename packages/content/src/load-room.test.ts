import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadRoom, loadRooms } from "./load-room";

const tmp = mkdtempSync(path.join(tmpdir(), "cv-rooms-"));

beforeAll(() => {
  mkdirSync(path.join(tmp, "rooms"), { recursive: true });
  writeFileSync(
    path.join(tmp, "rooms", "classical-western.md"),
    `---
id: classical-western
label: Greco-Roman
span: c. 750 BCE – 180 CE
note: Epic, geometry, rhetoric, empire.
order: 3
entries:
  - year: c. 750 BCE
    author: Homer
    title: The Iliad
    native: Ἰλιάς
    language: Greek
    discipline: Epic
    slug: the-iliad
  - year: c. 360 BCE
    author: Plato
    title: Republic
    language: Greek
    discipline: Philosophy
---
Curatorial body (ignored by loader).
`,
  );
  writeFileSync(
    path.join(tmp, "rooms", "chinese.md"),
    `---
id: chinese
label: Chinese
span: c. 1000 BCE – 1800 CE
note: A continuous tradition.
order: 1
entries:
  - year: c. 500 BCE
    author: Lao Tzu
    title: Tao Te Ching
    language: Classical Chinese
    discipline: Philosophy
---
`,
  );
  process.env.LIBRARY_PATH = tmp;
});

afterAll(() => {
  delete process.env.LIBRARY_PATH;
  rmSync(tmp, { recursive: true, force: true });
});

describe("loadRoom", () => {
  it("parses a single room file", async () => {
    const room = await loadRoom("classical-western");
    expect(room.id).toBe("classical-western");
    expect(room.label).toBe("Greco-Roman");
    expect(room.entries).toHaveLength(2);
    expect(room.entries[0]?.slug).toBe("the-iliad");
    expect(room.entries[1]?.slug).toBeUndefined();
  });
});

describe("loadRooms", () => {
  it("returns all rooms sorted by order", async () => {
    const rooms = await loadRooms();
    expect(rooms.map((r) => r.id)).toEqual(["chinese", "classical-western"]);
  });
});
