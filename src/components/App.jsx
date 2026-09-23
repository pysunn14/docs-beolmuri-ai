import React from 'react';

const TWEAK_SCHEMA = /*TWEAK-SCHEMA-BEGIN*/{
  "accentColor": { "kind": "color" },
  "readingWidth": { "kind": "number", "min": 680, "max": 780, "step": 10, "unit": "px" }
}/*TWEAK-SCHEMA-END*/;
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#a5d2c4",
  "readingWidth": 740
}/*EDITMODE-END*/;

const docs = [
  { id: 'overview', group: '시작', title: '문서 개요', description: '별무리 AI 공개 기술 문서의 범위와 읽는 방법을 안내합니다.' },
  { id: 'reading', group: '시작', title: '문서 읽기 안내', description: '문서의 구성과 표기 방식을 안내하는 자리입니다.' },
  { id: 'memory-save', group: '설계', title: 'What gets saved', description: '대화에서 기억할 발화를 고르는 방법을 설명합니다.' },
  { id: 'memory-retrieval', group: '설계', title: 'How memories are retrieved', description: '저장된 발화를 다시 찾는 방법을 설명합니다.' },
  { id: 'architecture', group: '설계', title: '모델 설계', description: '모델 설계의 배경과 선택 기준을 정리할 자리입니다.' },
  { id: 'data', group: '설계', title: '데이터와 전처리', description: '데이터와 전처리 과정을 설명할 자리입니다.' },
  { id: 'runtime', group: '설계', title: '추론 환경', description: '온디바이스 추론 환경을 기록할 자리입니다.' },
  { id: 'criteria', group: '평가', title: '평가 기준', description: '평가 항목과 조건을 명시할 자리입니다.' },
  { id: 'measurements', group: '평가', title: '측정 기록', description: '측정 방법과 관찰 내용을 정리할 자리입니다.' },
  { id: 'changes', group: '기록', title: '변경 기록', description: '문서 및 실험 기록의 변경 사항을 모을 자리입니다.' },
  { id: 'glossary', group: '기록', title: '용어집', description: '문서에 쓰이는 용어를 설명할 자리입니다.' }
];

const groups = ['시작', '설계', '평가', '기록'];

function StarMark() {
  return (
    <svg className="star-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M16 2.5 18.8 13.2 29.5 16 18.8 18.8 16 29.5 13.2 18.8 2.5 16 13.2 13.2 16 2.5Z" fill="currentColor" />
      <circle cx="26.5" cy="5.5" r="1.5" fill="currentColor" opacity=".55" />
    </svg>
  );
}

function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7"/><path d="m16 16 5 5"/></svg>;
}

function Chevron() {
  return <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m7 4 6 6-6 6"/></svg>;
}

function GithubIcon() {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.08.67-3.73-1.3-3.73-1.3-.5-1.27-1.23-1.61-1.23-1.61-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.14 1.7 1.14 1 .1.77 1.79 3.18 1.27.1-.73.39-1.23.71-1.52-2.46-.28-5.05-1.23-5.05-5.49 0-1.21.44-2.2 1.14-2.98-.11-.28-.49-1.41.11-2.94 0 0 .93-.3 3.05 1.14A10.6 10.6 0 0 1 12 6.41c.94 0 1.88.13 2.76.37 2.12-1.44 3.05-1.14 3.05-1.14.6 1.53.22 2.66.1 2.94.72.78 1.14 1.77 1.14 2.98 0 4.27-2.59 5.2-5.06 5.48.4.35.76 1.03.76 2.08v2.87c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>;
}

function ThemeIcon({ light }) {
  return light
    ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
    : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.4 15.7A8.8 8.8 0 0 1 8.3 3.6 8.8 8.8 0 1 0 20.4 15.7Z"/></svg>;
}

