import {CommonModule, NgComponentOutlet} from '@angular/common';
import {Component, OnInit, inject} from '@angular/core';
import {Router} from '@angular/router';
import {ComponentPage} from './component-page';
import {ComponentPageMapper} from './component-page.mapper';

@Component({
	selector: 'app-component-page',
	templateUrl: './component-page.component.html',
	styleUrls: ['./component-page.component.scss'],
	standalone: true,
	imports: [CommonModule, NgComponentOutlet]
})
export class ComponentPageComponent implements OnInit {
	public componentToLoad: ComponentPage;
	private readonly router = inject(Router);

	ngOnInit(): void {
		const componentName = this.router.url.split('?')[0].split('/').pop() ?? '';
		this.componentToLoad = ComponentPageMapper.getComponentPageComponent(componentName);
	}
}
