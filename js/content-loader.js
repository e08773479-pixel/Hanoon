
/* ==========================================
   HANOON - SMART CHAPTER LOADER
   تحميل الفصل المستقل مع دعم المحتوى الحالي
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
      throw new Error("بيانات الكتاب أو الفصل غير صحيحة.");
    }

    const number = String(chapterNumber).padStart(2, "0");

    const filePath =
      `../content/books/${encodeURIComponent(bookId)}/chapter-${number}.js`;

    // أولًا: محاولة تحميل الملف المستقل
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
        summary: chapter.summary || "",
        content: chapter.content,
        bookId,
        chapterNumber,
        source: "independent-file"
      };

    } catch (error) {
      console.info(
        `HANOON: الملف المستقل للفصل ${number} غير متاح حاليًا، سيتم استخدام المحتوى الحالي.`
      );
    }

    // ثانيًا: استخدام المحتوى الموجود في books.js مؤقتًا
    const book = window.HANOON_BOOKS_API?.getById(bookId);

    const chapter = book?.chapters?.[chapterNumber - 1];

    if (!chapter) {
      throw new Error("لم يتم العثور على بيانات هذا الفصل.");
    }

    if (typeof chapter.content !== "string") {
      throw new Error("محتوى الفصل غير متاح.");
    }

    return {
      title: chapter.title || "",
      summary: chapter.summary || "",
      content: chapter.content,
      bookId,
      chapterNumber,
      source: "books-data"
    };
  }

  window.HANOON_CONTENT_API = {
    getChapter
  };

  console.info("HANOON Smart Chapter Loader Ready.");

})();
