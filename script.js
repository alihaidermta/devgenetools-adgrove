const toolsGrid = document.getElementById("toolsGrid");
const toolSearch = document.getElementById("toolSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const modal = document.getElementById("toolModal");
const modalBody = document.getElementById("toolModalBody");
const modalTitle = document.getElementById("toolModalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const closeModalBackdrop = document.getElementById("closeModalBackdrop");
const unlockModal = document.getElementById("unlockModal");
const closeUnlockBtn = document.getElementById("closeUnlockBtn");
const closeUnlockBackdrop = document.getElementById("closeUnlockBackdrop");
const watchAdBtn = document.getElementById("watchAdBtn");

let activeCategory = "all";
let searchTerm = "";
let pdfUiState = null;
let pendingToolId = null;

const tools = [
  // Text tools
  { id: "word-counter", name: "Word Counter", category: "text", icon: "fileText" },
  { id: "case-converter", name: "Case Converter", category: "text", icon: "type" },
  { id: "remove-duplicates", name: "Remove Duplicate Lines", category: "text", icon: "listMinus" },
  { id: "json-formatter", name: "JSON Formatter", category: "text", icon: "braces" },
  { id: "base64-tool", name: "Base64 Encoder/Decoder", category: "text", icon: "binary" },
  // Calculators
  { id: "emi-calculator", name: "EMI Calculator", category: "calculator", icon: "calculator" },
  { id: "profit-calculator", name: "Profit Calculator", category: "calculator", icon: "chart" },
  { id: "age-calculator", name: "Age Calculator", category: "calculator", icon: "calendar" },
  { id: "percentage-calculator", name: "Percentage Calculator", category: "calculator", icon: "percent" },
  // Generators
  { id: "password-generator", name: "Password Generator", category: "generator", icon: "keyRound" },
  { id: "username-generator", name: "Username Generator", category: "generator", icon: "atSign" },
  { id: "fake-data-generator", name: "Fake Data Generator", category: "generator", icon: "idCard" },
  // Image tools
  { id: "image-to-base64", name: "Image to Base64", category: "image", icon: "image" },
  { id: "image-resize", name: "Image Resize", category: "image", icon: "maximize" },
  { id: "image-crop", name: "Image Crop", category: "image", icon: "crop" },
  // Premium
  { id: "pdf-to-word", name: "PDF to Word Converter", category: "premium", icon: "fileDown", premium: true }
];

function getToolIconSvg(iconName) {
  const icons = {
    fileText: '<svg viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h6"/></svg>',
    type: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>',
    listMinus: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 6h12"/><path d="M8 12h12"/><path d="M8 18h12"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>',
    braces: '<svg viewBox="0 0 24 24" fill="none"><path d="M9 4c-2 0-3 1-3 3v2c0 1-1 2-2 2 1 0 2 1 2 2v2c0 2 1 3 3 3"/><path d="M15 4c2 0 3 1 3 3v2c0 1 1 2 2 2-1 0-2 1-2 2v2c0 2-1 3-3 3"/></svg>',
    binary: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 5v4"/><path d="M6 15v4"/><path d="M12 5v14"/><path d="M18 5v4"/><path d="M18 15v4"/></svg>',
    calculator: '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11h2"/><path d="M12 11h2"/><path d="M16 11h0"/><path d="M8 15h2"/><path d="M12 15h2"/><path d="M16 15h0"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/><path d="M3 10h18"/></svg>',
    percent: '<svg viewBox="0 0 24 24" fill="none"><path d="M19 5L5 19"/><circle cx="7" cy="7" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
    keyRound: '<svg viewBox="0 0 24 24" fill="none"><circle cx="8" cy="15" r="4"/><path d="M12 15h9"/><path d="M18 12v6"/><path d="M21 13v4"/></svg>',
    atSign: '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8"/><path d="M16 12v1a2 2 0 1 0 4 0v-1a8 8 0 1 0-8 8"/></svg>',
    idCard: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 10h5"/><path d="M13 14h5"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-7 7"/></svg>',
    maximize: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 3H3v5"/><path d="M16 3h5v5"/><path d="M3 16v5h5"/><path d="M21 16v5h-5"/></svg>',
    crop: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 3v12a3 3 0 0 0 3 3h12"/><path d="M3 6h12a3 3 0 0 1 3 3v12"/><path d="M6 18h12"/></svg>',
    fileDown: '<svg viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M12 12v6"/><path d="m9 15 3 3 3-3"/></svg>'
  };
  return icons[iconName] || icons.fileText;
}

function renderTools() {
  const filtered = tools.filter((tool) => {
    const byCategory = activeCategory === "all" || tool.category === activeCategory;
    const bySearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return byCategory && bySearch;
  });

  toolsGrid.innerHTML = filtered
    .map(
      (tool, index) => `
      <article class="tool-card ${tool.premium ? "premium-card" : ""}" data-tool-id="${tool.id}" style="transition-delay:${index * 28}ms">
        <span class="tool-lock">🔒</span>
        <span class="tool-icon">${getToolIconSvg(tool.icon)}</span>
        <h4>${tool.name}</h4>
        <p>Open tool</p>
      </article>
    `
    )
    .join("");

  document.querySelectorAll(".tool-card").forEach((card) => {
    card.addEventListener("click", () => unlockToolWithAd(card.dataset.toolId));
  });

  requestAnimationFrame(() => {
    document.querySelectorAll(".tool-card").forEach((card) => card.classList.add("show"));
  });
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
  if (unlockModal.classList.contains("hidden")) {
    document.body.classList.remove("modal-open");
  }
}

function openTool(toolId) {
  const tool = tools.find((item) => item.id === toolId);
  if (!tool) return;

  const templateFn = toolTemplates[toolId];
  if (!templateFn) return;

  openModal(tool.name, templateFn());
  initTool(toolId);
}

function openUnlockModal() {
  unlockModal.classList.remove("hidden");
  unlockModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeUnlockModal() {
  unlockModal.classList.add("hidden");
  unlockModal.setAttribute("aria-hidden", "true");
  pendingToolId = null;
  watchAdBtn.disabled = false;
  watchAdBtn.textContent = "Watch Ad";
  if (modal.classList.contains("hidden")) {
    document.body.classList.remove("modal-open");
  }
}

async function unlockToolWithAd(toolId) {
  pendingToolId = toolId;
  openUnlockModal();
}

function initSectionRevealAnimations() {
  const sections = document.querySelectorAll(".hero, .section, .about-section, .site-footer");
  sections.forEach((section) => section.classList.add("section-reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Tool templates
const toolTemplates = {
  "word-counter": () => `
    <section class="tool-card-shell">
      <div class="field"><label>Enter text</label><textarea id="wcText"></textarea></div>
      <div class="result-box" id="wcResult">Words: 0 | Characters: 0</div>
    </section>
  `,
  "case-converter": () => `
    <section class="tool-card-shell">
      <div class="field"><label>Text</label><textarea id="ccText"></textarea></div>
      <div class="tool-actions">
        <button class="btn btn-secondary" id="toUpper">UPPERCASE</button>
        <button class="btn btn-secondary" id="toLower">lowercase</button>
        <button class="btn btn-secondary" id="toCapitalize">Capitalize</button>
      </div>
    </section>
  `,
  "remove-duplicates": () => `
    <section class="tool-card-shell">
      <div class="field"><label>Lines (one per row)</label><textarea id="rdInput"></textarea></div>
      <div class="tool-actions"><button class="btn btn-primary" id="rdProcess">Remove Duplicates</button></div>
      <div class="field"><label>Result</label><textarea id="rdOutput" readonly></textarea></div>
    </section>
  `,
  "json-formatter": () => `
    <section class="tool-card-shell">
      <div class="field"><label>JSON</label><textarea id="jfInput"></textarea></div>
      <div class="tool-actions">
        <button class="btn btn-primary" id="jfPretty">Pretty Print</button>
        <button class="btn btn-secondary" id="jfMinify">Minify</button>
      </div>
      <div id="jfStatus" class="result-box hidden"></div>
    </section>
  `,
  "base64-tool": () => `
    <section class="tool-card-shell">
      <div class="field"><label>Input</label><textarea id="b64Input"></textarea></div>
      <div class="tool-actions">
        <button class="btn btn-primary" id="b64Encode">Encode</button>
        <button class="btn btn-secondary" id="b64Decode">Decode</button>
      </div>
      <div class="field"><label>Output</label><textarea id="b64Output" readonly></textarea></div>
    </section>
  `,
  "emi-calculator": () => `
    <section class="tool-card-shell">
      <div class="field-row">
        <div class="field"><label>Principal</label><input type="number" id="emiPrincipal" /></div>
        <div class="field"><label>Annual Interest (%)</label><input type="number" id="emiRate" /></div>
      </div>
      <div class="field"><label>Tenure (months)</label><input type="number" id="emiMonths" /></div>
      <div class="tool-actions"><button class="btn btn-primary" id="emiCalcBtn">Calculate EMI</button></div>
      <div class="result-box" id="emiResult">Monthly EMI: -</div>
    </section>
  `,
  "profit-calculator": () => `
    <section class="tool-card-shell">
      <div class="field-row">
        <div class="field"><label>Cost Price</label><input type="number" id="pcCost" /></div>
        <div class="field"><label>Selling Price</label><input type="number" id="pcSell" /></div>
      </div>
      <div class="tool-actions"><button class="btn btn-primary" id="pcCalcBtn">Calculate</button></div>
      <div class="result-box" id="pcResult">Profit: -</div>
    </section>
  `,
  "age-calculator": () => `
    <section class="tool-card-shell">
      <div class="field"><label>Date of Birth</label><input type="date" id="acDob" /></div>
      <div class="tool-actions"><button class="btn btn-primary" id="acCalcBtn">Calculate Age</button></div>
      <div class="result-box" id="acResult">Age: -</div>
    </section>
  `,
  "percentage-calculator": () => `
    <section class="tool-card-shell">
      <div class="field-row">
        <div class="field"><label>Value</label><input type="number" id="perValue" /></div>
        <div class="field"><label>Total</label><input type="number" id="perTotal" /></div>
      </div>
      <div class="tool-actions"><button class="btn btn-primary" id="perCalcBtn">Calculate %</button></div>
      <div class="result-box" id="perResult">Result: -</div>
    </section>
  `,
  "password-generator": () => `
    <section class="tool-card-shell">
      <div class="field"><label>Length</label><input type="number" id="pgLength" min="4" max="64" value="12" /></div>
      <div class="field-row">
        <label><input type="checkbox" id="pgUpper" checked /> Uppercase</label>
        <label><input type="checkbox" id="pgLower" checked /> Lowercase</label>
      </div>
      <div class="field-row">
        <label><input type="checkbox" id="pgNumber" checked /> Numbers</label>
        <label><input type="checkbox" id="pgSymbol" /> Symbols</label>
      </div>
      <div class="tool-actions"><button class="btn btn-primary" id="pgGenerateBtn">Generate</button></div>
      <div class="result-box" id="pgResult">Password: -</div>
    </section>
  `,
  "username-generator": () => `
    <section class="tool-card-shell">
      <div class="field"><label>Name / Keyword</label><input type="text" id="ugInput" placeholder="alex" /></div>
      <div class="tool-actions"><button class="btn btn-primary" id="ugGenerateBtn">Generate Username</button></div>
      <div class="result-box" id="ugResult">Username: -</div>
    </section>
  `,
  "fake-data-generator": () => `
    <section class="tool-card-shell">
      <div class="tool-actions"><button class="btn btn-primary" id="fdGenerateBtn">Generate Fake Data</button></div>
      <div class="result-box" id="fdResult">Name: -\nEmail: -\nPhone: -</div>
    </section>
  `,
  "image-to-base64": () => `
    <section class="tool-card-shell">
      <div class="field"><label>Select Image</label><input type="file" id="ibFile" accept="image/*" /></div>
      <div class="field"><label>Base64 Output</label><textarea id="ibOutput" readonly></textarea></div>
    </section>
  `,
  "image-resize": () => `
    <section class="tool-card-shell">
      <div class="field"><label>Image File</label><input type="file" id="irFile" accept="image/*" /></div>
      <div class="field-row">
        <div class="field"><label>Width</label><input type="number" id="irWidth" value="300" /></div>
        <div class="field"><label>Height</label><input type="number" id="irHeight" value="300" /></div>
      </div>
      <div class="tool-actions"><button class="btn btn-primary" id="irResizeBtn">Resize Image</button></div>
      <canvas id="irCanvas" class="hidden"></canvas>
      <a id="irDownload" class="btn btn-success hidden" download="resized-image.png">Download Resized Image</a>
    </section>
  `,
  "image-crop": () => `
    <section class="tool-card-shell">
      <div class="field"><label>Image File</label><input type="file" id="icFile" accept="image/*" /></div>
      <div class="field-row">
        <div class="field"><label>X</label><input type="number" id="icX" value="0" /></div>
        <div class="field"><label>Y</label><input type="number" id="icY" value="0" /></div>
      </div>
      <div class="field-row">
        <div class="field"><label>Width</label><input type="number" id="icWidth" value="200" /></div>
        <div class="field"><label>Height</label><input type="number" id="icHeight" value="200" /></div>
      </div>
      <div class="tool-actions"><button class="btn btn-primary" id="icCropBtn">Crop Image</button></div>
      <canvas id="icCanvas" class="hidden"></canvas>
      <a id="icDownload" class="btn btn-success hidden" download="cropped-image.png">Download Cropped Image</a>
    </section>
  `,
  "pdf-to-word": () => `
    <section class="tool-card-shell">
      <p class="result-box">Watch Ad to Unlock</p>
      <div class="dropzone" id="dropzone" role="button" tabindex="0">
        <input id="pdfInput" type="file" accept=".pdf,application/pdf" hidden />
        <div class="pdf-icon"><span>PDF</span></div>
        <p><strong>Drag & drop your PDF</strong></p>
        <p>or click to browse</p>
      </div>
      <p id="fileName" class="file-name">No file selected</p>
      <button id="convertBtn" class="btn btn-primary" disabled>Convert to Word</button>
      <div id="loadingState" class="loading hidden"><span class="spinner"></span><p>Converting...</p></div>
      <div id="successState" class="success-state hidden"><span class="success-check">✓</span><p>Conversion complete</p></div>
      <button id="downloadBtn" class="btn btn-success hidden">Download Word File</button>
    </section>
  `
};

// Tool initializers
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
    "pdf-to-word": initPdfToWord
  };

  const setup = map[toolId];
  if (setup) setup();
}

function initWordCounter() {
  const text = document.getElementById("wcText");
  const result = document.getElementById("wcResult");
  text.addEventListener("input", () => {
    const raw = text.value.trim();
    const words = raw ? raw.split(/\s+/).length : 0;
    result.textContent = `Words: ${words} | Characters: ${text.value.length}`;
  });
}

function initCaseConverter() {
  const text = document.getElementById("ccText");
  document.getElementById("toUpper").addEventListener("click", () => (text.value = text.value.toUpperCase()));
  document.getElementById("toLower").addEventListener("click", () => (text.value = text.value.toLowerCase()));
  document.getElementById("toCapitalize").addEventListener("click", () => {
    text.value = text.value
      .toLowerCase()
      .split(" ")
      .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : ""))
      .join(" ");
  });
}

function initRemoveDuplicates() {
  const input = document.getElementById("rdInput");
  const output = document.getElementById("rdOutput");
  document.getElementById("rdProcess").addEventListener("click", () => {
    const unique = [...new Set(input.value.split("\n"))];
    output.value = unique.join("\n");
  });
}

function initJsonFormatter() {
  const input = document.getElementById("jfInput");
  const status = document.getElementById("jfStatus");
  const process = (pretty) => {
    try {
      const parsed = JSON.parse(input.value);
      input.value = pretty ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
      status.classList.remove("hidden");
      status.textContent = "JSON processed successfully.";
    } catch (error) {
      status.classList.remove("hidden");
      status.textContent = "Invalid JSON.";
    }
  };
  document.getElementById("jfPretty").addEventListener("click", () => process(true));
  document.getElementById("jfMinify").addEventListener("click", () => process(false));
}

function initBase64Tool() {
  const input = document.getElementById("b64Input");
  const output = document.getElementById("b64Output");
  document.getElementById("b64Encode").addEventListener("click", () => (output.value = btoa(unescape(encodeURIComponent(input.value)))));
  document.getElementById("b64Decode").addEventListener("click", () => {
    try {
      output.value = decodeURIComponent(escape(atob(input.value)));
    } catch (error) {
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
    const r = annualRate / 12 / 100;
    if (!p || !n) return (result.textContent = "Monthly EMI: Please enter valid values.");
    if (r === 0) return (result.textContent = `Monthly EMI: ${(p / n).toFixed(2)}`);
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
    document.getElementById("pcResult").textContent = `Profit: ${profit.toFixed(2)} | Margin: ${margin.toFixed(2)}%`;
  });
}

function initAgeCalculator() {
  document.getElementById("acCalcBtn").addEventListener("click", () => {
    const dob = new Date(document.getElementById("acDob").value);
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();
    if (days < 0) {
      months -= 1;
      days += 30;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    document.getElementById("acResult").textContent = `Age: ${years} years, ${months} months, ${days} days`;
  });
}

function initPercentageCalculator() {
  document.getElementById("perCalcBtn").addEventListener("click", () => {
    const value = Number(document.getElementById("perValue").value);
    const total = Number(document.getElementById("perTotal").value);
    const pct = total ? (value / total) * 100 : 0;
    document.getElementById("perResult").textContent = `Result: ${pct.toFixed(2)}%`;
  });
}

function initPasswordGenerator() {
  document.getElementById("pgGenerateBtn").addEventListener("click", () => {
    const length = Number(document.getElementById("pgLength").value);
    const sets = [];
    if (document.getElementById("pgUpper").checked) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (document.getElementById("pgLower").checked) sets.push("abcdefghijklmnopqrstuvwxyz");
    if (document.getElementById("pgNumber").checked) sets.push("0123456789");
    if (document.getElementById("pgSymbol").checked) sets.push("!@#$%^&*()_+{}[]");
    const source = sets.join("");
    if (!source) return (document.getElementById("pgResult").textContent = "Password: Select at least one option.");
    let password = "";
    for (let i = 0; i < length; i += 1) {
      password += source[Math.floor(Math.random() * source.length)];
    }
    document.getElementById("pgResult").textContent = `Password: ${password}`;
  });
}

function initUsernameGenerator() {
  document.getElementById("ugGenerateBtn").addEventListener("click", () => {
    const base = document.getElementById("ugInput").value.trim() || "user";
    const suffix = Math.floor(100 + Math.random() * 900);
    document.getElementById("ugResult").textContent = `Username: ${base.toLowerCase().replace(/\s+/g, "_")}${suffix}`;
  });
}

function initFakeDataGenerator() {
  const firstNames = ["Alex", "Sam", "Taylor", "Jordan", "Morgan", "Avery"];
  const lastNames = ["Smith", "Clark", "Ali", "Brown", "Miller", "Khan"];
  const domains = ["mail.com", "example.com", "devgene.tools"];
  document.getElementById("fdGenerateBtn").addEventListener("click", () => {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
    const phone = `+1-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
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
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => callback(img);
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function initImageResize() {
  const fileInput = document.getElementById("irFile");
  const resizeBtn = document.getElementById("irResizeBtn");
  const canvas = document.getElementById("irCanvas");
  const download = document.getElementById("irDownload");

  resizeBtn.addEventListener("click", () => {
    loadImageFromInput(fileInput, (img) => {
      const width = Number(document.getElementById("irWidth").value);
      const height = Number(document.getElementById("irHeight").value);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      download.href = canvas.toDataURL("image/png");
      download.classList.remove("hidden");
    });
  });
}

function initImageCrop() {
  const fileInput = document.getElementById("icFile");
  const cropBtn = document.getElementById("icCropBtn");
  const canvas = document.getElementById("icCanvas");
  const download = document.getElementById("icDownload");

  cropBtn.addEventListener("click", () => {
    loadImageFromInput(fileInput, (img) => {
      const x = Number(document.getElementById("icX").value);
      const y = Number(document.getElementById("icY").value);
      const width = Number(document.getElementById("icWidth").value);
      const height = Number(document.getElementById("icHeight").value);
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
      download.href = canvas.toDataURL("image/png");
      download.classList.remove("hidden");
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

  const setSelectedFile = (file) => {
    if (!isPdf(file)) {
      selectedFile = null;
      fileNameText.textContent = "Invalid file. Please upload a PDF.";
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
  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.classList.add("dragover");
  });
  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.classList.remove("dragover");
    setSelectedFile(event.dataTransfer.files[0]);
  });
  pdfInput.addEventListener("change", () => setSelectedFile(pdfInput.files[0]));

  convertBtn.addEventListener("click", () => {
    if (!selectedFile) return;
    convertBtn.disabled = true;
    loadingState.classList.remove("hidden");
    successState.classList.add("hidden");
    downloadBtn.classList.add("hidden");
    pdfUiState = { successState, downloadBtn };

    setTimeout(async () => {
      // Keep existing conversion flow: wait 2s, then trigger ad gate.
      await triggerAdBeforeDownload(() => {
        successState.classList.remove("hidden");
        downloadBtn.classList.remove("hidden");
      });
      loadingState.classList.add("hidden");
      convertBtn.disabled = false;
    }, 2000);
  });

  downloadBtn.addEventListener("click", () => {
    alert(`Your Word file for "${selectedFile.name}" is ready to download.`);
  });
}

async function triggerAdBeforeDownload(onComplete) {
  // AdGrove integration point:
  // Replace this timeout with your real AdGrove ad call and completion callback.
  await new Promise((resolve) => setTimeout(resolve, 3000));

  if (typeof onComplete === "function") {
    onComplete();
    return;
  }

  // Legacy support for any existing PDF unlock state references.
  if (pdfUiState) {
    pdfUiState.successState.classList.remove("hidden");
    pdfUiState.downloadBtn.classList.remove("hidden");
  }
}

toolSearch.addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderTools();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderTools();
  });
});

closeModalBtn.addEventListener("click", closeModal);
closeModalBackdrop.addEventListener("click", closeModal);
closeUnlockBtn.addEventListener("click", closeUnlockModal);
closeUnlockBackdrop.addEventListener("click", closeUnlockModal);
watchAdBtn.addEventListener("click", async () => {
  if (!pendingToolId) return;
  watchAdBtn.disabled = true;
  watchAdBtn.textContent = "Watching Ad...";
  // Central global ad-gating hook for all tools.
  await triggerAdBeforeDownload();
  const toolIdToOpen = pendingToolId;
  closeUnlockModal();
  openTool(toolIdToOpen);
});
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!unlockModal.classList.contains("hidden")) {
    closeUnlockModal();
    return;
  }
  if (!modal.classList.contains("hidden")) closeModal();
});

renderTools();
initSectionRevealAnimations();
