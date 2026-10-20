'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import AnonymizedTalentCard from '@/components/shared/AnonymizedTalentCard';
import { formatAcademicLevel } from '@/lib/privacy-shield';

export default function TalentCatalogPage() {
  const { students, language, t } = useStore();
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
          <span>{t('catalogHeroBadge')}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white">
          {t('catalogHeroTitle')}
        </h1>
        <p className="text-base sm:text-lg text-[rgba(255,255,255,0.7)] leading-relaxed">
          {t('catalogHeroSubtitle')}
        </p>
      </div>

      {/* Filter Toolbar (Glass Pill Bar) */}
      <div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('catalogSearchPlaceholder')}
            className="w-full rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-5 py-2.5 text-sm text-white placeholder:text-[rgba(255,255,255,0.4)] focus:outline-none focus:border-[#A77BF3]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="text-sm text-[rgba(255,255,255,0.6)] font-semibold">
            <span>{t('catalogFilterLabel')}</span>
          </div>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[#07070C] px-5 py-2.5 text-sm text-white focus:outline-none focus:border-[#A77BF3] cursor-pointer"
          >
            <option value="ALL">{t('catalogAllLevels')}</option>
            <option value="LICENCE_3">{formatAcademicLevel('LICENCE_3', language)}</option>
            <option value="MASTER_1">{formatAcademicLevel('MASTER_1', language)}</option>
            <option value="MASTER_2">{formatAcademicLevel('MASTER_2', language)}</option>
            <option value="ENGINEERING_CYCLE">{formatAcademicLevel('ENGINEERING_CYCLE', language)}</option>
          </select>

          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[#07070C] px-5 py-2.5 text-sm text-white focus:outline-none focus:border-[#A77BF3] cursor-pointer"
          >
            <option value="ALL">{t('catalogAllSkills')}</option>
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
              alert(`${s.anonymousCode}: ${t('catalogMatchSuccess')}`);
            }}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-card py-20 text-center text-sm text-[rgba(255,255,255,0.5)]">
          {t('catalogNoResults')}
        </div>
      )}

    </div>
  );
}
