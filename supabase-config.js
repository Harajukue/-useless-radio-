// supabase-config.js
// Replace these two values with your actual Supabase project credentials.
// See SETUP.md for step-by-step instructions.

const SUPABASE_URL      = 'https://npomoktgwlmpwlmfcgeb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_1Fu0LSA3Cbc2z5D-cci5sA_w91LDtAB';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
