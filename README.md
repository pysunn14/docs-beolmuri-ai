# 별무리 AI 문서

공개 문서 사이트의 화면 정본은 Open CoDesign 시안에서 가져온 `src/components/App.jsx`다. Astro의 React 통합으로 해당 화면을 직접 렌더링한다.

메인 문서의 정본은 `src/content/docs/index.md`다. 공개한 메모리 문서 두 편은 `src/content/docs/memory/`에 둔다. Astro가 연결된 Markdown의 본문과 제목을 읽어 화면에 전달한다. 나머지 Markdown 초안은 아직 화면에 연결되지 않았으며, 공개할 파일만 선별해 연결한다.

```bash
npm install
npm run dev
npm run build
npm run preview
```

GitHub Pages는 `main`에 반영된 버전을 기존 개인 도메인의
`https://pysunn.me/docs-beolmuri-ai/`에 배포한다.
