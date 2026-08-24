import {
	ChangeDetectionStrategy,
	Component,
	Signal,
	TemplateRef,
	ViewEncapsulation,
	contentChildren,
	inject,
	input,
} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map} from 'rxjs/operators';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';

@Component({
	selector: 'ob-master-layout-footer',
	standalone: false,
	templateUrl: './master-layout-footer.component.html',
	styleUrls: ['./master-layout-footer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-master-layout-footer'},
})
export class ObMasterLayoutFooterComponent {
	readonly templates = contentChildren<TemplateRef<HTMLLinkElement>>('obFooterLink');
	readonly version = input<string>();
	readonly isCustom: Signal<boolean>;

	private readonly masterLayout = inject(ObMasterLayoutService);
	private readonly config = inject(ObMasterLayoutConfig);

	constructor() {
		this.isCustom = toSignal(
			this.masterLayout.footer.configEvents$.pipe(
				filter((event: ObIMasterLayoutEvent) => event.name === ObEMasterLayoutEventValues.FOOTER_IS_CUSTOM),
				map(event => !!event.value)
			),
			{
				initialValue: this.config.footer.isCustom,
			}
		);
	}
}
