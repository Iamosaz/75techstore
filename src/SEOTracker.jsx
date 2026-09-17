// src/SEOTracker.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function SEOTracker() {
  const location = useLocation();

  // ── 1. Track Pageviews & Traffic Channels ──
  useEffect(() => {
    // Never track admin panel pages
    if (location.pathname.startsWith("/admin")) return;

    const detectTrafficSource = () => {
      const ref = (document.referrer || "").toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);
      const utmSource = searchParams.get("utm_source");
      const utmCampaign = searchParams.get("utm_campaign");

      // Custom Campaign URL
      if (utmSource) {
        return `🎯 Campaign: ${utmSource}${utmCampaign ? ` (${utmCampaign})` : ""}`;
      }

      // Search Engines
      if (ref.includes("google.")) return "🔍 Google Search";
      if (ref.includes("bing.")) return "🔍 Bing Search";
      if (ref.includes("yahoo.")) return "🔍 Yahoo Search";
      if (ref.includes("duckduckgo.")) return "🔍 DuckDuckGo";

      // AI Search Engines
      if (
        ref.includes("chatgpt.com") ||
        ref.includes("openai.com") ||
        ref.includes("claude.ai") ||
        ref.includes("perplexity.ai") ||
        ref.includes("copilot.microsoft.com") ||
        ref.includes("gemini.google.com")
      ) {
        return "🤖 AI Search Engines";
      }

      // WhatsApp
      if (ref.includes("whatsapp") || ref.includes("wa.me")) {
        return "💬 WhatsApp";
      }

      // Social Media
      if (ref.includes("instagram.com")) return "📸 Instagram";
      if (ref.includes("facebook.com") || ref.includes("fb.me")) return "🌐 Facebook";
      if (ref.includes("tiktok.com")) return "🎵 TikTok";
      if (ref.includes("t.co") || ref.includes("twitter.com") || ref.includes("x.com")) return "🐦 X / Twitter";
      if (ref.includes("linkedin.com")) return "💼 LinkedIn";
      if (ref.includes("youtube.com")) return "▶️ YouTube";

      // External Referrals
      if (ref && !ref.includes(window.location.host)) {
        try {
          return `🔗 Referral (${new URL(ref).hostname})`;
        } catch {
          return "🔗 External Referral";
        }
      }

      // Direct Traffic
      return "📱 Direct Traffic";
    };

    const detectDevice = () => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Tablet";
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
        return "Mobile";
      }
      return "Desktop";
    };

    // Send tracking data silently
    axios
      .post(`${API_URL}/analytics/track`, {
        eventType: "pageview",
        page: location.pathname || "/",
        source: detectTrafficSource(),
        device: detectDevice(),
        referrer: document.referrer || "Direct",
      })
      .catch(() => {});
  }, [location.pathname, location.search]);

  // ── 2. Track WhatsApp Lead Button Clicks ──
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const link = e.target.closest("a");
      if (
        link &&
        link.href &&
        (link.href.includes("wa.me") || link.href.includes("whatsapp.com") || link.href.includes("api.whatsapp.com"))
      ) {
        axios
          .post(`${API_URL}/analytics/track`, {
            eventType: "whatsapp_click",
            page: window.location.pathname || "/",
            source: "💬 WhatsApp Chat Click",
            device: /Mobile/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
          })
          .catch(() => {});
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return null;
}