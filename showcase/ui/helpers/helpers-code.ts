/**
 * Handlebars - Code helpers
 */
module.exports.register = function (Handlebars) {

	/**
	 * `markdown` - renders Markdown content as inline HTML inline
	 */
	Handlebars.registerHelper('md-inline', require('helper-markdown')({}));

	/**
	 * `md` - converts and includes a Markdown file as HTML
	 *
	 * Uses sync requests to load system files.
	 *
	 * @param  {String} file      The filepath of the Markdown resource to convert
	 */
	Handlebars.registerHelper('md', require('helper-md').sync);
};
