'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Policy, CATEGORIES } from '@/types';
import { findPolicyById, getDaysUntilDeadline, isDeadlineSoon, isExternalLink } from '@/lib/utils';

export default function PolicyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useEffect(() => {
    const policyId = params.id as string;
    const foundPolicy = findPolicyById(policyId);
    
    if (!foundPolicy) {
      router.push('/');
      return;
    }
    
    setPolicy(foundPolicy);
  }, [params.id, router]);

  const handleAccordionToggle = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const handleApplicationClick = () => {
    if (!policy) return;
    
    if (isExternalLink(policy.applicationUrl)) {
      setShowApplicationModal(true);
    } else {
      window.open(policy.applicationUrl, '_blank');
    }
  };

  const handleConfirmApplication = () => {
    if (!policy) return;
    window.open(policy.applicationUrl, '_blank');
    setShowApplicationModal(false);
  };

  if (!policy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">로딩 중...</div>
        </div>
      </div>
    );
  }

  const deadlineStatus = getDaysUntilDeadline(policy.deadline);
  const isSoon = isDeadlineSoon(policy.deadline);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
                정책 상세
              </h1>
            </div>
            <button
              onClick={() => {/* 공유 기능 */}}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 메인 정보 카드 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {policy.title}
                </h2>
                {isSoon && (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                    마감임박
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-lg mb-4">
                {policy.summary}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                {CATEGORIES[policy.category]}
              </div>
              <div className={`text-sm font-medium ${isSoon ? 'text-red-600' : 'text-gray-600'}`}>
                {deadlineStatus < 0 ? '마감됨' : `${deadlineStatus}일 남음`}
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <div>
                <div className="text-sm text-gray-500">지원 대상</div>
                <div className="font-medium">{policy.target}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <div className="text-sm text-gray-500">지원 내용</div>
                <div className="font-medium">{policy.amount}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <div>
                <div className="text-sm text-gray-500">신청 기간</div>
                <div className="font-medium">{policy.period}</div>
              </div>
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">상세 설명</h3>
            <p className="text-gray-600 leading-relaxed">
              {policy.detailedDescription}
            </p>
          </div>
        </div>

        {/* 아코디언 섹션 */}
        <div className="space-y-4 mb-6">
          {/* 자격요건 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => handleAccordionToggle('requirements')}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🟢</span>
                <span className="font-semibold">자격요건</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${
                  activeAccordion === 'requirements' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeAccordion === 'requirements' && (
              <div className="px-6 pb-4 border-t">
                <p className="text-gray-600 leading-relaxed">
                  {policy.requirements}
                </p>
              </div>
            )}
          </div>

          {/* 필요 서류 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => handleAccordionToggle('documents')}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <span className="font-semibold">필요 서류</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${
                  activeAccordion === 'documents' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeAccordion === 'documents' && (
              <div className="px-6 pb-4 border-t">
                <p className="text-gray-600 leading-relaxed">
                  {policy.documents}
                </p>
              </div>
            )}
          </div>

          {/* 신청 절차 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => handleAccordionToggle('process')}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">📝</span>
                <span className="font-semibold">신청 절차</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${
                  activeAccordion === 'process' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeAccordion === 'process' && (
              <div className="px-6 pb-4 border-t">
                <p className="text-gray-600 leading-relaxed">
                  {policy.process}
                </p>
              </div>
            )}
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-lg border border-gray-200">
            <button
              onClick={() => handleAccordionToggle('cautions')}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <span className="font-semibold">주의사항</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${
                  activeAccordion === 'cautions' ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeAccordion === 'cautions' && (
              <div className="px-6 pb-4 border-t">
                <p className="text-gray-600 leading-relaxed">
                  {policy.cautions}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 신청하기 버튼 */}
        <div className="text-center">
          <button
            onClick={handleApplicationClick}
            disabled={deadlineStatus < 0}
            className={`
              px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200
              ${deadlineStatus >= 0
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {deadlineStatus >= 0 ? '신청하기' : '마감됨'}
          </button>
        </div>
      </main>

      {/* 신청 확인 모달 */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">외부 링크로 이동</h3>
            <p className="text-gray-600 mb-6">
              신청 페이지로 이동합니다. 외부 사이트로 연결됩니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmApplication}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                이동하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 