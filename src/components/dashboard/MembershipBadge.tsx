// Componente reutilizable para mostrar el badge de membresía del usuario.
interface MembershipBadgeProps {
  isMember: boolean;
  lang?: 'es' | 'pt';
}

export function MembershipBadge({ isMember, lang = 'es' }: MembershipBadgeProps) {
  if (isMember) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-primary border border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
        <span className="material-icons-round text-[14px]">verified</span>
        {lang === 'es' ? 'Socio Activo' : 'Sócio Ativo'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-highlight text-text-main border border-highlight/50 shadow-sm">
      <span className="material-icons-round text-[14px]">person</span>
      {lang === 'es' ? 'Aspirante a Miembro' : 'Aspirante a Membro'}
    </span>
  );
}
