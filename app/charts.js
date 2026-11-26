// Canvas charts, drawn by hand — no library, no network. Every chart reads
// its colours from CSS variables so the dark theme recolours it for free.

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#333';
}

function setup(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 640;
  canvas.width = w * dpr;
  canvas.height = height * dpr;
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { ctx, w, h: height };
}

function axes(ctx, w, h, pad) {
  ctx.strokeStyle = cssVar('--line');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad.l, pad.t);
  ctx.lineTo(pad.l, h - pad.b);
  ctx.lineTo(w - pad.r, h - pad.b);
  ctx.stroke();
}

// Line chart: labels on x, values on y, optional highlight index.
export function lineChart(canvas, labels, values, opts = {}) {
  const { ctx, w, h } = setup(canvas, opts.height || 220);
  const pad = { l: 52, r: 12, t: 14, b: 28 };
  const min = Math.min(...values, opts.min ?? Infinity);
  const max = Math.max(...values, opts.max ?? -Infinity);
  const lo = opts.min !== undefined ? opts.min : min - (max - min) * 0.15;
  const hi = opts.max !== undefined ? opts.max : max + (max - min) * 0.15;
  const x = (i) => pad.l + (i * (w - pad.l - pad.r)) / (labels.length - 1);
  const y = (v) => pad.t + (1 - (v - lo) / (hi - lo)) * (h - pad.t - pad.b);
  axes(ctx, w, h, pad);
  ctx.fillStyle = cssVar('--muted');
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'right';
  for (let g = 0; g <= 4; g++) {
    const v = lo + ((hi - lo) * g) / 4;
    ctx.fillText(v.toFixed(1), pad.l - 8, y(v) + 4);
    ctx.strokeStyle = cssVar('--grid');
    ctx.beginPath();
    ctx.moveTo(pad.l, y(v));
    ctx.lineTo(w - pad.r, y(v));
    ctx.stroke();
  }
  ctx.textAlign = 'center';
  labels.forEach((lb, i) => {
    if (i % 2 === 0 || i === labels.length - 1) ctx.fillText(String(lb), x(i), h - 8);
  });
  // Area fill.
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
  ctx.lineTo(x(values.length - 1), h - pad.b);
  ctx.lineTo(x(0), h - pad.b);
  ctx.closePath();
  ctx.fillStyle = (opts.fill || '#2563eb') + '22';
  ctx.fill();
  // Line.
  ctx.beginPath();
  values.forEach((v, i) => (i === 0 ? ctx.moveTo(x(i), y(v)) : ctx.lineTo(x(i), y(v))));
  ctx.strokeStyle = opts.color || '#2563eb';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  // Points + value labels on the highlighted point.
  values.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(x(i), y(v), i === opts.highlight ? 6 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = i === opts.highlight ? '#dc2626' : opts.color || '#2563eb';
    ctx.fill();
    ctx.fillStyle = '#fff';
    if (i === opts.highlight) {
      ctx.beginPath();
      ctx.arc(x(i), y(v), 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  if (opts.highlight !== undefined) {
    ctx.fillStyle = cssVar('--text');
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    const suffix = opts.unit ? ' ' + opts.unit : '';
    ctx.fillText(values[opts.highlight].toFixed(opts.digits ?? 1) + suffix, x(opts.highlight), y(values[opts.highlight]) - 12);
  }
}

// Redraw every chart on the page (used after a theme change or a resize).
export function redrawAll() {
  document.querySelectorAll('canvas[data-chart]').forEach((c) => {
    c.dispatchEvent(new CustomEvent('redraw'));
  });
}

// Vertical bar chart with value labels on top of each bar.
export function barChart(canvas, labels, values, opts = {}) {
  const { ctx, w, h } = setup(canvas, opts.height || 220);
  const pad = { l: 52, r: 12, t: 22, b: 28 };
  const max = Math.max(...values, 1) * 1.12;
  const min = Math.min(0, ...values) * 1.12;
  const bw = (w - pad.l - pad.r) / values.length;
  const y = (v) => pad.t + (1 - (v - min) / (max - min)) * (h - pad.t - pad.b);
  axes(ctx, w, h, pad);
  ctx.fillStyle = cssVar('--muted');
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'right';
  for (let g = 0; g <= 3; g++) {
    const v = min + ((max - min) * g) / 3;
    ctx.fillText(v.toFixed(0), pad.l - 8, y(v) + 4);
  }
  ctx.textAlign = 'center';
  values.forEach((v, i) => {
    const bx = pad.l + i * bw + bw * 0.16;
    const bw2 = bw * 0.68;
    ctx.fillStyle = i === opts.highlight ? '#dc2626' : opts.color || '#2563eb';
    const top = y(Math.max(v, 0));
    const bottom = y(Math.min(v, 0));
    ctx.fillRect(bx, top, bw2, Math.max(2, bottom - top));
    ctx.fillStyle = cssVar('--text');
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(v.toFixed(opts.digits ?? 1), bx + bw2 / 2, top - 6);
    ctx.fillStyle = cssVar('--muted');
    ctx.fillText(String(labels[i]), bx + bw2 / 2, h - 8);
  });
}

// Horizontal bars: label left, bar right, value at the end. Good for rankings.
export function hbarChart(canvas, rows, opts = {}) {
  const rowH = opts.rowHeight || 30;
  const { ctx, w, h } = setup(canvas, rows.length * rowH + 16);
  const max = Math.max(...rows.map((r) => r.value), 1);
  const labelW = opts.labelWidth || 170;
  ctx.font = '13px system-ui, sans-serif';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    ctx.fillStyle = cssVar('--text');
    ctx.textAlign = 'right';
    ctx.fillText(r.label, labelW - 8, y + 15);
    const bw = (w - labelW - 70) * (r.value / max);
    ctx.fillStyle = r.color || opts.color || '#2563eb';
    ctx.fillRect(labelW, y, Math.max(2, bw), 18);
    ctx.fillStyle = cssVar('--text');
    ctx.textAlign = 'left';
    ctx.fillText(r.value.toFixed(opts.digits ?? 1), labelW + bw + 6, y + 15);
  });
}

// Population pyramid: male bars left, female right, age groups in the middle.
export function pyramidChart(canvas, groups) {
  const rowH = 24;
  const { ctx, w, h } = setup(canvas, groups.length * rowH + 34);
  const max = Math.max(...groups.flatMap((g) => [g.male, g.female]));
  const mid = w / 2;
  const half = (w - 90) / 2;
  ctx.font = '12px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = cssVar('--muted');
  ctx.fillText('Laki-laki', mid - half / 2, 14);
  ctx.fillText('Perempuan', mid + half / 2, 14);
  groups.forEach((g, i) => {
    const y = 22 + i * rowH;
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(mid - (g.male / max) * half, y, (g.male / max) * half, 16);
    ctx.fillStyle = '#db2777';
    ctx.fillRect(mid, y, (g.female / max) * half, 16);
    ctx.fillStyle = cssVar('--text');
    ctx.fillText(g.group, mid, y + 13);
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = cssVar('--muted');
    ctx.textAlign = 'right';
    ctx.fillText(g.male.toFixed(1), mid - (g.male / max) * half - 4, y + 13);
    ctx.textAlign = 'left';
    ctx.fillText(g.female.toFixed(1), mid + (g.female / max) * half + 4, y + 13);
    ctx.font = '12px system-ui, sans-serif';
  });
}
