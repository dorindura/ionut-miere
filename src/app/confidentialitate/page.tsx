import Link from "next/link";
import LegalPage, { CompanyDetails, LegalSection } from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata = {
    title: "Politica de confidențialitate",
    description: "Cum colectăm, folosim și protejăm datele personale ale clienților Prisaca Apuseni.",
};

export default function ConfidentialitatePage() {
    return (
        <LegalPage
            title="Politica de confidențialitate"
            intro={
                <p>
                    Această politică explică ce date personale prelucrăm când folosești site-ul sau comanzi de la
                    noi, de ce, cui le transmitem și ce drepturi ai, conform Regulamentului (UE) 2016/679 (GDPR).
                </p>
            }
        >
            <LegalSection title="1. Cine prelucrează datele">
                <p>Operatorul datelor este:</p>
                <CompanyDetails />
                <p>Pentru orice întrebare despre datele tale ne poți scrie la {COMPANY.email}.</p>
            </LegalSection>

            <LegalSection title="2. Ce date colectăm">
                <ul>
                    <li>
                        <strong>La comandă:</strong> nume, email, telefon, adresa de livrare (stradă, localitate, județ,
                        cod poștal) sau easybox-ul ales, produsele comandate și metoda de plată.
                    </li>
                    <li>
                        <strong>Pentru cont:</strong> email și parolă (stocată doar criptat, sub formă de hash).
                    </li>
                    <li>
                        <strong>La plata cu cardul:</strong> nu primim și nu stocăm datele cardului. Ele sunt
                        introduse direct pe pagina NETOPIA Payments; de la NETOPIA primim doar statusul plății și
                        identificatorul tranzacției. Pentru securitatea plății (inclusiv 3D Secure), transmitem către
                        NETOPIA adresa IP și tipul de browser.
                    </li>
                    <li>
                        <strong>Formularul de contact:</strong> nume, email și mesajul tău.
                    </li>
                    <li>
                        <strong>Formularul de retragere:</strong> nume, email, telefon, numărul comenzii, produsele
                        returnate și, pentru comenzile plătite ramburs, IBAN-ul pentru rambursare.
                    </li>
                    <li>
                        <strong>Date tehnice:</strong> cookie-uri strict necesare (vezi{" "}
                        <Link href="/cookies">Politica de cookies</Link>) și jurnalele serverului.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="3. De ce folosim datele și pe ce temei">
                <ul>
                    <li>
                        <strong>Procesarea și livrarea comenzilor, plata și retururile</strong> - executarea
                        contractului (art. 6 alin. 1 lit. b GDPR).
                    </li>
                    <li>
                        <strong>Facturare, evidență contabilă și protecția consumatorilor</strong> - obligații legale
                        (art. 6 alin. 1 lit. c GDPR).
                    </li>
                    <li>
                        <strong>Răspuns la mesaje, securitatea site-ului, prevenirea fraudei și apărarea
                        drepturilor noastre</strong> - interesul nostru legitim (art. 6 alin. 1 lit. f GDPR).
                    </li>
                </ul>
                <p>Nu trimitem newslettere, nu folosim datele pentru publicitate și nu le vindem.</p>
            </LegalSection>

            <LegalSection title="4. Cui transmitem datele">
                <p>Doar furnizorilor de care avem nevoie ca să funcționeze magazinul, strict pentru acest scop:</p>
                <ul>
                    <li><strong>Sameday</strong> - livrarea coletelor (nume, telefon, adresă sau easybox).</li>
                    <li><strong>NETOPIA Payments</strong> - procesarea plăților cu cardul.</li>
                    <li><strong>Neon</strong> - baza de date a magazinului (servere în Uniunea Europeană).</li>
                    <li><strong>Resend</strong> - trimiterea emailurilor de confirmare.</li>
                    <li><strong>{COMPANY.hostingProvider}</strong> - găzduirea site-ului.</li>
                    <li>Contabilului și autorităților, atunci când legea ne obligă.</li>
                </ul>
                <p>
                    Unii furnizori (de exemplu Resend și Vercel) pot prelucra date în afara Spațiului Economic European; în
                    aceste cazuri transferul se face cu garanții adecvate, precum clauzele contractuale standard
                    aprobate de Comisia Europeană.
                </p>
            </LegalSection>

            <LegalSection title="5. Cât timp păstrăm datele">
                <ul>
                    <li>Datele comenzilor și facturile - pe perioada impusă de legislația contabilă și fiscală.</li>
                    <li>Contul de client - până când ne ceri ștergerea lui.</li>
                    <li>Mesajele și cererile de retragere - cât este necesar pentru a le rezolva și pentru eventuale reclamații.</li>
                </ul>
            </LegalSection>

            <LegalSection title="6. Drepturile tale">
                <p>Ai dreptul:</p>
                <ul>
                    <li>să afli ce date avem despre tine și să primești o copie;</li>
                    <li>să ceri corectarea datelor greșite;</li>
                    <li>să ceri ștergerea datelor, când nu mai avem obligația legală să le păstrăm;</li>
                    <li>să ceri restricționarea prelucrării sau să te opui prelucrării bazate pe interes legitim;</li>
                    <li>să primești datele într-un format structurat (portabilitate).</li>
                </ul>
                <p>
                    Pentru oricare dintre ele, scrie-ne la {COMPANY.email}. Ai și dreptul să depui o plângere la
                    Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP):{" "}
                    <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer">dataprotection.ro</a>.
                </p>
            </LegalSection>

            <LegalSection title="7. Securitate">
                <p>
                    Site-ul folosește conexiune criptată (HTTPS), parolele sunt stocate doar sub formă de hash, iar
                    datele cardului sunt procesate exclusiv de NETOPIA Payments.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
