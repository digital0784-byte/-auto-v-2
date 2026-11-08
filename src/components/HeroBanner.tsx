import React, { useState } from 'react';
import { Language, MarketplaceType, TransactionType } from '../types';
import { ETHIOPIAN_REGIONS } from '../data/ethiopiaRegions';
import { translations } from '../data/translations';
import { Building2, Car, Search, MapPin, Sparkles, ShieldCheck, KeyRound, PenLine } from 'lucide-react';

interface HeroBannerProps {
  language: Language;
  activeMarketplace: MarketplaceType;
  onSelectMarketplace: (m: MarketplaceType) => void;
  activeTransaction: TransactionType;
  onSelectTransaction: (t: TransactionType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRegionId: string;
  onSelectRegionId: (regId: string) => void;
  customLocationFilter: string;
  onCustomLocationFilterChange: (loc: string) => void;
  totalListingsCount: number;
  propertiesCount: number;
  vehiclesCount: number;
  onOpenBankModal: () => void;
  onOpenPassModal: (type: 'property' | 'vehicle' | 'both') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  language,
  activeMarketplace,
  onSelectMarketplace,
  activeTransaction,
  onSelectTransaction,
  searchQuery,
  onSearchChange,
  selectedRegionId,
  onSelectRegionId,
  customLocationFilter,
  onCustomLocationFilterChange,
  totalListingsCount,
  propertiesCount,
  vehiclesCount,
  onOpenBankModal,
  onOpenPassModal,
}) => {
  const t = translations[language];
  const [showCustomInput, setShowCustomInput] = useState(Boolean(customLocationFilter));

  const popularTowns = [
    { am: 'አዳማ', en: 'Adama' },
    { am: 'ሀዋሳ', en: 'Hawassa' },
    { am: 'ባህር ዳር', en: 'Bahir Dar' },
    { am: 'ቢሾፍቱ', en: 'Bishoftu' },
    { am: 'ድሬዳዋ', en: 'Dire Dawa' },
    { am: 'ጎንደር', en: 'Gondar' },
    { am: 'መቐለ', en: 'Mekelle' },
    { am: 'ሞጆ', en: 'Mojo' },
    { am: 'ሆለታ', en: 'Holeta' },
  ];

  return (
    <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-8 pb-10 border-b border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Brand Title & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs text-emerald-400 font-medium mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'am'
                ? 'በመላው የኢትዮጵያ ክፍሎች የሚሰራ ይፋዊ የቤትና የመኪና መድረክ'
                : 'Nationwide Ethiopian Property & Automobile Exchange'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
            {language === 'am' ? (
              <>
                በሁሉም የኢትዮጵያ ክፍሎች <span className="text-emerald-400">የቤት</span> እና{' '}
                <span className="text-sky-400">የመኪና</span> ኪራይና ሽያጭ
              </>
            ) : (
              <>
                Nationwide <span className="text-emerald-400">Properties</span> &{' '}
                <span className="text-sky-400">Vehicles</span> Across Ethiopia
              </>
            )}
          </h1>
          <p className="mt-2.5 text-xs sm:text-base text-slate-300 font-normal">
            {t.brandTagline}
          </p>
        </div>

        {/* Unified Search & Multi-Level Controls Box */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md max-w-4xl mx-auto">
          
          {/* Marketplace Tabs (Properties vs Vehicles vs All) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            {/* Category Segmented Control */}
            <div className="inline-flex p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              <button
                onClick={() => onSelectMarketplace('all')}
                className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeMarketplace === 'all'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.allMarketplaces}
              </button>
              <button
                onClick={() => onSelectMarketplace('property')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeMarketplace === 'property'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{t.properties}</span>
              </button>
              <button
                onClick={() => onSelectMarketplace('vehicle')}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  activeMarketplace === 'vehicle'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>{t.vehicles}</span>
              </button>
            </div>

            {/* Transaction Type Filters (For Sale / For Rent / All) */}
            <div className="inline-flex p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              <button
                onClick={() => onSelectTransaction('all')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTransaction === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.allTransactions}
              </button>
              <button
                onClick={() => onSelectTransaction('sale')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTransaction === 'sale'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.forSale}
              </button>
              <button
                onClick={() => onSelectTransaction('rent')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTransaction === 'rent'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.forRent}
              </button>
            </div>
          </div>

          {/* Search Bar Input & Ethiopian Region Filter */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
            {/* Region Dropdown */}
            <div className="sm:w-52 shrink-0">
              <select
                value={selectedRegionId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    setShowCustomInput(true);
                    onSelectRegionId('');
                  } else {
                    onSelectRegionId(val);
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs sm:text-sm text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">{t.allRegions}</option>
                {ETHIOPIAN_REGIONS.map((reg) => (
                  <option key={reg.id} value={reg.id}>
                    {language === 'am' ? reg.nameAm : reg.nameEn}
                  </option>
                ))}
                <option value="custom">✍️ {language === 'am' ? 'የተለየ ከተማ በራስዎ ይፃፉ...' : 'Type Custom City / Town...'}</option>
              </select>
            </div>

            {/* Keyword search input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Access Pass quick button */}
            <button
              onClick={() => onOpenPassModal('both')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>{t.activateSearchPass}</span>
            </button>
          </div>

          {/* Buyer Custom Location Typing Row (ገዥም እንደዚሁ በራሱ ፅፎ መፈለግ ይችላል) */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-amber-400 font-semibold flex items-center gap-1 shrink-0">
                <PenLine className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'የተለየ ከተማ / ሰፈር በራስዎ ፅፈው ይፈልጉ:' : 'Type Any Custom City/Town:'}</span>
              </span>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customLocationFilter}
                  onChange={(e) => onCustomLocationFilterChange(e.target.value)}
                  placeholder="ምሳሌ: ሞጆ፣ ሆለታ፣ ወልቂጤ፣ ወልዲያ፣ ሻኪሶ፣ ባሌ ሮቤ..."
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
                />
                {customLocationFilter && (
                  <button
                    onClick={() => onCustomLocationFilterChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Quick Town Suggestions */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 shrink-0">
              {popularTowns.slice(0, 5).map((town) => (
                <button
                  key={town.en}
                  onClick={() => onCustomLocationFilterChange(language === 'am' ? town.am : town.en)}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors shrink-0 ${
                    customLocationFilter === (language === 'am' ? town.am : town.en)
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {language === 'am' ? town.am : town.en}
                </button>
              ))}
            </div>
          </div>

          {/* Nationwide Regional Quick Selector */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 mr-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{language === 'am' ? 'ክልሎች:' : 'Regions:'}</span>
            </span>
            <button
              onClick={() => onSelectRegionId('')}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors shrink-0 font-medium ${
                selectedRegionId === ''
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {language === 'am' ? 'ሁሉም' : 'All'}
            </button>
            {ETHIOPIAN_REGIONS.map((reg) => {
              const isSelected = selectedRegionId === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => {
                    onSelectRegionId(reg.id);
                    onCustomLocationFilterChange('');
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg transition-colors shrink-0 font-medium ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {language === 'am' ? reg.nameAm : reg.nameEn}
                </button>
              );
            })}
          </div>

        </div>

        {/* Fast Trust Proof Indicators & Official Tariffs */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto text-center">
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
            <div className="text-lg sm:text-xl font-extrabold text-white tabular-nums">
              {propertiesCount}+
            </div>
            <div className="text-[11px] text-slate-400">
              {language === 'am' ? 'የተመዘገቡ ቤቶች' : 'Properties Available'}
            </div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
            <div className="text-lg sm:text-xl font-extrabold text-white tabular-nums">
              {vehiclesCount}+
            </div>
            <div className="text-[11px] text-slate-400">
              {language === 'am' ? 'የተመዘገቡ መኪኖች' : 'Vehicles in Stock'}
            </div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-lg sm:text-xl font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span>100%</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {language === 'am' ? 'በመላው ኢትዮጵያ' : 'All 12+ Regions'}
            </div>
          </div>
          <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-lg sm:text-xl font-bold">
              <KeyRound className="w-4 h-4" />
              <span>150/200</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {language === 'am' ? 'የመፈለጊያ ፍቃድ (ብር)' : 'Search Pass (ETB)'}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
