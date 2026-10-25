import React, { useState } from 'react';
import { X, Check, MapPin, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { storage } from '../services/storage';
import { INDIAN_CITIES } from '../utils/cities';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // Step 1: Sign in with Google
  // Step 2: Minimal Onboarding - Welcome screen (PRD 6.2)
  // Step 3: Minimal Onboarding - Choose Your City (PRD 6.2)
  const [step, setStep] = useState<'login' | 'welcome' | 'city'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [tempUser, setTempUser] = useState<UserProfile | null>(null);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');

  if (!isOpen) return null;

  const handleGoogleSignIn = (emailToUse: string) => {
    setIsSigningIn(true);
    setTimeout(() => {
      const user = storage.loginWithGoogle(emailToUse, selectedCity);
      setTempUser(user);
      setIsSigningIn(false);
      setStep('welcome');
    }, 400);
  };

  const handleCompleteCitySelection = () => {
    if (tempUser) {
      storage.updateUserProfile({ preferred_city: selectedCity });
      onSuccess(tempUser);
    }
    handleClose();
  };

  const handleSkipCity = () => {
    if (tempUser) {
      onSuccess(tempUser);
    }
    handleClose();
  };

  const handleClose = () => {
    setStep('login');
    setEmailInput('');
    setTempUser(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden">
        {/* Step 1: Google Sign In prompt */}
        {step === 'login' && (
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-[#000000] tracking-tight">
                  i<span className="text-[#FF4500]">Talk</span>
                </span>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-left mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-1.5">Sign in to participate</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Browse problems freely without logging in. Sign in with Google when you want to share a problem,
                comment, or upvote.
              </p>
            </div>

            {/* Quick 1-click Google Sign-in buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleGoogleSignIn('shaikmohammedabrar242@gmail.com')}
                disabled={isSigningIn}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-300 shadow-xs flex items-center justify-center gap-3 transition-colors active:scale-[0.99]"
              >
                {/* Google "G" icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue as Mohammed Abrar
              </button>

              <button
                onClick={() => handleGoogleSignIn('indian.citizen.user@gmail.com')}
                disabled={isSigningIn}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                Sign in with another Google account
              </button>
            </div>

            {/* Custom Google Email input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (emailInput.trim()) handleGoogleSignIn(emailInput.trim());
              }}
              className="pt-2 border-t border-slate-100"
            >
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="or type your Google email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-[#FF4500]"
                />
                <button
                  type="submit"
                  disabled={!emailInput.trim() || isSigningIn}
                  className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </form>

            {/* Anonymity Guarantee note */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Your privacy is protected:</strong> We will automatically assign you a unique anonymous
                username. Your real name, photo, and email will NEVER be displayed publicly.
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Minimal Onboarding - Screen 1: Welcome (PRD 6.2) */}
        {step === 'welcome' && tempUser && (
          <div className="p-6 sm:p-8 text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-extrabold text-white mb-4 shadow-md"
                 style={{ backgroundColor: tempUser.avatar_color }}>
              {tempUser.anonymous_username.slice(0, 1)}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Welcome to iTalk</h2>
            <p className="text-sm text-slate-600 mb-4 max-w-xs mx-auto">
              A place to share problems and find people who understand.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-left">
              <div className="text-xs text-slate-500 mb-1 font-medium">Your generated public handle:</div>
              <div className="text-base font-bold text-slate-900 flex items-center justify-between">
                <span>{tempUser.anonymous_username}</span>
                <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                  Anonymous
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                This identity will be shown on your questions and comments instead of your real name.
              </p>
            </div>

            <button
              onClick={() => setStep('city')}
              className="w-full py-3 px-4 bg-[#FF4500] hover:bg-[#e03d00] text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Next: Choose Your City</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 3: Minimal Onboarding - Screen 2: Choose Your City (PRD 6.2) */}
        {step === 'city' && tempUser && (
          <div className="p-6 sm:p-8 animate-in fade-in duration-200">
            <div className="text-left mb-5">
              <div className="flex items-center gap-1.5 text-xs text-[#FF4500] font-bold mb-1">
                <MapPin className="w-3.5 h-3.5" />
                Step 2 of 2
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Choose Your City</h2>
              <p className="text-xs text-slate-600">
                Helps show relevant local civic, consumer, and neighborhood discussions near you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6 max-h-56 overflow-y-auto p-1">
              {INDIAN_CITIES.filter(c => c !== 'All India').slice(0, 10).map((city) => {
                const isSelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`p-2.5 rounded-xl text-left text-xs font-semibold border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#FF4500] bg-[#FF4500]/5 text-[#FF4500]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{city}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FF4500]" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSkipCity}
                className="w-1/3 py-2.5 px-3 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl transition-colors text-center"
              >
                Skip for now
              </button>
              <button
                onClick={handleCompleteCitySelection}
                className="flex-1 py-3 px-4 bg-[#FF4500] hover:bg-[#e03d00] text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
              >
                Set {selectedCity} & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
