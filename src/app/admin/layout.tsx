import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    const isAdmin = (session as any)?.role === "ADMIN";

    // pagina de login nu are meniul de administrare
    if (!isAdmin) return <>{children}</>;

    return (
        <div className="min-h-screen bg-wash-2/60">
            <AdminNav />
            {children}
        </div>
    );
}
