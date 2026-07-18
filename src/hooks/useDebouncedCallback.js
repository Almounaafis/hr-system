// ─── hooks/useDebouncedCallback.js ────────────────────────────────────────────
import { useCallback, useEffect, useRef } from "react";

/**
 * يرجع [debouncedFn, cancelFn]
 * - debouncedFn: نسخة مؤجَّلة من الدالة، بتلغي أي استدعاء سابق وتبدأ تايمر جديد.
 * - cancelFn: تلغي أي استدعاء معلّق يدويًا.
 * - بينضف التايمر تلقائيًا عند الـ unmount.
 */
export function useDebouncedCallback(callback, delay = 400) {
  const timeoutRef  = useRef(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const debounced = useCallback((...args) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);  
  }, [delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return [debounced, cancel];
}