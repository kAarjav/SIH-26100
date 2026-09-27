const icons = {
  spark: '<path d="m12 2 2.4 6.1L21 10l-6.6 2.5L12 19l-2.4-6.5L3 10l6.6-1.9L12 2Z"/><path d="M19 17v5M16.5 19.5h5"/>',
  shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v7c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12v7c0 1.7 3.6 3 8 3s8-1.3 8-3v-7"/>',
  clean: '<path d="m3 21 9-9M14 4l6 6M12 6l6 6M14 4l2-2 6 6-2 2"/><path d="M4 14c3 0 5 2 5 5-3 2-6 2-8 2 1-2 1-5 3-7Z"/>',
  brain: '<path d="M9.5 4A3.5 3.5 0 0 0 6 7.5v.7A3.5 3.5 0 0 0 4 14a3.5 3.5 0 0 0 5.5 2.9V4ZM14.5 4A3.5 3.5 0 0 1 18 7.5v.7a3.5 3.5 0 0 1 2 5.8 3.5 3.5 0 0 1-5.5 2.9V4ZM9.5 8H7M14.5 8H17M9.5 13H7M14.5 13H17M9.5 19h5"/>',
  nodes: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="19" r="2"/><path d="m7 7 4 9M17 7l-4 9M7 6h10"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
  search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
  layers: '<path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>',
  box: '<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/>',
  trend: '<path d="M3 3v18h18M7 15l4-5 4 3 6-8"/>',
};

