import "./globals.css";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { DEFAULT_METADATA } from "../components/seo-metadata";

export const metadata = DEFAULT_METADATA;

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
