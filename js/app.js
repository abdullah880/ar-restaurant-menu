/**
 * AR Restaurant Menu — Main Application
 * Handles URL routing, model loading, AR integration, and UI state.
 */
(function () {
  "use strict";

  // =========================================================================
  // DOM References
  // =========================================================================
  const $ = (id) => document.getElementById(id);
  const loadingScreen = $("loadingScreen");
  const errorScreen = $("errorScreen");
  const app = $("app");
  const modelViewer = $("modelViewer");
  const dishTitle = $("dishTitle");
  const dishDescription = $("dishDescription");
  const dishBadge = $("dishBadge");
  const pageTitle = $("pageTitle");
  const arButton = $("arButton");
  const shareBtn = $("shareBtn");
  const resetViewBtn = $("resetViewBtn");
  const fullscreenBtn = $("fullscreenBtn");
  const interactionHint = $("interactionHint");
  const toast = $("toast");
  const year = $("year");

  // =========================================================================
  // State
  // =========================================================================
  let currentDish = null;

  // =========================================================================
  // Utilities
  // =========================================================================
  const getQueryParam = (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  };

  const sanitizeDishId = (id) => {
    if (!id) return null;
    return String(id)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "");
  };

  const showToast = (message, duration = 2500) => {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), duration);
  };

  const trackEvent = (eventName, data = {}) => {
    // Analytics hook — integrate with GA4, Segment, etc.
    if (window.gtag) {
      window.gtag("event", eventName, data);
    }
    console.debug("[Analytics]", eventName, data);
  };

  // =========================================================================
  // UI State Management
  // =========================================================================
  const showLoading = () => {
    loadingScreen.classList.remove("hidden");
    errorScreen.classList.add("hidden");
    app.classList.add("hidden");
  };

  const showError = () => {
    loadingScreen.classList.add("hidden");
    errorScreen.classList.remove("hidden");
    app.classList.add("hidden");
    document.title = "Dish Not Found — AR Restaurant";
  };

  const showApp = () => {
    loadingScreen.classList.add("hidden");
    errorScreen.classList.add("hidden");
    app.classList.remove("hidden");
  };

  // =========================================================================
  // Model Loading
  // =========================================================================
  const loadDish = (dish) => {
    currentDish = dish;

    // Update page metadata
    document.title = `${dish.name} — AR Restaurant`;
    pageTitle.textContent = dish.name;
    dishTitle.textContent = dish.name;
    dishDescription.textContent = dish.description;
    dishBadge.textContent = dish.badge || "Featured";

    // Update meta info
    const priceEl = $("metaPrice");
    const timeEl = $("metaTime");
    const calEl = $("metaCalories");
    if (priceEl)
      priceEl.querySelector(".meta-value").textContent = dish.price || "—";
    if (timeEl)
      timeEl.querySelector(".meta-value").textContent = dish.prepTime || "—";
    if (calEl)
      calEl.querySelector(".meta-value").textContent = dish.calories || "—";

    // Update Open Graph dynamically
    updateOpenGraph(dish);

    // Update structured data
    updateStructuredData(dish);

    // Configure model-viewer
    modelViewer.setAttribute("src", dish.model);
    modelViewer.setAttribute("alt", `3D view of ${dish.name}`);
    if (dish.poster) modelViewer.setAttribute("poster", dish.poster);

    // Event listeners for model lifecycle
    modelViewer.addEventListener("load", onModelLoaded, { once: true });
    modelViewer.addEventListener("error", onModelError, { once: true });

    showApp();
    trackEvent("dish_view", { dish_id: dish.id, dish_name: dish.name });
  };

  const onModelLoaded = () => {
    loadingScreen.classList.add("hidden");
    // Hide interaction hint after a few seconds
    setTimeout(() => {
      if (interactionHint) interactionHint.classList.add("fade-out");
    }, 4000);
    trackEvent("model_loaded", { dish_id: currentDish.id });
  };

  const onModelError = (e) => {
    console.error("Model load error:", e);
    showToast("Unable to load 3D model. Please try again.");
    trackEvent("model_error", { dish_id: currentDish.id });
  };

  // =========================================================================
  // SEO / Metadata
  // =========================================================================
  const updateOpenGraph = (dish) => {
    const setMeta = (property, content) => {
      const el =
        document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);
      if (el) el.setAttribute("content", content);
    };
    setMeta("og:title", `${dish.name} — AR Restaurant Menu`);
    setMeta("og:description", dish.description);
    setMeta("twitter:title", `${dish.name} — AR Restaurant Menu`);
    setMeta("twitter:description", dish.description);
  };

  const updateStructuredData = (dish) => {
    const script = $("structuredData");
    if (!script) return;
    const data = {
      "@context": "https://schema.org",
      "@type": "MenuItem",
      name: dish.name,
      description: dish.description,
      offers: {
        "@type": "Offer",
        price: (dish.price || "").replace(/[^0-9.]/g, ""),
        priceCurrency: "USD",
      },
      image: dish.poster || "",
    };
    script.textContent = JSON.stringify(data);
  };

  // =========================================================================
  // AR Integration
  // =========================================================================
  const activateAR = () => {
    if (!modelViewer.canActivateAR) {
      showToast("AR is not supported on this device");
      trackEvent("ar_unsupported", { dish_id: currentDish.id });
      return;
    }
    modelViewer.activateAR();
    trackEvent("ar_activate", { dish_id: currentDish.id });
  };

  // =========================================================================
  // Share
  // =========================================================================
  const shareDish = async () => {
    if (!currentDish) return;
    const url = window.location.href;
    const shareData = {
      title: currentDish.name,
      text: `Check out ${currentDish.name} in AR!`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        trackEvent("share", { method: "native", dish_id: currentDish.id });
      } catch (err) {
        if (err.name !== "AbortError") fallbackCopy(url);
      }
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Link copied to clipboard");
      trackEvent("share", { method: "clipboard" });
    } catch {
      showToast("Unable to share");
    }
  };

  // =========================================================================
  // View Controls
  // =========================================================================
  const resetView = () => {
    if (
      modelViewer &&
      typeof modelViewer.resetTurntableRotation === "function"
    ) {
      modelViewer.resetTurntableRotation();
    }
    if (modelViewer && typeof modelViewer.cameraOrbit === "string") {
      modelViewer.cameraOrbit = "0deg 75deg 105%";
    }
    modelViewer.dispatchEvent(new CustomEvent("reset-view"));
    showToast("View reset");
    trackEvent("reset_view", { dish_id: currentDish.id });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      (
        modelViewer.requestFullscreen || modelViewer.webkitRequestFullscreen
      )?.call(modelViewer);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(
        document,
      );
    }
    trackEvent("fullscreen_toggle", { dish_id: currentDish.id });
  };

  // =========================================================================
  // Initialization
  // =========================================================================
  const init = () => {
    // Set current year
    if (year) year.textContent = new Date().getFullYear();

    // Read dish parameter
    const rawDishId = getQueryParam("dish");
    const dishId = sanitizeDishId(rawDishId);

    if (!dishId || !DISHES[dishId]) {
      showError();
      trackEvent("dish_not_found", { requested_id: rawDishId });
      return;
    }

    // Load the dish
    loadDish(DISHES[dishId]);

    // Bind events
    arButton.addEventListener("click", activateAR);
    shareBtn.addEventListener("click", shareDish);
    resetViewBtn.addEventListener("click", resetView);
    fullscreenBtn.addEventListener("click", toggleFullscreen);

    // Hide hint on first interaction
    const hideHint = () => {
      if (interactionHint) interactionHint.classList.add("fade-out");
      modelViewer.removeEventListener("camera-change", hideHint);
    };
    modelViewer.addEventListener("camera-change", hideHint);
  };

  // Boot
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
