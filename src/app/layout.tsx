import type { Metadata, Viewport } from "next";
import { Big_Shoulders_Stencil, Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HideOnAdmin from "@/components/HideOnAdmin";

const display = Bricolage_Grotesque({
    subsets: ["latin", "latin-ext"],
    axes: ["opsz", "wdth"],
    variable: "--font-bricolage",
    display: "swap",
});

const body = Figtree({
    subsets: ["latin", "latin-ext"],
    variable: "--font-body",
    display: "swap",
});

const stencil = Big_Shoulders_Stencil({
    subsets: ["latin", "latin-ext"],
    variable: "--font-stencil-face",
    display: "swap",
});

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
    verification: {
        google: "p-OeXjZWCKvFbvy2Eiq5MFE8Gxk7E8_bOx2sFr2OblI",
    },
};

export const viewport: Viewport = {
    themeColor: "#f5f6f0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ro" className={`${display.variable} ${body.variable} ${stencil.variable}`}>
        <body className="flex min-h-screen flex-col antialiased">
        <a
            href="#continut"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-wash"
        >
            Sari la conținut
        </a>

        <HideOnAdmin>
            <Navbar brandName={brandName} />
        </HideOnAdmin>

        <div id="continut" className="flex-1">
            {children}
        </div>

        <HideOnAdmin>
            <Footer brandName={brandName} />
        </HideOnAdmin>
        </body>
        </html>
    );
}
