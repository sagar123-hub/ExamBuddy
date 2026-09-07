document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const eyeIcon = document.getElementById("eyeIcon");
  const formMessage = document.getElementById("formMessage");

  togglePassword.addEventListener("click", () => {
    const showPassword = passwordInput.type === "password";

    passwordInput.type = showPassword ? "text" : "password";
    eyeIcon.classList.toggle("fa-eye", !showPassword);
    eyeIcon.classList.toggle("fa-eye-slash", showPassword);
    togglePassword.setAttribute(
      "aria-label",
      showPassword ? "Hide password" : "Show password"
    );
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = passwordInput.value;
    const savedEmail = localStorage.getItem("exambuddy_email");
    const savedPassword = localStorage.getItem("exambuddy_password");
    const role = localStorage.getItem("exambuddy_role");

    formMessage.textContent = "";
    formMessage.className = "form-message";

    if (!savedEmail || !savedPassword || !role) {
      showMessage("No account found. Please register first.", "error");
      return;
    }

    if (email !== savedEmail.toLowerCase()) {
      showMessage("Email does not match the registered account.", "error");
      return;
    }

    if (password !== savedPassword) {
      showMessage("Incorrect password.", "error");
      return;
    }

    localStorage.setItem("exambuddy_loggedIn", "true");

    const dashboards = {
      student: "student-dashboard.html",
      uploader: "uploader-dashboard.html",
      teacher: "teacher-dashboard.html"
    };

    if (!dashboards[role]) {
      showMessage("Invalid role selected.", "error");
      return;
    }

    showMessage("Login successful. Redirecting...", "success");
    setTimeout(() => {
      window.location.href = dashboards[role];
    }, 500);
  });

  document.getElementById("forgotPassword").addEventListener("click", (event) => {
    event.preventDefault();
    showMessage("Password recovery will be added with the backend.", "error");
  });

  document.querySelector(".google-btn").addEventListener("click", () => {
    showMessage("Google login requires backend authentication.", "error");
  });

  document.querySelector(".apple-btn").addEventListener("click", () => {
    showMessage("Apple login requires backend authentication.", "error");
  });

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
  }
});