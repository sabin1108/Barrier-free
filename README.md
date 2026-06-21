<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=transparent&color=auto&height=240&text=Portfolio%20Site&animation=&fontColor=ffffff&fontSize=90" />
</div>

<div style="text-align: left;"> 
  <h2 style="border-bottom: 1px solid #21262d; color: #c9d1d9;"> 포트폴리오 저장 및 요약 사이트 </h2>  
  <div style="font-weight: 700; font-size: 15px; text-align: left; color: #c9d1d9;">
    자신의 포트폴리오를 저장하거나 기록하는 사이트는 많지만 정작 사용하기 편한 사이트는 적습니다. 
    이를 해결하고자 제작된 사이트입니다. 타인의 포트폴리오를 AI가 요약하여 간단히 보며 둘러볼 수 있고 
    자신의 지정된 태그로 남들에게 공유하고 기록할 수 있습니다.
  </div> 
</div>

<div style="text-align: left;">
  <h2 style="border-bottom: 1px solid #21262d; color: #c9d1d9;"> Tech Stacks </h2>
  <br>
  <div style="text-align: left;"> 
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white">
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white">
    <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
    <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=Tailwind%20CSS&logoColor=white">
    <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=Three.js&logoColor=white">
    <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=Vitest&logoColor=white">
    <br>
  </div>
</div>

<div style="text-align: left;">
  <h2 style="border-bottom: 1px solid #21262d; color: #c9d1d9;"> PRD 기반의 에이전트 주도 개발 방식 (Development Methodology) </h2>
  <ul style="color: #c9d1d9; font-size: 15px;">
    <li><b>PRD to Issues 분할:</b> 프로젝트 목표를 PRD(제품 요구사항 정의서)로 정의하고, 이를 <code>.issues/</code> 폴더 내의 독립적이고 병렬 실행 가능한 마크다운 이슈 파일로 분할하여 개발 범위를 통제했습니다. (Tracer-bullet vertical slices 원칙 적용)</li>
    <li><b>브랜치 및 버전 관리 (Git Flow):</b> 새로운 기능 개발 시 반드시 <code>&lt;이슈번호&gt;-&lt;설명&gt;</code> 형태의 독립 브랜치를 분기하여 작업하고, 충돌 없는 병합(Merge)을 통해 메인 브랜치의 안정성을 보장했습니다.</li>
    <li><b>AI 에이전트 협업 체계:</b> Handoff(인수인계) 메커니즘을 통해 AI 에이전트 간 작업 컨텍스트를 유지했으며, 모든 로컬 커밋은 <code>sabin1108 &lt;minsabin1108@gmail.com&gt;</code> 명의로 수행하여 Github Grass 무결성을 확보했습니다.</li>
    <li><b>TDD 및 완료 검증:</b> 각 이슈 파일 내 Acceptance criteria(수용 기준)를 명시하고, 단위 테스트(Vitest) 통과 시에만 이슈를 닫는(Close) 프로세스를 엄격히 지켰습니다.</li>
  </ul>
</div>

<div style="text-align: left;">
  <h2 style="border-bottom: 1px solid #21262d; color: #c9d1d9;"> 성능 측정 방식 및 수치적 검증 (Performance Metrics) </h2>
  <p style="color: #c9d1d9; font-size: 15px;">목표 성능 달성 여부를 객관적으로 입증하기 위해, 구현 단계에서 성능 측정 스크립트를 직접 구축하여 수치적 성과를 확인했습니다.</p>
  
  <table style="width: 100%; color: #c9d1d9; text-align: left;">
    <thead>
      <tr style="border-bottom: 1px solid #30363d;">
        <th>검증 항목</th>
        <th>성능 측정 방법 및 기술적 구현 방안</th>
        <th>측정 결과 (Proof)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #30363d;">
        <td><b>AI 스트리밍 대기 지연 (TTFT)</b></td>
        <td>Vercel AI SDK <code>StreamData</code>와 Server-Sent Events(SSE) 적용 후, 클라이언트에서 응답 시작부터 첫 토큰 수신까지의 시간(Time To First Token)을 <code>Date.now()</code> 델타값 스크립트로 반복 측정 및 계측.</td>
        <td>단일 동기 응답 대기(약 18초) <b>→ 스트리밍 평균 600ms 미만 도달 (96% 체감 지연 속도 개선)</b></td>
      </tr>
      <tr style="border-bottom: 1px solid #30363d;">
        <td><b>클라이언트 렌더링 병목 차단 (FPS)</b></td>
        <td>Three.js <code>fluid-background.tsx</code> 동작 시 브라우저 DevTools의 퍼포먼스 패널과 자체 FPS 카운터 활용. 불필요한 하위 컴포넌트 리렌더링 차단(useCallback/useMemo 활용).</td>
        <td>메인 스레드 점유율 <b>30% 이하</b> 유지 조건 달성 및 <b>초당 60 FPS</b> 화면 프레임 지속 검증.</td>
      </tr>
      <tr style="border-bottom: 1px solid #30363d;">
        <td><b>비용 방어 및 LLM 컨텍스트 한도 억제</b></td>
        <td>JSDOM 기반 단위 테스트(Vitest) 환경 구축. <code>src/lib/html-parser.ts</code>에서 DOM 트리 순회 시 <code>script</code>, <code>style</code> 등의 태그를 직접 노드 필터링 방식으로 제거.</td>
        <td>악성 스크립트 노드 <b>100% 제거 성공</b> 및 프롬프트 인풋이 최대 <b>10,000자 상한으로 정확히 절삭</b>되어 반환됨을 유닛 테스트(110ms 소요)로 입증.</td>
      </tr>
      <tr style="border-bottom: 1px solid #30363d;">
        <td><b>지식 기반 태그 무결성 (DB Knowledge Base)</b></td>
        <td>AI 추출 배열과 DB 스키마를 중간에서 인터셉트하여 대조하는 Alias Mapper 로직 구현.</td>
        <td>사용자 오입력 단어 노이즈 <b>100% 차단</b>, 비표준 입력(<code>JS</code>) 자동 정규화(<code>JavaScript</code>) 통과율 <b>100% 테스트 완비</b>.</td>
      </tr>
    </tbody>
  </table>
</div>