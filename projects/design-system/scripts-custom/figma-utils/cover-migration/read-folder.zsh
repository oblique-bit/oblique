#!/usr/bin/env zsh
# Read the cover of many files, strictly one file at a time. Nothing is changed in any file.
#
#   zsh read-folder.zsh <order.txt> <outDir>
#
#   order.txt   one Figma file key per line
#   outDir      <fileKey>.json with the properties, texts and visibility of the cover (snapshot-cover.js);
#               a file without the new cover is read with read-cover.js instead
# Needs Figma Desktop with the debug port, node 22+. Same care as run-folder.zsh: all tabs are closed through the tab strip
# before a file is opened and after it is read; a file that does not open is skipped and listed; the run stops when Figma stops answering.
HERE=${0:A:h}
ORDER=$1 OUT=$2
mkdir -p $OUT; LOG=$OUT/read.log; DONE=$OUT/done.txt; FAIL=$OUT/failed.txt; touch $DONE $FAIL
cd $HERE; source ./cover-tools.zsh
t() { local s=$1; shift; perl -e 'alarm shift; exec @ARGV' $s "$@"; }
log() { print -r -- "$(date +%H:%M:%S) $*" | tee -a $LOG; }
stop() { log "STOP: $*"; exit 1; }
health() { curl -s -m 8 http://127.0.0.1:9222/json/version | grep -q Browser; }
ready() { [[ $(t 30 node cdp.mjs $1 eval "typeof figma" 2>/dev/null | tr -d '"') == object ]]; }
closeall() { local r; r=$(t 400 node figma-tabs.mjs --keep "${KEEP_TAB:-}" close-all 2>&1); local rc=$?; [[ $rc == 0 ]] || stop "a tab does not close, a dialog may be waiting ($r)"; sleep 8; }

health || ct_ensure_port || stop "Figma does not answer on the debug port"
[[ $(t 20 node figma-tabs.mjs --keep "${KEEP_TAB:-}" count) == 0 ]] || closeall
for k in $(cat $ORDER); do
  grep -qx $k $DONE && continue
  log "==== $k"
  health || stop "Figma stopped answering"
  closeall
  osascript -e 'tell application "Figma" to activate' >/dev/null 2>&1; sleep 1
  open -a Figma "https://www.figma.com/design/$k"
  ok=0; for i in $(seq 1 30); do sleep 4; ready $k && { ok=1; break; }; done
  if [[ $ok == 0 ]]; then log "FAIL $k: the editor did not load in 120 s"; echo $k >> $FAIL; health || stop "Figma stopped answering"; closeall; continue; fi
  sleep 4
  ct_run $k snapshot-cover.js '{}' > $OUT/$k.json 2>/dev/null
  if ! grep -q '"props"' $OUT/$k.json 2>/dev/null; then ct_run $k read-cover.js '{}' > $OUT/$k.json 2>/dev/null; fi
  if [[ -s $OUT/$k.json ]]; then echo $k >> $DONE; log "OK $k"; else log "FAIL $k: no answer"; echo $k >> $FAIL; fi
  sleep 20   # let the editor finish its own syncing before the tab is closed
  closeall
done
log "finished. done: $(wc -l < $DONE | tr -d ' ')  failed: $(wc -l < $FAIL | tr -d ' ')"
