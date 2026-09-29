/* FinTrack — gestionnaire de dépenses en JavaScript pur.
   Organisation : constantes → stockage → utilitaires → rendu (KPI, graphiques, budgets, tableau) → formulaires → démarrage. */
"use strict";

/* ========================= CONSTANTES ========================= */
const STORAGE_KEY = "fintrack.v1";
const CATEGORIES = {
  expense: ["Alimentation", "Transport", "Logement", "Factures", "Internet & mobile", "Études", "Santé", "Loisirs", "Shopping", "Autre"],
  income: ["Salaire", "Freelance", "Famille", "Bourse", "Autre revenu"]
};
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const MONTHS_SHORT = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

/* ========================= ÉTAT & STOCKAGE ========================= */
const defaultState = () => ({ transactions: [], budgets: { total: 0, byCat: {} }, settings: { currency: "XOF", theme: "" } });
let state = load();
let view = monthKey(new Date());           // mois affiché, format "AAAA-MM"
let editingId = null;
let lastDeleted = null;

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (raw && Array.isArray(raw.transactions)) return { ...defaultState(), ...raw, budgets: { total: 0, byCat: {}, ...raw.budgets }, settings: { ...defaultState().settings, ...raw.settings } };
  } catch (e) { /* stockage indisponible ou JSON invalide : on repart de zéro */ }
  return defaultState();
}
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { toast("Impossible d'enregistrer : le stockage du navigateur est plein ou bloqué."); }
}

/* ========================= UTILITAIRES ========================= */
const $ = (s) => document.querySelector(s);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
function monthKey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"); }
function isoDate(d) { return monthKey(d) + "-" + String(d.getDate()).padStart(2, "0"); }
function parseMonth(k) { const [y, m] = k.split("-").map(Number); return { y, m: m - 1 }; }
function shiftMonth(k, n) { const { y, m } = parseMonth(k); return monthKey(new Date(y, m + n, 1)); }
function daysIn(k) { const { y, m } = parseMonth(k); return new Date(y, m + 1, 0).getDate(); }
function monthLabel(k) { const { y, m } = parseMonth(k); return MONTHS[m][0].toUpperCase() + MONTHS[m].slice(1) + " " + y; }

function money(v, opts = {}) {
  const cur = state.settings.currency;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: cur, maximumFractionDigits: cur === "XOF" ? 0 : 2, ...opts }).format(v);
}
function compact(v) {   // pour les axes : 12 k, 1,2 M
  return new Intl.NumberFormat("fr-FR", { notation: "compact", maximumFractionDigits: 1 }).format(v);
}
function niceMax(v) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}
const txOf = (k) => state.transactions.filter((t) => t.date.startsWith(k));
const sum = (arr) => arr.reduce((a, t) => a + t.amount, 0);
function totals(k) {
  const list = txOf(k);
  const income = sum(list.filter((t) => t.type === "income"));
  const expense = sum(list.filter((t) => t.type === "expense"));
  return { income, expense, balance: income - expense, list };
}
function el(tag, attrs = {}, text) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text !== undefined) e.textContent = text;
  return e;
}
const SVG = "http://www.w3.org/2000/svg";
function s(tag, attrs = {}) { const e = document.createElementNS(SVG, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); return e; }
// barre verticale à coins arrondis en haut seulement, posée sur la ligne de base
function barPath(x, y, w, h, r = 4) {
  if (h <= 0) return "";
  r = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
}

/* ========================= INFOBULLE ========================= */
const tip = $("#tooltip");
function showTip(evt, title, rows) {
  tip.replaceChildren(el("div", { class: "t-title" }, title));
  rows.forEach((r) => {
    const row = el("div", { class: "t-row" });
    const line = el("span", { class: "t-line" }); line.style.background = r.color;
    row.append(line, el("b", {}, r.value), el("span", {}, r.label));
    tip.append(row);
  });
  tip.hidden = false;
  const rect = evt.target.getBoundingClientRect();
  const x = evt.clientX ?? rect.left + rect.width / 2, y = evt.clientY ?? rect.top;
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  tip.style.left = Math.min(innerWidth - tw - 8, Math.max(8, x - tw / 2)) + "px";
  tip.style.top = Math.max(8, y - th - 14) + "px";
}
const hideTip = () => { tip.hidden = true; };

