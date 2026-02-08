// ============================
// Admin Panel Functions
// ============================

// IMPORTANT: always use the global client created in supabase.js
const supabase = window.supabaseClient;

document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin panel loaded");
  setupAddMemberForm();
  setupEditMemberForm();
  loadMembersForDropdown();
});

/* ============================
   ADD MEMBER
============================ */
function setupAddMemberForm() {
  const form = document.getElementById("addMemberForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateAddMemberForm()) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Adding member...";

    const memberData = {
      member_id: document.getElementById("memberId").value.trim(),
      full_name: document.getElementById("fullName").value.trim(),
      position: document.getElementById("position").value,
      department: document.getElementById("department").value,
      region: document.getElementById("region").value.trim() || null,
      phone: document.getElementById("phone").value.trim() || null,
      email: document.getElementById("email").value.trim() || null,
      address: document.getElementById("address").value.trim() || null,
      status: document.getElementById("status").value,
      current_location: null,
      last_scan: null
    };

    try {
      // Check if member exists
      const { data: existing, error: checkError } = await supabase
        .from("umoomi_members")
        .select("member_id")
        .eq("member_id", memberData.member_id)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existing) throw new Error("Member ID already exists");

      // Insert member
      const { error } = await supabase
        .from("umoomi_members")
        .insert(memberData);

      if (error) throw error;

      alert(`✅ Member "${memberData.full_name}" added successfully`);
      form.reset();

      await generateQRCodeForMember(memberData.member_id);
      loadMembersForDropdown();

      if (typeof loadMembers === "function") loadMembers();

    } catch (err) {
      console.error(err);
      alert("❌ Error adding member:\n" + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/* ============================
   VALIDATION
============================ */
function validateAddMemberForm() {
  const errors = [];
  const memberId = document.getElementById("memberId").value.trim();
  const fullName = document.getElementById("fullName").value.trim();
  const position = document.getElementById("position").value;
  const department = document.getElementById("department").value;

  if (!memberId) errors.push("Member ID is required");
  if (!fullName) errors.push("Full Name is required");
  if (!position) errors.push("Position is required");
  if (!department) errors.push("Department is required");

  if (memberId && !/^[A-Z]{2,}-[A-Z]{2,}-\d{3}$/.test(memberId)) {
    errors.push("Member ID format: UM-HO-001");
  }

  if (errors.length) {
    alert(errors.join("\n"));
    return false;
  }

  return true;
}

/* ============================
   QR CODE
============================ */
async function generateQRCodeForMember(memberId) {
  const qrData = `UMOOMI:${memberId}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  await supabase
    .from("umoomi_members")
    .update({ qr_code_url: qrUrl })
    .eq("member_id", memberId);
}

/* ============================
   EDIT MEMBER
============================ */
function setupEditMemberForm() {
  const editForm = document.getElementById("editMemberForm");
  if (!editForm) return;

  document.getElementById("editMemberSelect")?.addEventListener("change", (e) => {
    if (e.target.value) loadMemberForEdit(e.target.value);
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const memberId = document.getElementById("editMemberSelect").value;
    if (!memberId) return alert("Select a member");

    const memberData = {
      full_name: document.getElementById("editFullName").value.trim(),
      position: document.getElementById("editPosition").value,
      department: document.getElementById("editDepartment").value,
      region: document.getElementById("editRegion").value.trim() || null,
      phone: document.getElementById("editPhone").value.trim() || null,
      email: document.getElementById("editEmail").value.trim() || null,
      address: document.getElementById("editAddress").value.trim() || null,
      status: document.getElementById("editStatus").value
    };

    const { error } = await supabase
      .from("umoomi_members")
      .update(memberData)
      .eq("member_id", memberId);

    if (error) return alert(error.message);

    alert("✅ Member updated");
    editForm.reset();
    loadMembersForDropdown();
    if (typeof loadMembers === "function") loadMembers();
  });
}

async function loadMemberForEdit(memberId) {
  const { data, error } = await supabase
    .from("umoomi_members")
    .select("*")
    .eq("member_id", memberId)
    .single();

  if (error) return alert(error.message);

  document.getElementById("editFullName").value = data.full_name || "";
  document.getElementById("editPosition").value = data.position || "";
  document.getElementById("editDepartment").value = data.department || "";
  document.getElementById("editRegion").value = data.region || "";
  document.getElementById("editPhone").value = data.phone || "";
  document.getElementById("editEmail").value = data.email || "";
  document.getElementById("editAddress").value = data.address || "";
  document.getElementById("editStatus").value = data.status || "Active";
}

/* ============================
   DROPDOWNS
============================ */
async function loadMembersForDropdown() {
  const { data, error } = await supabase
    .from("umoomi_members")
    .select("member_id, full_name")
    .order("full_name");

  if (error) return console.error(error);

  ["editMemberSelect", "deleteMemberSelect"].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;

    select.innerHTML = `<option value="">Select Member</option>`;
    data.forEach(m => {
      const opt = document.createElement("option");
      opt.value = m.member_id;
      opt.textContent = `${m.full_name} (${m.member_id})`;
      select.appendChild(opt);
    });
  });
}

/* ============================
   DELETE
============================ */
async function deleteMember(memberId) {
  if (!confirm("Delete this member permanently?")) return;

  const { error } = await supabase
    .from("umoomi_members")
    .delete()
    .eq("member_id", memberId);

  if (error) return alert(error.message);

  alert("Member deleted");
  loadMembersForDropdown();
  if (typeof loadMembers === "function") loadMembers();
}

document.getElementById("deleteMemberBtn")?.addEventListener("click", () => {
  const id = document.getElementById("deleteMemberSelect").value;
  if (!id) return alert("Select a member");
  deleteMember(id);
});
