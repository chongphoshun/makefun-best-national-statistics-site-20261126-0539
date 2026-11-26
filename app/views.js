// Page HTML builders. Every value is escaped before it goes into the page.
// Each page carries its own source line so a visitor can check the figure.

import { YEARS, SERIES, AGE_GROUPS_2024, EMPLOYMENT_2024, HEALTH_EDU, TRADE_2024, PROVINCES, CPI, fmt, fmtInt } from './data.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const SRC = 'Sumber: BPS (Badan Pusat Statistik), 2024 — kecuali dinyatakan lain.';

function kpi(label, value, sub) {
  return `<div class="kpi"><div class="kpi-v">${value}</div><div class="kpi-l">${label}</div><div class="kpi-s">${sub}</div></div>`;
}

function card(title, inner, note = '') {
  return `<section class="card"><h2>${title}</h2>${inner}${note ? `<p class="src">${note}</p>` : ''}</section>`;
}

function yearOptions(selected) {
  return YEARS.map((y) => `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`).join('');
}

export function overview(year) {
  const i = YEARS.indexOf(year);
  return `
<h1>Indonesia dalam Angka</h1>
<p class="lede">Statistik nasional Indonesia 2015–${YEARS[YEARS.length - 1]}: penduduk, ekonomi, pekerjaan, kemiskinan, kesehatan dan pendidikan — semua angka nyata, semua bisa dicek sumbernya.</p>
<div class="kpis">
${kpi('Penduduk', fmt(SERIES.population[i]) + ' jt', 'Tahun ' + year + ' · BPS')}
${kpi('PDB nominal', 'Rp ' + fmtInt(SERIES.gdpNominal[i]) + ' T', 'Tahun ' + year + ' · BPS')}
${kpi('Pertumbuhan PDB', fmt(SERIES.gdpGrowth[i], 2) + '%', 'yoy · Tahun ' + year)}
${kpi('Inflasi', fmt(SERIES.inflation[i], 2) + '%', 'Des ' + year + ' yoy · BPS')}
${kpi('Pengangguran', fmt(SERIES.unemployment[i], 2) + '%', 'Agu ' + year + ' · Sakernas')}
${kpi('Kemiskinan', fmt(SERIES.poverty[i], 2) + '%', 'Tahun ' + year + ' · BPS')}
${kpi('IPM', fmt(SERIES.hdi[i], 2), 'Indeks Pembangunan Manusia ' + year)}
${kpi('Harapan hidup', fmt(SERIES.lifeExpectancy[i]) + ' thn', 'Tahun ' + year + ' · BPS')}
</div>
<div class="yearbar"><label for="yearSel">Tahun tampilan: </label>
<select id="yearSel" data-action="year">${yearOptions(year)}</select>
<span class="hint">Ubah tahun — semua kartu KPI di atas ikut berubah.</span></div>
${card('Pertumbuhan PDB 2015–2024', `<canvas id="ch-gdp" data-chart="line" data-series="gdpGrowth" data-highlight="${i}" data-digits="2"></canvas><p>Pertumbuhan jatuh ke −2,07% pada 2020 (pandemi COVID-19), lalu pulih di atas 5% pada 2022–2024. Rata-rata 2015–2019: 5,04% per tahun.</p>`, SRC)}
${card('Penduduk 2015–2024', `<canvas id="ch-pop" data-chart="line" data-series="population" data-highlight="${i}"></canvas><p>Dari 255,5 juta (2015) menjadi 281,6 juta (2024) — naik sekitar 26 juta jiwa dalam satu dekade.</p>`, SRC)}
${card('Sekilas 2024', `<ul class="facts">
<li><b>Ekspor US$ ${fmt(TRADE_2024.exports)} miliar</b>, impor US$ ${fmt(TRADE_2024.imports)} miliar — surplus US$ ${fmt(TRADE_2024.surplus)} miliar.</li>
<li><b>Cadangan devisa US$ ${fmt(TRADE_2024.reserves)} miliar</b> (Des 2024); kurs rata-rata Rp ${fmtInt(TRADE_2024.rupiahAvg)} per dolar AS.</li>
<li><b>144,64 juta orang bekerja</b> (Agu 2024); 59,17% di sektor informal.</li>
<li><b>Stunting balita 19,8%</b> (2024), turun dari 27,7% pada 2019.</li>
<li><b>38 provinsi</b> — Jawa Barat terbanyak (50,35 juta jiwa), Kalimantan Utara tersedikit (0,73 juta).</li>
</ul>`, SRC)}
<p class="navnext">Lanjut: <a href="#/demografi">Demografi →</a> · <a href="#/ekonomi">Ekonomi →</a> · <a href="#/provinsi">Provinsi →</a></p>`;
}