function App({ documents }) {
  const [theme, setTheme] = React.useState('dark');
  const [docId, setDocId] = React.useState('overview');
  const [activeSection, setActiveSection] = React.useState('intro');
  const [query, setQuery] = React.useState('');
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileMenu, setMobileMenu] = React.useState(false);
  const [mobileToc, setMobileToc] = React.useState(false);
  const searchRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const doc = docs.find(item => item.id === docId) || docs[0];
  const markdownDoc = documents[docId];
  const matches = docs.filter(item => `${item.group} ${item.title}`.includes(query.trim()));
  const isOverview = docId === 'overview';
  const sections = markdownDoc
    ? [{ id: 'intro', label: isOverview ? 'Overview' : 'Introduction' }, ...markdownDoc.headings.map(item => ({ id: item.slug, label: item.text }))]
    : [{ id: 'intro', label: '개요' }, { id: 'draft', label: '작성 예정 내용' }, { id: 'related', label: '관련 문서' }];

  React.useEffect(() => {
    function syncFromUrl() {
      const id = new URLSearchParams(window.location.search).get('doc');
      setDocId(docs.some(item => item.id === id) ? id : 'overview');
    }
    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  function openDoc(id) {
    const url = new URL(window.location.href);
    if (id === 'overview') url.searchParams.delete('doc');
    else url.searchParams.set('doc', id);
    window.history.pushState(null, '', url);
    setDocId(id);
    setActiveSection('intro');
    setSearchOpen(false);
    setQuery('');
    setMobileMenu(false);
    setMobileToc(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
    requestAnimationFrame(() => titleRef.current?.focus());
  }

  function scrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function goSection(id) {
    setActiveSection(id);
    setMobileToc(false);
    document.getElementById(id)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }

  React.useEffect(() => {
    function updateSection() {
      const visible = sections.filter(item => {
        const node = document.getElementById(item.id);
        return node && node.getBoundingClientRect().top <= 210;
      });
      setActiveSection(visible.at(-1)?.id || 'intro');
    }
    window.addEventListener('scroll', updateSection, { passive: true });
    updateSection();
    return () => window.removeEventListener('scroll', updateSection);
  }, [docId]);

  React.useEffect(() => {
    function onKey(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        if (mobileMenu) document.querySelector('.menu-toggle')?.focus();
        else if (mobileToc) document.querySelector('.mobile-toc-trigger')?.focus();
        setSearchOpen(false);
        setMobileMenu(false);
        setMobileToc(false);
        searchRef.current?.blur();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenu, mobileToc]);

  return (
    <div className="site-shell" data-theme={theme} style={{ '--reading-width': `calc(var(--ocd-tweak-reading-width, ${TWEAK_DEFAULTS.readingWidth}) * 1px)` }}>
      <header className="site-header">
        <div className="header-inner">
          <button className="brand" onClick={() => openDoc('overview')} aria-label="별무리 AI 문서 개요로 이동">
            <StarMark /><span>별무리 <strong>AI</strong></span><span className="brand-sub">DOCS</span>
          </button>
          <div className="search-wrap">
            <label className="search-box" htmlFor="doc-search">
              <SearchIcon />
              <input id="doc-search" ref={searchRef} value={query} onChange={e => { setQuery(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)} onKeyDown={e => { if (e.key === 'Enter' && matches.length) openDoc(matches[0].id); }} placeholder="문서 검색" autoComplete="off" />
              <kbd>⌘ K</kbd>
            </label>
            {searchOpen && query.trim() && <div className="search-results" role="listbox" aria-label="검색 결과">
              {matches.length ? matches.map(item => <button key={item.id} role="option" aria-selected={item.id === docId} onMouseDown={e => e.preventDefault()} onClick={() => openDoc(item.id)}><span>{item.title}</span><small>{item.group}</small></button>) : <p>일치하는 문서가 없습니다.</p>}
            </div>}
          </div>
          <div className="header-end">
              <a className="icon-action" href="https://github.com/mornye-minor-gallery/PetAI-AI" target="_blank" rel="noopener noreferrer" aria-label="별무리 AI GitHub 저장소 열기 (새 탭)" title="GitHub 저장소"><GithubIcon /></a>
              <button className="icon-action" type="button" onClick={() => setTheme(value => value === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'} title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}><ThemeIcon light={theme === 'light'} /></button>
              <button className="menu-toggle" onClick={() => setMobileMenu(value => !value)} aria-expanded={mobileMenu} aria-controls="mobile-doc-menu" aria-label={mobileMenu ? '메뉴 닫기' : '메뉴 열기'}><span/><span/><span/></button>
            </div>
        </div>
        <nav className="top-nav" aria-label="주요 섹션"><div className="top-nav-inner">{groups.map(group => <button key={group} className={doc.group === group ? 'selected' : ''} onClick={() => openDoc(docs.find(item => item.group === group).id)} aria-current={doc.group === group ? 'page' : undefined}>{group}</button>)}</div></nav>
      </header>

      <div className="workspace">
        <aside id="mobile-doc-menu" className={`left-rail ${mobileMenu ? 'is-open' : ''}`} aria-label="문서 메뉴">
          <div className="rail-inner">
            <div className="rail-heading">문서 탐색 <span>01 — 04</span></div>
            {groups.map((group, index) => <div className="nav-group" key={group}>
              <div className="group-label"><span className="group-index">0{index + 1}</span>{group}</div>
              <div className="nav-links">{docs.filter(item => item.group === group).map(item => <button key={item.id} onClick={() => openDoc(item.id)} className={docId === item.id ? 'active' : ''} aria-current={docId === item.id ? 'page' : undefined}>{item.title}{docId === item.id && <Chevron />}</button>)}</div>
            </div>)}
            
          </div>
        </aside>
        {mobileMenu && <button className="mobile-scrim" onClick={() => setMobileMenu(false)} aria-label="메뉴 닫기"/>}

        <main key={docId} className="document" id="main-content">
          <div className="breadcrumb"><button onClick={() => openDoc(docs.find(item => item.group === doc.group).id)}>{doc.group}</button><Chevron /><span>{doc.title}</span></div>
          
          <section id="intro" className="intro-section">
            <h1 ref={titleRef} tabIndex="-1">{markdownDoc?.title ?? doc.title}</h1>
            <p className="lead">{markdownDoc?.description ?? doc.description}</p>
            {!markdownDoc && <div className="draft-note" role="note"><span className="note-symbol" aria-hidden="true">i</span><div><strong>문서 작성 중</strong><p>아래 내용은 문서 구성 예시입니다. 구현 상태나 성능 결과는 포함하지 않았습니다.</p></div></div>}
          </section>
          {markdownDoc ? <>
            {/* Astro compiles repository-owned Markdown before passing it to this component. */}
            <div className="overview-content" dangerouslySetInnerHTML={{ __html: markdownDoc.html }} />
          </> : <>
            <section id="draft" className="content-section"><h2>작성 예정 내용</h2><p>{doc.description} 구체적인 방법, 조건, 근거는 확인 가능한 내용이 준비된 뒤 이 절에 추가됩니다.</p><div className="placeholder"><span className="placeholder-mark">✳</span><div><strong>내용을 준비하고 있습니다</strong><p>확인되지 않은 구현 내용이나 측정 수치는 이 시안에 포함하지 않습니다.</p></div></div></section>
            <section id="related" className="content-section last-section"><h2>관련 문서</h2><p>다른 주제는 왼쪽 문서 메뉴에서 살펴볼 수 있습니다.</p><button className="inline-link" onClick={() => openDoc('overview')}>문서 개요로 돌아가기 <span aria-hidden="true">↗</span></button></section>
          </>}
          <footer className="article-footer"><button onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}>맨 위로 ↑</button></footer>
        </main>

        <aside className="right-rail" aria-label="이 페이지의 목차"><div className="toc-inner"><div className="toc-heading"><span className="toc-glyph">≡</span> 이 페이지에서</div><div className="toc-links">{sections.map(item => <button key={item.id} className={activeSection === item.id ? 'active' : ''} onClick={() => goSection(item.id)} aria-current={activeSection === item.id ? 'location' : undefined}>{item.label}</button>)}</div></div></aside>
        <div className="mobile-toc"><button className="mobile-toc-trigger" onClick={() => setMobileToc(value => !value)} aria-expanded={mobileToc}>이 페이지에서 <span>{mobileToc ? '−' : '+'}</span></button>{mobileToc && <div className="mobile-toc-links">{sections.map(item => <button key={item.id} onClick={() => goSection(item.id)}>{item.label}</button>)}</div>}</div>
      </div>
      <style>{`
        :root{--bg:#0d1118;--surface:#141a23;--surface-hover:#1a222d;--line:#27313d;--text:#e8edf1;--secondary:#b3beca;--muted:#8996a5;--faint:#687788;--accent:#a5d2c4;--accent-soft:rgba(165,210,196,.11);color-scheme:dark}
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif;-webkit-font-smoothing:antialiased;word-break:keep-all}button,input{font:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:3px}::selection{background:#45695f;color:white}
        .site-shell{min-height:100vh}.site-header{position:sticky;top:0;z-index:20;background:rgba(13,17,24,.97);border-bottom:1px solid var(--line);backdrop-filter:blur(16px)}.header-inner{height:74px;max-width:1600px;margin:auto;padding:0 48px;display:grid;grid-template-columns:248px minmax(0,1fr) 200px;gap:56px;align-items:center}.brand{display:flex;align-items:center;gap:10px;color:var(--text);background:none;border:0;padding:0;white-space:nowrap;font-size:20px;font-weight:700;letter-spacing:-.055em}.brand strong{color:var(--accent);font-weight:700}.star-mark{width:25px;height:25px;color:var(--accent);flex:none}.brand-divider{height:17px;width:1px;background:#3b4652;margin:0 4px}.brand-sub{font-size:12px;color:var(--muted);letter-spacing:-.01em;font-weight:550}.search-wrap{position:relative;justify-self:center;width:min(100%,390px)}.search-box{height:38px;display:flex;align-items:center;gap:10px;border:1px solid #39434e;border-radius:7px;padding:0 11px;color:var(--faint);background:#171d26;transition:border-color .2s}.search-box:focus-within{border-color:var(--accent)}.search-box input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--text);font-size:13px}.search-box input::placeholder{color:#8793a2}.search-box kbd{white-space:nowrap;border:1px solid #424e5a;border-radius:4px;padding:2px 5px;color:#9ca8b5;font:11px ui-monospace,SFMono-Regular,Consolas,monospace}.search-results{position:absolute;top:45px;left:0;right:0;z-index:50;max-height:330px;overflow:auto;border:1px solid #3a4754;border-radius:8px;padding:5px;background:#171e28;box-shadow:0 18px 40px #0008}.search-results button{width:100%;border:0;background:none;color:var(--text);padding:11px 12px;text-align:left;border-radius:5px;display:flex;justify-content:space-between;gap:12px;font-size:13px}.search-results button:hover,.search-results button:focus-visible{background:#26313d}.search-results small{color:var(--muted)}.search-results p{color:var(--muted);font-size:13px;padding:8px 12px}.header-end{justify-self:end}.menu-toggle{display:none}.top-nav-inner{height:49px;max-width:1600px;margin:auto;padding:0 48px;display:flex;align-items:stretch;gap:34px}.top-nav button{position:relative;border:0;background:none;color:#a7b2bf;padding:0 2px;font-size:13px;font-weight:600}.top-nav button:hover,.top-nav button.selected{color:var(--text)}.top-nav button.selected:after{content:"";position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--accent)}
        .workspace{max-width:1600px;margin:auto;padding:0 48px;display:grid;grid-template-columns:248px minmax(0,740px) minmax(165px,200px);column-gap:56px;justify-content:space-between;align-items:start}.left-rail,.right-rail{position:sticky;top:124px;height:calc(100vh - 124px)}.rail-inner{height:100%;overflow-y:auto;padding:33px 12px 28px 0;scrollbar-width:thin;scrollbar-color:#3b4652 transparent}.rail-heading{display:flex;justify-content:space-between;align-items:center;padding:0 12px 27px;color:var(--muted);font-size:11px;font-weight:700;letter-spacing:.12em}.rail-heading span{font:10px ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--faint);letter-spacing:0}.nav-group{margin-bottom:27px}.group-label{display:flex;align-items:center;gap:9px;padding:0 12px 10px;color:#9aa8b6;font-weight:700;font-size:11px;letter-spacing:.05em}.group-index{color:#657584;font:10px ui-monospace,SFMono-Regular,Consolas,monospace}.nav-links{display:flex;flex-direction:column;gap:2px}.nav-links button{min-height:37px;padding:7px 11px 7px 20px;display:flex;align-items:center;justify-content:space-between;width:100%;border:0;border-left:2px solid transparent;border-radius:0 5px 5px 0;background:none;color:#aeb9c5;text-align:left;font-size:13px;line-height:1.5}.nav-links button:hover{background:#171e27;color:var(--text)}.nav-links button.active{color:var(--accent);background:var(--accent-soft);border-left-color:var(--accent);font-weight:650}.nav-links button svg{color:var(--accent)}.rail-foot{border-top:1px solid var(--line);margin:22px 12px 0;padding-top:19px;display:flex;flex-direction:column;gap:5px;font-size:12px;color:#a9b4c0}.rail-foot span{font-size:11px;color:var(--faint)}
        .document{min-width:0;padding:34px 0 80px}.breadcrumb{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:12px}.breadcrumb button{border:0;background:none;color:var(--muted);padding:0}.breadcrumb button:hover{color:var(--accent)}.breadcrumb svg{width:12px;height:12px;color:#657383}.breadcrumb span{color:#bcc6d0}.article-meta{display:flex;align-items:center;gap:9px;margin-top:67px;color:var(--accent);font:600 10px ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.12em}.meta-line{width:18px;height:1px;background:var(--accent)}.meta-dot{color:#586875;margin:0 1px}.intro-section h1{margin:19px 0 18px;font-size:clamp(32px,3vw,42px);line-height:1.28;letter-spacing:-.055em;font-weight:720;outline:0}.lead{margin:0;max-width:630px;font-size:17px;line-height:1.85;letter-spacing:-.025em;color:#c5cfd9}.draft-note{display:flex;gap:14px;margin-top:39px;padding:18px 20px;background:#151e27;border:1px solid #2c3e48;border-left:2px solid #82b8ab;border-radius:0 6px 6px 0}.note-symbol{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;flex:none;margin-top:2px;border:1px solid #8bb8ab;border-radius:50%;color:var(--accent);font:700 11px Georgia,serif}.draft-note strong{font-size:13px;color:#d5e7e1;font-weight:650}.draft-note p{margin:6px 0 0;color:#aebbc7;font-size:13px;line-height:1.8;letter-spacing:-.015em}.content-section{border-top:1px solid var(--line);margin-top:58px;padding-top:39px;scroll-margin-top:160px}.intro-section{scroll-margin-top:160px}.section-kicker{font:600 10px ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.1em;color:#7fa99e}.content-section h2{font-size:23px;line-height:1.4;letter-spacing:-.045em;margin:13px 0 16px;font-weight:700}.content-section>p{margin:0;max-width:660px;color:#b1beca;font-size:15px;line-height:1.95;letter-spacing:-.018em}.topic-list{margin-top:27px;border-top:1px solid #2a3541}.topic-list>button{display:grid;grid-template-columns:30px 1fr 16px;align-items:start;gap:16px;width:100%;padding:18px 4px;border:0;border-bottom:1px solid #2a3541;background:none;color:inherit;text-align:left}.topic-list>button:hover{background:#171f29}.topic-list>button>span{padding-top:5px;color:#789d94;font:11px ui-monospace,SFMono-Regular,Consolas,monospace}.topic-list h3{margin:0 0 4px;font-size:14px;font-weight:650;letter-spacing:-.02em}.topic-list p{margin:0;color:#91a0af;font-size:12px;line-height:1.7}.topic-list svg{margin-top:7px;color:#657583}.placeholder{display:flex;align-items:flex-start;gap:16px;margin-top:29px;padding:25px;border:1px dashed #40505d;border-radius:7px;background:#111923}.placeholder-mark{color:var(--accent);font-size:18px}.placeholder strong{font-size:14px}.placeholder p{font-size:13px;color:var(--muted);line-height:1.8;margin:6px 0 0}.inline-link{margin-top:20px;padding:0;border:0;background:none;color:var(--accent);font-size:13px}.inline-link:hover{text-decoration:underline}.last-section{margin-bottom:70px}.article-footer{display:flex;justify-content:flex-end;gap:20px;border-top:1px solid var(--line);padding-top:20px;color:var(--faint);font-size:11px}.article-footer button{border:0;background:none;color:#9baeb9;font-size:11px}.article-footer button:hover{color:var(--accent)}
        .toc-inner{padding:39px 0 20px 17px}.toc-heading{color:#a7b4c0;font-size:11px;letter-spacing:.03em;font-weight:700;display:flex;align-items:center;gap:9px;margin-bottom:19px}.toc-glyph{font-size:17px;font-weight:400;color:#8493a1;line-height:1}.toc-links{border-left:1px solid #35414d;display:flex;flex-direction:column}.toc-links button{position:relative;text-align:left;border:0;background:none;padding:8px 0 9px 16px;color:#8998a8;font-size:12px;line-height:1.5}.toc-links button:hover{color:var(--text)}.toc-links button.active{color:var(--accent);font-weight:650}.toc-links button.active:before{content:"";position:absolute;left:-1px;top:4px;bottom:4px;width:2px;background:var(--accent)}.toc-bottom{margin:29px 0 0 17px;font-size:11px;color:#586877}.mobile-toc,.mobile-scrim{display:none}
        @media(max-width:1180px){.header-inner{grid-template-columns:230px minmax(0,1fr) 120px;gap:32px;padding:0 32px}.top-nav-inner{padding:0 32px}.workspace{padding:0 32px;grid-template-columns:230px minmax(0,740px) 160px;gap:32px}.header-caption{display:none}}
        @media(max-width:980px){.header-inner{grid-template-columns:220px 1fr;gap:28px}.workspace{grid-template-columns:220px minmax(0,740px);gap:35px}.right-rail{display:none}.search-wrap{justify-self:end;width:min(100%,330px)}}
        @media(max-width:720px){.site-header{position:sticky}.header-inner{height:64px;padding:0 20px;grid-template-columns:1fr auto;gap:12px}.brand{font-size:18px}.star-mark{width:22px;height:22px}.brand-sub,.brand-divider,.search-wrap{display:none}.header-end{display:flex;align-items:center}.menu-toggle{width:36px;height:36px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:#18212b;border:1px solid #34404c;border-radius:6px}.menu-toggle span{display:block;width:16px;height:1.5px;background:#c7d1da}.top-nav{display:none}.workspace{display:block;padding:0 22px}.document{padding:28px 0 70px}.breadcrumb{font-size:11px}.article-meta{margin-top:46px}.intro-section h1{font-size:33px;margin-top:17px}.lead{font-size:16px;line-height:1.8}.draft-note{margin-top:30px}.content-section{margin-top:44px;padding-top:32px}.content-section h2{font-size:21px}.content-section>p{font-size:14px}.left-rail{display:none;position:fixed;z-index:31;top:64px;left:0;width:min(320px,86vw);height:calc(100vh - 64px);background:#121923;border-right:1px solid #35424e;padding-left:20px;box-shadow:15px 0 40px #0007}.left-rail.is-open{display:block}.mobile-scrim{display:block;position:fixed;z-index:30;inset:64px 0 0;background:#0009;border:0;width:100%}.mobile-toc{display:block;position:fixed;z-index:10;right:22px;bottom:22px;width:176px;background:#1a2430;border:1px solid #3b4d5a;border-radius:7px;box-shadow:0 12px 28px #0007}.mobile-toc-trigger{width:100%;border:0;background:none;color:#d6e3e0;padding:11px 13px;display:flex;justify-content:space-between;font-size:12px}.mobile-toc-links{padding:0 5px 6px;display:flex;flex-direction:column}.mobile-toc-links button{border:0;background:none;color:#aebbc7;padding:9px;text-align:left;font-size:12px;border-radius:4px}.mobile-toc-links button:hover{background:#2a3540}.article-footer{padding-bottom:40px}}
        @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{transition-duration:.01ms!important;animation-duration:.01ms!important}}

          /* Shared theme layer: the document grid stays put while surfaces and controls change. */
          .site-shell {
            --accent: var(--ocd-tweak-accent-color, #a5d2c4);
            --accent-soft: color-mix(in srgb, var(--accent) 11%, transparent);
            background: var(--bg);
            color: var(--text);
            color-scheme: dark;
            transition: background-color .28s ease, color .28s ease;
          }
          .site-shell[data-theme="light"] {
            --bg: #f8faf9;
            --surface: #ffffff;
            --surface-hover: #edf3f0;
            --line: #dce5e2;
            --text: #1c2c2a;
            --secondary: #415551;
            --muted: #596e69;
            --faint: #687d78;
            --accent: color-mix(in srgb, var(--ocd-tweak-accent-color, #a5d2c4) 25%, #17463e);
            --accent-soft: color-mix(in srgb, var(--accent) 9%, transparent);
            color-scheme: light;
          }
          @media (min-width:1181px) {
            .workspace { grid-template-columns: 248px minmax(0, var(--reading-width)) minmax(165px,200px); }
          }
          @media (min-width:981px) and (max-width:1180px) {
            .workspace { grid-template-columns: 230px minmax(0, var(--reading-width)) 160px; }
          }
          .site-header { background: color-mix(in srgb, var(--bg) 95%, transparent); transition: background-color .28s ease, border-color .28s ease; }
          .brand { gap: 9px; transition: opacity .18s ease; }
          .brand:hover { opacity: .78; }
          .star-mark circle { display: none; }
          .brand-sub { display: inline-flex; align-items: center; height: 23px; padding: 0 6px; border: 1px solid var(--line); border-radius: 3px; font: 600 11px ui-monospace,SFMono-Regular,Consolas,monospace; letter-spacing: .07em; color: var(--secondary); }
          .header-end { display: flex; align-items: center; gap: 5px; }
          .icon-action { display: inline-flex; justify-content: center; align-items: center; width: 36px; height: 36px; border: 1px solid transparent; border-radius: 7px; color: var(--muted); background: transparent; text-decoration: none; transition: color .18s ease, background-color .18s ease, transform .18s ease; }
          .icon-action svg { width: 19px; height: 19px; }
          .icon-action:hover { color: var(--text); background: var(--surface-hover); transform: translateY(-1px); }
          .icon-action:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
          .search-box { background: var(--surface); border-color: var(--line); transition: border-color .2s ease, background-color .28s ease, box-shadow .2s ease; }
          .search-box:focus-within { box-shadow: 0 0 0 3px var(--accent-soft); }
          .search-box input::placeholder { color: var(--muted); }
          .search-box kbd { border-color: var(--line); color: var(--muted); }
          .search-results { background: var(--surface); border-color: var(--line); box-shadow: 0 16px 42px #0003; }
          .search-results button:hover,.search-results button:focus-visible { background: var(--surface-hover); }
          .top-nav button { color: var(--muted); transition: color .18s ease; }
          .top-nav button:after { content: ""; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: var(--accent); transform: scaleX(0); transform-origin: center; transition: transform .22s ease; }
          .top-nav button.selected:after,.top-nav button:hover:after { transform: scaleX(1); }
          .nav-links button,.toc-links button,.breadcrumb button,.article-footer button { transition: color .18s ease, background-color .18s ease, border-color .18s ease; }
          .nav-links button:hover { background: var(--surface-hover); }
          .nav-links button.active { background: var(--accent-soft); }
          .rail-heading,.group-label,.toc-heading,.breadcrumb span { color: var(--secondary); }
          .group-index,.rail-heading span,.breadcrumb svg,.toc-glyph { color: var(--muted); }
          .nav-links button { color: var(--secondary); }
          .toc-links { border-color: var(--line); }
          .toc-links button { color: var(--muted); }
          .document { animation: document-enter .3s cubic-bezier(.2,.7,.2,1) both; }
          @keyframes document-enter { from { opacity: .94; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
          .intro-section h1 { margin-top: 59px; }
          .lead { color: var(--secondary); }
          .draft-note { background: var(--surface); border-color: var(--line); border-left-color: var(--accent); }
          .note-symbol { color: var(--accent); border-color: var(--accent); }
          .draft-note strong { color: var(--text); }
          .draft-note p,.content-section>p { color: var(--secondary); }
          .content-section h2 { margin-top: 0; }
          .topic-list,.topic-list>button { border-color: var(--line); }
          .topic-list>button { transition: background-color .18s ease, padding-left .18s ease; }
          .topic-list>button:hover { background: var(--surface-hover); padding-left: 10px; }
          .topic-list>button>span,.topic-list svg { color: var(--accent); }
          .topic-list p { color: var(--muted); }
          .placeholder { background: var(--surface); border-color: var(--line); }
          .article-footer button { color: var(--muted); }
          .overview-content { padding-bottom: 70px; }
          .overview-content h2 { scroll-margin-top: 160px; border-top: 1px solid var(--line); margin: 58px 0 16px; padding-top: 39px; font-size: 23px; line-height: 1.4; letter-spacing: -.045em; }
          .overview-content h3 { margin: 30px 0 8px; font-size: 16px; line-height: 1.5; }
          .overview-content p { max-width: 660px; margin: 0 0 18px; color: var(--secondary); font-size: 15px; line-height: 1.95; letter-spacing: -.018em; }
          .overview-content table { display: block; max-width: 100%; overflow-x: auto; border-collapse: collapse; margin: 24px 0; color: var(--secondary); font-size: 13px; line-height: 1.7; }
          .overview-content th,.overview-content td { border-bottom: 1px solid var(--line); padding: 10px 14px; text-align: left; vertical-align: top; }
          .overview-content th { color: var(--text); font-weight: 650; }
          .overview-content th:first-child,.overview-content td:first-child { padding-left: 0; }
          .overview-content pre { overflow-x: auto; margin: 26px 0 0; padding: 24px; border: 1px solid var(--line); border-radius: 7px; background: var(--surface); color: var(--text); font-size: 13px; line-height: 1.9; }
          .overview-content pre code { font: inherit; }
          @media (max-width:720px) {
            .brand-sub { display: inline-flex; height: 21px; font-size: 10px; padding: 0 5px; }
            .brand { gap: 6px; }
            .header-end { gap: 1px; }
            .icon-action { width: 32px; height: 36px; }
            .menu-toggle { background: var(--surface); border-color: var(--line); }
            .menu-toggle span { background: var(--text); }
            .left-rail { background: var(--bg); border-color: var(--line); }
            .mobile-toc { background: var(--surface); border-color: var(--line); box-shadow: 0 12px 28px #0003; }
            .mobile-toc-trigger { color: var(--text); }
            .mobile-toc-links button { color: var(--secondary); }
            .mobile-toc-links button:hover { background: var(--surface-hover); }
            .intro-section h1 { margin-top: 42px; }
            .overview-content h2 { margin-top: 44px; padding-top: 32px; font-size: 21px; }
            .overview-content p { font-size: 14px; }
            .overview-content pre { padding: 16px; font-size: 11px; }
            .document { padding-bottom: 115px; }
          }
          @media (prefers-reduced-motion:reduce) {
            .document { animation: none; }
            .site-shell,.site-header,.icon-action,.top-nav button:after { transition: none; }
          }
      `}</style>
    </div>
  );
}

export default App;
