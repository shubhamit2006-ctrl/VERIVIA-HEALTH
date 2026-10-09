import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  HeartPulse,
  Info,
  Quote,
  ArrowRight,
  CheckCircle2,
  Globe2,
  TrendingDown,
  Sparkles,
  Plane,
  Home as HomeIcon,
} from 'lucide-react';

interface CostRange {
  min: number;
  max: number;
}

interface ProcedureCostRow {
  id: string;
  procedure: string;
  shortDescription: string;
  savingsVsUSA: string;
  savingsVsUK: string;
  india: CostRange;
  thailand: CostRange;
  turkey: CostRange;
  malaysia: CostRange;
  uae: CostRange;
  usa: CostRange;
  ukPrivate: CostRange;
}

const HEART_SURGERY_COST_DATA: ProcedureCostRow[] = [
  {
    id: 'cabg',
    procedure: 'Coronary Artery Bypass Graft (CABG)',
    shortDescription: 'Multi-vessel bypass on or off-pump beating heart surgery with full ICU & post-op care',
    savingsVsUSA: 'Up to 88% lower',
    savingsVsUK: 'Up to 75% lower',
    india: { min: 5000, max: 10000 },
    thailand: { min: 12000, max: 18000 },
    turkey: { min: 9000, max: 15000 },
    malaysia: { min: 10000, max: 16000 },
    uae: { min: 25000, max: 45000 },
    usa: { min: 80000, max: 150000 },
    ukPrivate: { min: 35000, max: 65000 },
  },
  {
    id: 'valve',
    procedure: 'Aortic / Mitral Valve Replacement',
    shortDescription: 'Mechanical or bioprosthetic valve replacement or repair with cardiac rehabilitation',
    savingsVsUSA: 'Up to 87% lower',
    savingsVsUK: 'Up to 73% lower',
    india: { min: 6000, max: 12000 },
    thailand: { min: 14000, max: 20000 },
    turkey: { min: 10000, max: 16000 },
    malaysia: { min: 11000, max: 18000 },
    uae: { min: 28000, max: 50000 },
    usa: { min: 90000, max: 160000 },
    ukPrivate: { min: 40000, max: 75000 },
  },
  {
    id: 'angioplasty',
    procedure: 'Angioplasty (Single Stent)',
    shortDescription: 'Percutaneous coronary intervention (PCI) with premium drug-eluting stent (DES)',
    savingsVsUSA: 'Up to 89% lower',
    savingsVsUK: 'Up to 75% lower',
    india: { min: 2500, max: 5000 },
    thailand: { min: 6000, max: 10000 },
    turkey: { min: 5000, max: 9000 },
    malaysia: { min: 5500, max: 9000 },
    uae: { min: 12000, max: 22000 },
    usa: { min: 30000, max: 60000 },
    ukPrivate: { min: 15000, max: 28000 },
  },
  {
    id: 'tar',
    procedure: 'Total Arterial Revascularisation',
    shortDescription: 'Advanced all-arterial conduit CABG using bilateral internal mammary arteries (BIMA)',
    savingsVsUSA: 'Up to 89% lower',
    savingsVsUK: 'Up to 76% lower',
    india: { min: 7000, max: 14000 },
    thailand: { min: 16000, max: 24000 },
    turkey: { min: 12000, max: 18000 },
    malaysia: { min: 13000, max: 20000 },
    uae: { min: 30000, max: 55000 },
    usa: { min: 100000, max: 180000 },
    ukPrivate: { min: 45000, max: 80000 },
  },
];

interface HeartSurgeryCostComparisonProps {
  openEnquiryModal: (params?: { treatment?: string; hospital?: string; doctor?: string }) => void;
}

