// js/supabase.js

const SUPABASE_URL = "https://ccsicfimccsiizmpuvsm.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2ljZmltY2NzaWl6bXB1dnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzA5MjcsImV4cCI6MjA4NjEwNjkyN30.IRVBVGPFqqB4_n5BSt2hXbvi9UitltDK2cqm479CLho";

// ✅ Create Supabase client (browser-safe)
const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Debug check
console.log("Supabase client ready:", supabase);
