'use client';

import React, { useState } from 'react';
import { 
  Quote, 
  Clock, 
  Coins, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface VibeStory {
  id: string;
  studentCode: string;
  studentUniversity: string;
  degree: string;
  projectTitle: string;
  category: string;
  promptSnippet: string;
  deliveryTime: string;
  payout: number;
  clientIndustry: string;
  clientQuote: string;
  deliverables: string[];
}

const STORIES: VibeStory[] = [
  {
    id: 'story-1',
    studentCode: 'STU-9402',
    studentUniversity: 'École Polytechnique',
    degree: 'M2 Software Engineering & Distributed Systems',
    projectTitle: 'Real-Time Webhook Alerting & Transaction Event Log',
    category: 'Full-Stack Web Dev',
    promptSnippet: 'We need an audit log table that listens to webhook events, flags failed payloads, and lets engineers trigger replay.',
    deliveryTime: '48 Hours',
    payout: 380,
    clientIndustry: 'Fintech & B2B Payments',
    clientQuote: 'Alex had this deployed on Vercel with clean TypeScript types before our Monday sprint. The Admin concierge made the kickoff seamless.',
    deliverables: ['PostgreSQL Schema & Prisma Migrations', 'Edge API Routes on Next.js', 'Clean Filtered React UI'],
  },
  {
    id: 'story-2',
    studentCode: 'STU-6510',
    studentUniversity: 'University of Oxford',
    degree: 'M2 Data Science & Natural Language Processing',
    projectTitle: 'Automated PubMed Medical Paper Scraper & SQLite Ingestion',
    category: 'Data & Automation',
    promptSnippet: 'Extract 2,500 oncology trial abstracts from PubMed API, parse author affiliations, and store into a clean deduplicated SQLite database.',
    deliveryTime: '3 Days',
    payout: 350,
    clientIndustry: 'HealthTech & Bio-Informatics',
    clientQuote: 'Elena brokered the deal with zero spam. Tariq delivered robust, well-commented Python scripts that our researchers use daily.',
    deliverables: ['Async Python Rate-Limited Scraper', 'Deduplication Pipeline', 'SQLite Database with 2,500 Records'],
  },
  {
    id: 'story-3',
    studentCode: 'STU-8821',
    studentUniversity: 'Sorbonne University & Gobelins',
    degree: 'M1 Human-Computer Interaction',
    projectTitle: 'Figma 2-Step Mobile Checkout Design System & Micro-Interactions',
    category: 'Product Design',
    promptSnippet: 'Redesign our high-dropoff checkout flow for mobile with Apple Pay 1-click and clear delivery step indicators.',
    deliveryTime: '4 Days',
    payout: 320,
    clientIndustry: 'Direct-to-Consumer E-Commerce',
    clientQuote: 'Sophie delivered an interactive Figma prototype that cut our user dropoff by 30% in testing. Direct bank wire off-platform was quick.',
    deliverables: ['Design System Tokens & Variants', 'Interactive Mobile Figma Prototype', 'Handoff Documentation'],
  },
];

export default function VibeStoriesGallery() {
  const [selectedStory, setSelectedStory] = useState<VibeStory>(STORIES[0]);

  return (
    <section className="py-16 border-t border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="badge-glass-violet px-4 py-1.5 text-sm font-semibold mb-3">
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Verified Delivery Case Studies</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
              Real Micro-Tasks Delivered by Top University Talent
            </h2>
            <p className="mt-2 text-base text-[rgba(255,255,255,0.65)]">
              Explore how university students take natural language briefs from founders and ship production-ready assets within days.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {STORIES.map((story) => (
              <button
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  selectedStory.id === story.id
                    ? 'bg-gradient-to-r from-[#A77BF3] to-[#6B4BE8] text-white shadow-[0_0_20px_rgba(167,123,243,0.4)]'
                    : 'bg-white/5 text-[rgba(255,255,255,0.7)] hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {story.studentCode}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Story Spotlight Card */}
        <div className="glass-card p-8 md:p-10 border-[rgba(255,255,255,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Story Details */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  {selectedStory.studentCode}
                </span>
                <span className="badge-glass-neutral text-xs">
                  {selectedStory.category}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-[#3FD0B0]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Delivered in {selectedStory.deliveryTime}</span>
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white">
                {selectedStory.projectTitle}
              </h3>

              <div className="rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-5 space-y-2 text-sm text-[rgba(255,255,255,0.85)] leading-relaxed">
                <span className="font-semibold text-xs text-[rgba(255,255,255,0.5)] uppercase tracking-wider block">
                  Original Client Brief Prompt
                </span>
                <p className="font-mono text-sm">"{selectedStory.promptSnippet}"</p>
              </div>

              {/* Verified Deliverables */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[rgba(255,255,255,0.5)] block mb-3">
                  Shipped Deliverables
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedStory.deliverables.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 rounded-2xl bg-[rgba(255,255,255,0.04)] p-3 border border-[rgba(255,255,255,0.08)] text-xs text-white">
                      <CheckCircle2 className="h-4 w-4 text-[#3FD0B0] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote from Startup Founder */}
              <div className="rounded-2xl border-l-2 border-[#A77BF3] bg-[rgba(167,123,243,0.06)] p-5">
                <div className="flex items-start gap-3">
                  <Quote className="h-5 w-5 text-[#A77BF3] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm italic text-white leading-relaxed">
                      "{selectedStory.clientQuote}"
                    </p>
                    <span className="text-xs text-[rgba(255,255,255,0.5)] mt-2 block">
                      — Client in {selectedStory.clientIndustry}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Student Profile & Payout Card */}
            <div className="lg:col-span-4 space-y-5">
              <div className="rounded-3xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#5B2BE0] to-[#A77BF3] text-white font-mono font-bold text-base shadow-[0_0_20px_rgba(91,43,224,0.4)]">
                    {selectedStory.studentCode.slice(-4)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Student {selectedStory.studentCode}
                    </h4>
                    <p className="text-xs text-[rgba(255,255,255,0.6)] mt-0.5">
                      {selectedStory.studentUniversity}
                    </p>
                    <span className="badge-glass-positive text-[11px] mt-1.5">
                      Verified Academic Proof
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-[rgba(255,255,255,0.08)] text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[rgba(255,255,255,0.6)]">Academic Degree</span>
                    <span className="font-semibold text-white text-right text-xs max-w-[170px] truncate">{selectedStory.degree}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[rgba(255,255,255,0.6)]">Turnaround Time</span>
                    <span className="font-bold text-[#3FD0B0]">{selectedStory.deliveryTime}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[rgba(255,255,255,0.6)]">Disbursed Payout</span>
                    <span className="font-light text-2xl text-[#34D17A]">€{selectedStory.payout}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(255,255,255,0.08)]">
                  <div className="rounded-2xl bg-[rgba(255,255,255,0.04)] p-3 text-xs text-[rgba(255,255,255,0.6)] text-center">
                    Bank wire confirmed by Elena (Middleman)
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
