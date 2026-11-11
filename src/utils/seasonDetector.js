// src/utils/seasonDetector.js
// ─────────────────────────────────────────────────────────────
// Smart Season & Event Detector for 75TechStore
//
// Priority system:
//   1. Backend admin override (highest — always wins)
//   2. Fixed-date holidays (Christmas, Valentine, etc.)
//   3. Approximate cultural events (Diwali, Holi, etc.)
//   4. Regional seasons (Harmattan, Rainy)
//   5. Global seasons (Spring, Summer, Autumn, Winter)
//   6. Default fallback (lowest)
//
// Variable-date events (Eid, Ramadan, Diwali, Lunar New Year)
// shift every year. Set approximate windows here, but let
// your admin dashboard override for exact dates.
// ─────────────────────────────────────────────────────────────

/**
 * @typedef {Object} EventWindow
 * @property {string}   theme    - Theme key matching SEASONAL_THEMES
 * @property {number}   priority - Higher = wins over lower (1-100)
 * @property {number}   startMonth - 1-12
 * @property {number}   startDay   - 1-31
 * @property {number}   endMonth   - 1-12
 * @property {number}   endDay     - 1-31
 * @property {string}   [region]   - Optional region tag for geo-targeting
 */

const EVENT_CALENDAR = [

  // ── PRIORITY 90-100 : Major Shopping Events ──────────────
  { theme: "blackfriday",   priority: 100, startMonth: 11, startDay: 20, endMonth: 11, endDay: 29 },
  { theme: "cybermonday",   priority: 99,  startMonth: 11, startDay: 30, endMonth: 12, endDay: 3  },
  { theme: "christmas",     priority: 95,  startMonth: 12, startDay: 1,  endMonth: 12, endDay: 26 },
  { theme: "newyear",       priority: 93,  startMonth: 12, startDay: 27, endMonth: 1,  endDay: 5  },
  { theme: "thanksgiving",  priority: 91,  startMonth: 11, startDay: 20, endMonth: 11, endDay: 28, region: "us" },

  // ── PRIORITY 70-89 : Fixed-Date Holidays ─────────────────
  { theme: "valentine",     priority: 85,  startMonth: 2,  startDay: 1,  endMonth: 2,  endDay: 15 },
  { theme: "halloween",     priority: 80,  startMonth: 10, startDay: 15, endMonth: 10, endDay: 31 },
  { theme: "easter",        priority: 78,  startMonth: 3,  startDay: 25, endMonth: 4,  endDay: 15 },
  { theme: "womensday",     priority: 75,  startMonth: 3,  startDay: 5,  endMonth: 3,  endDay: 10 },
  { theme: "workers",       priority: 74,  startMonth: 4,  startDay: 28, endMonth: 5,  endDay: 3  },
  { theme: "earthday",      priority: 72,  startMonth: 4,  startDay: 19, endMonth: 4,  endDay: 24 },
  { theme: "usa",           priority: 76,  startMonth: 7,  startDay: 1,  endMonth: 7,  endDay: 7,  region: "us" },
  { theme: "nigeria",       priority: 76,  startMonth: 10, startDay: 1,  endMonth: 10, endDay: 3,  region: "ng" },
  { theme: "india",         priority: 76,  startMonth: 8,  startDay: 13, endMonth: 8,  endDay: 17, region: "in" },

  // ── PRIORITY 50-69 : Variable Cultural Events ────────────
  // ⚠️  These dates SHIFT yearly. Override from admin dashboard
  //     for precision. These are safe approximate windows.
  { theme: "ramadan",       priority: 68,  startMonth: 2,  startDay: 20, endMonth: 3,  endDay: 25 },
  { theme: "eid",           priority: 67,  startMonth: 3,  startDay: 25, endMonth: 4,  endDay: 5  },
  { theme: "diwali",        priority: 65,  startMonth: 10, startDay: 20, endMonth: 11, endDay: 5  },
  { theme: "holi",          priority: 63,  startMonth: 3,  startDay: 10, endMonth: 3,  endDay: 20 },
  { theme: "chinesenewyear",priority: 64,  startMonth: 1,  startDay: 20, endMonth: 2,  endDay: 10 },
  { theme: "carnival",      priority: 60,  startMonth: 2,  startDay: 10, endMonth: 2,  endDay: 25 },

  // ── PRIORITY 30-49 : Regional Seasons ────────────────────
  { theme: "harmattan",     priority: 40,  startMonth: 11, startDay: 1,  endMonth: 2,  endDay: 28, region: "ng" },
  { theme: "rainy",         priority: 38,  startMonth: 4,  startDay: 1,  endMonth: 10, endDay: 31, region: "ng" },

  // ── PRIORITY 10-29 : Global Seasons ──────────────────────
  { theme: "spring",        priority: 20,  startMonth: 3,  startDay: 1,  endMonth: 5,  endDay: 31 },
  { theme: "summer",        priority: 20,  startMonth: 6,  startDay: 1,  endMonth: 8,  endDay: 31 },
  { theme: "autumn",        priority: 20,  startMonth: 9,  startDay: 1,  endMonth: 11, endDay: 30 },
  { theme: "winter",        priority: 20,  startMonth: 12, startDay: 1,  endMonth: 2,  endDay: 28 },
];


