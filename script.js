// Mobile nav toggle
(function () {
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close menu after clicking a link (mobile)
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Current year in footer
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

// Terminal typewriter effect
(function () {
  var terminal = document.getElementById('heroTerminal');
  if (!terminal) return;

  var lines = [
    '> initializing Ryan Frechette...',
    '> loading IT support portfolio...',
    '> stack: troubleshooting | M365 | osTicket | networking',
    '> status: ready to solve problems'
  ];

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pre-create all line elements so height is reserved before typing starts
  var lineEls = lines.map(function () {
    var el = document.createElement('div');
    el.className = 'terminal__line';
    terminal.appendChild(el);
    return el;
  });

  var cursor = document.createElement('span');
  cursor.className = 'terminal__cursor';
  cursor.setAttribute('aria-hidden', 'true');

  if (prefersReduced) {
    lineEls.forEach(function (el, i) { el.textContent = lines[i]; });
    lineEls[lineEls.length - 1].appendChild(cursor);
    return;
  }

  var lineIdx = 0, charIdx = 0;
  var CHAR_MS = 26, PAUSE_MS = 200;
  var started = false;

  lineEls[0].appendChild(cursor);

  function typeChar() {
    if (lineIdx >= lines.length) return;
    var el = lineEls[lineIdx];
    var text = lines[lineIdx];

    if (charIdx < text.length) {
      // Text node lives before the cursor in the same line element
      var node = (el.firstChild !== cursor) ? el.firstChild : null;
      if (!node) {
        node = document.createTextNode('');
        el.insertBefore(node, cursor);
      }
      node.data += text[charIdx];
      charIdx++;
      setTimeout(typeChar, CHAR_MS);
    } else {
      lineIdx++;
      charIdx = 0;
      if (lineIdx < lines.length) {
        lineEls[lineIdx].appendChild(cursor);
        setTimeout(typeChar, PAUSE_MS);
      }
      // Cursor stays blinking on last line when all lines are done
    }
  }

  function start() {
    if (started) return;
    started = true;
    setTimeout(typeChar, 400);
  }

  // Start typing when terminal enters viewport (handles hash-nav page loads)
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { start(); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(terminal);
  } else {
    start();
  }
})();

// Title typewriter — types each [data-typewrite] heading once on viewport entry
// Includes one near-end typo + backspace correction per title for a human feel
(function () {
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var els = Array.prototype.slice.call(document.querySelectorAll('[data-typewrite]'));
  if (!els.length) return;

  if (prefersReduced) return;

  // Adjacent QWERTY keys — produces plausible single-char typos
  var ADJ = {
    a:'s',b:'v',c:'x',d:'f',e:'w',f:'d',g:'f',h:'j',i:'o',j:'h',
    k:'l',l:'k',m:'n',n:'b',o:'i',p:'o',q:'w',r:'t',s:'a',t:'r',
    u:'y',v:'b',w:'e',x:'z',y:'t',z:'x'
  };

  function wrongChar(ch) {
    var w = ADJ[ch.toLowerCase()];
    if (!w) return null;
    return (ch >= 'A' && ch <= 'Z') ? w.toUpperCase() : w;
  }

  // Find a letter near the end (72–93%) that has an adjacent key
  function pickTypoPos(text) {
    if (text.length < 9) return -1;
    var lo = Math.floor(text.length * 0.72);
    var hi = Math.floor(text.length * 0.93);
    for (var i = hi; i >= lo; i--) {
      if (/[a-zA-Z]/.test(text[i]) && wrongChar(text[i])) return i;
    }
    return -1;
  }

  // 95ms base ± up to 25ms random jitter; floor at 70ms
  function jitter() {
    return Math.max(70, 95 + Math.round((Math.random() - 0.5) * 50));
  }

  // Build a flat sequence of micro-ops with individual delays
  // op: 'add' (type char), 'del' (backspace), 'noop' (pause only)
  function buildSeq(text) {
    var typoPos = pickTypoPos(text);
    var seq = [];
    for (var i = 0; i < text.length; i++) {
      if (i === typoPos) {
        seq.push({ op: 'add', ch: wrongChar(text[i]), delay: jitter() }); // wrong key
        seq.push({ op: 'noop', delay: 450 });                             // pause — "wait, that's wrong"
        seq.push({ op: 'del',  delay: 55  });                             // backspace
        seq.push({ op: 'noop', delay: 120 });                             // recovery
      }
      seq.push({ op: 'add', ch: text[i], delay: jitter() });
    }
    return seq;
  }

  els.forEach(function (el) {
    var text = el.textContent.trim();

    var spacer = document.createElement('span');
    spacer.className = 'tw-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    spacer.textContent = text;

    var target = document.createElement('span');
    target.className = 'tw-target';
    target.setAttribute('aria-hidden', 'true');

    el.textContent = '';
    el.setAttribute('aria-label', text);
    el.appendChild(spacer);
    el.appendChild(target);
    el.style.visibility = 'hidden';

    var cur = document.createElement('span');
    cur.className = 'terminal__cursor';
    cur.setAttribute('aria-hidden', 'true');

    var fired = false;

    function startTyping() {
      if (fired) return;
      fired = true;
      target.appendChild(cur);

      var seq = buildSeq(text);
      seq.unshift({ op: 'noop', delay: 150 }); // brief pause before title starts typing
      var seqIdx = 0;
      var node = null; // single text node that grows/shrinks as we type/backspace

      function execStep() {
        if (seqIdx >= seq.length) {
          // Restore element to clean natural text — no dangling cursor on titles
          cur.remove();
          el.removeAttribute('data-typewrite');
          el.removeAttribute('aria-label');
          el.style.visibility = '';
          el.textContent = text;
          return;
        }
        var step = seq[seqIdx++];
        if (step.op === 'add') {
          if (!node) {
            node = document.createTextNode('');
            target.insertBefore(node, cur);
          }
          node.data += step.ch;
        } else if (step.op === 'del') {
          if (node) node.data = node.data.slice(0, -1);
        }
        // 'noop' — do nothing, just wait step.delay before next step
        setTimeout(execStep, step.delay);
      }

      execStep();
    }

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { startTyping(); obs.disconnect(); }
      }, { threshold: 0.3 });
      obs.observe(el);
    } else {
      el.style.visibility = '';
      el.textContent = text;
    }
  });
})();
