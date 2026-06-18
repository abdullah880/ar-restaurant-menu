/**
 * app.js — AR Restaurant Menu · Main Application
 *
 * Responsibilities:
 *   - URL routing (dish= query param)
 *   - Model loading with poster, timeout, and error recovery
 *   - UI state management (loading / app / error screens)
 *   - AR activation with iOS-capability check
 *   - Share API with clipboard fallback
 *   - Analytics event dispatch
 *   - View controls (reset, fullscreen)
 */

import {DISHES} from "./dishes.js";

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

/** Canonical origin used for share URLs — update before deploying. */
const CANONICAL_BASE = "https://yourrestaurant.com";

/** Max dish ID length to guard against oversized query params. */
const DISH_ID_MAX_LEN = 64;

/** ms before a slow-loading model triggers a fallback notice. */
const MODEL_LOAD_TIMEOUT_MS = 10_000;

/** ms the interaction hint stays visible after load. */
const HINT_DISMISS_DELAY_MS = 4_000;

// ─────────────────────────────────────────────────────────────────────────────
// DOM References  (resolved once, referenced everywhere)
// ─────────────────────────────────────────────────────────────────────────────

const el = (id) => document.getElementById(id);

const dom = {
  loadingScreen: el("loadingScreen"),
  errorScreen: el("errorScreen"),
  app: el("app"),
  modelViewer: el("modelViewer"),
  dishTitle: el("dishTitle"),
  dishDesc: el("dishDescription"),
  dishBadge: el("dishBadge"),
  pageTitle: el("pageTitle"),
  arButton: el("arButton"),
  shareBtn: el("shareBtn"),
  resetViewBtn: el("resetViewBtn"),
  fullscreenBtn: el("fullscreenBtn"),
  hint: el("interactionHint"),
  toast: el("toast"),
  year: el("year"),
  metaPrice: el("metaPrice"),
  metaTime: el("metaTime"),
  metaCalories: el("metaCalories"),
  structuredData: el("structuredData"),
};

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────

/** @type {import("./prev-dishes.js").Dish | null} */
let currentDish = null;

/** @type {ReturnType<typeof setTimeout> | null} */
let modelLoadTimer = null;

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Read a single query-string parameter from the current URL.
 * @param {string} key
 * @returns {string | null}
 */
const getParam = (key) => new URLSearchParams(window.location.search).get(key);

/**
 * Sanitize a raw dish ID: lowercase, strip non-alphanumeric chars, enforce max length.
 * @param {string | null} raw
 * @returns {string | null}
 */
const sanitizeDishId = (raw) => {
  if (!raw) return null;
  const clean = String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "");
  return clean.length > 0 && clean.length <= DISH_ID_MAX_LEN ? clean : null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────────────────────────────────────

let toastTimer = null;

/**
 * Show a temporary status message at the bottom of the screen.
 * @param {string} message
 * @param {number} [duration=2500]
 */
const showToast = (message, duration = 2500) => {
  dom.toast.textContent = message;
  dom.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove("show"), duration);
};

// ─────────────────────────────────────────────────────────────────────────────
// Analytics
// ─────────────────────────────────────────────────────────────────────────────

/** Queued events fired before GA4 script is ready. */
const _eventQueue = [];

/**
 * Fire an analytics event. Queues silently if window.gtag is not yet available.
 * @param {string} name
 * @param {Record<string, unknown>} [data]
 */
const track = (name, data = {}) => {
  if (typeof window.gtag === "function") {
    // Drain any queued events first
    while (_eventQueue.length) {
      const {n, d} = _eventQueue.shift();
      window.gtag("event", n, d);
    }
    window.gtag("event", name, data);
  } else {
    _eventQueue.push({n: name, d: data});
  }
  console.debug("[Analytics]", name, data);
};

// ─────────────────────────────────────────────────────────────────────────────
// UI State
// ─────────────────────────────────────────────────────────────────────────────

