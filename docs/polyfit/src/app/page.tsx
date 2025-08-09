'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SITUATIONS, SituationId } from '@/types';
import { situationsToUrlParam } from '@/lib/utils';

export default function HomePage() {
  const [selectedSituations, setSelectedSituations] = useState<SituationId[]>([]);
  const router = useRouter();

  const handleSituationClick = (situationId: SituationId) => {
    setSelectedSituations(prev => {
      const isSelected = prev.includes(situationId);
      
      if (isSelected) {
        // 이미 선택된 경우 제거
        return prev.filter(id => id !== situationId);
      } else {
        // 선택되지 않은 경우 추가 (최대 3개)
        if (prev.length >= 3) {
          return prev; // 최대 3개까지만 선택 가능
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
    if (count === 1) return '맞춤 정책 찾기';
    if (count === 2) return '맞춤 정책 찾기';
    return '맞춤 정책 찾기';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            PolyFit
          </h1>
          <p className="text-gray-600 text-center mt-2">
            상황 기반 정책 추천 서비스
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 안내 텍스트 */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            현재 상황을 선택해주세요
          </h2>
          <p className="text-gray-600">
            최대 3개까지 선택할 수 있습니다
          </p>
        </div>

        {/* 상황 카드 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {Object.values(SITUATIONS).map((situation) => {
            const isSelected = selectedSituations.includes(situation.id);
            
            return (
              <button
                key={situation.id}
                onClick={() => handleSituationClick(situation.id)}
                disabled={!isSelected && selectedSituations.length >= 3}
                className={`
                  p-6 rounded-lg border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                  ${!isSelected && selectedSituations.length >= 3 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'cursor-pointer hover:shadow-md'
                  }
                `}
              >
                <div className="text-center">
                  {/* 선택 상태 표시 */}
                  {isSelected && (
                    <div className="flex justify-center mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* 상황 제목 */}
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {situation.title}
                  </h3>
                  
                  {/* 상황 설명 */}
                  <p className="text-sm text-gray-600">
                    {situation.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 선택된 상황 표시 */}
        {selectedSituations.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              선택된 상황 ({selectedSituations.length}/3)
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedSituations.map(situationId => {
                const situation = SITUATIONS[situationId];
                return (
                  <span
                    key={situationId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {situation.title}
                    <button
                      onClick={() => handleSituationClick(situationId)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* 버튼 */}
        <div className="text-center">
          <button
            onClick={handleFindPolicies}
            disabled={selectedSituations.length === 0}
            className={`
              px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200
              ${selectedSituations.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {getButtonText()}
          </button>
        </div>
      </main>
    </div>
  );
}
