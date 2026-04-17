// apps/web/src/app/page.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("presents an archival threshold rather than a marketing grid", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: "The Library of Civilisation" })).toBeInTheDocument();
    expect(
      screen.getByText(/a repository of the works that built the world/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter the archive")).toBeInTheDocument();
    expect(screen.getByText("Editorial foundation first.")).toBeInTheDocument();
  });
});
