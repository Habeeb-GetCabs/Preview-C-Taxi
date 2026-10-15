/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { PopularRoutesSection } from './components/PopularRoutesSection';
import { HomeToursSection } from './components/HomeToursSection';
import { FleetSection } from './components/FleetSection';
import { TrustProofSection } from './components/TrustProofSection';
import { FaqSection } from './components/FaqSection';
import { FareCalculator } from './components/FareCalculator';
import { Footer } from './components/Footer';
import { StickyBottomCta } from './components/StickyBottomCta';
import { BookingModal } from './components/BookingModal';
import { PolicyModal, PolicyType } from './components/PolicyModal';
import { TourDetailPage } from './components/TourDetailPage';

// 4 Dedicated Service Pages
import { LocalTaxiPage } from './pages/LocalTaxiPage';
import { OutstationCabsPage } from './pages/OutstationCabsPage';
import { AirportTaxiPage } from './pages/AirportTaxiPage';
import { ToursPage } from './pages/ToursPage';

import { TOUR_PACKAGES, TourPackage } from './data/toursData';
import { trackPageView, setupLinkClickTracking } from './utils/googleAds';

export type AppRoute = 'home' | 'local-taxi' | 'outstation-cabs' | 'airport-taxi' | 'tours' | 'tour-detail' | 'not-found';

