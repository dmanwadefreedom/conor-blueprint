/* Content Engine — views/plan.js
 * Plan view: month content calendar + scheduling queue for the active client.
 */
(function () {
  'use strict';
  var CE = window.CE;

  /* ── module state (persists across re-renders) ───────────────────── */
  var calYear = null;   // displayed month
  var calMonth = null;
  var dragEvtId = null; // schedule item id being dragged

  var DEFAULT_TIMES = ['08:00', '09:00', '11:00', '12:00', '13:00', '15:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  /* ── date helpers ────────────────────────────────────────────────── */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function isoOf(y, m, d) { return y + '-' + pad2(m + 1) + '-' + pad2(d); }
  function isoOfDate(d) { return isoOf(d.getFullYear(), d.getMonth(), d.getDate()); }
  function todayIso() { return isoOfDate(new Date()); }
  function parseIso(iso) {
    var p = String(iso || '').split('-');
    return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1);
  }
  function longDate(iso) {
    return parseIso(iso).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
  function monthTitle(y, m) {
    return new Date(y, m, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }

  /* ── data helpers ────────────────────────────────────────────────── */
  function findById(arr, id) {
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i];
    return null;
  }

  function draftLabel(data, dr) {
    if (dr.ideaId) {
      var idea = findById(data.ideas, dr.ideaId);
      if (idea && idea.title) return idea.title;
    }
    if (dr.hook) return dr.hook;
    if (dr.body) return dr.body.split('\n')[0].slice(0, 70);
    return 'Untitled draft';
  }

  function refMap(data) {
    var m = {};
    data.schedule.forEach(function (e) { m[e.refId] = true; });
    return m;
  }

  function ideaHasDraft(data) {
    var m = {};
    data.drafts.forEach(function (dr) { if (dr.ideaId) m[dr.ideaId] = true; });
    return m;
  }

  /* Queue: drafts (drafted/approved) + ideas (researched/drafted) not yet on the calendar. */
  function readyItems(data) {
    var refd = refMap(data), drafted = ideaHasDraft(data), out = [];
    data.drafts.forEach(function (dr) {
      if (!refd[dr.id] && !(dr.ideaId && refd[dr.ideaId]) && (dr.status === 'drafted' || dr.status === 'approved')) {
        out.push({ kind: 'draft', id: dr.id, title: draftLabel(data, dr), platform: dr.platform, status: dr.status });
      }
    });
    data.ideas.forEach(function (i) {
      if (!refd[i.id] && (i.status === 'researched' || i.status === 'drafted') && !drafted[i.id]) {
        out.push({ kind: 'idea', id: i.id, title: i.title || 'Untitled idea', platform: i.platform, status: i.status });
      }
    });
    return out;
  }

  /* Day modal picker: anything sensibly schedulable that is not already on the calendar. */
  function schedulableItems(data) {
    var refd = refMap(data), drafted = ideaHasDraft(data), out = [];
    data.drafts.forEach(function (dr) {
      if (!refd[dr.id] && !(dr.ideaId && refd[dr.ideaId]) && dr.status !== 'published') {
        out.push({ kind: 'draft', id: dr.id, title: draftLabel(data, dr), platform: dr.platform, status: dr.status });
      }
    });
    data.ideas.forEach(function (i) {
      if (!refd[i.id] && i.status !== 'scheduled' && i.status !== 'published' && !drafted[i.id]) {
        out.push({ kind: 'idea', id: i.id, title: i.title || 'Untitled idea', platform: i.platform, status: i.status });
      }
    });
    return out;
  }

  /* ── mutations ───────────────────────────────────────────────────── */
  function scheduleSource(kind, id, iso, time) {
    var title = '', ok = false;
    CE.store.set(function () {
      var d = CE.store.data();
      if (kind === 'draft') {
        var dr = findById(d.drafts, id);
        if (!dr) return;
        title = draftLabel(d, dr);
        d.schedule.push({
          id: CE.uid(), refType: 'draft', refId: dr.id, title: title,
          date: iso, time: time, platform: dr.platform, status: 'scheduled'
        });
        dr.status = 'scheduled';
        if (dr.ideaId) {
          var li = findById(d.ideas, dr.ideaId);
          if (li) li.status = 'scheduled';
        }
        ok = true;
      } else {
        var idea = findById(d.ideas, id);
        if (!idea) return;
        title = idea.title || 'Untitled idea';
        d.schedule.push({
          id: CE.uid(), refType: 'idea', refId: idea.id, title: title,
          date: iso, time: time, platform: idea.platform, status: 'scheduled'
        });
        idea.status = 'scheduled';
        ok = true;
      }
    });
    return ok;
  }

  function markPublished(evtId) {
    CE.store.set(function () {
      var d = CE.store.data();
      var e = findById(d.schedule, evtId);
      if (!e) return;
      e.status = 'published';
      if (e.refType === 'draft') {
        var dr = findById(d.drafts, e.refId);
        if (dr) {
          dr.status = 'published';
          if (dr.ideaId) {
            var li = findById(d.ideas, dr.ideaId);
            if (li) li.status = 'published';
          }
        }
      } else if (e.refType === 'idea') {
        var idea = findById(d.ideas, e.refId);
        if (idea) idea.status = 'published';
      }
    });
    CE.ui.toast('Marked as published 🎉', 'good');
  }

  function unschedule(evtId) {
    CE.store.set(function () {
      var d = CE.store.data();
      var e = findById(d.schedule, evtId);
      if (!e) return;
      d.schedule = d.schedule.filter(function (x) { return x.id !== evtId; });
      if (e.refType === 'draft') {
        var dr = findById(d.drafts, e.refId);
        if (dr) {
          if (dr.status === 'scheduled' || dr.status === 'published') dr.status = 'drafted';
          if (dr.ideaId) {
            var li = findById(d.ideas, dr.ideaId);
            if (li && (li.status === 'scheduled' || li.status === 'published')) li.status = 'drafted';
          }
        }
      } else if (e.refType === 'idea') {
        var idea = findById(d.ideas, e.refId);
        if (idea && (idea.status === 'scheduled' || idea.status === 'published')) idea.status = 'drafted';
      }
    });
    CE.ui.toast('Unscheduled — back in the queue');
  }

  function moveEvent(evtId, iso) {
    var moved = false;
    CE.store.set(function () {
      var d = CE.store.data();
      var e = findById(d.schedule, evtId);
      if (e && e.date !== iso) { e.date = iso; moved = true; }
    });
    if (moved) CE.ui.toast('Moved to ' + CE.ui.fmtDate(iso), 'good');
  }

  function autoSlot(item) {
    var p = CE.const.PLATFORMS[item.platform];
    var time = (p && p.bestTimes && p.bestTimes[0]) || '09:00';
    var data = CE.store.data();
    var counts = {};
    data.schedule.forEach(function (e) { counts[e.date] = (counts[e.date] || 0) + 1; });
    var t = new Date(), bestIso = null, bestCnt = Infinity;
    for (var i = 1; i <= 14; i++) {
      var d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + i);
      var iso = isoOfDate(d);
      var c = counts[iso] || 0;
      if (c === 0) { bestIso = iso; break; }
      if (c < bestCnt) { bestCnt = c; bestIso = iso; }
    }
    if (!bestIso) bestIso = todayIso();
    // Jump the calendar to the month we scheduled into so the user sees it land.
    var bd = parseIso(bestIso);
    calYear = bd.getFullYear();
    calMonth = bd.getMonth();
    if (scheduleSource(item.kind, item.id, bestIso, time)) {
      CE.ui.toast('Auto-slotted for ' + CE.ui.fmtDate(bestIso) + ' at ' + time, 'good');
    }
  }

  /* ── time select ─────────────────────────────────────────────────── */
  function fillTimeSelect(sel, platform) {
    sel.innerHTML = '';
    var p = CE.const.PLATFORMS[platform];
    var best = (p && p.bestTimes) || [];
    var seen = {};
    best.forEach(function (t) {
      seen[t] = 1;
      sel.appendChild(CE.ui.el('option', { value: t, text: t + '  ·  best for ' + (p.short || platform) }));
    });
    DEFAULT_TIMES.forEach(function (t) {
      if (!seen[t]) { seen[t] = 1; sel.appendChild(CE.ui.el('option', { value: t, text: t })); }
    });
  }

  /* ── event modal ─────────────────────────────────────────────────── */
  function openEventModal(evtId) {
    var data = CE.store.data();
    var e = findById(data.schedule, evtId);
    if (!e) return;
    var el = CE.ui.el;

    var body = el('div');
    body.appendChild(el('div', { class: 'row wrap', style: { marginBottom: '12px' } },
      CE.ui.platformBadge(e.platform),
      CE.ui.statusBadge(e.status),
      el('span', { class: 'muted small', text: e.refType === 'draft' ? 'From a draft' : 'From an idea' })));

    var titleIn = el('input', { class: 'input', value: e.title || '' });
    body.appendChild(el('div', { class: 'field' }, el('label', { text: 'Title' }), titleIn));

    var dateIn = el('input', { class: 'input', type: 'date', value: e.date });
    var timeIn = el('input', { class: 'input', type: 'time', value: e.time });
    body.appendChild(el('div', { class: 'grid cols-2' },
      el('div', { class: 'field' }, el('label', { text: 'Date' }), dateIn),
      el('div', { class: 'field' }, el('label', { text: 'Time' }), timeIn)));

    if (e.refType === 'draft') {
      var dr = findById(data.drafts, e.refId);
      if (dr && (dr.hook || dr.body)) {
        body.appendChild(el('div', { class: 'field' },
          el('label', { text: 'Linked draft' }),
          el('div', { class: 'muted small', style: { lineHeight: '1.5' }, text: (dr.hook || dr.body.split('\n')[0]).slice(0, 140) })));
      }
    } else {
      var idea = findById(data.ideas, e.refId);
      if (idea && idea.hook) {
        body.appendChild(el('div', { class: 'field' },
          el('label', { text: 'Linked idea hook' }),
          el('div', { class: 'muted small', style: { lineHeight: '1.5' }, text: idea.hook.slice(0, 140) })));
      }
    }

    var actions = [
      {
        label: 'Delete', class: 'btn-danger',
        onClick: function () {
          CE.ui.confirm('Delete this calendar item? The linked draft/idea keeps its current status.', 'Delete')
            .then(function (ok) {
              if (!ok) return;
              CE.store.set(function () {
                var d = CE.store.data();
                d.schedule = d.schedule.filter(function (x) { return x.id !== evtId; });
              });
              CE.ui.toast('Deleted');
            });
        }
      },
      { label: 'Unschedule', class: 'btn-ghost', onClick: function () { unschedule(evtId); } }
    ];
    if (e.status !== 'published') {
      actions.push({ label: 'Mark published', class: 'btn-ghost', onClick: function () { markPublished(evtId); } });
    } else {
      actions.push({
        label: 'Revert to scheduled', class: 'btn-ghost',
        onClick: function () {
          CE.store.set(function () {
            var d = CE.store.data();
            var it = findById(d.schedule, evtId);
            if (it) it.status = 'scheduled';
          });
          CE.ui.toast('Back to scheduled');
        }
      });
    }
    actions.push({
      label: 'Save changes', class: 'btn-primary',
      onClick: function () {
        var nd = dateIn.value, nt = timeIn.value, ttl = titleIn.value.trim();
        if (!nd || !/^\d{4}-\d{2}-\d{2}$/.test(nd)) { CE.ui.toast('Pick a valid date', 'err'); return false; }
        CE.store.set(function () {
          var d = CE.store.data();
          var it = findById(d.schedule, evtId);
          if (!it) return;
          it.date = nd;
          it.time = nt || it.time || '09:00';
          if (ttl) it.title = ttl;
        });
        CE.ui.toast('Saved', 'good');
      }
    });

    CE.ui.modal({ title: 'Scheduled post', body: body, actions: actions });
  }

  /* ── day modal ───────────────────────────────────────────────────── */
  function openDayModal(iso) {
    var data = CE.store.data();
    var el = CE.ui.el;
    var closeRef = { fn: null };

    var body = el('div');

    var dayEvts = data.schedule
      .filter(function (e) { return e.date === iso; })
      .sort(function (a, b) { return (a.time || '').localeCompare(b.time || ''); });

    if (dayEvts.length) {
      var list = el('div', { class: 'stack', style: { gap: '6px', display: 'flex', flexDirection: 'column' } });
      dayEvts.forEach(function (e) {
        var p = CE.const.PLATFORMS[e.platform];
        list.appendChild(el('div', {
          class: 'row',
          style: { padding: '8px 10px', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', borderLeft: '3px solid ' + ((p && p.color) || 'var(--accent)') },
          onclick: function () { if (closeRef.fn) closeRef.fn(); openEventModal(e.id); }
        },
          el('span', { class: 'mono small', text: e.time || '—' }),
          el('span', { class: 'ellipsis', style: { flex: '1', minWidth: '0' }, text: e.title }),
          CE.ui.statusBadge(e.status)));
      });
      body.appendChild(list);
    } else {
      body.appendChild(el('p', { class: 'muted small', text: 'Nothing scheduled on this day yet.' }));
    }

    body.appendChild(el('div', { class: 'divider' }));
    body.appendChild(el('div', { class: 'card-title', text: 'Schedule something' }));

    var pool = schedulableItems(data);
    var itemSel = null, timeSel = null;
    if (pool.length) {
      itemSel = el('select', { class: 'select' });
      pool.forEach(function (it) {
        var p = CE.const.PLATFORMS[it.platform];
        itemSel.appendChild(el('option', {
          value: it.kind + ':' + it.id,
          text: (p ? p.short + ' · ' : '') + (it.kind === 'draft' ? 'Draft — ' : 'Idea — ') + it.title
        }));
      });
      timeSel = el('select', { class: 'select' });
      fillTimeSelect(timeSel, pool[0].platform);
      itemSel.addEventListener('change', function () {
        var v = itemSel.value.split(':');
        var picked = null;
        for (var i = 0; i < pool.length; i++) if (pool[i].kind === v[0] && pool[i].id === v.slice(1).join(':')) picked = pool[i];
        fillTimeSelect(timeSel, picked ? picked.platform : '');
      });
      body.appendChild(el('div', { class: 'field' }, el('label', { text: 'Content' }), itemSel));
      body.appendChild(el('div', { class: 'field' }, el('label', { text: 'Time' }), timeSel,
        el('span', { class: 'hint', text: 'Best posting times for the platform are listed first.' })));
    } else {
      body.appendChild(el('p', { class: 'muted small', text: 'Nothing in the queue. Write a draft in Create or capture ideas in Discover first.' }));
    }

    var actions = [{ label: 'Close' }];
    if (pool.length) {
      actions.push({
        label: 'Add to calendar', class: 'btn-primary',
        onClick: function () {
          var v = itemSel.value;
          if (!v) { CE.ui.toast('Pick something to schedule', 'err'); return false; }
          var kind = v.split(':')[0];
          var id = v.slice(kind.length + 1);
          var time = (timeSel && timeSel.value) || '09:00';
          if (scheduleSource(kind, id, iso, time)) {
            CE.ui.toast('Scheduled for ' + CE.ui.fmtDate(iso) + ' at ' + time, 'good');
          }
        }
      });
    }

    closeRef.fn = CE.ui.modal({ title: longDate(iso), body: body, actions: actions });
  }

  /* ── calendar ────────────────────────────────────────────────────── */
  function buildCalendar(data, rerenderSelf) {
    var el = CE.ui.el;
    var card = el('div', { class: 'card' });

    function shiftMonth(delta) {
      calMonth += delta;
      while (calMonth < 0) { calMonth += 12; calYear--; }
      while (calMonth > 11) { calMonth -= 12; calYear++; }
      rerenderSelf();
    }

    card.appendChild(el('div', { class: 'cal-head' },
      el('button', { class: 'btn btn-ghost btn-sm', html: CE.icon('arrowL'), 'aria-label': 'Previous month', onclick: function () { shiftMonth(-1); } }),
      el('div', { class: 'cal-title', text: monthTitle(calYear, calMonth) }),
      el('button', { class: 'btn btn-ghost btn-sm', html: CE.icon('arrowR'), 'aria-label': 'Next month', onclick: function () { shiftMonth(1); } }),
      el('div', { class: 'spacer' }),
      el('button', {
        class: 'btn btn-sm', text: 'Today',
        onclick: function () {
          var t = new Date();
          calYear = t.getFullYear(); calMonth = t.getMonth();
          rerenderSelf();
        }
      })));

    var dow = el('div', { class: 'cal-dow' });
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].forEach(function (d) {
      dow.appendChild(el('div', { text: d }));
    });
    card.appendChild(dow);

    var byDate = {};
    data.schedule.forEach(function (e) {
      (byDate[e.date] = byDate[e.date] || []).push(e);
    });
    Object.keys(byDate).forEach(function (k) {
      byDate[k].sort(function (a, b) { return (a.time || '').localeCompare(b.time || ''); });
    });

    var first = new Date(calYear, calMonth, 1);
    var offset = (first.getDay() + 6) % 7; // Monday-start
    var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    var totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;
    var tIso = todayIso();

    var grid = el('div', { class: 'cal' });
    for (var i = 0; i < totalCells; i++) grid.appendChild(buildDayCell(i));
    card.appendChild(grid);

    function buildDayCell(i) {
      var d = new Date(calYear, calMonth, 1 - offset + i);
      var iso = isoOfDate(d);
      var cls = 'cal-day';
      if (d.getMonth() !== calMonth) cls += ' other';
      if (iso === tIso) cls += ' today';

      var cell = el('div', {
        class: cls,
        onclick: function () { openDayModal(iso); },
        ondragover: function (ev) { ev.preventDefault(); cell.classList.add('drop-ok'); },
        ondragleave: function () { cell.classList.remove('drop-ok'); },
        ondrop: function (ev) {
          ev.preventDefault();
          cell.classList.remove('drop-ok');
          var id = '';
          try { id = ev.dataTransfer.getData('text/plain'); } catch (err) { /* older browsers */ }
          id = id || dragEvtId;
          dragEvtId = null;
          if (id) moveEvent(id, iso);
        }
      }, el('div', { class: 'cal-num', text: String(d.getDate()) }));

      var evts = byDate[iso] || [];
      var shown = evts.slice(0, 3);
      shown.forEach(function (e) { cell.appendChild(buildEvtPill(e)); });
      if (evts.length > 3) {
        cell.appendChild(el('div', {
          class: 'small muted', style: { cursor: 'pointer', paddingLeft: '4px' },
          text: '+' + (evts.length - 3) + ' more',
          onclick: function (ev) { ev.stopPropagation(); openDayModal(iso); }
        }));
      }
      return cell;
    }

    function buildEvtPill(e) {
      var p = CE.const.PLATFORMS[e.platform];
      return el('div', {
        class: 'cal-evt' + (e.status === 'published' ? ' published' : ''),
        draggable: 'true',
        style: { borderLeftColor: (p && p.color) || 'var(--accent)' },
        title: (e.time || '') + ' ' + e.title + (p ? ' · ' + p.label : ''),
        text: (e.time || '') + ' ' + e.title,
        ondragstart: function (ev) {
          dragEvtId = e.id;
          try {
            ev.dataTransfer.setData('text/plain', e.id);
            ev.dataTransfer.effectAllowed = 'move';
          } catch (err) { /* noop */ }
        },
        ondragend: function () { dragEvtId = null; },
        onclick: function (ev) { ev.stopPropagation(); openEventModal(e.id); }
      });
    }

    return card;
  }

  /* ── queue column ────────────────────────────────────────────────── */
  function buildQueue(client, data) {
    var el = CE.ui.el;
    var col = el('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0' } });

    /* Ready to schedule */
    var ready = readyItems(data);
    var readyCard = el('div', { class: 'card' });
    readyCard.appendChild(el('div', { class: 'spread' },
      el('div', { class: 'card-title', text: 'Ready to schedule' }),
      el('span', { class: 'badge', text: String(ready.length) })));
    if (ready.length) {
      ready.forEach(function (it, idx) {
        var p = CE.const.PLATFORMS[it.platform];
        readyCard.appendChild(el('div', {
          class: 'row',
          style: { padding: '9px 0', borderTop: idx === 0 ? 'none' : '1px solid var(--border)', minWidth: '0' }
        },
          el('div', { style: { flex: '1', minWidth: '0' } },
            el('div', { class: 'ellipsis', style: { fontSize: '13px' }, title: it.title, text: it.title }),
            el('div', { class: 'small muted', text: (it.kind === 'draft' ? 'Draft' : 'Idea') + ' · ' + (CE.const.STATUS_LABELS[it.status] || it.status) })),
          el('span', { class: 'badge' },
            el('span', { class: 'swatch', style: { background: (p && p.color) || '#898781' } }),
            (p && p.short) || it.platform || '—'),
          el('button', {
            class: 'btn btn-sm', text: 'Auto-slot', title: 'Schedule on the emptiest upcoming day at the platform’s best time',
            onclick: function () { autoSlot(it); }
          })));
      });
      readyCard.appendChild(el('div', { class: 'hint mt', text: 'Auto-slot picks the emptiest day in the next 2 weeks at the platform’s best time.' }));
    } else {
      readyCard.appendChild(el('p', { class: 'muted small', text: 'Queue is clear — every approved draft and researched idea is on the calendar.' }));
      readyCard.appendChild(el('div', { class: 'row mt' },
        el('button', { class: 'btn btn-sm', text: 'Write a draft', onclick: function () { CE.navigate('create'); } }),
        el('button', { class: 'btn btn-sm btn-ghost', text: 'Find ideas', onclick: function () { CE.navigate('discover'); } })));
    }
    col.appendChild(readyCard);

    /* Best posting times */
    var timesCard = el('div', { class: 'card' });
    timesCard.appendChild(el('div', { class: 'card-title', text: 'Best posting times' }));
    var plats = (client.platforms || []).filter(function (pid) { return CE.const.PLATFORMS[pid]; });
    if (plats.length) {
      plats.forEach(function (pid, idx) {
        var p = CE.const.PLATFORMS[pid];
        timesCard.appendChild(el('div', {
          class: 'row',
          style: { padding: '9px 0', borderTop: idx === 0 ? 'none' : '1px solid var(--border)' }
        },
          CE.ui.platformBadge(pid),
          el('div', { style: { flex: '1', minWidth: '0' } },
            el('div', { class: 'mono small', text: (p.bestTimes || []).join(' · ') }),
            el('div', { class: 'small muted', text: p.cadence || '' }))));
      });
    } else {
      timesCard.appendChild(el('p', { class: 'muted small', text: 'No platforms set for this client yet — add some in Clients & Settings.' }));
    }
    col.appendChild(timesCard);

    /* This week */
    var weekCard = el('div', { class: 'card' });
    weekCard.appendChild(el('div', { class: 'card-title', text: 'This week' }));
    var t = new Date();
    var weekTotal = 0, dayLines = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(t.getFullYear(), t.getMonth(), t.getDate() + i);
      var iso = isoOfDate(d);
      var cnt = data.schedule.filter(function (e) { return e.date === iso; }).length;
      weekTotal += cnt;
      if (cnt > 0) {
        dayLines.push({
          label: (i === 0 ? 'Today' : d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })),
          iso: iso, count: cnt
        });
      }
    }
    weekCard.appendChild(el('div', { class: 'row', style: { alignItems: 'baseline', gap: '8px' } },
      el('span', { class: 'stat-value', text: String(weekTotal) }),
      el('span', { class: 'stat-label', text: weekTotal === 1 ? 'post in the next 7 days' : 'posts in the next 7 days' })));
    if (dayLines.length) {
      var mini = el('div', { class: 'mt', style: { display: 'flex', flexDirection: 'column', gap: '5px' } });
      dayLines.forEach(function (l) {
        mini.appendChild(el('div', {
          class: 'row small', style: { cursor: 'pointer' },
          onclick: (function (iso) { return function () { openDayModal(iso); }; })(l.iso)
        },
          el('span', { class: 'muted', style: { flex: '1' }, text: l.label }),
          el('span', { class: 'mono', text: l.count + (l.count === 1 ? ' post' : ' posts') })));
      });
      weekCard.appendChild(mini);
    } else {
      weekCard.appendChild(el('p', { class: 'muted small mt', text: 'Nothing scheduled in the next 7 days.' }));
    }
    weekCard.appendChild(el('div', { class: 'divider' }));
    var nowPrefix = isoOf(t.getFullYear(), t.getMonth(), 1).slice(0, 7);
    var pubMonth = data.schedule.filter(function (e) {
      return e.status === 'published' && String(e.date || '').slice(0, 7) === nowPrefix;
    }).length;
    weekCard.appendChild(el('div', { class: 'row small' },
      el('span', { class: 'muted', style: { flex: '1' }, text: 'Published this month' }),
      el('span', { class: 'mono', style: { color: CE.const.STATUS_COLORS.published }, text: String(pubMonth) })));
    col.appendChild(weekCard);

    return col;
  }

  /* ── render ──────────────────────────────────────────────────────── */
  function render(container, ctx) {
    var el = CE.ui.el;
    var client = CE.store.client();

    function rerenderSelf() {
      container.innerHTML = '';
      render(container, ctx);
    }

    if (!client) {
      container.appendChild(el('div', { class: 'empty' },
        el('div', { class: 'empty-icon' },
          el('span', { html: CE.icon('calendar'), style: { display: 'inline-flex', width: '34px', height: '34px' } })),
        el('h3', { text: 'No client selected' }),
        el('p', { text: 'Add a client to start planning their content calendar.' }),
        el('button', { class: 'btn btn-primary', text: 'Add your first client', onclick: function () { CE.openAddClient(); } })));
      return;
    }

    var data = CE.store.data();

    if (calYear == null || calMonth == null) {
      var now = new Date();
      calYear = now.getFullYear();
      calMonth = now.getMonth();
    }

    var upcoming = data.schedule.filter(function (e) { return e.status !== 'published'; }).length;
    var readyCount = readyItems(data).length;

    /* header */
    container.appendChild(el('div', { class: 'view-head' },
      el('div', {},
        el('h1', { text: 'Plan' }),
        el('div', {
          class: 'sub',
          text: client.name + ' · ' + upcoming + ' scheduled · ' + readyCount + ' in queue'
        })),
      el('div', { class: 'spacer' }),
      el('button', {
        class: 'btn btn-primary',
        html: CE.icon('plus') + '<span>Schedule content</span>',
        onclick: function () { openDayModal(todayIso()); }
      })));

    /* full empty state: nothing scheduled and nothing to schedule */
    if (!data.schedule.length && !schedulableItems(data).length) {
      container.appendChild(el('div', { class: 'card pad-lg' },
        el('div', { class: 'empty' },
          el('div', { class: 'empty-icon' },
            el('span', { html: CE.icon('calendar'), style: { display: 'inline-flex', width: '34px', height: '34px' } })),
          el('h3', { text: 'Nothing to plan yet' }),
          el('p', { text: 'The calendar fills up once you have drafts or researched ideas. Create content first, then schedule it here.' }),
          el('div', { class: 'row', style: { justifyContent: 'center' } },
            el('button', { class: 'btn btn-primary', text: 'Write a draft', onclick: function () { CE.navigate('create'); } }),
            el('button', { class: 'btn btn-ghost', text: 'Discover trends', onclick: function () { CE.navigate('discover'); } })))));
      return;
    }

    /* layout: calendar (2fr) + queue (1fr) */
    var grid = el('div', { class: 'grid split' });
    grid.appendChild(buildCalendar(data, rerenderSelf));
    grid.appendChild(buildQueue(client, data));
    container.appendChild(grid);
  }

  CE.views.plan = { id: 'plan', title: 'Plan', icon: 'calendar', render: render };
})();
