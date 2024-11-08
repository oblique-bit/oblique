import {Type} from '@angular/core';

export interface ComponentPage {
	title: string;
	component: Type<any>;
}
