import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  // මේකෙන් බිල්ඩ් එකේදී Error එකක් එන එක නවත්තනවා
  // ඒත් මේක දාන්න ඕනේ කෝඩ් එක බිල්ඩ් වෙද්දී Variable එක නැති වුණත් Error එකක් නැතුව යන්න
  console.error("Supabase environment variables are missing!");
}

export const supabase = createClient(
  supabaseUrl || '', 
  supabaseKey || ''
);
