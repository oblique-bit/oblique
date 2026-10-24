#!/usr/bin/env zsh
# Put the cover into many files of one folder, strictly one file at a time. Nothing is left open between two files.
#
#   zsh run-folder.zsh <folderId> <order.txt> <valuesDir> <outDir> [limit]
#
#   order.txt   one Figma file key per line, in the order of the run
#   valuesDir   <fileKey>.json with the values of the cover (see values.example.json)
#   outDir      log, list of done and failed files, the result of every file
#   limit       process only this many files that are not done yet (a test run)
# Needs COVER_TEMPLATE_KEY and COVER_TEMPLATE_NODE (see README), Figma Desktop with the debug port, node 22+.
#
# For every file: close all file tabs (through the tab strip), open the file, wait until the editor answers, run the wizard,
# check the result, wait until the server shows a new "updated_at" (the change is saved), close the tab, next file.
# A file that does not open or fails is skipped and listed. The run stops (and says so) when Figma stops answering,
# when a tab does not close, or when a change does not reach the server: after that nothing is safe to continue.
HERE=${0:A:h}
FOLDER=$1 ORDER=$2 VALS=$3 OUT=$4 LIMIT=${5:-9999}
mkdir -p $OUT; LOG=$OUT/run.log; DONE=$OUT/done.txt; FAIL=$OUT/failed.txt; touch $DONE $FAIL
cd $HERE; source ./cover-tools.zsh
t() { local s=$1; shift; perl -e 'alarm shift; exec @ARGV' $s "$@"; }
log() { print -r -- "$(date +%H:%M:%S) $*" | tee -a $LOG; }
stop() { log "STOP: $*"; log "done: $(wc -l < $DONE | tr -d ' ')  failed: $(wc -l < $FAIL | tr -d ' ')"; exit 1; }
health() { curl -s -m 8 http://127.0.0.1:9222/json/version | grep -q Browser; }
ready() { [[ $(t 30 node cdp.mjs $1 eval "typeof figma" 2>/dev/null | tr -d '"') == object ]]; }
updated() { t 40 node cdp.mjs $1 eval "(async()=>{const r=await fetch('/api/files/$1',{credentials:'include'});const j=await r.json();return j.meta.updated_at})()" 2>/dev/null | tr -d '"'; }
closeall() { local r; r=$(t 90 node figma-tabs.mjs close-all 2>&1); local rc=$?; [[ $rc == 0 ]] || stop "a tab does not close ($r)"; sleep 3; }

health || ct_ensure_port || stop "Figma does not answer on the debug port"
[[ $(t 20 node figma-tabs.mjs count) == 0 ]] || closeall
n=0
for k in $(cat $ORDER); do
  grep -qx $k $DONE && continue
  (( n >= LIMIT )) && break
  (( n++ ))
  log "==== $k ($n)"
  health || stop "Figma stopped answering"
  closeall
  osascript -e 'tell application "Figma" to activate' >/dev/null 2>&1; sleep 1
  open -a Figma "https://www.figma.com/design/$k"
  ok=0; for i in $(seq 1 30); do sleep 4; ready $k && { ok=1; break; }; done
  if [[ $ok == 0 ]]; then log "FAIL $k: the editor did not load in 120 s"; echo $k >> $FAIL; health || stop "Figma stopped answering"; closeall; continue; fi
  sleep 4
  before=$(updated $k); [[ -n $before ]] || log "WARN $k: updated_at not readable before the change"
  # a purpose that was cut at the old read limit: take the full text of the old cover
  if [[ $(python3 -c "import json;print(len(json.load(open('$VALS/$k.json'))['purpose']))") -ge 70 ]]; then
    ct_run $k read-cover.js '{}' > $OUT/$k.cover.json 2>/dev/null
    python3 - $VALS/$k.json $OUT/$k.cover.json <<'PY2'
import sys,json
v=json.load(open(sys.argv[1]))
try: d=json.load(open(sys.argv[2]))
except Exception: sys.exit(0)
th=(d.get('thumbnail') or {}).get('name'); fr=[x for x in d.get('frames',[]) if x['name']==th] or d.get('frames',[])[:1]
head=v['purpose'][:40].replace('|',' ')
for t in (fr[0]['texts'] if fr else []):
    n,_,val=t.partition('=')
    if n.startswith('V11.0.0'):
        full=val.replace('|',' ').strip()
        if full.startswith(head) or head in full: v['purpose']=full; break
json.dump(v,open(sys.argv[1],'w'),ensure_ascii=False)
PY2
  fi
  t 480 node cover-wizard.mjs "https://www.figma.com/design/$k" --values $VALS/$k.json --yes --out $OUT/$k < /dev/null > $OUT/$k.wizard.log 2>&1
  rc=$?
  if [[ $rc != 0 ]] || ! grep -q "^Done\." $OUT/$k.wizard.log; then
    log "FAIL $k: wizard rc=$rc ($(tail -1 $OUT/$k.wizard.log | cut -c1-120))"; echo $k >> $FAIL
    health || stop "Figma stopped answering after $k"; closeall; continue
  fi
  res=$(ct_run $k snapshot-cover.js '{}' 2>/dev/null | python3 -c "import sys,json; d=json.load(sys.stdin); p=d['props']; print(p.get('product','')+' / '+p.get('document_name','')+' | '+str(p.get('file_status') or p.get('lifecycle_status')))" 2>/dev/null)
  log "cover: ${res:-not readable}"
  # wait until the change is on the server
  saved=0; log "updated_at before: ${before:-?}"; for i in $(seq 1 45); do sleep 3; [[ -n $before && $(updated $k) != $before ]] && { saved=1; break; }; done
  if [[ $saved == 0 ]]; then for i in $(seq 1 20); do sleep 3; [[ $(updated $k) != $before ]] && { saved=1; break; }; done; fi
  log "updated_at after: $(updated $k)"
  [[ $saved == 1 ]] || stop "the change of $k did not reach the server in 3 minutes: not closing the tab"
  sleep 3
  closeall
  echo $k >> $DONE; log "OK $k saved and closed"
done
log "finished. done: $(wc -l < $DONE | tr -d ' ')  failed: $(wc -l < $FAIL | tr -d ' ')"
