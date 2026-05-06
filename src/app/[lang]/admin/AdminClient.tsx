"use client";

import { useState } from "react";
import { ApplicationWithDetails } from "./page";
import { Search, Filter, Eye } from "lucide-react";
import AdminDetailModal from "./AdminDetailModal";

interface AdminClientProps {
  applications: ApplicationWithDetails[];
  lang: "es" | "pt";
}

export default function AdminClient({ applications, lang }: AdminClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedApp, setSelectedApp] = useState<ApplicationWithDetails | null>(null);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicant_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">Pendiente</span>;
      case "under_review": return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">En Revisión</span>;
      case "approved": return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Aprobado</span>;
      case "rejected": return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Rechazado</span>;
      default: return status;
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-accent/5 dark:bg-background-dark p-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold font-display text-text-main dark:text-white">
              {lang === "es" ? "Panel de Administración" : "Painel de Administração"}
            </h1>
            <p className="text-text-muted">Gestión de Solicitudes y Acreditaciones</p>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por email o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[var(--color-aibapt-green)] outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[var(--color-aibapt-green)] outline-none"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="under_review">En Revisión</option>
                <option value="approved">Aprobados</option>
                <option value="rejected">Rechazados</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-4 font-bold text-gray-500">Solicitante</th>
                  <th className="py-4 px-4 font-bold text-gray-500">Trámite</th>
                  <th className="py-4 px-4 font-bold text-gray-500">Fecha</th>
                  <th className="py-4 px-4 font-bold text-gray-500">Estado</th>
                  <th className="py-4 px-4 font-bold text-gray-500 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No se encontraron solicitudes.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-text-main dark:text-white">{app.applicant_name}</div>
                        <div className="text-xs text-text-muted">{app.applicant_email}</div>
                      </td>
                      <td className="py-4 px-4 font-medium text-text-main dark:text-gray-300">
                        {app.accreditation_type_name}
                      </td>
                      <td className="py-4 px-4 text-sm text-text-muted">
                        {new Date(app.created_at).toLocaleDateString(lang === "es" ? "es-ES" : "pt-BR")}
                      </td>
                      <td className="py-4 px-4">
                        {getStatusLabel(app.status)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedApp && (
        <AdminDetailModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdate={() => {
            // Recargar la página para reflejar cambios
            window.location.reload();
          }}
          lang={lang}
        />
      )}
    </div>
  );
}
