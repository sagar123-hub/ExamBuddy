document.addEventListener("DOMContentLoaded", () => {
  const pyqList = document.getElementById("pyqList");
  const pyqCount = document.getElementById("pyqCount");
  const searchInput = document.getElementById("searchInput");
  const branchFilter = document.getElementById("branchFilter");
  const difficultyFilter = document.getElementById("difficultyFilter");

  function getPYQs() {
    try {
      const pyqs = JSON.parse(localStorage.getItem("pyqs") || "[]");
      return Array.isArray(pyqs) ? pyqs : [];
    } catch {
      return [];
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));
  }

  function renderPYQs() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedBranch = branchFilter.value;
    const selectedDifficulty = difficultyFilter.value;

    const pyqs = getPYQs().filter((pyq) => {
      const searchableText = `${pyq.title || ""} ${pyq.subject || ""} ${pyq.branch || ""} ${pyq.difficulty || ""}`.toLowerCase();
      const matchesSearch = searchableText.includes(searchTerm);
      const matchesBranch = selectedBranch === "all" || pyq.branch === selectedBranch;
      const matchesDifficulty = selectedDifficulty === "all" || pyq.difficulty === selectedDifficulty;
      return matchesSearch && matchesBranch && matchesDifficulty;
    });

    pyqCount.textContent = `${pyqs.length} question${pyqs.length === 1 ? "" : "s"}`;

    if (pyqs.length === 0) {
      pyqList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-file-circle-question"></i>
          <p>No PYQs found. Upload questions from the uploader dashboard.</p>
        </div>
      `;
      return;
    }

    pyqList.innerHTML = pyqs.map((pyq) => `
      <article class="pyq-item">
        <div class="pyq-icon"><i class="fas fa-file-alt"></i></div>
        <div class="pyq-info">
          <div class="pyq-title">${escapeHTML(pyq.title || "Untitled PYQ")}</div>
          <div class="pyq-meta">${escapeHTML(pyq.branch || "Unknown branch")} • ${escapeHTML(pyq.subject || "Unknown subject")} • ${escapeHTML(pyq.difficulty || "Normal")}</div>
        </div>
        <button class="start-btn" type="button">Start</button>
      </article>
    `).join("");
  }

  searchInput.addEventListener("input", renderPYQs);
  branchFilter.addEventListener("change", renderPYQs);
  difficultyFilter.addEventListener("change", renderPYQs);
  renderPYQs();
});