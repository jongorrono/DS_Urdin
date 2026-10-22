/* =========================================================================
   Content model – one entry per component.
   Adding a component = adding one object here (plus its template in
   components.js). Pages, index, next-cards and docs are generated from it.
   ========================================================================= */
window.AG = window.AG || {};

(function (AG) {
  const ui = AG.ui;

  /* Common playground option sets */
  const TYPE_3 = { key: 'type', label: 'Type', options: [['primary', 'Primary'], ['secondary', 'Secondary'], ['tertiary', 'Tertiary']], value: 'primary' };
  const SIZE_3 = { key: 'size', label: 'Size', options: [['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large']], value: 'lg' };
  const STATUS = { key: 'status', label: 'Status', options: [['default', 'Default'], ['disabled', 'Disabled']], value: 'default' };
  const VALIDITY = { key: 'type', label: 'Type', options: [['valid', 'Valid'], ['error', 'Error']], value: 'valid' };
  const TYPE_PRIMARY = { key: 'type', label: 'Type', options: [['primary', 'Primary']], value: 'primary' };
  const sizeFrom = (value) => ({ ...SIZE_3, value });

  /* Reusable panel (white card) */
  const panel = (title, body, actions = '', mod = '') => `
    <div class="panel-card ${mod}">
      <h3 class="t-h3">${title}</h3>
      ${body}
      ${actions ? `<div class="panel-card__actions">${actions}</div>` : ''}
    </div>`;

  const twoButtons = (a, b) => ui.button({ label: a, variant: 'secondary' }) + ui.button({ label: b });

  const housingItems = (error) => {
    const items = [
      ui.checkbox({ label: 'Residential real state', checked: true, error, role: 'child', name: 'housing' }),
      ui.checkbox({ label: 'Single family residential', error, role: 'child', name: 'housing' }),
      ui.checkbox({ label: 'Multi-family residential', error, role: 'child', name: 'housing' }),
      ui.checkbox({ label: 'Commercial real state', checked: true, disabled: true, error })
    ].join('');
    return `
      <div class="ag-group" data-check-tree>
        ${ui.checkbox({ label: 'Real state', indeterminate: true, error, role: 'parent' })}
        <div class="ag-group__items ag-group__items--nested">${items}</div>
        ${error ? `<p class="ag-group__error" role="alert">${ui.icon('info')}You can’t select only one item</p>` : ''}
      </div>`;
  };

  const paymentGroup = (legend, name, error) =>
    ui.group({
      legend,
      error: error ? 'The credit card option is not correct' : '',
      items: [
        ui.radio({ label: 'Credit card', checked: true, name, error }),
        ui.radio({ label: 'Paypal', name, error }),
        ui.radio({ label: 'Digital wallets', name, disabled: true, error }),
        ui.radio({ label: 'Bizzum', name, error })
      ].join('')
    });

  const datePicker = () => {
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<span aria-hidden="true">${d}</span>`).join('');
    const blanks = '<span></span><span></span>';
    let days = '';
    for (let d = 1; d <= 31; d++) {
      const attrs = d === 17 ? 'aria-selected="true"' : d === 5 ? 'aria-current="date"' : 'aria-selected="false"';
      days += `<span><button type="button" class="datepicker__day" data-day="${d}" ${attrs} aria-label="August ${d}, 2024">${d}</button></span>`;
    }
    return `
      <div class="datepicker" data-datepicker>
        <button type="button" class="datepicker__trigger">Date ${ui.icon('chevron-up')}</button>
        <div class="datepicker__panel">
          <div class="datepicker__head">
            <span class="datepicker__caption">Select date</span>
            <span class="datepicker__date" data-date-label>Sat, Aug 17</span>
          </div>
          <div class="datepicker__nav">
            <button type="button" class="datepicker__month">August 2024 ${ui.icon('chevron-down')}</button>
            <span class="datepicker__nav-btns">
              <button type="button" aria-label="Previous month">${ui.icon('chevron-left')}</button>
              <button type="button" aria-label="Next month">${ui.icon('chevron-right')}</button>
            </span>
          </div>
          <div class="datepicker__grid">${weekDays}${blanks}${days}</div>
          <div class="datepicker__actions">
            ${ui.button({ label: 'Cancel', variant: 'secondary', size: 'md' })}
            ${ui.button({ label: 'Select', size: 'md' })}
          </div>
        </div>
      </div>`;
  };

  const phoneList = () => {
    const rows = [['Jose Ignacio', 'a'], ['Maria Luisa', 'b'], ['Jon Gorroño', 'c'], ['Eneko Gorroño', 'd']]
      .map(([n, a]) => `<li class="phone__row"><span class="avatar avatar--${a}" aria-hidden="true"></span><span>${n}</span>${ui.icon('more-vert')}</li>`)
      .join('');
    const tabs = [
      ['<span class="avatar avatar--c" aria-hidden="true"></span>', 'Jesus M'],
      [ui.icon('alarm'), 'Clock in'],
      [ui.icon('checklist'), 'Work order'],
      [ui.icon('help'), 'Help'],
      [ui.icon('more-vert'), 'More']
    ].map(([i, l]) => `<span>${i}${l}</span>`).join('');
    return `
      <div class="phone">
        <p class="phone__caption">Operator</p>
        <ul class="phone__list">${rows}</ul>
        <span class="phone__fab">${ui.fab({ size: 'sm' })}</span>
        <div class="phone__tabs">${tabs}</div>
        <div class="phone__indicator"></div>
      </div>`;
  };

  /* ===================================================================
     Components
     =================================================================== */
  AG.components = [
    {
      slug: 'button',
      name: 'Button',
      summary: 'Triggers an action or submits an intention',
      gradient: 'grad-button',
      hero: () => ui.button({ label: 'Button text', leading: 'person', trailing: 'close' }),
      controls: [TYPE_3, SIZE_3, STATUS],
      playground: (s) => ui.button({ label: 'Save changes', variant: s.type, size: s.size, disabled: s.status === 'disabled', className: s.size === 'lg' ? 'ag-button--lg-wide' : '' }),
      usage: () => [
        {
          label: 'Modal',
          plain: true,
          html: `
            <div class="modal" role="dialog" aria-labelledby="modal-title">
              <div class="modal__header">
                <h3 class="modal__title" id="modal-title">Delete image</h3>
                <button type="button" class="modal__close" aria-label="Close">${ui.icon('close')}</button>
              </div>
              <p class="modal__body">Are you sure that you want to delete the image?</p>
              <div class="modal__footer">${twoButtons('Cancel', 'Yes, delete')}</div>
            </div>`
        },
        { label: 'Date picker', plain: true, html: datePicker() }
      ],
      anatomy: {
        parts: ['Container', 'Leading icon (optional)', 'Label', 'Trailing icon (optional)'],
        subject: () => ui.button({ label: 'Button text', leading: 'person', trailing: 'close' }),
        markers: [{ side: 'left', at: '50%' }, { side: 'top', at: '14%' }, { side: 'bottom', at: '50%' }, { side: 'top', at: '87%' }]
      },
      next: ['fab', 'link'],
      code: `import { Button } from "./components/Button/Button";

export default function App() {
  const handleClick = () => console.log("Button clicked");

  return (
    <Button variant="primary" size="lg" onClick={handleClick}>
      Save changes
    </Button>
  );
}`
    },

    {
      slug: 'fab',
      name: 'Fab',
      longName: 'Floating Action Button',
      summary: 'Floats the primary action within reach',
      gradient: 'grad-fab',
      hero: () => ui.fab(),
      controls: [TYPE_3, SIZE_3, STATUS],
      playground: (s) => ui.fab({ variant: s.type, size: s.size, disabled: s.status === 'disabled' }),
      usage: () => [{ label: 'Add a new item', plain: true, html: phoneList() }],
      anatomy: {
        parts: ['Container', 'Icon'],
        subject: () => ui.fab(),
        markers: [{ side: 'left', at: '50%' }, { side: 'top', at: '50%' }]
      },
      next: ['button', 'link'],
      code: `import { Fab } from "./components/Fab/Fab";

<Fab aria-label="Add item" size="lg" onClick={() => addItem()} />`
    },

    {
      slug: 'link',
      name: 'Link',
      summary: 'Takes users to another page or resource',
      gradient: 'grad-link',
      hero: () => ui.link({ label: 'Link', href: '#link', className: 'big-link' }),
      controls: [TYPE_PRIMARY, SIZE_3, STATUS],
      playground: (s) => ui.link({ label: 'Link', href: '#link', variant: s.type, size: s.size, disabled: s.status === 'disabled' }),
      usage: () => [
        {
          label: 'Inline text',
          html: `
            <div class="dialog-card">
              <h3 class="dialog-card__title">We use cookies</h3>
              <p class="dialog-card__text">Cookies are small fragments of text that the websites you visit send to the browser in order to remember information about your visit ${ui.link({ label: 'Read about cookies', href: 'https://developer.mozilla.org/docs/Web/HTTP/Cookies', inline: true })}</p>
            </div>`
        },
        {
          label: 'External links',
          html: `
            <div class="dialog-card">
              <h3 class="dialog-card__title">React Design system Kit</h3>
              <p class="dialog-card__text">A react starter kit helps teams design faster with consistency. Accesible, clean and scalable. Build for real products not demos.</p>
              <div>${ui.link({ label: 'React Documentation', href: 'https://react.dev' })}</div>
            </div>`
        }
      ],
      anatomy: {
        parts: ['Underline', 'Link text', 'Trailing icon (optional)'],
        subject: () => ui.link({ label: 'Link', href: '#link', className: 'big-link' }),
        markers: [{ side: 'bottom', at: '40%' }, { side: 'top', at: '30%' }, { side: 'top', at: '82%' }]
      },
      next: ['fab', 'input'],
      code: `import { Link } from "./components/Link/Link";

<Link href="https://react.dev" external>
  React Documentation
</Link>`
    },

    {
      slug: 'input',
      name: 'Input',
      summary: 'Captures a short, single-line text entry',
      gradient: 'grad-input',
      hero: () => `<div style="width:min(364px,100%)">${ui.input({ leading: 'person-fill', clearable: true, value: '', helper: 'Helper text' })}</div>`,
      controls: [TYPE_PRIMARY, sizeFrom('md'), STATUS],
      playground: (s) => `<div style="width:min(364px,100%)">${ui.input({
        leading: 'person-fill',
        clearable: true,
        showClear: true,
        size: s.size,
        disabled: s.status === 'disabled',
        helper: 'Helper text'
      })}</div>`,
      usage: () => [
        {
          html: panel('Register', `
            <div class="panel-card__fields">
              ${ui.input({ label: 'Full name', value: 'Jon Gorroño', clearable: true })}
              ${ui.input({ label: 'Password', type: 'password', value: 'argigarbi', leading: 'person-fill', state: 'error', helper: 'your password must be 8+ characters' })}
            </div>`, twoButtons('Back', 'Register'))
        },
        {
          html: panel('Search real state', `
            <div class="panel-card__fields">
              ${ui.input({ label: 'Search city', value: 'Bilbao', leading: 'search', clearable: true })}
              ${ui.input({ label: 'Area', value: 'Old town', leading: 'person-fill' })}
            </div>`, twoButtons('Cancel', 'Search'))
        }
      ],
      anatomy: {
        parts: ['Container', 'Underline', 'Leading icon (optional)', 'Trailing action (optional)', 'Label', 'Placeholder text', 'Helper text (optional)'],
        subject: () => `<div style="width:min(300px,58vw)">${ui.input({ leading: 'person-fill', clearable: true, value: 'Placeholder', helper: 'Helper text' })}</div>`,
        markers: [{ side: 'right', at: '50%' }, { side: 'bottom', at: '75%' }, { side: 'top', at: '7%' }, { side: 'top', at: '93%' }, { side: 'left', at: '9%' }, { side: 'bottom', at: '30%' }, { side: 'left', at: '91%' }]
      },
      next: ['link', 'textarea'],
      code: `import { Input } from "./components/Input/Input";

<Input
  label="Full name"
  placeholder="Jon Gorroño"
  helperText="As it appears on your ID"
  clearable
/>`
    },

    {
      slug: 'textarea',
      name: 'Text area',
      summary: 'Captures longer, multi-line freeform text',
      gradient: 'grad-textarea',
      hero: () => `<div style="width:min(364px,100%)">${ui.textarea({ helper: 'Helper text' })}</div>`,
      controls: [TYPE_PRIMARY, SIZE_3, STATUS],
      playground: (s) => `<div style="width:min(364px,100%)">${ui.textarea({
        size: s.size,
        disabled: s.status === 'disabled',
        helper: 'Helper text'
      })}</div>`,
      usage: () => [
        {
          html: panel('Course registration', `
            <div class="panel-card__fields">
              ${ui.input({ label: 'Full name', value: 'Jon Gorroño' })}
              ${ui.textarea({ label: 'Topic', state: 'focus', value: 'I wan’t to became a UX engineer and to achieve so I’d like to enroll to the course.' })}
            </div>`, twoButtons('Back', 'Register'))
        },
        {
          html: panel('Report an issue', `
            <div class="panel-card__fields">
              ${ui.input({ label: 'Full name', value: 'Jon Gorroño' })}
              ${ui.textarea({ label: 'Description', state: 'error', value: 'I am reaching you becauase you are an important person.', helper: 'The lenght must be minimum 60 characters' })}
            </div>`, twoButtons('Cancel', 'Report'))
        }
      ],
      anatomy: {
        parts: ['Container', 'Underline', 'Placeholder text', 'Counter (optional)', 'Label (optional)', 'Helper text (optional)'],
        subject: () => `<div style="width:min(300px,58vw)">${ui.textarea({ helper: 'Helper text' })}</div>`,
        markers: [{ side: 'right', at: '55%' }, { side: 'bottom', at: '75%' }, { side: 'left', at: '25%' }, { side: 'top', at: '92%' }, { side: 'left', at: '5%' }, { side: 'left', at: '95%' }]
      },
      next: ['input', 'checkbox'],
      code: `import { TextArea } from "./components/TextArea/TextArea";

<TextArea
  label="Description"
  maxLength={100}
  placeholder="Tell us what happened"
/>`
    },

    {
      slug: 'checkbox',
      name: 'Checkbox',
      summary: 'Selects any number of options from a list',
      gradient: 'grad-checkbox',
      hero: () => `<div class="panel-card panel-card--sm">${housingItems(false)}</div>`,
      controls: [VALIDITY, STATUS],
      playground: (s) => ui.checkbox({ label: '', checked: true, error: s.type === 'error', disabled: s.status === 'disabled' }),
      usage: () => [
        { html: panel('Housing', housingItems(false), twoButtons('Cancel', 'Acept')) },
        { html: panel('Search real state', housingItems(true), twoButtons('Cancel', 'Search')) }
      ],
      anatomy: {
        parts: ['Container', 'Icon', 'Label text'],
        subject: () => ui.checkbox({ label: 'Label text', checked: true }),
        markers: [{ side: 'left', at: '50%' }, { side: 'top', at: '18%' }, { side: 'bottom', at: '65%' }]
      },
      next: ['textarea', 'radio'],
      code: `import { Checkbox } from "./components/Checkbox/Checkbox";

<Checkbox
  label="Residential real state"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>`
    },

    {
      slug: 'radio',
      name: 'Radio button',
      docsName: 'RadioButton',
      summary: 'Selects exactly one option from a set',
      gradient: 'grad-radio',
      hero: () => `<div class="panel-card panel-card--sm">${paymentGroup('Select payment method', 'hero-pay', false)}</div>`,
      controls: [VALIDITY, STATUS],
      playground: (s) => ui.radio({ label: 'Radio with label', checked: true, name: 'pg-radio', error: s.type === 'error', disabled: s.status === 'disabled' }),
      usage: () => [
        { html: panel('Payments', paymentGroup('Select payment method', 'pay-a', false), twoButtons('Back', 'Continue')) },
        { html: panel('Payments', paymentGroup('Group', 'pay-b', true), twoButtons('Back', 'Continue')) }
      ],
      anatomy: {
        parts: ['Ring', 'Fill', 'Label text'],
        subject: () => ui.radio({ label: 'Label text', checked: true, name: 'anatomy-radio' }),
        markers: [{ side: 'left', at: '50%' }, { side: 'bottom', at: '18%' }, { side: 'top', at: '65%' }]
      },
      next: ['checkbox', 'tag'],
      code: `import { RadioButton } from "./components/RadioButton/RadioButton";

<RadioButton name="payment" value="card" label="Credit card" defaultChecked />
<RadioButton name="payment" value="paypal" label="Paypal" />`
    },

    {
      slug: 'tag',
      name: 'Tag',
      summary: 'Labels an item with a status or category',
      gradient: 'grad-tag',
      hero: () => `
        <div class="panel-card panel-card--sm">
          <h3 class="t-h3" style="font-size:24px">Career match</h3>
          <p class="t-body-3">Your skills related to the product field are:</p>
          <div class="tag-row">${ui.tag({ label: 'Design engineer', size: 'sm' })}${ui.tag({ label: 'Design systems', size: 'sm' })}</div>
        </div>`,
      controls: [{ key: 'type', label: 'Type', options: [['neutral', 'Neutral'], ['inverse', 'Inverse'], ['info', 'Success'], ['error', 'Error'], ['brand', 'Brand']], value: 'inverse' }, SIZE_3],
      playground: (s) => ui.tag({ label: 'Tag', variant: s.type, size: s.size }),
      usage: () => [
        {
          html: panel('Career match', `
            <p class="panel-card__text">Your skills related to the product field are:</p>
            <div class="tag-row">${['Design engineer', 'Design systems', 'User experience', 'User interface'].map((l) => ui.tag({ label: l })).join('')}</div>`,
          ui.button({ label: 'Continue' }), 'panel-card--wide')
        },
        {
          html: panel('Career match', `
            <p class="panel-card__text">Your match with the position is high</p>
            <div class="tag-row">${ui.tag({ label: 'Great match', variant: 'info', leading: 'check' })}</div>`,
          twoButtons('Back', 'Finish'), 'panel-card--wide')
        }
      ],
      anatomy: {
        parts: ['Container', 'Label'],
        subject: () => ui.tag({ label: 'Tag', variant: 'inverse' }),
        markers: [{ side: 'left', at: '50%' }, { side: 'bottom', at: '50%' }]
      },
      next: ['radio', 'chip'],
      code: `import { Tag } from "./components/Tag/Tag";

<Tag variant="info" icon="check">Great match</Tag>`
    },

    {
      slug: 'chip',
      name: 'Chip',
      summary: 'Filters or selects content with a tap',
      gradient: 'grad-chip',
      hero: () => `
        <div class="panel-card panel-card--sm">
          <h3 class="t-h3" style="font-size:22px">Career match</h3>
          <p class="t-body-5">Select your main skill</p>
          <div class="tag-row">${['Data', 'Engineering', 'Product', 'Business'].map((l) => ui.chip({ label: l, size: 'sm', upper: true, selected: l === 'Product', group: 'hero-skill' })).join('')}</div>
        </div>`,
      controls: [TYPE_PRIMARY, sizeFrom('sm'), STATUS],
      playground: (s) => ui.chip({ label: 'Chips', size: s.size, disabled: s.status === 'disabled' }),
      usage: () => [
        {
          label: 'Make Selection',
          inStage: true,
          html: panel('Career match', `
            <p class="panel-card__text">Select your main skill</p>
            <div class="tag-row" role="group" aria-label="Main skill">${['Data', 'Engineering', 'Product', 'Business'].map((l) => ui.chip({ label: l, upper: true, selected: l === 'Product', group: 'skill' })).join('')}</div>`, '', 'panel-card--wide')
        },
        {
          label: 'Filter content',
          inStage: true,
          html: panel('Real state', `
            <p class="panel-card__text">Select your prefered housing</p>
            <div class="tag-row" style="gap:24px">${ui.chip({ label: 'Most popular', dropdown: true })}${ui.chip({ label: 'Best prices', dropdown: true, selected: true })}</div>
            <div class="photo-list">
              <p class="photo-list__caption">Additional Photographs</p>
              ${[['Oiñiturri', 'a'], ['Astepe auzunea', 'b'], ['Torre baserria', 'c']].map(([n, k]) => `
                <div class="photo-list__row"><span class="photo-list__thumb photo-list__thumb--${k}" aria-hidden="true"></span>
                <span><span class="photo-list__name">${n}</span><br><span class="photo-list__meta">488 KB</span></span></div>`).join('')}
            </div>`, '', 'panel-card--wide')
        }
      ],
      anatomy: {
        parts: ['Container', 'Leading icon', 'Label', 'Trailing action'],
        subject: () => ui.chip({ label: 'Chips', leading: 'clock', dropdown: true }),
        markers: [{ side: 'left', at: '50%' }, { side: 'top', at: '18%' }, { side: 'bottom', at: '50%' }, { side: 'top', at: '84%' }]
      },
      next: ['tag', 'button'],
      code: `import { Chip } from "./components/Chip/Chip";

<Chip selected={skill === "product"} onClick={() => setSkill("product")}>
  Product
</Chip>`
    }
  ];

  AG.getComponent = (slug) => AG.components.find((c) => c.slug === slug);

  AG.nav = [
    { label: 'About', href: 'https://www.jongodesign.com/#grid-3x2' },
    { label: 'Projects', href: 'https://www.jongodesign.com/#project' },
    { label: 'Code lab', href: 'https://www.jongodesign.com/#web-section-sideproject' },
    { label: 'Eus', href: 'https://www.jongodesign.com/index-eus.php' }
  ];

  AG.links = {
    chat: 'https://www.jongodesign.com/#footer-v2',
    github: 'https://github.com/jongorrono/DS_Urdin/tree/master/packages/Argi-garbi-system-react',
    repo: 'https://github.com/jongorrono/DS_Urdin.git',
    figma: 'https://www.figma.com/community/file/1689658730053225182/minimal-ds-argigarbi'
  };
})(window.AG);
