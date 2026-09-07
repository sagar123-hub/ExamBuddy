document.addEventListener("DOMContentLoaded", () => {
  const notesList = document.getElementById("notesList");
  const noteCount = document.getElementById("noteCount");
  const searchInput = document.getElementById("searchInput");
  const branchFilter = document.getElementById("branchFilter");

  function getNotes() {
    try {
      const notes = JSON.parse(localStorage.getItem("notes") || "[]");
      return Array.isArray(notes) ? notes : [];
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

  function renderNotes() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedBranch = branchFilter.value;

    const notes = getNotes().filter((note) => {
      const searchableText = `${note.title || ""} ${note.subject || ""} ${note.branch || ""} ${note.type || ""}`.toLowerCase();
      const matchesSearch = searchableText.includes(searchTerm);
      const matchesBranch = selectedBranch === "all" || note.branch === selectedBranch;
      return matchesSearch && matchesBranch;
    });

    noteCount.textContent = `${notes.length} note${notes.length === 1 ? "" : "s"}`;

    if (notes.length === 0) {
      notesList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-folder-open"></i>
          <p>No notes found. Upload notes from the uploader dashboard.</p>
        </div>
      `;
      return;
    }

    notesList.innerHTML = notes.map((note) => `
      <article class="note-item">
        <div class="note-icon"><i class="fas fa-file-lines"></i></div>
        <div class="note-info">
          <div class="note-title">${escapeHTML(note.title || "Untitled note")}</div>
          <div class="note-meta">${escapeHTML(note.branch || "Unknown branch")} • ${escapeHTML(note.subject || "Unknown subject")} • ${escapeHTML(note.type || "Note")}</div>
        </div>
        <button class="view-btn" type="button">View</button>
      </article>
    `).join("");
  }

  searchInput.addEventListener("input", renderNotes);
  branchFilter.addEventListener("change", renderNotes);
  renderNotes();
});