# 📊 PolyFit 데이터 관리 가이드

## 개요

PolyFit의 정책 데이터는 Google Sheets를 통해 관리하며, GitHub Actions를 통해 자동으로 JSON 파일로 변환됩니다.

## 🔧 설정 방법

### 1. Google Sheets API 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. Google Sheets API 활성화
4. API 키 생성
5. GitHub Secrets에 다음 정보 추가:
   - `GOOGLE_SHEETS_API_KEY`: 생성한 API 키
   - `GOOGLE_SHEETS_ID`: Google Sheets 문서 ID

### 2. Google Sheets 템플릿 구조

#### 시트 1: 정책_마스터 (polyfit 정책 데이터 시트 내)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | string | ✅ | 정책 고유 ID (예: youth-housing-001) |
| title | string | ✅ | 정책명 |
| summary | string | ✅ | 한줄 요약 |
| category | string | ✅ | 카테고리 (housing, employment-education, welfare, finance-startup, medical) |
| source | string | ✅ | 실시 기관 |
| tags | string | ✅ | 태그 (콤마로 구분) |
| situations | string | ✅ | 해당 상황 (콤마로 구분) |
| target | string | ✅ | 지원 대상 |
| amount | string | ✅ | 지원 내용/금액 |
| period | string | ✅ | 신청 기간 |
| deadline | string | ✅ | 마감일 (YYYY-MM-DD) |
| detailedDescription | string | ✅ | 상세 설명 |
| requirements | string | ✅ | 신청 자격 요건 |
| documents | string | ✅ | 필요 서류 |
| process | string | ✅ | 신청 절차 |
| cautions | string | ✅ | 주의사항 |
| applicationUrl | string | ✅ | 신청 링크 |
| createdAt | string | ✅ | 생성일 (YYYY-MM-DD) |
| updatedAt | string | ✅ | 수정일 (YYYY-MM-DD) |
| views | number | ❌ | 조회수 |

#### 시트 2: 상황데이터 (선택사항)

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| id | string | ✅ | 상황 고유 ID |
| title | string | ✅ | 상황명 |
| description | string | ✅ | 설명 |
| tags | string | ✅ | 태그 (콤마로 구분) |
| color | string | ❌ | UI 색상 (HEX) |

## 📝 데이터 입력 규칙

### 1. 필수 필드
모든 필수(✅) 필드는 반드시 입력해야 합니다.

### 2. 콤마 구분 필드 (자동 JSON 배열 변환)
- `tags`: 예) "주거, 청년, 월세, 생활비" → JSON: `["주거", "청년", "월세", "생활비"]`
- `situations`: 예) "independence, job-seeking" → JSON: `["independence", "job-seeking"]`

⚠️ **중요**: 개발명세서에서는 JSON 배열 형태로 정의되어 있지만, Google Sheets에서는 입력 편의를 위해 콤마 구분 문자열로 입력하고 자동화 스크립트가 JSON 배열로 변환합니다.

### 3. 날짜 형식
- YYYY-MM-DD 형식 사용 (예: 2024-12-31)

### 4. URL 형식
- applicationUrl은 반드시 http:// 또는 https://로 시작

### 5. 카테고리 제한
다음 중 하나만 사용 가능:
- `housing`: 주거지원
- `employment-education`: 취업/교육
- `welfare`: 생활/복지
- `finance-startup`: 금융/창업
- `medical`: 의료지원

### 6. 상황 ID 제한
다음 중 하나만 사용 가능:
- `independence`: 자취 시작
- `job-seeking`: 구직 중
- `after-resignation`: 퇴사 후
- `childcare-prep`: 육아 준비
- `tax-settlement`: 연말정산
- `marriage-prep`: 결혼 준비

## 🚀 자동화 프로세스

### 1. 자동 업데이트
- 매일 오전 9시 (KST) 자동 실행
- 수동 실행: GitHub Actions에서 "Run workflow" 클릭

### 2. 업데이트 프로세스
1. Google Sheets에서 데이터 가져오기
2. 데이터 검증 및 변환
3. JSON 파일 생성 (`src/data/policies.json`, `src/data/situations.json`)
4. Git 커밋 및 푸시
5. Vercel 자동 배포

### 3. 오류 처리
- 데이터 검증 실패시 GitHub Actions가 실패
- 오류 로그는 Actions 탭에서 확인 가능

## 📋 체크리스트

### 새 정책 추가시
- [ ] 고유한 ID 사용
- [ ] 모든 필수 필드 입력
- [ ] 날짜 형식 확인 (YYYY-MM-DD)
- [ ] URL 형식 확인 (http/https)
- [ ] 카테고리 및 상황 ID 확인
- [ ] 태그는 콤마로 구분

### 기존 정책 수정시
- [ ] updatedAt 필드 업데이트
- [ ] 변경사항 문서화

## 📋 개발명세서 참조

이 데이터 관리 가이드는 `docs/기획서/PolyFit 프로젝트 개발 명세서.md`의 **3.4 정책 데이터 엑셀 작성 가이드**를 기반으로 작성되었습니다.

### 주요 차이점
- **개발명세서**: JSON 배열 형태 `["tag1", "tag2"]`
- **Google Sheets**: 콤마 구분 문자열 `"tag1, tag2"` (입력 편의성)
- **최종 결과**: 자동화 스크립트가 JSON 배열로 변환하여 개발명세서 규격과 일치

## 🛟 문제 해결

### 1. API 키 오류
- Google Cloud Console에서 API 키 상태 확인
- Sheets API 활성화 여부 확인

### 2. 시트 접근 권한 오류
- Google Sheets를 "링크가 있는 모든 사용자"로 공유 설정

### 3. 데이터 검증 실패
- GitHub Actions 로그에서 구체적인 오류 메시지 확인
- 필수 필드 누락 또는 형식 오류 수정

### 4. 자동 배포 실패
- Vercel 연동 상태 확인
- Git 권한 설정 확인
