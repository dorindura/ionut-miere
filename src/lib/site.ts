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
