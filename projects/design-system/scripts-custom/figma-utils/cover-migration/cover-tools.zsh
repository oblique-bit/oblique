# Helper functions for the cover migration. Source it in zsh:   source cover-tools.zsh
# Needs: figma-ds-cli (folder: CT_FIGMA_CLI_DIR), Figma Desktop started with the debug port (figma-ds-cli connect), node, curl.
CT_DIR=${0:A:h}
# figma-ds-cli only works when started from its own folder; set CT_FIGMA_CLI_DIR when it lives elsewhere.
CT_FIGMA_CLI_DIR=${CT_FIGMA_CLI_DIR:-$HOME/figma-cli}
ct_cli() { (cd $CT_FIGMA_CLI_DIR && figma-ds-cli "$@") }

# ct_ensure_port   Figma opened the normal way has no debug port; `figma-ds-cli connect` restarts it with the port.
ct_ensure_port() {
  curl -s -m 3 localhost:9222/json/version >/dev/null && return 0
  ct_cli connect >/dev/null 2>&1; sleep 6
  curl -s -m 3 localhost:9222/json/version >/dev/null || { echo "no debug port on 9222" >&2; return 1; }
}

# ct_run <fileKey> <script.js> '<json args>'   run one plugin script in the tab of that file, print its JSON answer.
# The script runs through the debug port directly in the tab that holds the file key (cdp.mjs), so it cannot land in
# another open file. Exactly one open tab may match the key: close the other tabs of the same file first.
# Read-only scripts are safe to repeat; for writing scripts check the file state (read-cover.js) before running again.
ct_run() {
  local key=$1 script=$2 args=${3:-'{}'} code try res out
  ct_ensure_port || return 1
  code=$(node $CT_DIR/render.mjs $CT_DIR/$script "$(node -e 'const a=JSON.parse(process.argv[1]);a.key=process.argv[2];console.log(JSON.stringify(a))' "$args" "$key")")
  for try in 1 2 3; do
    res=$(node $CT_DIR/cdp.mjs $key eval "$code" 2>&1 | tail -1)
    out=$(print -r -- "$res" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const v=JSON.parse(s);console.log(typeof v==="string"?v:JSON.stringify(v))}catch(e){}})')
    [[ $out == \{* ]] && { print -r -- "$out"; return 0; }
    sleep 4
  done
  echo "no answer: $res" >&2; return 1
}

# ct_open <figma url> <fileKey>   open the file in Figma Desktop and wait until its tab exists.
ct_open() {
  ct_ensure_port || return 1
  # a Figma that is not in front can ignore the open request: bring it to the front first
  osascript -e 'tell application "Figma" to activate' >/dev/null 2>&1; sleep 1
  open -a Figma "$1"
  local i; for i in {1..15}; do sleep 2; curl -s -m 3 localhost:9222/json | grep -q "$2" && break; done
  # a file that is already open is not always brought to the front by `open -a`: do it over the debug port
  node $CT_DIR/cdp.mjs $2 eval "1" >/dev/null 2>&1; sleep 3
}

# ct_btn <fileKey> <label> <js condition on r>   print "x y" of a visible button, or "none".
ct_btn() {
  node $CT_DIR/cdp.mjs $1 eval "(() => { for (const el of document.querySelectorAll('button,[role=tab],[role=button]')) { const t = (el.textContent || '').trim(), l = el.getAttribute('aria-label') || ''; const r = el.getBoundingClientRect(); if (r.width > 0 && r.y > 0 && (t === '$2' || l === '$2') && ($3)) return Math.round(r.x + r.width / 2) + ' ' + Math.round(r.y + r.height / 2); } return 'none'; })()" | tr -d '"'
}

# ct_enable_library <fileKey> "<library name>"   Assets panel > Add more libraries > search > Add to file.
# Drives the Figma UI by DOM lookup; if a step reports "none", take a screenshot (cdp.mjs shot) and look.
ct_enable_library() {
  local K=$1 name=$2 P B RM X i
  for i in {1..6}; do [[ $(ct_btn $K Assets "r.x < 100") != none ]] && break; sleep 2; done
  X=$(ct_btn $K Close "r.x > 1200 && r.y < 150"); [[ $X != none ]] && { node $CT_DIR/cdp.mjs $K click ${=X} >/dev/null; sleep 2; }
  P=$(ct_btn $K "Add more libraries" true)
  if [[ $P == none ]]; then X=$(ct_btn $K Assets "r.x < 100"); node $CT_DIR/cdp.mjs $K click ${=X} >/dev/null; sleep 2; P=$(ct_btn $K "Add more libraries" true); fi
  [[ $P == none ]] && { echo "no 'Add more libraries' button"; return 1; }
  node $CT_DIR/cdp.mjs $K click ${=P} >/dev/null; sleep 3
  node $CT_DIR/cdp.mjs $K type "$name" >/dev/null
  B=none; RM=none
  for i in {1..10}; do sleep 2; B=$(ct_btn $K "Add to file" "r.x > 900"); RM=$(ct_btn $K Remove "r.x > 900"); [[ $B != none || $RM != none ]] && break; done
  if [[ $B != none ]]; then node $CT_DIR/cdp.mjs $K click ${=B} >/dev/null; sleep 4; RM=$(ct_btn $K Remove "r.x > 900"); fi
  [[ $RM == none ]] && { echo "library not enabled"; return 1; }
  X=$(ct_btn $K Close "r.x > 1200 && r.y < 150"); [[ $X != none ]] && node $CT_DIR/cdp.mjs $K click ${=X} >/dev/null
  sleep 2; echo "library enabled: $name"
}

# ct_clipboard_file   print the file key stored in the Figma clipboard data ("NONE" when there is none).
# Check it right before every paste: another device can replace the clipboard.
ct_clipboard_file() {
  pbpaste -Prefer public.html | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const m=s.match(/figmeta\)([A-Za-z0-9+\/=]+)/);console.log(m?JSON.parse(Buffer.from(m[1],"base64")).fileKey:"NONE")})'
}
