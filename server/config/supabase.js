const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role for backend logic

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        disableSignup: false,
        disableEmail: true,
        confirmEmail: false
    }
});

module.exports = supabase;
