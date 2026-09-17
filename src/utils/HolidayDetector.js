import { getHolidaysForCountry, getSeasonForCountry } from "./holidayDatabase";

export async function detectCurrentEvent(countryCode = "NG") {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const todayStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  // 1. Fetch real-time official government holidays for the detected country
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2-second strict limit

    const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const liveHolidays = await res.json();
      
      // Look for a holiday match either today, tomorrow, or yesterday (Promotional window padding)
      const currentHoliday = liveHolidays.find((h) => {
        const hDate = new Date(h.date);
        const timeDiff = Math.abs(now.getTime() - hDate.getTime());
        const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return dayDiff <= 1; // True if holiday is yesterday, today, or tomorrow
      });

      if (currentHoliday) {
        return {
          id: currentHoliday.name.toLowerCase().replace(/\s+/g, "_"),
          name: currentHoliday.localName || currentHoliday.name,
          theme: mapHolidayNameToTheme(currentHoliday.name),
          country: countryCode,
          isLiveApi: true,
        };
      }
    }
  } catch (e) {
    console.warn("Holiday API Offline/Timed out. Gracefully falling back to local database.");
  }

  // 2. Local Database Fallback (e.g. multi-day commercial sales like Valentine, Black Friday, Christmas promo weeks)
  const localHolidays = getHolidaysForCountry(countryCode) || [];
  const currentKey = month * 100 + day;

  const matches = localHolidays.filter((h) => {
    const start = h.startMonth * 100 + h.startDay;
    const end = h.endMonth * 100 + h.endDay;
    if (start > end) return currentKey >= start || currentKey <= end;
    return currentKey >= start && currentKey <= end;
  });

  matches.sort((a, b) => (b.priority || 0) - (a.priority || 0));

  if (matches.length > 0) {
    return {
      ...matches[0],
      country: countryCode,
      isLiveApi: false,
    };
  }

  // 3. Climate Season Fallback (Rainy vs Dry/Harmattan, Summer vs Winter)
  return {
    ...getSeasonForCountry(countryCode),
    country: countryCode,
    isLiveApi: false,
  };
}

// Map various official API names to our custom stylized templates
function mapHolidayNameToTheme(name = "") {
  const n = name.toLowerCase();
  if (n.includes("christmas") || n.includes("xmas") || n.includes("boxing")) return "christmas";
  if (n.includes("new year")) return "newyear";
  if (n.includes("easter") || n.includes("good friday")) return "easter";
  if (n.includes("eid") || n.includes("fitr") || n.includes("adha") || n.includes("sallah") || n.includes("maulud")) return "eid";
  if (n.includes("diwali") || n.includes("deepavali")) return "diwali";
  if (n.includes("independence") || n.includes("democracy") || n.includes("national")) return "nigeria";
  if (n.includes("labor") || n.includes("labour") || n.includes("workers")) return "workers";
  if (n.includes("halloween")) return "halloween";
  if (n.includes("thanksgiving")) return "thanksgiving";
  return "default";
}

export default detectCurrentEvent;