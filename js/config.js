// ========================================
// SUPABASE CONFIGURATION - UMOMI SECURITY SYSTEM
// ========================================
// ⚠️ SECURITY WARNING: These are your real credentials
// ⚠️ After testing, REGENERATE your keys in Supabase dashboard

// Supabase credentials (same as in index.html)
const SUPABASE_URL = "https://ccsicfimccsiizmpuvsm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2ljZmltY2NzaWl6bXB1dnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzA5MjcsImV4cCI6MjA4NjEwNjkyN30.IRVBVGPFqqB4_n5BSt2hXbvi9UitltDK2cqm479CLho";

// App Configuration
const config = {
    appName: 'Umoomi Security System',
    organization: 'Ahmadiyya Muslim Community Uganda',
    version: '1.0.0',
    roles: {
        super_admin: 'Super Admin',
        admin: 'Admin',
        manager: 'Manager',
        operator: 'Operator',
        field_agent: 'Field Agent'
    }
};

console.log('✅ Config loaded successfully');