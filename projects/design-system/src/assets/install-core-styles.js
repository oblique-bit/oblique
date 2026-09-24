const obliqueCoreStyles = `__OBLIQUE_CORE_STYLES__`;

if (typeof document !== 'undefined') {
	const obliqueCoreSheet = new CSSStyleSheet();
	obliqueCoreSheet.replaceSync(obliqueCoreStyles);

	document.adoptedStyleSheets = [...document.adoptedStyleSheets, obliqueCoreSheet];
}
