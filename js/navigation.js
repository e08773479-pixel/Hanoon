
/* =========================================
   HANOON — Navigation Manager
   Desktop / Mobile Navigation
========================================= */

(() => {
  "use strict";

  const SELECTORS = {
    menuToggle: "#menuToggle",
    mobileMenu: "#mobileMenu",
    mobileClose: "#mobileMenuClose",
    menuLinks: "#mobileMenu a",
    dropdownToggles: "[data-dropdown-toggle]",
    dropdowns: "[data-dropdown]"
  };

  const get = (selector, parent = document) =>
    parent.querySelector(selector);

  const getAll = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  /* =========================================
     MOBILE MENU
  ========================================= */

  const openMobileMenu = () => {
    const menu = get(SELECTORS.mobileMenu);
    const toggle = get(SELECTORS.menuToggle);

    if (!menu) return;

    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");

    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
    }

    document.body.classList.add("menu-open");

    const firstLink = menu.querySelector("a, button");

    if (firstLink) {
      firstLink.focus();
    }
  };

  const closeMobileMenu = () => {
    const menu = get(SELECTORS.mobileMenu);
    const toggle = get(SELECTORS.menuToggle);

    if (!menu) return;

    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");

    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("menu-open");
  };

  const toggleMobileMenu = () => {
    const menu = get(SELECTORS.mobileMenu);

    if (!menu) return;

    if (menu.classList.contains("is-open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  /* =========================================
     DROPDOWN MENUS
  ========================================= */

  const closeAllDropdowns = (except = null) => {
    getAll(SELECTORS.dropdowns).forEach((dropdown) => {
      if (dropdown === except) return;

      dropdown.classList.remove("is-open");

      const button = dropdown.querySelector(
        SELECTORS.dropdownToggles
      );

      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });
  };

  const toggleDropdown = (button) => {
    const dropdown = button.closest(SELECTORS.dropdowns);

    if (!dropdown) return;

    const isOpen = dropdown.classList.contains("is-open");

    closeAllDropdowns(dropdown);

    dropdown.classList.toggle("is-open", !isOpen);

    button.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );
  };

  /* =========================================
     ACTIVE NAVIGATION LINK
  ========================================= */

  const normalizePath = (path) => {
    if (!path || path === "/") return "index.html";

    return path.split("/").pop().toLowerCase();
  };

  const markActiveLinks = () => {
    const currentPage = normalizePath(
      window.location.pathname
    );

    getAll("nav a, #mobileMenu a").forEach((link) => {
      const href = link.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http") ||
        href.startsWith("mailto:")
      ) {
        return;
      }

      const linkPage = normalizePath(
        href.split("?")[0].split("#")[0]
      );

      const isActive = linkPage === currentPage;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  /* =========================================
     HEADER SCROLL EFFECT
  ========================================= */

  const handleHeaderScroll = () => {
    const header = get(".site-header");

    if (!header) return;

    header.classList.toggle(
      "is-scrolled",
      window.scrollY > 20
    );
  };

  /* =========================================
     EVENT LISTENERS
  ========================================= */

  const bindEvents = () => {
    const menuToggle = get(SELECTORS.menuToggle);
    const mobileClose = get(SELECTORS.mobileClose);
    const mobileMenu = get(SELECTORS.mobileMenu);

    if (menuToggle) {
      menuToggle.addEventListener(
        "click",
        toggleMobileMenu
      );
    }

    if (mobileClose) {
      mobileClose.addEventListener(
        "click",
        closeMobileMenu
      );
    }

    if (mobileMenu) {
      mobileMenu.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (link) {
          closeMobileMenu();
        }
      });
    }

    getAll(SELECTORS.dropdownToggles).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleDropdown(button);
      });
    });

    document.addEventListener("click", (event) => {
      const insideDropdown = event.target.closest(
        SELECTORS.dropdowns
      );

      if (!insideDropdown) {
        closeAllDropdowns();
      }

      const insideMenu =
        event.target.closest(SELECTORS.mobileMenu);

      const insideToggle =
        event.target.closest(SELECTORS.menuToggle);

      if (!insideMenu && !insideToggle) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        closeAllDropdowns();
      }
    });

    window.addEventListener(
      "scroll",
      handleHeaderScroll,
      { passive: true }
    );

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMobileMenu();
      }
    });
  };

  /* =========================================
     INITIALIZATION
  ========================================= */

  const initializeNavigation = () => {
    bindEvents();
    markActiveLinks();
    handleHeaderScroll();
  };

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeNavigation,
      { once: true }
    );
  } else {
    initializeNavigation();
  }

  // Public navigation controls.
  window.HANOON_NAVIGATION = Object.freeze({
    open: openMobileMenu,
    close: closeMobileMenu,
    toggle: toggleMobileMenu
  });

})();
