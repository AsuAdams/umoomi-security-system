// ===============================
// Supabase Configuration
// ===============================

// ❗ Use PROJECT URL, NOT dashboard URL
const supabaseUrl = "https://PROJECT_ID.supabase.co";

// ❗ anon public key (this is OK to expose)
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2ljZmltY2NzaWl6bXB1dnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzA5MjcsImV4cCI6MjA4NjEwNjkyN30.IRVBVGPFqqB4_n5BSt2hXbvi9UitltDK2cqm479CLho";

// ✅ CORRECT client creation
const supabase = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// Debug check (VERY IMPORTANT)
console.log("Supabase initialized:", supabase);
