// apps/web/src/components/site-shell.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RootLayout from "../app/layout";

describe("RootLayout", () => {
  it("renders the launch shell with archive framing", () => {
    render(
      <RootLayout>
        <div>Child content</div>
      </RootLayout>,
    );

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Library of Civilisation")).toBeInTheDocument();
    expect(screen.getByText("Archive")).toBeInTheDocument();
    expect(screen.getByText("Texts")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