const showLoading = () => {
  dom.loadingScreen.classList.remove("hidden");
  dom.errorScreen.classList.add("hidden");
  dom.app.classList.add("hidden");
};

const showApp = () => {
  dom.loadingScreen.classList.add("hidden");
  dom.errorScreen.classList.add("hidden");
  dom.app.classList.remove("hidden");
};

const showError = () => {
  dom.loadingScreen.classList.add("hidden");
  dom.errorScreen.classList.remove("hidden");
  dom.app.classList.add("hidden");
  document.title = "Dish Not Found — AR Restaurant";
};

// ─────────────────────────────────────────────────────────────────────────────
// SEO / Metadata
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Set a <meta> tag content by property or name attribute.
 * @param {string} key
 * @param {string} value
 */
const setMeta = (key, value) => {
  const el =
    document.querySelector(`meta[property="${key}"]`) ||
    document.querySelector(`meta[name="${key}"]`);
  if (el) el.setAttribute("content", value);
};

/** @param {import("./prev-dishes.js").Dish} dish */
const updateOpenGraph = (dish) => {
  const title = `${dish.name} — AR Restaurant Menu`;
  setMeta("og:title", title);
  setMeta("og:description", dish.description);
  setMeta("twitter:title", title);
  setMeta("twitter:description", dish.description);
};

/** @param {import("./prev-dishes.js").Dish} dish */
const updateStructuredData = (dish) => {
  if (!dom.structuredData) return;
  const rawPrice = (dish.price ?? "").replace(/[^0-9.]/g, "");
  dom.structuredData.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: dish.poster ?? "",
    offers: {
      "@type": "Offer",
      price: rawPrice,
      priceCurrency: "USD",
    },
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Model Preload Hint
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Insert a <link rel="preload"> so the browser starts fetching the .glb
 * as early as possible — before model-viewer even initialises.
 * @param {string} url
 */
const preloadModel = (url) => {
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "fetch";
  link.href = url;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
};

// ─────────────────────────────────────────────────────────────────────────────
// Dish Loading
// ─────────────────────────────────────────────────────────────────────────────

/** @param {import("./prev-dishes.js").Dish} dish */
const loadDish = (dish) => {
  currentDish = dish;

  // Page metadata
  const pageTitle = `${dish.name} — AR Restaurant`;
  document.title = pageTitle;
  dom.pageTitle.textContent = dish.name;
  dom.dishTitle.textContent = dish.name;
  dom.dishDesc.textContent = dish.description;
  dom.dishBadge.textContent = dish.badge ?? "Featured";

  // Meta info grid
  const setValue = (container, value) => {
    container?.querySelector(".meta-value")?.textContent != null &&
      (container.querySelector(".meta-value").textContent = value ?? "—");
  };
  setValue(dom.metaPrice, dish.price);
  setValue(dom.metaTime, dish.prepTime);
  setValue(dom.metaCalories, dish.calories);

  // SEO
  updateOpenGraph(dish);
  updateStructuredData(dish);

  // Preload the model asset
  preloadModel(dish.model);

  // Configure model-viewer
  const mv = dom.modelViewer;
  mv.setAttribute("src", dish.model);
  mv.setAttribute("alt", `3D view of ${dish.name}`);
  if (dish.poster) mv.setAttribute("poster", dish.poster);
  if (dish.iosSrc) mv.setAttribute("ios-src", dish.iosSrc);
  if (dish.cameraOrbit) mv.setAttribute("camera-orbit", dish.cameraOrbit);

  // Model lifecycle
  mv.addEventListener("load", onModelLoaded, {once: true});
  mv.addEventListener("error", onModelError, {once: true});

  // Slow-load timeout
  modelLoadTimer = setTimeout(() => {
    showToast("Taking longer than expected…", 4000);
    track("model_slow", {dish_id: dish.id});
  }, MODEL_LOAD_TIMEOUT_MS);

  showApp();
  track("dish_view", {dish_id: dish.id, dish_name: dish.name});
};

const onModelLoaded = () => {
  clearTimeout(modelLoadTimer);
  dom.loadingScreen.classList.add("hidden");
  setTimeout(dismissHint, HINT_DISMISS_DELAY_MS);
  track("model_loaded", {dish_id: currentDish.id});
};

const onModelError = () => {
  clearTimeout(modelLoadTimer);
  console.error("[AR Menu] Failed to load model for:", currentDish?.id);
  showToast("Couldn't load 3D model. Showing preview instead.");
  // Fallback: show the poster if available so there's something visible
  if (currentDish?.poster) {
    dom.modelViewer.setAttribute("poster", currentDish.poster);
  }
  track("model_error", {dish_id: currentDish?.id});
};

// ─────────────────────────────────────────────────────────────────────────────
// Interaction Hint
// ─────────────────────────────────────────────────────────────────────────────

const dismissHint = () => dom.hint?.classList.add("fade-out");

// ─────────────────────────────────────────────────────────────────────────────
// AR
// ─────────────────────────────────────────────────────────────────────────────

const activateAR = () => {
  if (!dom.modelViewer.canActivateAR) {
    showToast("AR is not supported on this device");
    track("ar_unsupported", {dish_id: currentDish?.id});
    return;
  }
  dom.modelViewer.activateAR();
  track("ar_activate", {dish_id: currentDish?.id});
};

// ─────────────────────────────────────────────────────────────────────────────
// Share
// ─────────────────────────────────────────────────────────────────────────────

const buildShareUrl = () =>
  currentDish
    ? `${CANONICAL_BASE}?dish=${currentDish.id}`
    : window.location.href;

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Link copied to clipboard");
    track("share", {method: "clipboard", dish_id: currentDish?.id});
  } catch {
    showToast("Unable to share");
  }
};

