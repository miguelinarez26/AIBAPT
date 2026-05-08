// Componente reutilizable para mostrar el badge de membresía del usuario.
interface MembershipBadgeProps {
  isMember: boolean;
  lang?: 'es' | 'pt';
}

export function MembershipBadge({ isMember, lang = 'es' }: MembershipBadgeProps) {
  if (isMember) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-aibapt-green/15 text-aibapt-green border border-aibapt-green/30">
        <span className="material-icons-round text-[14px]">verified</span>
        {lang === 'es' ? 'Socio Activo' : 'Sócio Ativo'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-aibapt-gray/10 text-aibapt-gray border border-aibapt-gray/30">
      <span className="material-icons-round text-[14px]">person</span>
      {lang === 'es' ? 'Usuario Registrado / Aspirante' : 'Usuário Registrado / Aspirante'}
    </span>
  );
}
