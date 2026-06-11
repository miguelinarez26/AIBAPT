"use client";

import { useState, useMemo } from "react";
import { Profile } from "@/types/database";
import { translations } from "@/i18n/translations";
import { Search, UserCog, Shield, User, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface UserManagementClientProps {
    initialUsers: Profile[];
    lang: 'es' | 'pt';
}

export default function UserManagementClient({ initialUsers, lang }: UserManagementClientProps) {
    const [users, setUsers] = useState<Profile[]>(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    
    const t = translations[lang];

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const fullStr = `${u.first_name} ${u.last_name} ${u.email} ${u.member_number}`.toLowerCase();
            return fullStr.includes(searchTerm.toLowerCase());
        });
    }, [users, searchTerm]);

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingId(userId);
        const supabase = createBrowserSupabaseClient();
        
        try {
            const { error } = await (supabase.from('profiles') as any)
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
            setSuccessMessage(t["admin.users.success.role"] as string);
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Error al actualizar el rol.");
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header con Buscador */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-secondary dark:text-white tracking-tight flex items-center gap-3">
                        <UserCog className="w-8 h-8 text-primary" />
                        {/* @ts-ignore */}
                        {t["admin.users.title"]}
                    </h1>
                    <p className="text-text-muted dark:text-gray-400 text-sm mt-1">
                        {/* @ts-ignore */}
                        {t["admin.users.desc"]}
                    </p>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text"
                        placeholder={t["members.search"]}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-surface-dark border border-accent/20 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            {/* Mensaje de Éxito */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-aibapt-green/10 border border-aibapt-green/30 p-4 rounded-xl flex items-center gap-3 text-aibapt-green font-bold text-sm"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        {successMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabla de Usuarios */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800 uppercase text-[10px] font-black tracking-widest text-gray-400">
                            <tr>
                                <th className="px-6 py-5">Usuario</th>
                                <th className="px-6 py-5">Email</th>
                                <th className="px-6 py-5">Matrícula</th>
                                <th className="px-6 py-5">
                                    {/* @ts-ignore */}
                                    {t["admin.users.table.role"]}
                                </th>
                                <th className="px-6 py-5 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {u.first_name?.charAt(0) || <User className="w-4 h-4" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-text-main dark:text-white">
                                                    {u.first_name} {u.last_name}
                                                </span>
                                                <span className="text-[10px] text-text-muted uppercase tracking-tighter">
                                                    {u.role === 'admin' ? 'AIBAPT Admin' : 'Member'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-text-muted dark:text-gray-400">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-black text-secondary dark:text-gray-300">
                                            {u.member_number || '---'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select 
                                            value={u.role || 'member'}
                                            disabled={updatingId === u.id}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-900 border border-accent/20 dark:border-gray-800 text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
                                        >
                                            <option value="member">MEMBER</option>
                                            <option value="admin">ADMIN</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {u.role === 'admin' && <Shield className="w-4 h-4 text-aibapt-green" />}
                                            {updatingId === u.id && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
