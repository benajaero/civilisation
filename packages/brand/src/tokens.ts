export const colorTokens = {
  canvas: "#f4f0e8",
  paper: "#ebe4d6",
  ink: "#161412",
  mutedInk: "#4b443d",
  line: "#b8aa96",
  accent: "#6f5d43"
} as const;

export const spacingTokens = {
  "layout-gutter": "clamp(1.25rem, 2vw, 2rem)",
  "section-gap": "clamp(3rem, 7vw, 6rem)",
  "measure-wide": "72rem",
  "measure-reading": "42rem"
} as const;

export const typographyTokens = {
  display: {
    family: "\"Fraunces\", \"Iowan Old Style\", serif",
    size: "clamp(2.75rem, 6vw, 5.5rem)",
    tracking: "-0.04em"
  },
  body: {
    family: "\"Source Serif 4\", Georgia, serif",
    size: "1.05rem",
    lineHeight: "1.75"
  },
  meta: {
    family: "\"IBM Plex Sans\", sans-serif",
    size: "0.8rem",
    tracking: "0.08em"
  }
} as const;
