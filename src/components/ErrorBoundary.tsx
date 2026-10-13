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
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 text-center shadow-2xl">
            <div className="w-14 h-14 bg-[#FFBF00]/10 rounded-2xl flex items-center justify-center mx-auto border border-[#FFBF00]/20">
              <AlertTriangle className="w-8 h-8 text-[#FFBF00]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-extrabold font-heading text-white">
                C Taxi · Service Notice
              </h1>
              <p className="text-xs sm:text-sm text-[#D5CEBE]">
                An unexpected page loading issue occurred. Tap reload below to refresh C Taxi or call our 24/7 desk directly.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full py-3 px-4 rounded-xl bg-[#FFBF00] hover:bg-[#E5AC00] text-[#171717] font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload C Taxi Homepage</span>
              </button>

              <a
                href={`tel:${PHONE_NUMBER}`}
                className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs sm:text-sm transition-all border border-neutral-700 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#FFBF00]" />
                <span>Call 24/7 Desk: {DISPLAY_PHONE}</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
