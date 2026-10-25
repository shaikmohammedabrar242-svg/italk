import React from 'react';
import { ShieldCheck, HelpCircle, Flame, ExternalLink, Sparkles, MapPin } from 'lucide-react';
import { INDIAN_CITIES } from '../utils/cities';

interface RightSidebarProps {
  onSelectCity: (city: string) => void;
  selectedCity: string;
  onOpenCitySelector: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onSelectCity,
  selectedCity,
  onOpenCitySelector
}) => {
  return (
    <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-4">
      {/* Brand Promise Card */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2 text-[#FF4500]">
          <span className="text-lg font-black tracking-tight text-slate-900">
            i<span className="text-[#FF4500]">Talk</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-orange-50 text-[#FF4500] rounded-md">
            India Community
          </span>
        </div>
        <p className="text-sm font-bold text-slate-900 leading-snug">
          "Every problem deserves a voice."
        </p>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Speak freely. Find your people. Solve everyday civic, financial, and consumer challenges together.
        </p>
      </div>

      {/* Useful Indian Helplines & Escalation Portals */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-[#FF4500]" />
          <span>Quick Public Helplines</span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-2.5 bg-[#F6F6F6] rounded-xl">
            <div className="font-semibold text-slate-900 flex justify-between items-center">
              <span>National Consumer Helpline</span>
              <span className="text-[#FF4500] font-bold">1915</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">E-commerce refunds, defective electronics & services</p>
          </div>

          <div className="p-2.5 bg-[#F6F6F6] rounded-xl">
            <div className="font-semibold text-slate-900 flex justify-between items-center">
              <span>RBI Banking Ombudsman</span>
              <span className="text-emerald-700 font-bold">cms.rbi.org.in</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Failed UPI debits, ATM timeout, credit card overcharges</p>
          </div>

          <div className="p-2.5 bg-[#F6F6F6] rounded-xl">
            <div className="font-semibold text-slate-900 flex justify-between items-center">
              <span>Cyber Crime Grievance</span>
              <span className="text-indigo-600 font-bold">1930</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Financial fraud, OTP scams, WhatsApp blackmail</p>
          </div>
        </div>
      </div>

      {/* Explore Other Cities */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#FF4500]" />
            <span>Popular Cities</span>
          </div>
          <button
            onClick={onOpenCitySelector}
            className="text-[11px] font-semibold text-[#FF4500] hover:underline"
          >
            All Cities
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['Bengaluru', 'Mumbai', 'Delhi-NCR', 'Hyderabad', 'Chennai', 'Pune', 'Anantapur'].map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => onSelectCity(city)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-[#FF4500] text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Community Principles */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
        <div className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Anonymous by Default</span>
        </div>
        Your personal email or phone is never published. Speak freely, stay respectful, and help fellow Indians solve real issues.
      </div>
    </aside>
  );
};
