/* ==========================================================================
   ZUMS Computer Society — dashboard / admin sidebar
   Rendered into <aside class="side" id="panel-side"></aside>.
   Reads data-area ("dash" | "admin") and data-page from <body>.
   ========================================================================== */
(function () {
  'use strict';

  var body = document.body;
  var AREA = body.getAttribute('data-area');
  var PAGE = body.getAttribute('data-page') || '';
  var BASE = body.getAttribute('data-base') || '';
  var host = document.getElementById('panel-side');
  if (!host || (AREA !== 'dash' && AREA !== 'admin')) return;

  var D = window.ZCS || {};
  var me = D.me || { name: 'Member', uid: 'ZCS-0000-0000', position: 'Member' };

  var ICON = {
    grid:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
    user:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/></svg>',
    cash:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
    award: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="9" r="5"/><path d="M9 14l-2 7 5-3 5 3-2-7"/></svg>',
    ticket:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 000-4z"/><path d="M14 6v12" stroke-dasharray="2 3"/></svg>',
    claim: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h5"/></svg>',
    pen:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 19l7-7-4-4-7 7-1 5z"/><path d="M15 5l4 4"/></svg>',
    people:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="9" cy="8" r="3.4"/><path d="M2.5 20c0-3.4 3-5.2 6.5-5.2s6.5 1.8 6.5 5.2"/><path d="M17 11a3 3 0 100-6"/><path d="M18 20c0-2.4-.9-4-2.4-5"/></svg>',
    book:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5a2 2 0 012-2h13v18H6a2 2 0 01-2-2z"/><path d="M8 7h8M8 11h6"/></svg>',
    gear:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    log:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6h16M4 12h16M4 18h10"/></svg>'
  };

  var DASH = [
    { group: 'My membership', items: [
      { id: 'dash-home',  label: 'Overview',      href: 'dashboard/index.html',        icon: 'grid' },
      { id: 'dash-profile', label: 'Profile',     href: 'dashboard/profile.html',      icon: 'user' },
      { id: 'dash-fees',  label: 'Fees',          href: 'dashboard/fees.html',         icon: 'cash' },
      { id: 'dash-certs', label: 'Certificates',  href: 'dashboard/certificates.html', icon: 'award' },
      { id: 'dash-events', label: 'Event passes', href: 'dashboard/events.html',       icon: 'ticket' },
      { id: 'dash-claims', label: 'Reimbursements', href: 'dashboard/claims.html',     icon: 'claim' }
    ] },
    { group: 'Public', items: [
      { id: 'members',  label: 'My public profile', href: 'member.html?uid=' + me.uid, icon: 'user' },
      { id: 'leaderboard', label: 'Leaderboard',    href: 'leaderboard.html',          icon: 'award' }
    ] }
  ];

  var ADMIN = [
    { group: 'Overview', items: [
      { id: 'admin-home', label: 'Dashboard', href: 'admin/index.html', icon: 'grid' }
    ] },
    { group: 'Content', items: [
      { id: 'admin-content', label: 'Posts, events, wings', href: 'admin/content.html', icon: 'pen' },
      { id: 'admin-settings', label: 'Site settings', href: 'admin/settings.html', icon: 'gear' }
    ] },
    { group: 'People', items: [
      { id: 'admin-people', label: 'Members & registrations', href: 'admin/people.html', icon: 'people' },
      { id: 'admin-certs', label: 'Certifications', href: 'admin/certificates.html', icon: 'award' }
    ] },
    { group: 'Money', items: [
      { id: 'admin-finance', label: 'Finance', href: 'admin/finance.html', icon: 'cash' }
    ] },
    { group: 'Operations', items: [
      { id: 'admin-audit', label: 'Audit log', href: 'admin/audit.html', icon: 'log' },
      { id: 'resources', label: 'Documents', href: 'resources.html', icon: 'book' }
    ] }
  ];

  var groups = AREA === 'admin' ? ADMIN : DASH;

  var who = AREA === 'admin'
    ? { name: 'Ayesha Siddiqua', sub: 'President · full admin', avatar: D.avatarFor ? D.avatarFor('Ayesha Siddiqua') : '' }
    : { name: me.name, sub: me.uid, avatar: D.avatarFor ? D.avatarFor(me.name) : '' };

  host.innerHTML =
    '<div class="side__who">' +
      '<img class="side__avatar" src="' + who.avatar + '" alt="">' +
      '<span>' +
        '<span class="side__name">' + who.name + '</span>' +
        '<span class="side__id">' + who.sub + '</span>' +
      '</span>' +
    '</div>' +
    groups.map(function (g) {
      return '<p class="side__group">' + g.group + '</p>' +
        '<ul class="side__nav">' + g.items.map(function (i) {
          return '<li><a href="' + BASE + i.href + '"' + (i.id === PAGE ? ' class="is-active" aria-current="page"' : '') + '>' +
            (ICON[i.icon] || '') + '<span>' + i.label + '</span></a></li>';
        }).join('') + '</ul>';
    }).join('') +
    '<div class="rule" style="margin:18px 0"></div>' +
    (AREA === 'dash'
      ? '<a class="btn-ghost btn-ghost--sm btn-ghost--block" href="' + BASE + 'admin/index.html">Admin panel</a>'
      : '<a class="btn-ghost btn-ghost--sm btn-ghost--block" href="' + BASE + 'dashboard/index.html">My dashboard</a>') +
    '<a class="btn-ghost btn-ghost--sm btn-ghost--block btn-ghost--danger" href="' + BASE + 'login.html" style="margin-top:8px">Sign out</a>';
})();