/* ========================= RENDU ========================= */
function render() {
  $("#month-label").textContent = monthLabel(view);
  $("#next-month").disabled = view >= monthKey(new Date());
  const hasData = state.transactions.length > 0;
  $("#empty").hidden = hasData;
  $("#dash").hidden = !hasData;
  $("#currency").value = state.settings.currency;
  if (!hasData) return;
  renderKpis(); renderDaily(); renderBudgets(); renderTrend(); renderCats(); renderTable();
}

function renderKpis() {
  const cur = totals(view), prev = totals(shiftMonth(view, -1));
  $("#k-balance").textContent = money(cur.balance);
  $("#k-income").textContent = money(cur.income);
  $("#k-expense").textContent = money(cur.expense);
  const bal = $("#k-balance-sub");
  bal.textContent = !cur.income ? "Aucun revenu ce mois-ci" : cur.balance >= 0 ? `${Math.round((cur.balance / cur.income) * 100)} % des revenus épargnés` : "Dépenses supérieures aux revenus";
  bal.className = "kpi-sub " + (cur.balance >= 0 ? "up" : "down");
  const delta = (a, b) => b ? `${a >= b ? "+" : "−"}${Math.abs(Math.round(((a - b) / b) * 100))} % vs mois précédent` : "Pas de données le mois précédent";
  $("#k-income-sub").textContent = delta(cur.income, prev.income);
  $("#k-expense-sub").textContent = delta(cur.expense, prev.expense);
  const b = state.budgets.total;
  const bar = $("#k-budget-bar");
  if (b > 0) {
    const left = b - cur.expense, pct = cur.expense / b;
    $("#k-budget").textContent = money(left);
    $("#k-budget-sub").textContent = `${Math.round(pct * 100)} % de ${money(b)} utilisés`;
    bar.style.width = Math.min(100, pct * 100) + "%";
    bar.style.background = pct >= 1 ? "var(--crit)" : pct >= 0.8 ? "var(--warn)" : "var(--good)";
  } else {
    $("#k-budget").textContent = "—";
    $("#k-budget-sub").textContent = "Aucun budget défini";
    bar.style.width = "0";
  }
}

function chartFrame(host, h = 240) {
  host.replaceChildren();
  const W = Math.max(280, host.clientWidth || 520);
  const svg = s("svg", { viewBox: `0 0 ${W} ${h}`, role: "img" });
  host.append(svg);
  return { svg, W, H: h, pad: { l: 44, r: 8, t: 12, b: 26 } };
}
function yAxis(svg, W, pad, H, max) {
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i, y = H - pad.b - ((H - pad.t - pad.b) * i) / 4;
    svg.append(s("line", { x1: pad.l, x2: W - pad.r, y1: y, y2: y, class: i === 0 ? "baseline" : "gridline" }));
    const t = s("text", { x: pad.l - 8, y: y + 4, "text-anchor": "end", class: "tick" }); t.textContent = compact(v);
    svg.append(t);
  }
}

