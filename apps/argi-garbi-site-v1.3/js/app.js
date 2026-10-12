/* Argi Garbi System — vanilla JS router + interactive Button documentation page.
   Assets come from js/assets.js (window.ASSETS). Button visuals come from css/button.css. */
const A = window.ASSETS;

const components = [
  ["Button", "LIve", "Triggers an action or submits an intention"],
  ["Link", "Coming soon", "Navigates users to another destination"],
  ["Fab", "Coming soon", "Provides a prominent floating action"],
  ["Input", "Coming soon", "Collects a single line of user input"],
  ["Text area", "Coming soon", "Collects multi-line text"],
  ["Checkbox", "Coming soon", "Allows users to select one or more options"],
  ["Radio button", "Coming soon", "Allows users to select one option from a set"],
  ["Tag", "Coming soon", "Categorizes content with static metadata"],
  ["Chip", "Coming soon", "Represents a discrete filter or dismissible action"]
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/* ---------------------------------------------------------------- shared */

function shell(content, extraClass = "") {
  return `<div class="page ${extraClass}">${content}</div>`;
}

/* Hero + React/Figma switch. React = components list (#react), Figma = Figma source (#home). */
function hero(active) {
  const tab = (name, label, href) =>
    `<a class="mode-switch__tab ${active === name ? "is-active" : ""}" href="${href}" role="tab" aria-selected="${active === name}">${label}</a>`;
  return `
    <section class="hero">
      <div class="hero__text">
        <h1>Argi Garbi <span class="hero__accent">System</span></h1>
        <p>A minimal design system built systematically from Figma to React</p>
      </div>
      <div class="mode-switch" role="tablist" aria-label="Implementation source">
        ${tab("Code", "React", "#react")}${tab("Design", "Figma", "#home")}
      </div>
    </section>`;
}

/* ------------------------------------------------------------------ home */

function homeView() {
  return shell(`
    ${hero("Design")}
    <a class="home-visual" href="https://www.figma.com/community/file/1689658730053225182"
       target="_blank" rel="noopener noreferrer" aria-label="Open the Figma source for the Argi Garbi System">
      <div class="home-visual__image">
        <img src="${A.cardHome}" alt="Delete image modal with Cancel and Yes, delete buttons" width="974" height="858">
        <span class="home-visual__overlay" aria-hidden="true"></span>
      </div>
      <div class="home-visual__copy">
        <p class="home-visual__title">Argi Garbi Figma System</p>
        <p class="home-visual__text">The Figma source for the Argi Garbi System. A Figma Starter Kit that helps teams design faster with consistency</p>
      </div>
    </a>
  `);
}

/* ----------------------------------------------------------------- react */

function componentRow([name, status, description]) {
  const live = status === "LIve";
  const inner = `
      <span class="component-status">
        <span class="status-icon ${live ? "status-icon--live" : "status-icon--soon"}">
          <img src="${live ? A.completed : A.completing}" alt="" ${live ? "" : 'class="is-progress"'}>
        </span>
      </span>
      <span class="component-main">
        <span class="component-header">
          <span class="component-name">${name}</span>
          <span class="status-tag ${live ? "status-tag--live" : "status-tag--soon"}">${status}</span>
        </span>
        <span class="component-description">
          <span>${description}</span>
          <img class="more" src="${A.more}" alt="">
        </span>
      </span>`;
  return live
    ? `<li><a class="component-row" href="#button">${inner}</a></li>`
    : `<li><button class="component-row" type="button" data-toast="${name} — coming soon">${inner}</button></li>`;
}

function reactView(all = false) {
  const visible = all ? components : components.slice(0, 3);
  return shell(`
    ${hero("Code")}
    <section class="components ${all ? "components--all" : ""}">
      <p class="components-heading">${components.length} components</p>
      <ul class="component-list">${visible.map(componentRow).join("")}</ul>
      <div class="view-link-wrap">
        <a class="view-link" href="${all ? "#react" : "#react-view-all"}">
          <span>${all ? "View less" : "View all"}</span>
          <img src="${all ? A.chevronUp : A.chevronDown}" alt="" aria-hidden="true">
        </a>
      </div>
    </section>
  `);
}

/* ---------------------------------------------- button: interactive page */

const FILTERS = [
  { key: "type",   label: "TYPE",   options: [["primary", "Primary"], ["secondary", "Secondary"], ["tertiary", "Tertiary"]] },
  { key: "size",   label: "SIZE",   options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] },
  { key: "status", label: "STATUS", options: [["default", "Default"], ["disabled", "Disabled"]] }
];
const playground = { type: "primary", size: "lg", status: "default" };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
/* Calendar follows the Figma grid: August 2024 starts in the third column (two blank cells). */
const ANCHOR = { y: 2024, m: 7, offset: 2 };
const picker = {
  open: true, y: 2024, m: 7,
  selected: { y: 2024, m: 7, d: 17, label: "Mon, Aug 17" },
  triggerLabel: "Date"
};
const TODAY = { y: 2024, m: 7, d: 5 };

