// Run: node --test last-real-change.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { pickLastRealChange, monthYear, keyFromUrl } from './last-real-change.mjs';

const me = { id: '1', handle: 'runner' }, other = { id: '2', handle: 'colleague' };
const v = (created_at, user, label = null) => ({ id: created_at, created_at, user, label });

test('own versions since the cut-off are ignored, the other person stays the reference', () => {
  const r = pickLastRealChange([v('2026-10-22T09:00:00Z', me), v('2026-10-21T20:00:00Z', me), v('2026-03-12T10:00:00Z', other), v('2026-02-01T10:00:00Z', me)], { runnerId: '1', ignoreOwnSince: '2026-10-21' });
  assert.equal(r.monthYear, 'March 2026'); assert.equal(r.by, 'colleague'); assert.equal(r.byRunner, false);
});
test('own earlier real work counts when nobody else changed the file later', () => {
  const r = pickLastRealChange([v('2026-10-22T09:00:00Z', me), v('2026-05-02T10:00:00Z', me), v('2026-03-12T10:00:00Z', other)], { runnerId: '1', ignoreOwnSince: '2026-10-21' });
  assert.equal(r.monthYear, 'May 2026'); assert.equal(r.byRunner, true);
});
test('another person after the migration start is not ignored', () => {
  const r = pickLastRealChange([v('2026-10-22T12:00:00Z', other), v('2026-10-22T09:00:00Z', me)], { runnerId: '1', ignoreOwnSince: '2026-10-21' });
  assert.equal(r.monthYear, 'October 2026'); assert.equal(r.by, 'colleague');
});
test('only own migration versions: nothing to propose', () => {
  assert.equal(pickLastRealChange([v('2026-10-22T09:00:00Z', me)], { runnerId: '1', ignoreOwnSince: '2026-10-21' }), null);
  assert.equal(pickLastRealChange([], { runnerId: '1', ignoreOwnSince: '2026-10-21' }), null);
});
test('the latest named version is reported next to the latest change', () => {
  const r = pickLastRealChange([v('2026-06-01T10:00:00Z', other), v('2026-01-10T10:00:00Z', other, 'Handoff')], { runnerId: '1', ignoreOwnSince: '2026-10-21' });
  assert.equal(r.monthYear, 'June 2026'); assert.equal(r.latestNamed.label, 'Handoff');
});
test('helpers', () => {
  assert.equal(monthYear('2025-07-31T23:59:00Z'), 'July 2025');
  assert.equal(keyFromUrl('https://www.figma.com/board/abc123/Name?node-id=1-2'), 'abc123');
  assert.equal(keyFromUrl('https://www.figma.com/design/MAIN/x/branch/BR1/y'), 'BR1');
  assert.equal(keyFromUrl('abc123'), 'abc123');
});
