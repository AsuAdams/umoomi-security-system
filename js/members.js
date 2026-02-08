/*************************************************
 * SUPABASE INITIALIZATION (V2 – REQUIRED)
 *************************************************/

const SUPABASE_URL = "https://ccsicfimccsiizmpuvsm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2ljZmltY2NzaWl6bXB1dnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzA5MjcsImV4cCI6MjA4NjEwNjkyN30.IRVBVGPFqqB4_n5BSt2hXbvi9UitltDK2cqm479CLho";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("✅ Supabase ready (members)");

/*************************************************
 * LOAD ALL MEMBERS
 *************************************************/
async function loadMembers() {
  try {
    const { data, error } = await supabase
      .from("umoomi_members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    displayMembers(data);
    updateStats(data);

  } catch (error) {
    console.error(error);
    alert("❌ Failed to load members: " + error.message);
  }
}

/*************************************************
 * DISPLAY MEMBERS TABLE
 *************************************************/
function displayMembers(members) {
  const tbody = document.getElementById("membersTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  members.forEach((member) => {
    let statusBadge = "";

    if (member.status === "Active") {
      statusBadge = '<span class="badge badge-success">Active</span>';
    } else if (member.status === "Inactive") {
      statusBadge = '<span class="badge badge-secondary">Inactive</span>';
    } else {
      statusBadge = '<span class="badge badge-danger">Suspended</span>';
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${member.member_id}</td>
      <td>${member.full_name}</td>
      <td>${member.position}</td>
      <td>${member.department}</td>
      <td>${member.region || "-"}</td>
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

  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const memberId = e.target.closest("button").dataset.id;
      viewMemberDetails(memberId);
    });
  });

  document.querySelectorAll(".scan-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const memberId = e.target.closest("button").dataset.id;
      window.location.href = `scanner.html?id=${memberId}`;
    });
  });
}

/*************************************************
 * VIEW MEMBER DETAILS
 *************************************************/
async function viewMemberDetails(memberId) {
  try {
    const { data, error } = await supabase
      .from("umoomi_members")
      .select("*")
      .eq("member_id", memberId)
      .single();

    if (error) throw error;

    const modal = document.getElementById("memberModal");
    const details = document.getElementById("memberDetails");

    details.innerHTML = `
      <div class="member-modal-content">
        ${data.photo_url ? `<img src="${data.photo_url}" class="member-photo">` : ""}
        <div class="member-info-grid">
          <div><strong>ID:</strong> ${data.member_id}</div>
          <div><strong>Name:</strong> ${data.full_name}</div>
          <div><strong>Position:</strong> ${data.position}</div>
          <div><strong>Department:</strong> ${data.department}</div>
          <div><strong>Region:</strong> ${data.region || "-"}</div>
          <div><strong>Phone:</strong> ${data.phone || "-"}</div>
          <div><strong>Email:</strong> ${data.email || "-"}</div>
          <div><strong>Status:</strong> ${data.status}</div>
          <div><strong>Last Scan:</strong> ${
            data.last_scan ? new Date(data.last_scan).toLocaleString() : "Never"
          }</div>
        </div>
      </div>
    `;

    modal.style.display = "block";

    document.querySelector(".close").onclick = () => {
      modal.style.display = "none";
    };

    window.onclick = (e) => {
      if (e.target === modal) modal.style.display = "none";
    };

  } catch (error) {
    alert("❌ Error loading member details: " + error.message);
  }
}

/*************************************************
 * UPDATE STATS
 *************************************************/
function updateStats(members) {
  const total = document.getElementById("totalMembers");
  const active = document.getElementById("activeMembers");

  if (total) total.textContent = members.length;
  if (active)
    active.textContent = members.filter((m) => m.status === "Active").length;
}

/*************************************************
 * SEARCH MEMBERS
 *************************************************/
document.getElementById("searchInput")?.addEventListener("input", async (e) => {
  const term = e.target.value.toLowerCase();

  if (!term) {
    loadMembers();
    return;
  }

  const { data, error } = await supabase
    .from("umoomi_members")
    .select("*")
    .or(
      `full_name.ilike.%${term}%,member_id.ilike.%${term}%,position.ilike.%${term}%,region.ilike.%${term}%`
    );

  if (!error) displayMembers(data);
});

/*************************************************
 * INIT
 *************************************************/
document.addEventListener("DOMContentLoaded", loadMembers);
