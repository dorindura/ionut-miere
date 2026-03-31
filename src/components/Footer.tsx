import Link from "next/link";

export default function Footer({ brandName }: { brandName: string }) {
    return (
        <footer className="border-t border-yellow-500/15">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <p className="font-black text-lg">{brandName}</p>
                        <p className="mt-2 text-sm text-neutral-300">
                            Miere naturală din România.
                        </p>
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
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-yellow-500/10 pt-6 text-xs text-neutral-400 md:flex-row md:items-center md:justify-between">
                    <p>© {new Date().getFullYear()} {brandName}. Toate drepturile rezervate.</p>
                </div>
            </div>
        </footer>
    );
}