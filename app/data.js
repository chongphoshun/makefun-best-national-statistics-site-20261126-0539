// Statistik Indonesia — all figures are real published figures, labelled with
// year and source in the pages that show them. National series are BPS
// (Statistics Indonesia) annual figures 2015-2024; province figures are BPS
// 2024 estimates, rounded, with the rounding noted on the province page.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SERIES = {
  population: [255.5, 258.7, 261.9, 265.0, 268.1, 271.1, 273.7, 275.8, 278.7, 281.6], // million
  gdpNominal: [11526, 12401, 13589, 14837, 15834, 15434, 16977, 19589, 20892, 22139], // Rp trillion
  gdpGrowth: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.7, 5.31, 5.05, 5.03], // % yoy
  gdpPerCapita: [45.1, 47.9, 51.9, 56.0, 59.1, 57.0, 62.2, 71.0, 74.9, 78.6], // Rp million
  inflation: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57], // % yoy, Dec
  unemployment: [6.18, 5.61, 5.5, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91], // % Aug
  poverty: [11.22, 10.7, 10.12, 9.66, 9.22, 9.78, 9.71, 9.57, 9.36, 9.03], // % Mar/Sep
  hdi: [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.77, 74.39, 75.02],
  lifeExpectancy: [70.8, 71.1, 71.4, 71.6, 71.9, 72.0, 72.3, 73.5, 73.9, 74.2], // years
};

// CPI index (2015 = 100), built from the annual inflation figures above.
export const CPI = [100, 103.0, 106.7, 110.0, 113.0, 114.9, 117.1, 123.5, 126.7, 128.7];

export const AGE_GROUPS_2024 = [
  { group: '0–4', male: 11.4, female: 10.9 },
  { group: '5–9', male: 12.2, female: 11.6 },
  { group: '10–14', male: 12.5, female: 11.9 },
  { group: '15–19', male: 12.3, female: 11.7 },
  { group: '20–24', male: 12.1, female: 11.6 },
  { group: '25–29', male: 11.8, female: 11.4 },
  { group: '30–34', male: 11.2, female: 10.9 },
  { group: '35–39', male: 10.6, female: 10.4 },
  { group: '40–44', male: 9.8, female: 9.7 },
  { group: '45–49', male: 8.9, female: 8.9 },
  { group: '50–54', male: 7.8, female: 7.9 },
  { group: '55–59', male: 6.6, female: 6.8 },
  { group: '60–64', male: 5.3, female: 5.6 },
  { group: '65–69', male: 3.9, female: 4.3 },
  { group: '70–74', male: 2.6, female: 3.0 },
  { group: '75+', male: 2.4, female: 3.2 },
]; // millions, BPS 2024 population projection by age

export const EMPLOYMENT_2024 = {
  working: 144.64, // million, Aug 2024
  formalShare: 40.83, // %
  informalShare: 59.17,
  bySector: [
    { sector: 'Pertanian', share: 28.21 },
    { sector: 'Perdagangan', share: 18.74 },
    { sector: 'Industri pengolahan', share: 13.99 },
    { sector: 'Jasa kemasyarakatan', share: 16.68 },
    { sector: 'Konstruksi', share: 7.63 },
    { sector: 'Transportasi & pergudangan', share: 4.82 },
    { sector: 'Lainnya', share: 9.93 },
  ],
  byEducation: [
    { level: 'SD ke bawah', share: 33.45 },
    { level: 'SMP', share: 18.28 },
    { level: 'SMA', share: 19.27 },
    { level: 'SMK', share: 11.15 },
    { level: 'Diploma', share: 3.26 },
    { level: 'Universitas', share: 14.59 },
  ],
};

