import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { CompanyDetails, LegalSection } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
    title: "Politica de confidențialitate",
    description: "Ce date personale colectăm, de ce, cui le transmitem și ce drepturi ai.",
    alternates: { canonical: "/confidentialitate" },
    openGraph: { url: "/confidentialitate", type: "website", siteName: SITE.name, locale: "ro_RO" },
};

export default function ConfidentialitatePage() {
    return (
        <LegalPage
            title="Politica de confidențialitate"
            intro={
                <p>
                    Aici scrie ce date personale prelucrăm când comanzi de la noi, de ce le folosim, cui le transmitem
                    și ce drepturi ai, conform Regulamentului (UE) 2016/679 (GDPR).
                </p>
            }
        >
            <LegalSection title="1. Cine prelucrează datele">
                <p>Operatorul datelor este:</p>
                <CompanyDetails />
                <p>Pentru orice întrebare despre datele tale, scrie-ne la {SITE.email}.</p>
            </LegalSection>

            <LegalSection title="2. Ce date colectăm">
                <ul>
                    <li>
                        <strong>La comandă:</strong> nume, email, telefon, adresa de livrare (stradă, localitate, județ,
                        cod poștal) sau easybox-ul ales, produsele comandate și metoda de plată.
                    </li>
                    <li><strong>Pentru cont:</strong> emailul și parola, stocată doar criptat (hash).</li>
                    <li>
                        <strong>La plata cu cardul:</strong> nu primim și nu stocăm datele cardului. Ele se introduc
                        direct la NETOPIA Payments, de unde primim doar statusul plății și identificatorul tranzacției.
                        Pentru verificarea 3D Secure trimitem către NETOPIA adresa IP și tipul de browser.
                    </li>
                    <li><strong>Din formularul de contact:</strong> numele, emailul și mesajul tău.</li>
                    <li>
                        <strong>Din formularul de retragere:</strong> nume, email, telefon, numărul comenzii, produsele
                        returnate și IBAN-ul pentru rambursare.
                    </li>
                    <li>
                        <strong>Tehnice:</strong> cookie-uri strict necesare (vezi{" "}
                        <Link href="/cookies">Politica de cookies</Link>) și jurnalele serverului.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="3. De ce le folosim și pe ce temei">
                <ul>
                    <li>
                        <strong>Procesarea comenzii, livrarea, plata și returul</strong> — executarea contractului
                        (art. 6 alin. 1 lit. b GDPR).
                    </li>
                    <li>
                        <strong>Facturare, contabilitate și protecția consumatorilor</strong> — obligații legale
                        (art. 6 alin. 1 lit. c GDPR).
                    </li>
                    <li>
                        <strong>Răspuns la mesaje, securitatea site-ului și prevenirea fraudei</strong> — interesul
                        nostru legitim (art. 6 alin. 1 lit. f GDPR).
                    </li>
                </ul>
                <p>Nu trimitem newslettere, nu folosim datele pentru publicitate și nu le vindem nimănui.</p>
            </LegalSection>

            <LegalSection title="4. Cui transmitem datele">
                <p>Doar furnizorilor de care are nevoie magazinul ca să funcționeze:</p>
                <ul>
                    <li><strong>Sameday</strong> — livrarea coletelor (nume, telefon, adresă sau easybox).</li>
                    <li><strong>NETOPIA Payments</strong> — procesarea plăților cu cardul.</li>
                    <li><strong>Neon</strong> — baza de date a magazinului, pe servere din Uniunea Europeană.</li>
                    <li><strong>Resend</strong> — trimiterea emailurilor de confirmare.</li>
                    <li><strong>Vercel</strong> — găzduirea site-ului.</li>
                    <li>Contabilului și autorităților, când legea ne obligă.</li>
                </ul>
                <p>
                    Resend și Vercel pot prelucra date în afara Spațiului Economic European; transferul se face cu
                    garanții adecvate, precum clauzele contractuale standard aprobate de Comisia Europeană.
                </p>
            </LegalSection>

            <LegalSection title="5. Cât timp le păstrăm">
                <ul>
                    <li>Comenzile și facturile — perioada cerută de legislația contabilă și fiscală.</li>
                    <li>Contul de client — până ceri ștergerea lui.</li>
                    <li>Mesajele și cererile de retragere — cât e nevoie ca să le rezolvăm.</li>
                </ul>
            </LegalSection>

            <LegalSection title="6. Drepturile tale">
                <p>Ai dreptul:</p>
                <ul>
                    <li>să afli ce date avem despre tine și să primești o copie;</li>
                    <li>să ceri corectarea datelor greșite;</li>
                    <li>să ceri ștergerea lor, dacă nu avem obligația legală să le păstrăm;</li>
                    <li>să ceri restricționarea prelucrării sau să te opui celei bazate pe interes legitim;</li>
                    <li>să primești datele într-un format structurat (portabilitate).</li>
                </ul>
                <p>
                    Scrie-ne la {SITE.email} pentru oricare dintre ele. Poți depune și o plângere la Autoritatea
                    Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal:{" "}
                    <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">dataprotection.ro</a>.
                </p>
            </LegalSection>

            <LegalSection title="7. Securitate">
                <p>
                    Site-ul folosește conexiune criptată (HTTPS), parolele sunt stocate doar ca hash, iar datele
                    cardului sunt procesate exclusiv de NETOPIA Payments.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
