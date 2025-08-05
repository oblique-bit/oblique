#!/bin/bash

# Token Chain Helper
# Usage: ./scripts-custom/reference-chain-of.sh "ob.h.button.color.fg.primary.disabled"
# Usage: ./scripts-custom/reference-chain-of.sh --figma
# Or add alias: alias "reference chain of"="./scripts-custom/reference-chain-of.sh"

if [ $# -eq 0 ]; then
    echo "Usage: reference chain of <token-name>"
    echo "       reference chain of --figma"
    echo "Example: reference chain of \"ob.h.button.color.fg.primary.disabled\""
    echo "Example: reference chain of --figma"
    exit 1
fi

# Check if first argument is --figma
if [ "$1" = "--figma" ]; then
    node "$(dirname "$0")/trace-token-chain.js" --figma
else
    # Combine all arguments into a single token name (in case spaces in quotes)
    TOKEN_NAME="$*"
    # Run the token chain tracer
    node "$(dirname "$0")/trace-token-chain.js" "$TOKEN_NAME"
fi
