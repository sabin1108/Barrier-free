## What to build

HTML 파서 모듈의 안정성을 보증하기 위해, 외부 웹페이지 HTML 데이터를 크롤링하고 JSDOM을 사용해 불필요한 노이즈(스크립트, 스타일 태그 등)를 정제한 후 순수 텍스트만을 남겨 LLM에 올바르게 전달하는 파이프라인의 자동화 단위 테스트를 구축합니다.

## Acceptance criteria

- [ ] 모크(Mock) HTML 데이터를 투입했을 때 `<script>`, `<style>` 등의 태그가 누락 없이 완벽히 정제되는지 검증되어야 함
- [ ] 정제된 순수 텍스트 결과물이 설정된 한계 길이(예: 10,000자) 내로 안전하게 절삭 및 전처리되는지 테스트가 작성되어 동작해야 함

## Blocked by

None - can start immediately
