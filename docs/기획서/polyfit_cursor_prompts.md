# PolyFit Cursor AI 프롬프트 가이드

**프로젝트**: PolyFit - 상황 기반 정책 추천 서비스  
**개발 방식**: 개인 개발 (바이브코딩)  
**작성일**: 2025.08.02  
**사용법**: 각 단계별 프롬프트를 복사해서 Cursor AI에 입력

---

## 📋 기본 설정 프롬프트

### 🔧 프로젝트 초기화
```
PolyFit이라는 상황 기반 정책 추천 서비스를 만들 거야.

기술스택:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel 배포

프로젝트 구조를 다음과 같이 만들어줘:
```
src/
├── app/
│   ├── page.tsx
│   ├── policies/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── bookmarks/page.tsx
├── components/
├── lib/
├── types/
└── data/
```

필요한 패키지도 설치 명령어 알려줘.
```

### 📝 TypeScript 타입 정의
```
PolyFit 프로젝트의 TypeScript 타입을 정의해줘.

src/types/index.ts 파일에 다음 타입들을 만들어줘:

핵심 타입:
- SituationId: 6개 상황 (independence, job-seeking, after-resignation, childcare-prep, tax-settlement, marriage-prep)
- CategoryId: 5개 카테고리 (housing, employment-education, welfare, finance-startup, medical)
- Policy 인터페이스: id, title, summary, category, tags, situations, target, amount, period, deadline, applicationUrl 등
- Situation 인터페이스: id, title, description, tags (6개씩)

상수 정의:
- SITUATIONS 배열 (6개 상황 정보)
- CATEGORIES 배열 (5개 카테고리)
- SORT_OPTIONS 배열 (추천순, 마감임박순, 최신순)

매칭 관련:
- MatchResult 인터페이스
- FilterOptions 인터페이스
- AppState 인터페이스
```

---

## 🏠 메인 페이지 구현

### 📱 상황 선택 카드
```
PolyFit 메인 페이지를 구현해줘.

app/page.tsx에 다음 기능을 만들어줘:

레이아웃:
- "요즘 이런 상황이신가요?" 헤딩
- 6개 상황카드 그리드 (모바일 2x3, 데스크탑 3x2)
- "선택한 상황으로 정책 찾기" 버튼

상황카드 기능:
- 최대 3개까지 선택 가능
- 선택 시 테두리 강조 + 체크 아이콘
- 4번째 클릭 시 비활성화
- 3개 선택 완료 시 나머지 카드 회색 처리

버튼 텍스트 변화:
- 0개: "상황을 선택해주세요" (비활성화)
- 1개: "1개 상황으로 정책 찾기"
- 2개: "2개 상황으로 정책 찾기"
- 3개: "3개 상황으로 정책 찾기"

클릭 시 /policies?situations=id1,id2,id3 형태로 라우팅

타입은 src/types/index.ts에서 import해서 사용해줘.
```

### 🎨 상황카드 컴포넌트
```
components/SituationCard.tsx 컴포넌트를 만들어줘.

Props:
- situation: Situation 타입
- selected: boolean
- onClick: (situation: Situation) => void
- disabled?: boolean

디자인:
- 카드 형태 (rounded, shadow)
- 상황별 고유 색상 (선택 시 테두리 강조)
- 아이콘 + 제목 + 설명
- 선택 시 체크 아이콘 표시
- disabled 시 회색 처리 + 클릭 불가

반응형:
- 모바일: 작은 카드
- 태블릿/데스크탑: 큰 카드

Tailwind CSS 사용해줘.
```

---

## 🔍 매칭 시스템 구현

