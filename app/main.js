// Router + controls for Statistik Indonesia. Hash routes, one page per
// section; every control on a page does what it says, and re-rendering a
// page redraws its charts (charts read CSS vars, so the theme toggle works).
//
//   #/                Beranda (KPI + grafik, pemilih tahun)
//   #/demografi       Piramida penduduk + tabel umur
//   #/ekonomi         PDB, inflasi, perdagangan (pemilih tahun)
//   #/tenaga-kerja    Pengangguran + sektor + pendidikan
//   #/kemiskinan      Kemiskinan + IPM
//   #/kesehatan       Stunting, harapan hidup, fasilitas
//   #/provinsi        Tabel 38 provinsi: cari, saring, urut, bandingkan, CSV
//   #/kalkulator      Daya beli, pertumbuhan majemuk, pangsa provinsi
//   #/metodologi      Sumber dan catatan
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { YEARS, SERIES, AGE_GROUPS_2024, EMPLOYMENT_2024, TRADE_2024, PROVINCES, CPI, fmt } from './data.js';
import { lineChart, barChart, hbarChart, pyramidChart } from './charts.js';
import * as views from './views.js';

const app = document.getElementById('app');
let year = 2024;

const ROUTES = {
  '/': () => views.overview(year),
  '/demografi': () => views.demografi(),
  '/ekonomi': () => views.ekonomi(year),
  '/tenaga-kerja': () => views.tenagaKerja(),
  '/kemiskinan': () => views.kemiskinan(),
  '/kesehatan': () => views.kesehatan(),
  '/provinsi': () => views.provinsi(),
  '/kalkulator': () => views.kalkulator(),
  '/metodologi': () => views.metodologi(),
};

function seriesOf(canvas) {
  const name = canvas.dataset.series;
  if (name === 'stunting') return { values: [27.7, 24.4, 21.6, 21.5, 19.8], labels: ['2019', '2021', '2022', '2023', '2024'] };
  return { values: SERIES[name], labels: YEARS };
}

function drawCharts() {
  document.querySelectorAll('canvas[data-chart]').forEach((c) => {
    const kind = c.dataset.chart;
    const hi = c.dataset.highlight !== undefined ? Number(c.dataset.highlight) : undefined;
    const digits = c.dataset.digits !== undefined ? Number(c.dataset.digits) : 1;
    if (kind === 'pyramid') {
      pyramidChart(c, AGE_GROUPS_2024);
      return;
    }
    if (kind === 'hbar') {
      if (c.dataset.rows === 'trade') {
        hbarChart(c, TRADE_2024.topExports.map((t) => ({ label: t.item, value: t.share })), { digits: 1 });
      } else {
        hbarChart(c, EMPLOYMENT_2024.bySector.map((s) => ({ label: s.sector, value: s.share })), { digits: 2 });
      }
      return;
    }
    const { values, labels } = seriesOf(c);
    const lbls = c.dataset.labels ? c.dataset.labels.split(',') : labels;
    if (kind === 'line') lineChart(c, lbls, values, { highlight: hi, digits });
    if (kind === 'bar') barChart(c, lbls, values, { highlight: hi, digits });
  });
}

// ---- province table: search, island filter, column sort, compare, CSV ----
const provState = { q: '', island: 'Semua', sort: 'name', dir: 1, compare: [] };

function filteredProvinces() {
  let rows = PROVINCES.filter((p) => (provState.island === 'Semua' || p.island === provState.island));
  if (provState.q) {
    const q = provState.q.toLowerCase();
    rows = rows.filter((p) => p.name.toLowerCase().includes(q) || p.island.toLowerCase().includes(q));
  }
  const k = provState.sort;
  rows = [...rows].sort((a, b) => {
    const av = a[k];
    const bv = b[k];
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv), 'id');
    return cmp * provState.dir;
  });
  return rows;
}

