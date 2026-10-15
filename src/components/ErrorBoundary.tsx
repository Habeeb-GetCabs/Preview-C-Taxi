import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Phone, RefreshCw, AlertTriangle } from 'lucide-react';
import { PHONE_NUMBER, DISPLAY_PHONE } from '../data/taxiData';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught C Taxi React Error:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#171717] text-white flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-5 text-center shadow-2xl">
            <div className="w-14 h-14 bg-[#FFBF00] text-[#171717] font-extrabold text-2xl font-heading rounded-2xl flex items-center justify-center mx-auto shadow-md">
              C
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
                C Taxi · Coimbatore 24/7 Call Taxi &amp; Outstation Fleet
              </h1>
              <p className="text-xs sm:text-sm text-[#D5CEBE] leading-relaxed">
                Doorstep AC cabs across Coimbatore in 10-15 minutes. Ooty hill trips from ₹3,000, outstation travel from ₹15/km, and CJB airport transfers.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A0A09C] py-2 border-y border-neutral-800 text-left">
              <div>✓ 10-15 Min Kovai Arrival</div>
              <div>✓ Outstation from ₹15/km</div>
              <div>✓ Ooty from ₹3,000</div>
              <div>✓ Zero Surge Pricing</div>
            </div>

            <div className="space-y-3 pt-1">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="w-full py-3.5 px-4 rounded-xl bg-[#FFBF00] hover:bg-[#E5AC00] text-[#171717] font-extrabold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <Phone className="w-4 h-4 fill-[#171717]" />
                <span>Call 24/7 Hotline: {DISPLAY_PHONE}</span>
              </a>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs sm:text-sm transition-all border border-neutral-700 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-[#FFBF00]" />
                <span>Reload C Taxi Homepage</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