function renderDaily() {
  const host = $("#chart-daily");
  const n = daysIn(view);
  const days = Array.from({ length: n }, () => 0);
  txOf(view).filter((t) => t.type === "expense").forEach((t) => { days[+t.date.slice(8, 10) - 1] += t.amount; });
  const total = days.reduce((a, b) => a + b, 0);
  const active = days.filter((d) => d > 0).length;
  $("#daily-sub").textContent = total ? `Moyenne ${money(total / Math.max(1, isCurrent() ? new Date().getDate() : n))} par jour · ${active} jours avec dépenses` : "Aucune dépense ce mois-ci";
  if (!total) { host.replaceChildren(el("div", { class: "chart-empty" }, "Aucune dépense enregistrée pour ce mois.")); return; }
  const { svg, W, H, pad } = chartFrame(host);
  svg.setAttribute("aria-label", `Dépenses par jour, ${monthLabel(view)}. Total ${money(total)}.`);
  const max = niceMax(Math.max(...days));
  yAxis(svg, W, pad, H, max);
  const plotW = W - pad.l - pad.r, plotH = H - pad.t - pad.b, slot = plotW / n, bw = Math.max(2, slot - 2);
  const today = isCurrent() ? new Date().getDate() : -1;
  const peak = days.indexOf(Math.max(...days));
  days.forEach((v, i) => {
    const x = pad.l + i * slot + (slot - bw) / 2, h = (v / max) * plotH, y = H - pad.b - h;
    const g = s("g", { class: "col" });
    g.append(s("rect", { class: "hover-bg", x: pad.l + i * slot, y: pad.t, width: slot, height: plotH }));
    if (v > 0) g.append(s("path", { d: barPath(x, y, bw, h), class: "bar-out mark" }));
    const hit = s("rect", { class: "hit", x: pad.l + i * slot, y: pad.t, width: slot, height: plotH + pad.b, tabindex: v > 0 ? 0 : -1 });
    const { y: yy, m } = parseMonth(view);
    const label = `${i + 1} ${MONTHS[m]} ${yy}`;
    const on = (e) => { g.classList.add("active"); showTip(e, label, [{ color: "var(--out)", value: money(v), label: "dépensés" }]); };
    hit.addEventListener("pointermove", on); hit.addEventListener("focus", on);
    hit.addEventListener("pointerleave", () => { g.classList.remove("active"); hideTip(); });
    hit.addEventListener("blur", () => { g.classList.remove("active"); hideTip(); });
    g.append(hit);
    svg.append(g);
    if (i + 1 === today || ((i === 0 || (i + 1) % 5 === 0) && (today < 0 || Math.abs(i + 1 - today) > 2))) {
      const t = s("text", { x: pad.l + i * slot + slot / 2, y: H - 8, "text-anchor": "middle", class: "tick" + (i + 1 === today ? " today" : "") });
      t.textContent = i + 1 === today ? "auj." : i + 1; svg.append(t);
    }
  });
  // étiquette directe sur le pic uniquement
  if (days[peak] > 0) {
    const x = pad.l + peak * slot + slot / 2, y = H - pad.b - (days[peak] / max) * plotH - 6;
    const t = s("text", { x: Math.min(W - 30, Math.max(pad.l + 20, x)), y: Math.max(10, y), "text-anchor": "middle", class: "tick" });
    t.textContent = compact(days[peak]); svg.append(t);
  }
}
const isCurrent = () => view === monthKey(new Date());

function renderTrend() {
  const host = $("#chart-trend");
  const months = Array.from({ length: 6 }, (_, i) => shiftMonth(view, i - 5));
  const data = months.map((k) => { const t = totals(k); return { k, income: t.income, expense: t.expense }; });
  const { svg, W, H, pad } = chartFrame(host);
  svg.setAttribute("aria-label", "Revenus et dépenses des 6 derniers mois. " + data.map((d) => `${monthLabel(d.k)} : revenus ${money(d.income)}, dépenses ${money(d.expense)}`).join(". "));
  const max = niceMax(Math.max(1, ...data.map((d) => Math.max(d.income, d.expense))));
  yAxis(svg, W, pad, H, max);
  const plotW = W - pad.l - pad.r, plotH = H - pad.t - pad.b, slot = plotW / 6;
  const bw = Math.min(28, (slot - 18) / 2);
  data.forEach((d, i) => {
    const cx = pad.l + i * slot + slot / 2;
    const g = s("g", { class: "col" });
    g.append(s("rect", { class: "hover-bg", x: pad.l + i * slot + 4, y: pad.t, width: slot - 8, height: plotH, rx: 6 }));
    const hi = (d.income / max) * plotH, he = (d.expense / max) * plotH;
    const grp = s("g", { class: "mark" });
    if (hi > 0) grp.append(s("path", { d: barPath(cx - bw - 1, H - pad.b - hi, bw, hi), class: "bar-in" }));   // 2px d'écart entre les barres
    if (he > 0) grp.append(s("path", { d: barPath(cx + 1, H - pad.b - he, bw, he), class: "bar-out" }));
    g.append(grp);
    const hit = s("rect", { class: "hit", x: pad.l + i * slot, y: pad.t, width: slot, height: plotH + pad.b, tabindex: 0 });
    const on = (e) => {
      g.classList.add("active");
      showTip(e, monthLabel(d.k), [
        { color: "var(--in)", value: money(d.income), label: "revenus" },
        { color: "var(--out)", value: money(d.expense), label: "dépenses" },
        { color: "transparent", value: money(d.income - d.expense), label: "solde" }
      ]);
    };
    hit.addEventListener("pointermove", on); hit.addEventListener("focus", on);
    hit.addEventListener("pointerleave", () => { g.classList.remove("active"); hideTip(); });
    hit.addEventListener("blur", () => { g.classList.remove("active"); hideTip(); });
    g.append(hit); svg.append(g);
    const { m } = parseMonth(d.k);
    const t = s("text", { x: cx, y: H - 8, "text-anchor": "middle", class: "tick" + (d.k === view ? " today" : "") });
    t.textContent = MONTHS_SHORT[m]; svg.append(t);
  });
}

