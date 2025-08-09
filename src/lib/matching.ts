import { Policy, SituationId, SortOption, CategoryId } from '@/types';

/**
 * 정책과 선택된 상황 간의 매칭 점수를 계산합니다.
 * 
 * 매칭 우선순위:
 * 1. 태그 매칭 개수 (가장 중요)
 * 2. 상황 매칭 개수
 * 3. 마감 임박 보너스 (+1점, 30일 이내)
 */
export function calculateMatchScore(
  selectedSituations: SituationId[],
  policy: Policy
): number {
  let score = 0;

  // 1. 태그 매칭 점수 계산
  const selectedTags = new Set<string>();
  selectedSituations.forEach(situationId => {
    // SITUATIONS에서 해당 상황의 태그들을 가져와서 추가
    const situationTags = getSituationTags(situationId);
    situationTags.forEach(tag => selectedTags.add(tag));
  });

  // 디버깅: 태그 매칭 과정 로그
  console.log('🔍 매칭 디버깅:', {
    selectedSituations,
    selectedTags: Array.from(selectedTags),
    policyId: policy.id,
    policyTags: policy.tags,
    policySituations: policy.situations,
    tagType: typeof policy.tags,
    situationType: typeof policy.situations,
    isTagsArray: Array.isArray(policy.tags),
    isSituationsArray: Array.isArray(policy.situations)
  });

  // 선택된 태그와 정책 태그 간의 매칭 개수 계산
  const tagMatches = policy.tags.filter(tag => selectedTags.has(tag)).length;
  score += tagMatches * 10; // 태그 매칭은 높은 가중치

  // 2. 상황 매칭 점수 계산
  const situationMatches = policy.situations.filter(situation => 
    selectedSituations.includes(situation)
  ).length;
  score += situationMatches * 5; // 상황 매칭은 중간 가중치

  // 3. 마감일 단계별 보너스 (90일 이내)
  const today = new Date();
  const deadline = new Date(policy.deadline);
  const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  let deadlineBonus = 0;
  if (daysUntilDeadline <= 7 && daysUntilDeadline > 0) {
    deadlineBonus = 5; // 긴급 (1주일 이내)
    score += deadlineBonus;
  } else if (daysUntilDeadline <= 30 && daysUntilDeadline > 0) {
    deadlineBonus = 3; // 임박 (1개월 이내)
    score += deadlineBonus;
  } else if (daysUntilDeadline <= 90 && daysUntilDeadline > 0) {
    deadlineBonus = 1; // 여유 (3개월 이내)
    score += deadlineBonus;
  }

  console.log('🔍 점수 계산:', {
    policyId: policy.id,
    tagMatches,
    situationMatches,
    daysUntilDeadline,
    deadlineBonus,
    totalScore: score
  });

  return score;
}

/**
 * 상황 ID에 해당하는 태그들을 반환합니다.
 */
function getSituationTags(situationId: SituationId): string[] {
  // 실제 정책 데이터에서 자주 사용되는 태그들로 업데이트
  const situationTags: Record<SituationId, string[]> = {
    independence: ['주거', '청년', '월세', '생활비', '독립', '보증금', '자취', '주거비'],
    'job-seeking': ['취업', '청년', '구직활동', '교육', '자격증', '인턴', '구직', '훈련'],
    'after-resignation': ['실업급여', '이직', '재취업', '교육', '직업훈련', '생활비', '퇴사', '전직'],
    'childcare-prep': ['육아', '돌봄', '출산', '보육', '어린이집', '의료', '임신', '복지'],
    'tax-settlement': ['세금', '공제', '환급', '소득', '절세', '근로소득', '연말정산'],
    'marriage-prep': ['결혼', '신혼', '혼례', '신혼부부', '주택', '대출', '대출금']
  };
  
  return situationTags[situationId] || [];
}

/**
 * 정책들을 필터링하고 정렬합니다.
 */
export function filterAndSortPolicies(
  policies: Policy[],
  selectedSituations: SituationId[],
  sortOption: SortOption = 'recommended',
  category?: CategoryId
): Policy[] {
  let filteredPolicies = policies;

  // 카테고리 필터링
  if (category) {
    filteredPolicies = filteredPolicies.filter(policy => policy.category === category);
  }

  // 매칭 점수 계산
  const policiesWithScore = filteredPolicies.map(policy => ({
    ...policy,
    matchScore: calculateMatchScore(selectedSituations, policy)
  }));

  // 정렬 적용
  switch (sortOption) {
    case 'recommended':
      return policiesWithScore
        .sort((a, b) => b.matchScore - a.matchScore)
        .map(({ matchScore, ...policy }) => policy);

    case 'deadline':
      return policiesWithScore
        .sort((a, b) => {
          const aDeadline = new Date(a.deadline);
          const bDeadline = new Date(b.deadline);
          return aDeadline.getTime() - bDeadline.getTime();
        })
        .map(({ matchScore, ...policy }) => policy);

    case 'latest':
      return policiesWithScore
        .sort((a, b) => {
          const aCreated = new Date(a.createdAt);
          const bCreated = new Date(b.createdAt);
          return bCreated.getTime() - aCreated.getTime();
        })
        .map(({ matchScore, ...policy }) => policy);

    default:
      return policiesWithScore
        .sort((a, b) => b.matchScore - a.matchScore)
        .map(({ matchScore, ...policy }) => policy);
  }
}

/**
 * 정책의 마감일까지 남은 일수를 계산합니다.
 */
export function getDaysUntilDeadline(deadline: string): number {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 마감 임박 여부를 확인합니다 (30일 이내).
 */
export function isDeadlineSoon(deadline: string): boolean {
  const daysUntilDeadline = getDaysUntilDeadline(deadline);
  return daysUntilDeadline <= 30 && daysUntilDeadline > 0;
}

/**
 * 마감 상태를 반환합니다.
 */
export function getDeadlineStatus(deadline: string): 'active' | 'soon' | 'expired' {
  const daysUntilDeadline = getDaysUntilDeadline(deadline);
  
  if (daysUntilDeadline < 0) return 'expired';
  if (daysUntilDeadline <= 30) return 'soon';
  return 'active';
} 