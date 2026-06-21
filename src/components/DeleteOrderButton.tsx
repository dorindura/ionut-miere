"use client";

import { useRef, useState } from "react";

export default function DeleteOrderButton({
    orderId,
    label,
    deleteAction,
}: {
    orderId: string;
    label?: string;
    deleteAction: (formData: FormData) => void;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [pending, setPending] = useState(false);

    const open = () => dialogRef.current?.showModal();
    const close = () => dialogRef.current?.close();

    return (
        <>
            <button
                type="button"
                onClick={open}
                aria-label="Șterge comanda"
                title="Șterge comanda"
                className="grid h-9 w-9 place-items-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 transition-colors hover:border-red-400/60 hover:bg-red-500/20"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                >
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                </svg>
            </button>

            <dialog
                ref={dialogRef}
                className="m-auto w-[min(92vw,420px)] rounded-3xl border border-red-500/20 bg-neutral-900 p-0 text-neutral-100 backdrop:bg-black/60"
            >
                <div className="p-6">
                    <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500/15 text-red-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <path d="M12 9v4" />
                                <path d="M12 17h.01" />
                            </svg>
                        </span>
                        <div>
                            <h2 className="text-lg font-black">Ștergi comanda?</h2>
                            <p className="mt-1 text-sm text-neutral-300">
                                Comanda{label ? ` ${label}` : ""} și toate produsele ei vor fi șterse
                                definitiv. Această acțiune nu poate fi anulată.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={close}
                            className="rounded-xl border border-yellow-500/25 px-4 py-2 text-sm font-semibold hover:border-yellow-400/60"
                        >
                            Anulează
                        </button>

                        <form action={deleteAction} onSubmit={() => setPending(true)}>
                            <input type="hidden" name="orderId" value={orderId} />
                            <button
                                type="submit"
                                disabled={pending}
                                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-red-400 disabled:opacity-60"
                            >
                                {pending ? "Se șterge..." : "Șterge definitiv"}
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}
