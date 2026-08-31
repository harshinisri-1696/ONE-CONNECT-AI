import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Globe, Check, ChevronDown, Sparkles, X } from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../data/translations';

interface LanguageSelectorProps {
  variant?: 'ribbon' | 'header' | 'modal' | 'mobile';
  onClose?: () => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'ribbon', onClose }) => {
  const { language, setLanguage, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
    if (onClose) onClose();
  };

  // 1. Ribbon variant: subtle, dark background friendly
  if (variant === 'ribbon') {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700 cursor-pointer"
          title="Change language / भाषा बदलें"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold">{currentLang.nativeScript}</span>
          <span className="text-[10px] text-slate-400 uppercase">({currentLang.code})</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                {t('lang.select', 'Select Language / भाषा')}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                12 Indian Languages
              </span>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 py-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between text-xs transition-colors hover:bg-indigo-50/80 ${
                      isSelected ? 'bg-indigo-50 font-bold text-indigo-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">{lang.nativeScript}</span>
                      <span className="text-[11px] text-slate-500">{lang.englishName}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Header variant: styled for the main navigation bar
  if (variant === 'header') {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
        >
          <Globe className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-900">{currentLang.nativeScript}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50">
            <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-indigo-600" />
                {t('lang.select', 'Select Language')}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">
                12 Languages
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto p-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`text-left p-2 rounded-xl transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-indigo-50 text-slate-800 border-slate-200/80 hover:border-indigo-200'
                    }`}
                  >
                    <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {lang.nativeScript}
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                      {lang.englishName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Modal / Grid variant
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t('lang.select', 'Choose Your Language')}
              </h2>
              <p className="text-xs text-slate-500">
                Access all central & state schemes in your preferred mother tongue
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-3.5 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-1 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-600/30'
                    : 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {lang.nativeScript}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                </div>
                <span className={`text-xs ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {lang.englishName}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
