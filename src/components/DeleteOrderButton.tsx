"use client";

import { useRef, useState } from "react";
import Icon from "@/components/Icon";

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
                aria-label={`Șterge comanda${label ? ` ${label}` : ""}`}
                title="Șterge comanda"
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-3 transition-colors hover:bg-hive-red/10 hover:text-hive-red"
            >
                <Icon name="trash" size={17} />
            </button>

            <dialog
                ref={dialogRef}
                className="m-auto w-[min(92vw,420px)] rounded-xl bg-paper p-0 text-ink backdrop:bg-ink/50"
            >
                <div className="p-6">
                    <div className="flex items-start gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-hive-red/12 text-hive-red">
                            <Icon name="alert" size={20} />
                        </span>
                        <div>
                            <h2 className="text-lg font-extrabold">Ștergi comanda{label ? ` ${label}` : ""}?</h2>
                            <p className="mt-1 text-[0.95rem] text-ink-2">
                                Comanda și toate produsele ei vor fi șterse definitiv. Această acțiune nu poate fi anulată.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={close} className="btn btn-ghost btn-sm">
                            Anulează
                        </button>

                        <form action={deleteAction} onSubmit={() => setPending(true)}>
                            <input type="hidden" name="orderId" value={orderId} />
                            <button type="submit" disabled={pending} className="btn btn-danger btn-sm">
                                {pending ? "Se șterge…" : "Șterge definitiv"}
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}
