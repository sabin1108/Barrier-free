## Problem Statement

채용 시장의 트렌드 변화로 인해 포트폴리오 관리 중요성이 커졌으나, 기존 플랫폼은 프로젝트 내용과 결과물을 단순히 나열하는 데 그쳐, 채용 담당자나 평가자가 제한된 시간 내에 지원자의 핵심 역량과 주요 성과를 파악하기 어려움. 정보 과부하로 인한 평가 피로도가 높음. 또한, 생성형 AI를 활용한 자동 요약 과정에서 할루시네이션(환각 현상) 및 데이터 정규성 부족(예: 일관되지 않은 기술 스택 표기) 문제가 발생하여 요약본의 신뢰성이 저하됨.

## Solution

생성형 AI(GPT-4o-mini)와 JSDOM 기반 적응형 전처리 파이프라인을 구축하여 외부 URL 포트폴리오를 파싱하고 핵심 정보를 자동으로 정형화함. AI의 할루시네이션을 방지하기 위해 사전에 정의된 기술 스택 지식 베이스를 활용하는 **지식 기반 검증(Knowledge-based Verification) 구조**를 적용함. 대기 시간을 96% 이상 단축하는 **SSE 기반 AI 스트리밍** 기술을 접목하고, React 19 동시성 모드, useCallback/useMemo 렌더링 최적화, Three.js 3D 유체 배경(fluid-background) 등을 도입하여 다양한 디바이스(데스크톱, 모바일)에서 60 FPS 이상의 반응형 대시보드 환경을 제공함.

## User Stories

1. As a job seeker, I want to input an external project URL, so that the body text is parsed and cleaned of HTML noise (like scripts/styles) to optimize token usage and cost.
2. As a job seeker, I want the extracted tech stack to go through a canonicalization path, so that non-standard names are mapped to official standard names (e.g. JS -> JavaScript) for schema consistency.
3. As a job seeker, I want hallucinated or misspelled tech names that do not exist in the predefined knowledge base to be automatically filtered out, so that data integrity is ensured.
4. As a job seeker, I want to review, edit, and approve the AI-generated summary before it is permanently stored, so that human-in-the-loop validation ensures accuracy.
5. As a job seeker, I want to browse my projects horizontally using an Embla Carousel card interface on the dashboard, so that I can easily navigate large volumes of projects.
6. As a recruiter, I want to see detailed project information inside a Vaul drawer component, so that I can utilize space efficiently on both mobile and desktop views.
7. As a job seeker, I want to search and execute quick actions globally using a CMDK-based command menu, so that my management productivity is maximized.
8. As a job seeker, I want to undergo an Input OTP verification step during registration, so that my account and portfolio data are secured.
9. As a recruiter, I want the project summary page to load using Server-Sent Events (SSE) streaming with a Time-to-First-Token (TTFT) under 600ms, so that I do not experience page load fatigue.
10. As a recruiter, I want to view structured project statistics using Recharts and Lucide React icons, so that I can scan the candidate's active stack and project metrics.

## Implementation Decisions

- **데이터 전처리 및 요약 모듈**: 
  - JSDOM 라이브러리를 통해 외부 HTML 문서의 불필요한 노이즈 태그(`<script>`, `<style>` 등)를 제거하고 정규표현식을 통해 텍스트를 정제 및 절삭하여 비용과 토큰 최적화.
  - Vercel AI SDK의 `StreamData` 인터페이스 및 SSE(Server-Sent Events) 방식을 사용하여 스트리밍 요약 제공 (평균 TTFT 607ms로 96% 단축 달성).
- **지식 기반 검증 레이어(Knowledge-based Verification)**:
  - AI가 1차 추출한 기술 스택 후보군을 사전에 구축된 지식 베이스 테이블과 교차 검증.
  - 표준명 보정(예: 약어/비표준명 자동 표준화) 및 불량 기술명(허구의 기술명/오타) 자동 필터링 경로 구성.
  - 유효 데이터는 사용자 수동 승인 단계를 거쳐 `users`, `projects` DB 테이블에 연쇄 삭제(Cascade) 제약 조건을 포함하여 적재.
- **반응형 대시보드 및 성능 최적화**:
  - React 19 동시성 모드와 Three.js/React Three Fiber 기반 3D 그래픽 프레임워크(`fluid-background.tsx`) 통합 적용.
  - useCallback 및 useMemo 훅을 적용해 하위 컴포넌트 재생성 방지 및 가상 DOM 비교 부하 최소화 (메인 스레드 점유율 30% 이하, 60 FPS 이상 유지).
  - 컴포넌트 원자화 전략을 통해 상위 컨테이너와 하위 프레젠테이셔널 컴포넌트(`StatsRow`, `SkillList` 등)를 관심사 분리(SoC)하여 유지보수성 향상.
  - Tailwind CSS v4, Radix UI, React Hook Form, Input OTP, Sonner toast, Embla Carousel, Vaul, CMDK, Recharts 모듈의 결합.

## Testing Decisions

- **JSDOM 전처리 테스트**: 비정형 HTML 파싱 시 불필요 노이즈 태그 제거 여부 및 순수 본문 텍스트 추출 검증.
- **지식 기반 검증 테스트**: 의도적으로 가공한 비표준 기술명(예: `JS`, `ReactJS`) 및 허구의 기술명이 유입되었을 때, 표준 치환 및 필터링이 올바르게 일어나는지 검증.
- **TTFT 스트리밍 테스트**: 동기식 응답과 비교하여 스트리밍 모드(stream: true)에서 Time-to-First-Token 속도 체감 측정 검증.
- **렌더링 최적화 검증**: 3D 배경 활성화 상태에서 60 FPS 유지 및 CPU/메인 스레드 점유율 확인 테스트.

## Out of Scope

- 자체 대규모 언어 모델(LLM) 파인튜닝 또는 서버 배포 (Vercel AI SDK 기반 외부 API 연동으로 국한).
- 다자간 실시간 협업 에디터 기능.
- 프로젝트 및 소스코드의 직접적인 Git 형상관리 동기화 에이전트.

## Further Notes

- **보안**: 사용자 패스워드는 pbkdf2 방식을 통해 Salt와 함께 해싱되어 안전하게 관리됨.
- **배포**: 호스팅 및 데이터베이스(Serverless Neon DB + Drizzle ORM) 환경은 웹 애플리케이션 프레임워크 배포 규격에 따라 유연하게 구성됨.
