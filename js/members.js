// Member Management Functions

// Load all members
async function loadMembers() {
    try {
        const { data, error } = await supabase
            .from('umoomi_members')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        displayMembers(data);
        updateStats(data);
    } catch (error) {
        console.error('Error loading members:', error);
        alert('Failed to load members: ' + error.message);
    }
}

// Display members in table
function displayMembers(members) {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';
    
    members.forEach(member => {
        const row = document.createElement('tr');
        
        // Status badge
        let statusBadge = '';
        if (member.status === 'Active') {
            statusBadge = '<span class="badge badge-success">Active</span>';
        } else if (member.status === 'Inactive') {
            statusBadge = '<span class="badge badge-secondary">Inactive</span>';
        } else {
            statusBadge = '<span class="badge badge-danger">Suspended</span>';
        }
        
        row.innerHTML = `
            <td>${member.member_id}</td>
            <td>${member.full_name}</td>
            <td>${member.position}</td>
            <td>${member.department}</td>
            <td>${member.region || '-'}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-info view-btn" data-id="${member.member_id}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm btn-primary scan-btn" data-id="${member.member_id}">
                    <i class="fas fa-qrcode"></i> Scan
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const memberId = e.target.closest('button').dataset.id;
            viewMemberDetails(memberId);
        });
    });
    
    document.querySelectorAll('.scan-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const memberId = e.target.closest('button').dataset.id;
            window.location.href = `scanner.html?id=${memberId}`;
        });
    });
}

// View member details in modal
async function viewMemberDetails(memberId) {
    try {
        const { data, error } = await supabase
            .from('umoomi_members')
            .select('*')
            .eq('member_id', memberId)
            .single();
        
        if (error) throw error;
        
        const modal = document.getElementById('memberModal');
        const details = document.getElementById('memberDetails');
        
        details.innerHTML = `
            <div class="member-modal-content">
                ${data.photo_url ? `<img src="${data.photo_url}" alt="${data.full_name}" class="member-photo">` : ''}
                <div class="member-info-grid">
                    <div class="info-item">
                        <strong>Member ID:</strong>
                        <span>${data.member_id}</span>
                    </div>
                    <div class="info-item">
                        <strong>Full Name:</strong>
                        <span>${data.full_name}</span>
                    </div>
                    <div class="info-item">
                        <strong>Position:</strong>
                        <span>${data.position}</span>
                    </div>
                    <div class="info-item">
                        <strong>Department:</strong>
                        <span>${data.department}</span>
                    </div>
                    <div class="info-item">
                        <strong>Region:</strong>
                        <span>${data.region || '-'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Phone:</strong>
                        <span>${data.phone || '-'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Email:</strong>
                        <span>${data.email || '-'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Address:</strong>
                        <span>${data.address || '-'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Date Joined:</strong>
                        <span>${data.date_joined || '-'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Status:</strong>
                        <span>${data.status}</span>
                    </div>
                    <div class="info-item">
                        <strong>Current Location:</strong>
                        <span>${data.current_location || 'Not tracked'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Last Scan:</strong>
                        <span>${data.last_scan ? new Date(data.last_scan).toLocaleString() : 'Never'}</span>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Close modal
        document.querySelector('.close').onclick = () => {
            modal.style.display = 'none';
        };
        
        window.onclick = (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        };
    } catch (error) {
        alert('Error loading member details: ' + error.message);
    }
}

// Update stats
function updateStats(members) {
    document.getElementById('totalMembers').textContent = members.length;
    
    const activeCount = members.filter(m => m.status === 'Active').length;
    document.getElementById('activeMembers').textContent = activeCount;
}

// Search members
document.getElementById('searchInput')?.addEventListener('input', async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm.length > 0) {
        const { data, error } = await supabase
            .from('umoomi_members')
            .select('*')
            .or(`full_name.ilike.%${searchTerm}%,member_id.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,region.ilike.%${searchTerm}%`);
        
        if (!error) {
            displayMembers(data);
        }
    } else {
        loadMembers();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', loadMembers);