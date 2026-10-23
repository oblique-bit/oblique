// Propose the values of the new cover from the texts of the old cover (the answer of read-cover.js).
// Pure function, no Figma needed: the wizard shows these values as defaults, a person confirms or edits them.
const MONTHS = { january: 'January', february: 'February', march: 'March', april: 'April', may: 'May', june: 'June', july: 'July', august: 'August', september: 'September', october: 'October', november: 'November', december: 'December',
  januar: 'January', februar: 'February', 'märz': 'March', mai: 'May', juni: 'June', juli: 'July', oktober: 'October', dezember: 'December' };

export const STATUSES = ['active', 'release_candidate', 'maintenance', 'end_of_life', 'work_in_progress_figma_only', 'on_hold_figma_only', 'experimental_figma_only', 'figma_only', 'dev_handoff_figma_only', 'deprecated', 'done_figma_only', 'backup_figma_only'];

// A cover is internal (team only) or external (other teams, Figma Community). The two kinds use their own status badges;
// "deprecated" is in both.
export const EXTERNAL_STATUSES = ['Active', 'Release candidate', 'Maintenance', 'End of life', 'Deprecated'];
// Internal badges are written in plain words, without a suffix: the dropdown in Figma shows exactly these names.
// The names of the first version (work_in_progress_figma_only ...) are still accepted as input and converted.
const PLAIN = { work_in_progress_figma_only: 'Work in progress', dev_handoff_figma_only: 'Dev handoff', done_figma_only: 'Done', backup_figma_only: 'Backup', on_hold_figma_only: 'On hold', experimental_figma_only: 'Experimental', figma_only: 'Figma only', deprecated: 'Deprecated' };
export const INTERNAL_STATUSES = Object.values(PLAIN);
export function normalizeStatus(distribution, status) {
  const s = (status || '').trim();
  if (distribution === 'external') return EXTERNAL_STATUSES.find(n => n.toLowerCase() === s.toLowerCase().replace(/_/g, ' ')) || s;
  if (PLAIN[s]) return PLAIN[s];
  return INTERNAL_STATUSES.find(n => n.toLowerCase() === s.toLowerCase().replace(/_/g, ' ')) || s;
}
export const DISTRIBUTIONS = ['internal', 'external'];
export const statusesFor = distribution => (distribution === 'external' ? EXTERNAL_STATUSES : INTERNAL_STATUSES);
export const MAX_TICKETS = 3;
export const TEAM_OWNER = 'BIT / Oblique Team';
// the Git value in column 2 is at most 660 px wide; an average branch name needs 18.3 px per character
export const GIT_FITS = 36;
// An internal cover names the owner by initials: "BIT / Oblique / DR". An external cover names the team.
export const OWNER_PREFIX = 'BIT / Oblique / ';
export const INTERNAL_OWNER = /^BIT \/ Oblique \/ [A-Z]{2,3}$/;
export function initials(name) {
  const w = (name || '').replace(/\s+BIT$/i, '').trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '';
  return ((w[0][0] || '') + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
}
export const internalOwner = name => (initials(name) ? OWNER_PREFIX + initials(name) : '');

// Tickets are shown as KEY-123, upper case, separated by ", ", the main ticket first, at most three, none twice.
const TICKET = /\b[A-Za-z]{2,10}-\d{1,6}\b/g;
export const extractTickets = text => [...new Set(((text || '').match(TICKET) || []).map(t => t.toUpperCase()))];
export const normalizeTickets = raw => extractTickets(raw).slice(0, MAX_TICKETS).join(', ');
// A title says what the file is; the ticket numbers move to the footer.
export function stripTickets(title) {
  const t = (title || '')
    .replace(new RegExp('\\(\\s*(?:' + TICKET.source + '[\\s,;/]*)+\\)', 'g'), '')
    .replace(new RegExp('\\[\\s*(?:' + TICKET.source + '[\\s,;/]*)+\\]', 'g'), '')
    .replace(TICKET, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s:\-–,;/]+|[\s:\-–,;/]+$/g, '')
    .trim();
  return t ? t[0].toUpperCase() + t.slice(1) : t;
}

