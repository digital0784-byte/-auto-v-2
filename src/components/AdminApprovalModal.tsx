import React, { useState } from 'react';
import { PaymentRequest, Language } from '../types';
import { translations } from '../data/translations';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Clock, 
  Copy, 
  PhoneCall, 
  Building2, 
  Car, 
  FileText, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface AdminApprovalModalProps {
  isOpen: boolean;
  language: Language;
  paymentRequests: PaymentRequest[];
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  isOpen,
  language,
  paymentRequests,
  onApproveRequest,
  onRejectRequest,
  onClose,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'all'>('pending');
  const [copiedTxnId, setCopiedTxnId] = useState<string | null>(null);

  const pendingRequests = paymentRequests.filter((r) => r.status === 'pending');
  const approvedRequests = paymentRequests.filter((r) => r.status === 'approved');

  const filtered =
    activeTab === 'pending'
      ? pendingRequests
      : activeTab === 'approved'
      ? approvedRequests
      : paymentRequests;

  const totalCollectedEtb = approvedRequests.reduce((sum, r) => sum + r.amountEtb, 0);

  const handleCopyTxn = (id: string, txnNumber: string) => {
    triggerHaptic('success');
    navigator.clipboard.writeText(txnNumber);
    setCopiedTxnId(id);
    onShowToast(`Txn #${txnNumber} ${t.copied}`);
    setTimeout(() => setCopiedTxnId(null), 2000);
  };

  const handleApprove = (id: string, userName: string, amount: number) => {
    triggerHaptic('success');
    onApproveRequest(id);
    onShowToast(
      language === 'am'
        ? `የ ${userName} የ ${amount} ብር ክፍያ ፀድቋል! መዳረሻው ተከፍቷል።`
        : `Approved ${amount} ETB payment for ${userName}!`
    );
  };

  const handleReject = (id: string) => {
    triggerHaptic('light');
    onRejectRequest(id);
    onShowToast(t.rejectedSuccess);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto z-10 border border-slate-200">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-4.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {t.adminDashboardTitle}
                </h2>
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'am'
                  ? 'የተላኩ የክፍያ ማረጋገጫዎችን (Transaction Numbers) አጽድቅ'
                  : 'Review and approve customer transaction numbers'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="bg-slate-950 p-4 grid grid-cols-3 gap-3 border-b border-slate-800 text-white">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending Review'}</span>
            </span>
            <div className="text-xl font-black tabular-nums mt-0.5 text-white">
              {pendingRequests.length}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'የፀደቁ ክፍያዎች' : 'Approved'}</span>
            </span>
            <div className="text-xl font-black tabular-nums mt-0.5 text-white">
              {approvedRequests.length}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-sky-400 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{language === 'am' ? 'የተሰበሰበ ገቢ' : 'Total Revenue'}</span>
            </span>
            <div className="text-xl font-black tabular-nums mt-0.5 text-emerald-400">
              {totalCollectedEtb.toLocaleString()} <span className="text-xs text-slate-400">{t.etb}</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 pt-4 pb-2 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending'}</span>
              <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px] tabular-nums">
                {pendingRequests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'am' ? 'የፀደቁ' : 'Approved'} ({approvedRequests.length})
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'am' ? 'ሁሉም' : 'All'} ({paymentRequests.length})
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            {language === 'am' ? 'በአድሚን ሲፀድቅ ወዲያውኑ ገባሪ ይሆናል' : 'Approvals activate instantly'}
          </span>
        </div>

        {/* Requests List */}
        <div className="p-6 space-y-3">
          {filtered.length > 0 ? (
            filtered.map((req) => {
              const isCopied = copiedTxnId === req.id;
              const isPending = req.status === 'pending';

              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isPending
                      ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    
                    {/* Left: Type, User, Amount */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {req.type === 'search_pass_property' ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            <span>{language === 'am' ? 'የቤት መፈለጊያ ፍቃድ' : 'Property Search Pass'}</span>
                          </span>
                        ) : req.type === 'search_pass_vehicle' ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 flex items-center gap-1">
                            <Car className="w-3 h-3" />
                            <span>{language === 'am' ? 'የመኪና መፈለጊያ ፍቃድ' : 'Vehicle Search Pass'}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span>{language === 'am' ? 'የንብረት ማስመዝገቢያ ክፍያ' : 'Listing Registration Fee'}</span>
                          </span>
                        )}

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          req.status === 'approved'
                            ? 'bg-emerald-600 text-white'
                            : req.status === 'rejected'
                            ? 'bg-rose-600 text-white'
                            : 'bg-amber-400 text-slate-950 animate-pulse'
                        }`}>
                          {req.status === 'approved'
                            ? (language === 'am' ? 'የፀደቀ' : 'Approved')
                            : req.status === 'rejected'
                            ? (language === 'am' ? 'ውድቅ' : 'Rejected')
                            : (language === 'am' ? 'በመጠባበቅ ላይ' : 'Pending')}
                        </span>
                      </div>

                      {/* User Name & Listing */}
                      <div className="text-sm font-bold text-slate-900">
                        {req.userName || 'ተጠቃሚ (User)'} 
                        {req.userPhone && (
                          <a href={`tel:${req.userPhone}`} className="text-xs text-emerald-700 ml-2 font-mono hover:underline">
                            {req.userPhone}
                          </a>
                        )}
                      </div>

                      {req.listingTitle && (
                        <div className="text-xs text-slate-600 truncate max-w-md">
                          {language === 'am' ? 'ንብረት:' : 'Listing:'} {req.listingTitle}
                        </div>
                      )}

                      {/* Transaction Number with 1-Click Copy */}
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="text-slate-500">{req.bankName}:</span>
                        <span className="font-extrabold text-slate-950 font-mono tracking-wider bg-white px-2 py-0.5 rounded border border-slate-300">
                          {req.txnNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTxn(req.id, req.txnNumber)}
                          className="text-slate-500 hover:text-slate-800 p-1"
                          title="Copy Txn No"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400">
                        {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(req.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Right: Amount & Action Buttons */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <div className="text-right">
                        <div className="text-lg font-black text-slate-950 tabular-nums">
                          {req.amountEtb} <span className="text-xs font-bold text-emerald-600">{t.etb}</span>
                        </div>
                      </div>

                      {isPending ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleApprove(req.id, req.userName, req.amountEtb)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.approve}</span>
                          </button>

                          <button
                            onClick={() => handleReject(req.id)}
                            className="px-2.5 py-2 bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-600 font-bold text-xs rounded-xl transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{language === 'am' ? 'ተረጋግጧል' : 'Active'}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {language === 'am' ? 'በዚህ ምድብ ምንም ክፍያ የለም' : 'No requests in this category'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
