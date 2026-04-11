(function () {
  "use strict";

  const toolsGrid = document.getElementById("toolsGrid");
  const toolSearch = document.getElementById("toolSearch");

  const modal = document.getElementById("toolModal");
  const modalBody = document.getElementById("toolModalBody");
  const modalTitle = document.getElementById("toolModalTitle");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const closeModalBackdrop = document.getElementById("closeModalBackdrop");

  let selectedToolId = null;

  const tools = [
    { id: "word-counter", name: "Word Counter", category: "text" },
    { id: "case-converter", name: "Case Converter", category: "text" },
    { id: "remove-duplicates", name: "Duplicate Remover", category: "text" },
    { id: "json-formatter", name: "JSON Formatter", category: "text" },
    { id: "base64-tool", name: "Base64 Tool", category: "text" },
    { id: "emi-calculator", name: "EMI Calculator", category: "calculator" },
    { id: "profit-calculator", name: "Profit Calculator", category: "calculator" },
    { id: "age-calculator", name: "Age Calculator", category: "calculator" },
    { id: "percentage-calculator", name: "Percentage Calculator", category: "calculator" },
    { id: "password-generator", name: "Password Generator", category: "generator" },
    { id: "username-generator", name: "Username Generator", category: "generator" },
    { id: "fake-data-generator", name: "Fake Data Generator", category: "generator" },
    { id: "image-to-base64", name: "Image to Base64", category: "image" },
    { id: "image-resize", name: "Image Resize", category: "image" },
    { id: "image-crop", name: "Image Crop", category: "image" },
    { id: "pdf-to-word", name: "PDF to Word", category: "premium" }
  ];

  // =========================
  // RENDER TOOLS
  // =========================
  function renderTools() {
    toolsGrid.innerHTML = "";

    tools.forEach(tool => {
      const el = document.createElement("div");
      el.className = "tool-card";
      el.innerHTML = `<h3>${tool.name}</h3>`;
      el.addEventListener("click", () => handleCardClick(tool.id));
      toolsGrid.appendChild(el);
    });
  }

  // =========================
  // MODAL
  // =========================
  function openModal(title, content) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.remove("hidden");
  }

  function closeModal() {
    modal.classList.add("hidden");
    modalBody.innerHTML = "";
  }

  closeModalBtn.addEventListener("click", closeModal);
  closeModalBackdrop.addEventListener("click", closeModal);

  // =========================
  // CLICK → ADGROVE FLOW
  // =========================
  function handleCardClick(toolId) {
    selectedToolId = toolId;

    openModal(
      "Unlock this tool",
      `
      <p style="margin-bottom:16px;">Watch a short ad to continue</p>
      <button id="adgrove-unlock" class="btn btn-primary">
        Watch Ad to Unlock
      </button>
      `
    );
  }

  // =========================
  // TOOL LOADER
  // =========================
  function openTool(toolId) {
    modalTitle.textContent = toolId;
    modalBody.innerHTML = `<p>${toolId} tool loaded</p>`;
  }

  // =========================
  // ADGROVE CALLBACK
  // =========================
  window.AdGrove = window.AdGrove || {};
  window.AdGrove.onContentUnlock = function () {
    closeModal();

    if (selectedToolId) {
      openTool(selectedToolId);
    }
  };

  // =========================
  // INIT
  // =========================
  renderTools();

})();