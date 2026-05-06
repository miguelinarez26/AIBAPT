'use client';

// Componente reutilizable para mostrar el estado de un trámite/solicitud.
// Usa los tokens de color AIBAPT definidos en globals.css.
import type { ApplicationStatus } from '@/types/database';
import { useLanguage } from '@/contexts/LanguageContext';

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus | string;
}

const STATUS_CONFIG: Record<string, {
  translationKey: string;
  icon: string;
  className: string;
}> = {
  draft: {
    translationKey: 'status.draft',
    icon: 'edit_document',
    className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  },
  uploading: {
    translationKey: 'status.uploading',
    icon: 'cloud_upload',
    className: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
  },
  pending: {
    translationKey: 'status.pending',
    icon: 'schedule',
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  },
  under_review: {
    translationKey: 'status.under_review',
    icon: 'visibility',
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
  },
  approved: {
    translationKey: 'status.approved',
    icon: 'check_circle',
    className: 'bg-aibapt-green/10 text-aibapt-green border-aibapt-green/20',
  },
  rejected: {
    translationKey: 'status.rejected',
    icon: 'cancel',
    className: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  },
  cancelled: {
    translationKey: 'status.cancelled',
    icon: 'block',
    className: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800/50 dark:text-gray-500 dark:border-gray-700/50',
  },
};

const FALLBACK_CONFIG = {
  translationKey: 'status.unknown',
  icon: 'help_outline',
  className: 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
};

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  const { t } = useLanguage();
  const config = STATUS_CONFIG[status] || FALLBACK_CONFIG;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors ${config.className}`}>
      <span className="material-icons-round text-[14px]">{config.icon}</span>
      {t(config.translationKey)}
    </span>
  );
}
