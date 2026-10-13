export interface VehicleType {
  id: string;
  name: string;
  category: string;
  models: string;
  capacity: string;
  luggage: string;
  localBaseFare: number;
  localPerKm: number;
  ratePerKm: number; // Outstation per km
  minKmPerDay: number;
  driverAllowancePerDay: number;
  hillCharge: number;
  features: string[];
  recommendedFor: string;
}

export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  category: 'hills' | 'spiritual' | 'business' | 'intercity' | 'airport';
  distanceKm: number;
  estDuration: string;
  startingPrice: number;
  highlight: string;
  popularFor: string;
  isHillStation?: boolean;
}

export interface HourlyPackage {
  id: string;
  hours: number;
  km: number;
  basePrice: number; // Base rate for sedan: 375/hr for first 3 hours, then 350/hr
  suvPrice: number;
  premiumSuvPrice: number;
  tagline: string;
}

export const PHONE_NUMBER = "9089223344";
export const DISPLAY_PHONE = "+91 90892 23344";
export const WHATSAPP_URL = "https://wa.me/919089223344";

export const COIMBATORE_LOCALITIES = [
  "Gandhipuram (Cross Cut / Central Bus Stand)",
  "RS Puram (DB Road / Post Office)",
  "Peelamedu (Avinashi Road / PSG Tech)",
  "Saravanampatti (IT Corridor / CHIL SEZ)",
  "Singanallur (Trichy Road / Bus Stand)",
  "Coimbatore Int'l Airport (CJB Terminal)",
  "Coimbatore Junction Railway Station (CBE)",
  "Ganapathy (Sathy Road)",
  "Ukkadam (Palakkad Road)",
  "Kuniyamuthur / Sundarapuram",
  "Vadavalli / Marudhamalai Road",
  "Ramanathapuram / Sungam",
  "Hopes College / TIDEL Park",
  "Thudiyalur / Mettupalayam Road",
  "Kovaipudur",
  "Kinathukadavu",
  "Sulur / Kangeyam Road"
];

export const LOCAL_ROUTE_DISTANCES: Record<string, number> = {
  "Gandhipuram -> Airport": 11,
  "RS Puram -> Airport": 14,
  "Peelamedu -> Airport": 5,
  "Saravanampatti -> Airport": 10,
  "Singanallur -> Airport": 9,
  "Railway Station -> Airport": 12,
  "Gandhipuram -> Saravanampatti": 12,
  "RS Puram -> Gandhipuram": 5,
  "Gandhipuram -> Singanallur": 8,
  "City -> Isha Yoga Center": 34,
  "City -> Marudhamalai Temple": 15,
  "City -> Madukkarai": 16,
  "City -> Thudiyalur": 10,
  "City -> TIDEL Park / Hopes": 8
};

export const OUTSTATION_DESTINATIONS = [
  { name: "Ooty (Queen of Hills)", distance: 88, isHill: true, type: "Hills" },
  { name: "Coonoor (Nilgiri Tea Gardens)", distance: 72, isHill: true, type: "Hills" },
  { name: "Valparai (Tea Estates & Hairpins)", distance: 105, isHill: true, type: "Hills" },
  { name: "Kodaikanal (Princess of Hills)", distance: 175, isHill: true, type: "Hills" },
  { name: "Munnar (Hill Resort)", distance: 160, isHill: true, type: "Hills" },
  { name: "Isha Yoga Center / Velliangiri", distance: 34, isHill: false, type: "Spiritual" },
  { name: "Pollachi / Topslip Anamalai", distance: 44, isHill: false, type: "Tourism" },
  { name: "Tiruppur (Textile City)", distance: 54, isHill: false, type: "Business" },
  { name: "Palakkad (Kerala)", distance: 52, isHill: false, type: "Interstate" },
  { name: "Erode (Textile Hub)", distance: 100, isHill: false, type: "Business" },
  { name: "Salem (Steel City)", distance: 165, isHill: false, type: "Intercity" },
  { name: "Madurai (Temple City)", distance: 215, isHill: false, type: "Spiritual" },
  { name: "Palani (Murugan Temple)", distance: 105, isHill: false, type: "Spiritual" },
  { name: "Trichy (Rockfort)", distance: 220, isHill: false, type: "Intercity" },
  { name: "Bangalore / Bengaluru", distance: 365, isHill: false, type: "Metro" },
  { name: "Chennai (Capital)", distance: 510, isHill: false, type: "Metro" }
];

