import {Component} from '@angular/core';
declare const jQuery: any; // TODO: find a better way to access DOM elements

@Component({
    //TODO: discuss prefix
    selector: 'oblique-top-control',
    template: `<a href="" role="button" class="top-control" (click)="scrollTop($event)">
					<span class="control-icon fa fa-angle-up"></span>
					<span class="control-label">{{'i18n.topControl.backToTop' | translate}}</span>
				</a>`
})
export class TopControlComponent {
    public scrollTop(event) {
        event.preventDefault();
        const $body = jQuery('html, body');
        $body.animate({
            scrollTop: $body.offset().top
        }, 300);
    }
}
