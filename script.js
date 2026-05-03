const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#nav-links");
const topButton = document.querySelector("[data-to-top]");
const commerceDialog = document.querySelector("#commerce-dialog");
const commerceTitle = document.querySelector("#commerce-dialog-title");
const commercePrice = document.querySelector("#commerce-dialog-price");
const commerceMode = document.querySelector("#commerce-dialog-mode");
const commerceNote = document.querySelector("#commerce-dialog-note");
const copyCommerce = document.querySelector("[data-copy-commerce]");

let commerceSummary = "";

if (toggle && navLinks) {
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navLinks.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll("[data-view-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-view-tab");

    document.querySelectorAll("[data-view-tab]").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    document.querySelectorAll("[data-view-panel]").forEach((panel) => {
      panel.hidden = panel.getAttribute("data-view-panel") !== target;
    });
  });
});

document.querySelectorAll("[data-commerce-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const product = button.getAttribute("data-product") || "Prototype product";
    const price = button.getAttribute("data-price") || "Price to confirm";
    const mode = button.getAttribute("data-mode") || "Payment Link";
    const note = button.getAttribute("data-note") || "Confirm details before going live.";

    commerceSummary = `${product} | ${price} | ${mode} | ${note}`;

    if (commerceTitle) commerceTitle.textContent = product;
    if (commercePrice) commercePrice.textContent = price;
    if (commerceMode) commerceMode.textContent = `Recommended Stripe path: ${mode}.`;
    if (commerceNote) commerceNote.textContent = note;

    if (commerceDialog instanceof HTMLDialogElement) {
      commerceDialog.showModal();
    }
  });
});

if (commerceDialog instanceof HTMLDialogElement) {
  commerceDialog.addEventListener("click", (event) => {
    if (event.target === commerceDialog) {
      commerceDialog.close();
    }
  });
}

if (copyCommerce) {
  copyCommerce.addEventListener("click", async () => {
    if (!commerceSummary) return;

    try {
      await navigator.clipboard.writeText(commerceSummary);
      copyCommerce.textContent = "Copied";
      window.setTimeout(() => {
        copyCommerce.textContent = "Copy setup note";
      }, 1600);
    } catch {
      copyCommerce.textContent = "Copy failed";
    }
  });
}

if (topButton) {
  const updateTopButton = () => {
    topButton.classList.toggle("is-visible", window.scrollY > 560);
  };

  updateTopButton();
  window.addEventListener("scroll", updateTopButton, { passive: true });
  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const fallbackFieldData = {
  generatedAtLabel: "Sample payload",
  event: { name: "Field operations board" },
  score: { value: "--", label: "Planning signal" },
  story: {
    headline: "The board is ready for incoming data",
    summary: "A separate agent or cron job can update the JSON payload.",
    longform: "The display layer converts latest field data into committee-friendly visual blocks."
  },
  tide: { state: "Tide pending", detail: "Waiting for latest payload." },
  weather: { headline: "Weather pending", detail: "Waiting for latest payload." },
  team: {
    headline: "Team pending",
    detail: "Waiting for latest payload.",
    checkedIn: "0",
    sharing: "0",
    expiry: "Event end",
    visibility: "Private"
  },
  media: {
    headline: "Media pending",
    detail: "Waiting for latest payload.",
    featureTitle: "Story bundle pending",
    featureBody: "Uploads can become public wrap-ups, committee records or grant-ready evidence."
  },
  solunarCalendar: [],
  tideCurve: [],
  weatherVisuals: [],
  windows: [],
  monitors: [],
  mediaItems: [],
  mapLayers: []
};

function getFieldValue(data, path) {
  return path.split(".").reduce((value, key) => {
    if (value && Object.prototype.hasOwnProperty.call(value, key)) {
      return value[key];
    }
    return undefined;
  }, data);
}

function renderSimpleCards(target, items, className) {
  if (!target) return;
  target.replaceChildren();

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = className;
    if (item.tone || item.rating || item.type) {
      card.dataset.tone = item.tone || item.rating || item.type;
    }

    const label = document.createElement("p");
    label.className = "category";
    label.textContent = item.time ? `${item.time} | ${item.type || "window"}` : item.label || "Item";

    const title = document.createElement("h3");
    title.textContent = item.time ? item.label : item.value || item.label || "Pending";

    const detail = document.createElement("p");
    detail.textContent = item.detail || item.rating || "Ready for latest data.";

    card.append(label, title, detail);
    target.appendChild(card);
  });
}

