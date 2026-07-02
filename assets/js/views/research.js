/* Content Engine — views/research.js
 * Idea pipeline + research brief builder.
 * Master list (ideas table, filterable by status) + detail panel with
 * inline-editable fields and a local template-driven brief generator.
 * Supports #/research?id=<ideaId> to open an idea directly.
 */
(function () {
  'use strict';
  var CE = window.CE;
  var el = CE.ui.el;

  /* ── view-local state (survives re-renders, never persisted) ─────── */
  var selectedId = null;      // currently open idea
  var statusFilter = 'all';   // 'all' | status id
  var lastClientId = null;
  var lastParamId = null;     // last ?id= seen, so row clicks aren't overridden

  /* ── small helpers ────────────────────────────────────────────────── */
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }

  function trendGet(ref) {
    if (!ref || !CE.trends || typeof CE.trends.get !== 'function') return null;
    try { return CE.trends.get(ref) || null; } catch (e) { return null; }
  }

  function updatedISO(ts) {
    if (!ts) return '';
    try { return new Date(ts).toISOString().slice(0, 10); } catch (e) { return ''; }
  }

  function fmtUpdated(ts) {
    var iso = updatedISO(ts);
    return iso ? CE.ui.fmtDate(iso) : '—';
  }

  function clientPlatforms(client) {
    var list = (client && client.platforms) ? client.platforms.filter(function (pid) {
      return !!CE.const.PLATFORMS[pid];
    }) : [];
    return list.length ? list : Object.keys(CE.const.PLATFORMS);
  }

  function findIdea(data, id) {
    for (var i = 0; i < data.ideas.length; i++) if (data.ideas[i].id === id) return data.ideas[i];
    return null;
  }

  function briefFor(data, ideaId) {
    for (var i = 0; i < data.briefs.length; i++) if (data.briefs[i].ideaId === ideaId) return data.briefs[i];
    return null;
  }

  function sortedIdeas(data) {
    return data.ideas.slice().sort(function (a, b) {
      var pa = a.status === 'published' ? 1 : 0;
      var pb = b.status === 'published' ? 1 : 0;
      if (pa !== pb) return pa - pb;                    // non-published first
      return (b.updatedAt || 0) - (a.updatedAt || 0);   // newest updated first
    });
  }

  /* mutate an idea inside store; opts passed through to CE.store.set */
  function patchIdea(clientId, ideaId, fn, opts) {
    CE.store.set(function (s) {
      var arr = (s.data[clientId] && s.data[clientId].ideas) || [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === ideaId) { fn(arr[i]); arr[i].updatedAt = Date.now(); break; }
      }
    }, opts);
  }

  function patchBrief(clientId, briefId, fn, opts) {
    CE.store.set(function (s) {
      var arr = (s.data[clientId] && s.data[clientId].briefs) || [];
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === briefId) { fn(arr[i]); break; }
      }
    }, opts);
  }

  /* ── brief generator: smart local template engine (no network) ───── */
  var STOPWORDS = {};
  ('a an and are as at be but by for from has have how i in into is it its of on or so that the ' +
   'their them then there these they this to was we what when where which who why will with you your ' +
   'our not can get one two new all more most out up down about over just really very via vs per off ' +
   'do does did done make makes made need needs want wants use using used than every each some any')
    .split(' ').forEach(function (w) { STOPWORDS[w] = true; });

  function significantWords(text) {
    return String(text || '').toLowerCase()
      .replace(/['’]/g, '')
      .split(/[^a-z0-9-]+/)
      .filter(function (w) { return w.length >= 3 && !STOPWORDS[w] && !/^\d+$/.test(w); });
  }

  function dedupe(arr) {
    var seen = {}, out = [];
    arr.forEach(function (w) { if (!seen[w]) { seen[w] = true; out.push(w); } });
    return out;
  }

  function topicPhrase(title) {
    var words = String(title || '').trim().split(/\s+/);
    return words.slice(0, 6).join(' ').replace(/[.,;:!?]+$/, '');
  }

  var PLATFORM_STRUCTURE = {
    instagram: 'Instagram-native structure: a scroll-stopping first frame/slide, one idea per slide, and a save-worthy recap at the end. Design for the feed AND the share sheet.',
    tiktok: 'TikTok-native structure: hook inside the first 1–2 seconds, fast cuts, on-screen captions throughout. Retention beats production polish.',
    youtube: 'YouTube-native structure: front-load the payoff in the first 30 seconds, decide title + thumbnail before scripting, and chapter the video.',
    linkedin: 'LinkedIn-native structure: a 1–2 line opener that earns the “…see more” click, short single-sentence paragraphs, end with a discussion question.',
    x: 'X-native structure: make the first post standalone-quotable, then thread one idea per post. Screenshots and lists outperform links.',
    facebook: 'Facebook-native structure: conversational, story-first framing; ask a question that invites comments — the algorithm rewards replies.',
    pinterest: 'Pinterest-native structure: vertical visual with a bold text overlay; treat the pin title and description as search keywords, not captions.'
  };

  var FORMAT_TIPS = {
    'short-video': 'Script it in three beats: hook (0–2s), payoff loop (deliver value fast), CTA. Keep it under 45 seconds unless retention demands more.',
    'long-video': 'Outline as chapters with a mini-hook at each transition so viewers keep a reason to stay.',
    'carousel': 'One idea per slide, big type, and put the strongest claim on slide 1 — most people never swipe past it.',
    'image': 'The image carries the hook: bold overlay text or a striking before/after; the caption carries the depth.',
    'text-post': 'Write the first line last — it does 80% of the work. Short paragraphs, concrete numbers, no throat-clearing.',
    'story': 'Use a 3–5 frame sequence: tease → context → payoff → poll/question sticker to drive replies.',
    'article': 'Lead with the conclusion, then evidence. Subheads should be skimmable as a standalone summary.',
    'live': 'Prepare a 3-point run-of-show and a recurring hook to repeat as new viewers join; announce it 24h ahead.'
  };

  var FALLBACK_HOOK_PATTERNS = [
    { pattern: 'Nobody is talking about {topic} — and it’s costing you' },
    { pattern: 'The biggest mistake people make with {topic} (and the 10-second fix)' },
    { pattern: 'I studied {topic} so you don’t have to. Here’s what actually matters' },
    { pattern: 'Stop doing {topic} the old way — do this instead' },
    { pattern: 'What most people get wrong about {topic}' }
  ];

  function adaptHook(pattern, phrase) {
    var p = String(pattern || '');
    // strip placeholder-like chars from the phrase so replacement can't recurse
    var safe = String(phrase || '').replace(/[{}\[\]<>_]/g, ' ').replace(/\s+/g, ' ').trim();
    var re = /\{[^}]*\}|\[[^\]]*\]|___+|<[^>]*>/;
    if (re.test(p)) {
      var guard = 0;
      while (re.test(p) && guard++ < 10) p = p.replace(re, safe);
      return p;
    }
    return p + ' — ' + safe;
  }

  function buildBrief(idea, client) {
    client = client || {};
    var topic = idea.title || 'Untitled idea';
    var phrase = topicPhrase(topic);
    var aud = client.audience || 'the target audience';
    var plat = CE.const.PLATFORMS[idea.platform];
    var trend = trendGet(idea.trendRef);

    /* summary — 2-3 sentences weaving industry/niche/audience + angle */
    var sentences = [];
    sentences.push('“' + topic + '” speaks directly to ' + aud +
      (client.industry ? ' in the ' + client.industry.toLowerCase() + ' space' : '') + '.');
    if (idea.angle) {
      sentences.push('The working angle is: ' + idea.angle.replace(/[.\s]+$/, '') + '.');
    } else if (client.niche) {
      sentences.push('Anchor the piece in the core niche — ' + client.niche.replace(/[.\s]+$/, '') + ' — so it reinforces topical authority.');
    }
    sentences.push('Make the payoff concrete' +
      (plat ? ' and shape it for how people actually consume ' + plat.label : '') +
      ': one clear promise in the hook, proof in the middle, a next step at the end.');
    var summary = sentences.slice(0, 3).join(' ');

    /* key points — 5-6 bullets */
    var keyPoints = [];
    keyPoints.push('Pain point: name the specific frustration ' + aud +
      ' feel around this topic in the first two lines — they should think “that’s me”.');
    keyPoints.push('Proof: include one real client story, before/after result, or firsthand experience that backs ' +
      (idea.angle ? 'the angle (' + topicPhrase(idea.angle) + '…)' : 'the core claim') + '.');
    if (plat) {
      keyPoints.push(PLATFORM_STRUCTURE[idea.platform] +
        ' Best posting windows: ' + (plat.bestTimes || []).join(', ') + ' · cadence ' + plat.cadence + '.');
    }
    if (trend) {
      if (trend.whyItWorks) keyPoints.push('Trend leverage — ' + trend.name + ': ' + trend.whyItWorks);
      if (trend.howToUse) keyPoints.push('How to ride it: ' + trend.howToUse);
    } else if (FORMAT_TIPS[idea.format]) {
      keyPoints.push('Format play (' + idea.format + '): ' + FORMAT_TIPS[idea.format]);
    }
    keyPoints.push('Data point: find ONE credible statistic that quantifies the problem (cite the source in the post) — a number makes the hook believable.');
    keyPoints = keyPoints.slice(0, 6);

    /* hooks — 3-4 adapted from CE.trends.hookPatterns */
    var patterns = (CE.trends && CE.trends.hookPatterns && CE.trends.hookPatterns.length)
      ? CE.trends.hookPatterns : FALLBACK_HOOK_PATTERNS;
    var hooks = [];
    for (var h = 0; h < patterns.length && hooks.length < 4; h++) {
      var adapted = adaptHook(patterns[h].pattern, phrase);
      if (adapted) hooks.push(adapted);
    }
    if (idea.hook && hooks.length < 4) hooks.unshift(idea.hook);
    hooks = dedupe(hooks).slice(0, 4);

    /* keywords — significant lowercase terms from niche + title, 8-12 */
    var keywords = significantWords(client.niche).concat(significantWords(topic));
    keywords = dedupe(keywords);
    if (keywords.length < 8) keywords = dedupe(keywords.concat(significantWords(idea.angle)));
    if (keywords.length < 8) keywords = dedupe(keywords.concat(significantWords(client.industry)));
    if (keywords.length < 8) keywords = dedupe(keywords.concat(significantWords(client.audience)));
    keywords = keywords.slice(0, 12);

    /* sources — suggested source TYPES to check */
    var sources = [
      'Google Trends: ' + phrase,
      'YouTube search: “' + phrase + '” 2026 — study the top 5 titles and thumbnails',
      'Competitor content audit: top ' + (client.industry || 'niche') + ' accounts — which angles are they missing?',
      'Reddit / community threads where ' + aud + ' ask questions — steal their exact wording'
    ];

    return {
      id: CE.uid(),
      ideaId: idea.id,
      topic: topic,
      summary: summary,
      keyPoints: keyPoints,
      hooks: hooks,
      keywords: keywords,
      sources: sources,
      competitors: [],
      createdAt: Date.now()
    };
  }

  function generateBrief(idea, client) {
    var brief = buildBrief(idea, client);
    CE.store.set(function (s) {
      var d = s.data[client.id];
      if (!d) return;
      // replace any stale brief for this idea
      d.briefs = d.briefs.filter(function (b) { return b.ideaId !== idea.id; });
      d.briefs.push(brief);
      for (var i = 0; i < d.ideas.length; i++) {
        if (d.ideas[i].id === idea.id) {
          if (d.ideas[i].status === 'idea') d.ideas[i].status = 'researched';
          d.ideas[i].updatedAt = Date.now();
          break;
        }
      }
    });
    CE.ui.toast('Research brief generated', 'good');
  }

  /* ── coach handoff ────────────────────────────────────────────────── */
  function deepResearch(idea, client) {
    var plat = CE.const.PLATFORMS[idea.platform];
    var msg = 'Deep research request for a content idea.\n' +
      'Title: ' + idea.title + '\n' +
      (idea.angle ? 'Angle: ' + idea.angle + '\n' : '') +
      (plat ? 'Platform: ' + plat.label + ' (' + idea.format + ')\n' : '') +
      (client && client.niche ? 'Client niche: ' + client.niche + '\n' : '') +
      (client && client.audience ? 'Audience: ' + client.audience + '\n' : '') +
      'Please build a research brief: key talking points, credible statistics with sources, ' +
      'common objections, competitor angles worth stealing or avoiding, and 5 hook options.';
    CE.openCoach(msg);
  }

  /* ── new idea modal ───────────────────────────────────────────────── */
  function openNewIdea(client) {
    var wrap = el('div');
    function field(labelText, node, hint) {
      return el('div', { class: 'field' }, el('label', { text: labelText }), node,
        hint ? el('span', { class: 'hint', text: hint }) : null);
    }
    var titleIn = el('input', { class: 'input', placeholder: 'e.g. Why cold outreach is dying in ' + (client.industry || 'your industry') });
    var angleIn = el('input', { class: 'input', placeholder: 'What makes this take yours?' });
    var hookIn = el('input', { class: 'input', placeholder: 'First line / first two seconds' });
    var platSel = el('select', { class: 'select' });
    clientPlatforms(client).forEach(function (pid) {
      platSel.appendChild(el('option', { value: pid, text: CE.const.PLATFORMS[pid].label }));
    });
    var fmtSel = el('select', { class: 'select' });
    CE.const.FORMATS.forEach(function (f) { fmtSel.appendChild(el('option', { value: f, text: f })); });
    var notesTa = el('textarea', { class: 'textarea', rows: '3', placeholder: 'References, links, loose thoughts…' });

    wrap.appendChild(field('Title', titleIn));
    wrap.appendChild(field('Angle', angleIn, 'The opinion or perspective — not the topic.'));
    wrap.appendChild(field('Hook', hookIn));
    wrap.appendChild(el('div', { class: 'grid cols-2' },
      field('Platform', platSel),
      field('Format', fmtSel)));
    wrap.appendChild(field('Notes', notesTa));

    CE.ui.modal({
      title: 'New idea',
      body: wrap,
      actions: [
        { label: 'Cancel' },
        {
          label: 'Add to pipeline', class: 'btn-primary',
          onClick: function () {
            var title = titleIn.value.trim();
            if (!title) { CE.ui.toast('Give the idea a title', 'err'); titleIn.focus(); return false; }
            var now = Date.now();
            var idea = {
              id: CE.uid(), title: title, angle: angleIn.value.trim(), hook: hookIn.value.trim(),
              format: fmtSel.value, platform: platSel.value, status: 'idea', trendRef: null,
              notes: notesTa.value, createdAt: now, updatedAt: now
            };
            selectedId = idea.id;
            statusFilter = 'all';
            CE.store.set(function (s) { s.data[client.id].ideas.push(idea); });
            CE.ui.toast('Idea added to pipeline', 'good');
          }
        }
      ]
    });
  }

  /* ── delete idea (+ schedule refs + brief) ────────────────────────── */
  function deleteIdea(idea, client) {
    CE.ui.confirm('Delete “' + idea.title + '”? Its research brief and any scheduled slots referencing it will also be removed.', 'Delete idea')
      .then(function (ok) {
        if (!ok) return;
        CE.store.set(function (s) {
          var d = s.data[client.id];
          if (!d) return;
          d.ideas = d.ideas.filter(function (i) { return i.id !== idea.id; });
          d.briefs = d.briefs.filter(function (b) { return b.ideaId !== idea.id; });
          d.schedule = d.schedule.filter(function (e) { return !(e.refType === 'idea' && e.refId === idea.id); });
        });
        if (selectedId === idea.id) selectedId = null;
        CE.ui.toast('Idea deleted', '');
      });
  }

  /* ── pipeline summary strip ───────────────────────────────────────── */
  function pipelineStrip(data) {
    var counts = {};
    CE.const.STATUSES.forEach(function (st) { counts[st] = 0; });
    data.ideas.forEach(function (i) { if (counts.hasOwnProperty(i.status)) counts[i.status]++; });

    var row = el('div', { class: 'row wrap', style: { gap: '8px' } });

    function chip(value, labelNode, count) {
      var active = statusFilter === value;
      var b = el('button', {
        class: 'btn btn-sm' + (active ? '' : ' btn-ghost'),
        style: active ? { borderColor: 'var(--accent)' } : null,
        'aria-pressed': active ? 'true' : 'false',
        onclick: function () {
          statusFilter = (statusFilter === value) ? 'all' : value;
          CE.rerender();
        }
      }, labelNode);
      return b;
    }

    row.appendChild(chip('all',
      el('span', {}, 'All ideas ', el('span', { class: 'mono muted', text: String(data.ideas.length) })), data.ideas.length));

    CE.const.STATUSES.forEach(function (st) {
      var label = el('span', { class: 'row', style: { gap: '6px', alignItems: 'center' } },
        el('span', { class: 'swatch', style: { width: '7px', height: '7px', borderRadius: '50%', display: 'inline-block', background: CE.const.STATUS_COLORS[st] } }),
        el('span', { text: CE.const.STATUS_LABELS[st] + ' ' }),
        el('span', { class: 'mono muted', text: String(counts[st]) }));
      row.appendChild(chip(st, label, counts[st]));
    });

    return el('div', { class: 'card mb', style: { padding: '10px 16px' } },
      el('div', { class: 'spread', style: { gap: '10px', flexWrap: 'wrap' } },
        row,
        el('span', { class: 'small muted', text: statusFilter === 'all' ? 'Click a stage to filter' : 'Filtering: ' + (CE.const.STATUS_LABELS[statusFilter] || statusFilter) })));
  }

  /* ── ideas table ──────────────────────────────────────────────────── */
  function ideasTable(data, client) {
    var list = sortedIdeas(data);
    if (statusFilter !== 'all') list = list.filter(function (i) { return i.status === statusFilter; });

    var card = el('div', { class: 'card' });

    if (!list.length) {
      card.appendChild(el('div', { class: 'empty' },
        el('div', { class: 'empty-icon', text: '🗂️' }),
        el('h3', { text: statusFilter === 'all' ? 'No ideas match' : 'Nothing in “' + (CE.const.STATUS_LABELS[statusFilter] || statusFilter) + '”' }),
        el('p', { text: 'Try another stage or clear the filter.' }),
        el('button', {
          class: 'btn btn-sm', text: 'Show all ideas',
          onclick: function () { statusFilter = 'all'; CE.rerender(); }
        })));
      return card;
    }

    var table = el('table', { class: 'table' });
    table.appendChild(el('thead', {}, el('tr', {},
      el('th', { text: 'Title' }),
      el('th', { text: 'Platform' }),
      el('th', { text: 'Format' }),
      el('th', { text: 'Status' }),
      el('th', { text: 'Updated' }))));

    var tbody = el('tbody');
    list.forEach(function (idea) {
      var trend = trendGet(idea.trendRef);
      var titleCell = el('td', { style: { maxWidth: '380px' } },
        el('div', { style: { fontWeight: '600', color: 'var(--ink-1, var(--ink-2))', lineHeight: '1.35' }, text: idea.title }),
        trend ? el('span', { class: 'tag small', style: { marginTop: '4px', display: 'inline-block' }, text: '↗ ' + trend.name }) : null);
      var tr = el('tr', {
        class: 'click' + (selectedId === idea.id ? '' : ''),
        style: selectedId === idea.id ? { background: 'var(--surface-2)' } : null,
        onclick: function () {
          selectedId = (selectedId === idea.id) ? null : idea.id;
          CE.rerender();
        }
      },
        titleCell,
        el('td', {}, CE.ui.platformBadge(idea.platform)),
        el('td', {}, el('span', { class: 'tag', text: idea.format || '—' })),
        el('td', {}, CE.ui.statusBadge(idea.status)),
        el('td', { class: 'muted', text: fmtUpdated(idea.updatedAt) }));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    card.appendChild(table);
    return card;
  }

  /* ── brief section ────────────────────────────────────────────────── */
  function briefSection(idea, brief, client) {
    var box = el('div');
    box.appendChild(el('div', { class: 'divider' }));
    box.appendChild(el('div', { class: 'spread', style: { marginBottom: '12px' } },
      el('div', { class: 'card-title', style: { marginBottom: '0' }, text: 'Research brief' }),
      brief ? el('button', {
        class: 'btn btn-ghost btn-sm', text: '↻ Regenerate',
        onclick: function () {
          CE.ui.confirm('Regenerate the brief? Your edits to this brief will be replaced.', 'Regenerate')
            .then(function (ok) { if (ok) generateBrief(idea, client); });
        }
      }) : null));

    if (!brief) {
      box.appendChild(el('div', { class: 'empty', style: { padding: '28px 20px' } },
        el('div', { class: 'empty-icon', text: '🧭' }),
        el('h3', { text: 'No brief yet' }),
        el('p', { text: 'Generate a structured research brief from the client profile, the idea’s angle and platform playbooks — then edit it inline.' }),
        el('div', { class: 'row', style: { justifyContent: 'center', gap: '8px' } },
          el('button', {
            class: 'btn btn-primary',
            html: CE.icon('book') + '<span>Generate research brief</span>',
            onclick: function () { generateBrief(idea, client); }
          }),
          el('button', {
            class: 'btn',
            html: CE.icon('spark') + '<span>Deep research with Coach</span>',
            onclick: function () { deepResearch(idea, client); }
          }))));
      return box;
    }

    box.appendChild(el('div', { class: 'small muted mb', text: 'Topic: ' + brief.topic + ' · generated ' + fmtUpdated(brief.createdAt) }));

    function saveField(fn) {
      patchBrief(client.id, brief.id, fn, { rerender: false });
    }

    /* summary */
    var summaryTa = el('textarea', { class: 'textarea', rows: '3', text: brief.summary || '' });
    summaryTa.addEventListener('input', function () {
      var v = this.value;
      saveField(function (b) { b.summary = v; });
    });
    box.appendChild(el('div', { class: 'field' }, el('label', { text: 'Summary' }), summaryTa));

    /* list editors — one item per line */
    function listEditor(labelText, key, rows, hint) {
      var ta = el('textarea', { class: 'textarea mono', rows: String(rows), text: (brief[key] || []).join('\n') });
      ta.addEventListener('input', function () {
        var lines = this.value.split('\n').map(function (l) { return l.replace(/^\s+|\s+$/g, ''); })
          .filter(function (l) { return l.length; });
        saveField(function (b) { b[key] = lines; });
      });
      return el('div', { class: 'field' }, el('label', { text: labelText }), ta,
        el('span', { class: 'hint', text: hint || 'One item per line.' }));
    }

    box.appendChild(listEditor('Key points', 'keyPoints', 7, 'One talking point per line — these become the outline in Create.'));
    box.appendChild(el('div', { class: 'grid cols-2' },
      listEditor('Hook options', 'hooks', 5),
      listEditor('Sources to check', 'sources', 5)));

    /* keywords: tag preview + editor */
    var kwPreview = el('div', { class: 'row wrap', style: { gap: '6px', marginBottom: '8px' } });
    function paintKw(arr) {
      kwPreview.innerHTML = '';
      (arr || []).forEach(function (k) { kwPreview.appendChild(el('span', { class: 'tag', text: k })); });
    }
    paintKw(brief.keywords);
    var kwTa = el('textarea', { class: 'textarea mono', rows: '3', text: (brief.keywords || []).join('\n') });
    kwTa.addEventListener('input', function () {
      var lines = this.value.split('\n').map(function (l) { return l.replace(/^\s+|\s+$/g, '').toLowerCase(); })
        .filter(function (l) { return l.length; });
      saveField(function (b) { b.keywords = lines; });
      paintKw(lines);
    });
    box.appendChild(el('div', { class: 'field' }, el('label', { text: 'Keywords' }), kwPreview, kwTa,
      el('span', { class: 'hint', text: 'One keyword per line — used for titles, captions and SEO.' })));

    return box;
  }

  /* ── detail panel ─────────────────────────────────────────────────── */
  function detailPanel(idea, data, client) {
    var card = el('div', { class: 'card pad-lg mt' });
    var trend = trendGet(idea.trendRef);

    /* header row */
    card.appendChild(el('div', { class: 'spread', style: { alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '4px' } },
      el('div', { style: { minWidth: '0' } },
        el('div', { class: 'row wrap', style: { gap: '8px', alignItems: 'center' } },
          el('h2', { style: { fontSize: '17px', fontWeight: '650', lineHeight: '1.3' }, text: idea.title }),
          CE.ui.statusBadge(idea.status)),
        trend ? el('div', { class: 'small muted', style: { marginTop: '4px' }, text: 'From trend: ' + trend.name } ) : null),
      el('div', { class: 'row', style: { gap: '8px', flexShrink: '0', flexWrap: 'wrap' } },
        el('button', {
          class: 'btn btn-sm',
          html: CE.icon('spark') + '<span>Deep research with Coach</span>',
          onclick: function () { deepResearch(idea, client); }
        }),
        el('button', {
          class: 'btn btn-primary btn-sm',
          html: CE.icon('pen') + '<span>Send to Create</span>',
          onclick: function () { CE.navigate('create', 'idea=' + idea.id); }
        }),
        el('button', {
          class: 'btn btn-danger btn-sm',
          html: CE.icon('trash') + '<span>Delete</span>',
          onclick: function () { deleteIdea(idea, client); }
        }))));

    card.appendChild(el('div', { class: 'divider' }));

    /* editable fields */
    function textField(labelText, prop, placeholder) {
      var input = el('input', { class: 'input', value: idea[prop] || '', placeholder: placeholder || '' });
      input.addEventListener('input', function () {
        var v = this.value;
        patchIdea(client.id, idea.id, function (i) { i[prop] = v; }, { rerender: false });
      });
      return el('div', { class: 'field' }, el('label', { text: labelText }), input);
    }

    card.appendChild(textField('Title', 'title'));
    card.appendChild(el('div', { class: 'grid cols-2' },
      textField('Angle', 'angle', 'The opinion or perspective'),
      textField('Hook', 'hook', 'First line / first two seconds')));

    /* selects: platform / format / status → normal set (full rerender) */
    var platSel = el('select', { class: 'select' });
    var platOpts = clientPlatforms(client);
    if (idea.platform && platOpts.indexOf(idea.platform) < 0) platOpts = platOpts.concat([idea.platform]);
    platOpts.forEach(function (pid) {
      var p = CE.const.PLATFORMS[pid];
      platSel.appendChild(el('option', { value: pid, text: p ? p.label : pid }));
    });
    platSel.value = idea.platform;
    platSel.addEventListener('change', function () {
      var v = this.value;
      patchIdea(client.id, idea.id, function (i) { i.platform = v; });
    });

    var fmtSel = el('select', { class: 'select' });
    var fmts = CE.const.FORMATS.slice();
    if (idea.format && fmts.indexOf(idea.format) < 0) fmts.push(idea.format);
    fmts.forEach(function (f) { fmtSel.appendChild(el('option', { value: f, text: f })); });
    fmtSel.value = idea.format;
    fmtSel.addEventListener('change', function () {
      var v = this.value;
      patchIdea(client.id, idea.id, function (i) { i.format = v; });
    });

    var stSel = el('select', { class: 'select' });
    CE.const.STATUSES.forEach(function (st) {
      stSel.appendChild(el('option', { value: st, text: CE.const.STATUS_LABELS[st] }));
    });
    stSel.value = idea.status;
    stSel.addEventListener('change', function () {
      var v = this.value;
      patchIdea(client.id, idea.id, function (i) { i.status = v; });
    });

    card.appendChild(el('div', { class: 'grid cols-3' },
      el('div', { class: 'field' }, el('label', { text: 'Platform' }), platSel),
      el('div', { class: 'field' }, el('label', { text: 'Format' }), fmtSel),
      el('div', { class: 'field' }, el('label', { text: 'Status' }), stSel)));

    var notesTa = el('textarea', { class: 'textarea', rows: '3', text: idea.notes || '', placeholder: 'References, links, loose thoughts…' });
    notesTa.addEventListener('input', function () {
      var v = this.value;
      patchIdea(client.id, idea.id, function (i) { i.notes = v; }, { rerender: false });
    });
    card.appendChild(el('div', { class: 'field' }, el('label', { text: 'Notes' }), notesTa));

    /* research brief */
    card.appendChild(briefSection(idea, briefFor(data, idea.id), client));

    return card;
  }

  /* ── render ───────────────────────────────────────────────────────── */
  function render(container, ctx) {
    var client = CE.store.client();
    var cid = client ? client.id : null;
    if (cid !== lastClientId) {
      selectedId = null; statusFilter = 'all'; lastClientId = cid;
    }

    /* deep-link: ?id=<ideaId> — adopt once, don't override later row clicks */
    var pid = (ctx && ctx.params) ? ctx.params.get('id') : null;
    if (pid && pid !== lastParamId) { selectedId = pid; statusFilter = 'all'; }
    lastParamId = pid;

    /* head */
    container.appendChild(el('div', { class: 'view-head' },
      el('div', {},
        el('h1', { text: 'Research' }),
        el('div', { class: 'sub', text: 'Idea pipeline & research briefs — take a spark from Discover and make it defensible' })),
      el('div', { class: 'spacer' }),
      client ? el('button', {
        class: 'btn btn-primary',
        html: CE.icon('plus') + '<span>New idea</span>',
        onclick: function () { openNewIdea(client); }
      }) : null));

    /* no client */
    if (!client) {
      container.appendChild(el('div', { class: 'card' },
        el('div', { class: 'empty' },
          el('div', { class: 'empty-icon', text: '👥' }),
          el('h3', { text: 'No client yet' }),
          el('p', { text: 'Research is organized per client. Add your first client to start building an idea pipeline.' }),
          el('button', {
            class: 'btn btn-primary', text: 'Add your first client',
            onclick: function () { CE.openAddClient(); }
          }))));
      return;
    }

    var data = CE.store.data();

    /* no ideas at all */
    if (!data.ideas.length) {
      container.appendChild(el('div', { class: 'card' },
        el('div', { class: 'empty' },
          el('div', { class: 'empty-icon', text: '💡' }),
          el('h3', { text: 'The pipeline is empty' }),
          el('p', { text: 'Pull a trend from Discover or add an idea of your own — then generate a research brief to make it worth posting.' }),
          el('div', { class: 'row', style: { justifyContent: 'center', gap: '8px' } },
            el('button', {
              class: 'btn',
              html: CE.icon('compass') + '<span>Browse Discover</span>',
              onclick: function () { CE.navigate('discover'); }
            }),
            el('button', {
              class: 'btn btn-primary',
              html: CE.icon('plus') + '<span>New idea</span>',
              onclick: function () { openNewIdea(client); }
            })))));
      return;
    }

    /* pipeline summary strip */
    container.appendChild(pipelineStrip(data));

    /* master list */
    container.appendChild(ideasTable(data, client));

    /* detail */
    if (selectedId) {
      var idea = findIdea(data, selectedId);
      if (idea) container.appendChild(detailPanel(idea, data, client));
      else selectedId = null;
    }

    if (!selectedId) {
      container.appendChild(el('div', { class: 'hint mt', style: { display: 'block' }, text: 'Select an idea in the table to edit it and build its research brief.' }));
    }
  }

  CE.views.research = { id: 'research', title: 'Research', icon: 'book', render: render };
})();
