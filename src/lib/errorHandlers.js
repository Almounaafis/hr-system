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
  // 1. في حال وجود قائمة أخطاء من الباك إند
  const errors = error?.response?.data?.errors;
  if (Array.isArray(errors) && errors.length > 0) {
    errors.forEach((err) => toast.error(err.message || err.msg || 'حدث خطأ ما'));
    return;
  }

  // 2. رسالة الخطأ المباشرة القادمة من الباك إند
  const serverMessage = error?.response?.data?.message || error?.response?.data?.error;

  if (serverMessage && typeof serverMessage === 'string') {
    if (
      error?.response?.status === 401 &&
      (serverMessage.toLowerCase() === 'unauthorized' ||
        serverMessage.toLowerCase().includes('invalid credentials'))
    ) {
      toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      return;
    }
    toast.error(serverMessage);
    return;
  }

  // 3. أخطاء انقطاع الاتصال بالخادم / الشبكة
  if (!error?.response) {
    toast.error('تعذر الاتصال بالخادم، تحقق من اتصال الإنترنت');
    return;
  }

  const status = error?.response?.status;
  if (status === 401) {
    toast.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    return;
  }
  if (status === 403) {
    toast.error('ليس لديك صلاحية للوصول لهذا المورد');
    return;
  }
  if (status >= 500) {
    toast.error('حدث خطأ في الخادم، يرجى المحاولة لاحقاً');
    return;
  }
  if (error?.code === 'ECONNABORTED') {
    toast.error('انتهت مهلة الاتصال، يرجى المحاولة مرة أخرى');
    return;
  }

  toast.error(error?.message || 'حدث خطأ ما');
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