function renderProvBody() {
  const body = document.getElementById('provBody');
  if (!body) return;
  const rows = filteredProvinces();
  body.innerHTML = rows
    .map((p) => {
      const checked = provState.compare.includes(p.name) ? ' checked' : '';
      return `<tr><td>${p.name}</td><td>${p.island}</td><td>${fmt(p.pop, 2)}</td><td>${fmt(p.poverty, 2)}</td><td>${fmt(p.hdi, 2)}</td><td>${p.gdpCap}</td><td><input type="checkbox" data-compare="${p.name}" aria-label="Bandingkan ${p.name}"${checked}></td></tr>`;
    })
    .join('') || `<tr><td colspan="7">Tidak ada provinsi yang cocok. <button type="button" id="provEmptyReset">Reset saringan</button></td></tr>`;
  const empty = document.getElementById('provEmptyReset');
  if (empty) empty.addEventListener('click', resetProv);
  renderCompare();
}

function renderCompare() {
  const box = document.getElementById('compareBox');
  if (!box) return;
  if (provState.compare.length < 2) {
    box.hidden = provState.compare.length === 0;
    if (provState.compare.length === 1) {
      box.innerHTML = `<b>Bandingkan:</b> ${provState.compare[0]} — centang satu provinsi lagi untuk melihat perbandingan. <button type="button" id="cmpClear">Batal</button>`;
      document.getElementById('cmpClear').addEventListener('click', () => {
        provState.compare = [];
        renderProvBody();
      });
    }
    return;
  }
  const [a, b] = provState.compare.map((n) => PROVINCES.find((p) => p.name === n));
  const row = (label, va, vb, unit) =>
    `<tr><td>${label}</td><td><b>${va}</b> ${unit}</td><td><b>${vb}</b> ${unit}</td><td>${va > vb ? a.name : va < vb ? b.name : 'Seri'}</td></tr>`;
  box.hidden = false;
  box.innerHTML = `<h3>Perbandingan provinsi</h3>
<table class="tbl"><thead><tr><th>Ukuran</th><th>${a.name}</th><th>${b.name}</th><th>Lebih besar</th></tr></thead><tbody>
${row('Penduduk', fmt(a.pop, 2), fmt(b.pop, 2), 'jt')}
${row('Kemiskinan', fmt(a.poverty, 2), fmt(b.poverty, 2), '%')}
${row('IPM', fmt(a.hdi, 2), fmt(b.hdi, 2), '')}
${row('PDRB/kapita', a.gdpCap, b.gdpCap, 'Rp jt')}
</tbody></table>
<p><button type="button" id="cmpClear">Hapus perbandingan</button></p>`;
  document.getElementById('cmpClear').addEventListener('click', () => {
    provState.compare = [];
    renderProvBody();
  });
}

function resetProv() {
  provState.q = '';
  provState.island = 'Semua';
  provState.sort = 'name';
  provState.dir = 1;
  provState.compare = [];
  const s = document.getElementById('provSearch');
  const i = document.getElementById('provIsland');
  if (s) s.value = '';
  if (i) i.value = 'Semua';
  renderProvBody();
}

