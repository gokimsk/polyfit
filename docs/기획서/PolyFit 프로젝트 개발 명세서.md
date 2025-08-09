# PolyFit 프로젝트 개발 명세서 v2.0

**프로젝트**: PolyFit - 상황 기반 정책 추천 서비스

**문서 버전**: v2.0

**작성일**: 2025.08.02

**진행 상황**: 기획 완료, 개발 준비 완료

**예상 기간**: 3주 (15일)

---

## 📊 1. 프로젝트 개요

### 🎯 비즈니스 목표

- **문제 정의**: 정책 정보 탐색의 복잡성과 부정확성 해결
- **솔루션**: SNS 친화적 "상황 선택형" UI로 맞춤 정책 추천
- **타겟 사용자**: 청년(20-30대) 구직자, 독립 예정자, 퇴사자, 육아 준비자, 결혼 준비자
- **핵심 가치**: 3클릭 내 원하는 정책 발견, 공식 사이트 직접 연결

### 📈 성공 지표 (MVP)

| 지표 | 목표값 | 측정 방법 |
| --- | --- | --- |
| 정책 발견율 | 90%+ | 3클릭 내 원하는 정책 발견 |
| 신청 전환율 | 20%+ | 상세 페이지 → 신청 링크 클릭 |
| 재방문율 | 20%+ | 월 1회 이상 재방문 |
| 매칭 정확도 | 30%+ | 추천된 정책 클릭률 |

---

## 🛠️ 2. 기술 명세

### 🔧 기술 스택

| 영역 | 기술 | 버전 | 비고 |
| --- | --- | --- | --- |
| Frontend | Next.js | 14 (App Router) | React 기반 풀스택 프레임워크 |
| 언어 | TypeScript | 5.0+ | 타입 안정성 확보 |
| 스타일링 | Tailwind CSS | 3.0+ | 유틸리티 기반 CSS |
| 배포 | Vercel | - | GitHub 연동 자동 배포 |
| 데이터 | JSON 파일 + Google Sheets | - | Google Sheets 자동화 연동 |
| 자동화 | GitHub Actions | - | 정책 데이터 자동 업데이트 |

### 🏗️ 아키텍처 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 메인 페이지 (상황 선택)
│   ├── policies/
│   │   ├── page.tsx       # 정책 리스트
│   │   └── [id]/page.tsx  # 정책 상세
│   └── bookmarks/page.tsx # 북마크 (α기능)
├── components/            # 재사용 컴포넌트
│   ├── SituationCard.tsx
│   ├── PolicyCard.tsx
│   └── FilterSection.tsx
├── lib/                   # 유틸리티 함수
│   └── matching.ts        # 매칭 알고리즘
├── types/                 # TypeScript 타입 정의
│   └── index.ts
└── data/                  # 정적 데이터
    ├── situations.json
    ├── policies.json
    ├── tips.json
    └── reviews.json

```

### 🔄 데이터 플로우

```
1. 사용자 상황 선택 (최대 3개)
   ↓
2. URL 파라미터로 선택 상황 전달
   ↓
3. 태그 매칭 알고리즘 실행
   ↓
4. 매칭 점수 기반 정책 정렬
   ↓
5. 필터링/정렬 옵션 적용
   ↓
6. 정책 리스트 표시

```

---

## 🏷️ 3. 핵심 기능 명세

### 3.1 상황 선택 기능

```tsx
// 기능 요구사항
- 6개 상황카드 제공 (자취시작, 구직중, 퇴사후, 육아준비, 연말정산, 결혼준비)
- 최대 3개까지 다중 선택 가능
- 선택 상태 시각적 피드백 (테두리 + 체크 아이콘)
- 4번째 선택 시 나머지 카드 비활성화

// 상태 관리
interface AppState {
  selectedSituations: SituationId[];  // 최대 3개
  maxSelectionReached: boolean;
}

// 버튼 텍스트 동적 변경
0개: "상황을 선택해주세요" (비활성화)
1개: "1개 상황으로 정책 찾기"
2개: "2개 상황으로 정책 찾기"
3개: "3개 상황으로 정책 찾기"

