import React from 'react';
import { MarketplaceType, Language } from '../types';
import { translations } from '../data/translations';
import { ArrowUpDown, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  language: Language;
  marketplace: MarketplaceType;
  selectedSubCategory: string;
  onSelectSubCategory: (cat: string) => void;
  sortBy: 'latest' | 'price_asc' | 'price_desc';
  onSortChange: (sort: 'latest' | 'price_asc' | 'price_desc') => void;
  resultCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  language,
  marketplace,
  selectedSubCategory,
  onSelectSubCategory,
  sortBy,
  onSortChange,
  resultCount,
  hasActiveFilters,
  onResetFilters,
}) => {
  const t = translations[language];

  const propertySubCategories = [
    { id: 'all', label: t.allCategories },
    { id: 'condominium', label: language === 'am' ? 'ኮንዶሚኒየም (100 ብር)' : 'Condo (100 ETB)' },
    { id: 'apartment', label: language === 'am' ? 'አፓርታማ (150 ብር)' : 'Apartment (150 ETB)' },
    { id: 'villa', label: language === 'am' ? 'ቪላ (85 ብር)' : 'Villa (85 ETB)' },
    { id: 'commercial', label: language === 'am' ? 'ንግድ ህንፃ (85 ብር)' : 'Commercial (85 ETB)' },
  ];

  const vehicleSubCategories = [
    { id: 'all', label: t.allCategories },
    { id: 'pickup', label: language === 'am' ? 'ታላላቅ / ፒክአፕ (100 ብር)' : 'Pickups & 4x4 (100 ETB)' },
    { id: 'suzuki', label: language === 'am' ? 'ሱዙኪ (85 ብር)' : 'Suzuki (85 ETB)' },
    { id: 'toyota', label: language === 'am' ? 'ቶዮታ (85 ብር)' : 'Toyota (85 ETB)' },
    { id: 'hyundai', label: language === 'am' ? 'ሃዩንዳይ (85 ብር)' : 'Hyundai (85 ETB)' },
    { id: 'other', label: language === 'am' ? 'ሌሎች (85 ብር)' : 'Others (85 ETB)' },
  ];

  const subCategories =
    marketplace === 'property'
      ? propertySubCategories
      : marketplace === 'vehicle'
      ? vehicleSubCategories
      : [
          { id: 'all', label: t.allCategories },
          { id: 'condominium', label: language === 'am' ? 'ኮንዶሚኒየም' : 'Condo' },
          { id: 'apartment', label: language === 'am' ? 'አፓርታማ' : 'Apartment' },
          { id: 'pickup', label: language === 'am' ? 'ፒክአፕ' : 'Pickups' },
          { id: 'suzuki', label: language === 'am' ? 'ሱዙኪ' : 'Suzuki' },
        ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      
      {/* Subcategory interactive buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {subCategories.map((cat) => {
          const isActive = selectedSubCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectSubCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Right controls: Sort + Result count + Reset */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        
        {/* Results count text */}
        <span className="text-xs text-slate-500 font-medium whitespace-nowrap tabular-nums">
          {resultCount} {language === 'am' ? 'ንብረቶች ተገኝተዋል' : 'listings found'}
        </span>

        {/* Reset Filter Button if active */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.clearFilters}</span>
          </button>
        )}

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="latest">{t.latest}</option>
            <option value="price_asc">{t.priceLowHigh}</option>
            <option value="price_desc">{t.priceHighLow}</option>
          </select>
        </div>

      </div>

    </div>
  );
};
