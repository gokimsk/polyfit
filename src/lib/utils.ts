import { Policy, Situation } from '@/types';
import situationsData from '@/data/situations.json';
import policiesData from '@/data/policies.json';

/**
 * 상황 데이터를 로드합니다.
 */
export function loadSituations(): Situation[] {
  return situationsData.situations;
}

/**
 * 정책 데이터를 로드합니다.
 */
export function loadPolicies(): Policy[] {
  return policiesData.policies;
}

/**
 * ID로 정책을 찾습니다.
 */
export function findPolicyById(id: string): Policy | undefined {
  const policies = loadPolicies();
  return policies.find(policy => policy.id === id);
}

/**
 * 상황 ID로 상황을 찾습니다.
 */
export function findSituationById(id: string): Situation | undefined {
  const situations = loadSituations();
  return situations.find(situation => situation.id === id);
}

/**
 * URL 파라미터에서 상황 ID들을 파싱합니다.
 */
export function parseSituationsFromUrl(situationsParam: string | string[] | undefined): string[] {
  if (!situationsParam) return [];
  
  if (Array.isArray(situationsParam)) {
    return situationsParam;
  }
  
  return situationsParam.split(',').filter(Boolean);
}

/**
 * 상황 ID들을 URL 파라미터로 변환합니다.
 */
export function situationsToUrlParam(situations: string[]): string {
  return situations.join(',');
}

/**
 * 날짜를 포맷팅합니다.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 남은 일수를 포맷팅합니다.
 */
export function formatDaysRemaining(days: number): string {
  if (days < 0) return '마감됨';
  if (days === 0) return '오늘 마감';
  if (days === 1) return '내일 마감';
  return `${days}일 남음`;
}

/**
 * 숫자를 천 단위로 포맷팅합니다.
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('ko-KR');
}

/**
 * 외부 링크인지 확인합니다.
 */
export function isExternalLink(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * localStorage에 북마크를 저장합니다.
 */
export function saveBookmark(policyId: string): void {
  if (typeof window === 'undefined') return;
  
  const bookmarks = getBookmarks();
  if (!bookmarks.includes(policyId)) {
    bookmarks.push(policyId);
    localStorage.setItem('polyfit-bookmarks', JSON.stringify(bookmarks));
  }
}

/**
 * localStorage에서 북마크를 제거합니다.
 */
export function removeBookmark(policyId: string): void {
  if (typeof window === 'undefined') return;
  
  const bookmarks = getBookmarks();
  const filteredBookmarks = bookmarks.filter(id => id !== policyId);
  localStorage.setItem('polyfit-bookmarks', JSON.stringify(filteredBookmarks));
}

/**
 * localStorage에서 북마크 목록을 가져옵니다.
 */
export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const bookmarks = localStorage.getItem('polyfit-bookmarks');
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch {
    return [];
  }
}

/**
 * 정책이 북마크되어 있는지 확인합니다.
 */
export function isBookmarked(policyId: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.includes(policyId);
} 