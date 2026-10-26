import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ────────────────────────────── date helpers ────────────────────────────── */
// All dates are handled in LOCAL time; "YYYY-MM-DD" strings never go through
// `new Date(string)` (which parses as UTC and shifts the day in some zones).

const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const parseISO = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getMonth() === +m[2] - 1 ? d : null; // rejects 2025-02-31
};

const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();

const addMonths = (d, n) => {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  t.setDate(Math.min(d.getDate(), daysInMonth(t.getFullYear(), t.getMonth())));
  return t;
};

const DEFAULT_LABELS = {
  today: "اليوم",
  clear: "مسح",
  prevMonth: "الشهر السابق",
  nextMonth: "الشهر التالي",
  prevYear: "السنة السابقة",
  nextYear: "السنة التالية",
  chooseMonth: "اختر الشهر والسنة",
};

const POP_WIDTH = 288; // w-72
const POP_GAP = 8;
const VIEWPORT_PAD = 8;

/**
 * DateInput – accessible, themeable date picker with a custom calendar popover.
 *
 * The popover is rendered in a portal (document.body) with position: fixed,
 * so it never extends the scroll area of a parent modal (no x/y overflow).
 *
 * Drop-in compatible: `value` is "YYYY-MM-DD" and `onChange` receives an
 * event-like object, so `e.target.value` still works.
 */
