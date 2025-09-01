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
