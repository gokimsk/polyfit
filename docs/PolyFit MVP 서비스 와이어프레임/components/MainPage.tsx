import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, ArrowRight } from 'lucide-react';

const situations = [
  { 
    id: 'living', 
    title: '자취 시작', 
    description: '독립생활을 위한 주거 지원',
    gradient: 'from-blue-600 via-blue-500 to-blue-400',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  { 
    id: 'job', 
    title: '구직 중', 
    description: '취업 준비와 구직활동 지원',
    gradient: 'from-sky-500 via-sky-400 to-cyan-400',
    bgColor: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200'
  },
  { 
    id: 'quit', 
    title: '퇴사 후', 
    description: '재취업과 생활안정 지원',
    gradient: 'from-cyan-600 via-cyan-500 to-teal-400',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-700',
    borderColor: 'border-cyan-200'
  },
  { 
    id: 'parenting', 
    title: '육아 준비', 
    description: '출산과 육아를 위한 지원',
    gradient: 'from-blue-500 via-indigo-400 to-purple-400',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  },
  { 
    id: 'tax', 
    title: '연말정산', 
    description: '세금 혜택과 공제 정보',
    gradient: 'from-indigo-600 via-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200'
  },
  { 
    id: 'medical', 
    title: '의료비 부담', 
    description: '의료비 지원과 건강관리',
    gradient: 'from-blue-700 via-blue-600 to-indigo-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200'
  }
];

interface MainPageProps {
  onNext: (selectedSituations: string[]) => void;
  onViewApplications: () => void;
  appliedCount: number;
}

export function MainPage({ onNext, onViewApplications, appliedCount }: MainPageProps) {
  const [selectedSituations, setSelectedSituations] = useState<string[]>([]);

  const handleCardClick = (id: string) => {
    if (selectedSituations.includes(id)) {
      setSelectedSituations(prev => prev.filter(item => item !== id));
    } else if (selectedSituations.length < 3) {
      setSelectedSituations(prev => [...prev, id]);
    }
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
        <motion.div 
          className="flex justify-between items-center pt-4 pb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-blue-100"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-600 font-medium">PolyFit</span>
          </motion.div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onViewApplications}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 px-3 py-1.5 h-8"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="text-xs">신청현황</span>
            {appliedCount > 0 && (
              <Badge variant="default" className="ml-1 px-1.5 py-0 text-xs bg-blue-600 h-4">
                {appliedCount}
              </Badge>
            )}
          </Button>
        </motion.div>

        {/* Compact Hero Section */}
        <motion.div 
          className="text-center mb-6 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
            요즘 이런 상황이신가요?
          </h1>
          <p className="text-sm text-slate-600 mb-1">
            나에게 딱 맞는 정책을 찾아드려요 (최대 3개 선택)
          </p>
        </motion.div>

        {/* Clean 2-Column Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {situations.map((situation, index) => {
            const isSelected = selectedSituations.includes(situation.id);
            const isDisabled = !isSelected && selectedSituations.length >= 3;
            
            return (
              <motion.div
                key={situation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                className="relative"
              >
                <div
                  className={`
                    relative p-4 rounded-xl cursor-pointer transition-all duration-300 h-32 overflow-hidden
                    ${isSelected 
                      ? `bg-gradient-to-br ${situation.gradient} text-white shadow-lg border-2 border-transparent` 
                      : `bg-white hover:shadow-md border-2 ${situation.borderColor} hover:border-blue-300`
                    }
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    group
                  `}
                  onClick={() => !isDisabled && handleCardClick(situation.id)}
                >
                  {/* Selection Indicator */}
                  {isSelected && (
                    <motion.div
                      className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.3 }}
                    >
                      <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                    </motion.div>
                  )}
                  
                  {/* Card Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    <h3 className={`text-lg font-bold mb-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {situation.title}
                    </h3>
                    <p className={`text-xs leading-relaxed flex-1 ${isSelected ? 'text-blue-100' : 'text-slate-600'}`}>
                      {situation.description}
                    </p>
                    
                    {/* Hover Effect Arrow */}
                    <div className={`mt-2 transform transition-transform duration-300 ${isSelected ? 'translate-x-0' : 'translate-x-[-8px] group-hover:translate-x-0'}`}>
                      <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-blue-100' : 'text-blue-500 opacity-0 group-hover:opacity-100'} transition-opacity duration-300`} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            className={`
              w-full h-12 text-base font-semibold rounded-xl transition-all duration-300
              ${selectedSituations.length === 0 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-primary hover:shadow-brand transform hover:scale-[1.01] active:scale-[0.99]'
              }
            `}
            disabled={selectedSituations.length === 0}
            onClick={() => onNext(selectedSituations)}
          >
            <span>{getButtonText()}</span>
            {selectedSituations.length > 0 && (
              <ArrowRight className="w-4 h-4 ml-2" />
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}