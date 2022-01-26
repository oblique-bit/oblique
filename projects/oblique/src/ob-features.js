(function () {
	'use strict';

	var style = document.createElement('div').style;
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
