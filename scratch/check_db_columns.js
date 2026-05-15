
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
