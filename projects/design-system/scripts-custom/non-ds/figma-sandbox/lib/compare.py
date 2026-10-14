#!/usr/bin/env python3
"""python3 lib/compare.py <tagA> <tagB> [--json out.json]
Lists every difference between two snapshots (before and after a library update).
Exit code 0 = no difference, 1 = data differences, 3 = only image differences (can be render noise:
some nodes export slightly different pixels on every run, see README)."""
import json, sys, os
here = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'snapshots')
a_tag, b_tag = sys.argv[1], sys.argv[2]
load = lambda t: {r['id']: r for r in json.load(open(os.path.join(here, t, 'snapshot.json')))}
hashes = lambda t: json.load(open(os.path.join(here, t, 'png-hashes.json')))
A, B = load(a_tag), load(b_tag)
HA, HB = hashes(a_tag), hashes(b_tag)
diffs = {}
def add(i, msg): diffs.setdefault(i, []).append(msg)
for i in A.keys() - B.keys(): add(i, 'removed: ' + A[i]['name'])
for i in B.keys() - A.keys(): add(i, 'added: ' + B[i]['name'])
for i in A.keys() & B.keys():
    a, b = A[i], B[i]
    for f in ('name', 'main', 'w', 'h', 'visible', 'root', 'sizing'):
        if a[f] != b[f]: add(i, f'{f}: {a[f]} -> {b[f]}')
    for k in sorted(set(a['props']) | set(b['props'])):
        if a['props'].get(k) != b['props'].get(k): add(i, f'property {k}: {a["props"].get(k)} -> {b["props"].get(k)}')
    if len(a['desc']) != len(b['desc']): add(i, f'layers: {len(a["desc"])} -> {len(b["desc"])}')
    for n, (x, y) in enumerate(zip(a['desc'], b['desc'])):
        if x != y: add(i, f'layer {n} "{x[0]}": {x[2:]} -> {y[2:]}')
    if i in HA and i in HB and HA[i] and HB[i] and HA[i] != HB[i]: add(i, 'image differs')
data = {i: [m for m in ms if m != 'image differs'] for i, ms in diffs.items()}
data = {i: ms for i, ms in data.items() if ms}
img_only = [i for i, ms in diffs.items() if i not in data]
print(f'compare {a_tag} -> {b_tag}: {len(A)} vs {len(B)} instances; data differences: {len(data)}; image-only differences: {len(img_only)}')
if not diffs: print('EMPTY DIFFERENCE')
elif not data: print('EMPTY DIFFERENCE IN DATA (image-only differences listed below, possible render noise)')
for i, msgs in list(diffs.items())[:60]:
    name = (B.get(i) or A.get(i))['name']
    print(f'- {i} {name}')
    for m in msgs[:4]: print('    ' + m[:200])
if '--json' in sys.argv: json.dump({i: m for i, m in diffs.items()}, open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1)
sys.exit(1 if data else (3 if img_only else 0))
