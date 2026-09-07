document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgotForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim().toLowerCase();
    const savedEmail = localStorage.getItem("exambuddy_email");

    message.textContent = "";
    message.className = "message";

    if (!email) {
      showMessage("Please enter your email address.", "error");
      return;
    }

    if (!savedEmail || email !== savedEmail.toLowerCase()) {
      showMessage("No account was found with this email.", "error");
      return;
    }

    showMessage(
      "Email found. This demo cannot send email yet. Create a backend for secure password reset.",
      "success"
    );
  });

  function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
  }
});