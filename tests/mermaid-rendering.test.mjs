import assert from 'node:assert/strict';
import test from 'node:test';
import { createMermaidRenderer } from 'mermaid-isomorphic';

test('the bundled Mermaid renderer produces diagrams and math without script links', async () => {
  // mermaid-isomorphic loads mermaid/dist/mermaid.js, which embeds its own
  // dependencies. Exercising the bundle catches gaps that npm resolution misses.
  const render = createMermaidRenderer();
  const results = await render([
    'flowchart LR\n  source[Input] --> result[Output]',
    String.raw`flowchart LR
      equation["$$E = mc^2$$"]`,
    String.raw`flowchart LR
      link["$$\href{javascript:alert(1)}{link}$$"]`,
    String.raw`flowchart LR
      label["<span onclick='alert(1)'>label</span>"]`,
  ], {
    mermaidConfig: { theme: 'dark', layout: 'dagre', look: 'classic', fontFamily: 'Arial, sans-serif' },
  });

  for (const result of results) {
    assert.equal(result.status, 'fulfilled', JSON.stringify(result));
    assert.match(result.value.svg, /<svg\b/);
    assert.ok(result.value.width > 0 && result.value.height > 0);
    assert.doesNotMatch(result.value.svg, /<[^>]+\bhref\s*=\s*["']javascript:/i);
    assert.doesNotMatch(result.value.svg, /<[^>]+\son\w+\s*=/i);
  }
  assert.match(results[1].value.svg, /<math\b/);
});
