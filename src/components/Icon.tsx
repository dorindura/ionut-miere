import type { SVGProps } from "react";

const PATHS = {
    cart: (
        <>
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2.5 3h2.6l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21 7H6" />
        </>
    ),
    user: (
        <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
    arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
    phone: (
        <path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 4.2 2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1z" />
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
        </>
    ),
    pin: (
        <>
            <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
            <circle cx="12" cy="9.5" r="2.5" />
        </>
    ),
    truck: (
        <>
            <path d="M2 6h12v10H2zM14 10h4l3 3v3h-7" />
            <circle cx="6" cy="18" r="1.8" />
            <circle cx="17" cy="18" r="1.8" />
        </>
    ),
    box: (
        <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 10h18M10 14h4" />
        </>
    ),
    card: (
        <>
            <rect x="2.5" y="5" width="19" height="14" rx="2" />
            <path d="M2.5 10h19M6 15h4" />
        </>
    ),
    cash: (
        <>
            <rect x="2.5" y="6" width="19" height="12" rx="2" />
            <circle cx="12" cy="12" r="2.6" />
            <path d="M6 9.5v5M18 9.5v5" />
        </>
    ),
    alert: (
        <>
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            <path d="M12 9v4M12 17h.01" />
        </>
    ),
    trash: (
        <>
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
        </>
    ),
    edit: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />,
    external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
    logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
    star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
    home: <path d="M3 11 12 4l9 7M5 10v10h14V10" />,
    list: <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />,
    jar: (
        <>
            <path d="M8 3h8v3H8z" />
            <path d="M7 6h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
            <path d="M5 11h14M5 16h14" />
        </>
    ),
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({
    name,
    size = 20,
    className = "",
    ...rest
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className={`shrink-0 ${className}`}
            {...rest}
        >
            {PATHS[name]}
        </svg>
    );
}

/** semnul mărcii: un stup pictat, cu capac și urdiniș */
export function HiveMark({ size = 36, className = "" }: { size?: number; className?: string }) {
    return (
        <svg viewBox="0 0 36 36" width={size} height={size} aria-hidden className={`shrink-0 ${className}`}>
            <rect x="2" y="5" width="32" height="6" rx="1.5" fill="#1b4577" />
            <rect x="5" y="11" width="26" height="21" fill="var(--color-hive-blue)" />
            <rect x="5" y="19" width="26" height="2" fill="#1b4577" opacity="0.35" />
            <rect x="11" y="25.5" width="14" height="3" rx="1.5" fill="#0f1a13" />
            <rect x="9" y="30" width="18" height="3" fill="var(--color-hive-sun)" />
        </svg>
    );
}
