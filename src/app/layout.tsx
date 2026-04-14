import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const brandName = "Prisaca Apuseni";

export const metadata: Metadata = {
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