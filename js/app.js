
/* =========================================
   HANOON — Main Application
   Core Initialization & Global Utilities
========================================= */

(() => {
  "use strict";

  const HANOON = window.HANOON || {};

  /* =========================================
     APPLICATION CONFIGURATION
  ========================================= */

  HANOON.config = Object.freeze({
    name: "HANOON",
    arabicName: "هنون",
    version: "1.0.0",
    author: "يوسف أشرف",
    language: "ar",
    direction: "rtl",
    defaultTheme: "dark"
  });

  /* =========================================
     DOM UTILITIES
  ========================================= */

  HANOON.$ = (selector, parent = document) =>
    parent.querySelector(selector);

  HANOON.$$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  HANOON.createElement = (tag, options = {}) => {
    const element = document.createElement(tag);

    if (options.className) {
      element.className = options.className;
    }

    if (options.text !== undefined) {
      element.textContent = options.text;
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(
        ([name, value]) => {
          element.setAttribute(name, value);
        }
      );
    }

    return element;
  };

  /* =========================================
     SAFE STORAGE
  ========================================= */

  HANOON.storage = {
    get(key, fallback = null) {
      try {
        const value = localStorage.getItem(
          `hanoon_${key}`
        );

        return value === null
          ? fallback
          : value;
      } catch (error) {
        console.warn("HANOON storage read error:", error);
        return fallback;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(
          `hanoon_${key}`,
          String(value)
        );

        return true;
      } catch (error) {
        console.warn("HANOON storage write error:", error);
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(`hanoon_${key}`);
      } catch (error) {
        console.warn("HANOON storage remove error:", error);
      }
    }
  };

  /* =========================================
     DATE & TIME UTILITIES
  ========================================= */

  HANOON.utils = {
    formatDate(date = new Date()) {
      return new Intl.DateTimeFormat("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }).format(date);
    },

    formatNumber(number) {
      return new Intl.NumberFormat("ar-EG").format(
        Number(number) || 0
      );
    },

    truncate(text, maxLength = 120) {
      const value = String(text || "").trim();

      if (value.length <= maxLength) {
        return value;
      }

      return value.slice(0, maxLength).trim() + "...";
    },

    normalizeArabic(text) {
      return String(text || "")
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[أإآ]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه")
        .replace(/ـ/g, "")
        .replace(/[\u064B-\u065F\u0670]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    },

    generateId(prefix = "HN") {
      const random = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

      return `${prefix}-${random}`;
    },

    debounce(callback, delay = 300) {
      let timer;

      return (...args) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
          callback(...args);
        }, delay);
      };
    }
  };

  /* =========================================
     NOTIFICATION SYSTEM
  ========================================= */

  HANOON.toast = (message, type = "info", duration = 3500) => {
    const container =
      HANOON.$("#toastContainer") ||
      HANOON.$(".toast-container");

    if (!container) {
      console.info(`[HANOON ${type}]`, message);
      return;
    }

    const allowedTypes = [
      "success",
      "error",
      "warning",
      "info"
    ];

    const safeType = allowedTypes.includes(type)
      ? type
      : "info";

    const toast = HANOON.createElement("div", {
      className: `toast toast-${safeType}`,
      attributes: {
        role: "status",
        "aria-live": "polite"
      }
    });

    const text = HANOON.createElement("span", {
      className: "toast-message",
      text: message
    });

    const close = HANOON.createElement("button", {
      className: "toast-close",
      text: "×",
      attributes: {
        type: "button",
        "aria-label": "إغلاق التنبيه"
      }
    });

    close.addEventListener("click", () => {
      toast.remove();
    });

    toast.append(text, close);
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    if (duration > 0) {
      setTimeout(() => {
        toast.classList.remove("is-visible");

        setTimeout(() => toast.remove(), 250);
      }, duration);
    }
  };

  /* =========================================
     GLOBAL LOADING STATE
  ========================================= */

  HANOON.loading = {
    show(message = "جارٍ التحميل...") {
      let loader = HANOON.$("#globalLoader");

      if (!loader) {
        loader = HANOON.createElement("div", {
          className: "global-loader",
          attributes: {
            id: "globalLoader",
            role: "status",
            "aria-live": "polite"
          }
        });

        const spinner = HANOON.createElement("div", {
          className: "loader-spinner"
        });

        const text = HANOON.createElement("p", {
          className: "loader-message"
        });

        loader.append(spinner, text);
        document.body.appendChild(loader);
      }

      const text = loader.querySelector(".loader-message");

      if (text) {
        text.textContent = message;
      }

      loader.classList.add("is-visible");
      document.body.classList.add("loading-active");
    },

    hide() {
      const loader = HANOON.$("#globalLoader");

      if (loader) {
        loader.classList.remove("is-visible");
      }

      document.body.classList.remove("loading-active");
    }
  };

  /* =========================================
     FOOTER YEAR
  ========================================= */

  const updateCurrentYear = () => {
    const year = new Date().getFullYear();

    HANOON.$$("[data-current-year], #currentYear")
      .forEach((element) => {
        element.textContent = year;
      });
  };

  /* =========================================
     EXTERNAL LINKS SAFETY
  ========================================= */

  const secureExternalLinks = () => {
    HANOON.$$('a[target="_blank"]').forEach((link) => {
      const current = (
        link.getAttribute("rel") || ""
      ).split(/\s+/).filter(Boolean);

      if (!current.includes("noopener")) {
        current.push("noopener");
      }

      if (!current.includes("noreferrer")) {
        current.push("noreferrer");
      }

      link.setAttribute("rel", current.join(" "));
    });
  };

  /* =========================================
     BACK TO TOP
  ========================================= */

  const initializeBackToTop = () => {
    const button = HANOON.$("#backToTop");

    if (!button || button.dataset.initialized) return;

    button.dataset.initialized = "true";

    const updateVisibility = () => {
      button.classList.toggle(
        "is-visible",
        window.scrollY > 400
      );
    };

    button.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    window.addEventListener(
      "scroll",
      updateVisibility,
      { passive: true }
    );

    updateVisibility();
  };

  /* =========================================
     ACCESSIBILITY
  ========================================= */

  const initializeAccessibility = () => {
    document.documentElement.setAttribute(
      "lang",
      HANOON.config.language
    );

    document.documentElement.setAttribute(
      "dir",
      HANOON.config.direction
    );

    document.addEventListener("click", (event) => {
      const button = event.target.closest("button");

      if (!button) return;

      if (
        button.tagName === "BUTTON" &&
        !button.hasAttribute("type") &&
        !button.closest("form")
      ) {
        button.setAttribute("type", "button");
      }
    });
  };

  /* =========================================
     CUSTOM APPLICATION EVENTS
  ========================================= */

  HANOON.events = {
    emit(name, detail = {}) {
      document.dispatchEvent(
        new CustomEvent(`hanoon:${name}`, {
          detail
        })
      );
    },

    on(name, callback) {
      const eventName = `hanoon:${name}`;

      document.addEventListener(
        eventName,
        callback
      );

      return () => {
        document.removeEventListener(
          eventName,
          callback
        );
      };
    }
  };

  /* =========================================
     APPLICATION INITIALIZATION
  ========================================= */

  const initializeApp = () => {
    updateCurrentYear();
    secureExternalLinks();
    initializeBackToTop();
    initializeAccessibility();

    document.documentElement.classList.add(
      "hanoon-ready"
    );

    HANOON.events.emit("app-ready", {
      version: HANOON.config.version
    });

    console.info(
      `HANOON ${HANOON.config.version} initialized successfully.`
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeApp,
      { once: true }
    );
  } else {
    initializeApp();
  }

  /* =========================================
     GLOBAL APPLICATION INSTANCE
  ========================================= */

  window.HANOON = HANOON;

})();
