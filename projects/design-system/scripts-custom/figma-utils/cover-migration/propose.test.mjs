// Run: node --test propose.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { propose, normalizeVersion, normalizeDate, normalizeTickets, stripTickets, checkValues, statusesFor, formatModified } from './propose.mjs';

const frame = (name, texts) => ({ thumbnail: { name }, name: 'x', frames: [{ name, texts }] });
const NOW = new Date('2026-10-22T12:00:00Z');

test('library cover, end of life', () => {
  const p = propose(frame('f', ['Title=Oblique – Swiss Government Design System', 'Test a bit longer title=Oblique|Library V14', 'V=V14.0.0 – F1.4  |  October, 2025', 'Documentation: oblique.admin.c=Documentation: oblique.admin.ch [link]', 'END OF LIFE=END OF LIFE [link]']), { now: NOW });
  assert.deepEqual(p, { distribution: 'external', product: 'Oblique 14', doc: 'Library', tickets: '', purpose: '', version: '14.0.0-F1.4', modified: 'October 2025', owner: 'BIT / Oblique Team', docs: 'oblique.admin.ch', status: 'end_of_life' });
});
test('library cover with day and comma', () => {
  const p = propose(frame('f', ['t=Oblique|Library V11', 'v=V11.0.1 – F1.2  |  March 4, 2024', 'ACTIVE=MAINTENANCE', 'd=Documentation: oblique.admin.ch']), { now: NOW });
  assert.equal(p.version, '11.0.1-F1.2'); assert.equal(p.modified, 'March 2024'); assert.equal(p.status, 'maintenance');
});
test('2023 cover: only a year, release 2023', () => {
  const p = propose(frame('f', ['t=Oblique|Components 2023', 'v=2023', 'b=END OF LIFE']), { now: NOW });
  assert.equal(p.product, 'Oblique 2023'); assert.equal(p.doc, 'Components'); assert.equal(p.version, '2023'); assert.equal(p.modified, '2023');
});
test('working file: product line and ticket text after the title', () => {
  const p = propose(frame('f', ['t=Oblique|Color Variables Sandbox   simplify-the-color-variables', 'v=V16-DS – F1.0  |  Oktober 2026', 'WORK IN PROGRESS=WORK IN PROGRESS']), { now: NOW });
  assert.equal(p.doc, 'Color Variables Sandbox'); assert.equal(p.purpose, 'simplify-the-color-variables'); assert.equal(p.version, '16-DS-F1.0'); assert.equal(p.modified, 'Oct 2026'); assert.equal(p.status, 'work_in_progress_figma_only');
});
test('custom first line, no version, no date', () => {
  const p = propose(frame('f', ['t=Figma Metadata  Helper Component|Mockup', 'ON HOLD=ON HOLD']), { now: NOW });
  assert.equal(p.doc, 'Figma Metadata Helper Component'); assert.equal(p.purpose, 'Mockup'); assert.equal(p.status, 'on_hold_figma_only'); assert.equal(p.version, '');
});
test('no old cover: defaults from the file name, no invented date', () => {
  const p = propose({ name: 'States-WiP', frames: [] }, { now: NOW });
  assert.equal(p.doc, 'States-WiP'); assert.equal(p.product, 'Oblique DS'); assert.equal(p.modified, ''); assert.equal(p.status, 'work_in_progress_figma_only');
});
test('deprecated is a status of its own', () => {
  const p = propose(frame('f', ['t=Oblique|Library V9', 'v=V9.0.0 – F1.0  |  May 2023', 'b=DEPRECATED']), { now: NOW });
  assert.equal(p.status, 'deprecated');
});
test('done is a status of its own', () => {
  const p = propose(frame('f', ['t=Oblique|Workshop', 'b=DONE']), { now: NOW });
  assert.equal(p.status, 'done_figma_only');
});
test('backup is a status of its own', () => {
  const p = propose(frame('f', ['t=Oblique|Library V15', 'b=BACKUP']), { now: NOW });
  assert.equal(p.status, 'backup_figma_only');
});
test('helpers', () => {
  assert.equal(normalizeVersion('V16.0.2 – F1.3'), '16.0.2-F1.3');
  assert.equal(normalizeDate('March, 2026'), 'March 2026');
});

