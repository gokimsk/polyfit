'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SITUATIONS, SituationId } from '@/types';
import { situationsToUrlParam } from '@/lib/utils';

const situationConfigs = {
  'independence': {
    gradient: 'from-blue-600 via-blue-500 to-blue-400',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  'job-seeking': {
    gradient: 'from-sky-500 via-sky-400 to-cyan-400',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200'
  },
  'after-resignation': {
    gradient: 'from-cyan-600 via-cyan-500 to-teal-400',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200'
  },
  'childcare-prep': {
    gradient: 'from-blue-500 via-indigo-400 to-purple-400',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  'tax-settlement': {
    gradient: 'from-indigo-600 via-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200'
  },
  'marriage-prep': {
    gradient: 'from-blue-700 via-blue-600 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  }
};

export default function HomePage() {
  const [selectedSituations, setSelectedSituations] = useState<SituationId[]>([]);
  const router = useRouter();

  const handleSituationClick = (situationId: SituationId) => {
    setSelectedSituations(prev => {
      const isSelected = prev.includes(situationId);
      
      if (isSelected) {
        return prev.filter(id => id !== situationId);
      } else {
        if (prev.length >= 3) {
          return prev;
        }
        return [...prev, situationId];
      }
    });
  };

  const handleFindPolicies = () => {
    if (selectedSituations.length === 0) return;
    
    const situationsParam = situationsToUrlParam(selectedSituations);
    router.push(`/policies?situations=${situationsParam}`);
  };

  const getButtonText = () => {
    const count = selectedSituations.length;
    if (count === 0) return '상황을 선택해주세요';
    if (count === 1) return '선택한 상황으로 정책 찾기';
    return `${count}개 상황으로 정책 찾기`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-4 pb-24">
        {/* Compact Header */}
        <div className="flex justify-between items-center pt-4 pb-2">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-blue-100">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-600 font-medium">PolyFit</span>
          </div>
          
          <button className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 px-3 py-1.5 h-8 rounded-lg">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs">신청현황</span>
          </button>
        </div>

        {/* Compact Hero Section */}
        <div className="text-center mb-6 pt-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
            요즘 이런 상황이신가요?
          </h1>
          <p className="text-sm text-slate-600 mb-1">
            나에게 딱 맞는 정책을 찾아드려요 (최대 3개 선택)
          </p>
        </div>

        {/* Responsive Grid: Mobile 2x3, Desktop 3x2 */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 mb-6">
          {Object.values(SITUATIONS).map((situation, index) => {
            const isSelected = selectedSituations.includes(situation.id);
            const isDisabled = !isSelected && selectedSituations.length >= 3;
            const config = situationConfigs[situation.id];
            
            return (
              <div
                key={situation.id}
                className="relative"
              >
                <div
                  className={`
                    relative p-4 lg:p-6 rounded-xl cursor-pointer transition-all duration-300 
                    h-32 md:h-36 lg:h-40 overflow-hidden group
                    ${isSelected 
                      ? `bg-gradient-to-br ${config.gradient} text-white shadow-lg border-2 border-transparent` 
                      : `bg-white hover:shadow-md border-2 ${config.borderColor} hover:border-blue-300`
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onClick={() => !isDisabled && handleSituationClick(situation.id)}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                  
                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <h3 className={`text-lg md:text-xl lg:text-2xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {situation.title}
                    </h3>
                    <p className={`text-xs md:text-sm lg:text-base leading-relaxed flex-1 ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                      {situation.description}
                    </p>
                    
                    {/* Hover Effect Arrow */}
                    <div className={`mt-2 transform transition-transform duration-300 ${isSelected ? 'translate-x-0' : 'translate-x-[-8px] group-hover:translate-x-0'}`}>
                      <svg className={`w-4 h-4 ${isSelected ? 'text-blue-100' : 'text-blue-500 opacity-0 group-hover:opacity-100'} transition-opacity duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="mt-4">
          <button
            onClick={handleFindPolicies}
            disabled={selectedSituations.length === 0}
            className={`
              w-full h-12 md:h-14 lg:h-16 text-base md:text-lg lg:text-xl font-semibold rounded-xl transition-all duration-300 flex items-center justify-center
              ${selectedSituations.length === 0 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg transform hover:scale-[1.01] active:scale-[0.99]'
              }
            `}
          >
            <span>{getButtonText()}</span>
            {selectedSituations.length > 0 && (
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
