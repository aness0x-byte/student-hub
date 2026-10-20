'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import AnonymizedTalentCard from '@/components/shared/AnonymizedTalentCard';
import { formatAcademicLevel } from '@/lib/privacy-shield';
import { Search } from 'lucide-react';

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
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-2">
        <span className="pill-badge-black">
          {t('catalogHeroBadge')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
          {t('catalogHeroTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5A5A] leading-relaxed">
          {t('catalogHeroSubtitle')}
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-[24px] p-4 border border-black/5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('catalogSearchPlaceholder')}
            className="w-full rounded-full bg-[#EDEDED] text-xs px-5 py-2.5 text-[#1A1A1A] placeholder:text-[#8C8C8C] border-none focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs text-[#5A5A5A] font-medium">
            {t('catalogFilterLabel')}
          </span>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="rounded-full bg-[#EDEDED] text-xs px-4 py-2 text-[#1A1A1A] border-none focus:outline-none cursor-pointer"
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
            className="rounded-full bg-[#EDEDED] text-xs px-4 py-2 text-[#1A1A1A] border-none focus:outline-none cursor-pointer"
          >
            <option value="ALL">{t('catalogAllSkills')}</option>
            {allSkills.map((sk) => (
              <option key={sk} value={sk}>{sk}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
        <div className="bg-white rounded-[24px] p-12 text-center text-xs text-[#8C8C8C] border border-black/5">
          {t('catalogNoResults')}
        </div>
      )}

    </div>
  );
}
