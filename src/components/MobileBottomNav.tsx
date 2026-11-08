import React from 'react';
import { MarketplaceType, Language } from '../types';
import { translations } from '../data/translations';
import { LayoutGrid, Building2, Car, PlusCircle, CreditCard, Heart } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface MobileBottomNavProps {
  language: Language;
  activeMarketplace: MarketplaceType;
  onSelectMarketplace: (m: MarketplaceType) => void;
  onOpenPostModal: () => void;
  onOpenBankModal: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  showingFavorites: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  language,
  activeMarketplace,
  onSelectMarketplace,
  onOpenPostModal,
  onOpenBankModal,
  favoritesCount,
  onOpenFavorites,
  showingFavorites,
}) => {
  const t = translations[language];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-white px-2 py-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      <div className="grid grid-cols-5 items-center">
        
        {/* All */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onSelectMarketplace('all');
          }}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors ${
            activeMarketplace === 'all' && !showingFavorites
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-[55px]">
            {language === 'am' ? 'ገበያ' : 'All'}
          </span>
        </button>

        {/* Properties */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onSelectMarketplace('property');
          }}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors ${
            activeMarketplace === 'property' && !showingFavorites
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-[55px]">
            {t.properties}
          </span>
        </button>

        {/* Post Button (Prominent Center) */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            onOpenPostModal();
          }}
          className="flex flex-col items-center justify-center -mt-3 text-white group"
        >
          <div className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/40 text-slate-950 font-black transition-transform active:scale-90">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-bold text-emerald-400 mt-0.5">
            {language === 'am' ? 'መዝግብ' : 'Post'}
          </span>
        </button>

        {/* Vehicles */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onSelectMarketplace('vehicle');
          }}
          className={`flex flex-col items-center justify-center py-1.5 transition-colors ${
            activeMarketplace === 'vehicle' && !showingFavorites
              ? 'text-sky-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Car className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-[55px]">
            {t.vehicles}
          </span>
        </button>

        {/* Payment / Banks */}
        <button
          onClick={() => {
            triggerHaptic('light');
            onOpenBankModal();
          }}
          className="flex flex-col items-center justify-center py-1.5 text-slate-400 hover:text-amber-400 transition-colors"
        >
          <CreditCard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] truncate max-w-[55px]">
            {language === 'am' ? 'ክፍያ' : 'Banks'}
          </span>
        </button>

      </div>
    </nav>
  );
};
