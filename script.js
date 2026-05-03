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
