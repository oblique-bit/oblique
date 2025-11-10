import {CommonModule, NgComponentOutlet} from '@angular/common';
import {Component, type OnInit, inject} from '@angular/core';
import {Router} from '@angular/router';
import type {ComponentPage} from './component-page';
import {getComponentPageComponent} from './component-page.mapper';

@Component({
	selector: 'app-component-page',
	imports: [CommonModule, NgComponentOutlet],
	templateUrl: './component-page.component.html',
	styleUrl: './component-page.component.scss',
	host: {class: 'content-page'},
})
export class ComponentPageComponent implements OnInit {
	public componentToLoad: ComponentPage;
	private readonly router = inject(Router);

	ngOnInit(): void {
		const componentName = this.router.url.split('?')[0].split('/').pop() ?? '';
		this.componentToLoad = getComponentPageComponent(componentName);
	}
}
