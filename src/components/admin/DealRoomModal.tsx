'use client';

import React, { useState } from 'react';
import { MatchmakingDeal, DealStatus } from '@/lib/types';
import { useStore } from '@/lib/store';
import { X, Send, ShieldCheck } from 'lucide-react';

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
    ? (task?.titleEn || task?.title || 'Verified Task')
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-[32px] bg-white border border-black/10 p-6 sm:p-8 shadow-2xl max-h-[92vh] flex flex-col text-[#1A1A1A]">
        
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-black/5 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#1A1A1A] bg-[#EDEDED] px-2.5 py-0.5 rounded-full">
                {deal.dealReference}
              </span>
              <span className="pill-badge-black !text-[10px] !py-0.5">
                {t('dealRoomProtected')}
              </span>
            </div>
            <h2 className="mt-2 text-lg sm:text-xl font-semibold text-[#1A1A1A]">
              {t('dealRoomTitle')} {displayTitle}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#EDEDED] text-[#1A1A1A] flex items-center justify-center hover:bg-[#E4E4E4] transition-colors"
          >
            <X className="h-4 w-4 stroke-[2]" />
          </button>
        </div>

        {/* Pipeline Stepper */}
        <div className="mt-4 p-4 rounded-2xl bg-[#EDEDED]/50 shrink-0">
          <div className="text-xs text-[#5A5A5A] mb-2 flex items-center justify-between">
            <span className="font-medium">{t('dealRoomStagesTitle')}</span>
            {currentRole === 'SUPER_ADMIN' && (
              <span className="text-[11px] text-[#8C8C8C]">{t('dealRoomStageAdvanceTip')}</span>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {pipelineStages.map((stage, idx) => {
              const isPassed = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <button
                  key={stage.status}
                  disabled={currentRole !== 'SUPER_ADMIN'}
                  onClick={() => handleAdvanceStatus(stage.status)}
                  className={`flex-1 min-w-[100px] text-center p-2 rounded-xl text-[11px] transition-all ${
                    isCurrent
                      ? 'bg-[#262626] text-white font-semibold'
                      : isPassed
                      ? 'bg-[#E4E4E4] text-[#1A1A1A] font-medium'
                      : 'bg-white text-[#8C8C8C] border border-black/5'
                  } ${currentRole === 'SUPER_ADMIN' ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                >
                  <span className="block truncate">{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Column Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4 flex-1 min-h-0 overflow-y-auto">
          
          {/* Left: Financial & Protocol Details */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#EDEDED]/50 space-y-3 text-xs">
              <h4 className="font-semibold text-xs text-[#1A1A1A]">{t('dealRoomDistribution')}</h4>
              
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#5A5A5A]">{t('dealRoomClient')}</span>
                <span className="font-medium text-[#1A1A1A]">{company?.companyName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#5A5A5A]">{t('dealRoomTalent')}</span>
                <span className="font-medium text-[#1A1A1A]">{student?.anonymousCode}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#5A5A5A]">{t('dealRoomTotal')}</span>
                <span className="font-semibold text-[#1A1A1A]">${deal.agreedClientBudget}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-[#5A5A5A]">{t('dealRoomTalentNet')}</span>
                <span className="font-semibold text-[#1A1A1A]">${deal.agreedStudentPayout}</span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-[#5A5A5A]">{t('dealRoomMargin')}</span>
                <span className="font-semibold text-[#1A1A1A]">+${deal.platformGrossMargin}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-black/5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A]">
                <ShieldCheck className="h-4 w-4 stroke-[1.5]" />
                <span>{t('dealRoomChannelBadge')}</span>
              </div>
              <p className="text-[11px] text-[#5A5A5A] leading-relaxed">
                {language === 'en' 
                  ? 'Elena audits deliverables, enforces non-circumvention, and handles formal invoice processing directly.' 
                  : 'تتولى إيلينا تدقيق المخرجات، وفرض بروتوكول منع التحايل، وإصدار الفواتير المصرفية الرسمية مباشرة.'}
              </p>
            </div>
          </div>

          {/* Right: Facilitation Messaging Feed */}
          <div className="md:col-span-2 flex flex-col rounded-2xl bg-[#EDEDED]/30 border border-black/5 p-4 min-h-[300px]">
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {visibleMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-[#8C8C8C] text-center p-6">
                  {t('dealRoomNoMessages')}
                </div>
              ) : (
                visibleMessages.map((msg) => {
                  const isMine = msg.senderRole === currentRole;
                  const isInternal = msg.isInternalNote;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-[#8C8C8C] mb-1">
                        <span>{msg.senderName}</span>
                        {isInternal && (
                          <span className="pill-badge-black !text-[9px] !py-0.5">
                            {t('dealRoomSecretNoteBadge')}
                          </span>
                        )}
                        <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`rounded-2xl p-3 text-xs max-w-md leading-relaxed ${
                          isInternal
                            ? 'bg-[#262626] text-white'
                            : isMine
                            ? 'bg-[#1A1A1A] text-white'
                            : 'bg-white text-[#1A1A1A] border border-black/5'
                        }`}
                      >
                        {msg.messageContent}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t border-black/5 space-y-2">
              {currentRole === 'SUPER_ADMIN' && (
                <div className="flex items-center gap-2 text-xs text-[#5A5A5A]">
                  <input
                    type="checkbox"
                    id="internalNote"
                    checked={isInternalNote}
                    onChange={(e) => setIsInternalNote(e.target.checked)}
                    className="rounded text-black"
                  />
                  <label htmlFor="internalNote" className="cursor-pointer">
                    {t('dealRoomSecretToggle')}
                  </label>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('dealRoomPlaceholder')}
                  className="flex-1 rounded-full bg-white text-xs px-4 py-2.5 text-[#1A1A1A] border border-black/10 focus:outline-none"
                />
                <button
                  type="submit"
                  className="pill-btn-dark !h-9 !px-4"
                >
                  <Send className="h-3.5 w-3.5 stroke-[1.8]" />
                  <span>{t('dealRoomSend')}</span>
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
