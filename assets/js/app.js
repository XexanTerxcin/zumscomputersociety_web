/* ==========================================================================
   ZUMS Computer Society — behaviour + renderers
   Depends on: data.js (window.ZCS), layout.js (window.zcsUrl / zcsEsc)

   Renderers return HTML strings rather than nodes so a page can drop a whole
   list into place with one innerHTML write. When the PHP backend lands these
   become the view partials and this file keeps only the interaction code.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.ZCS || {};
  var url = window.zcsUrl || function (p) { return p; };
  var esc = window.zcsEsc || function (s) { return String(s); };

  /* =========================================================== 1 helpers */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function param(name) {
    var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(window.location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
  }

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function d(v) { return v instanceof Date ? v : new Date(v); }

  function fmtDate(v) {
    var x = d(v);
    if (isNaN(x)) return '';
    return x.getDate() + ' ' + MON[x.getMonth()] + ' ' + x.getFullYear();
  }
  function fmtTime(v) {
    var x = d(v);
    if (isNaN(x)) return '';
    var h = x.getHours(), m = x.getMinutes();
    var ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12; if (h === 0) h = 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ap;
  }
  function fmtDateTime(v) { return fmtDate(v) + ' · ' + fmtTime(v); }

  function money(n, cur) {
    return (cur || 'BDT') + ' ' + Number(n).toLocaleString('en-US');
  }

  function toast(msg, bad) {
    var wrap = document.getElementById('toastWrap');
    if (!wrap) return;
    var t = document.createElement('div');
    t.className = 'toast-z' + (bad ? ' toast-z--bad' : '');
    t.setAttribute('role', 'status');
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(function () {
      t.style.transition = 'opacity .3s';
      t.style.opacity = '0';
      setTimeout(function () { t.remove(); }, 320);
    }, 3600);
  }

  /* A block matrix that reads as a scan code on screen. It is deliberately NOT
     a real QR payload — the pass code below it is the thing a door scanner
     should read until the backend issues genuine codes. */
  function fakeQr(seed) {
    var s = String(seed), n = 0, i, cells = '', size = 21, x, y, v;
    for (i = 0; i < s.length; i++) { n = (n * 31 + s.charCodeAt(i)) >>> 0; }
    var rnd = function () { n = (n * 1103515245 + 12345) >>> 0; return n / 4294967296; };
    for (y = 0; y < size; y++) {
      for (x = 0; x < size; x++) {
        var finder = (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8);
        if (finder) {
          var lx = x > size - 8 ? x - (size - 7) : x;
          var ly = y > size - 8 ? y - (size - 7) : y;
          var ring = (lx === 0 || lx === 6 || ly === 0 || ly === 6);
          var core = (lx > 1 && lx < 5 && ly > 1 && ly < 5);
          v = ring || core;
        } else {
          v = rnd() > 0.52;
        }
        if (v) cells += '<rect x="' + x + '" y="' + y + '" width="1" height="1"/>';
      }
    }
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 21" shape-rendering="crispEdges">' +
      '<rect width="21" height="21" fill="#fff"/><g fill="#000">' + cells + '</g></svg>'
    );
  }

  /* =========================================================== 2 renderers */

  function partnerStrip() {
    return (D.partners || []).map(function (p) {
      return '<div class="partners__cell" title="' + esc(p.name) + '">' +
        '<img src="' + url('assets/img/partners/' + p.file) + '" alt="' + esc(p.name) + '" loading="lazy">' +
      '</div>';
    }).join('');
  }

  function eventStatusTag(ev) {
    if (ev.status === 'past') return '<span class="tag tag--past">Past</span>';
    if (ev.taken >= ev.seats) return '<span class="tag tag--alert">Sold out</span>';
    var days = Math.ceil((d(ev.starts) - new Date()) / 86400000);
    if (days <= 14) return '<span class="tag tag--soon">In ' + days + ' days</span>';
    return '<span class="tag tag--live">Upcoming</span>';
  }

  function eventCard(ev) {
    var wing = D.wingBySlug ? D.wingBySlug(ev.wing) : null;
    return '' +
    '<article class="card-z reveal">' +
      '<a class="card-z__media" href="' + url('event.html?id=' + ev.id) + '">' +
        '<img src="' + D.placeholder(ev.id, ev.title) + '" alt="" loading="lazy">' +
        '<span class="card-z__badges">' + eventStatusTag(ev) +
          (wing ? '<span class="tag tag--cyan">' + esc(wing.name) + '</span>' : '') +
        '</span>' +
      '</a>' +
      '<div class="card-z__body">' +
        '<p class="card-z__meta"><span>' + fmtDate(ev.starts) + '</span><span>' + esc(ev.venue) + '</span></p>' +
        '<h3 class="card-z__title"><a href="' + url('event.html?id=' + ev.id) + '">' + esc(ev.title) + '</a></h3>' +
        '<p class="card-z__text">' + esc(ev.excerpt) + '</p>' +
        '<div class="card-z__foot">' +
          '<span class="tag">' + (ev.fee ? money(ev.fee) : 'Free') + '</span>' +
          '<span class="mono" style="font-size:11px;color:var(--ink-3)">' + ev.taken + '/' + ev.seats + ' seats</span>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function postCard(p) {
    return '' +
    '<article class="card-z reveal">' +
      '<a class="card-z__media" href="' + url('post.html?id=' + p.id) + '">' +
        '<img src="' + D.placeholder(p.id, p.category) + '" alt="" loading="lazy">' +
      '</a>' +
      '<div class="card-z__body">' +
        '<p class="card-z__meta"><span>' + esc(p.category) + '</span><span>' + p.read + ' min read</span></p>' +
        '<h3 class="card-z__title"><a href="' + url('post.html?id=' + p.id) + '">' + esc(p.title) + '</a></h3>' +
        '<p class="card-z__text">' + esc(p.excerpt) + '</p>' +
        '<div class="card-z__foot">' +
          '<span class="mono" style="font-size:11px;color:var(--ink-3)">' + esc(p.author) + '</span>' +
          '<span class="mono" style="font-size:11px;color:var(--ink-3)">' + fmtDate(p.date) + '</span>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  var WING_ICON = {
    code:     '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6"/></svg>',
    brackets: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 4H6a2 2 0 00-2 2v4l-2 2 2 2v4a2 2 0 002 2h2M16 4h2a2 2 0 012 2v4l2 2-2 2v4a2 2 0 01-2 2h-2"/></svg>',
    chip:     '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 2v3M14 2v3M10 19v3M14 19v3M2 10h3M2 14h3M19 10h3M19 14h3"/></svg>',
    shield:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l8 3v6c0 5-3.5 8.2-8 9-4.5-.8-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    cpu:      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></svg>',
    pen:      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 19l7-7-4-4-7 7-1 5z"/><path d="M15 5l4 4"/><path d="M3 21h8"/></svg>'
  };

  function wingCard(w) {
    return '' +
    '<a class="wing reveal" href="' + url('wing.html?slug=' + w.slug) + '">' +
      '<span class="wing__icon">' + (WING_ICON[w.icon] || WING_ICON.code) + '</span>' +
      '<h3 class="wing__name">' + esc(w.name) + '</h3>' +
      '<p class="wing__text">' + esc(w.blurb) + '</p>' +
      '<p class="card-z__meta" style="margin-bottom:10px"><span>' + w.members + ' members</span><span>Lead: ' + esc(w.lead) + '</span></p>' +
      '<span class="wing__more">Open wing &rarr;</span>' +
    '</a>';
  }

  function memberCard(m) {
    var wing = D.wingBySlug ? D.wingBySlug(m.wing) : null;
    return '' +
    '<a class="member reveal" href="' + url('member.html?uid=' + m.uid) + '">' +
      '<img class="member__photo" src="' + D.avatarFor(m.name) + '" alt="" loading="lazy">' +
      '<h3 class="member__name">' + esc(m.name) + '</h3>' +
      '<p class="member__role">' + esc(m.position) + '</p>' +
      '<p class="member__id">' + esc(m.uid) + '</p>' +
      '<div class="member__skills">' +
        (wing ? '<span class="tag tag--cyan">' + esc(wing.name) + '</span>' : '') +
      '</div>' +
    '</a>';
  }

  function projectCard(p) {
    var wing = D.wingBySlug ? D.wingBySlug(p.wing) : null;
    var tone = p.status === 'live' ? 'tag--live' : (p.status === 'research' ? 'tag--violet' : 'tag--past');
    return '' +
    '<article class="card-z reveal">' +
      '<div class="card-z__media">' +
        '<img src="' + D.placeholder(p.id, p.name) + '" alt="" loading="lazy">' +
        '<span class="card-z__badges"><span class="tag ' + tone + '">' + esc(p.status) + '</span></span>' +
      '</div>' +
      '<div class="card-z__body">' +
        '<p class="card-z__meta"><span>' + p.year + '</span>' + (wing ? '<span>' + esc(wing.name) + '</span>' : '') + '</p>' +
        '<h3 class="card-z__title">' + esc(p.name) + '</h3>' +
        '<p class="card-z__text">' + esc(p.blurb) + '</p>' +
        '<div class="card-z__foot">' +
          '<span style="display:flex;gap:5px;flex-wrap:wrap">' +
            p.stack.map(function (s) { return '<span class="tag">' + esc(s) + '</span>'; }).join('') +
          '</span>' +
          '<span class="mono" style="font-size:11px;color:var(--ink-3)">' + p.team + ' people</span>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function albumCard(a) {
    return '' +
    '<article class="card-z reveal">' +
      '<a class="card-z__media" href="' + url('album.html?id=' + a.id) + '">' +
        '<img src="' + D.placeholder(a.id, a.title) + '" alt="" loading="lazy">' +
        '<span class="card-z__badges"><span class="tag">' + a.count + ' photos</span></span>' +
      '</a>' +
      '<div class="card-z__body">' +
        '<p class="card-z__meta"><span>' + fmtDate(a.date) + '</span></p>' +
        '<h3 class="card-z__title"><a href="' + url('album.html?id=' + a.id) + '">' + esc(a.title) + '</a></h3>' +
      '</div>' +
    '</article>';
  }

  function rankRow(m, i) {
    var wing = D.wingBySlug ? D.wingBySlug(m.wing) : null;
    return '' +
    '<a class="rank' + (i < 3 ? ' rank--' + (i + 1) : '') + '" href="' + url('member.html?uid=' + m.uid) + '">' +
      '<span class="rank__pos">' + (i + 1) + '</span>' +
      '<img class="rank__avatar" src="' + D.avatarFor(m.name) + '" alt="">' +
      '<span>' +
        '<span class="rank__name" style="display:block">' + esc(m.name) + '</span>' +
        '<span class="rank__sub">' + esc(wing ? wing.name : m.position) + '</span>' +
      '</span>' +
      '<span class="rank__pts">' + m.points + ' pts</span>' +
    '</a>';
  }

  /* month grid for events.html */
  function calendar(host, year, month) {
    var first = new Date(year, month, 1);
    var startDow = first.getDay();
    var daysIn = new Date(year, month + 1, 0).getDate();
    var prevDays = new Date(year, month, 0).getDate();
    var today = new Date();
    var cells = [];
    var i;

    for (i = startDow - 1; i >= 0; i--) cells.push({ n: prevDays - i, muted: true, date: null });
    for (i = 1; i <= daysIn; i++) cells.push({ n: i, muted: false, date: new Date(year, month, i) });
    while (cells.length % 7 !== 0) cells.push({ n: cells.length % 7, muted: true, date: null });

    var dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var html = '' +
      '<div class="cal__head">' +
        '<button class="btn-ghost btn-ghost--sm" type="button" data-cal="-1">&larr; Prev</button>' +
        '<span class="cal__month">' + MONTHS[month] + ' ' + year + '</span>' +
        '<button class="btn-ghost btn-ghost--sm" type="button" data-cal="1">Next &rarr;</button>' +
      '</div>' +
      '<div class="cal__grid">' +
        dows.map(function (x) { return '<div class="cal__dow">' + x + '</div>'; }).join('') +
        cells.map(function (c) {
          var evs = '';
          if (c.date) {
            evs = (D.events || []).filter(function (ev) {
              var s = d(ev.starts);
              return s.getFullYear() === c.date.getFullYear() && s.getMonth() === c.date.getMonth() && s.getDate() === c.date.getDate();
            }).map(function (ev) {
              return '<a class="cal__ev' + (ev.status === 'past' ? ' cal__ev--past' : '') + '" ' +
                'href="' + url('event.html?id=' + ev.id) + '" title="' + esc(ev.title) + '">' + esc(ev.title) + '</a>';
            }).join('');
          }
          var isToday = c.date && c.date.toDateString() === today.toDateString();
          return '<div class="cal__cell' + (c.muted ? ' is-muted' : '') + (isToday ? ' is-today' : '') + '">' +
            '<span class="cal__daynum">' + c.n + '</span>' + evs + '</div>';
        }).join('') +
      '</div>';

    host.innerHTML = html;
    $$('[data-cal]', host).forEach(function (b) {
      b.addEventListener('click', function () {
        var step = parseInt(b.getAttribute('data-cal'), 10);
        var m2 = month + step, y2 = year;
        if (m2 < 0) { m2 = 11; y2--; }
        if (m2 > 11) { m2 = 0; y2++; }
        calendar(host, y2, m2);
        observeReveals();
      });
    });
  }

  /* ========================================================= 3 behaviours */

  var io = null;
  function observeReveals() {
    var items = $$('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    }
    items.forEach(function (el) { io.observe(el); });
  }

  function counters() {
    $$('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      var run = function () {
        var start = performance.now(), dur = 1400;
        var tick = function (now) {
          var t = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-US');
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      if (!('IntersectionObserver' in window)) { el.textContent = target.toLocaleString('en-US'); return; }
      var o = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { run(); o.disconnect(); }
      }, { threshold: 0.4 });
      o.observe(el);
    });
  }

  function copyButtons() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-copy]');
      if (!btn) return;
      var text = btn.getAttribute('data-copy');
      var done = function () {
        var old = btn.textContent;
        btn.classList.add('is-done');
        btn.textContent = 'Copied';
        setTimeout(function () { btn.classList.remove('is-done'); btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { toast('Copy blocked by the browser', true); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { toast('Copy blocked by the browser', true); }
        ta.remove();
      }
    });
  }

  function accordions() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.acc__btn');
      if (!btn) return;
      var acc = btn.parentNode;
      var open = acc.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  function tabs() {
    $$('.tabs').forEach(function (rail) {
      var scope = rail.getAttribute('data-tabs') || '';
      rail.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-tab]');
        if (!btn) return;
        $$('button[data-tab]', rail).forEach(function (b) {
          b.classList.toggle('is-active', b === btn);
          b.setAttribute('aria-selected', String(b === btn));
        });
        var want = btn.getAttribute('data-tab');
        $$('[data-tabpane' + (scope ? '-group="' + scope + '"' : '') + ']').forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-tabpane') === want ||
                                          p.getAttribute('data-tabpane-group') === scope && p.getAttribute('data-tabpane') === want);
        });
        observeReveals();
      });
    });
  }

  function lightbox() {
    var box = null;
    var items = [];
    var idx = 0;

    function ensure() {
      if (box) return box;
      box = document.createElement('div');
      box.className = 'lightbox';
      box.innerHTML =
        '<button class="lightbox__close" type="button" aria-label="Close">&times;</button>' +
        '<button class="lightbox__prev" type="button" aria-label="Previous">&#8249;</button>' +
        '<button class="lightbox__next" type="button" aria-label="Next">&#8250;</button>' +
        '<img alt=""><p class="lightbox__cap"></p>';
      document.body.appendChild(box);
      box.addEventListener('click', function (e) {
        if (e.target === box || e.target.closest('.lightbox__close')) close();
        if (e.target.closest('.lightbox__prev')) step(-1);
        if (e.target.closest('.lightbox__next')) step(1);
      });
      document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      });
      return box;
    }
    function show() {
      var el = items[idx];
      $('img', box).src = el.getAttribute('data-full') || $('img', el).src;
      $('.lightbox__cap', box).textContent = el.getAttribute('data-cap') || '';
    }
    function step(n) { idx = (idx + n + items.length) % items.length; show(); }
    function close() { box.classList.remove('is-open'); document.body.style.overflow = ''; }

    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-lightbox]');
      if (!a) return;
      e.preventDefault();
      ensure();
      items = $$('[data-lightbox="' + a.getAttribute('data-lightbox') + '"]');
      idx = items.indexOf(a);
      show();
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  }

  function countdowns() {
    var hosts = $$('[data-countdown]');
    if (!hosts.length) return;
    var units = [['days', 86400000], ['hrs', 3600000], ['min', 60000], ['sec', 1000]];
    var render = function () {
      hosts.forEach(function (h) {
        var left = d(h.getAttribute('data-countdown')) - new Date();
        if (left <= 0) { h.innerHTML = '<span class="tag tag--live">Happening now</span>'; return; }
        h.innerHTML = units.map(function (u) {
          var v = Math.floor(left / u[1]); left -= v * u[1];
          return '<div class="countdown__unit"><div class="countdown__num">' +
            (v < 10 ? '0' : '') + v + '</div><div class="countdown__lbl">' + u[0] + '</div></div>';
        }).join('');
      });
    };
    render();
    setInterval(render, 1000);
  }

  /* Filter + search controller.
     <div data-list="events"> renders through a hook registered by the page. */
  function listController(cfg) {
    var host = $(cfg.host);
    if (!host) return null;
    var state = { q: '', filter: 'all', sort: cfg.defaultSort || null };

    function apply() {
      var rows = cfg.source().filter(function (row) {
        if (state.filter !== 'all' && !cfg.matchFilter(row, state.filter)) return false;
        if (state.q && !cfg.matchQuery(row, state.q.toLowerCase())) return false;
        return true;
      });
      if (cfg.sorter && state.sort) rows = rows.slice().sort(function (a, b) { return cfg.sorter(a, b, state.sort); });
      host.innerHTML = rows.length
        ? rows.map(cfg.render).join('')
        : '<div class="empty" style="grid-column:1/-1">Nothing matches that. Try a different filter.</div>';
      var out = $(cfg.countHost);
      if (out) out.textContent = rows.length + (rows.length === 1 ? ' result' : ' results');
      observeReveals();
      if (cfg.after) cfg.after(rows);
    }

    $$(cfg.chips || '[data-filter]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        $$(cfg.chips || '[data-filter]').forEach(function (c) { c.classList.toggle('is-active', c === chip); });
        state.filter = chip.getAttribute('data-filter');
        apply();
      });
    });

    var search = $(cfg.search || '[data-search]');
    if (search) {
      var t;
      search.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () { state.q = search.value.trim(); apply(); }, 140);
      });
    }

    var sorter = $(cfg.sortSelect || '[data-sort]');
    if (sorter) {
      sorter.addEventListener('change', function () { state.sort = sorter.value; apply(); });
    }

    apply();
    return { apply: apply, state: state };
  }

  /* Generic client-side form validation. Rules live on the field:
       data-rule="required|email|phone-bd|min:3|match:#other"
     Server-side validation still owns the truth; this only saves a round trip. */
  var RULES = {
    required: function (v) { return v.trim().length > 0 ? null : 'This field is required.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'Enter a working email address.'; },
    'phone-bd': function (v) { return /^01[3-9]\d{8}$/.test(v.replace(/[\s-]/g, '')) ? null : 'Enter a Bangladeshi mobile number, like 01712345678.'; },
    url: function (v) { return !v || /^https?:\/\/\S+$/.test(v.trim()) ? null : 'Enter a full URL starting with http.'; }
  };

  function validateField(field) {
    var rules = (field.getAttribute('data-rule') || '').split('|').filter(Boolean);
    var v;
    if (field.type === 'checkbox') {
      v = field.checked ? 'on' : '';
    } else if (field.type === 'radio') {
      // the rule sits on the first radio but the answer belongs to the group
      var picked = (field.form || document).querySelector('input[name="' + field.name + '"]:checked');
      v = picked ? picked.value : '';
    } else {
      v = field.value || '';
    }
    var msg = null, i, r, arg;

    for (i = 0; i < rules.length; i++) {
      r = rules[i];
      if (r.indexOf('min:') === 0) {
        arg = parseInt(r.slice(4), 10);
        if (v.trim().length < arg) { msg = 'Use at least ' + arg + ' characters.'; break; }
        continue;
      }
      if (r.indexOf('match:') === 0) {
        var other = $(r.slice(6));
        if (other && other.value !== v) { msg = 'The two values do not match.'; break; }
        continue;
      }
      if (RULES[r]) {
        // an optional field only runs its format rule once it has content
        if (r !== 'required' && !v.trim()) continue;
        msg = RULES[r](v);
        if (msg) break;
      }
    }

    var err = document.getElementById('err-' + field.id);
    if (err) {
      err.textContent = msg || '';
      err.classList.toggle('is-shown', !!msg);
    }
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  function forms() {
    $$('form[data-validate]').forEach(function (form) {
      var fields = $$('[data-rule]', form);

      fields.forEach(function (f) {
        f.addEventListener('blur', function () { validateField(f); });
        f.addEventListener('input', function () {
          if (f.getAttribute('aria-invalid') === 'true') validateField(f);
          progress(form);
        });
        f.addEventListener('change', function () { progress(form); });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = fields.map(validateField).every(Boolean);
        var slot = $('.alert-slot', form) || $('.alert-slot');

        if (!ok) {
          if (slot) slot.innerHTML = '<div class="alert-z">Some fields need fixing. They are marked below.</div>';
          var bad = $('[aria-invalid="true"]', form);
          if (bad) bad.focus();
          return;
        }

        // Front-end only: there is no endpoint yet, so we show the success
        // state the backend will eventually drive.
        var btn = $('[type="submit"]', form);
        if (btn) { btn.classList.add('is-busy'); btn.disabled = true; }

        setTimeout(function () {
          if (btn) { btn.classList.remove('is-busy'); btn.disabled = false; }
          var done = form.getAttribute('data-done');
          if (done && document.getElementById(done)) {
            form.style.display = 'none';
            document.getElementById(done).style.display = 'block';
            document.getElementById(done).scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            if (slot) slot.innerHTML = '<div class="alert-z alert-z--ok">Sent. The panel will get back to you.</div>';
            form.reset();
            progress(form);
          }
          toast('Demo only — no backend is wired up yet.');
        }, 900);
      });

      progress(form);
    });
  }

  /* completion rail, if the form has one */
  function progress(form) {
    var fill = $('.steps__fill', form) || $('.steps__fill');
    if (!fill) return;
    var fields = $$('[data-rule*="required"]', form);
    if (!fields.length) return;
    var done = fields.filter(function (f) {
      if (f.type === 'checkbox') return f.checked;
      if (f.type === 'radio') return !!(f.form || document).querySelector('input[name="' + f.name + '"]:checked');
      return String(f.value || '').trim().length > 0;
    }).length;
    var pct = Math.round((done / fields.length) * 100);
    fill.style.width = pct + '%';

    var items = $$('.steps__item', form.ownerDocument);
    if (items.length) {
      var reached = Math.floor((pct / 100) * items.length);
      items.forEach(function (li, i) {
        li.classList.toggle('is-done', i < reached);
        li.classList.toggle('is-current', i === reached);
      });
    }
  }

  /* file drop with a preview */
  function drops() {
    $$('.drop').forEach(function (drop) {
      var input = $('.drop__input', drop);
      if (!input) return;
      var meta = $('.drop__meta', drop);
      var icon = $('.drop__icon', drop);

      var setFile = function (file) {
        if (!file) return;
        if (meta) meta.textContent = (file.size / 1048576).toFixed(1) + ' MB';
        drop.classList.add('is-set');
        if (icon && /^image\//.test(file.type)) {
          var img = document.createElement('img');
          img.className = 'drop__preview';
          img.alt = '';
          img.src = URL.createObjectURL(file);
          icon.replaceWith(img);
          icon = img;
        }
      };

      input.addEventListener('change', function () { setFile(input.files[0]); });
      ['dragenter', 'dragover'].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); });
      });
      ['dragleave', 'drop'].forEach(function (ev) {
        drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); });
      });
      drop.addEventListener('drop', function (e) {
        if (!e.dataTransfer || !e.dataTransfer.files.length) return;
        input.files = e.dataTransfer.files;
        setFile(e.dataTransfer.files[0]);
      });
    });
  }

  function backToTop() {
    var btn = $('.totop');
    if (!btn) return;
    var on = function () { btn.classList.toggle('is-on', window.scrollY > 520); };
    window.addEventListener('scroll', on, { passive: true });
    on();
  }

  /* typing effect for the home terminal */
  function typers() {
    $$('[data-type]').forEach(function (el) {
      var lines = JSON.parse(el.getAttribute('data-type'));
      var li = 0, ci = 0;
      el.textContent = '';
      var tick = function () {
        if (li >= lines.length) return;
        el.textContent = lines.slice(0, li).join('\n') + (li ? '\n' : '') + lines[li].slice(0, ci);
        ci++;
        if (ci > lines[li].length) { li++; ci = 0; setTimeout(tick, 420); return; }
        setTimeout(tick, 34);
      };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = lines.join('\n');
      } else {
        tick();
      }
    });
  }

  /* ============================================================= 4 export */
  window.ZCSUI = {
    $: $, $$: $$, param: param,
    fmtDate: fmtDate, fmtTime: fmtTime, fmtDateTime: fmtDateTime, money: money,
    MONTHS: MONTHS, MON: MON,
    toast: toast, fakeQr: fakeQr,
    partnerStrip: partnerStrip,
    eventCard: eventCard, eventStatusTag: eventStatusTag,
    postCard: postCard, wingCard: wingCard, memberCard: memberCard,
    projectCard: projectCard, albumCard: albumCard, rankRow: rankRow,
    calendar: calendar, listController: listController,
    observeReveals: observeReveals, validateField: validateField,
    wingIcon: function (k) { return WING_ICON[k] || WING_ICON.code; }
  };

  /* ================================================================ 5 boot */
  function boot() {
    observeReveals();
    counters();
    copyButtons();
    accordions();
    tabs();
    lightbox();
    countdowns();
    forms();
    drops();
    backToTop();
    typers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* Pages render their lists after data.js, so give them a hook to re-run the
     observer once new nodes exist. */
  window.addEventListener('load', function () { observeReveals(); counters(); });
})();
