import ProfileClient from './ProfileClient';

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = (lang === 'es' || lang === 'pt') ? lang : 'es';
  return <ProfileClient profile={null} lang={validLang as 'es' | 'pt'} />;
}
