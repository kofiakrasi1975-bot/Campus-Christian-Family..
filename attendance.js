attendance.js
const session = JSON.parse(localStorage.getItem("ccf_session") || "null");
if (!session) window.location.href = "index.html";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("ccf_session");
  window.location.href = "index.html";
});

// Set today's date and lock unit for leaders
document.getElementById("a-date").value = new Date().toISOString().split("T")[0];
const unitField = document.getElementById("a-unit");
if (session.role === "leader") {
  unitField.value    = session.unit;
  unitField.readOnly = true;
}

let loadedMembers = [];

document.getElementById("loadBtn").addEventListener("click", () => {
  const unit    = unitField.value.trim();
  const error   = document.getElementById("a-error");
  error.textContent = "";

  if (!unit) { error.textContent = "Please enter a unit."; return; }

  const members = JSON.parse(localStorage.getItem("ccf_members") || "[]");
  loadedMembers  = members.filter(m => m.unit === unit);

  if (loadedMembers.length === 0) {
    error.textContent = "No members found for this unit.";
    return;
  }

  const checklist = document.getElementById("checklist");
  checklist.innerHTML = "";
  loadedMembers.forEach(m => {
    checklist.innerHTML += `
      <label style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.5rem;">
        <input type="checkbox" value="${m.id}" checked/>
        ${m.name}
      </label>
    `;
  });

  document.getElementById("saveBtn").classList.remove("hidden");
});

document.getElementById("saveBtn").addEventListener("click", () => {
  const date  = document.getElementById("a-date").value;
  const unit  = unitField.value.trim();
  const error = document.getElementById("a-error");
  error.textContent = "";

  if (!date) { error.textContent = "Please select a date."; return; }

  const checked    = [...document.querySelectorAll("#checklist input:checked")].map(i => i.value);
  const attendance = JSON.parse(localStorage.getItem("ccf_attendance") || "[]");

  loadedMembers.forEach(m => {
    attendance.push({
      id:     Date.now().toString() + Math.random(),
      date,
      unit,
      memberId:   m.id,
      memberName: m.name,
      status:     checked.includes(m.id) ? "Present" : "Absent"
    });
  });

  localStorage.setItem("ccf_attendance", JSON.stringify(attendance));
  renderAttendance();
  document.getElementById("saveBtn").classList.add("hidden");
  document.getElementById("checklist").innerHTML = "";
  error.textContent = "";
  alert("Attendance saved!");
});

function renderAttendance() {
  const attendance = JSON.parse(localStorage.getItem("ccf_attendance") || "[]");
  const visible     = session.role === "admin"
    ? attendance
    : attendance.filter(a => a.unit === session.unit);

  const tbody = document.getElementById("attendance-table");
  tbody.innerHTML = "";

  if (visible.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="color:#aaa;">No records yet.</td></tr>`;
    return;
  }

  [...visible].reverse().forEach(a => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${a.date}</td>
      <td>${a.unit}</td>
      <td>${a.memberName}</td>
      <td style="color:${a.status === 'Present' ? '#2e7d32' : '#e53935'}">${a.status}</td>
    `;
    tbody.appendChild(row);
  });
}

renderAttendance();