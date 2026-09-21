// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import { HiveFrame, HivePlateRow, HiveWindow } from "@/components/HiveFront";
import HiveSlider from "@/components/HiveSlider";
import { getVarieties, type VarietyWithProducts } from "@/lib/varieties";
import { EASYBOX_CARD_ONLY_NOTE, SHIPPING_RON } from "@/lib/shipping";

export const dynamic = "force-dynamic";

const brand = {
  name: "Prisaca Apuseni",
  siteUrl: "https://prisaca-apuseni.com",
  phone: "+40 752 819 170",
  email: "buceadariusionut@gmail.com",
  address: "România (Comuna Bistra / Alba)",
};

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: brand.name,
    url: brand.siteUrl,
    telephone: brand.phone,
    email: brand.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "RO",
      streetAddress: brand.address,
    },
    image: `${brand.siteUrl}/images/horica_bucea.jpg`,
    sameAs: [
      // adaugă aici link-uri reale când le aveți
      // "https://www.facebook.com/....",
      // "https://www.instagram.com/...."
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Miere de salcâm",
          category: "Honey",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Miere polifloră",
          category: "Honey",
        },
      },
    ],
  };

  return (
      <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
  );
}

const FAQ = [
  {
    q: "Mierea cristalizează?",
    a: "Da, e normal pentru mierea naturală. Cristalizarea depinde de sortiment și temperatură.",
  },
  {
    q: "Cum păstrez mierea?",
    a: "La temperatura camerei, ferită de soare direct, cu capacul bine închis.",
  },
  {
    q: "Aveți comenzi corporate / cadouri?",
    a: "Da. Putem pregăti pachete personalizate și etichete pentru evenimente.",
  },
  {
    q: "În cât timp ajunge comanda?",
    a: "De obicei 24–48h (în funcție de curier și destinație).",
  },
  {
    q: "Pot plăti cash la easybox?",
    a: EASYBOX_CARD_ONLY_NOTE + " Dacă vrei să plătești cash, alege livrarea prin curier la adresă.",
  },
];

/** fațada unui sortiment în rândul de pe pagina principală */
function RowHive({ v, priority }: { v: VarietyWithProducts; priority?: boolean }) {
  const lead = v.variants[0];
  const minPrice = Math.min(...v.variants.map((x) => x.priceRon));
  const weights = [...v.variants].reverse().map((x) => x.weight).join(" · ");

  return (
      <Link
          href={`/magazin/${lead.slug}`}
          className="hive-link group block h-full w-full focus-visible:outline-offset-4"
      >
        <HiveFrame paint={v.paint} className="h-full">
          <HivePlateRow number={v.number} popular={v.popular} />
          <HiveWindow
              src={lead.images[0]?.url}
              alt={`${v.name}, ${lead.weight}`}
              sizes="(max-width: 768px) 74vw, 268px"
              priority={priority}
          />
          <h3 className="mt-4 text-[1.35rem] font-extrabold leading-[1.1]">{v.name}</h3>
          <p className="mt-1 text-[0.95rem] opacity-90">{weights}</p>
          <p className="hive-bottom flex items-center justify-between gap-2 pt-3 font-display text-lg font-bold">
            <span>de la {minPrice} lei</span>
            <Icon
                name="arrowRight"
                size={22}
                className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1"
            />
          </p>
        </HiveFrame>
      </Link>
  );
}

