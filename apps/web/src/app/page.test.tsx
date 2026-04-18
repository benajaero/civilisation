import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@civilisation/content", () => ({
  loadRooms: async () => [
    {
      id: "classical-western",
      label: "Greco-Roman",
      span: "c. 750 BCE - 180 CE",
      note: "Epic, geometry, rhetoric, empire.",
      order: 3,
      entries: [
        {
          year: "c. 750 BCE",
          author: "Homer",
          title: "The Iliad",
          language: "Greek",
          discipline: "Epic",
          slug: "the-iliad",
        },
      ],
    },
  ],
}));

import HomePage from "./page";

describe("HomePage", () => {
  it("renders the archival threshold with a lobby of rooms", async () => {
    const ui = await HomePage();
    render(ui);

    expect(screen.getByRole("heading", { name: "The Library of Civilisation" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The Rooms" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Greco-Roman" })).toBeInTheDocument();
    expect(screen.getByText("Enter the archive")).toBeInTheDocument();
    expect(screen.getByText("Editorial foundation first.")).toBeInTheDocument();
  });
});
