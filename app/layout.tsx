import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "../components/Nav";
import RegisterSW from "../components/RegisterSW";

export const metadata: Metadata = {
  title: "Driver Log",
  description: "Track rideshare earnings, expenses, distance, and time driving.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Driver Log", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1f4fd8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Nav />
        <RegisterSW />
      </body>
    </html>
  );
}
