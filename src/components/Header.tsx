import React from 'react';
import { Language, MarketplaceType } from '../types';
import { translations } from '../data/translations';
import { Building2, Car, PlusCircle, CreditCard, Globe, Send, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeMarketplace: MarketplaceType;
  onSelectMarketplace: (m: MarketplaceType) => void;
  onOpenPostModal: () => void;
  onOpenBankModal: () => void;
  onOpenAdminModal: () => void;
  pendingAdminCount: number;
  isTelegram: boolean;
  telegramUser?: string;
  favoritesCount: number;
  onOpenFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  activeMarketplace,
  onSelectMarketplace,
  onOpenPostModal,
  onOpenBankModal,
  onOpenAdminModal,
  pendingAdminCount,
  isTelegram,
  telegramUser,
  favoritesCount,
  onOpenFavorites,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md backdrop-blur-md bg-slate-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectMarketplace('all')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                N
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                  {language === 'am' ? 'ኑር ገበያ' : 'NUR Marketplace'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap hidden sm:block">
                  {language === 'am' ? 'የቤት እና የመኪና ኪራይና ሽያጭ' : 'Property & Auto Exchange'}
                </span>
              </div>
            </button>

            {isTelegram && (
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-[11px] text-sky-300">
                <Send className="w-3 h-3 text-sky-400" />
                <span>Mini App</span>
                {telegramUser && <span className="text-slate-300">· {telegramUser}</span>}
              </div>
            )}
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-300">
            <button
              onClick={() => onSelectMarketplace('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeMarketplace === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t.allMarketplaces}
            </button>
            <button
              onClick={() => onSelectMarketplace('property')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeMarketplace === 'property'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{t.properties}</span>
            </button>
            <button
              onClick={() => onSelectMarketplace('vehicle')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                activeMarketplace === 'vehicle'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Car className="w-4 h-4 text-sky-400" />
              <span>{t.vehicles}</span>
            </button>
            <button
              onClick={onOpenBankModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors whitespace-nowrap"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>{t.paymentAccounts}</span>
            </button>
          </nav>

          {/* Zone 3: Actions (Language Switch, Admin Approval & Post Listing CTA) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Admin Portal Button with Pending Count */}
            <button
              onClick={onOpenAdminModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-300 border border-amber-500/30 transition-all active:scale-95"
              title="የአድሚን ክፍያ ማረጋገጫ ዳሽቦርድ"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{t.adminPanel}</span>
              {pendingAdminCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center animate-pulse">
                  {pendingAdminCount}
                </span>
              )}
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => onLanguageChange(language === 'am' ? 'en' : 'am')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700/60"
              title="ቋንቋ ቀይር / Switch Language"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'am' ? 'English' : 'አማርኛ'}</span>
            </button>

            {/* Post Listing CTA */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t.postListing}</span>
              <span className="sm:hidden">{language === 'am' ? 'መዝግብ' : 'Post'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