const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();
function startOffset(y, m) {
  let { y: cy, m: cm, offset } = ANCHOR;
  while (cy !== y || cm !== m) {
    if (y > cy || (y === cy && m > cm)) { offset = (offset + daysIn(cy, cm)) % 7; cm++; if (cm > 11) { cm = 0; cy++; } }
    else { cm--; if (cm < 0) { cm = 11; cy--; } offset = (offset - daysIn(cy, cm) % 7 + 7) % 7; }
  }
  return offset;
}

function tag(group, [value, text]) {
  const on = playground[group] === value;
  return `<button class="tag ${on ? "is-selected" : ""}" type="button" data-filter="${group}" data-value="${value}" aria-pressed="${on}">${text}</button>`;
}

function calendarCells() {
  const offset = startOffset(picker.y, picker.m);
  const total = daysIn(picker.y, picker.m);
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(`<span class="cal-cell"></span>`);
  for (let d = 1; d <= total; d++) {
    const sel = picker.selected.y === picker.y && picker.selected.m === picker.m && picker.selected.d === d;
    const today = TODAY.y === picker.y && TODAY.m === picker.m && TODAY.d === d;
    cells.push(`<span class="cal-cell"><button type="button" class="cal-day ${sel ? "is-selected" : ""} ${today && !sel ? "is-today" : ""}" data-day="${d}" ${sel ? 'aria-pressed="true"' : ""}>${d}</button></span>`);
  }
  return cells.join("");
}

function pickerHTML() {
  return `
    <div class="dp-header">
      <p class="dp-label">Select date</p>
      <p class="dp-value">${picker.selected.label}</p>
    </div>
    <div class="dp-row">
      <span class="dp-month">${MONTHS[picker.m]} ${picker.y} <img src="${A.calChevronDown}" alt=""></span>
      <span class="dp-controls">
        <button type="button" data-month="-1" aria-label="Previous month"><img src="${A.calChevronLeft}" alt=""></button>
        <button type="button" data-month="1" aria-label="Next month"><img src="${A.calChevronRight}" alt=""></button>
      </span>
    </div>
    <div class="dp-grid">
      <div class="cal-week">${["S", "M", "T", "W", "T", "F", "S"].map(d => `<span>${d}</span>`).join("")}</div>
      <div class="cal-days">${calendarCells()}</div>
    </div>
    <div class="dp-actions">
      <button class="btn btn--secondary btn--md" type="button" data-dp="cancel"><span class="btn__label">Cancel</span></button>
      <button class="btn btn--primary btn--md" type="button" data-dp="select"><span class="btn__label">Select</span></button>
    </div>`;
}

function buttonDetail() {
  return shell(`
    <header class="detail-head">
      <h1 class="detail-title">Button</h1>
      <button class="fab" type="button" data-nav="react" aria-label="Close and go back to components">
        <img src="${A.close}" alt="">
      </button>
    </header>

    <section class="detail-intro">
      <div class="detail-intro__copy">
        <p class="detail-intro__title">Triggers an action or submits an intention</p>
        <div class="detail-actions">
          <a class="btn btn--tertiary btn--md" href="https://github.com/jongorrono/DS_Urdin/tree/master/packages/Argi-garbi-system-react" target="_blank" rel="noopener noreferrer"><span class="btn__label">GitHub</span></a>
        </div>
      </div>
      <div class="detail-intro__card"><img src="${A.cardButton}" alt="Button component preview: Button text with leading and trailing icons" width="974" height="858"></div>
    </section>

    <section class="detail-section detail-section--playground" aria-labelledby="playground-title">
      <div class="section-name">
        <h2 id="playground-title">Playground</h2>
        <p>Test the button in different situation</p>
      </div>
      <div class="filters">
        ${FILTERS.map(f => `
          <div class="filter" role="group" aria-label="${f.label.toLowerCase()}">
            <p class="filter__label">${f.label}</p>
            <div class="tag-row">${f.options.map(o => tag(f.key, o)).join("")}</div>
          </div>`).join("")}
      </div>
      <div class="stage stage--playground" id="playground-stage">
        <button id="playground-button" class="btn btn--primary btn--lg playground__button" type="button" data-toast="Button clicked">
          <span class="btn__label">Save changes</span>
        </button>
      </div>
    </section>

    <section class="detail-section" aria-labelledby="usage-title">
      <div class="section-name"><h2 id="usage-title">Usage examples</h2></div>

      <div class="stage stage--example" id="modal-stage">
        <div class="example">
          <p class="example__label">Modal</p>
          <div class="modal" id="modal" role="dialog" aria-label="Delete image">
            <div class="modal-header">
              <p>Delete image</p>
              <button type="button" data-modal="close" aria-label="Close"><img src="${A.cancel}" alt=""></button>
            </div>
            <div class="modal-body"><p>Are you sure that you want to delete the image?</p></div>
            <div class="modal-footer">
              <button class="btn btn--secondary btn--lg" type="button" data-modal="close"><span class="btn__label">Cancel</span></button>
              <button class="btn btn--primary btn--lg" type="button" data-modal="delete"><span class="btn__label">Yes, delete</span></button>
            </div>
          </div>
          <button class="btn btn--tertiary btn--md" id="modal-reopen" type="button" data-modal="open" hidden><span class="btn__label">Reopen modal</span></button>
        </div>
      </div>

      <div class="stage stage--example" id="picker-stage">
        <div class="example">
          <p class="example__label">Date picker</p>
          <div class="date-picker">
            <button class="dp-trigger" id="dp-trigger" type="button" aria-expanded="true" aria-controls="dp-panel">
              <span id="dp-trigger-label">${picker.triggerLabel}</span>
              <img src="${A.pickerChevronUp}" alt="">
            </button>
            <div class="dp-panel" id="dp-panel">${pickerHTML()}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="detail-section" aria-labelledby="anatomy-title">
      <div class="section-name"><h2 id="anatomy-title">Anatomy</h2></div>
      <div class="stage stage--anatomy">
        <div class="anatomy">
          <div class="anatomy__figure"><img src="${A.anatomy}" alt="Button anatomy: container, leading icon, label, trailing icon"></div>
          <p class="anatomy__copy">1- Container<br>2- Leading icon (optional)<br>3- Label<br>4- Trailing icon (optional)</p>
        </div>
      </div>
    </section>
  `, "page--detail");
}

