import {TextPageComponent} from './text-page.component';

export default [
	{path: '', component: TextPageComponent},
	{path: '**', redirectTo: '../invalid'},
];
