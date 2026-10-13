/**
 * Google Ads Tag & Conversion Tracking Utility for C Taxi (AW-333870129)
 *
 * Implements single-initialization Google Ads tracking with de-duplication,
 * safe fallback if analytics is blocked by ad-blockers, and explicit configuration
 * points for Google Ads conversion labels.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GOOGLE_ADS_TAG_ID = 'AW-333870129';

/**
 * CONVERSION LABELS CONFIGURATION:
 * Provide the exact Google Ads conversion label string if created in the
 * Google Ads dashboard (e.g. 'AW-333870129/AbCdEfGhIjKlMnOpQr').
 * If a conversion label has not been created yet in the account, leave it empty.
 * The tracker will safely fire custom Google Ads event telemetry without fabricating
 * unverified conversion labels.
 */
export const GOOGLE_ADS_CONVERSION_LABELS = {
  // Label for Phone link clicks (tel:)
  phoneCall: '',
  // Label for WhatsApp booking link clicks
  whatsAppClick: '',
  // Label for genuine booking form handoff to WhatsApp
  bookingHandoff: '',
};

// De-duplication timestamps to prevent duplicate events on repeated re-renders or double-clicks
const lastEventTimestamps: Record<string, number> = {};
const DEDUPLICATION_INTERVAL_MS = 2000;

function shouldTrack(eventKey: string): boolean {
  const now = Date.now();
  const lastTime = lastEventTimestamps[eventKey] || 0;
  if (now - lastTime < DEDUPLICATION_INTERVAL_MS) {
    return false;
  }
  lastEventTimestamps[eventKey] = now;
  return true;
}

/**
 * Safe gtag wrapper that never throws errors if gtag is blocked or unavailable.
 */
function sendGtag(command: string, actionOrId: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag(command, actionOrId, params);
    } catch (err) {
      // Suppress analytics error so core user navigation and links never break
    }
  }
}

/**
 * Track phone link click (tel:9089223344)
 */
export function trackPhoneClick(placement: string = 'header') {
  if (!shouldTrack(`phone_${placement}`)) return;

  if (GOOGLE_ADS_CONVERSION_LABELS.phoneCall) {
    sendGtag('event', 'conversion', {
      send_to: GOOGLE_ADS_CONVERSION_LABELS.phoneCall,
      placement,
    });
  } else {
    sendGtag('event', 'phone_call_click', {
      send_to: GOOGLE_ADS_TAG_ID,
      placement,
      phone_number: '+91 90892 23344',
    });
  }
}

/**
 * Track WhatsApp button click
 */
export function trackWhatsAppClick(placement: string = 'general') {
  if (!shouldTrack(`whatsapp_${placement}`)) return;

  if (GOOGLE_ADS_CONVERSION_LABELS.whatsAppClick) {
    sendGtag('event', 'conversion', {
      send_to: GOOGLE_ADS_CONVERSION_LABELS.whatsAppClick,
      placement,
    });
  } else {
    sendGtag('event', 'whatsapp_click', {
      send_to: GOOGLE_ADS_TAG_ID,
      placement,
      channel: 'whatsapp',
    });
  }
}

/**
 * Track booking form handoff (only after validation when user initiates WhatsApp dispatch)
 */
export function trackBookingHandoff(details?: { serviceType?: string; vehicle?: string; estimatedPrice?: number | null }) {
  if (!shouldTrack('booking_handoff')) return;

  if (GOOGLE_ADS_CONVERSION_LABELS.bookingHandoff) {
    sendGtag('event', 'conversion', {
      send_to: GOOGLE_ADS_CONVERSION_LABELS.bookingHandoff,
      service_type: details?.serviceType || 'general',
      vehicle_type: details?.vehicle || 'sedan',
      value: details?.estimatedPrice || undefined,
      currency: 'INR',
    });
  } else {
    sendGtag('event', 'booking_submission_handoff', {
      send_to: GOOGLE_ADS_TAG_ID,
      service_type: details?.serviceType || 'general',
      vehicle_type: details?.vehicle || 'sedan',
      value: details?.estimatedPrice || undefined,
      currency: 'INR',
    });
  }
}

/**
 * Track page view / virtual route view on React single page app
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  sendGtag('event', 'page_view', {
    send_to: GOOGLE_ADS_TAG_ID,
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
}

/**
 * Global click listener that attaches to all tel: and WhatsApp links
 */
export function setupLinkClickTracking(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest('a') as HTMLAnchorElement | null;
    if (!anchor) return;

    const href = anchor.href || '';
    if (href.startsWith('tel:')) {
      trackPhoneClick(anchor.getAttribute('aria-label') || 'global_link');
    } else if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      trackWhatsAppClick(anchor.getAttribute('aria-label') || 'global_link');
    }
  };

  document.addEventListener('click', handleClick, { capture: true });
  return () => {
    document.removeEventListener('click', handleClick, { capture: true });
  };
}
