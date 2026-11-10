// src/SEOTracker.jsx
//
// Your own first-party tracker (POST /analytics/track) + GA4, human visits only.
//
// - Nothing is sent until the visitor does something a bot can't fake
//   (a trusted touch / click / key / scroll event). Page views before that
//   moment are queued and sent the instant they prove human.
// - Obvious bots (webdriver, bot user-agents, headless) never send anything.
// - GA4 page views are handled through ./lib/analytics (same human gate), so
//   do NOT also call usePageTracking() anywhere, or GA4 would count twice.
// - Your own browser can be excluded: visit the site once with ?internal=1.

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackLead } from "./lib/analytics"; // adjust the path if analytics.js lives elsewhere

/* ── API URL (same safeguard as before) ── */
const getCleanApiUrl = () => {
  const rawUrl =
    import.meta.env?.VITE_API_URL ||
    (typeof process !== "undefined" &&
      (process.env?.REACT_APP_API_URL || process.env?.NEXT_PUBLIC_API_URL)) ||
    "http://localhost:5000/api";

  let clean = rawUrl.trim().replace(/\/+$/, "");
  if (!clean.endsWith("/api")) clean = `${clean}/api`;
  return clean;
};

const TRACK_URL = `${getCleanApiUrl()}/analytics/track`;

/* ── config ── */
const IS_DEV = Boolean(import.meta.env?.DEV);
const TRACK_IN_DEV = import.meta.env?.VITE_TRACK_DEV === "true"; // set to test the backend from localhost
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes of inactivity = new session

const INTERNAL_KEY = "75ts_internal";
const VISITOR_KEY = "75ts_vid";
const SESSION_KEY = "75ts_sid";
const SESSION_LAST_KEY = "75ts_sid_last";
const SOURCE_KEY = "75ts_source";
const LANDING_KEY = "75ts_landing";

const HUMAN_EVENTS = ["pointerdown", "pointermove", "touchstart", "keydown", "scroll", "wheel"];

const BOT_UA =
  /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|pingdom|uptime|facebookexternalhit|telegrambot|curl|wget|python-requests|axios|node-fetch|go-http|okhttp\/|java\//i;

/* ── safe storage ── */
const lsGet = (k) => { try { return window.localStorage.getItem(k); } catch { return null; } };
const lsSet = (k, v) => { try { window.localStorage.setItem(k, v); } catch { /* blocked */ } };
const ssGet = (k) => { try { return window.sessionStorage.getItem(k); } catch { return null; } };
const ssSet = (k, v) => { try { window.sessionStorage.setItem(k, v); } catch { /* blocked */ } };
const ssRemove = (k) => { try { window.sessionStorage.removeItem(k); } catch { /* blocked */ } };

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

/* ── guards ── */
const isInternalVisitor = () => {
  try {
    const flag = new URLSearchParams(window.location.search).get("internal");
    if (flag === "1") window.localStorage.setItem(INTERNAL_KEY, "1");
    if (flag === "0") window.localStorage.removeItem(INTERNAL_KEY);
    return window.localStorage.getItem(INTERNAL_KEY) === "1";
  } catch {
    return false;
  }
};

const looksLikeBot = () => {
  const nav = window.navigator;
  if (nav.webdriver) return true;
  if (BOT_UA.test(nav.userAgent || "")) return true;
  if (!nav.languages || nav.languages.length === 0) return true;
  if (!window.screen || !window.screen.width || !window.screen.height) return true;
  return false;
};

let allowedCache = null;
const isBackendAllowed = () => {
  if (allowedCache === null) {
    allowedCache = (!IS_DEV || TRACK_IN_DEV) && !isInternalVisitor() && !looksLikeBot();
  }
  return allowedCache;
};

/* ── visitor + session ids (anonymous, random) ── */
let memVisitor = null;
const getVisitorId = () => {
  let id = lsGet(VISITOR_KEY) || memVisitor;
  if (!id) {
    id = uid();
    lsSet(VISITOR_KEY, id);
  }
  memVisitor = id;
  return id;
};

