import {ChangeDetectionStrategy, Component, ViewEncapsulation, computed, input, output} from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ObButtonModule} from '../../../button/button.module';
import {ObNavigationLink} from '../navigation-link.model';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
	selector: 'ob-master-layout-navigation-go-to-children',
	imports: [MatButtonModule, MatIconModule, ObButtonModule, MatTooltipModule, TranslatePipe],
	templateUrl: './master-layout-navigation-go-to-children.component.html',
	styleUrls: ['./master-layout-navigation-go-to-children.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.hide]': 'hide()',
		class: 'ob-master-layout-navigation-go-to-children',
	},
})
export class ObMasterLayoutNavigationGoToChildrenComponent {
	readonly hide = computed(() => this.isCurrentParent() || !this.link().children || !this.showChildren());
	readonly disableRipple = input(false);
	readonly isCurrentParent = input(false);
	readonly isChildWithoutUrl = input(false);
	readonly link = input<ObNavigationLink>(new ObNavigationLink());
	readonly showChildren = input(true);
	readonly changeCurrentParent = output<ObNavigationLink>();

	goToChildren(): void {
		this.changeCurrentParent.emit(this.link());
	}
}
