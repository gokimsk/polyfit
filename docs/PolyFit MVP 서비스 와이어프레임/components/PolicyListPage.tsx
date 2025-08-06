import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Star, Users, Calendar, Clock } from 'lucide-react';

const mockPolicies = [
  {
    id: '1',
    title: '청년 월세 특별지원',
    agency: '국토교통부',
    target: '만 19~34세 청년',
    support: '월 최대 20만원',
    period: '최대 12개월',
    deadline: '2024년 12월 31일',
    matchReason: '자취 시작',
    description: '무주택 청년의 주거비 부담을 덜어주기 위한 월세 지원 정책입니다.',
    tags: ['주거', '월세', '청년'],
    matchPercentage: 95,
    approvalRate: 87,
    appliedCount: 15420,
    isUrgent: false
  },
  {
    id: '2',
    title: '청년구직활동지원금',
    agency: '고용노동부',
    target: '만 18~34세 구직자',
    support: '월 50만원',
    period: '최대 6개월',
    deadline: '상시 모집',
    matchReason: '구직 중',
    description: '적극적인 구직활동을 하는 청년에게 지원금을 제공하는 정책입니다.',
    tags: ['구직', '취업', '활동비'],
    matchPercentage: 88,
    approvalRate: 72,
    appliedCount: 23150,
    isUrgent: false
  },
  {
    id: '3',
    title: '국민취업지원제도',
    agency: '고용노동부',
    target: '구직 희망자',
    support: '월 최대 50만원',
    period: '최대 6개월',
    deadline: '2024년 8월 15일',
    matchReason: '퇴사 후',
    description: '취업을 원하는 모든 국민에게 취업지원서비스와 소득지원을 함께 제공합니다.',
    tags: ['취업지원', '직업훈련', '소득보장'],
    matchPercentage: 92,
    approvalRate: 65,
    appliedCount: 45200,
    isUrgent: true
  },
  {
    id: '4',
    title: '첫만남이용권',
    agency: '보건복지부',
    target: '2024년 출생아',
    support: '200만원',
    period: '1회 지급',
    deadline: '출생일로부터 1년',
    matchReason: '육아 준비',
    description: '출생아 양육에 소요되는 경제적 부담 경감을 위한 바우처 지원입니다.',
    tags: ['육아', '출산', '바우처'],
    matchPercentage: 90,
    approvalRate: 95,
    appliedCount: 12800,
    isUrgent: false
  }
];

const situationColors = {
  'living': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'job': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', dot: 'bg-sky-500' },
  'quit': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', dot: 'bg-cyan-500' },
  'parenting': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
  'tax': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  'medical': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' }
};

const situationLabels = {
  'living': '자취 시작',
  'job': '구직 중',
  'quit': '퇴사 후',
  'parenting': '육아 준비',
  'tax': '연말정산',
  'medical': '의료비 부담'
};

interface PolicyListPageProps {
  selectedSituations: string[];
  onBack: () => void;
  onPolicyClick: (policyId: string) => void;
}

export function PolicyListPage({ selectedSituations, onBack, onPolicyClick }: PolicyListPageProps) {
  const [sortBy, setSortBy] = useState('recommended');

  const sortedPolicies = [...mockPolicies].sort((a, b) => {
    switch (sortBy) {
      case 'deadline':
        return a.isUrgent ? -1 : b.isUrgent ? 1 : 0;
      case 'amount':
        const getAmount = (support: string) => {
          const match = support.match(/(\d+)만원/);
          return match ? parseInt(match[1]) : 0;
        };
        return getAmount(b.support) - getAmount(a.support);
      case 'recommended':
      default:
        return b.matchPercentage - a.matchPercentage;
    }
  });

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
          {/* Navigation */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 -ml-2 px-2 py-1 h-8"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span className="text-sm">돌아가기</span>
            </Button>
            
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-100">실시간</span>
            </div>
          </div>

          {/* Compact Selected Situations */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-lg font-bold">맞춤 정책</h1>
              <span className="text-sm text-blue-200">({sortedPolicies.length}개)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSituations.map((situation, index) => {
                const colors = situationColors[situation as keyof typeof situationColors];
                return (
                  <motion.div
                    key={situation}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${colors?.dot || 'bg-blue-500'}`}></div>
                    <span className="text-xs font-medium">
                      {situationLabels[situation as keyof typeof situationLabels]}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/80">정렬:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-8 bg-white/10 border-white/20 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">추천순</SelectItem>
                <SelectItem value="deadline">마감임박순</SelectItem>
                <SelectItem value="amount">지원금액순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Policy Cards */}
        <div className="space-y-3">
          {sortedPolicies.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.005 }}
              className="group"
            >
              <Card 
                className="p-4 hover:shadow-md transition-all duration-300 border-0 shadow-sm bg-white cursor-pointer"
                onClick={() => onPolicyClick(policy.id)}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs px-2 py-0.5"
                      >
                        {policy.matchReason}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-slate-600">
                          {policy.matchPercentage}% 일치
                        </span>
                      </div>
                      {policy.isUrgent && (
                        <Badge variant="destructive" className="text-xs px-2 py-0.5">
                          마감임박
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                      {policy.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 leading-relaxed mb-2 line-clamp-2">
                      {policy.description}
                    </p>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{(policy.appliedCount / 1000).toFixed(1)}K명</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{policy.deadline}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 text-right flex-shrink-0">
                    <div className="text-xs text-slate-500 mb-0.5">{policy.agency}</div>
                    <div className="bg-slate-100 px-2.5 py-1.5 rounded-lg">
                      <div className="text-sm font-bold text-slate-900">{policy.support}</div>
                    </div>
                  </div>
                </div>

                {/* Simplified Details */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <div className="text-xs text-slate-500 mb-0.5">대상</div>
                    <div className="text-xs font-semibold text-slate-900 leading-tight">{policy.target}</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <div className="text-xs text-slate-500 mb-0.5">지원</div>
                    <div className="text-xs font-semibold text-slate-900 leading-tight">{policy.support}</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg">
                    <div className="text-xs text-slate-500 mb-0.5">기간</div>
                    <div className="text-xs font-semibold text-slate-900 leading-tight">{policy.period}</div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-1.5 pt-3 border-t border-slate-100">
                  {policy.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                  {policy.tags.length > 3 && (
                    <span className="text-xs text-slate-500">+{policy.tags.length - 3}</span>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results State */}
        {sortedPolicies.length === 0 && (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              맞는 정책이 없어요
            </h3>
            <p className="text-sm text-slate-600">
              다른 상황을 선택해보세요
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}