```

### 3.2 태그 매칭 알고리즘 (업데이트 v2.0)

```tsx
function calculateMatchScore(selectedSituations: Situation[], policy: Policy): number {
  let score = 0;

  // 1순위: 태그 매칭 개수 (높은 가중치 - 매칭당 10점)
  const userTags = selectedSituations.flatMap(s => s.tags);
  const matchingTags = policy.tags.filter(tag => userTags.includes(tag));
  score += matchingTags.length * 10;

  // 2순위: 상황 매칭 개수 (중간 가중치 - 매칭당 5점)
  const matchingSituations = policy.situations.filter(s =>
    selectedSituations.map(sit => sit.id).includes(s)
  );
  score += matchingSituations.length * 5;

  // 3순위: 마감일 단계별 보너스 (90일 이내)
  const deadline = new Date(policy.deadline);
  const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24));
  
  let deadlineBonus = 0;
  if (daysLeft <= 7 && daysLeft > 0) {
    deadlineBonus = 5; // 긴급 (1주일 이내)
  } else if (daysLeft <= 30 && daysLeft > 0) {
    deadlineBonus = 3; // 임박 (1개월 이내)
  } else if (daysLeft <= 90 && daysLeft > 0) {
    deadlineBonus = 1; // 여유 (3개월 이내)
  }
  score += deadlineBonus;

  return score;
}

// 점수 체계 상세
- 태그 매칭: 매칭당 10점 (최우선)
- 상황 매칭: 매칭당 5점 (중간)
- 마감 긴급: 5점 (7일 이내)
- 마감 임박: 3점 (30일 이내)
- 마감 여유: 1점 (90일 이내)

// 정렬 우선순위 (동점 시)
1. 매칭 점수 (내림차순)
2. 마감일 (오름차순)
3. 조회수 (내림차순)
4. 업데이트일 (내림차순)

```

### 3.3 정책 데이터 구조

```tsx
interface Policy {
  // 기본 식별 정보
  id: string;
  title: string;
  summary: string;                    // 한줄 요약
  category: CategoryId;               // 5개 카테고리
  source: string;                     // 실시 기관

  // 매칭 관련
  tags: string[];                     // 매칭용 태그
  situations: SituationId[];          // 타겟 상황

  // 카드 표시용
  target: string;                     // 지원 대상
  amount: string;                     // 지원 내용/금액
  period: string;                     // 신청 기간
  deadline: string;                   // 마감일 (YYYY-MM-DD)

  // 상세 페이지용
  detailedDescription: string;
  requirements: string;               // 신청 자격
  documents: string;                  // 필요 서류
  process: string;                    // 신청 절차
  cautions: string;                   // 주의사항
  applicationUrl: string;             // 신청 링크
}

```

### 3.4 정책 데이터 엑셀 작성 가이드

#### 📝 컬럼별 작성 양식 및 기준

| 컬럼 | 필수 | 양식 | 예시 | 주의사항 |
|------|------|------|------|----------|
| **id** | ✅ | `카테고리-숫자3자리` | `youth-housing-001` | 소문자, 하이픈 구분 |
| **title** | ✅ | 공식 정책명 | "청년 월세 특별지원" | - |
| **summary** | ✅ | 한 문장 요약 | "무주택 청년의 주거비 부담을 덜어주기 위한 월세 지원 정책입니다." | 마침표로 끝남, 50자 내외 |
| **category** | ✅ | 고정값 | `housing` | `housing`(주거지원) \| `employment-education`(취업/교육) \| `welfare`(생활/복지) \| `finance-startup`(금융/창업) \| `medical`(의료지원) |
| **source** | ✅ | 정식 기관명 | "국토교통부" | - |
| **tags** | ✅ | JSON 배열 | `["주거", "청년", "월세", "생활비"]` | 4-8개 태그 권장 (확장 태그 지원) |
| **situations** | ✅ | JSON 배열 | `["independence"]` | `independence`(자취시작) \| `job-seeking`(구직중) \| `after-resignation`(퇴사후) \| `childcare-prep`(육아준비) \| `tax-settlement`(연말정산) \| `marriage-prep`(결혼준비) |
| **target** | ✅ | 구체적 대상 | "만 19~34세 청년" | - |
| **amount** | ✅ | 금액+기간 | "월 최대 20만원 지원 (최대 12개월)" | - |
| **period** | ✅ | 신청기간 | "2024년 1월 ~ 12월" | - |
| **deadline** | ✅ | ISO 날짜 | `2024-12-31` | **반드시 YYYY-MM-DD 형식** |
| **detailedDescription** | ✅ | 상세설명 | "본 정책은 주거비 부담으로 어려움을 겪는..." | 2-3문장 |
| **requirements** | ✅ | 자격조건 | "만 19~34세 청년, 무주택자, 소득 기준 충족" | 쉼표 구분 |
| **documents** | ✅ | 서류목록 | "신분증, 임대차계약서, 소득증명서류" | 쉼표 구분 |
| **process** | ✅ | 신청절차 | "온라인 신청 → 서류 검토 → 자격 확인" | 화살표(→) 구분 |
| **cautions** | ✅ | 주의사항 | "최초 신청 후 지원 여부 결정 통보" | 1-2문장 |
| **applicationUrl** | ✅ | 완전한 URL | `https://www.gov.kr/portal/service/...` | **https:// 필수** |
| **createdAt** | ✅ | ISO 날짜 | `2024-01-01` | **반드시 YYYY-MM-DD 형식** |
| **updatedAt** | ⭕ | ISO 날짜 | `2024-08-01` | YYYY-MM-DD 형식 |
| **views** | ⭕ | 숫자 | `15400` | 선택사항 |

