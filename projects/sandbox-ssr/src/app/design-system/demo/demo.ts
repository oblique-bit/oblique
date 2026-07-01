import {CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, PLATFORM_ID, inject} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

@Component({
	selector: 'ssr-demo',
	imports: [TranslateModule],
	templateUrl: './demo.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Demo {
	constructor() {
		void this.lazyLoadWebComponents();
	}

	private async lazyLoadWebComponents(): Promise<void> {
		if (isPlatformBrowser(inject(PLATFORM_ID))) {
			await import('../../../../../../dist/design-system/lib/demo');
		}
	}
}
