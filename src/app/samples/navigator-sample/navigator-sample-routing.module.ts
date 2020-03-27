import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {
	NavigatorSampleComponent,
	ChildState1Component,
	ChildState11Component,
	ChildState12Component,
	ChildState111Component,
	ChildState112Component
} from './navigator-sample.component';

const navigatorSampleRoutes: Routes = [
	{
		path: 'navigator',
		component: NavigatorSampleComponent,
		children: [
			{
				path: '',
				children: [
					{
						path: '1',
						component: ChildState1Component,
						children: [
							{
								path: '1',
								component: ChildState11Component,
								children: [
									{
										path: '1',
										component: ChildState111Component
									},
									{
										path: '2',
										component: ChildState112Component,
										data: {
											navigator: {
												up: ['navigator']
											}
										}
									}
								]
							},
							{
								path: '2',
								component: ChildState12Component
							}
						]
					}
				]
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(navigatorSampleRoutes)],
	exports: [RouterModule]
})
export class NavigatorSampleRoutingModule {}
