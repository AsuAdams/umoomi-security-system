// Authentication Functions

// Check if user is logged in
async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        // User is logged in
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'block';
        
        // Get user role and name
        const { data: userData } = await supabase
            .from('users')
            .select('role, member_id')
            .eq('email', user.email)
            .single();
        
        if (userData) {
            // Get member name
            const { data: member } = await supabase
                .from('umoomi_members')
                .select('full_name')
                .eq('member_id', userData.member_id)
                .single();
            
            if (member) {
                document.getElementById('userName').textContent = member.full_name;
            }
            
            // Show/hide admin features based on role
            checkUserRole(userData.role);
        }
        
        return true;
    } else {
        // User is not logged in
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('userName').textContent = 'Guest';
        return false;
    }
}

// Login function
async function login(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        // Redirect to dashboard
        window.location.href = 'index.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

// Logout function
async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}

// Check user role and show/hide features
function checkUserRole(role) {
    const adminFeatures = document.querySelectorAll('.admin-feature');
    
    if (role === 'super_admin' || role === 'admin' || role === 'manager') {
        adminFeatures.forEach(el => el.style.display = 'block');
    } else {
        adminFeatures.forEach(el => el.style.display = 'none');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        const email = prompt('Enter your email:');
        const password = prompt('Enter your password:');
        if (email && password) {
            login(email, password);
        }
    });
    
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
});