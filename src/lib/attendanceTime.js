/**
 * Centralized Asia/Karachi timezone utility for the attendance/check-in flow.
 *
 * Works identically on the server (Node, any server timezone) and in the
 * browser (any local timezone) — never depends on the host's default
 * timezone. Import from here instead of re-deriving Karachi time inline.
 */

export const APP_TIMEZONE = "Asia/Karachi";

/**
 * Returns a Date object whose local getX()/toLocaleDateString() fields equal
 * the true Asia/Karachi wall-clock time, regardless of the host's own
 * timezone. Pass a corrected base timestamp (e.g. server-time-adjusted) to
 * avoid trusting an unreliable device clock.
 *
 * NOTE: the returned Date's *UTC instant* is not meaningful — only read it
 * back with local getters (getHours, getDate, toLocaleDateString with no
 * timeZone override) in the SAME environment that created it. Never persist
 * or re-serialize it (e.g. toISOString()); it is a display/derivation
 * helper only.
 */
export const getKarachiNow = (base = new Date()) =>
  new Date(base.toLocaleString("en-US", { timeZone: APP_TIMEZONE }));

/** "9:00 PM" — 12-hour time from a Karachi-normalized Date (see getKarachiNow). */
export const formatKarachiTime = (date) => {
  let h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
};

/**
 * "DD/MM/YYYY" Karachi calendar date computed directly off a real
 * timestamp — safe to call with a plain `new Date()` on any host timezone
 * since it passes an explicit timeZone.
 */
export const formatKarachiDate = (date = new Date()) =>
  date.toLocaleDateString("en-GB", { timeZone: APP_TIMEZONE });

const setTimeOnDate = (baseDate, timeStr) => {
  const d = new Date(baseDate);
  let [tp, mer] = timeStr.trim().split(" ");
  let [hh, mm] = tp.split(":").map(Number);
  if (mer?.toUpperCase() === "PM" && hh !== 12) hh += 12;
  if (mer?.toUpperCase() === "AM" && hh === 12) hh = 0;
  d.setHours(hh, mm, 0, 0);
  return d;
};

/**
 * The attendance "shift date" for a check-in, night-shift aware.
 * `now` must be a Karachi-normalized Date (see getKarachiNow).
 *
 * A check-in only belongs to YESTERDAY's shift when `now` still falls
 * inside yesterday's overnight shift window (start → end, end computed by
 * rolling into the next calendar day for an overnight shift). Any other
 * pre-shift-start time — e.g. 8:57 PM for a 9:00 PM shift — is an early
 * check-in for TODAY's upcoming shift, not a continuation of yesterday's
 * already-finished one.
 *
 * Do NOT simplify this back to `if (now < shiftStart) shiftDate = yesterday`
 * — that conflates "still finishing yesterday's overnight shift" with
 * "checking in early for today's shift" and wrongly matches today's early
 * check-in against yesterday's completed attendance record.
 */
export const getAttendanceDate = (now, checkInTimeStr, checkOutTimeStr) => {
  if (!checkInTimeStr) {
    return now.toLocaleDateString("en-GB");
  }

  const todayStart = setTimeOnDate(now, checkInTimeStr);

  let todayEnd = checkOutTimeStr ? setTimeOnDate(now, checkOutTimeStr) : null;
  if (todayEnd && todayEnd <= todayStart) {
    // Checkout time is numerically before/equal check-in time → overnight shift.
    todayEnd = new Date(todayEnd);
    todayEnd.setDate(todayEnd.getDate() + 1);
  }

  if (todayEnd) {
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    // Still inside yesterday's overnight shift window → belongs to yesterday.
    if (now >= yesterdayStart && now < yesterdayEnd) {
      return yesterdayStart.toLocaleDateString("en-GB");
    }
  }

  // Early, on-time, or late for TODAY's shift.
  return todayStart.toLocaleDateString("en-GB");
};

/**
 * Safely reconstruct a Date from a stored "DD/MM/YYYY" attendance date
 * string, for display/sorting only.
 *
 * IMPORTANT: uses the (year, monthIndex, day) constructor — which builds
 * the Date from LOCAL calendar fields — instead of `new Date("YYYY-MM-DD")`,
 * which JS parses as UTC MIDNIGHT. That UTC parse is what caused the
 * original bug: re-formatting it with toLocaleDateString() (no timeZone)
 * reads it back in the *viewer's* local timezone, rolling the date back a
 * day for anyone west of UTC. The stored string is already a normalized
 * Karachi calendar day — round-tripping it through (y, m, d) local fields
 * means construction and re-display always agree, regardless of the
 * viewer's or server's timezone.
 */
export const parseAttendanceDate = (dmyStrOrFallback) => {
  if (typeof dmyStrOrFallback === "string" && dmyStrOrFallback.includes("/")) {
    const [d, m, y] = dmyStrOrFallback.split("/").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(dmyStrOrFallback || Date.now());
};

/** "YYYY-MM-DD" from LOCAL date fields — safe pairing with parseAttendanceDate's
 *  local-field Date, unlike toISOString() which converts through UTC first. */
export const toLocalISODate = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
