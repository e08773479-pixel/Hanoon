
/* ==========================================
   HANOON - INDEPENDENT CHAPTER LOADER
========================================== */

(function () {
  "use strict";

  async function getChapter(bookId, chapterNumber) {
    if (
      typeof bookId !== "string" ||
      !/^[a-zA-Z0-9_-]+$/.test(bookId) ||
      !Number.isInteger(chapterNumber) ||
      chapterNumber < 1
    ) {
      throw new Error("بيانات الفصل غير صحيحة.");
    }

    const number = String(chapterNumber).padStart(2, "0");

    const filePath =
      `../content/books/${encodeURIComponent(bookId)}/chapter-${number}.js`;

    const module = await import(filePath);
    const chapter = module.default;

    if (!chapter || typeof chapter.content !== "string") {
      throw new Error("ملف الفصل غير مكتمل.");
    }

    return chapter;
  }

  window.HANOON_CONTENT_API = {
    getChapter
  };

})();
