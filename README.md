# ZUMS Computer Society — front end

Static HTML / CSS / JS / Bootstrap 5.3.3 front end for the ZCS club site.
No build step, no server required: open `index.html` in a browser, or serve the
folder with anything (`python -m http.server 8899`).

The design continues the club's existing registration page — acid green
(`#00ff41`) on near-black, Chakra Petch + Share Tech Mono, notched panels, the
TRY / FAIL / REPEAT loop — so the two feel like one product.

---

## Layout of the folder

```
web/
  index.html                 home
  about.html  wings.html  wing.html
  events.html  event.html  event-register.html
  blog.html  post.html  announcements.html
  members.html  member.html  committee.html  alumni.html  leaderboard.html
  projects.html  gallery.html  album.html  resources.html
  verify.html  finance.html  faq.html  contact.html
  signup.html  login.html  forgot.html  reset.html
  privacy.html  terms.html  404.html
  robots.txt  sitemap.xml  feed.xml

  dashboard/                 member area (data-area="dash")
    index.html  profile.html  fees.html
    certificates.html  events.html  claims.html

  admin/                     panel area (data-area="admin")
    index.html  content.html  people.html  finance.html
    certificates.html  audit.html  settings.html

  assets/
    css/fonts.css            self-hosted @font-face only
    css/style.css            the whole design system
    js/layout.js             navbar + footer + ambient, injected per page
    js/panel.js              dashboard / admin sidebar
    js/data.js               sample content (the future API payload)
    js/app.js                behaviour + card renderers
    vendor/bootstrap.min.css bootstrap.bundle.min.js   (5.3.3, local)
    fonts/                   woff2, latin + bengali subsets
    img/                     club logo, mascot, university marks, partner logos
```

## How a page is put together

Every page is thin. It declares where it sits, drops two placeholder elements,
and lets the shared scripts fill in the chrome:

```html
<body data-page="events" data-base="" data-area="site">
  <div id="site-nav"></div>
  <main id="main"> … page content … </main>
  <div id="site-foot"></div>

  <script src="assets/vendor/bootstrap.bundle.min.js"></script>
  <script src="assets/js/data.js"></script>
  <script src="assets/js/layout.js"></script>
  <script src="assets/js/app.js"></script>
  <script> /* page-specific rendering */ </script>
</body>
```

- `data-page` — highlights the matching nav / sidebar item.
- `data-base` — `""` at the root, `"../"` inside `dashboard/` and `admin/`.
- `data-area` — `site`, `dash` or `admin`; picks the header actions and decides
  whether `panel.js` renders a sidebar.

Script order matters: `data.js` → `layout.js` → `panel.js` (panel pages only) →
`app.js` → the page's own inline script.

## Where the content comes from

All of it is in `assets/js/data.js` under `window.ZCS` — wings, events, posts,
announcements, members, committees, alumni, projects, albums, documents, FAQs,
partners, certificates, the finance figures, one member's own record (`ZCS.me`),
and the admin-side rows. Each key maps cleanly onto one endpoint:

| Front end | Backend |
| --- | --- |
| `ZCS.events` | `GET /api/events` |
| `ZCS.posts` | `GET /api/blog` |
| `ZCS.members` | `GET /api/members` |
| `ZCS.me` | `GET /api/me` |
| `ZCS.ledger` | `GET /admin/finance/ledger` |

Replacing this file with `fetch()` calls is the whole migration for the list
pages.

**No photographs were supplied with the brief**, so covers and avatars are
generated as deterministic inline SVG by `ZCS.placeholder()` and
`ZCS.avatarFor()`. Drop real files into `assets/img/` and set `cover` / `photo`
on the records instead.

## What `app.js` gives you

Rendering helpers (return HTML strings, so a list is one `innerHTML` write):
`eventCard`, `postCard`, `wingCard`, `memberCard`, `projectCard`, `albumCard`,
`rankRow`, `partnerStrip`, `calendar`.

Behaviour, wired automatically on load:

- scroll reveal (`.reveal`), animated counters (`data-count`)
- filter + search lists (`ZCSUI.listController`)
- form validation (`data-rule="required|email|phone-bd|min:3|match:#other"`),
  a completion rail, and file drop with preview
- accordions, tab rails, image lightbox, countdowns
- copy-to-clipboard (`data-copy`), toasts, back-to-top

Validation is advisory. It saves a round trip; the server still owns the truth.

## Known front-end-only behaviour

- Every form calls `preventDefault()`, fakes a delay, and shows the success
  state the backend will eventually drive. A toast says so.
- `login.html` walks you into `dashboard/index.html` after a valid-looking
  submit — there is no auth.
- The pass and certificate "QR" images are a deterministic block matrix, not a
  real QR payload. The code printed beneath is the thing a door scanner should
  read once the backend issues genuine ones.
- The language toggle flips the document font stack and remembers the choice.
  The string swap lands when `lang/en.json` and `lang/bn.json` are wired up.
- `robots.txt`, `sitemap.xml` and `feed.xml` are static placeholders; the PHP app
  generates all three.

## Conventions worth keeping

- Bootstrap is loaded first, `style.css` second, so the club tokens win. Two
  Bootstrap class names collide with the design system and were renamed here —
  `.zcs-nav` (Bootstrap owns `.nav`) and `.toast-z` / `.toast-host`
  (Bootstrap owns `.toast`). Check `bootstrap.min.css` before adding a new
  single-word class.
- Everything is served from this origin — fonts, Bootstrap, icons — because
  campus networks block CDNs often enough to matter, and it keeps a future
  Content-Security-Policy at `'self'`.
- Colours, spacing and type live in `:root` in `style.css`. Change them there,
  not in a page.
- `prefers-reduced-motion` disables every animation, and a print stylesheet
  strips the chrome so a certificate or a fee history prints cleanly.

## Porting to the PHP app

`layout.js` `navHtml()` and `footHtml()` become
`views/partials/header.php` and `views/partials/footer.php` almost verbatim —
same markup, same class names. `panel.js` becomes the dashboard/admin sidebar
partial. After that `app.js` keeps only the interaction code and loses the
renderers, which become view partials.
