/* Content Engine — store.js
 * Global namespace, shared constants, persistent state (localStorage), pub/sub.
 * Loaded first. Everything else hangs off window.CE.
 */
(function () {
  'use strict';

  var CE = (window.CE = window.CE || {});
  CE.views = CE.views || {};

  /* ── ids ─────────────────────────────────────────────────────────── */
  CE.uid = function () {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  };

  /* ── shared constants ────────────────────────────────────────────── */
  CE.const = {
    PLATFORMS: {
      instagram: { id: 'instagram', label: 'Instagram', short: 'IG', color: '#d55181', bestTimes: ['11:00', '19:00'], cadence: '4–5 posts/wk' },
      tiktok:    { id: 'tiktok',    label: 'TikTok',    short: 'TT', color: '#199e70', bestTimes: ['12:00', '18:00', '21:00'], cadence: '5–7 posts/wk' },
      youtube:   { id: 'youtube',   label: 'YouTube',   short: 'YT', color: '#e66767', bestTimes: ['15:00', '17:00'], cadence: '1–3 videos/wk' },
      linkedin:  { id: 'linkedin',  label: 'LinkedIn',  short: 'LI', color: '#3987e5', bestTimes: ['08:00', '12:00'], cadence: '3–5 posts/wk' },
      x:         { id: 'x',         label: 'X / Twitter', short: 'X', color: '#c3c2b7', bestTimes: ['09:00', '13:00'], cadence: '1–3 posts/day' },
      facebook:  { id: 'facebook',  label: 'Facebook',  short: 'FB', color: '#9085e9', bestTimes: ['13:00', '19:00'], cadence: '3–4 posts/wk' },
      pinterest: { id: 'pinterest', label: 'Pinterest', short: 'PIN', color: '#d95926', bestTimes: ['20:00', '22:00'], cadence: '5–10 pins/wk' }
    },
    // Pipeline statuses in order. Colors: ordinal blue ramp, published = status-good.
    STATUSES: ['idea', 'researched', 'drafted', 'approved', 'scheduled', 'published'],
    STATUS_COLORS: {
      idea: '#9ec5f4', researched: '#6da7ec', drafted: '#3987e5',
      approved: '#256abf', scheduled: '#1c5cab', published: '#0ca30c'
    },
    STATUS_LABELS: {
      idea: 'Idea', researched: 'Researched', drafted: 'Drafted',
      approved: 'Approved', scheduled: 'Scheduled', published: 'Published'
    },
    FORMATS: ['short-video', 'long-video', 'carousel', 'image', 'text-post', 'story', 'article', 'live'],
    MOMENTUM: { rising: 'Rising', peaking: 'Peaking', steady: 'Steady' }
  };

  /* ── per-client data shape ───────────────────────────────────────── */
  function blankData() {
    return { ideas: [], briefs: [], drafts: [], schedule: [], coachThread: [] };
  }

  function ensureDataShape(d) {
    d = d || {};
    var b = blankData();
    Object.keys(b).forEach(function (k) { if (!Array.isArray(d[k])) d[k] = b[k]; });
    return d;
  }

  /* ── first-run demo seed ─────────────────────────────────────────── */
  function seedState() {
    var demoId = CE.uid();
    var today = new Date();
    function iso(offsetDays) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offsetDays);
      return d.toISOString().slice(0, 10);
    }
    var idea1 = CE.uid(), idea2 = CE.uid(), idea3 = CE.uid(), draft1 = CE.uid();
    return {
      version: 1,
      activeClientId: demoId,
      clients: [{
        id: demoId, demo: true, name: 'Demo Client', color: '#3987e5',
        industry: 'Coaching & consulting', niche: 'Business growth, lead generation, personal brand',
        audience: 'Founders and executives who want inbound pipeline',
        voice: 'Direct, practical, no fluff. Short sentences. Proof over hype.',
        goals: 'Grow audience, book discovery calls, launch content engine',
        platforms: ['linkedin', 'instagram', 'youtube'],
        createdAt: Date.now()
      }],
      data: (function () {
        var d = {};
        d[demoId] = {
          ideas: [
            { id: idea1, title: 'Why word of mouth stops working (and what replaces it)', angle: 'Contrarian take backed by a client story', hook: 'Word of mouth built your business. It will also quietly kill it.', format: 'short-video', platform: 'linkedin', status: 'drafted', trendRef: null, notes: '', createdAt: Date.now(), updatedAt: Date.now() },
            { id: idea2, title: '3 signals a CMO checks before they ever call you', angle: 'Checklist from the buyer’s side of the desk', hook: '87% of buyers research you before the first call. Here’s what they look for.', format: 'carousel', platform: 'instagram', status: 'idea', trendRef: null, notes: '', createdAt: Date.now(), updatedAt: Date.now() },
            { id: idea3, title: 'I turned 6 podcast episodes into 60 posts — full system', angle: 'Behind-the-scenes breakdown, repurposing workflow', hook: 'You don’t have a content problem. You have a repurposing problem.', format: 'long-video', platform: 'youtube', status: 'researched', trendRef: null, notes: '', createdAt: Date.now(), updatedAt: Date.now() }
          ],
          briefs: [],
          drafts: [
            { id: draft1, ideaId: idea1, platform: 'linkedin', format: 'short-video', hook: 'Word of mouth built your business. It will also quietly kill it.', body: 'For 25 years, referrals were enough.\n\nThen the market turned, and the phone went quiet.\n\nHere’s the uncomfortable truth: word of mouth is a lagging indicator. It rewards the work you did years ago — it tells you nothing about next quarter.\n\nThe fix isn’t more networking. It’s a system:\n1. Publish proof weekly\n2. Turn every client win into 5 assets\n3. Show up where your buyers already research\n\nReferrals become the bonus, not the plan.', hashtags: ['leadgeneration', 'contentmarketing', 'founders'], cta: 'Follow for the full playbook.', visualNotes: 'Talking head, bold caption overlay on the hook line.', status: 'drafted', createdAt: Date.now() }
          ],
          schedule: [
            { id: CE.uid(), refType: 'draft', refId: draft1, title: 'Why word of mouth stops working', date: iso(1), time: '08:00', platform: 'linkedin', status: 'scheduled' },
            { id: CE.uid(), refType: 'idea', refId: idea2, title: '3 signals a CMO checks', date: iso(3), time: '11:00', platform: 'instagram', status: 'scheduled' }
          ],
          coachThread: []
        };
        return d;
      })(),
      settings: { apiKey: '', model: 'claude-sonnet-5', theme: 'dark' }
    };
  }

  /* ── persistence + pub/sub ───────────────────────────────────────── */
  var KEY = 'ce.v1';
  var state = null;
  var subs = [];

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.version === 1 && Array.isArray(s.clients)) {
          s.data = s.data || {};
          s.clients.forEach(function (c) { s.data[c.id] = ensureDataShape(s.data[c.id]); });
          s.settings = s.settings || { apiKey: '', model: 'claude-sonnet-5', theme: 'dark' };
          return s;
        }
      }
    } catch (e) { /* corrupted storage → reseed */ }
    return seedState();
  }

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('CE: persist failed', e); }
  }

  CE.store = {
    get: function () { if (!state) state = load(); return state; },

    /* set(fn, opts) — fn mutates state; persists and notifies.
     * opts.rerender === false → subscribers are told not to re-render the view
     * (use for keystroke-level updates inside forms). */
    set: function (fn, opts) {
      var s = CE.store.get();
      fn(s);
      persist();
      var rerender = !(opts && opts.rerender === false);
      subs.forEach(function (cb) { try { cb(s, rerender); } catch (e) { console.error(e); } });
    },

    subscribe: function (cb) {
      subs.push(cb);
      return function () { var i = subs.indexOf(cb); if (i >= 0) subs.splice(i, 1); };
    },

    client: function () {
      var s = CE.store.get();
      var c = s.clients.find(function (x) { return x.id === s.activeClientId; });
      return c || s.clients[0] || null;
    },

    data: function (clientId) {
      var s = CE.store.get();
      var id = clientId || (CE.store.client() && CE.store.client().id);
      if (!id) return blankData();
      s.data[id] = ensureDataShape(s.data[id]);
      return s.data[id];
    },

    addClient: function (profile) {
      var id = CE.uid();
      CE.store.set(function (s) {
        s.clients.push(Object.assign({
          id: id, name: 'New client', color: '#3987e5', industry: '', niche: '',
          audience: '', voice: '', goals: '', platforms: ['instagram'], createdAt: Date.now()
        }, profile, { id: id }));
        s.data[id] = blankData();
        s.activeClientId = id;
      });
      return id;
    },

    removeClient: function (id) {
      CE.store.set(function (s) {
        s.clients = s.clients.filter(function (c) { return c.id !== id; });
        delete s.data[id];
        if (s.activeClientId === id) s.activeClientId = s.clients.length ? s.clients[0].id : null;
      });
    },

    exportJSON: function () {
      var s = JSON.parse(JSON.stringify(CE.store.get()));
      if (s.settings) delete s.settings.apiKey;
      return JSON.stringify(s, null, 2);
    },

    importJSON: function (text) {
      var s = JSON.parse(text);
      if (!s || s.version !== 1 || !Array.isArray(s.clients)) throw new Error('Not a valid Content Engine export');
      s.data = s.data || {};
      s.clients.forEach(function (c) { s.data[c.id] = ensureDataShape(s.data[c.id]); });
      s.settings = s.settings || { apiKey: '', model: 'claude-sonnet-5', theme: 'dark' };
      if (!s.clients.some(function (c) { return c.id === s.activeClientId; })) s.activeClientId = s.clients.length ? s.clients[0].id : null;
      state = s;
      persist();
      subs.forEach(function (cb) { try { cb(state, true); } catch (e) { console.error(e); } });
    },

    resetAll: function () {
      state = seedState();
      persist();
      subs.forEach(function (cb) { try { cb(state, true); } catch (e) { console.error(e); } });
    }
  };
})();
