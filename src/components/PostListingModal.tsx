import React, { useState, useMemo } from 'react';
import { 
  Listing, 
  Language, 
  PropertyCategory, 
  VehicleCategory, 
  calculateListingFee 
} from '../types';
import { ETHIOPIAN_REGIONS } from '../data/ethiopiaRegions';
import { officialBankAccounts } from '../data/bankAccounts';
import { translations } from '../data/translations';
import { 
  X, 
  PlusCircle, 
  Building2, 
  Car, 
  Check, 
  Copy, 
  ShieldCheck, 
  CreditCard,
  MapPin,
  Lock
} from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

import { PaymentRequest } from '../types';

interface PostListingModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onSubmit: (listing: Listing, paymentRequest?: Omit<PaymentRequest, 'id' | 'createdAt' | 'status'>) => void;
  onShowToast: (msg: string) => void;
}

const PRESET_IMAGES = [
  { label: 'Addis Luxury Villa', url: '/src/assets/images/hero_luxury_villa_addis_1793877072886.jpg' },
  { label: 'Modern Apartment CMC', url: '/src/assets/images/modern_apartment_cmc_1793877073619.jpg' },
  { label: 'Toyota Land Cruiser', url: '/src/assets/images/toyota_land_cruiser_suv_1793877074191.jpg' },
  { label: 'Suzuki Dzire Compact', url: '/src/assets/images/suzuki_dzire_compact_1793877074397.jpg' },
];