function spentByCat(k) {
  const map = {};
  txOf(k).filter((t) => t.type === "expense").forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
  return map;
}

function renderCats() {
  const map = spentByCat(view);
  const rows = Object.entries(map).sort((a, b) => b[1] - a[1]);
  const total = rows.reduce((a, r) => a + r[1], 0);
  const ul = $("#cat-bars"); ul.replaceChildren();
  if (!rows.length) { ul.append(el("li", { class: "chart-empty" }, "Aucune dépense ce mois-ci.")); return; }
  // au-delà de 7 catégories, le reste est regroupé dans « Autres »
  const shown = rows.slice(0, 7);
  if (rows.length > 7) shown.push(["Autres", rows.slice(7).reduce((a, r) => a + r[1], 0)]);
  const max = shown[0][1];
  $("#cats-sub").textContent = `${money(total)} dépensés, répartis sur ${rows.length} catégories`;
  shown.forEach(([cat, v]) => {
    const li = el("li");
    const track = el("div", { class: "track" }), fill = el("div", { class: "fill" });
    fill.style.width = (v / max) * 100 + "%";
    track.append(fill);
    const val = el("span", { class: "val" }, money(v));
    val.append(el("small", {}, Math.round((v / total) * 100) + " %"));
    li.append(el("span", {}, cat), track, val);
    ul.append(li);
  });
}

function renderBudgets() {
  const ul = $("#budgets"); ul.replaceChildren();
  const spent = spentByCat(view);
  const entries = Object.entries(state.budgets.byCat).filter(([, v]) => v > 0);
  if (!entries.length) {
    ul.append(el("li", { class: "none" }, "Aucun plafond par catégorie. Clique sur « Modifier » pour en fixer un."));
    return;
  }
  entries.map(([cat, cap]) => ({ cat, cap, used: spent[cat] || 0 }))
    .sort((a, b) => b.used / b.cap - a.used / a.cap)
    .forEach(({ cat, cap, used }) => {
      const pct = used / cap;
      const lvl = pct >= 1 ? "crit" : pct >= 0.8 ? "warn" : "good";
      const li = el("li", { class: "budget" });
      const top = el("div", { class: "budget-top" });
      const name = el("b", {}, cat);
      const st = el("span", { class: "status " + lvl }, lvl === "crit" ? "✕ Dépassé" : lvl === "warn" ? "! Attention" : "✓ OK");
      const nameWrap = el("div"); nameWrap.append(name, document.createTextNode(" "), st);
      top.append(nameWrap, el("span", {}, `${money(used)} / ${money(cap)}`));
      const meter = el("div", { class: "meter", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(pct * 100), "aria-label": cat });
      const fill = el("i", { class: lvl === "good" ? "" : lvl }); fill.style.width = Math.min(100, pct * 100) + "%";
      meter.append(fill);
      li.append(top, meter);
      ul.append(li);
    });
}

