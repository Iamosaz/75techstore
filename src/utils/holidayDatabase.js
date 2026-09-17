// src/utils/holidayDatabase.js

// 🌍 Region definitions
export const REGIONS = {
  WEST_AFRICA: ["NG", "GH", "SN", "CI", "CM", "BJ", "TG", "NE", "ML", "BF"],
  EAST_AFRICA: ["KE", "TZ", "UG", "ET", "RW"],
  NORTH_AFRICA: ["EG", "MA", "DZ", "TN", "LY"],
  SOUTH_AFRICA: ["ZA", "BW", "ZW", "MZ"],
  MIDDLE_EAST: ["SA", "AE", "QA", "KW", "BH", "OM", "IQ", "JO", "LB", "PS"],
  SOUTH_ASIA: ["IN", "PK", "BD", "LK", "NP"],
  EAST_ASIA: ["CN", "JP", "KR", "TW", "HK"],
  SOUTHEAST_ASIA: ["ID", "MY", "PH", "TH", "VN", "SG"],
  EUROPE: ["GB", "DE", "FR", "IT", "ES", "NL", "BE", "PT", "SE", "NO", "DK", "FI", "PL", "CZ", "AT", "CH", "IE", "GR", "RO", "HU"],
  NORTH_AMERICA: ["US", "CA", "MX"],
  SOUTH_AMERICA: ["BR", "AR", "CO", "CL", "PE", "VE", "EC"],
  OCEANIA: ["AU", "NZ", "FJ"],
};

export function getRegionForCountry(countryCode) {
  for (const [region, countries] of Object.entries(REGIONS)) {
    if (countries.includes(countryCode)) return region;
  }
  return "GLOBAL";
}

// 🌐 Global Holidays (Apply Everywhere)
export const GLOBAL_HOLIDAYS = [
  {
    id: "newyear",
    name: "New Year",
    startMonth: 1, startDay: 1,
    endMonth: 1, endDay: 3,
    theme: "newyear",
    priority: 10,
  },
  {
    id: "newyeareve",
    name: "New Year's Eve",
    startMonth: 12, startDay: 30,
    endMonth: 12, endDay: 31,
    theme: "newyear",
    priority: 10,
  },
  {
    id: "valentine",
    name: "Valentine's Day",
    startMonth: 2, startDay: 10,
    endMonth: 2, endDay: 16,
    theme: "valentine",
    priority: 8,
  },
  {
    id: "womensday",
    name: "International Women's Day",
    startMonth: 3, startDay: 6,
    endMonth: 3, endDay: 10,
    theme: "womensday",
    priority: 7,
  },
  {
    id: "earthday",
    name: "Earth Day",
    startMonth: 4, startDay: 20,
    endMonth: 4, endDay: 24,
    theme: "earthday",
    priority: 5,
  },
  {
    id: "workersday",
    name: "International Workers' Day",
    startMonth: 5, startDay: 1,
    endMonth: 5, endDay: 2,
    theme: "workers",
    priority: 6,
  },
];

// 🇳🇬 Nigeria Holidays
export const NIGERIA_HOLIDAYS = [
  {
    id: "ng_democracy",
    name: "Democracy Day",
    startMonth: 6, startDay: 10,
    endMonth: 6, endDay: 14,
    theme: "nigeria",
    priority: 9,
  },
  {
    id: "ng_independence",
    name: "Nigeria Independence Day",
    startMonth: 10, startDay: 1,
    endMonth: 10, endDay: 3,
    theme: "nigeria",
    priority: 10,
  },
  {
    id: "ng_sallah",
    name: "Eid al-Fitr (Sallah)",
    startMonth: 3, startDay: 28,
    endMonth: 4, endDay: 2,
    theme: "eid",
    priority: 10,
  },
  {
    id: "ng_eidha",
    name: "Eid al-Adha",
    startMonth: 6, startDay: 6,
    endMonth: 6, endDay: 9,
    theme: "eid",
    priority: 10,
  },
];

// 🇺🇸 USA Holidays
export const USA_HOLIDAYS = [
  {
    id: "us_independence",
    name: "4th of July",
    startMonth: 7, startDay: 2,
    endMonth: 7, endDay: 5,
    theme: "usa",
    priority: 9,
  },
  {
    id: "us_thanksgiving",
    name: "Thanksgiving",
    startMonth: 11, startDay: 22,
    endMonth: 11, endDay: 29,
    theme: "thanksgiving",
    priority: 9,
  },
  {
    id: "us_blackfriday",
    name: "Black Friday",
    startMonth: 11, startDay: 24,
    endMonth: 12, endDay: 2,
    theme: "blackfriday",
    priority: 10,
  },
  {
    id: "us_cybermonday",
    name: "Cyber Monday",
    startMonth: 12, startDay: 1,
    endMonth: 12, endDay: 3,
    theme: "cybermonday",
    priority: 10,
  },
];

// 🇬🇧 UK Holidays
export const UK_HOLIDAYS = [
  {
    id: "uk_boxingday",
    name: "Boxing Day",
    startMonth: 12, startDay: 26,
    endMonth: 12, endDay: 28,
    theme: "boxingday",
    priority: 9,
  },
  {
    id: "uk_bankholiday",
    name: "Bank Holiday Sale",
    startMonth: 5, startDay: 26,
    endMonth: 5, endDay: 28,
    theme: "bankholiday",
    priority: 7,
  },
];

// 🇮🇳 India Holidays
export const INDIA_HOLIDAYS = [
  {
    id: "in_diwali",
    name: "Diwali Festival",
    startMonth: 10, startDay: 28,
    endMonth: 11, endDay: 5,
    theme: "diwali",
    priority: 10,
  },
  {
    id: "in_holi",
    name: "Holi Festival",
    startMonth: 3, startDay: 22,
    endMonth: 3, endDay: 27,
    theme: "holi",
    priority: 9,
  },
  {
    id: "in_independence",
    name: "Independence Day",
    startMonth: 8, startDay: 14,
    endMonth: 8, endDay: 16,
    theme: "india",
    priority: 9,
  },
];

