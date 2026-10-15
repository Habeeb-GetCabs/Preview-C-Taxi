import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist! Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const routes = [
  {
    path: 'local-taxi',
    title: 'Coimbatore Local Taxi Service — 24/7 Call Taxi in Kovai | C Taxi',
    desc: 'Fast 10-15 minute doorstep pickup across Gandhipuram, RS Puram, Peelamedu, Saravanampatti & Coimbatore. Zero surge pricing, clean AC Sedans & SUVs. Call 9089223344.',
    h1: 'Coimbatore Local Taxi Service — 24/7 Doorstep Pickup Across Kovai',
    subtitle: 'Point-to-point local taxi transfers with instant 10-15 min dispatch across Gandhipuram, RS Puram, Peelamedu, and Saravanampatti. Transparent metered billing with zero surge pricing.',
    tariff: 'Local Sedan: ₹100 Base + ₹30/km | Hourly Packages from ₹350/hr'
  },
  {
    path: 'outstation-cabs',
    title: 'Outstation Cabs from Coimbatore — One-Way Drops & Ooty from ₹3,000 | C Taxi',
    desc: 'Book outstation cabs from Coimbatore from ₹15/km for Sedan, ₹22/km for SUV. Ooty starting from ₹3,000. Mountain certified drivers, transparent tariff. Call 9089223344.',
    h1: 'Outstation Cabs & One-Way Drops from Coimbatore',
    subtitle: 'Intercity travel and one-way drops to Bangalore, Chennai, Madurai, Salem, Tiruppur, Palakkad & Kerala. Nilgiri hill journeys with mountain-certified drivers.',
    tariff: 'Outstation Sedan: ₹15/km (min 130 km) | SUV: ₹22/km (min 130 km) | Ooty from ₹3,000'
  },
  {
    path: 'one-way-taxi',
    title: 'Outstation Cabs from Coimbatore — One-Way Drops & Ooty from ₹3,000 | C Taxi',
    desc: 'Book outstation cabs from Coimbatore from ₹15/km for Sedan, ₹22/km for SUV. Ooty starting from ₹3,000. Mountain certified drivers, transparent tariff. Call 9089223344.',
    h1: 'Outstation Cabs & One-Way Drops from Coimbatore',
    subtitle: 'Intercity travel and one-way drops to Bangalore, Chennai, Madurai, Salem, Tiruppur, Palakkad & Kerala. Nilgiri hill journeys with mountain-certified drivers.',
    tariff: 'Outstation Sedan: ₹15/km (min 130 km) | SUV: ₹22/km (min 130 km) | Ooty from ₹3,000'
  },
  {
    path: 'airport-taxi',
    title: 'Coimbatore Airport Taxi (CJB) — 24/7 Terminal Pickup & Drop | C Taxi',
    desc: 'Punctual Coimbatore International Airport (CJB) taxi transfers with flight tracking and zero delay waiting charges. Clean AC cabs with large luggage boots. Call 9089223344.',
    h1: 'Coimbatore Airport Taxi (CJB) — 24/7 Terminal Pickup & Drop',
    subtitle: 'Dedicated airport transfers to and from Coimbatore International Airport (CJB). Live flight delay monitoring, zero peak surge, and guaranteed on-time doorstep arrival.',
    tariff: 'All Local Areas to CJB Airport: Metered & Fixed Fair Rates | 24/7 Service'
  },
  {
    path: 'tours',
    title: 'Coimbatore Sightseeing Tours & Holiday Packages | C Taxi',
    desc: 'Explore Ooty, Coonoor, Isha Yoga Adiyogi, Palani, Valparai & Kodaikanal tour packages from Coimbatore. Dedicated AC vehicles, fuel & mountain certified chauffeurs included.',
    h1: 'Coimbatore Sightseeing Tours & Holiday Packages',
    subtitle: 'Curated day tours and weekend holiday packages from Coimbatore. Ooty & Coonoor tea estates, Isha Yoga Adiyogi, Palani pilgrimage, and Valparai wildlife circuits.',
    tariff: 'Ooty & Coonoor: From ₹3,000 | Isha & Marudhamalai: From ₹2,200 | Palani: From ₹2,800'
  },
  {
    path: 'tours/ooty-coonoor-kotagiri',
    title: 'Ooty, Coonoor & Kotagiri Tour Package from Coimbatore | C Taxi',
    desc: 'Complete Nilgiris holiday package from Coimbatore. Botanical Gardens, Doddabetta Peak, Tea Estates, Sims Park & Catherine Falls. From ₹3,000. Call 9089223344.',
    h1: 'Ooty, Coonoor & Kotagiri Tour Package from Coimbatore',
    subtitle: 'Comprehensive 1-day or 2-day Nilgiri hill exploration with experienced mountain drivers. Fuel, driver allowance, and sightseeing itinerary included.',
    tariff: 'Starting from ₹3,000 (Prime Sedan) / ₹4,500 (Spacious SUV)'
  }
];

routes.forEach(r => {
  const targetDir = path.join(distDir, r.path);
  fs.mkdirSync(targetDir, { recursive: true });

  let html = baseHtml;

  // Replace Title & Description
  html = html.replace(/<title>.*?<\/title>/, `<title>${r.title}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${r.desc}" />`);
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="https://ctaxicab.com/${r.path}/" />`);

  // Replace H1 in prerender fallback
  html = html.replace(
    /<h1[^>]*>[\s\S]*?<\/h1>/i,
    `<h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] font-heading">${r.h1}</h1>`
  );

  // Replace subtitle
  html = html.replace(
    /<p class="text-sm sm:text-base lg:text-lg text-\[#D5CEBE\][\s\S]*?<\/p>/i,
    `<p class="text-sm sm:text-base lg:text-lg text-[#D5CEBE] max-w-2xl leading-relaxed">${r.subtitle}</p>`
  );

  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
  console.log(`Generated prerendered HTML: ${r.path}/index.html`);
});

console.log('Prerender build completed successfully.');
