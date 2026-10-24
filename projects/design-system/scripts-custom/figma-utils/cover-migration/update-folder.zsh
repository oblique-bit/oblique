#!/usr/bin/env zsh
# Bring the cover of many files up to date, strictly one file at a time: accept the library update of the cover components,
# then write new values into the cover (title lines, purpose, ...). Nothing is left open between two files.
#
#   zsh update-folder.zsh <order.txt> <valuesDir> <outDir> [limit]
#
#   order.txt   one Figma file key per line, in the order of the run (design files only: a FigJam board updates through the
#               plus menu, see the README)
#   valuesDir   <fileKey>.json with {"values": { ... }} for set-values.js; a file without one is only updated
#   outDir      log, list of done and failed files, snapshots before and after, a preview picture of every file
#   limit       process only this many files that are not done yet (a test run)
#
# For every file: close all file tabs (waiting for each), open the file, wait until the editor answers, snapshot, accept the
# updates of the "~figma_only/" components, write the values, snapshot again, wait until the server shows a new "updated_at" and
# stays quiet, wait again, close the tab. A file that does not open or fails is skipped and listed. The run stops (and says so)
# when Figma stops answering, when a tab does not close (a dialog may be waiting), or when a change does not reach the server.
HERE=${0:A:h}
ORDER=$1 VALS=$2 OUT=$3 LIMIT=${4:-9999}
mkdir -p $OUT; LOG=$OUT/run.log; DONE=$OUT/done.txt; FAIL=$OUT/failed.txt; touch $DONE $FAIL
cd $HERE; source ./cover-tools.zsh
t() { local s=$1; shift; perl -e 'alarm shift; exec @ARGV' $s "$@"; }
log() { print -r -- "$(date +%H:%M:%S) $*" | tee -a $LOG; }
stop() { log "STOP: $*"; log "done: $(wc -l < $DONE | tr -d ' ')  failed: $(wc -l < $FAIL | tr -d ' ')"; exit 1; }
health() { curl -s -m 8 http://127.0.0.1:9222/json/version | grep -q Browser; }
ready() { [[ $(t 30 node cdp.mjs $1 eval "typeof figma" 2>/dev/null | tr -d '"') == object ]]; }
updated() { t 40 node cdp.mjs $1 eval "(async()=>{const r=await fetch('/api/files/$1',{credentials:'include'});const j=await r.json();return j.meta.updated_at})()" 2>/dev/null | tr -d '"'; }
closeall() { local r; r=$(t 400 node figma-tabs.mjs --keep "${KEEP_TAB:-}" close-all 2>&1); local rc=$?; [[ $rc == 0 ]] || stop "a tab does not close, a dialog may be waiting ($r)"; sleep 8; }

health || ct_ensure_port || stop "Figma does not answer on the debug port"
[[ $(t 20 node figma-tabs.mjs --keep "${KEEP_TAB:-}" count) == 0 ]] || closeall
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
  ok=0; for i in $(seq 1 40); do sleep 4; ready $k && { ok=1; break; }; done
  if [[ $ok == 0 ]]; then log "FAIL $k: the editor did not load in 160 s"; echo $k >> $FAIL; health || stop "Figma stopped answering"; closeall; continue; fi
  sleep 6
  before=$(updated $k); [[ -n $before ]] || log "WARN $k: updated_at not readable before the change"
  ct_run $k snapshot-cover.js '{}' > $OUT/$k.before.json 2>/dev/null
  if ! grep -q '"props"' $OUT/$k.before.json; then log "FAIL $k: no new cover to update"; echo $k >> $FAIL; closeall; continue; fi
  et=$(t 30 node cdp.mjs $k eval "figma.editorType" 2>/dev/null | tr -d '"')
  if [[ $et == figjam ]]; then upd=$(t 150 node update-figjam.mjs $k 2>&1 | tail -1); else upd=$(t 240 node update-library.mjs $k 2>&1 | tail -1); fi
  log "update ($et): $upd"
  [[ $upd == \{* ]] || { log "FAIL $k: update did not answer"; echo $k >> $FAIL; health || stop "Figma stopped answering"; closeall; continue; }
  if [[ $et == figjam ]]; then
    [[ $upd == *'"updated":true'* || $upd == *'"updates":0'* ]] || { log "FAIL $k: FigJam update stopped: $upd"; echo $k >> $FAIL; closeall; continue; }
  else
    [[ $upd == *'"stillPending":[]'* ]] || log "WARN $k: some updates are still pending"
  fi
  # the editor can reload after an update: wait until it answers again before writing
  sleep 8; for i in $(seq 1 30); do ready $k && break; sleep 4; done; sleep 4
  if [[ -s $VALS/$k.json ]]; then
    ct_run $k set-values.js "$(cat $VALS/$k.json)" > $OUT/$k.set.json 2>/dev/null
    # the answer of the script can get lost although the values were written: the check below reads the cover itself
    grep -q '"log"' $OUT/$k.set.json || { log "WARN $k: no answer of the write script, checking the cover itself"; health || stop "Figma stopped answering"; }
    node save-images.mjs $OUT/$k.set.json $OUT $k- >/dev/null 2>&1
  fi
  ct_run $k snapshot-cover.js '{}' > $OUT/$k.after.json 2>/dev/null
  res=$(python3 - $OUT/$k.after.json $VALS/$k.json <<'PYEOF'
import sys,json,os
a=json.loads(open(sys.argv[1]).read().strip().split('\n')[-1]); p=a['props']
want=json.load(open(sys.argv[2])).get('values',{}) if os.path.exists(sys.argv[2]) else {}
bad=[]
for k,pk in (('product','product'),('doc','document_name'),('purpose','purpose')):
    if k in want and (p.get(pk) or '')!=want[k]: bad.append(k+': '+repr(p.get(pk))+' != '+repr(want[k]))
print(('MISMATCH '+'; '.join(bad)) if bad else ('ok '+str(p.get('product'))+' / '+str(p.get('document_name'))+' | '+str(p.get('purpose'))[:30]+' | '+str(p.get('file_status') or p.get('lifecycle_status'))))
PYEOF
)
  log "cover: $res"
  [[ $res == ok* ]] || { log "FAIL $k: the cover does not show what was wanted"; echo $k >> $FAIL; closeall; continue; }
  # wait until the change is on the server and stays quiet
  saved=0; for i in $(seq 1 60); do sleep 3; [[ -n $before && $(updated $k) != $before ]] && { saved=1; break; }; done
  if [[ $saved == 1 ]]; then
    prev=$(updated $k); for i in 1 2 3 4; do sleep 5; cur=$(updated $k); [[ $cur == $prev ]] && break; prev=$cur; done
    log "updated_at: $before -> $(updated $k)"
  else
    python3 - $OUT/$k.before.json $OUT/$k.after.json <<'PYEOF' && log "no change was needed" || stop "the change of $k did not reach the server in 3 minutes: not closing the tab"
import sys,json
a,b=[json.loads(open(f).read().strip().split('\n')[-1])['props'] for f in sys.argv[1:3]]
sys.exit(0 if a==b else 1)
PYEOF
  fi
  sleep 20   # let the editor finish its own syncing before the tab is closed
  closeall
  echo $k >> $DONE; log "OK $k saved and closed"
done
log "finished. done: $(wc -l < $DONE | tr -d ' ')  failed: $(wc -l < $FAIL | tr -d ' ')"
