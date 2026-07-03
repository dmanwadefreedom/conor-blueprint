/* Content Engine — views/discover.js
 * Trend discovery browser over CE.trends for the active client.
 * Filters live in module-level closure vars (never CE.store) so typing in the
 * search box re-renders only the grid and keystrokes never lose focus.
 */
(function () {
  'use strict';
  var CE = window.CE;
  var el = CE.ui.el;

  var TYPE_OPTIONS = ['format', 'visual', 'audio', 'topic', 'hook'];
  var MOMENTUM_OPTIONS = ['rising', 'peaking', 'steady'];
  var MOMENTUM_ORDER = { rising: 0, peaking: 1, steady: 2 };

  /* ── view-local filter state (persists across re-renders, not stored) ── */
  var fPlatform = 'foryou';   // 'foryou' | 'all' | platform id
  var fType = 'all';
  var fMomentum = 'all';
  var fQuery = '';
  var expanded = {};          // trendId → true (detail block open)
  var lastClientId = null;

  function resetFilters() {
    fPlatform = 'foryou'; fType = 'all'; fMomentum = 'all'; fQuery = '';
  }

  /* ── helpers ──────────────────────────────────────────────────────── */
  function trendsReady() {
    return !!(CE.trends && typeof CE.trends.all === 'function');
  }

  function cap(s) {
    s = String(s || '');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function clientPlatforms(client) {
    return (client && client.platforms) ? client.platforms.filter(function (pid) {
      return !!CE.const.PLATFORMS[pid];
    }) : [];
  }

  function sourceTrends(client) {
    var list = [];
    try {
      if (fPlatform === 'foryou') {
        if (client && typeof CE.trends.forClient === 'function') list = CE.trends.forClient(client) || [];
        else list = CE.trends.all() || []; // no client → For you behaves like All
      } else if (fPlatform === 'all') {
        list = CE.trends.all() || [];
      } else {
        list = (CE.trends.all() || []).filter(function (t) { return t.platform === fPlatform; });
      }
    } catch (e) { list = []; }
    return list;
  }

  function filterTrends(client) {
    var list = sourceTrends(client);
    var q = fQuery.replace(/^\s+|\s+$/g, '').toLowerCase();
    list = list.filter(function (t) {
      if (fType !== 'all' && t.type !== fType) return false;
      if (fMomentum !== 'all' && t.momentum !== fMomentum) return false;
      if (q) {
        var hay = (t.name || '') + ' ' + (t.desc || '') + ' ' + (t.tags || []).join(' ');
        if (hay.toLowerCase().indexOf(q) < 0) return false;
      }
      return true;
    });
    return list.slice().sort(function (a, b) {
      var ma = MOMENTUM_ORDER.hasOwnProperty(a.momentum) ? MOMENTUM_ORDER[a.momentum] : 3;
      var mb = MOMENTUM_ORDER.hasOwnProperty(b.momentum) ? MOMENTUM_ORDER[b.momentum] : 3;
      if (ma !== mb) return ma - mb;
      var na = (a.name || '').toLowerCase(), nb = (b.name || '').toLowerCase();
      return na < nb ? -1 : na > nb ? 1 : 0;
    });
  }

  function savedTrendRefs(data) {
    var refs = {};
    (data.ideas || []).forEach(function (i) { if (i.trendRef) refs[i.trendRef] = true; });
    return refs;
  }

  function copyText(text, okMsg) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      CE.ui.toast(ok ? okMsg : 'Copy failed — select it manually', ok ? 'good' : 'err');
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () { CE.ui.toast(okMsg, 'good'); },
        function () { fallback(); });
    } else fallback();
  }

  /* ── actions ──────────────────────────────────────────────────────── */
  function saveTrendAsIdea(trend, client) {
    if (!client) {
      CE.ui.toast('Add a client first to save ideas', 'err');
      CE.openAddClient();
      return;
    }
    CE.store.data(client.id); // ensure arrays exist
    var now = Date.now();
    var idea = {
      id: CE.uid(),
      title: trend.name,
      angle: trend.desc || '',
      hook: trend.examplePrompt || '',
      format: (trend.formats && trend.formats[0]) || 'short-video',
      platform: trend.platform,
      status: 'idea',
      trendRef: trend.id,
      notes: '',
      createdAt: now,
      updatedAt: now
    };
    CE.store.set(function (s) { s.data[client.id].ideas.push(idea); });
    CE.ui.toast('Saved to Research', 'good');
  }

  function askCoachAboutTrend(trend, client) {
    var p = CE.const.PLATFORMS[trend.platform];
    var msg = 'I want to use the trend "' + trend.name + '"' +
      (p ? ' on ' + p.label : '') + '.';
    if (client && client.niche) msg += ' My niche: ' + client.niche + '.';
    if (client && client.audience) msg += ' Audience: ' + client.audience + '.';
    msg += ' Give me 3 concrete post concepts adapting this trend, each with a hook.';
    CE.openCoach(msg);
  }

  function askCoachLive(client) {
    var msg = 'Research what is trending right now for my niche';
    if (client && client.niche) msg += ': ' + client.niche;
    var plats = clientPlatforms(client);
    if (plats.length) {
      msg += '. Focus on ' + plats.map(function (pid) {
        return CE.const.PLATFORMS[pid].label;
      }).join(', ');
    }
    msg += '. What formats, hooks and topics should we jump on this week?';
    CE.openCoach(msg);
  }

  /* ── card builders ────────────────────────────────────────────────── */
  function detailBlock(trend) {
    var block = el('div', {
      class: 'stack',
      style: { gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }
    });
    function section(label, body) {
      if (!body) return;
      block.appendChild(el('div', {},
        el('div', {
          class: 'small', text: label,
          style: { textTransform: 'uppercase', letterSpacing: '0.7px', fontWeight: '650', color: 'var(--ink-3)', fontSize: '10.5px', marginBottom: '3px' }
        }),
        el('div', { class: 'small', style: { color: 'var(--ink-2)', lineHeight: '1.55' }, text: body })));
    }
    section('Why it works', trend.whyItWorks);
    section('How to use it', trend.howToUse);
    if (trend.examplePrompt) {
      block.appendChild(el('div', {},
        el('div', {
          class: 'small', text: 'Example prompt',
          style: { textTransform: 'uppercase', letterSpacing: '0.7px', fontWeight: '650', color: 'var(--ink-3)', fontSize: '10.5px', marginBottom: '5px' }
        }),
        el('div', {
          style: {
            borderLeft: '3px solid var(--accent)', background: 'var(--surface-2)',
            borderRadius: '0 7px 7px 0', padding: '8px 12px',
            fontStyle: 'italic', fontSize: '12.5px', color: 'var(--ink-2)', lineHeight: '1.55'
          },
          text: '“' + trend.examplePrompt + '”'
        }),
        el('div', { class: 'mt', style: { marginTop: '8px' } },
          el('button', {
            class: 'btn btn-ghost btn-sm',
            html: CE.icon('copy') + '<span>Copy prompt</span>',
            onclick: function () { copyText(trend.examplePrompt, 'Prompt copied'); }
          }))));
    }
    return block;
  }

  function trendCard(trend, client, saved) {
    var card = el('div', { class: 'card', style: { display: 'flex', flexDirection: 'column', gap: '10px' } });

    // header: name + momentum
    card.appendChild(el('div', { class: 'spread', style: { alignItems: 'flex-start', gap: '10px' } },
      el('div', { style: { fontWeight: '650', fontSize: '14px', lineHeight: '1.35', minWidth: '0' }, text: trend.name }),
      el('span', {
        class: 'momentum ' + (trend.momentum || 'steady'),
        style: { flexShrink: '0', marginTop: '2px' },
        text: CE.const.MOMENTUM[trend.momentum] || cap(trend.momentum) || 'Steady'
      })));

    // meta: platform + type + formats
    var meta = el('div', { class: 'row wrap', style: { gap: '6px' } });
    meta.appendChild(CE.ui.platformBadge(trend.platform));
    if (trend.type) meta.appendChild(el('span', {
      class: 'tag',
      style: { borderColor: 'rgba(57,135,229,0.45)', color: 'var(--accent-strong)' },
      text: cap(trend.type)
    }));
    (trend.formats || []).forEach(function (f) {
      meta.appendChild(el('span', { class: 'tag', text: f }));
    });
    card.appendChild(meta);

    // description
    if (trend.desc) card.appendChild(el('div', {
      class: 'small', style: { color: 'var(--ink-2)', lineHeight: '1.55' }, text: trend.desc
    }));

    // tags
    if (trend.tags && trend.tags.length) {
      card.appendChild(el('div', { class: 'small muted ellipsis', text: trend.tags.map(function (t) { return '#' + t; }).join('  ') }));
    }

    // expandable detail
    var open = !!expanded[trend.id];
    var detail = detailBlock(trend);
    detail.style.display = open ? '' : 'none';
    var toggle = el('button', {
      class: 'btn btn-ghost btn-sm',
      style: { alignSelf: 'flex-start', paddingLeft: '0' },
      text: (open ? '▾' : '▸') + ' Why it works · How to use it',
      onclick: function () {
        var nowOpen = detail.style.display === 'none';
        detail.style.display = nowOpen ? '' : 'none';
        expanded[trend.id] = nowOpen;
        if (!nowOpen) delete expanded[trend.id];
        this.textContent = (nowOpen ? '▾' : '▸') + ' Why it works · How to use it';
      }
    });
    card.appendChild(toggle);
    card.appendChild(detail);

    // spacer pushes footer down so buttons align across the row
    card.appendChild(el('div', { style: { flex: '1' } }));

    // footer actions
    var saveBtn = saved
      ? el('button', { class: 'btn btn-sm', disabled: 'disabled', text: '✓ In pipeline' })
      : el('button', {
          class: 'btn btn-primary btn-sm', text: 'Save as idea',
          onclick: function () { saveTrendAsIdea(trend, client); }
        });
    card.appendChild(el('div', { class: 'row', style: { gap: '8px', paddingTop: '4px' } },
      saveBtn,
      el('button', {
        class: 'btn btn-sm',
        html: CE.icon('spark') + '<span>Ask Coach</span>',
        onclick: function () { askCoachAboutTrend(trend, client); }
      })));

    return card;
  }

  /* ── hook patterns section ────────────────────────────────────────── */
  function renderHookPatterns(container) {
    var pats = (CE.trends && CE.trends.hookPatterns) || [];
    if (!pats.length) return;

    var card = el('div', { class: 'card mt' });
    card.appendChild(el('div', { class: 'spread' },
      el('div', { class: 'card-title', style: { marginBottom: '0' }, text: 'Hook patterns' }),
      el('span', { class: 'small muted', text: 'Universal formulas — steal a structure, swap in your topic' })));
    card.appendChild(el('div', { style: { height: '14px' } }));

    var grid = el('div', { class: 'grid cols-2' });
    pats.forEach(function (hp) {
      grid.appendChild(el('div', {
        class: 'spread',
        style: {
          alignItems: 'flex-start', gap: '10px',
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)', padding: '12px 14px'
        }
      },
        el('div', { style: { minWidth: '0' } },
          el('div', { style: { fontWeight: '650', fontSize: '13px', lineHeight: '1.4' }, text: hp.pattern }),
          hp.example ? el('div', { class: 'small muted', style: { marginTop: '4px', fontStyle: 'italic', lineHeight: '1.5' }, text: '“' + hp.example + '”' }) : null),
        el('button', {
          class: 'btn btn-ghost btn-sm', 'aria-label': 'Copy hook pattern',
          style: { flexShrink: '0' },
          html: CE.icon('copy'),
          onclick: function () { copyText(hp.example || hp.pattern, 'Hook copied to clipboard'); }
        })));
    });
    card.appendChild(grid);
    container.appendChild(card);
  }

  /* ── render ───────────────────────────────────────────────────────── */
  function render(container) {
    var client = CE.store.client();
    var cid = client ? client.id : null;
    if (cid !== lastClientId) { resetFilters(); expanded = {}; lastClientId = cid; }

    // head
    var updated = (trendsReady() && CE.trends.updated) ? CE.trends.updated : '—';
    container.appendChild(el('div', { class: 'view-head' },
      el('div', {},
        el('h1', { text: 'Discover' }),
        el('div', {
          class: 'sub',
          text: 'Trending formats, visuals & ideas · dataset updated ' + updated + ' · ask Coach for live research'
        })),
      el('div', { class: 'spacer' }),
      el('button', {
        class: 'btn btn-primary',
        html: CE.icon('spark') + '<span>Ask Coach for live trends</span>',
        onclick: function () { askCoachLive(client); }
      })));

    // trends module missing entirely → empty card and bail
    if (!trendsReady()) {
      container.appendChild(el('div', { class: 'card' },
        el('div', { class: 'empty' },
          el('div', { class: 'empty-icon', text: '📡' }),
          el('h3', { text: 'Trend data unavailable' }),
          el('p', { text: 'The trends dataset has not loaded. Reload the app, or ask Coach for live trend research instead.' }),
          el('button', {
            class: 'btn btn-sm', html: CE.icon('spark') + '<span>Ask Coach</span>',
            onclick: function () { askCoachLive(client); }
          }))));
      renderHookPatterns(container);
      return;
    }

    /* filter row */
    var plats = clientPlatforms(client);

    var tabsEl = el('div', { class: 'tabs', style: { marginBottom: '0', borderBottom: 'none', flex: '1 1 auto' } });
    var typeSel = el('select', { class: 'select', 'aria-label': 'Trend type', style: { width: 'auto' } });
    var momSel = el('select', { class: 'select', 'aria-label': 'Momentum', style: { width: 'auto' } });
    var searchInput = el('input', {
      class: 'input', type: 'search', placeholder: 'Search trends, topics, tags…',
      'aria-label': 'Search trends', style: { width: '220px' }
    });
    var countEl = el('span', { class: 'small muted mono', style: { whiteSpace: 'nowrap' } });
    var gridHost = el('div');

    typeSel.appendChild(el('option', { value: 'all', text: 'All types' }));
    TYPE_OPTIONS.forEach(function (t) { typeSel.appendChild(el('option', { value: t, text: cap(t) })); });
    typeSel.value = fType;
    typeSel.addEventListener('change', function () { fType = this.value; renderGrid(); });

    momSel.appendChild(el('option', { value: 'all', text: 'All momentum' }));
    MOMENTUM_OPTIONS.forEach(function (m) { momSel.appendChild(el('option', { value: m, text: CE.const.MOMENTUM[m] || cap(m) })); });
    momSel.value = fMomentum;
    momSel.addEventListener('change', function () { fMomentum = this.value; renderGrid(); });

    searchInput.value = fQuery;
    searchInput.addEventListener('input', function () { fQuery = this.value; renderGrid(); });

    function renderTabs() {
      tabsEl.innerHTML = '';
      function tab(value, label) {
        tabsEl.appendChild(el('button', {
          class: 'tab' + (fPlatform === value ? ' active' : ''),
          text: label,
          onclick: function () { fPlatform = value; renderTabs(); renderGrid(); }
        }));
      }
      tab('foryou', 'For you');
      plats.forEach(function (pid) { tab(pid, CE.const.PLATFORMS[pid].label); });
      tab('all', 'All');
    }

    function renderGrid() {
      gridHost.innerHTML = '';
      var list = filterTrends(client);
      countEl.textContent = list.length + ' trend' + (list.length === 1 ? '' : 's');

      if (!client && fPlatform === 'foryou') {
        gridHost.appendChild(el('div', {
          class: 'hint mb', style: { display: 'block' },
          text: 'No client selected — showing all trends. Add a client to get a “For you” feed tuned to their platforms.'
        }));
      }

      if (!list.length) {
        gridHost.appendChild(el('div', { class: 'card' },
          el('div', { class: 'empty' },
            el('div', { class: 'empty-icon', text: '🔍' }),
            el('h3', { text: 'No trends match these filters' }),
            el('p', { text: 'Try a broader platform, another type or momentum, or clear the search.' }),
            el('button', {
              class: 'btn btn-sm', text: 'Reset filters',
              onclick: function () {
                resetFilters();
                typeSel.value = fType;
                momSel.value = fMomentum;
                searchInput.value = fQuery;
                renderTabs();
                renderGrid();
              }
            }))));
        return;
      }

      var saved = savedTrendRefs(CE.store.data());
      var grid = el('div', { class: 'grid cols-3' });
      list.forEach(function (t) { grid.appendChild(trendCard(t, client, !!saved[t.id])); });
      gridHost.appendChild(grid);
    }

    var filterCard = el('div', { class: 'card mb', style: { padding: '10px 16px' } },
      el('div', { class: 'row wrap', style: { gap: '10px' } },
        tabsEl,
        typeSel,
        momSel,
        searchInput,
        countEl));
    container.appendChild(filterCard);
    container.appendChild(gridHost);

    renderTabs();
    renderGrid();

    renderHookPatterns(container);
  }

  CE.views.discover = { id: 'discover', title: 'Discover', icon: 'compass', render: render };
})();
