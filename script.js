/* ============================================================================
   TRIPPING — LANDING PAGE BEHAVIOUR
   - Config-driven CTAs + Tally modal
   - Looping, scripted consult that flies verdict cards into a stack
   - Coverflow judges carousel (arrows / swipe / keyboard)
   NO network calls except the Tally embed (loaded on demand) + fonts.
   ============================================================================ */
(() => {
  "use strict";

  const CFG = window.TRIPPING_CONFIG || {};
  const AV = "assets/avatars/";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ==========================================================================
     CTA BUTTONS (from config.js)
     ========================================================================== */
  function buildCTAs() {
    const group = document.getElementById("ctaGroup");
    group.innerHTML = "";

    // PRIMARY
    const primary = document.createElement(CFG.APP_STORE_URL ? "a" : "button");
    primary.className = "cta cta-primary";
    if (CFG.APP_STORE_URL) {
      primary.textContent = "Get the app";
      primary.href = CFG.APP_STORE_URL;
      primary.target = "_blank";
      primary.rel = "noopener";
    } else {
      primary.textContent = "Waitlist now";
      primary.type = "button";
      primary.addEventListener("click", openWaitlist);
    }
    group.appendChild(primary);

    // SECONDARY — only if BETA_URL is set
    if (CFG.BETA_URL) {
      const beta = document.createElement("a");
      beta.className = "cta cta-secondary";
      beta.textContent = "Try the Beta";
      beta.href = CFG.BETA_URL;
      beta.target = "_blank";
      beta.rel = "noopener";
      group.appendChild(beta);
    }
  }

  /* ==========================================================================
     CYCLING HEADLINES (2 him-based, 2 her-based)
     ========================================================================== */
  const HEADLINES = [
    "Is he being toxic?<br>Or are you overreacting?",
    "She said it’s ‘just a joke.’<br>It didn’t feel like one.",
    "He takes hours to reply.<br>But he’s always online.",
    "Her ex ‘means nothing.’<br>Why’s he still in her likes?",
  ];
  (() => {
    const el = document.getElementById("headline");
    let hi = 0;
    setInterval(() => {
      hi = (hi + 1) % HEADLINES.length;
      if (reduceMotion) { el.innerHTML = HEADLINES[hi]; return; }
      el.classList.add("is-swapping");
      setTimeout(() => {
        el.innerHTML = HEADLINES[hi];
        el.classList.remove("is-swapping");
      }, 460);
    }, 4800);
  })();

  /* ==========================================================================
     TALLY WAITLIST MODAL (iframe injected on first open -> no page-load call)
     ========================================================================== */
  const modal = document.getElementById("tallyModal");
  let tallyLoaded = false;

  function tallyEmbedURL() {
    const u = CFG.TALLY_FORM_URL || "";
    if (!u || u === "TALLY_PLACEHOLDER") return null;
    // turn a share link (tally.so/r/xxxx) into an embed link (tally.so/embed/xxxx)
    const embed = u.replace("/r/", "/embed/");
    const sep = embed.includes("?") ? "&" : "?";
    return embed + sep + "transparentBackground=1&hideTitle=1&dynamicHeight=1";
  }

  function openWaitlist() {
    const src = tallyEmbedURL();
    if (!src) {
      alert("The waitlist opens soon — check back shortly!");
      return;
    }
    if (!tallyLoaded) {
      const frame = document.createElement("iframe");
      frame.src = src;
      frame.title = "Am I Tripping?! waitlist";
      frame.loading = "lazy";
      document.getElementById("tallyEmbed").appendChild(frame);
      tallyLoaded = true;
    }
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeWaitlist() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }
  modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeWaitlist(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeWaitlist(); });

  /* ==========================================================================
     VERDICT CARD BUILDER
     ========================================================================== */
  function verdictCard({ attr, forName, judgeAvatar, userInitial, quote, summary,
                         whoWrong, whatNext, sentiment, sclass, caseNo, date, time }) {
    const el = document.createElement("div");
    el.className = "vcard vcard--" + sclass;
    el.innerHTML = `
      <div class="vcard-frame">
        <div class="vcard-face">
          <div class="vcard-seals">
            <span class="seal seal-judge">${judgeAvatar ? `<img src="${judgeAvatar}" alt="">` : ""}</span>
            <span class="seal seal-user">${userInitial}</span>
          </div>
          <div class="vcard-attr">${attr}<br><span>FOR ${forName}</span></div>
          <div class="vcard-quote">${quote}</div>
          <div class="vcard-summary">${summary}</div>
          <div class="vcard-detail">
            <div class="vcard-label">WHO'S IN THE WRONG?</div>
            <div class="vcard-text">${whoWrong}</div>
            <div class="vcard-label">WHAT NEXT?</div>
            <div class="vcard-text">${whatNext}</div>
          </div>
        </div>
        <div class="vcard-chin">
          <img class="vcard-wordmark" src="assets/wordmark.svg" alt="Am I Tripping?!">
          <div class="vcard-chin-tr">
            <div class="stamp-date">${date}<br>${time}</div>
            <div class="vcard-glyph">&#9889;</div>
          </div>
          <div class="barcode-row">
            <div class="barcode"></div>
            <div class="case">CASE ${caseNo}</div>
          </div>
          <div class="sentiment">${sentiment}</div>
        </div>
      </div>`;
    return el;
  }

  /* ==========================================================================
     THE THREE SCRIPTED CONSULTS  (verbatim voices)
     ========================================================================== */
  const CONSULTS = [
    { // A — Trisha Scott (solo, fast + warm)
      judge: { name: "Trisha Scott", avatar: AV + "trisha.jpg" },
      user: { name: "Arya", initial: "A" },
      messages: [
        { who: "user", text: "he takes hours to reply but is always online \u{1F62D}" },
        { who: "judge", speaker: "Trisha Scott", avatar: AV + "trisha.jpg", text: "Okay. Tell me everything, from the top." },
        { who: "user", text: "we’ve been talking for 4 months. no label. he says he ‘doesn’t want to rush’" },
        { who: "judge", speaker: "Trisha Scott", avatar: AV + "trisha.jpg", text: "wait, one sec. Ah yes — four months. That’s not slow. That’s parked." },
        { who: "judge", speaker: "Trisha Scott", avatar: AV + "trisha.jpg", text: "Want my honest read + the plan?" },
        { who: "user", text: "yes" },
      ],
      card: {
        attr: "RULED BY TRISHA SCOTT", judgeAvatar: AV + "trisha.jpg",
        quote: "Name it or leave it. Pick one.",
        summary: "A situationship with no effort after 4 months isn’t growing.",
        whoWrong: "He’s coasting — but you haven’t made the ask yet.",
        whatNext: "Have the direct conversation: define this, or walk away.",
        sentiment: "MIXED", sclass: "mixed", date: "12 Jul 2026", time: "00:14:22",
      },
    },
    { // B — Marcus (curt, lowercase)
      judge: { name: "Marcus", avatar: AV + "marcus.jpg" },
      user: { name: "Sam", initial: "S" },
      messages: [
        { who: "user", text: "my ex texted ‘you up?’ at 2am and I replied instantly. am I tripping" },
        { who: "judge", speaker: "Marcus", avatar: AV + "marcus.jpg", text: "talk." },
        { who: "user", text: "we broke up 3 months ago. he only texts at night. I always answer" },
        { who: "judge", speaker: "Marcus", avatar: AV + "marcus.jpg", text: "the point." },
        { who: "user", text: "…I think I already know" },
        { who: "judge", speaker: "Marcus", avatar: AV + "marcus.jpg", text: "done. want my thoughts?" },
      ],
      card: {
        attr: "RULED BY MARCUS", judgeAvatar: AV + "marcus.jpg",
        quote: "you knew at hello.",
        summary: "you replied instantly to a 2am ‘you up’ from an ex, three months out.",
        whoWrong: "you. you had the answer before you asked the question.",
        whatNext: "stop answering the night texts. block if you have to.",
        sentiment: "TRIPPING", sclass: "tripping", date: "12 Jul 2026", time: "02:47:09",
      },
    },
    { // C — The Girls (group, overlapping, warm)
      judge: { name: "The Girls", avatar: AV + "girls.jpg" },
      user: { name: "Maya", initial: "M" },
      messages: [
        { who: "user", text: "my best friend keeps flirting with the guy she KNOWS I like" },
        { who: "judge", speaker: "Tara", initial: "T", color: "#c04bb0", text: "oh FINALLY. spill — do NOT summarize." },
        { who: "judge", speaker: "June", initial: "J", color: "#8a4bd6", text: "wait wait wait. she knows?? like, KNOWS knows?" },
        { who: "user", text: "I literally told her at brunch. she did it again that night" },
        { who: "judge", speaker: "Raya", initial: "R", color: "#6a3ad0", text: "girl. I’ve seen this one before." },
        { who: "judge", speaker: "Tara", initial: "T", color: "#c04bb0", text: "okay. we’ve discussed. want the group’s verdict?" },
      ],
      card: {
        attr: "RULED BY THE GIRLS", judgeAvatar: AV + "girls.jpg",
        quote: "We took a vote. That’s not your friend.",
        summary: "She flirted with your crush again — the night after you told her at brunch.",
        whoWrong: "Not you. She heard you, and chose him anyway.",
        whatNext: "Say it plainly once. If it repeats, that’s your answer.",
        sentiment: "NOT TRIPPING", sclass: "nottripping", date: "11 Jul 2026", time: "23:31:55",
      },
    },
  ];

  /* ==========================================================================
     CHAT + STACK CHOREOGRAPHY
     ========================================================================== */
  const chat = document.getElementById("chat");
  const chatHeader = document.getElementById("chatHeader");
  const chatHeaderAvatar = document.getElementById("chatHeaderAvatar");
  const chatHeaderName = document.getElementById("chatHeaderName");
  const stackEl = document.getElementById("verdictStack");
  const stackCol = stackEl.closest(".stack-col");
  const stackCards = [];        // top-of-pile first
  let caseCounter = 82;         // starts at CASE 0082 (matches the mock)

  const isHorizontal = () => window.matchMedia("(max-width: 900px)").matches;

  function monogram(m) {
    const wrap = document.createElement("span");
    wrap.className = "mono";
    if (m.avatar) {
      wrap.innerHTML = `<img src="${m.avatar}" alt="">`;
    } else {
      wrap.textContent = m.initial || (m.speaker || "?").slice(0, 1);
      wrap.style.background = m.color || "linear-gradient(180deg,#8800FF,#520099)";
    }
    return wrap;
  }

  function addBubble(m) {
    const row = document.createElement("div");
    row.className = "bubble-row " + m.who;
    if (m.who === "judge") {
      const sp = document.createElement("div");
      sp.className = "speaker";
      sp.appendChild(monogram(m));
      const nm = document.createElement("span");
      nm.textContent = m.speaker;
      sp.appendChild(nm);
      row.appendChild(sp);
    }
    const b = document.createElement("div");
    b.className = "bubble";
    b.textContent = m.text;
    row.appendChild(b);
    chat.appendChild(row);
    return row;
  }

  function addTyping() {
    const row = document.createElement("div");
    row.className = "bubble-row judge typing-row";
    const t = document.createElement("div");
    t.className = "typing";
    t.innerHTML = "<span></span><span></span><span></span>";
    row.appendChild(t);
    chat.appendChild(row);
    return row;
  }

  function layoutStack() {
    const horiz = isHorizontal();
    stackCol.classList.toggle("is-horizontal", horiz);
    const H = stackEl.clientHeight;
    const W = stackEl.clientWidth;
    stackCards.forEach((card, d) => {
      if (d >= 5) { card.style.opacity = "0"; return; }
      card.style.opacity = "1";

      if (horiz) {
        // mobile: sideways peek strip, vertically centred
        const rot = [-3, 4, -2, 5, -3][d] || 0;
        card.style.top = "50%";
        card.style.zIndex = String(100 - d);
        card.style.transform =
          `translate(calc(-50% + ${-d * 24}px), calc(-50% + ${d * 4}px)) rotate(${rot}deg) scale(${1 - d * 0.04})`;
        return;
      }

      // desktop: newest card full at the top; older cards slide down and
      // condense into a deck at the bottom (decreasing gaps), so the column
      // is filled top to bottom with no dead space
      const cardW = Math.min(W * 0.74, 300);
      const cardH = cardW * 1.25;                       // 4:5
      const deckStart = Math.min(cardH * 0.88, H * 0.55);
      const deckSpace = Math.max(H - deckStart - cardH * 0.12, 80);
      const fr = [0, 0.42, 0.72, 0.92];                 // condensing gaps
      const rot = [0, -1.6, 1.4, -1.2, 1.8][d] || 0;
      const y = d === 0 ? 10 : deckStart + deckSpace * fr[d - 1];
      card.style.top = "0";
      card.style.zIndex = String(10 + d);               // lower card overlaps,
      card.style.transform =                            // leaving a top sliver
        `translate(-50%, ${y}px) rotate(${rot}deg) scale(${1 - d * 0.02})`;
    });
    // retire cards beyond the visible cap
    while (stackCards.length > 6) {
      const dead = stackCards.pop();
      dead.remove();
    }
  }

  function buildCardData(consult) {
    caseCounter += 1;
    const c = consult.card;
    return verdictCard({
      attr: c.attr, forName: consult.user.name.toUpperCase(),
      judgeAvatar: c.judgeAvatar, userInitial: consult.user.initial,
      quote: c.quote, summary: c.summary, whoWrong: c.whoWrong, whatNext: c.whatNext,
      sentiment: c.sentiment, sclass: c.sclass,
      caseNo: String(caseCounter).padStart(4, "0"),
      date: c.date, time: c.time,
    });
  }

  function flyToStack(chatCardEl, consult) {
    return new Promise((resolve) => {
      // 1. place the real card at the resting (top) spot, invisible, to measure it.
      //    transition must be OFF while measuring — otherwise the rect is read
      //    mid-animation and the clone flies to a wrong spot (the old wonk)
      const real = buildCardData(consult);
      real.style.transition = "none";
      stackCards.unshift(real);
      stackEl.appendChild(real);
      layoutStack();
      real.style.opacity = "0";          // layoutStack sets it visible; re-hide
      void real.offsetHeight;            // force reflow -> final geometry
      const target = real.getBoundingClientRect();
      requestAnimationFrame(() => { real.style.transition = ""; });
      const start = chatCardEl.getBoundingClientRect();

      if (reduceMotion || !start.width) {
        // crossfade only
        chatCardEl.parentElement.remove();
        real.style.transition = "opacity .45s ease";
        requestAnimationFrame(() => layoutStack());
        setTimeout(resolve, 470);
        return;
      }

      // 2. clone flies from chat position to the stack target
      //    (page coordinates — immune to scrolling during the flight)
      const clone = chatCardEl.cloneNode(true);
      clone.className = "vcard vcard--" + consult.card.sclass + " fly-clone";
      clone.style.left = start.left + window.scrollX + "px";
      clone.style.top = start.top + window.scrollY + "px";
      clone.style.width = start.width + "px";
      clone.style.height = start.height + "px";
      document.body.appendChild(clone);
      chatCardEl.parentElement.remove();

      const dx = target.left - start.left;
      const dy = target.top - start.top;
      const scale = target.width / start.width;

      const anim = clone.animate(
        [
          { transform: "translate(0,0) scale(1) rotate(0deg)" },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 46}px) scale(${(1 + scale) / 2}) rotate(-7deg)`, offset: 0.5 },
          { transform: `translate(${dx}px, ${dy + 8}px) scale(${scale}) rotate(-4deg)`, offset: 0.86 },
          { transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(-3deg)` },
        ],
        { duration: 760, easing: "cubic-bezier(.5,0,.2,1)" }
      );
      anim.onfinish = () => {
        real.style.opacity = "";
        layoutStack();
        clone.remove();
        resolve();
      };
    });
  }

  function setChatHeader(consult) {
    const j = consult.judge;
    chatHeaderAvatar.innerHTML = j.avatar ? `<img src="${j.avatar}" alt="">` : "";
    if (!j.avatar) chatHeaderAvatar.textContent = (j.name || "?").slice(0, 1);
    chatHeaderName.textContent = j.name;
  }

  async function playConsult(consult) {
    setChatHeader(consult);
    chatHeader.style.opacity = "1";
    for (const m of consult.messages) {
      if (m.who === "judge") {
        const t = addTyping();
        chat.scrollTop = chat.scrollHeight;
        await sleep(reduceMotion ? 700 : rand(900, 1700));
        t.remove();
        addBubble(m);
      } else {
        await sleep(reduceMotion ? 600 : rand(600, 1000));
        addBubble(m);
      }
      chat.scrollTop = chat.scrollHeight;
      await sleep(reduceMotion ? 500 : rand(800, 1400));
    }

    // materialise the verdict card inside the chat
    await sleep(500);
    const wrap = document.createElement("div");
    wrap.className = "chat-card-wrap";
    const preview = buildCardData(consult);
    caseCounter -= 1; // preview + landed card share the SAME case number
    preview.style.transform = "none";
    wrap.appendChild(preview);
    chat.appendChild(wrap);
    chat.scrollTop = chat.scrollHeight;
    await sleep(reduceMotion ? 900 : 1500);

    // fly it into the pile
    await flyToStack(preview, consult);
    await sleep(400);

    // clear the chat (and fade the header) for the next consult
    chat.style.transition = "opacity .4s ease";
    chat.style.opacity = "0";
    chatHeader.style.opacity = "0";
    await sleep(reduceMotion ? 200 : 420);
    chat.innerHTML = "";
    chat.style.opacity = "1";
    await sleep(reduceMotion ? 250 : 500);
  }

  function seedStack() {
    // start with 2 pre-stacked cards so the pile never looks empty
    [CONSULTS[2], CONSULTS[1]].forEach((c) => {
      const card = buildCardData(c);
      stackCards.unshift(card);
      stackEl.appendChild(card);
    });
    layoutStack();
  }

  async function runLoop() {
    let i = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await playConsult(CONSULTS[i % CONSULTS.length]);
      i += 1;
    }
  }

  window.addEventListener("resize", layoutStack);

  /* ==========================================================================
     JUDGES COVERFLOW
     ========================================================================== */
  /* Card art is a drop-in slot: put a file at assets/judges/<id>.jpg (or .png)
     and it becomes that card's full-bleed background automatically — no code
     change. Missing file = the gradient + monogram you see now. The ids match
     the iOS repo's frozen cardIDs. */
  const JUDGES = [
    { id: "aurelius",    name: "Aurelius",         tier: "Legendary", hook: "Control what is controllable.",                              glyph: "A",   grad: "linear-gradient(160deg,#c9a24b,#6b3fa0 55%,#2a1149)" },
    { id: "marcus",      name: "Marcus",           tier: "Legendary", hook: "Brutal. Minimal. Correct.",                                  glyph: "M",   grad: "linear-gradient(160deg,#3f3f4a,#5b2a8c 60%,#1c0338)" },
    { id: "starcrossed", name: "The Ghosts",       tier: "Legendary", hook: "Died for love. Now they judge yours.",                       glyph: "☾", grad: "linear-gradient(160deg,#4356a0,#5a2f8f 58%,#160a2e)" },
    { id: "cats",        name: "The Council",      tier: "Rare",      hook: "Four cats. Zero mercy. Weirdly accurate.",                   glyph: "IV",  grad: "linear-gradient(160deg,#7a3ea0,#3b1a5c)" },
    { id: "inventors",   name: "The Creatives",    tier: "Rare",      hook: "Everything is a prototype. Including him.",                  glyph: "C",   grad: "linear-gradient(160deg,#a02f8a,#5a1e8c)" },
    { id: "redflags",    name: "The Red Flags",    tier: "Common",    hook: "They lived it. They’ll spot it.",                       glyph: "⚑", grad: "linear-gradient(160deg,#c02a5a,#6a1e8c)" },
    { id: "boys",        name: "The Boys",         tier: "Common",    hook: "Brutally honest to your face. Ride-or-die behind your back.", glyph: "B",  grad: "linear-gradient(160deg,#8a4bd6,#3d1a7a)" },
    { id: "vera",        name: "T.R.I.P.P.",       tier: "Common",    hook: "This Robot Interprets Personal Problems.",                   glyph: "T",   grad: "linear-gradient(160deg,#4b6ad6,#3a1a8c)" },
    { id: "rhea",        name: "Trisha Scott",     tier: "Starter",   hook: "You already know. Now act like it.",                         glyph: "TS",  grad: "linear-gradient(160deg,#a855f7,#6d28d9)" },
    { id: "oldcouple",   name: "Mr. & Mrs. Scott", tier: "Starter",   hook: "Fifty years married. Have you eaten?",                       glyph: "&",   grad: "linear-gradient(160deg,#b06ad0,#5a2f8f)" },
    { id: "girls",       name: "The Girls",        tier: "Starter",   hook: "Three of them. The fourth chair is yours.",                  glyph: "III", grad: "linear-gradient(160deg,#c04bb0,#6a1e8c)" },
    { id: "dogcouple",   name: "Peanut & Butter",  tier: "Starter",   hook: "Your tail knows already.",                                   glyph: "\u{1F43E}", grad: "linear-gradient(160deg,#b98cf0,#5a2f9f)" },
  ];
  const TIER_COLOR = { Legendary: "#e6b93f", Rare: "#c07bff", Common: "#a98bd0", Starter: "#9a9aa4" };

  const track = document.getElementById("cfTrack");
  const dotsWrap = document.getElementById("cfDots");
  let active = 0;
  const cards = [];

  // drop-in card art: try assets/judges/<id>.jpg, then .png; silently keep
  // the gradient + monogram if neither exists
  function tryCardArt(card, id) {
    const exts = ["jpg", "png"];
    const attempt = (i) => {
      if (i >= exts.length) return;
      const img = new Image();
      img.onload = () => {
        card.style.backgroundImage = `url("assets/judges/${id}.${exts[i]}")`;
        card.classList.add("has-art");
      };
      img.onerror = () => attempt(i + 1);
      img.src = `assets/judges/${id}.${exts[i]}`;
    };
    attempt(0);
  }

  JUDGES.forEach((j, i) => {
    const card = document.createElement("div");
    card.className = "jcard";
    card.setAttribute("role", "option");
    card.style.background = j.grad;
    card.innerHTML = `
      <span class="tier" style="color:${TIER_COLOR[j.tier]}">${j.tier}</span>
      <div class="jglyph">${j.glyph}</div>
      <h3 class="jname">${j.name}</h3>
      <p class="jhook">${j.hook}</p>`;
    tryCardArt(card, j.id);
    card.addEventListener("click", () => setActive(i));
    track.appendChild(card);
    cards.push(card);

    const dot = document.createElement("button");
    dot.setAttribute("aria-label", "Show " + j.name);
    dot.addEventListener("click", () => setActive(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function layoutCoverflow() {
    const n = JUDGES.length;
    cards.forEach((card, i) => {
      let o = i - active;
      if (o > n / 2) o -= n;          // wrap to nearest
      if (o < -n / 2) o += n;
      const ao = Math.abs(o);
      if (ao > 5) {
        // only the single farthest card (directly "behind") is hidden
        card.style.opacity = "0";
        card.style.pointerEvents = "none";
        card.style.transform = `translateX(${o * 120}px) scale(.6)`;
        card.style.zIndex = "0";
        card.classList.remove("is-active");
        return;
      }
      card.style.opacity = String(Math.max(1 - ao * 0.13, 0.3));
      card.style.pointerEvents = "auto";
      card.style.zIndex = String(50 - ao);
      const tx = o * 160;
      const tz = -Math.min(ao, 3) * 130 - Math.max(ao - 3, 0) * 40;
      const ry = -Math.sign(o) * Math.min(ao * 32, 52);   // cap so cards never flip past edge-on
      const sc = 1 - Math.min(ao * 0.08, 0.3);
      card.style.transform =
        `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`;
      card.classList.toggle("is-active", o === 0);
      card.setAttribute("aria-selected", o === 0 ? "true" : "false");
    });
    dots.forEach((d, i) => d.classList.toggle("on", i === active));
  }

  function setActive(i) {
    const n = JUDGES.length;
    active = ((i % n) + n) % n;
    layoutCoverflow();
  }
  const next = () => setActive(active + 1);
  const prev = () => setActive(active - 1);

  document.getElementById("cfNext").addEventListener("click", next);
  document.getElementById("cfPrev").addEventListener("click", prev);
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
  });

  // swipe / drag
  let dragX = null;
  const onDown = (x) => { dragX = x; };
  const onUp = (x) => {
    if (dragX === null) return;
    const dx = x - dragX;
    if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();
    dragX = null;
  };
  track.addEventListener("pointerdown", (e) => onDown(e.clientX));
  window.addEventListener("pointerup", (e) => onUp(e.clientX));
  // touch fallback
  track.addEventListener("touchstart", (e) => onDown(e.touches[0].clientX), { passive: true });
  track.addEventListener("touchend", (e) => onUp((e.changedTouches[0] || {}).clientX || dragX), { passive: true });

  window.addEventListener("resize", layoutCoverflow);

  /* ==========================================================================
     BOOT
     ========================================================================== */
  buildCTAs();
  seedStack();
  layoutCoverflow();
  runLoop();
})();
