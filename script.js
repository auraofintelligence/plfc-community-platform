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
  mapLocations: [],
  loggedRoutes: [],
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

function locationDetailMarkup(location) {
  if (!location) {
    return `
      <p class="eyebrow">Selected public point</p>
      <h3>Choose a map point</h3>
      <p>Select a PLFC public placemark to open it in the Google map and attach field story context.</p>
    `;
  }

  const mapsUrl = location.lat && location.lng
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${location.lat},${location.lng}`)}`
    : "";

  return `
    <p class="eyebrow">${location.type || "Public map point"}</p>
    <h3>${location.label || "Selected point"}</h3>
    <p>${location.latest || "Latest summary pending."}</p>
    <dl class="location-meta">
      <dt>Area</dt><dd>${location.zone || "Public access point"}</dd>
      <dt>Team</dt><dd>${location.team || "Pending"}</dd>
      <dt>Media</dt><dd>${location.media || "Pending"}</dd>
      <dt>Privacy</dt><dd>${location.privacy || "Permission pending"}</dd>
      <dt>Skill feed</dt><dd>${location.agentSkill || "Agent feed pending"}</dd>
    </dl>
    <p class="permission-note">${location.permission || "Do not publish sensitive location details without permission."}</p>
    <p>${location.story || ""}</p>
    ${mapsUrl ? `<a class="map-open-link" href="${mapsUrl}" target="_blank" rel="noopener">Open in Google Maps</a>` : ""}
  `;
}

function googleMapEmbedUrl(location) {
  if (!location || !location.lat || !location.lng) {
    return "https://www.google.com/maps?q=Point%20Lookout%20Queensland&z=11&output=embed";
  }

  return `https://www.google.com/maps?q=${encodeURIComponent(`${location.lat},${location.lng} (${location.label || "PLFC map point"})`)}&z=${location.zoom || 14}&output=embed`;
}

function selectLocation(location, mapTarget, listTarget, detailTarget, frameTarget) {
  if (!location || !detailTarget) return;

  detailTarget.innerHTML = locationDetailMarkup(location);
  if (frameTarget) {
    frameTarget.src = googleMapEmbedUrl(location);
    frameTarget.title = `Google map showing ${location.label || "selected PLFC point"}`;
  }

  [listTarget].forEach((target) => {
    if (!target) return;
    target.querySelectorAll("[data-location-id]").forEach((node) => {
      node.classList.toggle("is-selected", node.getAttribute("data-location-id") === location.id);
    });
  });
}

function renderMapLocations(data) {
  const mapFrame = document.querySelector("[data-google-map-frame]");
  const listTarget = document.querySelector("[data-location-list]");
  const detailTarget = document.querySelector("[data-location-detail]");
  const sourceName = document.querySelector("[data-map-source-name]");
  const sourceDetail = document.querySelector("[data-map-source-detail]");
  const locations = data.mapLocations || [];

  if (!mapFrame || !listTarget || !detailTarget) return;

  listTarget.replaceChildren();
  if (sourceName) sourceName.textContent = data.mapSource?.name || "PLFC Point Lookout Fishing Club";
  if (sourceDetail) sourceDetail.textContent = data.mapSource?.detail || "Public placemarks extracted from the supplied KMZ.";

  locations.forEach((location, index) => {
    const card = document.createElement("button");
    card.className = "location-choice";
    card.type = "button";
    card.dataset.locationId = location.id || `location-${index}`;
    card.innerHTML = `
      <span>${location.type || "Zone"}</span>
      <strong>${location.label || "Location"}</strong>
      <small>${location.privacy || "Privacy pending"}</small>
    `;

    card.addEventListener("click", () => selectLocation(location, null, listTarget, detailTarget, mapFrame));

    listTarget.appendChild(card);
  });

  selectLocation(locations[0], null, listTarget, detailTarget, mapFrame);
}

