export default function remarkMermaid() {
  return function transform(tree) {
    function visit(node) {
      if (node.type === 'code' && node.lang === 'mermaid') {
        const source = node.value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        node.type = 'html';
        node.value = `<pre class="mermaid">${source}</pre>`;
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