// FLEET DEFINITIONS WITH APPROVED FARE RULES
// Prime Sedan: Local base ₹100 + ₹30/km; Outstation one-way ₹15/km (min 130km, ₹500 batta); Day rental ₹2,000/day + ₹12/km (min 100km/day); Hourly ₹350/hr (+₹20/km).
// Family SUV: Outstation one-way ₹22/km (min 130km, ₹600 batta); Hourly ₹500/hr (+₹25/km); Local & Round trip: Contact for quote.
// Innova Crysta: Contact for quote across all services.
export const VEHICLE_FLEET: VehicleType[] = [
  {
    id: "sedan",
    name: "Prime Sedan",
    category: "Executive & Family",
    models: "Maruti Dzire, Toyota Etios, Hyundai Aura",
    capacity: "4 Passengers",
    luggage: "3 Large Bags",
    localBaseFare: 100,
    localPerKm: 30,
    ratePerKm: 15, // Outstation one-way ₹15/km
    minKmPerDay: 100, // Round trip day rental min 100 km/day
    driverAllowancePerDay: 500, // ₹500 Driver batta
    hillCharge: 0,
    features: ["Quiet AC Cabin", "Large Dedicated Trunk", "Spacious Legroom", "Digital Meter"],
    recommendedFor: "Local city travel, airport drops & comfortable outstation trips"
  },
  {
    id: "suv_ertiga",
    name: "Spacious SUV (6-Seater)",
    category: "Family & Groups",
    models: "Maruti Ertiga, Kia Carens, Mahindra Marazzo",
    capacity: "6 Passengers",
    luggage: "4 Bags + Rear Storage",
    localBaseFare: 0, // Quote only for local
    localPerKm: 0,
    ratePerKm: 22, // Outstation one-way ₹22/km
    minKmPerDay: 100,
    driverAllowancePerDay: 600, // ₹600 Driver batta for SUV one-way
    hillCharge: 0,
    features: ["Dual Zone AC", "3-Row Seating", "Strong Hill Pulling Power", "USB Charging"],
    recommendedFor: "Family trips to Ooty/Valparai, group airport transit & outstation tours"
  },
  {
    id: "premium_suv",
    name: "Premium SUV (Innova Crysta)",
    category: "Luxury VIP Chauffeur",
    models: "Toyota Innova Crysta / Hycross",
    capacity: "7 Passengers",
    luggage: "5 Large Suitcases",
    localBaseFare: 0, // Quote only
    localPerKm: 0,
    ratePerKm: 0, // Contact for quote (no numeric fare)
    minKmPerDay: 100,
    driverAllowancePerDay: 0,
    hillCharge: 0,
    features: ["Plush Reclining Captain Seats", "Supreme Mountain Safety", "Executive Ride Quality", "Expert Chauffeur"],
    recommendedFor: "VIP business travelers, family holidays to Nilgiris & extended tours"
  }
];

// Hourly Package Calculation:
// Prime Sedan: ₹350/hour (additional km: ₹20/km beyond included distance)
// SUV: ₹500/hour (additional km: ₹25/km beyond included distance)
// Innova Crysta: Contact for quote (returns null)
export function calculateHourlyRate(hours: number, vehicleId: string): number | null {
  if (vehicleId === 'sedan') {
    return hours * 350;
  }
  if (vehicleId === 'suv_ertiga') {
    return hours * 500;
  }
  return null; // Innova Crysta: Contact for quote
}

