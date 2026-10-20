'use client';

import React from 'react';
import { CommissionPaymentStatus } from '@/lib/types';
import { useStore } from '@/lib/store';

export default function CommissionLedgerTable() {
  const { ledger, updateLedgerEntry, t, language } = useStore();

  const totalGross = ledger.reduce((sum, item) => sum + item.grossClientAmount, 0);
  const totalCommission = ledger.reduce((sum, item) => sum + item.platformCommissionAmount, 0);
  const totalStudentPayout = ledger.reduce((sum, item) => sum + item.studentPayoutAmount, 0);
  const avgCommissionMargin = totalGross > 0 
    ? ((totalCommission / totalGross) * 100).toFixed(1) 
    : '20.0';

  const getStatusBadge = (status: CommissionPaymentStatus) => {
    switch (status) {
      case 'FULLY_SETTLED':
        return <span className="badge-glass-positive text-xs">{t('ledgerStatusFullySettled')}</span>;
      case 'CLIENT_PAID':
        return <span className="badge-glass-neutral text-xs">{t('ledgerStatusClientPaid')}</span>;
      case 'INVOICED':
        return <span className="rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 px-3 py-1 text-xs font-semibold">{t('ledgerStatusInvoiced')}</span>;
      case 'STUDENT_DISBURSED':
        return <span className="badge-glass-violet text-xs">{t('ledgerStatusDisbursed')}</span>;
      default:
        return <span className="badge-glass-neutral text-xs">{t('ledgerStatusPending')}</span>;
    }
  };

  const handleStatusChange = (dealId: string, newStatus: CommissionPaymentStatus) => {
    updateLedgerEntry(dealId, { 
      status: newStatus,
      paymentReceivedDate: newStatus === 'CLIENT_PAID' || newStatus === 'FULLY_SETTLED' ? new Date().toISOString() : undefined,
      studentDisbursedDate: newStatus === 'STUDENT_DISBURSED' || newStatus === 'FULLY_SETTLED' ? new Date().toISOString() : undefined,
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Financial KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <span className="text-sm font-medium text-[rgba(255,255,255,0.6)]">{t('ledgerTotalInvoicedVolume')}</span>
          <p className="mt-2 text-3xl sm:text-4xl font-light text-white tracking-tight">
            €{totalGross.toLocaleString()}
          </p>
          <span className="text-xs text-[rgba(255,255,255,0.45)] mt-1 block">{t('ledgerTotalInvoicedSub')}</span>
        </div>

        <div className="glass-card p-6 border-[rgba(167,123,243,0.35)] shadow-[0_0_24px_rgba(91,43,224,0.15)]">
          <span className="text-sm font-semibold text-[#A77BF3]">{t('ledgerNetBrokerMargin')}</span>
          <p className="mt-2 text-3xl sm:text-4xl font-light text-[#A77BF3] tracking-tight">
            €{totalCommission.toLocaleString()}
          </p>
          <span className="text-xs text-[rgba(255,255,255,0.55)] mt-1 block font-medium">{t('ledgerAvgMargin')} {avgCommissionMargin}%</span>
        </div>

        <div className="glass-card p-6 border-[rgba(63,208,176,0.3)]">
          <span className="text-sm font-semibold text-[#34D17A]">{t('ledgerStudentPayouts')}</span>
          <p className="mt-2 text-3xl sm:text-4xl font-light text-[#34D17A] tracking-tight">
            €{totalStudentPayout.toLocaleString()}
          </p>
          <span className="text-xs text-[rgba(255,255,255,0.55)] mt-1 block font-medium">{t('ledgerGuaranteedBounties')}</span>
        </div>

        <div className="glass-card p-6">
          <span className="text-sm font-medium text-[rgba(255,255,255,0.6)]">{t('ledgerSettlementSystem')}</span>
          <p className="mt-2 text-sm text-[rgba(255,255,255,0.85)] leading-relaxed">
            {t('ledgerSettlementSystemDesc')}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#3FD0B0] font-semibold">
            <span>{t('ledgerSettlementVerifiedBadge')}</span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-light text-white">
              <span>{t('ledgerTableTitle')}</span>
            </h3>
            <p className="text-sm text-[rgba(255,255,255,0.6)] mt-1">
              {t('ledgerTableSub')}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <thead className="bg-[rgba(255,255,255,0.04)] text-xs uppercase tracking-wider text-[rgba(255,255,255,0.5)] border-b border-[rgba(255,255,255,0.08)]">
              <tr>
                <th className="py-4 px-6 font-semibold">{t('ledgerThDealRef')}</th>
                <th className="py-4 px-6 font-semibold">{t('ledgerThParties')}</th>
                <th className="py-4 px-6 font-semibold">{t('ledgerThGrossAmount')}</th>
                <th className="py-4 px-6 font-semibold">{t('ledgerThStudentPayout')}</th>
                <th className="py-4 px-6 font-semibold">{t('ledgerThBrokerMargin')}</th>
                <th className="py-4 px-6 font-semibold">{t('ledgerThStatus')}</th>
                <th className={`py-4 px-6 font-semibold ${language === 'ar' ? 'text-left' : 'text-right'}`}>{t('ledgerThActions')}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.85)]">
              {ledger.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/[0.03] transition-colors">
                  
                  {/* Deal Ref */}
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                      {entry.dealReference}
                    </span>
                    <p className="text-xs font-mono text-[rgba(255,255,255,0.45)] mt-1.5">
                      {entry.invoiceReferenceNumber}
                    </p>
                  </td>

                  {/* Client & Student */}
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-base">
                      {entry.clientName}
                    </div>
                    <div className="text-xs text-[rgba(255,255,255,0.5)] mt-0.5">
                      {t('ledgerTalentLabel')} {entry.studentName}
                    </div>
                  </td>

                  {/* Gross */}
                  <td className="py-4 px-6 font-light text-lg text-white">
                    €{entry.grossClientAmount}
                  </td>

                  {/* Student payout */}
                  <td className="py-4 px-6 font-light text-lg text-[#34D17A]">
                    €{entry.studentPayoutAmount}
                  </td>

                  {/* Margin */}
                  <td className="py-4 px-6 font-light text-lg text-[#A77BF3]">
                    +€{entry.platformCommissionAmount}
                    <span className="text-xs text-[rgba(255,255,255,0.5)] font-normal mx-1.5">
                      ({entry.commissionPercentage}%)
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {getStatusBadge(entry.status)}
                    {entry.settlementNotes && (
                      <p className="text-xs text-[rgba(255,255,255,0.45)] mt-1.5 line-clamp-1">
                        {entry.settlementNotes}
                      </p>
                    )}
                  </td>

                  {/* Actions */}
                  <td className={`py-4 px-6 ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                    <select
                      value={entry.status}
                      onChange={(e) => handleStatusChange(entry.dealId, e.target.value as CommissionPaymentStatus)}
                      className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[#07070C] px-4 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-[#A77BF3] cursor-pointer"
                    >
                      <option value="PENDING_INVOICE">{t('ledgerOptPending')}</option>
                      <option value="INVOICED">{t('ledgerOptInvoiced')}</option>
                      <option value="CLIENT_PAID">{t('ledgerOptClientPaid')}</option>
                      <option value="STUDENT_DISBURSED">{t('ledgerOptStudentDisbursed')}</option>
                      <option value="FULLY_SETTLED">{t('ledgerOptFullySettled')}</option>
                    </select>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
