// Admin Panel Functions

// Handle form submission
document.getElementById('addMemberForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const memberData = {
        member_id: document.getElementById('memberId').value,
        full_name: document.getElementById('fullName').value,
        position: document.getElementById('position').value,
        department: document.getElementById('department').value,
        region: document.getElementById('region').value || null,
        phone: document.getElementById('phone').value || null,
        email: document.getElementById('email').value || null,
        address: document.getElementById('address').value || null,
        status: document.getElementById('status').value,
        current_location: null,
        last_scan: null
    };
    
    try {
        const { data, error } = await supabase
            .from('umoomi_members')
            .insert([memberData]);
        
        if (error) throw error;
        
        alert('Member added successfully!');
        document.getElementById('addMemberForm').reset();
        
        // Reload members table
        loadMembers();
    } catch (error) {
        alert('Error adding member: ' + error.message);
    }
});

// Navigation
document.querySelectorAll('.admin-sidebar a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all
        document.querySelectorAll('.admin-sidebar a').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked
        link.classList.add('active');
        document.querySelector(link.getAttribute('href')).classList.add('active');
    });
});

// Load members for editing
async function loadMembersForEdit() {
    const { data } = await supabase
        .from('umoomi_members')
        .select('*')
        .order('full_name');
    
    const select = document.getElementById('editMemberSelect');
    select.innerHTML = '<option value="">Select Member</option>';
    
    data.forEach(member => {
        const option = document.createElement('option');
        option.value = member.member_id;
        option.textContent = `${member.full_name} (${member.member_id})`;
        select.appendChild(option);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMembersForEdit();
});