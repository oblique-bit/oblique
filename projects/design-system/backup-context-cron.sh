#!/bin/bash

# Wrapper script for cron job to backup CONTEXT_NOTES.md
# This ensures proper environment for the backup script

# Set PATH for cron environment
export PATH="/usr/local/bin:/usr/bin:/bin"

# Navigate to the project directory
cd "/Users/davorradisic/vc git repo bit/oblique/projects/design-system"

# Run the backup script
./backup-context.sh >> "/Users/davorradisic/Documents/BIT/Oblique/backup.log" 2>&1
