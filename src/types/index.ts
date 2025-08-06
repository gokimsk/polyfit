// PolyFit MVP TypeScript 정의 파일
// 버전: v2.1 (2025.08.02)
// 기반: 확정된 서비스 개요 + 와이어프레임 분석

// ===== 기본 타입 정의 =====

export type SituationId =
  | 'independence'
  | 'job-seeking'
  | 'after-resignation'
  | 'childcare-prep'
  | 'tax-settlement'
  | 'marriage-prep';

export type CategoryId =
  | 'housing'
  | 'employment-education'
  | 'welfare'
  | 'finance-startup'
  | 'medical';

export type SortOption = 'recommended' | 'deadline' | 'latest';

// ===== 상황 관련 타입 =====

export interface Situation {
  id: SituationId;
  title: string;
  description: string;
  tags: string[]; // 6개 고정
  color?: string; // UI 색상 (선택사항)
}

// ===== 정책 관련 타입 =====

export interface Policy {
  // 기본 식별 정보
  id: string;
  title: string;
  summary: string; // 한줄 요약
  category: CategoryId;
  source: string; // 실시 기관

  // 매칭 관련
  tags: string[];
  situations: SituationId[]; // 이 정책이 타겟하는 상황들

  // 카드용 정보
  target: string; // 지원 대상
  amount: string; // 지원 내용/금액
  period: string; // 신청 기간
  deadline: string; // 마감일 (YYYY-MM-DD)

  // 상세용 정보
  detailedDescription: string; // 상세 설명
  requirements: string; // 신청 자격 요건
  documents: string; // 필요 서류
  process: string; // 신청 절차
  cautions: string; // 주의사항
  applicationUrl: string; // 신청 링크

  // 메타 정보
  createdAt: string; // 생성일
  updatedAt: string; // 수정일
  views?: number; // 조회수 (α 기능용)
}

// ===== α 기능 관련 타입 =====

export interface PolicyTip {
  policyId: string;
  tip: string;
  icon?: string; // 💡 등
}

export interface PolicyUsage {
  policyId: string;
  situationCombination: SituationId[];
  description: string; // "자취+구직하는 분들이 많이 찾아요"
}

export interface PolicyReview {
  id: string;
  policyId: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

// ===== 필터링 관련 타입 =====

export interface FilterOptions {
  categories: CategoryId[];
  sort: SortOption;
  selectedSituations: SituationId[];
}

// ===== 상수 정의 =====

export const SITUATIONS: Record<SituationId, Situation> = {
  independence: {
    id: 'independence',
    title: '자취 시작',
    description: '독립해서 살 준비가 된 분들',
    tags: ['자취', '독립', '생활비', '주거비', '가구', '생활용품'],
    color: '#3B82F6'
  },
  'job-seeking': {
    id: 'job-seeking',
    title: '구직 중',
    description: '새로운 일자리를 찾고 있는 분들',
    tags: ['구직', '취업', '이력서', '면접', '교육', '훈련'],
    color: '#10B981'
  },
  'after-resignation': {
    id: 'after-resignation',
    title: '퇴사 후',
    description: '새로운 시작을 준비하는 분들',
    tags: ['퇴사', '전직', '창업', '교육', '자격증', '재취업'],
    color: '#F59E0B'
  },
  'childcare-prep': {
    id: 'childcare-prep',
    title: '육아 준비',
    description: '아이와 함께하는 새로운 삶',
    tags: ['육아', '임신', '출산', '보육', '교육', '복지'],
    color: '#EC4899'
  },
  'tax-settlement': {
    id: 'tax-settlement',
    title: '연말정산',
    description: '세금 환급과 절세를 준비하는 분들',
    tags: ['연말정산', '세금', '환급', '공제', '신고', '절세'],
    color: '#8B5CF6'
  },
  'marriage-prep': {
    id: 'marriage-prep',
    title: '결혼 준비',
    description: '새로운 가정을 꾸릴 준비',
    tags: ['결혼', '신혼', '주거', '가구', '혼수', '예식'],
    color: '#EF4444'
  }
};

export const CATEGORIES: Record<CategoryId, string> = {
  housing: '주거지원',
  'employment-education': '취업/교육',
  welfare: '생활/복지',
  'finance-startup': '금융/창업',
  medical: '의료지원'
};

export const SORT_OPTIONS: Record<SortOption, string> = {
  recommended: '추천순',
  deadline: '마감임박순',
  latest: '최신순'
}; 