
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://movrahslqtxeuvdnbesi.supabase.co';
const supabaseKey = 'sb_secret_VRYSvZapfxrH0AmHbG9T4g_UyjP-gm4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('proximos_eventos').select('*').limit(1);
    if (error) {
        console.error(error);
        return;
    }
    console.log('--- PROXIMOS EVENTOS ---');
    console.log(JSON.stringify(data[0], null, 2));

    const { data: data2, error: error2 } = await supabase.from('videoteca_webinars').select('*').limit(1);
    if (error2) {
        console.error(error2);
        return;
    }
    console.log('--- VIDEOTECA WEBINARS ---');
    console.log(JSON.stringify(data2[0], null, 2));
}

check();
