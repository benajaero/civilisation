import { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://civilisation-web.vercel.app";
const SITE_NAME = "The Library of Civilisation";
const SITE_DESCRIPTION =
  "Every civilisation's foundational texts, indexed in one place, held in public trust — from the Epic of Gilgamesh to the Universal Declaration, in the languages they were written.";

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "literature",
    "classics",
    "public domain",
    "ancient texts",
    "Greek",
    "Sanskrit",
    "Chinese",
    "Arabic",
    "Epic of Gilgamesh",
    "Iliad",
    "Odyssey",
    "digital library",
    "archive",
  ],
  authors: [{ name: "Ninth Heaven Literature & Arts Association (NHLAA)" }],
  creator: "Ninth Heaven Literature & Arts Association",
  publisher: "Ninth Heaven Literature & Arts Association",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: "@civilisation",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: SITE_URL,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
};

export const Favicon = {
  icon: "/favicon.ico",
  apple: "/apple-touch-icon.png",
};