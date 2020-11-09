/* eslint-disable */
(function() {
	'use strict';

	var style = document.createElement('div').style;
	if (
		!window.localStorage
		|| style.flex == undefined
		// || style.grid == undefined
		// || !''.startsWith
		// || ![].includes
		// || !Object.values
		// || !document.querySelectorAll('c').forEach
	) {
		document.querySelector('.ob-compatibility').removeAttribute('hidden');
	}

	if (window.MSInputMethodContext) {
		console.warn('Deprecated browser. Please note that IE 11 is deprecated and will not be supported anymore starting from Oblique 7');
	}
})();
