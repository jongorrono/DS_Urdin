/* =========================================================================
   Icon sprite – injected once, referenced with <use href="#i-name">.
   24×24 grid, stroke based so icons inherit `currentColor`.
   ========================================================================= */
(function () {
  const dot = (cx, cy, r = 1.3) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="currentColor" stroke="none"/>`;

  const icons = {
    add: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-up-right': '<path d="M7 17L17 7M8.5 7H17v8.5"/>',
    person: '<circle cx="12" cy="8" r="3.6"/><path d="M5 19.5c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5"/>',
    'person-fill': '<circle cx="12" cy="8" r="4" fill="currentColor" stroke="none"/><path d="M4.5 20c0-4 3.4-6.2 7.5-6.2s7.5 2.2 7.5 6.2z" fill="currentColor" stroke="none"/>',
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>',
    'chevron-down': '<path d="M6 9l6 6 6-6"/>',
    'chevron-up': '<path d="M6 15l6-6 6 6"/>',
    'chevron-left': '<path d="M15 6l-6 6 6 6"/>',
    'chevron-right': '<path d="M9 6l6 6-6 6"/>',
    'more-vert': dot(12, 5.5) + dot(12, 12) + dot(12, 18.5),
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    'check-circle': '<circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.2l2.6 2.6 5-5"/>',
    minus: '<path d="M6 12h12"/>',
    warning: '<path d="M12 3.5l9.5 16.5h-19z" fill="currentColor" stroke="none"/><path d="M12 10v4.5" style="stroke:var(--color-neutral-0)"/><circle cx="12" cy="17" r="1" style="fill:var(--color-neutral-0)" stroke="none"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/>' + dot(12, 7.8, 1.1),
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    alarm: '<circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.5 1.5M4.5 4.5L2.5 6.5M19.5 4.5l2 2"/>',
    checklist: '<path d="M3.5 7l2 2 3.5-3.5M12 8h8.5M3.5 15l2 2 3.5-3.5M12 16h8.5"/>',
    help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.6a2.5 2.5 0 1 1 3.6 2.2c-.8.4-1.2 1-1.2 1.8"/>' + dot(12, 16.8, 1.1),
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    copy: '<rect x="8" y="8" width="11" height="12" rx="2"/><path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15"/>'
  };

  const symbols = Object.entries(icons)
    .map(([name, body]) => `<symbol id="i-${name}" viewBox="0 0 24 24">${body}</symbol>`)
    .join('');

  const sprite = document.createElement('div');
  sprite.setAttribute('aria-hidden', 'true');
  sprite.style.display = 'none';
  sprite.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`;
  document.body.prepend(sprite);
})();
