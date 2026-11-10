
// =====================================================
// HANOON ARTICLE READER
// محرك قراءة المقالات
// =====================================================

(function () {
  "use strict";

  const API = window.HANOON_ARTICLES_API;

  if (!API) {
    console.error("HANOON: Articles database not loaded.");
    return;
  }

  const $ = selector => document.querySelector(selector);

  const params = new URLSearchParams(location.search);
  const articleId = params.get("id");

  const article = API.getById(articleId);

  const escapeHTML = value =>
    String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  const getFavorites = () => {
    try {
      return JSON.parse(localStorage.getItem("hanoon_article_favorites") || "[]");
    } catch {
      return [];
    }
  };

  const saveFavorites = favorites => {
    localStorage.setItem(
      "hanoon_article_favorites",
      JSON.stringify(favorites)
    );
  };

  function showNotFound() {
    document.title = "المقال غير موجود | هنون";

    const main = $("#articleRoot");

    if (main) {
      main.innerHTML = `
        <section class="ar-not-found">
          <div class="ar-not-found-icon">!</div>
          <h1>المقال غير موجود</h1>
          <p>
            ربما تم تغيير رابط المقال أو أن المقال لم يعد متاحًا.
          </p>
          <a href="articles.html">العودة إلى المقالات</a>
        </section>
      `;
    }
  }

  function renderContent() {
    const container = $("#arContent");

    if (!container) return;

    container.innerHTML = article.content.map(section => `
      <section class="ar-content-section">
        <h2>${escapeHTML(section.heading)}</h2>

        ${section.paragraphs.map(paragraph => `
          <p>${escapeHTML(paragraph)}</p>
        `).join("")}
      </section>
    `).join("");
  }

  function renderTags() {
    const container = $("#arTags");

    if (!container) return;

    container.innerHTML = (article.tags || []).map(tag => `
      <span class="ar-tag">${escapeHTML(tag)}</span>
    `).join("");
  }

  function renderRelated() {
    const container = $("#arRelated");

    if (!container) return;

    const related = API.getAll()
      .filter(item =>
        item.id !== article.id &&
        item.category === article.category
      )
      .slice(0, 3);

    if (!related.length) {
      container.innerHTML = `
        <p class="ar-no-related">
          ستظهر هنا مقالات أخرى من نفس المجال عند إضافتها.
        </p>
      `;
      return;
    }

    container.innerHTML = related.map(item => `
      <a class="ar-related-card"
         href="article.html?id=${encodeURIComponent(item.id)}">

        <img
          src="${escapeHTML(item.cover)}"
          alt="${escapeHTML(item.title)}"
          loading="lazy"
        >

        <div>
          <small>${escapeHTML(item.category)}</small>
          <strong>${escapeHTML(item.title)}</strong>
          <span>اقرأ المقال ←</span>
        </div>

      </a>
    `).join("");
  }

  function renderFavoriteButton() {
    const button = $("#arFavorite");

    if (!button) return;

    const favorites = getFavorites();
    const saved = favorites.includes(article.id);

    button.classList.toggle("active", saved);
    button.textContent = saved
      ? "★ محفوظ في المفضلة"
      : "☆ أضف للمفضلة";

    button.setAttribute("aria-pressed", String(saved));
  }

  function bindFavorite() {
    const button = $("#arFavorite");

    if (!button) return;

    button.addEventListener("click", () => {
      let favorites = getFavorites();

      if (favorites.includes(article.id)) {
        favorites = favorites.filter(id => id !== article.id);
      } else {
        favorites.push(article.id);
      }

      saveFavorites(favorites);
      renderFavoriteButton();
    });
  }

  async function shareArticle() {
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share error:", error);
        }
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(location.href);
      alert("تم نسخ رابط المقال.");
    } catch {
      window.prompt("انسخ رابط المقال:", location.href);
    }
  }

  function bindActions() {
    $("#arShare")?.addEventListener("click", shareArticle);

    $("#arPrint")?.addEventListener("click", () => {
      window.print();
    });

    bindFavorite();
  }

  function renderArticle() {
    document.title = article.title + " | هنون";

    $("#arCategory").textContent = article.category;
    $("#arTitle").textContent = article.title;
    $("#arExcerpt").textContent = article.excerpt;
    $("#arAuthor").textContent = article.author || "فريق هنون";
    $("#arReadTime").textContent =
      `${Number(article.readTime) || 5} دقائق قراءة`;

    $("#arDate").textContent = new Date(
      article.date
    ).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const image = $("#arCover");

    image.src = article.cover;
    image.alt = article.title;

    image.onerror = function () {
      this.onerror = null;
      this.src =
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80";
    };

    renderContent();
    renderTags();
    renderRelated();
    renderFavoriteButton();
    bindActions();
  }

  function initialize() {
    if (!article) {
      showNotFound();
      return;
    }

    renderArticle();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

  window.HANOON_ARTICLE_READER = {
    getCurrentArticle: () => article,
    refresh: initialize
  };

})();
