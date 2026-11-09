
(() => {
  "use strict";

  const HANOON = window.HANOON || {};

  HANOON.version = "1.0.0";
  HANOON.initialized = false;

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  // حفظ العناصر الأساسية
  HANOON.elements = {
    body: document.body,
    splash: $("#splash"),
    menuToggle: $(".menu-toggle"),
    navigation: $(".main-navigation"),
    searchPanel: $(".search-panel"),
    toastContainer: $(".toast-container")
  };

  // إشعارات الموقع
  HANOON.toast = function (message, type = "info", duration = 3500) {
    const container =
      HANOON.elements.toastContainer ||
      (() => {
        const element = document.createElement("div");
        element.className = "toast-container";
        document.body.appendChild(element);
        HANOON.elements.toastContainer = element;
        return element;
      })();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", "status");
    toast.textContent = String(message);

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    window.setTimeout(() => {
      toast.classList.remove("show");

      window.setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  };

  // شاشة البداية
  HANOON.initSplash = function () {
    const splash = HANOON.elements.splash;

    if (!splash) return;

    const startedAt = Date.now();
    const minimumDuration = 5000;

    const finishSplash = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, minimumDuration - elapsed);

      window.setTimeout(() => {
        splash.classList.add("splash-hidden");
        document.body.classList.remove("loading");

        window.setTimeout(() => {
          splash.remove();
        }, 700);
      }, remaining);
    };

    if (document.readyState === "complete") {
      finishSplash();
    } else {
      window.addEventListener("load", finishSplash, { once: true });
    }
  };

  // القائمة على الهاتف
  HANOON.initMobileMenu = function () {
    const button = HANOON.elements.menuToggle;
    const navigation = HANOON.elements.navigation;

    if (!button || !navigation) return;

    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("is-open");

      button.setAttribute("aria-expanded", String(isOpen));
      button.classList.toggle("active", isOpen);
    });

    $$(".main-navigation a").forEach(link => {
      link.addEventListener("click", () => {
        navigation.classList.remove("is-open");
        button.classList.remove("active");
        button.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", event => {
      if (
        !navigation.contains(event.target) &&
        !button.contains(event.target)
      ) {
        navigation.classList.remove("is-open");
        button.classList.remove("active");
        button.setAttribute("aria-expanded", "false");
      }
    });
  };

  // البحث
  HANOON.initSearch = function () {
    const panel = HANOON.elements.searchPanel;

    if (!panel) return;

    const openButtons = $$("[data-search-open]");
    const closeButtons = $$("[data-search-close]");
    const input = $("input[type='search']", panel);

    const openSearch = () => {
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");

      window.setTimeout(() => {
        input?.focus();
      }, 100);
    };

    const closeSearch = () => {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
    };

    openButtons.forEach(button => {
      button.addEventListener("click", openSearch);
    });

    closeButtons.forEach(button => {
      button.addEventListener("click", closeSearch);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeSearch();
    });

    if (input) {
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          const query = input.value.trim();

          if (!query) {
            HANOON.toast("اكتب كلمة للبحث أولاً", "warning");
            return;
          }

          const url = new URL("pages/search.html", document.baseURI);
          url.searchParams.set("q", query);
          window.location.href = url.href;
        }
      });
    }
  };

  // الوضع الليلي والنهاري
  HANOON.initTheme = function () {
    const savedTheme = localStorage.getItem("hanoon-theme");
    const preferredTheme = window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches ? "light" : "dark";

    const theme = savedTheme || preferredTheme;

    document.documentElement.setAttribute("data-theme", theme);

    $$("[data-theme-toggle]").forEach(button => {
      button.addEventListener("click", () => {
        const current =
          document.documentElement.getAttribute("data-theme") || "dark";

        const next = current === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("hanoon-theme", next);

        button.setAttribute(
          "aria-label",
          next === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"
        );
      });
    });
  };

  // تحديد الرابط الحالي
  HANOON.initActiveLinks = function () {
    const currentPath = window.location.pathname;

    $$("a[href]").forEach(link => {
      try {
        const linkUrl = new URL(link.href, window.location.origin);

        if (
          linkUrl.origin === window.location.origin &&
          linkUrl.pathname === currentPath
        ) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      } catch (_) {
        // تجاهل الروابط غير الصالحة
      }
    });
  };

  // سنة حقوق النشر
  HANOON.initFooter = function () {
    $$("[data-current-year]").forEach(element => {
      element.textContent = new Date().getFullYear();
    });
  };

  // إغلاق النوافذ باستخدام Escape
  HANOON.initKeyboard = function () {
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;

      $$(".modal.is-open, .dropdown.is-open").forEach(element => {
        element.classList.remove("is-open");
      });
    });
  };

  // تشغيل التطبيق
  HANOON.init = function () {
    if (HANOON.initialized) return;

    HANOON.initSplash();
    HANOON.initMobileMenu();
    HANOON.initSearch();
    HANOON.initTheme();
    HANOON.initActiveLinks();
    HANOON.initFooter();
    HANOON.initKeyboard();

    HANOON.initialized = true;

    document.dispatchEvent(
      new CustomEvent("hanoon:ready", {
        detail: { version: HANOON.version }
      })
    );

    console.log("HANOON initialized successfully.");
  };

  window.HANOON = HANOON;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", HANOON.init, {
      once: true
    });
  } else {
    HANOON.init();
  }
})();
