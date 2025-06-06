(function () {
	if (hasMissingFeatures()) {
		document.querySelector('.ob-compatibility').removeAttribute('hidden');
	}

	function hasMissingFeatures() {
		try {
			const {style} = document.createElement('div');
			return (
				!window.localStorage ||
				style.flex === undefined ||
				style.grid === undefined ||
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
