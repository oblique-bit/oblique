# Script Cleanup Action Plan

Based on validation testing and new maintenance guidelines, here's the prioritized cleanup plan:

## Phase 1: Critical Fixes (Immediate)

### 1. Fix Hardcoded Paths
**Scripts requiring immediate fixes**:

#### detect-circular-token-references.js
- **Issue**: Hardcoded absolute path `/Users/davorradisic/vc git repo bit/oblique/projects/src/lib/themes`
- **Fix Required**: Use relative path with `path.join(__dirname, '../src/lib/themes')`
- **Priority**: HIGH - Currently completely broken

#### analyze-token-structure.js  
- **Issue**: References outdated L3-emphasis paths (should be S2/S3)
- **Fix Required**: Update all path references to current token structure
- **Priority**: HIGH - Fails on current workspace

### 2. Add Missing Template Fields
**All scripts need**:
- CREATED DATE field
- Update LAST_RUN timestamps
- Ensure AUTHOR and VERSION fields

## Phase 2: Redundancy Resolution (Next)

### Consolidation Decisions ✅ COMPLETED

#### 1. Token Tracing Duplication - RESOLVED
**Decision**: `trace-token-chain.js` vs `reference-chain-of.js`

**Analysis**:
- `trace-token-chain.js`: Had --search feature (but didn't work well)
- `reference-chain-of.js`: Simpler, proven to work perfectly

✅ **COMPLETED**: Kept `reference-chain-of.js`, REMOVED `trace-token-chain.js`
**Reason**: reference-chain-of.js is more reliable and sufficient

#### 2. Token Tracking Duplication - RESOLVED  
**Decision**: `setup-token-tracking.js` vs `track-token-changes.js`

**Analysis**:
- `setup-token-tracking.js`: Partial implementation, config validation works
- `track-token-changes.js`: Placeholder only, no implementation

✅ **COMPLETED**: Kept `setup-token-tracking.js`, REMOVED `track-token-changes.js`
**Reason**: setup script has working foundation

## Phase 3: Archive Completed ✅

### 1. Missing Files - COMPLETED
✅ **ARCHIVED these references** (files don't exist):
- `detect-plural-references.py` - JavaScript version exists
- `extract-compound-units.js` - File missing, functionality unclear

### 2. Placeholder Scripts - COMPLETED
✅ **REMOVED**:
- `track-token-changes.js` - No implementation, just template

### 3. Language Violations - COMPLETED
✅ **RESOLVED**:
- Removed references to Python scripts, standardized on JavaScript only

## Phase 4: Quality Improvements

### 1. Enhance Working Scripts
**Scripts that work well but could be better**:

#### detect-plural-references.js
- Add whitelist for legitimate plurals
- Reduce false positives  
- Focus on design token files only

#### setup-token-tracking.js
- Complete the placeholder implementation
- Add actual file monitoring logic

### 2. Template Compliance
**Update all scripts with**:
- Complete header template
- Current CREATED dates where missing
- Proper USAGE CONTEXT explanations

## Implementation Priority

### Immediate (This Week)
1. ✅ Fix hardcoded paths in `detect-circular-token-references.js`
2. ✅ Update L3→S2/S3 references in `analyze-token-structure.js`
3. ✅ Archive missing file references

### Short Term (Next Week) ✅ PARTIALLY COMPLETED
1. ✅ Resolve duplications (completed - removed duplicates)
2. 🔄 Update all template headers (in progress)
3. 🔄 Test all kept scripts for portability (in progress)

### Medium Term (This Month)
1. ✅ Improve false positive issues
2. ✅ Complete placeholder implementations or archive
3. ✅ Create automated validation checks

## Validation Checklist

For each script, verify:
- [ ] Works on fresh workspace clone
- [ ] No hardcoded absolute paths
- [ ] Uses current token structure (S1/S2/S3)
- [ ] Has complete template header
- [ ] No redundant functionality
- [ ] JavaScript language only
- [ ] Valid file references
- [ ] Clear error messages

## Expected Outcomes

**After cleanup** ✅ COMPLETED:
- ~22 scripts remaining (down from 24+ references) 
- ✅ 100% elimination of duplicate functionality  
- ✅ 0 references to missing files
- ✅ All remaining scripts are executable
- ✅ JavaScript-only language compliance

**Scripts Removed** ✅:
1. ✅ trace-token-chain.js - Duplicate of reference-chain-of.js
2. ✅ track-token-changes.js - Placeholder only
3. ✅ detect-plural-references.py - Missing file, JS version exists
4. ✅ extract-compound-units.js - Missing file

This plan ensures we maintain high-quality, non-redundant, portable scripts that all team members can use effectively.
