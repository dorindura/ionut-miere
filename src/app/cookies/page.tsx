import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
    title: "Politica de cookies",
    description: "Ce cookie-uri folosește site-ul Prisaca Apuseni și de ce.",
    alternates: { canonical: "/cookies" },
    openGraph: { url: "/cookies", type: "website", siteName: SITE.name, locale: "ro_RO" },
};

const COOKIES = [
    {
        name: "cartSessionId",
        purpose: "Ține minte coșul de cumpărături pentru vizitatorii fără cont.",
        duration: "60 de zile",
    },
    {
        name: "next-auth.session-token",
        purpose: "Te păstrează autentificat în contul de client.",
        duration: "Până la delogare",
    },
    {
        name: "next-auth.csrf-token",
        purpose: "Protejează formularele de autentificare împotriva atacurilor CSRF.",
        duration: "Sesiunea de navigare",
    },
    {
        name: "next-auth.callback-url",
        purpose: "Reține pagina la care revii după autentificare.",
        duration: "Sesiunea de navigare",
    },
];

export default function CookiesPage() {
    return (
        <LegalPage
            title="Politica de cookies"
            intro={
                <p>
                    Cookie-urile sunt fișiere mici salvate de browser. Folosim{" "}
                    <strong>doar cookie-uri strict necesare</strong> ca să funcționeze coșul și contul — niciunul
                    pentru analiză sau publicitate.
                </p>
            }
        >
            <LegalSection title="1. Cookie-urile folosite de noi">
                <div className="-mx-4 overflow-x-auto px-4">
                    <table className="w-full min-w-[520px] border-collapse text-left text-[0.95rem]">
                        <thead>
                            <tr className="border-b border-rule text-ink">
                                <th className="py-2 pr-4 font-bold">Cookie</th>
                                <th className="py-2 pr-4 font-bold">La ce folosește</th>
                                <th className="py-2 font-bold">Durată</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COOKIES.map((c) => (
                                <tr key={c.name} className="border-b border-rule align-top">
                                    <td className="py-2.5 pr-4 font-mono text-[0.85rem] text-ink">{c.name}</td>
                                    <td className="py-2.5 pr-4">{c.purpose}</td>
                                    <td className="py-2.5">{c.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-[0.9rem] text-ink-3">
                    Pe conexiunea securizată, cookie-urile de autentificare pot avea prefixul „__Secure-” sau
                    „__Host-”.
                </p>
            </LegalSection>

            <LegalSection title="2. Servicii terțe">
                <ul>
                    <li>
                        <strong>Harta easybox Sameday</strong>, de pe pagina de finalizare a comenzii, se încarcă de la
                        Sameday și poate folosi cookie-urile lor.
                    </li>
                    <li>
                        <strong>Pagina de plată NETOPIA Payments</strong> este pe domeniul NETOPIA și folosește
                        cookie-urile lor.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="3. Consimțământ și control">
                <p>
                    Cookie-urile strict necesare nu au nevoie de consimțământ (Legea nr. 506/2004), pentru că fără ele
                    coșul și autentificarea nu funcționează. Le poți șterge sau bloca din setările browserului, dar
                    atunci coșul și contul nu vor mai merge corect.
                </p>
                <p>
                    Dacă vom adăuga vreodată cookie-uri de analiză sau publicitate, îți vom cere acordul înainte.
                    Despre datele personale scrie în{" "}
                    <Link href="/confidentialitate">Politica de confidențialitate</Link>, iar pentru orice întrebare ne
                    găsești la {SITE.email}.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
