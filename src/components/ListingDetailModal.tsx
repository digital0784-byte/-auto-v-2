import React, { useState } from 'react';
import { Listing, Language, AccessPass } from '../types';
import { translations } from '../data/translations';
import { 
  X, 
  MapPin, 
  Send, 
  PhoneCall, 
  Share2, 
  Check, 
  CheckCircle2, 
  Bed, 
  Bath, 
  Maximize2, 
  Calendar, 
  Fuel, 
  Cog, 
  Gauge, 
  ShieldCheck,
  Building2,
  Car,
  Heart,
  Lock,
  LockOpen,
  KeyRound
} from 'lucide-react';
import { sendTelegramInquiry, triggerHaptic } from '../utils/telegram';

interface ListingDetailModalProps {
  listing: Listing | null;
  language: Language;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onShowToast: (msg: string) => void;
  accessPass: AccessPass;
  onOpenPassModal: (type: 'property' | 'vehicle') => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  language,
  onClose,
  isFavorite,
  onToggleFavorite,
  onShowToast,
  accessPass,
  onOpenPassModal,
}) => {
  if (!listing) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const t = translations[language];

  const isUnlocked =
    listing.type === 'property'
      ? accessPass.propertyUnlocked
      : accessPass.vehicleUnlocked;

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US');
  };

  const formattedPrice = `${formatPrice(listing.priceEtb)} ${t.etb}${
    listing.transaction === 'rent' ? ` ${t.perMonth}` : ''
  }`;

  const handleTelegramOrder = () => {
    if (!isUnlocked) {
      triggerHaptic('medium');
      onOpenPassModal(listing.type);
      return;
    }

    sendTelegramInquiry({
      listingId: listing.id,
      title: language === 'am' ? listing.titleAm : listing.titleEn,
      price: formattedPrice,
      type: listing.type,
      location: language === 'am' ? listing.locationAm : listing.locationEn,
      telegramUsername: listing.agent.telegramUsername,
    });
    onShowToast(t.inquirySuccess);
  };

  const handleShare = () => {
    triggerHaptic('light');
    if (navigator.share) {
      navigator.share({
        title: language === 'am' ? listing.titleAm : listing.titleEn,
        text: `${language === 'am' ? listing.titleAm : listing.titleEn} - ${formattedPrice}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      onShowToast(t.copiedLink);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const isProperty = listing.type === 'property';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto z-10 border border-slate-200 my-auto">
        
        {/* Sticky Header with Close & Actions */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md text-white uppercase ${
                listing.transaction === 'sale' ? 'bg-emerald-600' : 'bg-blue-600'
              }`}
            >
              {listing.transaction === 'sale' ? t.forSale : t.forRent}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {language === 'am' ? listing.regionNameAm : listing.regionNameEn}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              ID: {listing.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                triggerHaptic('light');
                onToggleFavorite(listing.id);
              }}
              className={`p-2 rounded-full border transition-colors ${
                isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Add to Favorites"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              title={t.shareListing}
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title={t.cancel}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] bg-slate-900 w-full overflow-hidden">
          <img
            src={listing.images[activeImageIndex] || listing.images[0]}
            alt={language === 'am' ? listing.titleAm : listing.titleEn}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/src/assets/images/hero_luxury_villa_addis_1793877072886.jpg';
            }}
            className="w-full h-full object-cover"
          />

          {/* Multiple image thumbnails */}
          {listing.images.length > 1 && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 overflow-x-auto p-1 bg-black/40 backdrop-blur-md rounded-xl">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-emerald-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-7 space-y-6">
          
          {/* Main Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 flex-wrap">
                <span className="font-semibold text-slate-700 uppercase">
                  {isProperty ? t.properties : t.vehicles}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-bold">
                  {language === 'am' ? listing.regionNameAm : listing.regionNameEn}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{listing.cityNameAm || listing.neighborhood}</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {language === 'am' ? listing.titleAm : listing.titleEn}
              </h2>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{language === 'am' ? listing.locationAm : listing.locationEn}</span>
              </p>
            </div>

            <div className="sm:text-right shrink-0 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl">
              <span className="text-xs text-slate-500 block uppercase font-medium">
                {language === 'am' ? 'የተጠየቀ ዋጋ' : 'Asking Price'}
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-950 tabular-nums">
                {formatPrice(listing.priceEtb)}{' '}
                <span className="text-emerald-600 text-lg font-bold">{t.etb}</span>
              </div>
              {listing.transaction === 'rent' && (
                <span className="text-xs text-slate-500 font-medium">
                  {t.perMonth}
                </span>
              )}
            </div>
          </div>

          {/* Specifications Breakdown Box */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
              {t.specifications}
            </h3>

            {isProperty && listing.propertySpecs ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Bed className="w-4 h-4 text-emerald-600" />
                    <span>{t.bedrooms}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 tabular-nums">
                    {listing.propertySpecs.bedrooms} {language === 'am' ? 'ክፍሎች' : 'Rooms'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Bath className="w-4 h-4 text-blue-600" />
                    <span>{t.bathrooms}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 tabular-nums">
                    {listing.propertySpecs.bathrooms}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Maximize2 className="w-4 h-4 text-amber-600" />
                    <span>{t.area}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 tabular-nums">
                    {listing.propertySpecs.areaSqm} {t.sqm}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <span>{language === 'am' ? 'እቃዎች' : 'Furnished'}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900">
                    {listing.propertySpecs.furnished 
                      ? (language === 'am' ? 'የተሟላለት' : 'Fully Furnished')
                      : (language === 'am' ? 'ያልተሟላ' : 'Unfurnished')}
                  </div>
                </div>
              </div>
            ) : listing.vehicleSpecs ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <span>{t.year}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 tabular-nums">
                    {listing.vehicleSpecs.year}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Cog className="w-4 h-4 text-emerald-600" />
                    <span>{t.transmission}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 capitalize">
                    {listing.vehicleSpecs.transmission === 'automatic' ? t.automatic : t.manual}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Fuel className="w-4 h-4 text-amber-600" />
                    <span>{t.fuelType}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 capitalize">
                    {listing.vehicleSpecs.fuelType === 'petrol'
                      ? t.petrol
                      : listing.vehicleSpecs.fuelType === 'diesel'
                      ? t.diesel
                      : listing.vehicleSpecs.fuelType === 'electric'
                      ? t.electric
                      : t.hybrid}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                    <Gauge className="w-4 h-4 text-purple-600" />
                    <span>{t.mileage}</span>
                  </div>
                  <div className="text-base font-bold text-slate-900 tabular-nums">
                    {listing.vehicleSpecs.mileageKm !== undefined
                      ? `${listing.vehicleSpecs.mileageKm.toLocaleString()} km`
                      : 'N/A'}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Description Section */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
              {t.description}
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
              {language === 'am' ? listing.descriptionAm : listing.descriptionEn}
            </p>
          </div>

          {/* Owner Connection & Search Pass Logic */}
          {isUnlocked ? (
            /* Unlocked: Full Direct Owner Contact */
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                  <LockOpen className="w-4 h-4" />
                  <span>{t.directOwnerAccess}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {language === 'am' ? 'የተረጋገጠ ባለቤት' : 'Verified Owner'}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-lg text-white shrink-0">
                    {listing.agent.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-base text-white">
                        {listing.agent.name}
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xs text-slate-300">
                      {language === 'am' ? listing.agent.roleAm : listing.agent.roleEn}
                    </div>
                    <div className="text-sm font-mono text-emerald-400 font-bold mt-1">
                      {listing.agent.phone}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`tel:${listing.agent.phone}`}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{t.callAgent}</span>
                  </a>
                </div>
              </div>

              {/* Direct Telegram Instant Inquiry Action */}
              <div className="pt-2">
                <button
                  onClick={handleTelegramOrder}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2.5 transition-all transform active:scale-98"
                >
                  <Send className="w-5 h-5" />
                  <span>{t.orderViaTelegram}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Locked: Buyer / Renter must pay 150 ETB (house) or 200 ETB (car) to connect with owner */
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-slate-900 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-xs shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">
                    {language === 'am' ? 'ከባለቤቱ ጋር በቀጥታ ለመገናኘት' : 'Direct Owner Access Locked'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-relaxed">
                    {isProperty
                      ? t.buyerPassSubProperty
                      : t.buyerPassSubVehicle}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    triggerHaptic('medium');
                    onOpenPassModal(listing.type);
                  }}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <KeyRound className="w-5 h-5" />
                  <span>
                    {language === 'am'
                      ? `የባለቤቱን ስልክ ክፈት (${isProperty ? '150' : '200'} ብር)`
                      : `Unlock Owner Contact (${isProperty ? '150' : '200'} ETB)`}
                  </span>
                </button>
                <p className="text-[11px] text-center text-slate-500 mt-2">
                  {language === 'am'
                    ? 'በቴሌብር ወይም በኢትዮጵያ ንግድ ባንክ (CBE) በቀላሉ መክፈል ይችላሉ።'
                    : 'Instant activation via Telebirr (*127#) or Commercial Bank of Ethiopia (CBE).'}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