#### ⚠️ 필수 준수사항

1. **날짜 필드**: `deadline`, `createdAt`, `updatedAt`는 반드시 `YYYY-MM-DD` 형식
2. **JSON 배열**: `tags`, `situations`는 JSON 배열 형태로 작성
3. **고정값**: `category`, `situations`는 정해진 값만 사용 가능
4. **URL**: `applicationUrl`은 `https://`로 시작하는 완전한 URL

#### 📋 작성 순서 권장사항

1. **1단계**: 기본정보 (id, title, summary, category, source)
2. **2단계**: 매칭정보 (tags, situations)  
3. **3단계**: 카드정보 (target, amount, period, deadline)
4. **4단계**: 상세정보 (detailedDescription, requirements, documents, process, cautions, applicationUrl)
5. **5단계**: 메타정보 (createdAt, updatedAt, views)

---

## 🎨 4. UI/UX 설계

### 4.1 페이지 구조 (IA)

```
🏠 메인 페이지 (/)
├── 헤더: PolyFit 로고
├── 메인: "요즘 이런 상황이신가요?" + 6개 상황카드
└── 액션: "선택한 상황으로 정책 찾기" 버튼

📋 정책 리스트 (/policies?situations=a,b,c)
├── 헤더: 뒤로가기 + "맞춤 정책 (X개)"
├── 상황 표시: 선택된 상황 태그들
├── 필터: 정렬 옵션 + 카테고리 필터
└── 콘텐츠: 정책카드 리스트 (매칭 점수 표시)

📄 정책 상세 (/policies/[id])
├── 헤더: 뒤로가기 + 공유하기
├── 메인 정보: 상황 매칭 + 정책 제목 + 설명
├── 기본 정보: 대상/지원/기간 (테이블)
├── 상세 정보: 아코디언 (자격요건/서류/절차/주의사항)
├── α 기능: 활용팁 + 이용현황 + 후기
├── 추천: 관련 정책 3-5개
└── 액션: "신청하기" 버튼 (외부 링크 확인 팝업)

```

### 4.2 반응형 디자인

| 디바이스 | 브레이크포인트 | 상황카드 | 정책카드 | 특징 |
| --- | --- | --- | --- | --- |
| 모바일 | 375px~ | 2x3 그리드 | 단일 컬럼 | 풀스크린 세로 스크롤 |
| 태블릿 | 768px~ | 2x3 그리드 | 2컬럼 | 여백 증가, 카드 확대 |
| 데스크탑 | 1024px~ | 3x2 그리드 | 2-3컬럼 | 최대 너비 제한 + 중앙 정렬 |

### 4.3 상호작용 설계

```tsx
// 상황카드 선택
onClick(situation) {
  if (selectedSituations.length < 3 || selectedSituations.includes(situation)) {
    toggleSituation(situation);
  }
  // 3개 초과 시 무시
}

// 외부 링크 이동 확인
onApplicationClick() {
  showConfirmModal({
    title: "외부 사이트로 이동",
    message: "정책 신청을 위해 외부 사이트로 이동합니다.",
    onConfirm: () => window.open(applicationUrl, '_blank'),
    onCancel: () => closeModal()
  });
}

// 북마크 기능 (α기능)
localStorage: {
  "polyfit_bookmarks": ["policy-001", "policy-002"]
}

```

