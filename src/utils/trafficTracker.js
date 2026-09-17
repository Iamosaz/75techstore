// src/utils/trafficTracker.js

// Generate or retrieve anonymous session ID
function getSessionId() {
  let id = sessionStorage.getItem("75tech_analytics_session");
  if (!id) {
    id = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem("75tech_analytics_session", id);
  }
  return id;
}

// Automatically collect page view or custom action
export async function trackEvent(eventName = "page_view", extraData = {}) {
  try {
    const sessionId = getSessionId();
    const urlParams = new URLSearchParams(window.location.search);

    // Save initial referrer permanently in session
    let initialReferrer = sessionStorage.getItem("75tech_referrer");
    if (!initialReferrer) {
      initialReferrer = document.referrer || "Direct";
      sessionStorage.setItem("75tech_referrer", initialReferrer);
    }

    const payload = {
      sessionId,
      path: window.location.pathname,
      referrer: initialReferrer,
      utmSource: urlParams.get("utm_source") || undefined,
      utmMedium: urlParams.get("utm_medium") || undefined,
      utmCampaign: urlParams.get("utm_campaign") || undefined,
      country: localStorage.getItem("75tech_country_override") || "NG",
      event: {
        name: eventName,
        ...extraData,
      },
    };

    // Send beacon to backend (never slows down page)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/collect", blob);
    } else {
      fetch("/api/analytics/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently so customer experience is never interrupted
  }
}