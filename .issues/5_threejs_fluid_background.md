## What to build
**[CLOSED]**

사용자 몰입감과 프리미엄 디자인 요소를 제공하기 위해 Three.js 및 React Three Fiber(R3F) 라이브러리를 활용한 fluid-background.tsx 컴포넌트를 구축하고 이를 메인/로그인 화면 배경에 통합합니다. 렌더링 부하를 줄이기 위한 최적화 기법을 적용합니다.

## Acceptance criteria

- [x] 메인 및 로그인 화면 배경에 동적인 3D 유체 시뮬레이션(Three.js/R3F) 효과가 적용되어야 함
- [x] 3D 렌더링 루프 실행 시에도 메인 스레드 점유율이 30% 이하로 유지되어 성능 저하가 없어야 함
- [x] 초당 프레임(FPS) 수가 60 이상으로 부드럽게 렌더링되는 성능 기준을 달성해야 함

## Blocked by

None - can start immediately
