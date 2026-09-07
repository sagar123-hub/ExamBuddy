document.addEventListener("DOMContentLoaded", () => {
  const loggedIn = localStorage.getItem("exambuddy_loggedIn");
  const role = localStorage.getItem("exambuddy_role");

  if (loggedIn !== "true" || role !== "uploader") {
    window.location.href = "login.html";
    return;
  }

  const userName = localStorage.getItem("exambuddy_name") || "Uploader";
  document.getElementById("userName").textContent = userName;
  document.getElementById("profileName").textContent = userName;
  document.getElementById("avatar").textContent = userName.charAt(0).toUpperCase();

  function readItems(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[char]));
  }

  function renderMaterials() {
    const notes = readItems("notes");
    const pyqs = readItems("pyqs");
    const allMaterials = [
      ...notes.map((item) => ({ ...item, materialType: "note" })),
      ...pyqs.map((item) => ({ ...item, materialType: "pyq" }))
    ];

    document.getElementById("totalNotes").textContent = notes.length;
    document.getElementById("totalPYQs").textContent = pyqs.length;
    document.getElementById("publishedItems").textContent = allMaterials.length;
    document.getElementById("studentsReached").textContent = allMaterials.length * 12;

    const list = document.getElementById("materialsList");

    if (allMaterials.length === 0) {
      list.innerHTML = '<div class="empty-state">No materials uploaded yet.</div>';
      return;
    }

    list.innerHTML = allMaterials.slice(-8).reverse().map((item) => `
      <div class="material-item">
        <div class="material-icon">
          <i class="fas ${item.materialType === "pyq" ? "fa-file-alt" : "fa-file-lines"}"></i>
        </div>
        <div class="material-info">
          <div class="material-title">${escapeHTML(item.title || "Untitled material")}</div>
          <div class="material-meta">${escapeHTML(item.branch || "")} • ${escapeHTML(item.subject || "")} • ${item.materialType.toUpperCase()}</div>
        </div>
        <button class="delete-btn" type="button" data-id="${item.id}" data-type="${item.materialType}">Delete</button>
      </div>
    `).join("");

    list.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", () => {
        const storageKey = button.dataset.type === "pyq" ? "pyqs" : "notes";
        const remaining = readItems(storageKey).filter(
          (item) => String(item.id) !== button.dataset.id
        );
        localStorage.setItem(storageKey, JSON.stringify(remaining));
        renderMaterials();
      });
    });
  }

  document.getElementById("uploadForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const materialType = document.getElementById("materialType").value;
    const item = {
      id: Date.now(),
      title: document.getElementById("title").value.trim(),
      branch: document.getElementById("branch").value,
      subject: document.getElementById("subject").value.trim(),
      difficulty: document.getElementById("difficulty").value,
      description: document.getElementById("description").value.trim(),
      uploader: userName,
      createdAt: new Date().toISOString()
    };

    const storageKey = materialType === "pyq" ? "pyqs" : "notes";
    const items = readItems(storageKey);
    items.push(item);
    localStorage.setItem(storageKey, JSON.stringify(items));

    event.target.reset();
    const message = document.getElementById("uploadMessage");
    message.textContent = "Material published successfully!";
    message.className = "message success";
    renderMaterials();

    setTimeout(() => {
      message.textContent = "";
    }, 2500);
  });

  document.getElementById("clearMaterials").addEventListener("click", () => {
    if (!confirm("Delete all uploaded materials?")) {
      return;
    }

    localStorage.removeItem("notes");
    localStorage.removeItem("pyqs");
    renderMaterials();
  });

  document.getElementById("logoutBtn").addEventListener("click", (event) => {
    event.preventDefault();

    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("exambuddy_loggedIn");
      window.location.href = "login.html";
    }
  });

  renderMaterials();
});
const logoutButton = document.getElementById("logoutBtn");

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