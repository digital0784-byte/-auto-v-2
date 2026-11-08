import React, { useState } from 'react';
import { Language, AccessPass, BUYER_SEARCH_FEES, PaymentRequest } from '../types';
import { officialBankAccounts } from '../data/bankAccounts';
import { translations } from '../data/translations';
import { 
  X, 
  KeyRound, 
  Building2, 
  Car, 
  Check, 
  Copy, 
  ShieldCheck, 
  Sparkles, 
  LockOpen,
  Send,
  Clock,
  Phone,
  User
} from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface AccessPassModalProps {
  isOpen: boolean;
  targetType: 'property' | 'vehicle' | 'both';
  language: Language;
  accessPass: AccessPass;
  onClose: () => void;
  onSubmitPaymentRequest: (request: Omit<PaymentRequest, 'id' | 'createdAt' | 'status'>) => void;
  onDirectAdminApprove: (type: 'property' | 'vehicle' | 'both', refCode: string) => void;
  onShowToast: (msg: string) => void;
}

export const AccessPassModal: React.FC<AccessPassModalProps> = ({
  isOpen,
  targetType,
  language,
  accessPass,
  onClose,
  onSubmitPaymentRequest,
  onDirectAdminApprove,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [selectedPass, setSelectedPass] = useState<'property' | 'vehicle' | 'both'>(
    targetType === 'both' ? 'property' : targetType
  );
  const [selectedBankId, setSelectedBankId] = useState('telebirr');
  const [txnRef, setTxnRef] = useState('');
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('+2519');
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedBank = officialBankAccounts.find((b) => b.id === selectedBankId) || officialBankAccounts[0];

  const requiredFee =
    selectedPass === 'property'
      ? BUYER_SEARCH_FEES.property
      : selectedPass === 'vehicle'
      ? BUYER_SEARCH_FEES.vehicle
      : BUYER_SEARCH_FEES.property + BUYER_SEARCH_FEES.vehicle;

  const currentStatus =
    selectedPass === 'property'
      ? accessPass.propertyStatus
      : accessPass.vehicleStatus;

  const isUnlocked =
    selectedPass === 'property'
      ? accessPass.propertyUnlocked
      : accessPass.vehicleUnlocked;

  const handleCopy = (id: string, text: string) => {
    triggerHaptic('success');
    navigator.clipboard.writeText(text);
    setCopiedBankId(id);
    onShowToast(`${t.copied}`);
    setTimeout(() => setCopiedBankId(null), 2000);
  };

  const handleSubmitToAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnRef.trim()) {
      onShowToast(language === 'am' ? 'እባክዎ የክፍያ ማረጋገጫ ቁጥር (Txn No) ያስገቡ' : 'Please enter transaction number');
      return;
    }

    triggerHaptic('success');

    onSubmitPaymentRequest({
      type: selectedPass === 'property' ? 'search_pass_property' : 'search_pass_vehicle',
      userName: userName.trim() || 'ገዥ / ተከራይ',
      userPhone: userPhone.trim() || '+251911000000',
      amountEtb: requiredFee,
      bankId: selectedBank.id,
      bankName: language === 'am' ? selectedBank.bankNameAm : selectedBank.bankNameEn,
      txnNumber: txnRef.trim(),
    });

    setIsSubmitted(true);
    onShowToast(t.txnSentToAdminSuccess);
  };

  const handleForwardTelegram = () => {
    triggerHaptic('light');
    const msg = encodeURIComponent(
      `ሰላም አድሚን! የ ${requiredFee} ብር ክፍያ በ ${selectedBank.bankNameAm} ፈፅሜያለሁ።\n` +
      `Transaction No: ${txnRef.trim() || 'TXN-' + Math.floor(100000 + Math.random() * 900000)}\n` +
      `ስም: ${userName || 'ገዥ'}\nስልክ: ${userPhone}\n` +
      `እባክዎ የመፈለጊያ ፍቃዴን ያጽድቁልኝ።`
    );
    window.open(`https://t.me/nur_marketplace_bot?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const handleInstantApprove = () => {
    triggerHaptic('success');
    const ref = txnRef.trim() || `TXN-${Math.floor(100000 + Math.random() * 900000)}`;
    onDirectAdminApprove(selectedPass, ref);
    onShowToast(t.passUnlockedSuccess);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto z-10 border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {t.buyerPassTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'am' ? 'ክፍያ ፈጽመው የTxn ቁጥሩን ለአድሚን ይላኩ' : 'Submit Txn Number for Admin Approval'}
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Explanation Alert */}
          <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-100 text-xs sm:text-sm text-blue-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-blue-900">
                {language === 'am' ? 'የክፍያ ማረጋገጫ ሂደት' : 'Admin Approval Workflow'}
              </p>
              <p className="text-blue-800 leading-relaxed text-xs">
                {language === 'am'
                  ? 'ክፍያ እንደፈፀሙ የክፍያ ማረጋገጫ ቁጥሩን (Transaction Number) ወደ አድሚን ይልካሉ፤ ወዲያው አድሚን ሲያጸድቅልዎ ከባለቤቱ ጋር በቀጥታ ይገናኛሉ።'
                  : 'Pay the fee and submit your transaction number to Admin. As soon as Admin verifies and approves, your direct owner contact is activated immediately.'}
              </p>
            </div>
          </div>

          {/* Pass Type Switcher */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
              {language === 'am' ? 'የፍቃድ አይነት ይምረጡ' : 'Select Search Pass'}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedPass('property');
                  setIsSubmitted(false);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  selectedPass === 'property'
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Building2 className={`w-5 h-5 ${selectedPass === 'property' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                    150 {t.etb}
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  {language === 'am' ? 'የቤት መፈለጊያ' : 'Property Pass'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {accessPass.propertyUnlocked
                    ? (language === 'am' ? '✓ ቀድሞውኑ ፀድቋል' : '✓ Active')
                    : accessPass.propertyStatus === 'pending'
                    ? (language === 'am' ? '⏳ በአድሚን ማረጋገጫ ላይ' : '⏳ Pending Admin')
                    : (language === 'am' ? 'ለቤቶች ሙሉ መረጃ' : 'Full Property Access')}
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPass('vehicle');
                  setIsSubmitted(false);
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative ${
                  selectedPass === 'vehicle'
                    ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Car className={`w-5 h-5 ${selectedPass === 'vehicle' ? 'text-sky-600' : 'text-slate-500'}`} />
                  <span className="text-xs font-extrabold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-md">
                    200 {t.etb}
                  </span>
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  {language === 'am' ? 'የመኪና መፈለጊያ' : 'Vehicle Pass'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {accessPass.vehicleUnlocked
                    ? (language === 'am' ? '✓ ቀድሞውኑ ፀድቋል' : '✓ Active')
                    : accessPass.vehicleStatus === 'pending'
                    ? (language === 'am' ? '⏳ በአድሚን ማረጋገጫ ላይ' : '⏳ Pending Admin')
                    : (language === 'am' ? 'ለመኪኖች ሙሉ መረጃ' : 'Full Vehicle Access')}
                </div>
              </button>
            </div>
          </div>

          {/* Amount Due Display */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-medium">
                {language === 'am' ? 'የሚከፈለው ክፍያ' : 'Required Amount'}
              </span>
              <span className="text-lg font-bold text-emerald-400">
                {selectedPass === 'property'
                  ? (language === 'am' ? 'የቤት መፈለጊያ ፍቃድ' : 'Property Search Pass')
                  : (language === 'am' ? 'የመኪና መፈለጊያ ፍቃድ' : 'Vehicle Search Pass')}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
              {requiredFee} <span className="text-sm font-semibold text-emerald-400">{t.etb}</span>
            </div>
          </div>

          {/* Payment Account Selection */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
              {language === 'am' ? 'ክፍያ የሚፈጽሙበትን ባንክ ይምረጡ' : 'Select Payment Account'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {officialBankAccounts.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBankId(b.id)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                    selectedBankId === b.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[11px] truncate max-w-[90px]">
                    {b.id === 'telebirr' ? 'Telebirr' : b.id === 'cbe' ? 'CBE' : b.id === 'awash' ? 'Awash' : 'CBE Birr'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {b.codePrefix || ''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Bank Details with 1-Click Copy */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500">
                {language === 'am' ? selectedBank.bankNameAm : selectedBank.bankNameEn}
              </div>
              <div className="text-base font-extrabold text-slate-900 font-mono tabular-nums tracking-wide">
                {selectedBank.accountNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                {language === 'am' ? selectedBank.accountHolderAm : selectedBank.accountHolderEn}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(selectedBank.id, selectedBank.accountNumber)}
              className="px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 shrink-0 transition-colors active:scale-95 shadow-xs"
            >
              {copiedBankId === selectedBank.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
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

          {/* If already submitted, show Pending Banner */}
          {(isSubmitted || currentStatus === 'pending') && !isUnlocked && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-300 text-amber-950 space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 animate-spin" />
                <span>{t.pendingAdminApproval}</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {language === 'am'
                  ? 'የክፍያ ማረጋገጫ ቁጥርዎ ወደ አድሚን ዳሽቦርድ ተልኳል። አድሚኑ ወዲያው ሲያጸድቅልዎ ፍቃዱ በራሱ ይከፈታል።'
                  : 'Your transaction number is waiting for Admin approval. Once verified, access will be granted instantly.'}
              </p>
              <button
                type="button"
                onClick={handleForwardTelegram}
                className="w-full py-2.5 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.notifyAdminTelegram}</span>
              </button>
            </div>
          )}

          {/* Form to submit Transaction Number to Admin */}
          {(!isUnlocked && currentStatus !== 'pending') && (
            <form onSubmit={handleSubmitToAdmin} className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    {t.yourNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="ምሳሌ: አበበ ከበደ"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    {t.yourPhoneLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="+2519..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  {t.enterTxnRef} *
                </label>
                <input
                  type="text"
                  required
                  value={txnRef}
                  onChange={(e) => setTxnRef(e.target.value)}
                  placeholder="ምሳሌ: MP94837261 ወይም FT12938472"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-400 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold"
                />
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.sendTxnToAdmin}</span>
                </button>

                <button
                  type="button"
                  onClick={handleInstantApprove}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'am' ? 'እንደ አድሚን ወዲያውኑ አጽድቅ (Instant Admin Test)' : 'Approve as Admin now (Test)'}</span>
                </button>
              </div>
            </form>
          )}

          {isUnlocked && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <Check className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
              <div className="font-bold text-emerald-950 text-sm">
                {t.passActive}
              </div>
              <p className="text-xs text-emerald-800 mt-1">
                {t.directOwnerAccess}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
