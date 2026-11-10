// src/lib/analytics.js
//
// Human-only visit analytics + lead tracking for GA4.
//
// How "human" is decided:
//   1. Obvious bots are rejected up front (webdriver flag, bot user-agents,
//      no languages, zero-size screen).
//   2. Nothing is sent to GA4 until a REAL user interaction happens
//      (a trusted pointer / touch / key / scroll event). Crawlers, link
//      previewers and uptime monitors that load the page but never interact
//      are never counted.
//   3. Page views that happened before the first interaction are queued and
//      sent the moment the visitor proves they are human.
//
// Result: every page_view in GA4 is a human page view, and every
// generate_lead event is a real click or submission.

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // remove this + usePageTracking if you don't use react-router

const GA_ID = import.meta.env.VITE_GA_ID; // e.g. G-XXXXXXXXXX
const DEBUG = import.meta.env.VITE_GA_DEBUG === 'true'; // lets you test on localhost
const ALLOWED = import.meta.env.PROD || DEBUG;

const BOT_UA =
  /bot|crawl|spider|slurp|headless|phantom|puppeteer|playwright|selenium|lighthouse|pagespeed|gtmetrix|pingdom|uptime|facebookexternalhit|telegrambot|curl|wget|python-requests|axios|node-fetch|go-http|okhttp\/|java\//i;

const INTERNAL_KEY = '75ts_internal';
const HUMAN_EVENTS = ['pointerdown', 'pointermove', 'touchstart', 'keydown', 'scroll', 'wheel'];

let initialized = false;
let enabled = false;
let human = false;
let queue = [];
let lastLocation = typeof document !== 'undefined' ? document.referrer : '';

/* ── guards ── */

function isInternal() {
  // Visit your site once with ?internal=1 to exclude your own browser forever.
  // Use ?internal=0 to switch tracking back on.
  try {
    const flag = new URLSearchParams(window.location.search).get('internal');
    if (flag === '1') localStorage.setItem(INTERNAL_KEY, '1');
    if (flag === '0') localStorage.removeItem(INTERNAL_KEY);
    return localStorage.getItem(INTERNAL_KEY) === '1';
  } catch {
    return false;
  }
}

function looksLikeBot() {
  const nav = window.navigator;
  if (nav.webdriver) return true;
  if (BOT_UA.test(nav.userAgent || '')) return true;
  if (!nav.languages || nav.languages.length === 0) return true;
  if (!window.screen || !window.screen.width || !window.screen.height) return true;
  return false;
}

/* ── core sending ── */

function gtag() {
  window.dataLayer.push(arguments); // GA requires the `arguments` object
}

function send(name, params = {}, { force = false } = {}) {
  if (!enabled) return;
  if (human || force) {
    gtag('event', name, params);
  } else if (queue.length < 20) {
    queue.push([name, params]);
  }
}

function markHuman(e) {
  if (human || (e && e.isTrusted === false)) return; // ignore script-generated events
  human = true;
  HUMAN_EVENTS.forEach((evt) => window.removeEventListener(evt, markHuman, true));
  gtag('set', 'user_properties', { visitor_type: 'human' });
  queue.forEach(([name, params]) => gtag('event', name, params));
  queue = [];
}

/* ── init: call once in main.jsx before rendering ── */

export function initAnalytics() {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (!GA_ID || !ALLOWED || isInternal() || looksLikeBot()) return;
  enabled = true;

  window.dataLayer = window.dataLayer || [];
  gtag('js', new Date());
  gtag('config', GA_ID, { send_page_view: false, ...(DEBUG ? { debug_mode: true } : {}) });

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  HUMAN_EVENTS.forEach((evt) =>
    window.addEventListener(evt, markHuman, { capture: true, passive: true })
  );

  setupAutoLeadTracking();
}

/* ── page views (SPA) ── */

export function trackPageView(path) {
  if (!enabled) return;
  // Capture the location now; the title is read slightly later so Helmet has updated it.
  const page_location = window.location.href;
  const page_referrer = lastLocation;
  lastLocation = page_location;
  setTimeout(() => {
    send('page_view', {
      page_location,
      page_path: path || window.location.pathname,
      page_title: document.title,
      page_referrer,
    });
  }, 150);
}

// Use once inside your <Router>, e.g. in App.jsx:  usePageTracking();
export function usePageTracking() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    trackPageView(pathname + search);
  }, [pathname, search]);
}

/* ── leads ── */

// lead_type examples: phone_call, whatsapp, email, repair_request,
// engineer_request, swap_start, contact_form, newsletter, vip_signup, seller_signup
export function trackLead(leadType, extra = {}) {
  send('generate_lead', { lead_type: leadType, currency: 'NGN', ...extra });
}

// Automatically counts clicks on call / WhatsApp / email links. No component changes needed.
function setupAutoLeadTracking() {
  document.addEventListener(
    'click',
    (e) => {
      if (!e.isTrusted) return;
      const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href.startsWith('tel:')) trackLead('phone_call', { link_url: href });
      else if (href.includes('wa.me') || href.includes('whatsapp.com')) trackLead('whatsapp', { link_url: href });
      else if (href.startsWith('mailto:')) trackLead('email', { link_url: href });
    },
    true
  );
}

/* ── shop funnel ── */

const toItem = (p, quantity = 1) => ({
  item_id: String(p._id || p.id || p.sku || p.name),
  item_name: p.name || p.title,
  item_brand: p.brand,
  item_category: p.category,
  price: Number(p.price),
  quantity,
});

export function trackViewItem(product) {
  send('view_item', { currency: 'NGN', value: Number(product.price), items: [toItem(product)] });
}

export function trackAddToCart(product, quantity = 1) {
  send('add_to_cart', {
    currency: 'NGN',
    value: Number(product.price) * quantity,
    items: [toItem(product, quantity)],
  });
}

export function trackBeginCheckout(cartItems, total) {
  send('begin_checkout', {
    currency: 'NGN',
    value: Number(total),
    items: cartItems.map((i) => toItem(i.product || i, i.quantity || 1)),
  });
}

// Call on the order-success / Paystack-callback page. Sent even before the first
// interaction (the visitor just returned from Paystack) and de-duplicated per order.
export function trackPurchase({ transactionId, total, shipping = 0, items = [] }) {
  if (!transactionId) return;
  try {
    const key = `75ts_purchase_${transactionId}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, '1');
  } catch {
    /* storage blocked — send anyway */
  }
  send(
    'purchase',
    {
      transaction_id: String(transactionId),
      currency: 'NGN',
      value: Number(total),
      shipping: Number(shipping),
      items: items.map((i) => toItem(i.product || i, i.quantity || 1)),
    },
    { force: true }
  );
}