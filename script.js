(function () {
  "use strict";

  const STORAGE_THEME = "tools-theme";
  const STORAGE_UNLOCK = "tools-session-unlocked";
  const SKELETON_COUNT = 8;

  const toolsGrid = document.getElementById("toolsGrid");
  const toolsSkeleton = document.getElementById("toolsSkeleton");
  const toolsEmpty = document.getElementById("toolsEmpty");
  const toolSearch = document.getElementById("toolSearch");
  const filterButtons = document.querySelectorAll(".filter-pill");
  const modal = document.getElementById("toolModal");
  const modalBody = document.getElementById("toolModalBody");
  const modalTitle = document.getElementById("toolModalTitle");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const closeModalBackdrop = document.getElementById("closeModalBackdrop");
  const emptyReset = document.getElementById("emptyReset");
  const themeToggle = document.getElementById("themeToggle");
  const siteNav = document.getElementById("siteNav");
  const navMobileToggle = document.getElementById("navMobileToggle");
  const navMobile = document.getElementById("navMobile");
  const yearEl = document.getElementById("year");

  let activeCategory = "all";
  let searchTerm = "";
  let pdfUiState = null;
  let selectedToolId = null;

  const tools = [
    {
      id: "word-counter",
      name: "Word Counter",
      description: "Words, characters, and reading time.",
      category: "text",
      icon: "fileText",
    },
    {
      id: "case-converter",
      name: "Case Converter",
      description: "Upper, lower, and title case in one tap.",
      category: "text",
      icon: "type",
    },
    {
      id: "remove-duplicates",
      name: "Duplicate Line Remover",
      description: "Collapse repeated lines instantly.",
      category: "text",
      icon: "listMinus",
    },
    {
      id: "json-formatter",
      name: "JSON Formatter",
      description: "Pretty print or minify JSON safely.",
      category: "text",
      icon: "braces",
    },
    {
      id: "base64-tool",
      name: "Base64 Encoder / Decoder",
      description: "Encode text or decode Base64 strings.",
      category: "text",
      icon: "binary",
    },
    {
      id: "emi-calculator",
      name: "EMI Calculator",
      description: "Monthly loan payment from rate and tenure.",
      category: "calculator",
      icon: "calculator",
    },
    {
      id: "profit-calculator",
      name: "Profit Calculator",
      description: "Margin from cost and selling price.",
      category: "calculator",
      icon: "chart",
    },
    {
      id: "age-calculator",
      name: "Age Calculator",
      description: "Years, months, and days from a birth date.",
      category: "calculator",
      icon: "calendar",
    },
    {
      id: "percentage-calculator",
      name: "Percentage Calculator",
      description: "What percent one value is of another.",
      category: "calculator",
      icon: "percent",
    },
    {
      id: "password-generator",
      name: "Password Generator",
      description: "Strong passwords with custom rules.",
      category: "generator",
      icon: "keyRound",
    },
    {
      id: "username-generator",
      name: "Username Generator",
      description: "Memorable handles from a keyword.",
      category: "generator",
      icon: "atSign",
    },
    {
      id: "fake-data-generator",
      name: "Fake Data Generator",
      description: "Sample name, email, and phone for demos.",
      category: "generator",
      icon: "idCard",
    },
    {
      id: "image-to-base64",
      name: "Image to Base64",
      description: "Data URLs from local images.",
      category: "image",
      icon: "image",
    },
    {
      id: "image-resize",
      name: "Image Resize",
      description: "Canvas resize with download.",
      category: "image",
      icon: "maximize",
    },
    {
      id: "image-crop",
      name: "Image Crop",
      description: "Pixel-precise crops via canvas.",
      category: "image",
      icon: "crop",
    },
    {
      id: "pdf-to-word",
      name: "PDF to Word",
      description: "Demo flow — server conversion placeholder.",
      category: "premium",
      icon: "fileDown",
      premium: true,
    },
  ];

  function isSessionUnlocked() {
    try {
      return sessionStorage.getItem(STORAGE_UNLOCK) === "1";
    } catch {
      return true;
    }
  }

  function setSessionUnlocked() {
    try {
      sessionStorage.setItem(STORAGE_UNLOCK, "1");
    } catch {
      /* ignore */
    }
  }

  function getToolIconSvg(iconName) {
    const icons = {
      fileText:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>',
      type:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>',
      listMinus:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M8 6h12"/><path d="M8 12h12"/><path d="M8 18h12"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>',
      braces:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M9 4c-2 0-3 1-3 3v2c0 1-1 2-2 2 1 0 2 1 2 2v2c0 2 1 3 3 3"/><path d="M15 4c2 0 3 1 3 3v2c0 1 1 2 2 2-1 0-2 1-2 2v2c0 2-1 3-3 3"/></svg>',
      binary:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M6 5v4"/><path d="M6 15v4"/><path d="M12 5v14"/><path d="M18 5v4"/><path d="M18 15v4"/></svg>',
      calculator:
        '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11h2"/><path d="M12 11h2"/><path d="M16 11h0"/><path d="M8 15h2"/><path d="M12 15h2"/><path d="M16 15h0"/></svg>',
      chart:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>',
      calendar:
        '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/></svg>',
      percent:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M19 5L5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
      keyRound:
        '<svg viewBox="0 0 24 24" fill="none"><circle cx="8" cy="15" r="4"/><path d="M12 15h9"/><path d="M18 12v6"/><path d="M21 13v4"/></svg>',
      atSign:
        '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8"/><path d="M16 12v1a2 2 0 1 0 4 0v-1a8 8 0 1 0-8 8"/></svg>',
      idCard:
        '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h5"/><path d="M13 14h5"/></svg>',
      image:
        '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-7 7"/></svg>',
      maximize:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M8 3H3v5"/><path d="M16 3h5v5"/><path d="M3 16v5h5"/><path d="M21 16v5h-5"/></svg>',
      crop:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M6 3v12a3 3 0 0 0 3 3h12"/><path d="M3 6h12a3 3 0 0 1 3 3v12"/><path d="M6 18h12"/></svg>',
      fileDown:
        '<svg viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 12v6"/><path d="m9 15 3 3 3-3"/></svg>',
    };
    return icons[iconName] || icons.fileText;
  }

  const lockSvg =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  function buildSkeleton() {
    toolsSkeleton.innerHTML = "";
    for (let i = 0; i < SKELETON_COUNT; i += 1) {
      const el = document.createElement("div");
      el.className = "skeleton-card";
      el.style.animationDelay = `${i * 60}ms`;
      toolsSkeleton.appendChild(el);
    }
    toolsSkeleton.classList.remove("is-hidden");
    toolsSkeleton.setAttribute("aria-hidden", "false");
  }

  function hideSkeleton() {
    toolsSkeleton.classList.add("is-hidden");
    toolsSkeleton.setAttribute("aria-hidden", "true");
  }

  function renderTools() {
    const unlocked = isSessionUnlocked();
    const filtered = tools.filter((tool) => {
      const byCategory = activeCategory === "all" || tool.category === activeCategory;
      const q = searchTerm.toLowerCase().trim();
      const bySearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q);
      return byCategory && bySearch;
    });

    toolsGrid.innerHTML = "";
    const showEmpty = filtered.length === 0;
    toolsEmpty.classList.toggle("hidden", !showEmpty);
    toolsGrid.style.display = showEmpty ? "none" : "";

    filtered.forEach((tool, index) => {
      const article = document.createElement("article");
      article.className = `tool-card ${tool.premium ? "premium-card" : ""} ${unlocked ? "unlocked" : ""}`;
      article.dataset.toolId = tool.id;
      article.setAttribute("role", "button");
      article.setAttribute("tabindex", "0");
      article.style.setProperty("--stagger", `${Math.min(index, 12) * 45}ms`);
      article.innerHTML = `
        <div class="lock-overlay" aria-hidden="true">${lockSvg}</div>
        <div class="tool-icon-wrap">${getToolIconSvg(tool.icon)}</div>
        <h3>${escapeHtml(tool.name)}</h3>
        <p class="tool-desc">${escapeHtml(tool.description)}</p>
      `;
      article.addEventListener("click", () => handleCardClick(tool.id));
      article.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick(tool.id);
        }
      });
      toolsGrid.appendChild(article);
    });

    requestAnimationFrame(() => {
      toolsGrid.querySelectorAll(".tool-card").forEach((card) => card.classList.add("is-visible"));
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function handleCardClick(toolId) {
    selectedToolId = toolId;
    if (!isSessionUnlocked()) {
      setSessionUnlocked();
      document.querySelectorAll(".tool-card").forEach((el) => el.classList.add("unlocked"));
    }
    openTool(toolId);
  }

  function openModal(title, content) {
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    modalBody.innerHTML = "";
    pdfUiState = null;
    document.body.classList.remove("modal-open");
  }

  function openTool(toolId) {
    const tool = tools.find((item) => item.id === toolId);
    if (!tool) return;
    const templateFn = toolTemplates[toolId];
    if (!templateFn) return;
    openModal(tool.name, templateFn());
    initTool(toolId);
  }

  const toolTemplates = {
    "word-counter": () => `
    <div class="tool-shell">
      <div class="field"><label for="wcText">Text</label><textarea id="wcText" placeholder="Paste or type…"></textarea></div>
      <div class="result-panel" id="wcResult">Words: 0 · Characters: 0 · Lines: 0</div>
    </div>`,
    "case-converter": () => `
    <div class="tool-shell">
      <div class="field"><label for="ccText">Text</label><textarea id="ccText" placeholder="Your text…"></textarea></div>
      <div class="tool-actions">
        <button type="button" class="btn btn-secondary" id="toUpper">UPPERCASE</button>
        <button type="button" class="btn btn-secondary" id="toLower">lowercase</button>
        <button type="button" class="btn btn-secondary" id="toCapitalize">Title Case</button>
      </div>
    </div>`,
    "remove-duplicates": () => `
    <div class="tool-shell">
      <div class="field"><label for="rdInput">Lines</label><textarea id="rdInput" placeholder="One line per row…"></textarea></div>
      <div class="tool-actions"><button type="button" class="btn btn-primary" id="rdProcess">Remove duplicates</button></div>
      <div class="field"><label for="rdOutput">Result</label><textarea id="rdOutput" readonly placeholder="Unique lines appear here."></textarea></div>
    </div>`,
    "json-formatter": () => `
    <div class="tool-shell">
      <div class="field"><label for="jfInput">JSON</label><textarea id="jfInput" placeholder='{"hello":"world"}'></textarea></div>
      <div class="tool-actions">
        <button type="button" class="btn btn-primary" id="jfPretty">Pretty print</button>
        <button type="button" class="btn btn-secondary" id="jfMinify">Minify</button>
      </div>
      <div id="jfStatus" class="result-panel hidden"></div>
    </div>`,
    "base64-tool": () => `
    <div class="tool-shell">
      <div class="field"><label for="b64Input">Input</label><textarea id="b64Input" placeholder="Text or Base64…"></textarea></div>
      <div class="tool-actions">
        <button type="button" class="btn btn-primary" id="b64Encode">Encode</button>
        <button type="button" class="btn btn-secondary" id="b64Decode">Decode</button>
      </div>
      <div class="field"><label for="b64Output">Output</label><textarea id="b64Output" readonly></textarea></div>
    </div>`,
    "emi-calculator": () => `
    <div class="tool-shell">
      <div class="field-row">
        <div class="field"><label for="emiPrincipal">Principal</label><input type="number" id="emiPrincipal" inputmode="decimal" /></div>
        <div class="field"><label for="emiRate">Annual rate (%)</label><input type="number" id="emiRate" inputmode="decimal" /></div>
      </div>
      <div class="field"><label for="emiMonths">Tenure (months)</label><input type="number" id="emiMonths" inputmode="numeric" /></div>
      <div class="tool-actions"><button type="button" class="btn btn-primary" id="emiCalcBtn">Calculate EMI</button></div>
      <div class="result-panel" id="emiResult">Monthly EMI: —</div>
    </div>`,
    "profit-calculator": () => `
    <div class="tool-shell">
      <div class="field-row">
        <div class="field"><label for="pcCost">Cost price</label><input type="number" id="pcCost" inputmode="decimal" /></div>
        <div class="field"><label for="pcSell">Selling price</label><input type="number" id="pcSell" inputmode="decimal" /></div>
      </div>
      <div class="tool-actions"><button type="button" class="btn btn-primary" id="pcCalcBtn">Calculate</button></div>
      <div class="result-panel" id="pcResult">Profit: —</div>
    </div>`,
    "age-calculator": () => `
    <div class="tool-shell">
      <div class="field"><label for="acDob">Date of birth</label><input type="date" id="acDob" /></div>
      <div class="tool-actions"><button type="button" class="btn btn-primary" id="acCalcBtn">Calculate age</button></div>
      <div class="result-panel" id="acResult">Age: —</div>
    </div>`,
    "percentage-calculator": () => `
    <div class="tool-shell">
      <div class="field-row">
        <div class="field"><label for="perValue">Value</label><input type="number" id="perValue" inputmode="decimal" /></div>
        <div class="field"><label for="perTotal">Total</label><input type="number" id="perTotal" inputmode="decimal" /></div>
      </div>
      <div class="tool-actions"><button type="button" class="btn btn-primary" id="perCalcBtn">Calculate %</button></div>
      <div class="result-panel" id="perResult">Result: —</div>
    </div>`,
    "password-generator": () => `
    <div class="tool-shell">
      <div class="field"><label for="pgLength">Length</label><input type="number" id="pgLength" min="4" max="64" value="16" /></div>
      <div class="checkbox-row">
        <label><input type="checkbox" id="pgUpper" checked /> Uppercase</label>
        <label><input type="checkbox" id="pgLower" checked /> Lowercase</label>
        <label><input type="checkbox" id="pgNumber" checked /> Numbers</label>
        <label><input type="checkbox" id="pgSymbol" /> Symbols</label>
      </div>
      <div class="tool-actions"><button type="button" class="btn btn-primary" id="pgGenerateBtn">Generate</button></div>
      <div class="result-panel" id="pgResult">Password: —</div>
    </div>`,
    "username-generator": () => `
    <div class="tool-shell">
      <div class="field"><label for="ugInput">Keyword</label><input type="text" id="ugInput" placeholder="e.g. aurora" /></div>
      <div class="tool-actions"><button type="button" class="btn btn-primary" id="ugGenerateBtn">Generate username</button></div>
      <div class="result-panel" id="ugResult">Username: —</div>
    </div>`,
    "fake-data-generator": () => `
    <div class="tool-shell">
      <div class="tool-actions"><button type="button" class="btn btn-primary" id="fdGenerateBtn">Generate sample</button></div>
      <div class="result-panel" id="fdResult">Tap generate for a random profile.</div>
    </div>`,
    "image-to-base64": () => `
    <div class="tool-shell">
      <div class="field"><label for="ibFile">Image</label><input type="file" id="ibFile" accept="image/*" /></div>
      <div class="field"><label for="ibOutput">Data URL</label><textarea id="ibOutput" readonly placeholder="Base64 data URL…"></textarea></div>
    </div>`,
    "image-resize": () => `
    <div class="tool-shell">
      <div class="field"><label for="irFile">Image</label><input type="file" id="irFile" accept="image/*" /></div>
      <div class="field-row">
        <div class="field"><label for="irWidth">Width (px)</label><input type="number" id="irWidth" value="640" min="1" /></div>
        <div class="field"><label for="irHeight">Height (px)</label><input type="number" id="irHeight" value="640" min="1" /></div>
      </div>
      <div class="tool-actions"><button type="button" class="btn btn-primary" id="irResizeBtn">Resize</button></div>
      <canvas id="irCanvas" class="hidden"></canvas>
      <img id="irPreview" class="canvas-preview hidden" alt="Resized preview" />
      <a id="irDownload" class="btn btn-success hidden" download="resized.png">Download PNG</a>
    </div>`,
    "image-crop": () => `
    <div class="tool-shell">
      <div class="field"><label for="icFile">Image</label><input type="file" id="icFile" accept="image/*" /></div>
      <div class="field-row">
        <div class="field"><label for="icX">X</label><input type="number" id="icX" value="0" min="0" /></div>
        <div class="field"><label for="icY">Y</label><input type="number" id="icY" value="0" min="0" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label for="icWidth">Width</label><input type="number" id="icWidth" value="200" min="1" /></div>
        <div class="field"><label for="icHeight">Height</label><input type="number" id="icHeight" value="200" min="1" /></div>
      </div>
      <div class="tool-actions"><button type="button" class="btn btn-primary" id="icCropBtn">Crop</button></div>
      <canvas id="icCanvas" class="hidden"></canvas>
      <img id="icPreview" class="canvas-preview hidden" alt="Cropped preview" />
      <a id="icDownload" class="btn btn-success hidden" download="cropped.png">Download PNG</a>
    </div>`,
    "pdf-to-word": () => `
    <div class="tool-shell">
      <p class="result-panel">This is a front-end demo. Real PDF→Word conversion needs a secure server pipeline.</p>
      <div class="dropzone" id="dropzone" role="button" tabindex="0">
        <input id="pdfInput" type="file" accept=".pdf,application/pdf" hidden />
        <div class="pdf-badge" aria-hidden="true">PDF</div>
        <p><strong>Drop a PDF</strong> or click to browse</p>
      </div>
      <p id="fileName" class="file-name">No file selected</p>
      <button type="button" id="convertBtn" class="btn btn-primary" disabled>Simulate conversion</button>
      <div id="loadingState" class="tool-loading hidden"><span class="spinner" aria-hidden="true"></span><span>Working…</span></div>
      <div id="successState" class="result-panel hidden">Ready — download is a placeholder.</div>
      <button type="button" id="downloadBtn" class="btn btn-success hidden">Download Word (demo)</button>
    </div>`,
  };

  function initTool(toolId) {
    const map = {
      "word-counter": initWordCounter,
      "case-converter": initCaseConverter,
      "remove-duplicates": initRemoveDuplicates,
      "json-formatter": initJsonFormatter,
      "base64-tool": initBase64Tool,
      "emi-calculator": initEmiCalculator,
      "profit-calculator": initProfitCalculator,
      "age-calculator": initAgeCalculator,
      "percentage-calculator": initPercentageCalculator,
      "password-generator": initPasswordGenerator,
      "username-generator": initUsernameGenerator,
      "fake-data-generator": initFakeDataGenerator,
      "image-to-base64": initImageToBase64,
      "image-resize": initImageResize,
      "image-crop": initImageCrop,
      "pdf-to-word": initPdfToWord,
    };
    const fn = map[toolId];
    if (fn) fn();
  }

  function initWordCounter() {
    const text = document.getElementById("wcText");
    const result = document.getElementById("wcResult");
    const update = () => {
      const val = text.value;
      const lines = val ? val.split(/\n/).length : 0;
      const trimmed = val.trim();
      const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
      result.textContent = `Words: ${words} · Characters: ${val.length} · Lines: ${lines}`;
    };
    text.addEventListener("input", update);
    update();
  }

  function initCaseConverter() {
    const text = document.getElementById("ccText");
    document.getElementById("toUpper").addEventListener("click", () => {
      text.value = text.value.toUpperCase();
    });
    document.getElementById("toLower").addEventListener("click", () => {
      text.value = text.value.toLowerCase();
    });
    document.getElementById("toCapitalize").addEventListener("click", () => {
      text.value = text.value
        .toLowerCase()
        .split(/\s+/)
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
        .join(" ");
    });
  }

  function initRemoveDuplicates() {
    const input = document.getElementById("rdInput");
    const output = document.getElementById("rdOutput");
    document.getElementById("rdProcess").addEventListener("click", () => {
      const seen = new Set();
      const out = [];
      input.value.split("\n").forEach((line) => {
        if (!seen.has(line)) {
          seen.add(line);
          out.push(line);
        }
      });
      output.value = out.join("\n");
    });
  }

  function initJsonFormatter() {
    const input = document.getElementById("jfInput");
    const status = document.getElementById("jfStatus");
    const run = (pretty) => {
      try {
        const parsed = JSON.parse(input.value);
        input.value = pretty ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
        status.textContent = pretty ? "Formatted." : "Minified.";
        status.classList.remove("hidden", "is-error");
      } catch {
        status.textContent = "Invalid JSON — check brackets and quotes.";
        status.classList.remove("hidden");
        status.classList.add("is-error");
      }
    };
    document.getElementById("jfPretty").addEventListener("click", () => run(true));
    document.getElementById("jfMinify").addEventListener("click", () => run(false));
  }

  function initBase64Tool() {
    const input = document.getElementById("b64Input");
    const output = document.getElementById("b64Output");
    document.getElementById("b64Encode").addEventListener("click", () => {
      output.value = btoa(unescape(encodeURIComponent(input.value)));
    });
    document.getElementById("b64Decode").addEventListener("click", () => {
      try {
        output.value = decodeURIComponent(escape(atob(input.value.trim())));
      } catch {
        output.value = "Invalid Base64 input.";
      }
    });
  }

  function initEmiCalculator() {
    document.getElementById("emiCalcBtn").addEventListener("click", () => {
      const p = Number(document.getElementById("emiPrincipal").value);
      const annualRate = Number(document.getElementById("emiRate").value);
      const n = Number(document.getElementById("emiMonths").value);
      const result = document.getElementById("emiResult");
      if (!p || !n) {
        result.textContent = "Enter principal and tenure.";
        return;
      }
      const r = annualRate / 12 / 100;
      if (r === 0) {
        result.textContent = `Monthly EMI: ${(p / n).toFixed(2)}`;
        return;
      }
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      result.textContent = `Monthly EMI: ${emi.toFixed(2)}`;
    });
  }

  function initProfitCalculator() {
    document.getElementById("pcCalcBtn").addEventListener("click", () => {
      const cost = Number(document.getElementById("pcCost").value);
      const sell = Number(document.getElementById("pcSell").value);
      const profit = sell - cost;
      const margin = sell ? (profit / sell) * 100 : 0;
      document.getElementById("pcResult").textContent = `Profit: ${profit.toFixed(2)} · Margin: ${margin.toFixed(2)}%`;
    });
  }

  function initAgeCalculator() {
    document.getElementById("acCalcBtn").addEventListener("click", () => {
      const raw = document.getElementById("acDob").value;
      const dob = new Date(raw + "T12:00:00");
      const now = new Date();
      const result = document.getElementById("acResult");
      if (Number.isNaN(dob.getTime()) || dob > now) {
        result.textContent = "Pick a valid past date.";
        return;
      }
      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      let days = now.getDate() - dob.getDate();
      if (days < 0) {
        months -= 1;
        const prev = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prev.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      result.textContent = `Age: ${years} years, ${months} months, ${days} days`;
    });
  }

  function initPercentageCalculator() {
    document.getElementById("perCalcBtn").addEventListener("click", () => {
      const value = Number(document.getElementById("perValue").value);
      const total = Number(document.getElementById("perTotal").value);
      if (!total) {
        document.getElementById("perResult").textContent = "Total must be non-zero.";
        return;
      }
      const pct = (value / total) * 100;
      document.getElementById("perResult").textContent = `Result: ${pct.toFixed(2)}%`;
    });
  }

  function initPasswordGenerator() {
    const randBelow = (n) => {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return buf[0] % n;
    };
    const shuffle = (chars) => {
      const a = [...chars];
      for (let i = a.length - 1; i > 0; i -= 1) {
        const j = randBelow(i + 1);
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    document.getElementById("pgGenerateBtn").addEventListener("click", () => {
      let length = Number(document.getElementById("pgLength").value);
      length = Math.min(64, Math.max(4, length || 12));
      const sets = [];
      if (document.getElementById("pgUpper").checked) sets.push("ABCDEFGHJKLMNPQRSTUVWXYZ");
      if (document.getElementById("pgLower").checked) sets.push("abcdefghijkmnopqrstuvwxyz");
      if (document.getElementById("pgNumber").checked) sets.push("23456789");
      if (document.getElementById("pgSymbol").checked) sets.push("!@#$%^&*-_+=?");
      const source = sets.join("");
      const out = document.getElementById("pgResult");
      if (!source) {
        out.textContent = "Select at least one character set.";
        return;
      }
      length = Math.max(length, sets.length);
      const mandatory = sets.map((s) => s[randBelow(s.length)]);
      const extra = Math.max(0, length - mandatory.length);
      const buf = new Uint8Array(extra);
      crypto.getRandomValues(buf);
      const rest = [];
      for (let i = 0; i < extra; i += 1) rest.push(source[buf[i] % source.length]);
      const pwd = shuffle([...mandatory, ...rest]).join("");
      out.textContent = `Password: ${pwd}`;
    });
  }

  function initUsernameGenerator() {
    document.getElementById("ugGenerateBtn").addEventListener("click", () => {
      const base = document.getElementById("ugInput").value.trim() || "user";
      const suffix = Math.floor(100 + Math.random() * 900);
      const slug = base.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      document.getElementById("ugResult").textContent = `Username: ${slug || "user"}_${suffix}`;
    });
  }

  function initFakeDataGenerator() {
    const firstNames = ["Alex", "Sam", "Taylor", "Jordan", "Morgan", "Riley"];
    const lastNames = ["Chen", "Patel", "Garcia", "Nakamura", "Okafor", "Bakker"];
    const domains = ["example.com", "mail.tools", "sample.dev"];
    document.getElementById("fdGenerateBtn").addEventListener("click", () => {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      const email = `${first.toLowerCase()}.${last.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
      const phone = `+1 · ${Math.floor(200 + Math.random() * 800)} · ${Math.floor(200 + Math.random() * 800)} · ${Math.floor(1000 + Math.random() * 9000)}`;
      document.getElementById("fdResult").textContent = `Name: ${first} ${last}\nEmail: ${email}\nPhone: ${phone}`;
    });
  }

  function initImageToBase64() {
    const file = document.getElementById("ibFile");
    const output = document.getElementById("ibOutput");
    file.addEventListener("change", () => {
      const selected = file.files[0];
      if (!selected) return;
      const reader = new FileReader();
      reader.onload = () => {
        output.value = reader.result;
      };
      reader.readAsDataURL(selected);
    });
  }

  function loadImageFromInput(input, callback) {
    const f = input.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => callback(img);
      img.onerror = () => callback(null);
      img.src = reader.result;
    };
    reader.readAsDataURL(f);
  }

  function initImageResize() {
    const fileInput = document.getElementById("irFile");
    const btn = document.getElementById("irResizeBtn");
    const canvas = document.getElementById("irCanvas");
    const download = document.getElementById("irDownload");
    const preview = document.getElementById("irPreview");
    btn.addEventListener("click", () => {
      loadImageFromInput(fileInput, (img) => {
        if (!img) return;
        const w = Math.max(1, Number(document.getElementById("irWidth").value) || 1);
        const h = Math.max(1, Number(document.getElementById("irHeight").value) || 1);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        const url = canvas.toDataURL("image/png");
        download.href = url;
        download.classList.remove("hidden");
        preview.src = url;
        preview.classList.remove("hidden");
      });
    });
  }

  function initImageCrop() {
    const fileInput = document.getElementById("icFile");
    const btn = document.getElementById("icCropBtn");
    const canvas = document.getElementById("icCanvas");
    const download = document.getElementById("icDownload");
    const preview = document.getElementById("icPreview");
    btn.addEventListener("click", () => {
      loadImageFromInput(fileInput, (img) => {
        if (!img) return;
        const x = Math.max(0, Number(document.getElementById("icX").value) || 0);
        const y = Math.max(0, Number(document.getElementById("icY").value) || 0);
        const w = Math.max(1, Number(document.getElementById("icWidth").value) || 1);
        const h = Math.max(1, Number(document.getElementById("icHeight").value) || 1);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        try {
          ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
        } catch {
          return;
        }
        const url = canvas.toDataURL("image/png");
        download.href = url;
        download.classList.remove("hidden");
        preview.src = url;
        preview.classList.remove("hidden");
      });
    });
  }

  function initPdfToWord() {
    const dropzone = document.getElementById("dropzone");
    const pdfInput = document.getElementById("pdfInput");
    const fileNameText = document.getElementById("fileName");
    const convertBtn = document.getElementById("convertBtn");
    const loadingState = document.getElementById("loadingState");
    const successState = document.getElementById("successState");
    const downloadBtn = document.getElementById("downloadBtn");
    let selectedFile = null;

    const isPdf = (file) => file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"));

    const setFile = (file) => {
      if (!isPdf(file)) {
        selectedFile = null;
        fileNameText.textContent = "Please choose a PDF file.";
        convertBtn.disabled = true;
        dropzone.classList.remove("uploaded");
        return;
      }
      selectedFile = file;
      fileNameText.textContent = `Selected: ${file.name}`;
      convertBtn.disabled = false;
      dropzone.classList.add("uploaded");
      successState.classList.add("hidden");
      downloadBtn.classList.add("hidden");
    };

    dropzone.addEventListener("click", () => pdfInput.click());
    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pdfInput.click();
      }
    });
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      setFile(e.dataTransfer.files[0]);
    });
    pdfInput.addEventListener("change", () => setFile(pdfInput.files[0]));

    convertBtn.addEventListener("click", () => {
      if (!selectedFile) return;
      convertBtn.disabled = true;
      loadingState.classList.remove("hidden");
      successState.classList.add("hidden");
      downloadBtn.classList.add("hidden");
      pdfUiState = { successState, downloadBtn };

      window.setTimeout(() => {
        loadingState.classList.add("hidden");
        convertBtn.disabled = false;
        successState.classList.remove("hidden");
        downloadBtn.classList.remove("hidden");
      }, 1400);
    });

    downloadBtn.addEventListener("click", () => {
      if (selectedFile) {
        window.alert(`Demo: a Word export for "${selectedFile.name}" would download from a backend.`);
      }
    });
  }

  function initTheme() {
    const stored = localStorage.getItem(STORAGE_THEME);
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
    themeToggle?.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(STORAGE_THEME, next);
      } catch {
        /* ignore */
      }
    });
  }

  function initNavScroll() {
    const onScroll = () => {
      siteNav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initMobileNav() {
    if (!navMobileToggle || !navMobile) return;
    navMobileToggle.addEventListener("click", () => {
      const open = navMobileToggle.getAttribute("aria-expanded") === "true";
      navMobileToggle.setAttribute("aria-expanded", String(!open));
      navMobile.hidden = open;
    });
    navMobile.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navMobileToggle.setAttribute("aria-expanded", "false");
        navMobile.hidden = true;
      });
    });
  }

  function initPointerGlow() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.addEventListener(
      "pointermove",
      (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty("--mx", `${x}%`);
        document.documentElement.style.setProperty("--my", `${y}%`);
      },
      { passive: true }
    );
  }

  function initSectionReveal() {
    const sections = document.querySelectorAll(".section-reveal");
    sections.forEach((el) => el.classList.add("section-reveal"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" }
    );
    sections.forEach((s) => io.observe(s));
  }

  toolSearch.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    renderTools();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      filterButtons.forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-pressed", String(b === button));
      });
      renderTools();
    });
  });

  emptyReset.addEventListener("click", () => {
    toolSearch.value = "";
    searchTerm = "";
    activeCategory = "all";
    filterButtons.forEach((b) => {
      b.classList.toggle("active", b.dataset.category === "all");
      b.setAttribute("aria-pressed", String(b.dataset.category === "all"));
    });
    renderTools();
  });

  closeModalBtn.addEventListener("click", closeModal);
  closeModalBackdrop.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
  });

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initTheme();
  initNavScroll();
  initMobileNav();
  initPointerGlow();
  initSectionReveal();
  buildSkeleton();
  toolsGrid.style.display = "none";
  toolsEmpty.classList.add("hidden");

  window.setTimeout(() => {
    hideSkeleton();
    toolsGrid.style.display = "";
    renderTools();
  }, 420);

// AdGrove callback (ADD THIS HERE)
window.AdGrove = window.AdGrove || {};
window.AdGrove.onContentUnlock = function () {
  openTool(selectedToolId);
};
  

})();
