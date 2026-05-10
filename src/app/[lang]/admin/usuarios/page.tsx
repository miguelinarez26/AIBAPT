import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import UserManagementClient from "./UserManagementClient";

interface Props {
    params: Promise<{
        lang: 'es' | 'pt';
    }>;
}

export const metadata: Metadata = {
    title: "Gestión de Usuarios | Admin AIBAPT",
};

export default async function AdminUsersPage({ params }: Props) {
    const { lang } = await params;
    const supabase = await createServerSupabaseClient();

    // 1. Verificar sesión y rol de administrador
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect(`/${lang}/login`);

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        redirect(`/${lang}/dashboard`);
    }

    // 2. Obtener todos los perfiles para la gestión
    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching users for admin:", error);
        return <div>Error al cargar usuarios.</div>;
    }

    return (
        <div className="pt-32 pb-20 px-6 max-w-[1280px] mx-auto">
            <UserManagementClient initialUsers={users || []} lang={lang} />
        </div>
    );
}