/* Playground: the stage button always mirrors the selected filters. */
function syncPlayground() {
  const btn = $("#playground-button");
  if (!btn) return;
  btn.className = `btn btn--${playground.type} btn--${playground.size} playground__button`;
  btn.disabled = playground.status === "disabled";
  $$("[data-filter]").forEach(t => {
    const on = playground[t.dataset.filter] === t.dataset.value;
    t.classList.toggle("is-selected", on);
    t.setAttribute("aria-pressed", String(on));
  });
}

function renderPicker() {
  const panel = $("#dp-panel");
  if (!panel) return;
  panel.innerHTML = pickerHTML();
  panel.hidden = !picker.open;
  const trigger = $("#dp-trigger");
  trigger.setAttribute("aria-expanded", String(picker.open));
  trigger.classList.toggle("is-open", picker.open);
  $("#dp-trigger-label").textContent = picker.triggerLabel;
}

/* ------------------------------------------------------- routing / events */

function route() {
  const hash = location.hash.replace("#", "") || "home";
  const app = $("#app");
  const detail = hash === "button";
  document.body.dataset.view = detail ? "detail" : "site";

  if (hash === "home" || hash === "home-hover") app.innerHTML = homeView();
  else if (hash === "react-view-all") app.innerHTML = reactView(true);
  else if (hash === "react" || hash === "react-hover") app.innerHTML = reactView(false);
  else if (detail) { picker.open = true; app.innerHTML = buttonDetail(); }
  else if (hash === "about") app.innerHTML = shell(`<section class="hero"><div class="hero__text"><h1>About</h1><p>Argi Garbi is a minimal design-system implementation used to connect Figma design decisions with front-end code.</p></div></section>`);
  else app.innerHTML = homeView();

  $("#nav-links").classList.remove("is-open");
  $(".nav-toggle").setAttribute("aria-expanded", "false");
  window.scrollTo(0, 0);
}

/* One delegated listener: survives every re-render. */
function onClick(e) {
  const t = e.target.closest("button, a, [data-toast]");
  if (!t) return;

  if (t.dataset.toast) showToast(t.dataset.toast);
  if (t.dataset.nav) location.hash = t.dataset.nav;

  if (t.dataset.filter) {
    playground[t.dataset.filter] = t.dataset.value;
    syncPlayground();
  }

  if (t.dataset.modal) {
    const modal = $("#modal"), reopen = $("#modal-reopen");
    if (t.dataset.modal === "delete") showToast("Image deleted");
    const open = t.dataset.modal === "open";
    modal.hidden = !open;
    reopen.hidden = open;
  }

  if (t.id === "dp-trigger") { picker.open = !picker.open; renderPicker(); }
  if (t.dataset.dp === "cancel") { picker.open = false; renderPicker(); }
  if (t.dataset.dp === "select") {
    picker.triggerLabel = picker.selected.label.replace(/^\w+, /, "");
    picker.open = false;
    renderPicker();
    showToast(`Selected ${picker.selected.label}`);
  }
  if (t.dataset.day) {
    const d = Number(t.dataset.day);
    const wd = (startOffset(picker.y, picker.m) + d - 1) % 7;
    picker.selected = { y: picker.y, m: picker.m, d, label: `${WEEKDAYS[wd]}, ${MONTHS[picker.m].slice(0, 3)} ${d}` };
    renderPicker();
  }
  if (t.dataset.month) {
    picker.m += Number(t.dataset.month);
    if (picker.m > 11) { picker.m = 0; picker.y++; }
    if (picker.m < 0) { picker.m = 11; picker.y--; }
    renderPicker();
  }
}

let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1600);
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", () => {
  $("#brand-logo").src = A.logo;
  const toggle = $(".nav-toggle"), links = $("#nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", onClick);
  route();
});
