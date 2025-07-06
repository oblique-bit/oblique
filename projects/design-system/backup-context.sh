#!/bin/bash

# Backup script for CONTEXT_NOTES.md
# This script copies the context notes to multiple backup locations with timestamp

SOURCE_FILE="/Users/davorradisic/vc git repo bit/oblique/projects/design-system/CONTEXT_NOTES.md"
BACKUP_DIR1="/Users/davorradisic/Library/CloudStorage/OneDrive-SchweizerischeEidgenossenschaft/Attachments/Oblique Docu"
BACKUP_DIR2="/Users/davorradisic/Documents/BIT/Oblique"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create backup directories if they don't exist
mkdir -p "$BACKUP_DIR1"
mkdir -p "$BACKUP_DIR2"

# Copy the file with timestamp to both locations
if [ -f "$SOURCE_FILE" ]; then
    # Backup to OneDrive
    cp "$SOURCE_FILE" "$BACKUP_DIR1/CONTEXT_NOTES_$TIMESTAMP.md"
    echo "$(date): Backup created at $BACKUP_DIR1/CONTEXT_NOTES_$TIMESTAMP.md"
    
    # Backup to local Documents
    cp "$SOURCE_FILE" "$BACKUP_DIR2/CONTEXT_NOTES_$TIMESTAMP.md"
    echo "$(date): Backup created at $BACKUP_DIR2/CONTEXT_NOTES_$TIMESTAMP.md"
    
    # Keep only the last 10 backups in each location to avoid filling disk
    cd "$BACKUP_DIR1"
    ls -t CONTEXT_NOTES_*.md 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null
    echo "$(date): Cleaned up old backups in OneDrive, keeping last 10"
    
    cd "$BACKUP_DIR2"
    ls -t CONTEXT_NOTES_*.md 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null
    echo "$(date): Cleaned up old backups in Documents, keeping last 10"
    
    echo "$(date): Backup completed successfully to both locations"
else
    echo "$(date): Source file not found: $SOURCE_FILE"
fi