document.querySelectorAll("[data-icon]").forEach((node) => {
  node.innerHTML = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[node.dataset.icon] || icons.spark}</svg>`;
});

const header = document.querySelector(".site-header");
const menuButton = document.getElementById("menu-button");
const navigation = document.getElementById("site-nav");

function closeMenu() {
  navigation.classList.remove("open");
  menuButton.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 35), { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const glow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
}, { passive: true });

const analyseButton = document.getElementById("analyse-button");
const emptyResult = document.getElementById("empty-result");
const processingResult = document.getElementById("processing-result");
const matchResult = document.getElementById("match-result");
const approvedResult = document.getElementById("approved-result");
const analysisState = document.getElementById("analysis-state");
const processSteps = [...document.querySelectorAll(".process-step")];
const approveButton = document.getElementById("approve-button");
const resetButton = document.getElementById("reset-button");
const newRunButton = document.getElementById("new-run-button");
let timers = [];

function clearTimers() {
  timers.forEach((timer) => clearTimeout(timer));
  timers = [];
}

function resetDemo() {
  clearTimers();
  emptyResult.hidden = false;
  processingResult.hidden = true;
  matchResult.hidden = true;
  approvedResult.hidden = true;
  analyseButton.disabled = false;
  analysisState.textContent = "Ready to process";
  processSteps.forEach((step) => step.classList.remove("active", "done"));
}

function runAnalysis() {
  clearTimers();
  emptyResult.hidden = true;
  matchResult.hidden = true;
  approvedResult.hidden = true;
  processingResult.hidden = false;
  analyseButton.disabled = true;
  analysisState.textContent = "Analysis in progress";
  processSteps.forEach((step) => step.classList.remove("active", "done"));

  processSteps.forEach((step, index) => {
    timers.push(setTimeout(() => {
      if (index > 0) {
        processSteps[index - 1].classList.remove("active");
        processSteps[index - 1].classList.add("done");
      }
      step.classList.add("active");
    }, 350 + index * 520));
  });

  timers.push(setTimeout(() => {
    processSteps.at(-1).classList.remove("active");
    processSteps.at(-1).classList.add("done");
    processingResult.hidden = true;
    matchResult.hidden = false;
    analysisState.textContent = "Candidate match found";
  }, 350 + processSteps.length * 520));
}

analyseButton.addEventListener("click", runAnalysis);
resetButton.addEventListener("click", resetDemo);
newRunButton.addEventListener("click", resetDemo);
approveButton.addEventListener("click", () => {
  matchResult.hidden = true;
  approvedResult.hidden = false;
  analysisState.textContent = "Expert approved";
});

const starterMaterials = [
  ["BRG-1023", "Deep groove ball bearing 6205 ZZ", "Mechanical", "NOS", "ONGC"],
  ["PWR-CBL-8402", "XLPE power cable, 3 core × 185 sq mm", "Electrical", "MTR", "NTPC"],
  ["STL-VLV-2198", "Gate valve, carbon steel, 150 mm", "Pipeline", "EA", "SAIL"],
  ["GAIL-FLG-3301", "Weld neck flange, class 300, 4 inch", "Pipeline", "NOS", "GAIL"],
  ["BHEL-MTR-7114", "Three-phase induction motor, 15 kW", "Electrical", "EA", "BHEL"],
  ["CIL-BLT-4287", "Conveyor belt, EP 500/3, 1200 mm", "Maintenance", "MTR", "Coal India"],
  ["ONGC-GSK-0029", "Gasket, spiral wound, SS316, 6 inch", "Pipeline", "NOS", "ONGC"],
  ["NTPC-CTR-6621", "Contactor, 3 pole, 32 A, 415 V", "Electrical", "EA", "NTPC"],
  ["SAIL-ELC-1806", "Welding electrode, E7018, 4 mm", "Maintenance", "KG", "SAIL"],
  ["GAIL-INS-4973", "Pressure transmitter, 0–16 bar", "Instrumentation", "EA", "GAIL"],
  ["BHEL-PMP-9008", "Centrifugal pump mechanical seal kit", "Mechanical", "SET", "BHEL"],
  ["CIL-SFT-3175", "Safety helmet, industrial, white", "Safety", "NOS", "Coal India"],
  ["ONGC-FTG-5520", "Elbow fitting, 90 degree, 2 inch", "Pipeline", "NOS", "ONGC"],
  ["NTPC-REL-7409", "Numerical overcurrent relay", "Electrical", "EA", "NTPC"],
  ["SAIL-CHN-2891", "Roller chain, simplex, 1 inch pitch", "Mechanical", "MTR", "SAIL"],
  ["GAIL-VAL-6054", "Ball valve, SS316, 1 inch", "Pipeline", "EA", "GAIL"],
  ["BHEL-HTR-8210", "Cartridge heater, 2 kW, 230 V", "Electrical", "EA", "BHEL"],
  ["CIL-LMP-4532", "LED flood light, 150 W, IP66", "Electrical", "EA", "Coal India"],
  ["ONGC-FLT-9136", "Hydraulic oil filter element, 10 micron", "Maintenance", "EA", "ONGC"],
  ["NTPC-GLV-2674", "Nitrile safety gloves, size L", "Safety", "PAIR", "NTPC"],
].map(([code, name, category, uom, source]) => ({ code, name, category, uom, source }));

const materialGrid = document.getElementById("material-grid");
const materialForm = document.getElementById("material-form");
const materialSearch = document.getElementById("material-search");
const materialCount = document.getElementById("material-count");
const storageKey = "koshagar-management-materials";

function safeText(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function getAddedMaterials() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

let uploadedMaterials = getAddedMaterials();

function renderMaterials(query = "") {
  const allMaterials = [...uploadedMaterials, ...starterMaterials];
  const term = query.trim().toLowerCase();
  const displayed = allMaterials.filter((material) => `${material.code} ${material.name} ${material.category} ${material.source}`.toLowerCase().includes(term));
  materialCount.textContent = `${allMaterials.length} record${allMaterials.length === 1 ? "" : "s"} in local catalogue`;
  materialGrid.innerHTML = displayed.length ? displayed.map((material) => `
    <article class="material-card">
      <span class="material-mark">${safeText(material.category.slice(0, 3).toUpperCase())}</span>
      <div class="material-details"><strong>${safeText(material.code)}</strong><p title="${safeText(material.name)}">${safeText(material.name)}</p><div class="material-meta"><span>${safeText(material.source)} · ${safeText(material.uom)}</span><span>Queued</span></div></div>
    </article>`).join("") : '<p class="empty-materials">No material records match that search.</p>';
}

materialForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(materialForm);
  const material = Object.fromEntries(formData.entries());
  material.code = material.code.trim().toUpperCase();
  material.name = material.name.trim();
  if (!material.code || !material.name) return;
  uploadedMaterials.unshift(material);
  localStorage.setItem(storageKey, JSON.stringify(uploadedMaterials));
  materialForm.reset();
  materialSearch.value = "";
  renderMaterials();
  materialGrid.firstElementChild?.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

materialSearch.addEventListener("input", () => renderMaterials(materialSearch.value));
renderMaterials();

if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
}
