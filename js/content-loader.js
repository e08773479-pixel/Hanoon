
/* ==========================================
   HANOON CONTENT LOADER
   نظام تحميل كل فصل من ملف مستقل
========================================== */

(function () {
  "use strict";

  const CONTENT_BASE = "../content/books/";

  function isValidId(value) {
    return (
      typeof value === "string" &&
      /^[a-zA-Z0-9_-]+$/.test(value)
    );
  }

  async function getChapter(bookId, chapterId) {
    if (!isValidId(bookId) || !isValidId(chapterId)) {
      throw new Error("بيانات الكتاب أو الفصل غير صحيحة.");
    }

    const filePath =
      CONTENT_BASE +
      encodeURIComponent(bookId) +
      "/" +
      encodeURIComponent(chapterId) +
      ".js";

    try {
      const chapterModule = await import(filePath);
      const chapter = chapterModule.default;

      if (
        !chapter ||
        typeof chapter !== "object" ||
        typeof chapter.content !== "string"
      ) {
        throw new Error("صيغة ملف الفصل غير صحيحة.");
      }

      return {
        title: chapter.title || "",
        content: chapter.content,
        summary: chapter.summary || "",
        bookId,
        chapterId
      };

    } catch (error) {
      console.error("HANOON chapter loading error:", error);

      throw new Error(
        "لم نتمكن من تحميل هذا الفصل. تأكد من وجود ملفه."
      );
    }
  }

  window.HANOON_CONTENT_API = {
    getChapter
  };

  console.info("HANOON Content Loader is ready.");
})();
