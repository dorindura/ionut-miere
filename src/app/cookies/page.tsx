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

/** strict necesare: funcționează fără acordul vizitatorului */
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

/** de analiză: se pun doar dacă apeși „Accept” în bannerul de cookie-uri */
const ANALYTICS_COOKIES = [
    {
        name: "_ga, _ga_*",
        purpose: "Google Analytics: numără vizitatorii și paginile vizitate, ca să știm ce sortimente sunt căutate.",
        duration: "Până la 2 ani",
    },
    {
        name: "_fbp",
        purpose: "Meta Pixel: măsoară câte comenzi vin din reclamele și postările de pe Facebook.",
        duration: "3 luni",
    },
    {
        name: "pa-consent",
        purpose: "Ține minte dacă ai acceptat sau ai refuzat cookie-urile de analiză, ca să nu te mai întrebăm.",
        duration: "Până îl ștergi din browser",
    },
];

export default function CookiesPage() {
    return (
        <LegalPage
            title="Politica de cookies"
            intro={
                <p>
                    Cookie-urile sunt fișiere mici salvate de browser. Cele{" "}
                    <strong>strict necesare</strong> fac să funcționeze coșul și contul. Pe lângă ele folosim{" "}
                    <strong>cookie-uri de analiză</strong>, dar numai dacă ne dai acordul în bannerul care apare la
                    prima vizită.
                </p>
            }
        >
            <LegalSection title="1. Cookie-uri strict necesare">
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

            <LegalSection title="2. Cookie-uri de analiză">
                <p>
                    Le punem <strong>doar dacă apeși „Accept”</strong> în bannerul de la prima vizită. Dacă alegi
                    „Refuz” sau închizi pagina, scripturile Google Analytics și Meta Pixel nici măcar nu se încarcă.
                </p>
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
                            {ANALYTICS_COOKIES.map((c) => (
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
                    Datele ajung la Google Ireland Limited și Meta Platforms Ireland Limited, care le prelucrează ca
                    operatori proprii. Nu le trimitem numele, adresa sau telefonul.
                </p>
            </LegalSection>

            <LegalSection title="3. Servicii terțe">
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

            <LegalSection title="4. Consimțământ și control">
                <p>
                    Cookie-urile strict necesare nu au nevoie de consimțământ (Legea nr. 506/2004), pentru că fără ele
                    coșul și autentificarea nu funcționează. Le poți șterge sau bloca din setările browserului, dar
                    atunci coșul și contul nu vor mai merge corect.
                </p>
                <p>
                    Pentru cele de analiză îți cerem acordul înainte să le punem, iar alegerea ți-o ținem minte. Dacă
                    te răzgândești, șterge datele site-ului din setările browserului: la următoarea vizită te întrebăm
                    din nou.
                </p>
                <p>
                    Despre datele personale scrie în{" "}
                    <Link href="/confidentialitate">Politica de confidențialitate</Link>, iar pentru orice întrebare ne
                    găsești la {SITE.email}.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