export const HEALTH_EDU = {
  stunting: [27.7, 24.4, 21.6, 21.5, 19.8], // % 2019, 2021, 2022, 2023, 2024 (SSGI/SKI)
  stuntingYears: [2019, 2021, 2022, 2023, 2024],
  schoolYears: { expected: 13.21, mean: 8.85 }, // HLS / RLS 2024
  literacy: 96.53, // % age 15+, 2024
  netEnrolment: { sd: 97.92, smp: 81.58, sma: 64.23 }, // % 2024
  hospitals: 3202, // 2024
  puskesmas: 10416, // 2024
  doctorsPer100k: 51, // 2024, approx
};

export const TRADE_2024 = {
  exports: 264.7, // USD billion
  imports: 233.7,
  surplus: 31.0,
  reserves: 155.7, // USD billion, Dec 2024
  rupiahAvg: 15855, // Rp/USD average 2024
  topExports: [
    { item: 'Batu bara', share: 13.1 },
    { item: 'Minyak kelapa sawit', share: 9.8 },
    { item: 'Besi & baja', share: 8.6 },
    { item: 'Nikel & bijih', share: 4.9 },
    { item: 'Karet & barang karet', share: 3.7 },
    { item: 'Lainnya', share: 59.9 },
  ],
};

// 38 provinces. pop = million (2024 est.), poverty = % (Mar 2024),
// hdi = IPM 2024, gdpCap = PDRB per kapita Rp million (2024, rounded).
export const PROVINCES = [
  { name: 'Aceh', island: 'Sumatera', pop: 5.55, poverty: 14.23, hdi: 73.55, gdpCap: 57 },
  { name: 'Sumatera Utara', island: 'Sumatera', pop: 15.59, poverty: 8.18, hdi: 75.39, gdpCap: 78 },
  { name: 'Sumatera Barat', island: 'Sumatera', pop: 6.02, poverty: 5.42, hdi: 75.64, gdpCap: 68 },
  { name: 'Riau', island: 'Sumatera', pop: 6.85, poverty: 6.58, hdi: 74.97, gdpCap: 165 },
  { name: 'Jambi', island: 'Sumatera', pop: 3.68, poverty: 7.33, hdi: 74.07, gdpCap: 105 },
  { name: 'Sumatera Selatan', island: 'Sumatera', pop: 9.01, poverty: 11.79, hdi: 73.05, gdpCap: 82 },
  { name: 'Bengkulu', island: 'Sumatera', pop: 2.07, poverty: 13.25, hdi: 73.21, gdpCap: 58 },
  { name: 'Lampung', island: 'Sumatera', pop: 9.28, poverty: 11.19, hdi: 72.12, gdpCap: 55 },
  { name: 'Kepulauan Bangka Belitung', island: 'Sumatera', pop: 1.52, poverty: 4.44, hdi: 74.78, gdpCap: 98 },
  { name: 'Kepulauan Riau', island: 'Sumatera', pop: 2.24, poverty: 5.16, hdi: 79.08, gdpCap: 168 },
  { name: 'DKI Jakarta', island: 'Jawa', pop: 10.56, poverty: 4.3, hdi: 82.99, gdpCap: 322 },
  { name: 'Jawa Barat', island: 'Jawa', pop: 50.35, poverty: 7.46, hdi: 74.92, gdpCap: 62 },
  { name: 'Jawa Tengah', island: 'Jawa', pop: 37.89, poverty: 10.47, hdi: 74.28, gdpCap: 52 },
  { name: 'DI Yogyakarta', island: 'Jawa', pop: 3.74, poverty: 10.95, hdi: 81.62, gdpCap: 58 },
  { name: 'Jawa Timur', island: 'Jawa', pop: 41.81, poverty: 10.35, hdi: 75.08, gdpCap: 78 },
  { name: 'Banten', island: 'Jawa', pop: 12.43, poverty: 5.84, hdi: 77.47, gdpCap: 78 },
  { name: 'Bali', island: 'Bali & Nusa Tenggara', pop: 4.46, poverty: 3.75, hdi: 77.7, gdpCap: 68 },
  { name: 'Nusa Tenggara Barat', island: 'Bali & Nusa Tenggara', pop: 5.72, poverty: 12.93, hdi: 72.34, gdpCap: 38 },
  { name: 'Nusa Tenggara Timur', island: 'Bali & Nusa Tenggara', pop: 5.66, poverty: 19.02, hdi: 68.28, gdpCap: 28 },
  { name: 'Kalimantan Barat', island: 'Kalimantan', pop: 5.8, poverty: 6.47, hdi: 70.47, gdpCap: 62 },
  { name: 'Kalimantan Tengah', island: 'Kalimantan', pop: 2.81, poverty: 5.05, hdi: 73.73, gdpCap: 82 },
  { name: 'Kalimantan Selatan', island: 'Kalimantan', pop: 4.29, poverty: 4.0, hdi: 74.39, gdpCap: 72 },
  { name: 'Kalimantan Timur', island: 'Kalimantan', pop: 4.03, poverty: 6.01, hdi: 78.62, gdpCap: 258 },
  { name: 'Kalimantan Utara', island: 'Kalimantan', pop: 0.73, poverty: 6.78, hdi: 76.46, gdpCap: 152 },
  { name: 'Sulawesi Utara', island: 'Sulawesi', pop: 2.73, poverty: 7.06, hdi: 75.68, gdpCap: 78 },
  { name: 'Sulawesi Tengah', island: 'Sulawesi', pop: 3.16, poverty: 12.22, hdi: 72.29, gdpCap: 92 },
  { name: 'Sulawesi Selatan', island: 'Sulawesi', pop: 9.46, poverty: 8.38, hdi: 75.84, gdpCap: 68 },
  { name: 'Sulawesi Tenggara', island: 'Sulawesi', pop: 2.83, poverty: 10.94, hdi: 73.92, gdpCap: 72 },
  { name: 'Gorontalo', island: 'Sulawesi', pop: 1.23, poverty: 14.95, hdi: 71.34, gdpCap: 48 },
  { name: 'Sulawesi Barat', island: 'Sulawesi', pop: 1.6, poverty: 10.6, hdi: 69.84, gdpCap: 48 },
  { name: 'Maluku', island: 'Maluku & Papua', pop: 1.99, poverty: 16.38, hdi: 71.45, gdpCap: 42 },
  { name: 'Maluku Utara', island: 'Maluku & Papua', pop: 1.41, poverty: 6.19, hdi: 70.84, gdpCap: 68 },
  { name: 'Papua Barat', island: 'Maluku & Papua', pop: 1.25, poverty: 20.7, hdi: 66.74, gdpCap: 98 },
  { name: 'Papua Barat Daya', island: 'Maluku & Papua', pop: 0.65, poverty: 14.84, hdi: 67.22, gdpCap: 88 },
  { name: 'Papua', island: 'Maluku & Papua', pop: 1.18, poverty: 26.03, hdi: 62.25, gdpCap: 78 },
  { name: 'Papua Selatan', island: 'Maluku & Papua', pop: 0.55, poverty: 17.82, hdi: 61.48, gdpCap: 88 },
  { name: 'Papua Tengah', island: 'Maluku & Papua', pop: 1.35, poverty: 29.28, hdi: 61.02, gdpCap: 72 },
  { name: 'Papua Pegunungan', island: 'Maluku & Papua', pop: 1.48, poverty: 33.65, hdi: 57.89, gdpCap: 32 },
];

export const ISLANDS = ['Semua', 'Sumatera', 'Jawa', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku & Papua'];

export function fmt(n, digits = 1) {
  return n.toLocaleString('id-ID', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
export function fmtInt(n) {
  return n.toLocaleString('id-ID');
}

// One-line 2024 headline used by the overview KPI strip and the calculators.
export const HEADLINE_2024 = {
  population: SERIES.population[9],
  gdpNominal: SERIES.gdpNominal[9],
  growth: SERIES.gdpGrowth[9],
  inflation: SERIES.inflation[9],
  unemployment: SERIES.unemployment[9],
  poverty: SERIES.poverty[9],
  hdi: SERIES.hdi[9],
  lifeExpectancy: SERIES.lifeExpectancy[9],
};
