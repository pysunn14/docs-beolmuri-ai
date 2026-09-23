# 별무리 AI 문서

공개 문서 사이트의 화면 정본은 Open CoDesign 시안에서 가져온 `src/components/App.jsx`다. Astro의 React 통합으로 해당 화면을 직접 렌더링한다.

공개용 Markdown 초안은 `src/content/docs/`에 둔다. 현재 화면은 시안의 자리표시 문구를 보여주며, 이 Markdown 파일은 아직 화면에 연결되지 않았다. 실제 기술 문서를 게시할 때 공개할 파일만 선별해 연결한다.

```bash
npm install
npm run dev
npm run build
npm run preview
```

GitHub Pages는 `main`에 반영된 버전을 기존 개인 도메인의
`https://pysunn.me/docs-beolmuri-ai/`에 배포한다.
