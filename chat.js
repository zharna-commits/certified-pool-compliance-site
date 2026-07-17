// Certified Pool Compliance chat widget. Self-contained, no external services.
(function () {
  'use strict';

  var EMAIL = 'hello@certifiedpoolcompliance.com.au';

  var ANSWERS = [
    { keys: ['price', 'cost', 'how much', 'fee', 'charge', '$'],
      chip: 'Pricing',
      html: 'Fixed pricing, confirmed before we book: <strong>$350</strong> for a full inspection and certificate, <strong>$190</strong> for a re-inspection of failed items once fixed. Rectification work is quoted separately. <a href="/?page=services&anchor=pricing">See full pricing</a>.' },
    { keys: ['book', 'appointment', 'inspection time', 'availability', 'when can you'],
      chip: 'Book an inspection',
      html: 'Easy. Use the booking form on this page or the <a href="/?page=contact">contact page</a>, tell us your suburb and what you need, and we confirm a fixed price and the next available date, usually within one business day. Settlement deadline? Mention it and you get priority.' },
    { keys: ['qld', 'queensland', 'form 23 qld', 'qbcc', 'brisbane', 'gold coast', 'cairns'],
      chip: 'QLD rules',
      html: 'Queensland pools are certified with a <strong>Form 23 Pool Safety Certificate</strong> under the QDC MP 3.4 standard, lodged on the QBCC register. Certificates last 1 year for shared pools, 2 years for non-shared. <a href="/queensland">QLD guide</a>.' },
    { keys: ['nsw', 'new south wales', 'sydney', 'swimming pools act'],
      chip: 'NSW rules',
      html: 'NSW pools get a <strong>Certificate of Compliance</strong> under the Swimming Pools Act, recorded on the NSW Swimming Pool Register, generally valid 3 years. A valid certificate is required to sell or lease. <a href="/nsw">NSW guide</a>.' },
    { keys: ['vic', 'victoria', 'melbourne', 'geelong', 'barrier compliance'],
      chip: 'VIC rules',
      html: 'Victorian pools need a <strong>Form 23 Certificate of Barrier Compliance</strong> every 4 years, lodged with your council within 30 days of issue. Pools must be registered with council. <a href="/victoria">VIC guide</a>.' },
    { keys: ['fail', 'failed', 'non-compliant', 'noncompliant', 'not pass', 'form 26', 'rectif'],
      chip: 'My pool failed',
      html: 'Very common, and usually cheap to fix. You get an itemised, photo-referenced report of exactly what failed and how to fix it. Once done, a <strong>$190 re-inspection</strong> checks just those items and releases your certificate. <a href="/blog/what-happens-if-my-pool-does-not-pass">What happens if my pool fails</a>.' },
    { keys: ['how long', 'valid', 'expire', 'expiry', 'renew'],
      html: 'Depends on the state: QLD runs 1 year (shared) or 2 years (non-shared), NSW is generally 3 years, and VIC re-certifies every 4 years. We track your expiry and contact you before it lapses. <a href="/blog/how-long-does-a-pool-compliance-certificate-last">Full breakdown</a>.' },
    { keys: ['spa', 'swim spa', 'hot tub'],
      html: 'If a spa can hold more than 300mm of water, pool barrier laws generally apply. Lockable lid rules differ by state. <a href="/spa-barrier-inspections">Spa barrier inspections</a>.' },
    { keys: ['hour', 'open', 'contact', 'phone', 'email', 'call', 'reach'],
      chip: 'Contact & hours',
      html: 'We are available <strong>Monday to Friday, 8am to 5pm</strong>. Email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> or use the booking form and we respond within one business day.' },
    { keys: ['agent', 'real estate', 'property manager', 'settlement', 'conveyanc', 'strata'],
      html: 'Agents, property managers and conveyancers get priority booking windows, consistent reports and certificates lodged directly. <a href="/real-estate-property-manager-inspections">Agent &amp; PM inspections</a>.' },
    { keys: ['area', 'suburb', 'where', 'service', 'location', 'travel'],
      html: 'We cover Queensland statewide (Cairns to the Gold Coast), all of Sydney plus the Central Coast in NSW, and Melbourne and Geelong in VIC. <a href="/?page=areas">Service areas</a>.' },
    { keys: ['gate', 'latch', 'fence', 'barrier', 'climb', 'cpr'],
      html: 'Gates that do not self-close, low latches and climbable objects near the fence are the most common failures, and most are cheap fixes. <a href="/blog/most-common-reasons-pool-fences-fail-inspection">The most common failures</a> and <a href="/blog/how-to-prepare-for-a-pool-compliance-inspection">how to prepare</a>.' }
  ];

  var FALLBACK = 'Good question, and I want you to get an exact answer rather than a guess. Email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a> or use the <a href="/?page=contact">booking form</a> and the team will come back within one business day. You can also try our <a href="/blog">guides</a>.';

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  function init() {
    var root = el('div', 'cpc-chat');
    root.innerHTML =
      '<button class="cpc-chat-bubble" aria-label="Open chat" aria-expanded="false">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
      '</button>' +
      '<div class="cpc-chat-panel cpc-hidden" role="dialog" aria-label="Chat with Certified Pool Compliance" hidden>' +
      '<div class="cpc-chat-head"><strong>Pool Compliance Help</strong><span>Instant answers, Mon to Fri follow-up</span><button class="cpc-chat-min" aria-label="Minimise chat">&#8211;</button><button class="cpc-chat-close" aria-label="Close chat">&times;</button></div>' +
      '<div class="cpc-chat-msgs"></div>' +
      '<div class="cpc-chat-chips"></div>' +
      '<form class="cpc-chat-form"><input type="text" placeholder="Type a question..." aria-label="Type a question"><button type="submit" aria-label="Send">&rarr;</button></form>' +
      '</div>';
    document.body.appendChild(root);

    var bookFab = el('a', 'cpc-book-fab', 'Book Now');
    bookFab.href = document.getElementById('book') ? '#book' : '/?page=contact';
    root.appendChild(bookFab);

    var bubble = root.querySelector('.cpc-chat-bubble');
    var panel = root.querySelector('.cpc-chat-panel');
    var msgs = root.querySelector('.cpc-chat-msgs');
    var chips = root.querySelector('.cpc-chat-chips');
    var form = root.querySelector('.cpc-chat-form');
    var input = form.querySelector('input');
    var opened = false;

    function add(cls, html) {
      var m = el('div', 'cpc-msg ' + cls, html);
      msgs.appendChild(m);
      msgs.scrollTop = msgs.scrollHeight;
      return m;
    }

    function botReply(html) {
      var typing = add('cpc-bot', '<span class="cpc-dots"><i></i><i></i><i></i></span>');
      setTimeout(function () { typing.innerHTML = html; msgs.scrollTop = msgs.scrollHeight; }, 450);
    }

    function answer(text) {
      var q = text.toLowerCase();
      for (var i = 0; i < ANSWERS.length; i++) {
        for (var k = 0; k < ANSWERS[i].keys.length; k++) {
          if (q.indexOf(ANSWERS[i].keys[k]) !== -1) return ANSWERS[i].html;
        }
      }
      return FALLBACK;
    }

    function ask(text) {
      add('cpc-user', text.replace(/</g, '&lt;'));
      botReply(answer(text));
    }

    function toggle(open) {
      opened = open;
      panel.hidden = !open;
      panel.classList.toggle('cpc-hidden', !open);
      bubble.setAttribute('aria-expanded', open ? 'true' : 'false');
      bubble.classList.toggle('cpc-open', open);
      if (bookFab) bookFab.style.display = open ? 'none' : '';
      if (open && !msgs.children.length) {
        botReply('Hi. Ask me about pricing, booking, your state’s pool rules, or what happens if a pool fails inspection.');
      }
      if (open) setTimeout(function(){ input.focus(); }, 300);
    }

    bubble.addEventListener('click', function () { toggle(!opened); });
    root.querySelector('.cpc-chat-close').addEventListener('click', function () { toggle(false); });
    root.querySelector('.cpc-chat-min').addEventListener('click', function () { toggle(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && opened) toggle(false);
    });
    document.addEventListener('click', function (e) {
      if (opened && !root.contains(e.target)) toggle(false);
    });

    ANSWERS.filter(function (a) { return a.chip; }).forEach(function (a) {
      var c = el('button', 'cpc-chip', a.chip);
      c.type = 'button';
      c.addEventListener('click', function () { ask(a.chip); });
      chips.appendChild(c);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      if (!v) return;
      input.value = '';
      ask(v);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
