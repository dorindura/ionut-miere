import Link from "next/link";

export type ProductFormValues = {
    id?: string;
    name: string;
    slug: string;
    weight: string;
    priceRon: number | "";
    inStock: boolean;
    popular: boolean;
    shortDescription: string;
    description: string;
    origin: string;
    howItsMade: string;
    characteristics: string[];
    benefits: string[];
    consumption: string[];
    images: string[];
};

export const EMPTY_PRODUCT: ProductFormValues = {
    name: "",
    slug: "",
    weight: "",
    priceRon: "",
    inStock: true,
    popular: false,
    shortDescription: "",
    description: "",
    origin: "",
    howItsMade: "",
    characteristics: [],
    benefits: [],
    consumption: [],
    images: [],
};

function Group({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
    return (
        <section className="sheet p-4 md:p-5">
            <h2 className="text-lg font-bold">{title}</h2>
            {hint ? <p className="mt-0.5 text-[0.9rem] text-ink-3">{hint}</p> : null}
            <div className="mt-4 grid gap-4">{children}</div>
        </section>
    );
}

/** formularul comun pentru „Produs nou" și „Editează produs" */
export default function ProductForm({
    action,
    values,
    submitLabel,
}: {
    action: (formData: FormData) => void | Promise<void>;
    values: ProductFormValues;
    submitLabel: string;
}) {
    return (
        <form action={action} className="mt-6 grid gap-6 lg:grid-cols-12">
            {values.id ? <input type="hidden" name="productId" value={values.id} /> : null}

            <div className="grid gap-6 lg:col-span-8">
                <Group title="Produs">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="label">
                            Nume
                            <input name="name" required defaultValue={values.name} className="field" placeholder="Miere de salcâm" />
                            <span className="hint">Gramajul de la final se ignoră: „Miere de tei 1kg” și „Miere de tei 0,5kg” devin un singur stup în magazin.</span>
                        </label>
                        <label className="label">
                            Slug (adresa paginii)
                            <input name="slug" required defaultValue={values.slug} className="field" placeholder="miere-salcam-1000g" />
                            <span className="hint">Doar litere mici, cifre și cratime.</span>
                        </label>
                    </div>
                    <label className="label">
                        Descriere scurtă
                        <textarea name="shortDescription" required defaultValue={values.shortDescription} className="field !min-h-20" />
                        <span className="hint">Apare pe fațada stupului în magazin — o frază.</span>
                    </label>
                    <label className="label">
                        Descriere
                        <textarea name="description" required defaultValue={values.description} className="field" />
                    </label>
                </Group>

                <Group title="Detalii pe pagina produsului">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="label">
                            Origine
                            <textarea name="origin" defaultValue={values.origin} className="field" />
                        </label>
                        <label className="label">
                            Cum se formează
                            <textarea name="howItsMade" defaultValue={values.howItsMade} className="field" />
                        </label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        <label className="label">
                            Caracteristici
                            <textarea name="characteristics" defaultValue={values.characteristics.join("\n")} className="field !min-h-40" />
                            <span className="hint">Câte una pe linie.</span>
                        </label>
                        <label className="label">
                            Beneficii
                            <textarea name="benefits" defaultValue={values.benefits.join("\n")} className="field !min-h-40" />
                            <span className="hint">Câte una pe linie.</span>
                        </label>
                        <label className="label">
                            Recomandare de consum
                            <textarea name="consumption" defaultValue={values.consumption.join("\n")} className="field !min-h-40" />
                            <span className="hint">Câte una pe linie.</span>
                        </label>
                    </div>
                </Group>
            </div>

            <div className="grid gap-6 lg:col-span-4 lg:self-start">
                <Group title="Preț și stoc">
                    <div className="grid grid-cols-2 gap-3">
                        <label className="label">
                            Preț (lei)
                            <input
                                name="priceRon"
                                type="number"
                                min={0}
                                step={1}
                                inputMode="numeric"
                                required
                                defaultValue={values.priceRon}
                                className="field tabular-nums"
                            />
                        </label>
                        <label className="label">
                            Gramaj
                            <input name="weight" required defaultValue={values.weight} className="field" placeholder="1000g" />
                        </label>
                    </div>
                    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg bg-wash px-3 py-2.5 font-bold">
                        <input type="checkbox" name="inStock" defaultChecked={values.inStock} className="h-5 w-5" />
                        În stoc
                    </label>
                    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg bg-wash px-3 py-2.5 font-bold">
                        <input type="checkbox" name="popular" defaultChecked={values.popular} className="mt-0.5 h-5 w-5" />
                        <span>
                            Popular
                            <span className="block text-[0.85rem] font-normal text-ink-3">Steluță pe stup și afișat primul.</span>
                        </span>
                    </label>
                </Group>

                <Group title="Imagini" hint="Câte un URL pe linie; prima e imaginea principală.">
                    <textarea
                        name="images"
                        aria-label="URL-uri imagini"
                        defaultValue={values.images.join("\n")}
                        placeholder="/images/miere-de-tei.jpeg"
                        className="field font-mono text-[0.85rem]"
                    />
                    {values.images.length > 0 ? (
                        <ul className="flex flex-wrap gap-2">
                            {values.images.map((src) => (
                                <li key={src} className="h-16 w-14 overflow-hidden rounded-md border border-rule bg-white">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={src} alt="" className="h-full w-full object-contain" />
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </Group>

                <div className="sheet grid gap-2 p-4 lg:sticky lg:top-20">
                    <button type="submit" className="btn btn-primary text-base">
                        {submitLabel}
                    </button>
                    <Link href="/admin/produse" className="btn btn-ghost">
                        Renunță
                    </Link>
                </div>
            </div>
        </form>
    );
}
