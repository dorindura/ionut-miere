import Link from "next/link";
import LegalPage, { CompanyDetails, LegalSection } from "@/components/LegalPage";
import { ANPC_SAL_URL, COMPANY, vatNotice } from "@/lib/company";
import { EASYBOX_CARD_ONLY_NOTE, SHIPPING_RON } from "@/lib/shipping";

export const metadata = {
    title: "Termeni și condiții",
    description: "Termenii și condițiile de vânzare pentru magazinul online Prisaca Apuseni.",
};

export default function TermeniPage() {
    return (
        <LegalPage
            title="Termeni și condiții"
            intro={
                <p>
                    Acești termeni se aplică tuturor comenzilor plasate pe {COMPANY.siteUrl.replace("https://", "")}.
                    Plasând o comandă, confirmi că i-ai citit și ești de acord cu ei. Pentru comenzi se aplică
                    versiunea termenilor în vigoare la data plasării comenzii.
                </p>
            }
        >
            <LegalSection title="1. Cine vinde">
                <p>
                    Site-ul este administrat de <strong>{COMPANY.legalName}</strong>, care este{" "}
                    <strong>producătorul (apicultorul) și vânzătorul</strong> produselor. Nu acționăm ca intermediar
                    sau marketplace: comanda se încheie direct cu noi, iar factura este emisă de {COMPANY.legalName}.
                </p>
                <CompanyDetails />
            </LegalSection>

            <LegalSection title="2. Comanda și încheierea contractului">
                <ul>
                    <li>Poți comanda cu sau fără cont. Datele din formularul de comandă trebuie să fie corecte și complete.</li>
                    <li>După plasare primești pe email un sumar al comenzii. Pentru plata ramburs, putem confirma comanda și telefonic.</li>
                    <li>
                        Contractul se încheie la confirmarea comenzii de către noi. Pentru plata cu cardul, comanda se
                        procesează după confirmarea plății.
                    </li>
                    <li>
                        Putem refuza sau anula o comandă (de exemplu, produs indisponibil sau date de livrare
                        incomplete). Te anunțăm, iar dacă ai plătit deja, îți returnăm integral banii.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="3. Produse și prețuri">
                <ul>
                    <li>
                        Mierea este un produs natural: culoarea, textura și gustul pot varia de la un lot la altul, iar
                        cristalizarea este un proces normal, nu un defect.
                    </li>
                    <li>Imaginile au rol de prezentare; ambalajul poate diferi ușor.</li>
                    <li>{vatNotice()}</li>
                    <li>Costul livrării este afișat separat, înainte de plasarea comenzii.</li>
                    <li>Informațiile despre beneficii sunt generale și nu înlocuiesc recomandările medicale.</li>
                </ul>
            </LegalSection>

            <LegalSection title="4. Metode de plată">
                <ul>
                    <li>
                        <strong>Card online (Visa, Mastercard)</strong>, prin procesatorul de plăți{" "}
                        <strong>NETOPIA Payments</strong>. Datele cardului se introduc pe pagina securizată NETOPIA și
                        nu ajung la noi și nu sunt stocate de noi. Comanda se procesează după confirmarea plății.
                    </li>
                    <li>
                        <strong>Ramburs la livrare</strong>: plătești la primirea coletului. {EASYBOX_CARD_ONLY_NOTE}
                    </li>
                    <li>Nu percepem comisioane suplimentare pentru metoda de plată aleasă.</li>
                </ul>
            </LegalSection>

            <LegalSection title="5. Livrare">
                <ul>
                    <li>Livrăm doar în România, prin curierul Sameday.</li>
                    <li>
                        Cost livrare: <strong>{SHIPPING_RON.ADDRESS} RON</strong> la adresă sau{" "}
                        <strong>{SHIPPING_RON.EASYBOX} RON</strong> la easybox, pe comandă.
                    </li>
                    <li>
                        Comenzile se expediază de regulă în 24–48 de ore lucrătoare de la confirmare. Termenul de livrare
                        depinde de curier și de destinație.
                    </li>
                    <li>
                        Te rugăm să verifici coletul la primire. Dacă este deteriorat sau produsele nu corespund,
                        anunță-ne cât mai repede (cu poze), la {COMPANY.email}.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="6. Dreptul de retragere și retururi">
                <p>
                    Ai dreptul să te retragi din contract în 14 zile de la primirea produselor, fără să motivezi
                    decizia, conform OUG nr. 34/2014. Condițiile, excepțiile și formularul online de retragere se
                    găsesc pe pagina <Link href="/retur">Retur și formular de retragere</Link>.
                </p>
            </LegalSection>

            <LegalSection title="7. Conformitatea produselor și reclamații">
                <p>
                    Răspundem pentru lipsa de conformitate a produselor, conform OUG nr. 140/2021. Pentru orice
                    reclamație ne poți scrie la {COMPANY.email} sau ne poți suna la {COMPANY.phone}; îți răspundem
                    în cel mai scurt timp, în termenul prevăzut de lege.
                </p>
            </LegalSection>

            <LegalSection title="8. Soluționarea litigiilor">
                <p>
                    Încercăm să rezolvăm amiabil orice nemulțumire. Dacă nu reușim, te poți adresa Autorității
                    Naționale pentru Protecția Consumatorilor prin procedura de soluționare alternativă a litigiilor
                    (SAL): <a href={ANPC_SAL_URL} target="_blank" rel="noopener noreferrer">anpc.ro/sal</a>,
                    sau instanțelor competente din România.
                </p>
            </LegalSection>

            <LegalSection title="9. Contul de client">
                <p>
                    Dacă îți creezi cont, ești responsabil pentru păstrarea confidențialității parolei. Poți cere
                    ștergerea contului oricând, la {COMPANY.email}.
                </p>
            </LegalSection>

            <LegalSection title="10. Date personale și cookies">
                <p>
                    Modul în care prelucrăm datele este descris în{" "}
                    <Link href="/confidentialitate">Politica de confidențialitate</Link>, iar cookie-urile folosite în{" "}
                    <Link href="/cookies">Politica de cookies</Link>.
                </p>
            </LegalSection>

            <LegalSection title="11. Proprietate intelectuală și legea aplicabilă">
                <p>
                    Textele, fotografiile și elementele grafice de pe site aparțin {COMPANY.legalName} și nu pot fi
                    folosite fără acordul nostru. Acești termeni sunt guvernați de legislația din România.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
