document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutBtn");

  if (!logoutButton) {
    return;
  }

  logoutButton.addEventListener("click", (event) => {
    event.preventDefault();

    const confirmLogout = confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem("exambuddy_loggedIn");

    window.location.href = "login.html";
  });
});