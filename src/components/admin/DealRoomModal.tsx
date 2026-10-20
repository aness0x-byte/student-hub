'use client';

import React, { useState } from 'react';
import { MatchmakingDeal, DealStatus } from '@/lib/types';
import { useStore } from '@/lib/store';

interface Props {
  deal: MatchmakingDeal | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DealRoomModal({ deal, isOpen, onClose }: Props) {
  const { 
    tasks, 
    students, 
    companies, 
    facilitationLogs, 
    sendFacilitationMessage, 
    updateDealStatus,
    currentRole,
    language,
    t
  } = useStore();

  const [message, setMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);

  if (!isOpen || !deal) return null;

  const pipelineStages: { status: DealStatus; label: string }[] = [
    { status: 'SUBMITTED', label: t('kanbanStage1') },
    { status: 'UNDER_ADMIN_REVIEW', label: t('kanbanStage2') },
    { status: 'SHORTLISTED', label: t('kanbanStage3') },
    { status: 'MATCHED_CONNECTED', label: t('kanbanStage4') },
    { status: 'IN_PROGRESS', label: t('kanbanStage5') },
    { status: 'COMPLETED_COMMISSION_COLLECTED', label: t('kanbanStage6') },
  ];

  const task = tasks.find(t => t.id === deal.taskRequestId);
  const student = students.find(s => s.id === deal.studentProfileId);
  const company = companies.find(c => c.id === task?.companyProfileId);
  
  const dealMessages = facilitationLogs.filter(m => m.dealId === deal.id);
  const visibleMessages = currentRole === 'SUPER_ADMIN' 
    ? dealMessages 
    : dealMessages.filter(m => !m.isInternalNote);

  const currentStageIndex = pipelineStages.findIndex(s => s.status === deal.status);
  const displayTitle = language === 'en'
    ? (task?.titleEn || task?.title || 'Verified Micro-Task')
    : (task?.title || 'مهمة وساطة مصغرة');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendFacilitationMessage(
      deal.id,
      message,
      currentRole === 'SUPER_ADMIN' ? isInternalNote : false
    );
    setMessage('');
    setIsInternalNote(false);
  };

