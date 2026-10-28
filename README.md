This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Analytics (GA4 + Meta Pixel)

Both are optional and driven entirely by environment variables. Set them in Vercel
(Project → Settings → Environment Variables), for Production and Preview:

| Variable | Where to find it | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_GA_ID` | Google Analytics → Admin → Data streams → *Measurement ID* | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_FB_PIXEL_ID` | Meta Events Manager → Data sources → your pixel → *Pixel ID* | `123456789012345` |

They are `NEXT_PUBLIC_*`, so they are baked in at build time: **redeploy after changing them.**

If neither is set, nothing loads and the cookie banner does not appear — the site
behaves exactly as it did before.

### Consent

Nothing is loaded until the visitor presses *Accept* in the cookie banner
(`src/components/CookieConsent.tsx`). On *Refuz* no third-party script is
requested at all. The choice is kept in `localStorage` under `pa-consent`; clearing
the site data makes the banner reappear. `/cookies` documents all of this.

### Events sent

| Event | GA4 | Meta | Fired from |
| --- | --- | --- | --- |
| Page view | `page_view` | `PageView` | every page, including client-side navigation |
| Product opened | `view_item` | `ViewContent` | `/magazin/[slug]` |
| Added to cart | `add_to_cart` | `AddToCart` | the *Adaugă în coș* button |
| Checkout opened | `begin_checkout` | `InitiateCheckout` | `/checkout` |
| Order placed | `purchase` | `Purchase` | `/comanda/[id]` |

`purchase` carries the order id as `transaction_id`, so it is deduplicated per order
and a reload does not count a second sale. Card orders are only counted once NETOPIA
confirms the payment; cash-on-delivery orders count immediately.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
