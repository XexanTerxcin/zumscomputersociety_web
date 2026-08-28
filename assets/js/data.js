/* ==========================================================================
   ZUMS Computer Society — front-end sample data
   Every list on the site renders from this file, so the markup stays thin and
   the swap to a real backend is one fetch() away:

       window.ZCS.events   ->  GET /api/events
       window.ZCS.posts    ->  GET /api/blog
       ...

   No photographs were supplied with the brief, so covers and avatars are
   generated as inline SVG (see placeholder / avatarFor below). Drop real files
   into assets/img/ and replace the `cover` / `photo` values.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------ artwork */
  var PALETTE = ['#00ff41', '#16e6c8', '#9d7bff', '#ffc53d', '#ff3b6b'];

  function hash(str) {
    var h = 0, i;
    for (i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
    return Math.abs(h);
  }

  /* A deterministic circuit-plate cover: same seed, same picture, every load. */
  function placeholder(seed, label, w, h) {
    w = w || 800; h = h || 450;
    var n = hash(seed);
    var accent = PALETTE[n % PALETTE.length];
    var lines = '';
    var i, x, y;
    for (i = 0; i < 9; i++) {
      x = ((n >> (i * 2)) % 90) + 5;
      y = ((n >> (i + 3)) % 80) + 10;
      lines += '<path d="M' + x + ' ' + y + ' h' + (8 + (n >> i) % 22) + ' v' + (6 + (n >> (i + 1)) % 18) + '" ' +
               'fill="none" stroke="' + accent + '" stroke-opacity=".5" stroke-width="0.7"/>' +
               '<circle cx="' + x + '" cy="' + y + '" r="1.4" fill="' + accent + '" fill-opacity=".8"/>';
    }
    var svg =
      /* width/height are declared so the file has an intrinsic size: without
         them a data-URI SVG collapses to the 300x150 default inside a
         max-width-only container such as the lightbox. */
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" ' +
        'viewBox="0 0 100 ' + Math.round(100 * h / w) + '" preserveAspectRatio="none">' +
        '<defs>' +
          '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#04120d"/><stop offset="1" stop-color="#020607"/>' +
          '</linearGradient>' +
          '<pattern id="p" width="6" height="6" patternUnits="userSpaceOnUse">' +
            '<path d="M6 0H0V6" fill="none" stroke="' + accent + '" stroke-opacity=".09" stroke-width=".5"/>' +
          '</pattern>' +
        '</defs>' +
        '<rect width="100" height="100" fill="url(#g)"/>' +
        '<rect width="100" height="100" fill="url(#p)"/>' +
        lines +
        '<text x="5" y="' + (Math.round(100 * h / w) - 5) + '" fill="' + accent + '" fill-opacity=".85" ' +
          'font-family="monospace" font-size="4.2">' + String(label || '').slice(0, 34).toUpperCase() + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* Initials avatar, same idea. */
  function avatarFor(name) {
    var initials = String(name).split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
    var accent = PALETTE[hash(name) % PALETTE.length];
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
        '<rect width="100" height="100" fill="#04120d"/>' +
        '<circle cx="50" cy="50" r="47" fill="none" stroke="' + accent + '" stroke-opacity=".35" stroke-width="1"/>' +
        '<text x="50" y="50" fill="' + accent + '" font-family="monospace" font-size="34" ' +
          'text-anchor="middle" dominant-baseline="central">' + initials + '</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ------------------------------------------------------------- content */

  var wings = [
    { slug: 'competitive-programming', name: 'Competitive Programming', lead: 'Nusrat Jahan',
      blurb: 'Weekly contests, editorial sessions and the ICPC squad. Beginners get a ladder, not a lecture.',
      icon: 'code', members: 64, tags: ['C++', 'Algorithms', 'ICPC'] },
    { slug: 'software-development', name: 'Software Development', lead: 'Yahya Rahman',
      blurb: 'Real projects with real users — the club site, the attendance app, whatever the campus actually needs.',
      icon: 'brackets', members: 58, tags: ['Web', 'Mobile', 'APIs'] },
    { slug: 'ai-ml', name: 'AI & Machine Learning', lead: 'Tanvir Hasan',
      blurb: 'Paper reading, Kaggle runs and the Friday build nights. We ship notebooks, then we ship products.',
      icon: 'chip', members: 47, tags: ['Python', 'PyTorch', 'LLMs'] },
    { slug: 'cybersecurity', name: 'Cybersecurity', lead: 'Sadia Islam',
      blurb: 'CTF practice, campus-network hygiene and responsible disclosure. Attack to learn, defend to keep.',
      icon: 'shield', members: 39, tags: ['CTF', 'Blue team', 'Forensics'] },
    { slug: 'robotics-iot', name: 'Robotics & IoT',  lead: 'Mahin Chowdhury',
      blurb: 'Line followers, drones and the sensor mesh in the lab. Solder first, simulate second.',
      icon: 'cpu', members: 41, tags: ['Arduino', 'ESP32', 'PCB'] },
    { slug: 'design-media', name: 'Design & Media', lead: 'Farhana Akter',
      blurb: 'Everything the club shows the world: posters, motion, photography, the brand you are looking at.',
      icon: 'pen', members: 33, tags: ['UI', 'Motion', 'Photo'] }
  ];

  var events = [
    { id: 'zcs-hack-2026', title: 'ZCS HackFest 2026', status: 'upcoming',
      starts: '2026-09-19T09:00:00', ends: '2026-09-20T18:00:00',
      venue: 'ZUMS Central Auditorium', wing: 'software-development', fee: 300, seats: 200, taken: 148,
      excerpt: 'Thirty-six hours, four tracks, one working prototype. Teams of three, campus-wide.',
      tags: ['Hackathon', 'Flagship'] },
    { id: 'intra-cp-contest-7', title: 'Intra-University CP Contest #7', status: 'upcoming',
      starts: '2026-09-05T15:00:00', ends: '2026-09-05T18:00:00',
      venue: 'Computer Lab 3', wing: 'competitive-programming', fee: 0, seats: 80, taken: 62,
      excerpt: 'Three hours, eight problems, one balloon per solve. Div-2 friendly problem set.',
      tags: ['Contest'] },
    { id: 'ctf-night-vol4', title: 'Capture The Flag Night — Vol. 4', status: 'upcoming',
      starts: '2026-09-12T19:00:00', ends: '2026-09-13T01:00:00',
      venue: 'Cyber Lab', wing: 'cybersecurity', fee: 150, seats: 60, taken: 60,
      excerpt: 'Web, forensics, reversing and a crypto challenge nobody has cracked in rehearsal.',
      tags: ['CTF', 'Sold out'] },
    { id: 'ai-buildfest', title: 'The Infinity AI BuildFest', status: 'upcoming',
      starts: '2026-10-03T10:00:00', ends: '2026-10-03T17:00:00',
      venue: 'Innovation Hub', wing: 'ai-ml', fee: 250, seats: 120, taken: 71,
      excerpt: 'Ship an LLM-backed tool between breakfast and the demo round. Mentors on the floor all day.',
      tags: ['Workshop', 'Partnered'] },
    { id: 'robotics-open-lab', title: 'Robotics Open Lab', status: 'past',
      starts: '2026-08-08T14:00:00', ends: '2026-08-08T18:00:00',
      venue: 'Robotics Lab', wing: 'robotics-iot', fee: 0, seats: 45, taken: 45,
      excerpt: 'Bring a broken thing. Leave with a working thing, or at least an oscilloscope trace.',
      tags: ['Open lab'] },
    { id: 'freshers-orientation-26', title: 'Freshers Orientation 2026', status: 'past',
      starts: '2026-07-21T11:00:00', ends: '2026-07-21T14:00:00',
      venue: 'ZUMS Central Auditorium', wing: null, fee: 0, seats: 400, taken: 372,
      excerpt: 'What the six wings do, how membership works, and why the motto is TRY / FAIL / REPEAT.',
      tags: ['Orientation'] },
    { id: 'figma-to-code', title: 'Figma to Code in One Afternoon', status: 'past',
      starts: '2026-06-14T15:00:00', ends: '2026-06-14T18:00:00',
      venue: 'Design Studio', wing: 'design-media', fee: 100, seats: 50, taken: 44,
      excerpt: 'Design tokens, auto-layout, and the handoff that does not make the developer cry.',
      tags: ['Workshop'] },
    { id: 'kaggle-sprint', title: 'Kaggle Sprint Weekend', status: 'past',
      starts: '2026-05-24T09:00:00', ends: '2026-05-25T21:00:00',
      venue: 'Computer Lab 1', wing: 'ai-ml', fee: 0, seats: 60, taken: 51,
      excerpt: 'One tabular competition, two days, and a leaderboard projected on the wall the whole time.',
      tags: ['Sprint'] }
  ];

  var posts = [
    { id: 'why-we-run-on-failure', title: 'Why a computer club should run on failure',
      author: 'Yahya Rahman', category: 'Culture', date: '2026-08-18', read: 6,
      excerpt: 'The motto is not decoration. Here is how TRY / FAIL / REPEAT shows up in how we run sessions, pick projects and hand over the panel.' },
    { id: 'icpc-prep-ladder', title: 'The ICPC prep ladder we actually used',
      author: 'Nusrat Jahan', category: 'Competitive Programming', date: '2026-08-09', read: 11,
      excerpt: 'Four hundred problems, ordered. What to solve in week one, what to skip until you can prove a complexity bound.' },
    { id: 'building-the-club-site', title: 'Building the club site without a framework',
      author: 'Yahya Rahman', category: 'Engineering', date: '2026-07-30', read: 9,
      excerpt: 'PHP 8, PDO, no build step. Why we chose boring technology for something the next panel has to maintain.' },
    { id: 'ctf-writeup-vol3', title: 'CTF Night Vol. 3 — full write-up',
      author: 'Sadia Islam', category: 'Cybersecurity', date: '2026-07-11', read: 14,
      excerpt: 'Every challenge, every intended solution, and the one unintended path that broke the scoreboard at 2am.' },
    { id: 'first-pcb', title: 'Your first PCB, from schematic to solder paste',
      author: 'Mahin Chowdhury', category: 'Robotics', date: '2026-06-28', read: 8,
      excerpt: 'KiCad basics, the DRC rules that matter for a two-layer board, and what the fab house will reject.' },
    { id: 'finetune-on-a-laptop', title: 'Fine-tuning a small model on a student laptop',
      author: 'Tanvir Hasan', category: 'AI & ML', date: '2026-06-05', read: 10,
      excerpt: 'LoRA, gradient checkpointing and realistic expectations when your GPU has six gigabytes.' },
    { id: 'poster-design-rules', title: 'Six rules for a club poster that gets read',
      author: 'Farhana Akter', category: 'Design', date: '2026-05-19', read: 5,
      excerpt: 'Hierarchy, contrast, and why the QR code should never be the biggest thing on the page.' },
    { id: 'handover-notes', title: 'Panel handover notes, and why we publish them',
      author: 'Ayesha Siddiqua', category: 'Culture', date: '2026-04-27', read: 7,
      excerpt: 'The committee changes every year. The knowledge should not leave with it.' }
  ];

  var announcements = [
    { id: 'a-hackfest-reg', title: 'HackFest 2026 registration closes 15 September', date: '2026-08-26', pinned: true, level: 'urgent',
      body: 'Team registration for ZCS HackFest 2026 closes at 23:59 on 15 September. Teams of three, at least one member from a first or second year batch.' },
    { id: 'a-fee-fall', title: 'Fall 2026 membership fee is now collectable', date: '2026-08-20', pinned: true, level: 'normal',
      body: 'The Fall 2026 membership fee is BDT 20 per semester. Pay by bKash or Upay Send Money, or hand cash to a panel member and take a receipt.' },
    { id: 'a-lab-hours', title: 'Cyber Lab open hours extended to 21:00 on Thursdays', date: '2026-08-14', pinned: false, level: 'normal',
      body: 'Following the CTF rehearsal turnout, the Cyber Lab now stays open until 21:00 on Thursdays for members with a valid ZCS ID.' },
    { id: 'a-committee-call', title: 'Nominations open for the 2026–27 executive committee', date: '2026-08-02', pinned: false, level: 'normal',
      body: 'Any member in good standing with two semesters of paid membership may stand. Nomination forms are in the document library.' },
    { id: 'a-server-move', title: 'Club server maintenance, 30 August, 02:00–05:00', date: '2026-07-28', pinned: false, level: 'info',
      body: 'The member portal and certificate verification will be unavailable during the window. Registrations already submitted are unaffected.' }
  ];

  var positions = ['President', 'Vice President', 'General Secretary', 'Treasurer', 'Organising Secretary',
                   'Wing Lead', 'Executive Member', 'Member'];

  var members = [
    { uid: 'ZCS-2023-0001', name: 'Ayesha Siddiqua', position: 'President', wing: 'software-development',
      dept: 'Computer Science & Engineering', session: 'Fall2023', year: 4, points: 1840,
      skills: ['Project management', 'React', 'Public speaking'], joined: '2023-09-02', status: 'active' },
    { uid: 'ZCS-2023-0004', name: 'Yahya Rahman', position: 'Vice President', wing: 'software-development',
      dept: 'Computer Science & Engineering', session: 'Fall2023', year: 4, points: 1795,
      skills: ['PHP', 'System design', 'MySQL'], joined: '2023-09-02', status: 'active' },
    { uid: 'ZCS-2023-0011', name: 'Nusrat Jahan', position: 'Wing Lead', wing: 'competitive-programming',
      dept: 'Computer Science & Engineering', session: 'Fall2023', year: 4, points: 1712,
      skills: ['C++', 'Graph theory', 'Mentoring'], joined: '2023-09-05', status: 'active' },
    { uid: 'ZCS-2024-0032', name: 'Tanvir Hasan', position: 'Wing Lead', wing: 'ai-ml',
      dept: 'Computer Science & Engineering', session: 'Spring2024', year: 3, points: 1508,
      skills: ['PyTorch', 'NLP', 'Data viz'], joined: '2024-02-11', status: 'active' },
    { uid: 'ZCS-2024-0048', name: 'Sadia Islam', position: 'Wing Lead', wing: 'cybersecurity',
      dept: 'Information Technology Management', session: 'Spring2024', year: 3, points: 1466,
      skills: ['Burp Suite', 'Forensics', 'Linux'], joined: '2024-02-14', status: 'active' },
    { uid: 'ZCS-2024-0055', name: 'Mahin Chowdhury', position: 'Wing Lead', wing: 'robotics-iot',
      dept: 'Electrical & Electronic Engineering', session: 'Spring2024', year: 3, points: 1402,
      skills: ['Embedded C', 'KiCad', 'ROS'], joined: '2024-02-20', status: 'active' },
    { uid: 'ZCS-2024-0061', name: 'Farhana Akter', position: 'Wing Lead', wing: 'design-media',
      dept: 'Business Administration', session: 'Spring2024', year: 3, points: 1355,
      skills: ['Figma', 'After Effects', 'Photography'], joined: '2024-03-01', status: 'active' },
    { uid: 'ZCS-2024-0077', name: 'Rafiul Karim', position: 'Treasurer', wing: 'software-development',
      dept: 'Economics', session: 'Fall2024', year: 2, points: 1180,
      skills: ['Accounting', 'Excel', 'Python'], joined: '2024-09-08', status: 'active' },
    { uid: 'ZCS-2024-0090', name: 'Sumaiya Noor', position: 'General Secretary', wing: 'design-media',
      dept: 'English', session: 'Fall2024', year: 2, points: 1146,
      skills: ['Copywriting', 'Event ops'], joined: '2024-09-10', status: 'active' },
    { uid: 'ZCS-2025-0103', name: 'Imran Hossain', position: 'Organising Secretary', wing: 'robotics-iot',
      dept: 'Electrical & Electronic Engineering', session: 'Spring2025', year: 2, points: 980,
      skills: ['Logistics', 'Soldering'], joined: '2025-02-04', status: 'active' },
    { uid: 'ZCS-2025-0118', name: 'Tasnim Rahman', position: 'Executive Member', wing: 'ai-ml',
      dept: 'Computer Science & Engineering', session: 'Spring2025', year: 2, points: 912,
      skills: ['Pandas', 'Scikit-learn'], joined: '2025-02-09', status: 'active' },
    { uid: 'ZCS-2025-0126', name: 'Arif Mahmud', position: 'Executive Member', wing: 'competitive-programming',
      dept: 'Computer Science & Engineering', session: 'Spring2025', year: 2, points: 875,
      skills: ['C++', 'Number theory'], joined: '2025-02-12', status: 'active' },
    { uid: 'ZCS-2025-0140', name: 'Nabila Haque', position: 'Executive Member', wing: 'cybersecurity',
      dept: 'Law', session: 'Fall2025', year: 1, points: 640,
      skills: ['OSINT', 'Report writing'], joined: '2025-09-03', status: 'active' },
    { uid: 'ZCS-2025-0152', name: 'Shakib Al Hasan', position: 'Member', wing: 'software-development',
      dept: 'Information Technology Management', session: 'Fall2025', year: 1, points: 585,
      skills: ['JavaScript', 'Git'], joined: '2025-09-06', status: 'active' },
    { uid: 'ZCS-2026-0171', name: 'Rumana Ferdous', position: 'Member', wing: 'design-media',
      dept: 'Business Administration', session: 'Spring2026', year: 1, points: 410,
      skills: ['Illustration'], joined: '2026-02-08', status: 'active' },
    { uid: 'ZCS-2026-0184', name: 'Junaid Alam', position: 'Member', wing: 'ai-ml',
      dept: 'Computer Science & Engineering', session: 'Spring2026', year: 1, points: 366,
      skills: ['Python'], joined: '2026-02-15', status: 'active' },
    { uid: 'ZCS-2026-0190', name: 'Mitu Barua', position: 'Member', wing: 'competitive-programming',
      dept: 'Computer Science & Engineering', session: 'Spring2026', year: 1, points: 352,
      skills: ['C++'], joined: '2026-02-18', status: 'active' },
    { uid: 'ZCS-2026-0203', name: 'Hasibul Islam', position: 'Member', wing: 'robotics-iot',
      dept: 'Electrical & Electronic Engineering', session: 'Fall2026', year: 1, points: 120,
      skills: ['Arduino'], joined: '2026-08-01', status: 'pending' }
  ];

  var committees = [
    { term: '2026–27', current: true, roster: [
      { name: 'Ayesha Siddiqua', role: 'President' },
      { name: 'Yahya Rahman', role: 'Vice President' },
      { name: 'Sumaiya Noor', role: 'General Secretary' },
      { name: 'Rafiul Karim', role: 'Treasurer' },
      { name: 'Imran Hossain', role: 'Organising Secretary' },
      { name: 'Nusrat Jahan', role: 'Lead — Competitive Programming' },
      { name: 'Tanvir Hasan', role: 'Lead — AI & ML' },
      { name: 'Sadia Islam', role: 'Lead — Cybersecurity' },
      { name: 'Mahin Chowdhury', role: 'Lead — Robotics & IoT' },
      { name: 'Farhana Akter', role: 'Lead — Design & Media' }
    ] },
    { term: '2025–26', current: false, roster: [
      { name: 'Mahmudul Hasan', role: 'President' },
      { name: 'Ayesha Siddiqua', role: 'Vice President' },
      { name: 'Ridwan Kabir', role: 'General Secretary' },
      { name: 'Yahya Rahman', role: 'Treasurer' },
      { name: 'Nusrat Jahan', role: 'Organising Secretary' }
    ] },
    { term: '2024–25', current: false, roster: [
      { name: 'Sabbir Ahmed', role: 'President' },
      { name: 'Mahmudul Hasan', role: 'Vice President' },
      { name: 'Lamia Chowdhury', role: 'General Secretary' },
      { name: 'Ridwan Kabir', role: 'Treasurer' }
    ] }
  ];

  var alumni = [
    { name: 'Sabbir Ahmed', grad: 2025, role: 'Software Engineer', org: 'Brain Station 23', wing: 'software-development' },
    { name: 'Lamia Chowdhury', grad: 2025, role: 'Product Designer', org: 'Pathao', wing: 'design-media' },
    { name: 'Ridwan Kabir', grad: 2025, role: 'Data Analyst', org: 'bKash', wing: 'ai-ml' },
    { name: 'Mahmudul Hasan', grad: 2026, role: 'SDE Intern', org: 'Therap BD', wing: 'software-development' },
    { name: 'Nafisa Tabassum', grad: 2024, role: 'Security Analyst', org: 'BGD e-GOV CIRT', wing: 'cybersecurity' },
    { name: 'Zahid Hasan', grad: 2024, role: 'Hardware Engineer', org: 'Walton Digi-Tech', wing: 'robotics-iot' }
  ];

  var projects = [
    { id: 'zums-attend', name: 'ZUMS Attend', wing: 'software-development', year: 2026, status: 'live',
      blurb: 'QR check-in for club events. One scan writes attendance, and attendance is what a participation certificate is issued from.',
      stack: ['PHP', 'MySQL', 'Vanilla JS'], team: 5, repo: '#' },
    { id: 'lab-mesh', name: 'Lab Mesh', wing: 'robotics-iot', year: 2026, status: 'live',
      blurb: 'Twelve ESP32 nodes reporting temperature, humidity and door state from the labs to one dashboard.',
      stack: ['ESP32', 'MQTT', 'Grafana'], team: 4, repo: '#' },
    { id: 'cp-ladder', name: 'CP Ladder', wing: 'competitive-programming', year: 2025, status: 'live',
      blurb: 'The four-hundred-problem ladder, tracked per member, with editorials unlocked only after an accepted submission.',
      stack: ['Next.js', 'Postgres'], team: 3, repo: '#' },
    { id: 'bangla-ocr', name: 'Bangla Handwriting OCR', wing: 'ai-ml', year: 2025, status: 'research',
      blurb: 'A CRNN trained on a self-collected corpus of eleven thousand handwritten Bangla lines.',
      stack: ['PyTorch', 'OpenCV'], team: 6, repo: '#' },
    { id: 'phish-drill', name: 'Phish Drill', wing: 'cybersecurity', year: 2025, status: 'archived',
      blurb: 'Consented phishing simulation run for the university IT office, with a training page instead of a payload.',
      stack: ['Python', 'Flask'], team: 4, repo: '#' },
    { id: 'zcs-brand-kit', name: 'ZCS Brand Kit', wing: 'design-media', year: 2024, status: 'live',
      blurb: 'The logo system, the type pairing and the poster templates every wing now builds on.',
      stack: ['Figma', 'Illustrator'], team: 3, repo: '#' }
  ];

  var albums = [
    { id: 'hackfest-2025', title: 'HackFest 2025', date: '2025-09-20', event: 'zcs-hack-2026', count: 14 },
    { id: 'ctf-night-3', title: 'CTF Night Vol. 3', date: '2026-07-11', event: null, count: 10 },
    { id: 'freshers-26', title: 'Freshers Orientation 2026', date: '2026-07-21', event: 'freshers-orientation-26', count: 12 },
    { id: 'robotics-lab', title: 'Robotics Open Lab', date: '2026-08-08', event: 'robotics-open-lab', count: 9 },
    { id: 'panel-handover', title: 'Panel Handover 2026', date: '2026-06-30', event: null, count: 8 }
  ];

  var documents = [
    { id: 'constitution', name: 'ZCS Constitution (2026 revision)', type: 'PDF', size: '412 KB', updated: '2026-03-14', access: 'public' },
    { id: 'membership-form', name: 'Offline membership form', type: 'PDF', size: '96 KB', updated: '2026-08-01', access: 'public' },
    { id: 'event-proposal', name: 'Event proposal template', type: 'DOCX', size: '58 KB', updated: '2026-05-22', access: 'members' },
    { id: 'annual-report-25', name: 'Annual report 2025–26', type: 'PDF', size: '2.8 MB', updated: '2026-07-05', access: 'public' },
    { id: 'minutes-aug', name: 'Committee minutes — August 2026', type: 'PDF', size: '140 KB', updated: '2026-08-24', access: 'members' },
    { id: 'brand-kit', name: 'ZCS brand kit (logos + type)', type: 'ZIP', size: '18 MB', updated: '2026-02-02', access: 'public' },
    { id: 'nomination-form', name: 'Committee nomination form 2026–27', type: 'PDF', size: '74 KB', updated: '2026-08-02', access: 'members' }
  ];

  var faqs = [
    { q: 'Who can join ZCS?', a: 'Any enrolled student of ZNRF University of Management Sciences, from any department. You do not need to write code to be useful here — design, operations and writing wings need people too.' },
    { q: 'How much is membership?', a: 'BDT 20 per academic semester. Pay by bKash or Upay using Send Money to 01575-836669, or hand cash to a panel member and take a receipt.' },
    { q: 'How long does approval take?', a: 'One to three working days. The panel checks your payment against our records, then you get a confirmation email and an invite to the members WhatsApp community.' },
    { q: 'I paid but my status still says pending.', a: 'Check that you used Send Money rather than Payment, and that the transaction ID you entered matches your confirmation SMS exactly. If both are right, write to us with your registration ID.' },
    { q: 'Can I belong to more than one wing?', a: 'Yes. Pick a primary wing so somebody is responsible for you, then attend anything else you like. Most members drift across at least two.' },
    { q: 'How do certificates work?', a: 'Certificates are issued against attendance, not registration. Every issued certificate carries a code you can check on the verification page, and so can an employer.' },
    { q: 'What happens to my data?', a: 'It is used to run your membership and nothing else. It is never sold or shared. The full detail is on the privacy page.' },
    { q: 'I am graduating. What then?', a: 'Tell us your graduation year and you move to the alumni directory. Alumni keep verification access to their own certificates and get invited back for panels and mentoring.' }
  ];

  var partners = [
    { name: 'AI Builders Congress', file: 'ai-builder-s-congress.png' },
    { name: 'BIIN', file: 'biin.png' },
    { name: 'Circuitry Shop BD', file: 'circuitry-shop-bd.jpg' },
    { name: 'CloudCamp', file: 'cloudcamp.png' },
    { name: 'DPI Computer & Science Club', file: 'dpicsc.png' },
    { name: 'Green Genesis', file: 'green-genesis.webp' },
    { name: 'PLC', file: 'plc.png' },
    { name: 'The Infinity AI BuildFest', file: 'the-infinity-ai-buildfest.jpg' },
    { name: 'The Nexo Lab', file: 'the-nexo-lab.jpeg' },
    { name: 'YouthVerse Union', file: 'youthverse-union.png' },
    { name: 'ZELC', file: 'zelc.png' },
    { name: 'ZIN Today', file: 'zin-today.png' },
    { name: 'ZUIC', file: 'zuic-logo.png' }
  ];

  /* Certificates the verification page can resolve. Any other code fails. */
  var certificates = {
    'ZCS-CERT-8F2K91': { holder: 'Tasnim Rahman', uid: 'ZCS-2025-0118', title: 'Participation — Kaggle Sprint Weekend',
      issued: '2026-05-26', signedBy: 'Tanvir Hasan, Lead — AI & ML', status: 'valid' },
    'ZCS-CERT-4QX7M2': { holder: 'Arif Mahmud', uid: 'ZCS-2025-0126', title: 'Runner-up — Intra-University CP Contest #6',
      issued: '2026-04-12', signedBy: 'Nusrat Jahan, Lead — Competitive Programming', status: 'valid' },
    'ZCS-CERT-1BN055': { holder: 'Nabila Haque', uid: 'ZCS-2025-0140', title: 'Volunteer — Freshers Orientation 2026',
      issued: '2026-07-23', signedBy: 'Sumaiya Noor, General Secretary', status: 'revoked' }
  };

  /* Public transparency figures — period totals only, never member names. */
  var finance = {
    period: 'Fiscal year 2025–26',
    currency: 'BDT',
    opening: 41250,
    income: [
      { category: 'Membership fees', amount: 38600 },
      { category: 'Event tickets', amount: 74500 },
      { category: 'Sponsorship', amount: 120000 },
      { category: 'University grant', amount: 60000 },
      { category: 'Merchandise', amount: 18400 }
    ],
    expense: [
      { category: 'Venue & logistics', amount: 82300 },
      { category: 'Food & refreshments', amount: 51900 },
      { category: 'Prizes', amount: 46000 },
      { category: 'Printing & branding', amount: 22750 },
      { category: 'Equipment', amount: 34600 },
      { category: 'Software & hosting', amount: 9800 }
    ],
    accounts: [
      { name: 'Bank — Islami Bank', balance: 38200 },
      { name: 'bKash merchant', balance: 12640 },
      { name: 'Cash box', balance: 3760 }
    ]
  };

  /* One member's own view, used by the dashboard shells. */
  var me = {
    uid: 'ZCS-2025-0118', name: 'Tasnim Rahman', email: 'tasnim.rahman@example.com',
    phone: '01712345678', dept: 'Computer Science & Engineering', session: 'Spring2025',
    studentId: '0932220205101037', wing: 'ai-ml', position: 'Executive Member',
    joined: '2025-02-09', points: 912, rank: 11, status: 'active',
    skills: ['Pandas', 'Scikit-learn', 'Matplotlib'],
    fees: [
      { period: 'Fall 2026', amount: 20, method: 'bKash', trx: '9F2K1M7QX4', paid: '2026-08-21', status: 'paid' },
      { period: 'Spring 2026', amount: 20, method: 'bKash', trx: '7A1L4P2VC8', paid: '2026-02-03', status: 'paid' },
      { period: 'Fall 2025', amount: 20, method: 'Cash', trx: '—', paid: '2025-09-11', status: 'paid' },
      { period: 'Spring 2025', amount: 20, method: 'Upay', trx: '3K9D6R1TB5', paid: '2025-02-14', status: 'paid' }
    ],
    certificates: [
      { code: 'ZCS-CERT-8F2K91', title: 'Participation — Kaggle Sprint Weekend', issued: '2026-05-26', status: 'valid' },
      { code: 'ZCS-CERT-2PL73A', title: 'Completion — Python for Data Workshop', issued: '2025-11-08', status: 'valid' }
    ],
    passes: [
      { event: 'zcs-hack-2026', title: 'ZCS HackFest 2026', starts: '2026-09-19T09:00:00', code: 'ZCS-PASS-HK26-0431', state: 'upcoming' },
      { event: 'ai-buildfest', title: 'The Infinity AI BuildFest', starts: '2026-10-03T10:00:00', code: 'ZCS-PASS-AIB6-0118', state: 'upcoming' },
      { event: 'kaggle-sprint', title: 'Kaggle Sprint Weekend', starts: '2026-05-24T09:00:00', code: 'ZCS-PASS-KAG6-0092', state: 'attended' }
    ],
    claims: [
      { id: 'CLM-0042', filed: '2026-08-12', reason: 'Printer paper and toner for HackFest signage', amount: 2450, status: 'approved' },
      { id: 'CLM-0038', filed: '2026-06-02', reason: 'Uber to sponsor meeting, Banani', amount: 640, status: 'paid' },
      { id: 'CLM-0051', filed: '2026-08-25', reason: 'USB hubs for the AI lab', amount: 3100, status: 'pending' }
    ]
  };

  /* Admin-side sample rows. */
  var registrations = [
    { rid: 'ZCS-R-10241', name: 'Hasibul Islam', studentId: '0932230105101088', dept: 'EEE', event: 'zcs-hack-2026', method: 'bKash', trx: '5T2H8N3QZ1', at: '2026-08-27T19:41:00', status: 'pending' },
    { rid: 'ZCS-R-10240', name: 'Mitu Barua', studentId: '0932220205101122', dept: 'CSE', event: 'zcs-hack-2026', method: 'Upay', trx: '8W4C1V6BM0', at: '2026-08-27T18:05:00', status: 'approved' },
    { rid: 'ZCS-R-10239', name: 'Junaid Alam', studentId: '0932220205101109', dept: 'CSE', event: 'ai-buildfest', method: 'Cash', trx: '—', at: '2026-08-26T14:22:00', status: 'approved' },
    { rid: 'ZCS-R-10238', name: 'Rumana Ferdous', studentId: '0932210305101044', dept: 'BBA', event: 'zcs-hack-2026', method: 'bKash', trx: '2R7Y9K4DL3', at: '2026-08-26T11:58:00', status: 'rejected' },
    { rid: 'ZCS-R-10237', name: 'Shakib Al Hasan', studentId: '0932220405101071', dept: 'ITM', event: 'intra-cp-contest-7', method: 'Cash', trx: '—', at: '2026-08-25T16:30:00', status: 'approved' }
  ];

  var messages = [
    { id: 'M-902', from: 'Rezaul Karim', email: 'rezaul@example.com', subject: 'Sponsorship for HackFest', at: '2026-08-27T09:12:00', read: false },
    { id: 'M-901', from: 'Farzana Yeasmin', email: 'farzana@example.com', subject: 'Can non-CSE students join the CP wing?', at: '2026-08-26T20:44:00', read: false },
    { id: 'M-900', from: 'Anonymous', email: 'hidden@example.com', subject: 'Broken link on the members page', at: '2026-08-25T13:02:00', read: true },
    { id: 'M-899', from: 'Md. Sohel Rana', email: 'sohel@example.com', subject: 'Requesting a duplicate certificate', at: '2026-08-24T10:20:00', read: true }
  ];

  var ledger = [
    { id: 'L-2211', date: '2026-08-26', dir: 'out', category: 'Printing & branding', account: 'bKash merchant', party: 'Rong Printers', amount: 12400, event: 'zcs-hack-2026', status: 'approved' },
    { id: 'L-2210', date: '2026-08-24', dir: 'in',  category: 'Sponsorship', account: 'Bank — Islami Bank', party: 'CloudCamp', amount: 60000, event: 'zcs-hack-2026', status: 'settled' },
    { id: 'L-2209', date: '2026-08-21', dir: 'in',  category: 'Membership fees', account: 'bKash merchant', party: 'Tasnim Rahman', amount: 20, event: null, status: 'settled' },
    { id: 'L-2208', date: '2026-08-18', dir: 'out', category: 'Equipment', account: 'Cash box', party: 'Circuitry Shop BD', amount: 8750, event: null, status: 'pending' },
    { id: 'L-2207', date: '2026-08-14', dir: 'out', category: 'Food & refreshments', account: 'Cash box', party: 'Campus canteen', amount: 4200, event: 'robotics-open-lab', status: 'settled' },
    { id: 'L-2206', date: '2026-08-09', dir: 'in',  category: 'Event tickets', account: 'bKash merchant', party: 'CTF Night Vol. 4', amount: 9000, event: 'ctf-night-vol4', status: 'settled' },
    { id: 'L-2205', date: '2026-08-02', dir: 'out', category: 'Software & hosting', account: 'Bank — Islami Bank', party: 'Hosting renewal', amount: 3600, event: null, status: 'settled' }
  ];

  var audit = [
    { at: '2026-08-27T20:12:00', actor: 'Ayesha Siddiqua', action: 'approved registration', target: 'ZCS-R-10240' },
    { at: '2026-08-27T15:47:00', actor: 'Rafiul Karim', action: 'created ledger entry', target: 'L-2211' },
    { at: '2026-08-26T22:03:00', actor: 'Yahya Rahman', action: 'published blog post', target: 'why-we-run-on-failure' },
    { at: '2026-08-26T12:19:00', actor: 'Sumaiya Noor', action: 'issued certificate', target: 'ZCS-CERT-8F2K91' },
    { at: '2026-08-25T09:31:00', actor: 'Ayesha Siddiqua', action: 'updated site settings', target: 'hero_title' },
    { at: '2026-08-24T18:55:00', actor: 'Rafiul Karim', action: 'marked fee paid', target: 'ZCS-2025-0118 / Fall 2026' }
  ];

  var stats = [
    { label: 'Active members', value: 312 },
    { label: 'Events run', value: 48 },
    { label: 'Projects shipped', value: 26 },
    { label: 'Partner organisations', value: 13 }
  ];

  /* --------------------------------------------------------------- export */
  window.ZCS = {
    placeholder: placeholder,
    avatarFor: avatarFor,
    wings: wings,
    events: events,
    posts: posts,
    announcements: announcements,
    positions: positions,
    members: members,
    committees: committees,
    alumni: alumni,
    projects: projects,
    albums: albums,
    documents: documents,
    faqs: faqs,
    partners: partners,
    certificates: certificates,
    finance: finance,
    me: me,
    registrations: registrations,
    messages: messages,
    ledger: ledger,
    audit: audit,
    stats: stats,
    departments: [
      { key: 'cse', name: 'Computer Science & Engineering' },
      { key: 'itm', name: 'Information Technology Management' },
      { key: 'eee', name: 'Electrical & Electronic Engineering' },
      { key: 'bba', name: 'Business Administration' },
      { key: 'economics', name: 'Economics' },
      { key: 'english', name: 'English' },
      { key: 'law', name: 'Law' }
    ]
  };

  /* Look-ups the pages use constantly. */
  window.ZCS.wingBySlug = function (slug) {
    return wings.filter(function (w) { return w.slug === slug; })[0] || null;
  };
  window.ZCS.eventById = function (id) {
    return events.filter(function (e) { return e.id === id; })[0] || null;
  };
  window.ZCS.postById = function (id) {
    return posts.filter(function (p) { return p.id === id; })[0] || null;
  };
  window.ZCS.memberByUid = function (uid) {
    return members.filter(function (m) { return m.uid === uid; })[0] || null;
  };
  window.ZCS.albumById = function (id) {
    return albums.filter(function (a) { return a.id === id; })[0] || null;
  };
})();
