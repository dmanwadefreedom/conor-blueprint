/* Content Engine — views/create.js
 * Content studio: turn ideas/briefs into platform-native drafts.
 * Composer state lives in module-level closure (keyed per client id) so it
 * survives full re-renders triggered by CE.store.set().
 */
(function () {
  'use strict';
  var CE = window.CE;
  var el = CE.ui.el;

  /* ── platform character limits (body counter) ─────────────────────── */
  var LIMITS = {
    x: 280, instagram: 2200, linkedin: 3000, tiktok: 2200,
    youtube: 5000, facebook: 63206, pinterest: 500
  };
  var LIMIT_NOTES = { x: 'first tweet', youtube: 'description' };

  var HASHTAG_COUNTS = {
    linkedin: [3, 5], instagram: [8, 12], tiktok: [4, 6], x: [1, 2],
    youtube: [3, 5], facebook: [3, 6], pinterest: [5, 8]
  };

  var PLATFORM_TAGS = {
    instagram: ['reels', 'instagood', 'creatorlife', 'explorepage'],
    tiktok: ['fyp', 'learnontiktok', 'tiktokmademelearn'],
    youtube: ['youtube', 'tutorial', 'howto'],
    linkedin: ['leadership', 'b2b', 'careers', 'business'],
    x: ['buildinpublic', 'marketing'],
    facebook: ['smallbusiness', 'community', 'tips'],
    pinterest: ['ideas', 'inspiration', 'diy', 'guide']
  };

  var FORMAT_VISUALS = {
    'short-video': 'Talking head with bold caption overlay on the hook line; jump cuts every 3–5s, punch-in on key phrases.',
    'long-video': 'Thumbnail: face + 3–4 word bold text. B-roll change at every chapter; lower-third for each numbered point.',
    'carousel': 'Bold title slide with the hook, high-contrast text, one idea per slide, consistent template and brand colors.',
    'image': 'Single strong visual with the hook as a text overlay; keep 30% negative space for readability.',
    'text-post': 'No visual — the first line does the work. Use whitespace rhythm: 1–2 sentence paragraphs.',
    'story': 'Vertical, candid, shot on phone. Add a poll or question sticker on frame 2 to drive taps.',
    'article': 'Header image + 2 pull-quote graphics from the strongest lines for reshares.',
    'live': 'Simple agenda slide pinned on screen; pin a comment with the offer/CTA during the stream.'
  };

  /* ── view-local composer state, keyed per client id ───────────────── */
  var stateByClient = {};
  var consumedParams = {}; // "clientId:kind:id" → true (apply URL params only once)

  function blankComp(client) {
    return {
      ideaId: '',
      platform: (client && client.platforms && client.platforms[0]) || 'instagram',
      format: 'short-video',
      hook: '', body: '', hashtags: '', cta: '', visualNotes: '',
      editingId: null
    };
  }

  function compFor(client) {
    var id = client ? client.id : '__none';
    if (!stateByClient[id]) stateByClient[id] = blankComp(client);
    return stateByClient[id];
  }

  /* ── small helpers ────────────────────────────────────────────────── */
  function pick(arr) {
    if (!arr || !arr.length) return null;
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pickN(arr, n) {
    var copy = (arr || []).slice(), out = [];
    while (copy.length && out.length < n) {
      out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return out;
  }

  function randInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function slugTag(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 28);
  }

  function nicheTerms(client) {
    var raw = (client && client.niche) || '';
    var parts = raw.split(/[,;\/]| and /i).map(function (t) { return t.replace(/^\s+|\s+$/g, ''); })
      .filter(function (t) { return t.length > 1; });
    return parts.length ? parts : ['content strategy', 'audience growth', 'brand building'];
  }

  function audienceWord(client) {
    var a = (client && client.audience) || '';
    a = a.split(/[,.]/)[0].replace(/^\s+|\s+$/g, '');
    return a || 'your audience';
  }

  function firstSentence(s) {
    s = String(s || '');
    var m = s.match(/^[^.!?]*[.!?]/);
    return m ? m[0] : s;
  }

  function normalizeTags(str) {
    return String(str || '').split(/[\s,]+/)
      .map(function (t) { return t.replace(/^#+/, '').replace(/^\s+|\s+$/g, ''); })
      .filter(function (t, i, a) { return t && a.indexOf(t) === i; });
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

  function isoOffset(days) {
    var d = new Date();
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  /* ── generation engine (fully local, no network) ──────────────────── */
  function softLower(s) {
    // lowercase the first char only when the word isn't an acronym/proper style (e.g. keep "SaaS")
    s = String(s || '');
    if (s.length > 1 && s.charAt(1) === s.charAt(1).toLowerCase()) return s.charAt(0).toLowerCase() + s.slice(1);
    return s;
  }

  /* Fill a hook pattern's ___ blanks using the words around each blank,
   * so "$___", "under ___ minutes", "Watch me ___" all read naturally. */
  function fillHookPattern(pattern, o) {
    var topics = o.terms.slice();
    var t = pick(topics);
    var verbs = [
      'fix your ' + softLower(t),
      'turn one idea into a week of content',
      'write hooks that actually hold attention',
      'build a ' + softLower(pick(topics)) + ' system'
    ];
    var parts = pattern.split('___');
    var res = parts[0];
    for (var i = 1; i < parts.length; i++) {
      var before = res, after = parts[i];
      var prevM = before.match(/([\w’']+)[^\w’'$]*$/);
      var nextM = after.match(/^[^\w]*([\w’']+)/);
      var prev = (prevM ? prevM[1] : '').toLowerCase();
      var next = (nextM ? nextM[1] : '').toLowerCase();
      var fill;
      if (/\$\s*$/.test(before)) fill = pick(['5,000', '12,000', '25,000']);
      else if (/^(minutes?|days?|weeks?|months?|hours?)$/.test(next)) fill = pick(['10', '20', '30', '90']);
      else if (next === 'asked') fill = pick(['A client', 'A founder', 'Someone in my DMs']);
      else if (/costing you\s*$/i.test(before)) fill = pick(['leads', '30% of your pipeline', 'real money']);
      else if (prev === 'says') fill = pick(['post daily', 'go viral first', 'batch a month ahead']);
      else if (prev === 'opinion') fill = pick(['your ' + softLower(t) + ' isn’t the problem — your message is', softLower(t) + ' is a distribution game, not a creativity game']);
      else if (prev === 'exact') fill = pick(['5-question brief', '3-step checklist', 'weekly scoring sheet']);
      else if (/asked me\s*$/i.test(before)) fill = pick(['if ' + softLower(t) + ' still works', 'how to fix their ' + softLower(pick(topics)), 'whether they should post daily']);
      else if (prev === 'me' || prev === 'you' || prev === 'i' || prev === 'to') fill = pick(verbs);
      else if (prev === 'doing') fill = pick(['batching a month of posts', 'chasing every trend', softLower(t) + ' by gut feel']);
      else if (prev === 'before') fill = pick(['hiring help', 'raising prices', 'going all-in on ' + softLower(pick(topics))]);
      else if (prev === 'without') fill = pick(['posting daily', 'paid ads', 'a big team', 'burning out']);
      else if (prev === 'want') fill = pick(['more inbound leads', 'consistent growth', 'a full pipeline']);
      else if (prev === 'not') fill = pick(['inconsistent', 'out of ideas', 'behind']);
      else if (prev === 'you’re' || prev === "you're") fill = pick(['staring at a blank content calendar', 'posting into the void', 'juggling ' + softLower(pick(topics)) + ' alone']);
      else if (prev === 'and') fill = pick(['the calendar is empty again', 'it’s 4:58pm on Friday', 'nothing is scheduled for Monday']);
      else {
        fill = pick(topics);
        if (before.replace(/\s+$/, '').length && !/[.!?]\s*$/.test(before)) fill = softLower(fill);
        else fill = fill.charAt(0).toUpperCase() + fill.slice(1);
      }
      res += fill + parts[i];
    }
    return res;
  }

  function buildHook(idea, client, trend) {
    if (idea && idea.hook) return idea.hook;
    var patterns = (CE.trends && CE.trends.hookPatterns) || [];
    var p = pick(patterns);
    var o = { terms: nicheTerms(client).concat(trend ? [trend.name] : []) };
    if (!p) return 'The fastest way to fix your ' + softLower(pick(o.terms)) + ' this quarter.';
    return fillHookPattern(p.pattern, o);
  }

  function buildHashtags(client, platform, trend) {
    var range = HASHTAG_COUNTS[platform] || [5, 8];
    var count = randInt(range[0], range[1]);
    var pool = [];
    nicheTerms(client).forEach(function (t) {
      var s = slugTag(t);
      if (s) pool.push(s);
      // also split multiword niche phrases into single-word tags
      t.split(/\s+/).forEach(function (w) {
        var ws = slugTag(w);
        if (ws && ws.length > 3) pool.push(ws);
      });
    });
    if (trend && trend.tags) trend.tags.forEach(function (t) { var s = slugTag(t); if (s) pool.push(s); });
    (PLATFORM_TAGS[platform] || []).forEach(function (t) { pool.push(t); });
    if (client && client.industry) pool.push(slugTag(client.industry));
    pool = pool.filter(function (t, i, a) { return t && a.indexOf(t) === i; });
    return pickN(pool, count);
  }

  function buildCTA(client, platform) {
    var goals = ((client && client.goals) || '').toLowerCase();
    var options = [];
    if (/call|book|discovery|lead|client|pipeline|sale/.test(goals)) {
      options.push('Book a discovery call — link in profile.',
        'DM me "CALL" and I’ll send over times this week.',
        'Ready to fix this? Grab a slot on my calendar (link in bio).');
    }
    if (/grow|audience|follow|brand|reach/.test(goals)) {
      options.push('Follow for more like this — I post the playbook weekly.',
        'Follow so the next one lands in your feed.');
    }
    if (/comment|engage|community|launch|engine/.test(goals)) {
      options.push('Comment "SYSTEM" and I’ll send you the template.',
        'Drop a comment with your biggest blocker — I read every one.');
    }
    if (/link|bio|newsletter|download|sell/.test(goals)) {
      options.push('Full breakdown at the link in bio.',
        'Grab the free guide — link in bio.');
    }
    if (!options.length) {
      options = ['Save this for your next planning session.',
        'Follow for more — new post every week.',
        'Share this with someone who needs it.'];
    }
    if (platform === 'x') options.push('Repost the first tweet to save someone a bad quarter.');
    return pick(options);
  }

  function buildVisualNotes(trend, format) {
    if (trend) {
      var base = firstSentence(trend.howToUse || trend.desc);
      if (base) return 'Lean into "' + trend.name + '": ' + base;
    }
    return FORMAT_VISUALS[format] || FORMAT_VISUALS['text-post'];
  }

  function makePoints(n, o) {
    var pts = [];
    if (o.brief && o.brief.keyPoints && o.brief.keyPoints.length) {
      pts = pickN(o.brief.keyPoints, Math.min(n, o.brief.keyPoints.length));
    }
    var t = pick(o.terms), aud = o.aud;
    var fillers = [
      'Audit what you already have — most of your best ' + t + ' material is sitting unused',
      'Pick one channel and go deep before you go wide',
      'Turn every client win into proof: numbers, screenshots, before/after',
      'Nail the first 3 seconds — the hook decides whether anything else matters',
      'Batch creation, but publish in response to what’s actually working',
      'Talk to ' + aud + ' in their words, not your industry’s',
      'Measure replies, saves and DMs — not likes',
      'Repurpose one core piece into five platform-native cuts',
      'Show the process, not just the polished result',
      'Make one clear promise per post and pay it off fast'
    ];
    while (pts.length < n && fillers.length) {
      pts.push(fillers.splice(Math.floor(Math.random() * fillers.length), 1)[0]);
    }
    return pts.slice(0, n);
  }

  function contextLines(o) {
    var lines = [];
    if (o.idea && o.idea.angle) lines.push(o.idea.angle + '.');
    if (o.brief && o.brief.summary) lines.push(firstSentence(o.brief.summary));
    var voiceLine = o.client && o.client.voice
      ? 'No fluff, just what’s working with ' + o.aud + ' right now.'
      : 'Here’s what’s actually working with ' + o.aud + ' right now.';
    lines.push(pick([
      'I keep seeing the same pattern with ' + o.aud + ': effort everywhere, results nowhere.',
      voiceLine,
      'Most advice on ' + pick(o.terms) + ' skips the part that actually moves the needle.'
    ]));
    return pickN(lines, Math.min(lines.length, randInt(2, 3)));
  }

  function genLinkedIn(o) {
    var n = randInt(3, 5);
    var pts = makePoints(n, o);
    var parts = [o.hook, ''];
    contextLines(o).forEach(function (l) { parts.push(l, ''); });
    parts.push('Here’s the system:');
    pts.forEach(function (p, i) { parts.push((i + 1) + '. ' + p); });
    parts.push('', pick([
      'The takeaway: consistency beats intensity — every single quarter.',
      'The takeaway: ' + pick(o.terms) + ' compounds when you treat it like a system, not a task.',
      'One thing to remember: nobody buys from the brand they can’t remember.'
    ]));
    return parts.join('\n');
  }

  function genCarousel(o) {
    var slides = randInt(6, 8);
    var pts = makePoints(slides - 2, o);
    var out = ['Slide 1: ' + o.hook];
    pts.forEach(function (p, i) { out.push('Slide ' + (i + 2) + ': ' + p); });
    out.push('Slide ' + slides + ': ' + o.cta);
    out.push('', '———', '');
    out.push('Caption: ' + firstSentence(o.idea && o.idea.angle ? o.idea.angle + '.' : 'Save this — you’ll want it next planning session.') +
      ' Swipe through, then tell me in the comments which slide hit hardest. ' +
      'Built for ' + o.aud + ' who are done guessing at ' + pick(o.terms) + '.');
    return out.join('\n');
  }

  function genScript(o) {
    var beats = makePoints(3, o);
    var visual = o.trend
      ? firstSentence(o.trend.howToUse || o.trend.desc)
      : pick(['handheld walking shot', 'clean desk setup, soft key light', 'screen-record with cursor highlights', 'quick outfit/location change on the beat']);
    var broll = o.trend && o.trend.tags && o.trend.tags.length
      ? 'b-roll: ' + o.trend.tags.slice(0, 3).join(', ')
      : 'b-roll: hands-on-keyboard, notebook sketch, phone screen';
    return [
      '[0-3s HOOK]',
      'On-screen text: "' + o.hook + '"',
      'Spoken: ' + o.hook,
      'Visual: direct to camera, tight crop, ' + visual,
      '',
      '[3-15s SETUP]',
      'Spoken: ' + (o.idea && o.idea.angle ? o.idea.angle + '.' : 'Most ' + o.aud + ' get this wrong — and it’s not their fault.') +
        ' Stay to the end — the third one changes everything.',
      'Visual: cut wider, ' + broll,
      '',
      '[15-40s VALUE]',
      'Beat 1: ' + beats[0] + ' (visual: text overlay #1, punch-in)',
      'Beat 2: ' + beats[1] + ' (visual: ' + broll + ')',
      'Beat 3: ' + beats[2] + ' (visual: text overlay #3, slow zoom)',
      '',
      '[40-55s PAYOFF]',
      'Spoken: Do these three and ' + pick(o.terms) + ' stops being a guessing game. ' +
        'This is exactly what we run with clients — nothing here is theory.',
      'Visual: back to talking head, warm smile, results screenshot if available',
      '',
      '[55-60s CTA]',
      'Spoken: ' + o.cta,
      'On-screen text: "' + o.cta + '"'
    ].join('\n');
  }

  function genYouTube(o) {
    var t = pick(o.terms);
    var pts = makePoints(3, o);
    var base = (o.idea && o.idea.title) || o.hook;
    return [
      'TITLE OPTIONS',
      '1. ' + base,
      '2. The ' + t + ' system nobody shows you (full walkthrough)',
      '3. How ' + o.aud + ' can fix ' + t + ' in 30 days',
      '',
      'THUMBNAIL TEXT: "' + pick(['IT’S NOT WORKING', 'STEAL THIS SYSTEM', 'DO THIS FIRST', '30-DAY FIX']) + '"',
      '',
      'OUTLINE',
      '00:00 Hook — ' + o.hook,
      '        Open on the payoff, then rewind. Promise the exact system by the end.',
      '00:45 Setup — ' + (o.idea && o.idea.angle ? o.idea.angle + '.' : 'Why the usual advice fails ' + o.aud + '.'),
      '        Name the mistake everyone makes and what it costs.',
      'Chapter 1 — ' + pts[0],
      '        Show it on screen; one concrete example, one number.',
      'Chapter 2 — ' + pts[1],
      '        Contrast a before/after; keep it under 4 minutes.',
      'Chapter 3 — ' + pts[2],
      '        The advanced move — this is the retention spike, tease it early.',
      'Recap — the 3 steps in 30 seconds, on a single slide.',
      'CTA — ' + o.cta + ' Then point to the related video on screen.'
    ].join('\n');
  }

  function genThread(o) {
    var n = randInt(5, 8);
    var pts = makePoints(n - 2, o);
    var hook = o.hook.length > 270 ? o.hook.slice(0, 267) + '…' : o.hook;
    var out = ['1/ ' + hook + '\n\nA thread 🧵'];
    pts.forEach(function (p, i) { out.push((i + 2) + '/ ' + p + '.'); });
    out.push(n + '/ ' + o.cta + '\n\nFollow for more on ' + pick(o.terms) + ' — I break one system down every week.');
    return out.join('\n\n');
  }

  function genDefault(o) {
    var pts = makePoints(3, o);
    var short = o.platform === 'pinterest';
    var parts = [o.hook, ''];
    if (!short) { parts.push(contextLines(o)[0], ''); }
    pts.forEach(function (p) { parts.push('• ' + p); });
    parts.push('', short ? o.cta : pick([
      'The pattern is simple. The discipline is the hard part.',
      'Start with one. Momentum does the rest.'
    ]));
    return parts.join('\n');
  }

  function generate(comp, client, data) {
    var idea = null;
    if (comp.ideaId) {
      idea = data.ideas.filter(function (i) { return i.id === comp.ideaId; })[0] || null;
    }
    var brief = idea ? (data.briefs.filter(function (b) { return b.ideaId === idea.id; })[0] || null) : null;
    var trend = (idea && idea.trendRef && CE.trends && CE.trends.get) ? CE.trends.get(idea.trendRef) : null;
    var o = {
      idea: idea, brief: brief, trend: trend, client: client,
      platform: comp.platform, format: comp.format,
      terms: nicheTerms(client), aud: audienceWord(client)
    };
    o.hook = buildHook(idea, client, trend);
    o.cta = buildCTA(client, comp.platform);

    var body;
    if (comp.format === 'short-video' || comp.platform === 'tiktok') body = genScript(o);
    else if (comp.format === 'carousel') body = genCarousel(o);
    else if (comp.platform === 'youtube' || comp.format === 'long-video') body = genYouTube(o);
    else if (comp.platform === 'x') body = genThread(o);
    else if (comp.platform === 'linkedin') body = genLinkedIn(o);
    else body = genDefault(o);

    comp.hook = o.hook;
    comp.body = body;
    comp.hashtags = buildHashtags(client, comp.platform, trend).join(' ');
    comp.cta = o.cta;
    comp.visualNotes = buildVisualNotes(trend, comp.format);
  }

  /* ── draft persistence ─────────────────────────────────────────────── */
  function saveDraft(comp, client) {
    var savedId = null;
    CE.store.set(function (s) {
      var d = s.data[client.id];
      if (!d) return;
      var hashtags = normalizeTags(comp.hashtags);
      var existing = comp.editingId
        ? d.drafts.filter(function (x) { return x.id === comp.editingId; })[0]
        : null;
      if (existing) {
        existing.ideaId = comp.ideaId || existing.ideaId || null;
        existing.platform = comp.platform;
        existing.format = comp.format;
        existing.hook = comp.hook;
        existing.body = comp.body;
        existing.hashtags = hashtags;
        existing.cta = comp.cta;
        existing.visualNotes = comp.visualNotes;
        if (CE.const.STATUSES.indexOf(existing.status) < CE.const.STATUSES.indexOf('drafted')) {
          existing.status = 'drafted';
        }
        savedId = existing.id;
      } else {
        var draft = {
          id: CE.uid(), ideaId: comp.ideaId || null,
          platform: comp.platform, format: comp.format,
          hook: comp.hook, body: comp.body, hashtags: hashtags,
          cta: comp.cta, visualNotes: comp.visualNotes,
          status: 'drafted', createdAt: Date.now()
        };
        d.drafts.unshift(draft);
        savedId = draft.id;
      }
      if (comp.ideaId) {
        var idea = d.ideas.filter(function (i) { return i.id === comp.ideaId; })[0];
        if (idea && (idea.status === 'idea' || idea.status === 'researched')) {
          idea.status = 'drafted';
          idea.updatedAt = Date.now();
        }
      }
    });
    comp.editingId = savedId;
    CE.ui.toast('Draft saved', 'good');
  }

  function assembled(comp) {
    var tags = normalizeTags(comp.hashtags).map(function (t) { return '#' + t; }).join(' ');
    var parts = [];
    if (comp.hook && comp.body.indexOf(comp.hook) !== 0) parts.push(comp.hook);
    if (comp.body) parts.push(comp.body);
    if (comp.cta && comp.body.indexOf(comp.cta) < 0) parts.push(comp.cta);
    if (tags) parts.push(tags);
    return parts.join('\n\n');
  }

  function loadDraftIntoComposer(comp, draft) {
    comp.editingId = draft.id;
    comp.ideaId = draft.ideaId || '';
    comp.platform = draft.platform || comp.platform;
    comp.format = draft.format || comp.format;
    comp.hook = draft.hook || '';
    comp.body = draft.body || '';
    comp.hashtags = (draft.hashtags || []).join(' ');
    comp.cta = draft.cta || '';
    comp.visualNotes = draft.visualNotes || '';
  }

  /* ── schedule modal ────────────────────────────────────────────────── */
  function openScheduleModal(draft, client) {
    var p = CE.const.PLATFORMS[draft.platform];
    var times = (p && p.bestTimes) || ['09:00'];
    var dateInput = el('input', { class: 'input', type: 'date', value: isoOffset(1) });
    var timeSel = el('select', { class: 'select' });
    times.forEach(function (t, i) {
      var o = el('option', { value: t, text: t + (i === 0 ? '  (best time)' : '  (good time)') });
      timeSel.appendChild(o);
    });
    timeSel.appendChild(el('option', { value: '__custom', text: 'Custom time…' }));
    var customTime = el('input', { class: 'input', type: 'time', value: '09:00', style: { display: 'none', marginTop: '8px' } });
    timeSel.addEventListener('change', function () {
      customTime.style.display = timeSel.value === '__custom' ? '' : 'none';
    });

    var body = el('div', {},
      el('p', { class: 'muted small', text: 'Scheduling for ' + ((p && p.label) || draft.platform) + (p ? ' · ' + p.cadence : '') }),
      el('div', { class: 'field' }, el('label', { text: 'Date' }), dateInput),
      el('div', { class: 'field' }, el('label', { text: 'Time' }), timeSel, customTime,
        el('span', { class: 'hint', text: 'Suggested times come from platform engagement norms.' })));

    CE.ui.modal({
      title: 'Schedule draft',
      body: body,
      actions: [
        { label: 'Cancel' },
        {
          label: 'Schedule', class: 'btn-primary',
          onClick: function () {
            var date = dateInput.value || isoOffset(1);
            var time = timeSel.value === '__custom' ? (customTime.value || '09:00') : (timeSel.value || times[0] || '09:00');
            CE.store.set(function (s) {
              var d = s.data[client.id];
              if (!d) return;
              d.schedule.push({
                id: CE.uid(), refType: 'draft', refId: draft.id,
                title: (draft.hook || 'Untitled draft').slice(0, 60),
                date: date, time: time, platform: draft.platform, status: 'scheduled'
              });
              var dr = d.drafts.filter(function (x) { return x.id === draft.id; })[0];
              if (dr) dr.status = 'scheduled';
              if (draft.ideaId) {
                var idea = d.ideas.filter(function (i) { return i.id === draft.ideaId; })[0];
                if (idea && idea.status !== 'published') { idea.status = 'scheduled'; idea.updatedAt = Date.now(); }
              }
            });
            CE.ui.toast('Scheduled for ' + CE.ui.fmtDate(date) + ' at ' + time, 'good');
            CE.ui.modal({
              title: 'On the calendar',
              body: el('p', { class: 'muted', text: '"' + (draft.hook || 'Untitled').slice(0, 60) + '" is scheduled for ' + CE.ui.fmtDate(date) + ' at ' + time + '. Want to see it in the plan?' }),
              actions: [
                { label: 'Stay here' },
                { label: 'Open Plan', class: 'btn-primary', onClick: function () { CE.navigate('plan'); } }
              ]
            });
          }
        }
      ]
    });
  }

  function deleteDraft(draft, client, comp) {
    CE.ui.confirm('Delete this draft? Any scheduled slots for it will also be removed.', 'Delete draft')
      .then(function (ok) {
        if (!ok) return;
        if (comp.editingId === draft.id) comp.editingId = null;
        CE.store.set(function (s) {
          var d = s.data[client.id];
          if (!d) return;
          d.drafts = d.drafts.filter(function (x) { return x.id !== draft.id; });
          d.schedule = d.schedule.filter(function (e) { return !(e.refType === 'draft' && e.refId === draft.id); });
        });
        CE.ui.toast('Draft deleted', '');
      });
  }

  function duplicateDraft(draft, client) {
    CE.store.set(function (s) {
      var d = s.data[client.id];
      if (!d) return;
      d.drafts.unshift({
        id: CE.uid(), ideaId: draft.ideaId || null,
        platform: draft.platform, format: draft.format,
        hook: (draft.hook || '') + ' (copy)', body: draft.body,
        hashtags: (draft.hashtags || []).slice(), cta: draft.cta,
        visualNotes: draft.visualNotes, status: 'drafted', createdAt: Date.now()
      });
    });
    CE.ui.toast('Draft duplicated', 'good');
  }

  /* ── composer UI ───────────────────────────────────────────────────── */
  function fieldWrap(label, node, hint) {
    return el('div', { class: 'field' }, el('label', { text: label }), node,
      hint ? el('span', { class: 'hint', text: hint }) : null);
  }

  function orderedPlatforms(client) {
    var mine = (client && client.platforms) ? client.platforms.filter(function (p) { return !!CE.const.PLATFORMS[p]; }) : [];
    var rest = Object.keys(CE.const.PLATFORMS).filter(function (p) { return mine.indexOf(p) < 0; });
    return { mine: mine, rest: rest };
  }

  function counterText(len, platform) {
    var lim = LIMITS[platform];
    if (!lim) return len + ' chars';
    var note = LIMIT_NOTES[platform] ? ' (' + LIMIT_NOTES[platform] + ')' : '';
    return len + ' chars · limit ' + lim.toLocaleString() + note;
  }

  function renderComposer(host, client, data, comp) {
    var card = el('div', { class: 'card pad-lg' });

    var titleRow = el('div', { class: 'spread' },
      el('div', { class: 'card-title', text: comp.editingId ? 'Composer — editing draft' : 'Composer' }),
      comp.editingId
        ? el('button', {
            class: 'btn btn-ghost btn-sm', text: 'New draft',
            onclick: function () {
              stateByClient[client.id] = blankComp(client);
              CE.rerender();
            }
          })
        : null);
    card.appendChild(titleRow);

    /* source row */
    var ideaSel = el('select', { class: 'select' });
    ideaSel.appendChild(el('option', { value: '', text: data.ideas.length ? 'Start blank' : 'Start blank (no ideas yet)' }));
    data.ideas.forEach(function (i) {
      var label = (i.title || 'Untitled idea');
      if (label.length > 64) label = label.slice(0, 61) + '…';
      ideaSel.appendChild(el('option', { value: i.id, text: label }));
    });
    ideaSel.value = comp.ideaId || '';
    ideaSel.addEventListener('change', function () {
      comp.ideaId = ideaSel.value;
      if (comp.ideaId) {
        var idea = data.ideas.filter(function (i) { return i.id === comp.ideaId; })[0];
        if (idea) {
          if (idea.platform && CE.const.PLATFORMS[idea.platform]) comp.platform = idea.platform;
          if (idea.format) comp.format = idea.format;
          if (idea.hook) comp.hook = idea.hook;
        }
      }
      CE.rerender();
    });

    var platSel = el('select', { class: 'select' });
    var ordered = orderedPlatforms(client);
    ordered.mine.forEach(function (p) {
      platSel.appendChild(el('option', { value: p, text: CE.const.PLATFORMS[p].label + ' · client platform' }));
    });
    ordered.rest.forEach(function (p) {
      platSel.appendChild(el('option', { value: p, text: CE.const.PLATFORMS[p].label }));
    });
    platSel.value = comp.platform;
    platSel.addEventListener('change', function () { comp.platform = platSel.value; CE.rerender(); });

    var fmtSel = el('select', { class: 'select' });
    CE.const.FORMATS.forEach(function (f) {
      fmtSel.appendChild(el('option', { value: f, text: f }));
    });
    fmtSel.value = comp.format;
    fmtSel.addEventListener('change', function () { comp.format = fmtSel.value; CE.rerender(); });

    card.appendChild(el('div', { class: 'grid cols-3' },
      fieldWrap('Start from idea…', ideaSel, comp.ideaId ? sourceHint(comp, data) : 'Seeds platform, format and hook.'),
      fieldWrap('Platform', platSel, null),
      fieldWrap('Format', fmtSel, null)));

    /* generate row */
    var hasContent = !!(comp.body && comp.body.length);
    card.appendChild(el('div', { class: 'row wrap', style: { marginBottom: '14px' } },
      el('button', {
        class: 'btn btn-primary', html: CE.icon('spark') + '<span>' + (hasContent ? 'Generate again' : 'Generate draft') + '</span>',
        onclick: function () { generate(comp, client, data); CE.rerender(); CE.ui.toast('Draft generated — edit anything below', 'good'); }
      }),
      hasContent ? el('button', {
        class: 'btn', text: 'Regenerate',
        onclick: function () { generate(comp, client, data); CE.rerender(); CE.ui.toast('Regenerated with a fresh angle', ''); }
      }) : null,
      el('span', { class: 'muted small', text: 'Platform-native structure, hooks and hashtags — generated locally from the client profile' + (comp.ideaId ? ', idea and research' : '') + '.' })));

    /* editable output */
    var hookInput = el('input', { class: 'input', value: comp.hook, placeholder: 'Hook — the first line that earns the rest' });
    hookInput.addEventListener('input', function () { comp.hook = hookInput.value; });

    var bodyTa = el('textarea', { class: 'textarea', rows: '14', placeholder: 'Body — hit "Generate draft" or write your own…' });
    bodyTa.value = comp.body;
    var counter = el('div', { class: 'muted small', style: { marginTop: '6px' } });
    function updateCounter() {
      var len = bodyTa.value.length;
      var lim = LIMITS[comp.platform];
      var over = !!(lim && len > lim);
      counter.textContent = counterText(len, comp.platform) + (over ? ' · over by ' + (len - lim) : '');
      counter.style.color = over ? 'var(--critical)' : '';
    }
    bodyTa.addEventListener('input', function () { comp.body = bodyTa.value; updateCounter(); });
    updateCounter();

    var tagsInput = el('input', { class: 'input', value: comp.hashtags, placeholder: 'hashtags separated by spaces or commas (no #)' });
    tagsInput.addEventListener('input', function () { comp.hashtags = tagsInput.value; });

    var ctaInput = el('input', { class: 'input', value: comp.cta, placeholder: 'Call to action' });
    ctaInput.addEventListener('input', function () { comp.cta = ctaInput.value; });

    var visInput = el('input', { class: 'input', value: comp.visualNotes, placeholder: 'Visual direction for the editor / designer' });
    visInput.addEventListener('input', function () { comp.visualNotes = visInput.value; });

    card.appendChild(fieldWrap('Hook', hookInput, null));
    var bodyField = el('div', { class: 'field' }, el('label', { text: 'Body' }), bodyTa, counter);
    card.appendChild(bodyField);
    card.appendChild(el('div', { class: 'grid cols-3' },
      fieldWrap('Hashtags', tagsInput, normalizeTags(comp.hashtags).length + ' tags'),
      fieldWrap('CTA', ctaInput, null),
      fieldWrap('Visual notes', visInput, null)));

    /* actions */
    card.appendChild(el('div', { class: 'row wrap', style: { marginTop: '4px' } },
      el('button', {
        class: 'btn btn-primary', text: comp.editingId ? 'Save changes' : 'Save draft',
        onclick: function () {
          if (!comp.body && !comp.hook) { CE.ui.toast('Nothing to save yet — generate or write a draft first', 'err'); return; }
          saveDraft(comp, client);
        }
      }),
      el('button', {
        class: 'btn', html: CE.icon('spark') + '<span>Enhance with Coach</span>',
        onclick: function () {
          if (!comp.body) { CE.ui.toast('Generate or write a draft first', 'err'); return; }
          var prompt = 'Punch up this ' + (CE.const.PLATFORMS[comp.platform] ? CE.const.PLATFORMS[comp.platform].label : comp.platform) +
            ' ' + comp.format + ' draft in ' + client.name + '’s voice' +
            (client.voice ? ' (' + client.voice + ')' : '') +
            '. Tighten the hook, strengthen the payoff, keep platform norms. Draft:\n\n' + assembled(comp);
          CE.openCoach(prompt);
        }
      }),
      el('button', {
        class: 'btn', html: CE.icon('copy') + '<span>Copy post</span>',
        onclick: function () {
          if (!comp.body && !comp.hook) { CE.ui.toast('Nothing to copy yet', 'err'); return; }
          copyText(assembled(comp), 'Post copied to clipboard');
        }
      })));

    host.appendChild(card);
  }

  function sourceHint(comp, data) {
    var idea = data.ideas.filter(function (i) { return i.id === comp.ideaId; })[0];
    if (!idea) return '';
    var bits = [];
    if (data.briefs.some(function (b) { return b.ideaId === idea.id; })) bits.push('research brief attached');
    if (idea.trendRef && CE.trends && CE.trends.get && CE.trends.get(idea.trendRef)) bits.push('trend-linked');
    return bits.length ? 'Using: ' + bits.join(' · ') : 'Seeds platform, format and hook.';
  }

  /* ── drafts library ────────────────────────────────────────────────── */
  function renderLibrary(host, client, data, comp) {
    var head = el('div', { class: 'spread', style: { marginTop: '26px', marginBottom: '10px' } },
      el('div', {},
        el('div', { class: 'card-title', style: { marginBottom: '2px' }, text: 'Drafts library' }),
        el('div', { class: 'muted small', text: data.drafts.length + ' draft' + (data.drafts.length === 1 ? '' : 's') + ' for ' + client.name })));
    host.appendChild(head);

    if (!data.drafts.length) {
      host.appendChild(el('div', { class: 'empty' },
        el('div', { class: 'empty-icon', html: CE.icon('pen') }),
        el('h3', { text: 'No drafts yet' }),
        el('p', { class: 'muted', text: 'Pick an idea above (or start blank), hit Generate, then save your first draft.' })));
      return;
    }

    var table = el('table', { class: 'table' });
    var thead = el('thead', {}, el('tr', {},
      el('th', { text: 'Title' }),
      el('th', { text: 'Platform' }),
      el('th', { text: 'Format' }),
      el('th', { text: 'Status' }),
      el('th', { text: 'Created' }),
      el('th', { text: '' })));
    table.appendChild(thead);

    var tbody = el('tbody');
    var drafts = data.drafts.slice().sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
    drafts.forEach(function (draft) {
      var title = (draft.hook || 'Untitled draft');
      var created = draft.createdAt ? new Date(draft.createdAt) : null;
      var createdTxt = created ? created.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '—';
      var editing = comp.editingId === draft.id;

      var actions = el('div', { class: 'row', style: { justifyContent: 'flex-end', flexWrap: 'wrap' } },
        el('button', {
          class: 'btn btn-ghost btn-sm', text: editing ? 'Editing' : 'Edit',
          onclick: function () {
            loadDraftIntoComposer(comp, draft);
            CE.rerender();
            var main = document.querySelector('.main');
            if (main) main.scrollTop = 0;
            window.scrollTo(0, 0);
            CE.ui.toast('Draft loaded into composer', '');
          }
        }),
        el('button', { class: 'btn btn-ghost btn-sm', text: 'Duplicate', onclick: function () { duplicateDraft(draft, client); } }),
        el('button', { class: 'btn btn-ghost btn-sm', text: 'Schedule', onclick: function () { openScheduleModal(draft, client); } }),
        el('button', { class: 'btn btn-ghost btn-sm btn-danger', html: CE.icon('trash'), 'aria-label': 'Delete draft', onclick: function () { deleteDraft(draft, client, comp); } }));

      var tr = el('tr', {},
        el('td', {},
          el('div', { class: 'ellipsis', style: { maxWidth: '340px', fontWeight: '600' }, text: title }),
          el('div', { class: 'muted small ellipsis', style: { maxWidth: '340px' }, text: (draft.body || '').split('\n')[0] })),
        el('td', {}, CE.ui.platformBadge(draft.platform)),
        el('td', {}, el('span', { class: 'tag', text: draft.format || '—' })),
        el('td', {}, CE.ui.statusBadge(draft.status)),
        el('td', { class: 'muted small', text: createdTxt }),
        el('td', {}, actions));
      if (editing) tr.style.background = 'rgba(57,135,229,0.07)';
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    host.appendChild(table);
  }

  /* ── URL param handling (apply once per key) ───────────────────────── */
  function applyParams(ctx, client, data, comp) {
    if (!ctx || !ctx.params || !client) return;
    var draftId = ctx.params.get('draft');
    var ideaId = ctx.params.get('idea');
    if (draftId) {
      var dk = client.id + ':draft:' + draftId;
      if (!consumedParams[dk]) {
        consumedParams[dk] = true;
        var draft = data.drafts.filter(function (x) { return x.id === draftId; })[0];
        if (draft) loadDraftIntoComposer(comp, draft);
      }
      return;
    }
    if (ideaId) {
      var ik = client.id + ':idea:' + ideaId;
      if (!consumedParams[ik]) {
        consumedParams[ik] = true;
        var idea = data.ideas.filter(function (x) { return x.id === ideaId; })[0];
        if (idea) {
          comp.editingId = null;
          comp.ideaId = idea.id;
          if (idea.platform && CE.const.PLATFORMS[idea.platform]) comp.platform = idea.platform;
          if (idea.format) comp.format = idea.format;
          if (idea.hook) comp.hook = idea.hook;
        }
      }
    }
  }

  /* ── render ────────────────────────────────────────────────────────── */
  function render(container, ctx) {
    var client = CE.store.client();

    if (!client) {
      container.appendChild(el('div', { class: 'view-head' },
        el('div', {}, el('h1', { text: 'Create' }),
          el('div', { class: 'sub', text: 'Turn ideas into platform-native drafts' })),
        el('div', { class: 'spacer' })));
      container.appendChild(el('div', { class: 'empty' },
        el('div', { class: 'empty-icon', html: CE.icon('users') }),
        el('h3', { text: 'No client yet' }),
        el('p', { class: 'muted', text: 'Add a client profile first — the studio writes in their voice, for their platforms.' }),
        el('button', { class: 'btn btn-primary', text: 'Add your first client', onclick: function () { CE.openAddClient(); } })));
      return;
    }

    var data = CE.store.data(client.id);
    var comp = compFor(client);
    applyParams(ctx, client, data, comp);

    // If the composer references an idea/draft that no longer exists, drop the link.
    if (comp.ideaId && !data.ideas.some(function (i) { return i.id === comp.ideaId; })) comp.ideaId = '';
    if (comp.editingId && !data.drafts.some(function (d) { return d.id === comp.editingId; })) comp.editingId = null;

    container.appendChild(el('div', { class: 'view-head' },
      el('div', {},
        el('h1', { text: 'Create' }),
        el('div', { class: 'sub', text: 'Content studio for ' + client.name + ' — ideas in, platform-native drafts out' })),
      el('div', { class: 'spacer' }),
      el('button', {
        class: 'btn btn-ghost', text: 'Find ideas',
        onclick: function () { CE.navigate('discover'); }
      }),
      el('button', {
        class: 'btn btn-ghost', text: 'Open Plan',
        onclick: function () { CE.navigate('plan'); }
      })));

    renderComposer(container, client, data, comp);
    renderLibrary(container, client, data, comp);
  }

  CE.views.create = { id: 'create', title: 'Create', icon: 'pen', render: render };
})();
