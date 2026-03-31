export type Products = {
    id: string;
    slug: string;
    name: string;
    shortDescription: string;
    description: string;
    priceRon: number;
    weight: string;
    images: string[];
    inStock: boolean;
    details: {
        origin?: string;
        howItsMade?: string;
        characteristics: string[];
        benefits: string[];
        consumption: string[];
    };
};

export const products: Products[] = [
    {
        id: "mana-1000",
        slug: "miere-mana-brad-1000g",
        name: "Miere de mană de brad",
        shortDescription:
            "Produs rar din Munții Apuseni, cu gust intens și note rășinoase.",
        description:
            "Miere obținută din mană (nu din nectar floral), cu culoare închisă, textură densă și profil bogat în minerale.",
        priceRon: 80,
        weight: "1000g",
        images: ["/images/mana-de-brad.jpeg"],
        inStock: true,
        details: {
            origin:
                "Specifică zonelor montane cu păduri de conifere din Munții Apuseni, apare doar în anumite condiții climatice favorabile.",
            howItsMade:
                "Albinele culeg mană (secreții dulci) de pe acele și ramurile bradului, lăsată de insecte care se hrănesc cu seva, apoi o transformă natural în miere.",
            characteristics: [
                "Culoare închisă, brun-verzuie",
                "Textură densă și catifelată",
                "Gust intens, ușor caramelizat, cu note rășinoase",
                "Mai puțin dulce decât mierea florală",
            ],
            benefits: [
                "Conținut ridicat de minerale (potasiu, magneziu, fier)",
                "Puternic antioxidant natural",
                "Susține imunitatea și sănătatea căilor respiratorii",
                "Efect antibacterian și energizant",
            ],
            consumption: [
                "1–2 lingurițe pe zi",
                "Evită adăugarea în lichide fierbinți pentru a păstra proprietățile",
            ],
        },
    },
    {
        id: "mana-500",
        slug: "miere-mana-brad-500g",
        name: "Miere de mană de brad",
        shortDescription:
            "Produs rar din Munții Apuseni, cu gust intens și note rășinoase.",
        description:
            "Aceeași miere de mană, în borcan de 500g — ideal pentru test sau cadou.",
        priceRon: 45,
        weight: "500g",
        images: ["/images/miere-mana-de-brad-la-jumatate.jpeg"],
        inStock: true,
        details: {
            origin:
                "Specifică zonelor montane cu păduri de conifere din Munții Apuseni.",
            howItsMade:
                "Albinele culeg mană de pe acele și ramurile bradului și o transformă natural în miere.",
            characteristics: [
                "Culoare închisă, brun-verzuie",
                "Textură densă și catifelată",
                "Note rășinoase, ușor caramelizate",
            ],
            benefits: [
                "Bogată în minerale",
                "Antioxidant natural",
                "Susține imunitatea",
            ],
            consumption: [
                "1–2 lingurițe pe zi",
                "Evită lichidele fierbinți",
            ],
        },
    },
    {
        id: "salcam-1000",
        slug: "miere-salcam-1000g",
        name: "Miere de salcâm",
        shortDescription:
            "Fină, limpede, ideală pentru îndulcire fără aromă puternică.",
        description:
            "Miere de salcâm cu textură fluidă și cristalizare foarte lentă, datorită conținutului ridicat de fructoză.",
        priceRon: 75,
        weight: "1000g",
        images: ["/images/miere-de-salcam.jpeg"],
        inStock: true,
        details: {
            origin:
                "Obținută din nectarul florilor de salcâm, din zone curate și nepoluate.",
            characteristics: [
                "Culoare foarte deschisă, aproape transparentă",
                "Textură fluidă, clară",
                "Aromă discret florală",
                "Cristalizare foarte lentă",
            ],
            benefits: [
                "Ușor asimilabilă de organism",
                "Energizant natural rapid",
                "Delicată cu sistemul digestiv",
                "Ideală pentru îndulcirea băuturilor fără a le modifica aroma",
            ],
            consumption: [
                "1–2 lingurițe pe zi",
                "În ceaiuri călduțe, cafea, limonadă sau deserturi",
            ],
        },
    },
    {
        id: "salcam-500",
        slug: "miere-salcam-500g",
        name: "Miere de salcâm",
        shortDescription:
            "Fină, limpede, ideală pentru îndulcire fără aromă puternică.",
        description:
            "Borcan 500g — perfect pentru consum zilnic sau cadou.",
        priceRon: 45,
        weight: "500g",
        images: ["/images/miere-de-salcam-la-jumatate.jpeg"],
        inStock: true,
        details: {
            origin:
                "Obținută din nectarul florilor de salcâm, din zone curate și nepoluate.",
            characteristics: [
                "Textură fluidă",
                "Aromă discret florală",
                "Cristalizare lentă",
            ],
            benefits: [
                "Ușor asimilabilă",
                "Delicată cu digestia",
                "Îndulcire naturală",
            ],
            consumption: [
                "1–2 lingurițe pe zi",
                "Evită lichidele fierbinți",
            ],
        },
    },
    {
        id: "tei-1000",
        slug: "miere-tei-1000g",
        name: "Miere de tei",
        shortDescription:
            "Aromă intensă, florală, cu note ușor mentolate.",
        description:
            "Miere de tei în borcan de 1000g — parfum inconfundabil, cristalizează natural în timp.",
        priceRon: 85,
        weight: "1000g",
        images: ["/images/miere-de-tei.jpeg"],
        inStock: true,
        details: {
            origin:
                "Obținută din nectarul florilor de tei, în perioada înfloririi de la începutul verii.",
            characteristics: [
                "Culoare galben-aurie (uneori reflexii verzui)",
                "Aromă intens florală",
                "Gust dulce, ușor mentolat",
                "Cristalizare naturală",
            ],
            benefits: [
                "Efect calmant și relaxant",
                "Susține un somn liniștit",
                "Poate ajuta în răceli și afecțiuni respiratorii",
            ],
            consumption: [
                "1–2 lingurițe pe zi",
                "În ceaiuri călduțe sau cu lămâie",
            ],
        },
    },
    {
        id: "tei-500",
        slug: "miere-tei-500g",
        name: "Miere de tei",
        shortDescription:
            "Aromă intensă, ușor mentolată, perfectă în sezonul rece.",
        description:
            "Borcan 500g — alegerea ideală pentru familie sau cadou.",
        priceRon: 50,
        weight: "500g",
        images: ["/images/miere-de-tei-la-jumatate.jpeg"],
        inStock: true,
        details: {
            origin:
                "Obținută din nectarul florilor de tei.",
            characteristics: [
                "Aromă intens florală",
                "Note ușor mentolate",
                "Cristalizare naturală",
            ],
            benefits: [
                "Calmantă",
                "Sprijină somnul",
                "Antibacteriană",
            ],
            consumption: [
                "1–2 lingurițe pe zi",
                "Evită lichidele fierbinți",
            ],
        },
    },
    {
        id: "poliflora-1000",
        slug: "miere-poliflora-1000g",
        name: "Miere polifloră de munte",
        shortDescription:
            "Profil complex din flora spontană a Munților Apuseni.",
        description:
            "Miere polifloră de munte, aromă variată în funcție de flora sezonului. Cristalizare naturală în timp.",
        priceRon: 85,
        weight: "1000g",
        images: ["/images/miere-poliflora-de-munte.jpeg"],
        inStock: true,
        details: {
            origin:
                "Din zone montane înalte și nepoluate, cu biodiversitate florală ridicată.",
            characteristics: [
                "Culoare galben-auriu până la chihlimbar",
                "Aromă florală, proaspătă, ușor fructată",
                "Gust echilibrat, note variate",
                "Cristalizare naturală",
            ],
            benefits: [
                "Susține imunitatea",
                "Energizant natural",
                "Aport natural de vitamine, enzime și minerale",
                "Potrivită pentru consum zilnic",
            ],
            consumption: [
                "1–2 lingurițe pe zi",
                "În ceaiuri călduțe sau ca îndulcitor natural",
            ],
        },
    },
    {
        id: "poliflora-500",
        slug: "miere-poliflora-500g",
        name: "Miere polifloră de munte",
        shortDescription:
            "Miere completă, pentru consum zilnic — borcan 500g.",
        description:
            "Variantă 500g, ideală pentru test sau pentru cadou.",
        priceRon: 45,
        weight: "500g",
        images: ["/images/miere-poliflora-de-munte-la-jumatate.jpeg"],
        inStock: true,
        details: {
            origin:
                "Din flora spontană de munte, în zone nepoluate.",
            characteristics: [
                "Aromă florală",
                "Gust echilibrat",
                "Cristalizare naturală",
            ],
            benefits: [
                "Susține imunitatea",
                "Energizant natural",
                "Potrivită zilnic",
            ],
            consumption: [
                "1–2 lingurițe pe zi",
                "Evită lichidele fierbinți",
            ],
        },
    },
];