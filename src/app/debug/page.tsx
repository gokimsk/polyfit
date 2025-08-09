'use client';

import { useState, useEffect } from 'react';
import { Policy, SituationId } from '@/types';
import { loadPolicies } from '@/lib/utils';
import { calculateMatchScore } from '@/lib/matching';

// 실제 정책 데이터에 맞춘 상황 태그 (매칭 로직과 동일)
const SITUATION_TAGS: Record<SituationId, string[]> = {
  independence: ['주거', '청년', '월세', '생활비', '독립', '보증금', '자취', '주거비'],
  'job-seeking': ['취업', '청년', '구직활동', '교육', '자격증', '인턴', '구직', '훈련'],
  'after-resignation': ['실업급여', '이직', '재취업', '교육', '직업훈련', '생활비', '퇴사', '전직'],
  'childcare-prep': ['육아', '돌봄', '출산', '보육', '어린이집', '의료', '임신', '복지'],
  'tax-settlement': ['세금', '공제', '환급', '소득', '절세', '근로소득', '연말정산'],
  'marriage-prep': ['결혼', '신혼', '혼례', '신혼부부', '주택', '대출', '대출금']
};

const SITUATION_LABELS = {
  independence: '자취 시작',
  'job-seeking': '구직 중',
  'after-resignation': '퇴사 후',
  'childcare-prep': '육아 준비',
  'tax-settlement': '연말정산',
  'marriage-prep': '결혼 준비'
};

export default function DebugPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [selectedSituations, setSelectedSituations] = useState<SituationId[]>(['independence']);
  const [debugResults, setDebugResults] = useState<any[]>([]);

  useEffect(() => {
    const allPolicies = loadPolicies();
    setPolicies(allPolicies);
  }, []);

  useEffect(() => {
    if (policies.length > 0) {
      runDebugTest();
    }
  }, [policies, selectedSituations]);

  const runDebugTest = () => {
    // 선택된 상황들의 태그 합치기
    const selectedTags = new Set<string>();
    selectedSituations.forEach(situationId => {
      SITUATION_TAGS[situationId].forEach(tag => selectedTags.add(tag));
    });

    const results = policies.map(policy => {
      const score = calculateMatchScore(selectedSituations, policy);
      
      // 태그 매칭 분석
      const tagMatches = policy.tags.filter(tag => selectedTags.has(tag));
      const tagScore = tagMatches.length * 10;

      // 상황 매칭 분석  
      const situationMatches = policy.situations.filter(situation => 
        selectedSituations.includes(situation)
      );
      const situationScore = situationMatches.length * 5;

      // 마감 임박 보너스
      const today = new Date();
      const deadline = new Date(policy.deadline);
      const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const deadlineBonus = (daysUntilDeadline <= 30 && daysUntilDeadline > 0) ? 1 : 0;

      return {
        policy,
        totalScore: score,
        breakdown: {
          tagMatches,
          tagScore,
          situationMatches,
          situationScore,
          deadlineBonus,
          daysUntilDeadline
        }
      };
    }).sort((a, b) => b.totalScore - a.totalScore);

    setDebugResults(results);
  };

  const toggleSituation = (situationId: SituationId) => {
    setSelectedSituations(prev => {
      if (prev.includes(situationId)) {
        return prev.filter(id => id !== situationId);
      } else {
        return [...prev, situationId];
      }
    });
  };

  const selectedTagsArray = Array.from(
    new Set(selectedSituations.flatMap(id => SITUATION_TAGS[id]))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔍 매칭 알고리즘 디버깅</h1>
        
        {/* 상황 선택기 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow">
          <h2 className="text-xl font-semibold mb-4">테스트할 상황 선택</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(SITUATION_LABELS).map(([id, label]) => (
              <button
                key={id}
                onClick={() => toggleSituation(id as SituationId)}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  selectedSituations.includes(id as SituationId)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{label}</div>
                <div className="text-sm text-gray-500">{id}</div>
              </button>
            ))}
          </div>

          {/* 선택된 태그 표시 */}
          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">선택된 상황의 태그들:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTagsArray.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 디버깅 결과 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">매칭 결과 (총 {debugResults.length}개 정책)</h2>
          
          {debugResults.map(({ policy, totalScore, breakdown }, index) => (
            <div key={policy.id} className="bg-white rounded-lg p-6 shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
                  <p className="text-sm text-gray-600">{policy.id} | {policy.category}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{totalScore}점</div>
                  <div className="text-sm text-gray-500">#{index + 1}</div>
                </div>
              </div>

              {/* 점수 분석 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-medium text-green-800">태그 매칭</div>
                  <div className="text-green-600">{breakdown.tagScore}점 ({breakdown.tagMatches.length}개 매칭)</div>
                  <div className="text-xs text-green-600 mt-1">
                    {breakdown.tagMatches.join(', ') || '매칭 없음'}
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <div className="font-medium text-blue-800">상황 매칭</div>
                  <div className="text-blue-600">{breakdown.situationScore}점 ({breakdown.situationMatches.length}개 매칭)</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {breakdown.situationMatches.join(', ') || '매칭 없음'}
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded">
                  <div className="font-medium text-orange-800">마감 보너스</div>
                  <div className="text-orange-600">{breakdown.deadlineBonus}점</div>
                  <div className="text-xs text-orange-600 mt-1">
                    {breakdown.daysUntilDeadline}일 남음
                  </div>
                </div>
              </div>

              {/* 정책 태그 */}
              <div>
                <div className="font-medium text-gray-700 mb-2">정책 태그:</div>
                <div className="flex flex-wrap gap-2">
                  {policy.tags.map(tag => {
                    const isMatched = selectedTagsArray.includes(tag);
                    return (
                      <span 
                        key={tag} 
                        className={`px-2 py-1 rounded text-sm ${
                          isMatched 
                            ? 'bg-green-100 text-green-700 font-medium' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
