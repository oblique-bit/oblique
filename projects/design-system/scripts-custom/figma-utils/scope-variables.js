/**
 * scope-variables.js — set Figma variable scopes and hiddenFromPublishing in bulk
 * ----------------------------------------------------------------------------
 * WHY: A variable's scopes array controls which property pickers list it as a
 * suggestion (fill, stroke, text-fill, effect, corner-radius, etc.). Empty
 * scopes is NOT the same as "hidden" — Figma treats it as "no restriction"
 * and lists the variable in every applicable picker. To actually hide a
 * variable from a picker, its scopes array must be present and MUST NOT
 * include a scope that maps to that picker. To hide it from library
 * consumers, set hiddenFromPublishing = true and re-publish the library.
 *
 * This script scans every local variable, matches by name / collection /
 * type, reports the current scopes and hiddenFromPublishing flags, and (in
 * apply mode) rewrites both. Dry-run by default.
 *
 * HOW TO RUN — two equivalent ways:
 *
 *  A) Via the figma-console MCP (ask Claude):
 *     "run scripts-custom/figma-utils/scope-variables.js via figma_execute"
 *     Claude pastes the body into figma_execute and returns the report.
 *
 *  B) By hand in Figma: Plugins -> Development -> FigCli console. Paste and
 *     run — the IIFE logs its report with console.log.
 *
 * CONFIGURE the CONFIG block below, then run. Start with mode 'scan'.
 * ----------------------------------------------------------------------------
 *
 * VALID SCOPES (Plugin API — VariableScope enum):
 *
 *  Super-scopes
 *    ALL_SCOPES       → every picker for the variable's type
 *    ALL_FILLS        → FRAME_FILL + SHAPE_FILL + TEXT_FILL (color only)
 *
 *  Color-only
 *    FRAME_FILL       → frame fill picker
 *    SHAPE_FILL       → shape fill picker
 *    TEXT_FILL        → text fill picker
 *    STROKE_COLOR     → stroke picker
 *    EFFECT_COLOR     → shadow / effect color picker
 *
 *  Number-only
 *    CORNER_RADIUS, WIDTH_HEIGHT, GAP, STROKE_FLOAT, EFFECT_FLOAT, OPACITY,
 *    FONT_WEIGHT, FONT_SIZE, LINE_HEIGHT, LETTER_SPACING, PARAGRAPH_SPACING,
 *    PARAGRAPH_INDENT
 *
 *  String-only
 *    FONT_FAMILY, FONT_STYLE, TEXT_CONTENT
 *
 * Figma rejects a scope that does not match the variable's resolvedType with
 * "Invalid scope for this variable type".
 * ----------------------------------------------------------------------------
 */

(async () => {
	// ====================== CONFIG — edit this block ==========================
	const CONFIG = {
		// 'scan'  -> report only, change nothing (ALWAYS run this first)
		// 'apply' -> rewrite scopes and hiddenFromPublishing on matched vars
		mode: 'scan',

		// Match by name prefix. Array of strings. Any prefix matches. Empty = all.
		// Example: ['ob/s1/color/', 'ob/s2/color/']
		namePrefixes: [],

		// Match by variable-collection name. Empty = any collection.
		// Example: ['s1-lightness', 's2-emphasis']
		collectionNames: [],

		// Match by resolvedType. Empty = any type.
		// Values: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'
		resolvedTypes: [],

		// Match by CURRENT scopes. Empty = any current scopes.
		// The filter matches if the variable's scopes array set-equals ANY of the
		// listed arrays. Useful to only touch variables that still carry an
		// outdated scope (e.g. ['ALL_SCOPES']).
		currentScopes: [],

		// The scopes array to write on every matched variable. null = don't change.
		// Empty array [] resets to "no restriction" (i.e. show everywhere for type).
		// Example: ['EFFECT_COLOR'] — hides color vars from fill/stroke/text pickers.
		setScopes: null,

		// The hiddenFromPublishing flag to write. null = don't change.
		// true  -> variable disappears from Libraries tab in consuming files after
		//          the source library is re-published.
		// false -> variable appears in Libraries tab if its scopes allow it.
		setHiddenFromPublishing: null,
	};
	// ==========================================================================

	// --- collect and index ---------------------------------------------------
	const cols = await figma.variables.getLocalVariableCollectionsAsync();
	const colById = new Map(cols.map((c) => [c.id, c]));
	const vars = await figma.variables.getLocalVariablesAsync();

	// --- filter --------------------------------------------------------------
	const scopesEqual = (a, b) => {
		if (a.length !== b.length) return false;
		const sa = [...a].sort();
		const sb = [...b].sort();
		return sa.every((v, i) => v === sb[i]);
	};

	const matches = (v) => {
		if (CONFIG.namePrefixes.length && !CONFIG.namePrefixes.some((p) => v.name.startsWith(p))) return false;
		if (CONFIG.resolvedTypes.length && !CONFIG.resolvedTypes.includes(v.resolvedType)) return false;
		if (CONFIG.collectionNames.length) {
			const col = colById.get(v.variableCollectionId);
			if (!col || !CONFIG.collectionNames.includes(col.name)) return false;
		}
		if (CONFIG.currentScopes.length && !CONFIG.currentScopes.some((s) => scopesEqual(v.scopes, s))) return false;
		return true;
	};

	const matched = vars.filter(matches);

	// --- report --------------------------------------------------------------
	const report = { totalLocal: vars.length, matched: matched.length, mode: CONFIG.mode };

	const byScopes = {};
	const byHidden = { true: 0, false: 0 };
	for (const v of matched) {
		const key = JSON.stringify([...v.scopes].sort());
		byScopes[key] = (byScopes[key] || 0) + 1;
		byHidden[String(!!v.hiddenFromPublishing)] += 1;
	}
	report.currentScopes = byScopes;
	report.currentHiddenFromPublishing = byHidden;

	if (matched.length && matched.length <= 20) {
		report.matchedNames = matched.map((v) => v.name);
	} else if (matched.length) {
		report.matchedNamesSample = matched.slice(0, 10).map((v) => v.name);
	}

	// --- apply ---------------------------------------------------------------
	if (CONFIG.mode === 'apply' && matched.length) {
		const wantScopes = CONFIG.setScopes;
		const wantHidden = CONFIG.setHiddenFromPublishing;
		const errs = [];
		let touchedScopes = 0;
		let touchedHidden = 0;
		for (const v of matched) {
			if (wantScopes !== null) {
				try { v.scopes = wantScopes; touchedScopes++; } catch (e) {
					errs.push({ name: v.name, field: 'scopes', error: e.message });
				}
			}
			if (wantHidden !== null && v.hiddenFromPublishing !== wantHidden) {
				try { v.hiddenFromPublishing = wantHidden; touchedHidden++; } catch (e) {
					errs.push({ name: v.name, field: 'hiddenFromPublishing', error: e.message });
				}
			}
		}
		report.applied = { touchedScopes, touchedHidden };
		if (errs.length) report.errors = errs;
	} else if (CONFIG.mode === 'apply') {
		report.applied = { touchedScopes: 0, touchedHidden: 0, note: 'no variables matched' };
	}

	console.log(JSON.stringify(report, null, 2));
	return report;
})();