export function DateInput({
  value,
  defaultValue,
  onChange,
  name,
  label,
  hint,
  error,
  placeholder = "اختر تاريخ",
  className,
  inputClass,
  disabled,
  required,
  min,
  max,
  isDateDisabled,
  locale = "ar-SA",
  weekStartsOn = 6,
  clearable = true,
  labels: labelOverrides,
  displayOptions = { day: "numeric", month: "short", year: "numeric" },
  id,
  ...props
}) {
  const uid = useId();
  const triggerId = id || `${uid}-trigger`;
  const popId = `${uid}-pop`;
  const headingId = `${uid}-heading`;
  const t = { ...DEFAULT_LABELS, ...labelOverrides };

  /* value (controlled or not) */
  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue ?? "");
  const current = controlled ? value ?? "" : inner;
  const selected = parseISO(current);

  const minD = parseISO(min);
  const maxD = parseISO(max);
  const todayISO = toISO(new Date());

  const emit = (iso) => {
    if (!controlled) setInner(iso);
    onChange?.({ target: { name, value: iso } });
  };

  /* popover state */
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("days"); // "days" | "months"
  const [view, setView] = useState(() => startOfMonth(selected || new Date()));
  const [focus, setFocus] = useState(() => selected || new Date());
  const [pos, setPos] = useState({ top: -9999, left: -9999 });

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const popRef = useRef(null);

  /* Intl formatters */
  const fmt = useMemo(
    () => ({
      trigger: new Intl.DateTimeFormat(locale, displayOptions),
      heading: new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
      year: new Intl.DateTimeFormat(locale, { year: "numeric" }),
      full: new Intl.DateTimeFormat(locale, { dateStyle: "full" }),
      num: new Intl.NumberFormat(locale),
      weekday: new Intl.DateTimeFormat(locale, { weekday: "short" }),
      month: new Intl.DateTimeFormat(locale, { month: "short" }),
    }),
    [locale, displayOptions]
  );

  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) =>
        fmt.weekday.format(new Date(2023, 0, 1 + ((weekStartsOn + i) % 7)))
      ), // 1 Jan 2023 = Sunday
    [fmt, weekStartsOn]
  );
  const monthNames = useMemo(
    () => Array.from({ length: 12 }, (_, i) => fmt.month.format(new Date(2023, i, 1))),
    [fmt]
  );

  const weeks = useMemo(() => {
    const offset = (view.getDay() - weekStartsOn + 7) % 7;
    const start = addDays(view, -offset);
    return Array.from({ length: 6 }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d))
    );
  }, [view, weekStartsOn]);

  /* range checks */
  const dateDisabled = useCallback(
    (d) => {
      const iso = toISO(d);
      return (
        (min && iso < min) || (max && iso > max) || (isDateDisabled ? isDateDisabled(d) : false)
      );
    },
    [min, max, isDateDisabled]
  );

  const monthOutOfRange = (y, m) => {
    const first = toISO(new Date(y, m, 1));
    const last = toISO(new Date(y, m + 1, 0));
    return Boolean((min && last < min) || (max && first > max));
  };

  const clamp = (d) => (minD && d < minD ? minD : maxD && d > maxD ? maxD : d);

  /* open / close */
  const openCalendar = () => {
    if (disabled) return;
    const start = clamp(selected || new Date());
    setFocus(start);
    setView(startOfMonth(start));
    setMode("days");
    setOpen(true);
  };

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  const select = (d) => {
    if (dateDisabled(d)) return;
    emit(toISO(d));
    close();
  };

  const moveFocus = (d) => {
    const next = clamp(d);
    setFocus(next);
    setView(startOfMonth(next));
  };

  /* position the fixed popover: below the trigger, flip above if no room,
     and clamp inside the viewport so it can never cause x/y overflow */
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const update = () => {
      const r = triggerRef.current.getBoundingClientRect();
      const w = popRef.current?.offsetWidth || POP_WIDTH;
      const h = popRef.current?.offsetHeight || 360;

      const spaceBelow = window.innerHeight - r.bottom;
      const flipUp = spaceBelow < h + POP_GAP + VIEWPORT_PAD && r.top > h + POP_GAP + VIEWPORT_PAD;

      let top = flipUp ? r.top - h - POP_GAP : r.bottom + POP_GAP;
      top = Math.max(VIEWPORT_PAD, Math.min(top, window.innerHeight - h - VIEWPORT_PAD));

      // RTL: align popover's right edge with the trigger's right edge
      let left = r.right - w;
      left = Math.max(VIEWPORT_PAD, Math.min(left, window.innerWidth - w - VIEWPORT_PAD));

      setPos((p) => (p.top === top && p.left === left ? p : { top, left }));
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true); // capture: catches modal scroll
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, mode, view]); // mode/view: popover height can change

  /* move DOM focus to the active day */
  useEffect(() => {
    if (!open || mode !== "days") return;
    popRef.current?.querySelector(`[data-date="${toISO(focus)}"]`)?.focus({ preventScroll: true });
  }, [open, mode, focus]);

  /* click outside (popover lives in a portal, so check both refs) */
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (rootRef.current?.contains(e.target) || popRef.current?.contains(e.target)) return;
      close(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  /* keyboard: whole popover */
  const onPopKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation(); // don't let Escape also close the parent dialog
      close();
    } else if (e.key === "Tab") {
      close(); // refocus trigger, then let Tab continue naturally
    }
  };

  /* keyboard: day grid (roving tabindex) */
  const onGridKeyDown = (e) => {
    const cur = parseISO(e.target.dataset?.date);
    if (!cur) return;
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const dow = (cur.getDay() - weekStartsOn + 7) % 7;
    let next;
    switch (e.key) {
      case "ArrowLeft": next = addDays(cur, rtl ? 1 : -1); break;
      case "ArrowRight": next = addDays(cur, rtl ? -1 : 1); break;
      case "ArrowUp": next = addDays(cur, -7); break;
      case "ArrowDown": next = addDays(cur, 7); break;
      case "Home": next = addDays(cur, -dow); break;
      case "End": next = addDays(cur, 6 - dow); break;
      case "PageUp": next = addMonths(cur, e.shiftKey ? -12 : -1); break;
      case "PageDown": next = addMonths(cur, e.shiftKey ? 12 : 1); break;
      default: return;
    }
    e.preventDefault();
    moveFocus(next);
  };

  /* roving tab stop: focused day if visible, otherwise the 1st of the month */
  const tabStopISO =
    focus.getMonth() === view.getMonth() && focus.getFullYear() === view.getFullYear()
      ? toISO(focus)
      : toISO(view);

  const pickMonth = (m) => {
    const y = view.getFullYear();
    const d = new Date(y, m, Math.min(focus.getDate(), daysInMonth(y, m)));
    moveFocus(d);
    setMode("days");
  };

  const prevDisabled =
    mode === "days"
      ? monthOutOfRange(view.getFullYear(), view.getMonth() - 1)
      : Boolean(minD && view.getFullYear() - 1 < minD.getFullYear());
  const nextDisabled =
    mode === "days"
      ? monthOutOfRange(view.getFullYear(), view.getMonth() + 1)
      : Boolean(maxD && view.getFullYear() + 1 > maxD.getFullYear());

  const step = (dir) =>
    setView((v) =>
      mode === "days" ? addMonths(v, dir) : new Date(v.getFullYear() + dir, v.getMonth(), 1)
    );

  const navBtn =
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground " +
    "transition-colors hover:bg-accent hover:text-accent-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 " +
    "disabled:pointer-events-none disabled:opacity-30";

  const hasError = Boolean(error);

  return (
    <div ref={rootRef} dir="rtl" className={cn("relative flex flex-col gap-1", className)}>
      {label && (
        <label
          htmlFor={triggerId}
          className="select-none px-0.5 text-xs font-medium text-muted-foreground"
        >
          {label}
          {required && <span className="ms-0.5 text-destructive">*</span>}
        </label>
      )}

      {/* trigger */}
      <div
        className={cn(
          "group relative flex h-10 items-center rounded-lg border bg-transparent",
          "transition-all duration-200 dark:bg-input/30",
          hasError ? "border-destructive" : "border-input hover:border-primary/60 hover:shadow-sm",
          "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
          hasError && "focus-within:border-destructive focus-within:ring-destructive/20",
          open && "border-primary ring-3 ring-primary/20",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popId : undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError || hint ? `${uid}-desc` : undefined}
          onClick={() => (open ? close(false) : openCalendar())}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown" && !open) {
              e.preventDefault();
              openCalendar();
            }
          }}
          className={cn(
            "h-full w-full rounded-lg bg-transparent ps-9 pe-3 text-start text-sm outline-none",
            selected ? "text-foreground" : "text-muted-foreground",
            inputClass
          )}
          {...props}
        >
          {selected ? fmt.trigger.format(selected) : placeholder}
        </button>

        <span
          className={cn(
            "pointer-events-none absolute start-3 flex items-center text-muted-foreground",
            "transition-colors duration-200 group-focus-within:text-primary",
            open && "text-primary"
          )}
        >
          <CalendarIcon className="h-4 w-4" />
        </span>

        {/* keeps native <form> submission working */}
        {name && <input type="hidden" name={name} value={current} required={required} />}
      </div>

      {(hasError || hint) && (
        <p
          id={`${uid}-desc`}
          className={cn("px-0.5 text-xs", hasError ? "text-destructive" : "text-muted-foreground")}
        >
          {typeof error === "string" ? error : hint}
        </p>
      )}

      {/* calendar popover – portaled to <body>, fixed-positioned */}
      {open &&
        createPortal(
          <div
            ref={popRef}
            id={popId}
            role="dialog"
            aria-label={label || placeholder}
            onKeyDown={onPopKeyDown}
            // keep Radix Dialog from treating clicks in the portal as "outside"
            onPointerDown={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            dir="rtl"
            style={{ position: "fixed", top: pos.top, left: pos.left }}
            className={cn(
              // pointer-events-auto: Radix sets pointer-events:none on <body> while a modal is open
              "pointer-events-auto z-[100] w-72 max-w-[calc(100vw-1rem)] rounded-xl border bg-popover p-3",
              "text-popover-foreground shadow-lg",
              "animate-in fade-in-0 zoom-in-95 duration-150"
            )}
          >
            {/* header */}
            <div className="mb-2 flex items-center justify-between gap-1">
              <button
                type="button"
                className={navBtn}
                disabled={prevDisabled}
                onClick={() => step(-1)}
                aria-label={mode === "days" ? t.prevMonth : t.prevYear}
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </button>

              <button
                type="button"
                id={headingId}
                aria-live="polite"
                aria-label={t.chooseMonth}
                aria-expanded={mode === "months"}
                onClick={() => setMode((m) => (m === "days" ? "months" : "days"))}
                className={cn(
                  "rounded-md px-2.5 py-1 text-sm font-semibold capitalize transition-colors",
                  "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                )}
              >
                {mode === "days" ? fmt.heading.format(view) : fmt.year.format(view)}
              </button>

              <button
                type="button"
                className={navBtn}
                disabled={nextDisabled}
                onClick={() => step(1)}
                aria-label={mode === "days" ? t.nextMonth : t.nextYear}
              >
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>

            {mode === "months" ? (
              /* month chooser */
              <div className="grid min-h-[15.5rem] grid-cols-3 content-center gap-1.5">
                {monthNames.map((monthLabel, m) => {
                  const off = monthOutOfRange(view.getFullYear(), m);
                  const isSel =
                    selected &&
                    selected.getFullYear() === view.getFullYear() &&
                    selected.getMonth() === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      disabled={off}
                      onClick={() => pickMonth(m)}
                      className={cn(
                        "h-10 rounded-md text-sm capitalize transition-colors",
                        "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                        "disabled:pointer-events-none disabled:opacity-30",
                        isSel && "bg-primary font-medium text-primary-foreground hover:bg-primary"
                      )}
                    >
                      {monthLabel}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* day grid */
              <div role="grid" aria-labelledby={headingId} onKeyDown={onGridKeyDown}>
                <div role="row" className="mb-1 grid grid-cols-7">
                  {weekdays.map((w, i) => (
                    <div
                      key={i}
                      role="columnheader"
                      className="py-1 text-center text-[11px] font-medium text-muted-foreground"
                    >
                      {w}
                    </div>
                  ))}
                </div>

                {weeks.map((week, wi) => (
                  <div key={wi} role="row" className="grid grid-cols-7 gap-y-0.5">
                    {week.map((d) => {
                      const iso = toISO(d);
                      const outside = d.getMonth() !== view.getMonth();
                      const isSel = iso === current;
                      const isToday = iso === todayISO;
                      const off = dateDisabled(d);
                      return (
                        <div
                          key={iso}
                          role="gridcell"
                          aria-selected={isSel}
                          className="flex justify-center"
                        >
                          <button
                            type="button"
                            data-date={iso}
                            tabIndex={iso === tabStopISO ? 0 : -1}
                            aria-label={fmt.full.format(d)}
                            aria-current={isToday ? "date" : undefined}
                            aria-disabled={off || undefined}
                            onClick={() => select(d)}
                            className={cn(
                              "relative flex h-9 w-9 items-center justify-center rounded-md text-sm tabular-nums",
                              "outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                              "focus-visible:ring-2 focus-visible:ring-primary/60",
                              outside && "text-muted-foreground/50",
                              isToday &&
                                "font-semibold text-primary after:absolute after:bottom-1 after:h-1 after:w-1 after:rounded-full after:bg-primary",
                              isSel &&
                                "bg-primary font-medium text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground after:bg-primary-foreground",
                              off && "cursor-not-allowed opacity-30 hover:bg-transparent"
                            )}
                          >
                            {fmt.num.format(d.getDate())}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* footer */}
            <div className="mt-2 flex items-center justify-between border-t pt-2">
              <button
                type="button"
                disabled={dateDisabled(new Date())}
                onClick={() => select(new Date())}
                className="rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-40"
              >
                {t.today}
              </button>
              {clearable && (
                <button
                  type="button"
                  disabled={!current}
                  onClick={() => {
                    emit("");
                    close();
                  }}
                  className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-40"
                >
                  {t.clear}
                </button>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}