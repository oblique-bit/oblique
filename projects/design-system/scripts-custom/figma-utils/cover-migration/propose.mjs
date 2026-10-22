// Propose the values of the new cover from the texts of the old cover (the answer of read-cover.js).
// Pure function, no Figma needed: the wizard shows these values as defaults, a person confirms or edits them.
const MONTHS = { january: 'January', february: 'February', march: 'March', april: 'April', may: 'May', june: 'June', july: 'July', august: 'August', september: 'September', october: 'October', november: 'November', december: 'December',
  januar: 'January', februar: 'February', 'märz': 'March', mai: 'May', juni: 'June', juli: 'July', oktober: 'October', dezember: 'December' };

export const STATUSES = ['active', 'release_candidate', 'maintenance', 'end_of_life', 'work_in_progress_figma_only', 'on_hold_figma_only', 'experimental_figma_only', 'figma_only', 'dev_handoff_figma_only', 'deprecated', 'done_figma_only'];

const STATUS_WORDS = [
  [/END OF LIFE/i, 'end_of_life'], [/DEPRECATED/i, 'deprecated'], [/MAINTENANCE/i, 'maintenance'], [/RELEASE CANDIDATE/i, 'release_candidate'],
  [/WORK IN PROGRESS/i, 'work_in_progress_figma_only'], [/ON HOLD/i, 'on_hold_figma_only'], [/EXPERIMENTAL/i, 'experimental_figma_only'],
  [/DEV HANDOFF/i, 'dev_handoff_figma_only'], [/^DONE$/i, 'done_figma_only'], [/^ACTIVE$/i, 'active'],
];

export function normalizeVersion(raw) {
  return raw.replace(/[–—]/g, '-').replace(/\s+/g, '').replace(/^V(?=\d)/i, '');
}

export function normalizeDate(raw) {
  const year = (raw.match(/\b(\d{4})\b/) || [])[1];
  const month = Object.keys(MONTHS).find(m => new RegExp('\\b' + m + '\\b', 'i').test(raw));
  if (month && year) return MONTHS[month] + ' ' + year;
  return year || '';
}

export function currentMonthYear(date = new Date()) {
  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

export function propose(old, options = {}) {
  const owner = options.owner || 'BIT / Oblique Team';
  const out = { product: 'Oblique DS', doc: (old && old.name) || '', purpose: '', version: '', modified: '', owner, docs: 'oblique.bit.admin.ch', status: 'work_in_progress_figma_only' };
  const frames = (old && old.frames) || [];
  const frame = frames.find(f => old.thumbnail && f.name === old.thumbnail.name) || frames.find(f => f.texts && f.texts.some(t => /^Oblique\|/.test(t.slice(t.indexOf('=') + 1)))) || frames[0];
  if (!frame) return out;
  const texts = frame.texts.map(t => { const i = t.indexOf('='); return { name: t.slice(0, i), value: t.slice(i + 1).replace(/ \[link\]$/, '').trim() }; });
  const found = { status: false };
  let release = '';

  // title: "Oblique|Library V14", "Oblique|Sandbox", or a custom first line
  // a title comes from a line break (no space beside the bar), the version line has " | " with spaces
  const title = texts.find(t => /\S\|\S/.test(t.value) && !/\s\|\s/.test(t.value) && !/Documentation:/.test(t.value));
  if (title) {
    const [line1, ...rest] = title.value.split('|');
    const line2 = rest.join(' ').replace(/\s+/g, ' ').trim();
    if (/^Oblique$/i.test(line1.trim())) {
      let doc = line2;
      const raw2 = rest.join(' ');
      if (/\s{2,}/.test(raw2.trim())) { const [first, ...more] = raw2.trim().split(/\s{2,}/); doc = first.trim(); out.purpose = more.join(' ').trim(); }
      const m = doc.match(/\s+V?(\d{1,2}(?:\.\d+)?|\d{4})$/);
      if (m) { release = m[1]; doc = doc.slice(0, m.index).trim(); }
      out.doc = doc;
    } else {
      out.doc = line1.replace(/\s+/g, ' ').trim();
      out.purpose = line2;
    }
  }
  // version and date: "V14.0.0 – F1.4  |  October, 2025" or just "2023"
  const ver = texts.find(t => /\s\|\s/.test(t.value) && /\d/.test(t.value)) || texts.find(t => /^\d{4}$/.test(t.value));
  if (ver) {
    const [a, b] = ver.value.split(/\s*\|\s*/);
    out.version = normalizeVersion(a || '');
    out.modified = b ? normalizeDate(b) : '';
    if (!b && /^\d{4}$/.test(a)) out.modified = a;
  }
  const docs = texts.map(t => t.value.match(/^Documentation:\s*(\S+)/)).find(Boolean);
  if (docs) out.docs = docs[1];
  for (const t of texts) {
    const hit = STATUS_WORDS.find(([re]) => re.test(t.value));
    if (hit && t.value.length < 30) { out.status = hit[1]; found.status = true; break; }
  }
  if (!release) { const m = out.version.match(/^(\d{2})\b/); if (m) release = m[1]; }
  out.product = release ? 'Oblique ' + release : 'Oblique DS';
  return out;
}
