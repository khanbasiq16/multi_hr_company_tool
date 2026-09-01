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

/**
 * The attendance "shift date" for a check-in, night-shift aware.
 * `now` must be a Karachi-normalized Date (see getKarachiNow). If the
 * shift's scheduled check-in time hasn't occurred yet today, the check-in
 * still belongs to yesterday's shift window (e.g. a 9PM–6AM shift checked
 * into at 1AM belongs to the previous day's shift date).
 */
export const getAttendanceDate = (now, checkInTimeStr) => {
  let shiftDateStr = now.toLocaleDateString("en-GB");

  if (checkInTimeStr) {
    let [tp, mer] = checkInTimeStr.trim().split(" ");
    let [hh, mm] = tp.split(":").map(Number);
    if (mer?.toUpperCase() === "PM" && hh !== 12) hh += 12;
    if (mer?.toUpperCase() === "AM" && hh === 12) hh = 0;

    const shiftStart = new Date(now);
    shiftStart.setHours(hh, mm, 0, 0);

    if (now < shiftStart) {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      shiftDateStr = yesterday.toLocaleDateString("en-GB");
    }
  }

  return shiftDateStr;
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
