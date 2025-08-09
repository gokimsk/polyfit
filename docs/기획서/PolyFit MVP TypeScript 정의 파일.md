# PolyFit MVP TypeScript 정의 파일

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
tags: string[]; // 8개 권장 (확장 태그 지원)
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

export interface SearchParams {
situations: SituationId[];
category?: CategoryId;
sort?: SortOption;
}

// ===== 매칭 관련 타입 =====

export interface MatchResult {
policy: Policy;
score: number;
matchingTags: string[];
matchingSituations: SituationId[];
reason: string; // 추천 이유
}

export interface MatchingWeight {
tagMatch: number; // 태그 매칭 기본 점수
situationMatch: number; // 상황 매칭 가중치
deadlineBonus: number; // 마감 임박 보너스
}

// ===== UI 상태 관리 타입 =====

export interface AppState {
selectedSituations: SituationId[];
currentPolicies: Policy[];
filters: FilterOptions;
loading: boolean;
error: string | null;
}

export interface PolicyCardProps {
policy: Policy;
matchScore?: number;
reason?: string;
onClick?: (policy: Policy) => void;
showBookmark?: boolean;
}

export interface SituationCardProps {
situation: Situation;
selected: boolean;
onClick: (situation: Situation) => void;
disabled?: boolean; // 최대 3개 선택 제한
}

// ===== 북마크 관련 타입 (α 기능) =====

export interface BookmarkState {
bookmarkedPolicyIds: string[];
}

export interface BookmarkActions {
addBookmark: (policyId: string) => void;
removeBookmark: (policyId: string) => void;
isBookmarked: (policyId: string) => boolean;
}

// ===== 라우팅 관련 타입 =====

export interface RouteParams {
situations?: string; // 쉼표로 구분된 situation IDs
category?: CategoryId;
sort?: SortOption;
policyId?: string;
}

// ===== 상수 정의 =====

export const SITUATIONS: Situation[] = [
{
id: 'independence',
title: '자취 시작',
description: '독립생활을 위한 주거 지원',
tags: ['#주거', '#청년', '#월세', '#생활비', '#독립', '#보증금']
},
{
id: 'job-seeking',
title: '구직 중',
description: '취업 준비와 구직활동 지원',
tags: ['#취업', '#청년', '#구직활동', '#교육', '#자격증', '#인턴']
},
{
id: 'after-resignation',
title: '퇴사 후',
description: '재취업과 생활안정 지원',
tags: ['#실업급여', '#이직', '#재취업', '#교육', '#직업훈련', '#생활비']
},
{
id: 'childcare-prep',
title: '육아 준비',
description: '출산과 육아를 위한 지원',
tags: ['#육아', '#돌봄', '#출산', '#보육', '#어린이집', '#의료']
},
{
id: 'tax-settlement',
title: '연말정산',
description: '세금 혜택과 공제 정보',
tags: ['#세금', '#공제', '#환급', '#소득', '#절세', '#근로소득']
},
{
id: 'marriage-prep',
title: '결혼 준비',
description: '혼례와 신혼생활 준비 지원',
tags: ['#결혼', '#신혼', '#혼례', '#신혼부부', '#주택', '#대출']
}
];

export const CATEGORIES = [
{ id: 'housing', name: '주거지원' },
{ id: 'employment-education', name: '취업/교육' },
{ id: 'welfare', name: '생활/복지' },
{ id: 'finance-startup', name: '금융/창업' },
{ id: 'medical', name: '의료지원' }
] as const;

export const SORT_OPTIONS = [
{ id: 'recommended', name: '추천순' },
{ id: 'deadline', name: '마감임박순' },
{ id: 'latest', name: '최신순' }
] as const;

// ===== 유틸리티 타입 =====

export type SelectableSituation = Situation & {
selectable: boolean;
maxReached?: boolean;
};

export type PolicyWithMatch = Policy & {
matchScore: number;
matchReason: string;
};

// ===== API 응답 타입 (향후 확장용) =====

export interface ApiResponse<T> {
data: T;
success: boolean;
message?: string;
timestamp: string;
}

export interface PaginatedResponse<T> {
items: T[];
total: number;
page: number;
limit: number;
hasNext: boolean;
}