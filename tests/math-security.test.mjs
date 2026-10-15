import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

// Every renderer must enforce the same trust boundary, including nested copies
// selected by Markdown and Mermaid dependencies. The KaTeX override keeps these
// renderers on the secured version whose stylesheet the site imports.
const consumers = ['rehype-katex', 'micromark-extension-math', 'mermaid', 'mermaid-isomorphic'];

for (const consumer of consumers) {
  const require = createRequire(import.meta.resolve(consumer));
  const katex = require('katex');

  test(`${consumer}: inherited trust cannot enable script links`, () => {
    const options = Object.create({ trust: true });
    options.strict = 'ignore';
    const html = katex.renderToString(String.raw`\href{javascript:alert(1)}{link}`, options);
    assert.doesNotMatch(html, /<[^>]+\bhref\s*=\s*["']javascript:/i);
  });

  test(`${consumer}: ordinary equations still render`, () => {
    const html = katex.renderToString(String.raw`E = mc^2 + \frac{1}{2}`, { throwOnError: true });
    assert.match(html, /class="katex"/);
    assert.match(html, /<math\b/);
    assert.doesNotMatch(html, /katex-error/);
  });
}