export function demografi() {
  const rows = AGE_GROUPS_2024.map(
    (g) => `<tr><td>${g.group}</td><td>${fmt(g.male)}</td><td>${fmt(g.female)}</td><td>${fmt(g.male + g.female)}</td></tr>`,
  ).join('');
  return `
<h1>Demografi</h1>
<p class="lede">281,6 juta penduduk (2024). Median usia sekitar 30 tahun — Indonesia masih dalam bonus demografi: penduduk usia kerja jauh lebih banyak daripada anak dan lansia.</p>
${card('Piramida penduduk 2024 (juta jiwa)', `<canvas id="ch-pyramid" data-chart="pyramid"></canvas><p>Kelompok 10–14 tahun paling besar (24,4 juta). Kelompok 65+ baru sekitar 12 juta — penuaan penduduk masih di awal.</p>`, 'Sumber: proyeksi penduduk BPS 2024, per kelompok umur 5 tahun.')}
${card('Penduduk menurut kelompok umur 2024', `<table class="tbl"><thead><tr><th>Umur</th><th>Laki-laki (jt)</th><th>Perempuan (jt)</th><th>Total (jt)</th></tr></thead><tbody>${rows}</tbody></table>`, SRC)}
<p class="navnext"><a href="#/">← Beranda</a> · <a href="#/ekonomi">Ekonomi →</a></p>`;
}

export function ekonomi(year) {
  const i = YEARS.indexOf(year);
  return `
<h1>Ekonomi</h1>
<p class="lede">PDB 2024 Rp 22.139 triliun (US$ ~1,40 triliun), tumbuh 5,03%. PDB per kapita Rp 78,6 juta — naik 74% dari Rp 45,1 juta pada 2015.</p>
<div class="yearbar"><label for="yearSel">Tahun tampilan: </label>
<select id="yearSel" data-action="year">${yearOptions(year)}</select>
<span class="hint">Tahun ${year}: PDB Rp ${fmtInt(SERIES.gdpNominal[i])} T · tumbuh ${fmt(SERIES.gdpGrowth[i], 2)}% · inflasi ${fmt(SERIES.inflation[i], 2)}%.</span></div>
${card('Pertumbuhan PDB (% yoy)', `<canvas id="ch-growth" data-chart="bar" data-series="gdpGrowth" data-highlight="${i}" data-digits="2"></canvas>`, SRC)}
${card('Inflasi (% yoy, Desember)', `<canvas id="ch-infl" data-chart="line" data-series="inflation" data-highlight="${i}" data-digits="2"></canvas><p>Inflasi 2022 melonjak ke 5,51% (kenaikan harga BBM), lalu turun ke 1,57% pada 2024 — terendah dalam satu dekade.</p>`, SRC)}
${card('PDB per kapita (Rp juta)', `<canvas id="ch-gdpcap" data-chart="bar" data-series="gdpPerCapita" data-highlight="${i}"></canvas>`, SRC)}
${card('Perdagangan luar negeri 2024', `<ul class="facts">
<li><b>Ekspor:</b> US$ ${fmt(TRADE_2024.exports)} miliar — batu bara 13,1%, minyak sawit 9,8%, besi-baja 8,6%.</li>
<li><b>Impor:</b> US$ ${fmt(TRADE_2024.imports)} miliar. <b>Surplus:</b> US$ ${fmt(TRADE_2024.surplus)} miliar.</li>
<li><b>Cadangan devisa:</b> US$ ${fmt(TRADE_2024.reserves)} miliar (Des 2024).</li>
</ul><canvas id="ch-trade" data-chart="hbar" data-rows="trade"></canvas>`, 'Sumber: BPS & Bank Indonesia, 2024.')}
<p class="navnext"><a href="#/demografi">← Demografi</a> · <a href="#/tenaga-kerja">Ketenagakerjaan →</a></p>`;
}

