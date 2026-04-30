"use client";

import { motion } from "framer-motion";
import { AIBAPT_TRAMITES, EscenarioEvento } from "@/config/aibapt-config";
import { useParams } from "next/navigation";

interface TramiteSelectorProps {
  onSelect: (id: string) => void;
  searchTerm?: string;
}

export function TramiteSelector({ onSelect, searchTerm = "" }: TramiteSelectorProps) {
  const params = useParams();
  const lang = (params?.lang as 'es' | 'pt') || 'es';

  // Filter tramites based on search term
  const tramitesArray = Object.values(AIBAPT_TRAMITES).filter(t => 
    !searchTerm || 
    t.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.categoria[lang].toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered tramites by category
  const groupedTramites = tramitesArray.reduce((acc, tramite) => {
    const cat = tramite.categoria[lang];
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tramite);
    return acc;
  }, {} as Record<string, typeof AIBAPT_TRAMITES[string][]>);

  if (Object.keys(groupedTramites).length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 dark:bg-surface-dark/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
        <span className="material-icons-round text-4xl text-gray-400 mb-4 block">search_off</span>
        <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
          {lang === 'es' ? 'Sin resultados' : 'Sem resultados'}
        </h3>
        <p className="text-text-muted dark:text-gray-400">
          {lang === 'es' 
            ? `No encontramos ninguna acreditación que coincida con "${searchTerm}".`
            : `Não encontramos nenhuma acreditação que corresponda a "${searchTerm}".`}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in-up">
      {Object.entries(groupedTramites).map(([categoria, tramites]) => (
        <div key={categoria} className="space-y-6">
          <h2 className="text-2xl font-bold text-text-main dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">
            {categoria}
          </h2>
          <div className="flex flex-col gap-4">
            {tramites.map((tramite) => (
              <motion.div
                key={tramite.id}
                whileHover={{ x: 8 }}
                className="group bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                onClick={() => onSelect(tramite.id)}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-primary-dark transition-colors">
                    {tramite.title[lang]}
                  </h3>
                  <p className="text-sm text-text-muted dark:text-gray-400">
                    {tramite.description[lang]}
                  </p>
                </div>
                
                <div className="flex items-center gap-6 shrink-0 md:pl-6 md:border-l border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col md:items-end">
                    <span className="text-[10px] font-bold text-text-muted dark:text-gray-500 uppercase tracking-widest mb-1">
                      {lang === 'es' ? 'Costo' : 'Custo'}
                    </span>
                    <span className="text-sm text-accent font-bold">
                      {Array.isArray(tramite.monto) 
                        ? (lang === 'es' ? 'Variable según caso' : 'Variável conforme caso')
                        : typeof tramite.monto === 'number' 
                          ? `${tramite.monto} €` 
                          : tramite.monto}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center text-primary transition-colors">
                    <span className="material-icons-round text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