export const HeartSurgeryCostComparison: React.FC<HeartSurgeryCostComparisonProps> = ({ openEnquiryModal }) => {
  const { formatPrice, selectedCurrency } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const renderRange = (range: CostRange) => {
    return `${formatPrice(range.min)} – ${formatPrice(range.max)}`;
  };

  const displayedProcedures =
    activeFilter === 'all'
      ? HEART_SURGERY_COST_DATA
      : HEART_SURGERY_COST_DATA.filter((p) => p.id === activeFilter);

  return (
    <section className="py-20 bg-gradient-to-b from-[#F5FAFD] via-white to-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 border border-sky-200 text-xs font-semibold text-[#0B5A91]">
            <HeartPulse className="w-4 h-4 text-[#2F80C9]" />
            <span>International Healthcare Benchmark</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Poppins'] tracking-tight">
            Cost Comparison: Heart Surgery Abroad vs Home
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The figures below represent indicative clinical ranges compiled from current 2026 international healthcare benchmarks. Every patient’s medical circumstance is unique, and your formal written hospital quote will be tailored specifically to your diagnostic scans, medical condition, and chosen surgical team.
          </p>

          <div className="inline-flex items-center space-x-2 text-xs font-medium text-slate-600 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-2xs">
            <Globe2 className="w-3.5 h-3.5 text-[#2F80C9]" />
            <span>
              Displaying live figures in <strong className="text-[#0B5A91]">{selectedCurrency}</strong> (updates instantly from top currency switcher)
            </span>
          </div>
        </div>

        {/* Procedure Tabs Filter - Fast Navigation Without Panning */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#0B5A91] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            All 4 Procedures
          </button>
          {HEART_SURGERY_COST_DATA.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveFilter(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeFilter === p.id
                  ? 'bg-[#0B5A91] text-white shadow-md font-semibold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {p.id === 'cabg'
                ? 'Bypass (CABG)'
                : p.id === 'valve'
                ? 'Valve Replacement'
                : p.id === 'angioplasty'
                ? 'Angioplasty'
                : 'Total Arterial'}
            </button>
          ))}
        </div>

        {/* Procedure Cards Grid - 100% Responsive, Zero Horizontal Scrolling */}
        <div className="space-y-6">
          {displayedProcedures.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-slate-50 via-white to-sky-50/40 p-5 sm:p-6 border-b border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-sky-100 text-[#0B5A91]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2F80C9]" />
                        <span>Cardiac Surgery</span>
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Poppins']">
                        {row.procedure}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
                      {row.shortDescription}
                    </p>
                  </div>

                  {/* Highlight Badges & Quote Action */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{row.savingsVsUSA} in India</span>
                    </div>

                    <button
                      onClick={() => openEnquiryModal({ treatment: row.procedure })}
                      className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-[#0B5A91] hover:bg-[#2F80C9] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Request Quote</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Comparative Cost Layout: Abroad vs Home (No Horizontal Scroll) */}
              <div className="p-5 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Group 1: Medical Travel Destinations Abroad (7 Cols on LG) */}
                  <div className="lg:col-span-8 flex flex-col justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0B5A91] mb-3">
                      <Plane className="w-3.5 h-3.5 text-[#2F80C9]" />
                      <span>Medical Travel Hubs Abroad (Accredited JCI / NABH Hospitals)</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {/* India (Premier Highlight) */}
                      <div className="relative col-span-2 sm:col-span-1 md:col-span-1 bg-gradient-to-b from-sky-50/90 to-sky-50/40 border-2 border-[#2F80C9] rounded-xl p-3.5 text-center flex flex-col justify-between shadow-xs">
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#0B5A91] text-white text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full tracking-wider shadow-2xs whitespace-nowrap">
                          Best Value
                        </div>
                        <div className="pt-1">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">India</div>
                          <div className="text-[10px] text-sky-700 font-medium">JCI Accredited</div>
                        </div>
                        <div className="my-2 py-1 px-1.5 bg-white rounded-lg border border-sky-200">
                          <div className="text-xs sm:text-sm font-extrabold text-[#0B5A91] leading-tight">
                            {renderRange(row.india)}
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 py-0.5 px-1.5 rounded-md">
                          80–90% Savings
                        </span>
                      </div>

                      {/* Thailand */}
                      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-center flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <div>
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">Thailand</div>
                          <div className="text-[10px] text-slate-400">Bangkok Hubs</div>
                        </div>
                        <div className="my-2 text-xs sm:text-sm font-bold text-slate-700 leading-tight">
                          {renderRange(row.thailand)}
                        </div>
                        <span className="text-[10px] text-slate-500">Hospital package</span>
                      </div>

                      {/* Turkey */}
                      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-center flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <div>
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">Turkey</div>
                          <div className="text-[10px] text-slate-400">Istanbul Clinics</div>
                        </div>
                        <div className="my-2 text-xs sm:text-sm font-bold text-slate-700 leading-tight">
                          {renderRange(row.turkey)}
                        </div>
                        <span className="text-[10px] text-slate-500">Hospital package</span>
                      </div>

                      {/* Malaysia */}
                      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-center flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <div>
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">Malaysia</div>
                          <div className="text-[10px] text-slate-400">Kuala Lumpur</div>
                        </div>
                        <div className="my-2 text-xs sm:text-sm font-bold text-slate-700 leading-tight">
                          {renderRange(row.malaysia)}
                        </div>
                        <span className="text-[10px] text-slate-500">Hospital package</span>
                      </div>

                      {/* UAE */}
                      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-center flex flex-col justify-between hover:border-slate-300 transition-colors">
                        <div>
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">UAE</div>
                          <div className="text-[10px] text-slate-400">Dubai / Abu Dhabi</div>
                        </div>
                        <div className="my-2 text-xs sm:text-sm font-bold text-slate-700 leading-tight">
                          {renderRange(row.uae)}
                        </div>
                        <span className="text-[10px] text-slate-500">Hospital package</span>
                      </div>
                    </div>
                  </div>

                  {/* Group 2: At Home Domestic Benchmarks (4 Cols on LG) */}
                  <div className="lg:col-span-4 bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                      <HomeIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>At Home (Domestic Private Benchmarks)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {/* UK (Private) */}
                      <div className="bg-white border border-slate-200 rounded-xl p-3 text-center flex flex-col justify-between shadow-2xs">
                        <div>
                          <span className="text-[9px] uppercase font-semibold text-slate-500 tracking-wider block mb-0.5">
                            UK Self-Pay
                          </span>
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">UK (Private)</div>
                        </div>
                        <div className="my-2 text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                          {renderRange(row.ukPrivate)}
                        </div>
                        <span className="text-[10px] text-slate-500">Excludes rehab</span>
                      </div>

                      {/* USA Benchmark */}
                      <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-3 text-center flex flex-col justify-between shadow-2xs">
                        <div>
                          <span className="text-[9px] uppercase font-semibold text-rose-600 tracking-wider block mb-0.5">
                            US Standard
                          </span>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">USA</div>
                        </div>
                        <div className="my-2 text-xs sm:text-sm font-bold text-rose-700 leading-tight">
                          {renderRange(row.usa)}
                        </div>
                        <span className="text-[10px] text-rose-600/80 font-medium">Without insurance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scope and Transparency Footnote */}
        <div className="mt-8 bg-white px-5 py-4 rounded-xl border border-slate-200 flex items-start space-x-3 text-xs text-slate-500 shadow-2xs">
          <Info className="w-4 h-4 text-[#2F80C9] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="leading-relaxed">
              <strong className="text-slate-700">What is included:</strong> Indicative international prices are comprehensive all-inclusive hospital packages covering surgeon fees, surgical consumables, anaesthesia, dedicated ICU recovery, nursing care, and standard post-operative inpatient room stay.
            </p>
            <p className="leading-relaxed text-slate-400">
              International flight tickets, extended hotel accommodation during the post-discharge stabilization window, and personal incidental expenses are budgeted separately.
            </p>
          </div>
        </div>

        {/* Emotionally Resonant Perspective Card */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#0B5A91] via-[#1A6BA8] to-[#2F80C9] p-7 sm:p-9 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 opacity-10 pointer-events-none">
            <Quote className="w-40 h-40 text-white" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-sky-200 text-xs uppercase tracking-widest font-bold">
                <Quote className="w-4 h-4" />
                <span>Perspective on Critical Care</span>
              </div>
              <blockquote className="text-base sm:text-xl font-medium leading-relaxed font-['Poppins'] italic text-sky-50">
                “The essential question is never whether you can afford to journey abroad for life-saving heart surgery. The real question is whether you can afford not to — when the alternative at home is an insurmountable financial burden or waiting months in critical uncertainty.”
              </blockquote>
            </div>

            <button
              onClick={() => openEnquiryModal({ treatment: 'Cardiac Sciences' })}
              className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-[#0B5A91] hover:bg-sky-50 font-bold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer flex items-center space-x-2"
            >
              <span>Get a Cardiac Treatment Quote</span>
              <ArrowRight className="w-4 h-4 text-[#2F80C9]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
