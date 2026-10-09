import React from 'react';
import { useApp } from '../context/AppContext';
import { INITIAL_JOURNEY_STEPS } from '../initialData';
import {
  FileText,
  Stethoscope,
  FileSpreadsheet,
  Plane,
  Car,
  Activity,
  Home,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  Building,
  UserCheck
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  FileText,
  Stethoscope,
  FileSpreadsheet,
  Plane,
  Car,
  Activity,
  Home,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  Building,
  UserCheck
};

interface JourneyPageProps {
  openEnquiryModal: () => void;
}

export const JourneyPage: React.FC<JourneyPageProps> = ({ openEnquiryModal }) => {
  const { journeySteps } = useApp();
  const stepsToDisplay = journeySteps && journeySteps.length > 0 ? journeySteps : INITIAL_JOURNEY_STEPS;
  return (
    <div className="min-h-screen bg-[#F5FAFD] py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Structured Concierge Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Poppins']">
            The International Patient Journey
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every step of your medical journey to India is planned with clinical rigour, administrative coordination, and personal care.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative border-l-2 border-sky-200 ml-4 sm:ml-8 space-y-10 py-4">
          {stepsToDisplay.map((step, idx) => {
            const Icon = ICON_MAP[step.icon] || Activity;
            return (
              <div key={idx} className="relative pl-8 sm:pl-12 group">
                {/* Dot / Icon */}
                <div className="absolute -left-5 top-0 w-10 h-10 rounded-full bg-white border-2 border-[#2F80C9] text-[#0B5A91] group-hover:bg-[#2F80C9] group-hover:text-white transition-colors flex items-center justify-center shadow-md">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="bg-white p-6 rounded-2xl subtle-card-shadow border border-slate-100 hover:border-sky-200 transition-all space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0B5A91] bg-sky-50 px-2.5 py-0.5 rounded-full uppercase">
                      Stage 0{step.stepNumber}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-['Poppins']">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="bg-gradient-to-r from-[#0B5A91] to-[#2F80C9] text-white p-8 sm:p-10 rounded-3xl text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-bold font-['Poppins']">
            Ready to Begin Step 1?
          </h3>
          <p className="text-sm text-sky-100 max-w-md mx-auto">
            Submit your clinical details for preliminary specialist evaluation. No upfront payment or obligation required.
          </p>
          <div className="pt-2">
            <button
              onClick={openEnquiryModal}
              className="px-8 py-3.5 rounded-xl bg-white text-[#0B5A91] font-bold text-sm shadow-md hover:bg-sky-50 cursor-pointer"
            >
              Start Free Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