function renderTable() {
  const q = $("#f-search").value.trim().toLowerCase();
  const type = $("#f-type").value, cat = $("#f-cat").value;
  const list = txOf(view)
    .filter((t) => (type === "all" || t.type === type) && (cat === "all" || t.category === cat) && (!q || (t.note || "").toLowerCase().includes(q) || t.category.toLowerCase().includes(q)))
    .sort((a, b) => b.date.localeCompare(a.date) || b.created - a.created);
  const body = $("#tx-body"); body.replaceChildren();
  $("#tx-sub").textContent = `${list.length} opération${list.length > 1 ? "s" : ""} en ${monthLabel(view).toLowerCase()}`;
  $("#tx-empty").hidden = list.length > 0;
  list.forEach((t) => {
    const tr = el("tr");
    const d = new Date(t.date + "T12:00:00");
    tr.append(el("td", { class: "date" }, d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })));
    tr.append(el("td", {}, t.note || "—"));
    const chipTd = el("td"); const chip = el("span", { class: "chip" });
    chip.append(el("i", { class: "key " + (t.type === "income" ? "key-in" : "key-out") }), document.createTextNode(t.category));
    chipTd.append(chip); tr.append(chipTd);
    tr.append(el("td", { class: "num " + (t.type === "income" ? "amount-in" : "amount-out") }, (t.type === "income" ? "+ " : "− ") + money(t.amount)));
    const act = el("td"); const box = el("div", { class: "row-actions" });
    const edit = el("button", { type: "button", "aria-label": "Modifier " + (t.note || t.category) }, "Modifier");
    const del = el("button", { type: "button", "aria-label": "Supprimer " + (t.note || t.category) }, "Supprimer");
    edit.addEventListener("click", () => openTx(t));
    del.addEventListener("click", () => removeTx(t.id));
    box.append(edit, del); act.append(box); tr.append(act);
    body.append(tr);
  });
}

function fillCategoryFilter() {
  const f = $("#f-cat"), keep = f.value;
  f.replaceChildren(el("option", { value: "all" }, "Toutes catégories"));
  [...CATEGORIES.expense, ...CATEGORIES.income].forEach((c) => f.append(el("option", { value: c }, c)));
  f.value = keep || "all";
}

/* ========================= OPÉRATIONS ========================= */
const txDialog = $("#tx-dialog"), txForm = $("#tx-form");
function setCatOptions(type, selected) {
  const sel = $("#t-cat"); sel.replaceChildren();
  CATEGORIES[type].forEach((c) => sel.append(el("option", { value: c }, c)));
  if (selected) sel.value = selected;
}
function openTx(t) {
  editingId = t ? t.id : null;
  $("#tx-title").textContent = t ? "Modifier l'opération" : "Nouvelle opération";
  $("#tx-submit").textContent = t ? "Enregistrer" : "Ajouter";
  const type = t ? t.type : "expense";
  txForm.type.value = type;
  setCatOptions(type, t && t.category);
  $("#t-amount").value = t ? t.amount : "";
  $("#t-note").value = t ? t.note : "";
  // par défaut : aujourd'hui si on regarde le mois en cours, sinon le 1er du mois affiché
  $("#t-date").value = t ? t.date : (isCurrent() ? isoDate(new Date()) : view + "-01");
  $("#tx-error").hidden = true;
  txDialog.showModal();
  $("#t-amount").focus();
}
txForm.addEventListener("change", (e) => { if (e.target.name === "type") setCatOptions(e.target.value); });
txForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = parseFloat(String($("#t-amount").value).replace(",", "."));
  const date = $("#t-date").value;
  const err = $("#tx-error");
  if (!(amount > 0)) { err.textContent = "Indique un montant supérieur à 0."; err.hidden = false; $("#t-amount").focus(); return; }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) { err.textContent = "Choisis une date."; err.hidden = false; $("#t-date").focus(); return; }
  const data = { type: txForm.type.value, amount, category: $("#t-cat").value, date, note: $("#t-note").value.trim() };
  if (editingId) {
    const t = state.transactions.find((x) => x.id === editingId);
    Object.assign(t, data);
    toast("Opération modifiée");
  } else {
    state.transactions.push({ id: uid(), created: Date.now(), ...data });
    toast(data.type === "income" ? "Revenu ajouté" : "Dépense ajoutée");
  }
  view = date.slice(0, 7);
  save(); txDialog.close(); render();
});
function removeTx(id) {
  const i = state.transactions.findIndex((t) => t.id === id);
  if (i < 0) return;
  lastDeleted = state.transactions.splice(i, 1)[0];
  save(); render();
  toast("Opération supprimée", () => { state.transactions.push(lastDeleted); lastDeleted = null; save(); render(); toast("Suppression annulée"); });
}

