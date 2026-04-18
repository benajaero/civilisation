import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RoomFloorPlan } from "./room-floor-plan";
import { RoomIndex } from "./room-index";
import type { Room } from "@civilisation/content";

const room: Room = {
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
    {
      year: "c. 360 BCE",
      author: "Plato",
      title: "Republic",
      language: "Greek",
      discipline: "Philosophy",
    },
  ],
};

describe("room availability states", () => {
  it("links accessioned texts and labels unavailable entries", () => {
    render(<RoomIndex room={room} availableSlugs={new Set(["the-iliad"])} />);

    expect(screen.getByRole("link", { name: /The Iliad/ })).toHaveAttribute(
      "href",
      "/works/the-iliad",
    );
    expect(screen.getByText("Republic").closest("li")).toHaveClass(
      "entry--unavailable",
    );
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });

  it("marks floor-plan cells by availability", () => {
    render(
      <RoomFloorPlan room={room} availableSlugs={new Set(["the-iliad"])} />,
    );

    expect(screen.getByText("The Iliad").closest("div")).toHaveClass(
      "floor-plan__cell--available",
    );
    expect(screen.getByText("Republic").closest("div")).toHaveClass(
      "floor-plan__cell--unavailable",
    );
  });
});
