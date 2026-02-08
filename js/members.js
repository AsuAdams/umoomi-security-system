// ============================
// Member Management Functions
// ============================

// Always use the global Supabase v2 client
const supabase = window.supabaseClient;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Members script loaded');
    loadMembers();
    setupSearch();
});

/* ============================
   LOAD MEMBERS
============================ */
async function loadMembers() {
    console.log('Loading members...');

    const tbody = document.getElementById('membersTableBody');
    const loadingIndicator = document.getElementById('loadingIndicator');

    if (loadingIndicator) loadingIndicator.style.display = 'block';
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:20px;">
                    Loading members...
                </td>
            </tr>`;
    }

    try {
        const { data, error } = await supabase
            .from('umoomi_members')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        console.log(`Members loaded: ${data.length}`);
        displayMembers(data);
        updateStats(data);

    } catch (error) {
        console.error('Error loading members:', error);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:20px;color:red;">
                        Error loading members:<br>${error.message}
                    </td>
                </tr>`;
        }
        alert('Failed to load members: ' + error.message);
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

/* ============================
   DISPLAY MEMBERS
============================ */
function displayMembers(members) {
    const tbody = document.getElementById('membersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (!members || members.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:30px;">
                    No members found
                </td>
            </tr>`;
        return;
    }

    members.forEach(member => {
        let statusBadge =
            member.status === 'Active'
                ? '<span class="badge badge-success">✓ Active</span>'
                : member.status === 'Inactive'
                ? '<span class="badge badge-secondary">○ Inactive</span>'
                : '<span class="badge badge-danger">✗ Suspended</span>';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${member.member_id}</strong></td>
            <td>
                ${member.photo_url
                    ? `<img src="${member.photo_url}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;margin-right:8px;">`
                    : ''}
                ${member.full_name}
            </td>
            <td>${member.position}</td>
            <td>${member.department}</td>
            <td>${member.region || '-'}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-info view-btn" data-id="${member.member_id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-primary scan-btn" data-id="${member.member_id}">
                    <i class="fas fa-qrcode"></i>
                </button>
                ${member.qr_code_url
                    ? `<a href="${member.qr_code_url}" target="_blank" class="btn btn-sm btn-success">
                        <i class="fas fa-download"></i>
                       </a>`
                    : ''}
            </td>
        `;

        tbody.appendChild(row);
    });

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () =>
            viewMemberDetails(btn.dataset.id)
        );
    });

    document.querySelectorAll('.scan-btn').forEach(btn => {
        btn.addEventListener('click', () =>
            window.location.href = `scanner.html?id=${btn.dataset.id}`
        );
    });
}

/* ============================
   VIEW MEMBER MODAL
============================ */
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
        if (!modal || !details) return;

        details.innerHTML = `
            <h2>${data.full_name}</h2>
            <p><strong>Member ID:</strong> ${data.member_id}</p>
            <p><strong>Position:</strong> ${data.position}</p>
            <p><strong>Department:</strong> ${data.department}</p>
            <p><strong>Region:</strong> ${data.region || '-'}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            <p><strong>Last Scan:</strong> ${
                data.last_scan
                    ? new Date(data.last_scan).toLocaleString('en-UG')
                    : 'Never'
            }</p>
        `;

        modal.style.display = 'block';

        document.querySelector('.close').onclick = () =>
            (modal.style.display = 'none');

        window.onclick = e => {
            if (e.target === modal) modal.style.display = 'none';
        };

    } catch (error) {
        console.error(error);
        alert('Error loading member details: ' + error.message);
    }
}

/* ============================
   STATS
============================ */
function updateStats(members) {
    const total = document.getElementById('totalMembers');
    const active = document.getElementById('activeMembers');

    if (total) total.textContent = members.length;
    if (active)
        active.textContent = members.filter(m => m.status === 'Active').length;
}

/* ============================
   SEARCH
============================ */
function setupSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    let timeout;

    input.addEventListener('input', e => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            const q = e.target.value.trim();
            if (q.length < 2) return loadMembers();

            const { data, error } = await supabase
                .from('umoomi_members')
                .select('*')
                .or(
                    `full_name.ilike.%${q}%,member_id.ilike.%${q}%,position.ilike.%${q}%,department.ilike.%${q}%,region.ilike.%${q}%`
                );

            if (!error) displayMembers(data);
        }, 300);
    });
}

/* ============================
   EXPORTS
============================ */
window.loadMembers = loadMembers;
window.viewMemberDetails = viewMemberDetails;
