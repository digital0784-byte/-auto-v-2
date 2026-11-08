import React, { useState } from 'react';
import { Language } from '../types';
import { officialBankAccounts } from '../data/bankAccounts';
import { translations } from '../data/translations';
import { Copy, Check, ShieldCheck, Smartphone, QrCode } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface BankAccountsSectionProps {
  language: Language;
  onShowToast: (msg: string) => void;
}

export const BankAccountsSection: React.FC<BankAccountsSectionProps> = ({
  language,
  onShowToast,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = translations[language];

  const handleCopy = (id: string, text: string, name: string) => {
    triggerHaptic('success');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast(`${name}: ${t.copied}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800 rounded-3xl my-12 max-w-7xl mx-auto shadow-xl">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-300 mb-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{language === 'am' ? 'ኦፊሴላዊ የክፍያ መንገዶች' : 'Official Verified Banking Channels'}</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
          {t.officialAccountsTitle}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          {t.officialAccountsSub}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {officialBankAccounts.map((account) => {
          const isCopied = copiedId === account.id;
          const bankTitle = language === 'am' ? account.bankNameAm : account.bankNameEn;
          const holder = language === 'am' ? account.accountHolderAm : account.accountHolderEn;
          const instructions = language === 'am' ? account.instructionsAm : account.instructionsEn;

          return (
            <div
              key={account.id}
              className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                    style={{ backgroundColor: account.brandColor }}
                  >
                    {account.iconType === 'telebirr' ? (
                      <Smartphone className="w-5 h-5" />
                    ) : account.iconType === 'cbe' ? (
                      <span className="text-[11px] font-black">CBE</span>
                    ) : account.iconType === 'awash' ? (
                      <span className="text-[11px] font-black">AIB</span>
                    ) : (
                      <QrCode className="w-5 h-5" />
                    )}
                  </div>
                  {account.codePrefix && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {account.codePrefix}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-white line-clamp-1">
                  {bankTitle}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  {holder}
                </p>

                {/* Account Number Box */}
                <div className="mt-3 p-2 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-medium">
                    {t.accountNumber}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white font-mono tracking-wide tabular-nums select-all">
                    {account.accountNumber}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 mt-2">
                  {instructions}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleCopy(account.id, account.accountNumber, bankTitle)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>{t.copyAccount}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
