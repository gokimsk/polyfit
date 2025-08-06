# 📊 PolyFit 데이터 구조 설계안

**버전**: v2.1

**작성일**: 2025.08.02

**기반**: 확정된 서비스 개요 + TypeScript 정의

---

## 🗂️ 파일 구조

`src/
├── data/
│   ├── situations.json          # 6개 상황카드 정보
│   ├── policies.json            # 20-30개 정책 데이터
│   ├── tips.json               # α기능: 활용 팁
│   ├── usage.json              # α기능: 이용 현황
│   └── reviews.json            # α기능: 간단한 후기
├── types/
│   └── index.ts                # TypeScript 정의
└── lib/
    ├── matching.ts             # 매칭 알고리즘
    ├── utils.ts                # 유틸리티 함수
    └── constants.ts            # 상수 정의`

---

## 📋 1. situations.json

json

`{
  "situations": [
    {
      "id": "independence",
      "title": "자취 시작",
      "description": "독립생활을 위한 주거 지원",
      "tags": ["주거", "청년", "월세", "생활비", "독립", "보증금"],
      "color": "blue"
    },
    {
      "id": "job-seeking", 
      "title": "구직 중",
      "description": "취업 준비와 구직활동 지원",
      "tags": ["취업", "청년", "구직활동", "교육", "자격증", "인턴"],
      "color": "purple"
    },
    {
      "id": "after-resignation",
      "title": "퇴사 후", 
      "description": "재취업과 생활안정 지원",
      "tags": ["실업급여", "이직", "재취업", "교육", "직업훈련", "생활비"],
      "color": "cyan"
    },
    {
      "id": "childcare-prep",
      "title": "육아 준비",
      "description": "출산과 육아를 위한 지원", 
      "tags": ["육아", "돌봄", "출산", "보육", "어린이집", "의료"],
      "color": "green"
    },
    {
      "id": "tax-settlement",
      "title": "연말정산",
      "description": "세금 혜택과 공제 정보",
      "tags": ["세금", "공제", "환급", "소득", "절세", "근로소득"],
      "color": "orange"
    },
    {
      "id": "marriage-prep",
      "title": "결혼 준비", 
      "description": "혼례와 신혼생활 준비 지원",
      "tags": ["결혼", "신혼", "혼례", "신혼부부", "주택", "대출"],
      "color": "pink"
    }
  ]
}`

---

## 🏷️ 2. policies.json (샘플 구조)

json

`{
  "policies": [
    {
      "id": "youth-housing-001",
      "title": "청년 월세 특별지원",
      "summary": "무주택 청년의 주거비 부담을 덜어주기 위한 월세 지원 정책입니다.",
      "category": "housing",
      "source": "국토교통부",
      
      "tags": ["주거", "청년", "월세", "생활비"],
      "situations": ["independence"],
      
      "target": "만 19~34세 청년",
      "amount": "월 최대 20만원 지원 (최대 12개월)",
      "period": "2024년 1월 ~ 12월",
      "deadline": "2024-12-31",
      
      "detailedDescription": "본 정책은 주거비 부담으로 어려움을 겪는 청년들의 안정적인 주거환경 조성을 위해 마련되었습니다. 월세 지원을 통해 청년들이 독립적인 생활을 영위할 수 있도록 하고, 사회진출 초기의 경제적 부담을 덜어주는 것이 목적입니다.",
      
      "requirements": "만 19~34세 청년, 무주택자, 소득 기준 충족",
      "documents": "신분증, 임대차계약서, 소득증명서류, 통장사본",
      "process": "온라인 신청 → 서류 검토 → 자격 확인 → 지원 여부 결정 통보 → 매월 25일 지정 계좌로 지원금 지급",
      "cautions": "최초 신청 후 지원 여부 결정 통보",
      "applicationUrl": "https://www.gov.kr/portal/service/serviceInfo/PTR000050681",
      
      "createdAt": "2024-01-01",
      "updatedAt": "2024-08-01",
      "views": 15400
    },
    {
      "id": "employment-support-002", 
      "title": "국민취업지원제도",
      "summary": "취업을 원하는 모든 국민에게 취업지원서비스와 소득지원을 함께 제공합니다.",
      "category": "employment-education",
      "source": "고용노동부",
      
      "tags": ["취업", "구직활동", "교육", "실업급여"],
      "situations": ["job-seeking", "after-resignation"],
      
      "target": "구직 희망자",
      "amount": "월 최대 50만원 (최대 6개월)",
      "period": "2024년 8월 15일까지",
      "deadline": "2024-08-15",
      
      "detailedDescription": "취업을 원하는 모든 국민에게 취업지원서비스와 소득지원을 함께 제공합니다.",
      "requirements": "구직 희망자, 소득 요건 등 충족",
      "documents": "신분증, 구직신청서, 소득 관련 서류",
      "process": "온라인 신청 → 상담 → 취업지원 프로그램 참여",
      "cautions": "마감임박! 서둘러 신청하세요",
      "applicationUrl": "https://www.gov.kr/portal/service/serviceInfo/PTR000001800",
      
      "createdAt": "2024-01-15", 
      "updatedAt": "2024-07-30",
      "views": 45200
    }
  ]
}`

