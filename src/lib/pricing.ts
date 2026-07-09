import { supabaseAdmin } from './supabase-server';

export interface PricingResult {
    finalPrice: number;
    reason: 'public' | 'member_free' | 'member_past';
    webinarId: string;
    webinarTitle: string;
    eventDate: string;
    isMember: boolean;
}

export async function calculateWebinarPrice(userId: string | null, webinarSlug: string): Promise<PricingResult> {
    // 1. Fetch the webinar details
    let webinarObj: any = null;

    const { data: webinar, error: webinarError } = await supabaseAdmin
        .from('proximos_eventos')
        .select('id, title, event_date, price_public, price_member_past')
        .eq('slug', webinarSlug)
        .single();

    if (!webinarError && webinar) {
        webinarObj = webinar;
    } else {
        // Fallback to videoteca_webinars
        const { data: videoteca, error: videotecaError } = await supabaseAdmin
            .from('videoteca_webinars')
            .select('id, title, event_date, price_public, price_member_past')
            .eq('slug', webinarSlug)
            .single();

        if (!videotecaError && videoteca) {
            webinarObj = videoteca;
        } else {
            // Also fallback by ID since slugs might not always be used
            const { data: videotecaById, error: videotecaByIdError } = await supabaseAdmin
                .from('videoteca_webinars')
                .select('id, title, event_date, price_public, price_member_past')
                .eq('id', webinarSlug)
                .single();
                
            if (!videotecaByIdError && videotecaById) {
                webinarObj = videotecaById;
            }
        }
    }

    if (!webinarObj) {
        throw new Error('Webinar no encontrado');
    }

    // Default response for non-logged in users
    if (!userId) {
        return {
            finalPrice: webinarObj.price_public || 10,
            reason: 'public',
            webinarId: webinarObj.id,
            webinarTitle: webinarObj.title,
            eventDate: webinarObj.event_date,
            isMember: false
        };
    }

    // 2. Fetch the user profile to check membership status
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('is_member, membership_expiry')
        .eq('id', userId)
        .single();

    if (profileError || !profile) {
        // Fallback to public price if profile not found
        return {
            finalPrice: webinarObj.price_public || 10,
            reason: 'public',
            webinarId: webinarObj.id,
            webinarTitle: webinarObj.title,
            eventDate: webinarObj.event_date,
            isMember: false
        };
    }

    // 3. Evaluate active membership
    const now = new Date();
    const safeProfile: any = profile;
    const expiryDate = safeProfile.membership_expiry ? new Date(safeProfile.membership_expiry) : null;
    const isActiveMember = safeProfile.is_member === true && expiryDate && expiryDate > now;

    if (!isActiveMember) {
        return {
            finalPrice: webinarObj.price_public || 10,
            reason: 'public',
            webinarId: webinarObj.id,
            webinarTitle: webinarObj.title,
            eventDate: webinarObj.event_date,
            isMember: false
        };
    }

    // 4. Calculate price based on event date for active members
    // Set both to midnight (UTC) for a fair "day-of" comparison
    const eventDate = new Date(webinarObj.event_date);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const eventDay = new Date(eventDate);
    eventDay.setUTCHours(0, 0, 0, 0);

    if (today <= eventDay) {
        // Event is today or in the future
        return {
            finalPrice: 0,
            reason: 'member_free',
            webinarId: webinarObj.id,
            webinarTitle: webinarObj.title,
            eventDate: webinarObj.event_date,
            isMember: true
        };
    } else {
        // Event has already passed
        return {
            finalPrice: webinarObj.price_member_past || 5,
            reason: 'member_past',
            webinarId: webinarObj.id,
            webinarTitle: webinarObj.title,
            eventDate: webinarObj.event_date,
            isMember: true
        };
    }
}
