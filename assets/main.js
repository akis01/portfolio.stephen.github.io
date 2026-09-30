/* Affiche le contenu de data.js, gère la langue, le thème et le mini personnage.
   Normalement tu n'as pas besoin de modifier ce fichier (sauf pour traduire un libellé d'interface). */
(function () {
  const D = window.PORTFOLIO;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* =================== TEXTES DE L'INTERFACE =================== */
  const UI = {
    fr: {
      "title": "Stephen Akiyemi · Cybersécurité",
      "skip": "Aller au contenu", "theme": "Changer de thème", "night": "NUIT", "day": "JOUR", "card": "Fiche joueur",
      "nav.skills": "Compétences", "nav.projects": "Projets", "nav.certs": "Certifications", "nav.path": "Parcours", "nav.contact": "Contact",
      "ready": "Prêt à jouer",
      "bio": "Étudiant en <strong>L3 Sécurité Informatique</strong> et passionné de cybersécurité. Je crée aussi des <strong>sites web</strong>, du front-end au back-end, et j'aime <strong>automatiser</strong> tout ce qui peut l'être avec l'IA.",
      "cta.projects": "Voir mes projets", "cta.contact": "Me contacter",
      "player": "Joueur", "stat.class": "Classe", "stat.guild": "Guilde", "stat.base": "Base", "stat.wins": "Succès", "stat.certs": "certifications",
      "xp": "apprentissage en cours",
      "skills.label": "Inventaire", "skills.note": "Outils et techniques pratiqués en lab et en projet. Niveau :",
      "lvl1": "découverte", "lvl2": "pratiqué", "lvl3": "à l'aise", "lvlaria": "niveau {n} sur 3",
      "projects.label": "Quêtes", "projects.note": "Write-ups de labs, outils et sites. De nouveaux projets arrivent au fil de ma formation.",
      "tab.tous": "Tous", "tab.cyber": "Cybersécurité", "tab.web": "Sites web", "tab.ia": "Automatisation IA", "tab.design": "Motion design",
      "slot": "Emplacement libre",
      "slot.tous": "Mes premiers projets arrivent bientôt.", "slot.cyber": "Write-ups de CTF et labs de pentest à venir.",
      "slot.web": "Sites et applications web à venir.", "slot.ia": "Workflows et agents IA à venir.", "slot.design": "Vidéos et animations à venir.",
      "st.termine": "Terminé", "st.en-cours": "En cours",
      "l.code": "Code source ↗", "l.demo": "Site en ligne ↗", "l.rapport": "Write-up ↗",
      "certs.label": "Succès débloqués", "cert.view": "Voir le certificat", "cert.verify": "Vérifier ↗", "cert.locked": "Succès à débloquer",
      "path.label": "Carte du monde", "path.note": "Chaque année est un niveau. Le niveau en cours clignote.",
      "path.clear": "Terminé", "path.now": "En cours", "path.world": "Monde",
      "exp.title": "Quêtes secondaires", "exp.sub": "Expériences",
      "contact.label": "Continue ?", "contact.title": "Travaillons ensemble",
      "contact.text": "Un site web à créer, un process à automatiser ou une question de cybersécurité ? Écris-moi, je réponds vite.",
      "copy": "Copier", "phone": "Téléphone / WhatsApp", "copied": "Copié", "selected": "Sélectionné : Ctrl+C pour copier",
      "mail": "Écrire un email", "cv": "Télécharger mon CV", "ctf": "Profil CTF ↗",
      "crt.on": "Mode CRT activé", "crt.off": "Mode CRT désactivé",
      "levelup": "LEVEL UP !",
      "stages": ["Novice", "Apprenti", "Hacker", "Certifié", "Explorateur", "Légende"]
    },
    en: {
      "title": "Stephen Akiyemi · Cybersecurity",
      "skip": "Skip to content", "theme": "Switch theme", "night": "NIGHT", "day": "DAY", "card": "Player card",
      "nav.skills": "Skills", "nav.projects": "Projects", "nav.certs": "Certifications", "nav.path": "Journey", "nav.contact": "Contact",
      "ready": "Ready to play",
      "bio": "Third-year <strong>IT Security</strong> student with a passion for cybersecurity. I also build <strong>websites</strong>, from front-end to back-end, and I love <strong>automating</strong> everything I can with AI.",
      "cta.projects": "See my projects", "cta.contact": "Contact me",
      "player": "Player", "stat.class": "Class", "stat.guild": "Guild", "stat.base": "Base", "stat.wins": "Achievements", "stat.certs": "certifications",
      "xp": "learning in progress",
      "skills.label": "Inventory", "skills.note": "Tools and techniques practised in labs and projects. Level:",
      "lvl1": "beginner", "lvl2": "practised", "lvl3": "confident", "lvlaria": "level {n} of 3",
      "projects.label": "Quests", "projects.note": "Lab write-ups, tools and websites. New projects are added as my studies progress.",
      "tab.tous": "All", "tab.cyber": "Cybersecurity", "tab.web": "Websites", "tab.ia": "AI automation", "tab.design": "Motion design",
      "slot": "Empty slot",
      "slot.tous": "My first projects are coming soon.", "slot.cyber": "CTF write-ups and pentest labs coming soon.",
      "slot.web": "Websites and web apps coming soon.", "slot.ia": "Workflows and AI agents coming soon.", "slot.design": "Videos and animations coming soon.",
      "st.termine": "Done", "st.en-cours": "In progress",
      "l.code": "Source code ↗", "l.demo": "Live site ↗", "l.rapport": "Write-up ↗",
      "certs.label": "Achievements unlocked", "cert.view": "View certificate", "cert.verify": "Verify ↗", "cert.locked": "Achievement to unlock",
      "path.label": "World map", "path.note": "Each year is a level. The current level is blinking.",
      "path.clear": "Clear", "path.now": "Now", "path.world": "World",
      "exp.title": "Side quests", "exp.sub": "Experience",
      "contact.label": "Continue?", "contact.title": "Let's work together",
      "contact.text": "A website to build, a process to automate or a cybersecurity question? Message me, I reply quickly.",
      "copy": "Copy", "phone": "Phone / WhatsApp", "copied": "Copied", "selected": "Selected: press Ctrl+C to copy",
      "mail": "Send an email", "cv": "Download my CV", "ctf": "CTF profile ↗",
      "crt.on": "CRT mode on", "crt.off": "CRT mode off",
      "levelup": "LEVEL UP!",
      "stages": ["Novice", "Apprentice", "Hacker", "Certified", "Explorer", "Legend"]
    }
  };

  let lang = (() => {
    try { const s = localStorage.getItem("lang"); if (s === "fr" || s === "en") return s; } catch (e) {}
    return (navigator.language || "fr").toLowerCase().startsWith("fr") ? "fr" : "en";
  })();
  const u = (k) => UI[lang][k] ?? UI.fr[k] ?? k;
  // texte simple ou { fr, en }
  const t = (v) => (v && typeof v === "object" && !Array.isArray(v)) ? (v[lang] ?? v.fr ?? "") : (v ?? "");

  const P = D.profil;

  /* =================== ICÔNES PIXEL =================== */
  const ICONS = {
    trophy: ["..XXXXXX..", "XXXXXXXXXX", "X.XXXXXX.X", "X.XXXXXX.X", ".XXXXXXXX.", "..XXXXXX..", "....XX....", "....XX....", "..XXXXXX..", "..XXXXXX.."],
    lock: ["...XXXX...", "..X....X..", "..X....X..", "..X....X..", ".XXXXXXXX.", ".XXXXXXXX.", ".XXX..XXX.", ".XXX..XXX.", ".XXXXXXXX.", ".XXXXXXXX."]
  };
  function pixelIcon(name, color) {
    let rects = "";
    ICONS[name].forEach((row, y) => [...row].forEach((c, x) => { if (c === "X") rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }));
    return `<svg class="icon" viewBox="0 0 10 10" shape-rendering="crispEdges" aria-hidden="true" fill="${color}">${rects}</svg>`;
  }
  const pips = (n) => `<span class="pips" role="img" aria-label="${esc(u("lvlaria").replace("{n}", n))}">${[1, 2, 3].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;

  /* =================== RENDU =================== */
  const CATS = ["tous", "cyber", "web", "ia", "design"];
  let currentCat = "tous";
  const projets = D.projets || [];

  function renderStatic() {
    document.documentElement.lang = lang;
    document.title = u("title");
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = u(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = u(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", u(el.dataset.i18nAria)); });
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const v = t(P[el.dataset.bind]);
      if (v !== "" && v !== undefined) el.textContent = v;
    });
    document.querySelectorAll(".legend .pips, .legend [data-n]").forEach((el) => { el.outerHTML = pips(+el.dataset.n || el.querySelectorAll(".on").length); });
    document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    $("#year").textContent = new Date().getFullYear();
  }

  function renderSkills() {
    $("#skills").innerHTML = D.competences.map((g) => `
      <article class="card skill-group">
        <h3>${esc(t(g.groupe))}</h3>
        <ul>${g.items.map((it) => `<li><span>${esc(t(it.nom))}</span>${pips(it.niveau)}</li>`).join("")}</ul>
      </article>`).join("");
  }

  function projectCard(p) {
    const l = p.liens || {};
    const links = ["code", "demo", "rapport"].filter((k) => l[k])
      .map((k) => `<a href="${esc(l[k])}" target="_blank" rel="noopener">${u("l." + k)}</a>`).join("");
    const video = p.video ? `<div class="project-video"><video controls playsinline preload="none"${p.poster ? ` poster="${esc(p.poster)}"` : ""} aria-label="${esc(t(p.titre))}"><source src="${esc(p.video)}" type="video/mp4"></video></div>` : "";
    return `
      <article class="card project${p.video ? " has-video" : ""}">${video}<div class="project-body">
        <div class="meta"><span>${esc(u("tab." + p.categorie))}${p.annee ? " · " + esc(p.annee) : ""}</span>
          <span class="status ${esc(p.statut)}">${esc(u("st." + p.statut))}</span></div>
        <h3>${esc(t(p.titre))}</h3>
        <p>${esc(t(p.resume))}</p>
        <ul class="stack">${(p.stack || []).map((s) => `<li>${esc(t(s))}</li>`).join("")}</ul>
        ${links ? `<div class="links">${links}</div>` : ""}
      </div></article>`;
  }
  function renderProjects() {
    const tabs = $("#tabs");
    tabs.setAttribute("aria-label", u("nav.projects"));
    tabs.innerHTML = CATS.map((c) => {
      const n = c === "tous" ? projets.length : projets.filter((p) => p.categorie === c).length;
      const on = c === currentCat;
      return `<button class="tab" role="tab" id="tab-${c}" data-cat="${c}" aria-selected="${on}" tabindex="${on ? 0 : -1}">${esc(u("tab." + c))}<span class="count">${n}</span></button>`;
    }).join("");
    const items = currentCat === "tous" ? projets : projets.filter((p) => p.categorie === currentCat);
    const slot = `<div class="slot"><span class="plus" aria-hidden="true">+</span><b>${esc(u("slot"))}</b><span>${esc(u("slot." + currentCat))}</span></div>`;
    const list = $("#projects-list");
    list.innerHTML = items.map(projectCard).join("") + (items.length < 3 ? slot : "");
    list.setAttribute("aria-labelledby", "tab-" + currentCat);
  }

  function renderCerts() {
    const certs = D.certifications || [];
    $("#cert-count").textContent = certs.filter((c) => !c.verrouille).length;
    $("#certs").innerHTML = certs.map((c) => {
      if (c.verrouille) return `
        <article class="card cert locked">
          ${pixelIcon("lock", "currentColor")}
          <h3>${esc(t(c.titre))}</h3>
          <span class="who">${esc(t(c.emetteur))}</span>
          <span class="who">${esc(u("cert.locked"))}</span>
        </article>`;
      const links = [
        c.pdf && `<a href="${esc(c.pdf)}" target="_blank" rel="noopener">${u("cert.view")}</a>`,
        c.verifier && `<a href="${esc(c.verifier)}" target="_blank" rel="noopener">${u("cert.verify")}</a>`
      ].filter(Boolean).join("");
      return `
        <article class="card cert">
          ${pixelIcon("trophy", "var(--coin)")}
          <h3>${esc(t(c.titre))}</h3>
          <span class="who">${esc(t(c.emetteur))}${c.date ? " · " + esc(t(c.date)) : ""}</span>
          <div class="links">${links}</div>
        </article>`;
    }).join("");
  }

  function renderPath() {
    const steps = D.parcours || [];
    $("#world").innerHTML = steps.map((s, i) => `
      <li class="level ${s.en_cours ? "now" : "clear"}">
        <span class="node" aria-hidden="true"></span>
        <div class="level-body">
          <div class="level-top">
            <span class="code">${esc(u("path.world"))} 1-${i + 1}</span>
            <span class="year">${esc(s.annee)}</span>
            <span class="badge">${esc(u(s.en_cours ? "path.now" : "path.clear"))}</span>
          </div>
          <h3>${esc(t(s.titre))}</h3>
          <span class="where">${esc(t(s.lieu))}</span>
          ${s.texte ? `<p>${esc(t(s.texte))}</p>` : ""}
        </div>
      </li>`).reverse().join("");
    $("#experiences").innerHTML = (D.experiences || []).map((e) => `
      <li><span class="when">${esc(t(e.periode))}</span><b>${esc(t(e.titre))}</b><span class="where">${esc(t(e.lieu))}</span></li>`).join("");
  }

  function renderContact() {
    const btns = [
      P.github && `<a class="btn" href="${esc(P.github)}" target="_blank" rel="noopener">GitHub ↗</a>`,
      P.instagram && `<a class="btn" href="${esc(P.instagram)}" target="_blank" rel="noopener">Instagram ↗</a>`,
      P.whatsapp && `<a class="btn" href="https://wa.me/${esc(P.whatsapp)}" target="_blank" rel="noopener">WhatsApp ↗</a>`,
      P.linkedin && `<a class="btn" href="${esc(P.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>`,
      P.tryhackme && `<a class="btn" href="${esc(P.tryhackme)}" target="_blank" rel="noopener">${u("ctf")}</a>`,
      P.cv && `<a class="btn primary" href="${esc(P.cv)}" target="_blank" rel="noopener">${u("cv")}</a>`,
      P.email && `<a class="btn ghost" href="mailto:${esc(P.email)}">${u("mail")}</a>`
    ].filter(Boolean).join("");
    $("#links").innerHTML = btns;
    document.querySelectorAll('[data-link="github"]').forEach((a) => { if (P.github) a.href = P.github; else a.remove(); });
    if (!P.telephone) $("#phone").closest(".mail").remove();
  }

  function renderAll() {
    renderStatic(); renderSkills(); renderProjects(); renderCerts(); renderPath(); renderContact();
    buddy.refresh();
  }

  /* =================== INTERACTIONS =================== */
  $("#tabs").addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (b) { currentCat = b.dataset.cat; renderProjects(); $("#tab-" + currentCat).focus(); } });
  $("#tabs").addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const i = CATS.indexOf(currentCat);
    currentCat = CATS[(i + (e.key === "ArrowRight" ? 1 : CATS.length - 1)) % CATS.length];
    renderProjects(); $("#tab-" + currentCat).focus();
  });

  document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => {
    lang = b.dataset.lang;
    try { localStorage.setItem("lang", lang); } catch (e) {}
    renderAll();
  }));

  const toast = $("#toast");
  let tt;
  function say(msg) { toast.textContent = msg; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2200); }
  async function copy(text, el) {
    try { await navigator.clipboard.writeText(text); say(u("copied") + " : " + text); }
    catch (e) {
      const r = document.createRange(); r.selectNodeContents(el);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); say(u("selected"));
    }
  }
  $("#copy-btn").addEventListener("click", () => copy(P.email, $("#email")));
  const cp = $("#copy-phone"); if (cp) cp.addEventListener("click", () => copy(P.telephone, $("#phone")));

  const root = document.documentElement;
  $("#theme-btn").addEventListener("click", () => {
    const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = cur === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    buddy.refresh();
  });

  const navLinks = [...document.querySelectorAll(".nav a")];
  const navIO = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => navIO.observe(s));

  const code = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  let pos = 0;
  addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    pos = k === code[pos] ? pos + 1 : (k === code[0] ? 1 : 0);
    if (pos === code.length) { pos = 0; document.body.classList.toggle("crt"); say(u(document.body.classList.contains("crt") ? "crt.on" : "crt.off")); }
  });

  /* =================== MINI PERSONNAGE =================== */
  const buddy = (() => {
    const cv = $("#buddy-canvas"), ctx = cv.getContext("2d");
    const nameEl = $("#buddy-name"), bubble = $("#bubble"), body = $("#buddy-body"), fill = $("#buddy-fill");
    const W = 16, H = 22;
    cv.width = W + 2; cv.height = H + 2;   // +1 pixel de contour de chaque côté
    const COLORS = {
      H: "#1a1210", S: "#6b4226", M: "#4e2f1a", K: "#15161b", T: "#8a4b22", P: "#23252e",
      G: "#f2c14e", D: "#3a3f4f", O: "#2f3654", W: "#ebe8df", L: "#9aa0ab", R: "#d8434b"
    };
    const BASE = [
      "................",
      "................",
      ".....HHHHHH.....",
      "....HHHHHHHH....",
      "....HHHHHHHH....",
      "....SSSSSSSS....",
      "....SKSSSSKS....",
      "....SSSSSSSS....",
      ".....SSMMSS.....",
      "......SSSS......",
      "....TTTTTTTT....",
      "...TTTTTTTTTT...",
      "..STTTTTTTTTTS..",
      "..STTTTTTTTTTS..",
      "..STTTTTTTTTTS..",
      "..S.TTTTTTTT.S..",
      "....PPPPPPPP....",
      "....PPP..PPP....",
      "....PPP..PPP....",
      "....PPP..PPP....",
      "....PPP..PPP....",
      "...KKKK..KKKK..."
    ];
    const LEGS_B = [
      "....PPP..PPP....",
      "...PPP....PPP...",
      "...PPP....PPP...",
      "..PPP......PPP..",
      ".KKKK......KKKK."
    ];
    function grid(stage, frame) {
      const g = BASE.map((r) => r.split(""));
      if (frame === 1) LEGS_B.forEach((r, i) => { g[17 + i] = r.split(""); });
      const set = (x, y, c) => { if (y >= 0 && y < H && x >= 0 && x < W) g[y][x] = c; };
      const under = (x, y, c) => { if (g[y] && g[y][x] === ".") g[y][x] = c; };
      if (stage >= 4) for (let y = 10; y <= 20; y++) for (let x = 2; x <= 13; x++) under(x, y, "R");     // cape
      if (stage >= 2) {                                                                                   // sweat à capuche
        for (let y = 10; y <= 15; y++) for (let x = 0; x < W; x++) if (g[y][x] === "T") g[y][x] = "O";
        for (let y = 3; y <= 9; y++) { set(3, y, "O"); set(12, y, "O"); }
        for (let x = 4; x <= 11; x++) set(x, 2, "O");
        set(6, 11, "W"); set(6, 12, "W"); set(9, 11, "W"); set(9, 12, "W");
      }
      if (stage >= 1) {                                                                                   // casque audio
        for (let x = 4; x <= 11; x++) set(x, 2, "G");
        for (let y = 5; y <= 7; y++) { set(3, y, "D"); set(12, y, "D"); }
      }
      if (stage >= 3) { set(6, 10, "R"); set(9, 10, "R"); set(7, 11, "R"); set(8, 11, "R"); set(7, 12, "G"); set(8, 12, "G"); } // médaille
      if (stage >= 2) {                                                                                   // ordinateur portable
        for (let x = 3; x <= 12; x++) for (let y = 13; y <= 15; y++) set(x, y, "L");
        set(7, 14, "G"); set(8, 14, "G");
      }
      if (stage >= 5) {                                                                                   // couronne + salut
        [5, 7, 8, 10].forEach((x) => set(x, 0, "G"));
        for (let x = 5; x <= 10; x++) set(x, 1, "G");
        for (let y = 12; y <= 15; y++) set(13, y, g[y][13] === "S" ? "." : g[y][13]);
        for (let y = 8; y <= 11; y++) set(13, y, "S");
        set(14, 7, "S"); set(14, 8, "S");
      }
      return g;
    }
    function draw(stage, frame) {
      const g = grid(stage, frame);
      const outline = getComputedStyle(document.documentElement).getPropertyValue("--buddy-line").trim() || "#ebe8df";
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.fillStyle = outline;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (g[y][x] === ".") continue;
        ctx.fillRect(x, y + 1, 3, 1); ctx.fillRect(x + 1, y, 1, 3);
      }
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const c = g[y][x]; if (c === ".") continue;
        ctx.fillStyle = COLORS[c]; ctx.fillRect(x + 1, y + 1, 1, 1);
      }
    }

    const order = ["top", "competences", "projets", "certifications", "parcours", "contact"];
    let stage = -1, frame = 0, lastY = scrollY, walkAcc = 0, idleT, bubbleT;
    function currentStage() {
      const mid = innerHeight * 0.55;
      let s = 0;
      order.forEach((id, i) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < mid) s = i; });
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) s = order.length - 1;
      return s;
    }
    function update() {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      body.style.setProperty("--p", p.toFixed(4));
      fill.style.height = (p * 100).toFixed(2) + "%";
      const dy = scrollY - lastY; lastY = scrollY;
      body.classList.toggle("flip", dy < 0);
      if (!reduce && Math.abs(dy) > 0) {
        walkAcc += Math.abs(dy);
        if (walkAcc > 28) { walkAcc = 0; frame = 1 - frame; }
        clearTimeout(idleT); idleT = setTimeout(() => { frame = 0; draw(stage, frame); }, 180);
      }
      const s = currentStage();
      if (s !== stage) {
        const up = s > stage && stage !== -1;
        stage = s;
        nameEl.textContent = u("stages")[stage];
        if (up) {
          bubble.textContent = u("levelup");
          body.classList.remove("lvl"); void body.offsetWidth; body.classList.add("lvl");
          clearTimeout(bubbleT); bubbleT = setTimeout(() => body.classList.remove("lvl"), 1600);
        }
      }
      draw(stage, frame);
    }
    let ticking = false;
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; update(); }); } }, { passive: true });
    addEventListener("resize", update);
    return { refresh() { if (stage >= 0) nameEl.textContent = u("stages")[stage]; update(); } };
  })();

  renderAll();
})();
