import React, { useState } from 'react';
import { X, Search, MapPin, Check, Plus } from 'lucide-react';
import { INDIAN_CITIES } from '../utils/cities';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customCity, setCustomCity] = useState('');

  if (!isOpen) return null;

  const filteredCities = INDIAN_CITIES.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  const handleSelect = (city: string) => {
    onSelectCity(city);
    onClose();
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim()) {
      handleSelect(customCity.trim());
      setCustomCity('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E5E5]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FF4500]" />
            <h3 className="font-bold text-slate-900 text-lg">Select Your City</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#E5E5E5] bg-[#F6F6F6]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Indian cities (e.g., Bengaluru, Anantapur)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500]"
              autoFocus
            />
          </div>
        </div>

        {/* City list */}
        <div className="overflow-y-auto p-3 divide-y divide-slate-100 flex-1">
          {filteredCities.map((city) => {
            const isSelected = selectedCity === city;
            return (
              <button
                key={city}
                onClick={() => handleSelect(city)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left text-sm transition-colors ${
                  isSelected
                    ? 'bg-[#FF4500]/10 text-[#FF4500] font-semibold'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#FF4500]' : 'text-slate-400'}`} />
                  <span>{city}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#FF4500]" />}
              </button>
            );
          })}

          {filteredCities.length === 0 && (
            <div className="py-6 text-center text-slate-500 text-sm">
              <p>No listed city matching "{searchTerm}"</p>
              <p className="text-xs text-slate-400 mt-1">You can add it below as a custom location</p>
            </div>
          )}
        </div>

        {/* Custom City Input */}
        <div className="p-4 border-t border-[#E5E5E5] bg-white">
          <form onSubmit={handleCustomCitySubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Or enter other Indian town/district"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#FF4500]"
            />
            <button
              type="submit"
              disabled={!customCity.trim()}
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
