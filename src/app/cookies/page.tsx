import Link from "next/link";
import LegalPage, { LegalSection } from "@/components/LegalPage";

export const metadata = {
    title: "Politica de cookies",
    description: "Ce cookie-uri folosește site-ul Prisaca Apuseni și de ce.",
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
        duration: "Până la delogare sau expirarea sesiunii",
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
                    Cookie-urile sunt fișiere mici salvate de browser. Site-ul nostru folosește{" "}
                    <strong>doar cookie-uri strict necesare</strong> pentru funcționare - nu folosim cookie-uri de
                    analiză sau de publicitate.
                </p>
            }
        >
            <LegalSection title="1. Cookie-urile folosite de noi">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-yellow-500/15 text-neutral-100">
                                <th className="py-2 pr-4 font-semibold">Cookie</th>
                                <th className="py-2 pr-4 font-semibold">La ce folosește</th>
                                <th className="py-2 font-semibold">Durată</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COOKIES.map((c) => (
                                <tr key={c.name} className="border-b border-yellow-500/10 align-top">
                                    <td className="py-2 pr-4 font-mono text-xs text-yellow-200">{c.name}</td>
                                    <td className="py-2 pr-4">{c.purpose}</td>
                                    <td className="py-2">{c.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-neutral-400">
                    Pe conexiunile securizate, numele cookie-urilor de autentificare pot avea prefixul
                    „__Secure-” sau „__Host-”.
                </p>
            </LegalSection>

            <LegalSection title="2. Servicii terțe">
                <ul>
                    <li>
                        <strong>Harta easybox Sameday</strong> (pe pagina de finalizare a comenzii) este încărcată de
                        la Sameday și poate folosi propriile cookie-uri, conform politicii Sameday.
                    </li>
                    <li>
                        <strong>Pagina de plată NETOPIA Payments</strong> se află pe domeniul NETOPIA și folosește
                        cookie-urile proprii, conform politicii NETOPIA.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="3. Consimțământ și control">
                <p>
                    Cookie-urile strict necesare nu necesită consimțământ (Legea nr. 506/2004), pentru că fără ele
                    coșul de cumpărături și autentificarea nu ar funcționa. Le poți șterge sau bloca din setările
                    browserului, dar atunci coșul și contul nu vor mai funcționa corect.
                </p>
                <p>
                    Dacă vom adăuga vreodată cookie-uri de analiză sau publicitate, îți vom cere acordul înainte.
                    Detalii despre datele personale găsești în{" "}
                    <Link href="/confidentialitate">Politica de confidențialitate</Link>.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
