import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  ArrowLeft, 
  ExternalLink, 
  Users, 
  Calendar, 
  Check,
  Star,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Share2
} from 'lucide-react';

const mockPolicy = {
  id: '1',
  title: '청년 월세 특별지원',
  target: '만 19~34세 청년',
  support: '월 최대 20만원 지원 (최대 12개월)',
  period: '2024년 1월 ~ 12월',
  deadline: '2024년 12월 31일',
  matchReason: '자취 시작',
  source: '국토교통부',
  description: '무주택 청년의 주거비 부담을 덜어주기 위한 월세 지원 정책입니다.',
  longDescription: '본 정책은 주거비 부담으로 어려움을 겪는 청년들의 안정적인 주거환경 조성을 위해 마련되었습니다. 월세 지원을 통해 청년들이 독립적인 생활을 영위할 수 있도록 돕고, 사회진출 초기의 경제적 부담을 덜어주는 것이 목적입니다.',
  eligibility: [
    '만 19세 이상 34세 이하 무주택 청년',
    '부모와 별도 거주하는 청년',
    '소득 기준: 중위소득 150% 이하',
    '임대차계약서상 보증금 5천만원 이하',
    '월세 60만원 이하 주택 거주'
  ],
  documents: [
    '신청서 (온라인 작성)',
    '임대차계약서 사본',
    '소득증빙서류 (최근 3개월)',
    '주민등록등본',
    '통장 사본'
  ],
  applicationUrl: 'https://www.gov.kr',
  tips: [
    '임대차계약서상 보증금이 5천만원 이하여야 합니다',
    '월세가 60만원 이하인 주택만 해당됩니다',
    '지원 기간 중 이사할 경우 변경신고가 필요합니다',
    '신청 후 서류 검토까지 평균 7-10일 소요됩니다'
  ],
  process: [
    { step: 1, title: '온라인 신청', description: '필요 서류를 준비하여 온라인으로 신청' },
    { step: 2, title: '서류 검토', description: '제출된 서류의 적격성 검토 (7-10일)' },
    { step: 3, title: '현장 확인', description: '필요시 거주지 확인 및 추가 서류 요청' },
    { step: 4, title: '지원 결정', description: '최종 심사 후 지원 여부 결정 통보' },
    { step: 5, title: '지원금 지급', description: '매월 25일 지정 계좌로 지원금 지급' }
  ],
  reviews: [
    {
      user: "김**",
      rating: 5,
      content: "신청 절차가 간단하고 빠르게 처리되어서 좋았습니다.",
      date: "2024.07.15"
    },
    {
      user: "이**",
      rating: 4,
      content: "월세 부담이 많이 줄어들어 도움이 됩니다.",
      date: "2024.07.10"
    }
  ]
};

interface PolicyDetailPageProps {
  policyId: string;
  onBack: () => void;
  onApply: (policyId: string) => void;
  isApplied: boolean;
}

export function PolicyDetailPage({ policyId, onBack, onApply, isApplied }: PolicyDetailPageProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleApply = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApply = () => {
    window.open(mockPolicy.applicationUrl, '_blank');
    onApply(policyId);
    setShowConfirmModal(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockPolicy.title,
        text: mockPolicy.description,
        url: window.location.href
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Compact Header */}
      <motion.div 
        className="bg-gradient-dark text-white sticky top-0 z-50 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 -ml-2 px-2 py-1 h-8"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="text-sm">목록</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white hover:bg-white/10 px-2 py-1 h-8"
            >
              <Share2 className="w-3.5 h-3.5 mr-1" />
              <span className="text-sm">공유</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto p-4 pb-24">
        {/* Hero Section - 추천 이유 강조 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-current" />
              </div>
              <div className="flex-1">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300 mb-2 text-xs">
                  {mockPolicy.matchReason} 맞춤 추천
                </Badge>
                <h1 className="text-2xl font-bold text-slate-900 mb-3">
                  {mockPolicy.title}
                </h1>
                <p className="text-base text-slate-700 leading-relaxed">
                  {mockPolicy.longDescription}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Info Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">지원대상</h3>
            </div>
            <p className="text-sm text-slate-700">{mockPolicy.target}</p>
          </Card>
          
          <Card className="p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-green-600" />
              <h3 className="text-sm font-semibold text-slate-900">지원내용</h3>
            </div>
            <p className="text-sm text-slate-700">{mockPolicy.support}</p>
          </Card>
          
          <Card className="p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-semibold text-slate-900">신청기간</h3>
            </div>
            <p className="text-sm text-slate-700">{mockPolicy.period}</p>
          </Card>
        </motion.div>

        {/* Application Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              신청 프로세스
            </h2>
            
            <div className="space-y-3">
              {mockPolicy.process.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                    {item.step}
                  </div>
                  <div className="flex-1 pb-2">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Detailed Information Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-5 mb-6 shadow-sm">
            <Accordion type="single" collapsible className="space-y-3">
              <AccordionItem value="eligibility" className="border-slate-200">
                <AccordionTrigger className="text-left hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-base font-semibold">신청 자격 요건</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="space-y-2">
                    {mockPolicy.eligibility.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="documents" className="border-slate-200">
                <AccordionTrigger className="text-left hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-base font-semibold">필요 서류</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="space-y-2">
                    {mockPolicy.documents.map((doc, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="tips" className="border-slate-200">
                <AccordionTrigger className="text-left hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-base font-semibold">신청 시 주의사항</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3">
                  <div className="space-y-2">
                    {mockPolicy.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        </motion.div>

        {/* User Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">이용자 후기</h2>
            <div className="space-y-3">
              {mockPolicy.reviews.map((review, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-3 bg-blue-50/50 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-slate-900">{review.user}</span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">{review.date}</span>
                  </div>
                  <p className="text-sm text-slate-700">{review.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Fixed CTA Button */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 shadow-xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          {isApplied ? (
            <div className="text-center">
              <div className="text-green-600 mb-2 text-sm">✓ 신청이 완료되었습니다</div>
              <Button 
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl"
                disabled
              >
                <Check className="w-4 h-4 mr-2" />
                신청 완료
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full h-12 bg-gradient-primary hover:shadow-brand text-white font-semibold rounded-xl transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
              onClick={handleApply}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              신청하러 가기
            </Button>
          )}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-slate-900 mb-3">외부 사이트로 이동</h3>
              <p className="text-sm text-slate-600 mb-4">
                정책 신청을 위해 {mockPolicy.source} 사이트로 이동합니다.
                신청 완료 후 진행상황을 추적할 수 있습니다.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                  size="sm"
                >
                  취소
                </Button>
                <Button 
                  onClick={handleConfirmApply}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  size="sm"
                >
                  이동하기
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}