document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  const formMessage = document.getElementById("formMessage");

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
  }

  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      const icon = button.querySelector("i");
      const showPassword = input.type === "password";

      input.type = showPassword ? "text" : "password";
      icon.classList.toggle("fa-eye", !showPassword);
      icon.classList.toggle("fa-eye-slash", showPassword);
      button.setAttribute(
        "aria-label",
        showPassword ? "Hide password" : "Show password"
      );
    });
  });

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const selectedRole = document.querySelector(
      'input[name="role"]:checked'
    );

    if (!name || !email || !password || !confirmPassword || !selectedRole) {
      showMessage("Please complete all fields and select a role.", "error");
      return;
    }

    if (password.length < 6) {
      showMessage("Password must be at least 6 characters.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    localStorage.setItem("exambuddy_name", name);
    localStorage.setItem("exambuddy_email", email);
    localStorage.setItem("exambuddy_password", password);
    localStorage.setItem("exambuddy_role", selectedRole.value);
    localStorage.removeItem("exambuddy_loggedIn");

    showMessage("Registration successful! Redirecting to login...", "success");

    setTimeout(() => {
      window.location.href = "login.html";
    }, 800);
  });
});