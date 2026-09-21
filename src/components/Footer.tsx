import Link from "next/link";
import { HiveMark } from "@/components/Icon";

const CONTACT = {
    phone: "+40 752 819 170",
    email: "buceadariusionut@gmail.com",
};

export default function Footer({ brandName }: { brandName: string }) {
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
                <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <HiveMark size={32} />
                            <p className="font-display text-xl font-extrabold text-white">{brandName}</p>
                        </div>
                        <p className="mt-3 max-w-sm text-[0.95rem] text-[#c4d0c1]">
                            Miere de la stupii noștri din Gârde, comuna Bistra, în Munții Apuseni.
                        </p>
                        <p className="mt-5 text-[0.9rem] text-[#aebcaa]">
                            <a className="underline hover:text-white" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
                                {CONTACT.phone}
                            </a>
                            {" · "}
                            <a className="underline hover:text-white" href={`mailto:${CONTACT.email}`}>
                                {CONTACT.email}
                            </a>
                        </p>
                    </div>

                    <nav aria-label="Link-uri utile">
                        <p className="font-display text-base font-bold text-hive-sun">Magazin</p>
                        <ul className="mt-3 space-y-2.5 text-[0.95rem]">
                            <li><Link className="hover:text-white hover:underline" href="/magazin">Toate sortimentele</Link></li>
                            <li><Link className="hover:text-white hover:underline" href="/#stupina">Stupina noastră</Link></li>
                            <li><Link className="hover:text-white hover:underline" href="/#livrare">Livrare și plată</Link></li>
                            <li><Link className="hover:text-white hover:underline" href="/#contact">Contact</Link></li>
                        </ul>
                    </nav>

                </div>

                <div className="mt-12 border-t border-white/15 pt-6 text-[0.85rem] text-[#aebcaa]">
                    <p>© {new Date().getFullYear()} {brandName}. Toate drepturile rezervate.</p>
                </div>
            </div>
        </footer>
    );
}
