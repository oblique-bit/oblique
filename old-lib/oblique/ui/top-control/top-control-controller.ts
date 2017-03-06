/**
 * Controller for the TopControl component.
 *
 * @see TopControlComponent
 */
export class TopControlController {
	public scrollTop() {
		let $body = $('html, body');
		$body.animate({
			scrollTop: $body.offset().top
		}, 300);
	}
}