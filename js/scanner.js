// QR Scanner Functions

let html5QrCode = null;

// Initialize scanner
function initScanner() {
    const scannerElement = document.getElementById('reader');
    
    html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        onScanSuccess,
        onScanError
    ).catch(err => {
        console.error("Scanner start failed:", err);
        document.getElementById('statusMessage').textContent = 'Camera access denied. Please allow camera permissions.';
    });
}

// On scan success
async function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    
    // Stop scanner temporarily
    if (html5QrCode) {
        await html5QrCode.stop();
    }
    
    // Process the scanned code
    processScannedCode(decodedText);
    
    // Restart scanner after delay
    setTimeout(() => {
        if (html5QrCode) {
            initScanner();
        }
    }, 3000);
}

// On scan error
function onScanError(errorMessage) {
    // Ignore errors
}

// Process scanned code
async function processScannedCode(code) {
    // Extract member ID from QR code (format: UMOOMI:UM-HO-001)
    const memberId = code.replace('UMOOMI:', '').trim();
    
    document.getElementById('statusMessage').textContent = `Scanning ${memberId}...`;
    
    try {
        // Get member details
        const { data, error } = await supabase
            .from('umoomi_members')
            .select('*')
            .eq('member_id', memberId)
            .single();
        
        if (error) throw error;
        
        if (data) {
            displayMemberInfo(data);
            logActivity(memberId, 'scan', 'ID card scanned');
            
            // Update last scan timestamp
            await supabase
                .from('umoomi_members')
                .update({ last_scan: new Date().toISOString() })
                .eq('member_id', memberId);
            
            document.getElementById('statusMessage').textContent = `✓ ${data.full_name} scanned successfully!`;
        } else {
            document.getElementById('statusMessage').textContent = 'Member not found!';
            showError('Member not found in database');
        }
    } catch (error) {
        console.error('Scan error:', error);
        document.getElementById('statusMessage').textContent = 'Error scanning member';
        showError(error.message);
    }
}

// Display member info
function displayMemberInfo(member) {
    const infoBox = document.getElementById('memberInfo');
    
    // Status badge
    let statusBadge = '';
    if (member.status === 'Active') {
        statusBadge = '<span class="badge badge-success">Active</span>';
    } else if (member.status === 'Inactive') {
        statusBadge = '<span class="badge badge-secondary">Inactive</span>';
    } else {
        statusBadge = '<span class="badge badge-danger">Suspended</span>';
    }
    
    infoBox.innerHTML = `
        <div class="member-card">
            ${member.photo_url ? `<img src="${member.photo_url}" alt="${member.full_name}" class="member-photo-large">` : '<div class="placeholder-photo"><i class="fas fa-user"></i></div>'}
            <div class="member-details">
                <h3>${member.full_name}</h3>
                <p class="member-id">${member.member_id}</p>
                <div class="member-meta">
                    <span><i class="fas fa-briefcase"></i> ${member.position}</span>
                    <span><i class="fas fa-building"></i> ${member.department}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${member.region || 'Uganda'}</span>
                </div>
                <div class="member-status">
                    ${statusBadge}
                </div>
                <div class="contact-info">
                    <p><i class="fas fa-phone"></i> ${member.phone || 'Not provided'}</p>
                    <p><i class="fas fa-envelope"></i> ${member.email || 'Not provided'}</p>
                </div>
                <div class="tracking-info">
                    <p><i class="fas fa-map-marker-alt"></i> <strong>Current Location:</strong> ${member.current_location || 'Not tracked'}</p>
                    <p><i class="fas fa-clock"></i> <strong>Last Scan:</strong> ${member.last_scan ? new Date(member.last_scan).toLocaleString() : 'Never'}</p>
                </div>
            </div>
        </div>
    `;
    
    // Show info box
    document.getElementById('memberInfoBox').style.display = 'block';
    
    // Set current location in input
    document.getElementById('locationInput').value = member.current_location || '';
    
    // Add to scan history
    addToScanHistory(member);
}

// Update location
document.getElementById('updateLocationBtn')?.addEventListener('click', async () => {
    const location = document.getElementById('locationInput').value.trim();
    
    if (!location) {
        alert('Please enter a location');
        return;
    }
    
    // Get currently displayed member
    const memberCard = document.querySelector('.member-card h3');
    if (!memberCard) return;
    
    const memberName = memberCard.textContent;
    
    // Find member by name (you might want to store member ID in a hidden field)
    const { data } = await supabase
        .from('umoomi_members')
        .select('member_id')
        .eq('full_name', memberName)
        .single();
    
    if (data) {
        await supabase
            .from('umoomi_members')
            .update({ 
                current_location: location,
                last_scan: new Date().toISOString()
            })
            .eq('member_id', data.member_id);
        
        alert('Location updated successfully!');
        logActivity(data.member_id, 'location_update', location);
        
        // Refresh display
        const { data: updatedMember } = await supabase
            .from('umoomi_members')
            .select('*')
            .eq('member_id', data.member_id)
            .single();
        
        displayMemberInfo(updatedMember);
    }
});

// Log activity
async function logActivity(memberId, action, details) {
    await supabase.from('activity_logs').insert({
        member_id: memberId,
        action: action,
        details: { info: details },
        location: navigator.geolocation ? 'GPS available' : 'Unknown'
    });
}

// Add to scan history
function addToScanHistory(member) {
    const historyList = document.getElementById('scanHistoryList');
    
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <div class="history-time">${new Date().toLocaleTimeString()}</div>
        <div class="history-content">
            <strong>${member.full_name}</strong> (${member.member_id})
            <span class="history-action">scanned</span>
        </div>
    `;
    
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // Keep only last 10 items
    if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

// Show error message
function showError(message) {
    alert('Error: ' + message);
}

// Initialize scanner on page load
document.addEventListener('DOMContentLoaded', initScanner);