document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const branchInput = document.getElementById("branch");
  const message = document.getElementById("message");

  const role = localStorage.getItem("exambuddy_role") || "student";
  const savedName = localStorage.getItem("exambuddy_name") || "Student";
  const savedEmail = localStorage.getItem("exambuddy_email") || "";
  const savedBranch = localStorage.getItem("exambuddy_branch") || "CSE";

  nameInput.value = savedName;
  emailInput.value = savedEmail;
  branchInput.value = savedBranch;

  document.getElementById("profileName").textContent = savedName;
  document.getElementById("profileEmail").textContent = savedEmail || "No email added";
  document.getElementById("profileRole").textContent = role.charAt(0).toUpperCase() + role.slice(1);
  document.getElementById("avatar").textContent = savedName.charAt(0).toUpperCase();

  if (role === "uploader") {
    document.getElementById("backLink").href = "uploader-dashboard.html";
  }

  document.getElementById("profileForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();

    if (!name || !email) {
      message.textContent = "Please enter your name and email.";
      message.className = "message error";
      return;
    }

    localStorage.setItem("exambuddy_name", name);
    localStorage.setItem("exambuddy_email", email);
    localStorage.setItem("exambuddy_branch", branchInput.value);

    document.getElementById("profileName").textContent = name;
    document.getElementById("profileEmail").textContent = email;
    document.getElementById("avatar").textContent = name.charAt(0).toUpperCase();
    message.textContent = "Profile updated successfully.";
    message.className = "message success";
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (!confirm("Are you sure you want to logout?")) {
      return;
    }

    localStorage.removeItem("exambuddy_loggedIn");
    window.location.href = "login.html";
  });
});