export const HOURLY_PACKAGES: HourlyPackage[] = [
  {
    id: "pkg_2hr",
    hours: 2,
    km: 20,
    basePrice: 700, // 2 * 350
    suvPrice: 1000, // 2 * 500
    premiumSuvPrice: 0, // Contact for quote
    tagline: "Quick appointments & short city errands"
  },
  {
    id: "pkg_3hr",
    hours: 3,
    km: 30,
    basePrice: 1050, // 3 * 350
    suvPrice: 1500, // 3 * 500
    premiumSuvPrice: 0, // Contact for quote
    tagline: "Doctor visits & business meetings"
  },
  {
    id: "pkg_4hr",
    hours: 4,
    km: 40,
    basePrice: 1400, // 4 * 350
    suvPrice: 2000, // 4 * 500
    premiumSuvPrice: 0, // Contact for quote
    tagline: "Cross Cut Road shopping & hospital visits"
  },
  {
    id: "pkg_8hr",
    hours: 8,
    km: 80,
    basePrice: 2800, // 8 * 350
    suvPrice: 4000, // 8 * 500
    premiumSuvPrice: 0, // Contact for quote
    tagline: "Full day Coimbatore corporate meetings & temple tour"
  },
  {
    id: "pkg_12hr",
    hours: 12,
    km: 120,
    basePrice: 4200, // 12 * 350
    suvPrice: 6000, // 12 * 500
    premiumSuvPrice: 0, // Contact for quote
    tagline: "Extensive industrial visits, TIDEL park & factories"
  }
];

// Ooty starting price strictly 3000
export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: "cbe_ooty",
    from: "Coimbatore",
    to: "Ooty (Queen of Hills)",
    category: "hills",
    distanceKm: 88,
    estDuration: "2h 45m",
    startingPrice: 3000, // Updated to 3000 as instructed
    highlight: "Nilgiri 36 Hairpin Specialist Drivers",
    popularFor: "Scenic Nilgiri getaway, family holidays & tea garden stays",
    isHillStation: true
  },
  {
    id: "cbe_airport",
    from: "City Center Hubs",
    to: "CJB Airport (Peelamedu)",
    category: "airport",
    distanceKm: 12,
    estDuration: "20-30m",
    startingPrice: 440,
    highlight: "Guaranteed Flight Punctuality",
    popularFor: "Early morning terminal drops & delayed flight meet-and-greet"
  },
  {
    id: "cbe_isha",
    from: "Coimbatore City",
    to: "Isha Yoga Center (Adiyogi)",
    category: "spiritual",
    distanceKm: 34,
    estDuration: "55m",
    startingPrice: 1050,
    highlight: "Round Trip Waiting Available",
    popularFor: "Adiyogi light & sound show, Dhyanalinga & ashram darshan"
  },
  {
    id: "cbe_tiruppur",
    from: "Gandhipuram",
    to: "Tiruppur Textile City",
    category: "business",
    distanceKm: 54,
    estDuration: "1h 10m",
    startingPrice: 1350,
    highlight: "Express Highway Transit",
    popularFor: "Apparel exporters, garment factory visits & commercial meetings"
  },
  {
    id: "cbe_pollachi",
    from: "Coimbatore",
    to: "Pollachi & Topslip",
    category: "hills",
    distanceKm: 45,
    estDuration: "1h 00m",
    startingPrice: 1250,
    highlight: "Scenic Coconut Highway",
    popularFor: "Wildlife sanctuary trips, village tours & temple darshans"
  },
  {
    id: "cbe_valparai",
    from: "Coimbatore",
    to: "Valparai Hill Station",
    category: "hills",
    distanceKm: 105,
    estDuration: "3h 30m",
    startingPrice: 3600,
    highlight: "40 Hairpin Ghat Roads Certified",
    popularFor: "Tea plantation bungalows, Sholayar dam & pristine nature",
    isHillStation: true
  }
];

export const TESTIMONIALS = [
  {
    name: "Dr. K. Vigneshwaran",
    role: "Consultant Physician",
    locality: "RS Puram, Coimbatore",
    text: "I regularly book C Taxi for early morning 4:30 AM drops to Coimbatore Airport. The driver always arrives 10 minutes ahead of time without me having to follow up. Clean sedan with proper meter billing.",
    rating: 5,
    trip: "Airport Transfer"
  },
  {
    name: "Pooja Venkatesh",
    role: "Product Manager (Bengaluru)",
    locality: "Booked from CJB Airport to Ooty",
    text: "Booked an Ertiga SUV for my family to Ooty. Navigating the 36 hairpin bends was so smooth because of their experienced hill driver. Exact 3000 starting rate with no hidden surprises. Highly recommended!",
    rating: 5,
    trip: "Ooty Hill Station Tour"
  },
  {
    name: "M. Anandhan",
    role: "Textile Apparel Exporter",
    locality: "Tiruppur & Peelamedu",
    text: "Used their 8-hour package for full day factory visits in Tiruppur and Coimbatore. Transparent hourly pricing with zero surge. Professional chauffeur with instant GST invoice.",
    rating: 5,
    trip: "Hourly Rental Package"
  }
];

