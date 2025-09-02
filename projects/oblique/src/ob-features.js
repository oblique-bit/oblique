(function () {
	if (hasMissingFeatures()) {
		document.querySelector('.ob-compatibility').removeAttribute('hidden');
	}

	function hasMissingFeatures() {
		try {
			return (
				!window.localStorage ||
				!CSS.supports('display: flex') ||
				!CSS.supports('display: grid') ||
				!CSS.supports('height', '100dvh') ||
				!''.startsWith ||
				![].includes ||
				!Object.values ||
				!document.querySelectorAll('c').forEach
			);
		} catch (error) {
			return true;
		}
	}
})();
