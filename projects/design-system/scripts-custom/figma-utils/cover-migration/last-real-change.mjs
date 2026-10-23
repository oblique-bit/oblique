// Find the month of the last REAL change of a Figma file from its version history, so that a cover never shows
// the month of the migration. Read-only: it only asks the Figma REST API, it writes nothing anywhere.
//
// Rule: take the version list of the file, drop the versions that the person who runs the script made since the
// cut-off date (those are the migration itself), and take the newest version that is left, by anyone.
// A change by another person therefore always stays the reference; the runner's own earlier work counts.
//
// usage:
//   FIGMA_TOKEN=... node last-real-change.mjs <file url or key> [more files ...] [--since YYYY-MM-DD] [--csv out.csv]
//     --since   own versions from this day on are ignored (default: today)
// The token is a personal access token with the read scopes file_versions:read and file_metadata:read, plus the
// scope that allows GET /v1/me (to learn who runs the script). Keep it in the terminal, never in a file.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const API = 'https://api.figma.com';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const monthYear = iso => { const d = new Date(iso); return MONTHS[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); };
export const keyFromUrl = s => { const b = s.match(/\/branch\/([A-Za-z0-9]+)/); const m = s.match(/figma\.com\/(?:design|board|slides|file)\/([A-Za-z0-9]+)/); return b ? b[1] : m ? m[1] : s; };

// Pure rule, tested in last-real-change.test.mjs.
// versions: [{ id, created_at, label, user: { id, handle } }]; runnerId: id of the person who runs the script;
// ignoreOwnSince: ISO date; own versions created at or after it are ignored.
export function pickLastRealChange(versions, { runnerId, ignoreOwnSince }) {
  const cut = new Date(ignoreOwnSince).getTime();
  const left = (versions || []).filter(v => v.created_at && !(v.user && v.user.id === runnerId && new Date(v.created_at).getTime() >= cut));
  if (!left.length) return null;
  left.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const v = left[0];
  const named = left.find(x => x.label);
  return {
    date: v.created_at, monthYear: monthYear(v.created_at),
    by: v.user ? v.user.handle : null, byRunner: !!(v.user && v.user.id === runnerId), label: v.label || null,
    latestNamed: named ? { date: named.created_at, label: named.label, by: named.user ? named.user.handle : null } : null,
  };
}

async function get(path, token) {
  const res = await fetch(path.startsWith('http') ? path : API + path, { headers: { 'X-Figma-Token': token } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${path.replace(/\?.*/, '')}`);
  return res.json();
}
export async function fetchVersions(key, token) {
  const all = []; let url = `/v1/files/${key}/versions`;
  for (let page = 0; url && page < 50; page++) {
    const d = await get(url, token); all.push(...(d.versions || []));
    url = d.pagination && d.pagination.next_page ? d.pagination.next_page : null;
  }
  return all;
}
export const fetchMe = token => get('/v1/me', token);
export const fetchMeta = (key, token) => get(`/v1/files/${key}/meta`, token).then(d => d.file);

export async function lastRealChange(key, token, { since } = {}) {
  const me = await fetchMe(token);
  const versions = await fetchVersions(key, token);
  const today = new Date().toISOString().slice(0, 10);
  return pickLastRealChange(versions, { runnerId: me.id, ignoreOwnSince: since || today });
}

// CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const argv = process.argv.slice(2);
  const opt = n => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
  const files = argv.filter((a, i) => !a.startsWith('--') && !['--since', '--csv'].includes(argv[i - 1]));
  const token = process.env.FIGMA_TOKEN;
  if (!token || !files.length) { console.log('usage: FIGMA_TOKEN=... node last-real-change.mjs <file url or key> ... [--since YYYY-MM-DD] [--csv out.csv]'); process.exit(token ? 1 : 2); }
  const since = opt('--since') || new Date().toISOString().slice(0, 10);
  const me = await fetchMe(token);
  console.log(`Runner: ${me.handle}. Own versions from ${since} on are ignored.`);
  const rows = [];
  for (const f of files) {
    const key = keyFromUrl(f);
    try {
      const [meta, versions] = await Promise.all([fetchMeta(key, token), fetchVersions(key, token)]);
      const r = pickLastRealChange(versions, { runnerId: me.id, ignoreOwnSince: since });
      rows.push({ file: meta.name, key, proposed: r ? r.monthYear : '', date: r ? r.date.slice(0, 10) : '', by: r ? r.by : '', named: r && r.label ? r.label : '', creator: meta.creator && meta.creator.handle, versions: versions.length });
    } catch (e) { rows.push({ file: f, key, proposed: '', date: '', by: '', named: '', creator: '', versions: 0, error: e.message }); }
  }
  console.table(rows);
  if (opt('--csv')) { const h = Object.keys(rows[0]); writeFileSync(opt('--csv'), [h.join(','), ...rows.map(r => h.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n')); console.log('saved', opt('--csv')); }
}
