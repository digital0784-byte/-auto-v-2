import React from 'react';
import { Listing, Language, AccessPass } from '../types';
import { translations } from '../data/translations';
import { 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Fuel, 
  Cog, 
  MapPin, 
  Send, 
  Heart, 
  PhoneCall,
  Lock,
  LockOpen
} from 'lucide-react';
import { sendTelegramInquiry, triggerHaptic } from '../utils/telegram';

interface ListingCardProps {
  listing: Listing;
  language: Language;
  onSelect: (listing: Listing) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  accessPass: AccessPass;
  onOpenPassModal: (type: 'property' | 'vehicle') => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  language,
  onSelect,
  isFavorite,
  onToggleFavorite,
  accessPass,
  onOpenPassModal,
}) => {
  const t = translations[language];

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US');
  };

  const isUnlocked =
    listing.type === 'property'
      ? accessPass.propertyUnlocked
      : accessPass.vehicleUnlocked;

  const handleTelegramClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUnlocked) {
      triggerHaptic('medium');
      onOpenPassModal(listing.type);
      return;
    }

    const formattedPrice = `${formatPrice(listing.priceEtb)} ${t.etb}${
      listing.transaction === 'rent' ? ` ${t.perMonth}` : ''
    }`;

    sendTelegramInquiry({
      listingId: listing.id,
      title: language === 'am' ? listing.titleAm : listing.titleEn,
      price: formattedPrice,
      type: listing.type,
      location: language === 'am' ? listing.locationAm : listing.locationEn,
      telegramUsername: listing.agent.telegramUsername,
    });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic('light');
    onToggleFavorite(listing.id);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isUnlocked) {
      triggerHaptic('medium');
      onOpenPassModal(listing.type);
      return;
    }
    window.location.href = `tel:${listing.agent.phone}`;
  };

  const isProperty = listing.type === 'property';

  return (
    <div 
      onClick={() => onSelect(listing)}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-1"
    >
      {/* Media Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={listing.images[0]}
          alt={language === 'am' ? listing.titleAm : listing.titleEn}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/hero_luxury_villa_addis_1793877072886.jpg';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges: Transaction Type, Region & Favorite */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md text-white shadow-sm tracking-wide uppercase ${
                listing.transaction === 'sale'
                  ? 'bg-emerald-600'
                  : 'bg-blue-600'
              }`}
            >
              {listing.transaction === 'sale' ? t.forSale : t.forRent}
            </span>

            {/* Region badge */}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white border border-white/20">
              {language === 'am' ? listing.regionNameAm : listing.regionNameEn}
            </span>
          </div>

          <button
            onClick={handleFavoriteClick}
            aria-label="Add to favorites"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md ${
              isFavorite
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom Bar on Media: Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
          <div className="flex items-baseline gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg">
            <span className="text-lg sm:text-xl font-extrabold tabular-nums tracking-tight text-white">
              {formatPrice(listing.priceEtb)}
            </span>
            <span className="text-xs font-semibold text-emerald-400">
              {t.etb}
            </span>
            {listing.transaction === 'rent' && (
              <span className="text-[11px] text-slate-300 font-normal">
                {t.perMonth}
              </span>
            )}
          </div>

          {/* Registration fee marker */}
          <div className="text-[10px] bg-slate-900/80 px-2 py-1 rounded text-slate-300">
            {language === 'am' ? 'የተመዘገበ' : 'Registered'}
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Unboxed Metadata (Zero-pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wide">
              {isProperty 
                ? (language === 'am' ? 'ቤት' : 'Property')
                : (language === 'am' ? 'መኪና' : 'Vehicle')}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-600 truncate">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{listing.cityNameAm || listing.neighborhood}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-snug">
            {language === 'am' ? listing.titleAm : listing.titleEn}
          </h3>

          {/* Location Full Subtitle */}
          <p className="text-xs text-slate-500 line-clamp-1 mt-1">
            {language === 'am' ? listing.locationAm : listing.locationEn}
          </p>

          {/* Specifications Grid */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
            {isProperty && listing.propertySpecs ? (
              <>
                <div className="flex items-center gap-1" title={t.bedrooms}>
                  <Bed className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold tabular-nums">{listing.propertySpecs.bedrooms}</span>
                  <span className="text-slate-400 hidden sm:inline">{language === 'am' ? 'መኝታ' : 'Beds'}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1" title={t.bathrooms}>
                  <Bath className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="font-semibold tabular-nums">{listing.propertySpecs.bathrooms}</span>
                  <span className="text-slate-400 hidden sm:inline">{language === 'am' ? 'መታጠቢያ' : 'Baths'}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1" title={t.area}>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-semibold tabular-nums">{listing.propertySpecs.areaSqm}</span>
                  <span className="text-slate-400">{t.sqm}</span>
                </div>
              </>
            ) : listing.vehicleSpecs ? (
              <>
                <div className="flex items-center gap-1" title={t.year}>
                  <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span className="font-semibold tabular-nums">{listing.vehicleSpecs.year}</span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1" title={t.transmission}>
                  <Cog className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="capitalize font-medium">
                    {listing.vehicleSpecs.transmission === 'automatic' ? t.automatic : t.manual}
                  </span>
                </div>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1" title={t.fuelType}>
                  <Fuel className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="capitalize font-medium">
                    {listing.vehicleSpecs.fuelType === 'petrol'
                      ? t.petrol
                      : listing.vehicleSpecs.fuelType === 'diesel'
                      ? t.diesel
                      : listing.vehicleSpecs.fuelType === 'electric'
                      ? t.electric
                      : t.hybrid}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Action Buttons: With Pass Unlock Awareness */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          {isUnlocked ? (
            <>
              <button
                onClick={handleTelegramClick}
                className="flex-1 py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap active:scale-95"
                title="በቴሌግራም እዘዝ ወይም ጠይቅ"
              >
                <Send className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">{t.orderViaTelegram}</span>
              </button>

              <button
                onClick={handleCallClick}
                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors shrink-0"
                title={`${t.callAgent}: ${listing.agent.phone}`}
                aria-label="Call Owner"
              >
                <PhoneCall className="w-4 h-4 text-emerald-600" />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                triggerHaptic('medium');
                onOpenPassModal(listing.type);
              }}
              className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="truncate">
                {language === 'am'
                  ? `ከባለቤቱ ጋር ተገናኝ (${isProperty ? '150' : '200'} ብር ፍቃድ)`
                  : `Connect with Owner (${isProperty ? '150' : '200'} ETB Pass)`}
              </span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
