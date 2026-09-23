import React from 'react';

export default function MarkdownContent({ html }) {
  const root = React.useRef(null);

  React.useEffect(() => {
    let cancelled = false;
    const nodes = [...root.current.querySelectorAll('pre.mermaid')];
    if (!nodes.length) return;

    async function renderDiagrams() {
      const { default: mermaid } = await import('mermaid');
      await document.fonts.ready;
      if (cancelled) return;
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'dark', fontFamily: 'Arial, sans-serif' });
      await mermaid.run({ nodes });
    }
    renderDiagrams().catch(error => {
      console.error('Mermaid rendering failed', error);
      if (cancelled) return;
      const message = document.createElement('p');
      message.setAttribute('role', 'alert');
      message.textContent = '도표를 표시하지 못했습니다. 페이지를 새로고침해 주세요.';
      root.current.append(message);
    });
    return () => { cancelled = true; };
  }, [html]);

  return <div ref={root} className="overview-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
