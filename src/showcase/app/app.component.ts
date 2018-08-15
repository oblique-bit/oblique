import {Component} from '@angular/core';
import {ORFooterLink} from '../../lib/ng/master-layout/master-layout-footer.component';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	footerLinks: ORFooterLink[] = [
		{url: 'http://www.disclaimer.admin.ch', label: 'Legal', title: 'Terms and conditions'},
		{url: 'test', label: 'test'},
	];
}
