# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** Romanian households buying honey for their own table, who want honey that really comes from a beekeeper rather than a supermarket shelf, and who reorder when a jar runs out.
- **Device:** mostly phones. Visitors arrive from shared links (social, messaging) and browse, add to cart and check out on mobile.
- **Admin:** the beekeeper (Ionuț) handling orders: confirming them by phone, setting the COD amount on the AWB, and shipping to an address or an easybox locker. He also edits products, prices and stock.

## Product Purpose

An online shop for Prisaca Apuseni's honey. Visitors browse a small range of varieties in two jar sizes, add them to a cart, and check out as a guest or with an account. Success means a first-time visitor trusts that this is a real family apiary, picks a variety, and completes the order without a phone call. For the admin, success means knowing at a glance which orders need action and never shipping an unpaid card order or putting the wrong COD amount on an AWB.

## Positioning

A father-and-son apiary in Bistra (Gârde village), Alba county, in the Apuseni Mountains, selling its own harvest directly. The hives sit on a slope beside the family house. Fir honeydew (mană de brad) is the rare, region-specific variety that a lowland producer cannot truthfully offer.

## Operating Context

- **Varieties:** acacia (salcâm), fir honeydew (mană de brad), linden (tei), mountain polyfloral (polifloră de munte), each in 1000g and 500g jars. Products can be marked "popular" and in or out of stock.
- **Delivery:** to an address (25 RON) or to an easybox locker (18 RON). Cash on delivery at easybox is **card only** at the locker; customers often assume cash works, so the site must say this clearly.
- **Payment:** cash on delivery (COD) today. NETOPIA card payment is built but hidden until merchant credentials exist.
- **Admin workflow:** a new order comes in → phone confirmation → status CONFIRMED → set the COD amount on the AWB (0 for paid card orders) → SHIPPED → DELIVERED. Admins can add notes and delete orders.
- **Legal:** the site has to show the seller's details, ANPC SAL, terms, privacy, cookie and return pages (required for NETOPIA approval).

## Capabilities and Constraints

- **Stack:** Next.js (App Router), Tailwind v4, Prisma/Postgres, next-auth, deployed on Vercel.
- **Language:** all customer-facing copy is Romanian, with diacritics.
- **Seller:** Bucea Darius Ionuț PFA (CUI 48123768), not a VAT payer.
- **Not built:** there is no reviews or comments system. The Comment model exists in the schema, but there is no UI for it.

## Brand Commitments

- The name **Prisaca Apuseni** stays.
- The jar label (orange honeycomb, bee, script lettering) is the physical brand on every product photo. The site must not clash with it.
- Beyond the name, the visual identity is open (the owner approved a full redesign).

## Evidence on Hand

- `public/images/horica_bucea.jpg`: a family member at an open hive, with a forested Apuseni slope behind (portrait).
- `public/images/poza_cu_stupii.jpg` and `poza_cu_stupii_departare.jpg`: rows of multicoloured painted hives on a green slope below the family house.
- Product photos: jars on a plain white background, in `public/images/*.jpeg`.
- The father-and-son story and the Bistra/Apuseni origin.
- **Absent, and must not be fabricated:** ratings, review counts, testimonials, lab analyses, certifications, or claims such as "★ 5.0" or "100% verified".

## Product Principles

1. **Show the apiary, don't describe it.** The real hives, people and place carry trust; generic honey imagery does not.
2. **Mobile checkout is the product.** Every screen is judged first at phone width and one-handed.
3. **No invented proof.** Only claims the family can stand behind.
4. **Admin safety over admin beauty.** Payment status and COD amount must be impossible to misread.

## Accessibility & Inclusion

Customers include older buyers on phones. Use readable body sizes, generous tap targets, and sufficient contrast. Do not rely on color alone for order or payment status.
