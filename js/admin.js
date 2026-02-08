/*************************************************
 * SUPABASE INITIALIZATION (REQUIRED)
 *************************************************/

const SUPABASE_URL = "https://ccsicfimccsiizmpuvsm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc2ljZmltY2NzaWl6bXB1dnNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzA5MjcsImV4cCI6MjA4NjEwNjkyN30.IRVBVGPFqqB4_n5BSt2hXbvi9UitltDK2cqm479CLho";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("✅ Supabase ready (admin)");

/*************************************************
 * ADD MEMBER
 *************************************************/
document
  .getElementById("addMemberForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const memberData = {
      member_id: document.getElementById("memberId").value,
      full_name: document.getElementById("fullName").value,
      position: document.getElementById("position").value,
      department: document.getElementById("department").value,
      region: document.getElementById("region").value || null,
      phone: document.getElementById("phone").value || null,
      email: document.getElementById("email").value || null,
      address: document.getElementById("address").value || null,
      status: document.getElementById("status").value,
    };

    try {
      const { error } = await supabase
        .from("umoomi_members")
        .insert([memberData]);

      if (error) throw error;

      alert("✅ Member added successfully");
      e.target.reset();

    } catch (error) {
      console.error(error);
      alert("❌ Error adding member: " + error.message);
    }
  });

/*************************************************
 * SIDEBAR NAVIGATION
 *************************************************/
document.querySelectorAll(".admin-sidebar a").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    document
      .querySelectorAll(".admin-sidebar a")
      .forEach((l) => l.classList.remove("active"));
    document
      .querySelectorAll(".admin-section")
      .forEach((s) => s.classList.remove("active"));

    link.classList.add("active");
    document.querySelector(link.getAttribute("href")).classList.add("active");
  });
});

/*************************************************
 * LOAD MEMBERS FOR EDIT DROPDOWN
 *************************************************/
async function loadMembersForEdit() {
  const select = document.getElementById("editMemberSelect");
  if (!select) return;

  const { data, error } = await supabase
    .from("umoomi_members")
    .select("member_id, full_name")
    .order("full_name");

  if (error) {
    console.error(error);
    return;
  }

  select.innerHTML = '<option value="">Select Member</option>';

  data.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.member_id;
    option.textContent = `${member.full_name} (${member.member_id})`;
    select.appendChild(option);
  });
}

/*************************************************
 * INIT
 *************************************************/
document.addEventListener("DOMContentLoaded", loadMembersForEdit);
