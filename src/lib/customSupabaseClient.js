
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ayafzwwklyjbzrehwukf.supabase.co'; // URL correcta
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5YWZ6d3drbHlqYnJ6ZWh3dWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5MjYwOTcsImV4cCI6MjA3MjUwMjA5N30.LzuoVX8Fasf_Qbz0U9RHiohEnZ_PBuK5-7focR2_9_Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
