/* =========================================================================
   Argi Garbi – component templates
   Pure functions: options in → HTML string out. The same functions build
   heroes, playgrounds, usage examples and anatomy, so every place on the
   site renders the exact same markup and CSS classes.
   ========================================================================= */
window.AG = window.AG || {};

(function (AG) {
  let uid = 0;
  const nextId = (prefix) => `${prefix}-${++uid}`;

  const esc = (value = '') =>
    String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const cx = (...classes) => classes.filter(Boolean).join(' ');

  const icon = (name, extra = '') =>
    `<svg class="${cx('icon', extra)}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

  const sizeMod = (base, size) => (size && size !== 'lg' ? `${base}--${size}` : '');

  /* ---------------------------- Button ---------------------------- */
  function button({
    label = 'Button',
    variant = 'primary',
    size = 'lg',
    disabled = false,
    leading,
    trailing,
    block = false,
    href,
    as,
    className = '',
    attrs = ''
  } = {}) {
    const cls = cx(
      'ag-button',
      variant !== 'primary' && `ag-button--${variant}`,
      sizeMod('ag-button', size),
      block && 'ag-button--block',
      className
    );
    const inner = `${leading ? icon(leading) : ''}<span>${esc(label)}</span>${trailing ? icon(trailing) : ''}`;
    if (as === 'span') return `<span class="${cls}" ${attrs}>${inner}</span>`;
    if (href) {
      const external = /^https?:/.test(href);
      return `<a class="${cls}" href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}${disabled ? ' aria-disabled="true" tabindex="-1"' : ''} ${attrs}>${inner}</a>`;
    }
    return `<button type="button" class="${cls}"${disabled ? ' disabled' : ''} ${attrs}>${inner}</button>`;
  }

  /* ------------------------------ FAB ------------------------------ */
  function fab({ variant = 'primary', size = 'lg', disabled = false, label = 'Add item', iconName = 'add', className = '' } = {}) {
    const cls = cx('ag-fab', variant !== 'primary' && `ag-fab--${variant}`, sizeMod('ag-fab', size), className);
    return `<button type="button" class="${cls}" aria-label="${esc(label)}"${disabled ? ' disabled' : ''}>${icon(iconName)}</button>`;
  }

  /* ------------------------------ Link ------------------------------ */
  function link({ label = 'Link', href = '#', size = 'lg', variant = 'primary', withIcon = true, disabled = false, inline = false, className = '' } = {}) {
    const cls = cx(
      'ag-link',
      inline && 'ag-link--inline',
      variant !== 'primary' && `ag-link--${variant}`,
      sizeMod('ag-link', size),
      className
    );
    const external = /^https?:/.test(href);
    return `<a class="${cls}" href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}${disabled ? ' aria-disabled="true" tabindex="-1"' : ''}>${esc(label)}${withIcon && !inline ? icon('arrow-up-right') : ''}</a>`;
  }

  /* ----------------------------- Input ----------------------------- */
  function input({
    label = 'Label',
    placeholder = 'Placeholder text',
    value = '',
    type = 'text',
    leading,
    clearable = false,
    showClear = false,
    helper = '',
    state = 'default',   // default | focus | error
    disabled = false,
    size = 'lg',
    id = nextId('input')
  } = {}) {
    const helperId = helper ? `${id}-help` : '';
    const cls = cx(
      'ag-field',
      state === 'error' && 'ag-field--error',
      state === 'focus' && 'ag-field--focus',
      disabled && 'ag-field--disabled',
      sizeMod('ag-field', size)
    );
    return `
      <div class="${cls}">
        <label class="ag-field__label" for="${id}"><span>${esc(label)}</span></label>
        <div class="ag-field__control">
          ${leading ? icon(leading) : ''}
          <input class="ag-field__input" id="${id}" type="${type}" placeholder="${esc(placeholder)}" value="${esc(value)}"
            ${helperId ? `aria-describedby="${helperId}"` : ''} ${state === 'error' ? 'aria-invalid="true"' : ''} ${disabled ? 'disabled' : ''}>
          ${clearable ? `<button type="button" class="ag-field__clear" data-clear aria-label="Clear ${esc(label)}" ${value || showClear ? '' : 'hidden'} ${disabled ? 'disabled' : ''}>${icon('close')}</button>` : ''}
        </div>
        ${helper ? `<p class="ag-field__helper" id="${helperId}">${esc(helper)}</p>` : ''}
      </div>`;
  }

  /* --------------------------- Text area --------------------------- */
  function textarea({
    label = 'Label',
    placeholder = 'Placeholder text',
    value = '',
    max = 100,
    helper = '',
    state = 'default',
    disabled = false,
    size = 'lg',
    id = nextId('textarea')
  } = {}) {
    const helperId = helper ? `${id}-help` : '';
    const cls = cx(
      'ag-field',
      'ag-field--textarea',
      state === 'error' && 'ag-field--error',
      state === 'focus' && 'ag-field--focus',
      disabled && 'ag-field--disabled',
      sizeMod('ag-field', size)
    );
    return `
      <div class="${cls}">
        <label class="ag-field__label" for="${id}"><span>${esc(label)}</span><span data-counter aria-live="polite">${value.length}/${max}</span></label>
        <div class="ag-field__control">
          <textarea class="ag-field__input" id="${id}" maxlength="${max}" placeholder="${esc(placeholder)}"
            ${helperId ? `aria-describedby="${helperId}"` : ''} ${state === 'error' ? 'aria-invalid="true"' : ''} ${disabled ? 'disabled' : ''}>${esc(value)}</textarea>
          <span class="ag-field__status">${icon('warning', 'icon--md')}</span>
        </div>
        ${helper ? `<p class="ag-field__helper" id="${helperId}">${esc(helper)}</p>` : ''}
      </div>`;
  }

  /* ---------------------------- Checkbox ---------------------------- */
  function checkbox({ label = 'Label text', checked = false, indeterminate = false, error = false, disabled = false, name = '', role = '' } = {}) {
    const cls = cx('ag-check', error && 'ag-check--error', disabled && 'ag-check--disabled');
    return `
      <label class="${cls}">
        <span class="ag-check__box">
          <input class="ag-check__input" type="checkbox" ${name ? `name="${name}"` : ''} ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}
            ${indeterminate ? 'data-indeterminate' : ''} ${role ? `data-role="${role}"` : ''} ${error ? 'aria-invalid="true"' : ''}>
          <svg class="ag-check__mark ag-check__mark--check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none"/></svg>
          <svg class="ag-check__mark ag-check__mark--minus" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h12" fill="none"/></svg>
        </span>
        ${label ? `<span>${esc(label)}</span>` : ''}
      </label>`;
  }

  /* -------------------------- Radio button -------------------------- */
  function radio({ label = 'Label text', checked = false, error = false, disabled = false, name = 'radio', value = '' } = {}) {
    const cls = cx('ag-radio', error && 'ag-radio--error', disabled && 'ag-radio--disabled');
    return `
      <label class="${cls}">
        <span class="ag-radio__dot">
          <input class="ag-radio__input" type="radio" name="${name}" value="${esc(value || label)}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} ${error ? 'aria-invalid="true"' : ''}>
        </span>
        ${label ? `<span>${esc(label)}</span>` : ''}
      </label>`;
  }

  /* ------------------------------ Tag ------------------------------ */
  function tag({ label = 'Tag', variant = 'neutral', size = 'lg', leading, disabled = false } = {}) {
    const cls = cx('ag-tag', variant !== 'neutral' && `ag-tag--${variant}`, sizeMod('ag-tag', size), disabled && 'ag-tag--disabled');
    return `<span class="${cls}">${leading ? icon(leading) : ''}${esc(label)}</span>`;
  }

  /* ------------------------------ Chip ------------------------------ */
  function chip({ label = 'Chip', selected = false, size = 'lg', leading, dropdown = false, upper = false, disabled = false, group = '' } = {}) {
    const cls = cx('ag-chip', dropdown && 'ag-chip--select', upper && 'ag-chip--upper', sizeMod('ag-chip', size));
    const state = dropdown ? `aria-expanded="${selected}"` : `aria-pressed="${selected}"`;
    const trailing = dropdown ? icon(selected ? 'chevron-up' : 'chevron-down') : '';
    return `<button type="button" class="${cls}" ${state} ${group ? `data-chip-group="${group}"` : 'data-chip'} ${disabled ? 'disabled' : ''}>${leading ? icon(leading) : ''}<span>${esc(label)}</span>${trailing}</button>`;
  }

  /* ---------------------- Group (checkbox/radio) ---------------------- */
  function group({ legend = '', items = '', error = '', nested = false } = {}) {
    return `
      <fieldset class="ag-group">
        ${legend ? `<legend class="ag-group__legend">${esc(legend)}</legend>` : ''}
        <div class="${cx('ag-group__items', nested && 'ag-group__items--nested')}">${items}</div>
        ${error ? `<p class="ag-group__error" role="alert">${icon('info')}${esc(error)}</p>` : ''}
      </fieldset>`;
  }

  AG.ui = { esc, cx, icon, button, fab, link, input, textarea, checkbox, radio, tag, chip, group };
})(window.AG);
