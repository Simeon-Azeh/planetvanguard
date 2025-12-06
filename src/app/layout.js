import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "Planet Vanguard",
  description: "Voices into Action",
  keywords: "climate change, Africa, sustainability, environmental action, planet vanguard, green initiatives",
  author: "Planet Vanguard",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Planet Vanguard",
    description: "Voices into Action - Driving sustainable change in Africa through community initiatives and environmental advocacy.",
    url: "https://planetvanguard.org",
    siteName: "Planet Vanguard",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Planet Vanguard - Voices into Action",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Planet Vanguard",
    description: "Voices into Action - Driving sustainable change in Africa through community initiatives and environmental advocacy.",
    images: ["/og-image.jpg"], // Same image as Open Graph
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}