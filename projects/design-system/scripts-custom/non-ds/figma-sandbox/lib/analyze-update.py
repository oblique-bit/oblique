#!/usr/bin/env python3
"""python3 lib/analyze-update.py <before> <after> [--json out.json]
Sorts every fixture by whether the override of its own type was kept after a library update.
Uses the snapshots written by lib/snapshot.mjs. Types: text, boolean, hidden-layer, fill, resize, nested-variant,
instance-swap, variant-after-override, component-swap."""
import json, os, sys
from collections import defaultdict, Counter
here = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'snapshots')
load = lambda t: {r['id']: r for r in json.load(open(os.path.join(here, t, 'snapshot.json')))}
A, B = load(sys.argv[1]), load(sys.argv[2])
MARK = 'Override text'
def texts(r):
    out = [d[5] for d in r['desc'] if d[1] == 'TEXT' and len(d) > 5 and isinstance(d[5], str)]
    out += [v[1] for v in r['props'].values() if v[0] == 'TEXT']
    return out
def has_marker(r): return any(MARK in t or 'Swap override' in t for t in texts(r))
def hidden(r): return sorted(d[0] for d in r['desc'] if d[2] == 0)
def nested_keys(r): return sorted(str(d[5]) for d in r['desc'] if d[1] == 'INSTANCE' and len(d) > 5)
def props_of(r, kind): return {k: v[1] for k, v in r['props'].items() if v[0] == kind}
def root_fill(r):
    for x in r.get('root', []):
        if x[0] == 'fills': return x[1]
    return None
def kept(t, a, b):
    """returns (kept: True/False/None if there was nothing to keep, reason)"""
    if t == 'text':
        return (has_marker(b) if has_marker(a) else None, 'text marker')
    if t == 'boolean': return (props_of(a, 'BOOLEAN') == props_of(b, 'BOOLEAN'), 'boolean props')
    if t == 'hidden-layer': return (len(hidden(b)) >= len(hidden(a)) and hidden(a) == hidden(b)[:len(hidden(a))] or hidden(a) == hidden(b), 'hidden layers')
    if t == 'fill': return (root_fill(a) == root_fill(b), 'root fill')
    if t == 'resize': return (a['w'] == b['w'], 'width')
    if t == 'nested-variant': return (nested_keys(a) == nested_keys(b), 'nested instances')
    # the value of an INSTANCE_SWAP property is a file-local node id that changes when the library update imports new component nodes, so compare the nested main component keys instead
    if t == 'instance-swap': return (nested_keys(a) == nested_keys(b), 'swapped nested component')
    if t == 'variant-after-override': return (a['main'][0] == b['main'][0] and props_of(a, 'VARIANT') == props_of(b, 'VARIANT'), 'variant')
    if t == 'component-swap': return (a['main'][0] == b['main'][0], 'main component')
    return (None, 'unknown type')
tab = defaultdict(Counter); lost = defaultdict(list); main_changed = []; struct = 0
for i in A.keys() & B.keys():
    a, b = A[i], B[i]
    t = a['sbType']
    k, why = kept(t, a, b)
    tab[t]['kept' if k else ('lost' if k is False else 'n/a')] += 1
    if k is False: lost[t].append(a['name'])
    if a['main'][0] != b['main'][0]: main_changed.append(a['name'])
    if len(a['desc']) != len(b['desc']): struct += 1
print(f'{sys.argv[1]} -> {sys.argv[2]}: {len(A)} vs {len(B)} fixtures')
print(f'{"type":26} {"kept":>6} {"lost":>6} {"n/a":>5}')
tot = Counter()
for t in sorted(tab):
    c = tab[t]; tot.update(c); print(f'{t:26} {c["kept"]:6} {c["lost"]:6} {c["n/a"]:5}')
print(f'{"TOTAL":26} {tot["kept"]:6} {tot["lost"]:6} {tot["n/a"]:5}')
print('main component key changed:', len(main_changed), '| layer count changed:', struct)
for t in sorted(lost):
    comps = Counter(n.split('/')[1] if n.startswith('fixture/') else n for n in lost[t])
    print(f'  lost {t}: {len(lost[t])} -> ', ', '.join(f'{k} ({v})' for k, v in comps.most_common(8)))
if '--json' in sys.argv:
    json.dump({'table': {t: dict(c) for t, c in tab.items()}, 'lost': lost, 'main_changed': main_changed}, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1)