### ⚙️ 태그 매칭 알고리즘
```
lib/matching.ts 파일에 정책 매칭 알고리즘을 구현해줘.

calculateMatchScore 함수:
1순위: 태그 매칭 개수 (기본 점수)
2순위: 상황 매칭 개수 (policy.situations에 선택된 상황이 포함된 개수)
3순위: 마감 임박 보너스 (+1점, 30일 이내)

```typescript
function calculateMatchScore(selectedSituations: Situation[], policy: Policy): number {
  let score = 0;
  
  // 1순위: 태그 매칭
  const userTags = selectedSituations.flatMap(s => s.tags);
  const matchingTags = policy.tags.filter(tag => userTags.includes(tag));
  score += matchingTags.length;
  
  // 2순위: 상황 매칭
  const matchingSituations = policy.situations.filter(s => 
    selectedSituations.map(sit => sit.id).includes(s)
  );
  score += matchingSituations.length;
  
  // 3순위: 마감 임박 (30일 이내 +1점)
  const deadline = new Date(policy.deadline);
  const daysLeft = (deadline - new Date()) / (1000 * 60 * 60 * 24);
  if (daysLeft <= 30 && daysLeft > 0) score += 1;
  
  return score;
}
```

추가로 filterAndSortPolicies 함수도 만들어줘:
- 매칭 점수 계산
- 정렬 (추천순/마감임박순/최신순)
- 카테고리 필터링
```

### 📊 샘플 데이터 생성
```
data/situations.json과 data/policies.json 파일을 만들어줘.

situations.json:
6개 상황의 정보 (id, title, description, tags)
- 자취 시작: #주거 #청년 #월세 #생활비 #독립 #보증금
- 구직 중: #취업 #청년 #구직활동 #교육 #자격증 #인턴
- 퇴사 후: #실업급여 #이직 #재취업 #교육 #직업훈련 #생활비
- 육아 준비: #육아 #돌봄 #출산 #보육 #어린이집 #의료
- 연말정산: #세금 #공제 #환급 #소득 #절세 #근로소득
- 결혼 준비: #결혼 #신혼 #혼례 #신혼부부 #주택 #대출

policies.json:
각 상황별로 2-3개씩 총 15개 정책 샘플 데이터
실제 정책명 참고해서 만들어줘 (청년 월세 지원, 국민취업지원제도 등)
```

---

## 📋 정책 리스트 페이지

### 🗂️ 정책 리스트 구현
```
app/policies/page.tsx를 구현해줘.

기능:
- URL 파라미터에서 situations 추출 (?situations=id1,id2,id3)
- 선택된 상황 표시 (태그 형태)
- 필터링 섹션 (정렬 + 카테고리)
- 정책카드 리스트 (매칭 점수 표시)

헤더:
- 뒤로가기 버튼
- "맞춤 정책 (X개)" 제목

필터 섹션:
- 정렬: 추천순(기본), 마감임박순, 최신순
- 카테고리: 주거지원, 취업/교육, 생활/복지, 금융/창업, 의료지원

정책카드:
- 매칭 점수 표시 (⭐ XX% 일치)
- 정책 제목, 한줄 요약
- 실시 기관, 대상, 지원내용, 기간
- 클릭 시 상세 페이지로 이동

로딩 상태와 빈 결과 처리도 포함해줘.
```

### 🎯 정책카드 컴포넌트
```
components/PolicyCard.tsx를 만들어줘.

Props:
- policy: Policy
- matchScore?: number
- onClick?: (policy: Policy) => void

레이아웃:
- 카드 형태 (hover 효과)
- 상단: 매칭 점수 (95% 일치 형태)
- 메인: 정책 제목 + 한줄 요약
- 하단: 대상 | 지원내용 | 기간 (테이블 형태)
- 푸터: 실시 기관 + 관련 태그들

스타일:
- 깔끔한 카드 디자인
- 매칭 점수에 따른 색상 구분 (90%+ 초록, 70%+ 파랑, 그 외 회색)
- 반응형 (모바일: 풀 너비, 데스크탑: 고정 너비)

클릭 시 /policies/[id] 페이지로 이동
```

---

## 📄 정책 상세 페이지

