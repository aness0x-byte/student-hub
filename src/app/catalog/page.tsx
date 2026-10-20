'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import AnonymizedTalentCard from '@/components/shared/AnonymizedTalentCard';

export default function TalentCatalogPage() {
  const { students } = useStore();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [skillFilter, setSkillFilter] = useState('ALL');

  const verifiedStudents = students.filter(s => s.verificationStatus === 'VERIFIED');
  const allSkills = Array.from(new Set(verifiedStudents.flatMap(s => s.skills)));

  const filtered = verifiedStudents.filter(s => {
    const matchesSearch = s.anonymousCode.toLowerCase().includes(search.toLowerCase()) ||
      s.university.toLowerCase().includes(search.toLowerCase()) ||
      s.major.toLowerCase().includes(search.toLowerCase()) ||
      s.skills.some(sk => sk.toLowerCase().includes(search.toLowerCase()));

    const matchesLevel = levelFilter === 'ALL' || s.academicLevel === levelFilter;
    const matchesSkill = skillFilter === 'ALL' || s.skills.includes(skillFilter);

    return matchesSearch && matchesLevel && matchesSkill;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="badge-glass-positive px-4 py-1.5 text-sm font-semibold">
          <span>درع الخصوصية الصارم • ملفات تعريف مجهولة الهوية بالكامل</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
          دليل الكفاءات الجامعية المعتمدة
        </h1>
        <p className="text-base sm:text-lg text-[rgba(255,255,255,0.7)] leading-relaxed">
          تصفح نخبة الكفاءات الأكاديمية والمهنية المعتمدة. تبقى بيانات التواصل الشخصية محجوبة بالكامل وفق سياسة درع الخصوصية الصارم، ويتولى الوسيط المعتمد التنسيق والمطابقة الرسمية وتدشين غرفة الصفقة.
        </p>
      </div>

      {/* Filter Toolbar (Glass Pill Bar) */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالجامعة، المهارة، أو الكود..."
            className="w-full rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-5 py-2.5 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#A77BF3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="text-sm text-[rgba(255,255,255,0.6)] font-semibold">
            <span>التصفيات:</span>
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[#07070C] px-5 py-2.5 text-sm text-white focus:outline-none focus:border-[#A77BF3] cursor-pointer"
          >
            <option value="ALL">جميع المستويات الأكاديمية</option>
            <option value="LICENCE_3">ليسانس / بكالوريوس (L3)</option>
            <option value="MASTER_1">ماستر 1 (M1)</option>
            <option value="MASTER_2">ماستر 2 / تخصصي (M2)</option>
            <option value="ENGINEERING_CYCLE">سلك المهندسين</option>
          </select>

          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[#07070C] px-5 py-2.5 text-sm text-white focus:outline-none focus:border-[#A77BF3] cursor-pointer"
          >
            <option value="ALL">جميع المهارات المعتمدة</option>
            {allSkills.map((sk) => (
              <option key={sk} value={sk}>{sk}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((student) => (
          <AnonymizedTalentCard
            key={student.id}
            student={student}
            onRequestMatch={(s) => {
              alert(`تم تسجيل طلب المطابقة للكفاءة ${s.anonymousCode} بنجاح! سيتولى الوسيط المعتمد دراسة الطلب وبدء إجراءات التنسيق الفوري.`);
            }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card py-20 text-center text-sm text-[rgba(255,255,255,0.5)]">
          لم يتم العثور على أي كفاءة جامعية مطابقة لمعايير البحث المحددة.
        </div>
      )}

    </div>
  );
}
