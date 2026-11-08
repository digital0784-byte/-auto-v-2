export type Language = 'am' | 'en';

export type MarketplaceType = 'all' | 'property' | 'vehicle';

export type TransactionType = 'all' | 'sale' | 'rent';

export type PropertyCategory = 'villa' | 'apartment' | 'condominium' | 'commercial';

export type VehicleCategory = 'toyota' | 'hyundai' | 'suzuki' | 'pickup' | 'other';

export interface PropertySpecs {
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  parkingSpots?: number;
  furnished?: boolean;
}

export interface VehicleSpecs {
  year: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  mileageKm?: number;
  color?: string;
  engineCc?: number;
  vehicleSize?: 'large' | 'standard'; // large = pickups, trucks, SUVs; standard = sedans, compacts
}

export interface Listing {
  id: string;
  type: 'property' | 'vehicle';
  category: PropertyCategory | VehicleCategory;
  transaction: 'sale' | 'rent';
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  priceEtb: number;
  pricePeriod?: 'month' | 'total'; // for rent: month, for sale: total
  registrationFeeEtb: number; // Listing fee paid by lister/broker (100 for condo, 150 for apartment, 85 for others; 100 for large cars, 85 for others)
  regionId: string;
  regionNameAm: string;
  regionNameEn: string;
  cityId: string;
  cityNameAm: string;
  cityNameEn: string;
  locationEn: string;
  locationAm: string;
  neighborhood: string;
  images: string[];
  propertySpecs?: PropertySpecs;
  vehicleSpecs?: VehicleSpecs;
  agent: {
    name: string;
    phone: string;
    telegramUsername: string;
    verified: boolean;
    roleEn: string;
    roleAm: string;
  };
  featured?: boolean;
  status?: 'pending' | 'approved';
  createdAt: string;
}

export interface BankAccount {
  id: string;
  bankNameEn: string;
  bankNameAm: string;
  accountNumber: string;
  accountHolderEn: string;
  accountHolderAm: string;
  accountTypeEn: string;
  accountTypeAm: string;
  iconType: 'telebirr' | 'cbe' | 'awash' | 'cbebirr';
  brandColor: string;
  instructionsEn: string;
  instructionsAm: string;
  codePrefix?: string;
}

export interface FilterState {
  marketplace: MarketplaceType;
  transaction: TransactionType;
  category: string;
  regionId: string;
  cityId: string;
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'latest' | 'price_asc' | 'price_desc';
}

export interface PaymentRequest {
  id: string;
  type: 'search_pass_property' | 'search_pass_vehicle' | 'listing_registration';
  userName: string;
  userPhone: string;
  amountEtb: number;
  bankId: string;
  bankName: string;
  txnNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  listingId?: string;
  listingTitle?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface AccessPass {
  propertyUnlocked: boolean;
  vehicleUnlocked: boolean;
  propertyStatus: 'none' | 'pending' | 'approved';
  vehicleStatus: 'none' | 'pending' | 'approved';
  propertyPaymentRef?: string;
  vehiclePaymentRef?: string;
  activatedAt?: string;
}

// Fee structure helper functions per user specifications
export const calculateListingFee = (
  type: 'property' | 'vehicle',
  category: string,
  vehicleSize?: 'large' | 'standard'
): number => {
  if (type === 'property') {
    if (category === 'condominium') return 100; // ለcondominum 100 ብር
    if (category === 'apartment') return 150;   // ለአፓርታማ 150 ብር
    return 85;                                  // ለሌሎች 85 ብር (ቪላ፣ ንግድ ህንፃ፣ ወዘተ)
  } else {
    // Large vehicles (pickup, truck, large SUV/Land Cruiser) 100 ETB, others 85 ETB
    if (category === 'pickup' || vehicleSize === 'large') return 100; // ለታላላቅ ተሽከርካሪዎች 100 ብር
    return 85; // ለሌሎች 85 ብር
  }
};

export const BUYER_SEARCH_FEES = {
  property: 150, // ለቤት 150 ብር
  vehicle: 200,  // ለመኪና 200 ብር
};