/* ========================= BUDGETS ========================= */
const budgetDialog = $("#budget-dialog");
function openBudgets() {
  $("#b-total").value = state.budgets.total || "";
  const box = $("#budget-fields"); box.replaceChildren();
  CATEGORIES.expense.forEach((c, i) => {
    const f = el("div", { class: "field" });
    const id = "b-cat-" + i;
    f.append(el("label", { for: id }, c));
    const inp = el("input", { id, type: "number", min: 0, step: "any", inputmode: "decimal", "data-cat": c });
    inp.value = state.budgets.byCat[c] || "";
    f.append(inp); box.append(f);
  });
  budgetDialog.showModal();
}
$("#budget-form").addEventListener("submit", (e) => {
  e.preventDefault();
  state.budgets.total = Math.max(0, parseFloat($("#b-total").value) || 0);
  state.budgets.byCat = {};
  document.querySelectorAll("#budget-fields input").forEach((inp) => {
    const v = parseFloat(inp.value); if (v > 0) state.budgets.byCat[inp.dataset.cat] = v;
  });
  save(); budgetDialog.close(); render(); toast("Budgets enregistrés");
});

/* ========================= IMPORT / EXPORT ========================= */
function download(name, content, type) {
  const blob = new Blob([content], { type });
  const a = el("a", { href: URL.createObjectURL(blob), download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$("#export-json").addEventListener("click", () => download(`fintrack-${isoDate(new Date())}.json`, JSON.stringify(state, null, 2), "application/json"));
$("#export-csv").addEventListener("click", () => {
  const rows = [["date", "type", "categorie", "description", "montant", "devise"]];
  [...state.transactions].sort((a, b) => a.date.localeCompare(b.date))
    .forEach((t) => rows.push([t.date, t.type === "income" ? "revenu" : "depense", t.category, t.note || "", t.amount, state.settings.currency]));
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
  download(`fintrack-${isoDate(new Date())}.csv`, "﻿" + csv, "text/csv");
});
$("#import-file").addEventListener("change", async (e) => {
  const file = e.target.files[0]; if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.transactions)) throw new Error("format");
    const clean = data.transactions.filter((t) => t && (t.type === "income" || t.type === "expense") && t.amount > 0 && /^\d{4}-\d{2}-\d{2}$/.test(t.date))
      .map((t) => ({ id: t.id || uid(), created: t.created || Date.now(), type: t.type, amount: +t.amount, category: String(t.category || "Autre"), date: t.date, note: String(t.note || "").slice(0, 80) }));
    state = { ...defaultState(), transactions: clean, budgets: { total: 0, byCat: {}, ...data.budgets }, settings: { ...state.settings, ...(data.settings && { currency: data.settings.currency || state.settings.currency }) } };
    save(); $("#data-dialog").close(); render(); toast(`${clean.length} opérations importées`);
  } catch (err) {
    toast("Ce fichier n'est pas une sauvegarde FinTrack valide.");
  }
  e.target.value = "";
});
$("#reset-btn").addEventListener("click", () => { $("#reset-confirm").hidden = false; });
$("#reset-no").addEventListener("click", () => { $("#reset-confirm").hidden = true; });
$("#reset-yes").addEventListener("click", () => {
  state = { ...defaultState(), settings: state.settings };
  save(); $("#reset-confirm").hidden = true; $("#data-dialog").close(); render(); toast("Toutes les données ont été effacées");
});

