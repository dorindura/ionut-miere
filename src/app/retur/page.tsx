import LegalPage, { LegalSection } from "@/components/LegalPage";
import WithdrawalForm from "@/components/WithdrawalForm";
import { COMPANY, RETURNS } from "@/lib/company";

export const metadata = {
    title: "Retur și formular de retragere",
    description: "Dreptul de retragere în 14 zile, condițiile de retur și formularul online de retragere.",
};

export default function ReturPage() {
    return (
        <LegalPage
            title="Retur și formular de retragere"
            intro={
                <p>
                    Conform OUG nr. 34/2014, ai dreptul să te retragi din contract în{" "}
                    <strong>14 zile calendaristice de la primirea produselor</strong>, fără să motivezi decizia.
                </p>
            }
        >
            <LegalSection title="1. Cum te retragi">
                <ul>
                    <li>
                        Completează <a href="#formular">formularul online de mai jos</a> - primești imediat pe email
                        confirmarea de primire a cererii; sau
                    </li>
                    <li>
                        trimite-ne o declarație clară (poți folosi <a href="#model">modelul de formular</a>) la{" "}
                        {COMPANY.email}.
                    </li>
                </ul>
                <p>Este suficient să trimiți cererea înainte de expirarea celor 14 zile.</p>
            </LegalSection>

            <LegalSection title="2. Returnarea produselor">
                <ul>
                    <li>
                        Trimite produsele în cel mult 14 zile de la cererea de retragere, la adresa:{" "}
                        <strong>{COMPANY.returnAddress}</strong>.
                    </li>
                    <li>
                        {RETURNS.customerPaysReturnShipping
                            ? "Costul transportului pentru retur este suportat de client."
                            : "Costul transportului pentru retur este suportat de noi."}
                    </li>
                    <li>
                        Ambalează produsele cu grijă: răspunzi pentru diminuarea valorii lor cauzată de o manipulare
                        care depășește ceea ce este necesar pentru verificarea lor.
                    </li>
                    {RETURNS.acceptsUnsealedJars ? null : (
                        <li>
                            <strong>Excepție:</strong> borcanele desigilate nu pot fi returnate, fiind produse sigilate
                            care nu pot fi returnate din motive de igienă și de protecție a sănătății (art. 16 lit. e
                            din OUG nr. 34/2014).
                        </li>
                    )}
                </ul>
            </LegalSection>

            <LegalSection title="3. Rambursarea banilor">
                <ul>
                    <li>
                        Îți returnăm toate sumele plătite, inclusiv costul livrării standard, în cel mult 14 zile de
                        la primirea cererii de retragere.
                    </li>
                    <li>Putem amâna rambursarea până primim produsele înapoi sau dovada că le-ai expediat.</li>
                    <li>
                        <strong>Plată cu cardul:</strong> banii se returnează pe același card, prin NETOPIA Payments.
                    </li>
                    <li>
                        <strong>Plată ramburs:</strong> banii se returnează prin transfer bancar, în contul (IBAN)
                        indicat de tine.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="4. Produs deteriorat sau greșit">
                <p>
                    Dacă ai primit un produs deteriorat, greșit sau neconform, nu este nevoie să folosești dreptul de
                    retragere: scrie-ne la {COMPANY.email} (cu poze) și îl înlocuim sau îți returnăm banii, pe
                    costul nostru.
                </p>
            </LegalSection>

            <LegalSection title="5. Formular online de retragere" id="formular">
                <WithdrawalForm contactEmail={COMPANY.email} />
            </LegalSection>

            <LegalSection title="6. Model de formular de retragere" id="model">
                <p className="text-xs text-neutral-400">
                    (Anexa nr. 1 la OUG nr. 34/2014 - completează și trimite doar dacă dorești să te retragi din
                    contract)
                </p>
                <div className="rounded-2xl border border-yellow-500/10 bg-neutral-950/40 p-4">
                    <p>
                        Către {COMPANY.legalName}, {COMPANY.address}, {COMPANY.email}:
                    </p>
                    <p className="mt-2">
                        Vă informez prin prezenta cu privire la retragerea mea din contractul referitor la vânzarea
                        următoarelor produse: ………………………
                    </p>
                    <ul className="mt-2">
                        <li>Comandate la data ……… / primite la data ………</li>
                        <li>Numărul comenzii: ………</li>
                        <li>Numele consumatorului: ………</li>
                        <li>Adresa consumatorului: ………</li>
                        <li>Semnătura consumatorului (doar dacă formularul este trimis pe hârtie): ………</li>
                        <li>Data: ………</li>
                    </ul>
                </div>
            </LegalSection>
        </LegalPage>
    );
}
