import React, { useState, useEffect, useMemo } from 'react';
import { 
  Listing, 
  Language, 
  MarketplaceType, 
  TransactionType,
  AccessPass,
  PaymentRequest
} from './types';
import { initialListings } from './data/mockData';
import { translations } from './data/translations';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AccessPassBanner } from './components/AccessPassBanner';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { PostListingModal } from './components/PostListingModal';
import { AccessPassModal } from './components/AccessPassModal';
import { AdminApprovalModal } from './components/AdminApprovalModal';
import { BankAccountsModal } from './components/BankAccountsModal';
import { BankAccountsSection } from './components/BankAccountsSection';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { initTelegramApp, isTelegramWebApp } from './utils/telegram';
import { SearchX, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_LISTINGS = 'nur_marketplace_listings_v2';
const STORAGE_KEY_FAVORITES = 'nur_marketplace_favorites_v2';
const STORAGE_KEY_LANG = 'nur_marketplace_lang_v2';
const STORAGE_KEY_ACCESSPASS = 'nur_marketplace_accesspass_v2';

export default function App() {
  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'am' || saved === 'en') return saved;
    }
    return 'am';
  });

  // Telegram integration
  const [isTelegram, setIsTelegram] = useState(false);
  const [telegramUser, setTelegramUser] = useState<string | undefined>(undefined);

  useEffect(() => {
    const webApp = initTelegramApp();
    if (webApp && isTelegramWebApp()) {
      setIsTelegram(true);
      const user = webApp.initDataUnsafe?.user;
      if (user?.first_name) {
        setTelegramUser(user.first_name);
      }
    }
  }, []);

  // Save language preference
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  // Buyer Search Pass State (Property: 150 ETB, Vehicle: 200 ETB)
  const [accessPass, setAccessPass] = useState<AccessPass>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_ACCESSPASS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return {
      propertyUnlocked: false,
      vehicleUnlocked: false,
      propertyStatus: 'none',
      vehicleStatus: 'none',
    };
  });

  // Admin Payment Requests state (with realistic pending Ethiopian transactions)
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nur_payment_requests_v2');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // ignore
        }
      }
    }
    return [
      {
        id: 'req-1',
        type: 'search_pass_property',
        userName: 'ዳዊት ግርማ (Dawit Girma)',
        userPhone: '+251911334455',
        amountEtb: 150,
        bankId: 'telebirr',
        bankName: 'ቴሌብር (Telebirr)',
        txnNumber: 'MP88392104',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
      {
        id: 'req-2',
        type: 'search_pass_vehicle',
        userName: 'ሰላማዊት አበራ (Selamawit Abera)',
        userPhone: '+251922778899',
        amountEtb: 200,
        bankId: 'cbe',
        bankName: 'የኢትዮጵያ ንግድ ባንክ (CBE)',
        txnNumber: 'CBE-99482103',
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
      {
        id: 'req-3',
        type: 'listing_registration',
        userName: 'አቶ ተስፋዬ ወልደ (Tesfaye W.)',
        userPhone: '+251910223344',
        amountEtb: 100,
        bankId: 'telebirr',
        bankName: 'ቴሌብር (Telebirr)',
        txnNumber: 'MP77391023',
        listingTitle: 'ኮንዶሚኒየም በሰሚት ለሽያጭ',
        status: 'approved',
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        approvedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      },
    ];
  });

  const savePaymentRequests = (requests: PaymentRequest[]) => {
    setPaymentRequests(requests);
    localStorage.setItem('nur_payment_requests_v2', JSON.stringify(requests));
  };

  // Submit payment request to Admin
  const handleSubmitPaymentRequest = (req: Omit<PaymentRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: PaymentRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const updated = [newReq, ...paymentRequests];
    savePaymentRequests(updated);

    // Update user's pass status to pending
    setAccessPass((prev) => {
      const next: AccessPass = {
        ...prev,
        propertyStatus: req.type === 'search_pass_property' ? 'pending' : prev.propertyStatus,
        vehicleStatus: req.type === 'search_pass_vehicle' ? 'pending' : prev.vehicleStatus,
        propertyPaymentRef: req.type === 'search_pass_property' ? req.txnNumber : prev.propertyPaymentRef,
        vehiclePaymentRef: req.type === 'search_pass_vehicle' ? req.txnNumber : prev.vehiclePaymentRef,
      };
      localStorage.setItem(STORAGE_KEY_ACCESSPASS, JSON.stringify(next));
      return next;
    });
  };

  // Admin approves payment request
  const handleApproveRequest = (requestId: string) => {
    const req = paymentRequests.find((r) => r.id === requestId);
    if (!req) return;

    const updated = paymentRequests.map((r) =>
      r.id === requestId
        ? { ...r, status: 'approved' as const, approvedAt: new Date().toISOString() }
        : r
    );
    savePaymentRequests(updated);

    // If it's a search pass, unlock access pass
    if (req.type === 'search_pass_property') {
      setAccessPass((prev) => {
        const next: AccessPass = {
          ...prev,
          propertyUnlocked: true,
          propertyStatus: 'approved',
          activatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY_ACCESSPASS, JSON.stringify(next));
        return next;
      });
    } else if (req.type === 'search_pass_vehicle') {
      setAccessPass((prev) => {
        const next: AccessPass = {
          ...prev,
          vehicleUnlocked: true,
          vehicleStatus: 'approved',
          activatedAt: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY_ACCESSPASS, JSON.stringify(next));
        return next;
      });
    }
  };

  // Admin rejects request
  const handleRejectRequest = (requestId: string) => {
    const updated = paymentRequests.map((r) =>
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    );
    savePaymentRequests(updated);
  };

  const handleUnlockPassDirect = (type: 'property' | 'vehicle' | 'both', refCode: string) => {
    setAccessPass((prev) => {
      const next: AccessPass = {
        ...prev,
        propertyUnlocked: type === 'property' || type === 'both' ? true : prev.propertyUnlocked,
        vehicleUnlocked: type === 'vehicle' || type === 'both' ? true : prev.vehicleUnlocked,
        propertyStatus: type === 'property' || type === 'both' ? 'approved' : prev.propertyStatus,
        vehicleStatus: type === 'vehicle' || type === 'both' ? 'approved' : prev.vehicleStatus,
        propertyPaymentRef: type === 'property' || type === 'both' ? refCode : prev.propertyPaymentRef,
        vehiclePaymentRef: type === 'vehicle' || type === 'both' ? refCode : prev.vehiclePaymentRef,
        activatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY_ACCESSPASS, JSON.stringify(next));
      return next;
    });
  };

  // Listings state with localStorage persistence
  const [listings, setListings] = useState<Listing[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_LISTINGS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch {
          // ignore
        }
      }
    }
    return initialListings;
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return [];
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(next));
      return next;
    });
  };

  // Filter & Search states
  const [marketplace, setMarketplace] = useState<MarketplaceType>('all');
  const [transaction, setTransaction] = useState<TransactionType>('all');
  const [subCategory, setSubCategory] = useState<string>('all');
  const [regionId, setRegionId] = useState<string>('');
  const [customLocationFilter, setCustomLocationFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'price_asc' | 'price_desc'>('latest');
  const [showingFavoritesOnly, setShowingFavoritesOnly] = useState(false);

  // Modals state
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [passModalTarget, setPassModalTarget] = useState<'property' | 'vehicle' | 'both'>('property');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const openPassModal = (type: 'property' | 'vehicle' | 'both') => {
    setPassModalTarget(type);
    setIsPassModalOpen(true);
  };

  // Handle adding a new listing with optional payment request
  const handleAddNewListing = (
    newListing: Listing,
    paymentRequest?: Omit<PaymentRequest, 'id' | 'createdAt' | 'status'>
  ) => {
    const updated = [newListing, ...listings];
    setListings(updated);
    localStorage.setItem(STORAGE_KEY_LISTINGS, JSON.stringify(updated));
    setSelectedListing(newListing);

    if (paymentRequest) {
      const newReq: PaymentRequest = {
        ...paymentRequest,
        id: `req-${Date.now()}`,
        status: 'approved',
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      };
      savePaymentRequests([newReq, ...paymentRequests]);
    }

    showToast(
      language === 'am'
        ? `ንብረትዎ በ ${newListing.registrationFeeEtb} ብር የማስመዝገቢያ ክፍያ በተሳካ ሁኔታ ተመዝግቧል!`
        : `Listing registered successfully with ${newListing.registrationFeeEtb} ETB registration fee!`
    );
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Favorites filter
        if (showingFavoritesOnly && !favorites.includes(item.id)) {
          return false;
        }

        // Marketplace filter (Property vs Vehicle vs All)
        if (marketplace !== 'all' && item.type !== marketplace) {
          return false;
        }

        // Transaction filter (Sale vs Rent vs All)
        if (transaction !== 'all' && item.transaction !== transaction) {
          return false;
        }

        // Subcategory filter
        if (subCategory !== 'all' && item.category !== subCategory) {
          return false;
        }

        // Region dropdown filter
        if (regionId && regionId !== 'custom') {
          if (item.regionId !== regionId) {
            return false;
          }
        }

        // Custom Location typed by buyer
        if (customLocationFilter.trim()) {
          const cf = customLocationFilter.toLowerCase().trim();
          const matchCity = (item.cityNameAm + ' ' + item.cityNameEn).toLowerCase().includes(cf);
          const matchRegion = (item.regionNameAm + ' ' + item.regionNameEn).toLowerCase().includes(cf);
          const matchNeighborhood = item.neighborhood.toLowerCase().includes(cf);
          const matchLocation = (item.locationAm + ' ' + item.locationEn).toLowerCase().includes(cf);
          if (!matchCity && !matchRegion && !matchNeighborhood && !matchLocation) {
            return false;
          }
        }

        // Search Query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitleEn = item.titleEn.toLowerCase().includes(q);
          const matchTitleAm = item.titleAm.toLowerCase().includes(q);
          const matchLocEn = item.locationEn.toLowerCase().includes(q);
          const matchLocAm = item.locationAm.toLowerCase().includes(q);
          const matchNeighborhood = item.neighborhood.toLowerCase().includes(q);
          const matchRegion = (item.regionNameAm + ' ' + item.regionNameEn).toLowerCase().includes(q);
          const matchCity = (item.cityNameAm + ' ' + item.cityNameEn).toLowerCase().includes(q);
          const matchDescEn = item.descriptionEn.toLowerCase().includes(q);
          const matchDescAm = item.descriptionAm.toLowerCase().includes(q);
          const matchAgent = item.agent.name.toLowerCase().includes(q);

          if (
            !matchTitleEn &&
            !matchTitleAm &&
            !matchLocEn &&
            !matchLocAm &&
            !matchNeighborhood &&
            !matchRegion &&
            !matchCity &&
            !matchDescEn &&
            !matchDescAm &&
            !matchAgent
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.priceEtb - b.priceEtb;
        }
        if (sortBy === 'price_desc') {
          return b.priceEtb - a.priceEtb;
        }
        // latest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    listings,
    showingFavoritesOnly,
    favorites,
    marketplace,
    transaction,
    subCategory,
    regionId,
    customLocationFilter,
    searchQuery,
    sortBy,
  ]);

  const propertiesCount = useMemo(() => listings.filter((l) => l.type === 'property').length, [listings]);
  const vehiclesCount = useMemo(() => listings.filter((l) => l.type === 'vehicle').length, [listings]);

  const hasActiveFilters = Boolean(
    marketplace !== 'all' ||
    transaction !== 'all' ||
    subCategory !== 'all' ||
    regionId !== '' ||
    customLocationFilter.trim() !== '' ||
    searchQuery.trim() !== '' ||
    showingFavoritesOnly
  );

  const resetAllFilters = () => {
    setMarketplace('all');
    setTransaction('all');
    setSubCategory('all');
    setRegionId('');
    setCustomLocationFilter('');
    setSearchQuery('');
    setShowingFavoritesOnly(false);
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Toast message popup */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        activeMarketplace={marketplace}
        onSelectMarketplace={(m) => {
          setMarketplace(m);
          setSubCategory('all');
          setShowingFavoritesOnly(false);
        }}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenBankModal={() => setIsBankModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        pendingAdminCount={paymentRequests.filter((r) => r.status === 'pending').length}
        isTelegram={isTelegram}
        telegramUser={telegramUser}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setShowingFavoritesOnly((prev) => !prev)}
      />

      {/* Hero Section with Search, Regions and Dual Marketplaces */}
      <HeroBanner
        language={language}
        activeMarketplace={marketplace}
        onSelectMarketplace={(m) => {
          setMarketplace(m);
          setSubCategory('all');
          setShowingFavoritesOnly(false);
        }}
        activeTransaction={transaction}
        onSelectTransaction={setTransaction}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRegionId={regionId}
        onSelectRegionId={setRegionId}
        customLocationFilter={customLocationFilter}
        onCustomLocationFilterChange={setCustomLocationFilter}
        totalListingsCount={listings.length}
        propertiesCount={propertiesCount}
        vehiclesCount={vehiclesCount}
        onOpenBankModal={() => setIsBankModalOpen(true)}
        onOpenPassModal={openPassModal}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Transparent Fee & Buyer Access Pass Notice Banner */}
        <AccessPassBanner
          language={language}
          accessPass={accessPass}
          activeMarketplace={marketplace}
          onOpenPassModal={openPassModal}
        />

        {/* Secondary Filter & Sort Bar */}
        <FilterBar
          language={language}
          marketplace={marketplace}
          selectedSubCategory={subCategory}
          onSelectSubCategory={setSubCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={filteredListings.length}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={resetAllFilters}
        />

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                language={language}
                onSelect={setSelectedListing}
                isFavorite={favorites.includes(listing.id)}
                onToggleFavorite={toggleFavorite}
                accessPass={accessPass}
                onOpenPassModal={openPassModal}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t.noListingsFound}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              {t.noListingsSub}
            </p>
            <button
              onClick={resetAllFilters}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
            >
              {t.clearFilters}
            </button>
          </div>
        )}

        {/* Permanent Verified Bank & Mobile Payment Section */}
        <BankAccountsSection
          language={language}
          onShowToast={showToast}
        />

      </main>

      {/* Footer */}
      <Footer
        language={language}
        onOpenBankModal={() => setIsBankModalOpen(true)}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        language={language}
        activeMarketplace={marketplace}
        onSelectMarketplace={(m) => {
          setMarketplace(m);
          setSubCategory('all');
          setShowingFavoritesOnly(false);
        }}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        onOpenBankModal={() => setIsBankModalOpen(true)}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setShowingFavoritesOnly((prev) => !prev)}
        showingFavorites={showingFavoritesOnly}
      />

      {/* Listing Detail Modal */}
      <ListingDetailModal
        listing={selectedListing}
        language={language}
        onClose={() => setSelectedListing(null)}
        isFavorite={selectedListing ? favorites.includes(selectedListing.id) : false}
        onToggleFavorite={toggleFavorite}
        onShowToast={showToast}
        accessPass={accessPass}
        onOpenPassModal={openPassModal}
      />

      {/* Post Listing Form Modal with Fee Enforcement */}
      <PostListingModal
        isOpen={isPostModalOpen}
        language={language}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleAddNewListing}
        onShowToast={showToast}
      />

      {/* Payment & Bank Accounts Modal */}
      <BankAccountsModal
        isOpen={isBankModalOpen}
        language={language}
        onClose={() => setIsBankModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Buyer & Renter Search Pass Modal */}
      <AccessPassModal
        isOpen={isPassModalOpen}
        targetType={passModalTarget}
        language={language}
        accessPass={accessPass}
        onClose={() => setIsPassModalOpen(false)}
        onSubmitPaymentRequest={handleSubmitPaymentRequest}
        onDirectAdminApprove={handleUnlockPassDirect}
        onShowToast={showToast}
      />

      {/* Admin Verification & Approval Modal */}
      <AdminApprovalModal
        isOpen={isAdminModalOpen}
        language={language}
        paymentRequests={paymentRequests}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleRejectRequest}
        onClose={() => setIsAdminModalOpen(false)}
        onShowToast={showToast}
      />

    </div>
  );
}
