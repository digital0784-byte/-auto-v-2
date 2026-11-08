import React from 'react';
import { Language, AccessPass, MarketplaceType } from '../types';
import { translations } from '../data/translations';
import { KeyRound, CheckCircle2, ShieldCheck, Sparkles, Building2, Car } from 'lucide-react';

interface AccessPassBannerProps {
  language: Language;
  accessPass: AccessPass;
  activeMarketplace: MarketplaceType;
  onOpenPassModal: (type: 'property' | 'vehicle' | 'both') => void;
}

export const AccessPassBanner: React.FC<AccessPassBannerProps> = ({
  language,
  accessPass,
  activeMarketplace,
  onOpenPassModal,
}) => {
  const t = translations[language];

  const isPropertyView = activeMarketplace === 'property';
  const isVehicleView = activeMarketplace === 'vehicle';

  const isCurrentUnlocked =
    isPropertyView
      ? accessPass.propertyUnlocked
      : isVehicleView
      ? accessPass.vehicleUnlocked
      : accessPass.propertyUnlocked && accessPass.vehicleUnlocked;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-md mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Left Information */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
            <KeyRound className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm sm:text-base text-white">
                {t.feeSystemTitle}
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                {language === 'am' ? 'በመላው ኢትዮጵያ' : 'All Regions'}
              </span>
            </div>

            {/* Fee summary bullets */}
            <div className="mt-1 text-xs text-slate-300 space-y-1">
              <p className="flex items-center gap-1.5 text-slate-200">
                <span className="text-amber-400 font-semibold">{t.searchFeeNotice}:</span>
                <span className="text-emerald-300 font-bold tabular-nums">ለቤት 150 ብር</span>
                <span>·</span>
                <span className="text-sky-300 font-bold tabular-nums">ለመኪና 200 ብር</span>
                <span className="text-slate-400">({language === 'am' ? 'ከባለቤቱ ጋር በቀጥታ ለመገናኘት' : 'Direct Owner Contact'})</span>
              </p>
              <p className="text-[11px] text-slate-400">
                <span className="text-slate-300 font-medium">{t.listingFeeNotice}:</span>{' '}
                {t.listingFeeBreakdown}
              </p>
            </div>
          </div>
        </div>

        {/* Right Status / Action Button */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
          {/* Property Pass Status */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>{language === 'am' ? 'ቤት ፍቃድ:' : 'Home Pass:'}</span>
            {accessPass.propertyUnlocked ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'ክፍት' : 'Active'}</span>
              </span>
            ) : accessPass.propertyStatus === 'pending' ? (
              <span className="text-amber-400 font-bold animate-pulse">
                ⏳ {language === 'am' ? 'በማረጋገጥ ላይ' : 'Pending'}
              </span>
            ) : (
              <span className="text-amber-400 font-bold">150 ETB</span>
            )}
          </div>

          {/* Vehicle Pass Status */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
            <Car className="w-4 h-4 text-sky-400" />
            <span>{language === 'am' ? 'መኪና ፍቃድ:' : 'Car Pass:'}</span>
            {accessPass.vehicleUnlocked ? (
              <span className="flex items-center gap-1 text-sky-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'am' ? 'ክፍት' : 'Active'}</span>
              </span>
            ) : accessPass.vehicleStatus === 'pending' ? (
              <span className="text-amber-400 font-bold animate-pulse">
                ⏳ {language === 'am' ? 'በማረጋገጥ ላይ' : 'Pending'}
              </span>
            ) : (
              <span className="text-amber-400 font-bold">200 ETB</span>
            )}
          </div>

          {/* Trigger Activation Modal Button */}
          {(!accessPass.propertyUnlocked || !accessPass.vehicleUnlocked) && (
            <button
              onClick={() => onOpenPassModal(isVehicleView ? 'vehicle' : 'property')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap"
            >
              {t.activateSearchPass}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
