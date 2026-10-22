// Run: node --test propose.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { propose, normalizeVersion, normalizeDate } from './propose.mjs';

const frame = (name, texts) => ({ thumbnail: { name }, name: 'x', frames: [{ name, texts }] });
const NOW = new Date('2026-10-22T12:00:00Z');

test('library cover, end of life', () => {
  const p = propose(frame('f', ['Title=Oblique – Swiss Government Design System', 'Test a bit longer title=Oblique|Library V14', 'V=V14.0.0 – F1.4  |  October, 2025', 'Documentation: oblique.admin.c=Documentation: oblique.admin.ch [link]', 'END OF LIFE=END OF LIFE [link]']), { now: NOW });
  assert.deepEqual(p, { product: 'Oblique 14', doc: 'Library', purpose: '', version: '14.0.0-F1.4', modified: 'October 2025', owner: 'BIT / Oblique Team', docs: 'oblique.admin.ch', status: 'end_of_life' });
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
  assert.equal(p.doc, 'Color Variables Sandbox'); assert.equal(p.purpose, 'simplify-the-color-variables'); assert.equal(p.version, '16-DS-F1.0'); assert.equal(p.modified, 'October 2026'); assert.equal(p.status, 'work_in_progress_figma_only');
});
test('custom first line, no version, no date', () => {
  const p = propose(frame('f', ['t=Figma Metadata  Helper Component|Mockup', 'ON HOLD=ON HOLD']), { now: NOW });
  assert.equal(p.doc, 'Figma Metadata Helper Component'); assert.equal(p.purpose, 'Mockup'); assert.equal(p.status, 'on_hold_figma_only'); assert.equal(p.version, '');
});
test('no old cover: defaults from the file name and the current month', () => {
  const p = propose({ name: 'States-WiP', frames: [] }, { now: NOW });
  assert.equal(p.doc, 'States-WiP'); assert.equal(p.product, 'Oblique DS'); assert.equal(p.modified, 'October 2026'); assert.equal(p.status, 'work_in_progress_figma_only');
});
test('helpers', () => {
  assert.equal(normalizeVersion('V16.0.2 – F1.3'), '16.0.2-F1.3');
  assert.equal(normalizeDate('March, 2026'), 'March 2026');
});
