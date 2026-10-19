/** Datele publice ale prisăcii: folosite în pagini, subsol și datele structurate pentru Google. */
export const SITE = {
    name: "Prisaca Apuseni",
    url: "https://prisaca-apuseni.com",
    phone: "+40 752 819 170",
    email: "buceadariusionut@gmail.com",
    facebook: "https://www.facebook.com/profile.php?id=100074595265557",
    address: {
        locality: "Gârde, comuna Bistra",
        region: "Alba",
        country: "RO",
    },
};

/** zile în care clientul poate returna produsele; returul îl plătește prisaca */
export const RETURN_DAYS = 14;

/** URL absolut pentru o cale relativă („/images/x.jpg") sau lasă neschimbat un URL complet */
export function absoluteUrl(path: string): string {
    return new URL(path, SITE.url).toString();
}

/**
 * Datele de identificare ale vânzătorului, cerute de NETOPIA și ANPC.
 * Apar în subsol și în paginile legale (Termeni, Confidențialitate, Cookies, Retur).
 */
export const LEGAL = {
    legalName: "Bucea Darius Ionuț Persoană Fizică Autorizată",
    cui: "48123768",
    regCom: "F2023000465013",
    registeredAddress: "Sat Gârde, Str. Principală nr. 125, Com. Bistra, Jud. Alba",
    // neplătitor de TVA: prețurile nu conțin TVA
    vatPayer: false,
    lastUpdated: "19 octombrie 2026",
    anpcSalUrl: "https://anpc.ro/sal",
    badges: {
        // pictograma oficială de pe anpc.ro (201x50)
        anpcSal: "/images/plati/anpc-sal.png",
        // bannerul din kitul NETOPIA pentru parteneri (1852x349)
        netopiaCards: "/images/plati/netopia-visa-mastercard.png",
    },
} as const;

/** Adresa la care clientul trimite produsele returnate. */
export const RETURN_ADDRESS = LEGAL.registeredAddress;
