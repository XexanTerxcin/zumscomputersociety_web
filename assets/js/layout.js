/* ==========================================================================
   ZUMS Computer Society — shared chrome
   Renders the ambient layers, the navbar and the footer into every page so
   forty-odd static files do not each carry their own copy of the menu.

   Each page declares where it sits:
     <body data-page="events" data-base="">          <- site root
     <body data-page="dash-fees" data-base="../">    <- one folder deep

   When this is ported onto the PHP app these two builders become
   views/partials/header.php and views/partials/footer.php verbatim.
   ========================================================================== */
(function () {
  'use strict';

  var body = document.body;
  var BASE = body.getAttribute('data-base') || '';
  var PAGE = body.getAttribute('data-page') || '';
  var AREA = body.getAttribute('data-area') || 'site'; // site | dash | admin

  /* --------------------------------------------------------------- club */
  var CLUB = {
    name: 'ZUMS Computer Society',
    short: 'ZCS',
    university: 'ZNRF University of Management Sciences',
    motto: ['TRY', 'FAIL', 'REPEAT'],
    email: 'zumscomputersociety@gmail.com',
    phone: '+880 1575-836669',
    address: 'ZNRF University of Management Sciences, Bishwo Road, Kanchan, Rupganj, Narayanganj',
    hours: 'Sun–Thu · 10:00–17:00',
    founded: 2023
  };
  window.ZCS_CLUB = CLUB;

  /* --------------------------------------------------------------- menu */
  var MENU = [
    { id: 'home', label: 'Home', href: 'index.html' },
    { id: 'about', label: 'About', href: 'about.html', sub: [
      { id: 'about', label: 'Who we are', href: 'about.html' },
      { id: 'wings', label: 'Wings', href: 'wings.html' },
      { id: 'committee', label: 'Executive committee', href: 'committee.html' },
      { id: 'alumni', label: 'Alumni', href: 'alumni.html' },
      { id: 'partners', label: 'Partners', href: 'about.html#partners' },
      { id: 'finance', label: 'Transparency', href: 'finance.html' }
    ] },
    { id: 'events', label: 'Events', href: 'events.html' },
    { id: 'projects', label: 'Projects', href: 'projects.html' },
    { id: 'blog', label: 'Read', href: 'blog.html', sub: [
      { id: 'blog', label: 'Blog', href: 'blog.html' },
      { id: 'announcements', label: 'Announcements', href: 'announcements.html' },
      { id: 'gallery', label: 'Gallery', href: 'gallery.html' },
      { id: 'resources', label: 'Documents', href: 'resources.html' }
    ] },
    { id: 'members', label: 'Members', href: 'members.html', sub: [
      { id: 'members', label: 'Directory', href: 'members.html' },
      { id: 'leaderboard', label: 'Leaderboard', href: 'leaderboard.html' },
      { id: 'verify', label: 'Verify a certificate', href: 'verify.html' }
    ] },
    { id: 'contact', label: 'Contact', href: 'contact.html', sub: [
      { id: 'contact', label: 'Write to us', href: 'contact.html' },
      { id: 'faq', label: 'FAQ', href: 'faq.html' }
    ] }
  ];

  /* -------------------------------------------------------------- icons */
  var ICON = {
    fb:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3 0-1.3-.1-2.45-.1-2.4 0-4.05 1.5-4.05 4.2v2.2H7.5V13h2.7v8h3.3z"/></svg>',
    ig:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
    li:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.75-1.95C20.4 8.75 21 11 21 14v7h-4v-6.2c0-1.5-.03-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V21H9z"/></svg>',
    yt:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2s-.2-1.4-.8-2c-.75-.8-1.6-.8-2-.85C16 4.2 12 4.2 12 4.2h-.01s-4 0-6.8.2c-.4.05-1.25.05-2 .85-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.5v1.6c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.75.8 1.75.77 2.2.86 1.6.15 6.8.2 6.8.2s4 0 6.8-.21c.4-.05 1.25-.05 2-.85.6-.6.8-2 .8-2s.2-1.65.2-3.3v-1.6c0-1.7-.2-3.3-.2-3.3zM9.9 14.4V8.9l5.2 2.76z"/></svg>',
    gh:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 015 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z"/></svg>',
    wa:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.84 9.84 0 004.68 1.2h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.47 2 12.04 2zm0 17.98h-.01a8.2 8.2 0 01-4.17-1.14l-.3-.18-3.18.83.85-3.1-.2-.32a8.14 8.14 0 01-1.25-4.35 8.17 8.17 0 018.17-8.16 8.16 8.16 0 018.15 8.17c0 4.5-3.66 8.25-8.06 8.25zm4.5-6.1c-.25-.13-1.46-.72-1.68-.8-.23-.09-.39-.13-.56.12s-.64.8-.78.97-.29.18-.53.06a6.67 6.67 0 01-1.97-1.21 7.4 7.4 0 01-1.36-1.7c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.44s-.56-1.34-.76-1.84c-.2-.48-.4-.41-.56-.42h-.47c-.17 0-.44.06-.67.31s-.87.85-.87 2.07.9 2.4 1.02 2.56c.13.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>',
    mail:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
    up:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>'
  };
  window.ZCS_ICON = ICON;

  /* ------------------------------------------------------------- helpers */
  function url(p) {
    if (/^(https?:|mailto:|tel:|#)/.test(p)) return p;
    return BASE + p;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  window.zcsUrl = url;
  window.zcsEsc = esc;

  /* -------------------------------------------------------------- render */
  function ambient() {
    if (document.querySelector('.ambient')) return;
    var d = document.createElement('div');
    d.className = 'ambient';
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML =
      '<div class="ambient__grid"></div>' +
      '<div class="ambient__scan"></div>' +
      '<div class="ambient__glow ambient__glow--a"></div>' +
      '<div class="ambient__glow ambient__glow--b"></div>';
    body.insertBefore(d, body.firstChild);
  }

  function navHtml() {
    var items = MENU.map(function (m) {
      var active = (m.id === PAGE) || (m.sub || []).some(function (s) { return s.id === PAGE; });
      var sub = '';
      if (m.sub) {
        sub = '<ul class="nav__sub">' + m.sub.map(function (s) {
          return '<li><a href="' + url(s.href) + '">' + esc(s.label) + '</a></li>';
        }).join('') + '</ul>';
      }
      return '<li class="' + (m.sub ? 'nav__has-sub' : '') + '">' +
        '<a class="nav__link' + (active ? ' is-active' : '') + '" href="' + url(m.href) + '"' +
        (active ? ' aria-current="page"' : '') + '>' + esc(m.label) + '</a>' + sub + '</li>';
    }).join('');

    var ctaLinks = (AREA === 'site')
      ? [['Join ZCS', 'signup.html', 'primary'], ['Log in', 'login.html', 'ghost']]
      : [['View site', 'index.html', 'ghost'], ['Sign out', 'login.html', 'ghost']];

    var cta = ctaLinks.map(function (c) {
      return '<a class="' + (c[2] === 'primary' ? 'btn-zcs btn-zcs--sm' : 'btn-ghost btn-ghost--sm') +
        '" href="' + url(c[1]) + '">' + esc(c[0]) + '</a>';
    }).join('');

    /* The same two actions repeated inside the drawer — the header copies are
       hidden on a narrow screen to leave room for the burger. */
    items += ctaLinks.map(function (c) {
      return '<li class="nav__cta"><a class="nav__link" href="' + url(c[1]) + '">' + esc(c[0]) + '</a></li>';
    }).join('');

    return '' +
      '<header class="zcs-nav" id="siteNav">' +
        '<div class="nav__inner">' +
          '<a class="nav__brand" href="' + url('index.html') + '">' +
            '<img class="nav__logo" src="' + url('assets/img/club-logo.png') + '" alt="' + esc(CLUB.name) + ' logo">' +
            '<span>' +
              '<span class="nav__name">' + esc(CLUB.short) + '</span>' +
              '<span class="nav__uni">Computer Society</span>' +
            '</span>' +
          '</a>' +
          '<ul class="nav__links" id="navLinks">' + items + '</ul>' +
          '<div class="nav__actions">' +
            '<div class="lang" role="group" aria-label="Language / ভাষা">' +
              '<button type="button" class="lang__btn is-active" data-set-lang="en" aria-pressed="true">EN</button>' +
              '<button type="button" class="lang__btn" data-set-lang="bn" aria-pressed="false">বাংলা</button>' +
            '</div>' + cta +
          '</div>' +
          '<button class="nav__burger" id="navBurger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="navLinks">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</header>';
  }

  function footHtml() {
    var quick = ['about', 'wings', 'events', 'projects', 'blog', 'members'];
    var quickLinks = MENU.concat(
      [{ id: 'wings', label: 'Wings', href: 'wings.html' }]
    ).filter(function (m) { return quick.indexOf(m.id) > -1; });

    var col1 = quickLinks.map(function (m) {
      return '<li><a href="' + url(m.href) + '">' + esc(m.label) + '</a></li>';
    }).join('');

    var col2 = [
      ['Join the club', 'signup.html'],
      ['Verify a certificate', 'verify.html'],
      ['Documents', 'resources.html'],
      ['Transparency report', 'finance.html'],
      ['FAQ', 'faq.html'],
      ['Privacy policy', 'privacy.html'],
      ['Terms', 'terms.html']
    ].map(function (p) {
      return '<li><a href="' + url(p[1]) + '">' + esc(p[0]) + '</a></li>';
    }).join('');

    return '' +
      '<footer class="foot">' +
        '<div class="foot__grid">' +
          '<div>' +
            '<img class="foot__logo" src="' + url('assets/img/club-logo.png') + '" alt="' + esc(CLUB.name) + '">' +
            '<p class="foot__blurb">' + esc(CLUB.name) + ' is the student technology community of ' +
              esc(CLUB.university) + '. We build, we break things, and we teach each other what we learned on the way.</p>' +
            '<div class="loop" aria-hidden="true">' +
              '<span class="loop__node" data-node="1">TRY</span><span class="loop__link"></span>' +
              '<span class="loop__node" data-node="2">FAIL</span><span class="loop__link"></span>' +
              '<span class="loop__node" data-node="3">REPEAT</span><span class="loop__return"></span>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<p class="foot__title">Explore</p>' +
            '<ul class="foot__list">' + col1 + '</ul>' +
          '</div>' +
          '<div>' +
            '<p class="foot__title">For members</p>' +
            '<ul class="foot__list">' + col2 + '</ul>' +
          '</div>' +
          '<div>' +
            '<p class="foot__title">Find us</p>' +
            '<p class="foot__meta"><strong>Office</strong>' + esc(CLUB.address) + '</p>' +
            '<p class="foot__meta"><strong>Hours</strong>' + esc(CLUB.hours) + '</p>' +
            '<p class="foot__meta"><strong>Email</strong><a href="mailto:' + CLUB.email + '">' + CLUB.email + '</a></p>' +
            '<p class="foot__meta"><strong>Phone</strong>' + esc(CLUB.phone) + '</p>' +
            '<div class="social">' +
              '<a href="#" aria-label="Facebook">' + ICON.fb + '</a>' +
              '<a href="#" aria-label="Instagram">' + ICON.ig + '</a>' +
              '<a href="#" aria-label="LinkedIn">' + ICON.li + '</a>' +
              '<a href="#" aria-label="YouTube">' + ICON.yt + '</a>' +
              '<a href="#" aria-label="GitHub">' + ICON.gh + '</a>' +
              '<a href="#" aria-label="WhatsApp community">' + ICON.wa + '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="foot__bar">' +
          '<p>&copy; ' + new Date().getFullYear() + ' ' + esc(CLUB.name) + ' · Built by the ZCS tech panel.</p>' +
          '<p>TRY · FAIL · REPEAT</p>' +
        '</div>' +
      '</footer>';
  }

  /* ---------------------------------------------------------------- boot */
  ambient();

  var navSlot = document.getElementById('site-nav');
  if (navSlot) navSlot.outerHTML = navHtml();

  var footSlot = document.getElementById('site-foot');
  if (footSlot) footSlot.outerHTML = footHtml();

  /* back-to-top + toast host, once per page */
  if (!document.querySelector('.totop')) {
    var top = document.createElement('button');
    top.className = 'totop';
    top.type = 'button';
    top.setAttribute('aria-label', 'Back to top');
    top.innerHTML = ICON.up;
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    document.body.appendChild(top);

    var toasts = document.createElement('div');
    toasts.className = 'toast-host';
    toasts.id = 'toastWrap';
    document.body.appendChild(toasts);
  }

  /* ------------------------------------------------------------ nav wiring */
  var burger = document.getElementById('navBurger');
  var links = document.getElementById('navLinks');

  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
  }

  /* On touch/narrow screens the first tap on a parent opens its submenu
     instead of navigating; the second tap follows the link. */
  Array.prototype.forEach.call(document.querySelectorAll('.nav__has-sub > .nav__link'), function (a) {
    a.addEventListener('click', function (e) {
      if (window.innerWidth > 1199) return;
      var li = a.parentNode;
      if (!li.classList.contains('is-open')) {
        e.preventDefault();
        li.classList.add('is-open');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!links || !links.classList.contains('is-open')) return;
    if (e.target.closest('#navLinks') || e.target.closest('#navBurger')) return;
    links.classList.remove('is-open');
    if (burger) { burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !links) return;
    links.classList.remove('is-open');
    if (burger) { burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  var nav = document.getElementById('siteNav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------- language toggle
     Front-end only for now: it flips the document font stack and remembers the
     choice. The real string swap lands when lang/en.json and lang/bn.json are
     wired to the PHP layer. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (btn) {
    btn.addEventListener('click', function () {
      var lang = btn.getAttribute('data-set-lang');
      document.documentElement.setAttribute('data-lang', lang);
      document.documentElement.setAttribute('lang', lang);
      try { localStorage.setItem('zcs-lang', lang); } catch (err) { /* private mode */ }
      Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
    });
  });

  try {
    var saved = localStorage.getItem('zcs-lang');
    if (saved === 'bn') {
      var bnBtn = document.querySelector('[data-set-lang="bn"]');
      if (bnBtn) bnBtn.click();
    }
  } catch (err) { /* storage blocked — English stays */ }
})();
