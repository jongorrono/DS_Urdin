/* =========================================================================
   Page templates – home (Figma / React tabs), component detail, docs
   ========================================================================= */
window.AG = window.AG || {};

(function (AG) {
  const ui = AG.ui;

  /* ------------------------------ Home ------------------------------ */
  function homeHero() {
    return `
      <header class="home-hero">
        <h1 class="t-display">Argi Garbi <span class="home-hero__accent">System</span></h1>
        <p class="home-hero__lead">A minimal design system built systematically from Figma to React</p>
      </header>`;
  }

  function segmented(active) {
    const tab = (id, label, href) =>
      `<a class="ag-segmented__item" role="tab" href="${href}" aria-selected="${active === id}" ${active === id ? 'aria-current="page"' : ''}>${label}</a>`;
    return `<nav class="ag-segmented" role="tablist" aria-label="Library">${tab('react', 'React', '#react')}${tab('figma', 'Figma', '#home')}</nav>`;
  }

  function figmaCard() {
    return `
      <a class="ds-card" href="${AG.links.figma}" target="_blank" rel="noopener" aria-label="Open the Argi Garbi Figma System (opens in Figma)">
        <span class="ds-card__media" aria-hidden="true">
          <span class="mini-modal">
            <span class="mini-modal__header"><span class="mini-modal__title">Delete image</span>${ui.icon('close', 'icon--sm')}</span>
            <span class="mini-modal__body" style="display:block">Are you sure that you want to delete the image?</span>
            <span class="mini-modal__footer">
              ${ui.button({ label: 'Cancel', variant: 'tertiary', as: 'span' })}
              ${ui.button({ label: 'Yes, delete', as: 'span' })}
            </span>
          </span>
        </span>
        <span class="ds-card__body">
          <span class="ds-card__default">
            <span class="t-h4" style="display:block;margin-bottom:16px">Argi Garbi Figma System</span>
            <span class="ds-card__desc">The Figma source for the Argi Garbi System. A Figma Starter Kit that helps teams design faster with consistency</span>
          </span>
          <span class="ds-card__hover">The Figma source for the Argi Garbi System</span>
        </span>
      </a>`;
  }

  function componentIndex() {
    const items = AG.components
      .map((c) => `
        <li>
          <a class="component-item" href="#${c.slug}">
            <span class="component-item__status" title="Ready">${ui.icon('check-circle')}</span>
            <span class="component-item__content">
              <span class="component-item__title">${c.name}</span>
              <span class="component-item__row">
                <span class="component-item__desc">${c.summary}</span>
                <span class="component-item__more">${ui.icon('more-vert')}</span>
              </span>
            </span>
          </a>
        </li>`)
      .join('');
    return `
      <section class="component-index" aria-labelledby="index-count">
        <p class="component-index__count" id="index-count">${AG.components.length} components</p>
        <ul class="component-grid">${items}</ul>
        <div class="cta-row">
          ${ui.button({ label: 'GitHub', variant: 'tertiary', size: 'md', href: AG.links.github })}
          ${ui.button({ label: 'Documentation', size: 'md', href: '#documentation' })}
        </div>
      </section>`;
  }

  function home(tab) {
    return `
      ${homeHero()}
      <div class="home-body">
        ${segmented(tab)}
        ${tab === 'react' ? componentIndex() : figmaCard()}
      </div>`;
  }

  /* ------------------------- Component page ------------------------- */
  function controlsMarkup(cmp) {
    return cmp.controls
      .map((group) => `
        <div class="control-group">
          <span class="control-group__label" id="ctl-${group.key}">${group.label}</span>
          <div class="control-group__options" role="radiogroup" aria-labelledby="ctl-${group.key}">
            ${group.options
              .map(([value, label]) => `<button type="button" class="ag-option" role="radio" data-control="${group.key}" data-value="${value}" aria-checked="${value === group.value}">${label}</button>`)
              .join('')}
          </div>
        </div>`)
      .join('');
  }

  function usageMarkup(cmp) {
    const examples = cmp.usage()
      .map((ex) => {
        if (ex.plain) {
          return `<div class="usage__example"><p class="usage__label">${ex.label}</p><div class="usage__stage usage__stage--plain">${ex.html}</div></div>`;
        }
        if (ex.inStage) {
          return `<div class="usage__example"><div class="usage__stage"><p class="usage__stage-label">${ex.label}</p>${ex.html}</div></div>`;
        }
        return `<div class="usage__example">${ex.label ? `<p class="usage__label">${ex.label}</p>` : ''}<div class="usage__stage">${ex.html}</div></div>`;
      })
      .join('');
    return `<div class="usage">${examples}</div>`;
  }

  function anatomyMarkup(cmp) {
    const { parts, subject, markers } = cmp.anatomy;
    const markerHtml = markers
      .map((m, i) => {
        const pos = m.side === 'top' || m.side === 'bottom' ? `left:${m.at}` : `top:${m.at}`;
        return `<span class="anatomy__marker" data-side="${m.side}" style="${pos}" aria-hidden="true">${i + 1}</span>`;
      })
      .join('');
    return `
      <div class="anatomy">
        <figure class="anatomy__figure" inert>
          <span class="anatomy__subject">${subject()}${markerHtml}</span>
        </figure>
        <ol class="anatomy__list">${parts.map((p) => `<li>${p}</li>`).join('')}</ol>
      </div>`;
  }

  function nextMarkup(cmp) {
    const cards = cmp.next
      .map((slug) => AG.getComponent(slug))
      .map((n) => `
        <article class="next-card">
          <div class="next-card__media ${n.gradient}" inert aria-hidden="true">${n.hero()}</div>
          <a class="next-card__label" href="#${n.slug}">${n.longName || n.name}</a>
        </article>`)
      .join('');
    return `
      <section class="next" aria-labelledby="next-title">
        <h2 class="t-h2" id="next-title">Next components</h2>
        <div class="next__grid">${cards}</div>
      </section>`;
  }

  function component(cmp) {
    const state = Object.fromEntries(cmp.controls.map((g) => [g.key, g.value]));
    return `
      <section class="cmp-hero" aria-labelledby="cmp-title">
        <h1 class="t-h2 cmp-hero__title" id="cmp-title"><span class="visually-hidden">${cmp.name}: </span>${cmp.summary}</h1>
        <div class="stage-card ${cmp.gradient}">${cmp.hero()}</div>
      </section>

      <section class="section playground" aria-labelledby="pg-title" data-playground="${cmp.slug}">
        <div class="section__head">
          <h2 class="t-h2" id="pg-title">Playground</h2>
          <p class="section__sub">Test the ${cmp.name.toLowerCase()} in different situations</p>
        </div>
        <div class="playground__controls">${controlsMarkup(cmp)}</div>
        <div class="playground__stage" data-stage aria-live="polite">${cmp.playground(state)}</div>
      </section>

      <section class="section" aria-labelledby="usage-title">
        <div class="section__head"><h2 class="t-h2" id="usage-title">Usage examples</h2></div>
        ${usageMarkup(cmp)}
      </section>

      <section class="section" aria-labelledby="anatomy-title">
        <div class="section__head"><h2 class="t-h2" id="anatomy-title">Anatomy</h2></div>
        ${anatomyMarkup(cmp)}
      </section>

      ${nextMarkup(cmp)}`;
  }

  /* -------------------------- Documentation -------------------------- */
  const code = (text) => `<pre class="code"><code>${ui.esc(text)}</code><button type="button" class="code__copy" data-copy>Copy</button></pre>`;

  function docs() {
    const accordion = AG.components
      .map((c, i) => `
        <div class="ag-accordion__item" data-open="${i === 0}">
          <h3>
            <button type="button" class="ag-accordion__trigger" aria-expanded="${i === 0}" aria-controls="acc-${c.slug}" id="acc-btn-${c.slug}">
              ${c.docsName || c.name}${ui.icon('chevron-down')}
            </button>
          </h3>
          <div class="ag-accordion__panel" id="acc-${c.slug}" role="region" aria-labelledby="acc-btn-${c.slug}">
            <div><div class="ag-accordion__body">${code(c.code)}</div></div>
          </div>
        </div>`)
      .join('');

    return `
      <div class="docs">
        <header class="docs-hero">
          <h1 class="t-display" style="font-size:clamp(40px,7vw,64px)">Getting started</h1>
          <p>Argi Garbi components for React.</p>
        </header>

        <section class="docs-section" aria-labelledby="docs-before">
          <h2 class="t-h2" id="docs-before">Before you start</h2>
          <p>Check these three things once. Without them the component can look unstyled.</p>
          <ul class="docs-checks">
            <li><strong>React 18 or later.</strong> Open your <code>package.json</code> and check the <code>"react"</code> version.</li>
            <li><strong>Argi Garbi tokens.</strong> Import the two token files once, at the root of your app.</li>
            <li><strong>IBM Plex Mono.</strong> Load the font, or the text will fall back to a system font.</li>
          </ul>
          ${code('import "./foundations/tokens-v2.1.css";\nimport "./foundations/tokens-semantic-v2.1.css";')}
        </section>

        <section class="docs-section" aria-labelledby="docs-install">
          <h2 class="t-h2" id="docs-install">Installation</h2>
          <p>Copy the component from GitHub into your project. Keep the folders together.</p>
          <ol class="docs-steps">
            <li>Download the repository.${code(`git clone ${AG.links.repo}`)}</li>
            <li><span>Copy these folders from <code>packages/Argi-garbi-system-react/src</code> into your project's <code>src</code> folder.</span>
              ${code('foundations/\nstyles/\ncomponents/Button/')}
              <span class="docs-note">The component loads its CSS from <code>styles/</code>, so keep the same folder structure.</span>
            </li>
            <li>Import the Button where you want to use it.${code('import { Button } from "./components/Button/Button";')}</li>
          </ol>
        </section>

        <section class="docs-section" aria-labelledby="docs-usage">
          <h2 class="t-h2" id="docs-usage">Basic usage</h2>
          <p>Basic usage of each component</p>
          <div class="ag-accordion docs-usage">${accordion}</div>
        </section>
      </div>`;
  }

  AG.pages = { home, component, docs };
})(window.AG);