/* ========================= DONNÉES D'EXEMPLE ========================= */
function loadDemo() {
  let seed = 42;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const round = (v, step = 100) => Math.round(v / step) * step;
  const now = new Date();
  const tx = [];
  const add = (date, type, category, amount, note) => tx.push({ id: uid() + tx.length, created: tx.length, type, category, amount: round(amount), date: isoDate(date), note });
  for (let back = 5; back >= 0; back--) {
    const base = new Date(now.getFullYear(), now.getMonth() - back, 1);
    const last = back === 0 ? now.getDate() : new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    const day = (d) => new Date(base.getFullYear(), base.getMonth(), Math.min(d, last));
    add(day(2), "income", "Famille", 45000, "Aide familiale");
    if (rnd() > 0.25) add(day(8 + Math.floor(rnd() * 10)), "income", "Freelance", 40000 + rnd() * 90000, pick(["Site vitrine client", "Landing page", "Maintenance site web", "Workflow n8n client"]));
    add(day(5), "expense", "Logement", 35000, "Loyer chambre");
    add(day(10), "expense", "Factures", 5500 + rnd() * 4000, "Électricité SBEE");
    add(day(3), "expense", "Internet & mobile", 5000, "Forfait internet mensuel");
    if (rnd() > 0.6) add(day(15), "expense", "Études", 10000 + rnd() * 15000, pick(["Photocopies et supports", "Cours en ligne", "Livre réseau"]));
    for (let d = 1; d <= last; d++) {
      if (rnd() > 0.2) add(day(d), "expense", "Transport", 300 + rnd() * 1200, pick(["Zem aller-retour", "Zem", "Taxi-moto"]));
      if (rnd() > 0.35) add(day(d), "expense", "Alimentation", 700 + rnd() * 2800, pick(["Déjeuner", "Marché Dantokpa", "Pain et petit-déj", "Dîner", "Courses"]));
      if (rnd() > 0.93) add(day(d), "expense", "Loisirs", 2000 + rnd() * 6000, pick(["Sortie entre amis", "Cinéma", "Match"]));
      if (rnd() > 0.96) add(day(d), "expense", "Shopping", 3000 + rnd() * 12000, pick(["Vêtements", "Chaussures", "Accessoire téléphone"]));
      if (rnd() > 0.97) add(day(d), "expense", "Santé", 1500 + rnd() * 5000, "Pharmacie");
    }
  }
  state.transactions = tx;
  state.budgets = { total: 150000, byCat: { Alimentation: 55000, Transport: 25000, Loisirs: 12000, Shopping: 15000, "Internet & mobile": 6000 } };
  state.settings.currency = "XOF";
  view = monthKey(now);
  save(); render(); toast("Données d'exemple chargées");
}

/* ========================= NOTIFICATIONS ========================= */
let toastT;
function toast(msg, undo) {
  const t = $("#toast"), u = $("#toast-undo");
  $("#toast-msg").textContent = msg;
  u.hidden = !undo;
  u.onclick = undo ? () => { undo(); } : null;
  t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), undo ? 5000 : 2400);
}

/* ========================= ÉVÉNEMENTS ========================= */
$("#add-btn").addEventListener("click", () => openTx());
$("#budget-btn").addEventListener("click", openBudgets);
$("#data-btn").addEventListener("click", () => { $("#reset-confirm").hidden = true; $("#data-dialog").showModal(); });
$("#load-demo").addEventListener("click", () => { $("#data-dialog").close(); loadDemo(); });
document.querySelectorAll("[data-action=add]").forEach((b) => b.addEventListener("click", () => openTx()));
document.querySelectorAll("[data-action=demo]").forEach((b) => b.addEventListener("click", loadDemo));
document.querySelectorAll("dialog [data-close]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));
$("#prev-month").addEventListener("click", () => { view = shiftMonth(view, -1); render(); });
$("#next-month").addEventListener("click", () => { if (!isCurrent()) { view = shiftMonth(view, 1); render(); } });
$("#currency").addEventListener("change", (e) => { state.settings.currency = e.target.value; save(); render(); });
$("#theme-btn").addEventListener("click", () => {
  const root = document.documentElement;
  const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  root.dataset.theme = state.settings.theme = cur === "dark" ? "light" : "dark";
  save();
});
["#f-search", "#f-type", "#f-cat"].forEach((id) => $(id).addEventListener("input", renderTable));
addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "n" && !e.ctrlKey && !e.metaKey && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName) && !document.querySelector("dialog[open]")) { e.preventDefault(); openTx(); }
});
let resizeT;
addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => { if (state.transactions.length) { renderDaily(); renderTrend(); } }, 150); });
addEventListener("scroll", hideTip, { passive: true });

/* ========================= DÉMARRAGE ========================= */
fillCategoryFilter();
render();
