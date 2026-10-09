import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { faqs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFaq, setActiveFaq] = useState<string | null>(faqs[0]?.id || null);

  const publishedFaqs = faqs.filter(f => f.published);

  const filteredFaqs = publishedFaqs.filter(
    f =>
      f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5FAFD] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-[#2F80C9] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Patient Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Poppins']">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Essential guidelines regarding Indian medical visas, hospital admissions, financial transparency, language support, and post-discharge journey planning.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search FAQs (e.g. visa, payment, doctors, language)..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-200 bg-white subtle-card-shadow focus:outline-hidden focus:ring-2 focus:ring-[#2F80C9]"
          />
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filteredFaqs.map(faq => {
            const isOpen = activeFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="text-base font-semibold text-slate-800 font-['Poppins']">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-[#2F80C9]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 bg-slate-50/50 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
