import React, { useState } from 'react';
import { X, CheckCircle2, Phone, MessageSquare, Car, MapPin, Calendar, Clock, ArrowRight, AlertCircle, Send } from 'lucide-react';
import { PHONE_NUMBER, DISPLAY_PHONE, WHATSAPP_URL } from '../data/taxiData';
import { trackWhatsAppClick, trackPhoneClick, trackBookingHandoff } from '../utils/googleAds';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: any;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, bookingDetails }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isHandoffReady, setIsHandoffReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
  };

  const formattedWhatsAppText = encodeURIComponent(
    `Hello C Taxi,\nI would like to book a cab in Coimbatore with the following details:\n` +
    `• Name: ${customerName.trim() || 'Customer'}\n` +
    `• Phone: +91 ${customerPhone.trim()}\n` +
    `• Pickup Address/Landmark: ${pickupAddress.trim() || bookingDetails?.pickup || 'Coimbatore'}\n` +
    `• Destination/Service: ${bookingDetails?.drop || 'As Requested'}\n` +
    `• Vehicle: ${bookingDetails?.vehicle || 'Prime AC Sedan'}\n` +
    `• Date & Time: ${bookingDetails?.date || 'Today'} at ${bookingDetails?.time || 'Immediate'}\n` +
    `• Fare: ${bookingDetails?.estimatedPrice ? `~₹${bookingDetails.estimatedPrice.toLocaleString('en-IN')} (Estimated)` : 'Contact for Quote'}\n` +
    (specialNotes.trim() ? `• Notes: ${specialNotes.trim()}\n` : '') +
    `\nPlease confirm vehicle availability and driver dispatch.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!customerName.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }

    if (!validatePhone(customerPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    // Track the genuine validated booking handoff
    trackBookingHandoff({
      serviceType: bookingDetails?.serviceType,
      vehicle: bookingDetails?.vehicle,
      estimatedPrice: bookingDetails?.estimatedPrice,
    });

    setIsHandoffReady(true);
    setIsSubmitting(false);
  };

  const handleOpenWhatsApp = () => {
    trackWhatsAppClick('booking_modal_handoff');
    const waUrl = `${WHATSAPP_URL}?text=${formattedWhatsAppText}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCallDispatcher = () => {
    trackPhoneClick('booking_modal');
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  const handleReset = () => {
    setIsHandoffReady(false);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white border border-[#E5E0D8] rounded-2xl shadow-2xl overflow-hidden text-[#171717]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E5E0D8] bg-[#F5F2EA]">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#FFBF00] text-[#171717] font-extrabold flex items-center justify-center font-heading text-lg shadow-sm">
              C
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-[#171717] font-heading">C Taxi</span>
                <span className="text-[9px] font-bold text-[#171717] bg-[#FFBF00] px-1.5 py-0.5 rounded uppercase tracking-wider">
                  COIMBATORE
                </span>
              </div>
              <p className="text-[11px] text-[#777777]">
                Central Dispatch Desk: {DISPLAY_PHONE}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777777] hover:text-[#171717] hover:bg-neutral-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          
          {isHandoffReady ? (
            <div className="text-center py-2 space-y-4">
              
              {/* Informational Action Step Header */}
              <div className="w-14 h-14 rounded-2xl bg-[#FFBF00]/20 text-[#171717] flex items-center justify-center mx-auto border border-[#FFBF00]/40">
                <Send className="w-7 h-7 text-[#171717]" />
              </div>

              <div className="space-y-1.5">
                <h4 id="booking-modal-title" className="text-lg sm:text-xl font-extrabold text-[#171717] font-heading">
                  Final Step: Send WhatsApp Message to Dispatcher
                </h4>
                <p className="text-xs sm:text-sm text-[#777777] max-w-sm mx-auto leading-relaxed">
                  Your booking details have been prepared for <strong className="text-[#171717]">{customerName}</strong> (+91 {customerPhone}).
                </p>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    Action Required to Complete Booking:
                  </div>
                  <p className="leading-relaxed">
                    Click the green button below to open WhatsApp with your pre-filled message. <strong>You must send the message in WhatsApp</strong> so our Coimbatore central desk (+91 90892 23344) can assign your driver and dispatch your cab.
                  </p>
                </div>
              </div>

              {/* Prepared Booking Summary */}
              <div className="p-3.5 rounded-xl bg-[#F5F2EA] border border-[#E5E0D8] text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#777777]">Vehicle:</span>
                  <strong className="text-[#171717]">{bookingDetails?.vehicle || 'Prime AC Sedan'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Pickup:</span>
                  <span className="text-[#171717] font-medium truncate max-w-[220px]">
                    {pickupAddress || bookingDetails?.pickup}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Destination:</span>
                  <span className="text-[#171717] font-medium truncate max-w-[220px]">
                    {bookingDetails?.drop}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E5E0D8] pt-1.5">
                  <span className="text-[#777777]">Estimated Fare:</span>
                  <strong className="text-[#171717] font-bold">
                    {bookingDetails?.estimatedPrice ? `₹${bookingDetails.estimatedPrice.toLocaleString('en-IN')}` : 'Contact for quote'}
                  </strong>
                </div>
              </div>

              {/* Explicit Handoff Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-extrabold text-sm text-white bg-[#25D366] hover:bg-[#20BD5A] transition-all shadow-md active:scale-95"
                >
                  <MessageSquare className="w-5 h-5 fill-white/20" />
                  <span>Open WhatsApp & Send to Dispatcher</span>
                </button>

                <button
                  type="button"
                  onClick={handleCallDispatcher}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-[#171717] bg-[#FFBF00] hover:bg-[#E5AC00] transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4 fill-[#171717]" />
                  <span>Or Call Dispatcher Directly ({DISPLAY_PHONE})</span>
                </button>

                <div className="flex justify-between text-xs text-[#777777] pt-1 px-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="hover:text-[#171717] underline text-[11px]"
                  >
                    ← Edit Booking Details
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="hover:text-[#171717] text-[11px]"
                  >
                    Close Window
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Ride Summary Quick Snippet */}
              {bookingDetails && (
                <div className="p-3.5 rounded-xl bg-[#F5F2EA] border border-[#E5E0D8] text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-[#777777]">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-[#FFBF00]" /> Vehicle:
                    </span>
                    <strong className="text-[#171717]">{bookingDetails.vehicle}</strong>
                  </div>
                  <div className="flex justify-between items-center text-[#777777]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#FFBF00]" /> Route:
                    </span>
                    <span className="truncate max-w-[200px] text-right font-medium text-[#171717]">
                      {bookingDetails.pickup} → {bookingDetails.drop}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 border-t border-[#E5E0D8]">
                    <span className="text-[#777777]">Estimated Fare:</span>
                    <strong className="text-[#171717] font-mono text-sm tabular-nums font-extrabold">
                      {bookingDetails.estimatedPrice ? `₹${bookingDetails.estimatedPrice.toLocaleString('en-IN')}` : 'Contact for quote'}
                    </strong>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Passenger Name */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full bg-[#F5F2EA] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#171717] focus:outline-none focus:border-[#FFBF00]"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1 flex items-center justify-between">
                  <span>Mobile Number for Driver Coordination <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-emerald-700 font-semibold">10-digit mobile</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-[#777777] select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9089223344"
                    className="w-full bg-[#F5F2EA] border border-[#E5E0D8] rounded-xl pl-11 pr-3 py-2 text-xs sm:text-sm text-[#171717] font-mono tracking-wider focus:outline-none focus:border-[#FFBF00]"
                  />
                </div>
              </div>

              {/* Exact Pickup Address / Landmark */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Pickup Street Address or Landmark
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="e.g. Near PSG Tech Main Gate, Peelamedu"
                  className="w-full bg-[#F5F2EA] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#FFBF00]"
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-[#171717] mb-1">
                  Luggage or Ride Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="e.g. 2 large suitcases, early morning flight pickup"
                  className="w-full bg-[#F5F2EA] border border-[#E5E0D8] rounded-xl px-3 py-2 text-xs text-[#171717] focus:outline-none focus:border-[#FFBF00] resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-[#171717] bg-[#FFBF00] hover:bg-[#E5AC00] transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Car className="w-4 h-4" />
                  <span>Proceed to WhatsApp Dispatch Handoff</span>
                </button>

                <div className="text-center">
                  <span className="text-[11px] text-[#777777]">Need instant telephone dispatch? </span>
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    onClick={() => trackPhoneClick('booking_modal_inline')}
                    className="text-[11px] text-[#171717] hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <span>Call {DISPLAY_PHONE}</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </form>
          )}

        </div>

        {/* Modal Bottom Transparency Note */}
        <div className="p-3 bg-[#F5F2EA] border-t border-[#E5E0D8] text-[11px] text-[#777777] text-center">
          🔒 Direct handoff to C Taxi Coimbatore dispatch desk (+91 90892 23344). Zero spam.
        </div>

      </div>
    </div>
  );
};