// ─────────────────────────────────────────────────────────────
//  CORE DETECTION
// ─────────────────────────────────────────────────────────────

/**
 * Check if a given date falls inside an event window.
 * Handles year-wrapping (e.g. Dec 27 → Jan 5).
 */
function isDateInWindow(date, event) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const current = m * 100 + d;           // e.g. Dec 25 → 1225
  const start = event.startMonth * 100 + event.startDay;
  const end = event.endMonth * 100 + event.endDay;

  if (start <= end) {
    return current >= start && current <= end;
  }
  // Wraps around New Year (e.g. Dec 27 → Jan 5)
  return current >= start || current <= end;
}


/**
 * Detect the active theme for the current date.
 *
 * @param {Object}  [options]
 * @param {string}  [options.adminOverride]  - Theme key set in admin dashboard
 * @param {string}  [options.region]         - User's region code ("us", "ng", "in", etc.)
 * @param {Date}    [options.date]           - Override date (useful for testing)
 * @returns {string} The winning theme key
 */
export function detectActiveTheme({ adminOverride, region, date } = {}) {

  // 1. Admin override always wins
  if (adminOverride && adminOverride !== "auto") {
    return adminOverride;
  }

  const today = date || new Date();

  // 2. Find all matching events for today
  const matches = EVENT_CALENDAR
    .filter((event) => {
      // Filter by region if the event is region-specific
      if (event.region && region && event.region !== region) {
        return false;
      }
      return isDateInWindow(today, event);
    })
    // 3. Sort by priority descending — highest wins
    .sort((a, b) => b.priority - a.priority);

  // 4. Return the top match, or "default"
  return matches.length > 0 ? matches[0].theme : "default";
}


/**
 * Get a preview of upcoming events (useful for admin dashboard).
 *
 * @param {number} [daysAhead=60] - How far to look ahead
 * @returns {Array<{theme: string, start: string, end: string, priority: number}>}
 */
export function getUpcomingEvents(daysAhead = 60) {
  const now = new Date();
  const future = new Date(now);
  future.setDate(future.getDate() + daysAhead);

  return EVENT_CALENDAR
    .filter((event) => {
      // Simple check: does the event window overlap with [now, future]?
      const testDates = [];
      for (let d = new Date(now); d <= future; d.setDate(d.getDate() + 1)) {
        testDates.push(new Date(d));
      }
      return testDates.some((d) => isDateInWindow(d, event));
    })
    .sort((a, b) => b.priority - a.priority)
    .map(({ theme, priority, startMonth, startDay, endMonth, endDay }) => ({
      theme,
      priority,
      start: `${String(startMonth).padStart(2, "0")}-${String(startDay).padStart(2, "0")}`,
      end: `${String(endMonth).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`,
    }));
}


/**
 * Get ALL theme keys grouped by category (for admin dashboard dropdowns).
 */
export function getThemeGroups() {
  return {
    holidays:  ["christmas", "blackfriday", "valentine", "newyear", "halloween", "easter"],
    cultural:  ["nigeria", "eid", "ramadan", "diwali", "holi", "india", "usa", "thanksgiving", "cybermonday", "chinesenewyear", "carnival"],
    seasons:   ["harmattan", "rainy", "spring", "summer", "autumn", "winter"],
    special:   ["womensday", "workers", "earthday"],
    fallback:  ["default"],
  };
}