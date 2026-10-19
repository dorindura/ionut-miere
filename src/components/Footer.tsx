import Link from "next/link";
import Image from "next/image";
import { HiveMark } from "@/components/Icon";
import { LEGAL, SITE } from "@/lib/site";
import { isCardPaymentEnabled } from "@/lib/netopia";

export default function Footer({ brandName }: { brandName: string }) {
    // logourile de card apar doar când plata cu cardul e activă
    const cardEnabled = isCardPaymentEnabled();

    return (
        <footer className="mt-auto bg-forest text-[#e6ece2]">
            {/* rândul de stupi pe marginea de sus a subsolului */}
            <div aria-hidden className="flex h-3">
                <span className="flex-1 bg-hive-blue" />
                <span className="flex-1 bg-hive-teal" />
                <span className="flex-1 bg-hive-orange" />
                <span className="flex-1 bg-hive-leaf" />
            </div>

            <div className="mx-auto max-w-6xl px-4 pb-8 pt-12">
                <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <HiveMark size={32} />
                            <p className="font-display text-xl font-extrabold text-white">{brandName}</p>
                        </div>
                        <p className="mt-3 max-w-sm text-[0.95rem] text-[#c4d0c1]">
                            Miere de la stupii noștri din Gârde, comuna Bistra, în Munții Apuseni.
                        </p>
                        <p className="mt-5 text-[0.9rem] text-[#aebcaa]">
                            <a className="underline hover:text-white" href={`tel:${SITE.phone.replace(/\s/g, "")}`}>
                                {SITE.phone}
                            </a>
                            {" · "}
                            <a className="underline hover:text-white" href={`mailto:${SITE.email}`}>
                                {SITE.email}
                            </a>
                        </p>
                        <p className="mt-2 text-[0.9rem] text-[#aebcaa]">
                            <a className="underline hover:text-white" href={SITE.facebook} target="_blank" rel="noopener">
                                Urmărește-ne pe Facebook
                            </a>
                        </p>

                        {/* datele de identificare cerute de NETOPIA și ANPC */}
                        <ul className="mt-5 space-y-0.5 text-[0.8rem] text-[#9bab97]">
                            <li>{LEGAL.legalName}</li>
                            <li>CUI: {LEGAL.cui} · Reg. Com.: {LEGAL.regCom}</li>
                            <li>Sediu: {LEGAL.registeredAddress}</li>
                        </ul>
                    </div>

                    <nav aria-label="Link-uri utile">
                        <p className="font-display text-base font-bold text-hive-sun">Magazin</p>
                        <ul className="mt-3 space-y-2.5 text-[0.95rem]">
                            <li><Link className="hover:text-white hover:underline" href="/magazin">Toate sortimentele</Link></li>
                            <li><Link className="hover:text-white hover:underline" href="/#stupina">Stupina noastră</Link></li>
                            <li><Link className="hover:text-white hover:underline" href="/#livrare">Livrare și plată</Link></li>
                            <li><Link className="hover:text-white hover:underline" href="/retur">Retur și rambursare</Link></li>
                            <li><Link className="hover:text-white hover:underline" href="/#contact">Contact</Link></li>
                        </ul>
                    </nav>

                    <nav aria-label="Informații legale">
                        <p className="font-display text-base font-bold text-hive-sun">Legal</p>
                        <ul className="mt-3 space-y-2.5 text-[0.95rem]">
                            <li><Link className="hover:text-white hover:underline" href="/termeni">Termeni și condiții</Link></li>
                            <li><Link className="hover:text-white hover:underline" href="/confidentialitate">Confidențialitate</Link></li>
                            <li><Link className="hover:text-white hover:underline" href="/cookies">Cookies</Link></li>
                            <li><Link className="hover:text-white hover:underline" href="/retur#formular">Formular de retragere</Link></li>
                        </ul>
                    </nav>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                    <a href={LEGAL.anpcSalUrl} target="_blank" rel="noopener noreferrer">
                        <Image
                            src={LEGAL.badges.anpcSal}
                            alt="ANPC - Soluționarea alternativă a litigiilor"
                            width={201}
                            height={50}
                        />
                    </a>

                    {cardEnabled ? (
                        <Image
                            src={LEGAL.badges.netopiaCards}
                            alt="Plăți securizate prin NETOPIA Payments - Mastercard, Visa"
                            width={265}
                            height={50}
                            className="h-[50px] w-auto rounded-md"
                        />
                    ) : null}
                </div>

                <div className="mt-10 border-t border-white/15 pt-6 text-[0.85rem] text-[#aebcaa]">
                    <p>© {new Date().getFullYear()} {brandName}. Toate drepturile rezervate.</p>
                </div>
            </div>
        </footer>
    );
}
