(() => {
  "use strict";

  const STORAGE_THEME = "tools-theme";

  /** @type {{id:string,name:string,description:string,premium?:boolean}[]} */
  const tools = [
    { id: "word-counter", name: "Word Counter", description: "Count words and characters." },
    { id: "case-converter", name: "Case Converter", description: "Upper/lower/title case quickly." },
    { id: "json-formatter", name: "JSON Formatter", description: "Format or minify JSON safely." },
    { id: "base64", name: "Base64 Tool", description: "Encode/decode text." },
    { id: "uuid", name: "UUID Generator", description: "Generate v4 UUIDs." },
    { id: "hash", name: "Hash Generator", description: "SHA-256 hash for text." },
    { id: "percentage", name: "Percentage", description: "Fast percent calculations." },
    { id: "epoch", name: "Epoch Converter", description: "Unix time ↔ date." },
    { id: "slug", name: "Slugify", description: "Clean slugs from text." },
    { id: "lorem", name: "Lorem Ipsum", description: "Simple placeholder text." },
    { id: "pdf-to-word", name: "PDF to Word", description: "Premium conversion (placeholder UI).", premium: true },
    { id: "image-compress", name: "Image Compress", description: "Premium image compress (placeholder UI).", premium: true },
  ];

  // Required by spec
  let selectedToolId = null;

  const el = {
    toolsGrid: document.getElementById("toolsGrid"),
    toolsEmpty: document.getElementById("toolsEmpty"),
    toolSearch: document.getElementById("toolSearch"),
    modal: document.getElementById("toolModal"),
    modalTitle: document.getElementById("toolModalTitle"),
    modalBody: document.getElementById("toolModalBody"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    themeToggle: document.getElementById("themeToggle"),
    year: document.getElementById("year"),
  };

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function setTheme(next) {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_THEME, next);
    } catch {
      /* ignore */
    }
  }

  function initTheme() {
    let initial = "light";
    try {
      const stored = localStorage.getItem(STORAGE_THEME);
      if (stored === "light" || stored === "dark") initial = stored;
      else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) initial = "dark";
    } catch {
      /* ignore */
    }
    setTheme(initial);
    el.themeToggle?.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      setTheme(cur === "dark" ? "light" : "dark");
    });
  }

  function openModal(title, bodyHtml) {
    el.modalTitle.textContent = title;
    el.modalBody.innerHTML = bodyHtml;
    el.modal.classList.add("is-open");
    el.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    el.modal.classList.remove("is-open");
    el.modal.setAttribute("aria-hidden", "true");
    el.modalBody.innerHTML = "";
    document.body.classList.remove("modal-open");
  }

  function openUnlockModal(tool) {
    openModal(
      tool.name,
      `
        <p>${escapeHtml(tool.description)}</p>
        <div class="modal-actions">
          <button class="button button-primary" id="adgrove-unlock" type="button">Watch Ad to Unlock</button>
          <button class="button button-glass" type="button" data-close="modal">Not now</button>
        </div>
        <div id="gated-content" class="gated-content" hidden></div>
      `
    );
  }

  function openTool(toolId) {
    const tool = tools.find((t) => t.id === toolId);
    if (!tool) return;

    const gated = document.getElementById("gated-content");
    if (!gated) return;

    gated.innerHTML = `
      <div class="tool-ui">
        <p><strong>Unlocked:</strong> ${escapeHtml(tool.name)}</p>
        <p>This is a simple placeholder tool UI. Replace this panel with the real tool implementation.</p>
      </div>
      <div class="modal-actions">
        <button class="button button-glass" type="button" data-close="modal">Close</button>
      </div>
    `;
  }

  function renderTools() {
    const q = (el.toolSearch?.value || "").trim().toLowerCase();
    const filtered = tools.filter((t) => {
      if (!q) return true;
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    });

    el.toolsGrid.innerHTML = filtered
      .map((t) => {
        const badge = t.premium ? `<span class="badge badge-premium">Premium</span>` : `<span class="badge">Free</span>`;
        return `
          <article class="tool-card" role="button" tabindex="0" data-tool-id="${escapeHtml(t.id)}">
            <h3 class="tool-title">${escapeHtml(t.name)}</h3>
            <p class="tool-desc">${escapeHtml(t.description)}</p>
            <div class="tool-meta">${badge}</div>
          </article>
        `;
      })
      .join("");

    const empty = filtered.length === 0;
    if (el.toolsEmpty) el.toolsEmpty.hidden = !empty;
  }

  function getToolFromEventTarget(target) {
    const card = target?.closest?.("[data-tool-id]");
    if (!card) return null;
    const id = card.getAttribute("data-tool-id");
    return tools.find((t) => t.id === id) || null;
  }

  function initEvents() {
    el.toolSearch?.addEventListener("input", renderTools);

    el.toolsGrid?.addEventListener("click", (e) => {
      const tool = getToolFromEventTarget(e.target);
      if (!tool) return;
      selectedToolId = tool.id;
      openUnlockModal(tool);
    });

    el.toolsGrid?.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const tool = getToolFromEventTarget(e.target);
      if (!tool) return;
      e.preventDefault();
      selectedToolId = tool.id;
      openUnlockModal(tool);
    });

    el.closeModalBtn?.addEventListener("click", closeModal);

    el.modal?.addEventListener("click", (e) => {
      const t = e.target;
      if (t?.matches?.("[data-close='modal']") || t?.classList?.contains("modal-backdrop")) closeModal();
    });

    window.addEventListener("keydown", (e) => {
      const isOpen = el.modal?.classList?.contains("is-open");
      if (isOpen && e.key === "Escape") closeModal();
    });
  }

  // AdGrove unlock logic (required by spec)
  window.AdGrove = window.AdGrove || {};
  window.AdGrove.onContentUnlock = function () {
    const isOpen = el.modal?.classList?.contains("is-open");
    if (!isOpen) return;

    const gated = document.getElementById("gated-content");
    const unlockButton = document.getElementById("adgrove-unlock");
    if (!gated || !unlockButton) return;

    gated.hidden = false;
    unlockButton.style.display = "none";

    if (!selectedToolId) {
      gated.innerHTML = `
        <div class="tool-ui">
          <p><strong>Unlocked.</strong> No tool was selected.</p>
        </div>
      `;
      return;
    }

    openTool(selectedToolId);
  };

  if (el.year) el.year.textContent = String(new Date().getFullYear());

  initTheme();
  initEvents();
  renderTools();
})();