export const FAQS = [
  {
    q: "How does C Taxi calculate local ride fares in Coimbatore?",
    a: "Our local rides follow affordable standard digital meter pricing with zero peak-hour surge pricing. Prime Sedan base fare is ₹100 + ₹30/km. Spacious SUVs are dispatched on request with custom quotes. 10 to 15 minute doorstep arrival across all Kovai localities."
  },
  {
    q: "What is your outstation pricing and driver batta?",
    a: "For Prime Sedan, outstation one-way drops are ₹15/km (minimum 130 km with flat ₹500 driver allowance), and round trips feature ₹2,000/day rental plus ₹12/km running rate (min 100 km/day). For Family SUV, one-way drops are ₹22/km (minimum 130 km with flat ₹600 driver allowance). Innova Crysta and Tempo Traveller are available on custom quote."
  },
  {
    q: "What are the rates for Ooty from Coimbatore?",
    a: "Our Ooty cabs start from ₹3,000 for Prime Sedan. Our hill chauffeurs are certified for the Nilgiri Kalhatty 36 hairpin bends with extensive mountain driving experience."
  },
  {
    q: "How do your Hourly Rental packages work?",
    a: "Our hourly rental packages start at ₹350 per hour for Prime Sedan (additional km at ₹20/km) and ₹500 per hour for Family SUV (additional km at ₹25/km). You can keep the car and chauffeur with you for shopping, clinic visits, or multiple factory meetings across Kovai."
  },
  {
    q: "How fast can C Taxi reach my location in Coimbatore?",
    a: "We maintain active fleet hubs across Gandhipuram, RS Puram, Peelamedu, Saravanampatti, Singanallur, and Airport area. Average dispatch arrival time is 10 to 15 minutes."
  },
  {
    q: "What payment methods do you accept?",
    a: "You can pay via Google Pay (GPay), PhonePe, Paytm, UPI, Bank Transfer, or Cash upon completion of your trip. Official GST receipts are provided."
  }
];

export const AD_CAMPAIGN_PRESETS = [
  {
    id: "local",
    title: "Coimbatore Local City Cabs",
    query: "call taxi in coimbatore local cab booking",
    h1: "Coimbatore's Reliable 24/7 Call Taxi — At Your Doorstep in 15 Minutes",
    subtext: "Affordable, transparent city rides with zero surge pricing. Instant 15-minute dispatch across Gandhipuram, RS Puram, Peelamedu, Saravanampatti & Kovai.",
    primaryTab: "local"
  },
  {
    id: "outstation",
    title: "Outstation Cabs & Ooty Hill Tours",
    query: "coimbatore to ooty cab / outstation taxi coimbatore",
    h1: "Coimbatore to Ooty & Outstation Cabs — Safe Drivers & Sanitized Fleet",
    subtext: "Ooty trips starting from ₹3,000. Outstation one-way drops from ₹15/km for Sedan and ₹22/km for SUV with certified mountain chauffeurs.",
    primaryTab: "outstation"
  },
  {
    id: "hourly",
    title: "Hourly Rental Packages",
    query: "hourly car rental coimbatore with driver package",
    h1: "Coimbatore City Hourly Rental Cabs — Flexible Packages with Driver",
    subtext: "Transparent pricing: ₹350/hour for Prime Sedan and ₹500/hour for Family SUV. Ideal for Cross Cut Road shopping, clinic visits, and multi-stop business meetings.",
    primaryTab: "hourly"
  },
  {
    id: "airport",
    title: "Coimbatore Airport Taxi Ads",
    query: "coimbatore airport taxi pickup drop cjb",
    h1: "Coimbatore CJB Airport Taxi — On-Time Flight Pickup & Drop Guaranteed",
    subtext: "Reliable airport transfers with flight tracking, 15-minute doorstep dispatch, zero midnight surge & luggage assistance.",
    primaryTab: "airport"
  }
];
