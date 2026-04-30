// Componente reutilizable para mostrar el estado de un trámite/solicitud.
// Usa los tokens de color AIBAPT definidos en globals.css.
import type { ApplicationStatus } from '@/types/database';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  lang?: 'es' | 'pt';
}

const STATUS_CONFIG: Record<ApplicationStatus, {
  label: { es: string; pt: string };
  icon: string;
  className: string;
}> = {
  pending: {
    label: { es: 'Pendiente', pt: 'Pendente' },
    icon: 'schedule',
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  },
  under_review: {
    label: { es: 'En Revisión', pt: 'Em Revisão' },
    icon: 'visibility',
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  },
  approved: {
    label: { es: 'Aprobado', pt: 'Aprovado' },
    icon: 'check_circle',
    className: 'bg-aibapt-green/10 text-aibapt-green border-aibapt-green/20',
  },
  rejected: {
    label: { es: 'Rechazado', pt: 'Rejeitado' },
    icon: 'cancel',
    className: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  },
};

export function ApplicationStatusBadge({ status, lang = 'es' }: ApplicationStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${config.className}`}>
      <span className="material-icons-round text-[14px]">{config.icon}</span>
      {config.label[lang]}
    </span>
  );
}
