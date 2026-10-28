"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { FB_PIXEL_ID, GA_ID } from "@/lib/analytics";
import { useConsent } from "@/lib/useConsent";

/**
 * Încarcă GA4 și Meta Pixel, dar numai după acordul vizitatorului.
 *
 * Scripturile sunt montate abia când `readConsent()` spune „granted", așa că
 * un vizitator care refuză nu primește niciun cookie de analiză.
 */
export default function Analytics() {
    const granted = useConsent() === "granted";
    const pathname = usePathname();
    // prima vizualizare o trimit chiar scripturile la inițializare
    const firstView = useRef(true);

    // navigările din App Router nu reîncarcă pagina: trimitem noi page_view
    useEffect(() => {
        if (!granted) return;
        if (firstView.current) {
            firstView.current = false;
            return;
        }
        window.gtag?.("event", "page_view", { page_path: pathname });
        window.fbq?.("track", "PageView");
    }, [granted, pathname]);

    if (!granted) return null;

    return (
        <>
            {GA_ID ? (
                <>
                    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
                    <Script id="ga-init" strategy="afterInteractive">
                        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied'
});
gtag('consent', 'update', {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted'
});
gtag('config', '${GA_ID}');
                        `}
                    </Script>
                </>
            ) : null}

            {FB_PIXEL_ID ? (
                <Script id="fb-pixel" strategy="afterInteractive">
                    {`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');
                    `}
                </Script>
            ) : null}
        </>
    );
}