const STATUS_WORDS = [
  [/END OF LIFE/i, 'end_of_life'], [/DEPRECATED/i, 'deprecated'], [/MAINTENANCE/i, 'maintenance'], [/RELEASE CANDIDATE/i, 'release_candidate'],
  [/WORK IN PROGRESS/i, 'work_in_progress_figma_only'], [/ON HOLD/i, 'on_hold_figma_only'], [/EXPERIMENTAL/i, 'experimental_figma_only'],
  [/DEV HANDOFF/i, 'dev_handoff_figma_only'], [/^DONE$/i, 'done_figma_only'], [/^BACKUP$/i, 'backup_figma_only'], [/^ACTIVE$/i, 'active'],
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

const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// Every cover writes the month with three letters ("Oct 2026"). A year alone ("2023") and an empty value stay as they are.
export function formatModified(raw) {
  const v = (raw || '').trim();
  const m = v.match(/^([A-Za-z]{3,9})\.?,?\s+(\d{4})$/);
  if (!m) return v;
  const i = FULL_MONTHS.findIndex(f => f.slice(0, 3).toLowerCase() === m[1].slice(0, 3).toLowerCase());
  return i < 0 ? v : SHORT_MONTHS[i] + ' ' + m[2];
}

export function propose(old, options = {}) {
  const owner = options.owner || 'BIT / Oblique Team';
  const out = { distribution: 'internal', product: 'Oblique DS', doc: (old && old.name) || '', tickets: '', git: '', purpose: '', version: '', modified: '', owner, docs: 'oblique.bit.admin.ch', status: 'work_in_progress_figma_only' };
  const frames = (old && old.frames) || [];
  const frame = frames.find(f => old.thumbnail && f.name === old.thumbnail.name) || frames.find(f => f.texts && f.texts.some(t => /^Oblique\|/.test(t.slice(t.indexOf('=') + 1)))) || frames[0];
  if (!frame) return finish(out, options);
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
  // a hand-made cover can use the last row for something else: "GIT  tokens-dev" or "Jira  KEY-123"
  const rowLabel = texts.find(t => t.name === 'Documentation label'), rowValue = texts.find(t => t.name === 'Documentation value');
  if (rowLabel && rowValue) {
    if (/^git$/i.test(rowLabel.value)) out.git = rowValue.value;
    else if (/^jira$/i.test(rowLabel.value)) out.tickets = normalizeTickets(rowValue.value);
    else if (/^docs$/i.test(rowLabel.value) && rowValue.value) out.docs = rowValue.value.split(/\s+/)[0];
  }
  for (const t of texts) {
    const hit = STATUS_WORDS.find(([re]) => re.test(t.value));
    if (hit && t.value.length < 30) { out.status = hit[1]; found.status = true; break; }
  }
  if (!release) { const m = out.version.match(/^(\d{2})\b/); if (m) release = m[1]; }
  out.product = release ? 'Oblique ' + release : 'Oblique DS';
  return finish(out, options);
}

// distribution, tickets and the fields that belong to one distribution only
function finish(out, options) {
  out.tickets = normalizeTickets(out.tickets + ' ' + out.doc);
  if (extractTickets(out.doc).length) out.doc = stripTickets(out.doc);
  const official = ['active', 'release_candidate', 'maintenance', 'end_of_life'];
  out.distribution = options.distribution || (official.includes(out.status) ? 'external' : 'internal');
  out.status = normalizeStatus(out.distribution, out.status);
  if (out.distribution === 'external') { out.tickets = ''; out.git = ''; out.owner = TEAM_OWNER; }
  else { out.docs = ''; out.owner = options.owner || ''; }
  out.modified = formatModified(out.modified);
  return out;
}

// Rules a set of values has to follow. errors stop the wizard, warnings are only shown.
export function checkValues(v) {
  const errors = [], warnings = [];
  if (!DISTRIBUTIONS.includes(v.distribution)) errors.push('distribution must be internal or external');
  else if (!statusesFor(v.distribution).includes(normalizeStatus(v.distribution, v.status))) errors.push(`status "${v.status}" is not allowed on an ${v.distribution} cover (${statusesFor(v.distribution).join(', ')})`);
  if (v.distribution === 'external') {
    if (v.tickets) errors.push('an external cover shows no ticket numbers');
    if (!v.docs) errors.push('an external cover needs the documentation address');
    if (!v.version) warnings.push('an external cover should show a version');
    if (v.owner && v.owner !== TEAM_OWNER) warnings.push(`an external cover names the team ("${TEAM_OWNER}"), not a person`);
  }
  if (v.distribution === 'internal') {
    if (!v.owner) errors.push('an internal cover needs the owner, written "BIT / Oblique / DR" (initials)');
    else if (!INTERNAL_OWNER.test(v.owner)) errors.push(`owner "${v.owner}" must be written "${OWNER_PREFIX}" plus the initials of the person, for example "BIT / Oblique / DR"`);
  }
  if (v.modified && formatModified(v.modified) !== v.modified) errors.push(`modified "${v.modified}" must be written "${formatModified(v.modified)}" (month with three letters)`);
  if (v.git) {
    if (v.distribution === 'external') errors.push('an external cover shows no git branch');
    if (!/^[A-Za-z0-9._\/-]+$/.test(v.git)) errors.push('git must be one branch name without spaces');
    else if (v.git.length > GIT_FITS) warnings.push(`git is longer than ${GIT_FITS} characters: the cover shortens it with "..." (about ${GIT_FITS} characters fit next to the widest badge)`);
  }
  if (v.tickets) {
    const keys = extractTickets(v.tickets);
    if (v.tickets !== keys.join(', ')) errors.push(`tickets must look like "${keys.join(', ') || 'KEY-123'}" (upper case, comma and space, no other text)`);
    if (keys.length > MAX_TICKETS) errors.push(`at most ${MAX_TICKETS} tickets fit on the cover`);
  }
  if (extractTickets(v.doc).length) warnings.push('the title still holds a ticket number; the number belongs in tickets');
  return { errors, warnings };
}