---

## 📋 5. 개발 가이드

### 5.1 개발 환경 설정

```bash
# 1. 프로젝트 초기화
npx create-next-app@latest polyfit --typescript --tailwind --app

# 2. 필요 패키지 설치
npm install lucide-react  # 아이콘

# 3. 폴더 구조 생성
mkdir -p src/{components,lib,types,data}

# 4. Vercel 배포 설정
vercel init

```

### 5.2 개발 단계별 체크리스트

### Phase 1: 기반 구축 (Day 1-5)

- [ ]  Next.js 프로젝트 초기화 및 Vercel 배포
- [ ]  TypeScript 타입 정의 완성 (`src/types/index.ts`)
- [ ]  정적 데이터 파일 생성 (`src/data/*.json`)
- [ ]  메인 페이지 구현 (상황카드 선택 UI)
- [ ]  태그 매칭 알고리즘 구현 (`src/lib/matching.ts`)

### Phase 2: 핵심 기능 (Day 6-10)

- [ ]  정책 리스트 페이지 구현 (필터링 + 정렬)
- [ ]  정책 상세 페이지 구현 (아코디언 + 상세 정보)
- [ ]  외부 링크 이동 확인 팝업
- [ ]  20-30개 실제 정책 데이터 수집 및 입력
- [ ]  전체 사용자 플로우 테스트

### Phase 3: 완성도 향상 (Day 11-15)

- [ ]  α 기능 구현 (활용팁, 이용현황, 후기)
- [ ]  북마크 기능 구현 (localStorage 기반)
- [ ]  반응형 디자인 최적화
- [ ]  접근성 개선 (aria-label, 키보드 내비게이션)
- [ ]  성능 최적화 (Lighthouse 90점+ 목표)

### 5.3 중요 제약사항

```tsx
// ⚠️ 절대 금지 사항
- sessionStorage 사용 (Claude.ai 환경 미지원)
- 외부 CDN이 아닌 스크립트 import
- 백엔드 API 호출 (정적 JSON만 사용)

// ✅ 권장 사항
- localStorage만 사용 (북마크용)
- https://cdnjs.cloudflare.com 에서만 외부 라이브러리 import
- React.memo를 통한 컴포넌트 최적화
- TypeScript strict 모드 사용

```

### 5.4 Cursor AI 협업 프롬프트

```
단계별 프롬프트 예시:

1. "PolyFit 메인 페이지 구현 - 6개 상황카드 2x3 그리드, 최대 3개 선택, 버튼 텍스트 동적 변경"

2. "태그 매칭 알고리즘 - calculateMatchScore 함수, 태그 개수 + 상황 매칭 + 마감 임박 보너스"

3. "정책 리스트 페이지 - 필터링(5개 카테고리) + 정렬(3개 옵션) + 매칭 점수 표시"

4. "정책 상세 페이지 - 아코디언 상세 정보 + 외부 링크 확인 팝업 + 관련 정책 추천"

5. "북마크 기능 - localStorage 기반 즐겨찾기, 하트 아이콘 토글"

```

---

## 🔄 5.5 자동화 워크플로우

### Google Sheets 연동 파이프라인

```mermaid
graph LR
    A[Google Sheets<br/>정책 데이터] --> B[GitHub Actions<br/>Cron Job]
    B --> C[데이터 변환<br/>Scripts]
    C --> D[JSON 파일<br/>업데이트]
    D --> E[Git Commit<br/>& Push]
    E --> F[Vercel<br/>자동 배포]
```

### 자동화 구성 요소

| 구성요소 | 역할 | 실행 주기 |
|----------|------|-----------|
| **Google Sheets API** | 정책 데이터 원본 소스 | 실시간 |
| **GitHub Actions** | 자동화 워크플로우 실행 | 매일 00:00 UTC |
| **scripts/update-policies.js** | 데이터 변환 및 검증 | 트리거 시 |
| **stefanzweifel/git-auto-commit-action** | 안전한 Git 커밋/푸시 | 데이터 변경 시 |
| **Vercel** | 자동 배포 및 CDN 업데이트 | 코드 변경 시 |

### 데이터 처리 프로세스

