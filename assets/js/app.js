/* Content Engine — app.js
 * Shell: layout, router, sidebar, client switcher, modals, toasts, coach drawer host.
 * Loaded LAST (after store, ui, data, views).
 */
(function () {
  'use strict';
  var CE = window.CE;
  var UI = CE.ui;

  /* ── layout build ────────────────────────────────────────────────── */
  var NAV_ORDER = ['dashboard', 'discover', 'research', 'create', 'plan', 'coach', 'clients'];
  var mainEl, navEl, switchEl;

  function buildShell() {
    var app = document.getElementById('app');
    app.innerHTML = '';

    var sidebar = UI.el('aside', { class: 'sidebar' });
    sidebar.appendChild(UI.el('div', { class: 'brand' },
      UI.el('div', { class: 'brand-mark', text: 'CE' }),
      UI.el('div', {},
        UI.el('div', { class: 'brand-name', text: 'Content Engine' }),
        UI.el('div', { class: 'brand-sub', text: 'thedylanewing.com' }))));

    switchEl = UI.el('div', { class: 'client-switch' });
    sidebar.appendChild(switchEl);

    navEl = UI.el('nav', { class: 'nav' });
    sidebar.appendChild(navEl);

    var foot = UI.el('div', { class: 'sidebar-foot' });
    foot.appendChild(UI.el('button', {
      class: 'nav-item', onclick: function () { CE.openCoach(); },
      html: CE.icon('spark') + '<span>Ask Coach</span>'
    }));
    foot.appendChild(UI.el('button', {
      class: 'nav-item', onclick: function () { navigate('clients'); },
      html: CE.icon('settings') + '<span>Clients & Settings</span>'
    }));
    sidebar.appendChild(foot);

    mainEl = UI.el('main', { class: 'main' });
    app.appendChild(sidebar);
    app.appendChild(mainEl);

    if (!document.getElementById('toasts')) document.body.appendChild(UI.el('div', { id: 'toasts' }));
  }

  function renderSwitcher() {
    var s = CE.store.get();
    var client = CE.store.client();
    switchEl.innerHTML = '';
    var sel = UI.el('select', {
      onchange: function () {
        if (this.value === '__add') { openAddClient(); renderSwitcher(); return; }
        var v = this.value;
        CE.store.set(function (st) { st.activeClientId = v; });
      }
    });
    s.clients.forEach(function (c) {
      var o = UI.el('option', { value: c.id, text: c.name });
      if (client && c.id === client.id) o.selected = true;
      sel.appendChild(o);
    });
    sel.appendChild(UI.el('option', { value: '__add', text: '＋ Add client…' }));
    switchEl.appendChild(UI.el('span', { class: 'dot', style: { background: (client && client.color) || '#898781' } }));
    switchEl.appendChild(sel);
  }

  function navCounts() {
    var d = CE.store.data();
    return {
      discover: null,
      research: d.ideas.filter(function (i) { return i.status === 'idea' || i.status === 'researched'; }).length || null,
      create: d.drafts.length || null,
      plan: d.schedule.filter(function (e) { return e.status !== 'published'; }).length || null
    };
  }

  function renderNav() {
    navEl.innerHTML = '';
    var counts = navCounts();
    NAV_ORDER.forEach(function (id) {
      var v = CE.views[id];
      if (!v) return;
      var btn = UI.el('button', {
        class: 'nav-item' + (currentView === id ? ' active' : ''),
        onclick: function () { navigate(id); },
        html: CE.icon(v.icon || 'grid') + '<span>' + UI.esc(v.title) + '</span>' +
          (counts[id] ? '<span class="nav-count">' + counts[id] + '</span>' : '')
      });
      navEl.appendChild(btn);
    });
  }

  /* ── add-client modal ────────────────────────────────────────────── */
  var CLIENT_COLORS = ['#3987e5', '#199e70', '#c98500', '#9085e9', '#e66767', '#d55181', '#d95926', '#008300'];

  function clientForm(existing) {
    var c = existing || {};
    var wrap = UI.el('div');
    function field(label, name, value, kind, hint) {
      var input = kind === 'textarea'
        ? UI.el('textarea', { class: 'textarea', name: name, text: value || '' })
        : UI.el('input', { class: 'input', name: name, value: value || '' });
      return UI.el('div', { class: 'field' }, UI.el('label', { text: label }), input,
        hint ? UI.el('span', { class: 'hint', text: hint }) : null);
    }
    wrap.appendChild(field('Client name', 'name', c.name));
    wrap.appendChild(field('Industry', 'industry', c.industry, null, 'e.g. Recruiting, fitness, SaaS, real estate'));
    wrap.appendChild(field('Niche & core topics', 'niche', c.niche, 'textarea', 'What do they talk about? Comma-separate topics.'));
    wrap.appendChild(field('Target audience', 'audience', c.audience));
    wrap.appendChild(field('Voice & tone', 'voice', c.voice, 'textarea'));
    wrap.appendChild(field('Goals', 'goals', c.goals));

    var checks = UI.el('div', { class: 'checks' });
    Object.keys(CE.const.PLATFORMS).forEach(function (pid) {
      var p = CE.const.PLATFORMS[pid];
      var checked = (c.platforms || ['instagram']).indexOf(pid) >= 0;
      var input = UI.el('input', { type: 'checkbox', value: pid, name: 'platforms' });
      input.checked = checked;
      checks.appendChild(UI.el('label', { class: 'check-pill' }, input, p.label));
    });
    wrap.appendChild(UI.el('div', { class: 'field' }, UI.el('label', { text: 'Platforms' }), checks));

    var colorRow = UI.el('div', { class: 'row wrap' });
    CLIENT_COLORS.forEach(function (col) {
      var b = UI.el('button', {
        type: 'button', 'aria-label': 'color ' + col,
        style: { width: '26px', height: '26px', borderRadius: '50%', background: col, cursor: 'pointer', border: (c.color || CLIENT_COLORS[0]) === col ? '2px solid #fff' : '2px solid transparent' },
        onclick: function () {
          wrap.dataset.color = col;
          colorRow.querySelectorAll('button').forEach(function (x) { x.style.border = '2px solid transparent'; });
          this.style.border = '2px solid #fff';
        }
      });
      colorRow.appendChild(b);
    });
    wrap.dataset.color = c.color || CLIENT_COLORS[0];
    wrap.appendChild(UI.el('div', { class: 'field' }, UI.el('label', { text: 'Color' }), colorRow));
    return wrap;
  }

  function readClientForm(wrap) {
    var get = function (n) { var el = wrap.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
    var platforms = Array.prototype.slice.call(wrap.querySelectorAll('[name="platforms"]:checked')).map(function (x) { return x.value; });
    return {
      name: get('name') || 'Untitled client', industry: get('industry'), niche: get('niche'),
      audience: get('audience'), voice: get('voice'), goals: get('goals'),
      platforms: platforms.length ? platforms : ['instagram'], color: wrap.dataset.color
    };
  }

  function openAddClient() {
    var form = clientForm();
    UI.modal({
      title: 'Add a client', body: form, wide: true,
      actions: [
        { label: 'Cancel' },
        {
          label: 'Create client', class: 'btn-primary',
          onClick: function () {
            var profile = readClientForm(form);
            CE.store.addClient(profile);
            UI.toast('Client "' + profile.name + '" created', 'good');
            navigate('dashboard');
          }
        }
      ]
    });
  }
  CE.openAddClient = openAddClient;
  CE.clientForm = clientForm;         // reused by clients view for editing
  CE.readClientForm = readClientForm;

  /* ── coach drawer ────────────────────────────────────────────────── */
  var drawerEl = null, drawerBackdrop = null, drawerCloseTimer = null;

  CE.openCoach = function (prefill) {
    if (drawerCloseTimer) { clearTimeout(drawerCloseTimer); drawerCloseTimer = null; }
    if (!drawerEl) {
      drawerBackdrop = UI.el('div', { class: 'drawer-backdrop', onclick: closeCoach });
      drawerEl = UI.el('div', { class: 'drawer' });
      document.body.appendChild(drawerBackdrop);
      document.body.appendChild(drawerEl);
    }
    drawerEl.innerHTML = '';
    var head = UI.el('div', { class: 'drawer-head' },
      UI.el('span', { html: CE.icon('spark'), style: { color: 'var(--accent)', width: '18px', height: '18px', display: 'inline-flex' } }),
      UI.el('h2', { text: 'Coach' }),
      UI.el('button', { class: 'btn btn-ghost btn-sm', html: CE.icon('x'), 'aria-label': 'Close coach', onclick: closeCoach }));
    drawerEl.appendChild(head);
    var body = UI.el('div', { style: { flex: '1', display: 'flex', flexDirection: 'column', minHeight: '0' } });
    drawerEl.appendChild(body);
    if (CE.coach && CE.coach.renderPanel) CE.coach.renderPanel(body, { prefill: prefill });
    else body.appendChild(UI.el('div', { class: 'empty' }, UI.el('p', { text: 'Coach module not loaded.' })));
    requestAnimationFrame(function () { drawerBackdrop.classList.add('open'); drawerEl.classList.add('open'); });
  };
  function closeCoach() {
    if (!drawerEl) return;
    drawerBackdrop.classList.remove('open');
    drawerEl.classList.remove('open');
    drawerCloseTimer = setTimeout(function () {
      drawerCloseTimer = null;
      if (drawerBackdrop) drawerBackdrop.remove();
      if (drawerEl) drawerEl.remove();
      drawerBackdrop = drawerEl = null;
    }, 220);
  }
  CE.closeCoach = closeCoach;

  /* ── router ──────────────────────────────────────────────────────── */
  var currentView = null;

  function navigate(id, params) {
    var h = '#/' + id + (params ? '?' + params : '');
    if (location.hash === h) render();
    else location.hash = h;
  }
  CE.navigate = navigate;

  function parseHash() {
    var h = location.hash.replace(/^#\/?/, '');
    var q = h.split('?');
    return { view: q[0] || 'dashboard', params: new URLSearchParams(q[1] || '') };
  }

  function render() {
    var route = parseHash();
    var v = CE.views[route.view] || CE.views.dashboard;
    if (!v) { mainEl.innerHTML = '<div class="empty"><p>No views registered.</p></div>'; return; }
    currentView = v.id;
    renderNav();
    renderSwitcher();
    mainEl.innerHTML = '';
    var inner = UI.el('div', { class: 'main-inner' });
    mainEl.appendChild(inner);
    try {
      v.render(inner, { params: route.params });
    } catch (e) {
      console.error('CE view error [' + v.id + ']', e);
      inner.appendChild(UI.el('div', { class: 'empty' },
        UI.el('div', { class: 'empty-icon', text: '⚠️' }),
        UI.el('h3', { text: 'This view hit an error' }),
        UI.el('p', { text: String(e && e.message || e) })));
    }
    mainEl.scrollTop = 0;
    window.scrollTo(0, 0);
  }
  CE.rerender = render;

  /* ── boot ────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    buildShell();
    CE.store.get();
    window.addEventListener('hashchange', render);
    CE.store.subscribe(function (_s, rerender) {
      renderSwitcher();
      renderNav();
      if (rerender) render();
    });
    render();
  });
})();
