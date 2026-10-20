'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  UserCheck, 
  Coins 
} from 'lucide-react';

interface PromptPreset {
  id: string;
  label: string;
  icon: string;
  rawIdea: string;
  category: string;
  targetMajor: string;
  deliverables: string[];
  techStack: string[];
  estDays: number;
  marketBudget: number;
  studentPayout: number;
  matchedTalent: {
    code: string;
    university: string;
    matchScore: number;
  };
}

const PRESETS: PromptPreset[] = [
  {
    id: 'analytics',
    label: 'Next.js Analytics Dashboard',
    icon: 'DEV',
    rawIdea: 'I need a fast customer analytics dashboard with real-time KPI cards and CSV export for our fintech app.',
    category: 'Web Development',
    targetMajor: 'Computer Science & Distributed Systems',
    deliverables: ['Responsive Dashboard in Next.js', '4 KPI Metrics with Trend Charts', 'Filtered Table with Instant CSV Export'],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    estDays: 6,
    marketBudget: 380,
    studentPayout: 300,
    matchedTalent: {
      code: 'STU-9402',
      university: 'École Polytechnique',
      matchScore: 98,
    },
  },
  {
    id: 'scraper',
    label: 'Python Data Extraction Script',
    icon: 'DATA',
    rawIdea: 'Extract and clean 2,500 oncology research paper abstracts from PubMed with author affiliations into SQLite.',
    category: 'Data & Automation',
    targetMajor: 'Data Science & Machine Learning',
    deliverables: ['Async Python Scraper with Rate Limiting', 'Deduplication Pipeline', 'Clean SQLite Database + Schema'],
    techStack: ['Python', 'Pandas', 'BeautifulSoup', 'SQLite'],
    estDays: 4,
    marketBudget: 350,
    studentPayout: 275,
    matchedTalent: {
      code: 'STU-6510',
      university: 'University of Oxford',
      matchScore: 95,
    },
  },
  {
    id: 'figma',
    label: 'Figma Mobile Checkout Flow',
    icon: 'UI',
    rawIdea: 'Our checkout has high drop-off. Need a frictionless 2-step mobile checkout in Figma with Apple Pay micro-interactions.',
    category: 'UI/UX Design',
    targetMajor: 'Human-Computer Interaction',
    deliverables: ['Componentized Mobile Design System', '2-Step Checkout Flow Prototype', 'Interactive Handoff Specs'],
    techStack: ['Figma', 'Prototyping', 'Design Systems', 'Micro-Interactions'],
    estDays: 5,
    marketBudget: 320,
    studentPayout: 250,
    matchedTalent: {
      code: 'STU-8821',
      university: 'Sorbonne University & Gobelins',
      matchScore: 94,
    },
  },
];

