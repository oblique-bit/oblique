// Export helpers
module.exports.register = function (Handlebars, options) {

	/**
	 * {{upperCase}}
	 * Transforms a string to uppercase
	 *
	 * Usage: {{upperCase "hello"}}{{this}}{{/upperCase}}
	 */
	Handlebars.registerHelper('upperCase', function (str) {
		return str.toUpperCase();
	});
};
