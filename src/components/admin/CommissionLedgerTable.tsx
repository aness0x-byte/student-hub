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
        return <span className="pill-badge-black !text-[11px]">{t('ledgerStatusFullySettled')}</span>;
      case 'CLIENT_PAID':
        return <span className="pill-badge-gray !text-[11px]">{t('ledgerStatusClientPaid')}</span>;
      case 'INVOICED':
        return <span className="pill-badge-gray !text-[11px] font-semibold">{t('ledgerStatusInvoiced')}</span>;
      case 'STUDENT_DISBURSED':
        return <span className="pill-badge-gray !text-[11px]">{t('ledgerStatusDisbursed')}</span>;
      default:
        return <span className="pill-badge-gray !text-[11px] text-[#8C8C8C]">{t('ledgerStatusPending')}</span>;
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
    <div className="space-y-6">
      
      {/* Financial KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] p-6 border border-black/5">
          <span className="text-xs font-medium text-[#5A5A5A]">{t('ledgerTotalInvoicedVolume')}</span>
          <p className="mt-2 text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-tight">
            ${totalGross.toLocaleString()}
          </p>
          <span className="text-[11px] text-[#8C8C8C] mt-1 block">{t('ledgerTotalInvoicedSub')}</span>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-black/5">
          <span className="text-xs font-medium text-[#5A5A5A]">{t('ledgerNetBrokerMargin')}</span>
          <p className="mt-2 text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-tight">
            ${totalCommission.toLocaleString()}
          </p>
          <span className="text-[11px] text-[#8C8C8C] mt-1 block font-medium">{t('ledgerAvgMargin')} {avgCommissionMargin}%</span>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-black/5">
          <span className="text-xs font-medium text-[#5A5A5A]">{t('ledgerStudentPayouts')}</span>
          <p className="mt-2 text-2xl sm:text-3xl font-semibold text-[#1A1A1A] tracking-tight">
            ${totalStudentPayout.toLocaleString()}
          </p>
          <span className="text-[11px] text-[#8C8C8C] mt-1 block font-medium">{t('ledgerGuaranteedBounties')}</span>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-black/5">
          <span className="text-xs font-medium text-[#5A5A5A]">{t('ledgerSettlementSystem')}</span>
          <p className="mt-2 text-xs text-[#5A5A5A] leading-relaxed">
            {t('ledgerSettlementSystemDesc')}
          </p>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-[24px] border border-black/5 overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#1A1A1A]">
              {t('ledgerTableTitle')}
            </h3>
            <p className="text-xs text-[#5A5A5A] mt-0.5">
              {t('ledgerTableSub')}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full text-xs ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <thead className="bg-[#EDEDED]/50 text-[11px] uppercase tracking-wider text-[#5A5A5A] border-b border-black/5">
              <tr>
                <th className="py-3.5 px-5 font-medium">{t('ledgerThDealRef')}</th>
                <th className="py-3.5 px-5 font-medium">{t('ledgerThParties')}</th>
                <th className="py-3.5 px-5 font-medium">{t('ledgerThGrossAmount')}</th>
                <th className="py-3.5 px-5 font-medium">{t('ledgerThStudentPayout')}</th>
                <th className="py-3.5 px-5 font-medium">{t('ledgerThBrokerMargin')}</th>
                <th className="py-3.5 px-5 font-medium">{t('ledgerThStatus')}</th>
                <th className="py-3.5 px-5 font-medium">{t('ledgerThActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-[#1A1A1A]">
              {ledger.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#F2F2F2] transition-colors">
                  <td className="py-3 px-5 font-mono font-medium">
                    {entry.dealReference}
                  </td>
                  <td className="py-3 px-5">
                    <span className="font-medium text-[#1A1A1A] block">{entry.clientName}</span>
                    <span className="text-[11px] text-[#8C8C8C]">{entry.studentName}</span>
                  </td>
                  <td className="py-3 px-5 font-semibold">
                    ${entry.grossClientAmount}
                  </td>
                  <td className="py-3 px-5 font-medium text-[#1A1A1A]">
                    ${entry.studentPayoutAmount}
                  </td>
                  <td className="py-3 px-5 font-semibold text-[#1A1A1A]">
                    +${entry.platformCommissionAmount}
                  </td>
                  <td className="py-3 px-5">
                    {getStatusBadge(entry.status)}
                  </td>
                  <td className="py-3 px-5">
                    <select
                      value={entry.status}
                      onChange={(e) => handleStatusChange(entry.id, e.target.value as CommissionPaymentStatus)}
                      aria-label="Payment Status"
                      className="rounded-full bg-[#EDEDED] text-[#1A1A1A] text-xs px-3 py-1 border border-black/10 focus:outline-none cursor-pointer"
                    >
                      <option value="INVOICED">{t('ledgerStatusInvoiced')}</option>
                      <option value="CLIENT_PAID">{t('ledgerStatusClientPaid')}</option>
                      <option value="STUDENT_DISBURSED">{t('ledgerStatusDisbursed')}</option>
                      <option value="FULLY_SETTLED">{t('ledgerStatusFullySettled')}</option>
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
