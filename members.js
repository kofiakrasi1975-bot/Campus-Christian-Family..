members.js
const session = JSON.parse(localStorage.getItem("ccf_session") || "null");
if (!session) window.location.href = "index.html";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("ccf_session");
  window.location.href = "index.html";
});

// Lock unit field to their own unit if leader
const unitField = document.getElementById("m-unit");
if (session.role === "leader") {
  unitField.value    = session.unit;
  unitField.readOnly = true;
}

function getMembers() {
  return JSON.parse(localStorage.getItem("ccf_members") || "[]");
}

function saveMembers(members) {
  localStorage.setItem("ccf_members", JSON.stringify(members));
}

function renderMembers() {
  const members = getMembers();
  const visible  = session.role === "admin"
    ? members
    : members.filter(m => m.unit === session.unit);

  const tbody = document.getElementById("members-table");
  tbody.innerHTML = "";

  if (visible.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="color:#aaa;">No members yet.</td></tr>`;
    return;
  }

  visible.forEach(m => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.name}</td>
      <td>${m.email || "—"}</td>
      <td>${m.phone || "—"}</td>
      <td>${m.unit}</td>
      <td><button class="btn small red" onclick="deleteMember('${m.id}')">Remove</button></td>
    `;
    tbody.appendChild(row);
  });
}

document.getElementById("addMemberBtn").addEventListener("click", () => {
  const name  = document.getElementById("m-name").value.trim();
  const email = document.getElementById("m-email").value.trim();
  const phone = document.getElementById("m-phone").value.trim();
  const unit  = document.getElementById("m-unit").value.trim();
  const error = document.getElementById("m-error");
  error.textContent = "";

  if (!name || !unit) {
    error.textContent = "Name and unit are required.";
    return;
  }

  const members = getMembers();
  members.push({ id: Date.now().toString(), name, email, phone, unit });
  saveMembers(members);
  renderMembers();

  document.getElementById("m-name").value  = "";
  document.getElementById("m-email").value = "";
  document.getElementById("m-phone").value = "";
  if (session.role === "admin") unitField.value = "";
});

function deleteMember(id) {
  if (!confirm("Remove this member?")) return;
  saveMembers(getMembers().filter(m => m.id !== id));
  renderMembers();
}

renderMembers();