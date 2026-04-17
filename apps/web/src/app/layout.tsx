import "./globals.css";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

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
