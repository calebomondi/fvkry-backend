import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_ANON_KEY);

export default supabase;