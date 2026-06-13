auth.js
// Default users (stored in localStorage on first load)
const DEFAULT_USERS = [
  { id: "1", name: "Admin User",  email: "admin@ccf.com",  password: "admin123",  role: "admin",  unit: "" },
  { id: "2", name: "John Leader", email: "leader@ccf.com", password: "leader123", role: "leader", unit: "Unit A" }
];

function initUsers() {
  if (!localStorage.getItem("ccf_users")) {
    localStorage.setItem("ccf_users", JSON.stringify(DEFAULT_USERS));
  }
}

initUsers();

// Login
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email    = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");
    errorMsg.textContent = "";

    const users = JSON.parse(localStorage.getItem("ccf_users") || "[]");
    const user  = users.find(u => u.email === email && u.password === password);

    if (!user) {
      errorMsg.textContent = "Invalid email or password.";
      return;
    }

    localStorage.setItem("ccf_session", JSON.stringify(user));
    window.location.href = "dashboard.html";
  });
}

// Allow pressing Enter to log in
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginBtn && loginBtn.click();
});