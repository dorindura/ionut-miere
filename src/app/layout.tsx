import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const brandName = "Prisaca Apuseni";
const siteUrl = "https://prisaca-apuseni.com";
const description =
    "Miere naturală din Munții Apuseni — salcâm, mană de brad, tei și polifloră, direct de la apicultor. Loturi mici, etichetare clară și livrare în 24–48h.";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: `${brandName} — Miere naturală, direct de la apicultor`,
        template: `%s | ${brandName}`,
    },
    description,
    openGraph: {
        title: `${brandName} — Miere naturală, direct de la apicultor`,
        description,
        url: siteUrl,
        siteName: brandName,
        images: ["/images/horica_bucea.jpg"],
        locale: "ro_RO",
        type: "website",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ro">
        <body className="min-h-screen bg-neutral-950 text-neutral-50 antialiased flex flex-col">
        <Navbar brandName={brandName} />

        <main className="flex-1">
            {children}
        </main>

        <Footer brandName={brandName} />
        </body>
        </html>
    );
}