export function tenagaKerja() {
  const sectorRows = EMPLOYMENT_2024.bySector.map((s) => `<tr><td>${esc(s.sector)}</td><td>${fmt(s.share, 2)}%</td></tr>`).join('');
  const eduRows = EMPLOYMENT_2024.byEducation.map((s) => `<tr><td>${esc(s.level)}</td><td>${fmt(s.share, 2)}%</td></tr>`).join('');
  return `
<h1>Ketenagakerjaan</h1>
<p class="lede">144,64 juta orang bekerja (Agustus 2024). Tingkat pengangguran terbuka 4,91% — terendah sejak 2015. 59,17% pekerja masih di sektor informal.</p>
${card('Pengangguran 2015–2024 (%)', `<canvas id="ch-unemp" data-chart="line" data-series="unemployment" data-highlight="9" data-digits="2"></canvas><p>Pengangguran melonjak ke 7,07% pada 2020 (pandemi), lalu turun tiap tahun hingga 4,91% pada 2024.</p>`, 'Sumber: Sakernas, BPS.')}
${card('Pekerja menurut lapangan usaha (Agu 2024)', `<canvas id="ch-sector" data-chart="hbar" data-rows="sector"></canvas>`, SRC)}
<div class="twocol">
${card('Menurut lapangan usaha', `<table class="tbl"><thead><tr><th>Sektor</th><th>Pangsa</th></tr></thead><tbody>${sectorRows}</tbody></table>`, SRC)}
${card('Menurut pendidikan tertinggi', `<table class="tbl"><thead><tr><th>Pendidikan</th><th>Pangsa</th></tr></thead><tbody>${eduRows}</tbody></table>`, SRC)}
</div>
<p class="navnext"><a href="#/ekonomi">← Ekonomi</a> · <a href="#/kemiskinan">Kemiskinan →</a></p>`;
}

export function kemiskinan() {
  return `
<h1>Kemiskinan & Kesejahteraan</h1>
<p class="lede">Kemiskinan turun dari 11,22% (2015) menjadi 9,03% (Maret 2024) — 25,22 juta orang. Tapi ketimpangan antarprovinsi masih lebar: Papua Pegunungan 33,65%, DKI Jakarta 4,30%.</p>
${card('Tingkat kemiskinan 2015–2024 (%)', `<canvas id="ch-pov" data-chart="line" data-series="poverty" data-highlight="9" data-digits="2"></canvas><p>Kemiskinan naik pada 2020–2021 (pandemi), lalu turun tiga tahun berturut-turut ke level terendah dalam sejarah pencatatan.</p>`, SRC)}
${card('IPM 2015–2024', `<canvas id="ch-hdi" data-chart="line" data-series="hdi" data-highlight="9" data-digits="2"></canvas><p>IPM naik dari 69,55 (2015) ke 75,02 (2024) — kategori "tinggi". DKI Jakarta tertinggi (82,99), Papua Pegunungan terendah (57,89).</p>`, SRC)}
${card('Garis besar 2024', `<ul class="facts">
<li><b>Gini ratio 0,381</b> (Mar 2024) — ketimpangan pendapatan moderat.</li>
<li><b>Rata-rata lama sekolah 8,85 tahun</b>; harapan lama sekolah 13,21 tahun.</li>
<li><b>Harapan hidup 74,2 tahun</b> (2024).</li>
<li><b>5 provinsi termiskin:</b> Papua Pegunungan 33,65%, Papua Tengah 29,28%, Papua 26,03%, Papua Barat 20,70%, NTT 19,02%.</li>
</ul>`, SRC)}
<p class="navnext"><a href="#/tenaga-kerja">← Ketenagakerjaan</a> · <a href="#/kesehatan">Kesehatan & Pendidikan →</a></p>`;
}

