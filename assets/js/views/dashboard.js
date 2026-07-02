/* Content Engine — views/dashboard.js
 * Multi-client home view for the active client: stats, pipeline, up-next,
 * trending picks and the Discover → Research → Create → Plan workflow strip.
 */
(function () {
  'use strict';
  var CE = window.CE;
  var el = CE.ui.el;

  /* ── date helpers ─────────────────────────────────────────────────── */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function isoOf(d) {
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function isoPlusDays(offset) {
    var t = new Date();
    return isoOf(new Date(t.getFullYear(), t.getMonth(), t.getDate() + offset));
  }

  function fmtTime(hhmm) {
    if (!hhmm) return '';
    var p = String(hhmm).split(':');
    var h = parseInt(p[0], 10);
    if (isNaN(h)) return hhmm;
    var mer = h >= 12 ? 'pm' : 'am';
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + (p[1] || '00') + ' ' + mer;
  }

  /* ── derived counts ───────────────────────────────────────────────── */
  function computeStats(data) {
    var todayIso = isoPlusDays(0);
    var weekEndIso = isoPlusDays(7); // exclusive upper bound

    var pipeline = data.ideas.filter(function (i) { return i.status !== 'published'; }).length;

    var draftsReady = data.drafts.filter(function (d) {
      return d.status === 'drafted' || d.status === 'approved';
    }).length;

    var upNext = data.schedule.filter(function (e) {
      return e.status !== 'published' && e.date && e.date >= todayIso && e.date < weekEndIso;
    }).sort(function (a, b) {
      var ka = (a.date || '') + ' ' + (a.time || ''), kb = (b.date || '') + ' ' + (b.time || '');
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });

    var pubRef = {};
    data.schedule.forEach(function (e) { if (e.status === 'published') pubRef[e.refId] = true; });
    var ideaCovered = {};
    data.drafts.forEach(function (d) { if (d.ideaId && pubRef[d.id]) ideaCovered[d.ideaId] = true; });
    var publishedPosts = data.schedule.filter(function (e) { return e.status === 'published'; }).length;
    var publishedIdeas = data.ideas.filter(function (i) {
      return i.status === 'published' && !pubRef[i.id] && !ideaCovered[i.id];
    }).length;

    return {
      pipeline: pipeline,
      draftsReady: draftsReady,
      upNext: upNext,
      published: publishedPosts + publishedIdeas
    };
  }

  function statusCounts(data) {
    var counts = {};
    CE.const.STATUSES.forEach(function (s) { counts[s] = 0; });
    data.ideas.forEach(function (i) {
      if (counts.hasOwnProperty(i.status)) counts[i.status]++;
    });
    return counts;
  }

  /* ── trends helpers ───────────────────────────────────────────────── */
  var MOMENTUM_ORDER = { rising: 0, peaking: 1, steady: 2 };

  function topTrends(client) {
    if (!CE.trends || typeof CE.trends.forClient !== 'function') return null; // module absent
    var list;
    try { list = CE.trends.forClient(client) || []; } catch (e) { return null; }
    return list.slice().sort(function (a, b) {
      var ma = MOMENTUM_ORDER.hasOwnProperty(a.momentum) ? MOMENTUM_ORDER[a.momentum] : 3;
      var mb = MOMENTUM_ORDER.hasOwnProperty(b.momentum) ? MOMENTUM_ORDER[b.momentum] : 3;
      return ma - mb;
    }).slice(0, 5);
  }

  function saveTrendAsIdea(trend, client) {
    var cid = client.id;
    CE.store.data(cid); // ensure arrays exist for this client
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
    CE.store.set(function (s) { s.data[cid].ideas.push(idea); });
    CE.ui.toast('Saved "' + trend.name + '" to ideas', 'good');
  }

  /* ── small builders ───────────────────────────────────────────────── */
  function statTile(value, label, delta, deltaClass) {
    return el('div', { class: 'stat-tile' },
      el('div', { class: 'stat-value mono', text: String(value) }),
      el('div', { class: 'stat-label', text: label }),
      delta ? el('div', { class: 'stat-delta ' + (deltaClass || 'flat'), text: delta }) : null);
  }

  function cardEmpty(icon, title, msg, btnLabel, onClick) {
    return el('div', { class: 'empty', style: { padding: '28px 16px' } },
      el('div', { class: 'empty-icon', text: icon }),
      el('h3', { text: title }),
      el('p', { text: msg }),
      btnLabel ? el('button', { class: 'btn btn-sm', text: btnLabel, onclick: onClick }) : null);
  }

  /* ── sections ─────────────────────────────────────────────────────── */
  function renderHead(container, client) {
    var sub = el('div', { class: 'sub' });
    var subRow = el('div', { class: 'row wrap', style: { gap: '8px', marginTop: '4px' } });
    if (client.industry) subRow.appendChild(el('span', { text: client.industry }));
    (client.platforms || []).forEach(function (pid) {
      subRow.appendChild(CE.ui.platformBadge(pid));
    });
    if (client.demo) subRow.appendChild(el('span', { class: 'tag', text: 'Demo data' }));
    sub.appendChild(subRow);

    container.appendChild(el('div', { class: 'view-head' },
      el('div', {},
        el('h1', { text: client.name + ' — Dashboard' }),
        sub),
      el('div', { class: 'spacer' }),
      el('div', { class: 'row' },
        el('button', {
          class: 'btn', html: CE.icon('compass') + '<span>Discover trends</span>',
          onclick: function () { CE.navigate('discover'); }
        }),
        el('button', {
          class: 'btn btn-primary', html: CE.icon('spark') + '<span>Ask Coach</span>',
          onclick: function () { CE.openCoach(); }
        }))));
  }

  function renderStats(container, stats) {
    container.appendChild(el('div', { class: 'grid cols-4 mb' },
      statTile(stats.pipeline, 'Ideas in pipeline',
        stats.pipeline > 0 ? 'in motion' : null, 'flat'),
      statTile(stats.draftsReady, 'Drafts ready',
        stats.draftsReady > 0 ? 'ready to schedule' : null, 'flat'),
      statTile(stats.upNext.length, 'Scheduled · next 7 days',
        stats.upNext.length > 0 ? 'on track' : null, 'flat'),
      statTile(stats.published, 'Published',
        stats.published > 0 ? 'shipping' : null, 'up')));
  }

  function renderPipeline(container, data, counts) {
    var card = el('div', { class: 'card mb' });
    card.appendChild(el('div', { class: 'spread' },
      el('div', { class: 'card-title', text: 'Content pipeline' }),
      el('span', { class: 'small muted mono', text: data.ideas.length + ' idea' + (data.ideas.length === 1 ? '' : 's') })));

    if (!data.ideas.length) {
      card.appendChild(cardEmpty('🧪', 'Nothing in the pipeline yet',
        'Save trends as ideas or add them in Research — they will move through this pipeline from idea to published.',
        'Discover trends', function () { CE.navigate('discover'); }));
    } else {
      var bar = el('div', { class: 'pipe-bar' });
      CE.const.STATUSES.forEach(function (s) {
        if (!counts[s]) return; // 0-count stages omitted from the bar
        bar.appendChild(el('div', {
          class: 'pipe-seg',
          title: CE.const.STATUS_LABELS[s] + ': ' + counts[s],
          style: { flex: String(counts[s]), background: CE.const.STATUS_COLORS[s] }
        }));
      });
      card.appendChild(bar);
    }

    // Legend always shows ALL stages with counts.
    var legend = el('div', { class: 'pipe-legend' });
    CE.const.STATUSES.forEach(function (s) {
      legend.appendChild(el('span', { class: 'item' },
        el('span', { class: 'swatch', style: { background: CE.const.STATUS_COLORS[s], opacity: counts[s] ? '1' : '0.35' } }),
        el('span', { text: CE.const.STATUS_LABELS[s] + ' ' }),
        el('span', { class: 'mono' + (counts[s] ? '' : ' muted'), text: String(counts[s]) })));
    });
    card.appendChild(legend);
    container.appendChild(card);
  }

  function renderUpNext(card, upNext) {
    card.appendChild(el('div', { class: 'card-title', text: 'Up next · 7 days' }));

    if (!upNext.length) {
      card.appendChild(cardEmpty('🗓️', 'Nothing scheduled this week',
        'Drop drafts onto the calendar so the next seven days never run empty.',
        'Open Plan', function () { CE.navigate('plan'); }));
      return;
    }

    var table = el('table', { class: 'table' });
    var tbody = el('tbody');
    upNext.slice(0, 6).forEach(function (item) {
      tbody.appendChild(el('tr', { class: 'click', onclick: function () { CE.navigate('plan'); } },
        el('td', { class: 'mono', style: { whiteSpace: 'nowrap', width: '1%' }, text: CE.ui.fmtDate(item.date) }),
        el('td', { class: 'mono muted', style: { whiteSpace: 'nowrap', width: '1%' }, text: fmtTime(item.time) }),
        el('td', {}, el('div', { class: 'ellipsis', style: { maxWidth: '260px' }, text: item.title || 'Untitled' })),
        el('td', { style: { width: '1%' } }, CE.ui.platformBadge(item.platform))));
    });
    table.appendChild(tbody);
    card.appendChild(table);

    if (upNext.length > 6) {
      card.appendChild(el('div', { class: 'mt' },
        el('button', {
          class: 'btn btn-ghost btn-sm',
          text: '+' + (upNext.length - 6) + ' more in Plan',
          onclick: function () { CE.navigate('plan'); }
        })));
    }
  }

  function renderTrending(card, client, data) {
    card.appendChild(el('div', { class: 'spread' },
      el('div', { class: 'card-title', text: 'Trending for you' }),
      CE.trends && CE.trends.updated
        ? el('span', { class: 'small muted', text: CE.trends.updated })
        : null));

    var trends = topTrends(client);
    if (trends === null) {
      card.appendChild(cardEmpty('📡', 'Trend data unavailable',
        'The trends dataset has not loaded. Reload the app or check back shortly.'));
      return;
    }
    if (!trends.length) {
      card.appendChild(cardEmpty('📡', 'No trends for these platforms yet',
        'Add more platforms to this client profile to widen the trend radar.',
        'Browse all trends', function () { CE.navigate('discover'); }));
      return;
    }

    var savedRefs = {};
    data.ideas.forEach(function (i) { if (i.trendRef) savedRefs[i.trendRef] = true; });

    var list = el('div', { class: 'stack', style: { gap: '0' } });
    trends.forEach(function (trend, idx) {
      if (idx > 0) list.appendChild(el('hr', { class: 'divider', style: { margin: '10px 0' } }));

      var already = !!savedRefs[trend.id];
      var btn = already
        ? el('button', { class: 'btn btn-sm', disabled: 'disabled', text: 'Saved ✓' })
        : el('button', {
            class: 'btn btn-sm', text: 'Save as idea',
            onclick: function () { saveTrendAsIdea(trend, client); }
          });

      list.appendChild(el('div', { class: 'spread', style: { gap: '12px' } },
        el('div', { style: { minWidth: '0' } },
          el('div', { class: 'ellipsis', style: { fontWeight: '600', fontSize: '13.5px', maxWidth: '250px' }, text: trend.name }),
          el('div', { class: 'row', style: { gap: '8px', marginTop: '3px' } },
            el('span', { class: 'momentum ' + (trend.momentum || 'steady'), text: CE.const.MOMENTUM[trend.momentum] || trend.momentum || 'Steady' }),
            CE.ui.platformBadge(trend.platform))),
        btn));
    });
    card.appendChild(list);
  }

  function renderWorkflow(container, data, counts, stats) {
    var trendCount = null;
    if (CE.trends && typeof CE.trends.forClient === 'function') {
      try { trendCount = (CE.trends.forClient(CE.store.client()) || []).length; } catch (e) { trendCount = null; }
    }
    var briefs = data.briefs.length;

    var steps = [
      {
        view: 'discover', icon: 'compass', title: 'Discover',
        desc: 'Scan what is trending on this client’s platforms.',
        count: trendCount === null ? 'Trend radar' : trendCount + ' trend' + (trendCount === 1 ? '' : 's') + ' matched'
      },
      {
        view: 'research', icon: 'book', title: 'Research',
        desc: 'Turn raw ideas into researched briefs and angles.',
        count: counts.idea + ' idea' + (counts.idea === 1 ? '' : 's') + ' waiting'
      },
      {
        view: 'create', icon: 'pen', title: 'Create',
        desc: 'Draft platform-ready posts, hooks and CTAs.',
        count: briefs + ' brief' + (briefs === 1 ? '' : 's') + ' · ' + data.drafts.length + ' draft' + (data.drafts.length === 1 ? '' : 's')
      },
      {
        view: 'plan', icon: 'calendar', title: 'Plan',
        desc: 'Schedule the calendar and mark posts published.',
        count: stats.draftsReady + ' draft' + (stats.draftsReady === 1 ? '' : 's') + ' ready to slot in'
      }
    ];

    container.appendChild(el('div', { class: 'card-title mt', text: 'Workflow' }));
    var grid = el('div', { class: 'grid cols-4' });
    steps.forEach(function (step, i) {
      grid.appendChild(el('div', {
        class: 'card click', role: 'button', tabindex: '0',
        onclick: function () { CE.navigate(step.view); },
        onkeydown: function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); CE.navigate(step.view); } }
      },
        el('div', { class: 'row', style: { gap: '8px', marginBottom: '8px' } },
          el('span', { html: CE.icon(step.icon), style: { width: '17px', height: '17px', display: 'inline-flex', color: 'var(--accent-strong)' } }),
          el('span', { style: { fontWeight: '650', fontSize: '13.5px' }, text: (i + 1) + '. ' + step.title }),
          el('span', { style: { flex: '1' } }),
          i < steps.length - 1 ? el('span', { class: 'muted', 'aria-hidden': 'true', text: '→' }) : null),
        el('div', { class: 'small muted', style: { marginBottom: '8px' }, text: step.desc }),
        el('span', { class: 'tag', text: step.count })));
    });
    container.appendChild(grid);
  }

  /* ── render ───────────────────────────────────────────────────────── */
  function render(container) {
    var client = CE.store.client();

    if (!client) {
      container.appendChild(el('div', { class: 'view-head' },
        el('div', {},
          el('h1', { text: 'Dashboard' }),
          el('div', { class: 'sub', text: 'Your multi-client content command center' }))));
      container.appendChild(el('div', { class: 'card' },
        el('div', { class: 'empty' },
          el('div', { class: 'empty-icon', text: '🚀' }),
          el('h3', { text: 'Welcome to Content Engine' }),
          el('p', { text: 'Add your first client to start discovering trends, researching angles, drafting posts and planning the calendar.' }),
          el('button', {
            class: 'btn btn-primary', html: CE.icon('plus') + '<span>Add your first client</span>',
            onclick: function () { CE.openAddClient(); }
          }))));
      return;
    }

    var data = CE.store.data(client.id);
    var stats = computeStats(data);
    var counts = statusCounts(data);

    renderHead(container, client);
    renderStats(container, stats);
    renderPipeline(container, data, counts);

    var two = el('div', { class: 'grid cols-2 mb' });
    var upNextCard = el('div', { class: 'card' });
    renderUpNext(upNextCard, stats.upNext);
    var trendCard = el('div', { class: 'card' });
    renderTrending(trendCard, client, data);
    two.appendChild(upNextCard);
    two.appendChild(trendCard);
    container.appendChild(two);

    renderWorkflow(container, data, counts, stats);
  }

  CE.views.dashboard = { id: 'dashboard', title: 'Dashboard', icon: 'grid', render: render };
})();
