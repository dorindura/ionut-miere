import type { Metadata } from "next";
import Icon from "@/components/Icon";
import WithdrawalForm from "@/components/WithdrawalForm";
import { RETURN_DAYS, SITE } from "@/lib/site";

export const metadata: Metadata = {
    title: "Retur și rambursare",
    description: `Ne trimiți produsul înapoi în ${RETURN_DAYS} zile și îți dăm banii, inclusiv livrarea. Curierul pentru retur îl plătim noi.`,
    alternates: { canonical: "/retur" },
    openGraph: { url: "/retur", type: "website", siteName: SITE.name, locale: "ro_RO" },
};

const STEPS = [
    {
        icon: "phone" as const,
        title: `Ne anunți în ${RETURN_DAYS} zile`,
        text: `Sună-ne sau scrie-ne în cel mult ${RETURN_DAYS} zile de la primirea coletului, cu numărul comenzii. Nu trebuie să ne spui motivul.`,
    },
    {
        icon: "truck" as const,
        title: "Trimitem noi curierul",
        text: "Programăm ridicarea coletului de la tine. Returul este pe costul nostru, tu doar predai coletul.",
    },
    {
        icon: "cash" as const,
        title: "Îți dăm banii înapoi",
        text: `Îți returnăm prețul produselor și taxa de livrare plătită, prin transfer bancar în contul pe care ni-l dai, în cel mult ${RETURN_DAYS} zile de la primirea coletului înapoi.`,
    },
];

export default function ReturPage() {
    return (
        <main className="pb-20">
            <section className="mx-auto max-w-3xl px-4 pt-10 md:pt-14">
                <h1 className="text-[2.6rem] font-extrabold leading-[1.02] md:text-[4rem]">Retur și rambursare</h1>
                <p className="mt-4 max-w-xl text-lg text-ink-2">
                    Dacă nu ești mulțumit de comandă, ne trimiți produsul înapoi și îți dăm toți banii, inclusiv
                    livrarea. Curierul pentru retur îl plătim noi.
                </p>

                <ol className="mt-10 grid gap-8">
                    {STEPS.map((s, i) => (
                        <li key={s.title} className="flex gap-4">
                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-hive-sun text-ink">
                                <Icon name={s.icon} size={20} />
                            </span>
                            <div>
                                <h2 className="text-xl font-bold">
                                    {i + 1}. {s.title}
                                </h2>
                                <p className="mt-1.5 max-w-[60ch] text-ink-2">{s.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="mt-12 border-t border-rule pt-8">
                    <h2 className="text-xl font-bold">De reținut</h2>
                    <ul className="mt-3 grid max-w-[65ch] gap-2.5 text-ink-2">
                        <li>
                            Borcanele trebuie să fie nedesfăcute, cu sigiliul intact. Un borcan de miere deschis nu mai
                            poate fi primit înapoi, din motive de igienă.
                        </li>
                        <li>
                            Dacă borcanul a ajuns spart sau ai primit alt produs decât ai comandat, trimite-ne o poză și
                            îl înlocuim sau îți dăm banii înapoi.
                        </li>
                    </ul>
                </div>

                <section id="formular" className="mt-12 scroll-mt-24 border-t border-rule pt-8">
                    <h2 className="text-xl font-bold">Formular de retragere</h2>
                    <p className="mt-2 max-w-[60ch] text-ink-2">
                        Poți cere returul și de aici, fără să ne suni. Primești imediat pe email confirmarea de
                        primire a cererii, apoi te sunăm ca să programăm ridicarea coletului.
                    </p>

                    <div className="sheet mt-6 p-5 md:p-6">
                        <WithdrawalForm contactEmail={SITE.email} />
                    </div>
                </section>

                <p className="mt-10 rounded-xl bg-wash-2 p-5">
                    <strong>Pentru retur:</strong>{" "}
                    <a className="font-bold underline" href={`tel:${SITE.phone.replace(/\s/g, "")}`}>
                        {SITE.phone}
                    </a>{" "}
                    sau{" "}
                    <a className="break-all font-bold underline" href={`mailto:${SITE.email}`}>
                        {SITE.email}
                    </a>
                </p>
            </section>
        </main>
    );
}
