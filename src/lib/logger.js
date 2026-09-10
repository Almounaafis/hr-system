/**
 * نظام تسجيل منظم للتطبيق
 *
 * يوفر هذا الملف نظام logging موحد مع مستويات مختلفة:
 * - debug: معلومات تفصيلية للتطوير
 * - info: معلومات عامة
 * - warn: تحذيرات
 * - error: أخطاء
 *
 * @example
 * import logger from '@/lib/logger';
 * logger.info('تم تسجيل الدخول بنجاح');
 * logger.error('فشل الاتصال بالخادم', error);
 */

/* eslint-disable no-console */
const isDevelopment = import.meta.env.DEV;

/**
 * فئة Logger لإدارة عمليات التسجيل
 */
class Logger {
  /**
   * إنشاء مثيل جديد من Logger
   * @param {string} prefix - بادئة تظهر في جميع الرسائل
   */
  constructor(prefix = '') {
    this.prefix = prefix;
  }

  /**
   * دالة داخلية لتسجيل الرسائل
   * @param {string} level - مستوى التسجيل (debug, info, warn, error)
   * @param {...any} args - البيانات المراد تسجيلها
   */
  _log(level, ...args) {
    // في الإنتاج، نسجل فقط الأخطاء
    if (!isDevelopment && level !== 'error') return;

    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? `[${this.prefix}]` : '';
    const levelPrefix = `[${level.toUpperCase()}]`;

    console[level](`${timestamp} ${levelPrefix} ${prefix}`, ...args);
  }

  /**
   * تسجيل رسائل debug (فقط في بيئة التطوير)
   * @param {...any} args - البيانات المراد تسجيلها
   */
  debug(...args) {
    this._log('debug', ...args);
  }

  /**
   * تسجيل معلومات عامة
   * @param {...any} args - البيانات المراد تسجيلها
   */
  info(...args) {
    this._log('info', ...args);
  }

  /**
   * تسجيل تحذيرات
   * @param {...any} args - البيانات المراد تسجيلها
   */
  warn(...args) {
    this._log('warn', ...args);
  }

  /**
   * تسجيل أخطاء (تسجل في جميع البيئات)
   * @param {...any} args - البيانات المراد تسجيلها
   */
  error(...args) {
    this._log('error', ...args);
  }
}

// إنشاء مثيل افتراضي للنظام
export const logger = new Logger('HR-System');
export default logger;
