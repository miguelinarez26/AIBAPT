import { Database, Application, AccreditationType } from '@/types/database';
import DashboardClient from './DashboardClient';

export type ApplicationWithType = Application & {
  accreditation_type_name: string;
};

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === 'es' || lang === 'pt') ? lang : 'es';

  return <DashboardClient profile={null} applications={[]} lang={validLang as 'es' | 'pt'} />;
}
