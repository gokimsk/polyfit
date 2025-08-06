'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Policy, SituationId, CategoryId, SortOption, SITUATIONS, CATEGORIES, SORT_OPTIONS } from '@/types';
import { loadPolicies, parseSituationsFromUrl } from '@/lib/utils';
import { filterAndSortPolicies, calculateMatchScore, getDaysUntilDeadline, isDeadlineSoon } from '@/lib/matching';

const situationColors = {
  'independence': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'job-seeking': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
  'after-resignation': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' },
  'childcare-prep': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'tax-settlement': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  'marriage-prep': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' }
};

const situationLabels = {
  'independence': '자취 시작',
  'job-seeking': '구직 중',
  'after-resignation': '퇴사 후',
  'childcare-prep': '육아 준비',
  'tax-settlement': '연말정산',
  'marriage-prep': '결혼 준비'
};

export default function PoliciesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedSituations, setSelectedSituations] = useState<SituationId[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | undefined>();
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    const situationsParam = searchParams.get('situations');
    const situations = parseSituationsFromUrl(situationsParam || undefined);
    setSelectedSituations(situations as SituationId[]);

    const allPolicies = loadPolicies();
    setPolicies(allPolicies);
  }, [searchParams]);

  useEffect(() => {
    const filtered = filterAndSortPolicies(
      policies,
      selectedSituations,
      sortOption,
      selectedCategory
    );
    setFilteredPolicies(filtered);
  }, [policies, selectedSituations, sortOption, selectedCategory]);

  const handleSortChange = (newSortOption: SortOption) => {
    setSortOption(newSortOption);
  };

  const handleCategoryChange = (category: string | undefined) => {
    setSelectedCategory(category as CategoryId | undefined);
  };

  const getMatchScore = (policy: Policy) => {
    return calculateMatchScore(selectedSituations, policy);
  };

  const getDeadlineStatus = (deadline: string) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return { text: '마감됨', color: 'text-gray-500', bg: 'bg-gray-100' };
    if (days <= 7) return { text: `${days}일 남음`, color: 'text-red-600', bg: 'bg-red-100' };
    if (days <= 30) return { text: `${days}일 남음`, color: 'text-orange-600', bg: 'bg-orange-100' };
    return { text: `${days}일 남음`, color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-3">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => router.back()}
              className="text-white hover:bg-white/10 -ml-2 px-2 py-1 h-8 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">돌아가기</span>
            </button>
            
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-100">실시간</span>
            </div>
          </div>

          {/* Responsive Header Layout */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-xl font-bold">맞춤 정책</h1>
                <span className="text-sm text-blue-200">({filteredPolicies.length}개)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSituations.map((situationId, index) => {
                  const colors = situationColors[situationId as keyof typeof situationColors];
                  return (
                    <div
                      key={situationId}
                      className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${colors?.dot || 'bg-blue-500'}`}></div>
                      <span className="text-xs font-medium">
                        {situationLabels[situationId as keyof typeof situationLabels]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sort Option */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/80">정렬:</span>
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="w-32 md:w-36 lg:w-40 h-8 md:h-10 bg-white/10 border border-white/20 text-white text-sm md:text-base rounded-lg px-2"
              >
                {Object.entries(SORT_OPTIONS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Policy Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
          {filteredPolicies.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                조건에 맞는 정책이 없습니다
              </div>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                다시 선택하기
              </button>
            </div>
          ) : (
            filteredPolicies.map((policy, index) => {
              const matchScore = getMatchScore(policy);
              const deadlineStatus = getDeadlineStatus(policy.deadline);
              const isSoon = isDeadlineSoon(policy.deadline);

              return (
                <Link
                  key={policy.id}
                  href={`/policies/${policy.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 md:p-6 lg:p-8 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                          {policy.title}
                        </h3>
                        {isSoon && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            마감임박
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-3 leading-relaxed">
                        {policy.summary}
                      </p>
                      
                      {/* Policy Info */}
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 mb-3">
                        <span>👥 {policy.target}</span>
                        <span>⭐ {policy.amount}</span>
                        <span>📅 {policy.period}</span>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-xs text-gray-500 mb-1">
                        {CATEGORIES[policy.category]}
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${deadlineStatus.bg} ${deadlineStatus.color}`}>
                        {deadlineStatus.text}
                      </div>
                    </div>
                  </div>

                  {/* Match Score and Agency */}
                  {matchScore > 0 && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">매칭도:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.min(matchScore / 20, 5) 
                                  ? 'bg-blue-500' 
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-blue-600">
                          {Math.min(matchScore / 20, 5)}/5
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {policy.source}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 