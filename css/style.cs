
/* =========================================
   HANOON — GLOBAL STYLE
   Version 1.0
========================================= */

/* PAGE FOUNDATION */

html {
  min-height: 100%;
  scroll-padding-top: 90px;
}

body {
  min-height: 100vh;
  overflow-x: hidden;
}

main {
  min-height: 65vh;
}

section {
  position: relative;
  padding-block: 64px;
}

.section-compact {
  padding-block: 36px;
}

.section-large {
  padding-block: 96px;
}

/* PAGE BACKGROUNDS */

.page-bg {
  background-color: var(--bg);
  background-image: url("../assets/backgrounds/hero-bg.svg");
  background-position: top center;
  background-repeat: no-repeat;
  background-size: 100% auto;
}

.section-bg {
  background-image: url("../assets/backgrounds/section-bg.svg");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.surface-bg {
  background: var(--surface);
}

/* LAYOUT */

.container {
  width: min( calc(100% - 40px), var(--content-width));
  margin-inline: auto;
}

.container-narrow {
  width: min( calc(100% - 40px), 900px);
  margin-inline: auto;
}

.container-wide {
  width: min( calc(100% - 32px), 1600px);
  margin-inline: auto;
}

.page-layout {
  width: 100%;
  min-height: 100vh;
}

.content-area {
  width: 100%;
  min-width: 0;
}

.content-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.stack {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  align-items: center;
}

.wrap {
  flex-wrap: wrap;
}

.gap-sm {
  gap: 10px;
}

.gap-md {
  gap: 20px;
}

.gap-lg {
  gap: 32px;
}

/* PAGE HEADERS */

.page-heading {
  margin-bottom: 34px;
}

.page-heading h1 {
  margin-bottom: 12px;
  font-size: clamp(30px, 4vw, 48px);
  font-weight: 900;
}

.page-heading p {
  max-width: 750px;
  font-size: 16px;
  line-height: 2;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
}

.section-heading p {
  margin: 8px 0 0;
}

.heading-line {
  width: 54px;
  height: 3px;
  margin-top: 14px;
  border-radius: 10px;
  background: var(--gold);
}

/* GOLD DETAILS */

.gold-text {
  color: var(--gold);
}

.gold-line {
  height: 1px;
  border: 0;
  background: linear-gradient(
    90deg,
    transparent,
    var(--gold),
    transparent
  );
  opacity: .45;
  margin-block: 32px;
}

.gold-decoration {
  position: relative;
}

.gold-decoration::before {
  content: "";
  position: absolute;
  width: 65px;
  height: 3px;
  background: var(--gold);
  border-radius: 10px;
  bottom: -12px;
  right: 0;
}

/* GRID SYSTEM */

.grid {
  display: grid;
  gap: 24px;
}

.grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.grid-auto {
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 240px), 1fr));
}

/* UNIVERSAL CARDS */

.card {
  min-width: 0;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-sm);
  transition:
    transform var(--transition-normal),
    border-color var(--transition-normal),
    box-shadow var(--transition-normal);
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--border-light);
  box-shadow: var(--shadow-md);
}

.card-flat {
  box-shadow: none;
}

.card-gold {
  border-color: var(--border-light);
  box-shadow: var(--gold-glow);
}

/* IMAGE SYSTEM */

.image-frame {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--surface-2);
}

.image-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-16-9 {
  aspect-ratio: 16 / 9;
}

.image-4-3 {
  aspect-ratio: 4 / 3;
}

.image-square {
  aspect-ratio: 1;
}

.image-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* BOOK COVERS */

.book-cover {
  position: relative;
  overflow: hidden;
  aspect-ratio: 2 / 3;
  border-radius: 10px;
  background: var(--surface-2);
  box-shadow: var(--shadow-md);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.book-cover:hover img {
  transform: scale(1.045);
}

/* BADGES */

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: var(--radius-full);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
}

.badge-gold {
  color: var(--gold);
  background: rgba(213,179,108,.12);
  border: 1px solid var(--border-light);
}

/* DIVIDERS */

.divider {
  width: 100%;
  height: 1px;
  border: 0;
  background: var(--border);
  margin-block: 24px;
}

/* EMPTY STATES */

.empty-state {
  padding: 60px 24px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
}

.empty-state h3 {
  margin-bottom: 8px;
}

.empty-state p {
  max-width: 500px;
  margin-inline: auto;
}

/* ACCESSIBILITY */

.visually-hidden {
  position: absolute !important;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* RESPONSIVE */

@media (max-width: 1100px) {
  .grid-4 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .grid-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  section {
    padding-block: 42px;
  }

  .section-large {
    padding-block: 60px;
  }

  .container,
  .container-narrow {
    width: calc(100% - 28px);
  }

  .grid-4,
  .grid-3,
  .grid-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .card {
    padding: 17px;
  }

  .section-heading {
    align-items: start;
    flex-direction: column;
  }

  .page-heading {
    margin-bottom: 25px;
  }
}

@media (max-width: 480px) {
  .grid-4,
  .grid-3,
  .grid-2 {
    grid-template-columns: 1fr;
  }

  .grid-auto {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 15px;
  }

  .page-heading h1 {
    font-size: 28px;
  }
}