test('an official status makes the cover external, without tickets', () => {
  const p = propose(frame('f', ['t=Oblique|Library V15', 'v=V15.1.2 – F1.0  |  March 2026', 'b=MAINTENANCE']), { now: NOW });
  assert.equal(p.distribution, 'external'); assert.equal(p.tickets, ''); assert.equal(p.docs, 'oblique.bit.admin.ch');
});
test('a working file is internal: tickets leave the title, no docs', () => {
  const p = propose({ name: 'ABC-4723 property naming change test project', frames: [] }, { now: NOW });
  assert.equal(p.distribution, 'internal'); assert.equal(p.doc, 'Property naming change test project');
  assert.equal(p.tickets, 'ABC-4723'); assert.equal(p.docs, '');
});
test('tickets are written the same way everywhere', () => {
  assert.equal(normalizeTickets('abc-4797 / DEF-233; ABC-4797'), 'ABC-4797, DEF-233');
  assert.equal(normalizeTickets('ab-1, cd-2, ef-3, gh-4'), 'AB-1, CD-2, EF-3');
  assert.equal(normalizeTickets('no ticket here'), '');
});
test('titles lose ticket numbers and brackets', () => {
  assert.equal(stripTickets('Test Project (ABC-271)'), 'Test Project');
  assert.equal(stripTickets('ABC-233 Test: confirm slot override persistence'), 'Test: confirm slot override persistence');
  assert.equal(stripTickets('Library'), 'Library');
});
test('statuses depend on the distribution, deprecated is in both', () => {
  assert.ok(statusesFor('external').includes('deprecated') && statusesFor('internal').includes('deprecated'));
  assert.ok(!statusesFor('external').includes('work_in_progress_figma_only'));
  assert.ok(!statusesFor('internal').includes('active'));
});
test('rules: external has no tickets and needs docs; internal needs a person', () => {
  const ext = checkValues({ distribution: 'external', status: 'work_in_progress_figma_only', tickets: 'ABC-1', docs: '', version: '1', owner: 'BIT / Oblique Team', doc: 'Library' });
  assert.equal(ext.errors.length, 3);
  const ok = checkValues({ distribution: 'internal', status: 'done_figma_only', tickets: 'ABC-1, DEF-2', docs: '', version: '', owner: 'Anna Berger', doc: 'Research' });
  assert.deepEqual(ok.errors, []);
  const many = checkValues({ distribution: 'internal', status: 'done_figma_only', tickets: 'AB-1, CD-2, EF-3, GH-4', owner: 'X', doc: 'Y' });
  assert.ok(many.errors.length > 0);
});

test('months: three letters on an internal cover, full name on an external cover', () => {
  assert.equal(formatModified('October 2026', 'internal'), 'Oct 2026');
  assert.equal(formatModified('September 2026', 'internal'), 'Sep 2026');
  assert.equal(formatModified('June, 2026', 'internal'), 'Jun 2026');
  assert.equal(formatModified('Oct 2026', 'external'), 'October 2026');
  assert.equal(formatModified('2023', 'internal'), '2023');
  assert.equal(formatModified('', 'internal'), '');
  assert.equal(formatModified('Mai 2026', 'internal'), 'Mai 2026');
});
test('a working file gets the short month, an archived release the full month', () => {
  const w = propose(frame('f', ['t=Oblique|Research', 'v=V1.0.0  |  October 2026', 'b=WORK IN PROGRESS']), { now: NOW });
  assert.equal(w.modified, 'Oct 2026');
  const e = propose(frame('f', ['t=Oblique|Library V14', 'v=V14.0.0 – F1.4  |  October, 2025', 'b=END OF LIFE']), { now: NOW });
  assert.equal(e.modified, 'October 2025');
});
test('rules: the month must be written for the distribution', () => {
  const bad = checkValues({ distribution: 'internal', status: 'done_figma_only', owner: 'X', doc: 'Y', modified: 'October 2026' });
  assert.equal(bad.errors.length, 1);
  const ok = checkValues({ distribution: 'internal', status: 'done_figma_only', owner: 'X', doc: 'Y', modified: 'Oct 2026' });
  assert.deepEqual(ok.errors, []);
});
