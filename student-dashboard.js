let currentBranch = "all";
let searchTerm = "";

const readStorage = key => {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
};

const escapeHTML = value => String(value ?? "").replace(/[&<>'"]/g, c => ({
  "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;"
}[c]));

function filteredData(key) {
  return readStorage(key).filter(item => {
    const branchMatch = currentBranch === "all" || item.branch === currentBranch;
    const text = `${item.title || ""} ${item.subject || ""} ${item.type || ""} ${item.difficulty || ""} ${item.branch || ""}`.toLowerCase();
    return branchMatch && (!searchTerm || text.includes(searchTerm));
  });
}

function loadNotes() {
  const notes = filteredData("notes");
  document.getElementById("totalNotes").textContent = notes.length;
  document.getElementById("notesList").innerHTML = notes.length
    ? notes.slice(0, 5).map(note => `<li class="note-item"><div class="note-icon">📄</div><div class="note-info"><div class="note-title">${escapeHTML(note.title || "Untitled note")}</div><div class="note-meta">${escapeHTML(note.branch || "")} • ${escapeHTML(note.subject || "")} • ${escapeHTML(note.type || "Note")}</div></div><button class="btn-view" type="button">View</button></li>`).join("")
    : `<li class="note-item empty-state"><div class="empty-icon">📭</div><div class="empty-text"><h4>No notes found</h4><p>Uploaders will add notes soon.</p></div></li>`;
}

function loadPYQs() {
  const pyqs = filteredData("pyqs");
  document.getElementById("totalPYQs").textContent = pyqs.length;
  document.getElementById("pyqList").innerHTML = pyqs.length
    ? pyqs.slice(0, 5).map(pyq => `<li class="pyq-item"><div class="pyq-info"><div class="pyq-title">${escapeHTML(pyq.title || "Untitled PYQ")}</div><div class="pyq-meta">${escapeHTML(pyq.branch || "")} • ${escapeHTML(pyq.subject || "")} • ${escapeHTML(pyq.difficulty || "Normal")}</div></div><button class="btn-start" type="button">Start</button></li>`).join("")
    : `<li class="pyq-item empty-state"><div class="empty-icon">📖</div><div class="empty-text"><h4>No PYQs found</h4><p>Previous year questions will be added soon.</p></div></li>`;
}

function updateProgress() {
  const totalItems = filteredData("notes").length + filteredData("pyqs").length;
  const percent = Math.min(totalItems * 10, 100);
  document.querySelector(".progress-fill").style.width = `${percent}%`;
  document.querySelector(".progress-percent").textContent = `${percent}%`;
  document.getElementById("completed").textContent = totalItems;
  document.getElementById("studyTime").textContent = `${Math.floor(totalItems * .5)}h`;
  document.getElementById("notesStudied").textContent = filteredData("notes").length;
  document.getElementById("pyqsSolved").textContent = filteredData("pyqs").length;
  document.getElementById("totalHours").textContent = Math.floor(totalItems * .5);
  document.getElementById("accuracy").textContent = `${Math.min(60 + totalItems * 2, 95)}%`;
}

function refreshDashboard() { loadNotes(); loadPYQs(); updateProgress(); }

document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("exambuddy_loggedIn");
  const role = localStorage.getItem("exambuddy_role");
  if (isLoggedIn !== "true" || role !== "student") { window.location.href = "login.html"; return; }

  const name = localStorage.getItem("exambuddy_name") || "Student";
  document.querySelectorAll(".username").forEach(el => el.textContent = name);
  document.getElementById("avatar").textContent = name.charAt(0).toUpperCase();

  document.querySelectorAll(".branch-btn").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".branch-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentBranch = btn.dataset.branch;
    document.getElementById("userBranch").textContent = currentBranch === "all" ? "All Branches" : currentBranch;
    refreshDashboard();
  }));

  document.getElementById("searchInput").addEventListener("input", e => { searchTerm = e.target.value.toLowerCase().trim(); refreshDashboard(); });
  document.getElementById("logoutBtn").addEventListener("click", e => {
    e.preventDefault();
    if (confirm("Are you sure you want to logout?")) { localStorage.removeItem("exambuddy_loggedIn"); localStorage.removeItem("exambuddy_role"); window.location.href = "login.html"; }
  });
  refreshDashboard();
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