### 🔍 상세 페이지 구현
```
app/policies/[id]/page.tsx를 구현해줘.

페이지 구조:
1. 헤더 (뒤로가기 + 공유하기)
2. 메인 정보 카드 (상황 매칭 + 제목 + 설명)
3. 기본 정보 (대상/지원/기간)
4. 상세 정보 아코디언 (자격요건/서류/절차/주의사항)
5. 관련 정책 추천 (3-5개)
6. 신청하기 버튼

기본 정보 섹션:
- 👥 지원대상
- ⭐ 지원내용  
- 📅 신청기간

아코디언 섹션:
- 🟢 신청 자격 요건 (접기/펼치기)
- 📋 필요 서류 (접기/펼치기)
- ⚠️ 신청 시 주의사항 (접기/펼치기)

신청하기 버튼:
- 클릭 시 외부 사이트 이동 확인 팝업
- 새 탭에서 열기 (target="_blank")

동적 라우팅으로 policy ID 추출해서 해당 정책 정보 표시
```

### 🔗 외부 링크 확인 팝업
```
components/ExternalLinkModal.tsx를 만들어줘.

기능:
- 외부 사이트 이동 전 확인 팝업
- 모달 배경 클릭 시 닫기
- ESC 키로 닫기

내용:
- 제목: "외부 사이트로 이동"
- 설명: "정책 신청을 위해 외부 사이트로 이동합니다."
- 버튼: "취소" / "이동하기"

Props:
- isOpen: boolean
- onClose: () => void
- onConfirm: () => void
- url: string

스타일:
- 모달 오버레이 + 중앙 정렬
- 깔끔한 카드 디자인
- 버튼 hover 효과
```

---

## 🎁 추가 기능 (α기능)

### 🔖 북마크 기능
```
북마크 기능을 구현해줘.

localStorage 구조:
```json
{
  "polyfit_bookmarks": ["policy-001", "policy-002"]
}
```

구현 위치:
1. lib/bookmarks.ts - localStorage 관리 함수들
2. components/BookmarkButton.tsx - 하트 아이콘 버튼
3. app/bookmarks/page.tsx - 북마크 목록 페이지

BookmarkButton:
- 하트 아이콘 (채워진 하트 vs 빈 하트)
- 클릭 시 북마크 추가/제거
- 정책카드와 상세페이지에서 사용

북마크 페이지:
- 저장된 정책들 리스트
- 빈 상태: "아직 북마크한 정책이 없습니다"
- 북마크 해제 기능
```

### 💡 활용 팁 기능
```
정책 상세 페이지에 활용 팁 섹션을 추가해줘.

data/tips.json 구조:
```json
[
  {
    "policyId": "policy-001",
    "tip": "💡 소득 인정액 기준을 미리 확인하세요",
    "description": "신청 전 소득 계산기로 미리 확인하면 시간을 절약할 수 있어요."
  }
]
```

components/PolicyTips.tsx:
- 정책 ID에 해당하는 팁들 표시
- 아이콘 + 팁 제목 + 설명
- 접기/펼치기 가능
- 팁이 없는 경우 섹션 숨김

각 정책별로 1-2개씩 실용적인 팁 데이터 만들어줘.
```

---

## 🎨 스타일링 및 완성도

### 📱 반응형 디자인
```
전체 앱의 반응형 디자인을 완성해줘.

브레이크포인트:
- 모바일: 375px~767px
- 태블릿: 768px~1023px  
- 데스크탑: 1024px~

메인 페이지:
- 모바일: 상황카드 2x3 그리드
- 데스크탑: 상황카드 3x2 그리드

정책 리스트:
- 모바일: 단일 컬럼 스택
- 태블릿: 카드 크기 확대
- 데스크탑: 2컬럼 또는 큰 카드

상세 페이지:
- 모바일: 풀스크린 세로 스크롤
- 태블릿: 좌우 여백 추가
- 데스크탑: 최대 너비 제한 + 중앙 정렬

네비게이션, 버튼, 폰트 크기도 반응형으로 조정해줘.
```