function renderRoutes(target, routes) {
  if (!target) return;
  target.replaceChildren();

  routes.forEach((route) => {
    const card = document.createElement("article");
    card.className = "route-card";
    card.innerHTML = `
      <p class="category">${route.visibility || "Route visibility"}</p>
      <h3>${route.label || "Logged route"}</h3>
      <p>${route.zones || "Broad zones pending."}</p>
      <dl class="location-meta">
        <dt>Consent</dt><dd>${route.consent || "Pending"}</dd>
        <dt>Media</dt><dd>${route.media || "Pending"}</dd>
      </dl>
      <p>${route.story || ""}</p>
    `;
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
  renderMapLocations(data);
  renderRoutes(document.querySelector("[data-route-list]"), data.loggedRoutes || []);
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

function renderHonourBoard(data) {
  document.querySelectorAll("[data-honour]").forEach((node) => {
    const path = node.getAttribute("data-honour");
    const value = path ? getFieldValue(data, path) : undefined;
    if (value !== undefined && value !== null) {
      node.textContent = String(value);
    }
  });

  const legend = document.querySelector("[data-honour-map-legend]");
  if (legend) {
    legend.replaceChildren(...(data.map?.legend || []).map((item) => {
      const pill = document.createElement("span");
      pill.textContent = item;
      return pill;
    }));
  }

  const summary = document.querySelector("[data-honour-summary]");
  if (summary) {
    summary.replaceChildren(...(data.catchLedger?.summary || []).map((item) => {
      const card = document.createElement("article");
      card.innerHTML = `
        <span>${item.label || "Metric"}</span>
        <strong>${item.value || "--"}</strong>
        <p>${item.detail || ""}</p>
      `;
      return card;
    }));
  }

  const species = document.querySelector("[data-honour-species]");
  if (species) {
    species.replaceChildren(...(data.catchLedger?.species || []).map((item) => {
      const row = document.createElement("div");
      row.className = "species-row";
      row.innerHTML = `<span>${item.name || "Species"}</span><strong>${item.records || 0}</strong>`;
      return row;
    }));
  }

  const results = document.querySelector("[data-honour-results]");
  if (results) {
    results.replaceChildren(...(data.catchLedger?.recentResults || []).map((item) => {
      const row = document.createElement("div");
      row.className = "result-row";
      row.innerHTML = `
        <span>${item.rank || ""}</span>
        <strong>${item.event || "Event"}</strong>
        <p>${item.team || ""}</p>
        <em>${item.points || ""}</em>
      `;
      return row;
    }));
  }

  const highlights = document.querySelector("[data-honour-highlights]");
  if (highlights) {
    highlights.replaceChildren(...(data.honours || []).map((item) => {
      const card = document.createElement("article");
      card.innerHTML = `
        <span>${item.title || "Honour"}</span>
        <strong>${item.name || ""}</strong>
        <p>${item.detail || ""}</p>
      `;
      return card;
    }));
  }

  const events = document.querySelector("[data-honour-events]");
  if (events) {
    events.replaceChildren(...(data.community?.events || []).map((item) => {
      const row = document.createElement("div");
      row.innerHTML = `<span>${item.date || ""}</span><p>${item.label || ""}</p>`;
      return row;
    }));
  }

  const notices = document.querySelector("[data-honour-notices]");
  if (notices) {
    notices.replaceChildren(...(data.community?.notices || []).map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }));
  }

  const bottom = document.querySelector("[data-honour-bottom]");
  if (bottom) {
    bottom.replaceChildren(...(data.bottomTiles || []).map((item) => {
      const tile = document.createElement("article");
      tile.dataset.tone = item.tone || "ocean";
      tile.innerHTML = `
        <span>${item.label || "Tile"}</span>
        <strong>${item.value || ""}</strong>
      `;
      return tile;
    }));
  }

  const ticker = document.querySelector("[data-honour-ticker]");
  if (ticker) {
    ticker.replaceChildren(...(data.ticker || []).map((item) => {
      const span = document.createElement("span");
      span.textContent = item;
      return span;
    }));
  }
}

async function loadHonourBoard() {
  if (!document.querySelector("[data-honour-board]")) {
    return;
  }

  try {
    const response = await fetch("data/example-honour-board-tv.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Honour board data unavailable");
    renderHonourBoard(await response.json());
  } catch (error) {
    console.error(error);
  }
}

loadFieldData();
loadHonourBoard();
