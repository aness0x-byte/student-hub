'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import AnonymizedTaskCard from '@/components/shared/AnonymizedTaskCard';
import ApplyModal from '@/components/student/ApplyModal';
import SmartMatchModal from '@/components/admin/SmartMatchModal';
import { CompanyTaskRequest } from '@/lib/types';
import { formatCategoryName } from '@/lib/privacy-shield';

export default function TasksBoardPage() {
  const { tasks, currentRole, language, t } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [selectedTaskToApply, setSelectedTaskToApply] = useState<CompanyTaskRequest | null>(null);
  const [smartMatchTask, setSmartMatchTask] = useState<CompanyTaskRequest | null>(null);

  const publicTasks = tasks.filter(t => t.isPubliclyVisible);
  const categories = Array.from(new Set(publicTasks.map(t => t.category)));

  const filtered = publicTasks.filter(t => {
    const sLower = search.toLowerCase();
    const matchesSearch = t.referenceCode.toLowerCase().includes(sLower) ||
      t.title.toLowerCase().includes(sLower) ||
      (t.titleEn && t.titleEn.toLowerCase().includes(sLower)) ||
      t.problemStatement.toLowerCase().includes(sLower) ||
      (t.problemStatementEn && t.problemStatementEn.toLowerCase().includes(sLower)) ||
      t.requiredSkills.some(sk => sk.toLowerCase().includes(sLower));

    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-2">
        <span className="pill-badge-black">
          {t('tasksBoardHeroBadge')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
          {t('tasksBoardHeroTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">
          {t('tasksBoardHeroSubtitle')}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-[24px] p-4 border border-black/5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('tasksBoardSearchPlaceholder')}
            className="w-full rounded-full bg-[#EDEDED] text-xs px-5 py-2.5 text-[#1A1A1A] placeholder:text-[#8C8C8C] border-none focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs text-[#5A5A5A] font-medium">
            {t('tasksBoardCategoryLabel')}
          </span>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-full bg-[#EDEDED] text-xs px-4 py-2 text-[#1A1A1A] border-none focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t('tasksBoardAllCategories')}</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{formatCategoryName(cat, language)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((task) => (
          <AnonymizedTaskCard
            key={task.id}
            task={task}
            onApply={(t) => setSelectedTaskToApply(t)}
            onSmartMatch={(t) => setSmartMatchTask(t)}
            isAdmin={currentRole === 'SUPER_ADMIN'}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-[24px] py-16 text-center text-xs text-[#8C8C8C] border border-black/5">
          {t('tasksBoardNoResults')}
        </div>
      )}

      {/* Modals */}
      <ApplyModal
        task={selectedTaskToApply}
        isOpen={Boolean(selectedTaskToApply)}
        onClose={() => setSelectedTaskToApply(null)}
      />

      <SmartMatchModal
        task={smartMatchTask}
        isOpen={Boolean(smartMatchTask)}
        onClose={() => setSmartMatchTask(null)}
      />

    </div>
  );
}
