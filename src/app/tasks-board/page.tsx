'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import AnonymizedTaskCard from '@/components/shared/AnonymizedTaskCard';
import ApplyModal from '@/components/student/ApplyModal';
import SmartMatchModal from '@/components/admin/SmartMatchModal';
import { CompanyTaskRequest } from '@/lib/types';
import { formatCategoryName } from '@/lib/privacy-shield';

export default function TasksBoardPage() {
  const { tasks, currentRole } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const [selectedTaskToApply, setSelectedTaskToApply] = useState<CompanyTaskRequest | null>(null);
  const [smartMatchTask, setSmartMatchTask] = useState<CompanyTaskRequest | null>(null);

  const publicTasks = tasks.filter(t => t.isPubliclyVisible);
  const categories = Array.from(new Set(publicTasks.map(t => t.category)));

  const filtered = publicTasks.filter(t => {
    const matchesSearch = t.referenceCode.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.problemStatement.toLowerCase().includes(search.toLowerCase()) ||
      t.requiredSkills.some(sk => sk.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'ALL' || t.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="badge-glass-violet px-4 py-1.5 text-sm font-semibold">
          <span>إشراف وتدقيق الوسيط المعتمد • مستحقات مالية مضمونة</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
          لوحة المشاريع والمهام المعتمدة (تحت إشراف الوسيط)
        </h1>
        <p className="text-base sm:text-lg text-[rgba(255,255,255,0.7)] leading-relaxed">
          قدم عروضك التنفيذية مباشرة لإدارة الوساطة المعتمدة. تضمن المنصة حجب البيانات الشخصية بين الشركات والمنفذين لضمان الالتزام التعاقدي، والحماية المالية، والتحصيل البنكي المباشر.
        </p>
      </div>

      {/* Filter Toolbar (Glass Pill Bar) */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم، المهارة، أو الكود المرجعي..."
            className="w-full rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-5 py-2.5 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#A77BF3]"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="text-sm text-[rgba(255,255,255,0.6)] font-semibold">
            <span>التصنيف:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[#07070C] px-5 py-2.5 text-sm text-white focus:outline-none focus:border-[#A77BF3] cursor-pointer"
          >
            <option value="ALL">كافة المجالات والتصنيفات</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{formatCategoryName(cat)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="glass-card py-20 text-center text-sm text-[rgba(255,255,255,0.5)]">
          لم يتم العثور على أي مهمة مطابقة لخيارات البحث الحالية.
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
