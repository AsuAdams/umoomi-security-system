// js/supabase.js
// ----------------------------
// Supabase Client (v2 - browser)
// ----------------------------

const SUPABASE_URL = "https://ccsicfimccsiizmpuvsm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2ljZmltY2NzaWl6bXB1dnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzA5MjcsImV4cCI6MjA4NjEwNjkyN30.IRVBVGPFqqB4_n5BSt2hXbvi9UitltDK2cqm479CLho";

// IMPORTANT: supabase-js v2 exposes createClient on window.supabase
const { createClient } = window.supabase;

// Create ONE global client
window.supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Optional debug
console.log("Supabase client initialized");