const shareDish = async () => {
  if (!currentDish) return;
  const url = buildShareUrl();

  if (navigator.share) {
    try {
      await navigator.share({
        title: currentDish.name,
        text: `Check out ${currentDish.name} in AR!`,
        url,
      });
      track("share", {method: "native", dish_id: currentDish.id});
      return;
    } catch (err) {
      if (err.name === "AbortError") return; // user cancelled — do nothing
    }
  }
  copyToClipboard(url);
};

// ─────────────────────────────────────────────────────────────────────────────
// View Controls
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_ORBIT = "0deg 75deg 105%";

const resetView = () => {
  const mv = dom.modelViewer;
  mv.resetTurntableRotation?.();
  mv.cameraOrbit = currentDish?.cameraOrbit ?? DEFAULT_ORBIT;
  showToast("View reset");
  track("reset_view", {dish_id: currentDish?.id});
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    (
      dom.modelViewer.requestFullscreen ??
      dom.modelViewer.webkitRequestFullscreen
    )?.call(dom.modelViewer);
  } else {
    (document.exitFullscreen ?? document.webkitExitFullscreen)?.call(document);
  }
  track("fullscreen_toggle", {dish_id: currentDish?.id});
};

// ─────────────────────────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────────────────────────

const init = () => {
  // Footer year
  if (dom.year) dom.year.textContent = new Date().getFullYear();

  // Resolve dish from URL
  const dishId = sanitizeDishId(getParam("dish"));
  const dish = dishId ? DISHES[dishId] : null;

  if (!dish) {
    showError();
    track("dish_not_found", {requested_id: getParam("dish")});
    return;
  }

  loadDish(dish);

  // Event bindings
  dom.arButton.addEventListener("click", activateAR);
  dom.shareBtn.addEventListener("click", shareDish);
  dom.resetViewBtn.addEventListener("click", resetView);
  dom.fullscreenBtn.addEventListener("click", toggleFullscreen);

  // Dismiss hint on first 3D interaction
  const onFirstInteraction = () => {
    dismissHint();
    dom.modelViewer.removeEventListener("camera-change", onFirstInteraction);
  };
  dom.modelViewer.addEventListener("camera-change", onFirstInteraction);
};

// ─────────────────────────────────────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────────────────────────────────────

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
