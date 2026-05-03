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
