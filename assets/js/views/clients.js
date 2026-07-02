/* Content Engine — views/clients.js
 * Client management + app settings: client roster (edit / activate / delete),
 * Coach AI connection (Anthropic API key + model), data export/import/reset, about.
 */
(function () {
  'use strict';
  var CE = window.CE;
  var el = CE.ui.el;

  var MODELS = [
    { id: 'claude-sonnet-5', label: 'Sonnet 5 — recommended' },
    { id: 'claude-opus-4-8', label: 'Opus 4.8 — deepest' },
    { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5 — fastest/cheapest' }
  ];

  /* ── helpers ─────────────────────────────────────────────────────── */

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function todayStamp() {
    var d = new Date();
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }

  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  /* ── client cards ────────────────────────────────────────────────── */

  function openEditClient(clientId) {
    var s = CE.store.get();
    var client = null;
    for (var i = 0; i < s.clients.length; i++) {
      if (s.clients[i].id === clientId) { client = s.clients[i]; break; }
    }
    if (!client) return;

    var form = CE.clientForm(client);
    CE.ui.modal({
      title: 'Edit ' + client.name,
      body: form,
      wide: true,
      actions: [
        { label: 'Cancel' },
        {
          label: 'Save changes',
          class: 'btn-primary',
          onClick: function () {
            var patch = CE.readClientForm(form);
            CE.store.set(function (st) {
              var c = null;
              for (var j = 0; j < st.clients.length; j++) {
                if (st.clients[j].id === clientId) { c = st.clients[j]; break; }
              }
              if (!c) return;
              // patch carries no id/createdAt/demo, so those survive the assign
              Object.assign(c, patch);
            });
            CE.ui.toast('Client "' + patch.name + '" updated', 'good');
          }
        }
      ]
    });
  }

  function deleteClient(client) {
    CE.ui.confirm(
      'Delete "' + client.name + '"? Every idea, brief, draft, scheduled post and coach ' +
      'conversation for this client will be permanently removed. This cannot be undone.',
      'Delete client'
    ).then(function (ok) {
      if (!ok) return;
      CE.store.removeClient(client.id);
      CE.ui.toast('Client "' + client.name + '" deleted');
    });
  }

  function clientCard(client, isActive) {
    var d = CE.store.data(client.id);
    var card = el('div', { class: 'card' });

    // header: color dot + name + badges
    var head = el('div', { class: 'row', style: { alignItems: 'center', marginBottom: '10px' } },
      el('span', {
        style: {
          width: '12px', height: '12px', borderRadius: '50%', flexShrink: '0',
          background: client.color || '#898781'
        }
      }),
      el('span', { class: 'ellipsis', style: { fontWeight: '650', fontSize: '15px', minWidth: '0' }, text: client.name }),
      el('span', { class: 'spacer', style: { flex: '1' } }),
      isActive ? el('span', { class: 'badge' },
        el('span', { class: 'swatch', style: { background: 'var(--good)' } }), 'Active') : null,
      client.demo ? el('span', { class: 'tag', text: 'Demo' }) : null);
    card.appendChild(head);

    // profile lines
    var lines = el('div', { class: 'stack', style: { gap: '3px', marginBottom: '12px' } });
    if (client.industry) lines.appendChild(el('div', { class: 'muted small', text: client.industry }));
    if (client.niche) lines.appendChild(el('div', { class: 'muted small ellipsis', text: client.niche }));
    if (client.audience) lines.appendChild(el('div', { class: 'muted small ellipsis', text: 'Audience: ' + client.audience }));
    if (!client.industry && !client.niche && !client.audience) {
      lines.appendChild(el('div', { class: 'muted small', text: 'No profile details yet — edit to fill in the brief.' }));
    }
    card.appendChild(lines);

    // platform badges
    var plats = el('div', { class: 'row wrap', style: { gap: '6px', marginBottom: '12px' } });
    (client.platforms || []).forEach(function (pid) {
      plats.appendChild(CE.ui.platformBadge(pid));
    });
    if (!(client.platforms || []).length) plats.appendChild(el('span', { class: 'muted small', text: 'No platforms selected' }));
    card.appendChild(plats);

    // content counts
    card.appendChild(el('div', {
      class: 'muted small mono',
      style: { marginBottom: '14px' },
      text: plural(d.ideas.length, 'idea') + ' · ' + plural(d.drafts.length, 'draft') + ' · ' + d.schedule.length + ' scheduled'
    }));

    // actions
    var actions = el('div', { class: 'row wrap', style: { gap: '8px' } });
    if (!isActive) {
      actions.appendChild(el('button', {
        class: 'btn btn-sm',
        text: 'Set active',
        onclick: function () {
          CE.store.set(function (st) { st.activeClientId = client.id; });
          CE.ui.toast('Now working on "' + client.name + '"', 'good');
        }
      }));
    }
    actions.appendChild(el('button', {
      class: 'btn btn-sm',
      text: 'Edit',
      onclick: function () { openEditClient(client.id); }
    }));
    actions.appendChild(el('button', {
      class: 'btn btn-sm btn-danger',
      text: 'Delete',
      onclick: function () { deleteClient(client); }
    }));
    card.appendChild(actions);

    return card;
  }

  function clientsSection(container) {
    var s = CE.store.get();
    var active = CE.store.client();

    if (!s.clients.length) {
      container.appendChild(el('div', { class: 'card' },
        el('div', { class: 'empty' },
          el('div', { class: 'empty-icon', html: CE.icon('users') }),
          el('h3', { text: 'No clients yet' }),
          el('p', { text: 'Add your first client to start discovering trends, researching topics and drafting content for them.' }),
          el('button', {
            class: 'btn btn-primary',
            text: 'Add your first client',
            onclick: function () { CE.openAddClient(); }
          }))));
      return;
    }

    var grid = el('div', { class: 'grid cols-2' });
    s.clients.forEach(function (c) {
      grid.appendChild(clientCard(c, !!(active && active.id === c.id)));
    });
    container.appendChild(grid);
  }

  /* ── coach AI settings card ──────────────────────────────────────── */

  function coachCard() {
    var settings = CE.store.get().settings || {};
    var card = el('div', { class: 'card' });
    card.appendChild(el('div', { class: 'card-title', text: 'Coach AI' }));

    // connection status line
    var connected = !!(CE.coach && typeof CE.coach.connected === 'function' && CE.coach.connected());
    card.appendChild(el('div', { class: 'row', style: { marginBottom: '14px' } },
      el('span', {
        style: {
          width: '9px', height: '9px', borderRadius: '50%', flexShrink: '0',
          background: connected ? 'var(--good)' : 'var(--ink-3)'
        }
      }),
      el('span', {
        class: 'small',
        style: { color: connected ? 'var(--good)' : 'var(--ink-3)', fontWeight: '600' },
        text: connected ? 'Connected — Coach is ready' : 'Not connected'
      })));

    // API key field with show/hide toggle
    var keyInput = el('input', {
      class: 'input',
      type: 'password',
      value: settings.apiKey || '',
      placeholder: 'sk-ant-…',
      autocomplete: 'off',
      spellcheck: 'false',
      style: { flex: '1', minWidth: '0' }
    });
    var toggleBtn = el('button', {
      class: 'btn btn-ghost btn-sm',
      type: 'button',
      text: 'Show',
      onclick: function () {
        var hidden = keyInput.type === 'password';
        keyInput.type = hidden ? 'text' : 'password';
        this.textContent = hidden ? 'Hide' : 'Show';
      }
    });
    card.appendChild(el('div', { class: 'field' },
      el('label', { text: 'Anthropic API key' }),
      el('div', { class: 'row', style: { gap: '8px' } }, keyInput, toggleBtn),
      el('span', { class: 'hint', text: 'Stored only in this browser (localStorage). It never leaves this device except to call the Anthropic API.' })));

    // model select
    var modelSel = el('select', { class: 'select' });
    MODELS.forEach(function (m) {
      var o = el('option', { value: m.id, text: m.label });
      if ((settings.model || 'claude-sonnet-5') === m.id) o.selected = true;
      modelSel.appendChild(o);
    });
    card.appendChild(el('div', { class: 'field' },
      el('label', { text: 'Model' }),
      modelSel,
      el('span', { class: 'hint', text: 'Sonnet 5 is the best balance of quality and cost for coaching.' })));

    // save + test
    var actions = el('div', { class: 'row wrap', style: { gap: '8px' } });
    actions.appendChild(el('button', {
      class: 'btn btn-primary',
      text: 'Save',
      onclick: function () {
        var key = keyInput.value.trim();
        var model = modelSel.value;
        CE.store.set(function (st) {
          st.settings = st.settings || {};
          st.settings.apiKey = key;
          st.settings.model = model;
        });
        CE.ui.toast(key ? 'Coach connected' : 'Settings saved', 'good');
      }
    }));
    if (settings.apiKey) {
      actions.appendChild(el('button', {
        class: 'btn btn-sm',
        text: 'Test connection',
        onclick: function () {
          CE.openCoach('Say hello and confirm you can see my client profile.');
        }
      }));
    }
    card.appendChild(actions);

    card.appendChild(el('div', { class: 'hint mt' },
      'Don’t have a key? Create one at ',
      el('a', { href: 'https://console.anthropic.com', target: '_blank', rel: 'noopener', text: 'console.anthropic.com' }),
      ' — it takes about a minute.'));

    return card;
  }

  /* ── data card ───────────────────────────────────────────────────── */

  function exportData() {
    var json = CE.store.exportJSON();
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = el('a', { href: url, download: 'content-engine-export-' + todayStamp() + '.json' });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    CE.ui.toast('Export downloaded', 'good');
  }

  function dataCard() {
    var card = el('div', { class: 'card' });
    card.appendChild(el('div', { class: 'card-title', text: 'Data' }));
    card.appendChild(el('p', {
      class: 'muted small',
      style: { marginBottom: '14px' },
      text: 'Everything lives in this browser. Export regularly to back up, or move your workspace to another device via import.'
    }));

    var fileInput = el('input', {
      type: 'file',
      accept: '.json,application/json',
      style: { display: 'none' },
      onchange: function () {
        var f = this.files && this.files[0];
        this.value = '';
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            CE.store.importJSON(String(reader.result));
            CE.ui.toast('Data imported', 'good');
          } catch (e) {
            CE.ui.toast('Import failed: ' + (e && e.message ? e.message : 'invalid file'), 'err');
          }
        };
        reader.onerror = function () { CE.ui.toast('Could not read that file', 'err'); };
        reader.readAsText(f);
      }
    });
    card.appendChild(fileInput);

    var row = el('div', { class: 'row wrap', style: { gap: '8px' } });
    row.appendChild(el('button', { class: 'btn', text: 'Export data', onclick: exportData }));
    row.appendChild(el('button', {
      class: 'btn',
      text: 'Import data',
      onclick: function () { fileInput.click(); }
    }));
    row.appendChild(el('button', {
      class: 'btn btn-danger',
      text: 'Reset everything',
      onclick: function () {
        CE.ui.confirm(
          'Reset Content Engine? ALL clients, ideas, briefs, drafts, schedules, coach threads ' +
          'and settings on this device will be wiped and replaced with the demo workspace. ' +
          'There is no undo — export your data first if you might need it.',
          'Reset everything'
        ).then(function (ok) {
          if (!ok) return;
          CE.store.resetAll();
          CE.ui.toast('Workspace reset');
        });
      }
    }));
    card.appendChild(row);

    card.appendChild(el('div', {
      class: 'hint mt',
      text: 'Importing replaces the current workspace with the file’s contents. Only valid Content Engine exports are accepted.'
    }));
    return card;
  }

  /* ── about card ──────────────────────────────────────────────────── */

  function aboutCard() {
    var card = el('div', { class: 'card' });
    card.appendChild(el('div', { class: 'card-title', text: 'About' }));
    card.appendChild(el('div', { class: 'row', style: { marginBottom: '8px' } },
      el('span', { style: { fontWeight: '650' }, text: 'Content Engine' }),
      el('span', { class: 'muted small', text: '·' }),
      el('a', { class: 'small', href: 'https://content.thedylanewing.com', target: '_blank', rel: 'noopener', text: 'content.thedylanewing.com' })));
    card.appendChild(el('p', {
      class: 'muted small',
      style: { marginBottom: '10px' },
      text: 'A multi-client content marketing command center: Discover platform trends, Research topics into briefs, Create platform-ready drafts, and Plan the publishing calendar — with a Coach AI riding along at every step.'
    }));
    card.appendChild(el('div', {
      class: 'hint',
      text: 'All data lives locally in your browser, per device. Nothing is sent to a server unless you connect the Coach AI, which talks directly to the Anthropic API with your own key.'
    }));
    return card;
  }

  /* ── view ────────────────────────────────────────────────────────── */

  function render(container) {
    var s = CE.store.get();

    container.appendChild(el('div', { class: 'view-head' },
      el('div', {},
        el('h1', { text: 'Clients & Settings' }),
        el('div', {
          class: 'sub',
          text: s.clients.length
            ? 'Manage your ' + plural(s.clients.length, 'client') + ', the Coach AI connection and your local data.'
            : 'Add a client, connect the Coach AI and manage your local data.'
        })),
      el('div', { class: 'spacer' }),
      el('button', {
        class: 'btn btn-primary',
        html: CE.icon('plus') + '<span>Add client</span>',
        onclick: function () { CE.openAddClient(); }
      })));

    clientsSection(container);

    var settingsGrid = el('div', { class: 'grid cols-2 mt' });
    settingsGrid.appendChild(coachCard());
    settingsGrid.appendChild(el('div', { class: 'stack', style: { gap: '14px' } }, dataCard(), aboutCard()));
    container.appendChild(settingsGrid);
  }

  CE.views.clients = { id: 'clients', title: 'Clients', icon: 'users', render: render };
})();
