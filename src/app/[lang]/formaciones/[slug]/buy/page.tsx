import { calculateWebinarPrice } from "@/lib/pricing";
import BuyClient from "./BuyClient";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const cookieStore = await cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
          cookies: {
              get(name: string) {
                  return cookieStore.get(name)?.value
              },
          },
      }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || null;

  try {
    const pricing = await calculateWebinarPrice(userId, slug);
    
    // Also fetch the thumbnail URL if we need it, or we can just fetch the whole record
    let title = "";
    let thumbnail = "";
    let isOfficial = true;

    const { data: webinarRes } = await supabaseAdmin
        .from('proximos_eventos')
        .select('thumbnail_url, title, is_official')
        .eq('slug', slug)
        .single();
    
    const webinar: any = webinarRes;

    if (webinar) {
        title = webinar.title;
        thumbnail = webinar.thumbnail_url || '';
        isOfficial = webinar.is_official;
    } else {
        const { data: videotecaRes } = await supabaseAdmin
            .from('videoteca_webinars')
            .select('thumbnail_url, video_url, title')
            .eq('slug', slug)
            .single();

        const videoteca: any = videotecaRes;

        if (videoteca) {
            title = videoteca.title;
            thumbnail = videoteca.thumbnail_url || videoteca.video_url || '';
            isOfficial = true;
        } else {
            const { data: videotecaByIdRes } = await supabaseAdmin
                .from('videoteca_webinars')
                .select('thumbnail_url, video_url, title')
                .eq('id', slug)
                .single();
            
            const videotecaById: any = videotecaByIdRes;
                
            if (videotecaById) {
                title = videotecaById.title;
                thumbnail = videotecaById.thumbnail_url || videotecaById.video_url || '';
                isOfficial = true;
            } else {
                notFound();
            }
        }
    }

    return <BuyClient slug={slug} initialPrice={pricing.finalPrice} title={title} thumbnail={thumbnail} isFree={pricing.finalPrice === 0} />;
  } catch (err) {
    console.error(err);
    notFound();
  }
}
