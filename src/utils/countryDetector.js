// 🌍 Detects user's country via free IP APIs
// Falls back to browser language, then manual override

const IP_APIS = [
  {
    url: "https://ipapi.co/json/",
    extract: (data) => data.country_code,
  },
  {
    url: "https://ip-api.com/json/?fields=countryCode",
    extract: (data) => data.countryCode,
  },
  {
    url: "https://ipinfo.io/json?token=",   // Free tier
    extract: (data) => data.country,
  },
];

// Language → Country fallback map
const LANGUAGE_COUNTRY_MAP = {
  "en-US": "US", "en-GB": "GB", "en-NG": "NG", "en-GH": "GH",
  "en-KE": "KE", "en-ZA": "ZA", "en-AU": "AU", "en-CA": "CA",
  "en-IN": "IN", "fr-FR": "FR", "de-DE": "DE", "es-ES": "ES",
  "pt-BR": "BR", "ar-SA": "SA", "ar-AE": "AE", "ar-EG": "EG",
  "hi-IN": "IN", "zh-CN": "CN", "ja-JP": "JP", "ko-KR": "KR",
  "id-ID": "ID", "ms-MY": "MY", "th-TH": "TH", "vi-VN": "VN",
};

function getCountryFromLanguage() {
  const lang = navigator.language || navigator.userLanguage || "en-US";
  return LANGUAGE_COUNTRY_MAP[lang] || LANGUAGE_COUNTRY_MAP[lang.split("-")[0]] || null;
}

export async function detectCountry() {
  // 1. Check if admin has set an override
  const override = localStorage.getItem("75tech_country_override");
  if (override) return override;

  // 2. Check cached result
  const cached = sessionStorage.getItem("75tech_detected_country");
  if (cached) return cached;

  // 3. Try IP-based detection
  for (const api of IP_APIS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(api.url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const code = api.extract(data);
        if (code && code.length === 2) {
          sessionStorage.setItem("75tech_detected_country", code);
          return code;
        }
      }
    } catch {
      continue; // Try next API
    }
  }

  // 4. Fallback to browser language
  const langCountry = getCountryFromLanguage();
  if (langCountry) {
    sessionStorage.setItem("75tech_detected_country", langCountry);
    return langCountry;
  }

  // 5. Ultimate fallback
  return "NG"; // Default to Nigeria for 75TechStore
}