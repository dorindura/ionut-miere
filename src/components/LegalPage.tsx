import type { ReactNode } from "react";
import { LEGAL, SITE } from "@/lib/site";

export default function LegalPage({
    title,
    intro,
    children,
}: {
    title: string;
    intro?: ReactNode;
    children: ReactNode;
}) {
    return (
        <main className="pb-20">
            <section className="mx-auto max-w-3xl px-4 pt-10 md:pt-14">
                <h1 className="text-[2.4rem] font-extrabold leading-[1.04] md:text-[3.4rem]">{title}</h1>
                <p className="mt-3 text-[0.9rem] text-ink-3">Ultima actualizare: {LEGAL.lastUpdated}</p>
                {intro ? <div className="mt-4 max-w-[62ch] text-lg text-ink-2">{intro}</div> : null}
                <div className="mt-10 grid gap-8">{children}</div>
            </section>
        </main>
    );
}

export function LegalSection({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
    return (
        <section id={id} className="scroll-mt-24 border-t border-rule pt-8">
            <h2 className="text-xl font-bold">{title}</h2>
            <div className="mt-3 grid max-w-[65ch] gap-3 text-ink-2 [&_a]:font-semibold [&_a]:underline [&_strong]:text-ink [&_ul]:grid [&_ul]:list-disc [&_ul]:gap-2.5 [&_ul]:pl-5">
                {children}
            </div>
        </section>
    );
}

/** Datele de identificare cerute de NETOPIA și ANPC. */
export function CompanyDetails() {
    return (
        <ul>
            <li><strong>Denumire:</strong> {LEGAL.legalName}</li>
            <li><strong>CUI:</strong> {LEGAL.cui}</li>
            <li><strong>Nr. Registrul Comerțului:</strong> {LEGAL.regCom}</li>
            <li><strong>Sediu:</strong> {LEGAL.registeredAddress}</li>
            <li><strong>Telefon:</strong> <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a></li>
            <li><strong>Email:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
        </ul>
    );
}
