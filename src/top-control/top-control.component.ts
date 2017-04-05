import {Component} from '@angular/core';
import * as $ from 'jquery';

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
        const $body = $('html, body');
        $body.animate({
            scrollTop: $body.offset().top
        }, 300);
    }
}