let memSession = null;
const getSessionId = () => {
  const now = Date.now();
  let sid = ssGet(SESSION_KEY) || memSession;
  const last = Number(ssGet(SESSION_LAST_KEY) || 0);
  if (!sid || (last && now - last > SESSION_TTL_MS)) {
    sid = uid();
    ssSet(SESSION_KEY, sid);
    ssRemove(SOURCE_KEY); // new session = work out the source again
    ssSet(LANDING_KEY, window.location.pathname || "/");
  }
  memSession = sid;
  ssSet(SESSION_LAST_KEY, String(now));
  return sid;
};

/* ── traffic source (same labels your dashboard already uses) ── */
const hostIn = (host, list) => list.some((d) => host === d || host.endsWith(`.${d}`));
const hasLabel = (host, label) => host.split(".").includes(label);

const AI_HOSTS = [
  "chatgpt.com", "openai.com", "claude.ai", "perplexity.ai", "copilot.microsoft.com",
  "gemini.google.com", "grok.com", "deepseek.com", "meta.ai",
];

const detectTrafficSource = () => {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  const utmCampaign = params.get("utm_campaign");

  // Custom campaign URL
  if (utmSource) {
    return `🎯 Campaign: ${utmSource}${utmCampaign ? ` (${utmCampaign})` : ""}`;
  }

  let host = "";
  try {
    host = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : "";
  } catch {
    host = "";
  }

  // A referrer from your own site is not a real source
  const own = window.location.hostname.replace(/^www\./, "");
  if (host && (host === own || host.endsWith(`.${own}`))) host = "";

  if (host) {
    // AI engines first (gemini.google.com must not count as Google Search)
    if (hostIn(host, AI_HOSTS)) return "🤖 AI Search Engines";

    // Search engines
    if (hasLabel(host, "google")) return "🔍 Google Search";
    if (hasLabel(host, "bing")) return "🔍 Bing Search";
    if (hasLabel(host, "yahoo")) return "🔍 Yahoo Search";
    if (hasLabel(host, "duckduckgo")) return "🔍 DuckDuckGo";

    // WhatsApp
    if (host.includes("whatsapp") || hostIn(host, ["wa.me", "l.wl.co"])) return "💬 WhatsApp";

    // Social media
    if (host.includes("instagram")) return "📸 Instagram";
    if (host.includes("facebook") || hostIn(host, ["fb.me"])) return "🌐 Facebook";
    if (host.includes("tiktok")) return "🎵 TikTok";
    if (hostIn(host, ["t.co", "twitter.com", "x.com"])) return "🐦 X / Twitter";
    if (host.includes("linkedin") || hostIn(host, ["lnkd.in"])) return "💼 LinkedIn";
    if (host.includes("youtube") || hostIn(host, ["youtu.be"])) return "▶️ YouTube";

    return `🔗 Referral (${host})`;
  }

  // No referrer: social in-app browsers often hide it, but the user-agent gives them away
  const ua = navigator.userAgent || "";
  if (/Instagram/i.test(ua)) return "📸 Instagram";
  if (/FBAN|FBAV/i.test(ua)) return "🌐 Facebook";
  if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return "🎵 TikTok";

  return "📱 Direct Traffic";
};

// Worked out once per session, so every page of a visit keeps the same source.
const getSource = () => {
  const stored = ssGet(SOURCE_KEY);
  const hasUtm = new URLSearchParams(window.location.search).has("utm_source");
  if (stored && !hasUtm) return stored;
  const src = detectTrafficSource();
  ssSet(SOURCE_KEY, src);
  return src;
};

const detectDevice = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) return "Mobile";
  return "Desktop";
};

