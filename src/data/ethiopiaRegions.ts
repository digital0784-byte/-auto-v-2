export interface CityInfo {
  id: string;
  nameEn: string;
  nameAm: string;
}

export interface RegionInfo {
  id: string;
  nameEn: string;
  nameAm: string;
  cities: CityInfo[];
}

export const ETHIOPIAN_REGIONS: RegionInfo[] = [
  {
    id: 'addis_ababa',
    nameEn: 'Addis Ababa',
    nameAm: 'አዲስ አበባ',
    cities: [
      { id: 'bole', nameEn: 'Bole (ቦሌ)', nameAm: 'ቦሌ' },
      { id: 'cmc', nameEn: 'CMC / Michael (ሲኤምሲ)', nameAm: 'ሲኤምሲ' },
      { id: 'yeka', nameEn: 'Yeka / Megenagna (የካ)', nameAm: 'የካ' },
      { id: 'lebu', nameEn: 'Lebu / Jemo (ለቡ)', nameAm: 'ለቡ' },
      { id: 'sarbet', nameEn: 'Sarbet / Old Airport (ሳርቤት)', nameAm: 'ሳርቤት' },
      { id: 'kazanchis', nameEn: 'Kazanchis (ካዛንቺስ)', nameAm: 'ካዛንቺስ' },
      { id: 'summit', nameEn: 'Summit / Ayat (ሰሚት)', nameAm: 'ሰሚት' },
      { id: 'piassa', nameEn: 'Piassa / Arada (ፒያሳ)', nameAm: 'ፒያሳ' },
      { id: 'gerji', nameEn: 'Gerji / Imperial (ገርጂ)', nameAm: 'ገርጂ' },
      { id: 'kolfe', nameEn: 'Kolfe Keranio (ኮልፌ)', nameAm: 'ኮልፌ' },
      { id: 'akaki', nameEn: 'Akaki Kality (አቃቂ ቃሊቲ)', nameAm: 'አቃቂ ቃሊቲ' },
    ],
  },
  {
    id: 'oromia',
    nameEn: 'Oromia',
    nameAm: 'ኦሮሚያ',
    cities: [
      { id: 'adama', nameEn: 'Adama / Nazret (አዳማ)', nameAm: 'አዳማ' },
      { id: 'bishoftu', nameEn: 'Bishoftu / Debre Zeyit (ቢሾፍቱ)', nameAm: 'ቢሾፍቱ' },
      { id: 'shashemene', nameEn: 'Shashemene (ሻሸመኔ)', nameAm: 'ሻሸመኔ' },
      { id: 'jimma', nameEn: 'Jimma (ጅማ)', nameAm: 'ጅማ' },
      { id: 'nekemte', nameEn: 'Nekemte (ነቀምቴ)', nameAm: 'ነቀምቴ' },
      { id: 'burayu', nameEn: 'Burayu (ቡራዩ)', nameAm: 'ቡራዩ' },
      { id: 'sebeta', nameEn: 'Sebeta (ሰበታ)', nameAm: 'ሰበታ' },
      { id: 'dukem', nameEn: 'Dukem (ዱከም)', nameAm: 'ዱከም' },
    ],
  },
  {
    id: 'amhara',
    nameEn: 'Amhara',
    nameAm: 'አማራ',
    cities: [
      { id: 'bahir_dar', nameEn: 'Bahir Dar (ባህር ዳር)', nameAm: 'ባህር ዳር' },
      { id: 'gondar', nameEn: 'Gondar (ጎንደር)', nameAm: 'ጎንደር' },
      { id: 'dessie', nameEn: 'Dessie (ደሴ)', nameAm: 'ደሴ' },
      { id: 'debre_birhan', nameEn: 'Debre Birhan (ደብረ ብርሃን)', nameAm: 'ደብረ ብርሃን' },
      { id: 'debre_markos', nameEn: 'Debre Markos (ደብረ ማርቆስ)', nameAm: 'ደብረ ማርቆስ' },
      { id: 'kombolcha', nameEn: 'Kombolcha (ኮምቦልቻ)', nameAm: 'ኮምቦልቻ' },
    ],
  },
  {
    id: 'sidama',
    nameEn: 'Sidama',
    nameAm: 'ሲዳማ',
    cities: [
      { id: 'hawassa', nameEn: 'Hawassa (ሀዋሳ)', nameAm: 'ሀዋሳ' },
      { id: 'yirgalem', nameEn: 'Yirgalem (ይርጋለም)', nameAm: 'ይርጋለም' },
      { id: 'aleta_wondo', nameEn: 'Aleta Wondo (አሌታ ወንዶ)', nameAm: 'አሌታ ወንዶ' },
    ],
  },
  {
    id: 'tigray',
    nameEn: 'Tigray',
    nameAm: 'ትግራይ',
    cities: [
      { id: 'mekelle', nameEn: 'Mekelle (መቐለ)', nameAm: 'መቐለ' },
      { id: 'shire', nameEn: 'Shire (ሽሬ)', nameAm: 'ሽሬ' },
      { id: 'aksum', nameEn: 'Aksum (አክሱም)', nameAm: 'አክሱም' },
      { id: 'adigrat', nameEn: 'Adigrat (ዓዲግራት)', nameAm: 'ዓዲግራት' },
    ],
  },
  {
    id: 'dire_dawa',
    nameEn: 'Dire Dawa',
    nameAm: 'ድሬዳዋ',
    cities: [
      { id: 'dire_dawa_city', nameEn: 'Dire Dawa City (ድሬዳዋ ከተማ)', nameAm: 'ድሬዳዋ ከተማ' },
      { id: 'sabian', nameEn: 'Sabian (ሳቢያን)', nameAm: 'ሳቢያን' },
      { id: 'ganda_kore', nameEn: 'Ganda Kore (ገንዳ ኮሬ)', nameAm: 'ገንዳ ኮሬ' },
    ],
  },
  {
    id: 'harari',
    nameEn: 'Harari',
    nameAm: 'ሐረሪ',
    cities: [
      { id: 'harar_city', nameEn: 'Harar City (ሐረር ከተማ)', nameAm: 'ሐረር ከተማ' },
      { id: 'jugol', nameEn: 'Jugol (ጀጎል)', nameAm: 'ጀጎል' },
    ],
  },
  {
    id: 'somali',
    nameEn: 'Somali',
    nameAm: 'ሶማሌ',
    cities: [
      { id: 'jigjiga', nameEn: 'Jigjiga (ጅግጅጋ)', nameAm: 'ጅግጅጋ' },
      { id: 'gode', nameEn: 'Gode (ጎዴ)', nameAm: 'ጎዴ' },
      { id: 'degehabur', nameEn: 'Degehabur (ደገሃቡር)', nameAm: 'ደገሃቡር' },
    ],
  },
  {
    id: 'south_ethiopia',
    nameEn: 'South Ethiopia & Central',
    nameAm: 'ደቡብ እና መካከለኛ ኢትዮጵያ',
    cities: [
      { id: 'wolaita_sodo', nameEn: 'Wolaita Sodo (ወላይታ ሶዶ)', nameAm: 'ወላይታ ሶዶ' },
      { id: 'arba_minch', nameEn: 'Arba Minch (አርባ ምንጭ)', nameAm: 'አርባ ምንጭ' },
      { id: 'dilla', nameEn: 'Dilla (ዲላ)', nameAm: 'ዲላ' },
      { id: 'hosanna', nameEn: 'Hosanna (ሆሳዕና)', nameAm: 'ሆሳዕና' },
      { id: 'butajira', nameEn: 'Butajira (ቡታጅራ)', nameAm: 'ቡታጅራ' },
    ],
  },
  {
    id: 'afar',
    nameEn: 'Afar',
    nameAm: 'አፋር',
    cities: [
      { id: 'semera', nameEn: 'Semera (ሰመራ)', nameAm: 'ሰመራ' },
      { id: 'asaita', nameEn: 'Asaita (አሳይታ)', nameAm: 'አሳይታ' },
      { id: 'awash_sebat', nameEn: 'Awash Sebat (አዋሽ ሰባት)', nameAm: 'አዋሽ ሰባት' },
    ],
  },
  {
    id: 'benishangul',
    nameEn: 'Benishangul-Gumuz',
    nameAm: 'ቤኒሻንጉል ጉሙዝ',
    cities: [
      { id: 'asosa', nameEn: 'Asosa (አሶሳ)', nameAm: 'አሶሳ' },
      { id: 'metekel', nameEn: 'Metekel (መተከል)', nameAm: 'መተከል' },
    ],
  },
  {
    id: 'gambela',
    nameEn: 'Gambela',
    nameAm: 'ጋምቤላ',
    cities: [
      { id: 'gambela_city', nameEn: 'Gambela City (ጋምቤላ ከተማ)', nameAm: 'ጋምቤላ ከተማ' },
    ],
  },
  {
    id: 'south_west',
    nameEn: 'South West Ethiopia',
    nameAm: 'ደቡብ ምዕራብ ኢትዮጵያ',
    cities: [
      { id: 'bonga', nameEn: 'Bonga (ቦንጋ)', nameAm: 'ቦንጋ' },
      { id: 'mizan_teferi', nameEn: 'Mizan Teferi (ሚዛን ተፈሪ)', nameAm: 'ሚዛን ተፈሪ' },
      { id: 'tercha', nameEn: 'Tercha (ተርጫ)', nameAm: 'ተርጫ' },
    ],
  },
];
