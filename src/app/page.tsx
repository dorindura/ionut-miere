// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import {getPrisma} from "@/lib/db";
import ContactForm from "@/components/ContactForm";

const brand = {
  name: "Prisaca Apuseni",
  siteUrl: "https://exemplu.ro",
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
    image: `${brand.siteUrl}/og.jpg`,
    sameAs: [
      // adaugă aici link-uri reale când le aveți
      // "https://www.facebook.com/....",
      // "https://www.instagram.com/...."
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Products",
          name: "Miere de salcâm",
          category: "Honey",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Products",
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

export default async function Page() {

  const prisma = getPrisma();

  const featuredProducts = await prisma.product.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
    },
  });

  return (
      <>
        <JsonLd />

        {/* Background accents */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-[-20%] top-[-30%] h-[520px] w-[520px] rounded-full bg-yellow-500/20 blur-[90px]" />
          <div className="absolute right-[-20%] top-[10%] h-[520px] w-[520px] rounded-full bg-yellow-400/10 blur-[110px]" />
        </div>

        <main>
          {/* HERO */}
          <section className="mx-auto max-w-6xl px-4 pt-14 pb-10">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                  Stupină locală • loturi mici • calitate constantă
                </p>

                <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
                  Miere naturală, autentică —{" "}
                  <span className="text-yellow-400">direct de la apicultor</span>.
                </h1>

                <p className="mt-4 text-base leading-relaxed text-neutral-300">
                  Sortiment curat (salcâm, mană de brad, tei, polifloră) + pachete cadou.
                  Etichetare clară, livrare rapidă și suport prietenos.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                      href="/magazin"
                      className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 transition-colors"
                  >
                    Vezi produsele
                  </Link>
                  <a
                      href="#contact"
                      className="rounded-xl border border-yellow-500/25 px-5 py-3 text-sm font-semibold text-neutral-100 hover:border-yellow-400/60 transition-colors"
                  >
                    Contact rapid
                  </a>
                </div>

                <dl className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { k: "100%", v: "Natural" },
                    { k: "24–48h", v: "Livrare" },
                    { k: "★ 5.0", v: "Recenzii" },
                  ].map((x) => (
                      <div
                          key={x.v}
                          className="rounded-2xl border border-yellow-500/15 bg-neutral-900/40 p-4"
                      >
                        <dt className="text-lg font-black text-yellow-300">{x.k}</dt>
                        <dd className="text-xs text-neutral-300">{x.v}</dd>
                      </div>
                  ))}
                </dl>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-2xl border border-yellow-500/15 bg-gradient-to-b from-yellow-500/10 to-transparent blur-0" />
                <div className="relative overflow-hidden rounded-2xl border border-yellow-500/15 bg-neutral-900/30">
                  <Image
                      src="/images/horica_bucea.jpg"
                      alt="Borcan cu miere naturală și fagure"
                      width={1200}
                      height={900}
                      priority
                      className="h-[440px] w-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 rounded-1xl border border-yellow-500/20 bg-neutral-950/70 p-4 backdrop-blur">
                    <p className="text-sm font-semibold">
                      Gust curat. Textură perfectă. Etichete moderne.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BENEFICII */}
          <section id="support" className="mx-auto max-w-6xl px-4 py-10">

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Calitate verificată",
                  desc: "Loturi mici, trasabilitate și focus pe consistență.",
                },
                {
                  title: "Livrare rapidă",
                  desc: "Ambalare sigură, expediere 24–48h (după caz).",
                },
                {
                  title: "Suport prietenos",
                  desc: "Recomandări pentru utilizare, cadouri și comenzi mari.",
                },
              ].map((c) => (
                  <article
                      key={c.title}
                      className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6"
                  >
                    <h3 className="text-lg font-bold text-yellow-200">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">{c.desc}</p>
                  </article>
              ))}
            </div>
          </section>

          {/* MAGAZIN PREVIEW */}
          <section id="magazin" className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="text-2xl font-black">Produse populare</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {featuredProducts.map((p) => (
                  <article
                      key={p.id}
                      className="group rounded-3xl border border-yellow-500/15 bg-neutral-900/30 overflow-hidden"
                  >
                    <div className="relative h-80">
                      <Image
                          src={p.images?.[0]?.url || "/images/placeholder.jpg"}
                          alt={`${p.name} ${p.weight}`}
                          width={1200}
                          height={900}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />

                      <span className="absolute left-4 top-4 rounded-full bg-neutral-950/70 px-3 py-1 text-xs text-yellow-200 border border-yellow-500/20">
            {p.weight}
        </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold">{p.name}</h3>

                      <p className="mt-1 text-sm text-neutral-300">
                        {p.shortDescription}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-neutral-300">
                Preț: {p.priceRon} RON
            </span>

                        <Link
                            href={`/magazin/${p.slug}`}
                            className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 transition-colors"
                        >
                          Vezi produs
                        </Link>
                      </div>
                    </div>
                  </article>
              ))}
            </div>
          </section>

          {/* POVESTE */}
          <section className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div className="rounded-3xl border border-yellow-500/15 bg-neutral-900/30 p-6">
                <h2 className="text-2xl font-black">Stupina noastră</h2>
                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  În comuna Bistra, în inima Munților Apuseni, avem grijă de albinele noastre
                  ca de o familie. Lucrăm împreună, tată și fiu, cu respect pentru natură și
                  tradiție, urmărind fiecare detaliu din stupină. Mierea este recoltată cu grijă,
                  la momentul potrivit, pentru a păstra gustul și calitatea naturală. Fiecare
                  borcan reflectă munca, răbdarea și pasiunea noastră pentru apicultură.
                </p>

              </div>

              <div className="overflow-hidden rounded-3xl border border-yellow-500/15 bg-neutral-900/30">
                <Image
                    src="/images/poza_cu_stupii_departare.jpg"
                    alt="Stupină și peisaj natural"
                    width={1000}
                    height={500}
                    className="h-[205px] w-full object-cover"
                    loading="lazy"
                />
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mx-auto max-w-6xl px-4 py-10">
            <h2 className="text-2xl font-black">Întrebări frecvente</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
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
              ].map((x) => (
                  <details
                      key={x.q}
                      className="rounded-2xl border border-yellow-500/15 bg-neutral-900/30 p-5"
                  >
                    <summary className="cursor-pointer list-none font-semibold text-yellow-200">
                      {x.q}
                    </summary>
                    <p className="mt-2 text-sm text-neutral-300 leading-relaxed">{x.a}</p>
                  </details>
              ))}
            </div>
          </section>

          <section id="contact" className="mx-auto max-w-6xl px-4 py-12">
            <div className="rounded-[32px] border border-yellow-500/15 bg-neutral-900/30 p-6 md:p-10">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-black">Contact</h2>
                  <p className="mt-2 mb-2 text-neutral-300">
                    Lasă un mesaj și revenim rapid.
                  </p>

                  <div className="grid gap-3">
                    <a
                        href={`tel:${brand.phone.replace(/\s/g, "")}`}
                        className="rounded-2xl border border-yellow-500/15 bg-neutral-950/50 p-4 hover:border-yellow-400/50 transition-colors"
                    >
                      <p className="text-xs text-neutral-400">Telefon</p>
                      <p className="mt-1 text-lg font-bold text-yellow-300">
                        {brand.phone}
                      </p>
                    </a>

                    <a
                        href={`mailto:${brand.email}`}
                        className="rounded-2xl border border-yellow-500/15 bg-neutral-950/50 p-4 hover:border-yellow-400/50 transition-colors"
                    >
                      <p className="text-xs text-neutral-400">Email</p>
                      <p className="mt-1 text-lg font-bold text-yellow-300">
                        {brand.email}
                      </p>
                    </a>

                    <div className="rounded-2xl border border-yellow-500/15 bg-neutral-950/50 p-4">
                      <p className="text-xs text-neutral-400">Adresă</p>

                      <p className="mt-1 text-lg font-bold text-yellow-300">
                        {brand.address}
                      </p>
                    </div>
                  </div>
                </div>

                <ContactForm />
              </div>
            </div>
          </section>
        </main>
      </>
  );
}