/* ── sending ── */
const basePayload = () => {
  const sessionId = getSessionId(); // must run first: it may start a new session
  return {
    visitorId: getVisitorId(),
    sessionId,
    human: true,
    device: detectDevice(),
    source: getSource(),
    referrer: document.referrer || "Direct",
    landingPage: ssGet(LANDING_KEY) || window.location.pathname || "/",
  };
};

const post = (payload) => {
  try {
    // keepalive lets the request finish even when the click navigates away (tel:, WhatsApp, etc.)
    fetch(TRACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  } catch {
    /* never break the site because of analytics */
  }
};

let human = false;
let pending = [];

const markHuman = (e) => {
  if (human || (e && e.isTrusted === false)) return; // ignore script-generated events
  human = true;
  HUMAN_EVENTS.forEach((evt) => window.removeEventListener(evt, markHuman, true));
  pending.forEach(post);
  pending = [];
};

const sendOrQueue = (payload) => {
  if (human) post(payload);
  else if (pending.length < 20) pending.push(payload);
};

/* ── use this for form leads (repair request, contact form, swap, VIP, newsletter…) ──
   Example:  trackLeadEvent("repair_request")
   Sends to GA4 (generate_lead) and to your own backend. */
export function trackLeadEvent(leadType, extra = {}) {
  trackLead(leadType, extra);
  if (!isBackendAllowed()) return;
  if ((window.location.pathname || "").startsWith("/admin")) return;
  post({
    eventType: "lead",
    leadType,
    page: window.location.pathname || "/",
    ...basePayload(),
    trafficSource: getSource(),
    source: "📝 Form Lead",
  });
}

/* ── component: mount once, inside <Router> ── */
export default function SEOTracker() {
  const location = useLocation();

  // 1. Human detection + lead-link clicks (set up once)
  useEffect(() => {
    if (!isBackendAllowed()) return undefined;

    if (!human) {
      HUMAN_EVENTS.forEach((evt) =>
        window.addEventListener(evt, markHuman, { capture: true, passive: true })
      );
    }

    const handleGlobalClick = (e) => {
      if (!e.isTrusted) return;
      const link = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!link) return;
      if ((window.location.pathname || "").startsWith("/admin")) return;

      const href = (link.getAttribute("href") || "").toLowerCase();
      let eventType = null;
      let label = null;

      if (href.includes("wa.me") || href.includes("whatsapp.com")) {
        eventType = "whatsapp_click";
        label = "💬 WhatsApp Chat Click";
      } else if (href.startsWith("tel:")) {
        eventType = "call_click";
        label = "📞 Phone Call Click";
      } else if (href.startsWith("mailto:")) {
        eventType = "email_click";
        label = "✉️ Email Click";
      }
      if (!eventType) return;

      markHuman(e); // a real click is proof of a human; flushes queued page views first
      post({
        eventType,
        page: window.location.pathname || "/",
        ...basePayload(),
        trafficSource: getSource(), // the visitor's real source, so you can see which channel produced the lead
        source: label, // kept the same as before so your dashboard still works
      });
    };

    document.addEventListener("click", handleGlobalClick, true);
    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
      HUMAN_EVENTS.forEach((evt) => window.removeEventListener(evt, markHuman, true));
    };
  }, []);

  // 2. Page views (GA4 + your backend)
  useEffect(() => {
    const path = location.pathname || "/";

    // Never track admin panel pages
    if (path.startsWith("/admin")) return;

    // GA4 — has its own human gate and bot/internal/dev guards
    trackPageView(path + location.search);

    // Your backend
    if (!isBackendAllowed()) return;

    // Ignore a duplicate of the same page within one second
    const now = Date.now();
    const last = SEOTracker.lastPv || {};
    if (last.path === path && now - last.t < 1000) return;
    SEOTracker.lastPv = { path, t: now };

    sendOrQueue({
      eventType: "pageview",
      page: path,
      ...basePayload(),
    });
  }, [location.pathname, location.search]);

  return null;
}