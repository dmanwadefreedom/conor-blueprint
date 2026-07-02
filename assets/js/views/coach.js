/* Content Engine — views/coach.js
 * Coach AI: full chat view + reusable chat panel (used by the slide-over drawer).
 * Connected mode talks to the Anthropic Messages API with client-scoped tools
 * that write real work product (ideas, briefs, drafts, schedule items) into the
 * store. Offline mode is a genuinely useful local heuristic coach.
 * Exposes: CE.views.coach and CE.coach = { renderPanel, connected }.
 */
(function () {
  'use strict';

  var CE = window.CE;
  var el = CE.ui.el;

  var API_URL = 'https://api.anthropic.com/v1/messages';
  var THREAD_CAP = 60;
  var MAX_TOOL_ROUNDS = 6;
  var GEAR = '⚙';
  /* shared in-flight guard: the coach view and the drawer can both host a
   * panel on the same thread, so a per-panel flag is not enough. */
  var busy = false;

  var SUGGESTED_PROMPTS = [
    'Plan my next week of content',
    'Give me 5 hook ideas',
    'What’s trending for my niche?',
    'Turn my latest idea into a script',
    'Summarize my pipeline and what to do next'
  ];

  /* ── tiny helpers ─────────────────────────────────────────────────── */

  function connected() {
    var s = CE.store.get();
    return !!(((s.settings && s.settings.apiKey) || '').trim());
  }

  function modelName() {
    var s = CE.store.get();
    return (s.settings && s.settings.model) || 'claude-sonnet-5';
  }

  function isToolNote(content) {
    return String(content || '').indexOf(GEAR) === 0;
  }

  function firstSentence(s) {
    s = String(s || '');
    var i = s.indexOf('. ');
    return i > 0 ? s.slice(0, i + 1) : s;
  }

  function cap(s) {
    s = String(s || '');
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  function strArr(v, max) {
    if (!Array.isArray(v)) return [];
    var out = [];
    for (var i = 0; i < v.length && out.length < (max || 12); i++) {
      var s = String(v[i] == null ? '' : v[i]).trim();
      if (s) out.push(s);
    }
    return out;
  }

  function validPlatform(pid, client) {
    if (pid && CE.const.PLATFORMS[pid]) return pid;
    if (client && client.platforms && client.platforms[0]) return client.platforms[0];
    return 'instagram';
  }

  function validFormat(f) {
    return CE.const.FORMATS.indexOf(f) >= 0 ? f : 'short-video';
  }

  function pushToThread(msg, clientId) {
    CE.store.set(function () {
      var t = CE.store.data(clientId).coachThread;
      t.push(msg);
      while (t.length > THREAD_CAP) t.shift();
    }, { rerender: false });
  }

  function msgNode(m) {
    var cls = isToolNote(m.content) ? 'chat-msg tool-note'
      : 'chat-msg ' + (m.role === 'user' ? 'user' : 'assistant');
    return el('div', { class: cls, text: m.content });
  }

  function typingNode() {
    return el('div', { class: 'chat-msg assistant' },
      el('span', { class: 'typing' }, el('i'), el('i'), el('i')));
  }

  function statusDot(on) {
    return el('span', {
      style: {
        width: '8px', height: '8px', borderRadius: '50%', flex: '0 0 auto',
        background: on ? '#0ca30c' : 'var(--ink-3, #898781)',
        boxShadow: on ? '0 0 6px rgba(12,163,12,.7)' : 'none',
        display: 'inline-block'
      }
    });
  }

  /* ── client-derived language for the offline coach ───────────────── */

  function nicheTopics(client) {
    var raw = (client && client.niche) || '';
    var parts = raw.split(/[,;•\n]+/).map(function (s) { return s.trim(); })
      .filter(function (s) { return !!s; });
    if (!parts.length && client && client.industry) parts = [client.industry];
    if (!parts.length) parts = ['your niche'];
    return parts;
  }

  function goalWord(client) {
    var raw = (client && client.goals) || '';
    var first = raw.split(/[,;.\n]+/)[0].trim();
    return first ? first.toLowerCase() : 'results';
  }

  function pickTopic(q, client) {
    var m = q.match(/(?:about|around|for|on)\s+([a-z0-9&' -]{3,42})/);
    if (m && m[1].trim().length > 2) return m[1].trim().replace(/[?.!]+$/, '');
    return nicheTopics(client)[0].toLowerCase();
  }

  /* ── OFFLINE coach ────────────────────────────────────────────────── */

  var OFFLINE_FOOTER = 'ℹ️ Offline coach — add your Anthropic API key in ' +
    'Clients & Settings to unlock full AI (live reasoning + it can build ideas, ' +
    'drafts and schedules for you).';

  function fillPattern(pattern, topic, goal) {
    var used = 0;
    return pattern.replace(/___/g, function () {
      used++;
      return used === 1 ? topic : goal;
    });
  }

  function offlineHooks(q, client, data) {
    var topic = pickTopic(q, client);
    var goal = goalWord(client);
    var pats = (CE.trends && CE.trends.hookPatterns || []).filter(function (p) {
      return p.pattern.indexOf('$') < 0;
    });
    if (!pats.length) return 'Open the Discover tab for hook formulas.';
    var offset = (data.coachThread.length * 3) % pats.length;
    var lines = ['5 hooks for "' + topic + '" — steal, then say it in ' +
      ((client && client.name) || 'your client') + '’s voice:', ''];
    for (var i = 0; i < 5; i++) {
      var p = pats[(offset + i) % pats.length];
      lines.push((i + 1) + '. ' + cap(fillPattern(p.pattern, topic, goal)));
    }
    lines.push('');
    lines.push('Rule of thumb: the hook is the whole first second. If line 1 could open ' +
      'anyone’s post, rewrite it until it could only open yours.');
    return lines.join('\n');
  }

  function offlineTrends(client) {
    var rank = { rising: 0, peaking: 1, steady: 2 };
    var list = (CE.trends ? CE.trends.forClient(client) : []).slice()
      .sort(function (a, b) { return (rank[a.momentum] || 3) - (rank[b.momentum] || 3); })
      .slice(0, 5);
    if (!list.length) return 'No trend data loaded yet — check the Discover tab.';
    var lines = ['Top trends across ' + ((client && client.name) || 'your') + '’s platforms right now:', ''];
    list.forEach(function (t) {
      var p = CE.const.PLATFORMS[t.platform];
      lines.push('• ' + t.name + ' (' + (p ? p.short : t.platform) + ', ' +
        (CE.const.MOMENTUM[t.momentum] || t.momentum) + ') — ' + firstSentence(t.whyItWorks));
    });
    lines.push('');
    lines.push('Discover has the full library — each trend comes with how-to-use notes ' +
      'and a ready-made prompt you can turn into an idea in one click.');
    return lines.join('\n');
  }

  var IDEA_TEMPLATES = [
    'The {t} mistake almost everyone makes (and the 10-minute fix)',
    'What actually works in {t} right now — and what quietly died',
    '{T} explained like you have 45 seconds',
    'Behind the scenes: how we really handle {t}',
    'Before/after: one {t} change and what it did to the numbers'
  ];

  function offlineIdeas(q, client) {
    var topics = nicheTopics(client);
    var trends = (CE.trends ? CE.trends.forClient(client) : []).filter(function (t) {
      return t.type === 'format' || t.type === 'hook';
    });
    if (!trends.length && CE.trends) trends = CE.trends.forClient(client);
    var lines = ['5 idea starters mixing your niche with what’s working right now:', ''];
    for (var i = 0; i < 5; i++) {
      var topic = topics[i % topics.length].toLowerCase();
      var title = IDEA_TEMPLATES[i % IDEA_TEMPLATES.length]
        .replace('{t}', topic).replace('{T}', cap(topic));
      var t = trends.length ? trends[i % trends.length] : null;
      lines.push((i + 1) + '. ' + title + (t
        ? '\n   ↳ format: ' + t.name + (CE.const.PLATFORMS[t.platform] ? ' on ' + CE.const.PLATFORMS[t.platform].label : '')
        : ''));
    }
    lines.push('');
    lines.push('Save any of these from the Discover tab, or add them by hand in Research.');
    return lines.join('\n');
  }

  function todayIso() {
    var d = new Date();
    function p(n) { return (n < 10 ? '0' : '') + n; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function offlineSchedule(client, data) {
    var today = todayIso();
    var upcoming = data.schedule.filter(function (e) {
      return e.status !== 'published' && e.date && e.date >= today;
    }).sort(function (a, b) {
      var ka = a.date + ' ' + (a.time || ''), kb = b.date + ' ' + (b.time || '');
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });
    var lines = [];
    if (upcoming.length) {
      lines.push('You have ' + upcoming.length + ' post' + (upcoming.length === 1 ? '' : 's') + ' queued. Next up:');
      upcoming.slice(0, 5).forEach(function (e) {
        var p = CE.const.PLATFORMS[e.platform];
        lines.push('• ' + CE.ui.fmtDate(e.date) + ' ' + (e.time || '') + ' · ' + e.title +
          (p ? ' (' + p.short + ')' : ''));
      });
    } else {
      lines.push('Your calendar is empty from today forward — that’s the first thing to fix.');
    }
    lines.push('');
    lines.push('Suggested cadence for your platforms:');
    ((client && client.platforms) || []).forEach(function (pid) {
      var p = CE.const.PLATFORMS[pid];
      if (p) lines.push('• ' + p.label + ': ' + p.cadence + ' · best times ' + p.bestTimes.join(', '));
    });
    lines.push('');
    lines.push('Work backwards: pick publish slots first, then drag drafts onto them in the Plan tab.');
    return lines.join('\n');
  }

  function offlineDraftSkeleton(q, client) {
    var topic = pickTopic(q, client);
    var voice = ((client && client.voice) || 'clear, direct, no fluff').split('\n')[0];
    var lines = [
      'Quick 3-line skeleton for "' + topic + '" — flesh it out in the Create tab:',
      '',
      'Hook: "Nobody talks about the part of ' + topic + ' that actually moves the needle. Here it is."',
      'Value: pay the hook off fast — one concrete step, number or client example. Two or three short lines max, written in the voice: ' + voice,
      'CTA: one ask only — e.g. "Comment SYSTEM and I’ll send the checklist" or "Follow for the next part."',
      '',
      'Open Create to turn this into a full platform-native draft with hashtags and visual notes.'
    ];
    return lines.join('\n');
  }

  function offlineDefault(client, data) {
    var counts = {};
    data.ideas.forEach(function (i) { counts[i.status] = (counts[i.status] || 0) + 1; });
    var today = todayIso();
    var queued = data.schedule.filter(function (e) { return e.status !== 'published' && e.date >= today; }).length;
    var lines = ['Here’s where ' + ((client && client.name) || 'your client') + ' stands:', ''];
    lines.push('• ' + data.ideas.length + ' idea' + (data.ideas.length === 1 ? '' : 's') + ' in the pipeline' +
      (counts.idea ? ' (' + counts.idea + ' still raw)' : ''));
    lines.push('• ' + data.briefs.length + ' research brief' + (data.briefs.length === 1 ? '' : 's') +
      ' · ' + data.drafts.length + ' draft' + (data.drafts.length === 1 ? '' : 's'));
    lines.push('• ' + queued + ' post' + (queued === 1 ? '' : 's') + ' scheduled from today forward');
    lines.push('');
    lines.push('3 next actions:');
    var rawIdea = data.ideas.filter(function (i) { return i.status === 'idea'; })[0];
    var readyDraft = data.drafts.filter(function (d) { return d.status === 'drafted' || d.status === 'approved'; })[0];
    lines.push('1. ' + (rawIdea
      ? 'Research "' + rawIdea.title + '" — build a brief in the Research tab.'
      : 'Bank fresh ideas — the Discover tab has trends matched to your platforms.'));
    lines.push('2. ' + (readyDraft
      ? 'Get "' + firstSentence(readyDraft.hook || 'your latest draft') + '" approved and onto the calendar.'
      : 'Write one draft in Create — hook first, then value, then a single CTA.'));
    lines.push('3. ' + (queued < 3
      ? 'Fill the next 7 days in Plan so the queue never runs dry.'
      : 'Review the queue in Plan — check every slot still matches its best posting time.'));
    return lines.join('\n');
  }

  function offlineReply(text, client, data) {
    var q = text.toLowerCase();
    var body;
    if (q.indexOf('hook') >= 0) body = offlineHooks(q, client, data);
    else if (q.indexOf('trend') >= 0) body = offlineTrends(client);
    else if (q.indexOf('idea') >= 0) body = offlineIdeas(q, client);
    else if (q.indexOf('schedule') >= 0 || q.indexOf('plan') >= 0 || q.indexOf('calendar') >= 0) body = offlineSchedule(client, data);
    else if (q.indexOf('caption') >= 0 || q.indexOf('script') >= 0 || q.indexOf('write') >= 0 || q.indexOf('draft') >= 0) body = offlineDraftSkeleton(q, client);
    else body = offlineDefault(client, data);
    return body + '\n\n' + OFFLINE_FOOTER;
  }

  /* ── CONNECTED mode: system prompt, tools, API loop ───────────────── */

  function buildSystem(c) {
    var d = CE.store.data(c.id);
    var L = [];
    L.push('You are Coach, the strategy engine inside Content Engine — the multi-client content marketing command center for the agency of Dylan Ewing (thedylanewing.com). You help plan, research, write and schedule social content for the active client.');
    L.push('Today is ' + new Date().toDateString() + '.');
    L.push('');
    L.push('ACTIVE CLIENT PROFILE');
    L.push('Name: ' + (c.name || '—'));
    L.push('Industry: ' + (c.industry || '—'));
    L.push('Niche & core topics: ' + (c.niche || '—'));
    L.push('Target audience: ' + (c.audience || '—'));
    L.push('Voice & tone: ' + (c.voice || '—'));
    L.push('Goals: ' + (c.goals || '—'));
    var plats = (c.platforms || []).map(function (pid) {
      var p = CE.const.PLATFORMS[pid];
      return p ? p.label + ' (' + p.cadence + ', best times ' + p.bestTimes.join('/') + ')' : pid;
    });
    L.push('Platforms: ' + (plats.join('; ') || '—'));
    L.push('');
    L.push('PIPELINE SNAPSHOT');
    L.push('Totals: ' + d.ideas.length + ' ideas, ' + d.briefs.length + ' briefs, ' +
      d.drafts.length + ' drafts, ' + d.schedule.length + ' schedule items.');
    var recent = d.ideas.slice(-10);
    if (recent.length) {
      L.push('Recent ideas:');
      recent.forEach(function (i) {
        L.push('- ' + i.title + ' [' + i.status + (i.platform ? ', ' + i.platform : '') + ']');
      });
    }
    var today = todayIso();
    var next = d.schedule.filter(function (e) { return e.status !== 'published' && e.date >= today; })
      .sort(function (a, b) {
        var ka = a.date + ' ' + (a.time || ''), kb = b.date + ' ' + (b.time || '');
        return ka < kb ? -1 : ka > kb ? 1 : 0;
      }).slice(0, 5);
    if (next.length) {
      L.push('Next scheduled:');
      next.forEach(function (e) {
        L.push('- ' + e.date + ' ' + (e.time || '') + ' · ' + e.title + ' (' + e.platform + ')');
      });
    }
    L.push('');
    L.push('INSTRUCTIONS');
    L.push('- Be concrete and actionable. Specific hooks, titles, dates and platforms — never vague advice.');
    L.push('- When the user wants ideas, research, drafts or a schedule, USE YOUR TOOLS to actually add the work product to their pipeline; then briefly summarize what you added. Do not just describe what could be added.');
    L.push('- Use get_pipeline and get_trends to check current state before planning.');
    L.push('- Match the client’s voice and platforms. Schedule at the platform best times unless told otherwise.');
    L.push('- Plain text only: no markdown headers, no bold/asterisks. Short paragraphs and simple "-" lists are fine.');
    L.push('- Keep replies tight and skimmable.');
    return L.join('\n');
  }

  function buildTools() {
    var platformIds = Object.keys(CE.const.PLATFORMS);
    return [
      {
        name: 'add_idea',
        description: 'Add a new content idea to the active client’s pipeline with status "idea". Returns the new idea id.',
        input_schema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Short, punchy idea title' },
            angle: { type: 'string', description: 'The angle or take that makes it distinct' },
            hook: { type: 'string', description: 'Opening hook line' },
            platform: { type: 'string', enum: platformIds },
            format: { type: 'string', enum: CE.const.FORMATS }
          },
          required: ['title', 'platform', 'format']
        }
      },
      {
        name: 'save_brief',
        description: 'Save a research brief for the client (optionally linked to an existing idea via ideaId, which moves that idea to "researched"). Returns the brief id.',
        input_schema: {
          type: 'object',
          properties: {
            ideaId: { type: 'string', description: 'Existing idea id to link (from get_pipeline or add_idea)' },
            topic: { type: 'string' },
            summary: { type: 'string', description: '2-4 sentence research summary' },
            keyPoints: { type: 'array', items: { type: 'string' } },
            hooks: { type: 'array', items: { type: 'string' } },
            keywords: { type: 'array', items: { type: 'string' } }
          },
          required: ['topic', 'summary']
        }
      },
      {
        name: 'save_draft',
        description: 'Save a ready-to-edit post draft with status "drafted" (optionally linked to an idea via ideaId, which moves that idea to "drafted"). Returns the draft id.',
        input_schema: {
          type: 'object',
          properties: {
            ideaId: { type: 'string' },
            platform: { type: 'string', enum: platformIds },
            format: { type: 'string', enum: CE.const.FORMATS },
            hook: { type: 'string', description: 'First line / opening hook' },
            body: { type: 'string', description: 'Full post body or script, platform-native' },
            hashtags: { type: 'array', items: { type: 'string' }, description: 'Without the # symbol' },
            cta: { type: 'string' },
            visualNotes: { type: 'string', description: 'Direction for visuals / b-roll / slides' }
          },
          required: ['platform', 'format', 'hook', 'body']
        }
      },
      {
        name: 'schedule_post',
        description: 'Put a post on the client’s publishing calendar. Pass refId of an existing draft or idea when scheduling existing work; omit it to auto-create a new idea from the title.',
        input_schema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            date: { type: 'string', description: 'YYYY-MM-DD' },
            time: { type: 'string', description: 'HH:MM 24h' },
            platform: { type: 'string', enum: platformIds },
            refId: { type: 'string', description: 'Existing draft or idea id' }
          },
          required: ['title', 'date', 'time', 'platform']
        }
      },
      {
        name: 'get_trends',
        description: 'Get the current trend library. Pass platform for one platform, omit for all trends across the active client’s platforms.',
        input_schema: {
          type: 'object',
          properties: { platform: { type: 'string', enum: platformIds } }
        }
      },
      {
        name: 'get_pipeline',
        description: 'Get the active client’s current pipeline: ideas, drafts and schedule with ids, titles, statuses and dates.',
        input_schema: { type: 'object', properties: {} }
      }
    ];
  }

  function normTime(t) {
    var m = String(t || '').match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    var h = parseInt(m[1], 10);
    if (h > 23 || parseInt(m[2], 10) > 59) return null;
    return (h < 10 ? '0' + h : '' + h) + ':' + m[2];
  }

  /* Execute one tool call locally. `note(text)` appends a ⚙ tool-note.
   * `client` is the client the exchange was started for — not necessarily
   * the currently active one. */
  function execTool(name, input, note, client) {
    if (!client) return 'Error: no active client selected.';
    input = input || {};
    try {
      if (name === 'add_idea') {
        var iid = CE.uid();
        var ititle = String(input.title || 'Untitled idea').trim();
        CE.store.set(function () {
          CE.store.data(client.id).ideas.push({
            id: iid, title: ititle, angle: String(input.angle || ''),
            hook: String(input.hook || ''), format: validFormat(input.format),
            platform: validPlatform(input.platform, client), status: 'idea',
            trendRef: null, notes: '', createdAt: Date.now(), updatedAt: Date.now()
          });
        }, { rerender: false });
        note(GEAR + ' Added idea "' + ititle + '"');
        return JSON.stringify({ ok: true, ideaId: iid });
      }

      if (name === 'save_brief') {
        var bid = CE.uid();
        var btopic = String(input.topic || 'Untitled brief').trim();
        var linkId = String(input.ideaId || '');
        CE.store.set(function () {
          var d = CE.store.data(client.id);
          var found = null;
          d.ideas.forEach(function (i) { if (i.id === linkId) found = i; });
          if (!found) {
            // missing or dangling ideaId → create a linked idea so the brief
            // is reachable in Research (mirrors schedule_post's fallback)
            linkId = CE.uid();
            d.ideas.push({
              id: linkId, title: btopic, angle: '', hook: '', format: 'short-video',
              platform: validPlatform(null, client), status: 'researched',
              trendRef: null, notes: '', createdAt: Date.now(), updatedAt: Date.now()
            });
          } else if (found.status === 'idea') {
            found.status = 'researched'; found.updatedAt = Date.now();
          }
          // one brief per idea: replace any existing brief for this idea
          d.briefs = d.briefs.filter(function (b) { return b.ideaId !== linkId; });
          d.briefs.push({
            id: bid, ideaId: linkId, topic: btopic,
            summary: String(input.summary || ''),
            keyPoints: strArr(input.keyPoints), hooks: strArr(input.hooks),
            keywords: strArr(input.keywords, 20), sources: [], competitors: [],
            createdAt: Date.now()
          });
        }, { rerender: false });
        note(GEAR + ' Saved research brief "' + btopic + '"');
        return JSON.stringify({ ok: true, briefId: bid, ideaId: linkId });
      }

      if (name === 'save_draft') {
        var did = CE.uid();
        var dplat = validPlatform(input.platform, client);
        CE.store.set(function () {
          var d = CE.store.data(client.id);
          d.drafts.push({
            id: did, ideaId: input.ideaId || null, platform: dplat,
            format: validFormat(input.format), hook: String(input.hook || ''),
            body: String(input.body || ''), hashtags: strArr(input.hashtags, 15),
            cta: String(input.cta || ''), visualNotes: String(input.visualNotes || ''),
            status: 'drafted', createdAt: Date.now()
          });
          d.ideas.forEach(function (i) {
            if (i.id === input.ideaId && (i.status === 'idea' || i.status === 'researched')) {
              i.status = 'drafted'; i.updatedAt = Date.now();
            }
          });
        }, { rerender: false });
        var p = CE.const.PLATFORMS[dplat];
        note(GEAR + ' Saved ' + (p ? p.label : dplat) + ' draft "' + firstSentence(String(input.hook || 'Untitled')) + '"');
        return JSON.stringify({ ok: true, draftId: did });
      }

      if (name === 'schedule_post') {
        var sdate = String(input.date || '');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(sdate)) return 'Error: date must be YYYY-MM-DD.';
        var stime = normTime(input.time);
        if (!stime) return 'Error: time must be HH:MM (24h).';
        var stitle = String(input.title || 'Untitled post').trim();
        var splat = validPlatform(input.platform, client);
        var sid = CE.uid();
        var refType = 'idea', refId = String(input.refId || '');
        CE.store.set(function () {
          var d = CE.store.data(client.id);
          var draft = null, idea = null, k;
          for (k = 0; k < d.drafts.length; k++) if (d.drafts[k].id === refId) draft = d.drafts[k];
          for (k = 0; k < d.ideas.length; k++) if (d.ideas[k].id === refId) idea = d.ideas[k];
          if (draft) {
            refType = 'draft';
            if (draft.status !== 'published') draft.status = 'scheduled';
            if (draft.ideaId) {
              for (k = 0; k < d.ideas.length; k++) {
                if (d.ideas[k].id === draft.ideaId && d.ideas[k].status !== 'published') {
                  d.ideas[k].status = 'scheduled'; d.ideas[k].updatedAt = Date.now();
                }
              }
            }
          } else if (idea) {
            refType = 'idea';
            if (idea.status !== 'published') {
              idea.status = 'scheduled'; idea.updatedAt = Date.now();
            }
          } else {
            // unmatched or missing refId → create a fresh idea to reference
            refType = 'idea';
            refId = CE.uid();
            d.ideas.push({
              id: refId, title: stitle, angle: '', hook: '', format: 'short-video',
              platform: splat, status: 'scheduled', trendRef: null, notes: '',
              createdAt: Date.now(), updatedAt: Date.now()
            });
          }
          d.schedule.push({
            id: sid, refType: refType, refId: refId, title: stitle,
            date: sdate, time: stime, platform: splat, status: 'scheduled'
          });
        }, { rerender: false });
        note(GEAR + ' Scheduled "' + stitle + '" for ' + CE.ui.fmtDate(sdate) + ' ' + stime);
        return JSON.stringify({ ok: true, scheduleId: sid, refType: refType, refId: refId });
      }

      if (name === 'get_trends') {
        var list = (input.platform && CE.trends.byPlatform[input.platform])
          ? CE.trends.byPlatform[input.platform]
          : CE.trends.forClient(client);
        return JSON.stringify(list.slice(0, 18).map(function (t) {
          return { id: t.id, name: t.name, type: t.type, momentum: t.momentum, platform: t.platform, desc: t.desc };
        }));
      }

      if (name === 'get_pipeline') {
        var d = CE.store.data(client.id);
        return JSON.stringify({
          ideas: d.ideas.map(function (i) {
            return { id: i.id, title: i.title, status: i.status, platform: i.platform, format: i.format };
          }),
          drafts: d.drafts.map(function (dr) {
            return { id: dr.id, ideaId: dr.ideaId, platform: dr.platform, format: dr.format, hook: String(dr.hook || '').slice(0, 90), status: dr.status };
          }),
          schedule: d.schedule.map(function (e) {
            return { id: e.id, title: e.title, date: e.date, time: e.time, platform: e.platform, status: e.status, refType: e.refType, refId: e.refId };
          })
        });
      }

      return 'Error: unknown tool "' + name + '".';
    } catch (e) {
      return 'Error: ' + (e && e.message || e);
    }
  }

  function apiMessagesFromThread(clientId) {
    var thread = CE.store.data(clientId).coachThread;
    var msgs = [];
    thread.forEach(function (m) {
      if (!m || !m.content || isToolNote(m.content)) return;
      var role = m.role === 'user' ? 'user' : 'assistant';
      if (msgs.length && msgs[msgs.length - 1].role === role) {
        msgs[msgs.length - 1].content += '\n\n' + String(m.content);
      } else {
        msgs.push({ role: role, content: String(m.content) });
      }
    });
    if (msgs.length > 24) msgs = msgs.slice(msgs.length - 24);
    while (msgs.length && msgs[0].role !== 'user') msgs.shift();
    return msgs;
  }

  function postMessages(body, key) {
    return fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(body)
    }).then(function (res) {
      if (!res.ok) {
        return res.text().then(function (t) {
          var err = new Error('API error ' + res.status);
          err.status = res.status;
          err.body = t;
          throw err;
        });
      }
      return res.json();
    });
  }

  function extractText(resp) {
    var out = '';
    ((resp && resp.content) || []).forEach(function (b) {
      if (b.type === 'text') out += b.text;
    });
    return out.trim();
  }

  function friendlyError(e) {
    var st = e && e.status;
    if (st === 401 || st === 403) {
      return 'The API rejected that key (HTTP ' + st + '). Double-check the API key in Clients & Settings — it should start with "sk-ant-".';
    }
    if (st === 429) {
      return 'Rate limited by the API (HTTP 429). Give it a moment, then try again.';
    }
    if (st === 400) {
      return 'The API rejected the request (HTTP 400). Check the model name in Clients & Settings, then try again.';
    }
    if (st) {
      return 'The API returned HTTP ' + st + '. Try again in a moment; if it persists, check your key and model in Clients & Settings.';
    }
    return 'Could not reach api.anthropic.com. Check your connection — and note the browser must be allowed to call api.anthropic.com directly (ad blockers and strict privacy extensions sometimes block it).';
  }

  /* Run the full connected exchange: POST, execute tool loop, resolve text.
   * `exClient` is the client the exchange was started for. */
  function runConnected(note, exClient) {
    var settings = CE.store.get().settings;
    var key = String(settings.apiKey || '').trim();
    var base = {
      model: settings.model || 'claude-sonnet-5',
      max_tokens: 8192,
      system: buildSystem(exClient),
      tools: buildTools()
    };
    var msgs = apiMessagesFromThread(exClient.id);
    var didWork = false;

    function turn(round) {
      var body = {
        model: base.model, max_tokens: base.max_tokens,
        system: base.system, messages: msgs, tools: base.tools
      };
      return postMessages(body, key).then(function (resp) {
        if (resp && resp.stop_reason === 'tool_use' && round < MAX_TOOL_ROUNDS) {
          var results = [];
          ((resp.content) || []).forEach(function (block) {
            if (block.type === 'tool_use') {
              var out = execTool(block.name, block.input || {}, note, exClient);
              didWork = true;
              results.push({ type: 'tool_result', tool_use_id: block.id, content: out });
            }
          });
          msgs.push({ role: 'assistant', content: resp.content });
          msgs.push({ role: 'user', content: results });
          return turn(round + 1);
        }
        var text = extractText(resp);
        if (resp && resp.stop_reason === 'max_tokens') {
          return (text ? text + '\n\n' : '') + '…(reply was cut off — try asking again)';
        }
        if (resp && resp.stop_reason === 'refusal') {
          return 'I can’t help with that request.';
        }
        if (text) return text;
        return didWork
          ? 'Done — check your pipeline for what I added.'
          : 'I didn’t produce a reply — try rephrasing.';
      });
    }
    return turn(0);
  }

  /* ── the shared chat panel ────────────────────────────────────────── */

  function goToSettings() {
    if (CE.closeCoach) CE.closeCoach();
    CE.navigate('clients');
  }

  function renderPanel(container, opts) {
    opts = opts || {};
    container.innerHTML = '';
    var client = CE.store.client();

    if (!client) {
      container.appendChild(el('div', { class: 'empty' },
        el('div', { class: 'empty-icon', text: '💬' }),
        el('h3', { text: 'No client selected' }),
        el('p', { class: 'muted', text: 'Coach works per client — add one to start strategizing.' }),
        el('button', { class: 'btn btn-primary', text: 'Add your first client', onclick: function () { CE.openAddClient(); } })));
      return;
    }

    var thread = CE.store.data(client.id).coachThread;

    var wrap = el('div', {
      style: { display: 'flex', flexDirection: 'column', flex: '1', minHeight: '0', height: '100%' }
    });
    container.appendChild(wrap);

    /* header strip: connection status + clear */
    var statusBits;
    if (connected()) {
      statusBits = el('span', { class: 'small', style: { display: 'inline-flex', alignItems: 'center', gap: '7px' } },
        statusDot(true),
        el('span', { text: 'Claude · ' + modelName() }));
    } else {
      statusBits = el('span', { class: 'small muted', style: { display: 'inline-flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' } },
        statusDot(false),
        el('span', {}, 'Offline coach · ',
          el('a', {
            href: '#/clients',
            style: { color: 'var(--accent, #3987e5)', textDecoration: 'underline', cursor: 'pointer' },
            text: 'connect an API key in Clients & Settings',
            onclick: function (e) { e.preventDefault(); goToSettings(); }
          }),
          ' for full AI'));
    }
    var clearBtn = el('button', {
      class: 'btn btn-ghost btn-sm', text: 'Clear',
      title: 'Clear this conversation',
      onclick: function () {
        if (busy) return;
        CE.ui.confirm('Clear this coach conversation? The messages can’t be recovered.', 'Clear it')
          .then(function (ok) {
            if (!ok) return;
            CE.store.set(function () {
              var d = CE.store.data(client.id);
              d.coachThread = [];
            }, { rerender: false });
            renderPanel(container, {});
          });
      }
    });
    wrap.appendChild(el('div', {
      class: 'row',
      style: { alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid var(--border)', marginBottom: '10px', flex: '0 0 auto' }
    }, statusBits, el('div', { class: 'spacer' }), clearBtn));

    /* scroll area */
    var scroll = el('div', { class: 'chat-scroll' });
    wrap.appendChild(scroll);

    function autoscroll() {
      requestAnimationFrame(function () { scroll.scrollTop = scroll.scrollHeight; });
    }

    thread.forEach(function (m) { scroll.appendChild(msgNode(m)); });

    /* empty-thread welcome + suggested prompt chips */
    var chipsEl = null;
    if (!thread.length) {
      scroll.appendChild(el('div', {
        class: 'chat-msg assistant',
        text: 'Hey — I’m Coach. I know ' + client.name + '’s profile, pipeline and what’s trending on their platforms. Ask me to plan, brainstorm, research, write or schedule.'
      }));
      chipsEl = el('div', { class: 'row wrap', style: { gap: '8px', padding: '2px 0 8px' } });
      SUGGESTED_PROMPTS.forEach(function (p) {
        chipsEl.appendChild(el('button', {
          class: 'tag', type: 'button', text: p,
          style: { cursor: 'pointer' },
          onclick: function () { send(p); }
        }));
      });
      scroll.appendChild(chipsEl);
    }

    /* input row */
    var ta = el('textarea', {
      class: 'textarea', rows: '1',
      placeholder: 'Ask Coach anything… (Enter to send, Shift+Enter for a new line)',
      onkeydown: function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          send(ta.value);
        }
      }
    });
    var sendBtn = el('button', {
      class: 'btn btn-primary', text: 'Send',
      onclick: function () { send(ta.value); }
    });
    wrap.appendChild(el('div', { class: 'chat-input-row', style: { flex: '0 0 auto' } }, ta, sendBtn));

    if (opts.prefill) {
      ta.value = opts.prefill;
      requestAnimationFrame(function () {
        ta.focus();
        try { ta.setSelectionRange(ta.value.length, ta.value.length); } catch (e) { /* noop */ }
      });
    }
    autoscroll();

    function appendMsg(m) {
      scroll.appendChild(msgNode(m));
      autoscroll();
    }

    function send(text) {
      text = String(text || '').trim();
      if (!text || busy) return;
      if (chipsEl) { chipsEl.remove(); chipsEl = null; }

      // the exchange belongs to this panel's client, even if the user
      // switches the active client while the request is in flight
      var exId = client.id;

      function sameClientActive() {
        var active = CE.store.client();
        return !active || active.id === exId;
      }

      var userMsg = { role: 'user', content: text, ts: Date.now() };
      pushToThread(userMsg, exId);
      appendMsg(userMsg);
      ta.value = '';

      busy = true;
      sendBtn.disabled = true;
      clearBtn.disabled = true;
      var typing = typingNode();
      scroll.appendChild(typing);
      autoscroll();

      function finish(replyText) {
        typing.remove();
        var msg = { role: 'assistant', content: replyText, ts: Date.now() };
        pushToThread(msg, exId);
        if (sameClientActive()) appendMsg(msg);
        busy = false;
        sendBtn.disabled = false;
        clearBtn.disabled = false;
        ta.focus();
      }

      if (connected()) {
        var note = function (txt) {
          var nmsg = { role: 'assistant', content: txt, ts: Date.now() };
          pushToThread(nmsg, exId);
          if (sameClientActive()) {
            scroll.insertBefore(msgNode(nmsg), typing);
            autoscroll();
          }
        };
        runConnected(note, client)
          .then(function (text) { finish(text); })
          .catch(function (e) {
            console.warn('CE coach API error', e);
            finish('⚠️ ' + friendlyError(e));
          });
      } else {
        setTimeout(function () {
          finish(offlineReply(text, client, CE.store.data(exId)));
        }, 480 + Math.floor(Math.random() * 420));
      }
    }
  }

  /* ── full view ────────────────────────────────────────────────────── */

  var COACH_CAPABILITIES = [
    'Plan a week (or month) of content around live trends',
    'Generate hooks, angles and idea lists tuned to the client’s niche',
    'Build research briefs — key points, hooks and keywords',
    'Write platform-native drafts in the client’s voice',
    'Schedule posts straight onto the Plan calendar',
    'Audit the pipeline and tell you exactly what to do next'
  ];

  function render(container, ctx) {
    var client = CE.store.client();

    container.appendChild(el('div', { class: 'view-head' },
      el('div', {},
        el('h1', { text: 'Coach' }),
        el('div', {
          class: 'sub',
          text: client
            ? 'Your AI strategist — briefed on ' + client.name + '’s profile, pipeline and live trends.'
            : 'Your AI content strategist.'
        })),
      el('div', { class: 'spacer' })));

    if (!client) {
      container.appendChild(el('div', { class: 'empty' },
        el('div', { class: 'empty-icon', text: '💬' }),
        el('h3', { text: 'Add a client to start coaching' }),
        el('p', { class: 'muted', text: 'Coach plans, researches, writes and schedules — but it needs a client profile to work from.' }),
        el('button', { class: 'btn btn-primary', text: 'Add your first client', onclick: function () { CE.openAddClient(); } })));
      return;
    }

    var grid = el('div', { class: 'grid split' });
    container.appendChild(grid);

    /* left: the chat panel */
    var left = el('div', {
      class: 'card pad-lg',
      style: { height: '65vh', minHeight: '420px', display: 'flex', flexDirection: 'column' }
    });
    grid.appendChild(left);
    var prefill = (ctx && ctx.params && ctx.params.get('q')) || '';
    renderPanel(left, { prefill: prefill });

    /* right column */
    var right = el('div', { class: 'stack', style: { display: 'flex', flexDirection: 'column', gap: '16px' } });
    grid.appendChild(right);

    var on = connected();
    right.appendChild(el('div', { class: 'card', style: { padding: '16px' } },
      el('div', { class: 'card-title', text: 'Connection' }),
      el('div', { class: 'row', style: { alignItems: 'center', gap: '8px', margin: '8px 0' } },
        statusDot(on),
        el('span', { text: on ? 'Claude · ' + modelName() : 'Offline coach' })),
      el('p', {
        class: 'muted small',
        text: on
          ? 'Live AI is on. Coach can reason over your pipeline and use tools to add ideas, briefs, drafts and scheduled posts for you. Your key stays in this browser’s local storage.'
          : 'Running on the built-in offline coach: instant answers from your client profile, pipeline and the trend library. Add an Anthropic API key for live reasoning and hands-on tool use.'
      }),
      el('button', {
        class: 'btn btn-sm' + (on ? ' btn-ghost' : ' btn-primary'),
        text: on ? 'Manage in Clients & Settings' : 'Connect an API key',
        onclick: function () { CE.navigate('clients'); }
      })));

    var ul = el('ul', { style: { margin: '8px 0 0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' } });
    COACH_CAPABILITIES.forEach(function (c) {
      ul.appendChild(el('li', { class: 'muted small', text: c }));
    });
    right.appendChild(el('div', { class: 'card', style: { padding: '16px' } },
      el('div', { class: 'card-title', text: 'What Coach can do' }),
      ul,
      el('p', {
        class: 'hint', style: { marginTop: '10px' },
        text: on
          ? 'Connected mode does the work for real: everything it creates lands in Research, Create and Plan instantly.'
          : 'With an API key connected, Coach doesn’t just advise — it adds the ideas, briefs, drafts and schedule items itself.'
      })));

    var chipRow = el('div', { class: 'row wrap', style: { gap: '8px', marginTop: '8px' } });
    SUGGESTED_PROMPTS.forEach(function (p) {
      chipRow.appendChild(el('button', {
        class: 'tag', type: 'button', text: p, style: { cursor: 'pointer' },
        onclick: function () {
          var t = left.querySelector('textarea');
          if (t) {
            t.value = p;
            t.focus();
            try { t.setSelectionRange(t.value.length, t.value.length); } catch (e) { /* noop */ }
          }
        }
      }));
    });
    right.appendChild(el('div', { class: 'card', style: { padding: '16px' } },
      el('div', { class: 'card-title', text: 'Try asking' }),
      chipRow));
  }

  /* ── register ─────────────────────────────────────────────────────── */

  CE.coach = {
    renderPanel: renderPanel,
    connected: connected
  };

  CE.views.coach = {
    id: 'coach',
    title: 'Coach',
    icon: 'chat',
    render: render
  };
})();
