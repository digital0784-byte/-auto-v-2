import React, { useState } from 'react';
import { Language } from '../types';
import { officialBankAccounts } from '../data/bankAccounts';
import { translations } from '../data/translations';
import { X, Copy, Check, ShieldCheck, QrCode, Smartphone, CreditCard } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface BankAccountsModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const BankAccountsModal: React.FC<BankAccountsModalProps> = ({
  isOpen,
  language,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = translations[language];

  const handleCopy = (id: string, text: string, bankName: string) => {
    triggerHaptic('success');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast(`${bankName}: ${t.copied}`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t.officialAccountsTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'am' ? 'የተረጋገጡ ህጋዊ የክፍያ መንገዶች' : 'Official Verified Payment Methods'}
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-xs text-emerald-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">
                {language === 'am' ? 'አስፈላጊ ማሳሰቢያ' : 'Official Verification Note'}
              </p>
              <p className="mt-0.5 text-emerald-800 leading-relaxed">
                {t.officialAccountsSub}
              </p>
            </div>
          </div>

          {/* Bank Cards Grid */}
          <div className="space-y-3">
            {officialBankAccounts.map((account) => {
              const isCopied = copiedId === account.id;
              const bankTitle = language === 'am' ? account.bankNameAm : account.bankNameEn;
              const accountHolder = language === 'am' ? account.accountHolderAm : account.accountHolderEn;
              const instructions = language === 'am' ? account.instructionsAm : account.instructionsEn;

              return (
                <div
                  key={account.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Bank Icon / Logo simulation */}
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: account.brandColor }}
                    >
                      {account.iconType === 'telebirr' ? (
                        <Smartphone className="w-5 h-5" />
                      ) : account.iconType === 'cbe' ? (
                        <span className="text-xs font-black">CBE</span>
                      ) : account.iconType === 'awash' ? (
                        <span className="text-xs font-black">AIB</span>
                      ) : (
                        <QrCode className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                          {bankTitle}
                        </h3>
                        {account.codePrefix && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {account.codePrefix}
                          </span>
                        )}
                      </div>

                      {/* Account Number with Copy Highlight */}
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {t.accountNumber}:
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-slate-950 font-mono tracking-wide tabular-nums select-all">
                          {account.accountNumber}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 mt-0.5 truncate">
                        {t.accountHolder}: <span className="font-semibold text-slate-800">{accountHolder}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1">
                        {instructions}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Copy Button */}
                  <button
                    onClick={() => handleCopy(account.id, account.accountNumber, bankTitle)}
                    className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95 ${
                      isCopied
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-xs'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>{t.copyAccount}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
