// fetch-icons.mjs — download the icon SVG files of a GitHub folder into a local folder
// ----------------------------------------------------------------------------
// WHY: the SVG files in Git are the source of the icon set (Illustrator export,
// committed to the repository). The validator and the Figma import start from a
// local copy of that folder, pinned to one commit.
//
// usage:
//   node fetch-icons.mjs [options]
//
// options:
//   --repo <owner/name>   default oblique-bit/oblique
//   --path <folder>       default projects/oblique/icons
//   --ref <branch|tag|sha> default master
//   --out <folder>        default ./icons-git
//   --gallery <file>      also download this one file of the repository (the SDS gallery file icons.ts
//                         with the texts of the icons) from the same commit
//   --gallery-out <file>  where to write it (default ./icons-gallery.ts, next to the SVG folder, not inside it)
//   --token <token>       GitHub token, or set GITHUB_TOKEN (raises the API limit)
//
// Files whose content already matches the Git blob are not downloaded again.
// Writes manifest.json next to the SVG files: repository, ref, commit, files (and the gallery file).
// No dependencies. Node 18 or newer.
// ----------------------------------------------------------------------------

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opts = { repo: 'oblique-bit/oblique', path: 'projects/oblique/icons', ref: 'master', out: './icons-git', gallery: null, galleryOut: './icons-gallery.ts', token: process.env.GITHUB_TOKEN || null };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--repo') opts.repo = args[++i];
  else if (a === '--path') opts.path = args[++i].replace(/^\/+|\/+$/g, '');
  else if (a === '--ref') opts.ref = args[++i];
  else if (a === '--out') opts.out = args[++i];
  else if (a === '--gallery') opts.gallery = args[++i].replace(/^\/+/, '');
  else if (a === '--gallery-out') opts.galleryOut = args[++i];
  else if (a === '--token') opts.token = args[++i];
  else if (a === '--help' || a === '-h') { console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').reduce((acc, l) => (acc.stop || !l.startsWith('//') ? { ...acc, stop: true } : { ...acc, out: [...acc.out, l.replace(/^\/\/ ?/, '')] }), { out: [], stop: false }).out.join('\n')); process.exit(0); }
  else { console.error(`unknown option ${a}`); process.exit(2); }
}

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'oblique-icon-workflow' };
if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

async function getJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const left = res.headers.get('x-ratelimit-remaining');
    throw new Error(`${res.status} ${res.statusText} for ${url}${res.status === 403 && left === '0' ? ' (GitHub API rate limit, set GITHUB_TOKEN)' : ''}`);
  }
  return res.json();
}

const blobSha = (buf) => createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');

async function download(url, tries = 3) {
  for (let k = 1; k <= tries; k++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': headers['User-Agent'] } });
      if (!res.ok) throw new Error(`${res.status} for ${url}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      if (k === tries) throw e;
      await new Promise((r) => setTimeout(r, 400 * k));
    }
  }
  return null;
}

try {
  const commit = await getJson(`https://api.github.com/repos/${opts.repo}/commits/${encodeURIComponent(opts.ref)}`);
  const tree = await getJson(`https://api.github.com/repos/${opts.repo}/git/trees/${commit.commit.tree.sha}?recursive=1`);
  if (tree.truncated) throw new Error('the Git tree is too large for one API answer');
  const prefix = `${opts.path}/`;
  const files = tree.tree.filter((e) => e.type === 'blob' && e.path.startsWith(prefix) && e.path.toLowerCase().endsWith('.svg'));
  if (!files.length) throw new Error(`no .svg file under ${opts.path} at ${opts.ref}`);

  mkdirSync(opts.out, { recursive: true });
  let fresh = 0, kept = 0;
  const queue = [...files];
  const worker = async () => {
    for (let e = queue.shift(); e; e = queue.shift()) {
      const target = join(opts.out, e.path.slice(prefix.length));
      if (existsSync(target) && blobSha(readFileSync(target)) === e.sha) { kept++; continue; }
      const buf = await download(`https://raw.githubusercontent.com/${opts.repo}/${commit.sha}/${e.path.split('/').map(encodeURIComponent).join('/')}`);
      if (blobSha(buf) !== e.sha) throw new Error(`${e.path}: downloaded content does not match the Git blob`);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, buf);
      fresh++;
    }
  };
  await Promise.all(Array.from({ length: 8 }, worker));

  // the gallery file: one file of the same commit, checked against its Git blob like the SVG files
  let gallery = null;
  if (opts.gallery) {
    const entry = tree.tree.find((e) => e.type === 'blob' && e.path === opts.gallery);
    if (!entry) throw new Error(`the gallery file ${opts.gallery} does not exist at ${opts.ref}`);
    if (!(existsSync(opts.galleryOut) && blobSha(readFileSync(opts.galleryOut)) === entry.sha)) {
      const buf = await download(`https://raw.githubusercontent.com/${opts.repo}/${commit.sha}/${entry.path.split('/').map(encodeURIComponent).join('/')}`);
      if (blobSha(buf) !== entry.sha) throw new Error(`${entry.path}: downloaded content does not match the Git blob`);
      mkdirSync(dirname(opts.galleryOut), { recursive: true });
      writeFileSync(opts.galleryOut, buf);
    }
    gallery = { file: entry.path, blob: entry.sha, bytes: entry.size, savedAs: opts.galleryOut };
  }

  const manifest = {
    repository: opts.repo,
    path: opts.path,
    ref: opts.ref,
    commit: commit.sha,
    commitDate: commit.commit.committer.date,
    commitMessage: commit.commit.message.split('\n')[0],
    fetchedAt: new Date().toISOString(),
    count: files.length,
    files: files.map((e) => ({ file: e.path.slice(prefix.length), blob: e.sha, bytes: e.size })),
    ...(gallery ? { gallery } : {}),
  };
  writeFileSync(join(opts.out, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`${files.length} SVG files from ${opts.repo}@${commit.sha.slice(0, 9)} (${opts.ref}, ${manifest.commitDate.slice(0, 10)}) into ${opts.out}: ${fresh} downloaded, ${kept} already current${gallery ? `; gallery file ${gallery.file.split('/').pop()} (${gallery.bytes} bytes) into ${opts.galleryOut}` : ''}`);
} catch (e) {
  console.error(`error: ${e.message}`);
  process.exit(1);
}
