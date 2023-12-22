import {Component, EventEmitter, HostBinding, Input, OnChanges, Output, ViewEncapsulation} from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ObButtonModule} from '../../../button/button.module';
import {ObNavigationLink} from '../navigation-link.model';
import {TranslateModule} from '@ngx-translate/core';

@Component({
	selector: 'ob-master-layout-navigation-go-to-children',
	templateUrl: './master-layout-navigation-go-to-children.component.html',
	styleUrls: ['./master-layout-navigation-go-to-children.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-master-layout-navigation-go-to-children'},
	standalone: true,
	imports: [MatButtonModule, MatIconModule, ObButtonModule, TranslateModule]
})
export class ObMasterLayoutNavigationGoToChildrenComponent implements OnChanges {
	@HostBinding('class.hide') hide = false;
	@Input() disableRipple = false;
	@Input() isCurrentParent = false;
	@Input() link: ObNavigationLink = new ObNavigationLink();
	@Input() showChildren = true;
	@Output() readonly changeCurrentParent: EventEmitter<ObNavigationLink> = new EventEmitter<ObNavigationLink>();

	goToChildren(): void {
		this.changeCurrentParent.emit(this.link);
	}

	ngOnChanges(): void {
		this.hide = this.isCurrentParent || !this.link.children || !this.showChildren;
	}
}