export const PostListingModal: React.FC<PostListingModalProps> = ({
  isOpen,
  language,
  onClose,
  onSubmit,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  const [type, setType] = useState<'property' | 'vehicle'>('property');
  const [transaction, setTransaction] = useState<'sale' | 'rent'>('sale');
  const [category, setCategory] = useState<string>('condominium');
  const [vehicleSize, setVehicleSize] = useState<'large' | 'standard'>('standard');

  // Ethiopian Regions & Cities
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [customRegion, setCustomRegion] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('addis_ababa');
  const activeRegion = ETHIOPIAN_REGIONS.find((r) => r.id === selectedRegionId) || ETHIOPIAN_REGIONS[0];
  const [selectedCityId, setSelectedCityId] = useState<string>(activeRegion.cities[0]?.id || 'bole');

  // When region changes, auto-select first city
  const handleRegionChange = (regId: string) => {
    if (regId === 'custom') {
      setIsCustomLocation(true);
      return;
    }
    setSelectedRegionId(regId);
    const reg = ETHIOPIAN_REGIONS.find((r) => r.id === regId);
    if (reg && reg.cities.length > 0) {
      setSelectedCityId(reg.cities[0].id);
    }
  };

  const activeCity = activeRegion.cities.find((c) => c.id === selectedCityId) || activeRegion.cities[0];

  // Titles, price, description
  const [titleAm, setTitleAm] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [priceEtb, setPriceEtb] = useState('');
  const [locationDetail, setLocationDetail] = useState('');
  const [phone, setPhone] = useState('+2519');
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_IMAGES[1].url);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  // Specs
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [areaSqm, setAreaSqm] = useState('140');
  const [year, setYear] = useState('2024');
  const [transmission, setTransmission] = useState<'automatic' | 'manual'>('automatic');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric' | 'hybrid'>('petrol');

  // Payment confirmation for Listing Registration Fee
  const [selectedBankId, setSelectedBankId] = useState('telebirr');
  const [txnRef, setTxnRef] = useState('');
  const [copiedBank, setCopiedBank] = useState(false);

  // Calculate required registration fee based on user criteria:
  // Property: Condominium = 100 ETB, Apartment = 150 ETB, Others (Villa, commercial) = 85 ETB
  // Vehicle: Large (Pickup, SUV, Truck) = 100 ETB, Others (Suzuki, sedan, compact) = 85 ETB
  const listingFee = useMemo(() => {
    return calculateListingFee(type, category, vehicleSize);
  }, [type, category, vehicleSize]);

  const selectedBank = officialBankAccounts.find((b) => b.id === selectedBankId) || officialBankAccounts[0];

  const handleCopyBank = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(selectedBank.accountNumber);
    setCopiedBank(true);
    onShowToast(`${language === 'am' ? selectedBank.bankNameAm : selectedBank.bankNameEn}: ${t.copied}`);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');

    const finalPhoto = customPhotoUrl.trim() || selectedPhoto;
    const finalTitleAm = titleAm.trim() || (titleEn.trim() ? titleEn : 'አዲስ የተመዘገበ ንብረት');
    const finalTitleEn = titleEn.trim() || (titleAm.trim() ? titleAm : 'New Registered Listing');
    const numericPrice = parseFloat(priceEtb.replace(/,/g, '')) || 150000;

    const finalRegionAm = isCustomLocation ? (customRegion.trim() || 'የተለየ ክልል') : activeRegion.nameAm;
    const finalRegionEn = isCustomLocation ? (customRegion.trim() || 'Custom Region') : activeRegion.nameEn;
    const finalCityAm = isCustomLocation ? (customCity.trim() || 'የተለየ ከተማ') : activeCity.nameAm;
    const finalCityEn = isCustomLocation ? (customCity.trim() || 'Custom City') : activeCity.nameEn;

    const newListing: Listing = {
      id: `user-${Date.now()}`,
      type,
      category: category as (PropertyCategory | VehicleCategory),
      transaction,
      titleAm: finalTitleAm,
      titleEn: finalTitleEn,
      descriptionAm: description.trim() || `${finalTitleAm} በ${finalRegionAm} (${finalCityAm}) ይገኛል።`,
      descriptionEn: description.trim() || `${finalTitleEn} located in ${finalCityEn}, ${finalRegionEn}.`,
      priceEtb: numericPrice,
      pricePeriod: transaction === 'rent' ? 'month' : 'total',
      registrationFeeEtb: listingFee,
      regionId: isCustomLocation ? 'custom' : activeRegion.id,
      regionNameAm: finalRegionAm,
      regionNameEn: finalRegionEn,
      cityId: isCustomLocation ? 'custom' : activeCity.id,
      cityNameAm: finalCityAm,
      cityNameEn: finalCityEn,
      locationAm: `${finalCityAm} ${locationDetail.trim() ? `፣ ${locationDetail}` : ''}፣ ${finalRegionAm}`,
      locationEn: `${finalCityEn} ${locationDetail.trim() ? `, ${locationDetail}` : ''}, ${finalRegionEn}`,
      neighborhood: finalCityAm,
      images: [finalPhoto],
      agent: {
        name: agentName.trim() || 'ባለቤት / Owner',
        phone: phone.trim() || '+251911000000',
        telegramUsername: 'nur_marketplace_bot',
        verified: true,
        roleAm: type === 'property' ? 'የቤቱ ባለቤት / ወኪል' : 'የመኪናው ባለቤት / ወኪል',
        roleEn: type === 'property' ? 'Property Owner / Agent' : 'Vehicle Owner / Agent',
      },
      featured: false,
      createdAt: new Date().toISOString().split('T')[0],
      ...(type === 'property'
        ? {
            propertySpecs: {
              bedrooms: parseInt(bedrooms) || 3,
              bathrooms: parseInt(bathrooms) || 2,
              areaSqm: parseInt(areaSqm) || 120,
              furnished: true,
            },
          }
        : {
            vehicleSpecs: {
              year: parseInt(year) || 2023,
              transmission,
              fuelType,
              mileageKm: 0,
              vehicleSize,
            },
          }),
      status: 'approved',
    };

    const paymentRequest = txnRef.trim()
      ? {
          type: 'listing_registration' as const,
          userName: agentName.trim() || 'ባለቤት / Owner',
          userPhone: phone.trim() || '+251911000000',
          amountEtb: listingFee,
          bankId: selectedBank.id,
          bankName: language === 'am' ? selectedBank.bankNameAm : selectedBank.bankNameEn,
          txnNumber: txnRef.trim(),
          listingId: newListing.id,
          listingTitle: finalTitleAm,
        }
      : undefined;

    onSubmit(newListing, paymentRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto z-10 border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t.addNewTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'am' ? 'በመላው ኢትዮጵያ ለሽያጭ ወይም ለኪራይ' : 'Across All Ethiopian Regions'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Marketplace Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              {t.listingTypeLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setType('property');
                  setCategory('condominium');
                  setSelectedPhoto(PRESET_IMAGES[1].url);
                }}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  type === 'property'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{t.propertyOption}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('vehicle');
                  setCategory('suzuki');
                  setVehicleSize('standard');
                  setSelectedPhoto(PRESET_IMAGES[3].url);
                }}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  type === 'vehicle'
                    ? 'bg-sky-50 border-sky-500 text-sky-800 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Car className="w-4 h-4 text-sky-600" />
                <span>{t.vehicleOption}</span>
              </button>
            </div>
          </div>

          {/* Sub-Category with Fee Display */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              {type === 'property' ? 'የቤቱ ዓይነት (የማስመዝገቢያ ክፍያ)' : 'የመኪናው ዓይነት (የማስመዝገቢያ ክፍያ)'}
            </label>
            <select
              value={category}
              onChange={(e) => {
                const val = e.target.value;
                setCategory(val);
                if (val === 'pickup') {
                  setVehicleSize('large');
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {type === 'property' ? (
                <>
                  <option value="condominium">ኮንዶሚኒየም (Condominium) — 100 ብር</option>
                  <option value="apartment">አፓርታማ (Apartment) — 150 ብር</option>
                  <option value="villa">ቪላ (Villa) — 85 ብር</option>
                  <option value="commercial">የንግድ ህንፃ / ሱቅ (Commercial) — 85 ብር</option>
                </>
              ) : (
                <>
                  <option value="suzuki">ሱዙኪ / አነስተኛ (Suzuki / Compact) — 85 ብር</option>
                  <option value="toyota">ቶዮታ ሰዳን (Toyota Sedan) — 85 ብር</option>
                  <option value="hyundai">ሃዩንዳይ (Hyundai) — 85 ብር</option>
                  <option value="pickup">ታላላቅ ተሽከርካሪ (ፒክአፕ / 4x4 / ዲማክስ / ትራክ) — 100 ብር</option>
                  <option value="other">ሌሎች መኪኖች — 85 ብር</option>
                </>
              )}
            </select>
          </div>

          {/* If Vehicle, Vehicle Class selector for large vs standard */}
          {type === 'vehicle' && category !== 'pickup' && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                {t.vehicleSizeLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleSize('standard')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left ${
                    vehicleSize === 'standard'
                      ? 'bg-sky-50 border-sky-500 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {t.standardVehicleOption}
                </button>
                <button
                  type="button"
                  onClick={() => setVehicleSize('large')}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left ${
                    vehicleSize === 'large'
                      ? 'bg-sky-50 border-sky-500 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {t.largeVehicleOption}
                </button>
              </div>
            </div>
          )}

          {/* Transaction Type Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              {t.transactionTypeLabel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTransaction('sale')}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  transaction === 'sale'
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.saleOption}
              </button>
              <button
                type="button"
                onClick={() => setTransaction('rent')}
                className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  transaction === 'rent'
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.rentOption}
              </button>
            </div>
          </div>

          {/* Ethiopian Region & City Selection with Custom Typing Support */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase text-slate-700">
                {language === 'am' ? 'የንብረቱ መገኛ ቦታ (በመላው ኢትዮጵያ)' : 'Location (Across Ethiopia)'}
              </span>
              <button
                type="button"
                onClick={() => setIsCustomLocation(!isCustomLocation)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
              >
                {isCustomLocation
                  ? (language === 'am' ? '← ከዝርዝር ምረጥ' : '← Pick from Dropdown')
                  : (language === 'am' ? '✍️ በዝርዝር የሌለ አዲስ ቦታ ፃፍ' : '✍️ Type Custom Location')}
              </button>
            </div>

            {isCustomLocation ? (
              /* Custom typed location inputs */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    {t.customRegionLabel} *
                  </label>
                  <input
                    type="text"
                    required={isCustomLocation}
                    value={customRegion}
                    onChange={(e) => setCustomRegion(e.target.value)}
                    placeholder="ምሳሌ: ኦሮሚያ፣ አማራ፣ ደቡብ..."
                    className="w-full px-3 py-2.5 rounded-xl border border-emerald-400 bg-white text-xs sm:text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    {t.customCityLabel} *
                  </label>
                  <input
                    type="text"
                    required={isCustomLocation}
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="ምሳሌ: ሞጆ፣ ሆለታ፣ ወልቂጤ፣ ወልዲያ፣ ሻኪሶ..."
                    className="w-full px-3 py-2.5 rounded-xl border border-emerald-400 bg-white text-xs sm:text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            ) : (
              /* Dropdown selection */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    {t.regionLabel}
                  </label>
                  <select
                    value={selectedRegionId}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    {ETHIOPIAN_REGIONS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {language === 'am' ? r.nameAm : r.nameEn}
                      </option>
                    ))}
                    <option value="custom">✍️ {language === 'am' ? 'ሌላ ክልል በራስዎ ይፃፉ...' : 'Other / Type Custom Region...'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                    {t.cityLabel}
                  </label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomLocation(true);
                        return;
                      }
                      setSelectedCityId(e.target.value);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    {activeRegion.cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {language === 'am' ? c.nameAm : c.nameEn}
                      </option>
                    ))}
                    <option value="custom">✍️ {language === 'am' ? 'ሌላ ከተማ በራስዎ ይፃፉ...' : 'Other / Type Custom City...'}</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {t.locationDetailLabel}
              </label>
              <input
                type="text"
                value={locationDetail}
                onChange={(e) => setLocationDetail(e.target.value)}
                placeholder="ምሳሌ: ዋናው አስፋልት ዳር፣ ህንፃ ፊት ለፊት..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              />
            </div>
          </div>

          {/* Titles in Amharic & English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                {t.titleAmLabel} *
              </label>
              <input
                type="text"
                required
                value={titleAm}
                onChange={(e) => setTitleAm(e.target.value)}
                placeholder="ምሳሌ: ባለ 2 መኝታ ኮንዶሚኒየም"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                {t.priceLabel} *
              </label>
              <input
                type="number"
                required
                value={priceEtb}
                onChange={(e) => setPriceEtb(e.target.value)}
                placeholder="e.g. 8500000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                {language === 'am' ? 'የባለቤቱ ስም' : 'Owner Name'} *
              </label>
              <input
                type="text"
                required
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g. አቶ በቀለ / Ato Bekele"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                {t.contactPhoneLabel} *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251911..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Photo Preset Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              {t.photosLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_IMAGES.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(preset.url);
                    setCustomPhotoUrl('');
                  }}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                    selectedPhoto === preset.url && !customPhotoUrl
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[10px] px-1 py-0.5 rounded truncate">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
              {t.descriptionLabel}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ስለ ንብረቱ ተጨማሪ ዝርዝር መረጃ..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Registration Payment Section (Fee Enforced) */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-xs text-amber-400 font-bold block uppercase">
                  {t.requiredListingFee}
                </span>
                <span className="text-xs text-slate-400">
                  {type === 'property'
                    ? (category === 'condominium'
                        ? 'ለኮንዶሚኒየም'
                        : category === 'apartment'
                        ? 'ለአፓርታማ'
                        : 'ለቪላ / ሌሎች ቤቶች')
                    : (vehicleSize === 'large' || category === 'pickup'
                        ? 'ለታላላቅ ተሽከርካሪዎች'
                        : 'ለሌሎች መኪኖች')}
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {listingFee} {t.etb}
              </div>
            </div>

            {/* Quick Bank Copy for Listing Fee */}
            <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div className="min-w-0">
                <span className="text-[11px] text-slate-400 block truncate">
                  {language === 'am' ? selectedBank.bankNameAm : selectedBank.bankNameEn}
                </span>
                <span className="text-sm font-mono font-bold text-white tracking-wide">
                  {selectedBank.accountNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyBank}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 shrink-0"
              >
                {copiedBank ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBank ? t.copied : t.copyAccount}</span>
              </button>
            </div>

            {/* Reference input */}
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                {t.txnRefLabel}
              </label>
              <input
                type="text"
                value={txnRef}
                onChange={(e) => setTxnRef(e.target.value)}
                placeholder="ምሳሌ: TXN12345678 (Telebirr / CBE)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-md transition-all active:scale-98"
            >
              {t.submitListing} ({listingFee} {t.etb})
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