export default async function Page() {
  const varieties = await getVarieties();

  return (
      <>
        <JsonLd />

        <main>
          {/* HERO: titlul, apoi fotografia stupinei, întreagă */}
          <section>
            <div className="mx-auto grid max-w-6xl gap-6 px-4 pb-8 pt-9 md:grid-cols-12 md:items-end md:pb-8 md:pt-10">
              <h1 className="rise text-[clamp(2.6rem,7.2vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] md:col-span-8 [font-variation-settings:'opsz'_96]">
                Miere de la stupii noștri din Apuseni
              </h1>
              <div className="rise md:col-span-4 md:pb-2" style={{ animationDelay: "90ms" }}>
                <p className="text-lg leading-relaxed text-ink-2">
                  Salcâm, mană de brad, tei și polifloră de munte, de la stupina noastră din Gârde, comuna Bistra.
                  Tată și fiu, direct de la apicultor.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/magazin" className="btn btn-primary text-base">
                    Alege mierea
                    <Icon name="arrowRight" size={18} />
                  </Link>
                  <a href="#stupina" className="btn btn-ghost">
                    Stupina noastră
                  </a>
                </div>
              </div>
            </div>

            <figure className="relative">
              <Image
                  src="/images/stupina-garde-rand.jpg"
                  alt="Rândul de stupi pictați în albastru, verde, galben și portocaliu, pe dealul de lângă casa noastră din Gârde"
                  width={2400}
                  height={1166}
                  priority
                  sizes="100vw"
                  className="h-[clamp(220px,52vw,320px)] w-full object-cover object-[50%_68%] md:h-[clamp(300px,30vw,440px)] md:object-[50%_62%]"
              />
              <figcaption className="absolute right-3 top-3 rounded bg-wash/90 px-2 py-1 text-[0.8rem] text-ink-2 md:right-6 md:top-5">
                Stupina din Gârde, jud. Alba
              </figcaption>
            </figure>

          </section>

          {/* SORTIMENTE: rândul de stupi pictați, ca slider */}
          <section className="pt-14 md:pt-20" aria-label="Sortimente">
            <HiveSlider label="Sortimentele noastre">
              {varieties.map((v, i) => (
                  <RowHive key={v.name} v={v} priority={i < 2} />
              ))}
            </HiveSlider>
            <div className="ground-strip" aria-hidden />

            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-5">
              <p className="inline-flex items-center gap-1.5 text-[0.95rem] text-ink-3 md:hidden">
                Glisează pentru toate sortimentele
                <Icon name="arrowRight" size={16} />
              </p>
              <Link href="/magazin" className="ml-auto inline-flex items-center gap-1.5 font-bold underline underline-offset-4">
                Toate gramajele în magazin
                <Icon name="arrowRight" size={18} />
              </Link>
            </div>
          </section>

          {/* STUPINA: pe albastrul stupilor */}
          <section id="stupina" className="bg-hive-blue text-white">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:items-center md:py-24">
              <div className="md:col-span-5">
                <div className="relative mx-auto max-w-sm md:max-w-none">
                  <div className="h-3 bg-[#1b4577]" aria-hidden />
                  <Image
                      src="/images/horica_bucea.jpg"
                      alt="Apicultor la unul dintre stupii noștri, cu pădurile Apusenilor în spate"
                      width={1500}
                      height={2000}
                      sizes="(max-width: 768px) 90vw, 40vw"
                      className="aspect-[4/5] w-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-7 md:pl-6">
                <h2 className="text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1]">
                  Stupina noastră
                </h2>
                <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-[#e4ecf7]">
                  În comuna Bistra, în inima Munților Apuseni, avem grijă de albinele noastre
                  ca de o familie. Lucrăm împreună, tată și fiu, cu respect pentru natură și
                  tradiție, urmărind fiecare detaliu din stupină. Mierea este recoltată cu grijă,
                  la momentul potrivit, pentru a păstra gustul și calitatea naturală. Fiecare
                  borcan reflectă munca, răbdarea și pasiunea noastră pentru apicultură.
                </p>

                <dl className="mt-10 grid gap-6 border-t border-white/25 pt-6 sm:grid-cols-3">
                  <div>
                    <dt className="text-[0.85rem] font-bold text-hive-sun">Unde</dt>
                    <dd className="mt-1 text-[1.05rem]">Gârde, comuna Bistra, județul Alba</dd>
                  </div>
                  <div>
                    <dt className="text-[0.85rem] font-bold text-hive-sun">Cine</dt>
                    <dd className="mt-1 text-[1.05rem]">Tată și fiu, apicultori</dd>
                  </div>
                  <div>
                    <dt className="text-[0.85rem] font-bold text-hive-sun">Ce recoltăm</dt>
                    <dd className="mt-1 text-[1.05rem]">Salcâm, mană de brad, tei, polifloră de munte</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          {/* LIVRARE */}
          <section id="livrare" className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <h2 className="max-w-2xl text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.02]">
              Cum ajunge mierea la tine
            </h2>

            <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
              <li className="border-t-[3px] border-ink pt-5">
                <span className="plate bg-hive-sun text-lg">1</span>
                <h3 className="mt-4 text-xl font-bold">Alegi sortimentul</h3>
                <p className="mt-2 text-ink-2">
                  Borcan de 500g sau 1000g. Adaugi în coș direct din magazin.
                </p>
              </li>
              <li className="border-t-[3px] border-ink pt-5">
                <span className="plate bg-hive-sun text-lg">2</span>
                <h3 className="mt-4 text-xl font-bold">Comanzi fără cont</h3>
                <p className="mt-2 text-ink-2">
                  Completezi numele, telefonul și adresa. Plătești ramburs, la livrare.
                </p>
              </li>
              <li className="border-t-[3px] border-ink pt-5">
                <span className="plate bg-hive-sun text-lg">3</span>
                <h3 className="mt-4 text-xl font-bold">Primești coletul</h3>
                <p className="mt-2 text-ink-2">
                  Curier la adresă ({SHIPPING_RON.ADDRESS} lei) sau easybox ({SHIPPING_RON.EASYBOX} lei), de obicei în 24–48h.
                </p>
              </li>
            </ol>

            <p className="mt-10 flex items-start gap-3 rounded-lg bg-hive-sun/35 px-4 py-3 text-[0.98rem]">
              <Icon name="card" size={22} className="mt-0.5 text-ink" />
              <span>
                <strong>Atenție la easybox:</strong> {EASYBOX_CARD_ONLY_NOTE}
              </span>
            </p>
          </section>

          {/* FAQ */}
          <section className="border-t border-rule">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-12 md:py-24">
              <h2 className="text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.02] md:col-span-4">
                Întrebări frecvente
              </h2>
              <div className="md:col-span-8">
                {FAQ.map((x) => (
                    <details key={x.q} className="group border-b border-rule first:border-t">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-bold [&::-webkit-details-marker]:hidden">
                        {x.q}
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-wash-2 transition-transform duration-300 group-open:rotate-45">
                          <Icon name="plus" size={18} />
                        </span>
                      </summary>
                      <p className="max-w-[62ch] pb-6 text-ink-2">{x.a}</p>
                    </details>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT: pe galbenul stupilor */}
          <section id="contact" className="bg-hive-sun">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
              <div>
                <h2 className="text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-[1]">
                  Sună-ne sau scrie-ne
                </h2>
                <p className="mt-4 max-w-md text-lg">
                  Pentru comenzi mari, cadouri sau întrebări despre sortimente. Revenim rapid.
                </p>

                <ul className="mt-8 grid gap-5">
                  <li>
                    <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="group inline-flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-hive-sun">
                        <Icon name="phone" size={20} />
                      </span>
                      <span>
                        <span className="block text-[0.85rem] font-bold">Telefon</span>
                        <span className="block font-display text-2xl font-extrabold tabular-nums group-hover:underline">
                          {brand.phone}
                        </span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${brand.email}`} className="group inline-flex min-w-0 items-center gap-3">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-hive-sun">
                        <Icon name="mail" size={20} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[0.85rem] font-bold">Email</span>
                        <span className="block break-all text-lg font-bold group-hover:underline">{brand.email}</span>
                      </span>
                    </a>
                  </li>
                  <li className="inline-flex items-center gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-hive-sun">
                      <Icon name="pin" size={20} />
                    </span>
                    <span>
                      <span className="block text-[0.85rem] font-bold">Adresă</span>
                      <span className="block text-lg font-bold">Gârde, comuna Bistra, județul Alba</span>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl bg-paper p-5 md:p-7">
                <ContactForm />
              </div>
            </div>
          </section>
        </main>
      </>
  );
}
