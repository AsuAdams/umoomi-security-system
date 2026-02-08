// Supabase Configuration
const supabaseUrl = 'YOUR_SUPABASE_URL_HERE';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize Supabase client
const supabase = supabase.create({
    url: supabaseUrl,
    key: supabaseKey
});

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