/* Affiche le contenu de data.js. Normalement tu n'as pas besoin de modifier ce fichier. */
(function () {
  const D = window.PORTFOLIO;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- petites icônes pixel (1 caractère = 1 pixel) ---------- */
  const ICONS = {
    trophy: [
      "..XXXXXX..",
      "XXXXXXXXXX",
      "X.XXXXXX.X",
      "X.XXXXXX.X",
      ".XXXXXXXX.",
      "..XXXXXX..",
      "....XX....",
      "....XX....",
      "..XXXXXX..",
      "..XXXXXX.."
    ],
    lock: [
      "...XXXX...",
      "..X....X..",
      "..X....X..",
      "..X....X..",
      ".XXXXXXXX.",
      ".XXXXXXXX.",
      ".XXX..XXX.",
      ".XXX..XXX.",
      ".XXXXXXXX.",
      ".XXXXXXXX."
    ]
  };
  function pixelIcon(name, color) {
    const rows = ICONS[name];
    let rects = "";
    rows.forEach((row, y) => [...row].forEach((c, x) => { if (c === "X") rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`; }));
    return `<svg class="icon" viewBox="0 0 10 10" shape-rendering="crispEdges" aria-hidden="true" fill="${color}">${rects}</svg>`;
  }

  /* ---------- profil ---------- */
  const P = D.profil;
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const v = P[el.dataset.bind];
    if (v !== undefined && v !== "") el.textContent = v;
  });
  $("#year").textContent = new Date().getFullYear();

  /* ---------- compétences ---------- */
  const pips = (n) => `<span class="pips" role="img" aria-label="niveau ${n} sur 3">${[1, 2, 3].map((i) => `<i class="${i <= n ? "on" : ""}"></i>`).join("")}</span>`;
  document.querySelectorAll(".legend .pips").forEach((el) => { el.outerHTML = pips(+el.dataset.n); });
  $("#skills").innerHTML = D.competences.map((g) => `
    <article class="card skill-group">
      <h3>${esc(g.groupe)}</h3>
      <ul>${g.items.map((it) => `<li><span>${esc(it.nom)}</span>${pips(it.niveau)}</li>`).join("")}</ul>
    </article>`).join("");

  /* ---------- projets + onglets ---------- */
  const CATS = [
    { id: "tous", nom: "Tous" },
    { id: "cyber", nom: "Cybersécurité" },
    { id: "web", nom: "Sites web" },
    { id: "ia", nom: "Automatisation IA" }
  ];
  const STATUT = { "termine": "Terminé", "en-cours": "En cours" };
  const projets = D.projets || [];
  const tabs = $("#tabs"), list = $("#projects-list");

  function projectCard(p) {
    const l = p.liens || {};
    const links = [
      l.code && `<a href="${esc(l.code)}" target="_blank" rel="noopener">Code ↗</a>`,
      l.demo && `<a href="${esc(l.demo)}" target="_blank" rel="noopener">Démo ↗</a>`,
      l.rapport && `<a href="${esc(l.rapport)}" target="_blank" rel="noopener">Write-up ↗</a>`
    ].filter(Boolean).join("");
    const cat = CATS.find((c) => c.id === p.categorie);
    return `
      <article class="card project">
        <div class="meta"><span>${esc(cat ? cat.nom : p.categorie)}${p.annee ? " · " + esc(p.annee) : ""}</span>
          <span class="status ${esc(p.statut)}">${esc(STATUT[p.statut] || p.statut || "")}</span></div>
        <h3>${esc(p.titre)}</h3>
        <p>${esc(p.resume)}</p>
        <ul class="stack">${(p.stack || []).map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        ${links ? `<div class="links">${links}</div>` : ""}
      </article>`;
  }
  const SLOT_TEXT = {
    tous: "Mes premiers projets arrivent bientôt.",
    cyber: "Write-ups de CTF et labs de pentest à venir.",
    web: "Sites et applications web à venir.",
    ia: "Workflows et agents IA à venir."
  };
  function render(cat) {
    const items = cat === "tous" ? projets : projets.filter((p) => p.categorie === cat);
    const slot = `<div class="slot"><span class="plus" aria-hidden="true">+</span><b>Emplacement libre</b><span>${SLOT_TEXT[cat]}</span></div>`;
    list.innerHTML = items.map(projectCard).join("") + (items.length < 3 ? slot : "");
    list.setAttribute("aria-labelledby", "tab-" + cat);
  }
  tabs.innerHTML = CATS.map((c, i) => {
    const n = c.id === "tous" ? projets.length : projets.filter((p) => p.categorie === c.id).length;
    return `<button class="tab" role="tab" id="tab-${c.id}" data-cat="${c.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${c.nom}<span class="count">${n}</span></button>`;
  }).join("");
  function select(btn) {
    tabs.querySelectorAll(".tab").forEach((b) => { b.setAttribute("aria-selected", b === btn); b.tabIndex = b === btn ? 0 : -1; });
    render(btn.dataset.cat);
  }
  tabs.addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (b) select(b); });
  tabs.addEventListener("keydown", (e) => {
    const all = [...tabs.querySelectorAll(".tab")], i = all.indexOf(document.activeElement);
    if (i < 0 || !["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const next = all[(i + (e.key === "ArrowRight" ? 1 : all.length - 1)) % all.length];
    next.focus(); select(next);
  });
  render("tous");

  /* ---------- certifications ---------- */
  const certs = D.certifications || [];
  $("#cert-count").textContent = certs.filter((c) => !c.verrouille).length;
  $("#certs").innerHTML = certs.map((c) => {
    if (c.verrouille) return `
      <article class="card cert locked">
        ${pixelIcon("lock", "currentColor")}
        <h3>${esc(c.titre)}</h3>
        <span class="who">${esc(c.emetteur || "En préparation")}</span>
        <span class="who">Succès à débloquer</span>
      </article>`;
    const links = [
      c.pdf && `<a href="${esc(c.pdf)}" target="_blank" rel="noopener">Voir le certificat</a>`,
      c.verifier && `<a href="${esc(c.verifier)}" target="_blank" rel="noopener">Vérifier ↗</a>`
    ].filter(Boolean).join("");
    return `
      <article class="card cert">
        ${pixelIcon("trophy", "var(--coin)")}
        <h3>${esc(c.titre)}</h3>
        <span class="who">${esc(c.emetteur)}${c.date ? " · " + esc(c.date) : ""}</span>
        <div class="links">${links}</div>
      </article>`;
  }).join("");

  /* ---------- parcours ---------- */
  $("#timeline").innerHTML = (D.parcours || []).map((e) => `
    <li>
      <span class="when">${esc(e.periode)}</span>
      <div><h3>${esc(e.titre)}</h3><span class="where">${esc(e.lieu)}</span>${e.texte ? `<p>${esc(e.texte)}</p>` : ""}</div>
    </li>`).join("");

  /* ---------- contact ---------- */
  const linkBtns = [
    P.github && `<a class="btn" href="${esc(P.github)}" target="_blank" rel="noopener">GitHub ↗</a>`,
    P.linkedin && `<a class="btn" href="${esc(P.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>`,
    P.tryhackme && `<a class="btn" href="${esc(P.tryhackme)}" target="_blank" rel="noopener">Profil CTF ↗</a>`,
    P.cv && `<a class="btn primary" href="${esc(P.cv)}" target="_blank" rel="noopener">Télécharger mon CV</a>`,
    P.email && `<a class="btn ghost" href="mailto:${esc(P.email)}">Écrire un email</a>`
  ].filter(Boolean).join("");
  $("#links").innerHTML = linkBtns;
  document.querySelectorAll('[data-link="github"]').forEach((a) => { if (P.github) a.href = P.github; else a.remove(); });

  const toast = $("#toast");
  let tt;
  function say(msg) { toast.textContent = msg; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("show"), 2200); }
  $("#copy-btn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(P.email); say("Email copié"); }
    catch (e) {
      const r = document.createRange(); r.selectNodeContents($("#email"));
      const s = getSelection(); s.removeAllRanges(); s.addRange(r); say("Email sélectionné : Ctrl+C pour copier");
    }
  });

  /* ---------- thème ---------- */
  const root = document.documentElement;
  $("#theme-btn").addEventListener("click", () => {
    const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    const next = cur === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- lien actif dans la barre ---------- */
  const navLinks = [...document.querySelectorAll(".nav a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));

  /* ---------- code Konami : mode écran CRT ---------- */
  const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let pos = 0;
  addEventListener("keydown", (e) => {
    pos = e.key.toLowerCase() === code[pos].toLowerCase() ? pos + 1 : (e.key === code[0] ? 1 : 0);
    if (pos === code.length) { pos = 0; document.body.classList.toggle("crt"); say(document.body.classList.contains("crt") ? "Mode CRT activé" : "Mode CRT désactivé"); }
  });
})();
