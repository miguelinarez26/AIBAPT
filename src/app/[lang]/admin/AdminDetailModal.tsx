"use client";

import { useState, useEffect } from "react";
import { ApplicationWithDetails } from "./page";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { X, FileDown, Check, Ban, Clock, Loader2 } from "lucide-react";

interface AdminDetailModalProps {
  application: ApplicationWithDetails;
  onClose: () => void;
  onUpdate: () => void;
  lang: "es" | "pt";
}

interface DocFile {
  id: string;
  document_type: string;
  url: string;
}

export default function AdminDetailModal({ application, onClose, onUpdate, lang }: AdminDetailModalProps) {
  const [documents, setDocuments] = useState<DocFile[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | "review" | null>(null);
  const [error, setError] = useState("");

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoadingDocs(true);
      const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('application_id', application.id);

      if (docsError) {
        console.error("Error fetching docs:", docsError);
        setIsLoadingDocs(false);
        return;
      }

      // Generar Signed URLs
      const docsWithUrls: DocFile[] = [];
      for (const doc of docs || []) {
        const { data: urlData } = await supabase
          .storage
          .from('private-certifications')
          .createSignedUrl(doc.file_path, 60 * 5); // 5 minutos

        if (urlData) {
          docsWithUrls.push({
            id: doc.id,
            document_type: doc.document_type,
            url: urlData.signedUrl
          });
        }
      }
      setDocuments(docsWithUrls);
      setIsLoadingDocs(false);
    };

    fetchDocuments();
  }, [application.id, supabase]);

  const handleUpdateStatus = async (newStatus: "pending" | "under_review" | "approved" | "rejected") => {
    if (newStatus === "rejected" && !rejectNotes.trim()) {
      setError("Debes ingresar un motivo para rechazar la solicitud.");
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      // 1. Update Application Status & Metadata (Notas)
      const newMetadata = {
        ...(application.metadata as Record<string, unknown> || {}),
        admin_notes: newStatus === "rejected" ? rejectNotes : undefined
      };

      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: newStatus, metadata: newMetadata })
        .eq('id', application.id);

      if (updateError) throw updateError;

      // 2. Automate CCA Course Creation
      if (newStatus === "approved" && application.accreditation_type_name === "CCA") {
        const { error: ccaError } = await supabase
          .from('courses_accredited')
          .insert({
            title: `CCA - ${application.applicant_name}`,
            instructor_name: application.applicant_name,
            language: lang,
            credits: 10, // Defecto
            is_public: true
          });
        
        if (ccaError) console.error("Error creando CCA auto:", ccaError);
      }

      onUpdate();
    } catch (err) {
      console.error("Update error:", err);
      setError((err as Error).message || "Error al actualizar la solicitud.");
    } finally {
      setIsUpdating(false);
    }
  };

  const metadata = (application.metadata as Record<string, unknown>) || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-surface-dark w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <h2 className="text-xl font-bold font-display text-text-main dark:text-white">
            Detalle de Solicitud
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Solicitante</p>
                <p className="font-bold text-lg text-text-main dark:text-white">{application.applicant_name}</p>
                <p className="text-sm text-text-muted">{application.applicant_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Trámite</p>
                <p className="font-medium text-[var(--color-aibapt-green)] bg-[var(--color-aibapt-green)]/10 px-3 py-1 rounded-lg inline-block">
                  {application.accreditation_type_name}
                </p>
              </div>
            </div>

            <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Metadatos</p>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Monto Pagado:</span>
                  <span className="font-bold">€{metadata?.monto_pagado || 0}</span>
                </div>
                {metadata?.escenario && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Escenario:</span>
                    <span className="font-bold">{metadata.escenario}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Modalidad:</span>
                  <span className="font-bold">{metadata?.modalidad_online ? 'Online' : 'Presencial'}</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-text-main dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
            Documentos Adjuntos
          </h3>
          
          {isLoadingDocs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : documents.length === 0 ? (
            <p className="text-gray-500 text-sm py-4">No hay documentos adjuntos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-primary/5 hover:border-primary/30 transition-colors group"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-3 shrink-0">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <div className="truncate flex-1">
                    <p className="text-sm font-bold text-text-main dark:text-white truncate">
                      {doc.document_type}
                    </p>
                    <p className="text-xs text-primary group-hover:underline">Ver Documento</p>
                  </div>
                </a>
              ))}
            </div>
          )}

          {actionType === "reject" && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-2xl animate-fade-in-up">
              <label className="block text-sm font-bold text-red-800 dark:text-red-400 mb-2">
                Motivo del Rechazo (Obligatorio)
              </label>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                className="w-full rounded-xl border border-red-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                rows={3}
                placeholder="Explica al usuario qué falta o por qué se rechaza..."
              />
              <div className="flex justify-end gap-2 mt-3">
                <button 
                  onClick={() => setActionType(null)}
                  className="px-4 py-2 text-sm text-gray-500 font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleUpdateStatus("rejected")}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar Rechazo"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex flex-wrap gap-3 justify-end">
          {application.status !== 'under_review' && (
            <button
              onClick={() => handleUpdateStatus("under_review")}
              disabled={isUpdating || actionType === 'reject'}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-bold hover:bg-blue-200 transition-colors"
            >
              <Clock className="w-4 h-4 mr-2" /> En Revisión
            </button>
          )}
          
          <button
            onClick={() => setActionType("reject")}
            disabled={isUpdating || actionType === 'reject'}
            className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition-colors"
          >
            <Ban className="w-4 h-4 mr-2" /> Rechazar
          </button>
          
          <button
            onClick={() => handleUpdateStatus("approved")}
            disabled={isUpdating || actionType === 'reject'}
            className="flex items-center px-6 py-2 bg-[var(--color-aibapt-green)] text-white rounded-xl font-bold hover:opacity-90 transition-colors shadow-md shadow-green-500/20"
          >
            {isUpdating && actionType !== 'reject' ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Check className="w-4 h-4 mr-2" />
            )}
            Aprobar Solicitud
          </button>
        </div>

      </div>
    </div>
  );
}
