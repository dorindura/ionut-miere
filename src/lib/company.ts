/**
 * Datele vânzătorului, folosite în subsol și în paginile legale
 * (Termeni, Confidențialitate, Cookies, Retur) - cerute de NETOPIA și ANPC.
 *
 * Valorile „[DE COMPLETAT: …]" trebuie completate înainte de publicare
 * (caută „DE COMPLETAT" în proiect ca să le găsești pe toate).
 */

function todo(what: string): string {
    return `[DE COMPLETAT: ${what}]`;
}

const REGISTERED_ADDRESS = "Sat Gârde, Str. Principală nr. 125, Com. Bistra, Jud. Alba";

export const COMPANY = {
    brandName: "Prisaca Apuseni",
    siteUrl: "https://prisaca-apuseni.com",
    legalName: "Bucea Darius Ionuț Persoană Fizică Autorizată",
    cui: "48123768",
    regCom: "F2023000465013",
    address: REGISTERED_ADDRESS,
    phone: "+40 752 819 170",
    email: "buceadariusionut@gmail.com",
    // adresa la care clientul trimite produsele returnate (provizoriu = sediul, de confirmat cu Ionuț)
    returnAddress: REGISTERED_ADDRESS,
    // furnizorul de hosting al site-ului (apare în politica de confidențialitate)
    hostingProvider: "Vercel",
} as const;

/** true = prețurile includ TVA; false = neplătitor de TVA; null = de completat. */
export const VAT_PAYER: boolean | null = false;

/** Politica de retur - de confirmat cu Ionuț. */
export const RETURNS = {
    // transportul la retur îl plătește clientul (permis de OUG 34/2014, dacă e anunțat dinainte)
    customerPaysReturnShipping: true,
    // borcanele desigilate nu se pot returna din motive de igienă (art. 16 lit. e OUG 34/2014)
    acceptsUnsealedJars: false,
};

export const LEGAL_LAST_UPDATED = "14 septembrie 2026";

export const ANPC_SAL_URL = "https://anpc.ro/sal";

/**
 * Logourile oficiale din /public: bannerul NETOPIA Payments + Mastercard + Visa (kitul NETOPIA
 * pentru parteneri, varianta pe fundal închis) și pictograma SAL de pe anpc.ro.
 */
export const BADGE_IMAGES = {
    // 1852x349
    netopiaCards: "/images/plati/netopia-visa-mastercard.png",
    // 201x50
    anpcSal: "/images/plati/anpc-sal.png",
} as const;

export function vatNotice(): string {
    if (VAT_PAYER === true) return "Prețurile sunt afișate în lei (RON) și includ TVA.";
    if (VAT_PAYER === false) return "Prețurile sunt afișate în lei (RON). Vânzătorul nu este plătitor de TVA.";
    return `Prețurile sunt afișate în lei (RON). ${todo("plătitor de TVA? da / nu")}`;
}
