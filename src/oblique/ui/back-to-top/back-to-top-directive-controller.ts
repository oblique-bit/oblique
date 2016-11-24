export class BackToTopDirectiveController {
    public scrollTop() {
        let $body = $('html, body');
        $body.animate({
            scrollTop: $body.offset().top
        }, 300);
    }
}