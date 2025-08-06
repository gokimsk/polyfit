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

  // 선택된 태그와 정책 태그 간의 매칭 개수 계산
  const tagMatches = policy.tags.filter(tag => selectedTags.has(tag)).length;
  score += tagMatches * 10; // 태그 매칭은 높은 가중치

  // 2. 상황 매칭 점수 계산
  const situationMatches = policy.situations.filter(situation => 
    selectedSituations.includes(situation)
  ).length;
  score += situationMatches * 5; // 상황 매칭은 중간 가중치

  // 3. 마감 임박 보너스 (30일 이내)
  const today = new Date();
  const deadline = new Date(policy.deadline);
  const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDeadline <= 30 && daysUntilDeadline > 0) {
    score += 1; // 마감 임박 보너스
  }

  return score;
}

/**
 * 상황 ID에 해당하는 태그들을 반환합니다.
 */
function getSituationTags(situationId: SituationId): string[] {
  const situationTags: Record<SituationId, string[]> = {
    independence: ['자취', '독립', '생활비', '주거비', '가구', '생활용품'],
    'job-seeking': ['구직', '취업', '이력서', '면접', '교육', '훈련'],
    'after-resignation': ['퇴사', '전직', '창업', '교육', '자격증', '재취업'],
    'childcare-prep': ['육아', '임신', '출산', '보육', '교육', '복지'],
    'tax-settlement': ['연말정산', '세금', '환급', '공제', '신고', '절세'],
    'marriage-prep': ['결혼', '신혼', '혼례', '신혼부부', '주택', '대출']
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