/* =========================================================================
   App – hash router + interaction wiring (event delegation, no framework)
   Routes:
     #home (default)   → Figma tab
     #react            → React tab (component index)
     #documentation    → Getting started
     #<component-slug> → component page, e.g. #button, #input
   ========================================================================= */
(function (AG) {
  const view = document.getElementById('view');
  const nav = document.querySelector('[data-nav]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const back = document.querySelector('[data-nav-back]');
  const backLabel = back.querySelector('.nav-back__label');
  const BASE_TITLE = 'Argi Garbi System';

  /* ------------------------------ Router ------------------------------ */
  function parseRoute() {
    const slug = decodeURIComponent(location.hash.replace(/^#\/?/, '')).toLowerCase();
    if (!slug || slug === 'home' || slug === 'figma') return { name: 'home', tab: 'figma' };
    if (slug === 'react') return { name: 'home', tab: 'react' };
    if (slug === 'documentation' || slug === 'docs') return { name: 'docs' };
    const cmp = AG.getComponent(slug);
    return cmp ? { name: 'component', cmp } : { name: 'home', tab: 'figma' };
  }

  function render() {
    const route = parseRoute();
    let html = '';
    let title = BASE_TITLE;
    let backText = '';

    if (route.name === 'home') {
      html = AG.pages.home(route.tab);
      if (route.tab === 'react') title = `React components — ${BASE_TITLE}`;
    } else if (route.name === 'docs') {
      html = AG.pages.docs();
      title = `Documentation — ${BASE_TITLE}`;
      backText = 'Documentation';
    } else {
      html = AG.pages.component(route.cmp);
      title = `${route.cmp.name} — ${BASE_TITLE}`;
      backText = route.cmp.name;
    }

    view.innerHTML = `<div class="view">${html}</div>`;
    document.title = title;

    back.dataset.visible = String(Boolean(backText));
    backLabel.textContent = backText;
    back.setAttribute('aria-label', `Back to components (current: ${backText})`);

    hydrate(view);
    closeNav();
    window.scrollTo({ top: 0, behavior: 'instant' });
    view.focus({ preventScroll: true });
  }

  /* Things that can't be expressed in HTML attributes */
  function hydrate(root) {
    root.querySelectorAll('input[data-indeterminate]').forEach((el) => { el.indeterminate = true; });
  }

  /* ------------------------------ Navbar ------------------------------ */
  function closeNav() {
    nav.dataset.open = 'false';
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', () => {
    const open = nav.dataset.open !== 'true';
    nav.dataset.open = String(open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) closeNav(); });

  /* --------------------------- Playground --------------------------- */
  function updatePlayground(option) {
    const section = option.closest('[data-playground]');
    const cmp = AG.getComponent(section.dataset.playground);
    const groupEl = option.closest('[role="radiogroup"]');
    groupEl.querySelectorAll('[role="radio"]').forEach((el) => el.setAttribute('aria-checked', String(el === option)));

    const state = {};
    section.querySelectorAll('[role="radio"][aria-checked="true"]').forEach((el) => { state[el.dataset.control] = el.dataset.value; });
    const stage = section.querySelector('[data-stage]');
    stage.innerHTML = cmp.playground(state);
    hydrate(stage);
  }

  /* Arrow-key support for the option radiogroups */
  view.addEventListener('keydown', (e) => {
    const option = e.target.closest('.ag-option');
    if (!option || !['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
    const options = [...option.parentElement.children];
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
    const next = options[(options.indexOf(option) + dir + options.length) % options.length];
    next.focus();
    next.click();
    e.preventDefault();
  });

  /* ------------------------- Checkbox tree ------------------------- */
  function syncCheckTree(tree, source) {
    const parent = tree.querySelector('[data-role="parent"]');
    const children = [...tree.querySelectorAll('[data-role="child"]')];
    if (source === parent) {
      children.forEach((c) => { c.checked = parent.checked; });
    }
    const checked = children.filter((c) => c.checked).length;
    parent.checked = checked === children.length;
    parent.indeterminate = checked > 0 && checked < children.length;
  }

  /* ------------------------ Delegated clicks ------------------------ */
  view.addEventListener('click', (e) => {
    const t = e.target;

    const option = t.closest('.ag-option');
    if (option) return updatePlayground(option);

    const accordion = t.closest('.ag-accordion__trigger');
    if (accordion) {
      const item = accordion.closest('.ag-accordion__item');
      const open = item.dataset.open !== 'true';
      item.dataset.open = String(open);
      accordion.setAttribute('aria-expanded', String(open));
      return;
    }

    const groupChip = t.closest('[data-chip-group]');
    if (groupChip) {
      const name = groupChip.dataset.chipGroup;
      view.querySelectorAll(`[data-chip-group="${name}"]`).forEach((c) => c.setAttribute('aria-pressed', String(c === groupChip)));
      return;
    }

    const chip = t.closest('[data-chip]');
    if (chip) {
      const attr = chip.hasAttribute('aria-expanded') ? 'aria-expanded' : 'aria-pressed';
      const on = chip.getAttribute(attr) !== 'true';
      chip.setAttribute(attr, String(on));
      const use = chip.querySelector('.icon:last-child use');
      if (attr === 'aria-expanded' && use) use.setAttribute('href', on ? '#i-chevron-up' : '#i-chevron-down');
      return;
    }

    const clear = t.closest('[data-clear]');
    if (clear) {
      const input = clear.parentElement.querySelector('input');
      input.value = '';
      clear.hidden = true;
      input.focus();
      return;
    }

    const day = t.closest('.datepicker__day');
    if (day) {
      const picker = day.closest('[data-datepicker]');
      picker.querySelectorAll('.datepicker__day').forEach((d) => d.setAttribute('aria-selected', String(d === day)));
      const date = new Date(2024, 7, Number(day.dataset.day));
      picker.querySelector('[data-date-label]').textContent = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      return;
    }

    const copy = t.closest('[data-copy]');
    if (copy) {
      const text = copy.parentElement.querySelector('code').textContent;
      navigator.clipboard?.writeText(text).then(() => {
        copy.textContent = 'Copied';
        setTimeout(() => { copy.textContent = 'Copy'; }, 1400);
      });
    }
  });

  /* ------------------------- Delegated input ------------------------- */
  view.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('.ag-field__input')) {
      const field = t.closest('.ag-field');
      const clear = field.querySelector('[data-clear]');
      if (clear) clear.hidden = !t.value;
      const counter = field.querySelector('[data-counter]');
      if (counter) counter.textContent = `${t.value.length}/${t.maxLength}`;
    }
  });

  view.addEventListener('change', (e) => {
    const tree = e.target.closest('[data-check-tree]');
    if (tree && e.target.matches('.ag-check__input')) syncCheckTree(tree, e.target);
  });

  /* ------------------------------ Boot ------------------------------ */
  window.addEventListener('hashchange', render);
  render();
})(window.AG);
