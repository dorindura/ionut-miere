import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim();
        const message = String(body.message || "").trim();

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        await resend.emails.send({
            from: "Prisaca Apuseni <contact@prisaca-apuseni.com>",
            to: ["buceadariusionut@gmail.com"],
            subject: `Mesaj nou contact - ${name}`,
            replyTo: email,
            html: `
                <h2>Mesaj nou de pe site</h2>

                <p><strong>Nume:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Mesaj:</strong></p>

                <p>${message.replace(/\n/g, "<br/>")}</p>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);

        return NextResponse.json(
            { error: "Internal error" },
            { status: 500 }
        );
    }
}