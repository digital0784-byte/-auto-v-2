import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Send, Phone, MapPin, ShieldCheck } from 'lucide-react';

interface FooterProps {
  language: Language;
  onOpenBankModal: () => void;
  onOpenPostModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onOpenBankModal,
  onOpenPostModal,
}) => {
  const t = translations[language];

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 pt-10 pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-base">
                N
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                {t.brandName}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {language === 'am'
                ? 'በኢትዮጵያ አስተማማኝ እና ፈጣን የቤትና የመኪና ኪራይና ሽያጭ መድረክ። በቴሌግራም ሚኒ አፕ እና በዌብ መተግበሪያ የተደገፈ ቀጥተኛ የግብይት ድልድይ።'
                : 'Ethiopia’s premier digital property and automobile marketplace, seamlessly integrated with Telegram Mini App and web browsers for rapid direct deal closing.'}
            </p>
            <div className="flex items-center gap-3 text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{language === 'am' ? 'የተረጋገጠ ህጋዊ ድርጅት' : 'Licensed Brokerage'}</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Telegram Bot Ready</span>
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {language === 'am' ? 'ፈጣን ማገናኛዎች' : 'Quick Actions'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenPostModal}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.postListing}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBankModal}
                  className="hover:text-amber-400 transition-colors"
                >
                  {t.officialAccountsTitle}
                </button>
              </li>
              <li>
                <a
                  href="https://t.me/nur_marketplace_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3 text-sky-400" />
                  <span>@nur_marketplace_bot</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              {t.agentContact}
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:+251911458920" className="hover:text-white font-mono">
                  +251 911 458 920
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:+251922883411" className="hover:text-white font-mono">
                  +251 922 883 411
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Bole Atlas, Addis Ababa, Ethiopia</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Quiet Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} NUR Property & Auto Marketplace. All rights reserved.
          </div>
          <div>
            {language === 'am' ? 'አዲስ አበባ፣ ኢትዮጵያ' : 'Addis Ababa, Ethiopia'}
          </div>
        </div>

      </div>
    </footer>
  );
};
