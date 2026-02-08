// js/admin.js
// ----------------------------
// Admin Panel Logic
// ----------------------------

const supabase = window.supabaseClient;

/* ============================
   ADD MEMBER
============================ */
document.getElementById("addMemberForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const memberData = {
    member_id: document.getElementById("memberId").value.trim(),
    full_name: document.getElementById("fullName").value.trim(),
    position: document.getElementById("position").value,
    department: document.getElementById("department").value,
    region: document.getElementById("region").value || null,
    phone: document.getElementById("phone").value || null,
    email: document.getElementById("email").value || null,
    address: document.getElementById("address").value || null,
    status: document.getElementById("status").value
  };

  try {
    const { error } = await supabase
      .from("umoomi_members")
      .insert(memberData);

    if (error) throw error;

    alert("✅ Member added successfully");
    e.target.reset();

  } catch (err) {
    console.error(err);
    alert("❌ Error adding member: " + err.message);
  }
});

/* ============================
   LOAD MEMBERS (ADMIN / DASHBOARD)
============================ */
async function loadMembers() {
  try {
    const { data, error } = await supabase
      .from("umoomi_members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    console.log("Members loaded:", data);

  } catch (err) {
    console.error(err);
    alert("❌ Failed to load members: " + err.message);
  }
}

// Auto-load if needed
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("addMemberForm")) {
    console.log("Admin page ready");
  }
});