export default function VibeStudioInteractive() {
  const [selectedPreset, setSelectedPreset] = useState<PromptPreset>(PRESETS[0]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const handleSelectPreset = (preset: PromptPreset) => {
    setSelectedPreset(preset);
    setActiveStep(1);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveStep(1);
    
    setTimeout(() => setActiveStep(2), 500);
    setTimeout(() => setActiveStep(3), 1100);
    setTimeout(() => {
      setActiveStep(4);
      setIsSimulating(false);
    }, 1700);
  };

  return (
    <section className="py-16 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="badge-glass-violet px-4 py-1.5 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>AI-Assisted Vibe Product Building</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            Think It. Build It. From Raw Idea to Brokered Delivery.
          </h2>
          <p className="text-base sm:text-lg text-[rgba(255,255,255,0.7)] leading-relaxed">
            See how natural language descriptions are transformed into verified micro-task specifications, matched with top university talent, and brokered with zero escrow fees.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#A77BF3] to-[#6B4BE8] text-white shadow-[0_0_20px_rgba(167,123,243,0.5)]'
                    : 'bg-white/5 text-[rgba(255,255,255,0.7)] hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Studio Board */}
        <div className="glass-card p-8 md:p-10 border-[rgba(255,255,255,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Raw Prompt & Vibe Engine */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)]">
                    Step 1 • Founder Natural Language Brief
                  </span>
                  <span className="font-mono text-xs text-white bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                    natural_brief.txt
                  </span>
                </div>
                
                <div className="rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] p-5 font-mono text-sm text-[rgba(255,255,255,0.9)] leading-relaxed min-h-[100px]">
                  "{selectedPreset.rawIdea}"
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="w-full h-12 btn-glass-gradient text-base font-semibold gap-2.5 shadow-[0_0_24px_rgba(127,90,240,0.4)]"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>{isSimulating ? 'Calibrating Vibe Pipeline...' : 'Run Vibe Pipeline Simulator'}</span>
                </button>
                <p className="text-xs text-center text-[rgba(255,255,255,0.5)]">
                  Simulates live admin parsing, privacy shielding, and Top 5 matching.
                </p>
              </div>

              {/* Progress Milestones */}
              <div className="pt-6 border-t border-[rgba(255,255,255,0.08)] space-y-3 text-sm">
                <div className={`flex items-center gap-3 ${activeStep >= 1 ? 'text-white font-medium' : 'text-[rgba(255,255,255,0.4)]'}`}>
                  <CheckCircle2 className={`h-4 w-4 ${activeStep >= 1 ? 'text-[#3FD0B0]' : 'text-[rgba(255,255,255,0.2)]'}`} />
                  <span>1. Natural language parsed into structured brief</span>
                </div>
                <div className={`flex items-center gap-3 ${activeStep >= 2 ? 'text-white font-medium' : 'text-[rgba(255,255,255,0.4)]'}`}>
                  <CheckCircle2 className={`h-4 w-4 ${activeStep >= 2 ? 'text-[#3FD0B0]' : 'text-[rgba(255,255,255,0.2)]'}`} />
                  <span>2. Privacy Shield applied (PII masked, zero leak)</span>
                </div>
                <div className={`flex items-center gap-3 ${activeStep >= 3 ? 'text-white font-medium' : 'text-[rgba(255,255,255,0.4)]'}`}>
                  <CheckCircle2 className={`h-4 w-4 ${activeStep >= 3 ? 'text-[#3FD0B0]' : 'text-[rgba(255,255,255,0.2)]'}`} />
                  <span>3. Algorithmic Top 5 match (Skill + Academic fit)</span>
                </div>
                <div className={`flex items-center gap-3 ${activeStep >= 4 ? 'text-white font-medium' : 'text-[rgba(255,255,255,0.4)]'}`}>
                  <CheckCircle2 className={`h-4 w-4 ${activeStep >= 4 ? 'text-[#3FD0B0]' : 'text-[rgba(255,255,255,0.2)]'}`} />
                  <span>4. Off-platform wire milestone in Spread Ledger</span>
                </div>
              </div>
            </div>

            {/* Right: Output Artifact View */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6 space-y-6">
                
                {/* Header Output */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[rgba(255,255,255,0.08)]">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                        {selectedPreset.category}
                      </span>
                      <span className="badge-glass-positive text-xs">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Shield Verified</span>
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mt-2">
                      {selectedPreset.label}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-2xl font-light text-white">
                      €{selectedPreset.marketBudget}
                    </span>
                    <p className="text-xs text-[rgba(255,255,255,0.6)] mt-0.5">
                      Student Net: <strong className="text-[#34D17A]">€{selectedPreset.studentPayout}</strong>
                    </p>
                  </div>
                </div>

                {/* Deliverables List */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)] block mb-3">
                    Calibrated Deliverables Criteria
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedPreset.deliverables.map((deliv, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 rounded-2xl bg-[rgba(255,255,255,0.04)] p-3 border border-[rgba(255,255,255,0.08)] text-xs text-white">
                        <CheckCircle2 className="h-4 w-4 text-[#3FD0B0] shrink-0" />
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Pills */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)] block mb-3">
                    Verified Tech Stack Requirements
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedPreset.techStack.map((tech) => (
                      <span key={tech} className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-mono font-medium text-white">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Matched Talent Preview */}
                <div className="rounded-2xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5B2BE0] to-[#A77BF3] text-white font-mono font-bold text-sm shadow-[0_0_16px_rgba(91,43,224,0.4)]">
                      {selectedPreset.matchedTalent.code.slice(-4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-sm font-bold text-white">
                          {selectedPreset.matchedTalent.code}
                        </span>
                        <span className="badge-glass-positive text-xs">
                          {selectedPreset.matchedTalent.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-[rgba(255,255,255,0.65)] mt-1">
                        {selectedPreset.matchedTalent.university} • {selectedPreset.targetMajor}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[rgba(255,255,255,0.7)]">
                    <Coins className="h-4 w-4 text-[#34D17A]" />
                    <span>Direct Wire via Elena</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
