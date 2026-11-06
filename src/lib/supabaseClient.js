import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tkawtrabnyqxmcsuppmj.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZqKKc6aDa59coNBXtp7F7w_PVRThEi7';

export const supabase = createClient(supabaseUrl, supabaseKey);
