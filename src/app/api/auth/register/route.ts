import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {getPrisma} from "@/lib/db";

export async function POST(req: Request) {
    const prisma = getPrisma();
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();

    if (!email || !password) {
        return NextResponse.json({ error: "Email și parolă sunt obligatorii" }, { status: 400 });
    }
    if (password.length < 8) {
        return NextResponse.json({ error: "Parola minim 8 caractere" }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: "Email deja folosit" }, { status: 409 });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password: hash,
            role: "CUSTOMER",
            name: name || null,
            cart: { create: {} }, 
        },
        select: { id: true, email: true },
    });

    return NextResponse.json({ ok: true, user }, { status: 201 });
}