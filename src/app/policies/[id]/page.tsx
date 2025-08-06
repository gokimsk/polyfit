'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Policy, CATEGORIES } from '@/types';
import { findPolicyById, isExternalLink } from '@/lib/utils';
import { getDaysUntilDeadline, isDeadlineSoon } from '@/lib/matching';

export default function PolicyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);

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
    setShowApplicationModal(true);
  };

  const handleConfirmApplication = () => {
    if (!policy) return;
    window.open(policy.applicationUrl, '_blank');
    setIsApplied(true);
    setShowApplicationModal(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: policy?.title || '',
        text: policy?.summary || '',
        url: window.location.href
      });
    }
  };

  if (!policy) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-4">로딩 중...</div>
        </div>
      </div>
    );
  }

  const deadlineStatus = getDaysUntilDeadline(policy.deadline);
  const isSoon = isDeadlineSoon(policy.deadline);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="text-white hover:bg-white/10 -ml-2 px-2 py-1 h-8 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm">목록</span>
            </button>
            
            <button
              onClick={handleShare}
              className="text-white hover:bg-white/10 px-2 py-1 h-8 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="text-sm">공유</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 pb-24">
        {/* Hero Section - 추천 이유 강조 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 md:p-6 lg:p-8 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1">
              <span className="inline-block bg-blue-100 text-blue-700 border border-blue-300 px-2 py-1 rounded text-xs mb-2">
                맞춤 추천
              </span>
              <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 mb-3 leading-tight">
                {policy.title}
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-slate-700 leading-relaxed">
                {policy.detailedDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Info Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="text-sm md:text-base font-semibold text-slate-900">지원대상</h3>
            </div>
            <p className="text-sm md:text-base text-slate-700">{policy.target}</p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h3 className="text-sm md:text-base font-semibold text-slate-900">지원내용</h3>
            </div>
            <p className="text-sm md:text-base text-slate-700">{policy.amount}</p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-sm md:text-base font-semibold text-slate-900">신청기간</h3>
            </div>
            <p className="text-sm md:text-base text-slate-700">{policy.period}</p>
          </div>
        </div>

        {/* Application Process Timeline */}
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl mb-6 shadow-sm border border-gray-200">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            신청 프로세스
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <div className="flex-1 pb-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">온라인 신청</h3>
                <p className="text-sm text-slate-600">필요 서류를 준비하여 온라인으로 신청</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <div className="flex-1 pb-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">서류 검토</h3>
                <p className="text-sm text-slate-600">제출된 서류의 적격성 검토 (7-10일)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <div className="flex-1 pb-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">현장 확인</h3>
                <p className="text-sm text-slate-600">필요시 거주지 확인 및 추가 서류 요청</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                4
              </div>
              <div className="flex-1 pb-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">지원 결정</h3>
                <p className="text-sm text-slate-600">최종 심사 후 지원 여부 결정 통보</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                5
              </div>
              <div className="flex-1 pb-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-1">지원금 지급</h3>
                <p className="text-sm text-slate-600">매월 25일 지정 계좌로 지원금 지급</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Accordion */}
        <div className="bg-white p-4 md:p-6 lg:p-8 rounded-xl mb-6 shadow-sm border border-gray-200">
          <div className="space-y-3">
            {/* 자격요건 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleAccordionToggle('requirements')}
                className="w-full px-4 md:px-6 py-3 md:py-4 text-left flex items-center justify-between hover:bg-green-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm md:text-base lg:text-lg font-semibold text-slate-900">신청 자격 요건</span>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform text-slate-600 ${
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
                <div className="px-4 pb-4 border-t border-green-100 pt-3 bg-green-50/30">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-slate-700 leading-relaxed">{policy.requirements}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 필요 서류 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleAccordionToggle('documents')}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-base font-semibold text-slate-900">필요 서류</span>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform text-slate-600 ${
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
                <div className="px-4 pb-4 border-t border-blue-100 pt-3 bg-blue-50/30">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-slate-700 leading-relaxed">{policy.documents}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 주의사항 */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleAccordionToggle('cautions')}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-orange-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-base font-semibold text-slate-900">신청 시 주의사항</span>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform text-slate-600 ${
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
                <div className="px-4 pb-4 border-t border-orange-100 pt-3 bg-orange-50/30">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-sm text-slate-700 leading-relaxed">{policy.cautions}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Reviews */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">이용자 후기</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-200 pl-4 py-3 bg-blue-50/50 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-slate-900">김**</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 text-yellow-500 fill-current" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-slate-500">2024.07.15</span>
              </div>
              <p className="text-sm text-slate-700">신청 절차가 간단하고 빠르게 처리되어서 좋았습니다.</p>
            </div>
            <div className="border-l-4 border-blue-200 pl-4 py-3 bg-blue-50/50 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-slate-900">이**</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 text-yellow-500 fill-current" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-slate-500">2024.07.10</span>
              </div>
              <p className="text-sm text-slate-700">월세 부담이 많이 줄어들어 도움이 됩니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Fixed CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-xl">
        <div className="max-w-4xl mx-auto">
          {isApplied ? (
            <div className="text-center">
              <div className="text-green-600 mb-2 text-sm">✓ 신청이 완료되었습니다</div>
              <button 
                className="w-full h-12 md:h-14 lg:h-16 bg-green-600 hover:bg-green-700 text-white text-sm md:text-base lg:text-lg font-semibold rounded-xl flex items-center justify-center"
                disabled
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                신청 완료
              </button>
            </div>
          ) : (
            <button 
              className="w-full h-12 md:h-14 lg:h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg text-white text-sm md:text-base lg:text-lg font-semibold rounded-xl flex items-center justify-center transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
              onClick={handleApplicationClick}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              신청하러 가기
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-3">외부 사이트로 이동</h3>
            <p className="text-sm text-slate-600 mb-4">
              정책 신청을 위해 {policy.source} 사이트로 이동합니다.
              신청 완료 후 진행상황을 추적할 수 있습니다.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowApplicationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleConfirmApplication}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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