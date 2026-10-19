import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { CompanyDetails, LegalSection } from "@/components/LegalPage";
import { LEGAL, SITE } from "@/lib/site";
import { EASYBOX_CARD_ONLY_NOTE, SHIPPING_RON } from "@/lib/shipping";

export const metadata: Metadata = {
    title: "Termeni și condiții",
    description: "Condițiile de vânzare, plată, livrare și retur pentru magazinul online Prisaca Apuseni.",
    alternates: { canonical: "/termeni" },
    openGraph: { url: "/termeni", type: "website", siteName: SITE.name, locale: "ro_RO" },
};

export default function TermeniPage() {
    return (
        <LegalPage
            title="Termeni și condiții"
            intro={
                <p>
                    Acești termeni se aplică tuturor comenzilor plasate pe prisaca-apuseni.com. Plasând o comandă,
                    confirmi că i-ai citit. Pentru fiecare comandă se aplică versiunea în vigoare la data plasării ei.
                </p>
            }
        >
            <LegalSection title="1. Cine vinde">
                <p>
                    Site-ul este al <strong>{LEGAL.legalName}</strong>, care este{" "}
                    <strong>apicultorul și vânzătorul</strong> produselor. Nu suntem intermediar sau marketplace:
                    comanda se încheie direct cu noi, iar factura este emisă de {LEGAL.legalName}.
                </p>
                <CompanyDetails />
            </LegalSection>

            <LegalSection title="2. Comanda și încheierea contractului">
                <ul>
                    <li>Poți comanda cu sau fără cont. Datele din formular trebuie să fie corecte și complete.</li>
                    <li>După plasare primești pe email un sumar al comenzii. La plata ramburs te putem suna pentru confirmare.</li>
                    <li>
                        Contractul se încheie când îți confirmăm comanda. La plata cu cardul, comanda se pregătește
                        după confirmarea plății.
                    </li>
                    <li>
                        Putem refuza o comandă (produs indisponibil, date de livrare incomplete). Te anunțăm, iar dacă
                        ai plătit deja, îți returnăm toți banii.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="3. Produse și prețuri">
                <ul>
                    <li>
                        Mierea este produs natural: culoarea, gustul și textura diferă de la un lot la altul, iar
                        cristalizarea este normală, nu un defect.
                    </li>
                    <li>Prețurile sunt în lei (RON). Vânzătorul nu este plătitor de TVA.</li>
                    <li>Costul livrării este afișat separat, înainte să plasezi comanda.</li>
                    <li>Informațiile despre beneficiile mierii sunt generale și nu înlocuiesc sfatul medicului.</li>
                </ul>
            </LegalSection>

            <LegalSection title="4. Metode de plată">
                <ul>
                    <li>
                        <strong>Card online (Visa, Mastercard)</strong>, prin procesatorul{" "}
                        <strong>NETOPIA Payments</strong>. Datele cardului se introduc pe pagina securizată NETOPIA;
                        la noi nu ajung și nu le stocăm.
                    </li>
                    <li>
                        <strong>Ramburs la livrare</strong>: plătești când primești coletul. {EASYBOX_CARD_ONLY_NOTE}
                    </li>
                    <li>Nu percepem comision pentru nicio metodă de plată.</li>
                </ul>
            </LegalSection>

            <LegalSection title="5. Livrare">
                <ul>
                    <li>Livrăm doar în România, prin curierul Sameday.</li>
                    <li>
                        Cost: <strong>{SHIPPING_RON.ADDRESS} RON</strong> la adresă sau{" "}
                        <strong>{SHIPPING_RON.EASYBOX} RON</strong> la easybox, pe comandă.
                    </li>
                    <li>Expediem de regulă în 24–48 de ore lucrătoare de la confirmare.</li>
                    <li>
                        Dacă borcanul a ajuns spart sau ai primit alt produs, trimite-ne o poză la {SITE.email} și îl
                        înlocuim sau îți dăm banii înapoi, pe costul nostru.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="6. Retur și dreptul de retragere">
                <p>
                    Te poți retrage din contract în 14 zile de la primirea coletului, fără să ne spui motivul, conform
                    OUG nr. 34/2014. <strong>Curierul pentru retur îl plătim noi</strong> și îți returnăm prețul
                    produselor împreună cu taxa de livrare. Pașii și formularul online sunt pe pagina{" "}
                    <Link href="/retur">Retur și rambursare</Link>.
                </p>
            </LegalSection>

            <LegalSection title="7. Conformitate și reclamații">
                <p>
                    Răspundem pentru lipsa de conformitate a produselor, conform OUG nr. 140/2021. Scrie-ne la{" "}
                    {SITE.email} sau sună la {SITE.phone}; îți răspundem în termenul prevăzut de lege.
                </p>
            </LegalSection>

            <LegalSection title="8. Soluționarea litigiilor">
                <p>
                    Încercăm să rezolvăm amiabil orice nemulțumire. Dacă nu reușim, te poți adresa Autorității
                    Naționale pentru Protecția Consumatorilor, prin soluționarea alternativă a litigiilor (SAL):{" "}
                    <a href={LEGAL.anpcSalUrl} target="_blank" rel="noopener noreferrer">anpc.ro/sal</a>, sau
                    instanțelor din România.
                </p>
            </LegalSection>

            <LegalSection title="9. Cont, date personale și cookies">
                <p>
                    Dacă îți faci cont, ești responsabil de parola ta; poți cere ștergerea contului la {SITE.email}.
                    Datele personale sunt descrise în{" "}
                    <Link href="/confidentialitate">Politica de confidențialitate</Link>, iar cookie-urile în{" "}
                    <Link href="/cookies">Politica de cookies</Link>.
                </p>
            </LegalSection>

            <LegalSection title="10. Proprietate intelectuală și legea aplicabilă">
                <p>
                    Textele și fotografiile de pe site ne aparțin și nu pot fi folosite fără acordul nostru. Acești
                    termeni sunt guvernați de legea română.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
