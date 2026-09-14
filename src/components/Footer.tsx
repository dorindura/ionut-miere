import Link from "next/link";
import Image from "next/image";
import { ANPC_SAL_URL, BADGE_IMAGES, COMPANY } from "@/lib/company";
import { isCardPaymentEnabled } from "@/lib/netopia";

export default function Footer({ brandName }: { brandName: string }) {
    // logourile de card apar doar când plata cu cardul e activă
    const cardEnabled = isCardPaymentEnabled();

    return (
        <footer className="border-t border-yellow-500/15">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <p className="font-black text-lg">{brandName}</p>
                        <p className="mt-2 text-sm text-neutral-300">
                            Miere naturală din România.
                        </p>
                        <ul className="mt-4 space-y-0.5 text-xs text-neutral-400">
                            <li>{COMPANY.legalName}</li>
                            <li>CUI: {COMPANY.cui} • Reg. Com.: {COMPANY.regCom}</li>
                            <li>Sediu: {COMPANY.address}</li>
                            <li>
                                Tel: <a className="hover:text-yellow-300" href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}>{COMPANY.phone}</a>
                                {" • "}
                                <a className="hover:text-yellow-300" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-yellow-200">Link-uri utile</p>
                        <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                            <li><Link className="hover:text-yellow-300" href="/magazin">Magazin</Link></li>
                            <li><Link className="hover:text-yellow-300" href="/#support">Support</Link></li>
                            <li><Link className="hover:text-yellow-300" href="/#contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-yellow-200">Legal</p>
                        <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                            <li><Link className="hover:text-yellow-300" href="/termeni">Termeni & condiții</Link></li>
                            <li><Link className="hover:text-yellow-300" href="/confidentialitate">Politica de confidențialitate</Link></li>
                            <li><Link className="hover:text-yellow-300" href="/cookies">Cookies</Link></li>
                            <li><Link className="hover:text-yellow-300" href="/retur">Retur & formular de retragere</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a href={ANPC_SAL_URL} target="_blank" rel="noopener noreferrer">
                        <Image
                            src={BADGE_IMAGES.anpcSal}
                            alt="ANPC - Soluționarea alternativă a litigiilor"
                            width={201}
                            height={50}
                        />
                    </a>

                    {cardEnabled ? (
                        <Image
                            src={BADGE_IMAGES.netopiaCards}
                            alt="Plăți securizate prin NETOPIA Payments - Mastercard, Visa"
                            width={265}
                            height={50}
                            className="h-[50px] w-auto rounded-md"
                        />
                    ) : null}
                </div>

                <div className="mt-8 flex flex-col gap-2 border-t border-yellow-500/10 pt-6 text-xs text-neutral-400 md:flex-row md:items-center md:justify-between">
                    <p>© {new Date().getFullYear()} {brandName}. Toate drepturile rezervate.</p>
                </div>
            </div>
        </footer>
    );
}
