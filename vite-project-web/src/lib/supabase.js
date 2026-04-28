import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kshrxsqrhhvzdmptxujc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzaHJ4c3FyaGh2emRtcHR4dWpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MDM0MzgsImV4cCI6MjA5MTk3OTQzOH0.2ZU6QLT4Um6atcgzmN0EZ8lv_eVYk-dWR5r9NP1_AYo";

export const supabase = createClient(supabaseUrl, supabaseKey);