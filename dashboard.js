dashboard.js
const session = JSON.parse(localStorage.getItem("ccf_session") || "null");
if (!session) window.location.href = "index.html";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("ccf_session");
  window.location.href = "index.html";
});

const users      = JSON.parse(localStorage.getItem("ccf_users")      || "[]");
const members    = JSON.parse(localStorage.getItem("ccf_members")    || "[]");
const attendance = JSON.parse(localStorage.getItem("ccf_attendance") || "[]");

document.getElementById("user-name").textContent  = session.name;
const badge = document.getElementById("user-badge");
badge.textContent = session.role;
badge.className   = "badge " + session.role;

const myMembers = session.role === "admin"
  ? members
  : members.filter(m => m.unit === session.unit);

const units = [...new Set(members.map(m => m.unit).filter(Boolean))];

document.getElementById("stat-members").textContent    = myMembers.length;
document.getElementById("stat-units").textContent      = units.length;
document.getElementById("stat-attendance").textContent = attendance.length;

if (session.role === "admin") {
  document.getElementById("admin-card").classList.remove("hidden");
  const leaders = users.filter(u => u.role === "leader");
  const tbody   = document.getElementById("units-table");
  units.forEach(unit => {
    const leader      = leaders.find(l => l.unit === unit);
    const memberCount = members.filter(m => m.unit === unit).length;
    const row = document.createElement("tr");
    row.innerHTML = `<td>${unit}</td><td>${leader ? leader.name : "—"}</td><td>${memberCount}</td>`;
    tbody.appendChild(row);
  });
} else {
  document.getElementById("leader-card").classList.remove("hidden");
  document.getElementById("leader-unit-name").textContent   = session.unit;
  document.getElementById("leader-member-count").textContent = myMembers.length;
  document.getElementById("user-unit").textContent = "Unit: " + session.unit;
}