  const handleAdvanceStatus = (newStatus: DealStatus) => {
    updateDealStatus(deal.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl border border-[rgba(255,255,255,0.15)] bg-[#0C0C16]/95 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[94vh] flex flex-col text-white">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                {deal.dealReference}
              </span>
              <span className="badge-glass-positive text-xs">
                {t('dealRoomProtected')}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-light text-white">
              {t('dealRoomTitle')} {displayTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full px-3 py-1 text-xs font-semibold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            {t('close')}
          </button>
        </div>

        {/* Pipeline Stepper (Admin Interactive) */}
        <div className="mt-4 p-4 rounded-2xl glass-card shrink-0">
          <div className="flex items-center justify-between text-xs text-[rgba(255,255,255,0.7)] mb-3 font-semibold">
            <span>{t('dealRoomStagesTitle')}</span>
            {currentRole === 'SUPER_ADMIN' && (
              <span className="text-[11px] text-[#A77BF3] font-normal">
                {t('dealRoomStageAdvanceTip')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {pipelineStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              return (
                <button
                  key={stage.status}
                  disabled={currentRole !== 'SUPER_ADMIN'}
                  onClick={() => handleAdvanceStatus(stage.status)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold text-center transition-all ${
                    isCurrent
                      ? 'bg-[#5B2BE0] text-white shadow-[0_0_16px_rgba(91,43,224,0.5)] border border-[#A77BF3]'
                      : isPast
                      ? 'bg-white/10 text-white/90 border border-white/15 hover:bg-white/15'
                      : 'bg-white/5 text-white/40 border border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="truncate">{stage.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Financial & Participant Metadata */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
          <div className="glass-card p-3.5">
            <span className="text-[11px] font-semibold text-[rgba(255,255,255,0.6)]">
              {t('dealRoomClient')}
            </span>
            <p className="mt-1 font-bold text-white text-xs truncate">
              {company?.companyName}
            </p>
            <p className="text-[11px] text-[rgba(255,255,255,0.5)] truncate">
              {company?.contactPersonName} • {company?.contactPhone}
            </p>
          </div>

          <div className="glass-card p-3.5 border-[#3FD0B0]/20">
            <span className="text-[11px] font-semibold text-[#3FD0B0]">
              {t('dealRoomTalent')}
            </span>
            <p className="mt-1 font-bold text-[#34D17A] text-xs truncate">
              {student?.fullName} ({student?.anonymousCode})
            </p>
            <p className="text-[11px] text-[rgba(255,255,255,0.5)] truncate">
              {student?.university} • {student?.phone}
            </p>
          </div>

          <div className="glass-card p-3.5 border-[#A77BF3]/30 bg-[#5B2BE0]/10">
            <span className="text-[11px] font-semibold text-[#A77BF3]">
              {t('dealRoomDistribution')}
            </span>
            <div className="mt-1 flex items-center justify-between text-xs font-bold">
              <span className="text-white">{t('dealRoomTotal')} €{deal.agreedClientBudget}</span>
              <span className="text-[#34D17A]">{t('dealRoomTalentNet')} €{deal.agreedStudentPayout}</span>
              <span className="text-[#A77BF3]">{t('dealRoomMargin')} €{deal.platformGrossMargin}</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Facilitation Message Log */}
        <div className="mt-4 flex-1 overflow-y-auto rounded-2xl glass-card p-4 space-y-3 min-h-[220px]">
          <div className="text-center">
            <span className="badge-glass-neutral text-xs py-1 px-4">
              {t('dealRoomChannelBadge')}
            </span>
          </div>

          {visibleMessages.length === 0 ? (
            <p className="text-center text-xs text-[rgba(255,255,255,0.4)] py-8">
              {t('dealRoomNoMessages')}
            </p>
          ) : (
            visibleMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`rounded-2xl p-3.5 text-xs leading-relaxed max-w-[85%] ${
                  msg.isInternalNote
                    ? `${language === 'ar' ? 'mr-auto' : 'ml-auto'} border border-amber-400/40 bg-amber-500/10 text-amber-200`
                    : msg.senderRole === 'SUPER_ADMIN'
                    ? 'border border-[#A77BF3]/40 bg-[#5B2BE0]/20 text-white'
                    : msg.senderRole === 'COMPANY'
                    ? 'border border-white/15 bg-white/5 text-white'
                    : 'border border-[#3FD0B0]/40 bg-[#3FD0B0]/10 text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-bold">
                  <span>{msg.senderName}</span>
                  {msg.isInternalNote && (
                    <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-amber-300 border border-amber-400/30 text-[10px]">
                      {t('dealRoomSecretNoteBadge')}
                    </span>
                  )}
                  <span className="text-[rgba(255,255,255,0.4)] font-normal text-[10px]">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-[rgba(255,255,255,0.85)]">{msg.messageContent}</p>

                {msg.fileAttachment && (
                  <div className="mt-2 text-[11px] font-mono text-[#A77BF3] underline">
                    <span>{t('dealRoomAttachment')} {msg.fileAttachment}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="mt-4 pt-3 shrink-0 border-t border-white/10">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('dealRoomPlaceholder')}
              className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#A77BF3] focus:outline-none focus:bg-white/10"
            />
            <button
              type="submit"
              className="btn-glass-primary px-5 py-2.5 text-xs font-bold"
            >
              <span>{t('dealRoomSend')}</span>
            </button>
          </div>

          {currentRole === 'SUPER_ADMIN' && (
            <div className="mt-2 flex items-center gap-2 text-xs text-amber-300 font-medium">
              <input
                type="checkbox"
                id="internalNoteToggle"
                checked={isInternalNote}
                onChange={(e) => setIsInternalNote(e.target.checked)}
                className="rounded border-amber-300 bg-black/40 text-amber-400 focus:ring-amber-500"
              />
              <label htmlFor="internalNoteToggle" className="cursor-pointer">
                {t('dealRoomSecretToggle')}
              </label>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
