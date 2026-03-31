// app/page.tsx
import Image from "next/image";
import Link from "next/link";

const brand = {
  name: "Mana Apuseană",
  siteUrl: "https://exemplu.ro",
  phone: "+40 752 819 170",
  email: "ionutbucea@yahoo.com",
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

const navItems = [
  { label: "Magazin", href: "/magazin" },
  { label: "Support", href: "#support" },
  { label: "Contact", href: "#contact" },
];

export default function Page() {
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
                  Sortiment curat (salcâm, tei, polifloră) + pachete cadou.
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
                    { k: "★ 4.9", v: "Recenzii" },
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
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-black">De ce de la noi</h2>
              </div>
              <a
                  href="#contact"
                  className="hidden md:inline-flex rounded-xl border border-yellow-500/25 px-4 py-2 text-sm hover:border-yellow-400/60"
              >
                Ai întrebări? Scrie-ne
              </a>
            </div>

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
              {[
                { name: "Miere de salcâm", grams: "500g", price: "45 Ron", image: "/images/miere-de-salcam-la-jumatate.jpeg", },
                { name: "Miere de tei", grams: "500g", price: "50 Ron", image: "/images/miere-de-tei-la-jumatate.jpeg", },
                { name: "Miere polifloră", grams: "1000g", price: "85 Ron", image: "/images/miere-poliflora-de-munte.jpeg", },
              ].map((p) => (
                  <article
                      key={p.name}
                      className="group rounded-3xl border border-yellow-500/15 bg-neutral-900/30 overflow-hidden"
                  >
                    <div className="relative h-80">
                      <Image
                          src={p.image}
                          alt={`${p.name} ${p.grams}`}
                          width={1200}
                          height={900}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-neutral-950/70 px-3 py-1 text-xs text-yellow-200 border border-yellow-500/20">
                    {p.grams}
                  </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold">{p.name}</h3>
                      <p className="mt-1 text-sm text-neutral-300">
                        Aromă naturală, perfectă pentru ceai, mic dejun sau cadou.
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-neutral-300">Preț: {p.price}</span>
                        <a
                            href="#contact"
                            className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 transition-colors"
                        >
                          Comandă
                        </a>
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
                  Scrie 4–6 propoziții despre: zona, cum aveți grijă de albine,
                  sezon, cum recoltați, ce vă diferențiază. Asta e aur pentru SEO
                  + credibilitate.
                </p>

                <ul className="mt-4 grid gap-2 text-sm text-neutral-300">
                  <li>• Recoltare responsabilă</li>
                  <li>• Ambalare sigură</li>
                  <li>• Recomandări de consum</li>
                </ul>
              </div>

              <div className="overflow-hidden rounded-3xl border border-yellow-500/15 bg-neutral-900/30">
                <Image
                    src="/images/poza_cu_stupii_departare.jpg"
                    alt="Stupină și peisaj natural"
                    width={1000}
                    height={600}
                    className="h-[230px] w-full object-cover"
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

          {/* CONTACT */}
          {/*<section id="contact" className="mx-auto max-w-6xl px-4 py-12">*/}
          {/*  <div className="rounded-[32px] border border-yellow-500/15 bg-neutral-900/30 p-6 md:p-10">*/}
          {/*    <div className="grid gap-8 md:grid-cols-2">*/}
          {/*      <div>*/}
          {/*        <h2 className="text-2xl font-black">Contact</h2>*/}
          {/*        <p className="mt-2 text-neutral-300">*/}
          {/*          Lasă un mesaj și revenim rapid.*/}
          {/*        </p>*/}

          {/*        <div className="mt-5 space-y-2 text-sm text-neutral-300">*/}
          {/*          <p>*/}
          {/*            <span className="text-yellow-200 font-semibold">Telefon:</span>{" "}*/}
          {/*            {brand.phone}*/}
          {/*          </p>*/}
          {/*          <p>*/}
          {/*            <span className="text-yellow-200 font-semibold">Email:</span>{" "}*/}
          {/*            {brand.email}*/}
          {/*          </p>*/}
          {/*          <p>*/}
          {/*            <span className="text-yellow-200 font-semibold">Adresă:</span>{" "}*/}
          {/*            {brand.address}*/}
          {/*          </p>*/}
          {/*        </div>*/}
          {/*      </div>*/}

          {/*      <form className="grid gap-3">*/}
          {/*        <label className="grid gap-1 text-sm">*/}
          {/*          <span className="text-neutral-200">Nume</span>*/}
          {/*          <input*/}
          {/*              className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"*/}
          {/*              placeholder="Numele tău"*/}
          {/*              name="name"*/}
          {/*              autoComplete="name"*/}
          {/*          />*/}
          {/*        </label>*/}

          {/*        <label className="grid gap-1 text-sm">*/}
          {/*          <span className="text-neutral-200">Email</span>*/}
          {/*          <input*/}
          {/*              className="rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"*/}
          {/*              placeholder="email@exemplu.ro"*/}
          {/*              name="email"*/}
          {/*              type="email"*/}
          {/*              autoComplete="email"*/}
          {/*          />*/}
          {/*        </label>*/}

          {/*        <label className="grid gap-1 text-sm">*/}
          {/*          <span className="text-neutral-200">Mesaj</span>*/}
          {/*          <textarea*/}
          {/*              className="min-h-[120px] rounded-xl border border-yellow-500/15 bg-neutral-950/60 px-4 py-3 outline-none focus:border-yellow-400/60"*/}
          {/*              placeholder="Spune-ne ce sortiment/gramaj te interesează…"*/}
          {/*              name="message"*/}
          {/*          />*/}
          {/*        </label>*/}

          {/*        <button*/}
          {/*            type="button"*/}
          {/*            className="mt-2 rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-yellow-400 transition-colors"*/}
          {/*        >*/}
          {/*          Trimite (demo)*/}
          {/*        </button>*/}

          {/*        <p className="text-xs text-neutral-400">*/}
          {/*          *În producție: reCAPTCHA, rate limiting, validare, email sender (Resend/SMTP).*/}
          {/*        </p>*/}
          {/*      </form>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</section>*/}
        </main>
      </>
  );
}