### ♿ 접근성 개선
```
앱 전체에 접근성을 개선해줘.

키보드 내비게이션:
- Tab 순서: 상황카드 → 버튼 → 필터 → 정책카드
- Enter/Space로 카드 선택
- ESC로 모달 닫기

스크린 리더:
- aria-label 추가 ("자취 시작 상황 선택")
- aria-selected 상태 표시
- 매칭 점수 설명 ("95% 매칭, 높은 적합도")

시각적 개선:
- 포커스 링 명확하게 표시
- 색상 대비 4.5:1 이상 유지
- 색상 외에도 아이콘으로 상태 구분

alt 텍스트, role 속성 등 semantic HTML 사용해줘.
```

### 🚀 성능 최적화
```
앱 성능을 최적화해줘.

React 최적화:
- React.memo로 컴포넌트 메모이제이션
- useMemo로 계산 결과 캐싱
- useCallback으로 함수 최적화

이미지 최적화:
- Next.js Image 컴포넌트 사용
- 적절한 크기와 포맷

번들 최적화:
- 동적 import 사용
- 불필요한 라이브러리 제거

로딩 최적화:
- 스켈레톤 UI 추가
- Suspense 경계 설정
- 지연 로딩 구현

Lighthouse 90점 이상 목표로 최적화해줘.
```

---

## 🔧 배포 및 마무리

### 📦 배포 준비
```
배포를 위한 마무리 작업을 해줘.

환경 설정:
- next.config.js 최적화 설정
- vercel.json 배포 설정
- .env.example 파일

에러 처리:
- 404 페이지 (app/not-found.tsx)
- 에러 경계 (app/error.tsx)
- 로딩 페이지 (app/loading.tsx)

SEO 개선:
- metadata 설정 (각 페이지별)
- sitemap.xml 생성
- robots.txt 설정

최종 검증:
- TypeScript 타입 오류 확인
- ESLint/Prettier 적용
- 빌드 오류 수정

README.md 작성 (프로젝트 설명, 설치 방법, 사용법)
```

### 🧪 테스트 시나리오
```
주요 사용자 플로우를 테스트해줘.

시나리오 1: 자취 시작 + 구직 중
1. 메인 페이지에서 "자취 시작", "구직 중" 선택
2. "2개 상황으로 정책 찾기" 클릭
3. 정책 리스트에서 매칭된 정책 확인
4. 상세 페이지에서 신청하기 클릭
5. 외부 링크 확인 후 이동

시나리오 2: 북마크 기능
1. 정책 상세에서 북마크 추가
2. 북마크 페이지에서 저장된 정책 확인
3. 북마크 해제 기능 테스트

시나리오 3: 필터링
1. 카테고리별 필터링
2. 정렬 옵션 변경
3. 검색 결과 없는 경우 처리

각 시나리오별로 예상 동작과 실제 동작 비교해서 이슈 리포트해줘.
```

---

## 📝 개발 완료 체크리스트

### ✅ 필수 기능
- [ ] 6개 상황카드 선택 (최대 3개)
- [ ] 태그 기반 매칭 알고리즘
- [ ] 정책 리스트 + 필터링/정렬
- [ ] 정책 상세 페이지 + 아코디언
- [ ] 외부 링크 확인 팝업
- [ ] 20개 이상 실제 정책 데이터

### 🎁 α 기능
- [ ] 북마크 기능 (localStorage)
- [ ] 활용 팁 표시
- [ ] 관련 정책 추천
- [ ] 반응형 디자인

### 🚀 완성도
- [ ] TypeScript 타입 안정성
- [ ] 접근성 개선 (WCAG 2.1 AA)
- [ ] 성능 최적화 (Lighthouse 90점+)
- [ ] 에러 처리 및 로딩 상태
- [ ] SEO 메타데이터

### 📦 배포
- [ ] Vercel 배포 성공
- [ ] 도메인 연결 (선택)
- [ ] 실기기 테스트
- [ ] 최종 사용자 플로우 검증

---

**💡 프롬프트 사용 팁**
- 각 단계별로 순서대로 진행
- 에러 발생 시 관련 파일들 참조하여 수정 요청
- 완성된 기능은 체크리스트로 관리
- 추가 기능 필요 시 기존 코드 구조 유지하며 확장