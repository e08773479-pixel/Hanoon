
/* ==========================================
   HANOON - INDEPENDENT CHAPTER LOADER
   تحميل كل فصل من ملف مستقل
========================================== */

(function () {
  "use strict";

  /**
   * تحميل فصل محدد من مجلد الكتاب
   *
   * مثال:
   * bookId = human-life
   * chapterNumber = 1
   *
   * المسار:
   * content/books/human-life/chapter-01.js
   */

  async function getChapter(bookId, chapterNumber) {
    // التحقق من رقم ومعرّف الكتاب
    if (
      typeof bookId !== "string" ||
      !/^[a-zA-Z0-9_-]+$/.test(bookId) ||
      !Number.isInteger(chapterNumber) ||
      chapterNumber < 1
    ) {
      throw new Error("بيانات الكتاب أو الفصل غير صحيحة.");
    }

    // تحويل 1 إلى 01 و2 إلى 02 وهكذا
    const number = String(chapterNumber).padStart(2, "0");

    // تحديد مسار ملف الفصل
    const filePath =
      `../content/books/${encodeURIComponent(bookId)}/chapter-${number}.js`;

    try {
      // تحميل الفصل كملف JavaScript مستقل
      const chapterModule = await import(filePath);

      const chapter = chapterModule.default;

      // التأكد من صحة بيانات الفصل
      if (
        !chapter ||
        typeof chapter !== "object" ||
        typeof chapter.content !== "string"
      ) {
        throw new Error("ملف الفصل غير مكتمل أو بصيغة غير صحيحة.");
      }

      return {
        title: chapter.title || "",
        summary: chapter.summary || "",
        content: chapter.content,
        bookId,
        chapterNumber
      };

    } catch (error) {
      console.error("HANOON Chapter Loader:", error);

      throw new Error(
        `تعذر تحميل الفصل رقم ${chapterNumber}. تأكد من وجود ملف الفصل في مجلد الكتاب.`
      );
    }
  }

  // إتاحة نظام تحميل الفصول لباقي صفحات الموقع
  window.HANOON_CONTENT_API = {
    getChapter
  };

  console.info("HANOON Independent Chapter Loader Ready.");

})();
