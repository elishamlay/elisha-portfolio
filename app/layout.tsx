import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/vt323/400.css";
import "./globals.css";

const description =
  "Elisha Mlay is a data analyst and revenue assurance specialist at CRDB Bank in Dar es Salaam. SQL and PL/SQL, Power BI, anomaly detection, and web projects.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "Elisha Mlay",
  description,
  authors: [{ name: "Elisha Bariki Mlay" }],
  openGraph: {
    title: "Elisha Mlay",
    description,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Elisha Mlay", description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c1311" },
    { media: "(prefers-color-scheme: light)", color: "#f1f4ef" },
  ],
};

// Applies a saved theme before first paint so there is no flash.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
