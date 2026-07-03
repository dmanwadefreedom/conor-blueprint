/* Content Engine — ui.js
 * Icons + DOM/UI helpers. Loaded right after store.js, BEFORE all views.
 */
(function () {
  'use strict';
  var CE = window.CE;

  /* ── icons ───────────────────────────────────────────────────────── */
  var ICONS = {
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M20 18v3H6.5A2.5 2.5 0 0 1 4 18.5"/></svg>',
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 9.5h18"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a8 8 0 0 1-8 8H4l2.5-2.9A8 8 0 1 1 21 12z"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M17.5 14.5a6.5 6.5 0 0 1 4 5.5"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.1 6.4L21 10l-6.9 1.6L12 18l-2.1-6.4L3 10l6.9-1.6z"/><path d="M19 16l.9 2.6L22.5 19l-2.6.9L19 22.5l-.9-2.6L15.5 19l2.6-.4z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55h.09a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>'
  };
  CE.icon = function (name) { return ICONS[name] || ''; };

  /* ── ui helpers ──────────────────────────────────────────────────── */
  var UI = (CE.ui = CE.ui || {});

  UI.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };

  UI.el = function (tag, attrs) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v == null) return;
      if (k === 'class') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else if (k === 'dataset') Object.keys(v).forEach(function (d) { node.dataset[d] = v[d]; });
      else node.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null) continue;
      if (Array.isArray(c)) c.forEach(function (cc) { if (cc != null) node.appendChild(typeof cc === 'string' ? document.createTextNode(cc) : cc); });
      else node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return node;
  };

  UI.toast = function (msg, type) {
    var host = document.getElementById('toasts');
    var t = UI.el('div', { class: 'toast ' + (type || '') , text: msg });
    host.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 2600);
    setTimeout(function () { t.remove(); }, 3000);
  };

  /* modal({title, body, actions:[{label, class, onClick}], wide}) → close() */
  UI.modal = function (opts) {
    var backdrop = UI.el('div', { class: 'modal-backdrop' });
    var box = UI.el('div', { class: 'modal' + (opts.wide ? ' wide' : '') });
    function close() { backdrop.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    backdrop.addEventListener('mousedown', function (e) { if (e.target === backdrop) close(); });
    if (opts.title) box.appendChild(UI.el('h2', { text: opts.title }));
    if (opts.body) box.appendChild(typeof opts.body === 'string' ? UI.el('div', { html: opts.body }) : opts.body);
    if (opts.actions && opts.actions.length) {
      var row = UI.el('div', { class: 'modal-actions' });
      opts.actions.forEach(function (a) {
        row.appendChild(UI.el('button', {
          class: 'btn ' + (a.class || ''),
          text: a.label,
          onclick: function () { if (!a.onClick || a.onClick(close) !== false) { if (!a.keepOpen) close(); } }
        }));
      });
      box.appendChild(row);
    }
    backdrop.appendChild(box);
    document.body.appendChild(backdrop);
    return close;
  };

  UI.confirm = function (message, danger) {
    return new Promise(function (resolve) {
      UI.modal({
        title: 'Are you sure?',
        body: UI.el('p', { class: 'muted', text: message }),
        actions: [
          { label: 'Cancel', onClick: function () { resolve(false); } },
          { label: danger || 'Confirm', class: danger ? 'btn-danger' : 'btn-primary', onClick: function () { resolve(true); } }
        ]
      });
    });
  };

  UI.fmtDate = function (iso) {
    if (!iso) return '';
    var p = iso.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  UI.platformBadge = function (pid) {
    var p = CE.const.PLATFORMS[pid];
    if (!p) return UI.el('span', { class: 'badge', text: pid || '—' });
    return UI.el('span', { class: 'badge' },
      UI.el('span', { class: 'swatch', style: { background: p.color } }), p.label);
  };

  UI.statusBadge = function (status) {
    var c = CE.const.STATUS_COLORS[status] || '#898781';
    return UI.el('span', { class: 'badge' },
      UI.el('span', { class: 'swatch', style: { background: c } }),
      CE.const.STATUS_LABELS[status] || status);
  };
})();
