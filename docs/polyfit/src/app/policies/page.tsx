'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Policy, SituationId, CategoryId, SortOption, SITUATIONS, CATEGORIES, SORT_OPTIONS } from '@/types';
import { loadPolicies, parseSituationsFromUrl, calculateMatchScore, getDaysUntilDeadline, isDeadlineSoon } from '@/lib/utils';
import { filterAndSortPolicies } from '@/lib/matching';

export default function PoliciesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedSituations, setSelectedSituations] = useState<SituationId[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | undefined>();
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    // URL 파라미터에서 상황 파싱
    const situationsParam = searchParams.get('situations');
    const situations = parseSituationsFromUrl(situationsParam);
    setSelectedSituations(situations as SituationId[]);

    // 정책 데이터 로드
    const allPolicies = loadPolicies();
    setPolicies(allPolicies);
  }, [searchParams]);

  useEffect(() => {
    // 필터링 및 정렬 적용
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

  const handleCategoryChange = (category: CategoryId | undefined) => {
    setSelectedCategory(category);
  };

  const getMatchScore = (policy: Policy) => {
    return calculateMatchScore(selectedSituations, policy);
  };

  const getDeadlineStatus = (deadline: string) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return { text: '마감됨', color: 'text-gray-500' };
    if (days <= 7) return { text: `${days}일 남음`, color: 'text-red-600' };
    if (days <= 30) return { text: `${days}일 남음`, color: 'text-orange-600' };
    return { text: `${days}일 남음`, color: 'text-gray-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                맞춤 정책 ({filteredPolicies.length}개)
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* 선택된 상황 표시 */}
      {selectedSituations.length > 0 && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-2">
              {selectedSituations.map(situationId => {
                const situation = SITUATIONS[situationId];
                return (
                  <span
                    key={situationId}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {situation.title}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 필터 섹션 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* 정렬 옵션 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">정렬:</label>
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                {Object.entries(SORT_OPTIONS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            {/* 카테고리 필터 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">카테고리:</label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => handleCategoryChange(e.target.value || undefined)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="">전체</option>
                {Object.entries(CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 정책 리스트 */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {filteredPolicies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              조건에 맞는 정책이 없습니다
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              다시 선택하기
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPolicies.map((policy) => {
              const matchScore = getMatchScore(policy);
              const deadlineStatus = getDeadlineStatus(policy.deadline);
              const isSoon = isDeadlineSoon(policy.deadline);

              return (
                <Link
                  key={policy.id}
                  href={`/policies/${policy.id}`}
                  className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {policy.title}
                        </h3>
                        {isSoon && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            마감임박
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">
                        {policy.summary}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>👥 {policy.target}</span>
                        <span>⭐ {policy.amount}</span>
                        <span>📅 {policy.period}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">
                        {CATEGORIES[policy.category]}
                      </div>
                      <div className={`text-sm font-medium ${deadlineStatus.color}`}>
                        {deadlineStatus.text}
                      </div>
                    </div>
                  </div>

                  {/* 매칭 점수 */}
                  {matchScore > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">매칭도:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.min(matchScore / 10, 5) 
                                  ? 'bg-blue-500' 
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {policy.source}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
} 