export function kesehatan() {
  return `
<h1>Kesehatan & Pendidikan</h1>
<p class="lede">Harapan hidup 74,2 tahun (2024). Stunting turun ke 19,8% — tapi masih 1 dari 5 balita. Angka melek huruf 96,53%.</p>
${card('Stunting balita (%)', `<canvas id="ch-stunt" data-chart="bar" data-series="stunting" data-labels="2019,2021,2022,2023,2024" data-highlight="4"></canvas><p>Target pemerintah: stunting di bawah 14% pada 2029. Penurunan 2019→2024: 7,9 poin.</p>`, 'Sumber: SSGI/SKI, Kementerian Kesehatan.')}
${card('Harapan hidup 2015–2024 (tahun)', `<canvas id="ch-life" data-chart="line" data-series="lifeExpectancy" data-highlight="9"></canvas>`, SRC)}
${card('Fasilitas & tenaga kesehatan 2024', `<ul class="facts">
<li><b>Rumah sakit:</b> ${fmtInt(HEALTH_EDU.hospitals)} unit. <b>Puskesmas:</b> ${fmtInt(HEALTH_EDU.puskesmas)} unit.</li>
<li><b>Dokter:</b> sekitar ${HEALTH_EDU.doctorsPer100k} per 100.000 penduduk.</li>
<li><b>Angka melek huruf (15+):</b> ${fmt(HEALTH_EDU.literacy, 2)}%.</li>
</ul>`, 'Sumber: BPS & Kementerian Kesehatan, 2024.')}
${card('Pendidikan 2024', `<ul class="facts">
<li><b>Harapan lama sekolah:</b> ${fmt(HEALTH_EDU.schoolYears.expected, 2)} tahun; <b>rata-rata lama sekolah:</b> ${fmt(HEALTH_EDU.schoolYears.mean, 2)} tahun.</li>
<li><b>Angka partisipasi murni:</b> SD ${fmt(HEALTH_EDU.netEnrolment.sd, 2)}%, SMP ${fmt(HEALTH_EDU.netEnrolment.smp, 2)}%, SMA ${fmt(HEALTH_EDU.netEnrolment.sma, 2)}%.</li>
</ul>`, SRC)}
<p class="navnext"><a href="#/kemiskinan">← Kemiskinan</a> · <a href="#/provinsi">Provinsi →</a></p>`;
}

export function provinsi() {
  return `
<h1>Provinsi: 38 Provinsi</h1>
<p class="lede">Semua provinsi, satu tabel. Cari, saring per pulau, urutkan tiap kolom, atau centang dua provinsi untuk membandingkan.</p>
<div class="controls">
<label>Cari <input id="provSearch" type="search" placeholder="cth: Jawa, Papua, Bali…" autocomplete="off"></label>
<label>Pulau <select id="provIsland"><option>Semua</option><option>Sumatera</option><option>Jawa</option><option>Bali &amp; Nusa Tenggara</option><option>Kalimantan</option><option>Sulawesi</option><option>Maluku &amp; Papua</option></select></label>
<button id="provCsv" type="button">Unduh CSV (tabel yang tampil)</button>
<button id="provReset" type="button">Reset</button>
</div>
<div id="compareBox" class="compare" hidden></div>
<table class="tbl sortable"><thead><tr>
<th data-sort="name">Provinsi ↕</th><th data-sort="island">Pulau ↕</th>
<th data-sort="pop">Penduduk (jt) ↕</th><th data-sort="poverty">Kemiskinan % ↕</th>
<th data-sort="hdi">IPM ↕</th><th data-sort="gdpCap">PDRB/kapita (Rp jt) ↕</th><th>Bandingkan</th>
</tr></thead><tbody id="provBody"></tbody></table>
<p class="src">Sumber: BPS 2024 (estimasi proyeksi penduduk; kemiskinan Maret 2024; IPM 2024; PDRB per kapita dibulatkan ke jutaan rupiah). Angka provinsi adalah estimasi yang dibulatkan — lihat <a href="#/metodologi">Metodologi</a>.</p>
<p class="navnext"><a href="#/kesehatan">← Kesehatan</a> · <a href="#/kalkulator">Kalkulator →</a></p>`;
}