function downloadCsv() {
  const rows = filteredProvinces();
  const head = 'Provinsi,Pulau,Penduduk (juta),Kemiskinan (%),IPM,PDRB per kapita (Rp juta)';
  const lines = rows.map((p) => `"${p.name}","${p.island}",${p.pop},${p.poverty},${p.hdi},${p.gdpCap}`);
  const blob = new Blob([[head, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'provinsi-indonesia-2024.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

function wireProvinces() {
  const search = document.getElementById('provSearch');
  const island = document.getElementById('provIsland');
  const csv = document.getElementById('provCsv');
  const reset = document.getElementById('provReset');
  if (!search) return;
  // Fresh visit, fresh filters: the inputs are rebuilt on every render, so
  // the stored filter state must reset with them (a stale search query from
  // an earlier visit would otherwise empty the table on return).
  provState.q = '';
  provState.island = 'Semua';
  provState.sort = 'name';
  provState.dir = 1;
  provState.compare = [];
  search.addEventListener('input', () => {
    provState.q = search.value.trim();
    renderProvBody();
  });
  island.addEventListener('change', () => {
    provState.island = island.value;
    renderProvBody();
  });
  csv.addEventListener('click', downloadCsv);
  reset.addEventListener('click', resetProv);
  document.querySelectorAll('th[data-sort]').forEach((th) => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const k = th.dataset.sort;
      if (provState.sort === k) provState.dir *= -1;
      else {
        provState.sort = k;
        provState.dir = 1;
      }
      renderProvBody();
    });
  });
  document.getElementById('provBody').addEventListener('change', (e) => {
    const box = e.target.closest('[data-compare]');
    if (!box) return;
    const name = box.dataset.compare;
    if (box.checked) {
      if (provState.compare.length >= 2) {
        box.checked = false;
        alert('Bandingkan maksimal 2 provinsi. Hapus salah satu dulu.');
        return;
      }
      provState.compare.push(name);
    } else {
      provState.compare = provState.compare.filter((n) => n !== name);
    }
    renderProvBody();
  });
  renderProvBody();
}

// ---- calculators ----
function calcPurchasing() {
  const amount = Number(document.getElementById('calcAmount').value) || 0;
  const from = Number(document.getElementById('calcFrom').value);
  const to = Number(document.getElementById('calcTo').value);
  const fi = YEARS.indexOf(from);
  const ti = YEARS.indexOf(to);
  const out = document.getElementById('calcResult');
  if (fi < 0 || ti < 0) return;
  const value = (amount * CPI[ti]) / CPI[fi];
  out.textContent = 'Rp ' + Math.round(value).toLocaleString('id-ID');
}

function calcGrowth() {
  const start = Number(document.getElementById('growStart').value) || 0;
  const rate = Number(document.getElementById('growRate').value) || 0;
  const years = Number(document.getElementById('growYears').value) || 0;
  const out = document.getElementById('growResult');
  const value = start * Math.pow(1 + rate / 100, years);
  out.textContent = 'Rp ' + Math.round(value).toLocaleString('id-ID');
}

function calcShare() {
  const name = document.getElementById('shareProv').value;
  const p = PROVINCES.find((x) => x.name === name);
  const out = document.getElementById('shareResult');
  if (!p) return;
  out.textContent = fmt(p.pop, 2) + ' jt jiwa (' + fmt((p.pop / 281.6) * 100, 1) + '% dari 281,6 jt)';
}

function wireCalculators() {
  if (!document.getElementById('calcAmount')) return;
  ['calcAmount', 'calcFrom', 'calcTo'].forEach((id) => document.getElementById(id).addEventListener('input', calcPurchasing));
  ['growStart', 'growRate', 'growYears'].forEach((id) => document.getElementById(id).addEventListener('input', calcGrowth));
  document.getElementById('shareProv').addEventListener('change', calcShare);
  calcPurchasing();
  calcGrowth();
  calcShare();
}

// ---- theme ----
function wireTheme() {
  const btn = document.getElementById('themeBtn');
  btn.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    btn.textContent = dark ? '☀️ Mode terang' : '🌙 Mode gelap';
    drawCharts();
  });
}

function render() {
  window.__shotReady = false;
  const path = location.hash.replace(/^#/, '') || '/';
  const view = ROUTES[path] || views.missing;
  document.title = `${path === '/' ? 'Statistik Indonesia' : path.slice(1).replace(/-/g, ' ')} | Statistik Indonesia`;
  app.innerHTML = view();
  document.querySelectorAll('nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + path);
  });
  const yearSel = document.getElementById('yearSel');
  if (yearSel) {
    yearSel.addEventListener('change', () => {
      year = Number(yearSel.value);
      render();
    });
  }
  drawCharts();
  wireProvinces();
  wireCalculators();
  // "/" focuses the province search when it is on screen.
  const search = document.getElementById('provSearch');
  if (search) {
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== search) {
        e.preventDefault();
        search.focus();
      }
    }, { once: true });
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

wireTheme();
window.addEventListener('hashchange', render);
window.addEventListener('resize', () => drawCharts());
render();