// 🌙 Middle East / Islamic
export const MIDDLE_EAST_HOLIDAYS = [
  {
    id: "me_eidfitr",
    name: "Eid al-Fitr",
    startMonth: 3, startDay: 28,
    endMonth: 4, endDay: 3,
    theme: "eid",
    priority: 10,
  },
  {
    id: "me_eidadha",
    name: "Eid al-Adha",
    startMonth: 6, startDay: 6,
    endMonth: 6, endDay: 10,
    theme: "eid",
    priority: 10,
  },
  {
    id: "me_ramadan",
    name: "Ramadan Deals",
    startMonth: 2, startDay: 28,
    endMonth: 3, endDay: 28,
    theme: "ramadan",
    priority: 9,
  },
];

// 🎄 General Western / Christian Holidays
export const CHRISTIAN_HOLIDAYS = [
  {
    id: "christmas",
    name: "Christmas Season",
    startMonth: 12, startDay: 15,
    endMonth: 12, endDay: 27,
    theme: "christmas",
    priority: 10,
  },
  {
    id: "easter",
    name: "Easter Holiday",
    startMonth: 3, startDay: 28,
    endMonth: 4, endDay: 3,
    theme: "easter",
    priority: 8,
  },
];

export const WESTERN_HOLIDAYS = [
  {
    id: "halloween",
    name: "Halloween",
    startMonth: 10, startDay: 28,
    endMonth: 11, endDay: 1,
    theme: "halloween",
    priority: 8,
  },
  {
    id: "blackfriday_global",
    name: "Black Friday",
    startMonth: 11, startDay: 20,
    endMonth: 12, endDay: 1,
    theme: "blackfriday",
    priority: 10,
  },
];

// 📦 Map country code to holiday lists
export const COUNTRY_HOLIDAYS = {
  NG: [...GLOBAL_HOLIDAYS, ...NIGERIA_HOLIDAYS, ...CHRISTIAN_HOLIDAYS, ...WESTERN_HOLIDAYS],
  GH: [...GLOBAL_HOLIDAYS, ...CHRISTIAN_HOLIDAYS, ...WESTERN_HOLIDAYS],
  US: [...GLOBAL_HOLIDAYS, ...USA_HOLIDAYS, ...CHRISTIAN_HOLIDAYS, ...WESTERN_HOLIDAYS],
  CA: [...GLOBAL_HOLIDAYS, ...USA_HOLIDAYS, ...CHRISTIAN_HOLIDAYS, ...WESTERN_HOLIDAYS],
  GB: [...GLOBAL_HOLIDAYS, ...UK_HOLIDAYS, ...CHRISTIAN_HOLIDAYS, ...WESTERN_HOLIDAYS],
  IN: [...GLOBAL_HOLIDAYS, ...INDIA_HOLIDAYS, ...WESTERN_HOLIDAYS],
  PK: [...GLOBAL_HOLIDAYS, ...MIDDLE_EAST_HOLIDAYS],
  SA: [...GLOBAL_HOLIDAYS, ...MIDDLE_EAST_HOLIDAYS],
  AE: [...GLOBAL_HOLIDAYS, ...MIDDLE_EAST_HOLIDAYS],
  ZA: [...GLOBAL_HOLIDAYS, ...CHRISTIAN_HOLIDAYS, ...WESTERN_HOLIDAYS],
};

// ✅ Exported function for finding country holidays
export function getHolidaysForCountry(countryCode = "NG") {
  return (
    COUNTRY_HOLIDAYS[countryCode] || [
      ...GLOBAL_HOLIDAYS,
      ...WESTERN_HOLIDAYS,
      ...CHRISTIAN_HOLIDAYS,
    ]
  );
}

// ✅ Exported function for finding seasons
export function getSeasonForCountry(countryCode = "NG") {
  const now = new Date();
  const month = now.getMonth() + 1;

  const southernHemisphere = ["AU", "NZ", "ZA", "BR", "AR", "CL"];
  const tropicalCountries = [
    "NG", "GH", "KE", "TZ", "IN", "ID", "MY",
    "PH", "TH", "SG", "CM", "CI",
  ];

  if (tropicalCountries.includes(countryCode)) {
    if ([4, 5, 6, 7, 8, 9, 10].includes(month)) {
      return { id: "rainy", name: "Rainy Season", theme: "rainy" };
    }
    return { id: "harmattan", name: "Dry Season", theme: "harmattan" };
  }

  if (southernHemisphere.includes(countryCode)) {
    if ([12, 1, 2].includes(month)) return { id: "summer", name: "Summer", theme: "summer" };
    if ([3, 4, 5].includes(month)) return { id: "autumn", name: "Autumn", theme: "autumn" };
    if ([6, 7, 8].includes(month)) return { id: "winter", name: "Winter", theme: "winter" };
    return { id: "spring", name: "Spring", theme: "spring" };
  }

  if ([12, 1, 2].includes(month)) return { id: "winter", name: "Winter", theme: "winter" };
  if ([3, 4, 5].includes(month)) return { id: "spring", name: "Spring", theme: "spring" };
  if ([6, 7, 8].includes(month)) return { id: "summer", name: "Summer", theme: "summer" };
  return { id: "autumn", name: "Autumn", theme: "autumn" };
}

export default {
  REGIONS,
  GLOBAL_HOLIDAYS,
  COUNTRY_HOLIDAYS,
  getHolidaysForCountry,
  getSeasonForCountry,
  getRegionForCountry,
};