export function kalkulator() {
  return `
<h1>Kalkulator Statistik</h1>
<p class="lede">Hitung sendiri dari angka resmi di situs ini. Semua hitungan jalan di browser Anda — tanpa server, tanpa data dikirim ke mana pun.</p>
${card('Kalkulator daya beli (inflasi)', `
<p>Rp <input id="calcAmount" type="number" value="1000000" min="0" step="1000"> pada tahun
<select id="calcFrom">${YEARS.map((y) => `<option${y === 2015 ? ' selected' : ''}>${y}</option>`).join('')}</select>
setara dengan <output id="calcResult" class="big">—</output> pada tahun
<select id="calcTo">${YEARS.map((y) => `<option${y === 2024 ? ' selected' : ''}>${y}</option>`).join('')}</select>.</p>
<p class="hint">Dihitung dari indeks harga konsumen (IHK) 2015 = 100: ${CPI.map((c, i) => YEARS[i] + ' ' + c.toFixed(1)).join(' · ')}.</p>`, 'Sumber IHK: dihitung dari inflasi tahunan BPS 2015–2024.')}
${card('Kalkulator pertumbuhan majemuk', `
<p>Nilai awal Rp <input id="growStart" type="number" value="1000000" min="0" step="1000"> tumbuh
<input id="growRate" type="number" value="5.03" step="0.01">% per tahun selama
<input id="growYears" type="number" value="10" min="0" max="50" step="1"> tahun menjadi
<output id="growResult" class="big">—</output>.</p>
<p class="hint">Contoh laju: pertumbuhan PDB 2024 sebesar 5,03% per tahun.</p>`, 'Rumus: nilai akhir = nilai awal × (1 + laju) ^ tahun.')}
${card('Kalkulator pangsa provinsi', `
<p><select id="shareProv">${PROVINCES.map((p) => `<option>${esc(p.name)}</option>`).join('')}</select>
berpenduduk <output id="shareResult" class="big">—</output> dari total penduduk Indonesia.</p>
<p class="hint">Jawa Barat saja: 50,35 dari 281,6 juta jiwa — sekitar 17,9% penduduk Indonesia tinggal di satu provinsi.</p>`, SRC)}
<p class="navnext"><a href="#/provinsi">← Provinsi</a> · <a href="#/metodologi">Metodologi →</a></p>`;
}

export function metodologi() {
  return `
<h1>Metodologi & Sumber</h1>
<p class="lede">Situs ini memakai angka resmi yang dipublikasikan — bukan perkiraan situs ini sendiri.</p>
${card('Sumber utama', `<ul class="facts">
<li><b>BPS (Badan Pusat Statistik)</b> — proyeksi penduduk, PDB, inflasi, pengangguran (Sakernas), kemiskinan, IPM, PDRB provinsi.</li>
<li><b>Bank Indonesia</b> — cadangan devisa, kurs rupiah.</li>
<li><b>Kementerian Kesehatan (SSGI/SKI)</b> — prevalensi stunting balita.</li>
</ul>`)}
${card('Catatan penting', `<ul class="facts">
<li>Angka nasional memakai tahun kalender 2015–2024; pengangguran memakai Agustus, kemiskinan memakai Maret, inflasi memakai Desember tiap tahun.</li>
<li>Angka provinsi adalah estimasi BPS 2024 yang dibulatkan (penduduk 2 desimal, PDRB per kapita ke jutaan rupiah terdekat) agar mudah dibandingkan.</li>
<li>IHK pada kalkulator daya beli dibangun dari inflasi tahunan BPS (2015 = 100) — bukan IHK resmi bulanan.</li>
<li>Semua grafik digambar dari data di atas dengan canvas di browser — tidak ada gambar atau data yang dimuat dari internet.</li>
</ul>`)}
${card('Tentang situs ini', `<p>Statistik Indonesia — situs statistik nasional yang berdiri sendiri, dibuat untuk bounty make.fun "best-national-statistics-site-20261126-0539". Desain, teks, dan kode asli; tidak menyalin merek, teks, atau gambar situs lain.</p>`)}
<p class="navnext"><a href="#/kalkulator">← Kalkulator</a> · <a href="#/">Beranda</a></p>`;
}

export function missing() {
  return `<h1>Halaman tidak ditemukan</h1><p>Tidak ada halaman di alamat ini. <a href="#/">Kembali ke Beranda</a>.</p>`;
}
