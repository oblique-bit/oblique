(function () {
	const {style} = document.createElement('div');
	if (
		// prettier-ignore
		!window.localStorage
		|| style.flex === undefined
		|| style.grid === undefined
		|| !''.startsWith
		|| ![].includes
		|| !Object.values
		|| !document.querySelectorAll('c').forEach
	) {
		document.querySelector('.ob-compatibility').removeAttribute('hidden');
	}
})();