const PAGE_META: Record<string, { title: string; desc: string }> = {
  'home': {
    title: 'C Taxi · Coimbatore – 24/7 Call Taxi, Airport Transfer & Outstation Cabs',
    desc: 'Book C Taxi in Coimbatore at 9089223344. Instant 15-min doorstep pickup, local city rides, CJB airport transfers, outstation cabs from ₹15/km & Ooty trips from ₹3,000.'
  },
  'local-taxi': {
    title: 'Coimbatore Local Taxi Service — 24/7 Call Taxi in Kovai | C Taxi',
    desc: 'Fast 10-15 minute doorstep pickup across Gandhipuram, RS Puram, Peelamedu, Saravanampatti & Coimbatore. Zero surge pricing, clean AC Sedans & SUVs. Call 9089223344.'
  },
  'outstation-cabs': {
    title: 'Outstation Cabs from Coimbatore — One-Way Drops & Ooty from ₹3,000 | C Taxi',
    desc: 'Book outstation cabs from Coimbatore from ₹15/km for Sedan, ₹20/km for SUV. Ooty starting from ₹3,000. Mountain certified drivers, transparent tariff. Call 9089223344.'
  },
  'airport-taxi': {
    title: 'Coimbatore Airport Taxi (CJB) — 24/7 Terminal Pickup & Drop | C Taxi',
    desc: 'Punctual Coimbatore International Airport (CJB) taxi transfers with flight tracking and zero delay waiting charges. Clean AC cabs with large luggage boots. Call 9089223344.'
  },
  'tours': {
    title: 'Coimbatore Sightseeing Tours & Holiday Packages | C Taxi',
    desc: 'Explore Ooty, Coonoor, Isha Yoga Adiyogi, Palani, Valparai & Kodaikanal tour packages from Coimbatore. Dedicated AC vehicles, fuel & mountain certified chauffeurs included.'
  },
  'not-found': {
    title: 'Page Not Found (404) | C Taxi Coimbatore',
    desc: 'The requested page could not be found. Contact C Taxi 24/7 at 9089223344 for cabs in Coimbatore.'
  }
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [activeTourSlug, setActiveTourSlug] = useState<string | null>(null);

  // Booking Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  // Policy Modal state
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(false);
  const [activePolicyType, setActivePolicyType] = useState<PolicyType>('privacy');

  // Update browser document head tags for SEO & Google Ads landing page quality
  const updateHeadTags = (title: string, description: string) => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
  };

  // Synchronize route based on URL path or search parameters
  const syncRouteFromUrl = () => {
    try {
      // Normalize pathname
      let pathname = window.location.pathname.toLowerCase().trim();
      pathname = pathname.replace(/\/+$/, '') || '/';
      
      const searchParams = new URLSearchParams(window.location.search);
      const pageParam = (searchParams.get('page') || '').toLowerCase().trim().replace(/\/+$/, '');
      const serviceParam = (searchParams.get('service') || '').toLowerCase().trim();
      const tourParam = (searchParams.get('tour') || '').toLowerCase().trim();

      // Check candidate path
      const candidate = pageParam ? (pageParam.startsWith('/') ? pageParam : `/${pageParam}`) : pathname;

      // 1. Tour Detail Page Check
      let targetTourSlug: string | null = null;
      if (tourParam) {
        targetTourSlug = tourParam;
      } else if (candidate.startsWith('/tour/') || candidate.startsWith('/tours/')) {
        targetTourSlug = candidate.replace('/tours/', '').replace('/tour/', '').replace(/\/$/, '');
      }

      if (targetTourSlug) {
        // Match exact slug or fuzzy alias (e.g. 'ooty' -> 'ooty-coonoor-kotagiri')
        const foundTour = TOUR_PACKAGES.find(t => 
          t.slug === targetTourSlug || 
          t.slug.includes(targetTourSlug!) || 
          targetTourSlug!.includes(t.slug)
        );

        if (foundTour) {
          setCurrentRoute('tour-detail');
          setActiveTourSlug(foundTour.slug);
          updateHeadTags(foundTour.pageTitle, foundTour.metaDescription);
          return;
        } else {
          // Gracefully fallback to Tours Hub if specific tour slug doesn't match
          setCurrentRoute('tours');
          setActiveTourSlug(null);
          updateHeadTags(PAGE_META['tours'].title, PAGE_META['tours'].desc);
          return;
        }
      }

      // 2. Dedicated Service Pages & Google Ads Landing Aliases Check
      let resolvedRoute: AppRoute = 'home';

      // Outstation & One-Way Taxi aliases (e.g. /one-way-taxi, /outstation-cabs, /outstation)
      const isOutstation = [
        '/outstation-cabs', '/outstation', '/one-way-taxi', '/oneway-taxi',
        '/one-way-cabs', '/oneway-cabs', '/outstation-taxi', '/outstation-cab',
        '/oneway', '/one-way'
      ].includes(candidate) ||
      ['outstation-cabs', 'outstation', 'one-way-taxi', 'oneway-taxi', 'oneway', 'one-way'].includes(pageParam) ||
      ['outstation', 'oneway', 'one-way'].includes(serviceParam);

      // Local Taxi aliases (e.g. /local-taxi, /call-taxi, /city-taxi, /red-taxi)
      const isLocal = [
        '/local-taxi', '/local', '/call-taxi', '/city-taxi', '/local-cabs', '/local-cab', '/red-taxi'
      ].includes(candidate) ||
      ['local-taxi', 'local', 'call-taxi', 'city-taxi', 'red-taxi'].includes(pageParam) ||
      ['local', 'call-taxi', 'city', 'red-taxi'].includes(serviceParam);

      // Airport Taxi aliases (e.g. /airport-taxi, /airport, /cjb-airport)
      const isAirport = [
        '/airport-taxi', '/airport', '/airport-cabs', '/cjb-airport', '/cjb-airport-taxi', '/airport-cab'
      ].includes(candidate) ||
      ['airport-taxi', 'airport', 'airport-cabs', 'cjb-airport'].includes(pageParam) ||
      ['airport', 'cjb'].includes(serviceParam);

      // Tours Hub aliases (e.g. /tours, /tour, /tour-packages)
      const isTours = [
        '/tours', '/tour', '/tour-packages', '/packages', '/holiday-packages'
      ].includes(candidate) ||
      ['tours', 'tour', 'tour-packages', 'packages'].includes(pageParam) ||
      ['tours', 'tour', 'packages'].includes(serviceParam);

      if (isOutstation) {
        resolvedRoute = 'outstation-cabs';
      } else if (isLocal) {
        resolvedRoute = 'local-taxi';
      } else if (isAirport) {
        resolvedRoute = 'airport-taxi';
      } else if (isTours) {
        resolvedRoute = 'tours';
      } else if (candidate === '/' || candidate === '' || candidate === '/home') {
        resolvedRoute = 'home';
      } else {
        resolvedRoute = 'not-found';
      }

      setCurrentRoute(resolvedRoute);
      setActiveTourSlug(null);
      const meta = PAGE_META[resolvedRoute] || PAGE_META['home'];
      updateHeadTags(meta.title, meta.desc);
    } catch {
      // Defensive fallback to home on unexpected parsing failure
      setCurrentRoute('home');
      setActiveTourSlug(null);
      updateHeadTags(PAGE_META['home'].title, PAGE_META['home'].desc);
    }
  };

  useEffect(() => {
    syncRouteFromUrl();
    let cleanupClickTracking: (() => void) | undefined;
    try {
      cleanupClickTracking = setupLinkClickTracking();
    } catch {
      // Safe non-blocking telemetry initialization
    }
    window.addEventListener('popstate', syncRouteFromUrl);
    return () => {
      window.removeEventListener('popstate', syncRouteFromUrl);
      if (cleanupClickTracking) cleanupClickTracking();
    };
  }, []);

  useEffect(() => {
    try {
      const path = currentRoute === 'home' ? '/' : `/${currentRoute}`;
      trackPageView(path);
    } catch {
      // Suppress analytics error
    }
  }, [currentRoute, activeTourSlug]);

  // Programmatic navigation that updates history and state smoothly
  const handleNavigate = (route: string, tourSlug?: string) => {
    let targetUrl = '/';
    let targetRoute: AppRoute = 'home';

    if (tourSlug) {
      targetRoute = 'tour-detail';
      targetUrl = `/tours/${tourSlug}/`;
      const found = TOUR_PACKAGES.find(t => t.slug === tourSlug);
      setActiveTourSlug(tourSlug);
      if (found) {
        updateHeadTags(found.pageTitle, found.metaDescription);
      }
    } else if (route === 'local-taxi' || route === 'local' || route === 'call-taxi') {
      targetRoute = 'local-taxi';
      targetUrl = '/local-taxi/';
      setActiveTourSlug(null);
      updateHeadTags(PAGE_META['local-taxi'].title, PAGE_META['local-taxi'].desc);
    } else if (route === 'outstation-cabs' || route === 'outstation' || route === 'one-way-taxi' || route === 'oneway') {
      targetRoute = 'outstation-cabs';
      targetUrl = '/outstation-cabs/';
      setActiveTourSlug(null);
      updateHeadTags(PAGE_META['outstation-cabs'].title, PAGE_META['outstation-cabs'].desc);
    } else if (route === 'airport-taxi' || route === 'airport') {
      targetRoute = 'airport-taxi';
      targetUrl = '/airport-taxi/';
      setActiveTourSlug(null);
      updateHeadTags(PAGE_META['airport-taxi'].title, PAGE_META['airport-taxi'].desc);
    } else if (route === 'tours' || route === 'tour') {
      targetRoute = 'tours';
      targetUrl = '/tours/';
      setActiveTourSlug(null);
      updateHeadTags(PAGE_META['tours'].title, PAGE_META['tours'].desc);
    } else {
      targetRoute = 'home';
      targetUrl = '/';
      setActiveTourSlug(null);
      updateHeadTags(PAGE_META['home'].title, PAGE_META['home'].desc);
    }

    setCurrentRoute(targetRoute);
    try {
      window.history.pushState({}, '', targetUrl);
    } catch {
      // In constrained iframe environments, search params fallback
      try {
        if (targetRoute === 'tour-detail' && tourSlug) {
          window.history.pushState({}, '', `?tour=${tourSlug}`);
        } else if (targetRoute !== 'home') {
          window.history.pushState({}, '', `?page=${targetRoute}`);
        } else {
          window.history.pushState({}, '', '/');
        }
      } catch {
        // Ignore if pushState is restricted
      }
    }

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  };

  const handleOpenBookingModal = (details: any) => {
    setBookingDetails(details);
    setIsBookingModalOpen(true);
  };

  const handleOpenPolicy = (type: PolicyType) => {
    setActivePolicyType(type);
    setIsPolicyModalOpen(true);
  };

  const handleBookTourFromCard = (tour: TourPackage) => {
    handleOpenBookingModal({
      serviceType: 'outstation',
      pickup: 'Coimbatore City (Doorstep)',
      drop: tour.title,
      vehicle: 'Prime AC Sedan',
      estimatedPrice: tour.startingPrice,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '06:30 AM',
      breakdownNote: `${tour.duration} Package: ${tour.routeOverview}`
    });
  };

  const activeTour = TOUR_PACKAGES.find(t => t.slug === activeTourSlug);

  return (
    <div className="min-h-screen bg-white text-[#171717] flex flex-col font-sans selection:bg-[#FFBF00] selection:text-[#171717]">
      
      {/* 1. Header with C Taxi branding, 4 service page links, Call 9089223344 & WhatsApp buttons */}
      <Header 
        currentPage={currentRoute}
        onNavigate={handleNavigate}
        onBookClick={() => handleOpenBookingModal({
          serviceType: 'local',
          pickup: 'Coimbatore City (Doorstep)',
          drop: 'Destination in Coimbatore / Outstation',
          vehicle: 'Prime AC Sedan',
          estimatedPrice: null,
          breakdownNote: 'Quick dispatch request'
        })} 
      />

      {/* Main Content Area */}
      <main className="flex-1">

        {/* Route 1: Local Taxi Page */}
        {currentRoute === 'local-taxi' && (
          <LocalTaxiPage 
            onOpenBookingModal={handleOpenBookingModal}
            onNavigate={handleNavigate}
          />
        )}

        {/* Route 2: Outstation Cabs Page */}
        {currentRoute === 'outstation-cabs' && (
          <OutstationCabsPage 
            onOpenBookingModal={handleOpenBookingModal}
            onNavigate={handleNavigate}
          />
        )}

        {/* Route 3: Airport Taxi Page */}
        {currentRoute === 'airport-taxi' && (
          <AirportTaxiPage 
            onOpenBookingModal={handleOpenBookingModal}
            onNavigate={handleNavigate}
          />
        )}

        {/* Route 4: Tours & Packages Hub Page */}
        {currentRoute === 'tours' && (
          <ToursPage 
            onNavigateToTour={(slug) => handleNavigate('tour-detail', slug)}
            onBookTour={handleBookTourFromCard}
            onNavigate={handleNavigate}
          />
        )}

        {/* Route 5: Dedicated Tour Detail Page (e.g. Ooty, Isha, Palani) */}
        {currentRoute === 'tour-detail' && (
          activeTour ? (
            <TourDetailPage
              tour={activeTour}
              onBackToHome={() => handleNavigate('tours')}
              onNavigateToTour={(slug) => handleNavigate('tour-detail', slug)}
              onOpenBookingModal={handleOpenBookingModal}
            />
          ) : (
            <ToursPage 
              onNavigateToTour={(slug) => handleNavigate('tour-detail', slug)}
              onBookTour={handleBookTourFromCard}
              onNavigate={handleNavigate}
            />
          )
        )}

        {/* Route 6: Homepage (Default) */}
        {currentRoute === 'home' && (
          <>
            {/* 1. One primary hero section (No banners or debug elements above) */}
            <Hero 
              onNavigate={handleNavigate}
              onOpenBookingModal={handleOpenBookingModal}
            />

            {/* 2. Four service cards linking to the four dedicated service pages */}
            <ServicesSection onNavigate={handleNavigate} />

            {/* 3. Popular outstation routes with accurate starting fares (Ooty from 3,000) */}
            <PopularRoutesSection 
              onSelectRoute={(route) => {
                if (route.category === 'airport') {
                  handleNavigate('airport-taxi');
                } else {
                  handleNavigate('outstation-cabs');
                }
              }}
              onNavigateToOutstation={() => handleNavigate('outstation-cabs')}
            />

            {/* 4. Featured tour packages (Top 3: Ooty-Coonoor-Kotagiri, Marudhamalai-Isha, Palani) */}
            <HomeToursSection 
              onNavigateToTour={(slug) => handleNavigate('tour-detail', slug)}
              onBookTour={handleBookTourFromCard}
              onNavigateToAllTours={() => handleNavigate('tours')}
            />

            {/* 5. Instant Fare Calculator & Booking Section */}
            <FareCalculator onOpenBookingModal={handleOpenBookingModal} />

            {/* 6. Fleet and vehicle options (Sedan, SUV, Innova Crysta — No hatchback) */}
            <FleetSection 
              onSelectFleet={() => {
                const calcEl = document.getElementById('fare-calculator');
                if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
              }} 
            />

            {/* 7. Why choose C Taxi & Verified customer testimonials */}
            <TrustProofSection />

            {/* 8. Useful FAQs */}
            <FaqSection />
          </>
        )}

        {/* Route 7: Page Not Found (404) — Never silently map unknown URLs to unrelated pages */}
        {currentRoute === 'not-found' && (
          <section className="py-20 bg-[#171717] min-h-[60vh] flex items-center justify-center text-white">
            <div className="max-w-xl mx-auto px-4 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#FFBF00]/10 border border-[#FFBF00]/30 text-[#FFBF00] flex items-center justify-center mx-auto text-3xl font-extrabold font-heading">
                404
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-white">
                Page Not Found (404)
              </h1>
              <p className="text-[#A0A09C] text-sm sm:text-base leading-relaxed">
                The requested page does not exist or has moved. Browse our 24/7 Coimbatore cab services or return to the homepage.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="px-5 py-2.5 rounded-xl bg-[#FFBF00] text-[#171717] font-extrabold text-sm shadow-md hover:bg-[#E5AC00] transition-colors"
                >
                  Return to Homepage
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('local-taxi')}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-white font-bold text-sm border border-neutral-700 hover:border-neutral-600 transition-colors"
                >
                  Local Taxi
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('outstation-cabs')}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 text-white font-bold text-sm border border-neutral-700 hover:border-neutral-600 transition-colors"
                >
                  Outstation Cabs
                </button>
                <a
                  href="tel:9089223344"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-500 transition-colors"
                >
                  Call 90892 23344
                </a>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* Clean quiet Footer with contact information and customer policies */}
      <Footer 
        onNavigate={handleNavigate}
        onOpenPolicy={handleOpenPolicy} 
      />

      {/* Fixed bottom booking bar on mobile & web */}
      <StickyBottomCta onOpenBookingModal={handleOpenBookingModal} />

      {/* Online Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingDetails={bookingDetails}
      />

      {/* Privacy Policy, Cancellation & Refund, and Terms Modal */}
      <PolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        activePolicy={activePolicyType}
        onChangePolicy={setActivePolicyType}
      />

    </div>
  );
}