function renderSolunarCalendar(target, days) {
  if (!target) return;
  target.replaceChildren();

  days.forEach((day) => {
    const card = document.createElement("article");
    card.className = "solunar-day";
    card.dataset.tone = String(day.weatherTone || "neutral").toLowerCase();

    const moonPercent = Math.max(0, Math.min(100, Number(day.moonPercent) || 0));
    const rating = Math.max(0, Math.min(5, Number(day.rating) || 0));

    const head = document.createElement("div");
    head.className = "solunar-day-head";

    const date = document.createElement("div");
    const dayLabel = document.createElement("strong");
    dayLabel.textContent = day.day || "Day";
    const dateLabel = document.createElement("span");
    dateLabel.textContent = day.date || "Date";
    date.append(dayLabel, dateLabel);

    const moon = document.createElement("div");
    moon.className = "moon-disc";
    moon.style.background = `linear-gradient(90deg, #fff9d8 ${moonPercent}%, rgba(7, 68, 95, 0.2) ${moonPercent}%)`;
    moon.setAttribute("aria-label", `${day.moonPhase || "Moon phase"} ${moonPercent}%`);

    head.append(date, moon);

    const phase = document.createElement("p");
    phase.className = "moon-phase";
    phase.textContent = day.moonPhase || "Moon phase pending";

    const stars = document.createElement("div");
    stars.className = "bite-rating";
    stars.setAttribute("aria-label", `Solunar rating ${rating} out of 5`);
    for (let index = 1; index <= 5; index += 1) {
      const dot = document.createElement("span");
      dot.className = index <= rating ? "is-filled" : "";
      stars.appendChild(dot);
    }

    const meta = document.createElement("dl");
    meta.className = "solunar-meta";
    [
      ["Major", day.majorWindow],
      ["Minor", day.minorWindow],
      ["High", day.highTide],
      ["Low", day.lowTide],
      ["Tide", day.tideState]
    ].forEach(([label, value]) => {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value || "Pending";
      meta.append(dt, dd);
    });

    card.append(head, phase, stars, meta);
    target.appendChild(card);
  });
}

function renderTideCurve(target, points) {
  if (!target) return;
  target.replaceChildren();

  const maxHeight = Math.max(...points.map((point) => Number(point.height) || 0), 1);
  points.forEach((point) => {
    const item = document.createElement("article");
    item.className = "tide-point";
    const height = Number(point.height) || 0;
    const percent = Math.max(8, Math.round((height / maxHeight) * 100));

    const bar = document.createElement("div");
    bar.className = "tide-bar";
    bar.style.height = `${percent}%`;

    const value = document.createElement("strong");
    value.textContent = `${height.toFixed(1)} m`;

    const time = document.createElement("span");
    time.textContent = point.time || "--";

    const label = document.createElement("p");
    label.textContent = point.label || "Tide point";

    item.append(bar, value, time, label);
    target.appendChild(item);
  });
}

function renderWeatherVisuals(target, items) {
  if (!target) return;
  target.replaceChildren();

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "weather-gauge";
    card.dataset.tone = item.tone || "neutral";

    const value = Number(item.value) || 0;
    const max = Math.max(Number(item.max) || 1, value, 1);
    const percent = Math.max(0, Math.min(100, Math.round((value / max) * 100)));

    const label = document.createElement("p");
    label.className = "category";
    label.textContent = item.label || "Monitor";

    const readout = document.createElement("h3");
    readout.textContent = `${item.value ?? "--"} ${item.unit || ""}`.trim();

    const meter = document.createElement("div");
    meter.className = "weather-meter";
    const fill = document.createElement("span");
    fill.style.width = `${percent}%`;
    meter.appendChild(fill);

    const detail = document.createElement("p");
    detail.textContent = item.detail || "Latest supplied point.";

    card.append(label, readout, meter, detail);
    target.appendChild(card);
  });
}

function renderFieldData(data) {
  document.querySelectorAll("[data-field]").forEach((node) => {
    const path = node.getAttribute("data-field");
    const value = path ? getFieldValue(data, path) : undefined;
    if (value !== undefined && value !== null) {
      node.textContent = String(value);
    }
  });

  renderSimpleCards(document.querySelector("[data-window-list]"), data.windows || [], "window-card");
  renderSimpleCards(document.querySelector("[data-monitor-list]"), data.monitors || [], "monitor-card");
  renderSimpleCards(document.querySelector("[data-media-list]"), data.mediaItems || [], "media-card");
  renderSimpleCards(document.querySelector("[data-map-list]"), data.mapLayers || [], "map-card");
  renderSolunarCalendar(document.querySelector("[data-solunar-calendar]"), data.solunarCalendar || []);
  renderTideCurve(document.querySelector("[data-tide-curve]"), data.tideCurve || []);
  renderWeatherVisuals(document.querySelector("[data-weather-visuals]"), data.weatherVisuals || []);
}

async function loadFieldData() {
  if (!document.querySelector("[data-field], [data-window-list], [data-monitor-list]")) {
    return;
  }

  try {
    const response = await fetch("data/latest-field-data.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Field data unavailable");
    renderFieldData(await response.json());
  } catch {
    renderFieldData(fallbackFieldData);
  }
}

loadFieldData();
