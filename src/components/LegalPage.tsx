import type { ReactNode } from "react";
import { COMPANY, LEGAL_LAST_UPDATED } from "@/lib/company";

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
        <main className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="text-3xl font-black">{title}</h1>
            <p className="mt-2 text-sm text-neutral-400">Ultima actualizare: {LEGAL_LAST_UPDATED}</p>
            {intro ? <div className="mt-4 leading-relaxed text-neutral-300">{intro}</div> : null}
            <div className="mt-8 grid gap-4">{children}</div>
        </main>
    );
}

export function LegalSection({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
    return (
        <section id={id} className="scroll-mt-24 rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
            <h2 className="text-xl font-black text-yellow-200">{title}</h2>
            <div className="mt-3 grid gap-3 text-sm leading-relaxed text-neutral-300 [&_a]:text-yellow-300 [&_a]:underline [&_strong]:text-neutral-100 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
                {children}
            </div>
        </section>
    );
}

export function CompanyDetails() {
    return (
        <ul>
            <li><strong>Denumire:</strong> {COMPANY.legalName}</li>
            <li><strong>CUI:</strong> {COMPANY.cui}</li>
            <li><strong>Nr. Registrul Comerțului:</strong> {COMPANY.regCom}</li>
            <li><strong>Sediu:</strong> {COMPANY.address}</li>
            <li><strong>Telefon:</strong> <a href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>{COMPANY.phone}</a></li>
            <li><strong>Email:</strong> <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
        </ul>
    );
}