1. **추출**: Google Sheets API로 데이터 가져오기
2. **변환**: CSV → JSON 구조 변환
3. **검증**: 필수 필드 및 데이터 타입 확인
4. **정규화**: 헤더명 통일, 배열 변환 등
5. **저장**: `src/data/*.json` 파일 업데이트
6. **배포**: Git 커밋 → Vercel 자동 배포

---

## 📊 6. 데이터 명세

### 6.1 상황별 태그 시스템 (확장 버전)

| 상황 ID | 상황명 | 태그 (8개) | 비고 |
| --- | --- | --- | --- |
| independence | 자취 시작 | #주거 #청년 #월세 #생활비 #독립 #보증금 #자취 #주거비 | 실제 데이터 기반 확장 |
| job-seeking | 구직 중 | #취업 #청년 #구직활동 #교육 #자격증 #인턴 #구직 #훈련 | 포괄적 매칭 향상 |
| after-resignation | 퇴사 후 | #실업급여 #이직 #재취업 #교육 #직업훈련 #생활비 #퇴사 #전직 | 이직 관련 확장 |
| childcare-prep | 육아 준비 | #육아 #돌봄 #출산 #보육 #어린이집 #의료 #임신 #복지 | 의료/복지 추가 |
| tax-settlement | 연말정산 | #세금 #공제 #환급 #소득 #절세 #근로소득 #연말정산 | 세금 관련 명시 |
| marriage-prep | 결혼 준비 | #결혼 #신혼 #혼례 #신혼부부 #주택 #대출 #대출금 | 금융 지원 확장 |

### 6.2 카테고리 시스템

| 카테고리 ID | 카테고리명 | 설명 |
| --- | --- | --- |
| housing | 주거지원 | 월세, 전세, 주택 구입 관련 |
| employment-education | 취업/교육 | 구직, 교육, 자격증, 훈련 |
| welfare | 생활/복지 | 생활비, 의료, 돌봄 지원 |
| finance-startup | 금융/창업 | 대출, 투자, 창업 지원 |
| medical | 의료지원 | 의료비, 건강 관련 지원 |

### 6.3 데이터 수집 계획

```
📊 총 20-30개 정책 (MVP 범위)

정부24 정책 (10개)
├── 청년 월세 지원
├── 청년 구직활동 지원금
├── 국민취업지원제도
├── 출산급여
└── 기타 중앙부처 정책

지자체 정책 (5개)
├── 서울시 청년수당
├── 경기도 청년 지원
└── 기타 지역별 정책

공단/공제회 정책 (5개)
├── 국민연금 출산크레딧
├── 건강보험 임신/출산 급여
├── 근로복지공단 지원
└── 기타 공단 정책

```

---

## 🚀 7. 배포 및 운영

### 7.1 배포 플로우

```
GitHub Repository → Vercel 자동 배포

개발 브랜치: develop
운영 브랜치: main
배포 도메인: polyfit.vercel.app (예정)

```

### 7.2 모니터링 지표

| 지표 | 도구 | 목표값 |
| --- | --- | --- |
| 성능 | Lighthouse | 90점+ |
| 로딩 속도 | Vercel Analytics | 3초 이하 |
| 오류율 | Vercel 로그 | 1% 이하 |
| 사용자 플로우 | Google Analytics | 설정 예정 |

---

## 📞 8. 지원 및 문의

### 개발 지원

- **기술 문의**: 바이브클럽 커뮤니티
- **Cursor AI**: 프롬프트 최적화 및 코드 생성
- **문서 참조**: PolyFit 서비스 개요, TypeScript 정의서, 기능명세서

### 핵심 개발 원칙

1. **기본에 충실**: 복잡한 기능보다 기본 기능의 완성도 우선
2. **사용자 중심**: 3클릭 내 정책 발견을 목표로 UX 설계
3. **점진적 개선**: MVP → α기능 → Phase 2 순차 확장
4. **데이터 품질**: 정확하고 최신의 정책 정보 유지

---

**📝 문서 관리**

- 최종 수정: 2025.08.02
- 다음 업데이트: 개발 완료 후
- 책임자: 태석 + Claude
- 승인: 프로젝트 스테이크홀더

*이 문서는 PolyFit 프로젝트의 완전한 개발 가이드이며, 팀 내 공유 및 신규 개발자 온보딩용으로 활용 가능합니다.*