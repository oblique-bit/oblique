# Setting Up File Protection

To enable the pre-commit hook that prevents accidental modification of protected files:

```bash
# Navigate to the design-system directory
cd /path/to/oblique/projects/design-system

# Copy the pre-commit hook to the Git hooks directory
cp pre-commit ../../.git/hooks/
chmod +x ../../.git/hooks/pre-commit

# Verify the hook is installed
ls -la ../../.git/hooks/pre-commit
```

After installing, the hook will prevent commits that modify:
- package.json
- ng-package.json
- tsconfig.lib.json
- tsconfig.lib.prod.json
- tsconfig.spec.json

You can manually check for modifications to protected files anytime by running:

```bash
./scripts-custom/check-protected-files.sh
```

For more information, read PROTECTED_FILES.md
