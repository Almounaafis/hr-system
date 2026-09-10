/**
 * دوال معالجة الأخطاء والنجاح الموحدة
 *
 * يوفر هذا الملف دوال موحدة لمعالجة الأخطاء وعرض رسائل النجاح،
 * مما يضمن اتساق تجربة المستخدم عبر التطبيق بالكامل.
 *
 * @module lib/errorHandlers
 */

import { toast } from 'react-hot-toast';

/**
 * معالج الأخطاء الموحد
 *
 * يقوم بعرض رسائل خطأ مناسبة بناءً على نوع الخطأ المستلم من الخادم.
 * يدعم مصفوفة من الأخطاء أو خطأ واحد.
 *
 * @param {Error|Object} error - كائن الخطأ المراد معالجته
 *
 * @example
 * try {
 *   await apiCall();
 * } catch (error) {
 *   handleError(error);
 * }
 */
export function handleError(error) {
  const errors = error?.response?.data?.errors;
  if (Array.isArray(errors)) {
    errors.forEach((err) => toast.error(err.message));
  } else {
    toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'حدث خطأ ما'
    );
  }
}

/**
 * معالج النجاح الموحد
 *
 * يقوم بعرض رسالة نجاح وتنفيذ دالة رد اتصال اختيارية.
 *
 * @param {Object} response - استجابة الخادم
 * @param {string} message - رسالة النجاح المراد عرضها
 * @param {Function} callback - دالة اختيارية لتنفيذها بعد عرض الرسالة
 * @returns {Object} استجابة الخادم الأصلية
 *
 * @example
 * const response = await apiCall();
 * handleSuccess(response, 'تم الحفظ بنجاح', () => {
 *   navigate('/dashboard');
 * });
 */
export function handleSuccess(response, message, callback) {
  toast.success(response?.message || message);
  callback?.();
  return response;
}
