## What to build

사용자가 포트폴리오 사이트 요약을 요청했을 때, 긴 대기 시간(동기식 처리 시 약 18초 소요)으로 인한 사용자 피로를 해소하기 위해 Vercel AI SDK의 StreamData 인터페이스를 도입하고 Server-Sent Events(SSE) 스트리밍 방식으로 요약문을 실시간 렌더링하도록 전환합니다.

## Acceptance criteria

- [x] 요약 생성 API(/api/summary)가 SSE(Server-Sent Events) 응답 규격을 따르도록 변경되어야 함
- [x] 첫 번째 토큰이 클라이언트에 도달하는 시간(TTFT)이 평균 600ms 이내로 도달하는지 확인되어야 함
- [x] React 클라이언트 화면에서 들어오는 요약 텍스트 조각을 순차적으로 자연스럽게 스트리밍 출력(마크다운 렌더링)해야 함

## Blocked by

None - can start immediately
