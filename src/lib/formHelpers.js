/**
 * دوال مساعدة للتعامل مع بيانات النماذج (Forms)
 *
 * يوفر هذا الملف دوال مساعدة لمعالجة بيانات النماذج،
 * بما في ذلك تنظيف البيانات وإضافة الملفات إلى FormData.
 *
 * @module lib/formHelpers
 */

/**
 * استخراج وتنظيف البيانات وإزالة الخقول الفارغة والملفات
 *
 * @param {Object} body - كائن البيانات المراد تنظيفه
 * @param {string[]} excludeFields - قائمة بالحقول المراد استبعادها من التنظيف
 * @returns {Object} كائن البيانات المنظف
 *
 * @example
 * const cleanData = cleanPayload({ name: 'John', age: null, email: '' }, ['email']);
 * // returns { name: 'John' }
 */
export function cleanPayload(body, excludeFields = []) {
  return Object.fromEntries(
    Object.entries(body).filter(
      ([k, v]) => v !== null && v !== undefined && v !== '' && !excludeFields.includes(k)
    )
  );
}

/**
 * إضافة الملفات إلى FormData
 *
 * @param {FormData} formData - كائن FormData المراد إضافة الملفات إليه
 * @param {Object} files - كائن يحتوي على الملفات
 *
 * @example
 * const formData = new FormData();
 * appendFiles(formData, { image: fileObject, images: [file1, file2] });
 */
export function appendFiles(formData, files = {}) {
  const fileFields = ['imageCover', 'image', 'images', 'logo'];

  fileFields.forEach((field) => {
    const file = files[field];
    if (!file) return;

    if (field === 'images' && Array.isArray(file)) {
      file.forEach((img) => {
        if (img instanceof File) formData.append('images', img);
      });
    } else if (file instanceof File) {
      formData.append(field, file);
    }
  });
}

/**
 * بناء FormData من الـ payload
 *
 * يقوم هذه الدالة بإنشاء FormData من كائن البيانات،
 * مع إضافة الملفات وتنظيف البيانات.
 *
 * @param {Object} payload - كائن البيانات المراد تحويله إلى FormData
 * @returns {FormData} كائن FormData الجاهز للإرسال
 *
 * @example
 * const formData = buildFormData({
 *   name: 'John',
 *   email: 'john@example.com',
 *   image: fileObject
 * });
 */
export function buildFormData(payload) {
  const formData = new FormData();

  // إضافة الملفات
  appendFiles(formData, {
    imageCover: payload.imageCover || payload.body?.imageCover,
    image: payload.image || payload.body?.image,
    images: payload.images || payload.body?.images,
    logo: payload.logo || payload.body?.logo,
  });

  // تنظيف البيانات وإضافتها
  const excludedFields = ['images', 'imageCover', 'image', 'logo', 'endpoint', 'body', 'data'];
  const cleanedBody = cleanPayload(payload.body || payload.data || payload, excludedFields);

  // إضافة البيانات المنظفة بشكل فردي إلى FormData
  Object.entries(cleanedBody).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, item);
      });
    } else {
      formData.append(key, value);
    }
  });
  return formData;
}
