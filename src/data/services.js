// src/data/services.js
//
// 75TechStore — single source of truth for our core services.
// HeroWelcome (your first carousel slide) reads from here, so you can
// update the slide by editing this array only.
//
// `image` points to a real asset in /public/images/services.
// Swap the SVGs there with your own branded photos anytime.
// Want it from your backend instead? Replace usage of `services` with
// a fetched list (see the commented getServices() at the bottom).

export const services = [
  {
    id: 'web-app-dev',
    title: 'Web & App Development',
    detail: 'React sites, web & mobile apps',
    image: '/images/services/web-app-dev.svg',
    badge: 'CORE',
     href: '/services',
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Development',
    detail: 'Online stores that actually sell',
    image: '/images/services/ecommerce.svg',
    badge: 'POPULAR',
    href: '/services',
  },
  {
    id: 'uiux',
    title: 'UI/UX & Graphic Design',
    detail: 'Logos, branding & clean interfaces',
    image: '/images/services/uiux.svg',
    badge: 'DESIGN',
     href: '/services',
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    detail: 'AI features, chatbots & automation',
    image: '/images/services/ai.svg',
    badge: 'AI',
     href: '/services',
  },
  {
    id: 'gadgets',
    title: 'Gadget Sales',
    detail: 'Brand-new & UK-used devices',
    image: '/images/services/gadgets.svg',
    badge: 'SALE',
     href: '/services',
  },
  {
    id: 'repairs',
    title: 'Expert Repairs',
    detail: 'Phones, laptops & consoles',
    image: '/images/services/repairs.svg',
    badge: 'FAST',
    href: '/services',
  },
  
  {
    id: 'delivery',
    title: 'Nationwide Delivery',
    detail: 'Across Lagos & all of Nigeria',
    image: '/images/services/delivery.svg',
    badge: 'NG',
     href: '/services',
  },
];

// ── Optional: load from your API when ready ───────────────────────
// Wire this into HeroWelcome with useState + useEffect, e.g.:
//
//   const [services, setServices] = useState(defaultServices);
//   useEffect(() => { getServices().then(setServices).catch(() => {}); }, []);
//
// export async function getServices() {
//   const res = await fetch('/api/services');
//   if (!res.ok) throw new Error('Failed to load services');
//   return res.json(); // must include `image`, `title`, `detail`, `href`, `badge`
// }