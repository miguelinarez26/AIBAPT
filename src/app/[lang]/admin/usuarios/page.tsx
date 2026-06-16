import { Metadata } from "next";
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
    const validLang = (lang === 'es' || lang === 'pt') ? lang : 'es';

    return (
        <div className="pt-32 pb-20 px-6 max-w-[1280px] mx-auto">
            <UserManagementClient initialUsers={[]} lang={validLang} />
        </div>
    );
}