---

## 💡 3. tips.json (α기능)

json

`{
  "tips": [
    {
      "policyId": "youth-housing-001",
      "tip": "💡 소득 인정액 기준 미리 확인하세요",
      "icon": "💡"
    },
    {
      "policyId": "employment-support-002", 
      "tip": "📋 구직활동 계획서 작성 팁을 참고하세요",
      "icon": "📋"
    }
  ]
}`

---

## 👥 4. usage.json (α기능)

json

`{
  "usage": [
    {
      "policyId": "youth-housing-001",
      "situationCombination": ["independence"],
      "description": "자취 시작하는 분들이 많이 찾아요"
    },
    {
      "policyId": "employment-support-002",
      "situationCombination": ["job-seeking", "after-resignation"],
      "description": "구직+퇴사 후 상황의 분들이 많이 찾아요"
    }
  ]
}`

---

## ⭐ 5. reviews.json (α기능)

json

`{
  "reviews": [
    {
      "id": "review-001",
      "policyId": "youth-housing-001", 
      "author": "김**",
      "rating": 5,
      "comment": "필요 서류를 준비하여 온라인으로 신청",
      "date": "2024-07-15"
    },
    {
      "id": "review-002",
      "policyId": "employment-support-002",
      "author": "이**", 
      "rating": 4,
      "comment": "취업 상담 프로그램이 정말 도움됐어요",
      "date": "2024-07-20"
    }
  ]
}`

---

## 🔧 데이터 관리 가이드

### 📝 데이터 입력 규칙

1. **필수 필드 체크**
    - Policy: id, title, summary, category, tags, situations, target, amount, period, deadline, applicationUrl
    - Situation: id, title, description, tags (6개 고정)
2. **형식 통일**
    - 날짜: YYYY-MM-DD 형식
    - 태그: ["태그1", "태그2"] 배열 형식
    - ID: kebab-case 사용 (예: youth-housing-001)
3. **데이터 검증**
    - URL 유효성 체크
    - situations 배열의 ID가 실제 존재하는지 확인
    - 태그가 해당 상황의 태그와 매칭되는지 확인

### 🔄 업데이트 프로세스

1. **구글시트에서 편집** → 2. **JSON 변환 스크립트 실행** → 3. **검증 후 배포**

### 📊 성능 최적화

- **정책 데이터**: 최대 30개로 제한 (MVP)
- **이미지 없음**: 텍스트 기반으로 빠른 로딩
- **정적 파일**: CDN 캐싱 활용

---

## 🎯 MVP 구현 우선순위

```
우선순위파일구현 시점🥇 Criticalsituations.jsonWeek 1🥇 Criticalpolicies.json (10개)Week 1-2🥈 Highpolicies.json (20개)Week 2🥉 Mediumtips.jsonWeek 3🥉 Mediumusage.jsonWeek 3🥉 Mediumreviews.jsonWeek 3
```

---

## 💾 샘플 데이터 생성 가이드

**Week 2 (Day 8-9) 실제 데이터 수집 시:**

1. **정부24 정책 10개** (주거, 취업, 복지 중심)
2. **지자체 정책 5개** (서울시, 경기도)
3. **공단 정책 5개** (국민연금, 건보, 근로복지공단)

**각 정책마다 확인 사항:**

- ✅ 신청 링크 유효성
- ✅ 마감일 정확성
- ✅ 태그-상황 매칭도
- ✅ 카테고리 분류 적절성